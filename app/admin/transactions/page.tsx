import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';
import TransactionsTable from './TransactionsTable';
import TransactionFilters from './TransactionFilters';

interface TransactionsPageProps {
  searchParams: Promise<{
    page?: string;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

// 获取交易记录数据 - Get transactions data
async function getTransactions(
  page: number,
  type?: string,
  status?: string,
  startDate?: string,
  endDate?: string
) {
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  // 构建查询条件 - Build query conditions
  const where: any = {};

  if (type) {
    where.type = type;
  }

  if (status) {
    where.status = status;
  }

  // 日期范围过滤 - Date range filter
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      where.createdAt.lte = endDateTime;
    }
  }

  // 查询交易记录 - Query transactions
  const [transactions, totalCount] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
  };
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const type = params.type;
  const status = params.status;
  const startDate = params.startDate;
  const endDate = params.endDate;

  const { transactions, totalCount, totalPages, currentPage } =
    await getTransactions(page, type, status, startDate, endDate);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 - Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">交易记录</h1>
            <p className="text-gray-600 mt-2">总共 {totalCount} 条交易记录</p>
          </div>
          <a
            href="/admin/transactions/export"
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            导出CSV
          </a>
        </div>

        {/* 过滤器 - Filters */}
        <TransactionFilters />

        {/* 交易表格 - Transactions Table */}
        <Suspense fallback={<div>加载中...</div>}>
          <TransactionsTable
            transactions={transactions}
            currentPage={currentPage}
            totalPages={totalPages}
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
