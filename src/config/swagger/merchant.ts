import { z } from "zod";
import "zod-openapi/extend";
import {
  getMerchantByIdSchema,
  getMerchantByPhoneSchema,
  getAllMerchantsSchema,
} from "../../validations/merchantValidation";

/**
 * Merchant endpoints Swagger documentation
 */
export const merchantPaths = {
  "/merchants": {
    get: {
      summary: "Get all merchants with filtering and pagination",
      tags: ["Merchants"],
      parameters: [
        {
          in: "query",
          name: "name",
          schema: {
            type: "string",
          },
          description: "Filter by name (partial match, case insensitive)",
          example: "Coffee Shop",
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
          description: "Merchants retrieved successfully",
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
                    example: "Merchants retrieved successfully",
                  },
                  data: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Merchant",
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
  "/merchants/id/{id}": {
    get: {
      summary: "Get merchant by ID",
      tags: ["Merchants"],
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
          description: "ID of the merchant to retrieve",
        },
      ],
      responses: {
        "200": {
          description: "Merchant information retrieved successfully",
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
                    example: "Merchant retrieved successfully",
                  },
                  data: {
                    $ref: "#/components/schemas/Merchant",
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
  "/merchants/phone/{phoneNumber}": {
    get: {
      summary: "Get merchant by phone number",
      tags: ["Merchants"],
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
          description: "Phone number of the merchant to retrieve",
        },
      ],
      responses: {
        "200": {
          description: "Merchant information retrieved successfully",
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
                    example: "Merchant retrieved successfully",
                  },
                  data: {
                    $ref: "#/components/schemas/Merchant",
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
 * Merchant schema component for Swagger
 */
export const merchantSchemas = {
  Merchant: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        description: "Unique identifier for the merchant",
      },
      name: {
        type: "string",
        description: "Merchant business name",
      },
      address: {
        type: ["string", "null"],
        description: "Merchant address (optional)",
      },
      phoneNumber: {
        type: ["string", "null"],
        description: "Merchant phone number (optional)",
      },
      pointsPerVisit: {
        type: "integer",
        description: "Points earned per customer visit",
      },
      pointsPerDollar: {
        type: ["number", "null"],
        format: "float",
        description: "Points earned per dollar spent (optional)",
      },
      welcomeBonus: {
        type: "integer",
        description: "Welcome bonus points for new customers",
      },
      isActive: {
        type: "boolean",
        description: "Whether the merchant is active",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "When the merchant was created",
      },
      updatedAt: {
        type: ["string", "null"],
        format: "date-time",
        description: "When the merchant was last updated",
      },
    },
  },
};
