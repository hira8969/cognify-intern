export const SELECTORS = {
  studentForm: '#studentForm',
  submitButton: '#submitButton',
  resetButton: '#resetButton',
  studentCards: '#studentCards',
  emptyState: '#emptyState',
  studentSearch: '#studentSearch',
  courseFilter: '#courseFilter',
  courseBreakdown: '#courseBreakdown'
};

export function query(selector, parent = document) {
  return parent.querySelector(selector);
}

export function queryAll(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

export function setFieldState(fieldName, message = '') {
  const field = query(`[data-field="${fieldName}"]`);

  if (!field) {
    return;
  }

  const status = query('.field-status', field);
  const messageTarget = query('.field-message', field);
  const isValid = message === '';

  field.classList.toggle('is-valid', isValid);
  field.classList.toggle('is-invalid', !isValid);

  if (status) {
    status.innerHTML = isValid
      ? '<i class="fa-solid fa-circle-check"></i>'
      : '<i class="fa-solid fa-circle-xmark"></i>';
  }

  if (messageTarget) {
    messageTarget.textContent = message || 'Looks good.';
  }
}

export function setTermsState(message = '', fallbackMessage = 'Terms accepted.') {
  const messageTarget = query('[data-field-message="terms"]');

  if (!messageTarget) {
    return;
  }

  messageTarget.textContent = message || fallbackMessage;
  messageTarget.classList.toggle('is-invalid', Boolean(message));
}

export function clearValidationState(form) {
  queryAll('.form-field', form).forEach((field) => {
    field.classList.remove('is-valid', 'is-invalid');
    const status = query('.field-status', field);
    const messageTarget = query('.field-message', field);

    if (status) status.innerHTML = '';
    if (messageTarget && !messageTarget.classList.contains('strength-message')) messageTarget.textContent = '';
  });

  setTermsState('', '');
}

export function setButtonLoading(button, isLoading) {
  if (!button) {
    return;
  }

  button.classList.toggle('is-loading', isLoading);
  button.disabled = isLoading;
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function createStudentCard(student) {
  const card = document.createElement('article');
  const statusClass = student.status === 'Inactive' ? 'inactive' : 'active';
  const safeStudent = {
    id: escapeHtml(student.id),
    fullName: escapeHtml(student.fullName),
    email: escapeHtml(student.email),
    phone: escapeHtml(student.phone),
    age: escapeHtml(student.age),
    course: escapeHtml(student.course),
    status: escapeHtml(student.status)
  };

  card.className = 'student-card entering reveal is-visible';
  card.dataset.studentId = student.id;
  card.dataset.name = student.fullName.toLowerCase();
  card.dataset.email = student.email.toLowerCase();
  card.dataset.course = student.course;
  card.innerHTML = `
    <div class="student-header">
      <div class="student-avatar">${safeStudent.fullName.charAt(0).toUpperCase()}</div>
      <div class="min-w-0">
        <h3 class="text-truncate-soft">${safeStudent.fullName}</h3>
        <p class="text-truncate-soft">${safeStudent.course}</p>
      </div>
    </div>
    <div class="student-meta">
      <span><i class="fa-regular fa-envelope"></i><span class="text-truncate-soft">${safeStudent.email}</span></span>
      <span><i class="fa-solid fa-phone"></i>${safeStudent.phone}</span>
      <span><i class="fa-solid fa-user-graduate"></i>${safeStudent.age} years</span>
      <span><i class="fa-solid fa-circle"></i><span class="badge-status ${statusClass}">${safeStudent.status}</span></span>
    </div>
    <div class="student-actions">
      <button class="icon-action" type="button" data-action="edit" data-id="${safeStudent.id}" aria-label="Edit ${safeStudent.fullName}">
        <i class="fa-solid fa-pen"></i>
      </button>
      <button class="icon-action danger" type="button" data-action="delete" data-id="${safeStudent.id}" aria-label="Delete ${safeStudent.fullName}">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `;

  return card;
}
