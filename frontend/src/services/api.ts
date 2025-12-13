// Import CommonJS build to avoid Jest ESM parsing issues in test environment
import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { SweetFormData } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response: AxiosResponse | any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Sweet API
export const sweetAPI = {
  getAll: () => api.get('/sweets'),
  search: (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => api.get('/sweets/search', { params }),
  getById: (id: number) => api.get(`/sweets/${id}`),
  create: (data: SweetFormData) => api.post('/sweets', data),
  update: (id: number, data: Partial<SweetFormData>) => api.put(`/sweets/${id}`, data),
  delete: (id: number) => api.delete(`/sweets/${id}`),
  purchase: (id: number, quantity: number = 1) =>
    api.post(`/sweets/${id}/purchase`, { quantity }),
  restock: (id: number, quantity: number = 10) =>
    api.post(`/sweets/${id}/restock`, { quantity }),
};

export default api;