'use client'

import { useState } from 'react'
import { Wand2, Download, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import toast from 'react-hot-toast'

const presetPrompts = [
  { id: 1, label: '梦幻森林', value: '一片梦幻般的森林，阳光透过树叶洒下斑驳光影' },
  { id: 2, label: '未来城市', value: '充满科技感的未来城市，霓虹灯光璀璨' },
  { id: 3, label: '宁静海滩', value: '黄昏时分的宁静海滩，海浪轻拍沙滩' },
  { id: 4, label: '山峰日出', value: '壮丽的山峰上，太阳冉冉升起' },
  { id: 5, label: '星空夜景', value: '璀璨的星空下，银河清晰可见' },
  { id: 6, label: '樱花之春', value: '盛开的樱花树下，花瓣随风飘落' },
]

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('请输入或选择提示词')
      return
    }

    setIsGenerating(true)
    toast.loading('正在生成图片...', { id: 'generating' })

    setTimeout(() => {
      setGeneratedImage(`https://picsum.photos/seed/${Date.now()}/800/600`)
      setIsGenerating(false)
      toast.success('图片生成成功！', { id: 'generating' })
    }, 3000)
  }

  const handleDownload = () => {
    toast.success('图片已开始下载')
  }

  const handleReset = () => {
    setPrompt('')
    setGeneratedImage(null)
    toast.success('已重置')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          生成 AI 图片
        </h1>
        <p className="text-lg text-gray-600">
          输入提示词或选择预设，让 AI 为您创作
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>提示词设置</CardTitle>
              <CardDescription>
                描述您想要生成的图片
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-700 mb-2">
                  输入提示词
                </label>
                <textarea
                  id="prompt-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：一只可爱的猫咪坐在窗台上，阳光洒在它身上..."
                  className="w-full h-32 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                  aria-label="输入图片生成提示词"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  或选择预设提示词
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {presetPrompts.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setPrompt(preset.value)}
                      className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
                      type="button"
                      aria-label={`选择预设提示词: ${preset.label}`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
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
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>生成结果</CardTitle>
              <CardDescription>
                您的 AI 生成图片将显示在这里
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedImage ? (
                <div className="space-y-4 animate-scale-in">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={generatedImage}
                      alt="AI 生成的图片"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full"
                    aria-label="下载图片"
                  >
                    <Download className="h-5 w-5 mr-2" aria-hidden="true" />
                    下载图片
                  </Button>
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Wand2 className="h-12 w-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
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
