import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: '缺少 Stripe 签名 (Missing Stripe signature)' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    // 验证 webhook 签名 (Verify webhook signature)
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook 签名验证失败 (Webhook signature verification failed)' },
      { status: 400 }
    )
  }

  try {
    // 处理不同的事件类型 (Handle different event types)
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionCreatedOrUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: '处理 webhook 失败 (Failed to process webhook)' },
      { status: 500 }
    )
  }
}

// 处理订阅创建或更新 (Handle subscription created or updated)
async function handleSubscriptionCreatedOrUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId

  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }

  // 更新用户会员状态 (Update user membership status)
  const membershipExpiresAt = new Date(subscription.current_period_end * 1000)

  await prisma.user.update({
    where: { id: userId },
    data: {
      isMember: subscription.status === 'active',
      membershipExpiresAt,
    },
  })

  console.log(`Updated membership for user ${userId}: ${subscription.status}`)
}

// 处理订阅删除 (Handle subscription deleted)
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId

  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }

  // 取消用户会员状态 (Cancel user membership status)
  await prisma.user.update({
    where: { id: userId },
    data: {
      isMember: false,
      membershipExpiresAt: null,
    },
  })

  console.log(`Canceled membership for user ${userId}`)
}

// 处理结账完成 (Handle checkout session completed)
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId

  if (!userId) {
    console.error('No userId in session metadata')
    return
  }

  // 获取订阅信息 (Get subscription information)
  const subscriptionId = session.subscription as string
  
  if (!subscriptionId) {
    console.error('No subscription ID in session')
    return
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // 创建交易记录 (Create transaction record)
  // 注意：会员购买 amount 有值，tokens = 0
  // (Note: membership_purchase has amount, tokens = 0)
  await prisma.transaction.create({
    data: {
      userId,
      type: 'membership_purchase',
      amount: (session.amount_total || 0) / 100, // Stripe 使用分为单位 (Stripe uses cents)
      tokens: 0, // 会员购买不赠送代币 (Membership purchase does not grant tokens)
      status: 'completed',
      stripeSessionId: session.id,
      stripeSubscriptionId: subscriptionId,
      metadata: {
        interval: session.metadata?.interval,
        subscriptionStatus: subscription.status,
      },
    },
  })

  console.log(`Created transaction record for user ${userId}`)
}
