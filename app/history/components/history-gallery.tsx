'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Download, Clock, Coins, Image as ImageIcon, Filter, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import toast from 'react-hot-toast'

interface GeneratedImage {
  id: string
  referenceImageUrl: string | null
  generatedImageUrl: string
  tokenCost: number
  createdAt: Date
  prompt: {
    name: string
    content: string
  }
}

interface HistoryGalleryProps {
  images: GeneratedImage[]
  hasMore: boolean
  nextCursor: string | null
  totalCount: number
  currentFilters: {
    prompt?: string
    startDate?: string
    endDate?: string
  }
}

export function HistoryGallery({
  images: initialImages,
  hasMore: initialHasMore,
  nextCursor: initialNextCursor,
  totalCount,
  currentFilters,
}: HistoryGalleryProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [images, setImages] = useState(initialImages)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [nextCursor, setNextCursor] = useState(initialNextCursor)
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  const [promptFilter, setPromptFilter] = useState(currentFilters.prompt || '')
  const [startDateFilter, setStartDateFilter] = useState(currentFilters.startDate || '')
  const [endDateFilter, setEndDateFilter] = useState(currentFilters.endDate || '')

  const loadMore = async () => {
    if (!hasMore || isLoading || !nextCursor) return

    setIsLoading(true)
    const params = new URLSearchParams(searchParams.toString())
    params.set('cursor', nextCursor)

    try {
      const response = await fetch(`/api/history?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to load more images')
      }

      const data = await response.json()
      
      setImages((prev) => [...prev, ...data.images])
      setHasMore(data.hasMore)
      setNextCursor(data.nextCursor)
    } catch (error) {
      toast.error('加载失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    if (promptFilter) params.set('prompt', promptFilter)
    if (startDateFilter) params.set('startDate', startDateFilter)
    if (endDateFilter) params.set('endDate', endDateFilter)

    router.push(`/history?${params.toString()}`)
  }

  const clearFilters = () => {
    setPromptFilter('')
    setStartDateFilter('')
    setEndDateFilter('')
    router.push('/history')
  }

  const hasActiveFilters = currentFilters.prompt || currentFilters.startDate || currentFilters.endDate

  const handleDownload = async (imageUrl: string, promptName: string) => {
    try {
      // In production, you'd generate a signed URL here
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${promptName}-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('图片下载成功')
    } catch (error) {
      toast.error('下载失败，请重试')
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (images.length === 0 && !hasActiveFilters) {
    return (
      <div className="animate-fade-in">
        <EmptyState
          icon={ImageIcon}
          title="还没有生成记录"
          description="前往生成页面，创建您的第一张 AI 图片吧"
          action={
            <Button asChild>
              <a href="/generate">开始生成</a>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            生成历史
          </h1>
          <p className="text-lg text-gray-600">
            共 {totalCount} 条记录
            {hasActiveFilters && ` · 已过滤`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="切换过滤器"
          >
            <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
            过滤器
          </Button>
          <Button asChild>
            <a href="/generate">生成新图片</a>
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="animate-slide-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">过滤选项</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="关闭过滤器"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="prompt-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  提示词
                </label>
                <input
                  id="prompt-filter"
                  type="text"
                  value={promptFilter}
                  onChange={(e) => setPromptFilter(e.target.value)}
                  placeholder="搜索提示词..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="start-date-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  开始日期
                </label>
                <input
                  id="start-date-filter"
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="end-date-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  结束日期
                </label>
                <input
                  id="end-date-filter"
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={applyFilters} className="flex-1 md:flex-none">
                应用过滤器
              </Button>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  清除过滤器
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State After Filtering */}
      {images.length === 0 && hasActiveFilters && (
        <EmptyState
          icon={Filter}
          title="未找到匹配的记录"
          description="尝试调整过滤条件或清除过滤器"
          action={
            <Button onClick={clearFilters} variant="outline">
              清除过滤器
            </Button>
          }
        />
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <Card
                key={image.id}
                className="group animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  {/* Generated Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.generatedImageUrl}
                    alt={image.prompt.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Reference Thumbnail Overlay */}
                  {image.referenceImageUrl && (
                    <div className="absolute top-2 right-2 w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.referenceImageUrl}
                        alt="参考图"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDownload(image.generatedImageUrl, image.prompt.name)}
                        aria-label="下载图片"
                      >
                        <Download className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      {image.prompt.name}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {image.prompt.content}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center" title="生成时间">
                        <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                        <time dateTime={new Date(image.createdAt).toISOString()}>
                          {formatDate(image.createdAt)}
                        </time>
                      </div>
                      <div className="flex items-center" title="消耗令牌">
                        <Coins className="h-3 w-3 mr-1" aria-hidden="true" />
                        <span>{image.tokenCost}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center py-8">
              <Button
                onClick={loadMore}
                variant="outline"
                size="lg"
                disabled={isLoading}
                aria-label="加载更多"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    加载中...
                  </>
                ) : (
                  '加载更多'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
