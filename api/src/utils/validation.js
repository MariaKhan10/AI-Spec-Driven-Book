const Joi = require('joi');

/**
 * Validation schemas for different operations
 */

// User registration validation schema
const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),
  software_background: Joi.string()
    .valid('beginner', 'intermediate', 'advanced')
    .optional()
    .default('beginner'),
  hardware_background: Joi.string()
    .valid('low-end', 'mid', 'high')
    .optional()
    .default('low-end')
});

// User login validation schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

// Profile update validation schema
const profileUpdateSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters'
    }),
  software_background: Joi.string()
    .valid('beginner', 'intermediate', 'advanced')
    .optional(),
  hardware_background: Joi.string()
    .valid('low-end', 'mid', 'high')
    .optional()
});

// Chapter personalization validation schema
const personalizationSchema = Joi.object({
  chapterId: Joi.string()
    .required()
    .messages({
      'any.required': 'Chapter ID is required'
    })
});

// Preferences validation schema
const preferencesSchema = Joi.object({
  theme: Joi.string()
    .valid('light', 'dark', 'system')
    .optional()
    .default('light'),
  language: Joi.string()
    .length(2)
    .pattern(/^[a-zA-Z]{2}$/)
    .optional()
    .default('en')
    .messages({
      'string.length': 'Language must be a 2-letter code',
      'string.pattern.base': 'Language must be a 2-letter code'
    })
});

/**
 * Validate request data against schema
 */
const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return { isValid: false, errors };
  }

  return { isValid: true, data: value };
};

/**
 * Validation middleware generator
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { isValid, errors, data } = validate(schema, {
      ...req.body,
      ...req.params,
      ...req.query
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors
      });
    }

    // Attach validated data to request
    req.validatedData = data;
    next();
  };
};

module.exports = {
  registerSchema,
  loginSchema,
  profileUpdateSchema,
  personalizationSchema,
  preferencesSchema,
  validate,
  validateRequest
};