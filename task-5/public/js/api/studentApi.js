import { apiService } from '../services/apiService.js';

const STUDENTS_ENDPOINT = '/api/students';

export const studentApi = {
  getAllStudents() {
    return apiService.get(STUDENTS_ENDPOINT);
  },

  getStudent(studentId) {
    return apiService.get(`${STUDENTS_ENDPOINT}/${studentId}`);
  },

  createStudent(studentPayload) {
    return apiService.post(STUDENTS_ENDPOINT, studentPayload);
  },

  updateStudent(studentId, studentPayload) {
    return apiService.put(`${STUDENTS_ENDPOINT}/${studentId}`, studentPayload);
  },

  deleteStudent(studentId) {
    return apiService.delete(`${STUDENTS_ENDPOINT}/${studentId}`);
  }
};
