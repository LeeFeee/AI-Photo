'use client'

// 开发环境下的会员状态切换器 - 用于测试会员门控功能
// 生产环境中，会员状态将通过 NextAuth session 管理

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, UserCheck, UserX } from 'lucide-react'

export function MembershipSwitcher() {
  const { user, setMembershipTier, isGuest, isNonMember, isMember } = useAuth()
  
  // 仅在开发环境显示
  if (process.env.NODE_ENV === 'production') {
    return null
  }
  
  return (
    <Card className="border-2 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" aria-hidden="true" />
          会员状态切换器 (开发模式)
        </CardTitle>
        <CardDescription>
          切换不同的会员状态以测试内容门控功能
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="font-medium">当前状态:</span>
          <span className="font-semibold text-brand-600">
            {isGuest && '游客 (未登录)'}
            {isNonMember && '已登录用户 (非会员)'}
            {isMember && '会员 ✨'}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={isGuest ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMembershipTier('guest')}
            className="gap-2"
          >
            <UserX className="h-4 w-4" aria-hidden="true" />
            游客模式
          </Button>
          
          <Button
            variant={isNonMember ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMembershipTier('non-member')}
            className="gap-2"
          >
            <User className="h-4 w-4" aria-hidden="true" />
            已登录非会员
          </Button>
          
          <Button
            variant={isMember ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMembershipTier('member')}
            className="gap-2"
          >
            <UserCheck className="h-4 w-4" aria-hidden="true" />
            会员模式
          </Button>
        </div>
        
        <div className="text-xs text-gray-600 space-y-1 pt-2 border-t border-orange-200">
          <p>• <strong>游客</strong>: 无法查看提示词内容</p>
          <p>• <strong>已登录非会员</strong>: 可浏览但无法查看完整提示词</p>
          <p>• <strong>会员</strong>: 可以查看所有提示词内容</p>
        </div>
      </CardContent>
    </Card>
  )
}
