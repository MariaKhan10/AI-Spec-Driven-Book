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
export declare class ClientUserService {
    private readonly apiUrl;
    constructor(apiUrl?: string);
    /**
     * Get user's personalization settings
     */
    getUserPersonalizationSettings(userId: string): Promise<PersonalizationSettings | null>;
    /**
     * Update user's personalization settings
     */
    updateUserPersonalizationSettings(userId: string, settings: Partial<PersonalizationSettings>): Promise<boolean>;
    /**
     * Check if user is authenticated
     */
    isAuthenticated(userId?: string): Promise<boolean>;
    /**
     * Get user profile
     */
    getUserProfile(userId: string): Promise<UserProfile | null>;
}
export declare const clientUserService: ClientUserService;
export {};
//# sourceMappingURL=ClientUserService.d.ts.map