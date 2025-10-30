import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '交易记录',
  description: '查看系统交易记录',
}

// 交易记录页面 - Transactions page
// 将来用于查看系统中的所有交易记录 - For viewing all transactions in the system in the future
export default function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      {/* 页面标题 - Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            交易记录
          </h1>
          <p className="mt-2 text-gray-600">
            查看所有交易信息和统计
          </p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
          导出记录
        </button>
      </div>

      {/* 占位内容 - Placeholder content */}
      <div className="bg-white rounded-xl border border-gray-200 p-12">
        <div className="text-center">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            交易记录功能
          </h3>
          <p className="text-gray-600">
            此功能正在开发中，敬请期待
          </p>
        </div>
      </div>
    </div>
  )
}
