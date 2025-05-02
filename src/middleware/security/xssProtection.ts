import { Request, Response, NextFunction } from "express";

/**
 * Sanitizes a value to prevent XSS attacks
 * @param value Value to sanitize
 * @returns Sanitized value
 */
const sanitizeValue = (value: any): any => {
  if (typeof value !== "string") {
    return value;
  }

  // Replace HTML special characters with HTML entities
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

/**
 * Recursively sanitizes an object to prevent XSS attacks
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
const sanitizeRecursive = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "string") {
    return sanitizeValue(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeRecursive(item));
  }

  if (typeof obj === "object") {
    const sanitized: any = {};

    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeRecursive(value);
    }

    return sanitized;
  }

  return obj;
};

/**
 * Middleware to prevent XSS attacks by sanitizing request data
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export const xssProtection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Sanitize request body, query parameters, and URL parameters
  if (req.body) {
    req.body = sanitizeRecursive(req.body);
  }

  if (req.query) {
    req.query = sanitizeRecursive(req.query);
  }

  if (req.params) {
    req.params = sanitizeRecursive(req.params);
  }

  next();
};

/**
 * Add a Content-Security-Policy header to prevent XSS attacks
 */
export const contentSecurityPolicy = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Only apply this middleware if CSP is enabled
  if (process.env.CSP_ENABLED !== "true") {
    return next();
  }

  // Define the CSP policy
  const policy = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "frame-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "block-all-mixed-content",
  ].join("; ");

  // Add the CSP header
  res.setHeader("Content-Security-Policy", policy);

  next();
};
