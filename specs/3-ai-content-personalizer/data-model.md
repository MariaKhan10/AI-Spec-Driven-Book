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