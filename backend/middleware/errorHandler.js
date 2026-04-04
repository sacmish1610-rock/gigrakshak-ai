// 🚨 Global Error Handler Middleware
// Catches all errors and returns standardized response

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (err, req, res, next) => {
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Log error
  console.error(`❌ [${new Date().toISOString()}] ${statusCode} - ${message}`);
  console.error("Stack:", err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map(e => e.message);
    message = `Validation failed: ${errors.join(", ")}`;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `❌ ${field} already exists`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "❌ Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "❌ Token expired";
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.message, stack: err.stack })
  });
};

// Async wrapper to catch promises
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler,
  AppError
};
