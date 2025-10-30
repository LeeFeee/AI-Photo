'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

// 管理员登录页面 - Admin login page
// 独立于普通用户登录的管理员认证入口 - Independent admin authentication entry point separate from regular user login
export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 处理表单提交 - Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 使用 NextAuth 的 signIn 进行管理员登录 - Use NextAuth signIn for admin login
      const result = await signIn('admin-credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('登录失败，请检查用户名和密码')
      } else if (result?.ok) {
        toast.success('登录成功！')
        
        // 检查是否有回调 URL - Check for callback URL
        const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard'
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('登录过程中出现错误')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-50 px-4">
      <div className="w-full max-w-md">
        {/* 登录卡片 - Login card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* 标题 - Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              管理员登录
            </h1>
            <p className="text-gray-600">
              系统管理后台
            </p>
          </div>

          {/* 登录表单 - Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名输入 - Username input */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                用户名
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="请输入用户名"
                disabled={isLoading}
              />
            </div>

            {/* 密码输入 - Password input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="请输入密码"
                disabled={isLoading}
              />
            </div>

            {/* 登录按钮 - Login button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </form>

          {/* 提示信息 - Help text */}
          <div className="text-center text-sm text-gray-500">
            <p>默认账户：admin / admin123</p>
          </div>
        </div>

        {/* 版权信息 - Copyright */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>AI Photo 管理后台</p>
        </div>
      </div>
    </div>
  )
}
