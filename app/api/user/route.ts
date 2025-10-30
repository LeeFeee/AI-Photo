import { NextRequest, NextResponse } from 'next/server'
import { getUserInfo } from '@/lib/membership'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json(
      { error: '缺少用户 ID (Missing user ID)' },
      { status: 400 }
    )
  }

  try {
    const user = await getUserInfo(userId)

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在 (User not found)' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user info:', error)
    return NextResponse.json(
      { error: '获取用户信息失败 (Failed to fetch user info)' },
      { status: 500 }
    )
  }
}
