import { z } from "zod";
// Import the extension to add OpenAPI methods to Zod
import "zod-openapi/extend";

// Schema for customer check-in
export const checkInSchema = z.object({
  body: z.object({
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number must be at most 15 characters")
      .openapi({
        description: "Customer phone number (primary identifier)",
        example: "1234567890",
      }),
    merchantId: z.string().uuid("Merchant ID must be a valid UUID").openapi({
      description: "ID of the merchant",
      example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    }),
    name: z.string().optional().openapi({
      description: "Customer name (optional)",
      example: "John Doe",
    }),
  }),
});

// Schema for retrieving customer by phone number
export const getCustomerByPhoneSchema = z.object({
  params: z.object({
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number must be at most 15 characters")
      .openapi({
        description: "Phone number of the customer to retrieve",
        example: "1234567890",
      }),
  }),
});

// Schema for updating customer information
export const updateCustomerSchema = z.object({
  params: z.object({
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number must be at most 15 characters")
      .openapi({
        description: "Current phone number of the customer to update",
        example: "1234567890",
      }),
  }),
  body: z.object({
    name: z.string().min(1, "Name must not be empty").optional().openapi({
      description: "Updated customer name",
      example: "John Doe",
    }),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number must be at most 15 characters")
      .optional()
      .openapi({
        description: "New phone number for the customer",
        example: "9876543210",
      }),
    totalPoints: z
      .number()
      .int("Points must be an integer")
      .min(0, "Points cannot be negative")
      .optional()
      .openapi({
        description: "Updated total points",
        example: 100,
      }),
  }),
});

// Schema for deleting a customer
export const deleteCustomerSchema = z.object({
  params: z.object({
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number must be at most 15 characters")
      .openapi({
        description: "Phone number of the customer to delete",
        example: "1234567890",
      }),
  }),
});
