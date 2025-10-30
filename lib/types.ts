// Type definitions for the application

export interface Prompt {
  id: string
  name: string
  content: string
  description: string
  category: string
  previewImage: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type MembershipTier = 'guest' | 'non-member' | 'member'

export interface User {
  id?: string
  email?: string
  name?: string
  membershipTier: MembershipTier
}

export interface Session {
  user: User | null
}
