const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'client/src/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace sidebar-brand-icon block
css = css.replace(/\.sidebar-brand-icon\s*\{[^}]*\}/, `.sidebar-brand-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
  position: relative;
}`);

// Replace SVG color
css = css.replace(/\.sidebar-brand-icon svg\s*\{[^}]*\}/, `.sidebar-brand-icon svg { width: 18px; height: 18px; color: var(--color-bg-primary); }`);

// Replace text styling
css = css.replace(/\.sidebar-brand-text\s*\{[^}]*\}/, `.sidebar-brand-text {
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}`);

// Remove webkit text fill
css = css.replace(/\s*-webkit-background-clip: text;/g, '');
css = css.replace(/\s*-webkit-text-fill-color: transparent;/g, '');
css = css.replace(/\s*background-clip: text;/g, '');

fs.writeFileSync(cssPath, css);
console.log('Logo CSS fixed.');
