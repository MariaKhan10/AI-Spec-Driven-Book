export interface UserProfile {
    id: string;
    name: string | null;
    email: string;
    softwareBackground: string;
    hardwareBackground: string;
    personalizationPreferences?: Record<string, any>;
}
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
export declare class UserService {
    /**
     * Get user profile from Better Auth
     */
    getUserProfile(userId: string): Promise<UserProfile | null>;
    /**
     * Validate user profile completeness and handle incomplete/invalid profiles
     */
    private validateUserProfile;
    /**
     * Get user's personalization settings
     */
    getUserPersonalizationSettings(userId: string): Promise<PersonalizationSettings | null>;
    /**
     * Update user's personalization settings
     */
    updateUserPersonalizationSettings(userId: string, settings: Partial<PersonalizationSettings>): Promise<boolean>;
    /**
     * Helper method to extract preferred name from email if no name is provided
     */
    private extractPreferredNameFromEmail;
    /**
     * Private method to fetch user from Better Auth (simulated)
     * In a real implementation, this would make an actual API call to Better Auth
     */
    private fetchUserFromAuth;
    /**
     * Check if user is authenticated
     */
    isAuthenticated(userId?: string): Promise<boolean>;
    /**
     * Map user backgrounds to appropriate levels
     */
    mapUserBackgroundsToLevels(userProfile: UserProfile): {
        softwareLevel: 'beginner' | 'intermediate' | 'advanced';
        hardwareLevel: 'beginner' | 'intermediate' | 'advanced';
    };
    /**
     * Map background string to level
     */
    private mapBackgroundToLevel;
}
export declare const userService: UserService;
//# sourceMappingURL=userService.d.ts.map