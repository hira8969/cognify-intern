const icons = {
  success: 'fa-solid fa-check',
  error: 'fa-solid fa-triangle-exclamation',
  info: 'fa-solid fa-circle-info'
};

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function createNotifier(region) {
  const notify = ({ type = 'info', title = 'Notice', message = '' }) => {
    const toast = document.createElement('div');
    toast.className = `app-toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon"><i class="${icons[type] || icons.info}"></i></span>
      <span class="toast-content">
        <strong>${escapeHTML(title)}</strong>
        <span>${escapeHTML(message)}</span>
      </span>
      <button class="toast-close" type="button" aria-label="Dismiss notification">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    const close = () => {
      toast.classList.add('is-leaving');
      window.setTimeout(() => toast.remove(), 240);
    };

    toast.querySelector('.toast-close').addEventListener('click', close);
    region.appendChild(toast);
    window.setTimeout(close, 3800);
  };

  return { notify };
}
