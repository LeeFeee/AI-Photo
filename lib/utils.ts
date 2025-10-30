/**
 * 工具函数库
 * Utility functions library
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 Tailwind CSS 类名
 * Merge Tailwind CSS class names
 *
 * 使用 clsx 处理条件类名，使用 twMerge 合并冲突的 Tailwind 类
 * Uses clsx to handle conditional classes and twMerge to merge conflicting Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
