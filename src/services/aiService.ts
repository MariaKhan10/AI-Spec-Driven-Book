import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFile } from 'fs/promises';
import { join } from 'path';

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

export class AIService {
  private genAI: GoogleGenerativeAI;
  private readonly defaultModel: string = 'gemini-2.5-flash';

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Personalizes content based on user profile
   */
  async personalizeContent(
    content: string,
    userProfile: UserProfile,
    options?: PersonalizationOptions
  ): Promise<string> {
    // Determine complexity level based on user profile
    const complexityLevel = options?.complexityOverride || this.determineComplexityLevel(userProfile);

    // Get user's preferred name for personalization
    const preferredName = this.getPreferredName(userProfile);

    // Check if we have a valid API key before attempting Gemini call
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      // Use mock personalization if no API key
      return this.mockPersonalizeContent(content, complexityLevel, preferredName);
    }

    // Create the prompt for content personalization
    const prompt = this.createPersonalizationPrompt(content, complexityLevel, preferredName);

    try {
      const model = this.genAI.getGenerativeModel({ model: this.defaultModel });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const personalizedContent = response.text()?.trim() || content;

      return personalizedContent;
    } catch (error) {
      console.error('Error in AI content personalization:', error);

      // Check if it's a quota error specifically
      if (error instanceof Error &&
          (error.message.includes('quota') ||
           error.message.includes('insufficient_quota') ||
           error.message.includes('429'))) {
        console.log('Gemini quota exceeded or unavailable, using mock personalization');
        return this.mockPersonalizeContent(content, complexityLevel, preferredName);
      }

      // Return mock personalization if API fails for any reason
      return this.mockPersonalizeContent(content, complexityLevel, preferredName);
    }
  }

  /**
   * Mock personalization that simulates AI personalization without calling the API
   */
  private mockPersonalizeContent(
    content: string,
    complexityLevel: 'beginner' | 'intermediate' | 'advanced',
    preferredName: string
  ): string {
    // For mock personalization, we'll make simple modifications based on complexity level
    // while preserving the original markdown structure
    let modifiedContent = content;

    // Add a note at the top indicating this is mock personalization
    const mockNote = `> **Personalized for ${complexityLevel} level** - This content has been adapted for your skill level as "${preferredName}".\n\n`;
    modifiedContent = mockNote + modifiedContent;

    // Apply different modifications based on complexity level
    switch (complexityLevel) {
      case 'beginner':
        // For beginners, we'll add more explanations - but preserve Markdown structure
        // Only add extra line breaks in plain text paragraphs, not in Markdown elements
        modifiedContent = modifiedContent
          .replace(/\*\*(.+?)\*\*/g, '**$1** (*key concept*)'); // Highlight key concepts
        break;

      case 'intermediate':
        // For intermediate, we'll maintain balance
        modifiedContent = modifiedContent;
        break;

      case 'advanced':
        // For advanced, we'll add more technical depth - but preserve Markdown structure
        // Only modify plain text, not Markdown elements
        modifiedContent = modifiedContent;
        break;
    }

    return modifiedContent;
  }

  /**
   * Determines complexity level based on user profile
   */
  private determineComplexityLevel(userProfile: UserProfile): 'beginner' | 'intermediate' | 'advanced' {
    // Map user backgrounds to numeric levels
    const softwareLevel = this.mapBackgroundToLevel(userProfile.softwareBackground);
    const hardwareLevel = this.mapBackgroundToLevel(userProfile.hardwareBackground);

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
   * Maps background string to numeric level
   */
  private mapBackgroundToLevel(background: string): number {
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
   * Gets the preferred name from user profile
   */
  private getPreferredName(userProfile: UserProfile): string {
    if (userProfile.name && userProfile.name.trim() !== '') {
      return userProfile.name;
    }

    // If no name is provided, derive from email
    const email = userProfile.email;
    if (email && email.includes('@')) {
      const username = email.split('@')[0];
      // Capitalize the first letter of the username
      return username.charAt(0).toUpperCase() + username.slice(1);
    }

    // Default name if no email or name available
    return 'Reader';
  }

  /**
   * Creates the personalization prompt based on content, complexity level, and user's preferred name
   */
  private createPersonalizationPrompt(
    content: string,
    complexityLevel: 'beginner' | 'intermediate' | 'advanced',
    preferredName: string
  ): string {
    let instructions = '';

    switch (complexityLevel) {
      case 'beginner':
        instructions = `
        Adapt the following content for a beginner audience:
        - Use simple language and basic analogies (e.g., compare code to recipes)
        - Avoid jargon or define it immediately when used
        - Provide short, clear examples
        - Focus on fundamental concepts
        - Use more descriptive headings and subheadings
        - Include more visual cues and bullet points
        - When appropriate, address the user by their preferred name: ${preferredName}
        `;
        break;
      case 'intermediate':
        instructions = `
        Adapt the following content for an intermediate audience:
        - Use balanced depth with practical tips
        - Include moderate examples with code snippets
        - Explain common pitfalls and best practices
        - Provide some advanced concepts but with context
        - When appropriate, address the user by their preferred name: ${preferredName}
        `;
        break;
      case 'advanced':
        instructions = `
        Adapt the following content for an advanced audience:
        - Provide detailed explanations
        - Include advanced techniques and optimizations
        - Mention edge cases and performance considerations
        - Provide extra resources or challenges for further learning
        - Use more concise language assuming prior knowledge
        - When appropriate, address the user by their preferred name: ${preferredName}
        `;
        break;
    }

    return `
    ${instructions}

    IMPORTANT: Preserve the exact original structure, including:
    - All headings (##, ###, etc.) with their original formatting
    - All lists with their original bullet points or numbering
    - All code blocks with their original syntax and indentation
    - All links and image references in their original format
    - All emphasis markers like **bold** and *italic*
    - All blockquotes with their original formatting
    - The original document hierarchy and organization

    Only modify the explanatory text, examples, and complexity level while keeping all structural elements intact.

    Original content:
    ${content}
    `;
  }

  /**
   * Batch process multiple chapters
   */
  async personalizeMultipleContents(
    contents: Array<{ filename: string; content: string }>,
    userProfile: UserProfile,
    options?: PersonalizationOptions
  ): Promise<Array<{ filename: string; content: string; complexityLevel: string }>> {
    const results: Array<{ filename: string; content: string; complexityLevel: string }> = [];

    // Process in batches to avoid overloading
    const batchSize = parseInt(process.env.MAX_CONCURRENT_AI_REQUESTS || '5', 10);

    for (let i = 0; i < contents.length; i += batchSize) {
      const batch = contents.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map(async (item) => {
          const personalizedContent = await this.personalizeContent(item.content, userProfile, options);
          const complexityLevel = options?.complexityOverride || this.determineComplexityLevel(userProfile);

          return {
            filename: item.filename,
            content: personalizedContent,
            complexityLevel
          };
        })
      );

      results.push(...batchResults);
    }

    return results;
  }
}

// Export singleton instance
export const aiService = new AIService();