const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'client/src/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// The new "Stripe/Modern SaaS" Light Mode Palette
const lightModeVariables = `
:root, [data-theme="light"] {
  /* Stripe-inspired Light Mode Palette */
  --color-bg-primary: #F7F9FC;
  --color-bg-secondary: #F1F5F9;
  --color-bg-tertiary: #E2E8F0;
  --color-bg-card: #FFFFFF;
  --color-bg-card-hover: #F8FAFC;
  --color-bg-card-solid: #FFFFFF;
  --color-bg-glass: rgba(255, 255, 255, 0.95);
  --color-bg-glass-strong: #F8FAFC;
  --color-bg-input: #FFFFFF;
  --color-bg-input-focus: #FFFFFF;

  /* Accent Colors */
  --color-primary: #0F172A; /* Slate 900 for Primary Buttons */
  --color-primary-light: #1E293B;
  --color-primary-dark: #000000;
  --color-primary-glow: transparent;
  --color-primary-subtle: #F1F5F9;
  --color-secondary: #64748B;
  --color-accent: #2563eb;
  --color-accent-light: #3b82f6;
  --color-accent-glow: transparent;

  /* Status Colors */
  --color-success: #10B981;
  --color-success-bg: #ECFDF5;
  --color-success-border: #A7F3D0;
  --color-warning: #F59E0B;
  --color-warning-bg: #FFFBEB;
  --color-warning-border: #FDE68A;
  --color-error: #EF4444;
  --color-error-bg: #FEF2F2;
  --color-error-border: #FECACA;
  --color-info: #3B82F6;
  --color-info-bg: #EFF6FF;
  --color-info-border: #BFDBFE;

  /* Text Colors */
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-muted: #94A3B8;
  --color-text-accent: #0F172A;

  /* Border Colors */
  --color-border: #E2E8F0;
  --color-border-light: #F1F5F9;
  --color-border-active: #CBD5E1;

  /* Gradients */
  --gradient-primary: var(--color-primary);
  --gradient-accent: var(--color-accent);
  --gradient-success: var(--color-success);
  --gradient-warm: var(--color-warning);
  --gradient-card: var(--color-bg-card);
  --gradient-sidebar: #FFFFFF;
  --gradient-mesh: none;

  /* Shadows - Beautiful soft drop shadows for cards on light background */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03);
  --shadow-glow: none;
  --shadow-glow-strong: none;
  --shadow-card: 0 2px 4px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04);

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

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Layout */
  --sidebar-width: 250px;
  --sidebar-collapsed-width: 68px;
  --header-height: 60px;

  /* Transitions */
  --transition-fast: 100ms ease;
  --transition-base: 150ms ease;
  --transition-slow: 250ms ease;
  --transition-spring: 250ms ease;
}
`;

// 1. Replace Light mode palette
const regex = /:root, \[data-theme="light"\] \{[\s\S]*?\}\s*\[data-theme="dark"\]/m;
css = css.replace(regex, lightModeVariables + '\n[data-theme="dark"]');

// 2. Fix .kpi-value solid background gradient block bug
css = css.replace(/\.kpi-value\s*\{([^}]*)\}/g, `.kpi-value {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 4px;
  line-height: 1.1;
  color: var(--color-text-primary);
}`);

fs.writeFileSync(cssPath, css);
console.log('Fixed KPI background strips and refined light mode.');
