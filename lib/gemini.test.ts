import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  generateConsistentImage,
  validateGeminiConfig,
  GeminiQuotaExceededError,
  GeminiAuthenticationError,
  GeminiInvalidPromptError,
  GeminiTimeoutError,
  GeminiNetworkError,
  GeminiError,
  __testing__,
} from './gemini'

// Create mock for generateContent
const mockGenerateContent = vi.fn()

// Mock the Google Generative AI SDK
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class MockGoogleGenerativeAI {
      constructor(apiKey: string) {}
      getGenerativeModel(config: any) {
        return {
          generateContent: mockGenerateContent,
        }
      }
    },
  }
})

// Mock p-limit
vi.mock('p-limit', () => ({
  default: vi.fn((limit: number) => {
    return (fn: () => any) => fn()
  }),
}))

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch as any

describe('Gemini Service', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    process.env = { ...originalEnv }
    process.env.GEMINI_API_KEY = 'test-api-key'
  })

  afterEach(() => {
    vi.useRealTimers()
    process.env = originalEnv
  })

  describe('validateGeminiConfig', () => {
    it('should validate successfully when API key is set', () => {
      expect(() => validateGeminiConfig()).not.toThrow()
    })

    it('should throw GeminiAuthenticationError when API key is missing', () => {
      delete process.env.GEMINI_API_KEY
      expect(() => validateGeminiConfig()).toThrow(GeminiAuthenticationError)
    })
  })

  describe('generateConsistentImage', () => {
    it('should generate image successfully with text prompt only', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => 'Generated image data',
          usageMetadata: { totalTokenCount: 100 },
        },
      })

      const result = await generateConsistentImage({
        promptContent: 'A beautiful sunset over the ocean',
      })

      expect(result.success).toBe(true)
      expect(result.imageData).toBe('Generated image data')
      expect(result.metadata?.tokensUsed).toBe(100)
      expect(result.metadata?.model).toBe('gemini-1.5-flash')
    })

    it('should generate image with reference image URL', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => 'Generated image with reference',
          usageMetadata: { totalTokenCount: 150 },
        },
      })

      // Mock fetch for image
      mockFetch.mockResolvedValue({
        ok: true,
        headers: {
          get: (key: string) => (key === 'content-type' ? 'image/jpeg' : null),
        },
        arrayBuffer: async () => new ArrayBuffer(8),
      } as any)

      const result = await generateConsistentImage({
        promptContent: 'A similar scene',
        referenceImageUrl: 'https://example.com/image.jpg',
      })

      expect(result.success).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith('https://example.com/image.jpg')
    })

    it('should use custom configuration', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => 'Generated with custom config',
          usageMetadata: { totalTokenCount: 200 },
        },
      })

      const result = await generateConsistentImage({
        promptContent: 'Test prompt',
        config: {
          model: 'gemini-pro',
          temperature: 0.9,
        },
      })

      expect(result.success).toBe(true)
    })

    it('should throw GeminiQuotaExceededError on quota error', async () => {
      mockGenerateContent.mockRejectedValue(
        new Error('RESOURCE_EXHAUSTED: quota exceeded')
      )

      const promise = generateConsistentImage({
        promptContent: 'Test prompt',
      })

      // Fast-forward through retries - quota errors don't retry
      await expect(promise).rejects.toThrow(GeminiQuotaExceededError)
    })

    it('should throw GeminiAuthenticationError on auth error', async () => {
      mockGenerateContent.mockRejectedValue(
        new Error('UNAUTHENTICATED: Invalid API key')
      )

      const promise = generateConsistentImage({
        promptContent: 'Test prompt',
      })

      // Fast-forward through retries - auth errors don't retry
      await expect(promise).rejects.toThrow(GeminiAuthenticationError)
    })

    it('should throw GeminiInvalidPromptError on safety error', async () => {
      mockGenerateContent.mockRejectedValue(
        new Error('SAFETY: Content blocked due to safety settings')
      )

      const promise = generateConsistentImage({
        promptContent: 'Unsafe prompt',
      })

      // Fast-forward through retries - safety errors don't retry
      await expect(promise).rejects.toThrow(GeminiInvalidPromptError)
    })

    it('should throw GeminiNetworkError on network failure', async () => {
      // Use real timers for this test to avoid unhandled rejections
      vi.useRealTimers()

      mockGenerateContent.mockRejectedValue(
        new Error('network error: fetch failed')
      )

      await expect(
        generateConsistentImage({
          promptContent: 'Test prompt',
        })
      ).rejects.toThrow(GeminiNetworkError)

      vi.useFakeTimers()
    })

    it('should handle reference image fetch error', async () => {
      // Use real timers for this test to avoid unhandled rejections
      vi.useRealTimers()

      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      } as any)

      await expect(
        generateConsistentImage({
          promptContent: 'Test prompt',
          referenceImageUrl: 'https://example.com/notfound.jpg',
        })
      ).rejects.toThrow(GeminiError)

      vi.useFakeTimers()
    })
  })

  describe('Error handling utilities', () => {
    it('should classify quota errors correctly', () => {
      expect(() =>
        __testing__.handleApiError(new Error('quota exceeded'))
      ).toThrow(GeminiQuotaExceededError)

      expect(() =>
        __testing__.handleApiError(new Error('429 Too Many Requests'))
      ).toThrow(GeminiQuotaExceededError)
    })

    it('should classify authentication errors correctly', () => {
      expect(() =>
        __testing__.handleApiError(new Error('Invalid API key'))
      ).toThrow(GeminiAuthenticationError)

      expect(() =>
        __testing__.handleApiError(new Error('401 Unauthorized'))
      ).toThrow(GeminiAuthenticationError)
    })

    it('should classify safety errors correctly', () => {
      expect(() =>
        __testing__.handleApiError(new Error('Content blocked by safety filters'))
      ).toThrow(GeminiInvalidPromptError)
    })

    it('should classify timeout errors correctly', () => {
      expect(() =>
        __testing__.handleApiError(new Error('Request timeout'))
      ).toThrow(GeminiTimeoutError)

      expect(() =>
        __testing__.handleApiError(new Error('DEADLINE_EXCEEDED'))
      ).toThrow(GeminiTimeoutError)
    })

    it('should classify network errors correctly', () => {
      expect(() =>
        __testing__.handleApiError(new Error('network error occurred'))
      ).toThrow(GeminiNetworkError)
    })

    it('should handle generic errors', () => {
      expect(() =>
        __testing__.handleApiError(new Error('Unknown error'))
      ).toThrow(GeminiError)
    })
  })

  describe('Retry logic', () => {
    it('should calculate exponential backoff correctly', () => {
      const delay0 = __testing__.getRetryDelay(0)
      const delay1 = __testing__.getRetryDelay(1)
      const delay2 = __testing__.getRetryDelay(2)

      expect(delay0).toBeGreaterThanOrEqual(1000)
      expect(delay0).toBeLessThan(3000)

      expect(delay1).toBeGreaterThanOrEqual(2000)
      expect(delay1).toBeLessThan(5000)

      expect(delay2).toBeGreaterThanOrEqual(4000)
      expect(delay2).toBeLessThan(7000)
    })

    it('should respect maximum retry delay', () => {
      const delay10 = __testing__.getRetryDelay(10)
      expect(delay10).toBeLessThanOrEqual(11000) // MAX_RETRY_DELAY + jitter
    })
  })

  describe('Fetch image data', () => {
    it('should fetch and encode image correctly', async () => {
      const mockArrayBuffer = new Uint8Array([255, 216, 255, 224]).buffer

      mockFetch.mockResolvedValue({
        ok: true,
        headers: {
          get: (key: string) => (key === 'content-type' ? 'image/jpeg' : null),
        },
        arrayBuffer: async () => mockArrayBuffer,
      } as any)

      const result = await __testing__.fetchImageData('https://example.com/test.jpg')

      expect(result.inlineData.mimeType).toBe('image/jpeg')
      expect(result.inlineData.data).toBeTruthy()
      expect(typeof result.inlineData.data).toBe('string')
    })

    it('should handle missing content-type header', async () => {
      const mockArrayBuffer = new Uint8Array([255, 216, 255, 224]).buffer

      mockFetch.mockResolvedValue({
        ok: true,
        headers: {
          get: () => null,
        },
        arrayBuffer: async () => mockArrayBuffer,
      } as any)

      const result = await __testing__.fetchImageData('https://example.com/test.jpg')

      expect(result.inlineData.mimeType).toBe('image/jpeg') // Should default to image/jpeg
    })

    it('should throw error on failed fetch', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      } as any)

      await expect(
        __testing__.fetchImageData('https://example.com/notfound.jpg')
      ).rejects.toThrow(GeminiError)
    })

    it('should throw network error on fetch exception', async () => {
      mockFetch.mockRejectedValue(new Error('Network connection failed'))

      await expect(
        __testing__.fetchImageData('https://example.com/test.jpg')
      ).rejects.toThrow(GeminiNetworkError)
    })
  })
})
