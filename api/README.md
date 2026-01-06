# Docusaurus Authentication API

This is the backend API for the Docusaurus website authentication system, built with Node.js, Express, and Better Auth integration.

## Features

- User registration with email and password
- User login and authentication
- Profile management with software/hardware background preferences
- Chapter personalization based on user profile
- JWT-based session management
- PostgreSQL database integration with Neon

## Prerequisites

- Node.js 16+
- PostgreSQL database (Neon recommended)
- Environment variables configured

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the project root with the following variables:
```env
# Database Configuration
DATABASE_URL=your_neon_postgres_connection_string

# Authentication Configuration
AUTH_SECRET=your_super_secret_auth_key
AUTH_URL=https://your-domain.vercel.app

# Server Configuration
NODE_ENV=development
PORT=3001
```

3. Run the application:
```bash
npm run dev  # For development with nodemon
npm start    # For production
```

## Deployment to Vercel

This API is designed to be deployed to Vercel. Follow these steps:

1. **Prepare for deployment**:
   - Make sure all environment variables are configured in Vercel dashboard
   - Ensure your `AUTH_URL` environment variable matches your deployed domain

2. **Deploy via Vercel CLI**:
   ```bash
   # Install Vercel CLI globally
   npm install -g vercel

   # Login to Vercel
   vercel login

   # Deploy the API directory
   cd api
   vercel --prod
   ```

3. **Deploy via Git integration**:
   - Push your code to a Git repository
   - Connect your repository to Vercel
   - Set the build command to `npm run build` (or appropriate command)
   - Set the output directory if needed
   - Add the environment variables in the Vercel dashboard

4. **Environment Variables for Vercel**:
   Add these environment variables in your Vercel project settings:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `AUTH_SECRET`: A secure secret key for JWT signing
   - `AUTH_URL`: Your deployed domain (e.g., https://your-project.vercel.app)
   - `NODE_ENV`: production

5. **Vercel Configuration** (optional):
   Create a `vercel.json` file in the api directory if you need custom configuration:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "src/server.js"
       }
     ]
   }
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Personalization

- `POST /api/personalize/chapter/:chapterId` - Get personalized chapter content

### Health Check

- `GET /health` - Check API health status

## Database Schema

The API uses PostgreSQL with the following tables:

### Users Table
- `id`: Primary key (UUID)
- `email`: Unique email address
- `password_hash`: Hashed password
- `software_background`: User's software experience level (beginner/intermediate/advanced)
- `hardware_background`: User's hardware familiarity (low-end/mid/high)
- `email_verified`: Boolean indicating email verification status
- `created_at`: Timestamp of account creation
- `updated_at`: Timestamp of last update

### Sessions Table
- `id`: Primary key (UUID)
- `user_id`: Foreign key to users table
- `token`: JWT token
- `expires_at`: Token expiration timestamp
- `created_at`: Timestamp of session creation
- `updated_at`: Timestamp of last update

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `AUTH_SECRET`: Secret key for JWT signing (should be a long, random string)
- `AUTH_URL`: Base URL for the application
- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Port number for the server (default: 3001)

## Development

For development, use:
```bash
npm run dev
```

This will start the server with nodemon for automatic restarts on file changes.

## Deployment

This API is designed to be deployed to Vercel, but can run on any Node.js hosting platform. Make sure to set the appropriate environment variables in your deployment environment.

## Security

- Passwords are hashed using bcrypt
- Sessions use JWT tokens with expiration
- Rate limiting is implemented to prevent abuse
- Input validation is performed on all endpoints
- CORS is configured for security