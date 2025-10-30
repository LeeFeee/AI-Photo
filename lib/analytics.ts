export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      console.log('Analytics event:', event, properties)
    }
  },
  
  page: (path: string) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      console.log('Page view:', path)
    }
  },
}

export function useAnalytics() {
  return analytics
}
