'use client'

import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from './button'

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  accept?: string
  maxSizeMB?: number
  preview?: boolean
}

export function FileUpload({
  onFileSelect,
  accept = 'image/*',
  maxSizeMB = 5,
  preview = true,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setError(null)

    if (!file) {
      handleClear()
      return
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      setError(`文件大小不能超过 ${maxSizeMB}MB`)
      return
    }

    // Validate file type
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      setError('不支持的文件类型')
      return
    }

    setSelectedFile(file)
    onFileSelect(file)

    // Generate preview if enabled
    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="sr-only"
        id="file-upload"
        aria-label="上传文件"
      />

      {!selectedFile ? (
        <button
          type="button"
          onClick={handleClick}
          className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="选择要上传的文件"
        >
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <Upload className="h-8 w-8" aria-hidden="true" />
            <p className="text-sm font-medium">点击上传参考图片</p>
            <p className="text-xs text-gray-500">
              支持 JPG、PNG 格式，最大 {maxSizeMB}MB
            </p>
          </div>
        </button>
      ) : (
        <div className="relative rounded-xl border-2 border-brand-500 bg-brand-50 p-4">
          {previewUrl && (
            <div className="mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="预览图片"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="ml-2"
              aria-label="移除文件"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
