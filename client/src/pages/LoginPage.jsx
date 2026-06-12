import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Wallet, Lock, Mail, ArrowRight, BarChart3, Shield, Zap, Clock, User,
} from 'lucide-react';

const demoAccounts = [
  { label: 'Rajesh Sharma', email: 'admin@company.com', password: 'Admin123!', role: 'admin', initials: 'RS', color: '#f87171' },
  { label: 'Priya Iyer', email: 'finance@company.com', password: 'Finance123!', role: 'finance', initials: 'PI', color: '#34d399' },
  { label: 'Vikram Patel', email: 'manager@company.com', password: 'Manager123!', role: 'manager', initials: 'VP', color: '#7c5cfc' },
  { label: 'Arjun Reddy', email: 'john@company.com', password: 'Employee123!', role: 'employee', initials: 'AR', color: '#38bdf8' },
];

const features = [
  { icon: BarChart3, text: 'Real-time analytics & dashboards', color: 'rgba(124,92,252,0.15)' },
  { icon: Shield, text: 'Role-based access & approval workflows', color: 'rgba(52,211,153,0.15)' },
  { icon: Zap, text: 'AI-powered fraud detection & OCR', color: 'rgba(251,191,36,0.15)' },
  { icon: Clock, text: 'Instant expense submission & tracking', color: 'rgba(56,189,248,0.15)' },
];

export default function LoginPage() {
  const { login, loading } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!', 'Logged in successfully.');
    } catch (err) {
      toast.error('Login Failed', err.message);
    }
  };

  const handleDemoLogin = async (account) => {
    setEmail(account.email);
    setPassword(account.password);
    try {
      await login(account.email, account.password);
      toast.success('Welcome!', `Signed in as ${account.label}.`);
    } catch (err) {
      toast.error('Login Failed', err.message);
    }
  };

  return (
    <div className="login-page">
      {/* Left Panel — Login Form */}
      <div className="login-left">
        <div className="login-container">
          <div className="login-brand">
            <div className="login-brand-icon">
              <Wallet size={26} />
            </div>
            <h1>Spendora</h1>
            <p>Enterprise expense management platform</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="login-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  id="login-email"
                  type="email"
                  className="input-field"
                  style={{ paddingLeft: 42 }}
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  id="login-password"
                  type="password"
                  className="input-field"
                  style={{ paddingLeft: 42 }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? (
                <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>


        </div>
      </div>

      {/* Right Panel — Feature Showcase Removed per request */}
    </div>
  );
}
