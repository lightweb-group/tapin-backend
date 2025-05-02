import { Request, Response, NextFunction } from "express";
import csurf from "csurf";
import { errorResponse } from "../../utils/ApiResponse";

/**
 * CSRF protection using the csurf library
 * Protects against Cross-Site Request Forgery attacks
 */
export const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
});

/**
 * Middleware to handle CSRF errors
 */
export const handleCsrfError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.code === "EBADCSRFTOKEN") {
    // CSRF token validation failed
    return res
      .status(403)
      .json(errorResponse("CSRF token validation failed", null));
  }

  // Pass other errors to the next middleware
  next(err);
};

/**
 * Helper middleware to exclude certain paths from CSRF protection
 * (like API endpoints that are meant to be called from other systems)
 */
export const csrfProtectionWithExclusions = (excludePaths: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip CSRF protection for excluded paths
    if (excludePaths.some((path) => req.path.includes(path))) {
      next();
    } else {
      csrfProtection(req, res, next);
    }
  };
};

/**
 * Middleware to provide CSRF token to the client
 */
export const provideCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.csrfToken) {
    res.cookie("XSRF-TOKEN", req.csrfToken(), {
      httpOnly: false, // Client-side JS needs to read this
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
  next();
};
