'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Lock, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Prompt } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { PromptDetailDialog } from './prompt-detail-dialog'
import { cn } from '@/lib/utils'

interface PromptCardProps {
  prompt: Prompt
  index?: number
}

export function PromptCard({ prompt, index = 0 }: PromptCardProps) {
  const { isMember } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // 非会员看到的是模糊的内容
  const canViewContent = isMember
  
  return (
    <>
      <Card
        className={cn(
          "group cursor-pointer animate-fade-in hover:scale-[1.02] transition-all duration-200",
          "overflow-hidden"
        )}
        style={{ animationDelay: `${index * 50}ms` }}
        onClick={() => setIsDialogOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsDialogOpen(true)
          }
        }}
        aria-label={`查看提示词: ${prompt.name}`}
      >
        {/* 预览图片 - 所有人都可以看到 */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <Image
            src={prompt.previewImage}
            alt={prompt.name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* 覆盖层 - 非会员显示锁定图标 */}
          {!canViewContent && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                <Lock className="h-6 w-6 text-gray-700" aria-hidden="true" />
              </div>
            </div>
          )}
          
          {/* 会员徽章 */}
          {canViewContent && (
            <div className="absolute top-3 right-3 bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              会员内容
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {prompt.name}
            </h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg whitespace-nowrap">
              {prompt.category}
            </span>
          </div>
          
          {/* 描述 - 所有人都可以看到 */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {prompt.description}
          </p>
          
          {/* 提示词内容 - 非会员模糊显示 */}
          <div className="relative">
            <div
              className={cn(
                "text-xs font-mono text-gray-500 line-clamp-2 p-2 bg-gray-50 rounded-lg",
                !canViewContent && "blur-sm select-none"
              )}
              aria-hidden={!canViewContent}
            >
              {prompt.content}
            </div>
            
            {!canViewContent && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
            )}
          </div>
          
          {/* 操作按钮 */}
          <div className="mt-4 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation()
                setIsDialogOpen(true)
              }}
              aria-label={canViewContent ? "查看详情" : "解锁查看"}
            >
              <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
              {canViewContent ? '查看详情' : '解锁查看'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* 详情对话框 */}
      <PromptDetailDialog
        prompt={prompt}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  )
}
