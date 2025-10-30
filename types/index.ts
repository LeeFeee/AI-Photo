/**
 * 全局类型定义
 * Global type definitions
 */

// 基础模型类型 / Base model types
export interface BaseModel {
  id: string
  createdAt: Date
  updatedAt: Date
}

// 用户类型 / User types
export interface User extends BaseModel {
  email: string
  name?: string
  image?: string
}

// 提示词类型 / Prompt types
export interface Prompt extends BaseModel {
  title: string
  description: string
  category: string
  tags: string[]
  content: string
  previewImage?: string
  userId?: string
}

// 生成的图片类型 / Generated image types
export interface GeneratedImage extends BaseModel {
  promptId?: string
  promptText: string
  imageUrl: string
  thumbnailUrl?: string
  userId?: string
  width?: number
  height?: number
  metadata?: Record<string, unknown>
}

// API 响应类型 / API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

// UI 状态类型 / UI state types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T = unknown> {
  status: LoadingState
  data?: T
  error?: string
}

// 组件 Props 类型 / Component props types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}
