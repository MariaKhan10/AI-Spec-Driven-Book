# Implementation Plan: Docusaurus Authentication with Better Auth

**Feature**: 2-docusaurus-auth
**Created**: 2025-12-22
**Status**: Draft
**Author**: AI Assistant

## Technical Context

This implementation will integrate Better Auth into the existing Docusaurus website to provide email/password authentication with user profile personalization. The solution will follow a microservices architecture with a separate Node.js backend handling authentication and a Docusaurus frontend consuming the authentication APIs.

**Technologies**:
- **Frontend**: Docusaurus (React-based static site)
- **Authentication**: Better Auth
- **Backend**: Node.js/Express server
- **Database**: Neon Serverless Postgres
- **Deployment**: Separate backend service, static frontend hosting

**Unknowns**:
- Specific deployment platform for the backend service
- Detailed chapter personalization algorithm implementation
- Security hardening requirements beyond default Better Auth

## Constitution Check

Based on the project constitution, this implementation plan aligns with:

- **Decision Frameworks Over Rules**: We're designing authentication decision points rather than rigid rules
- **Right Altitude Balance**: Implementation includes clear criteria and measurable constraints
- **Meta-Awareness Against Convergence**: We're avoiding common authentication clichés with a modern approach
- **Docusaurus Optimization**: The solution maintains Docusaurus as the frontend while adding backend services

## Gates

- [X] Architecture: Microservices approach with separate backend for auth
- [X] Database: Neon Serverless Postgres as specified in requirements
- [X] Tech Stack: Better Auth as specified in requirements
- [X] Deployment: Docusaurus remains static, backend deployed separately
- [X] Security: Authentication handled by Better Auth with secure practices

## Phase 0: Research & Unknown Resolution

### Research Task 1: Better Auth Integration Patterns
**Decision**: Use Better Auth with Neon Postgres for user authentication
**Rationale**: Better Auth provides a modern, secure authentication solution that works well with Postgres databases. It supports email/password authentication as required and can store custom user profile data.
**Alternatives considered**:
- Auth.js (more complex setup)
- Clerk (proprietary solution)
- Custom auth (security risks)

### Research Task 2: Docusaurus-Backend Communication Patterns
**Decision**: Use API endpoints with JWT tokens for communication between Docusaurus frontend and auth backend
**Rationale**: This maintains the separation of concerns while allowing secure communication. Docusaurus remains frontend-only while backend handles authentication.
**Alternatives considered**:
- Server-side rendering with Next.js (violates constraint of keeping Docusaurus)
- Client-side only auth (security limitations)

### Research Task 3: Chapter Personalization Implementation
**Decision**: Implement personalization via frontend content adjustment based on user profile data
**Rationale**: Allows for dynamic content adjustment based on user preferences without requiring server-side content generation
**Alternatives considered**:
- Server-side content generation (complexity and performance)
- Static personalization at build time (not dynamic)

## Phase 1: Design & Contracts

### Data Model: User Entity

```
User:
  - id: string (primary key, auto-generated)
  - email: string (unique, required, validated)
  - password: string (hashed, required)
  - software_background: enum ['beginner', 'intermediate', 'advanced']
  - hardware_background: enum ['low-end', 'mid', 'high']
  - created_at: timestamp (auto-generated)
  - updated_at: timestamp (auto-generated)
  - email_verified: boolean (default: false)
```

### Data Model: Session Entity

```
Session:
  - id: string (primary key, auto-generated)
  - user_id: string (foreign key to User)
  - token: string (unique, secure random)
  - expires_at: timestamp
  - created_at: timestamp (auto-generated)
  - updated_at: timestamp (auto-generated)
```

### API Contracts

#### Authentication Endpoints

**POST /api/auth/register**
- Description: Register a new user with email, password, and profile data
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "secure_password",
    "software_background": "intermediate",
    "hardware_background": "mid"
  }
  ```
- Response: 201 Created with user data (excluding password)
- Error Responses: 400 for validation errors, 409 for duplicate email

**POST /api/auth/login**
- Description: Authenticate user with email and password
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "secure_password"
  }
  ```
- Response: 200 OK with session token and user data
- Error Responses: 400 for invalid credentials, 401 for unauthorized

**POST /api/auth/logout**
- Description: Invalidate current user session
- Headers: Authorization: Bearer {token}
- Response: 200 OK
- Error Responses: 401 for invalid token

**GET /api/auth/me**
- Description: Get current user profile
- Headers: Authorization: Bearer {token}
- Response: 200 OK with user data
- Error Responses: 401 for invalid token

**PUT /api/auth/profile**
- Description: Update user profile data
- Headers: Authorization: Bearer {token}
- Request Body:
  ```json
  {
    "software_background": "advanced",
    "hardware_background": "high"
  }
  ```
- Response: 200 OK with updated user data
- Error Responses: 401 for invalid token, 400 for validation errors

#### Chapter Personalization Endpoints

**POST /api/personalize/chapter/{chapterId}**
- Description: Get personalized content for a specific chapter
- Headers: Authorization: Bearer {token}
- Path Parameter: chapterId (string)
- Response: 200 OK with personalized content based on user profile
- Error Responses: 401 for invalid token, 404 for chapter not found

### Quickstart Guide

1. **Environment Setup**:
   - Set up Neon Postgres database
   - Configure environment variables:
     - DATABASE_URL: Neon connection string
     - AUTH_SECRET: Secret key for JWT signing
     - AUTH_URL: Base URL for auth service

2. **Backend Service**:
   - Create Node.js/Express service with Better Auth
   - Connect to Neon Postgres
   - Implement API endpoints as defined above

3. **Frontend Integration**:
   - Add auth context to Docusaurus
   - Create login/signup components
   - Add personalization buttons to chapter pages
   - Implement content adjustment based on user profile

4. **Deployment**:
   - Deploy backend service to preferred platform (Vercel, Netlify, etc.)
   - Deploy Docusaurus frontend as static site
   - Configure CORS and environment variables

## Phase 2: Architecture Overview

### System Architecture

```
┌─────────────────┐    HTTP     ┌──────────────────┐
│   Docusaurus    │ ◄─────────► │  Auth Backend    │
│   Frontend      │             │   (Node.js)      │
│                 │             │                  │
│  - Static Site  │             │  - Better Auth   │
│  - React App    │             │  - Neon Postgres │
│  - Auth Context │             │  - API Endpoints │
└─────────────────┘             └──────────────────┘
                                        │
                                        │ Database
                                        ▼
                                ┌─────────────────┐
                                │  Neon Postgres  │
                                │   Database      │
                                └─────────────────┘
```

### Security Considerations

- Use HTTPS for all communications
- Implement proper CORS configuration
- Store sensitive data encrypted
- Use secure session management
- Implement rate limiting for auth endpoints
- Validate and sanitize all inputs

### Performance Considerations

- Cache user profile data after authentication
- Implement proper database indexing
- Use CDN for static assets
- Optimize API response times

## Re-evaluation of Constitution Check (Post-Design)

The final design continues to align with constitutional principles:
- **Intelligence Accumulation**: Authentication system builds on existing Docusaurus infrastructure
- **Reasoning Activation**: Users make decisions about their profile preferences
- **Right Altitude Balance**: Implementation includes clear technical decisions without over-engineering