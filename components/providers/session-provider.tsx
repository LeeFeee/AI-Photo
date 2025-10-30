'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

interface SessionProviderProps {
  children: React.ReactNode
  session?: Session | null
}

// NextAuth 会话提供者包装器 - NextAuth session provider wrapper
export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  )
}
