/**
 * 环境变量配置与验证
 * Environment variable configuration and validation
 *
 * 在应用启动时验证必需的环境变量，避免运行时错误
 * Validates required environment variables at application startup to prevent runtime errors
 */

// 服务器端环境变量 / Server-side environment variables
export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,

  // Authentication
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,

  // Clerk (alternative auth)
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,

  // AI APIs
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,

  // Storage - S3
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,

  // Storage - R2 (alternative)
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,

  // Payment
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

  // General
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const

// 客户端环境变量 (必须以 NEXT_PUBLIC_ 开头)
// Client-side environment variables (must start with NEXT_PUBLIC_)
export const publicEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
} as const

/**
 * 验证必需的环境变量
 * Validate required environment variables
 *
 * @param requiredVars - 必需的环境变量键名列表
 * @throws Error - 如果有缺失的环境变量
 */
export function validateEnv(requiredVars: (keyof typeof env | keyof typeof publicEnv)[]): void {
  const missing: string[] = []

  for (const varName of requiredVars) {
    const value = varName.startsWith('NEXT_PUBLIC_')
      ? publicEnv[varName as keyof typeof publicEnv]
      : env[varName as keyof typeof env]

    if (!value) {
      missing.push(varName)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
        `Please check your .env file and ensure all required variables are set.\n` +
        `See .env.example for reference.`
    )
  }
}

/**
 * 检查某个环境变量是否已配置
 * Check if an environment variable is configured
 */
export function hasEnv(varName: keyof typeof env | keyof typeof publicEnv): boolean {
  const value = varName.startsWith('NEXT_PUBLIC_')
    ? publicEnv[varName as keyof typeof publicEnv]
    : env[varName as keyof typeof env]

  return Boolean(value)
}

/**
 * 获取当前环境
 * Get current environment
 */
export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development'
}

export function isProduction(): boolean {
  return env.NODE_ENV === 'production'
}

export function isTest(): boolean {
  return env.NODE_ENV === 'test'
}
