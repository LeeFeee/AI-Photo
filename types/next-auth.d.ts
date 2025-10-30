import 'next-auth'
import 'next-auth/jwt'

// 扩展 NextAuth 类型定义 - Extend NextAuth type definitions
// 为管理员会话添加自定义字段 - Add custom fields for admin session
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      username?: string
      role?: string
    }
  }

  interface User {
    id: string
    name: string
    email: string
    username: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username?: string
    role?: string
  }
}
