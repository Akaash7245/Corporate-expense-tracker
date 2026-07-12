import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatusDistributionChart({ data }) {
  if (!data) return <div className="empty-state"><p className="empty-state-text">No data available</p></div>;

  const chartData = {
    labels: ['Pending', 'Approved', 'Rejected', 'Reimbursed'],
    datasets: [{
      data: [data.pending || 0, data.approved || 0, data.rejected || 0, data.reimbursed || 0],
      backgroundColor: [
        'rgba(251, 191, 36, 0.8)',
        'rgba(52, 211, 153, 0.8)',
        'rgba(248, 113, 113, 0.8)',
        'rgba(96, 165, 250, 0.8)',
      ],
      borderColor: ['#fbbf24', '#34d399', '#f87171', '#60a5fa'],
      borderWidth: 1.5,
      hoverOffset: 10,
      spacing: 3,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#8b95b5',
          font: { family: 'Inter', size: 11, weight: 500 },
          padding: 18,
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
        titleFont: { family: 'Inter', weight: 700 },
        bodyFont: { family: 'Inter' },
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}
