/**
 * 云存储工具 - Cloudflare R2 / AWS S3
 * 提供预签名 URL 生成和文件上传管理功能
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// 存储配置
const storageConfig = {
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  endpoint: process.env.R2_ENDPOINT || '',
  region: process.env.R2_REGION || 'auto',
  bucketName: process.env.R2_BUCKET_NAME || '',
  publicUrl: process.env.R2_PUBLIC_URL || '',
}

// 上传限制配置
const uploadLimits = {
  maxSize: parseInt(process.env.MAX_UPLOAD_SIZE || '5242880', 10), // 默认 5MB
  allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(','),
}

// 初始化 S3 客户端
let s3Client: S3Client | null = null

/**
 * 获取 S3 客户端实例（单例模式）
 */
function getS3Client(): S3Client {
  if (!s3Client) {
    if (!storageConfig.accessKeyId || !storageConfig.secretAccessKey || !storageConfig.endpoint) {
      throw new Error('存储配置不完整，请检查环境变量')
    }

    s3Client = new S3Client({
      region: storageConfig.region,
      endpoint: storageConfig.endpoint,
      credentials: {
        accessKeyId: storageConfig.accessKeyId,
        secretAccessKey: storageConfig.secretAccessKey,
      },
    })
  }
  return s3Client
}

/**
 * 文件验证结果
 */
export interface FileValidationResult {
  valid: boolean
  error?: string
}

/**
 * 预签名 URL 响应
 */
export interface PresignedUploadData {
  uploadUrl: string
  key: string
  publicUrl: string
  expiresIn: number
}

/**
 * 验证文件类型
 */
export function validateFileType(fileType: string): FileValidationResult {
  if (!uploadLimits.allowedTypes.includes(fileType)) {
    return {
      valid: false,
      error: `不支持的文件类型。允许的类型：${uploadLimits.allowedTypes.join(', ')}`,
    }
  }
  return { valid: true }
}

/**
 * 验证文件大小
 */
export function validateFileSize(fileSize: number): FileValidationResult {
  if (fileSize > uploadLimits.maxSize) {
    const maxSizeMB = (uploadLimits.maxSize / 1024 / 1024).toFixed(2)
    return {
      valid: false,
      error: `文件太大。最大允许大小：${maxSizeMB}MB`,
    }
  }
  return { valid: true }
}

/**
 * 生成文件存储键
 * 格式：{userId}/{timestamp}-{randomString}.{extension}
 */
export function generateFileKey(
  userId: string,
  fileName: string,
  folder: 'references' | 'prompts' | 'temp' = 'temp'
): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = fileName.split('.').pop()?.toLowerCase() || 'jpg'
  
  return `${folder}/${userId}/${timestamp}-${randomString}.${extension}`
}

/**
 * 生成预签名上传 URL
 * 允许客户端直接上传到 R2/S3，无需通过服务器传输文件
 */
export async function createPresignedUploadUrl(
  userId: string,
  fileName: string,
  fileType: string,
  folder: 'references' | 'prompts' | 'temp' = 'temp',
  expiresIn: number = 3600 // 默认 1 小时过期
): Promise<PresignedUploadData> {
  // 验证文件类型
  const typeValidation = validateFileType(fileType)
  if (!typeValidation.valid) {
    throw new Error(typeValidation.error)
  }

  // 生成文件键
  const key = generateFileKey(userId, fileName, folder)

  // 创建上传命令
  const command = new PutObjectCommand({
    Bucket: storageConfig.bucketName,
    Key: key,
    ContentType: fileType,
    // 可选：设置元数据
    Metadata: {
      userId,
      uploadedAt: new Date().toISOString(),
    },
  })

  // 生成预签名 URL
  const client = getS3Client()
  const uploadUrl = await getSignedUrl(client, command, { expiresIn })

  // 构建公开访问 URL
  const publicUrl = storageConfig.publicUrl
    ? `${storageConfig.publicUrl}/${key}`
    : `${storageConfig.endpoint}/${storageConfig.bucketName}/${key}`

  return {
    uploadUrl,
    key,
    publicUrl,
    expiresIn,
  }
}

/**
 * 获取上传限制配置（供客户端使用）
 */
export function getUploadLimits() {
  return {
    maxSize: uploadLimits.maxSize,
    maxSizeMB: (uploadLimits.maxSize / 1024 / 1024).toFixed(2),
    allowedTypes: uploadLimits.allowedTypes,
    allowedExtensions: uploadLimits.allowedTypes
      .map(type => type.split('/')[1])
      .filter(Boolean),
  }
}

/**
 * 检查存储配置是否完整
 */
export function isStorageConfigured(): boolean {
  return !!(
    storageConfig.accessKeyId &&
    storageConfig.secretAccessKey &&
    storageConfig.endpoint &&
    storageConfig.bucketName
  )
}
