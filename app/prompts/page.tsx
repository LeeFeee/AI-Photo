'use client'

import { useState } from 'react'
import { Search, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generateSEO } from '@/lib/seo'
import { PromptsGrid } from '@/components/prompts/prompts-grid'
import { MembershipSwitcher } from '@/components/prompts/membership-switcher'
import { useAuth } from '@/lib/auth-context'

// Note: metadata export doesn't work in client components
// SEO is handled in the parent layout or via next/head

const promptCategories = [
  { id: 'all', name: '全部', color: 'bg-gray-100 text-gray-700' },
  { id: '风景', name: '风景', color: 'bg-green-100 text-green-700' },
  { id: '人物', name: '人物', color: 'bg-blue-100 text-blue-700' },
  { id: '抽象', name: '抽象', color: 'bg-purple-100 text-purple-700' },
  { id: '动物', name: '动物', color: 'bg-orange-100 text-orange-700' },
  { id: '建筑', name: '建筑', color: 'bg-gray-100 text-gray-700' },
  { id: '艺术', name: '艺术', color: 'bg-pink-100 text-pink-700' },
]

export default function PromptsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const { isMember } = useAuth()
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* 页面标题和搜索 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-brand-600" aria-hidden="true" />
            提示词库
          </h1>
          <p className="text-lg text-gray-600">
            探索各类风格的 AI 图片生成提示词
            {isMember && <span className="ml-2 text-brand-600 font-medium">✨ 会员专享</span>}
          </p>
        </div>
        
        <div className="relative w-full md:w-96">
          <label htmlFor="search-prompts" className="sr-only">搜索提示词</label>
          <Search 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
            aria-hidden="true" 
          />
          <input
            id="search-prompts"
            type="search"
            placeholder="搜索提示词..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            aria-label="搜索提示词"
          />
        </div>
      </div>

      {/* 会员状态切换器 (仅开发环境) */}
      <MembershipSwitcher />

      {/* 分类过滤 */}
      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="text-xl font-semibold text-gray-900 mb-4">
          分类筛选
        </h2>
        <div className="flex flex-wrap gap-2">
          {promptCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : `${category.color} hover:scale-105`
              }`}
              aria-label={`筛选 ${category.name} 类提示词`}
              aria-pressed={selectedCategory === category.id}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* 提示词网格 */}
      <section aria-labelledby="prompts-heading">
        <h2 id="prompts-heading" className="sr-only">
          提示词列表
        </h2>
        <PromptsGrid 
          searchQuery={searchQuery}
          category={selectedCategory === 'all' ? undefined : selectedCategory}
        />
      </section>

      {/* 自定义提示词 CTA */}
      <section className="bg-gradient-to-r from-brand-500 to-accent-500 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-semibold mb-2">
          需要自定义提示词？
        </h2>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          您也可以在生成页面输入自己的创意提示词，让 AI 为您创作独一无二的作品
        </p>
        <Button 
          asChild 
          variant="secondary"
          size="lg"
          className="bg-white text-brand-600 hover:bg-gray-50"
        >
          <a href="/generate">
            前往生成页面
          </a>
        </Button>
      </section>
      
      {/* 会员权益说明 */}
      {!isMember && (
        <section className="bg-brand-50 rounded-2xl p-6 border-2 border-brand-100">
          <div className="text-center space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">
              🌟 成为会员，解锁全部提示词
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              加入会员即可查看所有提示词的完整内容，复制使用，加速您的创作流程
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-brand-600">✓</span>
                查看全部提示词内容
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-brand-600">✓</span>
                一键复制使用
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-brand-600">✓</span>
                持续更新内容
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
