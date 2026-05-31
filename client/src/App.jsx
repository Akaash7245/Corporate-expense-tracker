import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { notificationService } from './services/api';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import NewExpensePage from './pages/NewExpensePage';
import ExpenseDetailPage from './pages/ExpenseDetailPage';
import ApprovalsPage from './pages/ApprovalsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [realtimeExpenses, setRealtimeExpenses] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await notificationService.getAll();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error('Notification fetch error:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Poll notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications]);

  // Socket.io connection for real-time updates
  useEffect(() => {
    if (!isAuthenticated) return;

    let socket;
    const connectSocket = async () => {
      try {
        const { io } = await import('socket.io-client');
        const token = localStorage.getItem('token');
        // Hardcoding the production Render URL for socket connections
        socket = io('https://corporate-expense-tracker-test.onrender.com', {
          auth: { token },
          transports: ['websocket', 'polling'],
        });

        socket.on('connect', () => {
          console.log('🔌 Socket connected');
        });

        socket.on('expense:created', (expense) => {
          setRealtimeExpenses(prev => [expense, ...prev].slice(0, 20));
          setPendingCount(prev => prev + 1);
          fetchNotifications();
        });

        socket.on('expense:updated', (expense) => {
          setRealtimeExpenses(prev => {
            const existing = prev.findIndex(e => e.id === expense.id);
            if (existing >= 0) {
              const updated = [...prev];
              updated[existing] = expense;
              return updated;
            }
            return [expense, ...prev].slice(0, 20);
          });
          fetchNotifications();
        });

        socket.on('notification', (data) => {
          fetchNotifications();
        });

        socket.on('connect_error', (err) => {
          console.log('Socket connection error (server may not be running)');
        });
      } catch (err) {
        console.log('Socket.io not available');
      }
    };

    connectSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [isAuthenticated]);

  const navigate = useCallback((page, expenseId = null) => {
    setCurrentPage(page);
    if (page === 'expense-detail' && expenseId) {
      setSelectedExpenseId(expenseId);
    }
  }, []);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={navigate} realtimeExpenses={realtimeExpenses} />;
      case 'expenses':
        return <ExpensesPage onNavigate={navigate} />;
      case 'new-expense':
        return <NewExpensePage onNavigate={navigate} />;
      case 'expense-detail':
        return <ExpenseDetailPage expenseId={selectedExpenseId} onNavigate={navigate} />;
      case 'approvals':
        return <ApprovalsPage onNavigate={navigate} />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <DashboardPage onNavigate={navigate} realtimeExpenses={realtimeExpenses} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        onNavigate={navigate}
        pendingCount={pendingCount}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`app-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header
          collapsed={sidebarCollapsed}
          notifications={notifications}
          unreadCount={unreadCount}
          onRefreshNotifications={fetchNotifications}
        />
        {renderPage()}
      </main>
    </div>
  );
}
