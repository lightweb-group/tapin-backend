import { Request, Response } from "express";
import {
  checkInCustomer,
  getCustomerByPhone,
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
