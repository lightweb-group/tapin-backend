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
