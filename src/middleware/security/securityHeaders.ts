import { Request, Response, NextFunction } from "express";

/**
 * Sets additional security headers beyond what helmet provides
 * These headers help protect against various attacks
 */
export const addSecurityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Prevent browsers from MIME-sniffing a response away from the declared content-type
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking attacks
  res.setHeader("X-Frame-Options", "DENY");

  // Strict Transport Security - forces HTTPS
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Prevent XSS attacks
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Control what information is leaked in the referrer header
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Control which features and APIs can be used in the browser
  res.setHeader(
    "Feature-Policy",
    "camera 'none'; microphone 'none'; geolocation 'none'"
  );

  // Disable caching for authenticated responses
  if (req.headers.authorization) {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
  }

  next();
};
