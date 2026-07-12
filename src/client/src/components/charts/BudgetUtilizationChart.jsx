import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BUDGET_LIMITS = {
  'Travel': 150000, 'Food & Dining': 50000, 'Office Supplies': 40000,
  'Accommodation': 120000, 'Transportation': 80000, 'Communication': 15000,
  'Entertainment': 30000, 'Miscellaneous': 25000,
};

const COLORS = [
  'rgba(124, 92, 252, 0.75)', 'rgba(251, 191, 36, 0.75)',
  'rgba(52, 211, 153, 0.75)', 'rgba(168, 85, 247, 0.75)',
  'rgba(56, 189, 248, 0.75)', 'rgba(248, 113, 113, 0.75)',
  'rgba(20, 184, 166, 0.75)', 'rgba(100, 116, 139, 0.75)',
];

const BORDER_COLORS = [
  '#7c5cfc', '#fbbf24', '#34d399', '#a855f7',
  '#38bdf8', '#f87171', '#14b8a6', '#64748b',
];

export default function BudgetUtilizationChart({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return <div className="empty-state"><p className="empty-state-text">No data available</p></div>;
  }

  const categories = Object.keys(data);

  const chartData = {
    labels: categories.map(c => c.length > 12 ? c.substring(0, 12) + '…' : c),
    datasets: [
      {
        label: 'Spent',
        data: categories.map(c => data[c]),
        backgroundColor: categories.map((_, i) => COLORS[i % COLORS.length]),
        borderColor: categories.map((_, i) => BORDER_COLORS[i % BORDER_COLORS.length]),
        borderWidth: 1.5,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.55,
      },
      {
        label: 'Budget',
        data: categories.map(c => BUDGET_LIMITS[c] || 2000),
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.55,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#8b95b5',
          font: { family: 'Inter', size: 11, weight: 500 },
          usePointStyle: true,
          pointStyleWidth: 8,
          boxWidth: 6,
          boxHeight: 6,
          padding: 18,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(6, 8, 15, 0.95)',
        titleColor: '#f0f2f8',
        bodyColor: '#8b95b5',
        borderColor: 'rgba(124,92,252,0.2)',
        borderWidth: 1,
        cornerRadius: 10,
        padding: { top: 12, bottom: 12, left: 16, right: 16 },
        titleFont: { family: 'Inter', weight: 700 },
        bodyFont: { family: 'Inter' },
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString('en-IN')}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#565f80', font: { family: 'Inter', size: 10, weight: 500 }, padding: 8 },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
        ticks: {
          color: '#565f80',
          font: { family: 'Inter', size: 11, weight: 500 },
          padding: 12,
          callback: (v) => `₹${(v / 1000).toFixed(0)}k`,
        },
        border: { display: false },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
