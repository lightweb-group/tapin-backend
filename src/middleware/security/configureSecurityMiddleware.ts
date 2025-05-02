import { Express, Request, Response, NextFunction } from "express";
import path from "path";
import * as security from "./index";
import express from "express";
import cookieParser from "cookie-parser";

/**
 * Configure and apply all security middleware to the Express application
 * @param app Express application
 * @param options Configuration options
 */
export const configureSecurityMiddleware = (
  app: Express,
  options: {
    // Define which security features to enable
    enableHelmet?: boolean;
    enableRateLimit?: boolean;
    enableInputSanitizer?: boolean;
    enableSecurityHeaders?: boolean;
    enableParameterProtection?: boolean;
    enableRequestTimeout?: boolean;
    enableCsrf?: boolean;
    enableContentValidation?: boolean;
    enableXssProtection?: boolean;
    enableCsp?: boolean;
    // CSRF exclusion paths
    csrfExcludePaths?: string[];
    // Rate limit settings
    standardRateLimitMax?: number;
    loginRateLimitMax?: number;
    apiRateLimitMax?: number;
  } = {}
) => {
  // Default options
  const config = {
    enableHelmet: true,
    enableRateLimit: true,
    enableInputSanitizer: true,
    enableSecurityHeaders: true,
    enableParameterProtection: true,
    enableRequestTimeout: true,
    enableCsrf: true,
    enableContentValidation: true,
    enableXssProtection: true,
    enableCsp: process.env.CSP_ENABLED === "true",
    csrfExcludePaths: ["/api/v1", "/webhook"],
    standardRateLimitMax: 100,
    loginRateLimitMax: 5,
    apiRateLimitMax: 50,
    ...options,
  };

  // Add cookie parser middleware (required for CSRF)
  app.use(cookieParser());

  // Enable built-in body parsing middleware
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // 1. Helmet for secure HTTP headers
  if (config.enableHelmet) {
    app.use(security.helmetMiddleware);
  }

  // 2. Rate limiting
  if (config.enableRateLimit) {
    // Create IP tracker for more advanced rate limiting
    global.ipTracker = {};

    // Add standard rate limit to all routes
    app.use(
      security.createRateLimiter(
        "standard",
        config.standardRateLimitMax,
        15 * 60 * 1000 // 15 minutes window
      )
    );

    // Advanced rate limiters can be applied to specific routes later
    // Example: app.use('/api/auth/login', security.createRateLimiter('login', 5, 60 * 1000));
  }

  // 3. Input sanitization
  if (config.enableInputSanitizer) {
    app.use(security.sanitizeInputs);
  }

  // 4. Security headers
  if (config.enableSecurityHeaders) {
    app.use(security.addSecurityHeaders);
  }

  // 5. Parameter pollution protection
  if (config.enableParameterProtection) {
    app.use(security.preventParameterPollution);
  }

  // 6. Request timeout
  if (config.enableRequestTimeout) {
    app.use(security.requestTimeout());
  }

  // 7. CSRF protection
  if (config.enableCsrf) {
    app.use(security.csrfProtectionWithExclusions(config.csrfExcludePaths));
    app.use(security.handleCsrfError);
    app.use(security.provideCsrfToken);
  }

  // 8. Content validation
  if (config.enableContentValidation) {
    app.use(security.validateContentType());
    app.use(security.validateBodySize(1024 * 1024)); // 1MB limit
  }

  // 9. XSS Protection
  if (config.enableXssProtection) {
    app.use(security.xssProtection);
  }

  // 10. Content Security Policy
  if (config.enableCsp) {
    app.use(security.contentSecurityPolicy);
  }

  // Return middleware for cleanup (if needed)
  return (req: Request, res: Response, next: NextFunction) => {
    // Any cleanup logic if needed
    next();
  };
};
