const courses = [
  'Full Stack Web Development',
  'Frontend Development',
  'Backend Development',
  'MERN Stack Development',
  'UI/UX Design Basics',
  'Data Science Fundamentals'
];

const genders = ['Female', 'Male', 'Other', 'Prefer not to say'];

export function createStudentModal({ onSave }) {
  const modalElement = document.createElement('div');
  modalElement.className = 'modal fade';
  modalElement.id = 'studentEditModal';
  modalElement.tabIndex = -1;
  modalElement.setAttribute('aria-labelledby', 'studentEditModalLabel');
  modalElement.setAttribute('aria-hidden', 'true');
  modalElement.innerHTML = `
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content app-modal">
        <form id="studentEditForm">
          <div class="modal-header">
            <div>
              <span class="section-kicker">Edit Student</span>
              <h2 class="modal-title" id="studentEditModalLabel">Update student details</h2>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" name="id">
            <div class="row g-3">
              ${field('fullName', 'Full Name')}
              ${field('email', 'Email Address', 'email')}
              ${field('phone', 'Phone Number', 'tel')}
              ${field('age', 'Age', 'number')}
              ${selectField('gender', 'Gender', genders)}
              ${selectField('course', 'Course Selection', courses)}
              <div class="col-12">
                <label class="modal-label" for="editAddress">Address</label>
                <textarea class="form-control" id="editAddress" name="address" rows="3" required></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-brand" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-brand btn-ripple">
              <i class="fa-solid fa-floppy-disk"></i>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(modalElement);

  const modal = window.bootstrap.Modal.getOrCreateInstance(modalElement);
  const form = modalElement.querySelector('#studentEditForm');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const studentData = Object.fromEntries(formData.entries());
    await onSave(studentData);
    modal.hide();
  });

  const open = (student) => {
    Object.entries(student).forEach(([key, value]) => {
      if (form.elements[key]) {
        form.elements[key].value = value;
      }
    });
    modal.show();
  };

  return { open };
}

function field(name, label, type = 'text') {
  return `
    <div class="col-md-6">
      <label class="modal-label" for="edit-${name}">${label}</label>
      <input class="form-control" id="edit-${name}" type="${type}" name="${name}" required>
    </div>
  `;
}

function selectField(name, label, options) {
  return `
    <div class="col-md-6">
      <label class="modal-label" for="edit-${name}">${label}</label>
      <select class="form-select" id="edit-${name}" name="${name}" required>
        ${options.map((option) => `<option value="${option}">${option}</option>`).join('')}
      </select>
    </div>
  `;
}
