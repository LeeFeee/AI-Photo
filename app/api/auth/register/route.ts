import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// 注册验证规则 - Registration validation schema
const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
  name: z.string().min(1, '请输入您的名字').optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // 验证输入 - Validate input
    const validatedData = registerSchema.parse(body)

    // 检查用户是否已存在 - Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      )
    }

    // 加密密码 - Hash password
    const passwordHash = await hash(validatedData.password, 10)

    // 创建用户 - Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        name: validatedData.name,
        tokenBalance: 0,
        isMember: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        tokenBalance: true,
        isMember: true,
      },
    })

    return NextResponse.json(
      {
        message: '注册成功',
        user,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || '验证失败' },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
}
