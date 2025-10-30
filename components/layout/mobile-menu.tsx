'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, Image, Wand2, LayoutDashboard, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: '首页', href: '/', icon: Home },
  { name: '提示词库', href: '/prompts', icon: Image },
  { name: '生成图片', href: '/generate', icon: Wand2 },
  { name: '我的作品', href: '/dashboard', icon: LayoutDashboard },
  { name: '会员', href: '/pricing/membership', icon: Crown },
]

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="inline-flex items-center justify-center p-2 rounded-xl text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="打开菜单"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <nav
            className={cn(
              "fixed top-0 right-0 bottom-0 w-72 bg-white shadow-2xl z-50 animate-slide-in",
              "flex flex-col"
            )}
            role="navigation"
            aria-label="移动端导航"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-xl font-bold text-brand-600">AI Photo</span>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
                aria-label="关闭菜单"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        </>
      )}
    </div>
  )
}
