const { body, param } = require('express-validator');
const { strongPasswordRegex } = require('../utils/validators');

const registerValidationRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2 to 80 characters.'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Enter a valid email address.'),
  body('password')
    .matches(strongPasswordRegex)
    .withMessage('Password must include uppercase, lowercase, number, special character and 8 characters.'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match.');
    }

    return true;
  })
];

const loginValidationRules = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Enter a valid email address.'),
  body('password').notEmpty().withMessage('Password is required.')
];

const studentValidationRules = [
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Student name must be 2 to 100 characters.'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Enter a valid student email.'),
  body('phone').trim().isLength({ min: 7, max: 20 }).withMessage('Phone number must be 7 to 20 characters.'),
  body('course').trim().isLength({ min: 2, max: 80 }).withMessage('Course must be 2 to 80 characters.'),
  body('enrollmentNumber').trim().isLength({ min: 3, max: 30 }).withMessage('Enrollment number must be 3 to 30 characters.'),
  body('status').optional().isIn(['active', 'pending', 'graduated', 'blocked']).withMessage('Invalid student status.'),
  body('grade').optional().isIn(['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'NA']).withMessage('Invalid grade.')
];

const mongoIdParamValidationRules = [
  param('id').isMongoId().withMessage('Invalid student id.')
];

module.exports = {
  registerValidationRules,
  loginValidationRules,
  studentValidationRules,
  mongoIdParamValidationRules
};
