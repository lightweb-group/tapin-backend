import { Request } from "express";

// Interface for pagination options
export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

// Interface for pagination result
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Parse pagination parameters from request query
 * @param req Express request
 * @param defaultLimit Default number of items per page
 * @returns Pagination options
 */
export const getPaginationOptions = (
  req: Request,
  defaultLimit = 10
): PaginationOptions => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(
    1,
    Math.min(100, parseInt(req.query.limit as string) || defaultLimit)
  );
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

/**
 * Create a paginated response from data and count
 * @param data Array of data items
 * @param total Total count of items
 * @param options Pagination options
 * @returns Paginated result
 */
export const paginateResponse = <T>(
  data: T[],
  total: number,
  options: PaginationOptions
): PaginatedResult<T> => {
  const { page, limit } = options;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}; 