import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 导出交易记录为CSV - Export transactions as CSV
export async function GET(request: NextRequest) {
  try {
    // 在实际应用中，这里应该检查管理员权限
    // In production, check admin permissions here
    
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

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

    // 获取所有符合条件的交易记录 - Get all matching transactions
    const transactions = await prisma.transaction.findMany({
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
    });

    // 构建CSV内容 - Build CSV content
    const csvHeaders = [
      '交易ID',
      '用户邮箱',
      '用户名',
      '交易类型',
      '交易状态',
      '金额',
      '代币数量',
      'Stripe付款ID',
      '描述',
      '创建时间',
    ].join(',');

    // 将交易记录转换为CSV行 - Convert transactions to CSV rows
    const csvRows = transactions.map((transaction) => {
      // 格式化每个字段，处理可能包含逗号的字段
      // Format each field, handle fields that may contain commas
      const fields = [
        transaction.id,
        `"${transaction.user.email}"`,
        `"${transaction.user.username}"`,
        transaction.type,
        transaction.status,
        transaction.amount.toFixed(2),
        transaction.tokenAmount !== null ? transaction.tokenAmount.toString() : '',
        transaction.stripePaymentId || '',
        transaction.description ? `"${transaction.description.replace(/"/g, '""')}"` : '',
        new Date(transaction.createdAt).toISOString(),
      ];
      return fields.join(',');
    });

    // 组合CSV内容 - Combine CSV content
    const csvContent = [csvHeaders, ...csvRows].join('\n');

    // 添加BOM以支持Excel正确显示中文 - Add BOM for proper Chinese display in Excel
    const bom = '\uFEFF';
    const csvWithBom = bom + csvContent;

    // 生成文件名 - Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `transactions_${timestamp}.csv`;

    // 返回CSV文件 - Return CSV file
    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('CSV导出错误:', error);
    return NextResponse.json(
      { error: 'Failed to export transactions' },
      { status: 500 }
    );
  }
}
