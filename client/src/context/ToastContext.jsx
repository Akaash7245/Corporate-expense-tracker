import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);
let toastId = 0;

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const ICON_COLORS = {
  success: 'var(--color-success)',
  error: 'var(--color-error)',
  warning: 'var(--color-warning)',
  info: 'var(--color-info)',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, ...toast }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), toast.duration || 5000);
    return id;
  }, []);

  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  const success = useCallback((title, message) => addToast({ type: 'success', title, message }), [addToast]);
  const error = useCallback((title, message) => addToast({ type: 'error', title, message }), [addToast]);
  const warning = useCallback((title, message) => addToast({ type: 'warning', title, message }), [addToast]);
  const info = useCallback((title, message) => addToast({ type: 'info', title, message }), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => {
          const Icon = ICONS[toast.type] || Info;
          return (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <span className="toast-icon" style={{ color: ICON_COLORS[toast.type] }}>
                <Icon size={18} />
              </span>
              <div className="toast-content">
                <div className="toast-title">{toast.title}</div>
                {toast.message && <div className="toast-message">{toast.message}</div>}
              </div>
              <button className="toast-close" onClick={() => removeToast(toast.id)}>
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
