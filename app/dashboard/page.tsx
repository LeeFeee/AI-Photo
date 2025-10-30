'use client'

import { useState, useEffect } from 'react'
import { ImageIcon, Clock, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { getUserImages, type UserImage } from '@/app/actions/get-user-images'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const [images, setImages] = useState<UserImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadImages() {
      try {
        const result = await getUserImages()
        if (result.success && result.images) {
          setImages(result.images)
        } else {
          toast.error(result.error || '加载图片失败')
        }
      } catch (error) {
        console.error('Error loading images:', error)
        toast.error('加载图片失败')
      } finally {
        setIsLoading(false)
      }
    }

    loadImages()
  }, [])

  const handleDownload = async (imageUrl: string, promptTitle: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${promptTitle}-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('图片下载成功')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('下载失败，请重试')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="animate-fade-in">
        <EmptyState
          icon={ImageIcon}
          title="还没有生成作品"
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            我的作品
          </h1>
          <p className="text-lg text-gray-600">共 {images.length} 张图片</p>
        </div>
        <Button asChild>
          <a href="/generate">生成新图片</a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => {
          const createdDate = new Date(image.createdAt)
          const formattedDate = createdDate.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })

          return (
            <Card
              key={image.id}
              className="group animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.imageUrl}
                  alt={`AI 生成的图片 - ${image.promptTitle}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        handleDownload(image.imageUrl, image.promptTitle)
                      }
                      aria-label="下载图片"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-gray-900 font-medium mb-2 line-clamp-2">
                  {image.promptTitle}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                  <time dateTime={image.createdAt}>{formattedDate}</time>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
