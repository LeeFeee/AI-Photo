'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '@/components/ui/image-upload'
import { Switch } from '@/components/ui/switch'
import type { Prompt } from '@/lib/prompts'

interface PromptFormProps {
  prompt?: Prompt
  onSubmit: (data: PromptFormData) => Promise<void>
  onCancel: () => void
}

export interface PromptFormData {
  name: string
  content: string
  previewImage?: string
  category?: string
  isActive: boolean
}

export function PromptForm({ prompt, onSubmit, onCancel }: PromptFormProps) {
  const [formData, setFormData] = React.useState<PromptFormData>({
    name: prompt?.name || '',
    content: prompt?.content || '',
    previewImage: prompt?.previewImage || '',
    category: prompt?.category || '',
    isActive: prompt?.isActive ?? true,
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<Partial<Record<keyof PromptFormData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PromptFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = '请输入提示词名称'
    }
    if (!formData.content.trim()) {
      newErrors.content = '请输入提示词内容'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          提示词名称 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value })
            setErrors({ ...errors, name: undefined })
          }}
          placeholder="例如：山水画风景"
          disabled={isSubmitting}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">
          提示词内容 <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => {
            setFormData({ ...formData, content: e.target.value })
            setErrors({ ...errors, content: undefined })
          }}
          placeholder="例如：A beautiful Chinese landscape painting with mountains..."
          rows={4}
          disabled={isSubmitting}
        />
        {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">分类（可选）</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="例如：风景、人物、动物"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label>预览图片（可选）</Label>
        <ImageUpload
          value={formData.previewImage}
          onChange={(value) => setFormData({ ...formData, previewImage: value })}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <Label htmlFor="isActive" className="font-medium">启用状态</Label>
          <p className="text-sm text-gray-600 mt-1">
            {formData.isActive ? '启用后将在公开提示词列表中显示' : '禁用后不会在公开提示词列表中显示'}
          </p>
        </div>
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          取消
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '保存中...' : prompt ? '保存修改' : '创建提示词'}
        </Button>
      </div>
    </form>
  )
}
