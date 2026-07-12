import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userService } from '../services/api';
import { Save, LogOut, User, Mail, Building2, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    department: user?.department || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.update(user.id, form);
      toast.success('Settings Saved', 'Your profile has been updated.');
      localStorage.setItem('user', JSON.stringify({ ...user, ...form }));
    } catch (err) { toast.error('Error', err.message); }
    finally { setLoading(false); }
  };

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '5fr 2.5fr', gap: 'var(--space-xl)' }}>
        <div className="glass-card-static" style={{ padding: 'var(--space-xl)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-xl)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={18} style={{ color: 'var(--color-primary-light)' }} /> Profile Information
          </h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="input-group">
                <label>First Name</label>
                <input className="input-field" value={form.firstName} onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))} />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input className="input-field" value={form.lastName} onChange={(e) => setForm(f => ({ ...f, lastName: e.target.value }))} />
              </div>
            </div>
            <div className="input-group">
              <label>Email (read-only)</label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input className="input-field" style={{ paddingLeft: 36, opacity: 0.6 }} value={user?.email || ''} disabled />
              </div>
            </div>
            <div className="input-group">
              <label>Department</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input className="input-field" style={{ paddingLeft: 36 }} value={form.department} onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))} />
              </div>
            </div>
            <div className="input-group">
              <label>Role</label>
              <div style={{ position: 'relative' }}>
                <Shield size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input className="input-field" style={{ paddingLeft: 36, opacity: 0.6, textTransform: 'capitalize' }} value={user?.role || ''} disabled />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
              {loading ? 'Saving...' : <><Save size={14} /> Save Changes</>}
            </button>
          </form>
        </div>

        <div>
          <div className="glass-card-static" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 80, height: 80, borderRadius: 'var(--radius-full)',
                background: 'var(--gradient-primary)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 800, color: '#fff',
                margin: '0 auto var(--space-md)',
                boxShadow: '0 8px 40px var(--color-primary-glow)',
                position: 'relative',
              }}>
                {initials}
                <div style={{
                  position: 'absolute', inset: -4, borderRadius: 'inherit',
                  background: 'var(--gradient-primary)', zIndex: -1,
                  filter: 'blur(16px)', opacity: 0.3,
                }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 4 }}>{user?.email}</div>
              <span className="badge" style={{
                marginTop: 10, display: 'inline-flex',
                background: 'var(--color-primary-subtle)', color: 'var(--color-primary-light)',
                border: '1px solid rgba(124,92,252,0.3)', textTransform: 'capitalize',
              }}>
                {user?.role}
              </span>
            </div>
          </div>

          <div className="glass-card-static" style={{ padding: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, marginBottom: 'var(--space-md)', color: 'var(--color-error)' }}>
              Danger Zone
            </h3>
            <button className="btn btn-danger" onClick={logout} style={{ width: '100%' }}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
