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