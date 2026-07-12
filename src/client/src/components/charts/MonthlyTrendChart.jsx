import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function MonthlyTrendChart({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return <div className="empty-state"><p className="empty-state-text">No data available</p></div>;
  }

  const labels = Object.keys(data).sort();
  const values = labels.map(l => data[l]);

  const chartData = {
    labels: labels.map(l => {
      const [y, m] = l.split('-');
      return new Date(y, m - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }),
    datasets: [{
      label: 'Total Expenses',
      data: values,
      borderColor: '#7c5cfc',
      backgroundColor: (ctx) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280);
        g.addColorStop(0, 'rgba(124, 92, 252, 0.25)');
        g.addColorStop(0.5, 'rgba(124, 92, 252, 0.08)');
        g.addColorStop(1, 'rgba(124, 92, 252, 0.0)');
        return g;
      },
      borderWidth: 2.5,
      fill: true,
      tension: 0.45,
      pointRadius: 5,
      pointBackgroundColor: '#7c5cfc',
      pointBorderColor: '#06080f',
      pointBorderWidth: 3,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: '#a78bfa',
      pointHoverBorderColor: '#06080f',
      pointHoverBorderWidth: 3,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
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
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString('en-IN')}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
        ticks: { color: '#565f80', font: { family: 'Inter', size: 11, weight: 500 }, padding: 8 },
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

  return <Line data={chartData} options={options} />;
}
