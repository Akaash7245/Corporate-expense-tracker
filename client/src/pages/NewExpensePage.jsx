import { useState } from 'react';
import { expenseService, uploadService, ocrService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Upload, Camera, Send, DollarSign, Calendar, Tag, Store, FileText } from 'lucide-react';

const categories = [
  'Travel', 'Food & Dining', 'Office Supplies', 'Accommodation',
  'Transportation', 'Communication', 'Entertainment', 'Miscellaneous',
];

export default function NewExpensePage({ onNavigate }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', amount: '', category: 'Travel',
    date: new Date().toISOString().split('T')[0], merchant: '', currency: 'INR',
  });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = async (file) => {
    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setReceiptPreview(e.target.result);
    reader.readAsDataURL(file);

    toast.info('Scanning Receipt', 'Extracting details from receipt image...');
    try {
      const data = await ocrService.extractReceipt(file);
      if (data) {
        // Simple logic to guess category from merchant
        let detectedCategory = 'Travel';
        const merchantLower = (data.merchant || '').toLowerCase();
        if (merchantLower.includes('starbucks') || merchantLower.includes('chipotle')) {
          detectedCategory = 'Food & Dining';
        } else if (merchantLower.includes('uber')) {
          detectedCategory = 'Transportation';
        } else if (merchantLower.includes('marriott') || merchantLower.includes('hilton')) {
          detectedCategory = 'Accommodation';
        } else if (merchantLower.includes('office depot')) {
          detectedCategory = 'Office Supplies';
        } else if (merchantLower.includes('amazon')) {
          detectedCategory = 'Miscellaneous';
        }

        setForm(prev => ({
          ...prev,
          amount: data.amount ? data.amount.toString() : prev.amount,
          merchant: data.merchant || prev.merchant,
          date: data.date || prev.date,
          category: detectedCategory,
          title: data.merchant ? `${detectedCategory}: ${data.merchant}` : prev.title,
        }));
        toast.success('Receipt Scanned', 'Form fields autofilled successfully.');
      }
    } catch (err) {
      console.error('OCR Extraction error:', err);
      toast.warning('OCR Scanning Failed', 'Could not extract details automatically.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.category) {
      toast.error('Validation Error', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      let receiptUrl = null;
      if (receiptFile) {
        const uploadData = await uploadService.uploadReceipt(receiptFile);
        receiptUrl = uploadData.url;
      }
      await expenseService.create({ ...form, amount: parseFloat(form.amount), receiptUrl });
      toast.success('Expense Submitted!', 'Your expense has been submitted for approval.');
      onNavigate('expenses');
    } catch (err) {
      toast.error('Submission Failed', err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <button className="btn btn-ghost" onClick={() => onNavigate('expenses')} style={{ marginBottom: 8 }}>
            <ArrowLeft size={16} /> Back to Expenses
          </button>
          <h1 className="page-title">New Expense</h1>
          <p className="page-subtitle">Submit an expense for approval</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 2.5fr', gap: 'var(--space-xl)' }}>
          {/* Main Form */}
          <div className="glass-card-static" style={{ padding: 'var(--space-xl)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-xl)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={18} style={{ color: 'var(--color-primary-light)' }} /> Expense Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div className="input-group">
                <label>Title *</label>
                <input name="title" className="input-field" placeholder="e.g., Client meeting lunch" value={form.title} onChange={handleChange} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div className="input-group">
                  <label>Amount *</label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input name="amount" type="number" step="0.01" min="0.01" className="input-field" style={{ paddingLeft: 36 }} placeholder="0.00" value={form.amount} onChange={handleChange} required />
                  </div>
                </div>
                <div className="input-group">
                  <label>Currency</label>
                  <select name="currency" className="input-field" value={form.currency} onChange={handleChange}>
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div className="input-group">
                  <label>Category *</label>
                  <select name="category" className="input-field" value={form.category} onChange={handleChange}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Date *</label>
                  <input name="date" type="date" className="input-field" value={form.date} onChange={handleChange} required />
                </div>
              </div>

              <div className="input-group">
                <label>Merchant / Vendor</label>
                <div style={{ position: 'relative' }}>
                  <Store size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input name="merchant" className="input-field" style={{ paddingLeft: 36 }} placeholder="e.g., Uber, Marriott, Starbucks" value={form.merchant} onChange={handleChange} />
                </div>
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea name="description" className="input-field" placeholder="Add any additional details or notes..." value={form.description} onChange={handleChange} rows={3} />
              </div>
            </div>
          </div>

          {/* Receipt Upload & Submit */}
          <div>
            <div className="glass-card-static" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Camera size={16} style={{ color: 'var(--color-accent)' }} /> Receipt
              </h3>

              <label
                htmlFor="receipt-upload"
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  minHeight: 200, border: `2px dashed ${dragOver ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all var(--transition-base)',
                  background: dragOver ? 'var(--color-primary-subtle)' : 'var(--color-bg-glass)', overflow: 'hidden',
                }}
              >
                {receiptPreview ? (
                  <img src={receiptPreview} alt="Receipt preview" style={{ maxWidth: '100%', maxHeight: 280, objectFit: 'contain' }} />
                ) : (
                  <>
                    <Upload size={28} style={{ color: 'var(--color-text-muted)', marginBottom: 8 }} />
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                      {dragOver ? 'Drop file here' : 'Click or drag to upload'}
                    </span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 4 }}>
                      PNG, JPG, PDF up to 10MB
                    </span>
                  </>
                )}
              </label>
              <input id="receipt-upload" type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ display: 'none' }} />

              {receiptFile && (
                <div style={{ marginTop: 'var(--space-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{receiptFile.name}</span>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setReceiptFile(null); setReceiptPreview(null); }}>Remove</button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                {loading ? (
                  <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Submitting...</>
                ) : (
                  <><Send size={16} /> Submit Expense</>
                )}
              </button>
              <button type="button" className="btn btn-secondary" style={{ width: '100%' }} onClick={() => onNavigate('expenses')}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
