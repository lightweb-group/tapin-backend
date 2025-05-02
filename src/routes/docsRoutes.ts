import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger";

const router = Router();

/**
 * Swagger UI route
 * Serves the API documentation
 */
router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    swaggerOptions: {
      docExpansion: "none",
      persistAuthorization: true,
    },
  })
);

export default router;
