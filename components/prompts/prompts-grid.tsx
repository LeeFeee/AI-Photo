'use client'

import { useState, useEffect } from 'react'
import { Prompt } from '@/lib/types'
import { getActivePrompts } from '@/lib/mock-data'
import { PromptCard } from './prompt-card'
import { PromptGridSkeleton } from './prompt-card-skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { AlertCircle, Search, Sparkles } from 'lucide-react'

interface PromptsGridProps {
  searchQuery?: string
  category?: string
}

export function PromptsGrid({ searchQuery = '', category }: PromptsGridProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function loadPrompts() {
      try {
        setLoading(true)
        setError(null)
        
        // 在实际应用中，这里会调用 Prisma 查询:
        // const prompts = await prisma.prompt.findMany({ 
        //   where: { isActive: true } 
        // })
        const data = await getActivePrompts()
        setPrompts(data)
      } catch (err) {
        console.error('Failed to load prompts:', err)
        setError('加载提示词失败，请刷新页面重试')
      } finally {
        setLoading(false)
      }
    }
    
    loadPrompts()
  }, [])
  
  // 过滤提示词
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch = searchQuery
      ? prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    
    const matchesCategory = category ? prompt.category === category : true
    
    return matchesSearch && matchesCategory
  })
  
  // 加载状态
  if (loading) {
    return <PromptGridSkeleton count={9} />
  }
  
  // 错误状态
  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="加载失败"
        description={error}
      />
    )
  }
  
  // 空状态
  if (filteredPrompts.length === 0) {
    return (
      <EmptyState
        icon={searchQuery || category ? Search : Sparkles}
        title={searchQuery || category ? "没有找到匹配的提示词" : "暂无提示词"}
        description={
          searchQuery || category
            ? "试试调整搜索条件或浏览其他分类"
            : "提示词库正在建设中，敬请期待"
        }
      />
    )
  }
  
  // 提示词网格
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="list"
      aria-label="提示词列表"
    >
      {filteredPrompts.map((prompt, index) => (
        <div key={prompt.id} role="listitem">
          <PromptCard prompt={prompt} index={index} />
        </div>
      ))}
    </div>
  )
}
