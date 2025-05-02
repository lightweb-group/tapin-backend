# Security Measures

This document outlines the security measures implemented in our API to protect against common vulnerabilities and attacks.

## Table of Contents

1. [Secure Headers (Helmet)](#secure-headers-helmet)
2. [Rate Limiting](#rate-limiting)
3. [Input Sanitization](#input-sanitization)
4. [Additional Security Headers](#additional-security-headers)
5. [Parameter Pollution Protection](#parameter-pollution-protection)
6. [Request Timeout](#request-timeout)
7. [CSRF Protection](#csrf-protection)
8. [Content Validation](#content-validation)
9. [XSS Protection](#xss-protection)
10. [Content Security Policy](#content-security-policy)

## Secure Headers (Helmet)

The application uses Helmet.js to set secure HTTP headers that help protect against common web vulnerabilities:

- `X-XSS-Protection`: Prevents reflected XSS attacks.
- `X-Content-Type-Options`: Prevents browsers from MIME-sniffing.
- `X-Frame-Options`: Prevents clickjacking by disallowing iframe embedding.
- `Strict-Transport-Security`: Forces HTTPS connections.
- `X-Download-Options`: Prevents Internet Explorer from executing downloads in site context.
- `X-DNS-Prefetch-Control`: Controls browser DNS prefetching.
- `Referrer-Policy`: Controls what information is sent in the Referer header.

## Rate Limiting

Multiple rate limiting mechanisms are implemented to prevent abuse:

- **Standard Rate Limit**: Applied to all routes. Limits requests per IP address.
- **Login Rate Limit**: Specifically targets authentication endpoints to prevent brute force attacks.
- **API Rate Limit**: Applied to API endpoints to prevent abuse.

Rate limits are configurable through environment variables and are stricter in production environments.

## Input Sanitization

All incoming data is sanitized to prevent injection attacks:

- Request body sanitization
- Query parameter sanitization
- URL parameter sanitization

This helps prevent SQL injection, NoSQL injection, and command injection attacks.

## Additional Security Headers

Additional custom security headers that complement Helmet:

- `X-Permitted-Cross-Domain-Policies`: Controls data loading in Adobe products.
- `X-XSS-Protection`: Additional XSS protection for older browsers.
- `Feature-Policy`: Restricts browser features that can be used by the application.
- `Expect-CT`: Certificate Transparency enforcement.

## Parameter Pollution Protection

Prevents HTTP Parameter Pollution (HPP) attacks by:

- Removing duplicate query parameters
- Enforcing parameter length and count limits
- Validating parameter names

## Request Timeout

Enforces a timeout on all requests to prevent long-running attacks:

- Default timeout of 30 seconds (configurable)
- Returns 408 status code for timed-out requests
- Helps prevent resource exhaustion attacks

## CSRF Protection

Protects against Cross-Site Request Forgery attacks:

- Token-based protection (requires token validation for state-changing requests)
- Secure cookies with appropriate flags
- Customizable exclusion paths for API endpoints
- Error handling for CSRF validation failures

## Content Validation

Validates incoming content to prevent malicious files and input:

- Content-Type validation
- Request body size limits
- Rejection of unexpected or invalid content types

## XSS Protection

Advanced XSS protection beyond headers:

- Recursive sanitization of all input data
- HTML entity encoding for special characters
- Protection for nested objects and arrays

## Content Security Policy

Implements Content Security Policy (CSP) to restrict resources:

- Strict default policies (`default-src 'self'`)
- Limited script and style sources
- Blocking of mixed content
- Frame ancestors restriction
- Base URI restriction

## Implementation

All security features are applied through middleware in a centralized configuration function:

```typescript
// Apply all security middleware
configureSecurityMiddleware(app, {
  csrfExcludePaths: ["/api/v1", "/api-docs", "/health"],
  standardRateLimitMax: process.env.NODE_ENV === "production" ? 100 : 1000,
  // Other options...
});
```

Security options can be configured through environment variables:
