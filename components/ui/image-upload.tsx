/**
 * 图片上传组件
 * 支持拖放、预览、进度显示
 * 包含完整的错误处理和中文提示
 */

'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { Button } from './button'

/**
 * 上传状态
 */
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

/**
 * 上传结果
 */
export interface UploadResult {
  success: boolean
  url?: string
  key?: string
  error?: string
}

/**
 * 组件属性
 */
export interface ImageUploadProps {
  /** 上传完成回调 */
  onUploadComplete?: (result: UploadResult) => void
  /** 文件夹分类（references: 参考图, prompts: 提示词预览, temp: 临时） */
  folder?: 'references' | 'prompts' | 'temp'
  /** 当前图片 URL（用于编辑时显示） */
  currentImageUrl?: string
  /** 自定义类名 */
  className?: string
  /** 是否禁用 */
  disabled?: boolean
}

/**
 * 图片上传组件
 */
export function ImageUpload({
  onUploadComplete,
  folder = 'temp',
  currentImageUrl,
  className = '',
  disabled = false,
}: ImageUploadProps) {
  // 状态管理
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // 引用
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * 清理预览 URL（防止内存泄漏）
   */
  const cleanupPreview = useCallback(() => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  /**
   * 验证文件
   */
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `不支持的文件类型。请上传 JPG、PNG、WebP 或 GIF 格式的图片。`,
      }
    }

    // 检查文件大小（默认 5MB）
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `文件太大。最大允许 ${(maxSize / 1024 / 1024).toFixed(0)}MB。`,
      }
    }

    return { valid: true }
  }

  /**
   * 处理文件上传
   */
  const handleUpload = async (file: File) => {
    // 验证文件
    const validation = validateFile(file)
    if (!validation.valid) {
      setStatus('error')
      setErrorMessage(validation.error || '文件验证失败')
      return
    }

    try {
      // 重置状态
      setStatus('uploading')
      setProgress(0)
      setErrorMessage(null)

      // 创建预览
      cleanupPreview()
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // 步骤 1: 获取预签名 URL
      setProgress(10)
      const presignResponse = await fetch('/api/uploads/presign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          folder,
        }),
      })

      if (!presignResponse.ok) {
        const errorData = await presignResponse.json()
        throw new Error(errorData.message || '获取上传地址失败')
      }

      const { data } = await presignResponse.json()
      const { uploadUrl, publicUrl, key } = data

      // 步骤 2: 上传到 R2/S3
      setProgress(30)
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })

      if (!uploadResponse.ok) {
        throw new Error('文件上传失败')
      }

      // 完成
      setProgress(100)
      setStatus('success')

      // 通知父组件
      if (onUploadComplete) {
        onUploadComplete({
          success: true,
          url: publicUrl,
          key,
        })
      }
    } catch (error) {
      console.error('上传错误:', error)
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : '上传失败，请重试')
      
      // 通知父组件
      if (onUploadComplete) {
        onUploadComplete({
          success: false,
          error: error instanceof Error ? error.message : '上传失败',
        })
      }
    }
  }

  /**
   * 文件选择处理
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  /**
   * 拖放处理
   */
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  /**
   * 清除上传
   */
  const handleClear = () => {
    cleanupPreview()
    setPreviewUrl(null)
    setStatus('idle')
    setProgress(0)
    setErrorMessage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /**
   * 打开文件选择器
   */
  const handleClick = () => {
    if (!disabled && status !== 'uploading') {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* 上传区域 */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl overflow-hidden
          transition-all duration-200
          ${isDragging
            ? 'border-brand-500 bg-brand-50'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${status === 'error' ? 'border-red-300 bg-red-50' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
          aria-label="选择图片文件"
        />

        {/* 预览或上传提示 */}
        {previewUrl ? (
          <div className="relative aspect-video">
            {/* 预览图片 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="预览"
              className="w-full h-full object-cover"
            />

            {/* 遮罩层（上传中） */}
            {status === 'uploading' && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 mx-auto mb-4">
                    <svg className="animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-medium">上传中...</p>
                  <p className="text-sm mt-2">{progress}%</p>
                </div>
              </div>
            )}

            {/* 清除按钮 */}
            {status !== 'uploading' && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleClear()
                }}
                className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-lg text-white transition-all"
                aria-label="清除图片"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="p-12 text-center">
            {/* 图标 */}
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              {status === 'error' ? (
                <AlertCircle className="w-full h-full" />
              ) : (
                <ImageIcon className="w-full h-full" />
              )}
            </div>

            {/* 提示文本 */}
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">
                {isDragging ? '松开以上传' : '点击或拖拽图片到此处'}
              </p>
              <p className="text-sm text-gray-500">
                支持 JPG、PNG、WebP、GIF 格式，最大 5MB
              </p>
            </div>

            {/* 上传按钮 */}
            {!isDragging && (
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick()
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                选择图片
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 错误消息 */}
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">上传失败</p>
            <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 成功消息 */}
      {status === 'success' && !errorMessage && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">
            ✓ 上传成功！
          </p>
        </div>
      )}

      {/* 上传说明 */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>• 图片将安全存储到云端</p>
        <p>• 上传后可在相关功能中使用</p>
        <p>• 请确保上传的图片符合使用规范</p>
      </div>
    </div>
  )
}
