import mongoose from 'mongoose';
import multer from 'multer';

/**
 * Agar koi route match na ho to ye middleware 404 error banata hai
 * aur use centralized error handler tak bhejta hai.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Saare errors ka ek hi jagah se JSON response.
 * Mongoose, Multer aur JWT ke common errors ko readable message me badalta hai.
 */
const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || error.status || 500;
  let message = error.message || 'Internal server error.';

  // Mongoose validation error (required field missing, invalid value, etc.)
  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(', ');
  }

  // Mongoose cast error (wrong ObjectId format)
  if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${error.path}: ${error.value}`;
  }

  // Duplicate key error (unique email, etc.)
  if (error.code === 11000) {
    statusCode = 409;
    const field = Object.keys(error.keyValue || {})[0] || 'field';
    message = `${field} already exists.`;
  }

  // Multer upload errors (file too large, wrong field, etc.)
  if (error instanceof multer.MulterError) {
    statusCode = 400;

    if (error.code === 'LIMIT_FILE_SIZE') {
      message = 'Image is too large. Maximum allowed size is 5 MB.';
    } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Too many files or wrong field name.';
    }
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please login again.';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please login again.';
  }

  // Unexpected errors ka poora detail sirf server console me.
  if (statusCode >= 500) {
    console.error(error);
  }

  const body = {
    success: false,
    message,
  };

  // Development me 500 errors ka stack bhi bhejte hain (debugging ke liye).
  if (process.env.NODE_ENV === 'development' && statusCode >= 500) {
    body.stack = error.stack;
  }

  res.status(statusCode).json(body);
};

export { notFound, errorHandler };
