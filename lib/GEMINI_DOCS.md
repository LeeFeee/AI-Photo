# Gemini Service Layer Documentation

## Overview

The Gemini service layer provides a robust, production-ready interface for interacting with Google's Gemini API for image generation. It includes rate limiting, automatic retries with exponential backoff, comprehensive error handling, and type-safe TypeScript interfaces.

## Features

- ✅ **Type-safe API** - Full TypeScript support with comprehensive interfaces
- ✅ **Rate limiting** - Built-in concurrent request limiting to avoid quota issues
- ✅ **Retry logic** - Automatic retries with exponential backoff for transient errors
- ✅ **Error handling** - Custom error classes for different failure scenarios
- ✅ **Configuration** - Flexible configuration with sensible defaults
- ✅ **Environment validation** - Fast-fail checks for missing API keys at startup
- ✅ **Bilingual comments** - Chinese and English comments for better understanding
- ✅ **Comprehensive tests** - Full test coverage with mocked dependencies

## Installation

The required dependencies are already installed:

```bash
npm install @google/generative-ai p-limit
```

For testing:

```bash
npm install --save-dev vitest @vitest/ui happy-dom
```

## Configuration

### Environment Variables

Create a `.env.local` file in your project root:

```env
# Required: Your Google Gemini API key
GEMINI_API_KEY=your_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

### Model Configuration

The service uses the following default configuration:

```typescript
{
  model: 'gemini-1.5-flash',  // Fast, cost-effective model
  temperature: 0.7,             // Medium creativity (0-1)
  topK: 40,                     // Top-K sampling
  topP: 0.95,                   // Top-P sampling
  maxOutputTokens: 2048         // Maximum response length
}
```

### Rate Limiting

**并发限制 / Concurrent Request Limit**: 5 requests

This prevents exceeding API quotas and ensures stable performance. The limit can be adjusted by modifying the `rateLimiter` configuration in `lib/gemini.ts`.

### Retry Configuration

- **最大重试次数 / Max Retries**: 3
- **初始延迟 / Initial Delay**: 1000ms (1 second)
- **最大延迟 / Max Delay**: 10000ms (10 seconds)
- **请求超时 / Request Timeout**: 30000ms (30 seconds)

Exponential backoff with jitter prevents thundering herd problems.

## Usage

### Basic Usage

```typescript
import { generateConsistentImage } from '@/lib/gemini'

// Simple text prompt
const result = await generateConsistentImage({
  promptContent: 'A serene mountain landscape at sunset with reflections in a calm lake'
})

if (result.success) {
  console.log('Generated image:', result.imageData)
  console.log('Model used:', result.metadata?.model)
  console.log('Tokens used:', result.metadata?.tokensUsed)
}
```

### With Reference Image

```typescript
import { generateConsistentImage } from '@/lib/gemini'

// Use a reference image for style consistency
const result = await generateConsistentImage({
  promptContent: 'Create a similar scene but with autumn colors',
  referenceImageUrl: 'https://example.com/reference-image.jpg'
})
```

### Custom Configuration

```typescript
import { generateConsistentImage } from '@/lib/gemini'

const result = await generateConsistentImage({
  promptContent: 'A futuristic cityscape',
  config: {
    model: 'gemini-1.5-pro',  // Use Pro model for higher quality
    temperature: 0.9,          // Higher creativity
    maxOutputTokens: 4096      // Longer response
  }
})
```

### Error Handling

```typescript
import { 
  generateConsistentImage,
  GeminiQuotaExceededError,
  GeminiAuthenticationError,
  GeminiInvalidPromptError,
  GeminiTimeoutError,
  GeminiNetworkError,
  GeminiError
} from '@/lib/gemini'

try {
  const result = await generateConsistentImage({
    promptContent: 'Your prompt here'
  })
  
  // Handle success
  console.log(result)
} catch (error) {
  if (error instanceof GeminiQuotaExceededError) {
    // 配额已超限 - 显示友好的错误消息
    // Quota exceeded - show friendly error message
    console.error('API quota exceeded. Please try again later.')
  } else if (error instanceof GeminiAuthenticationError) {
    // API 密钥无效 - 检查环境配置
    // Invalid API key - check environment configuration
    console.error('Authentication failed. Check your API key.')
  } else if (error instanceof GeminiInvalidPromptError) {
    // 提示词被安全过滤器拦截
    // Prompt blocked by safety filters
    console.error('Your prompt was blocked by safety filters.')
  } else if (error instanceof GeminiTimeoutError) {
    // 请求超时
    // Request timeout
    console.error('Request timed out. Please try again.')
  } else if (error instanceof GeminiNetworkError) {
    // 网络错误
    // Network error
    console.error('Network error. Check your connection.')
  } else {
    // 其他错误
    // Other errors
    console.error('An unexpected error occurred:', error)
  }
}
```

### API Route Integration Example

```typescript
// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { 
  generateConsistentImage,
  GeminiQuotaExceededError,
  GeminiAuthenticationError,
  GeminiInvalidPromptError,
  GeminiError
} from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, referenceImage } = body

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: '提示词不能为空 / Prompt is required' },
        { status: 400 }
      )
    }

    // Generate image
    const result = await generateConsistentImage({
      promptContent: prompt,
      referenceImageUrl: referenceImage,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof GeminiQuotaExceededError) {
      return NextResponse.json(
        { error: '配额已超限，请稍后再试 / Quota exceeded, please try again later' },
        { status: 429 }
      )
    } else if (error instanceof GeminiAuthenticationError) {
      return NextResponse.json(
        { error: '服务配置错误 / Service configuration error' },
        { status: 500 }
      )
    } else if (error instanceof GeminiInvalidPromptError) {
      return NextResponse.json(
        { error: '提示词无效或不安全 / Invalid or unsafe prompt' },
        { status: 400 }
      )
    } else {
      return NextResponse.json(
        { error: '生成失败 / Generation failed' },
        { status: 500 }
      )
    }
  }
}
```

### Startup Validation

Validate the API key at application startup to fail fast:

```typescript
// app/layout.tsx or a startup script
import { validateGeminiConfig } from '@/lib/gemini'

// Server-side only
if (typeof window === 'undefined') {
  validateGeminiConfig()
}
```

Or in a Next.js middleware or instrumentation file:

```typescript
// instrumentation.ts (Next.js 13.2+)
export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateGeminiConfig } = require('./lib/gemini')
    validateGeminiConfig()
  }
}
```

## API Reference

### Types

#### `GeminiConfig`

```typescript
interface GeminiConfig {
  model?: string              // Model name, default: 'gemini-1.5-flash'
  temperature?: number        // Temperature (0-1), default: 0.7
  topK?: number              // Top-K sampling, default: 40
  topP?: number              // Top-P sampling, default: 0.95
  maxOutputTokens?: number   // Max output tokens, default: 2048
}
```

#### `GenerateImageRequest`

```typescript
interface GenerateImageRequest {
  promptContent: string           // Text prompt (required)
  referenceImageUrl?: string      // Optional reference image URL
  config?: GeminiConfig          // Optional configuration override
}
```

#### `GenerateImageResult`

```typescript
interface GenerateImageResult {
  success: boolean
  imageUrl?: string              // Generated image URL (if available)
  imageData?: string             // Base64 encoded image data or text
  error?: string                 // Error message (if failed)
  metadata?: {
    model: string                // Model used
    timestamp: string            // ISO timestamp
    tokensUsed?: number          // Tokens consumed
  }
}
```

### Functions

#### `generateConsistentImage(request: GenerateImageRequest): Promise<GenerateImageResult>`

Main function to generate images using Gemini API.

**Parameters:**
- `request`: Generation request with prompt and optional reference image

**Returns:**
- Promise resolving to `GenerateImageResult`

**Throws:**
- `GeminiQuotaExceededError`: API quota exceeded
- `GeminiAuthenticationError`: Invalid API key
- `GeminiInvalidPromptError`: Prompt blocked by safety filters
- `GeminiTimeoutError`: Request timeout
- `GeminiNetworkError`: Network error
- `GeminiError`: Other errors

#### `validateGeminiConfig(): void`

Validates the Gemini API configuration at startup.

**Throws:**
- `GeminiAuthenticationError`: If `GEMINI_API_KEY` is not set

### Error Classes

All error classes extend `GeminiError`, which extends the built-in `Error` class:

- **`GeminiError`**: Base error class
- **`GeminiQuotaExceededError`**: API quota exceeded (429, RESOURCE_EXHAUSTED)
- **`GeminiAuthenticationError`**: Invalid API key (401, UNAUTHENTICATED)
- **`GeminiInvalidPromptError`**: Content blocked by safety filters
- **`GeminiTimeoutError`**: Request timeout
- **`GeminiNetworkError`**: Network connection issues

## Testing

Run the test suite:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Cost Considerations

### Model Pricing (as of 2024)

**Gemini 1.5 Flash** (recommended for most use cases):
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens
- Very fast, cost-effective

**Gemini 1.5 Pro**:
- Input: $1.25 per 1M tokens
- Output: $5.00 per 1M tokens
- Higher quality, slower

### Cost Optimization Tips

1. **Use Flash model** for most requests (default)
2. **Limit concurrent requests** (already configured)
3. **Monitor token usage** via `result.metadata.tokensUsed`
4. **Implement caching** for repeated prompts
5. **Set reasonable `maxOutputTokens`** to avoid excessive costs

### Quota Limits

Free tier limits (check Google AI Studio for current limits):
- 60 requests per minute
- Daily request limits apply

Production tier:
- Higher rate limits available
- Pay-as-you-go pricing

## Important Notes

### Image Generation Limitation

⚠️ **Note**: Gemini models (as of this writing) are primarily designed for **text generation and vision understanding**, not direct image generation.

For actual image generation, you should:

1. Use Gemini to generate detailed image descriptions
2. Pass those descriptions to an image generation service like:
   - Google's Imagen API
   - Stability AI (Stable Diffusion)
   - DALL-E 3 via OpenAI
   - Midjourney API

The current implementation returns text output from Gemini. You'll need to integrate with an actual image generation service for the final step.

### Example Integration with Image Generation Service

```typescript
import { generateConsistentImage } from '@/lib/gemini'
import { generateImageFromDescription } from '@/lib/imagen' // Example

async function generateImage(userPrompt: string) {
  // Step 1: Use Gemini to create a detailed, optimized description
  const geminiResult = await generateConsistentImage({
    promptContent: `Create a detailed image generation prompt based on: ${userPrompt}`
  })
  
  // Step 2: Use the description to generate actual image
  const imageResult = await generateImageFromDescription(
    geminiResult.imageData || ''
  )
  
  return imageResult
}
```

## Troubleshooting

### API Key Issues

```bash
# Error: GEMINI_API_KEY environment variable is not set
# Solution: Create .env.local with your API key
echo "GEMINI_API_KEY=your_key_here" > .env.local
```

### Quota Errors

If you encounter `GeminiQuotaExceededError`:
1. Check your API quota in Google AI Studio
2. Reduce concurrent request limit in code
3. Implement request caching
4. Consider upgrading to paid tier

### Timeout Issues

If requests timeout frequently:
1. Increase `REQUEST_TIMEOUT` in `lib/gemini.ts`
2. Use a faster model (Flash instead of Pro)
3. Reduce `maxOutputTokens`
4. Check network connectivity

## Future Enhancements

- [ ] Response caching with TTL
- [ ] Request deduplication
- [ ] Batch request support
- [ ] Streaming responses
- [ ] Image generation service integration
- [ ] Metrics and monitoring
- [ ] Request queuing for rate limit management
- [ ] Cost tracking per request

## References

- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google Generative AI SDK](https://github.com/google/generative-ai-js)
- [Rate Limiting Best Practices](https://cloud.google.com/apis/design/design_patterns#rate_limiting)

## Support

For issues or questions:
1. Check the [Gemini API Documentation](https://ai.google.dev/docs)
2. Review test cases in `lib/gemini.test.ts`
3. Check error messages and types
4. Review this documentation

---

**Last Updated**: 2024
**Version**: 1.0.0
