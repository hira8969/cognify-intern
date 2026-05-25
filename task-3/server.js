const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const students = [];

const courses = [
  'Full Stack Web Development',
  'Data Science',
  'UI/UX Design',
  'Cloud Computing',
  'Cyber Security',
  'Artificial Intelligence'
];

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

function getInitialFormData() {
  return {
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    course: '',
    password: '',
    confirmPassword: '',
    address: '',
    terms: ''
  };
}

function buildDashboardStats(list) {
  const uniqueCourses = new Set(list.map((student) => student.course)).size;
  const averageAge = list.length
    ? Math.round(list.reduce((sum, student) => sum + student.age, 0) / list.length)
    : 0;

  return {
    total: list.length,
    uniqueCourses,
    averageAge,
    latest: list[0] ? list[list.length - 1].fullName : 'No student yet'
  };
}

function validateRegistration(req, res, next) {
  const formData = {
    ...getInitialFormData(),
    ...req.body
  };

  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  if (!formData.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (formData.fullName.trim().length < 3) {
    errors.fullName = 'Full name must be at least 3 characters.';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(formData.email.trim())) {
    errors.email = 'Enter a valid email address.';
  } else if (students.some((student) => student.email.toLowerCase() === formData.email.trim().toLowerCase())) {
    errors.email = 'This email is already registered.';
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!phoneRegex.test(formData.phone.trim())) {
    errors.phone = 'Phone number must contain exactly 10 digits.';
  }

  const ageNumber = Number(formData.age);
  if (!formData.age) {
    errors.age = 'Age is required.';
  } else if (!Number.isInteger(ageNumber) || ageNumber < 16 || ageNumber > 80) {
    errors.age = 'Age must be between 16 and 80.';
  }

  if (!formData.gender) {
    errors.gender = 'Please select a gender.';
  }

  if (!formData.course) {
    errors.course = 'Please select a course.';
  } else if (!courses.includes(formData.course)) {
    errors.course = 'Please choose a valid course.';
  }

  if (!formData.password) {
    errors.password = 'Password is required.';
  } else if (!passwordRegex.test(formData.password)) {
    errors.password = 'Use 8+ characters with uppercase, lowercase, number, and special character.';
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!formData.address.trim()) {
    errors.address = 'Address is required.';
  } else if (formData.address.trim().length < 10) {
    errors.address = 'Address must be at least 10 characters.';
  }

  if (formData.terms !== 'on') {
    errors.terms = 'You must accept the terms and conditions.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).render('index', {
      title: 'Student Registration',
      activePage: 'home',
      courses,
      errors,
      formData
    });
  }

  req.validatedStudent = {
    id: `${Date.now()}-${Math.round(Math.random() * 1000)}`,
    fullName: formData.fullName.trim(),
    email: formData.email.trim().toLowerCase(),
    phone: formData.phone.trim(),
    age: ageNumber,
    gender: formData.gender,
    course: formData.course,
    address: formData.address.trim(),
    registeredAt: new Date()
  };

  return next();
}

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Student Registration',
    activePage: 'home',
    courses,
    errors: {},
    formData: getInitialFormData()
  });
});

app.post('/register', validateRegistration, (req, res) => {
  students.push(req.validatedStudent);
  res.redirect(`/success?email=${encodeURIComponent(req.validatedStudent.email)}`);
});

app.get('/success', (req, res) => {
  const student = students.find((item) => item.email === req.query.email);

  if (!student) {
    return res.redirect('/dashboard');
  }

  return res.render('success', {
    title: 'Registration Successful',
    activePage: 'success',
    student
  });
});

app.get('/dashboard', (req, res) => {
  const search = (req.query.search || '').trim().toLowerCase();
  const course = req.query.course || '';
  const filteredStudents = students.filter((student) => {
    const matchesSearch = !search
      || student.fullName.toLowerCase().includes(search)
      || student.email.toLowerCase().includes(search)
      || student.course.toLowerCase().includes(search);
    const matchesCourse = !course || student.course === course;

    return matchesSearch && matchesCourse;
  });

  res.render('dashboard', {
    title: 'Student Dashboard',
    activePage: 'dashboard',
    students: filteredStudents,
    stats: buildDashboardStats(students),
    totalStudents: students.length,
    courses,
    selectedCourse: course,
    search
  });
});

app.post('/delete/:id', (req, res) => {
  const studentIndex = students.findIndex((student) => student.id === req.params.id);

  if (studentIndex !== -1) {
    students.splice(studentIndex, 1);
  }

  res.redirect('/dashboard');
});

app.use((req, res) => {
  res.status(404).render('index', {
    title: 'Page Not Found',
    activePage: 'home',
    courses,
    errors: {
      page: 'The page you requested was not found. Please register from the form below.'
    },
    formData: getInitialFormData()
  });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send('Something went wrong on the server. Please try again later.');
});

app.listen(PORT, () => {
  console.log(`Modern Student Management app running at http://localhost:${PORT}`);
});
