import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '提示词管理',
  description: '管理系统提示词库',
}

// 提示词管理页面 - Prompts management page
// 将来用于管理系统中的所有提示词 - For managing all prompts in the system in the future
export default function AdminPromptsPage() {
  return (
    <div className="space-y-6">
      {/* 页面标题 - Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            提示词管理
          </h1>
          <p className="mt-2 text-gray-600">
            管理和编辑系统提示词库
          </p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
          添加提示词
        </button>
      </div>

      {/* 占位内容 - Placeholder content */}
      <div className="bg-white rounded-xl border border-gray-200 p-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            提示词管理功能
          </h3>
          <p className="text-gray-600">
            此功能正在开发中，敬请期待
          </p>
        </div>
      </div>
    </div>
  )
}
