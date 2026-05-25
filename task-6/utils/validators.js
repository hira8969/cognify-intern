const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isStrongPassword = (password) => strongPasswordRegex.test(password);

const isEmail = (email) => emailRegex.test(String(email).toLowerCase());

module.exports = {
  strongPasswordRegex,
  isStrongPassword,
  isEmail
};
