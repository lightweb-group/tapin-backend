import { Request, Response, NextFunction } from "express";
import hpp from "hpp";

/**
 * Prevents HTTP Parameter Pollution attacks
 * This middleware protects against attacks where the same parameter is sent multiple times
 * Example: ?sort=asc&sort=desc could lead to unexpected behavior
 */
export const preventParameterPollution = hpp();

/**
 * Limits the size of query parameters to prevent DoS attacks
 */
export const queryParamSizeLimiter = (maxSize: number = 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const queryParamSize = JSON.stringify(req.query).length;

    if (queryParamSize > maxSize) {
      return res.status(400).json({
        success: false,
        message: "Query parameters exceed the size limit",
        data: null,
      });
    }

    next();
  };
};

/**
 * Limits the number of request parameters to prevent DoS attacks
 */
export const requestParamLimiter = (maxParams: number = 100) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let paramCount = 0;

    // Count query parameters
    paramCount += Object.keys(req.query).length;

    // Count body parameters if it's an object
    if (req.body && typeof req.body === "object") {
      paramCount += Object.keys(req.body).length;
    }

    if (paramCount > maxParams) {
      return res.status(400).json({
        success: false,
        message: "Too many request parameters",
        data: null,
      });
    }

    next();
  };
};
