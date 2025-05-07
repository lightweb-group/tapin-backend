import { z } from "zod";
// Import the extension to add OpenAPI methods to Zod
import "zod-openapi/extend";

// Schema for creating a new merchant
export const createMerchantSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Merchant name is required").openapi({
      description: "Merchant business name",
      example: "Coffee Shop",
    }),
    address: z.string().optional().openapi({
      description: "Merchant address",
      example: "123 Main St, City, Country",
    }),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number must be at most 15 characters")
      .optional()
      .openapi({
        description: "Merchant phone number",
        example: "1234567890",
      }),
    pointsPerVisit: z
      .number()
      .int("Points per visit must be an integer")
      .min(0, "Points cannot be negative")
      .optional()
      .openapi({
        description: "Points awarded per customer visit",
        example: 10,
      }),
    pointsPerDollar: z
      .number()
      .min(0, "Points per dollar cannot be negative")
      .optional()
      .openapi({
        description: "Points awarded per dollar spent",
        example: 1,
      }),
    welcomeBonus: z
      .number()
      .int("Welcome bonus must be an integer")
      .min(0, "Welcome bonus cannot be negative")
      .optional()
      .openapi({
        description: "Welcome bonus points for new customers",
        example: 50,
      }),
    isActive: z.boolean().optional().openapi({
      description: "Whether the merchant is active",
      example: true,
    }),
  }),
});

// Schema for updating an existing merchant
export const updateMerchantSchema = z.object({
  params: z.object({
    id: z.string().uuid("Merchant ID must be a valid UUID").openapi({
      description: "ID of the merchant to update",
      example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    }),
  }),
  body: z.object({
    name: z
      .string()
      .min(1, "Merchant name cannot be empty")
      .optional()
      .openapi({
        description: "Updated merchant name",
        example: "New Coffee Shop Name",
      }),
    address: z.string().optional().openapi({
      description: "Updated merchant address",
      example: "456 New St, City, Country",
    }),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number must be at most 15 characters")
      .optional()
      .openapi({
        description: "Updated merchant phone number",
        example: "9876543210",
      }),
    pointsPerVisit: z
      .number()
      .int("Points per visit must be an integer")
      .min(0, "Points cannot be negative")
      .optional()
      .openapi({
        description: "Updated points per visit",
        example: 15,
      }),
    pointsPerDollar: z
      .number()
      .min(0, "Points per dollar cannot be negative")
      .optional()
      .openapi({
        description: "Updated points per dollar spent",
        example: 1.5,
      }),
    welcomeBonus: z
      .number()
      .int("Welcome bonus must be an integer")
      .min(0, "Welcome bonus cannot be negative")
      .optional()
      .openapi({
        description: "Updated welcome bonus",
        example: 75,
      }),
    isActive: z.boolean().optional().openapi({
      description: "Updated merchant active status",
      example: true,
    }),
  }),
});

// Schema for deleting a merchant
export const deleteMerchantSchema = z.object({
  params: z.object({
    id: z.string().uuid("Merchant ID must be a valid UUID").openapi({
      description: "ID of the merchant to delete",
      example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    }),
  }),
});

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
