interface PersonalizationResult {
  filename: string;
  content: string;
  complexityLevel: string;
  transformationApplied: boolean;
}

interface ClientPersonalizationOptions {
  complexityOverride?: 'beginner' | 'intermediate' | 'advanced';
  preserveStructure?: boolean;
}

/**
 * Client-side content personalizer that communicates with backend API
 */
export class ClientContentPersonalizer {
  private readonly apiBaseUrl: string;
  private readonly personalizeEndpoint: string;

  constructor(apiBaseUrl?: string) {
    // Use a default base URL or window variable if available, similar to AuthContext
    // During development, we want to point to the personalization server on port 3001
    // Check if we're in development by looking at the hostname
    const isDevEnvironment = typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    this.apiBaseUrl =
      (typeof window !== 'undefined' && (window as any).API_BASE_URL) ||
      (isDevEnvironment ? 'http://localhost:3001/api' : 'https://ai-personalization-backend.vercel.app/api');

    // Allow override via constructor parameter
    if (apiBaseUrl) {
      this.apiBaseUrl = apiBaseUrl;
    }

    this.personalizeEndpoint = `${this.apiBaseUrl}/personalize`;
  }

  /**
   * Personalize a chapter by calling the backend API
   */
  async personalizeChapter(
    chapterPath: string,
    userId?: string
  ): Promise<PersonalizationResult> {
    const params = new URLSearchParams({
      chapter: chapterPath,
    });

    if (userId) {
      params.append('userId', userId);
    }

    try {
      const response = await fetch(`${this.personalizeEndpoint}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get text response instead of JSON for error
        throw new Error(`Personalization failed: ${errorText || 'Unknown error'}`);
      }

      const result = await response.json();
      return {
        filename: result.filename,
        content: result.content,
        complexityLevel: result.complexityLevel,
        transformationApplied: result.transformationApplied
      };
    } catch (error) {
      console.error('Error personalizing chapter:', error);
      // Check if it's a JSON parsing error
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        console.error('Received non-JSON response from API, likely server not running or incorrect endpoint');
        // Return a user-friendly message
        return {
          filename: chapterPath.split('/').pop() || chapterPath,
          content: `# Personalization Service Unavailable\n\nThe personalization service is currently unavailable. Please ensure the backend server is running.`,
          complexityLevel: 'error',
          transformationApplied: false
        };
      }
      // Return original content if personalization fails
      return {
        filename: chapterPath.split('/').pop() || chapterPath,
        content: `# Error\n\nCould not load content for ${chapterPath}`,
        complexityLevel: 'error',
        transformationApplied: false
      };
    }
  }

  /**
   * Personalize content by calling the backend API
   */
  async personalizeContent(
    content: string,
    userId?: string
  ): Promise<PersonalizationResult> {
    try {
      const response = await fetch(this.personalizeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          userId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get text response instead of JSON for error
        throw new Error(`Personalization failed: ${errorText || 'Unknown error'}`);
      }

      const result = await response.json();
      return {
        filename: 'dynamic-content',
        content: result.personalizedContent,
        complexityLevel: result.complexityLevel,
        transformationApplied: result.transformationApplied
      };
    } catch (error) {
      console.error('Error personalizing content:', error);
      // Check if it's a JSON parsing error
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        console.error('Received non-JSON response from API, likely server not running or incorrect endpoint');
        // Return a user-friendly message
        return {
          filename: 'dynamic-content',
          content: `# Personalization Service Unavailable\n\nThe personalization service is currently unavailable. Please ensure the backend server is running.`,
          complexityLevel: 'error',
          transformationApplied: false
        };
      }
      // Return original content if personalization fails
      return {
        filename: 'dynamic-content',
        content: content,
        complexityLevel: 'original',
        transformationApplied: false
      };
    }
  }
}

// Export a default instance
export const clientContentPersonalizer = new ClientContentPersonalizer();