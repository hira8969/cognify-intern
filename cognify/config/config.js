const path = require('path');

const rootDir = path.resolve(__dirname, '..');

module.exports = {
  appName: 'Secure MERN Student Management System',
  port: process.env.PORT || 3000,
  paths: {
    publicDir: path.join(rootDir, 'public'),
    viewsDir: path.join(rootDir, 'views'),
    studentsFile: path.join(rootDir, 'data', 'students.json')
  }
};
