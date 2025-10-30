/**
 * 图片上传演示页面
 * 用于测试和展示图片上传功能
 */

'use client'

import { useState } from 'react'
import { ImageUpload, UploadResult } from '@/components/ui/image-upload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle } from 'lucide-react'

export default function UploadDemoPage() {
  // 状态：存储上传结果
  const [referenceResult, setReferenceResult] = useState<UploadResult | null>(null)
  const [promptResult, setPromptResult] = useState<UploadResult | null>(null)
  const [tempResult, setTempResult] = useState<UploadResult | null>(null)

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          图片上传演示
        </h1>
        <p className="text-lg text-gray-600">
          测试安全的云存储图片上传功能
        </p>
      </div>

      {/* 功能说明 */}
      <Card>
        <CardHeader>
          <CardTitle>功能特性</CardTitle>
          <CardDescription>本页面演示了完整的图片上传功能</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-medium text-gray-900">✅ 支持的功能：</p>
              <ul className="space-y-1 text-gray-600">
                <li>• 拖放上传和点击上传</li>
                <li>• 实时图片预览</li>
                <li>• 上传进度显示</li>
                <li>• 文件类型和大小验证</li>
                <li>• 直接上传到 R2/S3（预签名 URL）</li>
                <li>• 完整的错误处理</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">📋 配置要求：</p>
              <ul className="space-y-1 text-gray-600">
                <li>• 支持格式：JPG, PNG, WebP, GIF</li>
                <li>• 最大大小：5MB</li>
                <li>• 需要配置环境变量（见 .env.example）</li>
                <li>• 需要设置 CORS 和存储桶策略</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 演示区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 参考图上传 */}
        <Card>
          <CardHeader>
            <CardTitle>参考图上传</CardTitle>
            <CardDescription>
              用于用户上传参考图片（存储在 references/ 目录）
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              folder="references"
              onUploadComplete={(result) => {
                setReferenceResult(result)
                console.log('参考图上传结果:', result)
              }}
            />
            {referenceResult && (
              <ResultDisplay result={referenceResult} />
            )}
          </CardContent>
        </Card>

        {/* 提示词预览图上传 */}
        <Card>
          <CardHeader>
            <CardTitle>提示词预览图上传</CardTitle>
            <CardDescription>
              用于管理员上传提示词预览图（存储在 prompts/ 目录）
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              folder="prompts"
              onUploadComplete={(result) => {
                setPromptResult(result)
                console.log('提示词预览上传结果:', result)
              }}
            />
            {promptResult && (
              <ResultDisplay result={promptResult} />
            )}
          </CardContent>
        </Card>

        {/* 临时上传 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>临时文件上传</CardTitle>
            <CardDescription>
              临时上传测试（存储在 temp/ 目录，可设置自动过期策略）
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-2xl mx-auto">
              <ImageUpload
                folder="temp"
                onUploadComplete={(result) => {
                  setTempResult(result)
                  console.log('临时上传结果:', result)
                }}
              />
              {tempResult && (
                <ResultDisplay result={tempResult} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>集成指南</CardTitle>
          <CardDescription>在您的页面中使用上传组件</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre>{`import { ImageUpload } from '@/components/ui/image-upload'

function MyComponent() {
  const handleUploadComplete = (result) => {
    if (result.success) {
      console.log('上传成功！URL:', result.url)
      // 将 URL 保存到数据库或状态管理
    } else {
      console.error('上传失败:', result.error)
    }
  }

  return (
    <ImageUpload
      folder="prompts"
      onUploadComplete={handleUploadComplete}
      currentImageUrl={existingImageUrl} // 可选：编辑时显示现有图片
    />
  )
}`}</pre>
          </div>
        </CardContent>
      </Card>

      {/* 配置提示 */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-900">⚠️ 配置提醒</CardTitle>
        </CardHeader>
        <CardContent className="text-amber-800 space-y-2">
          <p>
            如果上传失败，请确保已完成以下配置：
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>复制 <code className="bg-amber-100 px-2 py-0.5 rounded">.env.example</code> 为 <code className="bg-amber-100 px-2 py-0.5 rounded">.env.local</code></li>
            <li>填写 R2 或 S3 的访问密钥、存储桶名称等信息</li>
            <li>在 R2/S3 控制台配置 CORS 策略</li>
            <li>设置存储桶权限和访问策略</li>
            <li>重启开发服务器</li>
          </ol>
          <p className="mt-4">
            详细配置步骤：<a href="https://github.com/yourusername/ai-photo/blob/main/STORAGE_SETUP.md" className="underline font-medium">STORAGE_SETUP.md</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * 上传结果显示组件
 */
function ResultDisplay({ result }: { result: UploadResult }) {
  if (result.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <p className="font-medium text-green-900">上传成功！</p>
            <div className="text-sm text-green-800 space-y-1">
              <p className="break-all">
                <span className="font-medium">URL: </span>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-green-900"
                >
                  {result.url}
                </a>
              </p>
              {result.key && (
                <p className="break-all">
                  <span className="font-medium">Key: </span>
                  <code className="bg-green-100 px-1 rounded">{result.key}</code>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-red-900">上传失败</p>
          <p className="text-sm text-red-800 mt-1">{result.error}</p>
        </div>
      </div>
    </div>
  )
}
