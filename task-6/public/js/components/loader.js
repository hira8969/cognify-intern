export const setButtonLoading = (button, isLoading, loadingText = 'Please wait') => {
  if (!button) {
    return;
  }

  if (isLoading) {
    button.dataset.originalHtml = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span>${loadingText}</span>`;
    return;
  }

  button.disabled = false;
  button.innerHTML = button.dataset.originalHtml || button.innerHTML;
};
