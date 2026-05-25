const FIELD_NAMES = [
  'fullName',
  'email',
  'phone',
  'age',
  'gender',
  'course',
  'password',
  'confirmPassword',
  'address',
  'terms'
];

const patterns = {
  name: /^[A-Za-z\s.'-]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{10}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/
};

const messages = {
  fullName: 'Use at least 3 letters and no numbers.',
  email: 'Enter a valid email address.',
  phone: 'Phone number must contain exactly 10 digits.',
  age: 'Age must be between 18 and 60.',
  gender: 'Please select a gender.',
  course: 'Please choose a course.',
  password: 'Use 8+ characters with uppercase, lowercase, number, and special character.',
  confirmPassword: 'Passwords do not match.',
  address: 'Address must be at least 10 characters.',
  terms: 'You must accept the terms and conditions.'
};

const passwordChecks = [
  { label: 'Use at least 8 characters', test: (value) => value.length >= 8 },
  { label: 'Add an uppercase letter', test: (value) => /[A-Z]/.test(value) },
  { label: 'Add a lowercase letter', test: (value) => /[a-z]/.test(value) },
  { label: 'Add a number', test: (value) => /\d/.test(value) },
  { label: 'Add a special character', test: (value) => /[^A-Za-z\d]/.test(value) }
];

function createId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `student-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createRegistrationValidator(form) {
  const fields = FIELD_NAMES.reduce((fieldMap, fieldName) => {
    fieldMap[fieldName] = form.elements[fieldName];
    return fieldMap;
  }, {});
  fields.studentId = form.elements.studentId;

  const nodes = {
    formProgress: document.getElementById('formProgress'),
    progressText: document.getElementById('progressText'),
    strengthBar: document.getElementById('strengthBar'),
    strengthText: document.getElementById('strengthText'),
    addressCounter: document.getElementById('addressCounter'),
    passwordSuggestions: document.getElementById('passwordSuggestions')
  };

  const getValue = (fieldName) => {
    const field = fields[fieldName];
    return field.type === 'checkbox' ? field.checked : field.value.trim();
  };

  const setFieldState = (fieldName, isValid, message = '') => {
    const field = fields[fieldName];
    const group = field.closest('.input-group');
    const errorNode = form.querySelector(`[data-error-for="${fieldName}"]`);

    if (group) {
      group.classList.toggle('is-valid', isValid);
      group.classList.toggle('is-invalid', !isValid && Boolean(message));
    }

    if (errorNode) {
      errorNode.textContent = message;
    }
  };

  const getPasswordStrength = () => {
    const value = fields.password.value;
    const passed = passwordChecks.filter((check) => check.test(value));
    const missing = passwordChecks.filter((check) => !check.test(value));

    let level = 'Weak';
    let color = '#ef4565';

    if (passed.length >= 5) {
      level = 'Strong';
      color = '#19b985';
    } else if (passed.length >= 3) {
      level = 'Medium';
      color = '#f59e0b';
    }

    return {
      color,
      level,
      missing,
      percent: passed.length * 20,
      score: passed.length
    };
  };

  const updatePasswordStrength = () => {
    const value = fields.password.value;
    const strength = getPasswordStrength();

    nodes.strengthBar.style.width = `${strength.percent}%`;
    nodes.strengthBar.style.background = strength.color;
    nodes.strengthText.textContent = value
      ? `Password strength: ${strength.level.toLowerCase()}`
      : 'Password strength: waiting';

    nodes.passwordSuggestions.innerHTML = '';
    strength.missing.slice(0, 3).forEach((check) => {
      const item = document.createElement('li');
      item.textContent = check.label;
      nodes.passwordSuggestions.appendChild(item);
    });
  };

  const updateAddressCounter = () => {
    nodes.addressCounter.textContent = fields.address.value.length;
  };

  const updateProgress = () => {
    const completedFields = FIELD_NAMES.filter((fieldName) => {
      const field = fields[fieldName];
      return field.type === 'checkbox' ? field.checked : field.value.trim().length > 0;
    }).length;
    const percent = Math.round((completedFields / FIELD_NAMES.length) * 100);

    nodes.formProgress.style.width = `${percent}%`;
    nodes.progressText.textContent = `${percent}%`;
  };

  const validateField = (fieldName) => {
    const value = getValue(fieldName);
    let isValid = true;

    if (fieldName === 'fullName') {
      isValid = value.length >= 3 && patterns.name.test(value);
    }

    if (fieldName === 'email') {
      isValid = patterns.email.test(value);
    }

    if (fieldName === 'phone') {
      fields.phone.value = fields.phone.value.replace(/\D/g, '').slice(0, 10);
      isValid = patterns.phone.test(fields.phone.value);
    }

    if (fieldName === 'age') {
      isValid = Number(value) >= 18 && Number(value) <= 60;
    }

    if (fieldName === 'gender' || fieldName === 'course') {
      isValid = Boolean(value);
    }

    if (fieldName === 'password') {
      isValid = patterns.password.test(fields.password.value);
      updatePasswordStrength();

      if (fields.confirmPassword.value) {
        validateField('confirmPassword');
      }
    }

    if (fieldName === 'confirmPassword') {
      isValid = fields.confirmPassword.value.length > 0 && fields.confirmPassword.value === fields.password.value;
    }

    if (fieldName === 'address') {
      isValid = value.length >= 10;
      updateAddressCounter();
    }

    if (fieldName === 'terms') {
      isValid = fields.terms.checked;
    }

    setFieldState(fieldName, isValid, isValid ? '' : messages[fieldName]);
    updateProgress();
    return isValid;
  };

  const validateAll = () => {
    const results = FIELD_NAMES.map((fieldName) => validateField(fieldName));
    return results.every(Boolean);
  };

  const getStudentData = () => ({
    id: fields.studentId.value || createId(),
    fullName: fields.fullName.value.trim(),
    email: fields.email.value.trim().toLowerCase(),
    phone: fields.phone.value.trim(),
    age: Number(fields.age.value),
    gender: fields.gender.value,
    course: fields.course.value,
    address: fields.address.value.trim(),
    password: fields.password.value,
    confirmPassword: fields.confirmPassword.value,
    terms: fields.terms.checked
  });

  const populateForm = (student) => {
    fields.studentId.value = student.id;
    fields.fullName.value = student.fullName;
    fields.email.value = student.email;
    fields.phone.value = student.phone;
    fields.age.value = student.age;
    fields.gender.value = student.gender;
    fields.course.value = student.course;
    fields.address.value = student.address;
    fields.password.value = 'Password123!';
    fields.confirmPassword.value = 'Password123!';
    fields.terms.checked = true;
    FIELD_NAMES.forEach((fieldName) => validateField(fieldName));
  };

  const resetForm = () => {
    form.reset();
    fields.studentId.value = '';
    FIELD_NAMES.forEach((fieldName) => setFieldState(fieldName, false, ''));
    updateAddressCounter();
    updatePasswordStrength();
    updateProgress();
  };

  const bindEvents = () => {
    FIELD_NAMES.forEach((fieldName) => {
      const field = fields[fieldName];
      const eventName = field.tagName === 'SELECT' || field.type === 'checkbox' ? 'change' : 'input';

      field.addEventListener(eventName, () => validateField(fieldName));
      field.addEventListener('blur', () => validateField(fieldName));
    });

    form.querySelectorAll('.toggle-password').forEach((button) => {
      button.addEventListener('click', () => {
        const target = document.getElementById(button.dataset.target);
        const icon = button.querySelector('i');
        const shouldShow = target.type === 'password';

        target.type = shouldShow ? 'text' : 'password';
        button.setAttribute('aria-label', shouldShow ? 'Hide password' : 'Show password');
        icon.className = shouldShow ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      });
    });
  };

  bindEvents();
  resetForm();

  return {
    applyServerErrors(errors = {}) {
      if (!errors) return;

      Object.entries(errors).forEach(([fieldName, message]) => {
        if (fields[fieldName]) {
          setFieldState(fieldName, false, message);
        }
      });
    },
    getStudentData,
    populateForm,
    resetForm,
    validateAll
  };
}
