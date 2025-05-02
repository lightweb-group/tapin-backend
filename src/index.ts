import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import v1Routes from "./routes/v1";
import docsRoutes from "./routes/docsRoutes";
import errorHandler from "./middleware/errorHandler";
import ApiError from "./utils/ApiError";
import httpStatus from "./constants/httpStatus";
import { configureSecurityMiddleware } from "./middleware/security/configureSecurityMiddleware";
import "express-async-errors"; // For automatic async error handling

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

const port = process.env.PORT || 3000;

// Configure CORS options
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  credentials: true,
  maxAge: 600, // 10 minutes
};

// Basic middleware
app.use(cors(corsOptions));

// Configure and apply all security middleware
configureSecurityMiddleware(app, {
  // Customize security options
  csrfExcludePaths: ["/api/v1", "/api-docs", "/health", "/webhook"],
  // Higher rate limits for development
  standardRateLimitMax: process.env.NODE_ENV === "production" ? 100 : 1000,
  loginRateLimitMax: process.env.NODE_ENV === "production" ? 5 : 100,
  apiRateLimitMax: process.env.NODE_ENV === "production" ? 50 : 500,
  // Disable CSRF in development for easier testing
  enableCsrf: process.env.NODE_ENV === "production",
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// Swagger documentation
app.use("/api-docs", docsRoutes);

// API Routes - Versioned
app.use("/api/v1", v1Routes);

// Root redirect to API docs
app.get("/", (req: Request, res: Response) => {
  res.redirect("/api-docs");
});

// 404 handler for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(`Not found - ${req.originalUrl}`, httpStatus.NOT_FOUND));
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(
    `API documentation available at http://localhost:${port}/api-docs`
  );
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server gracefully");
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Perform any cleanup if needed
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  // Keep the process running but log the error
});
