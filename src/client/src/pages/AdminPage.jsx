import { useState, useEffect } from 'react';
import { userService, formatCurrency } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  UserPlus, Users, Search, Shield, Mail, Building2, X,
  ToggleLeft, ToggleRight, Edit3, ChevronDown, UserCheck, UserX,
  Filter, Download,
} from 'lucide-react';

const DEPARTMENTS = [
  'Engineering', 'Marketing', 'Finance & Accounts', 'HR & People Ops',
  'Sales', 'Product Management', 'Design', 'Operations',
  'IT Administration', 'Legal & Compliance', 'Customer Success', 'General',
];

const ROLES = [
  { value: 'employee', label: 'Employee', color: 'var(--color-accent)' },
  { value: 'manager', label: 'Manager', color: 'var(--color-primary-light)' },
  { value: 'finance', label: 'Finance', color: 'var(--color-success)' },
  { value: 'admin', label: 'Admin', color: 'var(--color-error)' },
];

const ROLE_COLORS = {
  employee: 'var(--color-accent)',
  manager: 'var(--color-primary-light)',
  finance: 'var(--color-success)',
  admin: 'var(--color-error)',
};

export default function AdminPage() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', role: '', department: '' });
  const [createForm, setCreateForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    role: 'employee', department: 'General', managerId: '',
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data.users);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!createForm.firstName || !createForm.lastName || !createForm.email || !createForm.password) {
      toast.error('Validation Error', 'All fields are required.');
      return;
    }
    setActionLoading(true);
    try {
      const payload = { ...createForm };
      if (!payload.managerId) delete payload.managerId;
      await userService.create(payload);
      toast.success('User Created', `${createForm.firstName} ${createForm.lastName} has been added.`);
      setShowCreateModal(false);
      setCreateForm({ firstName: '', lastName: '', email: '', password: '', role: 'employee', department: 'General', managerId: '' });
      fetchUsers();
    } catch (err) {
      toast.error('Failed', err.message);
    } finally { setActionLoading(false); }
  };

  const handleToggleActive = async (user) => {
    try {
      await userService.toggleActive(user.id);
      toast.success(
        user.isActive ? 'User Deactivated' : 'User Activated',
        `${user.firstName} ${user.lastName} has been ${user.isActive ? 'deactivated' : 'activated'}.`
      );
      fetchUsers();
    } catch (err) { toast.error('Error', err.message); }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setActionLoading(true);
    try {
      await userService.update(editingUser.id, {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        department: editingUser.department,
        role: editingUser.role,
        managerId: editingUser.managerId || null,
      });
      toast.success('User Updated', `${editingUser.firstName}'s profile has been updated.`);
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) { toast.error('Error', err.message); }
    finally { setActionLoading(false); }
  };

  const managers = users.filter(u => u.role === 'manager' || u.role === 'admin');
  const filteredUsers = users.filter(u => {
    if (filters.role && u.role !== filters.role) return false;
    if (filters.department && u.department !== filters.department) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length,
    managers: users.filter(u => u.role === 'manager').length,
  };

  if (loading) return <div className="page-content"><div className="loading-spinner"><div className="spinner" /></div></div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">{stats.total} total users · {stats.active} active · {stats.inactive} inactive</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <UserPlus size={16} /> Add User
        </button>
      </div>

      {/* Stats Row */}
      <div className="kpi-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Total Users', value: stats.total, icon: Users, iconClass: 'primary', kpiClass: 'kpi-primary' },
          { label: 'Active Users', value: stats.active, icon: UserCheck, iconClass: 'success', kpiClass: 'kpi-success' },
          { label: 'Inactive Users', value: stats.inactive, icon: UserX, iconClass: 'warning', kpiClass: 'kpi-warning' },
          { label: 'Managers & Admins', value: stats.admins + stats.managers, icon: Shield, iconClass: 'info', kpiClass: 'kpi-info' },
        ].map((kpi, i) => (
          <div key={i} className={`glass-card kpi-card ${kpi.kpiClass}`}>
            <div className="kpi-glow" />
            <div className="kpi-header">
              <span className="kpi-label">{kpi.label}</span>
              <div className={`kpi-icon ${kpi.iconClass}`}><kpi.icon size={20} /></div>
            </div>
            <div className="kpi-value">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text" className="input-field" style={{ paddingLeft: 34, maxWidth: '100%' }}
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
          />
        </div>
        <select className="input-field" value={filters.role} onChange={(e) => setFilters(f => ({ ...f, role: e.target.value }))}>
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <select className="input-field" value={filters.department} onChange={(e) => setFilters(f => ({ ...f, department: e.target.value }))}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        {(filters.search || filters.role || filters.department) && (
          <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ search: '', role: '', department: '' })}>
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="glass-card-static" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Joined</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 'var(--radius-full)',
                      background: ROLE_COLORS[u.role] || 'var(--gradient-accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.625rem', fontWeight: 800, color: '#fff', flexShrink: 0,
                      opacity: u.isActive ? 1 : 0.4,
                    }}>
                      {u.firstName?.[0]}{u.lastName?.[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', opacity: u.isActive ? 1 : 0.5 }}>
                        {u.firstName} {u.lastName}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', opacity: u.isActive ? 1 : 0.5 }}>
                  {u.email}
                </td>
                <td>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '2px 10px', borderRadius: 'var(--radius-full)',
                    fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    background: `color-mix(in srgb, ${ROLE_COLORS[u.role]} 12%, transparent)`,
                    color: ROLE_COLORS[u.role],
                    border: `1px solid color-mix(in srgb, ${ROLE_COLORS[u.role]} 25%, transparent)`,
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ fontSize: 'var(--font-size-sm)', opacity: u.isActive ? 1 : 0.5 }}>{u.department}</td>
                <td>
                  <span className={`badge ${u.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)', justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => { setEditingUser({ ...u }); setShowEditModal(true); }}
                      title="Edit user"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleToggleActive(u)}
                      title={u.isActive ? 'Deactivate' : 'Activate'}
                      style={{ color: u.isActive ? 'var(--color-warning)' : 'var(--color-success)' }}
                    >
                      {u.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon"><Users size={44} /></div>
            <p className="empty-state-title">No users found</p>
            <p className="empty-state-text">Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserPlus size={18} style={{ color: 'var(--color-primary-light)' }} /> Add New User
              </h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowCreateModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                  <div className="input-group">
                    <label>First Name *</label>
                    <input className="input-field" placeholder="e.g., Arun" value={createForm.firstName}
                      onChange={(e) => setCreateForm(f => ({ ...f, firstName: e.target.value }))} required />
                  </div>
                  <div className="input-group">
                    <label>Last Name *</label>
                    <input className="input-field" placeholder="e.g., Kumar" value={createForm.lastName}
                      onChange={(e) => setCreateForm(f => ({ ...f, lastName: e.target.value }))} required />
                  </div>
                </div>

                <div className="input-group">
                  <label>Email Address *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input type="email" className="input-field" style={{ paddingLeft: 36 }}
                      placeholder="arun.kumar@company.com" value={createForm.email}
                      onChange={(e) => setCreateForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                </div>

                <div className="input-group">
                  <label>Password *</label>
                  <input type="password" className="input-field" placeholder="Minimum 6 characters"
                    value={createForm.password}
                    onChange={(e) => setCreateForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                  <div className="input-group">
                    <label>Role</label>
                    <select className="input-field" value={createForm.role}
                      onChange={(e) => setCreateForm(f => ({ ...f, role: e.target.value }))}>
                      {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Department</label>
                    <select className="input-field" value={createForm.department}
                      onChange={(e) => setCreateForm(f => ({ ...f, department: e.target.value }))}>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>Reporting Manager</label>
                  <select className="input-field" value={createForm.managerId}
                    onChange={(e) => setCreateForm(f => ({ ...f, managerId: e.target.value }))}>
                    <option value="">No Manager (Top Level)</option>
                    {managers.map(m => (
                      <option key={m.id} value={m.id}>{m.firstName} {m.lastName} — {m.department}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                  {actionLoading ? 'Creating...' : <><UserPlus size={14} /> Create User</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Edit3 size={18} style={{ color: 'var(--color-accent)' }} /> Edit User
              </h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowEditModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleEditUser}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                  <div className="input-group">
                    <label>First Name</label>
                    <input className="input-field" value={editingUser.firstName}
                      onChange={(e) => setEditingUser(u => ({ ...u, firstName: e.target.value }))} />
                  </div>
                  <div className="input-group">
                    <label>Last Name</label>
                    <input className="input-field" value={editingUser.lastName}
                      onChange={(e) => setEditingUser(u => ({ ...u, lastName: e.target.value }))} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Email (read-only)</label>
                  <input className="input-field" value={editingUser.email} disabled style={{ opacity: 0.5 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                  <div className="input-group">
                    <label>Role</label>
                    <select className="input-field" value={editingUser.role}
                      onChange={(e) => setEditingUser(u => ({ ...u, role: e.target.value }))}>
                      {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Department</label>
                    <select className="input-field" value={editingUser.department}
                      onChange={(e) => setEditingUser(u => ({ ...u, department: e.target.value }))}>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>Reporting Manager</label>
                  <select className="input-field" value={editingUser.managerId || ''}
                    onChange={(e) => setEditingUser(u => ({ ...u, managerId: e.target.value || null }))}>
                    <option value="">No Manager</option>
                    {managers.filter(m => m.id !== editingUser.id).map(m => (
                      <option key={m.id} value={m.id}>{m.firstName} {m.lastName} — {m.department}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
