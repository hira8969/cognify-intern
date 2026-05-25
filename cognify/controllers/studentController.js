const studentService = require('../services/studentService');
const { sendSuccess } = require('../utils/apiResponse');

const getAllStudents = async (req, res, next) => {
  try {
    const students = await studentService.getStudents({
      userId: req.user._id,
      search: req.query.search || ''
    });
    sendSuccess(res, {
      message: 'Students fetched successfully',
      data: students
    });
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById({
      id: req.params.id,
      userId: req.user._id
    });
    sendSuccess(res, {
      message: 'Student fetched successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const student = await studentService.createStudent({
      payload: req.body,
      userId: req.user._id
    });
    sendSuccess(res, {
      statusCode: 201,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const student = await studentService.updateStudent({
      id: req.params.id,
      payload: req.body,
      userId: req.user._id
    });
    sendSuccess(res, {
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    await studentService.deleteStudent({
      id: req.params.id,
      userId: req.user._id
    });
    sendSuccess(res, {
      message: 'Student deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent
};
