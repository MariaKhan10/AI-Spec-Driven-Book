---
id: 2
title: ai-content-personalizer-plan
stage: plan
date: 2025-12-26
surface: agent
model: Claude Sonnet 4.5
feature: 3-ai-content-personalizer
branch: 3-ai-content-personalizer
user: Claude Code User
command: /sp.plan
labels: ["planning", "ai", "content-personalization", "docusaurus"]
links:
  spec: specs/3-ai-content-personalizer/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/3-ai-content-personalizer/plan.md
  - specs/3-ai-content-personalizer/research.md
  - specs/3-ai-content-personalizer/data-model.md
  - specs/3-ai-content-personalizer/quickstart.md
  - specs/3-ai-content-personalizer/contracts/personalization-api.yaml
tests:
  - specs/3-ai-content-personalizer/research.md
  - specs/3-ai-content-personalizer/data-model.md
---

## Prompt

$ARGUMENTS

## Response snapshot

# Implementation Plan: AI Content Personalizer

**Branch**: `3-ai-content-personalizer` | **Date**: 2025-12-26 | **Spec**: [link to spec](specs/3-ai-content-personalizer/spec.md)
**Input**: Feature specification from `/specs/3-ai-content-personalizer/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

An AI content personalizer service that reads Markdown book content from the 'docs' folder and personalizes it based on the logged-in user's profile information (software/hardware background levels, preferred name). The system adjusts content complexity, examples, and explanations according to the user's skill level (beginner/intermediate/advanced) while preserving all learning objectives, structure, formatting, and code blocks.

## Technical Context

**Language/Version**: TypeScript/JavaScript (based on Docusaurus context from constitution)
**Primary Dependencies**: Docusaurus, Better Auth, OpenAI API or similar AI service for content transformation
**Storage**: File system (reading from 'docs' folder), user data from Better Auth
**Testing**: Jest for unit tests, integration tests for personalization logic
**Target Platform**: Web application (Docusaurus-based documentation site)
**Project Type**: Web - extends existing Docusaurus site structure
**Performance Goals**: Process all chapters within 5 seconds when user is logged in (from spec SC-002)
**Constraints**: Must preserve original content structure, headings, formatting, links, and code blocks; handle errors gracefully
**Scale/Scope**: Support all users accessing book content with different skill levels

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the constitution for Physical AI & Humanoid Robotics Educational Architect:
- **Decision Point Mapping**: The personalization logic must map different user backgrounds to appropriate content complexity levels
- **Reasoning Activation Assessment**: Content must maintain educational value while adapting to skill levels
- **Intelligence Accumulation**: Personalized content should build on previous learning objectives
- **Right Altitude Balance**: Personalization should adjust complexity without losing educational substance
- **Docusaurus Optimization**: Implementation must integrate well with existing Docusaurus framework
- **Practical Application**: The feature should enhance learning experience without reducing educational rigor

## Project Structure

### Documentation (this feature)

```text
specs/3-ai-content-personalizer/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── Personalization/
│       ├── ContentPersonalizer.tsx      # Main personalization component
│       ├── PersonalizationProvider.tsx  # Context provider for user preferences
│       └── PersonalizationControls.tsx  # UI controls for personalization settings
├── services/
│   ├── contentPersonalizer.ts           # Core personalization logic
│   ├── aiService.ts                     # AI service integration for content transformation
│   └── userService.ts                   # Better Auth integration
├── hooks/
│   └── usePersonalization.ts            # Custom hook for personalization logic
├── contexts/
│   └── PersonalizationContext.ts        # Context for managing personalization state
└── pages/
    └── PersonalizationSettings.tsx      # User settings page for personalization preferences
```

**Structure Decision**: Web application structure selected to extend the existing Docusaurus site. The personalization service will be integrated as a custom component that processes Markdown content before display, with AI service integration for content transformation.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| AI Service Integration | To dynamically transform content based on user profiles | Static content would not provide personalization |
| Custom Docusaurus Integration | To maintain educational value while personalizing | Generic solutions would not align with educational constitution |

# Research: AI Content Personalizer

## Decision: AI Service Selection for Content Personalization
**Rationale**: Need to select an appropriate AI service for transforming content based on user profiles. OpenAI GPT models are well-suited for this task as they can understand context and transform text while preserving structure and meaning.
**Alternatives considered**:
- Custom NLP models (requires significant training data and effort)
- Rule-based systems (limited flexibility and personalization)
- Existing content adaptation libraries (lack sophistication for nuanced personalization)

## Decision: Integration Approach with Docusaurus
**Rationale**: The personalization should be implemented as a React component that processes content before display, allowing for real-time personalization based on user context while maintaining Docusaurus compatibility.
**Alternatives considered**:
- Server-side preprocessing (would require complex caching and personalization logic)
- Static generation per user profile (impractical for dynamic user profiles)
- Content tagging system (would require manual annotation of all content)

## Decision: User Profile Data Access
**Rationale**: Integrate with Better Auth to access user profile information (software/hardware background, name) to drive personalization decisions. This provides a clean separation of concerns between authentication and personalization logic.
**Alternatives considered**:
- Custom user profile system (redundant with existing auth system)
- Client-side only profiles (security and persistence concerns)
- External profile service (adds unnecessary complexity)

## Decision: Content Preservation Strategy
**Rationale**: Use AST (Abstract Syntax Tree) parsing of Markdown to identify content elements that need personalization while preserving structure elements like headings, code blocks, links, and formatting.
**Alternatives considered**:
- Regex-based replacement (fragile and error-prone)
- Complete content rewrites (would lose formatting and structure)
- Manual content variants (impractical and hard to maintain)

## Decision: Performance Optimization
**Rationale**: Implement caching strategies to avoid repeated AI processing of the same content for the same user profile, with fallback to original content when AI service is unavailable.
**Alternatives considered**:
- Pre-generating all personalizations (impractical for all possible user profiles)
- No caching (would cause performance issues and increased costs)
- Client-side caching only (wouldn't work for SEO and first-time visitors)

# Data Model: AI Content Personalizer

## Entities

### User Profile
- **id**: string - Unique identifier from Better Auth
- **name**: string | null - Preferred name of the user
- **email**: string - User's email address
- **softwareBackground**: string - User's software experience level (e.g., "beginner", "intermediate", "advanced", "Unknown")
- **hardwareBackground**: string - User's hardware experience level (e.g., "beginner", "intermediate", "advanced", "Unknown")
- **personalizationPreferences**: object - Additional personalization settings (optional)

### Book Chapter
- **filename**: string - Name of the Markdown file
- **title**: string - Title of the chapter
- **content**: string - Original Markdown content
- **learningObjectives**: string[] - List of learning objectives for the chapter
- **difficultyLevel**: string - Original difficulty level (for reference)
- **metadata**: object - Additional chapter metadata

### Personalized Content
- **originalChapterId**: string - Reference to the original chapter
- **userId**: string - Reference to the user for whom content is personalized
- **personalizedContent**: string - The transformed Markdown content
- **complexityLevel**: string - The target complexity level applied
- **transformationLog**: object - Log of transformations applied for debugging
- **createdAt**: Date - Timestamp when personalization was created
- **cacheExpiry**: Date - When the cached personalization expires

### Personalization Settings
- **userId**: string - Reference to the user
- **preferredName**: string - How the user prefers to be addressed in content
- **contentComplexity**: string - Preferred complexity level
- **learningStyle**: string - User's preferred learning style (if specified)
- **technicalDepthPreference**: string - Preference for technical depth (shallow to deep)
- **updatedAt**: Date - When settings were last updated

## Relationships
- User Profile 1 → * Personalized Content (a user can have multiple personalized chapters)
- Book Chapter 1 → * Personalized Content (a chapter can be personalized for multiple users)
- User Profile 1 → 1 Personalization Settings (a user has one set of preferences)

## Validation Rules
- User Profile: softwareBackground and hardwareBackground must be one of ["beginner", "intermediate", "advanced", "Unknown"]
- Book Chapter: filename must end with ".md" and content must be valid Markdown
- Personalized Content: personalizedContent must maintain original structure (headings, code blocks, links)
- Personalization Settings: userId must correspond to an existing user profile

## State Transitions
- Book Chapter: [CREATED] → [PROCESSED] → [AVAILABLE_FOR_PERSONALIZATION]
- Personalized Content: [REQUESTED] → [PROCESSING] → [COMPLETED] → [CACHED] → [EXPIRED]

# Quickstart: AI Content Personalizer

## Prerequisites
- Node.js 18+ installed
- Better Auth configured for user authentication
- AI service (e.g., OpenAI API) key configured
- Docusaurus site with book content in 'docs' folder

## Installation

1. Install required dependencies:
```bash
npm install openai @docusaurus/core
```

2. Add personalization components to your Docusaurus site:
```bash
# Create the personalization component directory
mkdir -p src/components/Personalization
```

3. Configure environment variables:
```bash
# .env file
OPENAI_API_KEY=your_openai_api_key_here
BETTER_AUTH_URL=your_auth_url
```

## Setup

1. Add the personalization provider to your Docusaurus app:
```jsx
// In your main layout or App.js
import PersonalizationProvider from './src/components/Personalization/PersonalizationProvider';

export default function App() {
  return (
    <PersonalizationProvider>
      {/* Your existing Docusaurus layout */}
    </PersonalizationProvider>
  );
}
```

2. Configure the content personalization service:
```javascript
// src/services/contentPersonalizer.js
import { personalizeContent } from './aiService';
import { getUserProfile } from './userService';

export async function getPersonalizedContent(originalContent, userId) {
  const userProfile = await getUserProfile(userId);
  return await personalizeContent(originalContent, userProfile);
}
```

3. Integrate with your documentation pages:
```jsx
// In your doc components
import { usePersonalization } from '../hooks/usePersonalization';

function PersonalizedDoc({ content, userId }) {
  const { personalizedContent, isLoading } = usePersonalization(content, userId);

  if (isLoading) return <div>Loading personalized content...</div>;

  return <div dangerouslySetInnerHTML={{ __html: personalizedContent }} />;
}
```

## Usage

1. For authenticated users, the system will automatically personalize content based on their profile
2. For anonymous users, original content will be displayed without changes
3. Users can adjust personalization settings through the PersonalizationSettings page

## API Endpoints

- `GET /api/personalize?chapter={filename}&userId={userId}` - Get personalized chapter content
- `POST /api/personalize` - Personalize content in request body with user profile
- `GET /api/personalization-settings?userId={userId}` - Get user's personalization settings
- `PUT /api/personalization-settings` - Update user's personalization settings

## Testing

1. Run unit tests:
```bash
npm test
```

2. Test personalization with different user profiles:
```javascript
// Test with beginner user profile
const beginnerProfile = {
  softwareBackground: "beginner",
  hardwareBackground: "beginner",
  name: "Alex"
};

// Test with advanced user profile
const advancedProfile = {
  softwareBackground: "advanced",
  hardwareBackground: "advanced",
  name: "Taylor"
};
```

## Configuration

- Set `PERSONALIZATION_CACHE_TTL` environment variable to control cache expiration (default: 1 hour)
- Set `MAX_CONCURRENT_AI_REQUESTS` to limit concurrent AI processing (default: 5)
- Set `PERSONALIZATION_TIMEOUT` to control request timeout (default: 10 seconds)

# API Contract: Content Personalization Service

## Base URL
`/api/personalize`

## Authentication
All endpoints require a valid user session via Better Auth. Anonymous users receive original content without personalization.

## Endpoints

### GET /api/personalize
Get personalized content for a specific chapter and user.

#### Query Parameters
- `chapter` (required): The filename of the chapter to personalize
- `userId` (optional): The ID of the user requesting personalization (if not provided, returns original content)

#### Responses
- `200 OK`: Successfully personalized content
  ```json
  {
    "filename": "chapter-name.md",
    "content": "Personalized markdown content...",
    "complexityLevel": "beginner|intermediate|advanced",
    "transformationApplied": true
  }
  ```
- `401 Unauthorized`: User not authenticated
- `404 Not Found`: Chapter file not found
- `500 Internal Server Error`: Error in personalization process

### POST /api/personalize
Personalize provided content based on user profile.

#### Request Body
```json
{
  "content": "Original markdown content to personalize",
  "userId": "user-id",
  "options": {
    "preserveStructure": true,
    "complexityOverride": "beginner|intermediate|advanced"
  }
}
```

#### Responses
- `200 OK`: Successfully personalized content
  ```json
  {
    "personalizedContent": "Transformed markdown content...",
    "complexityLevel": "beginner|intermediate|advanced",
    "processingTime": 1250
  }
  ```
- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Error in personalization process

### GET /api/personalization-settings
Get current personalization settings for a user.

#### Query Parameters
- `userId` (required): The ID of the user whose settings to retrieve

#### Responses
- `200 OK`: User settings retrieved successfully
  ```json
  {
    "userId": "user-id",
    "preferredName": "User's preferred name",
    "contentComplexity": "balanced",
    "learningStyle": "practical",
    "technicalDepthPreference": "moderate",
    "updatedAt": "2023-12-26T10:00:00Z"
  }
  ```
- `401 Unauthorized`: User not authenticated
- `404 Not Found`: User settings not found
- `500 Internal Server Error`: Error retrieving settings

### PUT /api/personalization-settings
Update personalization settings for a user.

#### Request Body
```json
{
  "userId": "user-id",
  "preferredName": "User's preferred name",
  "contentComplexity": "balanced",
  "learningStyle": "practical",
  "technicalDepthPreference": "moderate"
}
```

#### Responses
- `200 OK`: Settings updated successfully
  ```json
  {
    "success": true,
    "updatedAt": "2023-12-26T10:00:00Z"
  }
  ```
- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Error updating settings

## Error Format
All error responses follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details (optional)"
  }
}
```

## Common Error Codes
- `AUTHENTICATION_REQUIRED`: User must be authenticated
- `USER_NOT_FOUND`: Specified user does not exist
- `CONTENT_NOT_FOUND`: Requested content file does not exist
- `PERSONALIZATION_FAILED`: Error occurred during content personalization
- `INVALID_USER_PROFILE`: User profile contains invalid data
- `REQUEST_TIMEOUT`: Request took too long to process

## Outcome

- ✅ Impact: Created comprehensive implementation plan for AI content personalizer with technical architecture, data models, API contracts, and setup instructions
- 🧪 Tests: Plan includes testable components and integration points
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, and API contract files
- 🔁 Next prompts: Ready for task generation with `/sp.tasks`
- 🧠 Reflection: Plan successfully captures technical approach for personalizing book content based on user profiles

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All planning requirements met
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to task generation phase