import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { compare } from 'bcrypt'
import { prisma } from './prisma'

// NextAuth 配置 - NextAuth configuration
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: '邮箱', type: 'email' },
        password: { label: '密码', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('邮箱和密码不能为空')
        }

        // 查找用户 - Find user
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          throw new Error('用户不存在')
        }

        // 验证密码 - Verify password
        const isPasswordValid = await compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          throw new Error('密码错误')
        }

        // 返回用户信息 - Return user info
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  callbacks: {
    // JWT 回调 - JWT callback
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
      }

      // 每次创建 token 时，从数据库获取最新的用户信息 - Fetch latest user data when creating token
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            tokenBalance: true,
            isMember: true,
            membershipExpiresAt: true,
          },
        })

        if (dbUser) {
          token.tokenBalance = dbUser.tokenBalance
          token.isMember = dbUser.isMember
          token.membershipExpiresAt = dbUser.membershipExpiresAt
          token.email = dbUser.email
          token.name = dbUser.name
          token.image = dbUser.image
        }
      }

      return token
    },
    // Session 回调 - Session callback
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.tokenBalance = token.tokenBalance as number
        session.user.isMember = token.isMember as boolean
        session.user.membershipExpiresAt = token.membershipExpiresAt as Date | null
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
