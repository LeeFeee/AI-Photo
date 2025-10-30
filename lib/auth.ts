/**
 * Mock authentication utilities
 * In production, this would integrate with NextAuth.js or similar
 */

export interface User {
  id: string
  email: string
  name: string | null
}

/**
 * Get the current user (mock implementation)
 * In production, this would check session/JWT tokens
 */
export async function getCurrentUser(): Promise<User | null> {
  // For demo purposes, return the demo user
  // In production, this would validate session and fetch from database
  return {
    id: 'cmhd58eu60000er7xxa0bct2m', // Demo user ID from seed
    email: 'demo@example.com',
    name: '演示用户',
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}
