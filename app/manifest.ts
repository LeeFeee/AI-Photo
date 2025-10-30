import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI Photo - 智能图片生成',
    short_name: 'AI Photo',
    description: '使用 AI 技术根据预设提示词生成精美图片',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0ea5e9',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
