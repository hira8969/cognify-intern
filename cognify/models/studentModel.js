const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');
const config = require('../config/config');

const ensureStorageFile = async () => {
  await fs.mkdir(path.dirname(config.paths.studentsFile), { recursive: true });

  try {
    await fs.access(config.paths.studentsFile);
  } catch {
    await fs.writeFile(config.paths.studentsFile, '[]', 'utf8');
  }
};

const readStudents = async () => {
  await ensureStorageFile();
  const fileContent = await fs.readFile(config.paths.studentsFile, 'utf8');
  return JSON.parse(fileContent || '[]');
};

const writeStudents = async (students) => {
  await ensureStorageFile();
  await fs.writeFile(config.paths.studentsFile, JSON.stringify(students, null, 2), 'utf8');
};

const findAll = async () => readStudents();

const findById = async (id) => {
  const students = await readStudents();
  return students.find((student) => student.id === id) || null;
};

const findByEmail = async (email) => {
  const students = await readStudents();
  return students.find((student) => student.email.toLowerCase() === email.toLowerCase()) || null;
};

const create = async (studentData) => {
  const students = await readStudents();
  const now = new Date().toISOString();
  const student = {
    id: randomUUID(),
    ...studentData,
    createdAt: now,
    updatedAt: now
  };

  students.unshift(student);
  await writeStudents(students);
  return student;
};

const updateById = async (id, studentData) => {
  const students = await readStudents();
  const studentIndex = students.findIndex((student) => student.id === id);

  if (studentIndex === -1) {
    return null;
  }

  students[studentIndex] = {
    ...students[studentIndex],
    ...studentData,
    id,
    updatedAt: new Date().toISOString()
  };

  await writeStudents(students);
  return students[studentIndex];
};

const deleteById = async (id) => {
  const students = await readStudents();
  const nextStudents = students.filter((student) => student.id !== id);

  if (nextStudents.length === students.length) {
    return false;
  }

  await writeStudents(nextStudents);
  return true;
};

module.exports = {
  create,
  deleteById,
  findAll,
  findByEmail,
  findById,
  updateById
};
