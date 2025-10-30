import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';
import UsersTable from './UsersTable';
import SearchAndFilter from './SearchAndFilter';

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }>;
}

// 获取用户列表数据 - Get users list data
async function getUsers(
  page: number,
  search: string,
  sortBy: string,
  sortOrder: 'asc' | 'desc'
) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  // 构建搜索条件 - Build search conditions
  const where = search
    ? {
        OR: [
          { email: { contains: search } },
          { username: { contains: search } },
        ],
      }
    : {};

  // 构建排序条件 - Build sort conditions
  const orderBy: any = {};
  if (sortBy) {
    orderBy[sortBy] = sortOrder;
  } else {
    orderBy.createdAt = 'desc';
  }

  // 查询用户数据 - Query user data
  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      select: {
        id: true,
        email: true,
        username: true,
        tokenBalance: true,
        isMember: true,
        membershipExpiresAt: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
  };
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const search = params.search || '';
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = params.sortOrder || 'desc';

  const { users, totalCount, totalPages, currentPage } = await getUsers(
    page,
    search,
    sortBy,
    sortOrder
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 - Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
          <p className="text-gray-600 mt-2">总共 {totalCount} 个用户</p>
        </div>

        {/* 搜索和过滤 - Search and Filter */}
        <SearchAndFilter />

        {/* 用户表格 - Users Table */}
        <Suspense fallback={<div>加载中...</div>}>
          <UsersTable
            users={users}
            currentPage={currentPage}
            totalPages={totalPages}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        </Suspense>

        {/* 返回仪表盘链接 - Back to Dashboard Link */}
        <div className="mt-6">
          <a
            href="/admin"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← 返回仪表盘
          </a>
        </div>
      </div>
    </div>
  );
}
