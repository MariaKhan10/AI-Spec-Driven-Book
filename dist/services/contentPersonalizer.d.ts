import { AIService } from './aiService';
import { UserService } from './userService';
interface PersonalizationResult {
    filename: string;
    content: string;
    complexityLevel: string;
    transformationApplied: boolean;
}
/**
 * Service for handling content personalization
 */
export declare class ContentPersonalizer {
    private aiService;
    private userService;
    private cache;
    private readonly cacheTtl;
    constructor(aiServiceInstance?: AIService, userServiceInstance?: UserService);
    /**
     * Personalize a single chapter based on user profile
     */
    personalizeChapter(chapterPath: string, userId?: string): Promise<PersonalizationResult>;
    /**
     * Personalize content directly (without reading from file)
     */
    personalizeContent(content: string, userId?: string): Promise<PersonalizationResult>;
    /**
     * Personalize multiple chapters
     */
    personalizeMultipleChapters(chapterPaths: string[], userId?: string): Promise<PersonalizationResult[]>;
    /**
     * Get all chapter files from docs directory
     */
    getAllChapters(docsPath?: string): Promise<string[]>;
    /**
     * Read chapter content from file
     */
    private readChapterContent;
    /**
     * Create cache key from user ID, chapter path, and complexity
     */
    private createCacheKey;
    /**
     * Clear cache
     */
    clearCache(): void;
    /**
     * Get cache statistics
     */
    getCacheStats(): {
        size: number;
        keys: string[];
    };
    /**
     * Handle error gracefully by returning original content
     */
    handleError(filePath: string, error: any, userId?: string): Promise<PersonalizationResult>;
}
export declare const contentPersonalizer: ContentPersonalizer;
export {};
//# sourceMappingURL=contentPersonalizer.d.ts.map