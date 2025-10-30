'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('页面错误:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md animate-fade-in">
        <div className="rounded-full bg-red-100 p-6 mx-auto w-fit mb-4">
          <AlertCircle className="h-12 w-12 text-red-600" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          出错了
        </h1>
        <p className="text-gray-600 mb-6">
          抱歉，页面加载时遇到了一个错误。
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="text-left text-xs bg-gray-100 p-4 rounded-lg mb-4 overflow-auto max-w-full">
            {error.message}
          </pre>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={() => reset()}>
            重试
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            返回首页
          </Button>
        </div>
      </div>
    </div>
  )
}
