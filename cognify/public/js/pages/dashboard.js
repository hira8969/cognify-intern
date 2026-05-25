import { studentApi } from '../api/studentApi.js';
import { createStudentModal } from '../components/modal.js';
import { createSkeletonCards, createStudentCard } from '../components/studentCard.js';
import { debounce, formatDateTime } from '../utils/helpers.js';

export function createDashboardPage({ notifier }) {
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

  let students = [];
  let searchTerm = '';

  const editModal = createStudentModal({
    onSave: async (studentData) => {
      const updatedStudent = await studentApi.updateStudent(studentData.id, studentData);
      notifier.notify({
        type: 'success',
        title: 'Student updated',
        message: `${updatedStudent.fullName} was updated successfully.`
      });
      await loadStudents();
    }
  });

  const setLoading = () => {
    elements.cards.innerHTML = '';
    createSkeletonCards().forEach((card) => elements.cards.appendChild(card));
    elements.emptyState.hidden = true;
  };

  const getFilteredStudents = () => {
    if (!searchTerm) return students;

    return students.filter((student) => {
      const searchableText = `${student.fullName} ${student.email} ${student.phone} ${student.course}`.toLowerCase();
      return searchableText.includes(searchTerm);
    });
  };

  const updateStats = (filteredStudents) => {
    const uniqueCourses = new Set(students.map((student) => student.course));
    const latestUpdate = students
      .map((student) => student.updatedAt)
      .filter(Boolean)
      .sort()
      .at(-1);

    elements.totalUsers.textContent = students.length;
    elements.activeUsers.textContent = filteredStudents.length;
    elements.courseCount.textContent = uniqueCourses.size;
    elements.lastUpdated.textContent = latestUpdate ? formatDateTime(latestUpdate).split(',')[0] : '--';
    elements.summary.textContent = students.length
      ? `Showing ${filteredStudents.length} of ${students.length} API-backed students.`
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

  const loadStudents = async () => {
    try {
      setLoading();
      students = await studentApi.getStudents();
      render();
    } catch (error) {
      elements.cards.innerHTML = '';
      elements.emptyState.hidden = false;
      elements.emptyState.querySelector('h2').textContent = 'Unable to load students';
      elements.emptyState.querySelector('p').textContent = error.message || 'Please try again.';
      notifier.notify({
        type: 'error',
        title: 'API error',
        message: error.message || 'Failed to load students.'
      });
    }
  };

  const addStudent = async (studentData) => {
    const student = await studentApi.createStudent(studentData);
    notifier.notify({
      type: 'success',
      title: 'Student created',
      message: `${student.fullName} was saved through the REST API.`
    });
    await loadStudents();
    return student;
  };

  const deleteStudent = async (id) => {
    const student = students.find((item) => item.id === id);
    await studentApi.deleteStudent(id);
    notifier.notify({
      type: 'info',
      title: 'Student deleted',
      message: `${student ? student.fullName : 'Student'} was removed from the API.`
    });
    await loadStudents();
  };

  const bindEvents = () => {
    elements.search.addEventListener('input', debounce((event) => {
      searchTerm = event.target.value.trim().toLowerCase();
      render();
    }, 150));

    elements.cards.addEventListener('click', async (event) => {
      const actionButton = event.target.closest('[data-action]');
      if (!actionButton) return;

      const student = students.find((item) => item.id === actionButton.dataset.id);
      if (!student) return;

      if (actionButton.dataset.action === 'edit') {
        editModal.open(student);
      }

      if (actionButton.dataset.action === 'delete') {
        await deleteStudent(student.id);
      }
    });
  };

  bindEvents();

  return {
    addStudent,
    loadStudents,
    render
  };
}
