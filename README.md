# Node.js TypeScript Express Setup

A clean, proper Node.js TypeScript Express setup template that can be used as a starting point for your projects.

## Features

- Node.js with Express server
- TypeScript configuration
- In-memory data store (easy to replace with a real database later)
- Basic API CRUD operations
- Environment configuration
- Development and production scripts

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd node-ts-express-app
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure environment variables

Create a `.env` file in the root directory (or modify the existing one) with your environment variables:

```env
NODE_ENV=development
PORT=3000
```

### 4. Start the development server

```bash
npm run dev
```

The server will be running at http://localhost:3000.

## Scripts

- `npm run dev` - Start the development server with hot-reloading
- `npm run build` - Build the project for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code style

## Project Structure

```
node-ts-express-app/
├── src/
│   ├── routes/            # API routes
│   │   └── userRoutes.ts  # User-related routes
│   └── index.ts           # Application entry point
├── .env                   # Environment variables
├── .gitignore             # Git ignore rules
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Adding New Features

### Creating a New Route

1. Create a new route file in `src/routes/`
2. Import and use the route in `src/index.ts`

### Adding a Database

This template uses an in-memory data store for simplicity. When you're ready to add a real database:

1. Install the database client/ORM of your choice (e.g., `mongoose`, `sequelize`, `typeorm`)
2. Configure the database connection in your application
3. Replace the in-memory operations with database operations

## License

MIT
