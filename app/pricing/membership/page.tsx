'use client'

import { Check, Sparkles, Crown, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// 会员权益 (Membership Benefits)
const membershipBenefits = [
  {
    icon: Sparkles,
    title: '完整提示词库',
    description: '访问所有高级提示词和创意模板',
  },
  {
    icon: Crown,
    title: '独家会员内容',
    description: '获取专属提示词和创意灵感',
  },
  {
    icon: Zap,
    title: '优先生成队列',
    description: '会员享受更快的生成速度',
  },
]

// 订阅计划 (Subscription Plans)
const plans = [
  {
    id: 'monthly',
    name: '月度会员',
    price: '¥29',
    period: '/月',
    description: '按月订阅，随时可以取消',
    features: [
      '解锁完整提示词库',
      '访问所有会员专属内容',
      '优先生成队列',
      '无限浏览和收藏',
      '7x24 客户支持',
    ],
    highlight: false,
  },
  {
    id: 'yearly',
    name: '年度会员',
    price: '¥299',
    period: '/年',
    description: '年付更优惠，相当于每月 ¥24.9',
    features: [
      '解锁完整提示词库',
      '访问所有会员专属内容',
      '优先生成队列',
      '无限浏览和收藏',
      '7x24 客户支持',
      '🎁 额外赠送 100 代币',
    ],
    highlight: true,
    badge: '推荐',
    savings: '省 ¥49',
  },
]

export default function MembershipPricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  
  // 模拟用户数据 - 在真实应用中从 session/context 获取
  // (Mock user data - in real app, get from session/context)
  const userId = 'demo-user-123'
  const userEmail = 'demo@example.com'

  const handleSubscribe = async (interval: 'monthly' | 'yearly') => {
    setLoading(interval)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email: userEmail,
          interval,
        }),
      })

      const data = await response.json()

      if (data.url) {
        // 重定向到 Stripe Checkout (Redirect to Stripe Checkout)
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned')
        setLoading(null)
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      setLoading(null)
    }
  }

  return (
    <div className="space-y-12 animate-fade-in">
      {/* 页头 (Header) */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 text-accent-700 text-sm font-medium">
          <Crown className="h-4 w-4" />
          会员订阅
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          成为会员，解锁更多创意
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          订阅会员，获取完整提示词库访问权限和更多专属权益
        </p>
      </div>

      {/* 会员权益 (Benefits) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {membershipBenefits.map((benefit, index) => {
          const Icon = benefit.icon
          return (
            <Card
              key={index}
              className="animate-fade-in text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-brand-600" />
                </div>
                <CardTitle>{benefit.title}</CardTitle>
                <CardDescription>{benefit.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </section>

      {/* 价格方案 (Pricing Plans) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <Card
            key={plan.id}
            className={`relative animate-fade-in ${
              plan.highlight
                ? 'border-2 border-brand-500 shadow-xl scale-105'
                : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {plan.badge && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-medium shadow-lg">
                  <Sparkles className="h-3 w-3" />
                  {plan.badge}
                </span>
              </div>
            )}
            <CardHeader className="text-center pb-8 pt-8">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-5xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-xl text-gray-600">{plan.period}</span>
              </div>
              {plan.savings && (
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    {plan.savings}
                  </span>
                </div>
              )}
              <CardDescription className="mt-4">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.highlight ? 'default' : 'outline'}
                size="lg"
                onClick={() => handleSubscribe(plan.id as 'monthly' | 'yearly')}
                disabled={loading !== null}
              >
                {loading === plan.id ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    加载中...
                  </>
                ) : (
                  plan.highlight ? '立即订阅' : '选择月度'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* 说明文字 (Explanatory Text) */}
      <section className="bg-gray-50 rounded-2xl p-8 space-y-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          会员与代币的区别
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-600 font-semibold">
              <Crown className="h-5 w-5" />
              会员订阅
            </div>
            <p className="text-gray-600">
              会员资格让您解锁完整的提示词库，可以查看和使用所有高级提示词模板。会员不影响代币余额。
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• 查看高级提示词内容</li>
              <li>• 访问会员专属模板</li>
              <li>• 优先生成队列</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-accent-600 font-semibold">
              <Zap className="h-5 w-5" />
              代币系统
            </div>
            <p className="text-gray-600">
              代币用于消耗，每次生成图片需要使用代币。会员和非会员都需要代币来生成图片。
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• 每次生成消耗代币</li>
              <li>• 可单独购买代币</li>
              <li>• 会员不赠送代币（年费会员除外）</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-gray-500 text-center pt-4">
          💡 提示：年度会员可获赠 100 代币，让您立即开始创作
        </p>
      </section>

      {/* FAQ 常见问题 */}
      <section className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          常见问题
        </h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">可以随时取消订阅吗？</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                是的，您可以随时在账户设置中取消订阅。取消后，您的会员权益将持续到当前计费周期结束。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">会员到期后会怎样？</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                会员到期后，您将无法访问高级提示词库，但您之前生成的图片和购买的代币不会受影响。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">支持哪些支付方式？</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                我们通过 Stripe 支持信用卡、借记卡等多种支付方式，安全可靠。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
