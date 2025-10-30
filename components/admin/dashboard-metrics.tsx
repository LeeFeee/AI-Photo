import { Users, Image, DollarSign, Activity } from 'lucide-react'

interface Metrics {
  totalUsers: number
  totalPrompts: number
  totalRevenue: number
  activeUsers: number
}

interface DashboardMetricsProps {
  metrics: Metrics
}

// 仪表盘指标组件 - Dashboard metrics component
// 使用服务器组件，准备好接收未来的真实数据 - Using server component, ready to receive real data in the future
export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  const metricCards = [
    {
      title: '总用户数',
      value: metrics.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: '平台注册用户总数',
    },
    {
      title: '提示词数量',
      value: metrics.totalPrompts,
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: '系统内的提示词总数',
    },
    {
      title: '总收入',
      value: `¥${metrics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: '累计收入金额',
    },
    {
      title: '活跃用户',
      value: metrics.activeUsers,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: '当前在线用户数',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric) => {
        const Icon = metric.icon
        return (
          <div
            key={metric.title}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            {/* 图标和数值 - Icon and value */}
            <div className="flex items-center justify-between mb-4">
              <div className={`${metric.bgColor} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </div>
              </div>
            </div>

            {/* 标题和描述 - Title and description */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {metric.title}
              </h3>
              <p className="text-xs text-gray-500">
                {metric.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
