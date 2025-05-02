import { Request, Response, NextFunction } from "express";

/**
 * Wraps an async controller function to catch any errors and forward them to the error handler
 * @param fn The async controller function to wrap
 * @returns A function that handles the async execution and error forwarding
 */
const asyncWrapper = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default asyncWrapper;
