import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// NextAuth handler for admin authentication
// 管理员认证处理器 - Admin authentication handler
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
