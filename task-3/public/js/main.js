const form = document.getElementById('registrationForm');

function setNavbarState() {
  const navbar = document.querySelector('.app-navbar');
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}

function initRipples() {
  document.querySelectorAll('.ripple').forEach((button) => {
    button.addEventListener('click', (event) => {
      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const rect = button.getBoundingClientRect();

      circle.className = 'ripple-circle';
      circle.style.width = `${diameter}px`;
      circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - rect.left - diameter / 2}px`;
      circle.style.top = `${event.clientY - rect.top - diameter / 2}px`;

      button.querySelector('.ripple-circle')?.remove();
      button.appendChild(circle);
    });
  });
}

function initSectionHighlight() {
  const sectionLinks = [...document.querySelectorAll('.nav-link[href^="/#"]')];
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute('href').replace('/', '')))
    .filter(Boolean);

  if (!sectionLinks.length || !sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      sectionLinks.forEach((link) => {
        const target = link.getAttribute('href').replace('/', '');
        link.classList.toggle('active', target === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  sections.forEach((section) => observer.observe(section));
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

  const validators = {
    fullName: () => fields.fullName.value.trim().length >= 3 || 'Name must be at least 3 characters.',
    email: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim()) || 'Enter a valid email address.',
    phone: () => /^\d{10}$/.test(fields.phone.value.trim()) || 'Phone number must contain exactly 10 digits.',
    age: () => {
      const age = Number(fields.age.value);
      return (Number.isInteger(age) && age >= 16 && age <= 80) || 'Age must be between 16 and 80.';
    },
    gender: () => fields.gender.value !== '' || 'Please select a gender.',
    course: () => fields.course.value !== '' || 'Please select a course.',
    password: () => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(fields.password.value) || 'Use 8+ chars with uppercase, lowercase, number, and special character.',
    confirmPassword: () => (fields.confirmPassword.value === fields.password.value && fields.confirmPassword.value !== '') || 'Passwords do not match.',
    address: () => fields.address.value.trim().length >= 10 || 'Address must be at least 10 characters.',
    terms: () => fields.terms.checked || 'You must accept the terms and conditions.'
  };

  function getErrorElement(field) {
    return field.closest('.input-card, .col-12')?.querySelector('.error-message');
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
    const colors = ['#e11d48', '#f97316', '#f59e0b', '#2563eb', '#14b8a6', '#16a34a'];
    const percent = (score / 5) * 100;

    strengthBar.style.width = `${percent}%`;
    strengthBar.style.background = colors[score];
    passwordStrength.textContent = value ? `Password strength: ${labels[score]}` : 'Use uppercase, lowercase, number, and special character.';
  }

  function updateAddressCounter() {
    addressCounter.textContent = `${fields.address.value.length}/160`;
  }

  function updateProgress() {
    const total = Object.keys(validators).length;
    const validCount = Object.keys(validators).filter((name) => validators[name]() === true).length;
    const percent = Math.round((validCount / total) * 100);

    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${percent}%`;
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
      if (fields.confirmPassword.value) validateField('confirmPassword');
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
      const isHidden = target.type === 'password';

      target.type = isHidden ? 'text' : 'password';
      button.innerHTML = isHidden ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
    });
  });

  form.addEventListener('submit', (event) => {
    const isFormValid = Object.keys(validators).map(validateField).every(Boolean);
    updateProgress();

    if (!isFormValid) {
      event.preventDefault();
      form.querySelector('.is-invalid')?.focus();
    }
  });

  updatePasswordStrength();
  updateAddressCounter();
  updateProgress();
}

window.addEventListener('scroll', setNavbarState, { passive: true });
window.addEventListener('load', () => document.body.classList.add('loaded'));
setNavbarState();
initRipples();
initSectionHighlight();
