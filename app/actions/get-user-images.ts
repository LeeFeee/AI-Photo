'use server'

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export interface UserImage {
  id: string
  imageUrl: string
  promptTitle: string
  createdAt: string
  status: string
}

export interface GetUserImagesResponse {
  success: boolean
  images?: UserImage[]
  error?: string
}

/**
 * Get all generated images for the current user
 */
export async function getUserImages(): Promise<GetUserImagesResponse> {
  try {
    const userId = process.env.DEMO_USER_ID || 'demo-user-123'

    const generatedImages = await prisma.generatedImage.findMany({
      where: {
        userId,
        status: 'completed',
      },
      include: {
        prompt: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const images: UserImage[] = generatedImages.map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      promptTitle: img.prompt.title,
      createdAt: img.createdAt.toISOString(),
      status: img.status,
    }))

    logger.info('Retrieved user images', { userId, count: images.length })

    return {
      success: true,
      images,
    }
  } catch (error) {
    logger.error('Failed to retrieve user images', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })

    return {
      success: false,
      error: '获取图片列表失败',
    }
  }
}
