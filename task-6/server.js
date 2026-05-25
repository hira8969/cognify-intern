const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const ejs = require('ejs');
require('dotenv').config();

const connectDatabase = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const requestLogger = require('./middleware/loggerMiddleware');
const { protect, redirectIfAuthenticated } = require('./middleware/authMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const port = process.env.PORT || 3000;

connectDatabase();

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(requestLogger);

app.get('/', redirectIfAuthenticated, (req, res) => res.redirect('/login'));
app.get('/login', redirectIfAuthenticated, (req, res) => res.render('auth/login', { pageTitle: 'Login' }));
app.get('/register', redirectIfAuthenticated, (req, res) => res.render('auth/register', { pageTitle: 'Create Account' }));
app.get('/dashboard', protect, (req, res) => res.render('dashboard/dashboard', { pageTitle: 'Dashboard' }));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Secure MERN Student Management System running at http://localhost:${port}`);
});
