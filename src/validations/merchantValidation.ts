import { z } from "zod";
// Import the extension to add OpenAPI methods to Zod
import "zod-openapi/extend";

// Schema for getting merchant by ID
export const getMerchantByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Merchant ID must be a valid UUID").openapi({
      description: "ID of the merchant to retrieve",
      example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    }),
  }),
});

// Schema for getting merchant by phone number
export const getMerchantByPhoneSchema = z.object({
  params: z.object({
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number must be at most 15 characters")
      .openapi({
        description: "Phone number of the merchant to retrieve",
        example: "1234567890",
      }),
  }),
});

// Schema for getting all merchants with filtering and pagination
export const getAllMerchantsSchema = z.object({
  query: z
    .object({
      // Search and filter parameters
      name: z.string().optional().openapi({
        description:
          "Filter merchants by name (partial match, case insensitive)",
        example: "Coffee Shop",
      }),
      phoneNumber: z.string().optional().openapi({
        description: "Filter merchants by phone number (partial match)",
        example: "555",
      }),
      isActive: z.string().optional().openapi({
        description: "Filter by active status ('true' or 'false')",
        example: "true",
      }),

      // Pagination parameters
      page: z
        .string()
        .regex(/^\d+$/, "Must be a positive integer")
        .transform((val) => parseInt(val))
        .optional()
        .openapi({
          description: "Page number (starts from 1)",
          example: "1",
        }),
      limit: z
        .string()
        .regex(/^\d+$/, "Must be a positive integer")
        .transform((val) => parseInt(val))
        .optional()
        .openapi({
          description: "Number of items per page (max 100)",
          example: "10",
        }),
    })
    .optional(),
});
