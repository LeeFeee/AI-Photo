'use client'

// Mock authentication context - simulates NextAuth session
// In production, this would be replaced with actual NextAuth provider and session hooks

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { User, MembershipTier } from './types'

interface AuthContextType {
  user: User | null
  setMembershipTier: (tier: MembershipTier) => void
  isGuest: boolean
  isNonMember: boolean
  isMember: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // 模拟用户状态 - 默认为游客
  // In production: const { data: session } = useSession() from next-auth/react
  const [user, setUser] = useState<User | null>({
    membershipTier: 'guest'
  })

  const setMembershipTier = (tier: MembershipTier) => {
    setUser({
      ...user,
      membershipTier: tier,
      id: tier === 'guest' ? undefined : 'mock-user-id',
      email: tier === 'guest' ? undefined : 'user@example.com',
      name: tier === 'guest' ? undefined : '测试用户',
    })
  }

  const isGuest = user?.membershipTier === 'guest'
  const isNonMember = user?.membershipTier === 'non-member'
  const isMember = user?.membershipTier === 'member'

  return (
    <AuthContext.Provider value={{ user, setMembershipTier, isGuest, isNonMember, isMember }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
