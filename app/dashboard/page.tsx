import { ImageIcon, Clock, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { generateSEO } from '@/lib/seo'

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

export default function DashboardPage() {
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
    <div className="space-y-8 animate-fade-in">
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
  )
}
