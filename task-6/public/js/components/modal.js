export const createBootstrapModal = (selector) => {
  const modalElement = document.querySelector(selector);

  if (!modalElement || !window.bootstrap) {
    return null;
  }

  return new window.bootstrap.Modal(modalElement);
};
