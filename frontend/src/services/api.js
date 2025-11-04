import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Items API
export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  getMyItems: () => api.get('/items/user/my-items'),
  create: (formData) => api.post('/items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/items/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/items/${id}`),
};

// Admin API
export const adminAPI = {
  getAllItems: () => api.get('/admin/items'),
  updateItemStatus: (id, status) => api.patch(`/admin/items/${id}/status`, { status }),
  deleteItem: (id) => api.delete(`/admin/items/${id}`),
  createMatch: (data) => api.post('/admin/matches', data),
  getAllMatches: () => api.get('/admin/matches'),
  markAsReturned: (id) => api.patch(`/admin/matches/${id}/returned`),
  getStats: () => api.get('/admin/stats'),
  getLogs: () => api.get('/admin/logs'),
};

export default api;