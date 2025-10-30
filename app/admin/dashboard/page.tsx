import { Metadata } from 'next'
import { DashboardMetrics } from '@/components/admin/dashboard-metrics'

export const metadata: Metadata = {
  title: '仪表盘',
  description: '管理后台仪表盘',
}

// 管理员仪表盘页面 - Admin dashboard page
// 显示系统关键指标和统计数据 - Display system key metrics and statistics
export default async function AdminDashboardPage() {
  // 这里将来可以从数据库获取实际数据 - In the future, fetch actual data from database
  // 目前使用占位数据 - Currently using placeholder data
  const metrics = {
    totalUsers: 0,
    totalPrompts: 0,
    totalRevenue: 0,
    activeUsers: 0,
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 - Page title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          仪表盘
        </h1>
        <p className="mt-2 text-gray-600">
          欢迎回来，这是您的系统概览
        </p>
      </div>

      {/* 指标卡片 - Metrics cards */}
      <DashboardMetrics metrics={metrics} />

      {/* 快速操作 - Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickActionCard
          title="用户管理"
          description="查看和管理所有用户"
          href="/admin/users"
          icon="👥"
        />
        <QuickActionCard
          title="提示词管理"
          description="管理系统提示词库"
          href="/admin/prompts"
          icon="🎨"
        />
        <QuickActionCard
          title="交易记录"
          description="查看所有交易信息"
          href="/admin/transactions"
          icon="💳"
        />
      </div>
    </div>
  )
}

// 快速操作卡片组件 - Quick action card component
function QuickActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string
  description: string
  href: string
  icon: string
}) {
  return (
    <a
      href={href}
      className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </a>
  )
}
