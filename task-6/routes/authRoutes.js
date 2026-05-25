const express = require('express');
const authController = require('../controllers/authController');
const { asyncHandler, validateRequest } = require('../middleware/errorMiddleware');
const { loginValidationRules, registerValidationRules } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', registerValidationRules, validateRequest, asyncHandler(authController.register));
router.post('/login', loginValidationRules, validateRequest, asyncHandler(authController.login));
router.post('/logout', asyncHandler(authController.logout));

module.exports = router;
