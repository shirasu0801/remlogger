import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Sleep Records API
export const sleepAPI = {
  getAll: () => api.get('/sleep'),
  create: (data) => api.post('/sleep', data),
  update: (id, data) => api.put(`/sleep/${id}`, data),
  delete: (id) => api.delete(`/sleep/${id}`),
};

// Goals API
export const goalAPI = {
  get: () => api.get('/goal'),
  create: (data) => api.post('/goal', data),
};

// Stats API
export const statsAPI = {
  getDaily: (days = 30) => api.get(`/stats/daily?days=${days}`),
  getWeekly: (weeks = 12) => api.get(`/stats/weekly?weeks=${weeks}`),
  getMonthly: (months = 12) => api.get(`/stats/monthly?months=${months}`),
};

export default api;
