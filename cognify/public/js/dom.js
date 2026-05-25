export const storage = {
  load(key, fallback = []) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  },

  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export function formatTime(isoDate) {
  if (!isoDate) return '--';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(isoDate));
}

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function createStudentCard(student) {
  const card = document.createElement('article');
  card.className = 'student-card is-new';
  card.dataset.studentId = student.id;
  const safeStudent = {
    fullName: escapeHTML(student.fullName),
    email: escapeHTML(student.email),
    phone: escapeHTML(student.phone),
    age: escapeHTML(student.age),
    gender: escapeHTML(student.gender),
    course: escapeHTML(student.course),
    address: escapeHTML(student.address),
    updatedAt: escapeHTML(formatTime(student.updatedAt))
  };
  card.innerHTML = `
    <div class="student-card-header">
      <div class="avatar">${safeStudent.fullName.charAt(0).toUpperCase()}</div>
      <div>
        <h2>${safeStudent.fullName}</h2>
        <p>${safeStudent.email}</p>
      </div>
    </div>
    <dl>
      <div><dt>Course</dt><dd>${safeStudent.course}</dd></div>
      <div><dt>Phone</dt><dd>${safeStudent.phone}</dd></div>
      <div><dt>Age</dt><dd>${safeStudent.age}</dd></div>
      <div><dt>Gender</dt><dd>${safeStudent.gender}</dd></div>
      <div class="wide-detail"><dt>Address</dt><dd>${safeStudent.address}</dd></div>
      <div class="wide-detail"><dt>Updated</dt><dd>${safeStudent.updatedAt}</dd></div>
    </dl>
    <div class="student-card-actions">
      <button class="btn btn-warning-soft btn-ripple" type="button" data-action="edit" data-id="${student.id}">
        <i class="fa-regular fa-pen-to-square"></i>
        Edit
      </button>
      <button class="btn btn-danger-soft btn-ripple" type="button" data-action="delete" data-id="${student.id}">
        <i class="fa-regular fa-trash-can"></i>
        Delete
      </button>
    </div>
  `;

  return card;
}
