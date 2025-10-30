import { PrismaClient } from '@prisma/client'

// Prisma client singleton pattern for Next.js
// 避免在开发环境中创建多个实例 (Avoid creating multiple instances in development)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
