import { PrismaClient, Merchant, Prisma } from "@prisma/client";
import ApiError from "../utils/ApiError";
import httpStatus from "../constants/httpStatus";
import {
  PaginationOptions,
  paginateResponse,
  PaginatedResult,
} from "../utils/pagination";

const prisma = new PrismaClient();

// Define merchant types using Prisma types with Pick
type MerchantBasicInfo = Pick<
  Merchant,
  | "id"
  | "name"
  | "address"
  | "phoneNumber"
  | "pointsPerVisit"
  | "pointsPerDollar"
  | "welcomeBonus"
  | "isActive"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
>;

/**
 * Filter options for merchant queries
 */
export type MerchantFilterOptions = {
  name?: string;
  phoneNumber?: string;
  isActive?: boolean;
};

/**
 * Get merchant by ID
 * @param id Merchant ID
 * @returns The merchant or throws error if not found
 */
export const getMerchantById = async (id: string): Promise<Merchant> => {
  const merchant = await prisma.merchant.findUnique({
    where: { id },
  });

  if (!merchant) {
    throw new ApiError("Merchant not found", httpStatus.NOT_FOUND);
  }

  // Don't return soft-deleted merchants
  if (merchant.deletedAt) {
    throw new ApiError("Merchant not found", httpStatus.NOT_FOUND);
  }

  return merchant;
};

/**
 * Get merchant by phone number
 * @param phoneNumber Merchant phone number
 * @returns The merchant or throws error if not found
 */
export const getMerchantByPhone = async (
  phoneNumber: string
): Promise<Merchant> => {
  const merchant = await prisma.merchant.findUnique({
    where: { phoneNumber },
  });

  if (!merchant) {
    throw new ApiError("Merchant not found", httpStatus.NOT_FOUND);
  }

  // Don't return soft-deleted merchants
  if (merchant.deletedAt) {
    throw new ApiError("Merchant not found", httpStatus.NOT_FOUND);
  }

  return merchant;
};

/**
 * Get all merchants with filtering, searching, and pagination
 * @param filterOptions Filter options for the query
 * @param paginationOptions Pagination options for the query
 * @returns Paginated array of merchants without relationships
 */
export const getAllMerchants = async (
  filterOptions: MerchantFilterOptions = {},
  paginationOptions: PaginationOptions
): Promise<PaginatedResult<MerchantBasicInfo>> => {
  const { name, phoneNumber, isActive } = filterOptions;
  const { skip, limit } = paginationOptions;

  // Build where clause for filtering
  const whereClause: Prisma.MerchantWhereInput = {
    deletedAt: null, // Don't include soft-deleted records
  };

  // Add name search (partial match, case insensitive)
  if (name) {
    whereClause.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  // Add phone number search (partial match)
  if (phoneNumber) {
    whereClause.phoneNumber = {
      contains: phoneNumber,
    };
  }

  // Add active status filter
  if (isActive !== undefined) {
    whereClause.isActive = isActive;
  }

  // First get the total count for pagination
  const totalMerchants = await prisma.merchant.count({
    where: whereClause,
  });

  // Then get the paginated data
  const merchants = await prisma.merchant.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      address: true,
      phoneNumber: true,
      pointsPerVisit: true,
      pointsPerDollar: true,
      welcomeBonus: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
    skip,
    take: limit,
    orderBy: {
      // Most recently created first
      createdAt: "desc",
    },
  });

  // Return paginated result with properly typed data
  return paginateResponse<MerchantBasicInfo>(
    merchants as MerchantBasicInfo[],
    totalMerchants,
    paginationOptions
  );
};
