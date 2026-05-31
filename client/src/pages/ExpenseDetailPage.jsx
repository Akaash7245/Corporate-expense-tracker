import { useState, useEffect } from 'react';
import { expenseService, formatCurrency } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft, CheckCircle2, XCircle, CreditCard, Trash2, Receipt,
  CalendarDays, Tag, Store, Globe, X, FileText, Clock,
} from 'lucide-react';

export default function ExpenseDetailPage({ expenseId, onNavigate }) {
  const { user } = useAuth();
  const toast = useToast();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { fetchExpense(); }, [expenseId]);

  const fetchExpense = async () => {
    try {
      const data = await expenseService.getById(expenseId);
      setExpense(data.expense);
    } catch (err) {
      toast.error('Error', 'Failed to load expense details.');
    } finally { setLoading(false); }
  };

  const handleAction = async (status, comments = '') => {
    setActionLoading(true);
    try {
      await expenseService.updateStatus(expenseId, status, comments || `${status} by ${user.firstName}`);
      const msgs = { approved: 'Approved!', rejected: 'Rejected', reimbursed: 'Reimbursed!' };
      toast.success(msgs[status] || 'Updated', `Expense has been ${status}.`);
      setShowRejectModal(false);
      fetchExpense();
    } catch (err) { toast.error('Error', err.message); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try { await expenseService.delete(expenseId); toast.success('Deleted', 'Expense removed.'); onNavigate('expenses'); }
    catch (err) { toast.error('Error', err.message); }
  };

  if (loading) return <div className="page-content"><div className="loading-spinner"><div className="spinner" /></div></div>;
  if (!expense) return (
    <div className="page-content"><div className="empty-state">
      <div className="empty-state-icon"><XCircle size={44} /></div>
      <p className="empty-state-title">Expense not found</p>
      <button className="btn btn-primary" onClick={() => onNavigate('expenses')}><ArrowLeft size={14} /> Back</button>
    </div></div>
  );

  const canApprove = ['manager', 'finance', 'admin'].includes(user.role) && expense.status === 'pending';
  const canReimburse = ['finance', 'admin'].includes(user.role) && expense.status === 'approved';
  const canDelete = (user.id === expense.userId || user.role === 'admin') && !['approved', 'reimbursed'].includes(expense.status);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <button className="btn btn-ghost" onClick={() => onNavigate('expenses')} style={{ marginBottom: 8 }}>
            <ArrowLeft size={16} /> Back to Expenses
          </button>
          <h1 className="page-title">{expense.title}</h1>
          <p className="page-subtitle">
            Submitted by {expense.user?.firstName} {expense.user?.lastName} · {expense.user?.department}
          </p>
        </div>
        <span className={`badge badge-${expense.status}`} style={{ fontSize: '0.75rem', padding: '6px 16px' }}>
          {expense.status}
        </span>
      </div>

      <div className="expense-detail">
        <div className="expense-detail-main">
          {/* Amount Hero */}
          <div className="glass-card-static" style={{ padding: 'var(--space-xl)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-xl)' }}>
              <div className="detail-field">
                <span className="detail-label">Amount</span>
                <span className="detail-amount">{formatCurrency(expense.amount)}</span>
              </div>
              <div className="detail-field">
                <span className="detail-label">Category</span>
                <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Tag size={14} style={{ color: 'var(--color-primary-light)' }} /> {expense.category}
                </span>
              </div>
              <div className="detail-field">
                <span className="detail-label">Date</span>
                <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalendarDays size={14} style={{ color: 'var(--color-accent)' }} /> {expense.date}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="glass-card-static" style={{ padding: 'var(--space-xl)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={16} style={{ color: 'var(--color-primary-light)' }} /> Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
              <div className="detail-field">
                <span className="detail-label">Merchant</span>
                <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Store size={14} style={{ color: 'var(--color-text-muted)' }} /> {expense.merchant || '—'}
                </span>
              </div>
              <div className="detail-field">
                <span className="detail-label">Currency</span>
                <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Globe size={14} style={{ color: 'var(--color-text-muted)' }} /> {expense.currency}
                </span>
              </div>
              <div className="detail-field" style={{ gridColumn: '1 / -1' }}>
                <span className="detail-label">Description</span>
                <span className="detail-value" style={{ lineHeight: 1.7 }}>{expense.description || 'No description provided.'}</span>
              </div>
            </div>
          </div>

          {/* Approval History */}
          {expense.approvals?.length > 0 && (
            <div className="glass-card-static" style={{ padding: 'var(--space-xl)' }}>
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={16} style={{ color: 'var(--color-accent)' }} /> Approval History
              </h3>
              {expense.approvals.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                  padding: 'var(--space-md) 0', borderBottom: '1px solid var(--color-border)',
                }}>
                  <span className={`badge badge-${a.status}`}>{a.status}</span>
                  <span style={{ fontSize: 'var(--font-size-sm)' }}>{a.approver?.firstName} {a.approver?.lastName}</span>
                  {a.comments && <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>"{a.comments}"</span>}
                  <span style={{ marginLeft: 'auto', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    {a.actionDate ? new Date(a.actionDate).toLocaleDateString() : ''}
                  </span>
                </div>
              ))}
            </div>
          )}

          {expense.status === 'rejected' && expense.rejectedReason && (
            <div className="glass-card-static" style={{ padding: 'var(--space-lg)', borderLeft: '3px solid var(--color-error)' }}>
              <h4 style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)', fontWeight: 700, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <XCircle size={14} /> Rejection Reason
              </h4>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{expense.rejectedReason}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="glass-card-static" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Receipt size={16} style={{ color: 'var(--color-accent)' }} /> Receipt
            </h3>
            {expense.receiptUrl ? (
              <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${expense.receiptUrl}`} alt="Receipt" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-xl)',
                background: 'var(--color-bg-glass)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)',
              }}>
                <Receipt size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
                No receipt attached
              </div>
            )}
          </div>

          <div className="glass-card-static" style={{ padding: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {canApprove && (
                <>
                  <button className="btn btn-success" onClick={() => handleAction('approved')} disabled={actionLoading} style={{ width: '100%' }}>
                    <CheckCircle2 size={16} /> Approve
                  </button>
                  <button className="btn btn-danger" onClick={() => setShowRejectModal(true)} disabled={actionLoading} style={{ width: '100%' }}>
                    <XCircle size={16} /> Reject
                  </button>
                </>
              )}
              {canReimburse && (
                <button className="btn btn-primary" onClick={() => handleAction('reimbursed')} disabled={actionLoading} style={{ width: '100%' }}>
                  <CreditCard size={16} /> Mark Reimbursed
                </button>
              )}
              {canDelete && (
                <button className="btn btn-ghost" onClick={handleDelete} style={{ width: '100%', color: 'var(--color-error)' }}>
                  <Trash2 size={14} /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Reject Expense</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowRejectModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label>Reason for Rejection *</label>
                <textarea className="input-field" placeholder="Please provide a reason..." value={rejectComment} onChange={(e) => setRejectComment(e.target.value)} rows={4} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { if (!rejectComment.trim()) { toast.warning('Required', 'Please provide a reason.'); return; } handleAction('rejected', rejectComment); }} disabled={actionLoading}>
                {actionLoading ? 'Rejecting...' : 'Reject Expense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
