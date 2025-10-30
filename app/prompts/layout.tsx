import { generateSEO } from '@/lib/seo'

export const metadata = generateSEO({
  title: '提示词库',
  description: '浏览丰富的 AI 图片生成提示词，找到适合您的创意灵感。会员专享完整提示词内容。',
  path: '/prompts',
  keywords: ['提示词', 'AI提示词', '图片生成提示词', 'prompt', '会员专享', 'AI创作'],
})

export default function PromptsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
