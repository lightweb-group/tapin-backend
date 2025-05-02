import { Request, Response, NextFunction } from "express";

/**
 * Sanitizes request inputs to prevent SQL injection, XSS, etc.
 * This is a defense in depth approach, complementing Prisma's parameterized queries
 */
export const sanitizeInputs = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Function to sanitize a single value
  const sanitizeValue = (value: any): any => {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === "string") {
      // Remove potentially dangerous characters
      return (
        value
          // Remove script tags
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          // Remove HTML tags
          .replace(/<[^>]*>/g, "")
          // Remove SQL injection attempts
          .replace(
            /('(''|[^'])*')|(\)\s*OR\s*)|(\s*OR\s*\()|(\--)/gi,
            (match) => {
              // Allow legitimate single quotes
              if (
                match.startsWith("'") &&
                match.endsWith("'") &&
                !match.includes("OR") &&
                !match.includes("--")
              ) {
                return match;
              }
              return "";
            }
          )
          // Remove other dangerous patterns
          .replace(
            /(\)\s*;\s*)|(\s*;\s*\()|(\s*;\s*[DROP|DELETE|UPDATE|INSERT])/gi,
            ""
          )
      );
    }

    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        return value.map((item) => sanitizeValue(item));
      } else {
        const sanitizedObj: any = {};
        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            sanitizedObj[key] = sanitizeValue(value[key]);
          }
        }
        return sanitizedObj;
      }
    }

    // For numbers, booleans, etc.
    return value;
  };

  // Sanitize body, query, and params
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }

  if (req.query) {
    req.query = sanitizeValue(req.query);
  }

  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  next();
};
