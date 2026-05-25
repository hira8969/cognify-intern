const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3051;

// Temporary in-memory storage. Data resets when the server restarts.
const users = [];

const courses = [
  'Full Stack Web Development',
  'Frontend Development',
  'Backend Development',
  'Data Science',
  'UI/UX Design',
  'Cloud Computing',
  'Cyber Security'
];

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function validateStudent(data) {
  const formData = {
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    course: '',
    password: '',
    confirmPassword: '',
    address: '',
    terms: '',
    ...data
  };

  const errors = {};
  const fullName = formData.fullName.trim();
  const email = formData.email.trim().toLowerCase();
  const phone = formData.phone.trim();
  const address = formData.address.trim();
  const age = Number(formData.age);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  if (!fullName) {
    errors.fullName = 'Full name is required.';
  } else if (fullName.length < 3) {
    errors.fullName = 'Full name must be at least 3 characters.';
  }

  if (!email) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address.';
  } else if (users.some((user) => user.email === email)) {
    errors.email = 'This email is already registered.';
  }

  if (!phone) {
    errors.phone = 'Phone number is required.';
  } else if (!phoneRegex.test(phone)) {
    errors.phone = 'Phone number must contain exactly 10 digits.';
  }

  if (!formData.age) {
    errors.age = 'Age is required.';
  } else if (!Number.isInteger(age) || age < 10 || age > 100) {
    errors.age = 'Age must be a valid number between 10 and 100.';
  }

  if (!formData.gender) {
    errors.gender = 'Please select your gender.';
  }

  if (!formData.course) {
    errors.course = 'Please select a course.';
  } else if (!courses.includes(formData.course)) {
    errors.course = 'Please select a valid course.';
  }

  if (!formData.password) {
    errors.password = 'Password is required.';
  } else if (!passwordRegex.test(formData.password)) {
    errors.password = 'Password must include uppercase, lowercase, number, special character, and 8+ characters.';
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!address) {
    errors.address = 'Address is required.';
  } else if (address.length < 10) {
    errors.address = 'Address must be at least 10 characters.';
  }

  if (formData.terms !== 'on' && formData.terms !== true) {
    errors.terms = 'You must accept the terms and conditions.';
  }

  return {
    errors,
    student: {
      id: Date.now().toString(),
      fullName,
      email,
      phone,
      age,
      gender: formData.gender,
      course: formData.course,
      address,
      registeredAt: new Date()
    }
  };
}

function sendHtml(res, fileName) {
  res.sendFile(path.join(__dirname, 'views', fileName));
}

app.get('/', (req, res) => sendHtml(res, 'index.html'));
app.get('/index.html', (req, res) => sendHtml(res, 'index.html'));
app.get('/dashboard', (req, res) => sendHtml(res, 'dashboard.html'));
app.get('/dashboard.html', (req, res) => sendHtml(res, 'dashboard.html'));
app.get('/success', (req, res) => sendHtml(res, 'success.html'));
app.get('/success.html', (req, res) => sendHtml(res, 'success.html'));

app.post('/api/register', (req, res) => {
  const { errors, student } = validateStudent(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // Password is validated but never stored.
  users.push(student);
  return res.status(201).json({
    success: true,
    message: 'Student registered successfully.',
    student
  });
});

app.get('/api/users', (req, res) => {
  const search = (req.query.search || '').trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    return (
      user.fullName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.course.toLowerCase().includes(search)
    );
  });

  res.json({
    totalUsers: users.length,
    users: filteredUsers
  });
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find((student) => student.id === req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Student not found.' });
  }

  return res.json({ success: true, user });
});

app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex((user) => user.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Student not found.' });
  }

  users.splice(index, 1);
  return res.json({ success: true, message: 'Student deleted successfully.' });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server. Please try again later.'
  });
});

const server = app.listen(PORT, () => {
  console.log(`Advanced Student Registration System running at http://localhost:${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Run with another port, for example: $env:PORT=3052; npm start`);
    process.exit(1);
  }

  throw error;
});
