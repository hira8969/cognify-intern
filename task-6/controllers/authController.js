const authService = require('../services/authService');
const { sendSuccess } = require('../utils/apiResponse');

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: Number(process.env.JWT_COOKIE_EXPIRES_DAYS || 7) * 24 * 60 * 60 * 1000
});

const attachTokenCookie = (res, token) => {
  res.cookie('token', token, cookieOptions());
};

const register = async (req, res) => {
  const authPayload = await authService.registerUser(req.body);
  attachTokenCookie(res, authPayload.token);

  return sendSuccess(res, 201, 'Registration successful.', authPayload);
};

const login = async (req, res) => {
  const authPayload = await authService.loginUser(req.body);
  attachTokenCookie(res, authPayload.token);

  return sendSuccess(res, 200, 'Login successful.', authPayload);
};

const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  return sendSuccess(res, 200, 'Logged out successfully.');
};

module.exports = {
  register,
  login,
  logout
};
