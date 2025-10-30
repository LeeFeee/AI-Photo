import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

// 禁用 body 解析，因为我们需要原始 body 来验证 webhook 签名
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    console.error('缺少 Stripe 签名')
    return NextResponse.json(
      { message: '缺少 Stripe 签名' },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET 环境变量未设置')
    return NextResponse.json(
      { message: '服务器配置错误' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    // 验证 webhook 签名
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook 签名验证失败:', error)
    return NextResponse.json(
      { message: 'Webhook 签名验证失败' },
      { status: 400 }
    )
  }

  console.log(`收到 Stripe 事件: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      default:
        console.log(`未处理的事件类型: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('处理 webhook 事件失败:', error)
    return NextResponse.json(
      { message: '处理 webhook 事件失败' },
      { status: 500 }
    )
  }
}

// 处理 checkout.session.completed 事件
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('处理 checkout.session.completed:', session.id)

  const transactionId = session.metadata?.transactionId
  if (!transactionId) {
    console.error('Session 元数据中缺少 transactionId:', session.id)
    return
  }

  // 使用 Prisma 事务确保数据一致性
  await prisma.$transaction(async (tx) => {
    // 查找交易记录
    const transaction = await tx.transaction.findUnique({
      where: { id: transactionId },
      include: { user: true },
    })

    if (!transaction) {
      console.error('未找到交易记录:', transactionId)
      return
    }

    // 检查交易是否已处理（幂等性）
    if (transaction.status === 'completed') {
      console.log('交易已处理，跳过:', transactionId)
      return
    }

    // 更新交易状态
    await tx.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'completed',
        stripePaymentId: session.payment_intent as string,
      },
    })

    // 增加用户代币余额
    await tx.user.update({
      where: { id: transaction.userId },
      data: {
        tokenBalance: {
          increment: transaction.tokens,
        },
      },
    })

    console.log(
      `用户 ${transaction.userId} 购买成功，增加 ${transaction.tokens} 代币`
    )
  })
}

// 处理 payment_intent.succeeded 事件
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('处理 payment_intent.succeeded:', paymentIntent.id)
  
  // 查找关联的交易记录
  const transaction = await prisma.transaction.findFirst({
    where: {
      stripePaymentId: paymentIntent.id,
    },
  })

  if (!transaction) {
    console.log('未找到关联的交易记录:', paymentIntent.id)
    return
  }

  // 如果交易已完成，跳过
  if (transaction.status === 'completed') {
    console.log('交易已完成，跳过:', transaction.id)
    return
  }

  console.log('支付成功事件已记录:', paymentIntent.id)
}

// 处理 payment_intent.payment_failed 事件
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('处理 payment_intent.payment_failed:', paymentIntent.id)

  // 查找关联的交易记录
  const transaction = await prisma.transaction.findFirst({
    where: {
      stripePaymentId: paymentIntent.id,
    },
  })

  if (!transaction) {
    console.log('未找到关联的交易记录:', paymentIntent.id)
    return
  }

  // 更新交易状态为失败
  await prisma.transaction.update({
    where: { id: transaction.id },
    data: {
      status: 'failed',
    },
  })

  console.log('交易标记为失败:', transaction.id)
}
