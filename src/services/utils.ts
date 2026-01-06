/**
 * Utility functions for background level mapping and other helper functions
 */

/**
 * Maps user background string to appropriate level
 * @param background - The user's background string (e.g., "beginner", "intermediate", "advanced", "Unknown")
 * @returns The mapped level as 'beginner' | 'intermediate' | 'advanced' | 'unknown'
 */
export function mapBackgroundToLevel(background: string): 'beginner' | 'intermediate' | 'advanced' | 'unknown' {
  const bg = background.toLowerCase();

  if (bg.includes('beginner') || bg.includes('novice') || bg.includes('new') || bg === 'unknown' || !bg.trim()) {
    return 'beginner';
  } else if (bg.includes('intermediate') || bg.includes('some experience')) {
    return 'intermediate';
  } else if (bg.includes('advanced') || bg.includes('expert') || bg.includes('years of experience')) {
    return 'advanced';
  } else {
    return 'unknown';
  }
}

/**
 * Calculates the average complexity level from software and hardware backgrounds
 * @param softwareBackground - User's software background
 * @param hardwareBackground - User's hardware background
 * @returns The average complexity level
 */
export function calculateAverageComplexity(
  softwareBackground: string,
  hardwareBackground: string
): 'beginner' | 'intermediate' | 'advanced' {
  const softwareLevel = mapBackgroundToNumericLevel(softwareBackground);
  const hardwareLevel = mapBackgroundToNumericLevel(hardwareBackground);

  // Calculate average level
  const averageLevel = (softwareLevel + hardwareLevel) / 2;

  // Return complexity level based on average
  if (averageLevel <= 1.5) {
    return 'beginner';
  } else if (averageLevel <= 2.5) {
    return 'intermediate';
  } else {
    return 'advanced';
  }
}

/**
 * Maps background string to numeric level (1 = beginner, 2 = intermediate, 3 = advanced)
 * @param background - The user's background string
 * @returns The numeric level (1, 2, or 3)
 */
function mapBackgroundToNumericLevel(background: string): number {
  const bg = background.toLowerCase();

  if (bg.includes('beginner') || bg.includes('novice') || bg.includes('new') || bg === 'unknown' || !bg.trim()) {
    return 1; // beginner
  } else if (bg.includes('intermediate') || bg.includes('some experience')) {
    return 2; // intermediate
  } else {
    return 3; // advanced
  }
}

/**
 * Derives a friendly alias from user's email username if preferred name is not available
 * @param email - The user's email address
 * @param fallback - Fallback name if email parsing fails
 * @returns A friendly name derived from the email
 */
export function deriveNameFromEmail(email: string, fallback: string = 'Reader'): string {
  if (!email) return fallback;

  const username = email.split('@')[0];
  if (!username) return fallback;

  // Capitalize the first letter of the username
  return username.charAt(0).toUpperCase() + username.slice(1);
}

/**
 * Determines the appropriate complexity level with fallback logic
 * @param softwareBackground - User's software background
 * @param hardwareBackground - User's hardware background
 * @param defaultLevel - Default level to return if both are 'unknown'
 * @returns The appropriate complexity level
 */
export function determineComplexityLevel(
  softwareBackground: string,
  hardwareBackground: string,
  defaultLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
): 'beginner' | 'intermediate' | 'advanced' {
  // If both backgrounds are unknown, use default
  if (
    mapBackgroundToLevel(softwareBackground) === 'unknown' &&
    mapBackgroundToLevel(hardwareBackground) === 'unknown'
  ) {
    return defaultLevel;
  }

  // Calculate average complexity
  return calculateAverageComplexity(softwareBackground, hardwareBackground);
}

/**
 * Validates if a file is a Markdown file
 * @param filename - The filename to check
 * @returns True if the file is a Markdown file, false otherwise
 */
export function isMarkdownFile(filename: string): boolean {
  return /\.mdx?$/.test(filename.toLowerCase());
}

/**
 * Checks if content is valid Markdown by looking for common elements
 * @param content - The content to validate
 * @returns True if content appears to be valid Markdown, false otherwise
 */
export function isValidMarkdown(content: string): boolean {
  // Basic check: does it contain common Markdown elements?
  const commonMarkdownPatterns = [
    /^#{1,6}\s/, // Headers
    /^\s*[-*+]\s/, // Unordered lists
    /^\s*\d+\.\s/, // Ordered lists
    /`[^`]+`/, // Inline code
    /```[\s\S]*?```/, // Code blocks
    /\[.*\]\(.*\)/, // Links
    /\*\*.*\*\*|__.*__/, // Bold
    /\*.*\*|_.*_/ // Italic
  ];

  return commonMarkdownPatterns.some(pattern => pattern.test(content));
}

/**
 * Safely parses JSON with error handling
 * @param jsonString - The JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns The parsed object or fallback value
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
}

/**
 * Generates a cache key from multiple components
 * @param components - Components to include in the cache key
 * @returns A string cache key
 */
export function generateCacheKey(...components: string[]): string {
  return components.filter(c => c !== undefined && c !== null).join(':');
}

/**
 * Waits for a specified amount of time (useful for rate limiting)
 * @param ms - Number of milliseconds to wait
 * @returns A promise that resolves after the specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a standardized error response for API endpoints
 * @param code - Error code
 * @param message - Human-readable error message
 * @param details - Additional error details (optional)
 * @returns Standardized error object
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: string
): { error: { code: string; message: string; details?: string } } {
  const errorResponse: { error: { code: string; message: string; details?: string } } = {
    error: {
      code,
      message
    }
  };

  if (details) {
    errorResponse.error.details = details;
  }

  return errorResponse;
}

/**
 * Handles errors gracefully by logging and returning a fallback value
 * @param operationName - Name of the operation being performed
 * @param operation - The operation to execute
 * @param fallbackValue - Value to return if operation fails
 * @returns Result of operation or fallback value
 */
export async function handleGracefulError<T>(
  operationName: string,
  operation: () => Promise<T>,
  fallbackValue: T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(`Error in ${operationName}:`, error);
    return fallbackValue;
  }
}

/**
 * Handles errors with retry logic
 * @param operation - The operation to execute
 * @param maxRetries - Maximum number of retry attempts
 * @param retryDelay - Delay between retries in milliseconds
 * @returns Result of operation or throws if all retries fail
 */
export async function handleRetryableError<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        console.warn(`Attempt ${attempt + 1} failed, retrying in ${retryDelay}ms...`, error);
        await sleep(retryDelay);
      }
    }
  }

  throw lastError;
}

/**
 * Validates user profile data and provides default values for missing fields
 * @param profile - Raw user profile data
 * @returns Validated and normalized user profile
 */
export function validateUserProfile(profile: any): {
  id: string;
  name: string | null;
  email: string;
  softwareBackground: string;
  hardwareBackground: string;
  personalizationPreferences?: Record<string, any>;
} {
  if (!profile) {
    throw new Error('User profile is required');
  }

  return {
    id: profile.id || '',
    name: profile.name || null,
    email: profile.email || '',
    softwareBackground: profile.softwareBackground || 'Unknown',
    hardwareBackground: profile.hardwareBackground || 'Unknown',
    personalizationPreferences: profile.personalizationPreferences || {}
  };
}

/**
 * Validates if user backgrounds are valid
 * @param softwareBackground - User's software background
 * @param hardwareBackground - User's hardware background
 * @returns True if both backgrounds are valid, false otherwise
 */
export function areValidUserBackgrounds(softwareBackground: string, hardwareBackground: string): boolean {
  const validLevels = ['beginner', 'intermediate', 'advanced', 'unknown'];

  const softwareValid = validLevels.some(level =>
    softwareBackground.toLowerCase().includes(level)
  );

  const hardwareValid = validLevels.some(level =>
    hardwareBackground.toLowerCase().includes(level)
  );

  return softwareValid && hardwareValid;
}

/**
 * Provides a default response when AI service fails
 * @param originalContent - The original content to return as fallback
 * @param error - The error that occurred
 * @returns Original content with error information
 */
export function getAIServiceFallback(
  originalContent: string,
  error?: any
): { content: string; complexityLevel: string; transformationApplied: boolean; error?: any } {
  console.error('AI Service failed, returning original content:', error);

  const result: { content: string; complexityLevel: string; transformationApplied: boolean; error?: any } = {
    content: originalContent,
    complexityLevel: 'original',
    transformationApplied: false
  };

  if (error) {
    result.error = error;
  }

  return result;
}

/**
 * Checks if an error is a timeout error
 * @param error - The error to check
 * @returns True if the error is a timeout error, false otherwise
 */
export function isTimeoutError(error: any): boolean {
  return error && (
    error.name === 'TimeoutError' ||
    (error.message && error.message.toLowerCase().includes('timeout')) ||
    (error.code && error.code === 'TIMEOUT') ||
    (error.status === 408) // Request Timeout
  );
}

/**
 * Checks if an error is related to API limits or rate limiting
 * @param error - The error to check
 * @returns True if the error is related to API limits, false otherwise
 */
export function isRateLimitError(error: any): boolean {
  return error && (
    error.status === 429 || // Too Many Requests
    (error.message && (
      error.message.toLowerCase().includes('rate limit') ||
      error.message.toLowerCase().includes('too many requests') ||
      error.message.toLowerCase().includes('quota') ||
      error.message.toLowerCase().includes('exceeded')
    ))
  );
}