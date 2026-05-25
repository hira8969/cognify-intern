const studentService = require('../services/studentService');
const { sendSuccess } = require('../utils/apiResponse');

const getStudents = async (req, res) => {
  const studentSummary = await studentService.listStudents({
    userId: req.user._id,
    search: req.query.search,
    status: req.query.status || 'all'
  });

  return sendSuccess(res, 200, 'Students fetched successfully.', studentSummary);
};

const getStudent = async (req, res) => {
  const student = await studentService.getStudentById({
    studentId: req.params.id,
    userId: req.user._id
  });

  return sendSuccess(res, 200, 'Student fetched successfully.', { student });
};

const createStudent = async (req, res) => {
  const student = await studentService.createStudent({
    studentData: req.body,
    userId: req.user._id
  });

  return sendSuccess(res, 201, 'Student created successfully.', { student });
};

const updateStudent = async (req, res) => {
  const student = await studentService.updateStudent({
    studentId: req.params.id,
    studentData: req.body,
    userId: req.user._id
  });

  return sendSuccess(res, 200, 'Student updated successfully.', { student });
};

const deleteStudent = async (req, res) => {
  await studentService.deleteStudent({
    studentId: req.params.id,
    userId: req.user._id
  });

  return sendSuccess(res, 200, 'Student deleted successfully.');
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
};
