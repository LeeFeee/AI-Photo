'use server'

import { prisma } from '@/lib/prisma'
import { generateImage } from '@/lib/gemini'
import { logger, metrics } from '@/lib/logger'

export interface GenerateImageInput {
  promptId: string
  referenceImage?: string // base64 encoded
}

export interface GenerateImageResponse {
  success: boolean
  data?: {
    id: string
    imageUrl: string
    promptTitle: string
    tokensUsed: number
    remainingTokens: number
  }
  error?: string
  errorCode?: 'INSUFFICIENT_TOKENS' | 'PROMPT_NOT_FOUND' | 'MEMBERSHIP_REQUIRED' | 'GENERATION_FAILED' | 'UNKNOWN'
}

/**
 * Server action to generate an image
 * This orchestrates the entire flow:
 * 1. Verify user authentication
 * 2. Fetch prompt and check membership requirements
 * 3. Check token balance
 * 4. Call Gemini service
 * 5. Store generated image
 * 6. Create transaction record
 * 7. Deduct tokens atomically
 */
export async function generateImageAction(
  input: GenerateImageInput
): Promise<GenerateImageResponse> {
  const startTime = Date.now()
  
  try {
    // For demo purposes, we're using a hardcoded user ID
    // In production, you would get this from the authenticated session
    const userId = process.env.DEMO_USER_ID || 'demo-user-123'

    logger.info('Starting image generation', { userId, promptId: input.promptId })

    // Step 1: Fetch user and prompt in parallel
    const [user, prompt] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
      }),
      prisma.prompt.findUnique({
        where: { id: input.promptId },
      }),
    ])

    if (!user) {
      logger.error('User not found', { userId })
      return {
        success: false,
        error: '用户未找到',
        errorCode: 'UNKNOWN',
      }
    }

    if (!prompt) {
      logger.error('Prompt not found', { promptId: input.promptId })
      return {
        success: false,
        error: '提示词不存在',
        errorCode: 'PROMPT_NOT_FOUND',
      }
    }

    // Step 2: Check membership requirements
    if (prompt.membersOnly && !user.isMember) {
      logger.warn('Membership required', { promptTitle: prompt.title, userId })
      return {
        success: false,
        error: '该提示词需要会员权限',
        errorCode: 'MEMBERSHIP_REQUIRED',
      }
    }

    // Step 3: Check token balance
    if (user.tokens < prompt.tokenCost) {
      logger.warn('Insufficient tokens', { 
        required: prompt.tokenCost, 
        available: user.tokens,
        userId 
      })
      return {
        success: false,
        error: `代币余额不足。需要 ${prompt.tokenCost} 代币，当前余额 ${user.tokens} 代币`,
        errorCode: 'INSUFFICIENT_TOKENS',
      }
    }

    logger.info('Token check passed', { cost: prompt.tokenCost, balance: user.tokens })

    // Step 4: Call Gemini service to generate image
    logger.info('Calling Gemini service', { promptTitle: prompt.title })
    const generationResult = await generateImage({
      prompt: prompt.content,
      referenceImage: input.referenceImage,
    })

    if (!generationResult.success || !generationResult.imageUrl) {
      logger.error('Image generation failed', { error: generationResult.error })
      return {
        success: false,
        error: generationResult.error || '图片生成失败',
        errorCode: 'GENERATION_FAILED',
      }
    }

    logger.info('Image generated successfully')

    // Step 5: Use Prisma transaction to atomically:
    // - Create GeneratedImage record
    // - Create Transaction record
    // - Deduct user tokens
    const result = await prisma.$transaction(async (tx) => {
      // Create generated image record
      const generatedImage = await tx.generatedImage.create({
        data: {
          userId: user.id,
          promptId: prompt.id,
          imageUrl: generationResult.imageUrl!,
          referenceUrl: input.referenceImage || null,
          status: 'completed',
          metadata: JSON.stringify({
            promptTitle: prompt.title,
            tokenCost: prompt.tokenCost,
            generatedAt: new Date().toISOString(),
          }),
        },
      })

      // Calculate new balance
      const newBalance = user.tokens - prompt.tokenCost

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: 'token_consumption',
          amount: -prompt.tokenCost,
          balance: newBalance,
          status: 'completed',
          description: `生成图片：${prompt.title}`,
          metadata: JSON.stringify({
            promptId: prompt.id,
            promptTitle: prompt.title,
            generatedImageId: generatedImage.id,
          }),
        },
      })

      // Update user tokens
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { tokens: newBalance },
      })

      return { generatedImage, updatedUser }
    })

    const duration = Date.now() - startTime
    logger.info('Image generation completed successfully', {
      duration,
      newBalance: result.updatedUser.tokens,
      imageId: result.generatedImage.id,
    })
    metrics.trackDuration('image_generation.success', duration, {
      promptId: prompt.id,
      tokenCost: prompt.tokenCost.toString(),
    })

    return {
      success: true,
      data: {
        id: result.generatedImage.id,
        imageUrl: result.generatedImage.imageUrl,
        promptTitle: prompt.title,
        tokensUsed: prompt.tokenCost,
        remainingTokens: result.updatedUser.tokens,
      },
    }
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error('Image generation failed', {
      duration,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    metrics.trackDuration('image_generation.failed', duration)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : '生成图片时发生未知错误',
      errorCode: 'UNKNOWN',
    }
  }
}

/**
 * Get user's current token balance
 */
export async function getUserTokenBalance(): Promise<{
  success: boolean
  tokens?: number
  isMember?: boolean
  error?: string
}> {
  try {
    const userId = process.env.DEMO_USER_ID || 'demo-user-123'
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tokens: true, isMember: true },
    })

    if (!user) {
      return {
        success: false,
        error: '用户未找到',
      }
    }

    return {
      success: true,
      tokens: user.tokens,
      isMember: user.isMember,
    }
  } catch (error) {
    console.error('[GetBalance] Error:', error)
    return {
      success: false,
      error: '获取余额失败',
    }
  }
}

/**
 * Get available prompts for the user
 */
export async function getAvailablePrompts(): Promise<{
  success: boolean
  prompts?: Array<{
    id: string
    title: string
    description: string | null
    category: string | null
    tokenCost: number
    membersOnly: boolean
  }>
  error?: string
}> {
  try {
    const userId = process.env.DEMO_USER_ID || 'demo-user-123'
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isMember: true },
    })

    if (!user) {
      return {
        success: false,
        error: '用户未找到',
      }
    }

    // Get all prompts, filter by membership on client side if needed
    const prompts = await prisma.prompt.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        tokenCost: true,
        membersOnly: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return {
      success: true,
      prompts,
    }
  } catch (error) {
    console.error('[GetPrompts] Error:', error)
    return {
      success: false,
      error: '获取提示词失败',
    }
  }
}
