/**
 * Common schemas and components for Swagger documentation
 */
export const commonSchemas = {
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
  Pagination: {
    type: "object",
    properties: {
      total: {
        type: "integer",
        description: "Total number of records",
        example: 100,
      },
      page: {
        type: "integer",
        description: "Current page number",
        example: 1,
      },
      limit: {
        type: "integer",
        description: "Number of records per page",
        example: 10,
      },
      totalPages: {
        type: "integer",
        description: "Total number of pages",
        example: 10,
      },
      hasNextPage: {
        type: "boolean",
        description: "Whether there is a next page",
        example: true,
      },
      hasPrevPage: {
        type: "boolean",
        description: "Whether there is a previous page",
        example: false,
      },
    },
  },
};

export const commonResponses = {
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
};
