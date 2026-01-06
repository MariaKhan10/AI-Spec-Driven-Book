/**
 * Utility functions for standardizing API responses
 */

/**
 * Success response
 */
const successResponse = (data = null, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    message,
    data,
    statusCode
  };
};

/**
 * Error response
 */
const errorResponse = (error = 'An error occurred', message = null, statusCode = 400) => {
  return {
    success: false,
    error,
    message: message || error,
    statusCode
  };
};

/**
 * Validation error response
 */
const validationErrorResponse = (errors, message = 'Validation failed') => {
  return {
    success: false,
    error: 'VALIDATION_ERROR',
    message,
    errors,
    statusCode: 400
  };
};

/**
 * Send JSON response helper
 */
const sendResponse = (res, responseObj) => {
  return res.status(responseObj.statusCode).json({
    success: responseObj.success,
    ...(responseObj.message && { message: responseObj.message }),
    ...(responseObj.error && { error: responseObj.error }),
    ...(responseObj.data !== undefined && { data: responseObj.data }),
    ...(responseObj.errors && { errors: responseObj.errors }),
  });
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  sendResponse
};