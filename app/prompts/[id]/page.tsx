import { Crown, Sparkles, Copy, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { generateSEO } from '@/lib/seo'

export const metadata = generateSEO({
  title: '提示词详情',
  description: '查看 AI 图片生成提示词的详细信息',
  path: '/prompts',
})

// 模拟提示词数据 (Mock prompt data)
const mockPrompts: Record<string, {
  id: string
  title: string
  description: string
  prompt: string
  isPremium: boolean
  category: string
  examples: string[]
}> = {
  '1': {
    id: '1',
    title: '梦幻森林仙境',
    description: '创造一个充满魔法气息的神秘森林场景',
    prompt: 'A mystical enchanted forest with glowing mushrooms, fairy lights, ancient trees with twisted roots, soft morning mist, rays of golden sunlight filtering through the canopy, magical atmosphere, fantasy art style, highly detailed, 8k',
    isPremium: true,
    category: '风景',
    examples: [
      'https://picsum.photos/seed/forest1/400/300',
      'https://picsum.photos/seed/forest2/400/300',
    ],
  },
  '2': {
    id: '2',
    title: '赛博朋克都市夜景',
    description: '未来感十足的霓虹城市景观',
    prompt: 'Cyberpunk city at night, neon lights, flying cars, holographic advertisements, rain-soaked streets reflecting colorful lights, futuristic skyscrapers, cinematic lighting, blade runner style, ultra detailed, 8k',
    isPremium: true,
    category: '城市',
    examples: [
      'https://picsum.photos/seed/cyber1/400/300',
      'https://picsum.photos/seed/cyber2/400/300',
    ],
  },
  '3': {
    id: '3',
    title: '宁静海滩日落',
    description: '平静祥和的海边黄昏场景',
    prompt: 'Serene beach at sunset, gentle waves, palm trees silhouette, orange and purple sky, peaceful atmosphere, realistic photography style, golden hour lighting',
    isPremium: false,
    category: '风景',
    examples: [
      'https://picsum.photos/seed/beach1/400/300',
      'https://picsum.photos/seed/beach2/400/300',
    ],
  },
}

interface PromptDetailPageProps {
  params: {
    id: string
  }
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  // 在实际应用中，这里会检查用户的会员状态
  // (In a real app, this would check the user's membership status)
  // const userId = await getCurrentUserId()
  // const { isMember } = await checkMembershipStatus(userId)
  
  // 模拟数据：用户不是会员 (Mock data: user is not a member)
  const isMember = false
  
  const prompt = mockPrompts[params.id]

  if (!prompt) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">提示词不存在</h1>
        <Button asChild>
          <a href="/prompts">返回提示词库</a>
        </Button>
      </div>
    )
  }

  const canView = !prompt.isPremium || isMember

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* 标题和分类 (Title and Category) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <a href="/prompts" className="hover:text-brand-600 transition-colors">
            提示词库
          </a>
          <span>/</span>
          <span>{prompt.category}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {prompt.title}
              </h1>
              {prompt.isPremium && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-medium">
                  <Crown className="h-4 w-4" />
                  会员专属
                </div>
              )}
            </div>
            <p className="text-lg text-gray-600">{prompt.description}</p>
          </div>
        </div>
      </div>

      {/* 提示词内容 (Prompt Content) */}
      <Card>
        <CardHeader>
          <CardTitle>提示词内容</CardTitle>
          <CardDescription>
            {canView ? '复制下方提示词到生成页面使用' : '成为会员以查看完整提示词'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {canView ? (
            <>
              <div className="relative">
                <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm text-gray-900 whitespace-pre-wrap">
                  {prompt.prompt}
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => navigator.clipboard.writeText(prompt.prompt)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  复制
                </Button>
              </div>
              <Button asChild className="w-full">
                <a href="/generate">
                  <Sparkles className="h-4 w-4 mr-2" />
                  使用此提示词生成
                </a>
              </Button>
            </>
          ) : (
            <div className="text-center py-12 space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100">
                <Crown className="h-8 w-8 text-brand-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  这是会员专属提示词
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  订阅会员即可解锁此提示词和更多高级内容
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <a href="/pricing/membership">
                    <Crown className="h-4 w-4 mr-2" />
                    查看会员方案
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="/prompts">
                    返回提示词库
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 示例图片 (Example Images) */}
      {canView && prompt.examples.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            生成示例
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prompt.examples.map((example, index) => (
              <div
                key={index}
                className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={example}
                  alt={`${prompt.title} 示例 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 相关提示词推荐 */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          探索更多提示词
        </h2>
        <div className="flex justify-center">
          <Button asChild size="lg" variant="outline">
            <a href="/prompts">
              <ExternalLink className="h-4 w-4 mr-2" />
              浏览完整提示词库
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}
