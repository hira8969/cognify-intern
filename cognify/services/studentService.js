const Student = require('../models/Student');
const { AppError } = require('../middleware/errorMiddleware');
const { emailPattern, namePattern, phonePattern } = require('../utils/validators');

const sanitizeStudentPayload = (payload) => ({
  fullName: String(payload.fullName || '').trim(),
  email: String(payload.email || '').trim().toLowerCase(),
  phone: String(payload.phone || '').replace(/\D/g, '').slice(0, 10),
  age: Number(payload.age),
  gender: String(payload.gender || '').trim(),
  course: String(payload.course || '').trim(),
  address: String(payload.address || '').trim()
});

const validateStudentPayload = (student) => {
  const errors = {};

  if (!student.fullName || student.fullName.length < 3 || !namePattern.test(student.fullName)) {
    errors.fullName = 'Full name must be at least 3 letters and cannot contain numbers.';
  }

  if (!emailPattern.test(student.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!phonePattern.test(student.phone)) {
    errors.phone = 'Phone number must contain exactly 10 digits.';
  }

  if (!Number.isFinite(student.age) || student.age < 18 || student.age > 60) {
    errors.age = 'Age must be between 18 and 60.';
  }

  if (!student.gender) {
    errors.gender = 'Please select a gender.';
  }

  if (!student.course) {
    errors.course = 'Please choose a course.';
  }

  if (!student.address || student.address.length < 10) {
    errors.address = 'Address must be at least 10 characters.';
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError('Validation failed', 422, errors);
  }
};

const getStudents = async ({ userId, search = '' }) => {
  const query = { createdBy: userId };
  const normalizedSearch = search.trim();

  if (normalizedSearch) {
    query.$or = [
      { fullName: new RegExp(normalizedSearch, 'i') },
      { email: new RegExp(normalizedSearch, 'i') },
      { phone: new RegExp(normalizedSearch, 'i') },
      { course: new RegExp(normalizedSearch, 'i') }
    ];
  }

  return Student.find(query).sort({ updatedAt: -1 });
};

const getStudentById = async ({ id, userId }) => {
  const student = await Student.findOne({ _id: id, createdBy: userId });

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  return student;
};

const createStudent = async ({ payload, userId }) => {
  const studentData = sanitizeStudentPayload(payload);
  validateStudentPayload(studentData);

  const existingStudent = await Student.findOne({ email: studentData.email, createdBy: userId });
  if (existingStudent) {
    throw new AppError('This email is already registered.', 409, { email: 'This email is already registered.' });
  }

  return Student.create({
    ...studentData,
    createdBy: userId
  });
};

const updateStudent = async ({ id, payload, userId }) => {
  await getStudentById({ id, userId });
  const studentData = sanitizeStudentPayload(payload);
  validateStudentPayload(studentData);

  const duplicateStudent = await Student.findOne({
    _id: { $ne: id },
    email: studentData.email,
    createdBy: userId
  });

  if (duplicateStudent) {
    throw new AppError('This email is already registered.', 409, { email: 'This email is already registered.' });
  }

  return Student.findOneAndUpdate(
    { _id: id, createdBy: userId },
    studentData,
    { new: true, runValidators: true }
  );
};

const deleteStudent = async ({ id, userId }) => {
  const student = await Student.findOneAndDelete({ _id: id, createdBy: userId });

  if (!student) {
    throw new AppError('Student not found', 404);
  }
};

module.exports = {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent
};
