const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validationMiddleware');
const { passwordPattern } = require('../utils/validators');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters.'),
    body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
    body('password').matches(passwordPattern).withMessage('Use 8+ characters with uppercase, lowercase, number, and special character.'),
    body('confirmPassword').notEmpty().withMessage('Please confirm your password.')
  ],
  validateRequest,
  authController.register
);

router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required.')
  ],
  validateRequest,
  authController.login
);

router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);

module.exports = router;
