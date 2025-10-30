import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const ITEMS_PER_PAGE = 12

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const cursor = searchParams.get('cursor')
    const prompt = searchParams.get('prompt')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

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

    // Fetch paginated data
    const images = await prisma.generatedImage.findMany({
      where,
      take: ITEMS_PER_PAGE + 1,
      ...(cursor && {
        skip: 1,
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

    const hasMore = images.length > ITEMS_PER_PAGE
    const displayImages = hasMore ? images.slice(0, ITEMS_PER_PAGE) : images

    return NextResponse.json({
      images: displayImages,
      hasMore,
      nextCursor: hasMore ? displayImages[displayImages.length - 1].id : null,
    })
  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}
