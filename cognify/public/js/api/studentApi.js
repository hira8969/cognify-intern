import { apiService } from '../services/apiService.js';

const BASE_URL = '/api/students';

export const studentApi = {
  async getStudents(search = '') {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await apiService.get(`${BASE_URL}${query}`);
    return response.data || [];
  },

  async getStudent(id) {
    const response = await apiService.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  async createStudent(studentData) {
    const response = await apiService.post(BASE_URL, studentData);
    return response.data;
  },

  async updateStudent(id, studentData) {
    const response = await apiService.put(`${BASE_URL}/${id}`, studentData);
    return response.data;
  },

  async deleteStudent(id) {
    const response = await apiService.delete(`${BASE_URL}/${id}`);
    return response.data;
  }
};
