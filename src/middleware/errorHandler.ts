import { Request, Response, NextFunction } from "express";
import httpStatus from "../constants/httpStatus";
import ApiError from "../utils/ApiError";
import { errorResponse } from "../utils/ApiResponse";

/**
 * Global error handler middleware
 */
const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errors = null;

  // If it's our ApiError, use its values
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ZodError") {
    // Handle Zod validation errors
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation Error";
    errors = (err as any).errors?.map((e: any) => ({
      path: e.path.join("."),
      message: e.message,
    }));
  } else if (err.name === "PrismaClientKnownRequestError") {
    // Handle Prisma errors
    statusCode = httpStatus.BAD_REQUEST;
    message = "Database Error";
  }

  // Create response with minimal information
  let responseData: any = errors ? { errors } : null;

  // In development, add the stack trace
  if (process.env.NODE_ENV === "development") {
    if (responseData) {
      responseData.stack = err.stack;
    } else {
      responseData = { stack: err.stack };
    }
  }

  res.status(statusCode).json(errorResponse(message, responseData));
};

export default errorHandler;
