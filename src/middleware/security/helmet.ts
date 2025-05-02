import helmet from "helmet";

/**
 * Helmet helps secure Express apps by setting HTTP response headers
 * It protects against well-known web vulnerabilities
 *
 * It sets headers like:
 * - X-XSS-Protection
 * - X-Content-Type-Options
 * - Strict-Transport-Security
 * - Content-Security-Policy
 * - X-Frame-Options
 * and more
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Required for Swagger UI
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Required for Swagger UI resources
});
