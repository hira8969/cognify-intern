import { escapeHTML, formatDateTime } from '../utils/helpers.js';

export function createStudentCard(student) {
  const card = document.createElement('article');
  card.className = 'student-card is-new';
  card.dataset.studentId = student._id;

  card.innerHTML = `
    <div class="student-card-header">
      <div class="avatar">${escapeHTML(student.fullName).charAt(0).toUpperCase()}</div>
      <div>
        <h2>${escapeHTML(student.fullName)}</h2>
        <p>${escapeHTML(student.email)}</p>
      </div>
    </div>
    <dl>
      <div><dt>Course</dt><dd>${escapeHTML(student.course)}</dd></div>
      <div><dt>Phone</dt><dd>${escapeHTML(student.phone)}</dd></div>
      <div><dt>Age</dt><dd>${escapeHTML(student.age)}</dd></div>
      <div><dt>Gender</dt><dd>${escapeHTML(student.gender)}</dd></div>
      <div class="wide-detail"><dt>Address</dt><dd>${escapeHTML(student.address)}</dd></div>
      <div class="wide-detail"><dt>Updated</dt><dd>${formatDateTime(student.updatedAt)}</dd></div>
    </dl>
    <div class="student-card-actions">
      <button class="btn btn-warning-soft btn-ripple" type="button" data-action="edit" data-id="${student._id}">
        <i class="fa-regular fa-pen-to-square"></i>
        Edit
      </button>
      <button class="btn btn-danger-soft btn-ripple" type="button" data-action="delete" data-id="${student._id}">
        <i class="fa-regular fa-trash-can"></i>
        Delete
      </button>
    </div>
  `;

  return card;
}

export function createSkeletonCards(count = 6) {
  return Array.from({ length: count }, () => {
    const card = document.createElement('article');
    card.className = 'student-card skeleton-card';
    card.innerHTML = '<span></span><span></span><span></span><span></span>';
    return card;
  });
}
