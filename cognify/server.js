require('dotenv').config();

const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const config = require('./config/config');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const requireDatabase = require('./middleware/databaseMiddleware');
const { protect, redirectIfAuthenticated } = require('./middleware/authMiddleware');
const { errorMiddleware, notFoundMiddleware } = require('./middleware/errorMiddleware');
const loggerMiddleware = require('./middleware/loggerMiddleware');

const app = express();

const courses = [
  'Full Stack Web Development',
  'Frontend Development',
  'Backend Development',
  'MERN Stack Development',
  'UI/UX Design Basics',
  'Data Science Fundamentals'
];

app.set('view engine', 'ejs');
app.set('views', config.paths.viewsDir);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(loggerMiddleware);
app.use(express.static(config.paths.publicDir));

app.use((req, res, next) => {
  res.locals.courses = courses;
  res.locals.currentUser = null;
  next();
});

app.get('/', redirectIfAuthenticated, (req, res) => {
  res.render('auth/login', {
    title: 'Login'
  });
});

app.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('auth/login', {
    title: 'Login'
  });
});

app.get('/register', redirectIfAuthenticated, (req, res) => {
  res.render('auth/register', {
    title: 'Create Account'
  });
});

app.get('/dashboard', protect, (req, res) => {
  res.render('dashboard/dashboard', {
    title: 'Secure Dashboard',
    courses,
    user: req.user
  });
});

app.use('/api/auth', requireDatabase, authRoutes);
app.use('/api', requireDatabase, studentRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const startServer = async () => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`${config.appName} is running at http://localhost:${config.port}`);
  });
};

startServer().catch((error) => {
  console.error(`Failed to start server: ${error.message}`);
  process.exit(1);
});
