import axios from 'axios';
import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Todo APIs
export const todoApi = {
  getAll: () => api.get('/todos'),
  create: (text: string) => api.post('/todos', { text }),
  update: (id: string, data: { text?: string; completed?: boolean }) => 
    api.put(`/todos/${id}`, data),
  delete: (id: string) => api.delete(`/todos/${id}`),
};

// Budget APIs
export const budgetApi = {
  getExpenses: () => api.get('/budget/expenses'),
  addExpense: (data: { category: string; amount: number }) => 
    api.post('/budget/expenses', data),
  deleteExpense: (id: string) => api.delete(`/budget/expenses/${id}`),
};

// Planner APIs
export const plannerApi = {
  getEvents: () => api.get('/planner/events'),
  addEvent: (data: { title: string; date: Date; description?: string }) => 
    api.post('/planner/events', data),
  updateEvent: (id: string, data: { title?: string; date?: Date; description?: string }) => 
    api.put(`/planner/events/${id}`, data),
  deleteEvent: (id: string) => api.delete(`/planner/events/${id}`),
};

export default api; 