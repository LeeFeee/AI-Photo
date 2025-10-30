import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

// Initialize Stripe with API version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// 会员订阅价格配置 (Membership subscription price configuration)
// 在 Stripe Dashboard 创建这些价格 (Create these prices in Stripe Dashboard)
export const MEMBERSHIP_PRICES = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID || '',
  yearly: process.env.STRIPE_YEARLY_PRICE_ID || '',
} as const

export type MembershipInterval = keyof typeof MEMBERSHIP_PRICES
