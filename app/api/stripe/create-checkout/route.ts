import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getPackageById, getTotalTokens } from '@/lib/token-packages'

export async function POST(request: NextRequest) {
  try {
    const { packageId } = await request.json()

    if (!packageId) {
      return NextResponse.json(
        { message: '缺少套餐 ID' },
        { status: 400 }
      )
    }

    // 获取套餐信息
    const pkg = getPackageById(packageId)
    if (!pkg) {
      return NextResponse.json(
        { message: '无效的套餐 ID' },
        { status: 400 }
      )
    }

    // TODO: 从会话中获取用户 ID
    // 目前使用临时用户 ID 用于演示
    // 在实际应用中，需要实现身份验证
    const userId = 'demo-user'

    // 确保用户存在
    let user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      // 创建演示用户
      user = await prisma.user.create({
        data: {
          id: userId,
          email: 'demo@example.com',
          name: '演示用户',
        },
      })
    }

    const totalTokens = getTotalTokens(pkg)

    // 创建待处理的交易记录
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'token_purchase',
        amount: pkg.price,
        tokens: totalTokens,
        status: 'pending',
        metadata: JSON.stringify({
          packageId: pkg.id,
          packageName: pkg.name,
          baseTokens: pkg.tokens,
          bonusTokens: pkg.bonus || 0,
        }),
      },
    })

    // 创建 Stripe Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cny',
            product_data: {
              name: pkg.name,
              description: `${pkg.tokens} 代币${pkg.bonus ? ` + ${pkg.bonus} 赠送` : ''}`,
            },
            unit_amount: pkg.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing/tokens?canceled=true`,
      metadata: {
        transactionId: transaction.id,
        userId: user.id,
        packageId: pkg.id,
        tokens: totalTokens.toString(),
      },
    })

    // 更新交易记录，关联 Stripe Session ID
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        stripeSessionId: session.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('创建 Stripe Checkout Session 失败:', error)
    return NextResponse.json(
      { message: '创建支付会话失败，请稍后重试' },
      { status: 500 }
    )
  }
}
