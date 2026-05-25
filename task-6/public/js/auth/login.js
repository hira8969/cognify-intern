import { apiService } from '../services/apiService.js';
import { setButtonLoading } from '../components/loader.js';
import { showApiError, showToast } from '../components/toast.js';
import { enablePasswordToggles, formToObject } from '../utils/helpers.js';

const loginForm = document.getElementById('loginForm');
const submitButton = document.getElementById('loginSubmit');

enablePasswordToggles();

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setButtonLoading(submitButton, true, 'Logging in');

  try {
    await apiService.post('/api/auth/login', formToObject(loginForm));
    showToast('Login successful. Redirecting...', 'success');
    window.setTimeout(() => {
      window.location.href = '/dashboard';
    }, 450);
  } catch (error) {
    showApiError(error);
  } finally {
    setButtonLoading(submitButton, false);
  }
});
