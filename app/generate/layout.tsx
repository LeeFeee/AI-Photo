import { generateSEO } from '@/lib/seo'

export const metadata = generateSEO({
  title: '生成图片',
  description: '输入提示词或选择预设，使用 AI 快速生成精美图片',
  path: '/generate',
  keywords: ['生成图片', 'AI生成', '图片创作', '提示词'],
})

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return children
}
