const studentModel = require('../models/studentModel');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\d{10}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const validateRegistration = (req, res, next) => {
  const {
    fullName = '',
    email = '',
    phone = '',
    age = '',
    gender = '',
    course = '',
    password = '',
    confirmPassword = '',
    address = '',
    terms
  } = req.body;

  const errors = {};

  if (!fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (fullName.trim().length < 3) {
    errors.fullName = 'Full name must be at least 3 characters.';
  }

  if (!email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!emailPattern.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  } else if (studentModel.findByEmail(email.trim())) {
    errors.email = 'This email is already registered.';
  }

  if (!phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!phonePattern.test(phone.trim())) {
    errors.phone = 'Phone number must contain exactly 10 digits.';
  }

  if (!age) {
    errors.age = 'Age is required.';
  } else if (Number(age) < 18 || Number(age) > 60) {
    errors.age = 'Age must be between 18 and 60.';
  }

  if (!gender) {
    errors.gender = 'Please select a gender.';
  }

  if (!course) {
    errors.course = 'Please choose a course.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (!passwordPattern.test(password)) {
    errors.password = 'Use 8+ characters with uppercase, lowercase, number, and special character.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!address.trim()) {
    errors.address = 'Address is required.';
  } else if (address.trim().length < 10) {
    errors.address = 'Address must be at least 10 characters.';
  }

  if (terms !== 'on') {
    errors.terms = 'You must accept the terms and conditions.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).render('index', {
      title: 'Student Registration',
      courses: res.locals.courses,
      errors,
      oldData: req.body
    });
  }

  next();
};

module.exports = validateRegistration;
