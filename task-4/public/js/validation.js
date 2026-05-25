const VALIDATION_RULES = {
  fullName(value) {
    const normalizedValue = value.trim();

    if (!normalizedValue) return 'Full name is required.';
    if (normalizedValue.length < 3) return 'Full name must be at least 3 characters.';
    if (/\d/.test(normalizedValue)) return 'Full name cannot contain numbers.';

    return '';
  },
  email(value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!value.trim()) return 'Email is required.';
    if (!emailPattern.test(value.trim())) return 'Enter a valid email address.';

    return '';
  },
  phone(value) {
    if (!value.trim()) return 'Phone number is required.';
    if (!/^\d+$/.test(value)) return 'Phone number must contain numbers only.';
    if (!/^\d{10}$/.test(value)) return 'Phone number must be exactly 10 digits.';

    return '';
  },
  age(value) {
    const age = Number(value);

    if (!value) return 'Age is required.';
    if (!Number.isInteger(age)) return 'Age must be a whole number.';
    if (age < 18) return 'Age must be at least 18.';
    if (age > 60) return 'Age must be 60 or below.';

    return '';
  },
  course(value) {
    return value ? '' : 'Please select a course.';
  },
  password(value) {
    if (!value) return 'Password is required.';
    if (value.length < 8) return 'Use at least 8 characters.';
    if (!/[A-Z]/.test(value)) return 'Add at least one uppercase letter.';
    if (!/[a-z]/.test(value)) return 'Add at least one lowercase letter.';
    if (!/\d/.test(value)) return 'Add at least one number.';
    if (!/[^A-Za-z0-9]/.test(value)) return 'Add at least one special character.';

    return '';
  },
  confirmPassword(value, formValues) {
    if (!value) return 'Please confirm the password.';
    if (value !== formValues.password) return 'Passwords must match.';

    return '';
  },
  terms(value) {
    return value ? '' : 'You must accept the terms before submitting.';
  }
};

const PASSWORD_CHECKS = [
  { test: (value) => value.length >= 8, suggestion: 'use 8 or more characters' },
  { test: (value) => /[A-Z]/.test(value), suggestion: 'add an uppercase letter' },
  { test: (value) => /[a-z]/.test(value), suggestion: 'add a lowercase letter' },
  { test: (value) => /\d/.test(value), suggestion: 'add a number' },
  { test: (value) => /[^A-Za-z0-9]/.test(value), suggestion: 'add a special character' }
];

export function getFormValues(form) {
  const formData = new FormData(form);

  return {
    id: formData.get('studentId') || '',
    fullName: (formData.get('fullName') || '').trim(),
    email: (formData.get('email') || '').trim().toLowerCase(),
    phone: (formData.get('phone') || '').trim(),
    age: (formData.get('age') || '').trim(),
    course: formData.get('course') || '',
    status: formData.get('status') || 'Active',
    password: formData.get('password') || '',
    confirmPassword: formData.get('confirmPassword') || '',
    terms: formData.get('terms') === 'on'
  };
}

export function validateField(fieldName, formValues) {
  const validator = VALIDATION_RULES[fieldName];

  return validator ? validator(formValues[fieldName], formValues) : '';
}

export function validateForm(form) {
  const formValues = getFormValues(form);
  const fieldNames = Object.keys(VALIDATION_RULES);
  const errors = fieldNames.reduce((result, fieldName) => {
    const message = validateField(fieldName, formValues);

    if (message) {
      result[fieldName] = message;
    }

    return result;
  }, {});

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values: formValues
  };
}

export function getPasswordStrength(password) {
  const passedChecks = PASSWORD_CHECKS.filter((check) => check.test(password));
  const missingSuggestions = PASSWORD_CHECKS
    .filter((check) => !check.test(password))
    .map((check) => check.suggestion);

  if (!password) {
    return {
      label: 'Start typing to check password strength.',
      percent: 0,
      tone: 'danger',
      suggestions: []
    };
  }

  if (passedChecks.length <= 2) {
    return {
      label: 'Weak password',
      percent: 34,
      tone: 'danger',
      suggestions: missingSuggestions
    };
  }

  if (passedChecks.length <= 4) {
    return {
      label: 'Medium password',
      percent: 68,
      tone: 'warning',
      suggestions: missingSuggestions
    };
  }

  return {
    label: 'Strong password',
    percent: 100,
    tone: 'success',
    suggestions: []
  };
}
