import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Receipt, PlusCircle, CheckSquare, BarChart3,
  Settings, UsersRound, LogOut, Wallet,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['employee', 'manager', 'finance', 'admin'] },
  { id: 'expenses', label: 'My Expenses', icon: Receipt, roles: ['employee', 'manager', 'finance', 'admin'] },
  { id: 'new-expense', label: 'New Expense', icon: PlusCircle, roles: ['employee', 'manager', 'finance', 'admin'] },
  { id: 'approvals', label: 'Approvals', icon: CheckSquare, roles: ['manager', 'admin'], badge: true },
  { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['manager', 'finance', 'admin'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['employee', 'manager', 'finance', 'admin'] },
  { id: 'admin', label: 'User Management', icon: UsersRound, roles: ['admin'] },
];

export default function Sidebar({ currentPage, onNavigate, pendingCount, collapsed, onToggle }) {
  const { user, logout } = useAuth();

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role));
  const mainNav = filteredNav.filter(i => ['dashboard', 'expenses', 'new-expense'].includes(i.id));
  const mgmtNav = filteredNav.filter(i => !['dashboard', 'expenses', 'new-expense'].includes(i.id));

  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : '?';

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Wallet size={18} />
        </div>
        <span className="sidebar-brand-text">Spendora</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Navigation</div>
        {mainNav.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon"><item.icon size={18} /></span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}

        {mgmtNav.length > 0 && (
          <>
            <div className="nav-section-title">Management</div>
            {mgmtNav.map(item => (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="nav-icon"><item.icon size={18} /></span>
                <span className="nav-label">{item.label}</span>
                {item.badge && pendingCount > 0 && (
                  <span className="nav-badge">{pendingCount}</span>
                )}
              </button>
            ))}
          </>
        )}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-avatar">{initials}</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.firstName} {user?.lastName}</div>
          <div className="sidebar-user-role">{user?.role}</div>
        </div>
        <button
          className="btn btn-ghost btn-icon"
          onClick={logout}
          title="Sign Out"
          style={{ marginLeft: 'auto' }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
