# Library (lib) Directory

This directory contains shared utility functions, services, and helpers used throughout the application.

## Files

### Core Utilities

- **`utils.ts`** - General utility functions (e.g., `cn` for className merging)
- **`analytics.ts`** - Analytics tracking utilities
- **`seo.ts`** - SEO metadata helpers

### Gemini Service Layer

- **`gemini.ts`** - Main Gemini AI service implementation
- **`gemini.test.ts`** - Comprehensive test suite for Gemini service
- **`gemini.example.ts`** - Usage examples and integration patterns
- **`GEMINI_DOCS.md`** - Complete documentation for the Gemini service

## Gemini Service

The Gemini service provides a production-ready interface for interacting with Google's Gemini API.

### Quick Start

```typescript
import { generateConsistentImage } from '@/lib/gemini'

const result = await generateConsistentImage({
  promptContent: 'A beautiful mountain landscape',
})
```

### Key Features

- ✅ **Rate Limiting**: Automatic concurrency control (5 concurrent requests)
- ✅ **Retry Logic**: Exponential backoff with up to 3 retries
- ✅ **Error Handling**: Custom error classes for different failure scenarios
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Timeout Protection**: 30-second request timeout
- ✅ **Configuration**: Flexible configuration with sensible defaults
- ✅ **Testing**: Comprehensive test coverage (22 tests)
- ✅ **Bilingual**: Chinese and English comments throughout

### Configuration

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

### Documentation

See [`GEMINI_DOCS.md`](./GEMINI_DOCS.md) for complete documentation including:

- Detailed API reference
- Usage examples
- Error handling patterns
- Cost considerations
- Troubleshooting guide
- Integration examples

### Examples

See [`gemini.example.ts`](./gemini.example.ts) for practical examples including:

- Basic text prompts
- Reference image usage
- Custom configuration
- Error handling
- Batch processing
- API route integration
- Frontend component integration

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Error Types

The service provides specific error classes for different failure scenarios:

- `GeminiQuotaExceededError` - API quota exceeded
- `GeminiAuthenticationError` - Invalid API key
- `GeminiInvalidPromptError` - Content blocked by safety filters
- `GeminiTimeoutError` - Request timeout
- `GeminiNetworkError` - Network connection issues
- `GeminiError` - Base error class

### Important Notes

⚠️ **Image Generation Limitation**: Gemini models are primarily for text generation and vision understanding, not direct image generation. For actual image generation, you'll need to integrate with services like Imagen, Stable Diffusion, or DALL-E.

The current implementation returns text output from Gemini. You can use this to generate detailed image descriptions and then pass them to an actual image generation service.

### Rate Limits

**并发限制 / Concurrent Limit**: 5 requests

This prevents exceeding API quotas. The service automatically queues requests when the limit is reached.

### Retry Configuration

- **Max Retries**: 3 attempts
- **Initial Delay**: 1 second
- **Max Delay**: 10 seconds
- **Strategy**: Exponential backoff with jitter

Non-retriable errors (quota, auth, safety) fail immediately without retries.

## Adding New Services

When adding new services to this directory:

1. Create the main implementation file (`service.ts`)
2. Create comprehensive tests (`service.test.ts`)
3. Add usage examples (`service.example.ts`)
4. Document thoroughly with both English and Chinese comments
5. Export public APIs from the main file
6. Update this README

## Style Guide

- Use TypeScript for type safety
- Include JSDoc comments for public APIs
- Provide bilingual comments (Chinese + English) for complex logic
- Write comprehensive tests
- Handle errors gracefully
- Use descriptive variable names
- Follow existing code patterns

## Related Documentation

- [Main README](../README.md) - Project overview
- [Testing Guide](../TESTING_GUIDE.md) - How to run tests
- [Gemini Documentation](./GEMINI_DOCS.md) - Complete Gemini service docs
