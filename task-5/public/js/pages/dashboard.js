import { studentApi } from '../api/studentApi.js';
import { createSkeletonCards, createStudentCard } from '../components/studentCard.js';
import { closeEditModal, openEditModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { debounce, getFormData, validateStudentForm } from '../utils/helpers.js';

const studentForm = document.querySelector('#studentForm');
const editStudentForm = document.querySelector('#editStudentForm');
const studentList = document.querySelector('#studentList');
const loadingState = document.querySelector('#loadingState');
const errorState = document.querySelector('#errorState');
const emptyState = document.querySelector('#emptyState');
const searchInput = document.querySelector('#studentSearch');
const resultSummary = document.querySelector('#resultSummary');
const refreshButton = document.querySelector('#refreshButton');
const submitButton = document.querySelector('#submitButton');

let students = [];
let filteredStudents = [];

const setButtonLoading = (button, isLoading) => {
  if (!button) {
    return;
  }

  const spinner = button.querySelector('.spinner-border');
  const label = button.querySelector('.button-label');
  button.disabled = isLoading;
  spinner?.classList.toggle('d-none', !isLoading);
  label?.classList.toggle('opacity-75', isLoading);
};

const updateStatistics = () => {
  const totalStudents = students.length;
  const activeStudents = students.filter((student) => student.status === 'Active').length;
  const inactiveStudents = totalStudents - activeStudents;

  document.querySelector('#totalStudents').textContent = totalStudents;
  document.querySelector('#activeStudents').textContent = activeStudents;
  document.querySelector('#inactiveStudents').textContent = inactiveStudents;
};

const renderStudents = () => {
  studentList.innerHTML = filteredStudents.map(createStudentCard).join('');
  emptyState.classList.toggle('d-none', filteredStudents.length > 0);
  resultSummary.textContent = `${filteredStudents.length} of ${students.length} records shown`;
  updateStatistics();
};

const setLoadingState = (isLoading) => {
  loadingState.classList.toggle('d-none', !isLoading);
  if (isLoading) {
    loadingState.innerHTML = createSkeletonCards();
  }
};

const setErrorState = (message = '') => {
  errorState.textContent = message;
  errorState.classList.toggle('d-none', !message);
};

const loadStudents = async () => {
  setErrorState();
  setLoadingState(true);
  studentList.innerHTML = '';
  emptyState.classList.add('d-none');

  try {
    const response = await studentApi.getAllStudents();
    students = response.data || [];
    filteredStudents = students;
    renderStudents();
  } catch (error) {
    setErrorState(error.message);
    showToast(error.message, 'danger');
  } finally {
    setLoadingState(false);
  }
};

const applySearch = () => {
  const query = searchInput.value.trim().toLowerCase();

  filteredStudents = students.filter((student) => {
    return [student.name, student.email, student.course, student.phone, student.status]
      .some((value) => value.toLowerCase().includes(query));
  });

  renderStudents();
};

const resetCreateForm = () => {
  studentForm.reset();
  studentForm.classList.remove('was-validated');
};

const handleCreateStudent = async (event) => {
  event.preventDefault();
  const payload = getFormData(studentForm);
  const validation = validateStudentForm(payload);

  studentForm.classList.add('was-validated');

  if (!validation.isValid) {
    showToast('Please fix the highlighted fields', 'danger');
    return;
  }

  setButtonLoading(submitButton, true);

  try {
    const response = await studentApi.createStudent(payload);
    students = [response.data, ...students];
    filteredStudents = students;
    searchInput.value = '';
    renderStudents();
    resetCreateForm();
    showToast(response.message);
  } catch (error) {
    showToast(error.message, 'danger');
  } finally {
    setButtonLoading(submitButton, false);
  }
};

const handleUpdateStudent = async (event) => {
  event.preventDefault();
  const payload = getFormData(editStudentForm);
  const studentId = payload.id;
  delete payload.id;

  const validation = validateStudentForm(payload);
  editStudentForm.classList.add('was-validated');

  if (!validation.isValid) {
    showToast('Please fix the highlighted fields', 'danger');
    return;
  }

  try {
    const response = await studentApi.updateStudent(studentId, payload);
    students = students.map((student) => student.id === studentId ? response.data : student);
    applySearch();
    closeEditModal();
    showToast(response.message);
  } catch (error) {
    showToast(error.message, 'danger');
  }
};

const handleStudentAction = async (event) => {
  const actionButton = event.target.closest('[data-action]');

  if (!actionButton) {
    return;
  }

  const studentId = actionButton.dataset.id;
  const selectedStudent = students.find((student) => student.id === studentId);

  if (actionButton.dataset.action === 'edit' && selectedStudent) {
    openEditModal(selectedStudent);
    return;
  }

  if (actionButton.dataset.action === 'delete') {
    const shouldDelete = window.confirm(`Delete ${selectedStudent?.name || 'this student'}?`);

    if (!shouldDelete) {
      return;
    }

    try {
      const response = await studentApi.deleteStudent(studentId);
      students = students.filter((student) => student.id !== studentId);
      applySearch();
      showToast(response.message);
    } catch (error) {
      showToast(error.message, 'danger');
    }
  }
};

export const initDashboard = () => {
  if (!studentForm) {
    return;
  }

  studentForm.addEventListener('submit', handleCreateStudent);
  editStudentForm.addEventListener('submit', handleUpdateStudent);
  studentList.addEventListener('click', handleStudentAction);
  searchInput.addEventListener('input', debounce(applySearch, 180));
  refreshButton.addEventListener('click', loadStudents);

  loadStudents();
};
