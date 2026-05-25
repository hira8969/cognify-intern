import { escapeHtml } from './dom.js';

const toastRoot = document.querySelector('#toastRoot');

const ICONS = {
  success: 'fa-circle-check',
  error: 'fa-circle-xmark',
  warning: 'fa-triangle-exclamation',
  info: 'fa-circle-info'
};

export function showToast({ title, message, type = 'info', timeout = 3600 }) {
  if (!toastRoot) {
    return;
  }

  const toast = document.createElement('article');
  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);

  toast.className = `app-toast ${type}`;
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
  toast.innerHTML = `
    <i class="fa-solid ${ICONS[type] || ICONS.info}" aria-hidden="true"></i>
    <div>
      <h3>${safeTitle}</h3>
      <p>${safeMessage}</p>
    </div>
    <button class="toast-close" type="button" aria-label="Dismiss notification">
      <i class="fa-solid fa-xmark" aria-hidden="true"></i>
    </button>
  `;

  const dismiss = () => {
    toast.classList.add('is-leaving');
    window.setTimeout(() => toast.remove(), 220);
  };

  toast.querySelector('.toast-close').addEventListener('click', dismiss);
  toastRoot.append(toast);
  window.setTimeout(dismiss, timeout);
}
