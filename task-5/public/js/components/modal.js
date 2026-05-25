const modalElement = document.querySelector('#editStudentModal');
const editForm = document.querySelector('#editStudentForm');
const modalInstance = modalElement ? new bootstrap.Modal(modalElement) : null;

export const openEditModal = (student) => {
  if (!editForm || !modalInstance) {
    return;
  }

  editForm.elements.id.value = student.id;
  editForm.elements.name.value = student.name;
  editForm.elements.email.value = student.email;
  editForm.elements.course.value = student.course;
  editForm.elements.phone.value = student.phone;
  editForm.elements.status.value = student.status;
  editForm.elements.enrollmentDate.value = student.enrollmentDate || '';

  modalInstance.show();
};

export const closeEditModal = () => {
  modalInstance?.hide();
};
