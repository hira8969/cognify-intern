import { authApi } from '../api/authApi.js';
import { createToastService } from '../components/toast.js';
import { initAnimations } from '../animations.js';

const form = document.getElementById('registerForm');
const notifier = createToastService(document.getElementById('toastRegion'));
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

const checks = [
  (value) => value.length >= 8,
  (value) => /[A-Z]/.test(value),
  (value) => /[a-z]/.test(value),
  (value) => /\d/.test(value),
  (value) => /[^A-Za-z\d]/.test(value)
];

form.password.addEventListener('input', () => {
  const score = checks.filter((check) => check(form.password.value)).length;
  strengthBar.style.width = `${score * 20}%`;
  strengthBar.style.background = score >= 5 ? '#19b985' : score >= 3 ? '#f59e0b' : '#ef4565';
  strengthText.textContent = `Password strength: ${score >= 5 ? 'strong' : score >= 3 ? 'medium' : 'weak'}`;
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = form.querySelector('.auth-submit');
  const payload = Object.fromEntries(new FormData(form).entries());

  submitButton.disabled = true;

  try {
    await authApi.register(payload);
    notifier.notify({ type: 'success', title: 'Account created', message: 'Opening secure dashboard...' });
    window.setTimeout(() => {
      window.location.href = '/dashboard';
    }, 450);
  } catch (error) {
    notifier.notify({ type: 'error', title: 'Registration failed', message: error.message });
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
