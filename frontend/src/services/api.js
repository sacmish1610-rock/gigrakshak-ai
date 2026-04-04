import axios from 'axios';

// 🌐 API Base URL Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============================================
// 📝 Create Axios Instance
// ============================================
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// 🔐 Request Interceptor (Add Token)
// ============================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// 📨 Response Interceptor (Handle Errors)
// ============================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 (token expired or invalid)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch event so React Router can redirect (avoids full page reload)
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// ============================================
// 🔐 AUTHENTICATION SERVICES
// ============================================
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh-token');
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },
};

// ============================================
// 📊 RISK SERVICES
// ============================================
export const riskService = {
  calculateRisk: async (riskData) => {
    const response = await api.post('/risk/calculate', riskData);
    return response.data;
  },

  getRiskScore: async (userId) => {
    const response = await api.get(`/risk/${userId}`);
    return response.data;
  },
};

// ============================================
// 💰 PRICING SERVICES
// ============================================
export const pricingService = {
  getPlans: async () => {
    const response = await api.get('/pricing/plans');
    return response.data;
  },

  calculatePrice: async (riskScore) => {
    const response = await api.post('/pricing/calculate', { riskScore });
    return response.data;
  },
};

// ============================================
// 📋 POLICY SERVICES
// ============================================
export const policyService = {
  createPolicy: async (policyData) => {
    const response = await api.post('/policy/purchase', policyData);
    return response.data;
  },

  getPolicies: async (userId) => {
    const response = await api.get(`/policy/user/${userId}`);
    return response.data;
  },

  getPolicy: async (policyId) => {
    const response = await api.get(`/policy/${policyId}`);
    return response.data;
  },
};

// ============================================
// 📈 ANALYTICS SERVICES
// ============================================
export const analyticsService = {
  getStats: async () => {
    const response = await api.get('/analytics/stats');
    return response.data;
  },

  // Simulation mode for testing
  simulateTrigger: async (data) => {
    const response = await api.post('/analytics/simulate', data);
    return response.data;
  },
};

// ============================================
// 🔍 UTILITY FUNCTIONS
// ============================================
export const getAuthToken = () => localStorage.getItem('token');
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
export const isAuthenticated = () => !!getAuthToken();

// ============================================
// 🚨 ERROR HANDLER UTILITY
// ============================================
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data?.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'No response from server. Check your connection.';
  } else {
    // Error in request setup
    return error.message || 'An error occurred';
  }
};

export default api;
