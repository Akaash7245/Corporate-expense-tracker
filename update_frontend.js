const fs = require('fs');
const path = require('path');

const jsxPath = path.join(__dirname, 'client/src/pages/NewExpensePage.jsx');
let jsx = fs.readFileSync(jsxPath, 'utf8');

// 1. Update handleSubmit to accept isReport flag
jsx = jsx.replace(/const handleSubmit = async \(e\) => \{[\s\S]*?finally \{ setLoading\(false\); \}\n  \};/, 
`const handleSubmit = async (e, isReport = false) => {
    if (e) e.preventDefault();
    if (!receiptFile) {
      toast.error('Receipt Required', 'Uploading a receipt is mandatory.');
      return;
    }
    if (!isReport && (!form.title || !form.amount || !form.category)) {
      toast.error('Validation Error', 'Missing details. If OCR failed, use the Report button.');
      return;
    }
    setLoading(true);
    try {
      let receiptUrl = null;
      if (receiptFile) {
        const uploadData = await uploadService.uploadReceipt(receiptFile);
        receiptUrl = uploadData.url;
      }
      await expenseService.create({ 
        ...form, 
        amount: form.amount ? parseFloat(form.amount) : 0, 
        receiptUrl,
        isOcrReport: isReport
      });
      if (isReport) {
        toast.success('Report Submitted', 'The expense has been forwarded to the admin for manual review.');
      } else {
        toast.success('Expense Submitted!', 'Your expense has been submitted for approval.');
      }
      onNavigate('expenses');
    } catch (err) {
      toast.error('Submission Failed', err.message);
    } finally { setLoading(false); }
  };`);

// 2. Disable all inputs globally to prevent manual edits
jsx = jsx.replace(/<input name="title"([^>]*)>/g, '<input name="title"$1 disabled={true} />');
jsx = jsx.replace(/<input name="amount"([^>]*)>/g, '<input name="amount"$1 disabled={true} />');
jsx = jsx.replace(/<select name="currency"([^>]*)>/g, '<select name="currency"$1 disabled={true}>');
jsx = jsx.replace(/<select name="category"([^>]*)>/g, '<select name="category"$1 disabled={true}>');
jsx = jsx.replace(/<input name="date"([^>]*)>/g, '<input name="date"$1 disabled={true} />');
jsx = jsx.replace(/<input name="merchant"([^>]*)>/g, '<input name="merchant"$1 disabled={true} />');
jsx = jsx.replace(/<textarea name="description"([^>]*)>/g, '<textarea name="description"$1 disabled={true} />');

// 3. Add overlay/notice if no receipt is uploaded, and the Report button
jsx = jsx.replace(/<div className="glass-card-static" style={{ padding: 'var\(--space-xl\)' }}>/, 
`<div className="glass-card-static" style={{ padding: 'var(--space-xl)', position: 'relative' }}>
            {!receiptFile && (
              <div style={{
                position: 'absolute', inset: 0, background: 'var(--color-bg-glass)', backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{ textAlign: 'center', background: 'var(--color-bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}>
                  <Upload size={32} style={{ color: 'var(--color-primary)', margin: '0 auto 12px' }} />
                  <h4 style={{ fontWeight: 600, marginBottom: 4 }}>Receipt Required</h4>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>You must upload a receipt first.<br/>Fields will be auto-filled and locked.</p>
                </div>
              </div>
            )}`);

// 4. Update the submit buttons section to include the "Report" button
jsx = jsx.replace(/<div style={{ display: 'flex', flexDirection: 'column', gap: 'var\(--space-sm\)' }}>\s*<button type="submit" className="btn btn-primary btn-lg" disabled=\{loading\} style=\{\{ width: '100%' \}\}>\s*\{loading \? \(\s*<><span className="spinner"([^>]*) \/> Submitting...<\/>\s*\) : \(\s*<><Send size=\{16\} \/> Submit Expense<\/>\s*\)\}\s*<\/button>\s*<button type="button" className="btn btn-secondary" style=\{\{ width: '100%' \}\} onClick=\{[^}]*\}\>\s*Cancel\s*<\/button>\s*<\/div>/,
`<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading || !receiptFile} style={{ width: '100%' }}>
                {loading ? (
                  <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Processing...</>
                ) : (
                  <><Send size={16} /> Submit Expense</>
                )}
              </button>
              
              {receiptFile && (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  disabled={loading} 
                  style={{ width: '100%', borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }} 
                  onClick={(e) => handleSubmit(e, true)}
                >
                  Report Inaccurate OCR
                </button>
              )}

              <button type="button" className="btn btn-ghost" style={{ width: '100%' }} onClick={() => onNavigate('expenses')}>
                Cancel
              </button>
            </div>`);

fs.writeFileSync(jsxPath, jsx);
console.log('Frontend script updated successfully.');
