import { apiService } from '../services/apiService.js';

export const authApi = {
  async register(payload) {
    const response = await apiService.post('/api/auth/register', payload);
    return response.data;
  },

  async login(payload) {
    const response = await apiService.post('/api/auth/login', payload);
    return response.data;
  },

  async logout() {
    const response = await apiService.post('/api/auth/logout');
    return response.data;
  },

  async me() {
    const response = await apiService.get('/api/auth/me');
    return response.data;
  }
};
