import { PrismaClient } from '@prisma/client'

// PrismaClient 是全局单例，防止在开发模式下创建多个实例
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
