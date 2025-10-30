'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

export function PurchaseSuccessToast() {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const success = searchParams.get('success')
    
    if (success === 'true') {
      toast.success('🎉 代币购买成功！余额已更新', {
        duration: 5000,
      })
      
      // 清理 URL 参数
      const url = new URL(window.location.href)
      url.searchParams.delete('success')
      url.searchParams.delete('session_id')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])
  
  return null
}
