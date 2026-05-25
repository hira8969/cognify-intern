import { authApi } from '../api/authApi.js';
import { createToastService } from '../components/toast.js';
import { initAnimations } from '../animations.js';

const form = document.getElementById('loginForm');
const notifier = createToastService(document.getElementById('toastRegion'));

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = form.querySelector('.auth-submit');
  const payload = Object.fromEntries(new FormData(form).entries());

  submitButton.disabled = true;

  try {
    await authApi.login(payload);
    notifier.notify({ type: 'success', title: 'Login successful', message: 'Opening secure dashboard...' });
    window.setTimeout(() => {
      window.location.href = '/dashboard';
    }, 450);
  } catch (error) {
    notifier.notify({ type: 'error', title: 'Login failed', message: error.message });
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelectorAll('.toggle-password').forEach((button) => {
  button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.target);
    input.type = input.type === 'password' ? 'text' : 'password';
  });
});

initAnimations();
