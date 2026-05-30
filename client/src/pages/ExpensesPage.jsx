import { useState, useEffect } from 'react';
import { expenseService, formatCurrency } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Filter, X, ArrowUpRight, FileText, AlertTriangle } from 'lucide-react';

export default function ExpensesPage({ onNavigate }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ status: '', category: '', search: '' });

  useEffect(() => { fetchExpenses(); }, [pagination.page, filters]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: 15 };
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      const data = await expenseService.getAll(params);
      setExpenses(data.expenses);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const hasFilters = filters.status || filters.category || filters.search;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Expenses</h1>
          <p className="page-subtitle">{pagination.total} total expenses</p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('new-expense')}>
          <Plus size={16} /> New Expense
        </button>
      </div>

      <div className="filters-bar">
        <div style={{ position: 'relative', flex: 1, maxWidth: 260 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: 34, maxWidth: '100%' }}
            placeholder="Search expenses..."
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
          />
        </div>
        <select className="input-field" value={filters.status} onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="reimbursed">Reimbursed</option>
          <option value="draft">Draft</option>
        </select>
        <select className="input-field" value={filters.category} onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}>
          <option value="">All Categories</option>
          <option value="Travel">Travel</option>
          <option value="Food & Dining">Food & Dining</option>
          <option value="Office Supplies">Office Supplies</option>
          <option value="Accommodation">Accommodation</option>
          <option value="Transportation">Transportation</option>
          <option value="Communication">Communication</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Miscellaneous">Miscellaneous</option>
        </select>
        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ status: '', category: '', search: '' })}>
            <X size={13} /> Clear
          </button>
        )}
      </div>

      <div className="glass-card-static" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : expenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FileText size={44} /></div>
            <p className="empty-state-title">No expenses found</p>
            <p className="empty-state-text">Try adjusting your filters or create a new expense.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                {(user?.role !== 'employee') && <th>Submitted By</th>}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id} style={{ cursor: 'pointer' }} onClick={() => onNavigate('expense-detail', exp.id)}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{exp.title}</div>
                    {exp.merchant && <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>{exp.merchant}</div>}
                  </td>
                  <td style={{ fontSize: 'var(--font-size-sm)' }}>{exp.category}</td>
                  <td><span style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>{formatCurrency(exp.amount)}</span></td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    {new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className={`badge badge-${exp.status}`}>{exp.status}</span>
                      {exp.fraudScore > 0.5 && (
                        <span className="fraud-indicator fraud-high" title={`Fraud score: ${(exp.fraudScore * 100).toFixed(0)}%`}>
                          <AlertTriangle size={10} /> Flag
                        </span>
                      )}
                    </div>
                  </td>
                  {(user?.role !== 'employee') && (
                    <td style={{ fontSize: 'var(--font-size-sm)' }}>{exp.user?.firstName} {exp.user?.lastName}</td>
                  )}
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onNavigate('expense-detail', exp.id); }}>
                      <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button className="btn btn-secondary btn-sm" disabled={pagination.page <= 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>
            ← Previous
          </button>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button className="btn btn-secondary btn-sm" disabled={pagination.page >= pagination.pages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
