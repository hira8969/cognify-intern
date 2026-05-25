const express = require('express');
const studentController = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { asyncHandler, validateRequest } = require('../middleware/errorMiddleware');
const { mongoIdParamValidationRules, studentValidationRules } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(asyncHandler(studentController.getStudents))
  .post(authorize('admin', 'manager'), studentValidationRules, validateRequest, asyncHandler(studentController.createStudent));

router
  .route('/:id')
  .get(mongoIdParamValidationRules, validateRequest, asyncHandler(studentController.getStudent))
  .put(
    authorize('admin', 'manager'),
    mongoIdParamValidationRules,
    studentValidationRules,
    validateRequest,
    asyncHandler(studentController.updateStudent)
  )
  .delete(authorize('admin'), mongoIdParamValidationRules, validateRequest, asyncHandler(studentController.deleteStudent));

module.exports = router;
