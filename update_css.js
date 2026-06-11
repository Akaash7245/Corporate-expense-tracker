const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'client/src/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Replace Variables
const newVariables = `
:root, [data-theme="light"] {
  /* Color Palette - Enterprise Light */
  --color-bg-primary: #f8fafc;
  --color-bg-secondary: #f1f5f9;
  --color-bg-tertiary: #e2e8f0;
  --color-bg-card: #ffffff;
  --color-bg-card-hover: #f8fafc;
  --color-bg-card-solid: #ffffff;
  --color-bg-glass: rgba(255, 255, 255, 0.9);
  --color-bg-glass-strong: #f1f5f9;
  --color-bg-input: #ffffff;
  --color-bg-input-focus: #ffffff;

  /* Accent Colors — Professional Blue */
  --color-primary: #2563eb;
  --color-primary-light: #3b82f6;
  --color-primary-dark: #1d4ed8;
  --color-primary-glow: rgba(37, 99, 235, 0.1);
  --color-primary-subtle: #eff6ff;
  --color-secondary: #475569;
  --color-accent: #0284c7;
  --color-accent-light: #38bdf8;
  --color-accent-glow: transparent;

  /* Status Colors */
  --color-success: #059669;
  --color-success-bg: #d1fae5;
  --color-success-border: #a7f3d0;
  --color-warning: #d97706;
  --color-warning-bg: #fef3c7;
  --color-warning-border: #fde68a;
  --color-error: #dc2626;
  --color-error-bg: #fee2e2;
  --color-error-border: #fecaca;
  --color-info: #2563eb;
  --color-info-bg: #dbeafe;
  --color-info-border: #bfdbfe;

  /* Text Colors */
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #64748b;
  --color-text-accent: #2563eb;

  /* Border Colors */
  --color-border: #e2e8f0;
  --color-border-light: #f1f5f9;
  --color-border-active: #94a3b8;

  /* Gradients - Flattened for SaaS look */
  --gradient-primary: var(--color-primary);
  --gradient-accent: var(--color-accent);
  --gradient-success: var(--color-success);
  --gradient-warm: var(--color-warning);
  --gradient-card: var(--color-bg-card);
  --gradient-sidebar: #ffffff;
  --gradient-mesh: none;

  /* Shadows - Realistic */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-glow: none;
  --shadow-glow-strong: none;
  --shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;

  /* Border Radius - Minimalist */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Layout */
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 72px;
  --header-height: 64px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  --transition-spring: 300ms ease;
}

[data-theme="dark"] {
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-bg-tertiary: #334155;
  --color-bg-card: #1e293b;
  --color-bg-card-hover: #334155;
  --color-bg-card-solid: #1e293b;
  --color-bg-glass: rgba(30, 41, 59, 0.9);
  --color-bg-glass-strong: #334155;
  --color-bg-input: #0f172a;
  --color-bg-input-focus: #0f172a;

  --color-primary: #3b82f6;
  --color-primary-light: #60a5fa;
  --color-primary-dark: #2563eb;
  --color-primary-subtle: rgba(59, 130, 246, 0.15);
  --color-secondary: #94a3b8;
  
  --color-success-bg: rgba(5, 150, 105, 0.2);
  --color-success-border: rgba(5, 150, 105, 0.3);
  --color-warning-bg: rgba(217, 119, 6, 0.2);
  --color-warning-border: rgba(217, 119, 6, 0.3);
  --color-error-bg: rgba(220, 38, 38, 0.2);
  --color-error-border: rgba(220, 38, 38, 0.3);
  --color-info-bg: rgba(37, 99, 235, 0.2);
  --color-info-border: rgba(37, 99, 235, 0.3);

  --color-text-primary: #f8fafc;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;
  --color-text-accent: #60a5fa;

  --color-border: #334155;
  --color-border-light: #475569;
  --color-border-active: #64748b;

  --gradient-card: var(--color-bg-card);
  --gradient-sidebar: #1e293b;

  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}
`;

// Replace :root block completely
css = css.replace(/:root\s*\{[\s\S]*?\}\s*\/\* ========== RESET & BASE ========== \*\//, newVariables + '\n/* ========== RESET & BASE ========== */');

// Remove body::before (the mesh gradient)
css = css.replace(/body::before\s*\{[\s\S]*?\}\s*/, '');

// Clean glass-card classes to standard cards
css = css.replace(/\.glass-card\s*\{[\s\S]*?\}/, `.glass-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}`);
css = css.replace(/\.glass-card::before\s*\{[\s\S]*?\}/, '');
css = css.replace(/\.glass-card:hover\s*\{[\s\S]*?\}/, `.glass-card:hover {
  border-color: var(--color-border-active);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}`);

css = css.replace(/\.glass-card-static\s*\{[\s\S]*?\}/, `.glass-card-static {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}`);
css = css.replace(/\.glass-card-static::before\s*\{[\s\S]*?\}/, '');

// Buttons
css = css.replace(/\.btn-primary\s*\{[\s\S]*?\}/, `.btn-primary {
  background: var(--color-primary);
  color: #fff;
  box-shadow: var(--shadow-sm);
}`);
css = css.replace(/\.btn-primary:hover\s*\{[\s\S]*?\}/, `.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}`);

// Remove KPI glows
css = css.replace(/\.kpi-card \.kpi-glow\s*\{[\s\S]*?\}/, '');
css = css.replace(/\.kpi-card:hover \.kpi-glow\s*\{[\s\S]*?\}/, '');
css = css.replace(/\.kpi-card\.kpi-primary \.kpi-glow\s*\{[\s\S]*?\}/, '');
css = css.replace(/\.kpi-card\.kpi-success \.kpi-glow\s*\{[\s\S]*?\}/, '');
css = css.replace(/\.kpi-card\.kpi-warning \.kpi-glow\s*\{[\s\S]*?\}/, '');
css = css.replace(/\.kpi-card\.kpi-info \.kpi-glow\s*\{[\s\S]*?\}/, '');

// Sidebar changes
css = css.replace(/\.sidebar::after\s*\{[\s\S]*?\}/, '');
css = css.replace(/\.sidebar-brand-icon::after\s*\{[\s\S]*?\}/, '');

// Clean Active Nav items
css = css.replace(/\.nav-item\.active::before\s*\{[\s\S]*?\}/, `.nav-item.active::before {
  content: '';
  position: absolute;
  left: -14px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: var(--color-primary);
  border-radius: 0 4px 4px 0;
}`);

// Header changes
css = css.replace(/\.header\s*\{[\s\S]*?\}/, `.header {
  position: fixed;
  top: 0;
  right: 0;
  left: var(--sidebar-width);
  height: var(--header-height);
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-2xl);
  z-index: 90;
  transition: left var(--transition-slow);
}`);

// Toggle Theme Button CSS
css += `
.theme-toggle-btn {
  background: transparent;
  color: var(--color-text-secondary);
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}
.theme-toggle-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}
`;

fs.writeFileSync(cssPath, css);
console.log('CSS updated successfully.');
