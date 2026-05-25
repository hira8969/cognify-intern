export const debounce = (callback, delay = 250) => {
  let timeoutId;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), delay);
  };
};

export const formatDate = (dateValue) => {
  if (!dateValue) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateValue));
};

export const getFormData = (form) => {
  return Object.fromEntries(new FormData(form).entries());
};

export const validateStudentForm = (payload) => {
  const errors = {};

  if (!payload.name || payload.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!payload.course || payload.course.trim().length < 2) {
    errors.course = 'Course must be at least 2 characters';
  }

  if (!payload.phone || !/^[0-9+\-\s]{7,15}$/.test(payload.phone.trim())) {
    errors.phone = 'Enter a valid phone number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
