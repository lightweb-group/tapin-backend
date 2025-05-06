import { Router } from "express";
import {
  checkIn,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
} from "../../controllers/customerController";
import validate from "../../middleware/validate";
import {
  checkInSchema,
  getCustomerByPhoneSchema,
  updateCustomerSchema,
  deleteCustomerSchema,
  getAllCustomersSchema,
  getCustomerByIdSchema,
} from "../../validations/customerValidation";

const router = Router();

// Get all customers
router.get("/", validate(getAllCustomersSchema), getAllCustomers);

// Check in a customer
router.post("/check-in", validate(checkInSchema), checkIn);

// Get customer by ID
router.get("/id/:id", validate(getCustomerByIdSchema), getCustomerById);

// Get customer by phone number
router.get("/:phoneNumber", validate(getCustomerByPhoneSchema), getCustomer);

// Update customer information
router.put("/:phoneNumber", validate(updateCustomerSchema), updateCustomer);

// Delete customer (soft delete)
router.delete("/:phoneNumber", validate(deleteCustomerSchema), deleteCustomer);

export default router;
