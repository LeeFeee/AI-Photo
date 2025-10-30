import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import * as bcrypt from 'bcrypt'
import { prisma } from './prisma'

// 管理员认证配置 - Admin authentication configuration
// 与普通用户认证分离，使用独立的 AdminUser 表 - Separate from regular user auth, uses independent AdminUser table
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'admin-credentials',
      name: 'Admin Credentials',
      credentials: {
        username: { label: '用户名', type: 'text' },
        password: { label: '密码', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          // 查找管理员用户 - Find admin user
          const admin = await prisma.adminUser.findUnique({
            where: { username: credentials.username }
          })

          if (!admin) {
            return null
          }

          // 验证密码 - Verify password (bcrypt)
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            admin.password
          )

          if (!isPasswordValid) {
            return null
          }

          // 返回管理员信息 - Return admin info
          return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            username: admin.username,
          }
        } catch (error) {
          console.error('Admin authentication error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login', // 自定义登录页面 - Custom login page
    error: '/admin/login',
  },
  callbacks: {
    // JWT 回调：添加管理员信息到 token - JWT callback: add admin info to token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = (user as any).username
        token.role = 'admin' // 标记为管理员 - Mark as admin
      }
      return token
    },
    // Session 回调：添加管理员信息到 session - Session callback: add admin info to session
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id as string
        ;(session.user as any).username = token.username
        ;(session.user as any).role = token.role
      }
      return session
    }
  },
  session: {
    strategy: 'jwt', // 使用 JWT 会话策略 - Use JWT session strategy
    maxAge: 24 * 60 * 60, // 24 小时 - 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
}
