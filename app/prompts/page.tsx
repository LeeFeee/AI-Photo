import { Search, Tag } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { generateSEO } from '@/lib/seo'

export const metadata = generateSEO({
  title: '提示词库',
  description: '浏览丰富的 AI 图片生成提示词，找到适合您的创意灵感',
  path: '/prompts',
  keywords: ['提示词', 'AI提示词', '图片生成提示词', 'prompt'],
})

const promptCategories = [
  {
    id: 1,
    name: '风景',
    description: '自然风光、城市景观、四季美景',
    count: 24,
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 2,
    name: '人物',
    description: '肖像、人物写真、艺术人像',
    count: 18,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 3,
    name: '抽象',
    description: '抽象艺术、几何图案、创意设计',
    count: 16,
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 4,
    name: '动物',
    description: '可爱动物、野生动物、宠物',
    count: 12,
    color: 'bg-orange-100 text-orange-700',
  },
  {
    id: 5,
    name: '建筑',
    description: '现代建筑、古典建筑、室内设计',
    count: 20,
    color: 'bg-gray-100 text-gray-700',
  },
  {
    id: 6,
    name: '艺术',
    description: '油画、水彩、数字艺术',
    count: 15,
    color: 'bg-pink-100 text-pink-700',
  },
]

export default function PromptsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            提示词库
          </h1>
          <p className="text-lg text-gray-600">
            探索各类风格的 AI 图片生成提示词
          </p>
        </div>
        
        <div className="relative w-full md:w-96">
          <label htmlFor="search-prompts" className="sr-only">搜索提示词</label>
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
          <input
            id="search-prompts"
            type="search"
            placeholder="搜索提示词..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            aria-label="搜索提示词"
          />
        </div>
      </div>

      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="text-2xl font-semibold text-gray-900 mb-6">
          分类浏览
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promptCategories.map((category, index) => (
            <Card 
              key={category.id}
              className="animate-fade-in hover:scale-105 transition-transform duration-200 cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
              tabIndex={0}
              role="button"
              aria-label={`查看 ${category.name} 类提示词`}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`rounded-lg p-2 ${category.color}`}>
                    <Tag className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="text-sm text-gray-500">
                    {category.count} 个提示词
                  </span>
                </div>
                <CardTitle className="text-xl">{category.name}</CardTitle>
                <CardDescription className="text-base">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  查看全部
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-brand-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          需要自定义提示词？
        </h2>
        <p className="text-gray-600 mb-6">
          您也可以在生成页面输入自己的创意提示词
        </p>
        <Button asChild>
          <a href="/generate">
            前往生成页面
          </a>
        </Button>
      </section>
    </div>
  )
}
