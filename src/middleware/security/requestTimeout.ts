import { Request, Response, NextFunction } from "express";

/**
 * Enforces a timeout for long-running requests
 * Prevents DoS attacks where attackers make requests that consume server resources for extended periods
 *
 * @param timeout Timeout in milliseconds
 */
export const requestTimeout = (timeout: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Set a timeout for the request
    const timeoutId = setTimeout(() => {
      // If the response has already been sent, this will be a no-op
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          message: "Request timeout",
          data: null,
        });
      }
    }, timeout);

    // Clear the timeout when the response is sent
    res.on("finish", () => {
      clearTimeout(timeoutId);
    });

    next();
  };
};
