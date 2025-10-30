'use client'

import { useState, useEffect } from 'react'
import { Wand2, Download, RefreshCw, Coins, Lock, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { FileUpload } from '@/components/ui/file-upload'
import toast from 'react-hot-toast'
import {
  generateImageAction,
  getUserTokenBalance,
  getAvailablePrompts,
} from '@/app/actions/generate-image'

interface Prompt {
  id: string
  title: string
  description: string | null
  category: string | null
  tokenCost: number
  membersOnly: boolean
}

type GenerationStep = 'idle' | 'validating' | 'generating' | 'storing' | 'completed' | 'error'

export default function GeneratePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [selectedPromptId, setSelectedPromptId] = useState<string>('')
  const [referenceFile, setReferenceFile] = useState<File | null>(null)
  const [referenceImageBase64, setReferenceImageBase64] = useState<string | null>(null)
  const [generationStep, setGenerationStep] = useState<GenerationStep>('idle')
  const [generatedImages, setGeneratedImages] = useState<
    Array<{
      id: string
      imageUrl: string
      promptTitle: string
      timestamp: Date
    }>
  >([])
  const [userTokens, setUserTokens] = useState<number>(0)
  const [isMember, setIsMember] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [balanceResult, promptsResult] = await Promise.all([
          getUserTokenBalance(),
          getAvailablePrompts(),
        ])

        if (balanceResult.success) {
          setUserTokens(balanceResult.tokens || 0)
          setIsMember(balanceResult.isMember || false)
        }

        if (promptsResult.success) {
          setPrompts(promptsResult.prompts || [])
        }
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('加载数据失败')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Convert file to base64
  useEffect(() => {
    if (!referenceFile) {
      setReferenceImageBase64(null)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setReferenceImageBase64(reader.result as string)
    }
    reader.readAsDataURL(referenceFile)
  }, [referenceFile])

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId)
  const canGenerate = selectedPromptId && (!selectedPrompt?.membersOnly || isMember)
  const hasSufficientTokens = selectedPrompt ? userTokens >= selectedPrompt.tokenCost : false

  const handleGenerate = async () => {
    if (!selectedPromptId) {
      toast.error('请选择一个提示词')
      return
    }

    if (!selectedPrompt) {
      toast.error('提示词不存在')
      return
    }

    if (selectedPrompt.membersOnly && !isMember) {
      toast.error('该提示词需要会员权限')
      return
    }

    if (!hasSufficientTokens) {
      toast.error(`代币余额不足。需要 ${selectedPrompt.tokenCost} 代币`)
      return
    }

    setGenerationStep('validating')
    const toastId = toast.loading('正在验证...')

    try {
      // Step 1: Validating
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 2: Generating
      setGenerationStep('generating')
      toast.loading('正在生成图片...', { id: toastId })

      const result = await generateImageAction({
        promptId: selectedPromptId,
        referenceImage: referenceImageBase64 || undefined,
      })

      if (!result.success) {
        setGenerationStep('error')
        toast.error(result.error || '生成失败', { id: toastId })

        if (result.errorCode === 'INSUFFICIENT_TOKENS') {
          // Refresh token balance
          const balanceResult = await getUserTokenBalance()
          if (balanceResult.success) {
            setUserTokens(balanceResult.tokens || 0)
          }
        }
        return
      }

      // Step 3: Storing
      setGenerationStep('storing')
      toast.loading('正在保存...', { id: toastId })
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 4: Completed
      setGenerationStep('completed')
      toast.success(
        `图片生成成功！消耗 ${result.data!.tokensUsed} 代币，剩余 ${result.data!.remainingTokens} 代币`,
        { id: toastId, duration: 4000 }
      )

      // Update local state
      setUserTokens(result.data!.remainingTokens)
      setGeneratedImages((prev) => [
        {
          id: result.data!.id,
          imageUrl: result.data!.imageUrl,
          promptTitle: result.data!.promptTitle,
          timestamp: new Date(),
        },
        ...prev,
      ])

      // Reset form after a delay
      setTimeout(() => {
        setGenerationStep('idle')
      }, 2000)
    } catch (error) {
      console.error('Error generating image:', error)
      setGenerationStep('error')
      toast.error('生成图片时发生错误', { id: toastId })

      setTimeout(() => {
        setGenerationStep('idle')
      }, 2000)
    }
  }

  const handleDownload = async (imageUrl: string, promptTitle: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${promptTitle}-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('图片下载成功')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('下载失败，请重试')
    }
  }

  const handleReset = () => {
    setSelectedPromptId('')
    setReferenceFile(null)
    setReferenceImageBase64(null)
    setGenerationStep('idle')
    toast.success('已重置')
  }

  const isGenerating = ['validating', 'generating', 'storing'].includes(generationStep)

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          生成 AI 图片
        </h1>
        <p className="text-lg text-gray-600">
          选择提示词、上传参考图片，让 AI 为您创作
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-lg">
          <Coins className="h-5 w-5" aria-hidden="true" />
          <span className="font-medium">
            当前余额：{userTokens} 代币
            {isMember && (
              <span className="ml-2 text-sm text-accent-600">（会员）</span>
            )}
          </span>
        </div>
      </div>

      {/* Progress Steps */}
      {generationStep !== 'idle' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {generationStep === 'validating' && (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="text-sm font-medium">验证权限和余额...</span>
                  </>
                )}
                {generationStep === 'generating' && (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="text-sm font-medium">正在生成图片...</span>
                  </>
                )}
                {generationStep === 'storing' && (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="text-sm font-medium">保存图片和记录...</span>
                  </>
                )}
                {generationStep === 'completed' && (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      生成完成！
                    </span>
                  </>
                )}
                {generationStep === 'error' && (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-600">
                      生成失败
                    </span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Input */}
        <div className="space-y-6">
          {/* Prompt Selection */}
          <Card>
            <CardHeader>
              <CardTitle>选择提示词</CardTitle>
              <CardDescription>选择一个预设提示词开始创作</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                {prompts.map((prompt) => {
                  const isSelected = selectedPromptId === prompt.id
                  const isLocked = prompt.membersOnly && !isMember
                  const canAfford = userTokens >= prompt.tokenCost

                  return (
                    <button
                      key={prompt.id}
                      onClick={() => !isLocked && setSelectedPromptId(prompt.id)}
                      disabled={isLocked || isGenerating}
                      className={`
                        relative px-4 py-3 text-left rounded-lg border-2 transition-all
                        ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-gray-300 hover:border-brand-400'
                        }
                        ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:bg-brand-50'}
                        ${!canAfford && !isLocked ? 'opacity-75' : ''}
                        focus:outline-none focus:ring-2 focus:ring-brand-500
                      `}
                      aria-label={`选择提示词: ${prompt.title}`}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {prompt.title}
                            </span>
                            {prompt.membersOnly && (
                              <Lock className="h-4 w-4 text-accent-600 flex-shrink-0" />
                            )}
                          </div>
                          {prompt.description && (
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {prompt.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <span
                              className={`text-xs font-medium ${
                                canAfford ? 'text-brand-600' : 'text-red-600'
                              }`}
                            >
                              {prompt.tokenCost} 代币
                            </span>
                            {prompt.category && (
                              <span className="text-xs text-gray-500">
                                {prompt.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                          <span className="text-sm font-medium text-gray-600">
                            需要会员权限
                          </span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Reference Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>上传参考图片（可选）</CardTitle>
              <CardDescription>
                上传一张参考图片，让 AI 生成更符合您期望的作品
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFileSelect={setReferenceFile}
                accept="image/*"
                maxSizeMB={5}
                preview={true}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              {selectedPrompt && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">预计消耗：</span>
                    <span className="font-medium text-gray-900">
                      {selectedPrompt.tokenCost} 代币
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">生成后余额：</span>
                    <span
                      className={`font-medium ${
                        hasSufficientTokens ? 'text-brand-600' : 'text-red-600'
                      }`}
                    >
                      {Math.max(0, userTokens - selectedPrompt.tokenCost)} 代币
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={!canGenerate || !hasSufficientTokens || isGenerating}
                  className="flex-1"
                  aria-label="生成图片"
                >
                  {isGenerating ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5 mr-2" aria-hidden="true" />
                      生成图片
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  disabled={isGenerating}
                  aria-label="重置"
                >
                  <RefreshCw className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>

              {!hasSufficientTokens && selectedPrompt && (
                <p className="mt-3 text-sm text-red-600 text-center" role="alert">
                  代币余额不足，无法生成
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Results */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>生成结果</CardTitle>
              <CardDescription>
                您的 AI 生成图片将显示在这里
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedImages.length > 0 ? (
                <div className="space-y-4">
                  {generatedImages.map((image) => (
                    <div
                      key={image.id}
                      className="space-y-3 p-4 border-2 border-brand-200 rounded-xl bg-brand-50/50 animate-scale-in"
                    >
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.imageUrl}
                          alt={`AI 生成的图片 - ${image.promptTitle}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {image.promptTitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            {image.timestamp.toLocaleString('zh-CN')}
                          </p>
                        </div>
                        <Button
                          onClick={() =>
                            handleDownload(image.imageUrl, image.promptTitle)
                          }
                          variant="outline"
                          size="sm"
                          aria-label="下载图片"
                        >
                          <Download className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Wand2
                      className="h-12 w-12 mx-auto mb-3 opacity-50"
                      aria-hidden="true"
                    />
                    <p className="text-sm">图片将在此显示</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
