const fs = require('fs');
const path = require('path');

const jsxPath = path.join(__dirname, 'client/src/pages/NewExpensePage.jsx');
let jsx = fs.readFileSync(jsxPath, 'utf8');

// Fix the syntax error from the previous bad regex
jsx = jsx.replace(/\/ disabled=\{true\} \/>/g, 'disabled={true} />');
// Fix any other stray ones
jsx = jsx.replace(/required \/ disabled=\{true\} \/>/g, 'required disabled={true} />');

// Let's explicitly check and fix specific tags if they are still broken
jsx = jsx.replace(/required disabled=\{true\} \/>/g, 'required disabled={true} />'); // clean up

// Fix Description - it shouldn't be locked because OCR doesn't read it
jsx = jsx.replace(/<textarea name="description" className="input-field" placeholder="Add any additional details or notes\.\.\." value=\{form\.description\} onChange=\{handleChange\} rows=\{3\} disabled=\{true\} \/>/, '<textarea name="description" className="input-field" placeholder="Add any additional details or notes..." value={form.description} onChange={handleChange} rows={3} />');

fs.writeFileSync(jsxPath, jsx);
console.log('Fixed JSX syntax errors.');
