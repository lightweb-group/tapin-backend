import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../../utils/ApiResponse";
import httpStatus from "../../constants/httpStatus";

/**
 * Advanced rate limiter with sliding window algorithm
 * Different endpoints can have different rate limiting rules
 */

/**
 * Creates a customized rate limiter with specified parameters
 * @param name Name of the rate limiter for tracking
 * @param maxRequests Maximum number of requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns Rate limiter middleware
 */
export const createRateLimiter = (
  name: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000
) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: `Too many requests (${name}), please try again later`,
      data: null,
    },
    skipSuccessfulRequests: false,
  });
};

/**
 * General API rate limiter
 * Limits to 100 requests per 15 minutes window per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests, please try again later",
    data: null,
  },
  // Store for tracking limit windows by IP (default: in-memory)
  skipSuccessfulRequests: false, // Count all requests
});

/**
 * Authentication endpoints rate limiter - stricter
 * Limits to 5 requests per minute per IP
 * Use for login, register, and other auth routes
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 login requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many authentication attempts, please try again after a minute",
    data: null,
  },
  skipSuccessfulRequests: false,
});

/**
 * API endpoints that could be expensive to process
 * Limits to 20 requests per minute per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests to this endpoint, please slow down",
    data: null,
  },
  skipSuccessfulRequests: false,
});

/**
 * IP-based dynamic rate limiter
 * Tracks request frequency and can block IPs that show suspicious patterns
 * Increases strictness based on request volume
 */
export const dynamicRateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // This is a simplified version - a real implementation would use
  // a persistent store like Redis to track requests across instances
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  // Get timestamp of current request
  const now = Date.now();

  // Create storage for tracking IPs if it doesn't exist
  if (!global.ipTracker) {
    global.ipTracker = {};
  }

  // Set up tracker for this IP if it doesn't exist
  if (!global.ipTracker[ip]) {
    global.ipTracker[ip] = {
      count: 0,
      firstRequest: now,
      lastRequest: now,
      blocked: false,
      blockUntil: 0,
    };
  }

  const tracker = global.ipTracker[ip];

  // If IP is blocked and block time hasn't expired
  if (tracker.blocked && now < tracker.blockUntil) {
    return res.status(httpStatus.TOO_MANY_REQUESTS).json(
      errorResponse(
        "Your access is temporarily blocked due to suspicious activity",
        {
          retryAfter: Math.ceil((tracker.blockUntil - now) / 1000), // Seconds until unblocked
        }
      )
    );
  }

  // If was blocked but block time expired, unblock
  if (tracker.blocked && now >= tracker.blockUntil) {
    tracker.blocked = false;
  }

  // Calculate time difference between requests
  const timeDiff = now - tracker.lastRequest;

  // If requests are coming too fast (e.g., < 50ms apart repeatedly)
  if (timeDiff < 50 && tracker.count > 10) {
    tracker.blocked = true;
    tracker.blockUntil = now + 5 * 60 * 1000; // Block for 5 minutes
    return res.status(httpStatus.TOO_MANY_REQUESTS).json(
      errorResponse(
        "Suspicious activity detected, access temporarily blocked",
        {
          retryAfter: 300, // 5 minutes in seconds
        }
      )
    );
  }

  // Update tracker
  tracker.count++;
  tracker.lastRequest = now;

  // Reset count periodically (eg. every hour)
  if (now - tracker.firstRequest > 60 * 60 * 1000) {
    tracker.count = 1;
    tracker.firstRequest = now;
  }

  next();
};
