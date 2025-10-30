import { prisma } from './prisma'

/**
 * 检查用户是否是有效会员 (Check if user is a valid member)
 * 会员资格不影响代币 (Membership does not affect tokens)
 */
export async function checkMembershipStatus(userId: string): Promise<{
  isMember: boolean
  membershipExpiresAt: Date | null
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isMember: true,
      membershipExpiresAt: true,
    },
  })

  if (!user) {
    return { isMember: false, membershipExpiresAt: null }
  }

  // 检查会员是否过期 (Check if membership is expired)
  const now = new Date()
  const isExpired = user.membershipExpiresAt && user.membershipExpiresAt < now

  return {
    isMember: user.isMember && !isExpired,
    membershipExpiresAt: user.membershipExpiresAt,
  }
}

/**
 * 检查用户是否可以访问高级提示词 (Check if user can access premium prompts)
 */
export async function canAccessPremiumPrompts(userId: string): Promise<boolean> {
  const { isMember } = await checkMembershipStatus(userId)
  return isMember
}

/**
 * 获取用户完整信息 (Get user complete information)
 */
export async function getUserInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      isMember: true,
      membershipExpiresAt: true,
      tokens: true,
    },
  })

  if (!user) {
    return null
  }

  // 检查会员是否过期 (Check if membership is expired)
  const now = new Date()
  const isExpired = user.membershipExpiresAt && user.membershipExpiresAt < now

  return {
    ...user,
    isMember: user.isMember && !isExpired,
  }
}
