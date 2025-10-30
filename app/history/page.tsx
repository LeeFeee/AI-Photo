import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSEO } from '@/lib/seo'
import { HistoryGallery } from './components/history-gallery'

export const dynamic = 'force-dynamic'

export const metadata = generateSEO({
  title: '生成历史',
  description: '查看您的 AI 图片生成历史记录，包括元数据和下载选项',
  path: '/history',
})

interface SearchParams {
  cursor?: string
  prompt?: string
  startDate?: string
  endDate?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

const ITEMS_PER_PAGE = 12

export default async function HistoryPage({ searchParams }: PageProps) {
  // Check authentication
  const user = await getCurrentUser()
  if (!user) {
    redirect('/') // In production, redirect to login page
  }

  const params = await searchParams
  const { cursor, prompt, startDate, endDate } = params

  // Build filter conditions
  const where: any = {
    userId: user.id,
  }

  if (prompt) {
    where.prompt = {
      name: {
        contains: prompt,
      },
    }
  }

  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) {
      where.createdAt.gte = new Date(startDate)
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate)
    }
  }

  // Fetch paginated data with cursor-based pagination
  const images = await prisma.generatedImage.findMany({
    where,
    take: ITEMS_PER_PAGE + 1, // Fetch one extra to check if there are more
    ...(cursor && {
      skip: 1, // Skip the cursor
      cursor: {
        id: cursor,
      },
    }),
    include: {
      prompt: {
        select: {
          name: true,
          content: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Check if there are more items
  const hasMore = images.length > ITEMS_PER_PAGE
  const displayImages = hasMore ? images.slice(0, ITEMS_PER_PAGE) : images

  // Get total count for display
  const totalCount = await prisma.generatedImage.count({
    where: {
      userId: user.id,
    },
  })

  return (
    <HistoryGallery
      images={displayImages}
      hasMore={hasMore}
      nextCursor={hasMore ? displayImages[displayImages.length - 1].id : null}
      totalCount={totalCount}
      currentFilters={{ prompt, startDate, endDate }}
    />
  )
}
