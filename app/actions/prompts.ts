'use server'

import { revalidatePath } from 'next/cache'
import { 
  getAllPrompts, 
  getPromptById, 
  createPrompt, 
  updatePrompt, 
  deletePrompt,
  searchPrompts,
  type Prompt 
} from '@/lib/prompts'

// Simple admin check (in production, this would check actual auth)
function isAdmin(): boolean {
  // TODO: Implement proper admin authorization
  // For now, we'll return true to allow development
  // In production, check session/cookie/JWT
  return true
}

export async function getPromptsAction() {
  if (!isAdmin()) {
    throw new Error('未授权：需要管理员权限')
  }
  return getAllPrompts()
}

export async function getPromptByIdAction(id: string) {
  if (!isAdmin()) {
    throw new Error('未授权：需要管理员权限')
  }
  const prompt = getPromptById(id)
  if (!prompt) {
    throw new Error('提示词未找到')
  }
  return prompt
}

export async function searchPromptsAction(query: string) {
  if (!isAdmin()) {
    throw new Error('未授权：需要管理员权限')
  }
  return searchPrompts(query)
}

export async function createPromptAction(data: {
  name: string
  content: string
  previewImage?: string
  category?: string
  isActive?: boolean
}) {
  if (!isAdmin()) {
    throw new Error('未授权：需要管理员权限')
  }

  // Validate input
  if (!data.name || data.name.trim().length === 0) {
    throw new Error('提示词名称不能为空')
  }
  if (!data.content || data.content.trim().length === 0) {
    throw new Error('提示词内容不能为空')
  }

  const prompt = createPrompt({
    name: data.name.trim(),
    content: data.content.trim(),
    previewImage: data.previewImage,
    category: data.category,
    isActive: data.isActive ?? true,
    updatedBy: 'admin', // TODO: Get from session
  })

  revalidatePath('/admin/prompts')
  revalidatePath('/prompts')
  
  return prompt
}

export async function updatePromptAction(id: string, data: {
  name?: string
  content?: string
  previewImage?: string
  category?: string
  isActive?: boolean
}) {
  if (!isAdmin()) {
    throw new Error('未授权：需要管理员权限')
  }

  // Validate input
  if (data.name !== undefined && data.name.trim().length === 0) {
    throw new Error('提示词名称不能为空')
  }
  if (data.content !== undefined && data.content.trim().length === 0) {
    throw new Error('提示词内容不能为空')
  }

  const updateData: any = { ...data, updatedBy: 'admin' } // TODO: Get from session
  
  if (data.name !== undefined) {
    updateData.name = data.name.trim()
  }
  if (data.content !== undefined) {
    updateData.content = data.content.trim()
  }

  const prompt = updatePrompt(id, updateData)
  
  if (!prompt) {
    throw new Error('提示词未找到')
  }

  revalidatePath('/admin/prompts')
  revalidatePath('/prompts')
  
  return prompt
}

export async function deletePromptAction(id: string) {
  if (!isAdmin()) {
    throw new Error('未授权：需要管理员权限')
  }

  const success = deletePrompt(id)
  
  if (!success) {
    throw new Error('提示词未找到')
  }

  revalidatePath('/admin/prompts')
  revalidatePath('/prompts')
  
  return { success: true }
}

export async function togglePromptActiveAction(id: string, isActive: boolean) {
  if (!isAdmin()) {
    throw new Error('未授权：需要管理员权限')
  }

  const prompt = updatePrompt(id, { isActive, updatedBy: 'admin' })
  
  if (!prompt) {
    throw new Error('提示词未找到')
  }

  revalidatePath('/admin/prompts')
  revalidatePath('/prompts')
  
  return prompt
}
