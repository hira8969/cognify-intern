import { apiService } from '../services/apiService.js';
import { showApiError, showToast } from '../components/toast.js';
import { createBootstrapModal } from '../components/modal.js';
import { setButtonLoading } from '../components/loader.js';
import { debounce, formToObject } from '../utils/helpers.js';
import { drawStatusChart } from './charts.js';

const tableBody = document.getElementById('studentsTableBody');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('studentSearch');
const statusFilter = document.getElementById('statusFilter');
const studentForm = document.getElementById('studentForm');
const studentModal = createBootstrapModal('#studentModal');
const studentModalTitle = document.getElementById('studentModalTitle');
const saveButton = document.getElementById('saveStudentButton');

let students = [];

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const updateStats = (stats) => {
  Object.entries(stats).forEach(([key, value]) => {
    const statElement = document.querySelector(`[data-stat="${key}"]`);

    if (statElement) {
      statElement.textContent = value;
    }
  });

  drawStatusChart(stats);
};

const renderStudents = () => {
  tableBody.innerHTML = '';
  emptyState.classList.toggle('d-none', students.length > 0);

  students.forEach((student) => {
    const row = document.createElement('tr');
    row.className = 'fade-in';
    row.innerHTML = `
      <td class="student-cell">
        <strong>${escapeHtml(student.fullName)}</strong>
        <small>${escapeHtml(student.email)} | ${escapeHtml(student.phone)}</small>
      </td>
      <td>${escapeHtml(student.course)}</td>
      <td class="no-wrap">${escapeHtml(student.enrollmentNumber)}</td>
      <td><span class="status-badge status-${escapeHtml(student.status)}">${escapeHtml(student.status)}</span></td>
      <td>${escapeHtml(student.grade)}</td>
      <td>
        <div class="action-group">
          <button class="icon-button" type="button" data-action="edit" data-id="${student._id}" aria-label="Edit student">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="icon-button" type="button" data-action="delete" data-id="${student._id}" aria-label="Delete student">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
};

export const fetchStudents = async () => {
  tableBody.innerHTML = `
    <tr class="skeleton-row"><td colspan="6"></td></tr>
    <tr class="skeleton-row"><td colspan="6"></td></tr>
    <tr class="skeleton-row"><td colspan="6"></td></tr>
  `;

  try {
    const query = new URLSearchParams({
      search: searchInput.value.trim(),
      status: statusFilter.value
    });
    const response = await apiService.get(`/api/students?${query.toString()}`);
    students = response.data.students;
    updateStats(response.data.stats);
    renderStudents();
  } catch (error) {
    showApiError(error);
    tableBody.innerHTML = '';
  }
};

export const openCreateStudentModal = () => {
  studentForm.reset();
  document.getElementById('studentId').value = '';
  studentModalTitle.textContent = 'Add student';
  studentModal.show();
};

const openEditStudentModal = (studentId) => {
  const student = students.find((item) => item._id === studentId);

  if (!student) {
    return;
  }

  studentModalTitle.textContent = 'Edit student';
  document.getElementById('studentId').value = student._id;
  document.getElementById('fullName').value = student.fullName;
  document.getElementById('studentEmail').value = student.email;
  document.getElementById('phone').value = student.phone;
  document.getElementById('course').value = student.course;
  document.getElementById('enrollmentNumber').value = student.enrollmentNumber;
  document.getElementById('status').value = student.status;
  document.getElementById('grade').value = student.grade;
  studentModal.show();
};

const deleteStudent = async (studentId) => {
  const shouldDelete = window.confirm('Delete this student record?');

  if (!shouldDelete) {
    return;
  }

  try {
    await apiService.delete(`/api/students/${studentId}`);
    showToast('Student deleted successfully.', 'success');
    await fetchStudents();
  } catch (error) {
    showApiError(error);
  }
};

studentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setButtonLoading(saveButton, true, 'Saving');

  try {
    const studentId = document.getElementById('studentId').value;
    const payload = formToObject(studentForm);

    if (studentId) {
      await apiService.put(`/api/students/${studentId}`, payload);
      showToast('Student updated successfully.', 'success');
    } else {
      await apiService.post('/api/students', payload);
      showToast('Student added successfully.', 'success');
    }

    studentModal.hide();
    await fetchStudents();
  } catch (error) {
    showApiError(error);
  } finally {
    setButtonLoading(saveButton, false);
  }
});

tableBody.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-action]');

  if (!actionButton) {
    return;
  }

  if (actionButton.dataset.action === 'edit') {
    openEditStudentModal(actionButton.dataset.id);
  }

  if (actionButton.dataset.action === 'delete') {
    deleteStudent(actionButton.dataset.id);
  }
});

searchInput.addEventListener('input', debounce(fetchStudents, 280));
statusFilter.addEventListener('change', fetchStudents);
