import { z } from "zod";
import "zod-openapi/extend";

/**
 * Customer endpoints Swagger documentation
 */
export const customerPaths = {
  "/customers": {
    get: {
      summary: "Get all customers with filtering and pagination",
      tags: ["Customers"],
      parameters: [
        {
          in: "query",
          name: "name",
          schema: {
            type: "string",
          },
          description: "Filter by name (partial match, case insensitive)",
          example: "John Doe",
        },
        {
          in: "query",
          name: "phoneNumber",
          schema: {
            type: "string",
          },
          description: "Filter by phone number (partial match)",
          example: "555",
        },
        {
          in: "query",
          name: "email",
          schema: {
            type: "string",
          },
          description: "Filter by email (partial match, case insensitive)",
          example: "example.com",
        },
        {
          in: "query",
          name: "totalPointsMin",
          schema: {
            type: "integer",
          },
          description: "Minimum total points",
          example: 100,
        },
        {
          in: "query",
          name: "totalPointsMax",
          schema: {
            type: "integer",
          },
          description: "Maximum total points",
          example: 1000,
        },
        {
          in: "query",
          name: "merchantId",
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Filter by merchant ID",
          example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        },
        {
          in: "query",
          name: "isActive",
          schema: {
            type: "string",
            enum: ["true", "false"],
          },
          description: "Filter by active status",
          example: "true",
        },
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            minimum: 1,
            default: 1,
          },
          description: "Page number",
          example: 1,
        },
        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 100,
            default: 10,
          },
          description: "Number of items per page",
          example: 10,
        },
      ],
      responses: {
        "200": {
          description: "Customers retrieved successfully",
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
                    example: "Customers retrieved successfully",
                  },
                  data: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Customer",
                        },
                      },
                      pagination: {
                        $ref: "#/components/schemas/Pagination",
                      },
                    },
                  },
                },
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
  "/customers/check-in": {
    post: {
      summary: "Check in a customer to a merchant",
      tags: ["Customers"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["phoneNumber", "merchantId"],
              properties: {
                phoneNumber: {
                  type: "string",
                  description: "Customer's phone number",
                  example: "5551234567",
                },
                merchantId: {
                  type: "string",
                  format: "uuid",
                  description: "ID of the merchant for check-in",
                  example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                },
                name: {
                  type: "string",
                  description: "Customer name (for new customers)",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Customer checked in successfully",
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
                      pointsEarned: {
                        type: "integer",
                        example: 10,
                      },
                      totalPoints: {
                        type: "integer",
                        example: 150,
                      },
                      isNewCustomer: {
                        type: "boolean",
                        example: false,
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
  "/customers/id/{id}": {
    get: {
      summary: "Get customer by ID",
      tags: ["Customers"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
            example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          },
          description: "ID of the customer to retrieve",
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
      summary: "Update customer by phone number",
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
          description: "Phone number of the customer to update",
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
                  description: "Customer's first name",
                  example: "John",
                },
                totalPoints: {
                  type: "integer",
                  description: "Customer's total points",
                  example: 100,
                },
                phoneNumber: {
                  type: "string",
                  description: "Customer's phone number",
                  example: "5551234567",
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
        "429": {
          $ref: "#/components/responses/TooManyRequests",
        },
        "500": {
          $ref: "#/components/responses/InternalServer",
        },
      },
    },
    delete: {
      summary: "Delete customer by phone number (soft delete)",
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
          description: "Phone number of the customer to delete",
        },
      ],
      responses: {
        "200": {
          description: "Customer deleted successfully",
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
                    example: "Customer deleted successfully",
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
        "429": {
          $ref: "#/components/responses/TooManyRequests",
        },
        "500": {
          $ref: "#/components/responses/InternalServer",
        },
      },
    },
  },
};

/**
 * Customer schema component for Swagger
 */
export const customerSchemas = {
  Customer: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        description: "Unique identifier for the customer",
      },
      firstName: {
        type: "string",
        description: "Customer's first name",
      },
      lastName: {
        type: "string",
        description: "Customer's last name",
      },
      email: {
        type: ["string", "null"],
        format: "email",
        description: "Customer's email address (optional)",
      },
      phoneNumber: {
        type: "string",
        description: "Customer's phone number",
      },
      birthDate: {
        type: ["string", "null"],
        format: "date",
        description: "Customer's birth date (optional)",
      },
      totalPoints: {
        type: "integer",
        description: "Customer's total points balance",
      },
      isActive: {
        type: "boolean",
        description: "Whether the customer account is active",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "When the customer was created",
      },
      updatedAt: {
        type: ["string", "null"],
        format: "date-time",
        description: "When the customer was last updated",
      },
    },
  },
};
