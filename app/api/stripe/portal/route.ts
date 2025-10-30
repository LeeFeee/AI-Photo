import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: '缺少用户 ID (Missing user ID)' },
        { status: 400 }
      )
    }

    // 查找用户 (Find user)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        { error: '未找到 Stripe 客户 (Stripe customer not found)' },
        { status: 404 }
      )
    }

    // 创建客户门户会话 (Create customer portal session)
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: '创建客户门户会话失败 (Failed to create portal session)' },
      { status: 500 }
    )
  }
}
