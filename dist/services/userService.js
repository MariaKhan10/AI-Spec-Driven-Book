"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
/**
 * Service for handling user-related operations and Better Auth integration
 */
class UserService {
    /**
     * Get user profile from Better Auth
     */
    async getUserProfile(userId) {
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
        }
        catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }
    /**
     * Validate user profile completeness and handle incomplete/invalid profiles
     */
    validateUserProfile(user) {
        if (!user.email) {
            console.warn('User profile missing required email field');
            return false;
        }
        // Check if backgrounds are provided and valid
        const softwareBg = user.softwareBackground;
        const hardwareBg = user.hardwareBackground;
        // If both backgrounds are 'Unknown' or empty, profile might be incomplete
        if ((!softwareBg || softwareBg === 'Unknown' || softwareBg.trim() === '') &&
            (!hardwareBg || hardwareBg === 'Unknown' || hardwareBg.trim() === '')) {
            console.warn('User profile has incomplete background information (both software and hardware backgrounds are unknown/empty)');
            return false;
        }
        // Validate background values are within expected ranges
        const validBackgrounds = ['beginner', 'intermediate', 'advanced', 'Unknown'];
        const softwareValid = !softwareBg || validBackgrounds.some(bg => bg.toLowerCase() === softwareBg.toLowerCase());
        const hardwareValid = !hardwareBg || validBackgrounds.some(bg => bg.toLowerCase() === hardwareBg.toLowerCase());
        if (!softwareValid || !hardwareValid) {
            console.warn('User profile has invalid background values');
            return false;
        }
        return true;
    }
    /**
     * Get user's personalization settings
     */
    async getUserPersonalizationSettings(userId) {
        try {
            // This would typically fetch from a database or API
            // For now, we'll return default settings
            const user = await this.fetchUserFromAuth(userId);
            if (!user) {
                return null;
            }
            // In a real implementation, this would fetch from a personalization settings store
            return {
                userId: user.id,
                preferredName: user.name || this.extractPreferredNameFromEmail(user.email),
                contentComplexity: 'balanced',
                learningStyle: 'practical',
                technicalDepthPreference: 'moderate',
                updatedAt: new Date()
            };
        }
        catch (error) {
            console.error('Error fetching user personalization settings:', error);
            return null;
        }
    }
    /**
     * Update user's personalization settings
     */
    async updateUserPersonalizationSettings(userId, settings) {
        try {
            // In a real implementation, this would update the database
            // For now, we'll just return success
            console.log(`Updating personalization settings for user ${userId}:`, settings);
            return true;
        }
        catch (error) {
            console.error('Error updating user personalization settings:', error);
            return false;
        }
    }
    /**
     * Helper method to extract preferred name from email if no name is provided
     */
    extractPreferredNameFromEmail(email) {
        if (!email)
            return 'Reader';
        const username = email.split('@')[0];
        // Capitalize the first letter of the username
        return username.charAt(0).toUpperCase() + username.slice(1);
    }
    /**
     * Private method to fetch user from Better Auth (simulated)
     * In a real implementation, this would make an actual API call to Better Auth
     */
    async fetchUserFromAuth(userId) {
        // This is a placeholder implementation
        // In a real application, this would call the Better Auth API
        // to get the user's information
        console.log(`Fetching user from Better Auth: ${userId}`);
        // Simulate a user object
        // In reality, this would come from the Better Auth service
        return {
            id: userId,
            email: 'user@example.com',
            name: 'Test User',
            // These would be custom fields in Better Auth
            softwareBackground: 'intermediate',
            hardwareBackground: 'beginner',
            personalizationPreferences: {}
        };
    }
    /**
     * Check if user is authenticated
     */
    async isAuthenticated(userId) {
        if (!userId) {
            return false;
        }
        try {
            const user = await this.fetchUserFromAuth(userId);
            return user !== null;
        }
        catch (error) {
            console.error('Error checking authentication:', error);
            return false;
        }
    }
    /**
     * Map user backgrounds to appropriate levels
     */
    mapUserBackgroundsToLevels(userProfile) {
        const softwareLevel = this.mapBackgroundToLevel(userProfile.softwareBackground);
        const hardwareLevel = this.mapBackgroundToLevel(userProfile.hardwareBackground);
        return { softwareLevel, hardwareLevel };
    }
    /**
     * Map background string to level
     */
    mapBackgroundToLevel(background) {
        if (!background) {
            return 'beginner'; // Default to beginner for undefined/null backgrounds
        }
        const bg = background.toLowerCase();
        if (bg.includes('beginner') || bg.includes('novice') || bg.includes('new') || bg === 'unknown' || !bg.trim()) {
            return 'beginner';
        }
        else if (bg.includes('intermediate') || bg.includes('some experience')) {
            return 'intermediate';
        }
        else if (bg.includes('advanced') || bg.includes('expert') || bg.includes('years of experience')) {
            return 'advanced';
        }
        else {
            // For any other invalid/unknown values, default to intermediate as specified
            return 'intermediate';
        }
    }
}
exports.UserService = UserService;
// Export singleton instance
exports.userService = new UserService();
//# sourceMappingURL=userService.js.map