'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function TransactionFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState(searchParams.get('type') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  // 应用过滤器 - Apply filters
  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (status) params.set('status', status);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    params.set('page', '1');
    router.push(`/admin/transactions?${params.toString()}`);
  };

  // 清除过滤器 - Clear filters
  const handleClearFilters = () => {
    setType('');
    setStatus('');
    setStartDate('');
    setEndDate('');
    router.push('/admin/transactions');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">过滤器</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* 交易类型过滤 - Transaction Type Filter */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            交易类型
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">全部</option>
            <option value="TOKEN_PURCHASE">购买代币</option>
            <option value="TOKEN_USAGE">使用代币</option>
            <option value="MEMBERSHIP_PURCHASE">购买会员</option>
            <option value="REFUND">退款</option>
          </select>
        </div>

        {/* 交易状态过滤 - Transaction Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            交易状态
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">全部</option>
            <option value="COMPLETED">已完成</option>
            <option value="PENDING">处理中</option>
            <option value="FAILED">失败</option>
            <option value="REFUNDED">已退款</option>
          </select>
        </div>

        {/* 开始日期 - Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            开始日期
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 结束日期 - End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            结束日期
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* 按钮组 - Button Group */}
      <div className="flex gap-3">
        <button
          onClick={handleApplyFilters}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          应用过滤器
        </button>
        <button
          onClick={handleClearFilters}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          清除过滤器
        </button>
      </div>
    </div>
  );
}
