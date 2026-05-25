const express = require('express');
const studentController = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/students')
  .get(studentController.getAllStudents)
  .post(studentController.createStudent);

router
  .route('/students/:id')
  .get(studentController.getStudentById)
  .put(studentController.updateStudent)
  .delete(studentController.deleteStudent);

module.exports = router;
