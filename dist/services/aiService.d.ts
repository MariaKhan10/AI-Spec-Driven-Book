export interface PersonalizationOptions {
    complexityOverride?: 'beginner' | 'intermediate' | 'advanced';
    preserveStructure?: boolean;
}
export interface UserProfile {
    id: string;
    name: string | null;
    email: string;
    softwareBackground: string;
    hardwareBackground: string;
    personalizationPreferences?: Record<string, any>;
}
export declare class AIService {
    private genAI;
    private readonly defaultModel;
    constructor();
    /**
     * Personalizes content based on user profile
     */
    personalizeContent(content: string, userProfile: UserProfile, options?: PersonalizationOptions): Promise<string>;
    /**
     * Mock personalization that simulates AI personalization without calling the API
     */
    private mockPersonalizeContent;
    /**
     * Determines complexity level based on user profile
     */
    private determineComplexityLevel;
    /**
     * Maps background string to numeric level
     */
    private mapBackgroundToLevel;
    /**
     * Gets the preferred name from user profile
     */
    private getPreferredName;
    /**
     * Creates the personalization prompt based on content, complexity level, and user's preferred name
     */
    private createPersonalizationPrompt;
    /**
     * Batch process multiple chapters
     */
    personalizeMultipleContents(contents: Array<{
        filename: string;
        content: string;
    }>, userProfile: UserProfile, options?: PersonalizationOptions): Promise<Array<{
        filename: string;
        content: string;
        complexityLevel: string;
    }>>;
}
export declare const aiService: AIService;
//# sourceMappingURL=aiService.d.ts.map