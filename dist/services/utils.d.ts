/**
 * Utility functions for background level mapping and other helper functions
 */
/**
 * Maps user background string to appropriate level
 * @param background - The user's background string (e.g., "beginner", "intermediate", "advanced", "Unknown")
 * @returns The mapped level as 'beginner' | 'intermediate' | 'advanced' | 'unknown'
 */
export declare function mapBackgroundToLevel(background: string): 'beginner' | 'intermediate' | 'advanced' | 'unknown';
/**
 * Calculates the average complexity level from software and hardware backgrounds
 * @param softwareBackground - User's software background
 * @param hardwareBackground - User's hardware background
 * @returns The average complexity level
 */
export declare function calculateAverageComplexity(softwareBackground: string, hardwareBackground: string): 'beginner' | 'intermediate' | 'advanced';
/**
 * Derives a friendly alias from user's email username if preferred name is not available
 * @param email - The user's email address
 * @param fallback - Fallback name if email parsing fails
 * @returns A friendly name derived from the email
 */
export declare function deriveNameFromEmail(email: string, fallback?: string): string;
/**
 * Determines the appropriate complexity level with fallback logic
 * @param softwareBackground - User's software background
 * @param hardwareBackground - User's hardware background
 * @param defaultLevel - Default level to return if both are 'unknown'
 * @returns The appropriate complexity level
 */
export declare function determineComplexityLevel(softwareBackground: string, hardwareBackground: string, defaultLevel?: 'beginner' | 'intermediate' | 'advanced'): 'beginner' | 'intermediate' | 'advanced';
/**
 * Validates if a file is a Markdown file
 * @param filename - The filename to check
 * @returns True if the file is a Markdown file, false otherwise
 */
export declare function isMarkdownFile(filename: string): boolean;
/**
 * Checks if content is valid Markdown by looking for common elements
 * @param content - The content to validate
 * @returns True if content appears to be valid Markdown, false otherwise
 */
export declare function isValidMarkdown(content: string): boolean;
/**
 * Safely parses JSON with error handling
 * @param jsonString - The JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns The parsed object or fallback value
 */
export declare function safeJsonParse<T>(jsonString: string, fallback: T): T;
/**
 * Generates a cache key from multiple components
 * @param components - Components to include in the cache key
 * @returns A string cache key
 */
export declare function generateCacheKey(...components: string[]): string;
/**
 * Waits for a specified amount of time (useful for rate limiting)
 * @param ms - Number of milliseconds to wait
 * @returns A promise that resolves after the specified time
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Creates a standardized error response for API endpoints
 * @param code - Error code
 * @param message - Human-readable error message
 * @param details - Additional error details (optional)
 * @returns Standardized error object
 */
export declare function createErrorResponse(code: string, message: string, details?: string): {
    error: {
        code: string;
        message: string;
        details?: string;
    };
};
/**
 * Handles errors gracefully by logging and returning a fallback value
 * @param operationName - Name of the operation being performed
 * @param operation - The operation to execute
 * @param fallbackValue - Value to return if operation fails
 * @returns Result of operation or fallback value
 */
export declare function handleGracefulError<T>(operationName: string, operation: () => Promise<T>, fallbackValue: T): Promise<T>;
/**
 * Handles errors with retry logic
 * @param operation - The operation to execute
 * @param maxRetries - Maximum number of retry attempts
 * @param retryDelay - Delay between retries in milliseconds
 * @returns Result of operation or throws if all retries fail
 */
export declare function handleRetryableError<T>(operation: () => Promise<T>, maxRetries?: number, retryDelay?: number): Promise<T>;
/**
 * Validates user profile data and provides default values for missing fields
 * @param profile - Raw user profile data
 * @returns Validated and normalized user profile
 */
export declare function validateUserProfile(profile: any): {
    id: string;
    name: string | null;
    email: string;
    softwareBackground: string;
    hardwareBackground: string;
    personalizationPreferences?: Record<string, any>;
};
/**
 * Validates if user backgrounds are valid
 * @param softwareBackground - User's software background
 * @param hardwareBackground - User's hardware background
 * @returns True if both backgrounds are valid, false otherwise
 */
export declare function areValidUserBackgrounds(softwareBackground: string, hardwareBackground: string): boolean;
/**
 * Provides a default response when AI service fails
 * @param originalContent - The original content to return as fallback
 * @param error - The error that occurred
 * @returns Original content with error information
 */
export declare function getAIServiceFallback(originalContent: string, error?: any): {
    content: string;
    complexityLevel: string;
    transformationApplied: boolean;
    error?: any;
};
/**
 * Checks if an error is a timeout error
 * @param error - The error to check
 * @returns True if the error is a timeout error, false otherwise
 */
export declare function isTimeoutError(error: any): boolean;
/**
 * Checks if an error is related to API limits or rate limiting
 * @param error - The error to check
 * @returns True if the error is related to API limits, false otherwise
 */
export declare function isRateLimitError(error: any): boolean;
//# sourceMappingURL=utils.d.ts.map