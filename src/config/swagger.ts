import swaggerJsdoc from "swagger-jsdoc";
import { version } from "../../package.json";
import { createDocument } from "zod-openapi";
import "zod-openapi/extend";
import { z } from "zod";
import {
  checkInSchema,
  getCustomerByPhoneSchema,
  updateCustomerSchema,
} from "../validations/customerValidation";

// Add OpenAPI metadata to our Zod schemas
const phoneNumberSchema = z
  .string()
  .min(10, "Phone number must be at least 10 characters")
  .max(15, "Phone number must be at most 15 characters")
  .openapi({
    description: "Customer phone number (primary identifier)",
    example: "1234567890",
  });

const merchantIdSchema = z
  .string()
  .uuid("Merchant ID must be a valid UUID")
  .openapi({
    description: "ID of the merchant",
    example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  });

const nameSchema = z.string().optional().openapi({
  description: "Customer name (optional)",
  example: "John Doe",
});

// Define OpenAPI document
const openApiDocument = createDocument({
  openapi: "3.0.0",
  info: {
    title: "Customer Check-in API Documentation",
    version,
    description: "API documentation for the Customer Check-in system",
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1",
    },
  ],
  components: {
    schemas: {
      Customer: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "Unique identifier for the customer",
          },
          phoneNumber: {
            type: "string",
            description: "Customer phone number (unique identifier)",
          },
          name: {
            type: "string",
            description: "Customer name (optional)",
            nullable: true,
          },
          totalPoints: {
            type: "integer",
            description: "Total accumulated points",
          },
          lastCheckIn: {
            type: "string",
            format: "date-time",
            description: "Date and time of the last check-in",
            nullable: true,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Date and time when customer was created",
          },
          merchantId: {
            type: "string",
            format: "uuid",
            description: "ID of the merchant the customer belongs to",
            nullable: true,
          },
        },
      },
      Transaction: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "Unique identifier for the transaction",
          },
          merchantId: {
            type: "string",
            format: "uuid",
            description: "ID of the merchant",
          },
          customerId: {
            type: "string",
            format: "uuid",
            description: "ID of the customer",
          },
          dateTime: {
            type: "string",
            format: "date-time",
            description: "Date and time of the transaction",
          },
          pointsChange: {
            type: "integer",
            description: "Number of points earned or redeemed",
          },
          activityType: {
            type: "string",
            enum: ["EARN", "REDEEM", "ADJUSTMENT"],
            description: "Type of transaction activity",
          },
          notes: {
            type: "string",
            description: "Additional notes about the transaction",
            nullable: true,
          },
          purchaseAmount: {
            type: "number",
            format: "float",
            description: "Amount of purchase if applicable",
            nullable: true,
          },
          rewardId: {
            type: "string",
            format: "uuid",
            description: "ID of the reward if redeemed",
            nullable: true,
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Error message",
          },
          data: {
            type: "object",
            nullable: true,
            properties: {
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    path: {
                      type: "string",
                      example: "body.phoneNumber",
                    },
                    message: {
                      type: "string",
                      example: "Phone number must be at least 10 characters",
                    },
                  },
                },
              },
            },
          },
        },
      },
      ApiResponse: {
        type: "object",
        description: "Standard API response structure",
        properties: {
          success: {
            type: "boolean",
            description: "Indicates if the operation was successful",
          },
          message: {
            type: "string",
            description: "Response message",
          },
          data: {
            type: "object",
            nullable: true,
            description: "Response data",
          },
        },
        example: {
          success: true,
          message: "Operation completed successfully",
          data: { id: "123e4567-e89b-12d3-a456-426614174000" },
        },
      },
      CheckInRequest: {
        type: "object",
        required: ["phoneNumber", "merchantId"],
        properties: {
          phoneNumber: {
            type: "string",
            minLength: 10,
            maxLength: 15,
            description: "Customer phone number",
            example: "1234567890",
          },
          merchantId: {
            type: "string",
            format: "uuid",
            description: "ID of the merchant",
            example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          },
          name: {
            type: "string",
            description: "Optional customer name",
            example: "John Doe",
          },
        },
      },
    },
    responses: {
      BadRequest: {
        description: "Bad request",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      NotFound: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      TooManyRequests: {
        description: "Too many requests",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      InternalServer: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
    },
  },
  paths: {
    "/customers/check-in": {
      post: {
        summary: "Check in a customer",
        tags: ["Customers"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CheckInRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Customer successfully checked in",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Customer checked in successfully",
                    },
                    data: {
                      type: "object",
                      properties: {
                        customer: {
                          $ref: "#/components/schemas/Customer",
                        },
                        transaction: {
                          $ref: "#/components/schemas/Transaction",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            $ref: "#/components/responses/BadRequest",
          },
          "404": {
            $ref: "#/components/responses/NotFound",
          },
          "429": {
            $ref: "#/components/responses/TooManyRequests",
          },
          "500": {
            $ref: "#/components/responses/InternalServer",
          },
        },
      },
    },
    "/customers/{phoneNumber}": {
      get: {
        summary: "Get customer by phone number",
        tags: ["Customers"],
        parameters: [
          {
            in: "path",
            name: "phoneNumber",
            required: true,
            schema: {
              type: "string",
              minLength: 10,
              maxLength: 15,
              example: "1234567890",
            },
            description: "Phone number of the customer to retrieve",
          },
        ],
        responses: {
          "200": {
            description: "Customer information retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Customer retrieved successfully",
                    },
                    data: {
                      $ref: "#/components/schemas/Customer",
                    },
                  },
                },
              },
            },
          },
          "400": {
            $ref: "#/components/responses/BadRequest",
          },
          "404": {
            $ref: "#/components/responses/NotFound",
          },
          "429": {
            $ref: "#/components/responses/TooManyRequests",
          },
          "500": {
            $ref: "#/components/responses/InternalServer",
          },
        },
      },
      put: {
        summary: "Update customer information",
        tags: ["Customers"],
        parameters: [
          {
            in: "path",
            name: "phoneNumber",
            required: true,
            schema: {
              type: "string",
              minLength: 10,
              maxLength: 15,
              example: "1234567890",
            },
            description: "Current phone number of the customer to update",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Updated customer name",
                    example: "John Doe",
                  },
                  phoneNumber: {
                    type: "string",
                    description: "New phone number for the customer",
                    example: "9876543210",
                    minLength: 10,
                    maxLength: 15,
                  },
                  totalPoints: {
                    type: "integer",
                    description: "Updated total points",
                    example: 100,
                    minimum: 0,
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Customer updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Customer updated successfully",
                    },
                    data: {
                      type: "null",
                      example: null,
                    },
                  },
                },
              },
            },
          },
          "400": {
            $ref: "#/components/responses/BadRequest",
          },
          "404": {
            $ref: "#/components/responses/NotFound",
          },
          "409": {
            description: "Conflict - Phone number already exists",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "429": {
            $ref: "#/components/responses/TooManyRequests",
          },
          "500": {
            $ref: "#/components/responses/InternalServer",
          },
        },
      },
    },
  },
});

/**
 * Swagger specification
 * We convert our OpenAPI document to a format that swagger-jsdoc can use
 */
const swaggerSpec = openApiDocument;

export default swaggerSpec;
