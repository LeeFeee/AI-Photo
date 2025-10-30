'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface CheckoutButtonProps {
  userId: string
  email: string
  interval: 'monthly' | 'yearly'
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
}

export function CheckoutButton({
  userId,
  email,
  interval,
  children,
  className,
  variant = 'default',
  size = 'default',
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email,
          interval,
        }),
      })

      const data = await response.json()

      if (data.url) {
        // 重定向到 Stripe Checkout (Redirect to Stripe Checkout)
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className={className}
      variant={variant}
      size={size}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          加载中...
        </>
      ) : (
        children
      )}
    </Button>
  )
}
