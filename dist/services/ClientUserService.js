"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientUserService = exports.ClientUserService = void 0;
/**
 * Client-side user service that communicates with backend API
 */
class ClientUserService {
    constructor(apiUrl = 'http://localhost:3001/api/personalization-settings') {
        this.apiUrl = apiUrl;
    }
    /**
     * Get user's personalization settings
     */
    async getUserPersonalizationSettings(userId) {
        try {
            const params = new URLSearchParams({
                userId: userId,
            });
            const response = await fetch(`${this.apiUrl}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error fetching personalization settings:', errorData);
                throw new Error(`Failed to fetch settings: ${errorData.error?.message || 'Unknown error'}`);
            }
            const result = await response.json();
            return {
                ...result,
                updatedAt: new Date(result.updatedAt) // Convert to Date object if needed
            };
        }
        catch (error) {
            console.error('Error getting user personalization settings:', error);
            return null;
        }
    }
    /**
     * Update user's personalization settings
     */
    async updateUserPersonalizationSettings(userId, settings) {
        try {
            const response = await fetch(this.apiUrl, {
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
                const errorData = await response.json();
                console.error('Error updating personalization settings:', errorData);
                throw new Error(`Failed to update settings: ${errorData.error?.message || 'Unknown error'}`);
            }
            const result = await response.json();
            return result.success || false;
        }
        catch (error) {
            console.error('Error updating user personalization settings:', error);
            return false;
        }
    }
    /**
     * Check if user is authenticated
     */
    async isAuthenticated(userId) {
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
            const response = await fetch(`${this.apiUrl}/auth?${params.toString()}`, {
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
        }
        catch (error) {
            console.error('Error checking authentication:', error);
            return false;
        }
    }
    /**
     * Get user profile
     */
    async getUserProfile(userId) {
        try {
            // This would typically call a user profile API endpoint
            // For now, return a basic profile
            const params = new URLSearchParams({
                userId: userId,
            });
            const response = await fetch(`${this.apiUrl}/profile?${params.toString()}`, {
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
        }
        catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    }
}
exports.ClientUserService = ClientUserService;
// Export a default instance
exports.clientUserService = new ClientUserService();
//# sourceMappingURL=ClientUserService.js.map