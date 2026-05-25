const authService = require('../services/authService');
const { sendSuccess } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    const authResponse = authService.issueAuthResponse(res, user, 'Registration successful');
    sendSuccess(res, {
      statusCode: 201,
      ...authResponse
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body);
    const authResponse = authService.issueAuthResponse(res, user, 'Login successful');
    sendSuccess(res, authResponse);
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  sendSuccess(res, {
    message: 'Logged out successfully',
    data: null
  });
};

const getMe = (req, res) => {
  sendSuccess(res, {
    message: 'Authenticated user fetched successfully',
    data: authService.sanitizeUser(req.user)
  });
};

module.exports = {
  getMe,
  login,
  logout,
  register
};
