const express = require('express');
const path = require('path');
const config = require('./config/config');
const studentRoutes = require('./routes/studentRoutes');
const loggerMiddleware = require('./middleware/loggerMiddleware');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(loggerMiddleware);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.use('/api/students', studentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`${config.appName} running at http://localhost:${config.port}`);
});
