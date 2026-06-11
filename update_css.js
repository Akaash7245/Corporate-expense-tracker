const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'client/src/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// The new Notion/Linear Variables
const newVariables = `
:root, [data-theme="light"] {
  /* Color Palette - Notion/Linear Light */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-bg-tertiary: #f3f4f6;
  --color-bg-card: #ffffff;
  --color-bg-card-hover: #f9fafb;
  --color-bg-card-solid: #ffffff;
  --color-bg-glass: rgba(255, 255, 255, 0.95);
  --color-bg-glass-strong: #f3f4f6;
  --color-bg-input: #ffffff;
  --color-bg-input-focus: #ffffff;

  /* Accent Colors  Monochromatic & Primary Blue */
  --color-primary: #111827;
  --color-primary-light: #374151;
  --color-primary-dark: #000000;
  --color-primary-glow: transparent;
  --color-primary-subtle: #f3f4f6;
  --color-secondary: #6b7280;
  --color-accent: #2563eb;
  --color-accent-light: #3b82f6;
  --color-accent-glow: transparent;

  /* Status Colors - High Contrast */
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

  /* Text Colors - High Legibility */
  --color-text-primary: #111827;
  --color-text-secondary: #4b5563;
  --color-text-muted: #9ca3af;
  --color-text-accent: #111827;

  /* Border Colors - Crisp 1px */
  --color-border: #e5e7eb;
  --color-border-light: #f3f4f6;
  --color-border-active: #d1d5db;

  /* Gradients - Flattened */
  --gradient-primary: var(--color-primary);
  --gradient-accent: var(--color-accent);
  --gradient-success: var(--color-success);
  --gradient-warm: var(--color-warning);
  --gradient-card: var(--color-bg-card);
  --gradient-sidebar: #f9fafb;
  --gradient-mesh: none;

  /* Shadows - Minimalist/None */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
  --shadow-glow: none;
  --shadow-glow-strong: none;
  --shadow-card: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  /* Typography - Increased Base Size for Readability */
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

  /* Border Radius - Sharper Linear Aesthetic */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 10px;
  --radius-2xl: 12px;
  --radius-full: 9999px;

  /* Layout */
  --sidebar-width: 250px;
  --sidebar-collapsed-width: 68px;
  --header-height: 56px;

  /* Transitions */
  --transition-fast: 100ms ease;
  --transition-base: 150ms ease;
  --transition-slow: 250ms ease;
  --transition-spring: 250ms ease;
}

[data-theme="dark"] {
  --color-bg-primary: #191919;
  --color-bg-secondary: #222222;
  --color-bg-tertiary: #2e2e2e;
  --color-bg-card: #222222;
  --color-bg-card-hover: #2e2e2e;
  --color-bg-card-solid: #222222;
  --color-bg-glass: rgba(34, 34, 34, 0.95);
  --color-bg-glass-strong: #2e2e2e;
  --color-bg-input: #191919;
  --color-bg-input-focus: #191919;

  --color-primary: #ffffff;
  --color-primary-light: #f3f4f6;
  --color-primary-dark: #e5e7eb;
  --color-primary-subtle: #2e2e2e;
  --color-secondary: #9ca3af;
  
  --color-success-bg: rgba(5, 150, 105, 0.15);
  --color-success-border: rgba(5, 150, 105, 0.3);
  --color-warning-bg: rgba(217, 119, 6, 0.15);
  --color-warning-border: rgba(217, 119, 6, 0.3);
  --color-error-bg: rgba(220, 38, 38, 0.15);
  --color-error-border: rgba(220, 38, 38, 0.3);
  --color-info-bg: rgba(37, 99, 235, 0.15);
  --color-info-border: rgba(37, 99, 235, 0.3);

  --color-text-primary: #ffffff;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #71717a;
  --color-text-accent: #ffffff;

  --color-border: #333333;
  --color-border-light: #444444;
  --color-border-active: #555555;

  --gradient-card: var(--color-bg-card);
  --gradient-sidebar: #222222;

  --shadow-card: none;
}
`;

// Completely replace everything from :root to /* ========== RESET & BASE ========== */
// This removes both :root and [data-theme="dark"] from the previous attempt.
css = css.replace(/:root, \[data-theme="light"\]\s*\{[\s\S]*?\}\s*\[data-theme="dark"\]\s*\{[\s\S]*?\}\s*\/\* ========== RESET & BASE ========== \*\//, newVariables + '\n/* ========== RESET & BASE ========== */');

// Fallback in case the exact string wasn't matched (if previous replace didn't work exactly as expected)
if (!css.includes('Color Palette - Notion/Linear Light')) {
  css = css.replace(/:root\s*\{[\s\S]*?\}\s*\/\* ========== RESET & BASE ========== \*\//, newVariables + '\n/* ========== RESET & BASE ========== */');
}

// Adjust button styles for Notion look (monochromatic)
css = css.replace(/\.btn-primary\s*\{[\s\S]*?\}/, `.btn-primary {
  background: var(--color-primary);
  color: var(--color-bg-primary); /* Invert color */
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-primary);
}`);
css = css.replace(/\.btn-primary:hover\s*\{[\s\S]*?\}/, `.btn-primary:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary-light);
}`);

// Increase base line height and fix typography
css = css.replace(/body\s*\{[\s\S]*?min-height: 100vh;/g, `body {
  font-family: var(--font-family);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  line-height: 1.7; /* Increased for readability */
  min-height: 100vh;`);

// Make inputs highly legible
css = css.replace(/\.input-field\s*\{[\s\S]*?outline: none;/g, `.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-family: var(--font-family);
  font-size: var(--font-size-base); /* Increased for readability */
  transition: all var(--transition-base);
  outline: none;`);

// Make Sidebar highly distinct
css = css.replace(/\.sidebar\s*\{[\s\S]*?overflow: hidden;/g, `.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--gradient-sidebar);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width var(--transition-slow);
  overflow: hidden;`);

fs.writeFileSync(cssPath, css);
console.log('Notion/Linear CSS updated successfully.');
