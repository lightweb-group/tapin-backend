import { Router } from "express";
import {
  getMerchantById,
  getMerchantByPhone,
  getAllMerchants,
} from "../../controllers/merchantController";
import validate from "../../middleware/validate";
import {
  getMerchantByIdSchema,
  getMerchantByPhoneSchema,
  getAllMerchantsSchema,
} from "../../validations/merchantValidation";

const router = Router();

// Get all merchants
router.get("/", validate(getAllMerchantsSchema), getAllMerchants);

// Get merchant by ID
router.get("/id/:id", validate(getMerchantByIdSchema), getMerchantById);

// Get merchant by phone number
router.get(
  "/phone/:phoneNumber",
  validate(getMerchantByPhoneSchema),
  getMerchantByPhone
);

export default router;
