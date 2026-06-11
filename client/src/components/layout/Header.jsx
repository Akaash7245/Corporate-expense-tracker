import { useState } from 'react';
import { notificationService } from '../../services/api';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Header({ collapsed, notifications, unreadCount, onRefreshNotifications }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      onRefreshNotifications();
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id);
      onRefreshNotifications();
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now - date) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <header className={`header ${collapsed ? 'collapsed' : ''}`}>
      <div className="header-search">
        <span className="search-icon"><Search size={15} /></span>
        <input
          type="text"
          placeholder="Search expenses, categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="header-actions">
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button
          className="notification-btn"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </button>
      </div>

      {showNotifications && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 94 }}
            onClick={() => setShowNotifications(false)}
          />
          <div className="notification-panel">
            <div className="notification-panel-header">
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Notifications</h3>
              {unreadCount > 0 && (
                <button className="btn btn-ghost btn-sm" onClick={handleMarkAllRead}>
                  Mark all read
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="empty-state" style={{ padding: '2.5rem' }}>
                <div className="empty-state-icon"><Bell size={40} /></div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`notification-item ${!n.isRead ? 'unread' : ''}`}
                  onClick={() => handleMarkRead(n.id)}
                >
                  <div className={`notification-dot ${n.type}`} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '2px' }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      {n.message}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', marginTop: '4px', opacity: 0.7 }}>
                      {formatTime(n.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </header>
  );
}
