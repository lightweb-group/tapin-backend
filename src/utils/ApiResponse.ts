/**
 * Utilities for standardized API responses
 */

// List of sensitive fields that should never be returned in responses
const SENSITIVE_FIELDS = ["password", "secret", "token", "apiKey", "apiSecret"];

/**
 * Sanitize data to prevent sensitive information leakage
 * @param data Data to sanitize
 * @returns Sanitized data
 */
const sanitizeData = (data: any): any => {
  if (!data) return null;

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  // Handle objects
  if (data && typeof data === "object") {
    const sanitized = { ...data };

    // Remove sensitive fields if they exist
    SENSITIVE_FIELDS.forEach((field) => {
      if (field in sanitized) {
        delete sanitized[field];
      }
    });

    // Handle nested objects
    Object.keys(sanitized).forEach((key) => {
      if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
        sanitized[key] = sanitizeData(sanitized[key]);
      }
    });

    return sanitized;
  }

  return data;
};

/**
 * Create a success response
 * @param data Response data
 * @param message Success message
 * @returns Standard success response object
 */
export const successResponse = (
  data: any = null,
  message: string = "Success"
) => ({
  success: true,
  message,
  data: sanitizeData(data),
});

/**
 * Create an error response
 * @param message Error message
 * @param data Additional error data
 * @returns Standard error response object
 */
export const errorResponse = (message: string = "Error", data: any = null) => ({
  success: false,
  message,
  data: sanitizeData(data),
});

export default {
  successResponse,
  errorResponse,
};
