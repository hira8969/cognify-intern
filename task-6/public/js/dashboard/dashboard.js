import { apiService } from '../services/apiService.js';
import { showApiError, showToast } from '../components/toast.js';
import { fetchStudents, openCreateStudentModal } from './students.js';

const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const profileTrigger = document.getElementById('profileTrigger');
const profileDropdown = document.getElementById('profileDropdown');
const logoutButton = document.getElementById('logoutButton');
const addStudentButton = document.getElementById('addStudentButton');
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('studentos-theme');

if (savedTheme) {
  document.documentElement.dataset.theme = savedTheme;
}

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

profileTrigger.addEventListener('click', () => {
  profileDropdown.classList.toggle('show');
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.profile-menu')) {
    profileDropdown.classList.remove('show');
  }
});

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem('studentos-theme', nextTheme);
});

logoutButton.addEventListener('click', async () => {
  try {
    await apiService.post('/api/auth/logout', {});
    showToast('Logged out successfully.', 'success');
    window.setTimeout(() => {
      window.location.href = '/login';
    }, 400);
  } catch (error) {
    showApiError(error);
  }
});

addStudentButton.addEventListener('click', openCreateStudentModal);

fetchStudents();
