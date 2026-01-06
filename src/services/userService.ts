import { logger } from './logger';

// Define User interface for our application
interface User {
  id: string;
  email: string;
  name?: string;
  softwareBackground?: string;
  hardwareBackground?: string;
  personalizationPreferences?: Record<string, any>;
}

// Define UserProfile interface matching our data model
export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  softwareBackground: string;
  hardwareBackground: string;
  personalizationPreferences?: Record<string, any>;
}

// Define PersonalizationSettings interface
export interface PersonalizationSettings {
  userId: string;
  preferredName: string;
  contentComplexity: string;
  learningStyle: string;
  technicalDepthPreference: string;
  updatedAt: Date;
}

/**
 * Service for handling user-related operations and Better Auth integration
 */
export class UserService {
  /**
   * Get user profile from Better Auth
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      // In a real implementation, this would call the Better Auth API
      // For now, we'll simulate the call
      const user = await this.fetchUserFromAuth(userId);

      if (!user) {
        return null;
      }

      // Validate user profile completeness
      const isValidProfile = this.validateUserProfile(user);
      if (!isValidProfile) {
        console.warn(`Incomplete or invalid user profile for userId: ${userId}`);
      }

      // Return the user profile in the format expected by the personalization service
      return {
        id: user.id,
        name: user.name || null,
        email: user.email,
        softwareBackground: user.softwareBackground || 'Unknown',
        hardwareBackground: user.hardwareBackground || 'Unknown',
        personalizationPreferences: user.personalizationPreferences || {}
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Validate user profile completeness and handle incomplete/invalid profiles
   */
  private validateUserProfile(user: User): boolean {
    if (!user.email) {
      console.warn('User profile missing required email field');
      return false;
    }

    // Check if backgrounds are provided and valid
    const softwareBg = user.softwareBackground;
    const hardwareBg = user.hardwareBackground;

    // If both backgrounds are 'Unknown' or empty, profile might be incomplete
    if (
      (!softwareBg || softwareBg === 'Unknown' || softwareBg.trim() === '') &&
      (!hardwareBg || hardwareBg === 'Unknown' || hardwareBg.trim() === '')
    ) {
      console.warn('User profile has incomplete background information (both software and hardware backgrounds are unknown/empty)');
      return false;
    }

    // Validate background values are within expected ranges
    const validBackgrounds = ['beginner', 'intermediate', 'advanced', 'Unknown'];
    const softwareValid = !softwareBg || validBackgrounds.some(bg =>
      bg.toLowerCase() === softwareBg.toLowerCase());
    const hardwareValid = !hardwareBg || validBackgrounds.some(bg =>
      bg.toLowerCase() === hardwareBg.toLowerCase());

    if (!softwareValid || !hardwareValid) {
      console.warn('User profile has invalid background values');
      return false;
    }

    return true;
  }

  /**
   * Get user's personalization settings
   */
  async getUserPersonalizationSettings(userId: string): Promise<PersonalizationSettings | null> {
    try {
      // Check if we're in a browser environment (client-side)
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        // Try to get from localStorage first (our mock storage)
        const key = `user_${userId}_personalization_settings`;
        const storedSettings = localStorage.getItem(key);

        if (storedSettings) {
          const settings = JSON.parse(storedSettings);
          return {
            ...settings,
            updatedAt: new Date(settings.updatedAt) // Convert back to Date object
          };
        }
      }

      // If not in browser or not found in storage, return default settings
      const user = await this.fetchUserFromAuth(userId);

      if (!user) {
        return null;
      }

      // In a real implementation, this would fetch from a personalization settings store
      return {
        userId: user.id,
        preferredName: user.name || this.extractPreferredNameFromEmail(user.email),
        contentComplexity: 'balanced', // Default to balanced
        learningStyle: 'practical',
        technicalDepthPreference: 'moderate',
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error fetching user personalization settings:', error);
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
      // In a real implementation, this would update the database
      // For now, we'll simulate storing the settings
      console.log(`Updating personalization settings for user ${userId}:`, settings);

      // Update the user's personalization preferences in the auth system
      // This is a simplified implementation for the demo
      if (settings.contentComplexity) {
        // In a real app, this would update the user's preferences in the auth system
        console.log(`Setting content complexity to: ${settings.contentComplexity}`);
      }

      // Store in localStorage as a simple mock implementation, but only on client-side
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
      }

      return true;
    } catch (error) {
      console.error('Error updating user personalization settings:', error);
      return false;
    }
  }

  /**
   * Helper method to extract preferred name from email if no name is provided
   */
  private extractPreferredNameFromEmail(email: string): string {
    if (!email) return 'Reader';

    const username = email.split('@')[0];
    // Capitalize the first letter of the username
    return username.charAt(0).toUpperCase() + username.slice(1);
  }

  /**
   * Private method to fetch user from Better Auth (simulated)
   * In a real implementation, this would make an actual API call to Better Auth
   */
  private async fetchUserFromAuth(userId: string): Promise<User | null> {
    // This is a placeholder implementation
    // In a real application, this would call the Better Auth API
    // to get the user's information
    console.log(`Fetching user from Better Auth: ${userId}`);

    // Simulate a user object with dynamic values based on userId
    // In reality, this would come from the Better Auth service
    const userBackgrounds = this.determineUserBackgroundsFromId(userId);

    return {
      id: userId,
      email: `user-${userId}@example.com`,
      name: this.generateUserNameFromId(userId),
      // These would be custom fields in Better Auth
      softwareBackground: userBackgrounds.software,
      hardwareBackground: userBackgrounds.hardware,
      personalizationPreferences: {}
    } as User;
  }

  /**
   * Helper method to determine user backgrounds based on userId
   */
  private determineUserBackgroundsFromId(userId: string): { software: string, hardware: string } {
    // Use the userId to generate deterministic backgrounds
    // This allows for consistent behavior while testing different user types
    const hash = this.simpleHash(userId);
    const softwareLevels = ['beginner', 'intermediate', 'advanced'];
    const hardwareLevels = ['beginner', 'intermediate', 'advanced'];

    return {
      software: softwareLevels[hash % softwareLevels.length],
      hardware: hardwareLevels[(hash + 1) % hardwareLevels.length] // Offset to get different values
    };
  }

  /**
   * Helper method to generate a user name from userId
   */
  private generateUserNameFromId(userId: string): string {
    // Extract a name-like string from the userId
    // In a real app, this would come from the auth service
    if (userId.length >= 8) {
      const namePart = userId.substring(0, 8);
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return 'User';
  }

  /**
   * Simple hash function for deterministic user background assignment
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(userId?: string): Promise<boolean> {
    if (!userId) {
      return false;
    }

    try {
      const user = await this.fetchUserFromAuth(userId);
      return user !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Map user backgrounds to appropriate levels
   */
  mapUserBackgroundsToLevels(userProfile: UserProfile): {
    softwareLevel: 'beginner' | 'intermediate' | 'advanced',
    hardwareLevel: 'beginner' | 'intermediate' | 'advanced'
  } {
    const softwareLevel = this.mapBackgroundToLevel(userProfile.softwareBackground);
    const hardwareLevel = this.mapBackgroundToLevel(userProfile.hardwareBackground);

    return { softwareLevel, hardwareLevel };
  }

  /**
   * Map background string to level
   */
  private mapBackgroundToLevel(background: string): 'beginner' | 'intermediate' | 'advanced' {
    if (!background) {
      return 'beginner'; // Default to beginner for undefined/null backgrounds
    }

    const bg = background.toLowerCase();

    if (bg.includes('beginner') || bg.includes('novice') || bg.includes('new') || bg === 'unknown' || !bg.trim()) {
      return 'beginner';
    } else if (bg.includes('intermediate') || bg.includes('some experience')) {
      return 'intermediate';
    } else if (bg.includes('advanced') || bg.includes('expert') || bg.includes('years of experience')) {
      return 'advanced';
    } else {
      // For any other invalid/unknown values, default to intermediate as specified
      return 'intermediate';
    }
  }
}

// Export singleton instance
export const userService = new UserService();