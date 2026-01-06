"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentPersonalizer = exports.ContentPersonalizer = void 0;
const aiService_1 = require("./aiService");
const userService_1 = require("./userService");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const lru_cache_1 = require("lru-cache"); // We'll install this as needed
const logger_1 = require("./logger");
/**
 * Service for handling content personalization
 */
class ContentPersonalizer {
    constructor(aiServiceInstance, userServiceInstance) {
        this.aiService = aiServiceInstance || aiService_1.aiService;
        this.userService = userServiceInstance || userService_1.userService;
        // Initialize cache with default settings
        this.cacheTtl = parseInt(process.env.PERSONALIZATION_CACHE_TTL || '3600', 10) * 1000; // Convert to milliseconds
        this.cache = new lru_cache_1.LRUCache({
            max: 100, // Maximum 100 cached items
            ttl: this.cacheTtl,
            updateAgeOnGet: true,
        });
    }
    /**
     * Personalize a single chapter based on user profile
     */
    async personalizeChapter(chapterPath, userId) {
        logger_1.logger.info('Starting chapter personalization', { chapterPath, userId });
        // If no user ID is provided, return original content
        if (!userId) {
            logger_1.logger.info('No user ID provided, returning original content', { chapterPath });
            const originalContent = await this.readChapterContent(chapterPath);
            return {
                filename: (0, path_1.parse)(chapterPath).base,
                content: originalContent,
                complexityLevel: 'original',
                transformationApplied: false
            };
        }
        // Check if user is authenticated
        const isAuthenticated = await this.userService.isAuthenticated(userId);
        if (!isAuthenticated) {
            logger_1.logger.error('User is not authenticated', { userId });
            throw new Error(`User ${userId} is not authenticated`);
        }
        // Get user profile
        const userProfile = await this.userService.getUserProfile(userId);
        if (!userProfile) {
            logger_1.logger.warn('User profile not found, returning original content', { userId, chapterPath });
            // If user profile not found, return original content
            const originalContent = await this.readChapterContent(chapterPath);
            return {
                filename: (0, path_1.parse)(chapterPath).base,
                content: originalContent,
                complexityLevel: 'original',
                transformationApplied: false
            };
        }
        // Create cache key
        const cacheKey = this.createCacheKey(userId, chapterPath, userProfile);
        // Check if result is in cache
        const cachedResult = this.cache.get(cacheKey);
        if (cachedResult) {
            logger_1.logger.debug('Returning cached personalization result', { cacheKey });
            return cachedResult;
        }
        // Read original content
        let originalContent;
        try {
            originalContent = await this.readChapterContent(chapterPath);
        }
        catch (readError) {
            logger_1.logger.error(`Error reading chapter file ${chapterPath}`, { error: readError, userId, chapterPath });
            // Return original content with error indication if file is unreadable
            return {
                filename: (0, path_1.parse)(chapterPath).base,
                content: `# Error\n\nCould not load content for ${(0, path_1.parse)(chapterPath).name}`,
                complexityLevel: 'error',
                transformationApplied: false
            };
        }
        // Set timeout for AI processing to ensure it completes within 5 seconds
        const timeoutMs = parseInt(process.env.PERSONALIZATION_TIMEOUT || '5000', 10); // Default to 5 seconds
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Personalization timeout: processing took longer than ${timeoutMs}ms`)), timeoutMs);
        });
        // Race between AI processing and timeout
        const startTime = Date.now();
        const aiProcessingPromise = this.aiService.personalizeContent(originalContent, userProfile).then(personalizedContent => {
            const processingTime = Date.now() - startTime;
            logger_1.logger.info('AI personalization completed', { chapterPath, userId, processingTime });
            // Determine complexity level
            const { softwareLevel } = this.userService.mapUserBackgroundsToLevels(userProfile);
            const complexityLevel = softwareLevel;
            // Create result
            const result = {
                filename: (0, path_1.parse)(chapterPath).base,
                content: personalizedContent,
                complexityLevel,
                transformationApplied: true
            };
            // Store in cache
            this.cache.set(cacheKey, result);
            return result;
        }).catch(error => {
            const processingTime = Date.now() - startTime;
            logger_1.logger.error(`AI processing failed for ${chapterPath}`, { error, userId, chapterPath, processingTime });
            // If AI processing fails, return original content
            return {
                filename: (0, path_1.parse)(chapterPath).base,
                content: originalContent,
                complexityLevel: 'original',
                transformationApplied: false
            };
        });
        // Return the result that completes first (either success or timeout)
        return Promise.race([aiProcessingPromise, timeoutPromise]);
    }
    /**
     * Personalize content directly (without reading from file)
     */
    async personalizeContent(content, userId) {
        // If no user ID is provided, return original content
        if (!userId) {
            return {
                filename: 'dynamic-content',
                content: content,
                complexityLevel: 'original',
                transformationApplied: false
            };
        }
        // Check if user is authenticated
        const isAuthenticated = await this.userService.isAuthenticated(userId);
        if (!isAuthenticated) {
            throw new Error(`User ${userId} is not authenticated`);
        }
        // Get user profile
        const userProfile = await this.userService.getUserProfile(userId);
        if (!userProfile) {
            return {
                filename: 'dynamic-content',
                content: content,
                complexityLevel: 'original',
                transformationApplied: false
            };
        }
        logger_1.logger.info('Starting content personalization', { userId });
        // Set timeout for AI processing to ensure it completes within 5 seconds
        const timeoutMs = parseInt(process.env.PERSONALIZATION_TIMEOUT || '5000', 10); // Default to 5 seconds
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Personalization timeout: processing took longer than ${timeoutMs}ms`)), timeoutMs);
        });
        // Race between AI processing and timeout
        const startTime = Date.now();
        const aiProcessingPromise = this.aiService.personalizeContent(content, userProfile).then(personalizedContent => {
            const processingTime = Date.now() - startTime;
            logger_1.logger.info('AI content personalization completed', { userId, processingTime });
            // Determine complexity level
            const { softwareLevel } = this.userService.mapUserBackgroundsToLevels(userProfile);
            const complexityLevel = softwareLevel;
            return {
                filename: 'dynamic-content',
                content: personalizedContent,
                complexityLevel,
                transformationApplied: true
            };
        }).catch(error => {
            const processingTime = Date.now() - startTime;
            logger_1.logger.error(`AI processing failed for dynamic content:`, { error, userId, processingTime });
            // If AI processing fails, return original content
            return {
                filename: 'dynamic-content',
                content: content,
                complexityLevel: 'original',
                transformationApplied: false
            };
        });
        // Return the result that completes first (either success or timeout)
        return Promise.race([aiProcessingPromise, timeoutPromise]);
    }
    /**
     * Personalize multiple chapters
     */
    async personalizeMultipleChapters(chapterPaths, userId) {
        // If no user ID is provided, return original content for all chapters
        if (!userId) {
            const results = [];
            for (const path of chapterPaths) {
                const content = await this.readChapterContent(path);
                results.push({
                    filename: (0, path_1.parse)(path).base,
                    content: content,
                    complexityLevel: 'original',
                    transformationApplied: false
                });
            }
            return results;
        }
        // Check if user is authenticated
        const isAuthenticated = await this.userService.isAuthenticated(userId);
        if (!isAuthenticated) {
            throw new Error(`User ${userId} is not authenticated`);
        }
        // Get user profile
        const userProfile = await this.userService.getUserProfile(userId);
        if (!userProfile) {
            const results = [];
            for (const path of chapterPaths) {
                const content = await this.readChapterContent(path);
                results.push({
                    filename: (0, path_1.parse)(path).base,
                    content: content,
                    complexityLevel: 'original',
                    transformationApplied: false
                });
            }
            return results;
        }
        // Process chapters in batches to avoid overloading
        // Batch size is set to 10 to handle more than 10 chapters to avoid overload as per requirement
        const batchSize = parseInt(process.env.MAX_CONCURRENT_AI_REQUESTS || '10', 10);
        const results = [];
        for (let i = 0; i < chapterPaths.length; i += batchSize) {
            const batch = chapterPaths.slice(i, i + batchSize);
            const batchPromises = batch.map(async (path) => {
                try {
                    return await this.personalizeChapter(path, userId);
                }
                catch (error) {
                    console.error(`Error personalizing chapter ${path}:`, error);
                    // If personalization fails, return original content
                    try {
                        const originalContent = await this.readChapterContent(path);
                        return {
                            filename: (0, path_1.parse)(path).base,
                            content: originalContent,
                            complexityLevel: 'original',
                            transformationApplied: false
                        };
                    }
                    catch (readError) {
                        console.error(`Error reading original file ${path} after personalization failure:`, readError);
                        return {
                            filename: (0, path_1.parse)(path).base,
                            content: `# Error\n\nCould not load content for ${(0, path_1.parse)(path).name}`,
                            complexityLevel: 'error',
                            transformationApplied: false
                        };
                    }
                }
            });
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
        }
        return results;
    }
    /**
     * Get all chapter files from docs directory
     */
    async getAllChapters(docsPath = 'docs') {
        try {
            const files = await (0, promises_1.readdir)(docsPath);
            return files
                .filter(file => (0, path_1.extname)(file).toLowerCase() === '.md')
                .map(file => (0, path_1.join)(docsPath, file))
                .sort(); // Sort alphabetically as specified in requirements
        }
        catch (error) {
            console.error(`Error reading docs directory: ${error}`);
            return [];
        }
    }
    /**
     * Read chapter content from file
     */
    async readChapterContent(filePath) {
        // Check if the filePath is a URL path that needs to be converted to a file path
        let actualFilePath = filePath;
        // If it looks like a URL path (starts with /), try to convert it to a file path
        if (filePath.startsWith('/')) {
            // Remove the base URL part and convert to file path
            actualFilePath = filePath.replace('/AI-Spec-Driven-Book/docs/', 'docs/')
                .replace('/docs/', 'docs/')
                .replace(/-/g, '_') // Docusaurus often converts hyphens to underscores
                .replace(/&/g, '_&_') // Handle special characters
                .replace(/\s+/g, '_'); // Replace spaces with underscores
            // Add .md extension if missing
            if (!actualFilePath.toLowerCase().endsWith('.md')) {
                actualFilePath += '.md';
            }
        }
        else if (!filePath.toLowerCase().endsWith('.md')) {
            // If it's a relative path without .md extension, add it
            actualFilePath += '.md';
        }
        // Special handling for common mappings
        if (actualFilePath.includes('Introduction-Embodied-AI-&-Robotics') ||
            actualFilePath.includes('Introducing_Physical_AI_&_Humanoid_Robotics')) {
            // Check if this is specifically the main introduction page
            if (actualFilePath.includes('Introduction-Embodied-AI-&-Robotics')) {
                actualFilePath = 'docs/Introducing_Physical_AI_&_Humanoid_Robotics/README.md';
            }
            // If it looks like a specific chapter within the main directory
            else if (actualFilePath.includes('chapter')) {
                // Extract chapter number and map to appropriate file
                const chapterMatch = actualFilePath.match(/chapter(\d+)/i);
                if (chapterMatch) {
                    actualFilePath = `docs/Introducing_Physical_AI_&_Humanoid_Robotics/chapter${chapterMatch[1]}.md`;
                }
                else {
                    actualFilePath = 'docs/Introducing_Physical_AI_&_Humanoid_Robotics/README.md';
                }
            }
            else {
                actualFilePath = 'docs/Introducing_Physical_AI_&_Humanoid_Robotics/README.md';
            }
        }
        else if (actualFilePath.includes('intro')) {
            actualFilePath = 'docs/intro.md';
        }
        try {
            logger_1.logger.debug('Reading chapter content', { filePath, actualFilePath });
            // Try to read the file
            const content = await (0, promises_1.readFile)(actualFilePath, 'utf-8');
            return content;
        }
        catch (error) {
            logger_1.logger.error(`Error reading chapter file ${filePath} (mapped to ${actualFilePath})`, { error });
            // If the mapped path fails, try alternative mappings
            const alternativePaths = [
                filePath.replace(/-/g, '_') + '.md',
                filePath.replace(/-/g, '_') + '/index.md',
                filePath.replace(/-/g, ' ') + '.md',
                'docs/' + filePath.split('/').pop() + '.md',
                'docs/' + filePath.split('/').pop()?.replace(/-/g, '_') + '.md',
            ];
            for (const altPath of alternativePaths) {
                try {
                    logger_1.logger.debug('Trying alternative path', { altPath });
                    return await (0, promises_1.readFile)(altPath, 'utf-8');
                }
                catch {
                    continue; // Try next alternative
                }
            }
            // If all alternatives fail, try to find a matching file in docs directory
            try {
                const docsDir = 'docs';
                const files = await (0, promises_1.readdir)(docsDir, { withFileTypes: true });
                // Look for files that match the name (case-insensitive, with different separators)
                const fileName = filePath.split('/').pop()?.toLowerCase() || '';
                for (const file of files) {
                    if (file.isDirectory()) {
                        // Check if it's a directory with an index.md
                        try {
                            return await (0, promises_1.readFile)((0, path_1.join)(docsDir, file.name, 'README.md'), 'utf-8');
                        }
                        catch {
                            try {
                                return await (0, promises_1.readFile)((0, path_1.join)(docsDir, file.name, 'index.md'), 'utf-8');
                            }
                            catch {
                                // Continue to next directory
                            }
                        }
                    }
                    else if (file.name.toLowerCase().includes(fileName.replace(/[^a-z0-9]/g, ''))) {
                        // If filename contains the requested name, try to read it
                        try {
                            return await (0, promises_1.readFile)((0, path_1.join)(docsDir, file.name), 'utf-8');
                        }
                        catch {
                            // Continue to next file
                        }
                    }
                }
            }
            catch (dirError) {
                logger_1.logger.error('Error searching for alternative files', { dirError });
            }
            throw new Error(`Could not read chapter file: ${filePath}`);
        }
    }
    /**
     * Create cache key from user ID, chapter path, and complexity
     */
    createCacheKey(userId, chapterPath, userProfile) {
        // Get complexity level to include in cache key
        const { softwareLevel } = this.userService.mapUserBackgroundsToLevels(userProfile);
        return `${userId}:${chapterPath}:${softwareLevel}`;
    }
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
    /**
     * Handle error gracefully by returning original content
     */
    async handleError(filePath, error, userId) {
        console.error(`Error in personalization process for ${filePath}:`, error);
        // Try to return original content
        try {
            const content = await this.readChapterContent(filePath);
            return {
                filename: (0, path_1.parse)(filePath).base,
                content,
                complexityLevel: 'original',
                transformationApplied: false
            };
        }
        catch (readError) {
            console.error(`Error reading original file after personalization failure:`, readError);
            // Return a default error message if we can't even read the original file
            return {
                filename: (0, path_1.parse)(filePath).base,
                content: `# Error\n\nCould not load content for ${(0, path_1.parse)(filePath).name}`,
                complexityLevel: 'error',
                transformationApplied: false
            };
        }
    }
}
exports.ContentPersonalizer = ContentPersonalizer;
// Export singleton instance
exports.contentPersonalizer = new ContentPersonalizer();
//# sourceMappingURL=contentPersonalizer.js.map