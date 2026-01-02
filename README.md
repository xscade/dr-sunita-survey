# Dr. Sunita Aesthetics - Next.js Application

Patient check-in system for Dr Sunita Aesthetics - Plastic Surgery Clinic built with Next.js.

## Features

- Patient check-in form with multi-step survey
- Admin dashboard with analytics
- MongoDB integration
- Responsive design

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Seed the database with admin credentials (optional - admin will be auto-created on first login):
   ```bash
   npm run seed
   ```
   Or use the API endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Credentials

The default admin credentials are:
- **Username**: `admin`
- **Password**: `password`

> **Note**: The admin user will be automatically created on the first login attempt if it doesn't exist. You can also use the seed script or API endpoint to create it beforehand.

## Project Structure

- `app/` - Next.js app directory with pages and API routes
- `components/` - React components
- `lib/` - Utility functions and MongoDB connection
- `types.ts` - TypeScript type definitions

## API Routes

- `/api/patients` - Patient data CRUD operations (GET, POST)
- `/api/options` - Form options management (GET, POST)
- `/api/login` - Admin authentication (POST)
- `/api/seed` - Seed database with admin user (GET, POST)

## Deployment

This project is configured for Vercel deployment. The MongoDB connection string is already configured in `lib/mongodb.ts`.
