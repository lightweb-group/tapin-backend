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
 * Data for creating a new merchant
 */
export type CreateMerchantData = {
  name: string;
  address?: string;
  phoneNumber?: string;
  pointsPerVisit?: number;
  pointsPerDollar?: number;
  welcomeBonus?: number;
  isActive?: boolean;
};

/**
 * Data for updating a merchant
 */
export type UpdateMerchantData = Partial<{
  name: string;
  address: string;
  phoneNumber: string;
  pointsPerVisit: number;
  pointsPerDollar: number;
  welcomeBonus: number;
  isActive: boolean;
}>;

/**
 * Create a new merchant
 * @param data Merchant data to create
 * @returns The created merchant
 */
export const createMerchant = async (
  data: CreateMerchantData
): Promise<Merchant> => {
  // If phone number is provided, check if it already exists
  if (data.phoneNumber) {
    const existingMerchant = await prisma.merchant.findUnique({
      where: { phoneNumber: data.phoneNumber },
    });

    if (existingMerchant) {
      throw new ApiError(
        "Phone number already exists for another merchant",
        httpStatus.CONFLICT
      );
    }
  }

  // Create merchant
  const merchant = await prisma.merchant.create({
    data: {
      name: data.name,
      address: data.address,
      phoneNumber: data.phoneNumber,
      pointsPerVisit: data.pointsPerVisit || 10, // Default value
      pointsPerDollar: data.pointsPerDollar,
      welcomeBonus: data.welcomeBonus || 0, // Default value
      isActive: data.isActive !== undefined ? data.isActive : true, // Default to true
    },
  });

  return merchant;
};

/**
 * Update a merchant by ID
 * @param id ID of the merchant to update
 * @param data Merchant data to update
 * @returns The updated merchant
 */
export const updateMerchant = async (
  id: string,
  data: UpdateMerchantData
): Promise<Merchant> => {
  // Check if merchant exists
  const merchant = await prisma.merchant.findUnique({
    where: { id },
  });

  if (!merchant) {
    throw new ApiError("Merchant not found", httpStatus.NOT_FOUND);
  }

  // If merchant is deleted
  if (merchant.deletedAt) {
    throw new ApiError(
      "Cannot update deleted merchant",
      httpStatus.BAD_REQUEST
    );
  }

  // If updating phone number, check if the new number already exists
  if (data.phoneNumber && data.phoneNumber !== merchant.phoneNumber) {
    const existingMerchant = await prisma.merchant.findUnique({
      where: { phoneNumber: data.phoneNumber },
    });

    if (existingMerchant) {
      throw new ApiError(
        "Phone number already exists for another merchant",
        httpStatus.CONFLICT
      );
    }
  }

  // Update merchant
  const updatedMerchant = await prisma.merchant.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber }),
      ...(data.pointsPerVisit !== undefined && {
        pointsPerVisit: data.pointsPerVisit,
      }),
      ...(data.pointsPerDollar !== undefined && {
        pointsPerDollar: data.pointsPerDollar,
      }),
      ...(data.welcomeBonus !== undefined && {
        welcomeBonus: data.welcomeBonus,
      }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });

  return updatedMerchant;
};

/**
 * Soft delete a merchant by setting deletedAt timestamp
 * @param id ID of the merchant to delete
 * @returns The deleted merchant
 */
export const deleteMerchant = async (id: string): Promise<Merchant> => {
  // Check if merchant exists
  const merchant = await prisma.merchant.findUnique({
    where: { id },
  });

  if (!merchant) {
    throw new ApiError("Merchant not found", httpStatus.NOT_FOUND);
  }

  // If merchant is already deleted
  if (merchant.deletedAt) {
    throw new ApiError("Merchant already deleted", httpStatus.BAD_REQUEST);
  }

  // Soft delete the merchant by setting deletedAt timestamp
  const deletedMerchant = await prisma.merchant.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false, // Also set to inactive when deleted
    },
  });

  return deletedMerchant;
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
