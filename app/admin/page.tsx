import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import DashboardCharts from './components/DashboardCharts';

// 获取仪表盘统计数据 - Get dashboard statistics
async function getDashboardStats() {
  // 计算总收入 - Calculate total revenue
  const revenueResult = await prisma.transaction.aggregate({
    where: {
      status: 'COMPLETED',
      type: {
        in: ['TOKEN_PURCHASE', 'MEMBERSHIP_PURCHASE'],
      },
    },
    _sum: {
      amount: true,
    },
  });

  // 计算活跃会员数 - Count active members
  const activeMembersCount = await prisma.user.count({
    where: {
      isMember: true,
      membershipExpiresAt: {
        gt: new Date(),
      },
    },
  });

  // 计算已使用的代币总数 - Calculate total tokens spent
  const tokensSpentResult = await prisma.transaction.aggregate({
    where: {
      type: 'TOKEN_USAGE',
      status: 'COMPLETED',
    },
    _sum: {
      tokenAmount: true,
    },
  });

  // 获取总用户数 - Get total users count
  const totalUsers = await prisma.user.count();

  // 获取过去30天的收入趋势 - Get revenue trend for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentTransactions = await prisma.transaction.findMany({
    where: {
      status: 'COMPLETED',
      type: {
        in: ['TOKEN_PURCHASE', 'MEMBERSHIP_PURCHASE'],
      },
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      amount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return {
    totalRevenue: revenueResult._sum.amount || 0,
    activeMembers: activeMembersCount,
    tokensSpent: Math.abs(tokensSpentResult._sum.tokenAmount || 0),
    totalUsers,
    recentTransactions,
  };
}

export default async function AdminDashboard() {
  // 在实际应用中，这里应该检查用户的管理员权限
  // In production, check user admin permissions here
  // const user = await getCurrentUser();
  // if (!user?.isAdmin) redirect('/');

  const stats = await getDashboardStats();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">管理员仪表盘</h1>

        {/* 统计卡片 - Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 总收入卡片 - Total Revenue Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总收入</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 活跃会员卡片 - Active Members Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">活跃会员</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.activeMembers}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 已使用代币卡片 - Tokens Spent Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">已使用代币</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.tokensSpent.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 总用户数卡片 - Total Users Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总用户数</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 图表部分 - Charts Section */}
        <DashboardCharts transactions={stats.recentTransactions} />

        {/* 快捷链接 - Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <a
            href="/admin/users"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">用户管理</h3>
            <p className="text-gray-600">查看和管理所有用户账户</p>
          </a>
          <a
            href="/admin/transactions"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">交易记录</h3>
            <p className="text-gray-600">查看和导出交易历史</p>
          </a>
        </div>
      </div>
    </div>
  );
}
