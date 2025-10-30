import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '用户管理',
  description: '管理系统用户',
}

// 用户管理页面 - Users management page
// 将来用于管理系统中的所有用户 - For managing all users in the system in the future
export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      {/* 页面标题 - Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            用户管理
          </h1>
          <p className="mt-2 text-gray-600">
            查看和管理所有用户
          </p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
          添加用户
        </button>
      </div>

      {/* 占位内容 - Placeholder content */}
      <div className="bg-white rounded-xl border border-gray-200 p-12">
        <div className="text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            用户管理功能
          </h3>
          <p className="text-gray-600">
            此功能正在开发中，敬请期待
          </p>
        </div>
      </div>
    </div>
  )
}
