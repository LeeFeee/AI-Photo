'use client'

import { Crown, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface MembershipStatusProps {
  isMember: boolean
  membershipExpiresAt?: Date | null
  userId: string
}

export function MembershipStatus({ isMember, membershipExpiresAt, userId }: MembershipStatusProps) {
  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error opening customer portal:', error)
    }
  }

  if (!isMember) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-gray-400" />
            <CardTitle>会员状态</CardTitle>
          </div>
          <CardDescription>您还不是会员</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            订阅会员，解锁完整提示词库和更多专属权益
          </p>
          <Button asChild className="w-full">
            <a href="/pricing/membership">
              查看会员方案
            </a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const expiryDate = membershipExpiresAt ? new Date(membershipExpiresAt) : null
  const isExpired = expiryDate && expiryDate < new Date()
  const daysRemaining = expiryDate 
    ? Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <Card className="border-2 border-brand-500 bg-gradient-to-br from-brand-50 to-accent-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-brand-600" />
          <CardTitle>会员状态</CardTitle>
        </div>
        <CardDescription>
          {isExpired ? '会员已过期' : '您是尊贵的会员'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {expiryDate && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              {isExpired ? '过期时间' : '到期时间'}
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {expiryDate.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            {!isExpired && daysRemaining > 0 && (
              <div className="text-sm text-gray-500">
                还剩 {daysRemaining} 天
              </div>
            )}
          </div>
        )}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleManageSubscription}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          管理订阅
        </Button>
        {isExpired && (
          <Button asChild className="w-full">
            <a href="/pricing/membership">
              续费会员
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
