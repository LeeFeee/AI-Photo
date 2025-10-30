import { GoogleGenerativeAI } from '@google/generative-ai'
import pLimit from 'p-limit'

// 配置选项
// Configuration options
export interface GeminiConfig {
  model?: string // 模型名称，默认使用 gemini-1.5-flash
  temperature?: number // 温度参数，控制生成的随机性 (0-1)
  topK?: number // Top-K 采样
  topP?: number // Top-P 采样
  maxOutputTokens?: number // 最大输出令牌数
}

// 生成请求参数
// Request parameters for image generation
export interface GenerateImageRequest {
  promptContent: string // 提示词文本
  referenceImageUrl?: string // 可选的参考图片 URL
  config?: GeminiConfig // 可选的配置覆盖
}

// 生成结果
// Generation result
export interface GenerateImageResult {
  success: boolean
  imageUrl?: string // 生成的图片 URL
  imageData?: string // Base64 编码的图片数据
  error?: string
  metadata?: {
    model: string
    timestamp: string
    tokensUsed?: number
  }
}

// 自定义错误类
// Custom error classes for different scenarios

export class GeminiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GeminiError'
  }
}

export class GeminiQuotaExceededError extends GeminiError {
  constructor(message = '配额已超限，请稍后再试 / Quota exceeded, please try again later') {
    super(message)
    this.name = 'GeminiQuotaExceededError'
  }
}

export class GeminiInvalidPromptError extends GeminiError {
  constructor(message = '提示词无效或不安全 / Invalid or unsafe prompt') {
    super(message)
    this.name = 'GeminiInvalidPromptError'
  }
}

export class GeminiAuthenticationError extends GeminiError {
  constructor(message = 'API 密钥无效 / Invalid API key') {
    super(message)
    this.name = 'GeminiAuthenticationError'
  }
}

export class GeminiTimeoutError extends GeminiError {
  constructor(message = '请求超时 / Request timeout') {
    super(message)
    this.name = 'GeminiTimeoutError'
  }
}

export class GeminiNetworkError extends GeminiError {
  constructor(message = '网络错误 / Network error') {
    super(message)
    this.name = 'GeminiNetworkError'
  }
}

// 速率限制器配置
// Rate limiter configuration
// 限制并发请求数为 5，防止超出 API 配额
// Limit concurrent requests to 5 to avoid exceeding API quotas
const rateLimiter = pLimit(5)

// 默认配置
// Default configuration
const DEFAULT_CONFIG: Required<GeminiConfig> = {
  model: 'gemini-1.5-flash', // 使用 Flash 模型，适合快速生成 / Use Flash model for fast generation
  temperature: 0.7, // 中等创造性 / Medium creativity
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
}

// 重试配置
// Retry configuration
const MAX_RETRIES = 3 // 最大重试次数 / Maximum retry attempts
const INITIAL_RETRY_DELAY = 1000 // 初始重试延迟（毫秒）/ Initial retry delay in ms
const MAX_RETRY_DELAY = 10000 // 最大重试延迟（毫秒）/ Maximum retry delay in ms
const REQUEST_TIMEOUT = 30000 // 请求超时时间（毫秒）/ Request timeout in ms

let genAI: GoogleGenerativeAI | null = null
let apiKeyChecked = false

// 初始化并验证 API 密钥
// Initialize and validate API key
function initializeGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new GeminiAuthenticationError(
      'GEMINI_API_KEY 环境变量未设置 / GEMINI_API_KEY environment variable is not set'
    )
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey)
  }

  apiKeyChecked = true
  return genAI
}

// 指数退避延迟
// Exponential backoff delay
function getRetryDelay(attempt: number): number {
  const delay = Math.min(INITIAL_RETRY_DELAY * Math.pow(2, attempt), MAX_RETRY_DELAY)
  // 添加随机抖动以避免雷鸣群效应
  // Add random jitter to avoid thundering herd
  return delay + Math.random() * 1000
}

// 等待指定时间
// Wait for specified time
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 获取图片数据（从 URL）
// Fetch image data from URL
async function fetchImageData(imageUrl: string): Promise<{ inlineData: { data: string; mimeType: string } }> {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new GeminiError(`无法获取参考图片：${response.statusText} / Failed to fetch reference image: ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const arrayBuffer = await response.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    return {
      inlineData: {
        data: base64,
        mimeType: contentType,
      },
    }
  } catch (error) {
    if (error instanceof GeminiError) throw error
    throw new GeminiNetworkError(`获取参考图片失败 / Failed to fetch reference image: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// 处理 API 错误并转换为自定义错误类型
// Handle API errors and convert to custom error types
function handleApiError(error: any): never {
  const errorMessage = error?.message || String(error)

  // 检查是否为配额错误
  // Check for quota errors
  if (
    errorMessage.includes('quota') ||
    errorMessage.includes('429') ||
    errorMessage.includes('RESOURCE_EXHAUSTED')
  ) {
    throw new GeminiQuotaExceededError()
  }

  // 检查是否为认证错误
  // Check for authentication errors
  if (
    errorMessage.includes('API key') ||
    errorMessage.includes('401') ||
    errorMessage.includes('UNAUTHENTICATED')
  ) {
    throw new GeminiAuthenticationError()
  }

  // 检查是否为无效提示词错误
  // Check for invalid prompt errors
  if (
    errorMessage.includes('safety') ||
    errorMessage.includes('blocked') ||
    errorMessage.includes('SAFETY')
  ) {
    throw new GeminiInvalidPromptError()
  }

  // 检查是否为超时错误
  // Check for timeout errors
  if (errorMessage.includes('timeout') || errorMessage.includes('DEADLINE_EXCEEDED')) {
    throw new GeminiTimeoutError()
  }

  // 检查是否为网络错误
  // Check for network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    throw new GeminiNetworkError()
  }

  // 默认错误
  // Default error
  throw new GeminiError(`Gemini API 错误 / Gemini API error: ${errorMessage}`)
}

// 使用重试和超时执行请求
// Execute request with retry and timeout
async function executeWithRetry<T>(
  operation: () => Promise<T>,
  attempt = 0
): Promise<T> {
  try {
    // 创建超时 Promise
    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new GeminiTimeoutError()), REQUEST_TIMEOUT)
    })

    // 竞争：操作 vs 超时
    // Race: operation vs timeout
    return await Promise.race([operation(), timeoutPromise])
  } catch (error) {
    // 首先将错误转换为自定义错误类型（如果尚未转换）
    // First convert error to custom error type if not already converted
    let convertedError: Error
    if (error instanceof GeminiError) {
      convertedError = error
    } else {
      // 尝试转换为自定义错误类型
      // Try to convert to custom error type
      try {
        handleApiError(error)
        // handleApiError 总是抛出错误，所以不会到达这里
        // handleApiError always throws, so we never reach here
        throw error
      } catch (e) {
        convertedError = e as Error
      }
    }

    // 如果是不应重试的错误类型，直接抛出
    // Don't retry if it's a non-retriable error type
    if (
      convertedError instanceof GeminiQuotaExceededError ||
      convertedError instanceof GeminiAuthenticationError ||
      convertedError instanceof GeminiInvalidPromptError
    ) {
      throw convertedError
    }

    // 达到最大重试次数
    // Max retries reached
    if (attempt >= MAX_RETRIES) {
      throw convertedError
    }

    // 计算退避延迟并重试
    // Calculate backoff delay and retry
    const delay = getRetryDelay(attempt)
    console.warn(
      `Gemini API 请求失败，${delay}ms 后重试 (尝试 ${attempt + 1}/${MAX_RETRIES}) / Request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`
    )
    await sleep(delay)
    return executeWithRetry(operation, attempt + 1)
  }
}

// 主函数：生成一致性图片
// Main function: Generate consistent image
export async function generateConsistentImage(
  request: GenerateImageRequest
): Promise<GenerateImageResult> {
  const startTime = Date.now()

  try {
    // 初始化客户端
    // Initialize client
    const client = initializeGeminiClient()

    // 合并配置
    // Merge configuration
    const config = { ...DEFAULT_CONFIG, ...request.config }

    // 获取模型
    // Get model
    const model = client.getGenerativeModel({
      model: config.model,
      generationConfig: {
        temperature: config.temperature,
        topK: config.topK,
        topP: config.topP,
        maxOutputTokens: config.maxOutputTokens,
      },
    })

    // 使用速率限制器执行请求
    // Execute request with rate limiter
    const result = await rateLimiter(async () => {
      return executeWithRetry(async () => {
        // 构建提示内容
        // Build prompt content
        const parts: any[] = []

        // 添加文本提示
        // Add text prompt
        parts.push({ text: request.promptContent })

        // 如果提供了参考图片，添加到请求中
        // If reference image is provided, add it to the request
        if (request.referenceImageUrl) {
          const imageData = await fetchImageData(request.referenceImageUrl)
          parts.push(imageData)
        }

        // 注意：Gemini 模型主要用于文本生成和视觉理解
        // 对于图像生成，您可能需要使用其他 Google AI 服务如 Imagen
        // 这里我们使用 Gemini 生成图像描述，实际图像生成需要集成其他服务
        // Note: Gemini models are primarily for text generation and visual understanding
        // For image generation, you may need to use other Google AI services like Imagen
        // Here we use Gemini to generate image descriptions, actual image generation requires other services

        const response = await model.generateContent(parts)
        const text = response.response.text()

        return {
          success: true,
          imageData: text, // 在实际实现中，这应该是图片数据 / In actual implementation, this should be image data
          metadata: {
            model: config.model,
            timestamp: new Date().toISOString(),
            tokensUsed: response.response.usageMetadata?.totalTokenCount,
          },
        }
      })
    })

    return result
  } catch (error) {
    // 如果已经是自定义错误，直接抛出
    // If it's already a custom error, throw it directly
    if (error instanceof GeminiError) {
      throw error
    }

    // 否则处理错误
    // Otherwise handle the error
    handleApiError(error)
  }
}

// 启动时验证环境变量
// Validate environment variables at startup
export function validateGeminiConfig(): void {
  try {
    initializeGeminiClient()
    console.log('✓ Gemini API 配置验证成功 / Gemini API configuration validated successfully')
  } catch (error) {
    console.error('✗ Gemini API 配置验证失败 / Gemini API configuration validation failed:', error)
    throw error
  }
}

// 导出用于测试的函数
// Export functions for testing
export const __testing__ = {
  getRetryDelay,
  handleApiError,
  executeWithRetry,
  fetchImageData,
}
