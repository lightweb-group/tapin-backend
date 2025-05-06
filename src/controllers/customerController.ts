import { Request, Response } from "express";
import {
  checkInCustomer,
  getCustomerByPhone,
  updateCustomer as updateCustomerService,
  deleteCustomer as deleteCustomerService,
} from "../services/customerService";
import asyncWrapper from "../utils/asyncWrapper";
import { successResponse } from "../utils/ApiResponse";
import httpStatus from "../constants/httpStatus";

/**
 * Handle customer check-in
 */
export const checkIn = asyncWrapper(async (req: Request, res: Response) => {
  const { phoneNumber, merchantId, name } = req.body;

  const result = await checkInCustomer({ phoneNumber, merchantId, name });

  res
    .status(httpStatus.OK)
    .json(successResponse(result, "Customer checked in successfully"));
});

/**
 * Get customer by phone number
 */
export const getCustomer = asyncWrapper(async (req: Request, res: Response) => {
  const { phoneNumber } = req.params;

  const customer = await getCustomerByPhone(phoneNumber);

  res
    .status(httpStatus.OK)
    .json(successResponse(customer, "Customer retrieved successfully"));
});

/**
 * Update customer information
 */
export const updateCustomer = asyncWrapper(
  async (req: Request, res: Response) => {
    const { phoneNumber } = req.params;
    const updateData = req.body;

    await updateCustomerService(phoneNumber, updateData);

    res
      .status(httpStatus.OK)
      .json(successResponse(null, "Customer updated successfully"));
  }
);

/**
 * Delete a customer (soft delete)
 */
export const deleteCustomer = asyncWrapper(
  async (req: Request, res: Response) => {
    const { phoneNumber } = req.params;

    await deleteCustomerService(phoneNumber);

    return res
      .status(200)
      .json(successResponse(null, "Customer deleted successfully"));
  }
);
