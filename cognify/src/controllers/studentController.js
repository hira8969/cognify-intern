const studentModel = require('../models/studentModel');

const courses = [
  'Full Stack Web Development',
  'Frontend Development',
  'Backend Development',
  'MERN Stack Development',
  'UI/UX Design Basics',
  'Data Science Fundamentals'
];

const showRegistrationForm = (req, res) => {
  res.render('index', {
    title: 'Student Registration',
    courses,
    errors: {},
    oldData: {}
  });
};

const registerStudent = (req, res) => {
  const student = studentModel.create(req.body);
  res.redirect(`/success/${student.id}`);
};

const showSuccessPage = (req, res) => {
  const student = studentModel.findAll().find((user) => user.id === req.params.id);

  if (!student) {
    return res.redirect('/dashboard');
  }

  res.render('success', {
    title: 'Registration Successful',
    student
  });
};

const showDashboard = (req, res) => {
  const search = (req.query.search || '').trim().toLowerCase();
  const students = studentModel.findAll();
  const filteredStudents = search
    ? students.filter((student) => {
        return (
          student.fullName.toLowerCase().includes(search) ||
          student.email.toLowerCase().includes(search) ||
          student.course.toLowerCase().includes(search)
        );
      })
    : students;

  res.render('dashboard', {
    title: 'Student Dashboard',
    students: filteredStudents,
    totalStudents: students.length,
    search
  });
};

const deleteStudent = (req, res) => {
  studentModel.remove(req.params.id);
  res.redirect('/dashboard');
};

const setCourses = (req, res, next) => {
  res.locals.courses = courses;
  next();
};

module.exports = {
  deleteStudent,
  setCourses,
  showDashboard,
  showRegistrationForm,
  showSuccessPage,
  registerStudent
};
