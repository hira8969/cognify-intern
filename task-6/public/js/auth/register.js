import { apiService } from '../services/apiService.js';
import { setButtonLoading } from '../components/loader.js';
import { showApiError, showToast } from '../components/toast.js';
import { calculatePasswordScore, enablePasswordToggles, formToObject } from '../utils/helpers.js';

const registerForm = document.getElementById('registerForm');
const passwordInput = document.getElementById('password');
const strengthBar = document.getElementById('passwordStrengthBar');
const submitButton = document.getElementById('registerSubmit');

enablePasswordToggles();

passwordInput.addEventListener('input', () => {
  const score = calculatePasswordScore(passwordInput.value);
  const percentage = (score / 5) * 100;
  strengthBar.style.width = `${percentage}%`;
  strengthBar.style.background = score <= 2 ? 'var(--danger)' : score <= 4 ? 'var(--warning)' : 'var(--success)';
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setButtonLoading(submitButton, true, 'Creating');

  try {
    await apiService.post('/api/auth/register', formToObject(registerForm));
    showToast('Account created. Opening dashboard...', 'success');
    window.setTimeout(() => {
      window.location.href = '/dashboard';
    }, 450);
  } catch (error) {
    showApiError(error);
  } finally {
    setButtonLoading(submitButton, false);
  }
});
