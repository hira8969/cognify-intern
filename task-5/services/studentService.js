const fs = require('fs/promises');
const config = require('../config/config');
const Student = require('../models/studentModel');
const AppError = require('../utils/AppError');

const allowedStatuses = ['Active', 'Inactive'];

const readStudents = async () => {
  const fileContent = await fs.readFile(config.studentsDataPath, 'utf8');
  return JSON.parse(fileContent || '[]');
};

const writeStudents = async (students) => {
  await fs.writeFile(config.studentsDataPath, JSON.stringify(students, null, 2));
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateStudentPayload = (payload, options = { partial: false }) => {
  const errors = {};
  const requiredFields = ['name', 'email', 'course', 'phone'];

  requiredFields.forEach((field) => {
    if (!options.partial && !payload[field]) {
      errors[field] = `${field} is required`;
    }
  });

  if (payload.name !== undefined && payload.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (payload.email !== undefined && !isValidEmail(payload.email.trim())) {
    errors.email = 'Please provide a valid email address';
  }

  if (payload.course !== undefined && payload.course.trim().length < 2) {
    errors.course = 'Course must be at least 2 characters';
  }

  if (payload.phone !== undefined && !/^[0-9+\-\s]{7,15}$/.test(payload.phone.trim())) {
    errors.phone = 'Phone number must be 7 to 15 digits or valid phone characters';
  }

  if (payload.status !== undefined && !allowedStatuses.includes(payload.status)) {
    errors.status = 'Status must be Active or Inactive';
  }

  if (payload.enrollmentDate !== undefined && Number.isNaN(Date.parse(payload.enrollmentDate))) {
    errors.enrollmentDate = 'Enrollment date must be a valid date';
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError('Validation failed', 400, errors);
  }
};

const getAllStudents = async () => {
  const students = await readStudents();
  return students.sort((firstStudent, secondStudent) => {
    return new Date(secondStudent.createdAt) - new Date(firstStudent.createdAt);
  });
};

const getStudentById = async (studentId) => {
  const students = await readStudents();
  const student = students.find((currentStudent) => currentStudent.id === studentId);

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  return student;
};

const createStudent = async (payload) => {
  validateStudentPayload(payload);

  const students = await readStudents();
  const isEmailTaken = students.some((student) => student.email === payload.email.trim().toLowerCase());

  if (isEmailTaken) {
    throw new AppError('Email already exists', 409, { email: 'A student with this email already exists' });
  }

  const student = new Student(payload);
  students.push(student);
  await writeStudents(students);

  return student;
};

const updateStudent = async (studentId, payload) => {
  validateStudentPayload(payload, { partial: true });

  const students = await readStudents();
  const studentIndex = students.findIndex((student) => student.id === studentId);

  if (studentIndex === -1) {
    throw new AppError('Student not found', 404);
  }

  const normalizedEmail = payload.email ? payload.email.trim().toLowerCase() : students[studentIndex].email;
  const isEmailTaken = students.some((student) => {
    return student.id !== studentId && student.email === normalizedEmail;
  });

  if (isEmailTaken) {
    throw new AppError('Email already exists', 409, { email: 'A student with this email already exists' });
  }

  const updatedStudent = {
    ...students[studentIndex],
    ...payload,
    name: payload.name ? payload.name.trim() : students[studentIndex].name,
    email: normalizedEmail,
    course: payload.course ? payload.course.trim() : students[studentIndex].course,
    phone: payload.phone ? payload.phone.trim() : students[studentIndex].phone,
    updatedAt: new Date().toISOString()
  };

  students[studentIndex] = updatedStudent;
  await writeStudents(students);

  return updatedStudent;
};

const deleteStudent = async (studentId) => {
  const students = await readStudents();
  const studentExists = students.some((student) => student.id === studentId);

  if (!studentExists) {
    throw new AppError('Student not found', 404);
  }

  const remainingStudents = students.filter((student) => student.id !== studentId);
  await writeStudents(remainingStudents);

  return { id: studentId };
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
