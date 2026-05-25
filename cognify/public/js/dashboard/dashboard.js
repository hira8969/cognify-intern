import { authApi } from '../api/authApi.js';
import { createToastService } from '../components/toast.js';
import { initAnimations } from '../animations.js';
import { createStudentManager } from './students.js';

const notifier = createToastService(document.getElementById('toastRegion'));
const studentManager = createStudentManager({ notifier });

document.getElementById('logoutButton').addEventListener('click', async () => {
  await authApi.logout();
  window.location.href = '/login';
});

document.getElementById('sidebarToggle').addEventListener('click', () => {
  document.getElementById('dashboardSidebar').classList.toggle('is-open');
});

initAnimations();
studentManager.loadStudents();
