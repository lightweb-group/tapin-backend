/**
 * Custom API Error class for standardized error handling
 */
class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  /**
   * Create a new API error
   * @param message Error message
   * @param statusCode HTTP status code
   * @param isOperational Indicates if this is an operational error (vs programming error)
   */
  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
