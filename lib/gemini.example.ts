/**
 * Gemini Service Usage Examples
 * 
 * This file demonstrates how to use the Gemini service layer
 * in various scenarios. These are examples only and should be
 * adapted to your specific use case.
 */

import {
  generateConsistentImage,
  validateGeminiConfig,
  GeminiQuotaExceededError,
  GeminiAuthenticationError,
  GeminiInvalidPromptError,
  GeminiTimeoutError,
  GeminiNetworkError,
} from './gemini'

// Example 1: Basic usage with simple text prompt
async function example1_basicUsage() {
  try {
    const result = await generateConsistentImage({
      promptContent: 'A serene mountain landscape at sunset with reflections in a calm lake',
    })

    if (result.success) {
      console.log('Image generated successfully!')
      console.log('Image data:', result.imageData)
      console.log('Model used:', result.metadata?.model)
      console.log('Tokens used:', result.metadata?.tokensUsed)
    }
  } catch (error) {
    console.error('Failed to generate image:', error)
  }
}

// Example 2: Using a reference image for style consistency
async function example2_withReferenceImage() {
  try {
    const result = await generateConsistentImage({
      promptContent: 'Create a similar scene but with autumn colors and a wooden bridge',
      referenceImageUrl: 'https://example.com/reference-landscape.jpg',
    })

    console.log('Generated consistent image:', result)
  } catch (error) {
    console.error('Generation failed:', error)
  }
}

// Example 3: Custom configuration for higher quality
async function example3_customConfig() {
  try {
    const result = await generateConsistentImage({
      promptContent: 'A futuristic cityscape with flying vehicles and neon lights',
      config: {
        model: 'gemini-1.5-pro', // Use Pro model for higher quality
        temperature: 0.9, // Higher creativity
        maxOutputTokens: 4096, // Allow longer responses
      },
    })

    console.log('High-quality generation:', result)
  } catch (error) {
    console.error('Generation failed:', error)
  }
}

// Example 4: Comprehensive error handling
async function example4_errorHandling() {
  try {
    const result = await generateConsistentImage({
      promptContent: 'Your prompt here',
    })

    // Handle success
    console.log('Success!', result)
  } catch (error) {
    // Handle specific error types with appropriate user messages
    if (error instanceof GeminiQuotaExceededError) {
      console.error('配额已超限 / Quota exceeded')
      console.error('Please try again later or upgrade your plan')
    } else if (error instanceof GeminiAuthenticationError) {
      console.error('认证失败 / Authentication failed')
      console.error('Please check your API key configuration')
    } else if (error instanceof GeminiInvalidPromptError) {
      console.error('提示词无效 / Invalid prompt')
      console.error('Your prompt was blocked by safety filters. Please try a different prompt.')
    } else if (error instanceof GeminiTimeoutError) {
      console.error('请求超时 / Request timeout')
      console.error('The request took too long. Please try again.')
    } else if (error instanceof GeminiNetworkError) {
      console.error('网络错误 / Network error')
      console.error('Please check your internet connection.')
    } else {
      console.error('未知错误 / Unknown error', error)
    }
  }
}

// Example 5: Batch processing with rate limiting (automatic)
async function example5_batchProcessing() {
  const prompts = [
    'A peaceful forest scene',
    'An ocean sunset',
    'A bustling city street',
    'A cozy mountain cabin',
    'A starry night sky',
  ]

  console.log('Processing batch of prompts...')

  // Process all prompts - rate limiting is automatic
  const results = await Promise.allSettled(
    prompts.map((prompt) =>
      generateConsistentImage({
        promptContent: prompt,
      })
    )
  )

  // Check results
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`✓ Prompt ${index + 1} succeeded:`, result.value.metadata)
    } else {
      console.log(`✗ Prompt ${index + 1} failed:`, result.reason.message)
    }
  })
}

// Example 6: Validate configuration at startup
async function example6_startupValidation() {
  console.log('Validating Gemini API configuration...')

  try {
    validateGeminiConfig()
    console.log('✓ Configuration is valid')
  } catch (error) {
    console.error('✗ Configuration validation failed:', error)
    process.exit(1)
  }
}

// Example 7: API Route integration (Next.js App Router)
/**
 * File: app/api/generate/route.ts
 */
/*
import { NextRequest, NextResponse } from 'next/server'
import { 
  generateConsistentImage,
  GeminiQuotaExceededError,
  GeminiAuthenticationError,
  GeminiInvalidPromptError,
  GeminiTimeoutError,
  GeminiNetworkError,
} from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, referenceImage, config } = body

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: '提示词不能为空 / Prompt is required' },
        { status: 400 }
      )
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: '提示词过长 / Prompt is too long (max 1000 characters)' },
        { status: 400 }
      )
    }

    // Generate image
    const result = await generateConsistentImage({
      promptContent: prompt,
      referenceImageUrl: referenceImage,
      config,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Image generation error:', error)

    // Map errors to appropriate HTTP responses
    if (error instanceof GeminiQuotaExceededError) {
      return NextResponse.json(
        { 
          error: '配额已超限，请稍后再试 / Quota exceeded, please try again later',
          code: 'QUOTA_EXCEEDED'
        },
        { status: 429 }
      )
    } else if (error instanceof GeminiAuthenticationError) {
      return NextResponse.json(
        { 
          error: '服务配置错误 / Service configuration error',
          code: 'AUTH_ERROR'
        },
        { status: 500 }
      )
    } else if (error instanceof GeminiInvalidPromptError) {
      return NextResponse.json(
        { 
          error: '提示词无效或不安全 / Invalid or unsafe prompt',
          code: 'INVALID_PROMPT'
        },
        { status: 400 }
      )
    } else if (error instanceof GeminiTimeoutError) {
      return NextResponse.json(
        { 
          error: '请求超时，请重试 / Request timeout, please retry',
          code: 'TIMEOUT'
        },
        { status: 504 }
      )
    } else if (error instanceof GeminiNetworkError) {
      return NextResponse.json(
        { 
          error: '网络错误，请重试 / Network error, please retry',
          code: 'NETWORK_ERROR'
        },
        { status: 503 }
      )
    } else {
      return NextResponse.json(
        { 
          error: '生成失败 / Generation failed',
          code: 'UNKNOWN_ERROR'
        },
        { status: 500 }
      )
    }
  }
}
*/

// Example 8: Frontend integration (React component)
/**
 * File: components/ImageGenerator.tsx
 */
/*
'use client'

import { useState } from 'react'

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        disabled={loading}
      />
      <button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
        {loading ? '生成中... / Generating...' : '生成图片 / Generate Image'}
      </button>

      {error && <div className="error">{error}</div>}
      {result && (
        <div className="result">
          <p>Generated successfully!</p>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
*/

// Run examples (uncomment to test)
// example1_basicUsage()
// example2_withReferenceImage()
// example3_customConfig()
// example4_errorHandling()
// example5_batchProcessing()
// example6_startupValidation()
