import { useState, useEffect } from 'react';
import { expenseService, formatCurrency } from '../services/api';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, XCircle, ArrowUpRight, Inbox } from 'lucide-react';

export default function ApprovalsPage({ onNavigate }) {
  const toast = useToast();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { fetchPending(); }, []);

  const fetchPending = async () => {
    try { const data = await expenseService.getAll({ status: 'pending', limit: 50 }); setExpenses(data.expenses); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try { await expenseService.updateStatus(id, 'approved', 'Approved'); toast.success('Approved!', 'Expense approved.'); fetchPending(); }
    catch (err) { toast.error('Error', err.message); }
    finally { setActionLoading(false); }
  };

  const handleReject = async (id) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;
    setActionLoading(true);
    try { await expenseService.updateStatus(id, 'rejected', reason); toast.error('Rejected', 'Expense rejected.'); fetchPending(); }
    catch (err) { toast.error('Error', err.message); }
    finally { setActionLoading(false); }
  };

  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleBulkApprove = async () => {
    setActionLoading(true);
    try {
      await Promise.all(selectedIds.map(id => expenseService.updateStatus(id, 'approved', 'Bulk approved')));
      toast.success('Bulk Approved!', `${selectedIds.length} expenses approved.`);
      setSelectedIds([]);
      fetchPending();
    } catch (err) { toast.error('Error', err.message); }
    finally { setActionLoading(false); }
  };

  if (loading) return <div className="page-content"><div className="loading-spinner"><div className="spinner" /></div></div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pending Approvals</h1>
          <p className="page-subtitle">{expenses.length} expenses awaiting your review</p>
        </div>
        {selectedIds.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{selectedIds.length} selected</span>
            <button className="btn btn-success btn-sm" onClick={handleBulkApprove} disabled={actionLoading}>
              <CheckCircle2 size={14} /> Approve All
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedIds([])}>Clear</button>
          </div>
        )}
      </div>

      {expenses.length === 0 ? (
        <div className="glass-card-static">
          <div className="empty-state">
            <div className="empty-state-icon"><Inbox size={48} /></div>
            <p className="empty-state-title">All caught up!</p>
            <p className="empty-state-text">No expenses pending your approval.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {expenses.map(exp => (
            <div key={exp.id} className="glass-card" style={{ padding: 'var(--space-lg)', cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(exp.id)}
                  onChange={() => toggleSelect(exp.id)}
                  style={{ width: 16, height: 16, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                />
                <div className="feed-avatar" style={{ background: 'var(--gradient-accent)', color: '#fff' }}>
                  {exp.user?.firstName?.[0]}{exp.user?.lastName?.[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', marginBottom: 3 }}>{exp.title}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span>{exp.user?.firstName} {exp.user?.lastName}</span>
                    <span style={{ opacity: 0.3 }}>·</span>
                    <span>{exp.category}</span>
                    <span style={{ opacity: 0.3 }}>·</span>
                    <span>{exp.date}</span>
                    {exp.merchant && <><span style={{ opacity: 0.3 }}>·</span><span>{exp.merchant}</span></>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', marginRight: 'var(--space-md)' }}>
                  <div style={{ fontWeight: 800, fontSize: 'var(--font-size-xl)', color: 'var(--color-primary-light)', letterSpacing: '-0.5px' }}>
                    {formatCurrency(exp.amount)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <button className="btn btn-success btn-sm" onClick={() => handleApprove(exp.id)} disabled={actionLoading}>
                    <CheckCircle2 size={14} /> Approve
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleReject(exp.id)} disabled={actionLoading}>
                    <XCircle size={14} /> Reject
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('expense-detail', exp.id)}>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
