const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'client/src/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// The Fixed Light Mode Variables
const newVariables = `
:root, [data-theme="light"] {
  /* Premium Light Mode Palette - Off-white bg, Pure white cards */
  --color-bg-primary: #F9FAFB;
  --color-bg-secondary: #F3F4F6;
  --color-bg-tertiary: #E5E7EB;
  --color-bg-card: #FFFFFF;
  --color-bg-card-hover: #F9FAFB;
  --color-bg-card-solid: #FFFFFF;
  --color-bg-glass: rgba(255, 255, 255, 0.95);
  --color-bg-glass-strong: #F3F4F6;
  --color-bg-input: #FFFFFF;
  --color-bg-input-focus: #FFFFFF;

  /* Accent Colors */
  --color-primary: #111827;
  --color-primary-light: #374151;
  --color-primary-dark: #000000;
  --color-primary-glow: transparent;
  --color-primary-subtle: #F3F4F6;
  --color-secondary: #6B7280;
  --color-accent: #2563eb;
  --color-accent-light: #3b82f6;
  --color-accent-glow: transparent;

  /* Status Colors */
  --color-success: #059669;
  --color-success-bg: #ecfdf5;
  --color-success-border: #a7f3d0;
  --color-warning: #d97706;
  --color-warning-bg: #fffbeb;
  --color-warning-border: #fde68a;
  --color-error: #dc2626;
  --color-error-bg: #fef2f2;
  --color-error-border: #fecaca;
  --color-info: #2563eb;
  --color-info-bg: #eff6ff;
  --color-info-border: #bfdbfe;

  /* Text Colors */
  --color-text-primary: #111827;
  --color-text-secondary: #4B5563;
  --color-text-muted: #9CA3AF;
  --color-text-accent: #111827;

  /* Border Colors */
  --color-border: #E5E7EB;
  --color-border-light: #F3F4F6;
  --color-border-active: #D1D5DB;

  /* Gradients */
  --gradient-primary: var(--color-primary);
  --gradient-accent: var(--color-accent);
  --gradient-success: var(--color-success);
  --gradient-warm: var(--color-warning);
  --gradient-card: var(--color-bg-card);
  --gradient-sidebar: #FFFFFF;
  --gradient-mesh: none;

  /* Shadows - Light mode needs shadows to show depth */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-glow: none;
  --shadow-glow-strong: none;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);

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
  --radius-lg: 8px;
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

// Replace the light mode block
const resetMarker = "[data-theme=\"dark\"] {";
if (css.includes(resetMarker)) {
  const parts = css.split(resetMarker);
  // We need to just replace the top block.
  // The original regex approach in safe_update_css was splitting by RESET & BASE.
  // Wait, let's just replace the whole :root, [data-theme="light"] block up to [data-theme="dark"]
}

// Safer approach: 
const fullReplacement = css.replace(/:root, \[data-theme="light"\] \{[\s\S]*?\}\s*\[data-theme="dark"\]/m, newVariables + '\n[data-theme="dark"]');
if (fullReplacement !== css) {
    fs.writeFileSync(cssPath, fullReplacement);
    console.log('Light mode fixed.');
} else {
    console.log('Failed to match light mode block');
}
