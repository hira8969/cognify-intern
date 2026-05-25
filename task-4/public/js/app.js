import { initializeRevealAnimations, initializeRippleEffects, initializeTypingAnimation, animateCounters } from './animations.js';
import { initializeDashboard, renderDashboard, upsertStudent } from './dashboard.js';
import { clearValidationState, query, queryAll, setButtonLoading, setFieldState, setTermsState } from './dom.js';
import { showToast } from './notifications.js';
import { initializeRouter, navigateTo } from './router.js';
import { getFormValues, getPasswordStrength, validateField, validateForm } from './validation.js';

const state = {
  editingStudent: null
};

function initializeFormValidation() {
  const studentForm = query('#studentForm');
  const submitButton = query('#submitButton');
  const passwordInput = query('#password');
  const strengthBar = query('#strengthBar');
  const strengthText = query('#strengthText');

  if (!studentForm) {
    return;
  }

  studentForm.addEventListener('input', (event) => {
    const input = event.target;

    if (!input.name) {
      return;
    }

    if (input.name === 'phone') {
      input.value = input.value.replace(/\D/g, '').slice(0, 10);
    }

    const values = getFormValues(studentForm);

    if (input.name === 'terms') {
      setTermsState(validateField('terms', values));
      return;
    }

    if (input.name === 'password') {
      updatePasswordStrength(passwordInput.value, strengthBar, strengthText);
      setFieldState('confirmPassword', validateField('confirmPassword', values));
    }

    if (input.name in values) {
      setFieldState(input.name, validateField(input.name, values));
    }
  });

  studentForm.addEventListener('change', (event) => {
    if (!event.target.name) {
      return;
    }

    const values = getFormValues(studentForm);

    if (event.target.name === 'terms') {
      setTermsState(validateField('terms', values));
    } else {
      setFieldState(event.target.name, validateField(event.target.name, values));
    }
  });

  studentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const result = validateForm(studentForm);
    const submitErrors = { ...result.errors };

    if (state.editingStudent && !result.values.password && !result.values.confirmPassword) {
      delete submitErrors.password;
      delete submitErrors.confirmPassword;
    }

    renderValidationResult(submitErrors);

    if (Object.keys(submitErrors).length > 0) {
      studentForm.classList.remove('shake');
      void studentForm.offsetWidth;
      studentForm.classList.add('shake');
      showToast({
        title: 'Validation error',
        message: 'Please fix the highlighted fields before submitting.',
        type: 'error'
      });
      return;
    }

    setButtonLoading(submitButton, true);

    window.setTimeout(() => {
      const savedStudent = upsertStudent({
        ...result.values,
        id: state.editingStudent?.id || '',
        createdAt: state.editingStudent?.createdAt
      });

      state.editingStudent = null;
      studentForm.reset();
      query('#studentId').value = '';
      clearValidationState(studentForm);
      updatePasswordStrength('', strengthBar, strengthText);
      query('.button-label', submitButton).textContent = 'Save Student';
      setButtonLoading(submitButton, false);
      navigateTo('/dashboard');
      document.dispatchEvent(new CustomEvent('student:saved', { detail: savedStudent }));
    }, 650);
  });

  studentForm.addEventListener('reset', () => {
    state.editingStudent = null;
    window.setTimeout(() => {
      clearValidationState(studentForm);
      updatePasswordStrength('', strengthBar, strengthText);
      query('#studentId').value = '';
      query('.button-label', submitButton).textContent = 'Save Student';
    });
  });
}

function renderValidationResult(errors) {
  const validationFields = ['fullName', 'email', 'phone', 'age', 'course', 'password', 'confirmPassword'];

  validationFields.forEach((fieldName) => {
    setFieldState(fieldName, errors[fieldName] || '');
  });

  setTermsState(errors.terms || '');
}

function updatePasswordStrength(password, strengthBar, strengthText) {
  if (!strengthBar || !strengthText) {
    return;
  }

  const strength = getPasswordStrength(password);
  const colors = {
    danger: 'var(--color-danger)',
    warning: 'var(--color-warning)',
    success: 'var(--color-success)'
  };

  strengthBar.style.width = `${strength.percent}%`;
  strengthBar.style.background = colors[strength.tone];
  strengthText.textContent = strength.suggestions.length
    ? `${strength.label}. Try to ${strength.suggestions.join(', ')}.`
    : strength.label;
}

function initializePasswordToggles() {
  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-password-toggle]');

    if (!toggle) {
      return;
    }

    const input = query(`#${toggle.dataset.passwordToggle}`);
    const icon = query('i', toggle);
    const isHidden = input.type === 'password';

    input.type = isHidden ? 'text' : 'password';
    toggle.setAttribute('aria-label', `${isHidden ? 'Hide' : 'Show'} ${input.id === 'password' ? 'password' : 'confirm password'}`);
    icon.className = `fa-regular ${isHidden ? 'fa-eye-slash' : 'fa-eye'}`;
  });
}

function initializeStudentEditing() {
  const studentForm = query('#studentForm');
  const submitButton = query('#submitButton');

  document.addEventListener('student:edit', (event) => {
    const student = event.detail;

    if (!student || !studentForm) {
      return;
    }

    state.editingStudent = student;
    query('#studentId').value = student.id;
    query('#fullName').value = student.fullName;
    query('#email').value = student.email;
    query('#phone').value = student.phone;
    query('#age').value = student.age;
    query('#course').value = student.course;
    query('#status').value = student.status;
    query('#password').value = '';
    query('#confirmPassword').value = '';
    query('#terms').checked = true;
    query('.button-label', submitButton).textContent = 'Update Student';
    clearValidationState(studentForm);
    navigateTo('/register');
    showToast({
      title: 'Edit mode',
      message: `${student.fullName} is loaded in the registration form.`,
      type: 'info'
    });
  });
}

function initializeRouteSideEffects() {
  document.addEventListener('route:changed', (event) => {
    const routeName = event.detail.routeName;

    initializeRevealAnimations();

    if (routeName === 'home') {
      initializeTypingAnimation();
    }

    if (routeName === 'dashboard') {
      renderDashboard();
      animateCounters(query('#dashboard'));
    }
  });
}

function initializeBootstrapNavClose() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('.navbar-collapse .nav-link');
    const collapseElement = query('#mainNavigation');

    if (!link || !collapseElement || !window.bootstrap) {
      return;
    }

    const collapse = window.bootstrap.Collapse.getOrCreateInstance(collapseElement, { toggle: false });
    collapse.hide();
  });
}

function initializeApp() {
  initializeRouter();
  initializeFormValidation();
  initializePasswordToggles();
  initializeStudentEditing();
  initializeDashboard();
  initializeRippleEffects();
  initializeRouteSideEffects();
  initializeBootstrapNavClose();
  initializeRevealAnimations();
  initializeTypingAnimation();
  animateCounters();

  queryAll('[data-bs-toggle="tooltip"]').forEach((element) => {
    if (window.bootstrap) {
      new window.bootstrap.Tooltip(element);
    }
  });
}

document.addEventListener('DOMContentLoaded', initializeApp);
