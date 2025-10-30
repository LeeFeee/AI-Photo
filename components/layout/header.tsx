'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Home, Image, Wand2, LayoutDashboard, User, LogOut, LogIn, UserPlus } from 'lucide-react'
import { MobileMenu } from './mobile-menu'
import { cn } from '@/lib/utils'

const navigation = [
  { name: '首页', href: '/', icon: Home },
  { name: '提示词库', href: '/prompts', icon: Image },
  { name: '生成图片', href: '/generate', icon: Wand2 },
  { name: '我的作品', href: '/dashboard', icon: LayoutDashboard },
]

export function Header() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4" role="navigation" aria-label="主导航">
        <Link 
          href="/" 
          className="text-2xl font-bold text-brand-600 hover:text-brand-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded-lg px-2 py-1"
          aria-label="AI Photo 首页"
        >
          AI Photo
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                  isActive
                    ? "bg-brand-100 text-brand-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          {status === 'loading' ? (
            <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full" />
          ) : session ? (
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-700">
                {session.user.name || session.user.email}
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                aria-label="退出登录"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
                <span>退出</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                <LogIn className="h-5 w-5" aria-hidden="true" />
                <span>登录</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 bg-brand-600 text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                <UserPlus className="h-5 w-5" aria-hidden="true" />
                <span>注册</span>
              </Link>
            </div>
          )}
        </div>

        <MobileMenu />
      </nav>
    </header>
  )
}
