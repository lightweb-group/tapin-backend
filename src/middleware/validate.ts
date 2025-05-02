import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import ApiError from "../utils/ApiError";
import httpStatus from "../constants/httpStatus";

/**
 * Validates request data against a Zod schema
 * @param schema The Zod schema to validate against
 * @returns A middleware function that validates the request
 */
const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request data against schema
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Create a formatted error object from Zod validation errors
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        next(new ApiError("Validation failed", httpStatus.BAD_REQUEST, true));
      } else {
        next(error);
      }
    }
  };

export default validate;
