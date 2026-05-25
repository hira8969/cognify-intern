const { v4: uuidv4 } = require('uuid');

class Student {
  constructor({ name, email, course, phone, enrollmentDate, status = 'Active' }) {
    this.id = uuidv4();
    this.name = name.trim();
    this.email = email.trim().toLowerCase();
    this.course = course.trim();
    this.phone = phone.trim();
    this.status = status;
    this.enrollmentDate = enrollmentDate || new Date().toISOString().slice(0, 10);
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Student;
