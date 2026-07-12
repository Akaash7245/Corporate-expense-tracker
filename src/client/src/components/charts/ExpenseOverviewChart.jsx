import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  'rgba(124, 92, 252, 0.85)',
  'rgba(251, 191, 36, 0.85)',
  'rgba(52, 211, 153, 0.85)',
  'rgba(168, 85, 247, 0.85)',
  'rgba(56, 189, 248, 0.85)',
  'rgba(248, 113, 113, 0.85)',
  'rgba(20, 184, 166, 0.85)',
  'rgba(100, 116, 139, 0.85)',
];

const BORDER_COLORS = [
  '#7c5cfc', '#fbbf24', '#34d399', '#a855f7',
  '#38bdf8', '#f87171', '#14b8a6', '#64748b',
];

export default function ExpenseOverviewChart({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return <div className="empty-state"><p className="empty-state-text">No data available</p></div>;
  }

  const chartData = {
    labels: Object.keys(data),
    datasets: [{
      data: Object.values(data),
      backgroundColor: COLORS.slice(0, Object.keys(data).length),
      borderColor: BORDER_COLORS.slice(0, Object.keys(data).length),
      borderWidth: 1.5,
      hoverBorderWidth: 2,
      hoverOffset: 12,
      spacing: 3,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#8b95b5',
          font: { family: 'Inter', size: 11, weight: 500 },
          padding: 14,
          usePointStyle: true,
          pointStyleWidth: 8,
          boxWidth: 6,
          boxHeight: 6,
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
        titleFont: { family: 'Inter', weight: 700, size: 13 },
        bodyFont: { family: 'Inter', size: 12 },
        boxPadding: 6,
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.toLocaleString('en-IN')}`,
        },
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
}
