import { Request, Response } from "express";
import {
  getMerchantById as getMerchantByIdService,
  getMerchantByPhone as getMerchantByPhoneService,
  getAllMerchants as getAllMerchantsService,
  MerchantFilterOptions,
} from "../services/merchantService";
import { getPaginationOptions } from "../utils/pagination";
import asyncWrapper from "../utils/asyncWrapper";
import { successResponse } from "../utils/ApiResponse";
import httpStatus from "../constants/httpStatus";

/**
 * Get merchant by ID
 */
export const getMerchantById = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const merchant = await getMerchantByIdService(id);

    return res
      .status(httpStatus.OK)
      .json(successResponse(merchant, "Merchant retrieved successfully"));
  }
);

/**
 * Get merchant by phone number
 */
export const getMerchantByPhone = asyncWrapper(
  async (req: Request, res: Response) => {
    const { phoneNumber } = req.params;

    const merchant = await getMerchantByPhoneService(phoneNumber);

    return res
      .status(httpStatus.OK)
      .json(successResponse(merchant, "Merchant retrieved successfully"));
  }
);

/**
 * Get all merchants with filtering, searching, and pagination
 */
export const getAllMerchants = asyncWrapper(
  async (req: Request, res: Response) => {
    // Extract filter parameters from query
    const filterOptions: MerchantFilterOptions = {};

    if (req.query.name) {
      filterOptions.name = req.query.name as string;
    }

    if (req.query.phoneNumber) {
      filterOptions.phoneNumber = req.query.phoneNumber as string;
    }

    if (req.query.isActive !== undefined) {
      filterOptions.isActive = req.query.isActive === "true";
    }

    // Get pagination options
    const paginationOptions = getPaginationOptions(req);

    // Get merchants with filters and pagination
    const result = await getAllMerchantsService(
      filterOptions,
      paginationOptions
    );

    return res
      .status(httpStatus.OK)
      .json(successResponse(result, "Merchants retrieved successfully"));
  }
);
