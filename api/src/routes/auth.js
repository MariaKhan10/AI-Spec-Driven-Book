const express = require('express');
const router = express.Router();
const AuthService = require('../services/authService');
const { authenticateToken } = require('../middleware/auth');
const {
  validateRequest,
  registerSchema,
  loginSchema,
  profileUpdateSchema
} = require('../utils/validation');
const { sendResponse, successResponse, errorResponse } = require('../utils/response');

// Registration endpoint - POST /api/auth/register
router.post('/register', validateRequest(registerSchema), async (req, res) => {
  try {
    const { email, password, name, software_background, hardware_background } = req.validatedData;

    const result = await AuthService.register({
      email,
      password,
      name,
      software_background,
      hardware_background
    });

    const responseObj = successResponse(
      { user: result.user, token: result.token, expires_at: result.expires_at },
      'User registered successfully',
      201
    );
    sendResponse(res, responseObj);
  } catch (error) {
    if (error.message === 'Email already exists') {
      const responseObj = errorResponse(
        'EMAIL_EXISTS',
        error.message,
        409
      );
      sendResponse(res, responseObj);
    } else {
      const responseObj = errorResponse(
        'REGISTRATION_ERROR',
        error.message,
        400
      );
      sendResponse(res, responseObj);
    }
  }
});

// Login endpoint - POST /api/auth/login
router.post('/login', validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.validatedData;

    const result = await AuthService.login({
      email,
      password
    });

    const responseObj = successResponse(
      { user: result.user, token: result.token, expires_at: result.expires_at },
      'Login successful'
    );
    sendResponse(res, responseObj);
  } catch (error) {
    const responseObj = errorResponse(
      'INVALID_CREDENTIALS',
      error.message,
      401
    );
    sendResponse(res, responseObj);
  }
});

// Logout endpoint - POST /api/auth/logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    const result = await AuthService.logout(token);

    const responseObj = successResponse(
      result,
      'Logged out successfully'
    );
    sendResponse(res, responseObj);
  } catch (error) {
    const responseObj = errorResponse(
      'LOGOUT_ERROR',
      error.message,
      500
    );
    sendResponse(res, responseObj);
  }
});

// Get current user profile - GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await AuthService.getCurrentUser(req.token);

    const responseObj = successResponse(
      result,
      'User profile retrieved successfully'
    );
    sendResponse(res, responseObj);
  } catch (error) {
    const responseObj = errorResponse(
      'PROFILE_ERROR',
      error.message,
      401
    );
    sendResponse(res, responseObj);
  }
});

// Update user profile - PUT /api/auth/profile
router.put('/profile', authenticateToken, validateRequest(profileUpdateSchema), async (req, res) => {
  try {
    const { name, software_background, hardware_background } = req.validatedData;

    const result = await AuthService.updateProfile(req.user.id, {
      name,
      software_background,
      hardware_background
    });

    const responseObj = successResponse(
      result,
      'Profile updated successfully'
    );
    sendResponse(res, responseObj);
  } catch (error) {
    const responseObj = errorResponse(
      'PROFILE_UPDATE_ERROR',
      error.message,
      400
    );
    sendResponse(res, responseObj);
  }
});

module.exports = router;