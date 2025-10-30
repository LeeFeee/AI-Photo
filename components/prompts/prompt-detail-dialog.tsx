'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Lock, Copy, ArrowRight, CheckCheck } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Prompt } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface PromptDetailDialogProps {
  prompt: Prompt
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PromptDetailDialog({ prompt, open, onOpenChange }: PromptDetailDialogProps) {
  const { isMember, isGuest, isNonMember } = useAuth()
  const [copied, setCopied] = useState(false)
  
  // 会员可以查看完整内容
  const canViewContent = isMember
  
  // 复制提示词到剪贴板
  const handleCopy = async () => {
    if (!canViewContent) return
    
    try {
      await navigator.clipboard.writeText(prompt.content)
      setCopied(true)
      toast.success('提示词已复制到剪贴板')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('复制失败，请手动复制')
    }
  }
  
  // 使用此提示词 - 跳转到生成页面
  const handleUsePrompt = () => {
    if (!canViewContent) return
    
    // 在实际应用中，这里会将提示词传递到生成页面
    // 可以通过 URL 参数、localStorage 或状态管理
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedPrompt', JSON.stringify({
        id: prompt.id,
        name: prompt.name,
        content: prompt.content,
      }))
    }
    
    toast.success(`已选择提示词: ${prompt.name}`)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <DialogTitle>{prompt.name}</DialogTitle>
              <DialogDescription className="mt-2">
                {prompt.description}
              </DialogDescription>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
              {prompt.category}
            </span>
          </div>
        </DialogHeader>
        
        {/* 预览图片 */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={prompt.previewImage}
            alt={prompt.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>
        
        {/* 提示词内容区域 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              提示词内容
            </h3>
            {canViewContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
                aria-label="复制提示词"
              >
                {copied ? (
                  <>
                    <CheckCheck className="h-4 w-4" aria-hidden="true" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    复制
                  </>
                )}
              </Button>
            )}
          </div>
          
          {/* 提示词内容 - 会员/非会员不同显示 */}
          {canViewContent ? (
            <div className="relative p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm font-mono text-gray-700 leading-relaxed">
                {prompt.content}
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* 模糊的提示词 */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm font-mono text-gray-700 leading-relaxed blur-md select-none">
                  {prompt.content}
                </p>
              </div>
              
              {/* 锁定覆盖层 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                <div className="text-center space-y-4 max-w-sm px-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 rounded-full">
                    <Lock className="h-8 w-8 text-brand-600" aria-hidden="true" />
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      会员专属内容
                    </h4>
                    <p className="text-sm text-gray-600">
                      {isGuest 
                        ? '登录并成为会员后即可查看完整的提示词内容'
                        : '成为会员后即可查看完整的提示词内容'}
                    </p>
                  </div>
                  
                  <Button className="gap-2" size="lg">
                    {isGuest ? (
                      <>
                        登录 / 注册
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        成为会员
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500">
                    💎 解锁所有提示词库，享受更多创作自由
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 底部操作按钮 */}
        <DialogFooter>
          {canViewContent ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                关闭
              </Button>
              <Button asChild className="gap-2">
                <Link href="/generate" onClick={handleUsePrompt}>
                  使用此提示词
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                返回
              </Button>
              <Button className="gap-2">
                {isGuest ? '登录查看' : '升级会员'}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </>
          )}
        </DialogFooter>
        
        {/* 提示信息 */}
        {canViewContent && (
          <div className="text-xs text-gray-500 text-center pb-2">
            💡 提示: 您可以直接复制提示词或点击&ldquo;使用此提示词&rdquo;前往生成页面
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
