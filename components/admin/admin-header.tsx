'use client'

import { signOut } from 'next-auth/react'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Session } from 'next-auth'

interface AdminHeaderProps {
  session: Session | null
}

// 管理员头部组件 - Admin header component
// 显示管理员信息和登出按钮 - Display admin info and logout button
export function AdminHeader({ session }: AdminHeaderProps) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* 左侧：页面标题或面包屑 - Left: page title or breadcrumbs */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">
          管理后台
        </h2>
      </div>

      {/* 右侧：管理员信息和操作 - Right: admin info and actions */}
      <div className="flex items-center gap-4">
        {/* 管理员信息 - Admin info */}
        {session?.user && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
            <User className="h-4 w-4 text-gray-600" />
            <div className="text-sm">
              <div className="font-medium text-gray-900">
                {session.user.name || '管理员'}
              </div>
              <div className="text-xs text-gray-500">
                {session.user.email}
              </div>
            </div>
          </div>
        )}

        {/* 登出按钮 - Logout button */}
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">退出登录</span>
        </Button>
      </div>
    </header>
  )
}
