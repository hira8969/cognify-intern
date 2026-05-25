export const formToObject = (formElement) => Object.fromEntries(new FormData(formElement).entries());

export const debounce = (callback, delay = 300) => {
  let timerId;

  return (...args) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => callback(...args), delay);
  };
};

export const enablePasswordToggles = () => {
  document.querySelectorAll('.password-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const targetInput = document.getElementById(button.dataset.target);
      const icon = button.querySelector('i');

      if (!targetInput) {
        return;
      }

      const shouldShowPassword = targetInput.type === 'password';
      targetInput.type = shouldShowPassword ? 'text' : 'password';
      icon.className = `fa-solid ${shouldShowPassword ? 'fa-eye-slash' : 'fa-eye'}`;
    });
  });
};

export const calculatePasswordScore = (password) => {
  const rules = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[@$!%*?&#^()_\-+=]/.test(password)
  ];

  return rules.filter(Boolean).length;
};
