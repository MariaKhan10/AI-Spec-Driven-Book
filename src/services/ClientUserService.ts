interface PersonalizationSettings {
  userId: string;
  preferredName: string;
  contentComplexity: string;
  learningStyle: string;
  technicalDepthPreference: string;
  updatedAt: Date;
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  softwareBackground: string;
  hardwareBackground: string;
  personalizationPreferences?: Record<string, any>;
}

/**
 * Client-side user service that communicates with backend API
 */
export class ClientUserService {
  private readonly apiBaseUrl: string;
  private readonly settingsEndpoint: string;

  constructor(apiBaseUrl?: string) {
    // Use a default base URL or window variable if available, similar to AuthContext
    // During development, we want to point to the personalization server on port 3001
    // Check if we're in development by looking at the hostname
    const isDevEnvironment = typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    this.apiBaseUrl =
      (typeof window !== 'undefined' && (window as any).API_BASE_URL) ||
      (isDevEnvironment ? 'http://localhost:3001/api' : '/api');

    // Allow override via constructor parameter
    if (apiBaseUrl) {
      this.apiBaseUrl = apiBaseUrl;
    }

    this.settingsEndpoint = `${this.apiBaseUrl}/personalization-settings`;
  }

  /**
   * Get user's personalization settings
   */
  async getUserPersonalizationSettings(userId: string): Promise<PersonalizationSettings | null> {
    try {
      const params = new URLSearchParams({
        userId: userId,
      });

      const response = await fetch(`${this.settingsEndpoint}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get text response instead of JSON for error
        console.error('Error fetching personalization settings:', errorText);
        throw new Error(`Failed to fetch settings: ${errorText || 'Unknown error'}`);
      }

      const result = await response.json();
      return {
        ...result,
        updatedAt: result.updatedAt ? new Date(result.updatedAt) : new Date() // Convert to Date object if needed
      };
    } catch (error) {
      console.error('Error getting user personalization settings:', error);
      // Check if it's a JSON parsing error
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        console.error('Received non-JSON response from API, likely server not running or incorrect endpoint');
        // Try to return default settings from localStorage as fallback
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          const key = `user_${userId}_personalization_settings`;
          const storedSettings = localStorage.getItem(key);
          if (storedSettings) {
            const settings = JSON.parse(storedSettings);
            return {
              ...settings,
              updatedAt: settings.updatedAt ? new Date(settings.updatedAt) : new Date()
            };
          }
        }
      }
      return null;
    }
  }

  /**
   * Update user's personalization settings
   */
  async updateUserPersonalizationSettings(
    userId: string,
    settings: Partial<PersonalizationSettings>
  ): Promise<boolean> {
    try {
      const response = await fetch(this.settingsEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...settings
        }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get text response instead of JSON for error
        console.error('Error updating personalization settings:', errorText);
        throw new Error(`Failed to update settings: ${errorText || 'Unknown error'}`);
      }

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error('Error updating user personalization settings:', error);
      // Check if it's a JSON parsing error
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        console.error('Received non-JSON response from API, likely server not running or incorrect endpoint');
        // Try to save to localStorage as fallback
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          const key = `user_${userId}_personalization_settings`;
          const existingSettings = JSON.parse(localStorage.getItem(key) || '{}');
          const updatedSettings = {
            ...existingSettings,
            ...settings,
            userId,
            updatedAt: new Date().toISOString()
          };
          localStorage.setItem(key, JSON.stringify(updatedSettings));
          return true; // Indicate success since we saved locally
        }
      }
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(userId?: string): Promise<boolean> {
    if (!userId) {
      return false;
    }

    try {
      // This would typically call an auth API endpoint
      // For now, we'll assume if userId is provided, user exists
      // In a real implementation, this would check with an auth service
      const params = new URLSearchParams({
        userId: userId,
      });

      const response = await fetch(`${this.apiBaseUrl}/auth?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // If we get a 401, user is not authenticated
      if (response.status === 401) {
        return false;
      }

      return response.ok;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      // This would typically call a user profile API endpoint
      // For now, return a basic profile
      const params = new URLSearchParams({
        userId: userId,
      });

      const response = await fetch(`${this.apiBaseUrl}/profile?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching user profile:', errorData);
        throw new Error(`Failed to fetch profile: ${errorData.error?.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
}

// Export a default instance
export const clientUserService = new ClientUserService();