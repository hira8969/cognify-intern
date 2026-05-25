const form = document.getElementById('registrationForm');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatDate(value) {
  return new Date(value).toLocaleString();
}

if (form) {
  const fields = {
    fullName: document.getElementById('fullName'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    age: document.getElementById('age'),
    gender: document.getElementById('gender'),
    course: document.getElementById('course'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
    address: document.getElementById('address'),
    terms: document.getElementById('terms')
  };

  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const strengthBar = document.getElementById('strengthBar');
  const passwordStrength = document.getElementById('passwordStrength');
  const addressCounter = document.getElementById('addressCounter');
  const submitButton = document.getElementById('submitButton');

  const validators = {
    fullName: () => fields.fullName.value.trim().length >= 3 || 'Name must be at least 3 characters.',
    email: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim()) || 'Enter a valid email address.',
    phone: () => /^\d{10}$/.test(fields.phone.value.trim()) || 'Phone number must contain exactly 10 digits.',
    age: () => {
      const age = Number(fields.age.value);
      return (Number.isInteger(age) && age >= 10 && age <= 100) || 'Age must be between 10 and 100.';
    },
    gender: () => fields.gender.value !== '' || 'Please select your gender.',
    course: () => fields.course.value !== '' || 'Please select a course.',
    password: () => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(fields.password.value) ||
      'Use 8+ characters with uppercase, lowercase, number, and special character.',
    confirmPassword: () => (fields.confirmPassword.value !== '' && fields.confirmPassword.value === fields.password.value) ||
      'Passwords do not match.',
    address: () => fields.address.value.trim().length >= 10 || 'Address must be at least 10 characters.',
    terms: () => fields.terms.checked || 'You must accept the terms and conditions.'
  };

  function getErrorElement(field) {
    return field.closest('.field-group').querySelector('.error-message');
  }

  function setFieldState(field, isValid, message) {
    const errorElement = getErrorElement(field);

    field.classList.toggle('is-valid', isValid);
    field.classList.toggle('is-invalid', !isValid);

    if (errorElement) {
      errorElement.textContent = isValid ? '' : message;
    }
  }

  function validateField(name) {
    const result = validators[name]();
    const isValid = result === true;

    setFieldState(fields[name], isValid, isValid ? '' : result);
    return isValid;
  }

  function updatePasswordStrength() {
    const value = fields.password.value;
    let score = 0;

    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[a-z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;

    const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
    const colors = ['#dc2626', '#ef4444', '#f59e0b', '#2563eb', '#0fbc8c', '#16a34a'];

    strengthBar.style.width = `${(score / 5) * 100}%`;
    strengthBar.style.background = colors[score];
    passwordStrength.textContent = value ? `Password strength: ${labels[score]}` : 'Use uppercase, lowercase, number, and special character.';
  }

  function updateAddressCounter() {
    addressCounter.textContent = `${fields.address.value.length}/160`;
  }

  function updateProgress() {
    const names = Object.keys(validators);
    const completed = names.filter((name) => validators[name]() === true).length;
    const percent = Math.round((completed / names.length) * 100);

    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${percent}%`;
  }

  function setServerErrors(errors) {
    Object.entries(errors).forEach(([name, message]) => {
      if (fields[name]) {
        setFieldState(fields[name], false, message);
      }
    });
  }

  function getFormPayload() {
    return {
      fullName: fields.fullName.value,
      email: fields.email.value,
      phone: fields.phone.value,
      age: fields.age.value,
      gender: fields.gender.value,
      course: fields.course.value,
      password: fields.password.value,
      confirmPassword: fields.confirmPassword.value,
      address: fields.address.value,
      terms: fields.terms.checked ? 'on' : ''
    };
  }

  function handleInput(event) {
    const fieldName = event.target.name;

    if (fieldName === 'phone') {
      fields.phone.value = fields.phone.value.replace(/\D/g, '').slice(0, 10);
    }

    if (validators[fieldName]) {
      validateField(fieldName);
    }

    if (fieldName === 'password') {
      updatePasswordStrength();

      if (fields.confirmPassword.value) {
        validateField('confirmPassword');
      }
    }

    if (fieldName === 'address') {
      updateAddressCounter();
    }

    updateProgress();
  }

  Object.values(fields).forEach((field) => {
    const eventName = field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input';
    field.addEventListener(eventName, handleInput);
  });

  document.querySelectorAll('.toggle-password').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.target);
      const shouldShow = target.type === 'password';

      target.type = shouldShow ? 'text' : 'password';
      button.textContent = shouldShow ? 'Hide' : 'Show';
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const valid = Object.keys(validators).map(validateField).every(Boolean);
    updatePasswordStrength();
    updateAddressCounter();
    updateProgress();

    if (!valid) {
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(getFormPayload())
      });

      const result = await response.json();

      if (!response.ok) {
        setServerErrors(result.errors || {});
        return;
      }

      window.location.href = `/success?id=${encodeURIComponent(result.student.id)}`;
    } catch (error) {
      setFieldState(fields.email, false, 'Server connection failed. Please try again.');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Registration';
    }
  });

  updatePasswordStrength();
  updateAddressCounter();
  updateProgress();
}

const studentTableBody = document.getElementById('studentTableBody');
const studentCardGrid = document.getElementById('studentCardGrid');
const registrationCount = document.getElementById('registrationCount');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const emptyState = document.getElementById('emptyState');
const dashboardContent = document.getElementById('dashboardContent');

async function loadDashboard(search = '') {
  if (!studentTableBody) {
    return;
  }

  const response = await fetch(`/api/users?search=${encodeURIComponent(search)}`);
  const data = await response.json();

  registrationCount.textContent = data.totalUsers;
  emptyState.classList.toggle('d-none', data.users.length !== 0);
  dashboardContent.classList.toggle('d-none', data.users.length === 0);

  studentTableBody.innerHTML = data.users.map((user) => `
    <tr>
      <td>
        <div class="student-cell">
          <span class="avatar">${escapeHtml(user.fullName.charAt(0).toUpperCase())}</span>
          <div>
            <strong>${escapeHtml(user.fullName)}</strong>
            <small>${escapeHtml(user.gender)}, ${escapeHtml(user.age)} years</small>
          </div>
        </div>
      </td>
      <td>
        <strong>${escapeHtml(user.email)}</strong>
        <small>${escapeHtml(user.phone)}</small>
      </td>
      <td><span class="course-pill">${escapeHtml(user.course)}</span></td>
      <td>${escapeHtml(formatDate(user.registeredAt))}</td>
      <td><button class="danger-button" type="button" data-delete-id="${escapeHtml(user.id)}">Delete</button></td>
    </tr>
  `).join('');

  studentCardGrid.innerHTML = data.users.map((user) => `
    <article class="student-card">
      <div class="student-cell mb-3">
        <span class="avatar">${escapeHtml(user.fullName.charAt(0).toUpperCase())}</span>
        <div>
          <h2>${escapeHtml(user.fullName)}</h2>
          <small>${escapeHtml(user.course)}</small>
        </div>
      </div>
      <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(user.phone)}</p>
      <p><strong>Age/Gender:</strong> ${escapeHtml(user.age)}, ${escapeHtml(user.gender)}</p>
      <p><strong>Address:</strong> ${escapeHtml(user.address)}</p>
    </article>
  `).join('');
}

if (searchForm) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    loadDashboard(searchInput.value);
  });

  clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    loadDashboard();
  });

  document.addEventListener('click', async (event) => {
    const deleteButton = event.target.closest('[data-delete-id]');

    if (!deleteButton) {
      return;
    }

    await fetch(`/api/users/${deleteButton.dataset.deleteId}`, {
      method: 'DELETE'
    });

    loadDashboard(searchInput.value);
  });

  loadDashboard();
}

const successName = document.getElementById('successName');

async function loadSuccessPage() {
  if (!successName) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    window.location.href = '/dashboard';
    return;
  }

  const response = await fetch(`/api/users/${encodeURIComponent(id)}`);

  if (!response.ok) {
    window.location.href = '/dashboard';
    return;
  }

  const data = await response.json();
  const user = data.user;

  successName.textContent = `Welcome, ${user.fullName}`;
  document.getElementById('successEmail').textContent = user.email;
  document.getElementById('successCourse').textContent = user.course;
  document.getElementById('successTime').textContent = formatDate(user.registeredAt);
}

loadSuccessPage();
