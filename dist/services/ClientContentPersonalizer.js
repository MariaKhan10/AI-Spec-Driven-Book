"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientContentPersonalizer = exports.ClientContentPersonalizer = void 0;
/**
 * Client-side content personalizer that communicates with backend API
 */
class ClientContentPersonalizer {
    constructor(apiUrl = 'http://localhost:3001/api/personalize') {
        this.apiUrl = apiUrl;
    }
    /**
     * Personalize a chapter by calling the backend API
     */
    async personalizeChapter(chapterPath, userId) {
        const params = new URLSearchParams({
            chapter: chapterPath,
        });
        if (userId) {
            params.append('userId', userId);
        }
        try {
            const response = await fetch(`${this.apiUrl}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Personalization failed: ${errorData.error?.message || 'Unknown error'}`);
            }
            const result = await response.json();
            return {
                filename: result.filename,
                content: result.content,
                complexityLevel: result.complexityLevel,
                transformationApplied: result.transformationApplied
            };
        }
        catch (error) {
            console.error('Error personalizing chapter:', error);
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
    async personalizeContent(content, userId) {
        try {
            const response = await fetch(this.apiUrl, {
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
                const errorData = await response.json();
                throw new Error(`Personalization failed: ${errorData.error?.message || 'Unknown error'}`);
            }
            const result = await response.json();
            return {
                filename: 'dynamic-content',
                content: result.personalizedContent,
                complexityLevel: result.complexityLevel,
                transformationApplied: result.transformationApplied
            };
        }
        catch (error) {
            console.error('Error personalizing content:', error);
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
exports.ClientContentPersonalizer = ClientContentPersonalizer;
// Export a default instance
exports.clientContentPersonalizer = new ClientContentPersonalizer();
//# sourceMappingURL=ClientContentPersonalizer.js.map