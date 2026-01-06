# Data Model: Docusaurus Authentication System

**Feature**: 2-docusaurus-auth
**Created**: 2025-12-22
**Status**: Complete

## User Entity

### Attributes
- **id** (String, Primary Key)
  - Type: UUID or secure random string
  - Constraints: Required, Unique
  - Description: Unique identifier for the user

- **email** (String)
  - Type: Text
  - Constraints: Required, Unique, Valid email format
  - Description: User's email address for authentication

- **password_hash** (String)
  - Type: Text
  - Constraints: Required
  - Description: Hashed password using secure algorithm (bcrypt/scrypt)

- **software_background** (String)
  - Type: Enum ['beginner', 'intermediate', 'advanced']
  - Constraints: Optional, Valid values only
  - Description: User's software development experience level

- **hardware_background** (String)
  - Type: Enum ['low-end', 'mid', 'high']
  - Constraints: Optional, Valid values only
  - Description: User's hardware familiarity level

- **email_verified** (Boolean)
  - Type: Boolean
  - Default: false
  - Description: Whether the user has verified their email address

- **created_at** (Timestamp)
  - Type: DateTime with timezone
  - Default: Current timestamp
  - Description: When the user account was created

- **updated_at** (Timestamp)
  - Type: DateTime with timezone
  - Default: Current timestamp, auto-updating
  - Description: When the user account was last updated

### Validation Rules
- Email must be in valid email format
- Password must meet security requirements (min 8 characters, complexity)
- software_background must be one of the defined enum values
- hardware_background must be one of the defined enum values
- Email must be unique across all users

### Relationships
- One-to-Many: User → Sessions (one user can have multiple sessions)

## Session Entity

### Attributes
- **id** (String, Primary Key)
  - Type: UUID or secure random string
  - Constraints: Required, Unique
  - Description: Unique identifier for the session

- **user_id** (String, Foreign Key)
  - Type: String referencing User.id
  - Constraints: Required, Must reference existing user
  - Description: Links session to a user account

- **token** (String)
  - Type: Text
  - Constraints: Required, Unique
  - Description: Secure token for session identification

- **expires_at** (Timestamp)
  - Type: DateTime with timezone
  - Constraints: Required
  - Description: When this session expires

- **created_at** (Timestamp)
  - Type: DateTime with timezone
  - Default: Current timestamp
  - Description: When the session was created

- **updated_at** (Timestamp)
  - Type: DateTime with timezone
  - Default: Current timestamp, auto-updating
  - Description: When the session was last updated

### Validation Rules
- user_id must reference an existing user
- token must be unique across all sessions
- expires_at must be in the future
- Session is invalid if expires_at is in the past

### Relationships
- Many-to-One: Session → User (many sessions belong to one user)

## Chapter Personalization Data Structure

### Attributes (Virtual/Computed)
- **chapter_id** (String)
  - Type: String identifier for the chapter
  - Description: Unique identifier for the book chapter

- **user_profile** (Object)
  - Type: Reference to user's profile data
  - Description: Software and hardware background preferences

- **personalized_content** (Object)
  - Type: Modified content structure
  - Description: Chapter content adjusted based on user profile

### Validation Rules
- chapter_id must exist in the book content
- user must be authenticated to access personalized content
- personalization algorithm must be deterministic based on user profile

## State Transitions

### User Account States
1. **Unregistered** → **Registered** (on successful account creation)
2. **Registered** → **Email Verified** (on email verification)
3. **Email Verified** → **Profile Updated** (on profile modification)

### Session States
1. **Inactive** → **Active** (on successful login)
2. **Active** → **Expired** (on token expiration)
3. **Active** → **Inactive** (on logout)
4. **Expired** → **Inactive** (on cleanup)

## Database Schema (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  software_background TEXT CHECK (software_background IN ('beginner', 'intermediate', 'advanced')),
  hardware_background TEXT CHECK (hardware_background IN ('low-end', 'mid', 'high')),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

## Data Access Patterns

### Authentication Operations
- Find user by email (for login verification)
- Create new user account
- Update user profile information
- Verify session token validity

### Personalization Operations
- Retrieve user profile for personalization
- Apply user preferences to chapter content
- Update user profile preferences

### Security Considerations
- Passwords must be hashed using bcrypt or similar secure algorithm
- Session tokens must be cryptographically secure random strings
- Session expiration must be enforced server-side
- User data access must be properly authenticated and authorized