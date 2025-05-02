import { Router } from "express";
import customerRoutes from "./customerRoutes";
import { standardRateLimit } from "../../middleware/rateLimit";

const router = Router();

// Apply rate limiting to all API v1
router.use(standardRateLimit);

// Mount customer routes
router.use("/customers", customerRoutes);

export default router;
