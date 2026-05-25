const express = require('express');
const path = require('path');
const { randomUUID } = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

const courses = [
  'Full Stack Web Development',
  'Data Science',
  'UI/UX Design',
  'Cloud Computing',
  'Cyber Security',
  'Artificial Intelligence'
];

let students = [
  {
    id: 'seed-1',
    fullName: 'Ananya Mehta',
    email: 'ananya.mehta@example.com',
    phone: '9876543210',
    age: '22',
    course: 'Full Stack Web Development',
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-2',
    fullName: 'Rohan Verma',
    email: 'rohan.verma@example.com',
    phone: '9123456780',
    age: '24',
    course: 'Data Science',
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-3',
    fullName: 'Priya Nair',
    email: 'priya.nair@example.com',
    phone: '9988776655',
    age: '27',
    course: 'UI/UX Design',
    status: 'Inactive',
    createdAt: new Date().toISOString()
  }
];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get(['/', '/register', '/dashboard', '/about'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/courses', (req, res) => {
  res.json({ courses });
});

app.get('/api/students', (req, res) => {
  res.json({ students });
});

app.post('/api/students', (req, res) => {
  const student = normalizeStudent(req.body);
  students.push(student);
  res.status(201).json({ student });
});

app.put('/api/students/:id', (req, res) => {
  const studentIndex = students.findIndex((student) => student.id === req.params.id);

  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  students[studentIndex] = {
    ...students[studentIndex],
    ...normalizeStudent(req.body, req.params.id, students[studentIndex].createdAt)
  };

  return res.json({ student: students[studentIndex] });
});

app.delete('/api/students/:id', (req, res) => {
  const initialCount = students.length;
  students = students.filter((student) => student.id !== req.params.id);

  if (students.length === initialCount) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  return res.status(204).send();
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

function normalizeStudent(payload, id = randomUUID(), createdAt = new Date().toISOString()) {
  return {
    id,
    fullName: String(payload.fullName || '').trim(),
    email: String(payload.email || '').trim().toLowerCase(),
    phone: String(payload.phone || '').trim(),
    age: String(payload.age || '').trim(),
    course: String(payload.course || ''),
    status: payload.status === 'Inactive' ? 'Inactive' : 'Active',
    createdAt
  };
}

app.listen(PORT, () => {
  console.log(`Interactive Student Management System running at http://localhost:${PORT}`);
});
