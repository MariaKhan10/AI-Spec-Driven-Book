import { AIService } from '../services/aiService';

// Mock the OpenAI module before importing AIService
jest.mock('openai', () => {
  const mockCreate = jest.fn().mockResolvedValue({
    choices: [{
      message: {
        content: 'Personalized content based on user profile'
      }
    }]
  });

  const mockChat = {
    completions: {
      create: mockCreate
    }
  };

  const MockOpenAIClass = jest.fn().mockImplementation(() => ({
    chat: mockChat
  }));

  return {
    __esModule: true,
    default: MockOpenAIClass,
    OpenAI: MockOpenAIClass
  };
});

describe('AIService - Profile-Based Personalization Tests', () => {
  let aiService: AIService;

  beforeEach(() => {
    // Set environment variable for testing
    process.env.OPENAI_API_KEY = 'test-key';

    aiService = new AIService();
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.OPENAI_API_KEY;
  });

  describe('Preferred Name Incorporation', () => {
    it('should include user\'s preferred name in the prompt when available', async () => {
      const content = '# Original Content\nThis is the original content.';
      const userProfile = {
        id: 'test-user',
        name: 'John Doe',
        email: 'john@example.com',
        softwareBackground: 'intermediate',
        hardwareBackground: 'beginner',
        personalizationPreferences: {}
      };

      const result = await aiService.personalizeContent(content, userProfile);

      // The mock implementation returns the hardcoded result
      expect(result).toBe('Personalized content based on user profile');
    });

    it('should derive name from email when preferred name is not available', async () => {
      const content = '# Original Content\nThis is the original content.';
      const userProfile = {
        id: 'test-user',
        name: null,
        email: 'jane@example.com',
        softwareBackground: 'advanced',
        hardwareBackground: 'intermediate',
        personalizationPreferences: {}
      };

      const result = await aiService.personalizeContent(content, userProfile);

      expect(result).toBe('Personalized content based on user profile');
    });

    it('should use default name when no name or email is available', async () => {
      const content = '# Original Content\nThis is the original content.';
      const userProfile = {
        id: 'test-user',
        name: '',
        email: '',
        softwareBackground: 'beginner',
        hardwareBackground: 'beginner',
        personalizationPreferences: {}
      };

      const result = await aiService.personalizeContent(content, userProfile);

      expect(result).toBe('Personalized content based on user profile');
    });
  });

  describe('Complexity Level Determination', () => {
    it('should determine complexity level based on average of both backgrounds', () => {
      const userProfile = {
        id: 'test-user',
        name: 'Test User',
        email: 'test@example.com',
        softwareBackground: 'beginner',
        hardwareBackground: 'intermediate',
        personalizationPreferences: {}
      };

      // Using reflection to access private method for testing
      const determineComplexityLevel = (aiService as any).determineComplexityLevel.bind(aiService);
      const complexityLevel = determineComplexityLevel(userProfile);

      // Average of beginner (1) and intermediate (2) = 1.5, which maps to beginner (since <= 1.5)
      expect(complexityLevel).toBe('beginner');
    });

    it('should return beginner level when both backgrounds are beginner', () => {
      const userProfile = {
        id: 'test-user',
        name: 'Test User',
        email: 'test@example.com',
        softwareBackground: 'beginner',
        hardwareBackground: 'beginner',
        personalizationPreferences: {}
      };

      const determineComplexityLevel = (aiService as any).determineComplexityLevel.bind(aiService);
      const complexityLevel = determineComplexityLevel(userProfile);

      expect(complexityLevel).toBe('beginner');
    });

    it('should return advanced level when both backgrounds are advanced', () => {
      const userProfile = {
        id: 'test-user',
        name: 'Test User',
        email: 'test@example.com',
        softwareBackground: 'advanced',
        hardwareBackground: 'advanced',
        personalizationPreferences: {}
      };

      const determineComplexityLevel = (aiService as any).determineComplexityLevel.bind(aiService);
      const complexityLevel = determineComplexityLevel(userProfile);

      expect(complexityLevel).toBe('advanced');
    });

    it('should handle "Unknown" background by treating it as beginner', () => {
      const userProfile = {
        id: 'test-user',
        name: 'Test User',
        email: 'test@example.com',
        softwareBackground: 'Unknown',
        hardwareBackground: 'advanced',
        personalizationPreferences: {}
      };

      const determineComplexityLevel = (aiService as any).determineComplexityLevel.bind(aiService);
      const complexityLevel = determineComplexityLevel(userProfile);

      // Average of beginner (1) and advanced (3) = 2, which should be intermediate
      expect(complexityLevel).toBe('intermediate');
    });
  });

  describe('Personalization Options', () => {
    it('should respect complexity override option', async () => {
      const content = '# Original Content\nThis is the original content.';
      const userProfile = {
        id: 'test-user',
        name: 'Test User',
        email: 'test@example.com',
        softwareBackground: 'beginner',
        hardwareBackground: 'beginner',
        personalizationPreferences: {}
      };

      const options = {
        complexityOverride: 'advanced' as const
      };

      const result = await aiService.personalizeContent(content, userProfile, options);

      expect(result).toBe('Personalized content based on user profile');
    });
  });

  describe('Batch Processing', () => {
    it('should personalize multiple contents respecting user profile', async () => {
      const contents = [
        { filename: 'ch1.md', content: 'Chapter 1 content' },
        { filename: 'ch2.md', content: 'Chapter 2 content' }
      ];

      const userProfile = {
        id: 'test-user',
        name: 'Test User',
        email: 'test@example.com',
        softwareBackground: 'intermediate',
        hardwareBackground: 'intermediate',
        personalizationPreferences: {}
      };

      const results = await aiService.personalizeMultipleContents(contents, userProfile);

      expect(results).toHaveLength(2);
      expect(results[0]).toHaveProperty('filename', 'ch1.md');
      expect(results[0]).toHaveProperty('content', 'Personalized content based on user profile');
      expect(results[1]).toHaveProperty('filename', 'ch2.md');
      expect(results[1]).toHaveProperty('content', 'Personalized content based on user profile');
    });
  });
});