import { Request, Response } from "express";
import {
  checkInCustomer,
  getCustomerByPhone,
  updateCustomer as updateCustomerService,
  deleteCustomer as deleteCustomerService,
  getAllCustomers as getAllCustomersService,
  CustomerFilterOptions,
} from "../services/customerService";
import { getPaginationOptions } from "../utils/pagination";
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

/**
 * Get all customers with filtering, searching, and pagination
 */
export const getAllCustomers = asyncWrapper(
  async (req: Request, res: Response) => {
    // Extract filter parameters from query
    const filterOptions: CustomerFilterOptions = {};

    if (req.query.phoneNumber) {
      filterOptions.phoneNumber = req.query.phoneNumber as string;
    }

    if (req.query.name) {
      filterOptions.name = req.query.name as string;
    }

    if (req.query.totalPointsMin) {
      filterOptions.totalPointsMin = parseInt(
        req.query.totalPointsMin as string
      );
    }

    if (req.query.totalPointsMax) {
      filterOptions.totalPointsMax = parseInt(
        req.query.totalPointsMax as string
      );
    }

    if (req.query.merchantId) {
      filterOptions.merchantId = req.query.merchantId as string;
    }

    // Get pagination options
    const paginationOptions = getPaginationOptions(req);

    // Get customers with filters and pagination
    const result = await getAllCustomersService(
      filterOptions,
      paginationOptions
    );

    return res
      .status(httpStatus.OK)
      .json(successResponse(result, "Customers retrieved successfully"));
  }
);
