import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../../utils/ApiResponse";

/**
 * Validates request content types to prevent malicious files and unsupported formats
 */
export const validateContentType = (
  allowedTypes: string[] = ["application/json"]
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip empty bodies or GET/DELETE requests
    if (
      !req.body ||
      Object.keys(req.body).length === 0 ||
      ["GET", "DELETE"].includes(req.method)
    ) {
      return next();
    }

    const contentType = req.headers["content-type"];

    // Check if content type is specified
    if (!contentType) {
      return res
        .status(415)
        .json(errorResponse("Content-Type header is required", null));
    }

    // Check if the content type is allowed
    const isAllowed = allowedTypes.some((type) => contentType.includes(type));

    if (!isAllowed) {
      return res
        .status(415)
        .json(
          errorResponse(
            `Unsupported Content-Type. Allowed types: ${allowedTypes.join(
              ", "
            )}`,
            null
          )
        );
    }

    next();
  };
};

/**
 * Validates request body size to prevent DoS attacks
 */
export const validateBodySize = (maxSize: number = 100 * 1024) => {
  // Default 100KB
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip empty bodies or GET/DELETE requests
    if (
      !req.body ||
      Object.keys(req.body).length === 0 ||
      ["GET", "DELETE"].includes(req.method)
    ) {
      return next();
    }

    // Calculate body size
    const bodySize = Buffer.byteLength(JSON.stringify(req.body), "utf8");

    if (bodySize > maxSize) {
      return res
        .status(413)
        .json(
          errorResponse(
            `Request body too large (${bodySize} bytes). Maximum size is ${maxSize} bytes.`,
            null
          )
        );
    }

    next();
  };
};
