const path = require('path');

module.exports = {
  appName: 'Full Stack Student Management System',
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  studentsDataPath: path.join(__dirname, '..', 'data', 'students.json')
};
