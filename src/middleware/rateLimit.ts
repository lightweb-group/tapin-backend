import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import ApiError from "../utils/ApiError";
import httpStatus from "../constants/httpStatus";

/**
 * Standard rate limiter for the API
 * Limits to 100 requests per 15 minutes per IP
 */
export const standardRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Custom handler for rate limit exceeded
  handler: (req: Request, res: Response) => {
    throw new ApiError(
      "Too many requests, please try again later.",
      httpStatus.TOO_MANY_REQUESTS
    );
  },
  // Store for tracking limit windows by IP
  skipSuccessfulRequests: false, // Don't count successful requests
});

/**
 * Stricter rate limiter for sensitive operations
 * Limits to 20 requests per 15 minutes per IP
 */
export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    throw new ApiError(
      "Too many requests for this operation, please try again later.",
      httpStatus.TOO_MANY_REQUESTS
    );
  },
  skipSuccessfulRequests: false,
});
