'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Image,
  Users,
  CreditCard,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

// 导航项配置 - Navigation items configuration
const navItems = [
  {
    name: '仪表盘',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: '提示词管理',
    href: '/admin/prompts',
    icon: Image,
  },
  {
    name: '用户管理',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: '交易记录',
    href: '/admin/transactions',
    icon: CreditCard,
  },
]

// 管理员侧边栏组件 - Admin sidebar component
// 响应式设计：桌面显示固定侧边栏，移动端可折叠 - Responsive design: fixed sidebar on desktop, collapsible on mobile
export function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* 移动端菜单按钮 - Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        aria-label="切换菜单"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* 移动端背景遮罩 - Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 侧边栏 - Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo 和标题 - Logo and title */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200 px-6">
            <h1 className="text-xl font-bold text-brand-600">
              AI Photo 管理后台
            </h1>
          </div>

          {/* 导航菜单 - Navigation menu */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-brand-600'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* 底部信息 - Bottom info */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              版本 1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
