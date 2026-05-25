const Student = require('../models/Student');

const listStudents = async ({ userId, search = '', status = 'all' }) => {
  const query = { createdBy: userId };

  if (status !== 'all') {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { course: { $regex: search, $options: 'i' } },
      { enrollmentNumber: { $regex: search, $options: 'i' } }
    ];
  }

  const students = await Student.find(query).sort({ createdAt: -1 });
  const stats = await Student.aggregate([
    { $match: { createdBy: userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    students,
    stats: stats.reduce(
      (summary, item) => ({
        ...summary,
        [item._id]: item.count,
        total: summary.total + item.count
      }),
      { total: 0, active: 0, pending: 0, graduated: 0, blocked: 0 }
    )
  };
};

const getStudentById = async ({ studentId, userId }) => {
  const student = await Student.findOne({ _id: studentId, createdBy: userId });

  if (!student) {
    const error = new Error('Student not found.');
    error.statusCode = 404;
    throw error;
  }

  return student;
};

const createStudent = async ({ studentData, userId }) => {
  return Student.create({
    ...studentData,
    createdBy: userId
  });
};

const updateStudent = async ({ studentId, studentData, userId }) => {
  const student = await Student.findOneAndUpdate(
    { _id: studentId, createdBy: userId },
    studentData,
    { new: true, runValidators: true }
  );

  if (!student) {
    const error = new Error('Student not found.');
    error.statusCode = 404;
    throw error;
  }

  return student;
};

const deleteStudent = async ({ studentId, userId }) => {
  const student = await Student.findOneAndDelete({ _id: studentId, createdBy: userId });

  if (!student) {
    const error = new Error('Student not found.');
    error.statusCode = 404;
    throw error;
  }

  return student;
};

module.exports = {
  listStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
