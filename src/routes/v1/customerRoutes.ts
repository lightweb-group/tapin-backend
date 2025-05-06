import { Router } from "express";
import {
  checkIn,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getAllCustomers,
} from "../../controllers/customerController";
import validate from "../../middleware/validate";
import {
  checkInSchema,
  getCustomerByPhoneSchema,
  updateCustomerSchema,
  deleteCustomerSchema,
  getAllCustomersSchema,
} from "../../validations/customerValidation";

const router = Router();

// Get all customers
router.get("/", validate(getAllCustomersSchema), getAllCustomers);

// Check in a customer
router.post("/check-in", validate(checkInSchema), checkIn);

// Get customer by phone number
router.get("/:phoneNumber", validate(getCustomerByPhoneSchema), getCustomer);

// Update customer information
router.put("/:phoneNumber", validate(updateCustomerSchema), updateCustomer);

// Delete customer (soft delete)
router.delete("/:phoneNumber", validate(deleteCustomerSchema), deleteCustomer);

export default router;
