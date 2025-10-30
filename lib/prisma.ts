import { PrismaClient } from './generated/prisma/client'

// Prisma client singleton
// 避免在开发环境中创建多个客户端实例 - Avoid creating multiple client instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
