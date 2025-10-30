/**
 * 预签名上传 URL API 路由
 * POST /api/uploads/presign
 * 
 * 为已认证用户生成预签名上传 URL
 * 支持直接上传到 Cloudflare R2 / AWS S3
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  createPresignedUploadUrl,
  validateFileSize,
  validateFileType,
  isStorageConfigured,
  getUploadLimits,
} from '@/lib/storage'

/**
 * 请求体类型
 */
interface PresignRequest {
  fileName: string
  fileType: string
  fileSize: number
  folder?: 'references' | 'prompts' | 'temp'
}

/**
 * 简单的认证检查
 * 注意：这是一个占位实现。在实际生产环境中，应该：
 * 1. 使用真实的会话/JWT 令牌验证
 * 2. 从会话中获取真实的用户 ID
 * 3. 验证用户权限
 */
function authenticateRequest(request: NextRequest): { authenticated: boolean; userId?: string } {
  // 检查是否有授权头（示例：Bearer token）
  const authHeader = request.headers.get('authorization')
  
  // 临时实现：如果有授权头，视为已认证
  // 实际应该验证 JWT 或会话 cookie
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // 在实际应用中，这里应该解析和验证 token
    // 并返回真实的用户 ID
    return {
      authenticated: true,
      userId: 'demo-user', // 临时用户 ID
    }
  }

  // 检查会话 cookie（临时实现）
  const sessionCookie = request.cookies.get('session')
  if (sessionCookie) {
    return {
      authenticated: true,
      userId: 'demo-user',
    }
  }

  // 开发模式：允许无认证访问（便于测试）
  if (process.env.NODE_ENV === 'development') {
    return {
      authenticated: true,
      userId: 'dev-user',
    }
  }

  return { authenticated: false }
}

/**
 * POST /api/uploads/presign
 * 生成预签名上传 URL
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 检查存储配置
    if (!isStorageConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: '存储服务未配置',
          message: '请联系管理员配置云存储',
        },
        { status: 503 }
      )
    }

    // 2. 认证检查
    const { authenticated, userId } = authenticateRequest(request)
    if (!authenticated || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: '未授权',
          message: '请先登录',
        },
        { status: 401 }
      )
    }

    // 3. 解析请求体
    let body: PresignRequest
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: '无效的请求',
          message: '请求格式错误',
        },
        { status: 400 }
      )
    }

    const { fileName, fileType, fileSize, folder = 'temp' } = body

    // 4. 验证必需字段
    if (!fileName || !fileType || !fileSize) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必需字段',
          message: '请提供文件名、类型和大小',
        },
        { status: 400 }
      )
    }

    // 5. 验证文件类型
    const typeValidation = validateFileType(fileType)
    if (!typeValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: '文件类型不支持',
          message: typeValidation.error,
          limits: getUploadLimits(),
        },
        { status: 400 }
      )
    }

    // 6. 验证文件大小
    const sizeValidation = validateFileSize(fileSize)
    if (!sizeValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: '文件太大',
          message: sizeValidation.error,
          limits: getUploadLimits(),
        },
        { status: 400 }
      )
    }

    // 7. 生成预签名 URL
    const presignedData = await createPresignedUploadUrl(
      userId,
      fileName,
      fileType,
      folder,
      3600 // 1 小时过期
    )

    // 8. 返回成功响应
    return NextResponse.json(
      {
        success: true,
        data: presignedData,
        limits: getUploadLimits(),
      },
      { status: 200 }
    )
  } catch (error) {
    // 错误处理
    console.error('预签名 URL 生成错误:', error)
    
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    
    return NextResponse.json(
      {
        success: false,
        error: '服务器错误',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/uploads/presign
 * 获取上传限制信息
 */
export async function GET() {
  try {
    const limits = getUploadLimits()
    const configured = isStorageConfigured()

    return NextResponse.json(
      {
        success: true,
        configured,
        limits,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: '服务器错误',
      },
      { status: 500 }
    )
  }
}
