import { ImageIcon, Clock, Download, Coins, ShoppingCart, CheckCircle, XCircle, Loader } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { generateSEO } from '@/lib/seo'
import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'
import { PurchaseSuccessToast } from '@/components/purchase-success-toast'

export const metadata = generateSEO({
  title: '我的作品',
  description: '查看和管理您生成的所有 AI 图片作品',
  path: '/dashboard',
})

const mockImages = [
  {
    id: 1,
    url: 'https://picsum.photos/seed/1/400/300',
    prompt: '梦幻般的森林，阳光透过树叶',
    createdAt: '2024-01-15 14:30',
  },
  {
    id: 2,
    url: 'https://picsum.photos/seed/2/400/300',
    prompt: '未来城市的霓虹夜景',
    createdAt: '2024-01-15 12:15',
  },
  {
    id: 3,
    url: 'https://picsum.photos/seed/3/400/300',
    prompt: '宁静的海滩黄昏',
    createdAt: '2024-01-14 18:45',
  },
]

const hasImages = mockImages.length > 0

// 获取用户数据
async function getUserData() {
  try {
    // TODO: 从会话中获取真实用户 ID
    const userId = 'demo-user'
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        transactions: {
          where: {
            type: 'token_purchase',
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    })

    return user
  } catch (error) {
    console.error('获取用户数据失败:', error)
    return null
  }
}

// 格式化日期
function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// 格式化金额
function formatAmount(amount: number) {
  return `¥${(amount / 100).toFixed(2)}`
}

// 获取状态显示信息
function getStatusInfo(status: string) {
  switch (status) {
    case 'completed':
      return { label: '已完成', icon: CheckCircle, color: 'text-green-600' }
    case 'pending':
      return { label: '待处理', icon: Loader, color: 'text-yellow-600' }
    case 'failed':
      return { label: '失败', icon: XCircle, color: 'text-red-600' }
    default:
      return { label: status, icon: Clock, color: 'text-gray-600' }
  }
}

export default async function DashboardPage() {
  const user = await getUserData()

  if (!hasImages) {
    return (
      <div className="animate-fade-in">
        <EmptyState
          icon={ImageIcon}
          title="还没有生成作品"
          description="前往生成页面，创建您的第一张 AI 图片吧"
          action={
            <Button asChild>
              <a href="/generate">
                开始生成
              </a>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <>
      <Suspense fallback={null}>
        <PurchaseSuccessToast />
      </Suspense>
      <div className="space-y-8 animate-fade-in">
        {/* Token Balance Card */}
        {user && (
        <Card className="bg-gradient-to-br from-brand-500 to-accent-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/80">
                  <Coins className="w-5 h-5" aria-hidden="true" />
                  <span className="text-sm font-medium">代币余额</span>
                </div>
                <div className="text-4xl font-bold">
                  {user.tokenBalance}
                </div>
                <p className="text-sm text-white/80">
                  可生成 {user.tokenBalance} 张图片
                </p>
              </div>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="bg-white text-brand-600 hover:bg-white/90"
              >
                <a href="/pricing/tokens">
                  <ShoppingCart className="w-4 h-4 mr-2" aria-hidden="true" />
                  购买代币
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      {user && user.transactions.length > 0 && (
        <Card>
          <CardHeader className="border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              最近购买记录
            </h2>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {user.transactions.map((transaction) => {
                const statusInfo = getStatusInfo(transaction.status)
                const StatusIcon = statusInfo.icon
                
                return (
                  <div
                    key={transaction.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            代币购买
                          </span>
                          <span className={`inline-flex items-center gap-1 text-xs ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3" aria-hidden="true" />
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          +{transaction.tokens} 代币
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatAmount(transaction.amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Works Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            我的作品
          </h1>
          <p className="text-lg text-gray-600">
            共 {mockImages.length} 张图片
          </p>
        </div>
        <Button asChild>
          <a href="/generate">
            生成新图片
          </a>
        </Button>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockImages.map((image, index) => (
          <Card 
            key={image.id}
            className="group animate-fade-in overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.prompt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    aria-label="下载图片"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-gray-900 font-medium mb-2 line-clamp-2">
                {image.prompt}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                <time dateTime={image.createdAt}>
                  {image.createdAt}
                </time>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockImages.length >= 9 && (
        <div className="text-center py-8">
          <Button variant="outline" size="lg">
            加载更多
          </Button>
        </div>
      )}
      </div>
    </>
  )
}
