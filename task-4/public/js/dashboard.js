import { createStudentCard, escapeHtml, query } from './dom.js';
import { showToast } from './notifications.js';

const STORAGE_KEY = 'cognifyz-task-4-students';

const starterStudents = [
  {
    id: 'seed-1',
    fullName: 'Ananya Mehta',
    email: 'ananya.mehta@example.com',
    phone: '9876543210',
    age: '22',
    course: 'Full Stack Web Development',
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-2',
    fullName: 'Rohan Verma',
    email: 'rohan.verma@example.com',
    phone: '9123456780',
    age: '24',
    course: 'Data Science',
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-3',
    fullName: 'Priya Nair',
    email: 'priya.nair@example.com',
    phone: '9988776655',
    age: '27',
    course: 'UI/UX Design',
    status: 'Inactive',
    createdAt: new Date().toISOString()
  }
];

let students = loadStudents();
let filters = {
  search: '',
  course: ''
};

function loadStudents() {
  const storedStudents = localStorage.getItem(STORAGE_KEY);

  if (!storedStudents) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(starterStudents));
    return [...starterStudents];
  }

  try {
    return JSON.parse(storedStudents);
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(starterStudents));
    return [...starterStudents];
  }
}

function persistStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function createStudentId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `student-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getFilteredStudents() {
  return students.filter((student) => {
    const searchableText = `${student.fullName} ${student.email} ${student.course}`.toLowerCase();
    const matchesSearch = searchableText.includes(filters.search.toLowerCase());
    const matchesCourse = !filters.course || student.course === filters.course;

    return matchesSearch && matchesCourse;
  });
}

function renderStats() {
  const totalUsers = students.length;
  const activeUsers = students.filter((student) => student.status === 'Active').length;
  const courseCount = new Set(students.map((student) => student.course)).size;
  const latestUser = students.at(-1)?.fullName || 'None';

  updateStat('#totalUsers', totalUsers);
  updateStat('#activeUsers', activeUsers);
  updateStat('#courseCount', courseCount);

  const latestUserElement = query('#latestUser');
  if (latestUserElement) {
    latestUserElement.textContent = latestUser;
  }
}

function updateStat(selector, value) {
  const element = query(selector);

  if (!element) {
    return;
  }

  element.dataset.target = String(value);
  element.textContent = String(value);
}

function renderCourseBreakdown() {
  const courseBreakdown = query('#courseBreakdown');

  if (!courseBreakdown) {
    return;
  }

  const counts = students.reduce((result, student) => {
    result[student.course] = (result[student.course] || 0) + 1;
    return result;
  }, {});

  if (Object.keys(counts).length === 0) {
    courseBreakdown.innerHTML = '<span class="course-pill">No course data yet</span>';
    return;
  }

  courseBreakdown.innerHTML = Object.entries(counts)
    .map(([course, count]) => `<span class="course-pill">${escapeHtml(course)}: ${count}</span>`)
    .join('');
}

export function renderDashboard() {
  const studentCards = query('#studentCards');
  const emptyState = query('#emptyState');

  if (!studentCards || !emptyState) {
    return;
  }

  const visibleStudents = getFilteredStudents();
  const fragment = document.createDocumentFragment();

  visibleStudents.forEach((student) => {
    fragment.append(createStudentCard(student));
  });

  studentCards.replaceChildren(fragment);
  emptyState.hidden = visibleStudents.length > 0;
  renderStats();
  renderCourseBreakdown();
}

export function upsertStudent(studentData) {
  const existingIndex = students.findIndex((student) => student.id === studentData.id);
  const normalizedStudent = {
    ...studentData,
    id: studentData.id || createStudentId(),
    createdAt: studentData.createdAt || new Date().toISOString()
  };

  if (existingIndex >= 0) {
    students[existingIndex] = {
      ...students[existingIndex],
      ...normalizedStudent
    };
    showToast({
      title: 'Student updated',
      message: `${normalizedStudent.fullName} was updated successfully.`,
      type: 'success'
    });
  } else {
    students.push(normalizedStudent);
    showToast({
      title: 'Registration complete',
      message: `${normalizedStudent.fullName} has been added to the dashboard.`,
      type: 'success'
    });
  }

  persistStudents();
  renderDashboard();

  return normalizedStudent;
}

export function deleteStudent(studentId) {
  const student = students.find((item) => item.id === studentId);
  students = students.filter((item) => item.id !== studentId);
  persistStudents();
  renderDashboard();

  if (student) {
    showToast({
      title: 'Student deleted',
      message: `${student.fullName} was removed from the dashboard.`,
      type: 'warning'
    });
  }
}

export function getStudent(studentId) {
  return students.find((student) => student.id === studentId);
}

export function setDashboardFilters(nextFilters) {
  filters = {
    ...filters,
    ...nextFilters
  };
  renderDashboard();
}

export function initializeDashboard() {
  const searchInput = query('#studentSearch');
  const courseFilter = query('#courseFilter');
  const cardsRoot = query('#studentCards');

  searchInput?.addEventListener('input', (event) => {
    setDashboardFilters({ search: event.target.value });
  });

  courseFilter?.addEventListener('change', (event) => {
    setDashboardFilters({ course: event.target.value });
  });

  cardsRoot?.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-action]');

    if (!actionButton) {
      return;
    }

    const { action, id } = actionButton.dataset;

    if (action === 'delete') {
      const card = actionButton.closest('.student-card');
      card?.classList.add('is-removing');
      window.setTimeout(() => deleteStudent(id), 180);
    }

    if (action === 'edit') {
      document.dispatchEvent(new CustomEvent('student:edit', {
        detail: getStudent(id)
      }));
    }
  });

  renderDashboard();
}
