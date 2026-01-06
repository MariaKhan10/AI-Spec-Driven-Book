/**
 * Error handling middleware
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let error = 'INTERNAL_ERROR';

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
    error = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Access token is invalid or expired';
    error = 'UNAUTHORIZED';
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'File size too large';
    error = 'FILE_SIZE_ERROR';
  } else if (err.code === 'ENOENT') {
    statusCode = 404;
    message = 'Resource not found';
    error = 'NOT_FOUND';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Database connection failed';
    error = 'DATABASE_ERROR';
  }

  // In development, provide more detailed error information
  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      success: false,
      error,
      message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });
  } else {
    // In production, don't expose stack traces
    res.status(statusCode).json({
      success: false,
      error,
      message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = errorHandler;