interface PersonalizationResult {
    filename: string;
    content: string;
    complexityLevel: string;
    transformationApplied: boolean;
}
/**
 * Client-side content personalizer that communicates with backend API
 */
export declare class ClientContentPersonalizer {
    private readonly apiUrl;
    constructor(apiUrl?: string);
    /**
     * Personalize a chapter by calling the backend API
     */
    personalizeChapter(chapterPath: string, userId?: string): Promise<PersonalizationResult>;
    /**
     * Personalize content by calling the backend API
     */
    personalizeContent(content: string, userId?: string): Promise<PersonalizationResult>;
}
export declare const clientContentPersonalizer: ClientContentPersonalizer;
export {};
//# sourceMappingURL=ClientContentPersonalizer.d.ts.map