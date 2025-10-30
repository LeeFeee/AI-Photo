'use client'

import { useState } from 'react'
import { Coins, Check, Sparkles, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TOKEN_PACKAGES, getTotalTokens } from '@/lib/token-packages'
import toast from 'react-hot-toast'

export default function TokenPricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (packageId: string) => {
    setLoading(packageId)
    
    try {
      // 调用 API 创建 Stripe Checkout Session
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '创建支付会话失败')
      }

      const { url } = await response.json()
      
      // 重定向到 Stripe Checkout
      window.location.href = url
    } catch (error) {
      console.error('Purchase error:', error)
      toast.error(error instanceof Error ? error.message : '购买失败，请稍后重试')
      setLoading(null)
    }
  }

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 mb-4">
          <Coins className="w-8 h-8 text-white" aria-hidden="true" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          购买代币
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          选择适合您的代币套餐，开始创作精美 AI 图片
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {TOKEN_PACKAGES.map((pkg, index) => {
          const totalTokens = getTotalTokens(pkg)
          const isLoading = loading === pkg.id
          
          return (
            <Card
              key={pkg.id}
              className={`relative group animate-fade-in ${
                pkg.popular ? 'ring-2 ring-brand-500 shadow-xl scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-medium rounded-full shadow-lg">
                  🔥 最受欢迎
                </div>
              )}
              
              <CardContent className="p-6 space-y-6">
                {/* Package Name */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      {pkg.priceDisplay}
                    </span>
                  </div>
                </div>

                {/* Tokens */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-y border-gray-200">
                    <span className="text-gray-600">基础代币</span>
                    <span className="font-semibold text-gray-900">
                      {pkg.tokens}
                    </span>
                  </div>
                  
                  {pkg.bonus && (
                    <div className="flex items-center justify-between text-accent-600">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4" aria-hidden="true" />
                        赠送代币
                      </span>
                      <span className="font-semibold">
                        +{pkg.bonus}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-200 font-bold text-lg">
                    <span className="text-gray-900">总计</span>
                    <span className="text-brand-600">
                      {totalTokens}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>永久有效</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>高清图片生成</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>无限次下载</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={isLoading}
                  className={`w-full ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600'
                      : ''
                  }`}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                      处理中...
                    </>
                  ) : (
                    '立即购买'
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-6 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          常见问题
        </h2>
        
        <div className="space-y-4">
          <details className="group bg-white rounded-lg border border-gray-200 p-4">
            <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
              代币如何使用？
              <span className="ml-2 transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <p className="mt-3 text-gray-600">
              每生成一张 AI 图片消耗 1 个代币。代币购买后永久有效，没有过期时间。
            </p>
          </details>

          <details className="group bg-white rounded-lg border border-gray-200 p-4">
            <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
              支付安全吗？
              <span className="ml-2 transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <p className="mt-3 text-gray-600">
              我们使用 Stripe 作为支付服务商，您的支付信息完全安全，我们不会存储任何信用卡信息。
            </p>
          </details>

          <details className="group bg-white rounded-lg border border-gray-200 p-4">
            <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
              购买后多久到账？
              <span className="ml-2 transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <p className="mt-3 text-gray-600">
              支付成功后，代币会立即充值到您的账户中，您可以在个人中心查看代币余额。
            </p>
          </details>

          <details className="group bg-white rounded-lg border border-gray-200 p-4">
            <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
              可以退款吗？
              <span className="ml-2 transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <p className="mt-3 text-gray-600">
              未使用的代币可以在购买后 7 天内申请退款。已使用的代币不可退款。
            </p>
          </details>
        </div>
      </div>
    </div>
  )
}
