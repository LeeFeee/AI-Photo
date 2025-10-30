import Link from 'next/link'
import { Sparkles, Zap, Palette, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { generateSEO } from '@/lib/seo'

export const metadata = generateSEO({
  title: '首页',
  description: '使用 AI 技术根据预设提示词生成精美图片，简单快捷，创意无限',
  path: '/',
})

const features = [
  {
    icon: Sparkles,
    title: '智能生成',
    description: '使用先进的 AI 模型，快速生成高质量图片',
  },
  {
    icon: Zap,
    title: '简单快捷',
    description: '选择预设提示词，一键生成，无需复杂操作',
  },
  {
    icon: Palette,
    title: '创意无限',
    description: '丰富的提示词库，满足各种创意需求',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-16 animate-fade-in">
      <section className="text-center space-y-6 py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          AI 驱动的
          <span className="text-brand-600 block mt-2">智能图片生成</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          选择预设提示词，让 AI 为您创造独特的图片
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild size="lg">
            <Link href="/generate" className="group">
              开始生成
              <ArrowRight
                className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/prompts">浏览提示词</Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">
          功能特点
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="animate-fade-in hover:scale-105 transition-transform duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="rounded-full bg-brand-100 p-3 w-fit mb-2">
                  <feature.icon className="h-6 w-6 text-brand-600" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-brand-500 to-accent-500 rounded-3xl p-8 md:p-12 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">准备好开始了吗？</h2>
        <p className="text-xl mb-8 text-white/90">探索 AI 图片生成的无限可能</p>
        <Button asChild size="lg" variant="secondary">
          <Link href="/generate">立即体验</Link>
        </Button>
      </section>
    </div>
  )
}
