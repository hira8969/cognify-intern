const iconMap = {
  success: 'fa-circle-check',
  error: 'fa-circle-exclamation',
  info: 'fa-circle-info'
};

export const showToast = (message, type = 'info') => {
  const toastRegion = document.getElementById('toastRegion');

  if (!toastRegion) {
    return;
  }

  const toast = document.createElement('div');
  toast.className = `app-toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${iconMap[type] || iconMap.info}"></i>
    <div>${message}</div>
  `;

  toastRegion.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3600);
};

export const showApiError = (error) => {
  const firstValidationMessage = error.errors && error.errors[0] ? error.errors[0].message : null;
  showToast(firstValidationMessage || error.message || 'Request failed.', 'error');
};
