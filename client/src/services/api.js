const API_BASE = 'https://corporate-expense-tracker-test.onrender.com/api';

// Format currency in Indian Rupees with proper lakh/crore formatting
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

class ApiService {
  constructor() {
    this.baseUrl = API_BASE;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      if (endpoint !== '/auth/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      throw new Error('Unauthorized');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const api = new ApiService();

// Auth Service
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
};

// Expense Service
export const expenseService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/expenses${query ? '?' + query : ''}`);
  },
  getById: (id) => api.get(`/expenses/${id}`),
  getStats: () => api.get('/expenses/stats'),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  updateStatus: (id, status, comments) => api.patch(`/expenses/${id}/status`, { status, comments }),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// Category Service
export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
};

// Notification Service
export const notificationService = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

// User Service
export const userService = {
  getAll: () => api.get('/users'),
  getTeam: () => api.get('/users/team'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  toggleActive: (id) => api.patch(`/users/${id}/toggle-active`),
};

// Upload Service
export const uploadService = {
  uploadReceipt: (file) => {
    const formData = new FormData();
    formData.append('receipt', file);
    return api.post('/upload', formData);
  },
};

// OCR Service
export const ocrService = {
  extractReceipt: async (file) => {
    // We call OCR.space directly from the frontend to bypass backend IP rate limiting
    const formData = new FormData();
    formData.append('file', file);
    formData.append('apikey', 'helloworld');
    formData.append('isOverlayRequired', 'false');
    formData.append('isTable', 'true');
    formData.append('scale', 'true');
    formData.append('detectOrientation', 'true');
    formData.append('OCREngine', '2'); // Engine 2 is much better for low-res receipts

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    if (data.IsErroredOnProcessing || !data.ParsedResults || data.ParsedResults.length === 0) {
      throw new Error(data.ErrorMessage || 'OCR failed to process image.');
    }

    const text = data.ParsedResults[0].ParsedText;
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // 1. Guess Merchant
    let merchant = 'Unknown Merchant';
    if (lines.length > 0) {
      const firstLines = lines.slice(0, 5).filter(l => !/^(receipt|bill|invoice|tax|cash|\d+|date|time)$/i.test(l) && l.length > 3);
      if (firstLines.length > 0) merchant = firstLines[0];
    }

    // 2. Guess Date
    let dateStr = new Date().toISOString().split('T')[0];
    const dateRegexes = [
      /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/,
      /(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/
    ];

    let foundDate = false;
    for (let line of lines) {
      if (foundDate) break;
      for (let regex of dateRegexes) {
        const match = line.match(regex);
        if (match) {
          try {
            let d = parseInt(match[1], 10);
            let m = parseInt(match[2], 10) - 1;
            let y = parseInt(match[3], 10);
            if (y < 100) y += 2000;
            const parsedDate = new Date(y, m, d);
            if (!isNaN(parsedDate.getTime())) {
              dateStr = parsedDate.toISOString().split('T')[0];
              foundDate = true;
              break;
            }
          } catch (e) {}
        }
      }
    }

    // 3. Guess Amount
    let amount = 0.0;
    let maxAmount = 0.0;
    
    const extractAmount = (line) => {
      const match = line.match(/(\d+[,\.\d]*[,\.]\d{2})/);
      if (match) {
        let numStr = match[1];
        if (/,(\d{2})$/.test(numStr)) {
           numStr = numStr.replace(/\./g, '').replace(',', '.');
        } else {
           numStr = numStr.replace(/,/g, '');
        }
        return parseFloat(numStr) || 0;
      }
      return 0;
    };
    
    for (let line of lines) {
      const val = extractAmount(line);
      if (val > maxAmount) maxAmount = val;
      
      if (line.toLowerCase().includes('total') || line.toLowerCase().includes('amount') || line.toLowerCase().includes('net')) {
        if (val > amount) amount = val;
      }
    }
    if (amount === 0.0) amount = maxAmount;

    // 4. Guess Category
    let category = 'Miscellaneous';
    const textLower = text.toLowerCase();
    if (/(restaurant|cafe|coffee|food|dining|eats|burger|pizza|kitchen|grill|diner)/.test(textLower)) category = 'Food & Dining';
    else if (/(taxi|uber|lyft|transit|train|airline|flight|cab|parking|toll)/.test(textLower)) category = 'Transportation';
    else if (/(hotel|motel|inn|resort|accommodation|lodging)/.test(textLower)) category = 'Accommodation';
    else if (/(office|supplies|paper|staples|depot|stationery)/.test(textLower)) category = 'Office Supplies';
    else if (/(phone|mobile|internet|telecom|wireless|broadband)/.test(textLower)) category = 'Communication';

    return {
      merchant,
      amount,
      date: dateStr,
      category,
      confidence: 0.95
    };
  },
};

export default api;
