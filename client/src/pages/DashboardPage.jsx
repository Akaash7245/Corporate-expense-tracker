import { useState, useEffect } from 'react';
import { expenseService, formatCurrency } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ExpenseOverviewChart from '../components/charts/ExpenseOverviewChart';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import StatusDistributionChart from '../components/charts/StatusDistributionChart';
import BudgetUtilizationChart from '../components/charts/BudgetUtilizationChart';
import {
  DollarSign, Clock, CheckCircle2, TrendingDown, Plus,
  ArrowUpRight, ArrowDownRight, Activity, Radio, Receipt,
} from 'lucide-react';

export default function DashboardPage({ onNavigate, realtimeExpenses }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [statsData, expensesData] = await Promise.all([
        expenseService.getStats(),
        expenseService.getAll({ limit: 5 }),
      ]);
      setStats(statsData);
      setRecentExpenses(expensesData.expenses);
    } catch (err) { console.error('Dashboard fetch error:', err); }
    finally { setLoading(false); }
  };

  if (loading) {
    return <div className="page-content"><div className="loading-spinner"><div className="spinner" /></div></div>;
  }

  const kpiCards = [
    {
      label: 'Total Expenses',
      value: formatCurrency(stats?.amounts?.total),
      icon: DollarSign,
      iconClass: 'primary',
      kpiClass: 'kpi-primary',
      sub: `${stats?.counts?.total || 0} total expenses`,
      positive: true,
    },
    {
      label: 'Pending Approval',
      value: formatCurrency(stats?.amounts?.pending),
      icon: Clock,
      iconClass: 'warning',
      kpiClass: 'kpi-warning',
      sub: `${stats?.counts?.pending || 0} awaiting review`,
      positive: false,
    },
    {
      label: 'Approved',
      value: formatCurrency(stats?.amounts?.approved),
      icon: CheckCircle2,
      iconClass: 'success',
      kpiClass: 'kpi-success',
      sub: `${stats?.counts?.approved || 0} approved`,
      positive: true,
    },
    {
      label: 'Rejection Rate',
      value: stats?.counts?.total > 0
        ? `${((stats.counts.rejected / stats.counts.total) * 100).toFixed(1)}%`
        : '0%',
      icon: TrendingDown,
      iconClass: 'info',
      kpiClass: 'kpi-info',
      sub: `${stats?.counts?.rejected || 0} rejected`,
      positive: false,
    },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.firstName}. Here's your expense overview.</p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('new-expense')}>
          <Plus size={16} /> New Expense
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpiCards.map((kpi, i) => (
          <div key={i} className={`glass-card kpi-card ${kpi.kpiClass}`}>
            <div className="kpi-glow" />
            <div className="kpi-header">
              <span className="kpi-label">{kpi.label}</span>
              <div className={`kpi-icon ${kpi.iconClass}`}>
                <kpi.icon size={20} />
              </div>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className={`kpi-change ${kpi.positive ? 'positive' : 'negative'}`}>
              {kpi.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid">
        <div className="glass-card-static chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Expenses by Category</h3>
          </div>
          <div className="chart-container">
            <ExpenseOverviewChart data={stats?.categoryBreakdown} />
          </div>
        </div>
        <div className="glass-card-static chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Monthly Trend</h3>
          </div>
          <div className="chart-container">
            <MonthlyTrendChart data={stats?.monthlyData} />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-grid">
        <div className="glass-card-static chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Status Distribution</h3>
          </div>
          <div className="chart-container">
            <StatusDistributionChart data={stats?.counts} />
          </div>
        </div>
        <div className="glass-card-static chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Budget Utilization</h3>
          </div>
          <div className="chart-container">
            <BudgetUtilizationChart data={stats?.categoryBreakdown} />
          </div>
        </div>
      </div>

      {/* Recent + Live Feed */}
      <div className="charts-grid">
        <div className="glass-card-static" style={{ padding: 'var(--space-xl)' }}>
          <div className="chart-header">
            <h3 className="chart-title">Recent Expenses</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('expenses')}>
              View All <ArrowUpRight size={12} />
            </button>
          </div>
          {recentExpenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Receipt size={40} /></div>
              <p className="empty-state-title">No expenses yet</p>
              <p className="empty-state-text">Submit your first expense to get started.</p>
            </div>
          ) : (
            <div className="live-feed">
              {recentExpenses.map(exp => (
                <div key={exp.id} className="feed-item" onClick={() => onNavigate('expense-detail', exp.id)}>
                  <div className="feed-avatar" style={{ background: 'var(--gradient-accent)', color: '#fff' }}>
                    {exp.user?.firstName?.[0]}{exp.user?.lastName?.[0]}
                  </div>
                  <div className="feed-content">
                    <div className="feed-title">{exp.title}</div>
                    <div className="feed-meta">
                      <span className={`badge badge-${exp.status}`}>{exp.status}</span>
                      <span>{exp.category}</span>
                      <span>·</span>
                      <span>{exp.date ? new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : ''}</span>
                    </div>
                  </div>
                  <div className="feed-amount" style={{ color: 'var(--color-primary-light)' }}>
                    {formatCurrency(exp.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card-static" style={{ padding: 'var(--space-xl)' }}>
          <div className="chart-header">
            <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Radio size={14} style={{ color: 'var(--color-error)' }} />
              Live Feed
            </h3>
            <span style={{
              fontSize: '0.6875rem', color: 'var(--color-success)',
              display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600,
            }}>
              <Activity size={12} /> Real-time
            </span>
          </div>
          <div className="live-feed">
            {realtimeExpenses && realtimeExpenses.length > 0 ? (
              realtimeExpenses.slice(0, 8).map((exp, i) => (
                <div key={exp.id || i} className="feed-item new-item">
                  <div className="feed-avatar" style={{ background: 'var(--gradient-primary)', color: '#fff' }}>
                    {exp.user?.firstName?.[0]}{exp.user?.lastName?.[0]}
                  </div>
                  <div className="feed-content">
                    <div className="feed-title">{exp.title}</div>
                    <div className="feed-meta"><span>{exp.category}</span></div>
                  </div>
                  <div className="feed-amount" style={{ color: 'var(--color-success)' }}>
                    {formatCurrency(exp.amount)}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <div className="empty-state-icon"><Activity size={36} /></div>
                <p className="empty-state-text">Live updates appear here when new expenses are submitted.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
