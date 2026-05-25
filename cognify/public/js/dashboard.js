import { createStudentCard, formatTime, storage } from './dom.js';

const STORAGE_KEY = 'cognifyz.task4.students';

export function createDashboard({ onEdit, notifier }) {
  const elements = {
    cards: document.getElementById('studentCards'),
    emptyState: document.getElementById('emptyState'),
    search: document.getElementById('studentSearch'),
    summary: document.getElementById('dashboardSummary'),
    totalUsers: document.querySelector('[data-stat="totalUsers"]'),
    activeUsers: document.querySelector('[data-stat="activeUsers"]'),
    courseCount: document.querySelector('[data-stat="courseCount"]'),
    lastUpdated: document.querySelector('[data-stat="lastUpdated"]')
  };

  let students = storage.load(STORAGE_KEY);
  let searchTerm = '';

  const getFilteredStudents = () => {
    if (!searchTerm) return students;

    return students.filter((student) => {
      const searchableText = `${student.fullName} ${student.email} ${student.phone} ${student.course}`.toLowerCase();
      return searchableText.includes(searchTerm);
    });
  };

  const updateStats = (filteredStudents) => {
    const uniqueCourses = new Set(students.map((student) => student.course));
    const latest = students
      .map((student) => student.updatedAt)
      .filter(Boolean)
      .sort()
      .at(-1);

    elements.totalUsers.textContent = students.length;
    elements.activeUsers.textContent = filteredStudents.length;
    elements.courseCount.textContent = uniqueCourses.size;
    elements.lastUpdated.textContent = latest ? formatTime(latest).split(',')[0] : '--';
    elements.summary.textContent = students.length
      ? `Showing ${filteredStudents.length} of ${students.length} locally saved students.`
      : 'No students added yet.';
  };

  const render = () => {
    const filteredStudents = getFilteredStudents();
    elements.cards.innerHTML = '';

    filteredStudents.forEach((student) => {
      elements.cards.appendChild(createStudentCard(student));
    });

    elements.emptyState.hidden = filteredStudents.length > 0;
    updateStats(filteredStudents);
  };

  const persist = () => storage.save(STORAGE_KEY, students);

  const upsertStudent = (student) => {
    const existingIndex = students.findIndex((currentStudent) => currentStudent.id === student.id);

    if (existingIndex >= 0) {
      students[existingIndex] = student;
      notifier.notify({ type: 'success', title: 'Student updated', message: `${student.fullName} was updated successfully.` });
    } else {
      students = [student, ...students];
      notifier.notify({ type: 'success', title: 'Registration saved', message: `${student.fullName} was added to the dashboard.` });
    }

    persist();
    render();
  };

  const deleteStudent = (studentId) => {
    const student = students.find((item) => item.id === studentId);
    students = students.filter((item) => item.id !== studentId);
    persist();
    render();
    notifier.notify({ type: 'info', title: 'Student deleted', message: `${student ? student.fullName : 'Student'} was removed.` });
  };

  const bindEvents = () => {
    elements.search.addEventListener('input', (event) => {
      searchTerm = event.target.value.trim().toLowerCase();
      render();
    });

    elements.cards.addEventListener('click', (event) => {
      const actionButton = event.target.closest('[data-action]');
      if (!actionButton) return;

      const student = students.find((item) => item.id === actionButton.dataset.id);
      if (!student) return;

      if (actionButton.dataset.action === 'delete') {
        deleteStudent(student.id);
      }

      if (actionButton.dataset.action === 'edit') {
        onEdit(student);
      }
    });
  };

  bindEvents();
  render();

  return {
    render,
    upsertStudent
  };
}
