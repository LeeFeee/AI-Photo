import { NextRequest, NextResponse } from 'next/server'
import { stripe, MEMBERSHIP_PRICES, MembershipInterval } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, interval, email } = body

    // 验证必需参数 (Validate required parameters)
    if (!userId || !interval || !email) {
      return NextResponse.json(
        { error: '缺少必需参数 (Missing required parameters)' },
        { status: 400 }
      )
    }

    // 验证订阅周期 (Validate subscription interval)
    if (!['monthly', 'yearly'].includes(interval)) {
      return NextResponse.json(
        { error: '无效的订阅周期 (Invalid subscription interval)' },
        { status: 400 }
      )
    }

    const priceId = MEMBERSHIP_PRICES[interval as MembershipInterval]
    
    if (!priceId) {
      return NextResponse.json(
        { error: '价格配置错误 (Price configuration error)' },
        { status: 500 }
      )
    }

    // 查找或创建用户 (Find or create user)
    let user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email,
        },
      })
    }

    // 创建或获取 Stripe 客户 (Create or get Stripe customer)
    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      // 更新用户的 Stripe 客户 ID (Update user's Stripe customer ID)
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    // 创建 Checkout Session (Create Checkout Session)
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing/membership?canceled=true`,
      metadata: {
        userId: user.id,
        interval,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: '创建支付会话失败 (Failed to create checkout session)' },
      { status: 500 }
    )
  }
}
