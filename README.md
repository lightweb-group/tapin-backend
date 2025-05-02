# Customer Check-in API

A RESTful API for customer check-ins at merchant locations.

## Features

- Customer check-in with point accumulation
- Welcome bonus for new customers
- Transaction history tracking
- Error handling with standardized responses
- Input validation using Zod
- Clean architecture with controllers and services
- API versioning with `/api/v1` prefix
- Rate limiting to prevent abuse
- Automatic API documentation with Swagger generated from Zod schemas

## API Endpoints

All API endpoints are versioned with `/api/v1` prefix.

### API Documentation

The API documentation is automatically generated from Zod validation schemas using `zod-openapi`.
This ensures that the API documentation is always in sync with the actual validation rules.

To access the interactive API documentation, visit:

```
http://localhost:3000/api-docs
```

This documentation includes:

- All available endpoints
- Request/response schemas
- Request body validation rules
- Required and optional fields
- Data types and formats
- Error responses

### Check-in a Customer

```
POST /api/v1/customers/check-in
```

Request body:

```json
{
  "phoneNumber": "1234567890",
  "merchantId": "merchant-uuid",
  "name": "John Doe" // Optional
}
```

Response:

```json
{
  "success": true,
  "message": "Customer checked in successfully",
  "data": {
    "customer": {
      "id": "customer-uuid",
      "phoneNumber": "1234567890",
      "name": "John Doe",
      "totalPoints": 10,
      "lastCheckIn": "2023-06-15T10:00:00.000Z",
      "createdAt": "2023-05-01T10:00:00.000Z",
      "merchantId": "merchant-uuid"
    },
    "transaction": {
      "id": "transaction-uuid",
      "merchantId": "merchant-uuid",
      "customerId": "customer-uuid",
      "dateTime": "2023-06-15T10:00:00.000Z",
      "pointsChange": 10,
      "activityType": "EARN",
      "notes": "Check-in points"
    }
  },
  "statusCode": 200
}
```

### Get Customer by Phone Number

```
GET /api/v1/customers/:phoneNumber
```

Response:

```json
{
  "success": true,
  "message": "Customer retrieved successfully",
  "data": {
    "id": "customer-uuid",
    "phoneNumber": "1234567890",
    "name": "John Doe",
    "totalPoints": 50,
    "lastCheckIn": "2023-06-15T10:00:00.000Z",
    "createdAt": "2023-05-01T10:00:00.000Z",
    "merchantId": "merchant-uuid",
    "transactions": [
      {
        "id": "transaction-uuid",
        "merchantId": "merchant-uuid",
        "customerId": "customer-uuid",
        "dateTime": "2023-06-15T10:00:00.000Z",
        "pointsChange": 10,
        "activityType": "EARN",
        "notes": "Check-in points"
      }
      // More transactions...
    ]
  },
  "statusCode": 200
}
```

## Project Structure

```
.
├── src/
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   ├── validations/        # Zod validation schemas
│   ├── utils/              # Utility functions
│   ├── constants/          # Constants and enums
│   ├── config/             # Configuration files
│   ├── routes/             # API routes
│   │   └── v1/             # Version 1 API routes
│   └── index.ts            # Application entry point
├── prisma/
│   └── schema.prisma       # Database schema
├── .env                    # Environment variables
└── package.json            # Project dependencies
```

## Setup and Development

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Run database migrations: `npm run prisma:migrate`
5. Start the development server: `npm run dev`

## Error Handling

All errors are returned in a standardized format:

```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400
}
```

For validation errors, additional details are provided:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": "body.phoneNumber",
      "message": "Phone number must be at least 10 characters"
    }
  ],
  "statusCode": 400
}
```

## License

MIT
