import { formatDate } from '../utils/helpers.js';

export const createStudentCard = (student) => {
  const statusClass = student.status === 'Active' ? 'status-active' : 'status-inactive';

  return `
    <article class="student-card fade-in" data-student-id="${student.id}">
      <div class="student-main">
        <div class="student-avatar" aria-hidden="true">${student.name.charAt(0).toUpperCase()}</div>
        <div>
          <h3>${student.name}</h3>
          <p>${student.email}</p>
        </div>
      </div>
      <div class="student-meta">
        <span>${student.course}</span>
        <span>${student.phone}</span>
        <span>Enrolled ${formatDate(student.enrollmentDate)}</span>
        <span class="status-pill ${statusClass}">${student.status}</span>
      </div>
      <div class="student-actions">
        <button type="button" class="btn btn-outline-primary btn-sm" data-action="edit" data-id="${student.id}">Edit</button>
        <button type="button" class="btn btn-outline-danger btn-sm" data-action="delete" data-id="${student.id}">Delete</button>
      </div>
    </article>
  `;
};

export const createSkeletonCards = (count = 4) => {
  return Array.from({ length: count }, () => {
    return `
      <div class="skeleton-card">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-lines">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
  }).join('');
};
