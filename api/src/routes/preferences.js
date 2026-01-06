const express = require('express');
const router = express.Router();
const UserPreferences = require('../models/UserPreferences');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, preferencesSchema } = require('../utils/validation');
const { sendResponse, successResponse, errorResponse } = require('../utils/response');

// Get user preferences - GET /api/personalize/preferences
router.get('/preferences', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const preferences = await UserPreferences.findByUserId(user.id);

    if (!preferences) {
      // Return default preferences if none exist
      const responseObj = successResponse(
        {
          theme: 'light',
          language: 'en'
        },
        'Default preferences returned'
      );
      sendResponse(res, responseObj);
      return;
    }

    const responseObj = successResponse(
      preferences,
      'Preferences retrieved successfully'
    );
    sendResponse(res, responseObj);
  } catch (error) {
    const responseObj = errorResponse(
      'PREFERENCES_FETCH_ERROR',
      error.message,
      500
    );
    sendResponse(res, responseObj);
  }
});

// Update user preferences - PUT /api/personalize/preferences
router.put('/preferences', authenticateToken, validateRequest(preferencesSchema), async (req, res) => {
  try {
    const user = req.user;
    const { theme, language } = req.validatedData;

    const preferences = await UserPreferences.upsert(user.id, {
      theme,
      language
    });

    const responseObj = successResponse(
      preferences,
      'Preferences updated successfully'
    );
    sendResponse(res, responseObj);
  } catch (error) {
    const responseObj = errorResponse(
      'PREFERENCES_UPDATE_ERROR',
      error.message,
      500
    );
    sendResponse(res, responseObj);
  }
});

// Get specific preference - GET /api/personalize/preferences/:key
router.get('/preferences/:key', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { key } = req.params;

    const preferences = await UserPreferences.findByUserId(user.id);

    if (!preferences) {
      const responseObj = successResponse(
        { [key]: key === 'theme' ? 'light' : key === 'language' ? 'en' : null },
        'Default value returned'
      );
      sendResponse(res, responseObj);
      return;
    }

    const responseObj = successResponse(
      { [key]: preferences[key] },
      'Preference retrieved successfully'
    );
    sendResponse(res, responseObj);
  } catch (error) {
    const responseObj = errorResponse(
      'PREFERENCE_FETCH_ERROR',
      error.message,
      500
    );
    sendResponse(res, responseObj);
  }
});

module.exports = router;