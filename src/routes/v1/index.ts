import { Router } from "express";
import customerRoutes from "./customerRoutes";
import merchantRoutes from "./merchantRoutes";
import { standardRateLimit } from "../../middleware/rateLimit";

const router = Router();

// Apply rate limiting to all API v1
router.use(standardRateLimit);

// Mount customer routes
router.use("/customers", customerRoutes);

// Mount merchant routes
router.use("/merchants", merchantRoutes);

export default router;
