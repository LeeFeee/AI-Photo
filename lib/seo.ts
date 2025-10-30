import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  path?: string
  image?: string
  keywords?: string[]
}

export function generateSEO({
  title,
  description,
  path = '',
  image = '/og-image.png',
  keywords = [],
}: SEOProps): Metadata {
  const siteName = 'AI Photo'
  const fullTitle = `${title} | ${siteName}`
  const url = `https://ai-photo.app${path}`

  return {
    title: fullTitle,
    description,
    keywords: ['AI', '人工智能', '图片生成', '照片', 'AI图片', ...keywords],
    authors: [{ name: 'AI Photo Team' }],
    creator: 'AI Photo',
    publisher: 'AI Photo',
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'zh_CN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@aiphoto',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
  }
}
