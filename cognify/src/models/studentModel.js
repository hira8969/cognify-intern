const users = [];

const findAll = () => users;

const findByEmail = (email) => {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

const create = (studentData) => {
  const student = {
    id: Date.now().toString(),
    fullName: studentData.fullName.trim(),
    email: studentData.email.trim().toLowerCase(),
    phone: studentData.phone.trim(),
    age: Number(studentData.age),
    gender: studentData.gender,
    course: studentData.course,
    address: studentData.address.trim(),
    registrationTime: new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  };

  users.push(student);
  return student;
};

const remove = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    users.splice(index, 1);
  }
};

module.exports = {
  create,
  findAll,
  findByEmail,
  remove
};
