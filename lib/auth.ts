import { NextRequest } from 'next/server';
import { prisma } from './prisma';

// 验证管理员权限 - Verify Admin Authorization
export async function verifyAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });
    return user?.isAdmin || false;
  } catch (error) {
    console.error('Admin verification error:', error);
    return false;
  }
}

// 从请求头中提取用户ID（简化版，实际应该使用JWT或session）
// Extract User ID from headers (simplified version, should use JWT or session in production)
export async function getCurrentUser(request: NextRequest): Promise<{ id: string; isAdmin: boolean } | null> {
  // 在实际应用中，这里应该从session或JWT token中提取用户信息
  // In production, extract user info from session or JWT token
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, isAdmin: true },
  });

  return user;
}

// 简化的认证助手（用于API路由）
// Simplified auth helper for API routes
export function createAuthResponse(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
