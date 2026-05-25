import { studentApi } from '../api/studentApi.js';
import { createSkeletonCards, createStudentCard } from '../components/studentCard.js';
import { debounce, formatDateTime } from '../utils/helpers.js';
import { renderCourseChart } from './charts.js';

export function createStudentManager({ notifier }) {
  const elements = {
    addButton: document.getElementById('addStudentButton'),
    cards: document.getElementById('studentCards'),
    courseBars: document.getElementById('courseBars'),
    emptyState: document.getElementById('emptyState'),
    form: document.getElementById('studentForm'),
    modalTitle: document.getElementById('studentModalTitle'),
    search: document.getElementById('studentSearch'),
    summary: document.getElementById('dashboardSummary'),
    totalUsers: document.querySelector('[data-stat="totalUsers"]'),
    activeUsers: document.querySelector('[data-stat="activeUsers"]'),
    courseCount: document.querySelector('[data-stat="courseCount"]'),
    lastUpdated: document.querySelector('[data-stat="lastUpdated"]')
  };

  const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('studentModal'));
  let students = [];
  let searchTerm = '';

  const filteredStudents = () => {
    if (!searchTerm) return students;

    return students.filter((student) => {
      const text = `${student.fullName} ${student.email} ${student.phone} ${student.course}`.toLowerCase();
      return text.includes(searchTerm);
    });
  };

  const setLoading = () => {
    elements.cards.innerHTML = '';
    createSkeletonCards().forEach((card) => elements.cards.appendChild(card));
    elements.emptyState.hidden = true;
  };

  const updateStats = (visibleStudents) => {
    const uniqueCourses = new Set(students.map((student) => student.course));
    const latest = students.map((student) => student.updatedAt).filter(Boolean).sort().at(-1);

    elements.totalUsers.textContent = students.length;
    elements.activeUsers.textContent = visibleStudents.length;
    elements.courseCount.textContent = uniqueCourses.size;
    elements.lastUpdated.textContent = latest ? formatDateTime(latest).split(',')[0] : '--';
    elements.summary.textContent = students.length
      ? `Showing ${visibleStudents.length} of ${students.length} protected MongoDB records.`
      : 'No student records yet.';
  };

  const render = () => {
    const visibleStudents = filteredStudents();
    elements.cards.innerHTML = '';
    visibleStudents.forEach((student) => elements.cards.appendChild(createStudentCard(student)));
    elements.emptyState.hidden = visibleStudents.length > 0;
    updateStats(visibleStudents);
    renderCourseChart(elements.courseBars, students);
  };

  const loadStudents = async () => {
    try {
      setLoading();
      students = await studentApi.getStudents();
      render();
    } catch (error) {
      elements.cards.innerHTML = '';
      elements.emptyState.hidden = false;
      notifier.notify({ type: 'error', title: 'Unable to load students', message: error.message });
    }
  };

  const openCreateModal = () => {
    elements.form.reset();
    elements.form.elements.id.value = '';
    elements.modalTitle.textContent = 'Add Student';
    modal.show();
  };

  const openEditModal = (student) => {
    elements.form.reset();
    Object.entries(student).forEach(([key, value]) => {
      if (elements.form.elements[key]) elements.form.elements[key].value = value;
    });
    elements.form.elements.id.value = student._id;
    elements.modalTitle.textContent = 'Edit Student';
    modal.show();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(elements.form).entries());
    const studentId = payload.id;
    delete payload.id;

    try {
      if (studentId) {
        await studentApi.updateStudent(studentId, payload);
        notifier.notify({ type: 'success', title: 'Student updated', message: 'Record updated successfully.' });
      } else {
        await studentApi.createStudent(payload);
        notifier.notify({ type: 'success', title: 'Student created', message: 'Record saved successfully.' });
      }
      modal.hide();
      await loadStudents();
    } catch (error) {
      notifier.notify({ type: 'error', title: 'Save failed', message: error.message });
    }
  };

  const bindEvents = () => {
    elements.addButton.addEventListener('click', openCreateModal);
    elements.form.addEventListener('submit', handleSubmit);
    elements.search.addEventListener('input', debounce((event) => {
      searchTerm = event.target.value.trim().toLowerCase();
      render();
    }, 150));
    elements.cards.addEventListener('click', async (event) => {
      const actionButton = event.target.closest('[data-action]');
      if (!actionButton) return;

      const student = students.find((item) => item._id === actionButton.dataset.id);
      if (!student) return;

      if (actionButton.dataset.action === 'edit') openEditModal(student);
      if (actionButton.dataset.action === 'delete') {
        await studentApi.deleteStudent(student._id);
        notifier.notify({ type: 'info', title: 'Student deleted', message: `${student.fullName} was removed.` });
        await loadStudents();
      }
    });
  };

  bindEvents();

  return { loadStudents };
}
