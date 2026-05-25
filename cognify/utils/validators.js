const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[A-Za-z\s.'-]+$/;
const phonePattern = /^\d{10}$/;

module.exports = {
  emailPattern,
  namePattern,
  passwordPattern,
  phonePattern
};
