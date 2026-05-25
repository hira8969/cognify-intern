const studentService = require('../services/studentService');
const { sendSuccess } = require('../utils/responseHandler');

const getStudents = async (req, res, next) => {
  try {
    const students = await studentService.getAllStudents();
    return sendSuccess(res, 200, 'Students fetched successfully', students, {
      total: students.length
    });
  } catch (error) {
    return next(error);
  }
};

const getStudent = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    return sendSuccess(res, 200, 'Student fetched successfully', student);
  } catch (error) {
    return next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const student = await studentService.createStudent(req.body);
    return sendSuccess(res, 201, 'Student created successfully', student);
  } catch (error) {
    return next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const student = await studentService.updateStudent(req.params.id, req.body);
    return sendSuccess(res, 200, 'Student updated successfully', student);
  } catch (error) {
    return next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const deletedStudent = await studentService.deleteStudent(req.params.id);
    return sendSuccess(res, 200, 'Student deleted successfully', deletedStudent);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
};
