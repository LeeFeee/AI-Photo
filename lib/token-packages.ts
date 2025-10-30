// 代币套餐配置
// Token package configuration

export interface TokenPackage {
  id: string
  name: string // 套餐名称
  tokens: number // 代币数量
  price: number // 价格（分）
  priceDisplay: string // 显示价格
  stripePriceId: string // Stripe Price ID（需要在 Stripe Dashboard 中创建）
  popular?: boolean // 是否为热门套餐
  bonus?: number // 额外赠送的代币
}

// 代币套餐列表
// 注意：stripePriceId 需要在 Stripe Dashboard 中创建对应的产品和价格
// 测试模式和生产模式需要使用不同的 Price ID
export const TOKEN_PACKAGES: TokenPackage[] = [
  {
    id: 'starter',
    name: '入门套餐',
    tokens: 100,
    price: 1000, // ¥10.00（以分为单位）
    priceDisplay: '¥10',
    stripePriceId: process.env.STRIPE_PRICE_ID_STARTER || 'price_starter_test',
  },
  {
    id: 'basic',
    name: '基础套餐',
    tokens: 500,
    price: 4500, // ¥45.00
    priceDisplay: '¥45',
    stripePriceId: process.env.STRIPE_PRICE_ID_BASIC || 'price_basic_test',
    bonus: 50, // 额外赠送 50 代币
    popular: true,
  },
  {
    id: 'pro',
    name: '专业套餐',
    tokens: 1000,
    price: 8000, // ¥80.00
    priceDisplay: '¥80',
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO || 'price_pro_test',
    bonus: 200, // 额外赠送 200 代币
  },
  {
    id: 'enterprise',
    name: '企业套餐',
    tokens: 5000,
    price: 35000, // ¥350.00
    priceDisplay: '¥350',
    stripePriceId: process.env.STRIPE_PRICE_ID_ENTERPRISE || 'price_enterprise_test',
    bonus: 1500, // 额外赠送 1500 代币
  },
]

// 根据套餐 ID 获取套餐信息
export function getPackageById(packageId: string): TokenPackage | undefined {
  return TOKEN_PACKAGES.find(pkg => pkg.id === packageId)
}

// 根据 Stripe Price ID 获取套餐信息
export function getPackageByPriceId(priceId: string): TokenPackage | undefined {
  return TOKEN_PACKAGES.find(pkg => pkg.stripePriceId === priceId)
}

// 计算实际获得的代币数（包含赠送）
export function getTotalTokens(pkg: TokenPackage): number {
  return pkg.tokens + (pkg.bonus || 0)
}
