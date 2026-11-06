/**
 * Application ke expected errors ke liye chhota helper.
 * Isse hum status code aur message ek jagah set kar sakte hain.
 *
 * Example:
 *   throw new ApiError(401, 'Please login first.');
 *   throw ApiError.unauthorized();
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static unauthorized(message = 'Please login first.') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'You are not allowed to do this.') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found.') {
    return new ApiError(404, message);
  }

  static conflict(message) {
    return new ApiError(409, message);
  }
}

export default ApiError;
