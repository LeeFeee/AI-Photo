'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// 注册Chart.js组件 - Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Transaction {
  amount: number;
  createdAt: Date;
}

interface DashboardChartsProps {
  transactions: Transaction[];
}

export default function DashboardCharts({ transactions }: DashboardChartsProps) {
  // 按日期分组交易数据 - Group transactions by date
  const groupedData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.createdAt).toLocaleDateString('zh-CN');
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const dates = Object.keys(groupedData).sort();
  const revenues = dates.map(date => groupedData[date]);

  // 收入趋势图表数据 - Revenue trend chart data
  const revenueChartData = {
    labels: dates,
    datasets: [
      {
        label: '每日收入',
        data: revenues,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // 收入分布柱状图数据 - Revenue distribution bar chart data
  const barChartData = {
    labels: dates.slice(-7), // 最近7天 - Last 7 days
    datasets: [
      {
        label: '收入 ($)',
        data: revenues.slice(-7),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number | string) {
            return '$' + value;
          }
        }
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 收入趋势图 - Revenue Trend Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">30天收入趋势</h3>
        <div style={{ height: '300px' }}>
          <Line data={revenueChartData} options={chartOptions} />
        </div>
      </div>

      {/* 最近7天收入柱状图 - Last 7 Days Revenue Bar Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">最近7天收入</h3>
        <div style={{ height: '300px' }}>
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
