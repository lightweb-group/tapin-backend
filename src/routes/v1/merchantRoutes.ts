import { Router } from "express";
import {
  getMerchantById,
  getMerchantByPhone,
  getAllMerchants,
  createMerchant,
  updateMerchant,
  deleteMerchant,
} from "../../controllers/merchantController";
import validate from "../../middleware/validate";
import {
  getMerchantByIdSchema,
  getMerchantByPhoneSchema,
  getAllMerchantsSchema,
  createMerchantSchema,
  updateMerchantSchema,
  deleteMerchantSchema,
} from "../../validations/merchantValidation";

const router = Router();

// Create a new merchant
router.post("/", validate(createMerchantSchema), createMerchant);

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

// Update merchant by ID
router.put("/id/:id", validate(updateMerchantSchema), updateMerchant);

// Delete merchant by ID
router.delete("/id/:id", validate(deleteMerchantSchema), deleteMerchant);

export default router;
