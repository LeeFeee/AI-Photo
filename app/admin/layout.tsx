import { Shield } from 'lucide-react'

export const metadata = {
  title: '管理后台 - AI-Photo',
  description: '管理 AI 图片生成提示词',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-100 rounded-lg">
              <Shield className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">管理后台</h1>
              <p className="text-sm text-gray-600">AI-Photo 内容管理系统</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
