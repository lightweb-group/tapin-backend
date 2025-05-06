import { Router } from "express";
import { checkIn, getCustomer, updateCustomer } from "../../controllers/customerController";
import validate from "../../middleware/validate";
import {
  checkInSchema,
  getCustomerByPhoneSchema,
  updateCustomerSchema,
} from "../../validations/customerValidation";
import { standardRateLimit } from "../../middleware/rateLimit";

const router = Router();

// Check in a customer
router.post("/check-in", validate(checkInSchema), standardRateLimit, checkIn);

// Get customer by phone number
router.get(
  "/:phoneNumber",
  validate(getCustomerByPhoneSchema),
  standardRateLimit,
  getCustomer
);

// Update customer information
router.put(
  "/:phoneNumber",
  validate(updateCustomerSchema),
  standardRateLimit,
  updateCustomer
);

export default router;
