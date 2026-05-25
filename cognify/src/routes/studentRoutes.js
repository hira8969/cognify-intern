const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');
const validateRegistration = require('../middleware/registrationValidator');

router.use(studentController.setCourses);
router.get('/', studentController.showRegistrationForm);
router.post('/register', validateRegistration, studentController.registerStudent);
router.get('/success/:id', studentController.showSuccessPage);
router.get('/dashboard', studentController.showDashboard);
router.post('/students/:id/delete', studentController.deleteStudent);

module.exports = router;
