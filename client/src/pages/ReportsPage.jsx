import { useState, useEffect } from 'react';
import { expenseService, formatCurrency } from '../services/api';
import ExpenseOverviewChart from '../components/charts/ExpenseOverviewChart';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import BudgetUtilizationChart from '../components/charts/BudgetUtilizationChart';
import {
  BarChart3, TrendingUp, DollarSign, CheckCircle2,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

export default function ReportsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setStats(await expenseService.getStats()); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="page-content"><div className="loading-spinner"><div className="spinner" /></div></div>;

  const totalBudget = 510000;
  const utilization = stats?.amounts?.total ? ((stats.amounts.total / totalBudget) * 100).toFixed(1) : 0;

  const kpis = [
    { label: 'Total Expenditure', value: formatCurrency(stats?.amounts?.total), icon: BarChart3, iconClass: 'primary', kpiClass: 'kpi-primary', sub: `Across ${stats?.counts?.total || 0} expenses`, positive: true },
    { label: 'Budget Utilization', value: `${utilization}%`, icon: TrendingUp, iconClass: 'warning', kpiClass: 'kpi-warning', sub: `of ${formatCurrency(totalBudget)} budget`, positive: utilization <= 80 },
    { label: 'Avg per Expense', value: stats?.counts?.total > 0 ? formatCurrency(stats.amounts.total / stats.counts.total) : '$0', icon: DollarSign, iconClass: 'success', kpiClass: 'kpi-success', sub: 'Per transaction average', positive: true },
    { label: 'Approval Rate', value: stats?.counts?.total > 0 ? `${(((stats.counts.approved + stats.counts.reimbursed) / stats.counts.total) * 100).toFixed(1)}%` : '0%', icon: CheckCircle2, iconClass: 'info', kpiClass: 'kpi-info', sub: `${(stats?.counts?.approved || 0) + (stats?.counts?.reimbursed || 0)} of ${stats?.counts?.total || 0}`, positive: true },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Comprehensive expense analysis and insights</p>
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map((kpi, i) => (
          <div key={i} className={`glass-card kpi-card ${kpi.kpiClass}`}>
            <div className="kpi-glow" />
            <div className="kpi-header">
              <span className="kpi-label">{kpi.label}</span>
              <div className={`kpi-icon ${kpi.iconClass}`}><kpi.icon size={20} /></div>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className={`kpi-change ${kpi.positive ? 'positive' : 'negative'}`}>
              {kpi.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="glass-card-static chart-card">
          <div className="chart-header"><h3 className="chart-title">Spending by Category</h3></div>
          <div className="chart-container"><ExpenseOverviewChart data={stats?.categoryBreakdown} /></div>
        </div>
        <div className="glass-card-static chart-card">
          <div className="chart-header"><h3 className="chart-title">Monthly Spending Trend</h3></div>
          <div className="chart-container"><MonthlyTrendChart data={stats?.monthlyData} /></div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="glass-card-static chart-card" style={{ gridColumn: '1 / -1' }}>
          <div className="chart-header"><h3 className="chart-title">Budget vs Actual Spending</h3></div>
          <div className="chart-container" style={{ height: 350 }}><BudgetUtilizationChart data={stats?.categoryBreakdown} /></div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="glass-card-static" style={{ padding: 'var(--space-xl)', marginTop: 'var(--space-lg)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>Category Breakdown</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Spent</th>
              <th>% of Total</th>
              <th>Utilization</th>
            </tr>
          </thead>
          <tbody>
            {stats?.categoryBreakdown && Object.entries(stats.categoryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amount]) => {
                const pct = ((amount / stats.amounts.total) * 100).toFixed(1);
                return (
                  <tr key={cat}>
                    <td style={{ fontWeight: 600 }}>{cat}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>{formatCurrency(amount)}</td>
                    <td style={{ fontSize: 'var(--font-size-sm)' }}>{pct}%</td>
                    <td style={{ width: 220 }}>
                      <div style={{ height: 6, borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 'var(--radius-full)',
                          background: 'var(--gradient-primary)',
                          width: `${Math.min(parseFloat(pct), 100)}%`,
                          transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
