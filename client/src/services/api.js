const API_BASE = 'http://localhost:5000/api';

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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
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

export default api;
