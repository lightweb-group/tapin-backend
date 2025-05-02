import {
  PrismaClient,
  Customer,
  Transaction,
  TransactionType,
} from "@prisma/client";
import ApiError from "../utils/ApiError";
import httpStatus from "../constants/httpStatus";

const prisma = new PrismaClient();

/**
 * Customer service functions that handle business logic and database operations
 */
export interface CheckInData {
  phoneNumber: string;
  merchantId: string;
  name?: string;
}

/**
 * Check in a customer
 * @param data Customer check-in data
 * @returns The created or updated customer and transaction
 */
export const checkInCustomer = async (data: CheckInData) => {
  const { phoneNumber, merchantId, name } = data;

  // Fetch the merchant to ensure it exists and get its pointsPerVisit
  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
  });

  if (!merchant) {
    throw new ApiError("Merchant not found", httpStatus.NOT_FOUND);
  }

  if (!merchant.isActive) {
    throw new ApiError("Merchant is not active", httpStatus.BAD_REQUEST);
  }

  const pointsToAdd = merchant.pointsPerVisit;

  // Check if customer exists
  let customer = await prisma.customer.findUnique({
    where: { phoneNumber },
  });

  // Transaction to ensure data consistency
  const result = await prisma.$transaction(async (tx) => {
    // Create or update customer
    if (!customer) {
      // New customer - create with welcome bonus
      customer = await tx.customer.create({
        data: {
          phoneNumber,
          name: name,
          totalPoints: pointsToAdd + merchant.welcomeBonus,
          merchantId,
          lastCheckIn: new Date(),
        },
      });

      // Create transaction record for welcome bonus if there's a bonus
      if (merchant.welcomeBonus > 0) {
        await tx.transaction.create({
          data: {
            merchantId,
            customerId: customer.id,
            pointsChange: merchant.welcomeBonus,
            activityType: TransactionType.EARN,
            notes: "Welcome bonus",
          },
        });
      }
    } else {
      // Existing customer - update points and check-in time
      customer = await tx.customer.update({
        where: { phoneNumber },
        data: {
          totalPoints: { increment: pointsToAdd },
          lastCheckIn: new Date(),
          // Only update name if it's provided and the existing name is null/empty
          ...(name && !customer.name && { name }),
        },
      });
    }

    // Create transaction record for check-in
    const transaction = await tx.transaction.create({
      data: {
        merchantId,
        customerId: customer.id,
        pointsChange: pointsToAdd,
        activityType: TransactionType.EARN,
        notes: "Check-in points",
      },
    });

    return { customer, transaction };
  });

  return result;
};

/**
 * Get customer by phone number
 * @param phoneNumber Customer phone number
 * @returns The customer or null if not found
 */
export const getCustomerByPhone = async (phoneNumber: string) => {
  const customer = await prisma.customer.findUnique({
    where: { phoneNumber },
    include: {
      transactions: {
        orderBy: { dateTime: "desc" },
        take: 5, // Include the 5 most recent transactions
      },
    },
  });

  if (!customer) {
    throw new ApiError("Customer not found", httpStatus.NOT_FOUND);
  }

  return customer;
};
