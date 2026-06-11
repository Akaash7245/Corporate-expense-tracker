const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'client/src/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// The new Ultra-Premium Variables
const newVariables = `
:root, [data-theme="light"] {
  /* Color Palette - Premium Light */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #fbfbfb;
  --color-bg-tertiary: #f5f5f5;
  --color-bg-card: #ffffff;
  --color-bg-card-hover: #fbfbfb;
  --color-bg-card-solid: #ffffff;
  --color-bg-glass: rgba(255, 255, 255, 0.95);
  --color-bg-glass-strong: #f5f5f5;
  --color-bg-input: #ffffff;
  --color-bg-input-focus: #ffffff;

  /* Accent Colors */
  --color-primary: #000000;
  --color-primary-light: #222222;
  --color-primary-dark: #000000;
  --color-primary-glow: transparent;
  --color-primary-subtle: #f5f5f5;
  --color-secondary: #737373;
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
  --color-text-primary: #171717;
  --color-text-secondary: #525252;
  --color-text-muted: #a3a3a3;
  --color-text-accent: #171717;

  /* Border Colors */
  --color-border: #e5e5e5;
  --color-border-light: #f5f5f5;
  --color-border-active: #d4d4d4;

  /* Gradients */
  --gradient-primary: var(--color-primary);
  --gradient-accent: var(--color-accent);
  --gradient-success: var(--color-success);
  --gradient-warm: var(--color-warning);
  --gradient-card: var(--color-bg-card);
  --gradient-sidebar: #fbfbfb;
  --gradient-mesh: none;

  /* Shadows - Minimalist */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
  --shadow-glow: none;
  --shadow-glow-strong: none;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.03);

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

[data-theme="dark"] {
  /* Ultra Premium OLED/Slate Palette */
  --color-bg-primary: #000000;
  --color-bg-secondary: #0a0a0a;
  --color-bg-tertiary: #111111;
  --color-bg-card: #0a0a0a;
  --color-bg-card-hover: #111111;
  --color-bg-card-solid: #0a0a0a;
  --color-bg-glass: rgba(10, 10, 10, 0.95);
  --color-bg-glass-strong: #111111;
  --color-bg-input: #000000;
  --color-bg-input-focus: #0a0a0a;

  --color-primary: #ffffff;
  --color-primary-light: #f5f5f5;
  --color-primary-dark: #d4d4d4;
  --color-primary-subtle: #171717;
  --color-secondary: #a3a3a3;
  
  --color-success-bg: rgba(5, 150, 105, 0.15);
  --color-success-border: rgba(5, 150, 105, 0.3);
  --color-warning-bg: rgba(217, 119, 6, 0.15);
  --color-warning-border: rgba(217, 119, 6, 0.3);
  --color-error-bg: rgba(220, 38, 38, 0.15);
  --color-error-border: rgba(220, 38, 38, 0.3);
  --color-info-bg: rgba(37, 99, 235, 0.15);
  --color-info-border: rgba(37, 99, 235, 0.3);

  --color-text-primary: #ffffff;
  --color-text-secondary: #a3a3a3;
  --color-text-muted: #737373;
  --color-text-accent: #ffffff;

  /* Translucent precise borders */
  --color-border: rgba(255, 255, 255, 0.1);
  --color-border-light: rgba(255, 255, 255, 0.15);
  --color-border-active: rgba(255, 255, 255, 0.25);

  --gradient-card: var(--color-bg-card);
  --gradient-sidebar: #0a0a0a;

  --shadow-card: none;
}
`;

// Safely replace the :root block
const resetMarker = "/* ========== RESET & BASE ========== */";
if (css.includes(resetMarker)) {
  const parts = css.split(resetMarker);
  css = newVariables + '\n' + resetMarker + parts[1];
}

// FIX THE BUTTON
css = css.replace(/\.btn-primary\s*\{([^}]*)\}/g, (match, inner) => {
  return `.btn-primary {
  background: var(--color-primary);
  color: var(--color-bg-primary) !important; /* Force text to invert properly */
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), var(--shadow-sm);
  border: 1px solid var(--color-primary);
}`;
});

// Fix sidebar active state line (it was left: -14px, move to left: 0)
css = css.replace(/\.nav-item\.active::before\s*\{([^}]*)\}/g, `.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0px;
  top: 0;
  bottom: 0;
  width: 3px;
  height: 100%;
  background: var(--color-primary);
  border-radius: 0 4px 4px 0;
  transform: none;
}`);

// Fix sidebar active state background
css = css.replace(/\.nav-item\.active\s*\{([^}]*)\}/g, `.nav-item.active {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}`);

// Enhance input field focus
css = css.replace(/\.input-field:focus\s*\{([^}]*)\}/g, `.input-field:focus {
  border-color: var(--color-border-active);
  box-shadow: 0 0 0 1px var(--color-border-active);
}`);

fs.writeFileSync(cssPath, css);
console.log('Heavy refinement applied.');
