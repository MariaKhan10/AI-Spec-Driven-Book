import { ContentPersonalizer } from '../services/contentPersonalizer';
import { AIService } from '../services/aiService';
import { UserService } from '../services/userService';

// Define proper mock types
const mockAIService = {
  personalizeContent: jest.fn().mockImplementation((content, userProfile) => Promise.resolve(content)),
  personalizeMultipleContents: jest.fn()
} as unknown as jest.Mocked<AIService>;

// Mock the user service
const mockUserService = {
  getUserProfile: jest.fn().mockResolvedValue({
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    softwareBackground: 'intermediate',
    hardwareBackground: 'beginner',
    personalizationPreferences: {}
  }),
  getUserPersonalizationSettings: jest.fn().mockResolvedValue({
    userId: 'test-user-id',
    preferredName: 'Test User',
    contentComplexity: 'balanced',
    learningStyle: 'practical',
    technicalDepthPreference: 'moderate',
    updatedAt: new Date()
  }),
  updateUserPersonalizationSettings: jest.fn().mockResolvedValue(true),
  isAuthenticated: jest.fn().mockResolvedValue(true),
  mapUserBackgroundsToLevels: jest.fn().mockReturnValue({ softwareLevel: 'intermediate', hardwareLevel: 'beginner' })
} as unknown as jest.Mocked<UserService>;

describe('ContentPersonalizer', () => {
  let contentPersonalizer: ContentPersonalizer;

  beforeEach(() => {
    contentPersonalizer = new ContentPersonalizer(mockAIService, mockUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('personalizeChapter', () => {
    it('should return original content when no user ID is provided', async () => {
      const originalContent = '# Original Chapter\nThis is original content.';

      // Mock the readChapterContent method to return original content directly
      jest.spyOn(contentPersonalizer as any, 'readChapterContent').mockResolvedValue(originalContent);

      const result = await contentPersonalizer.personalizeChapter('test-path', undefined);

      expect(result.content).toBe(originalContent);
      expect(result.transformationApplied).toBe(false);
      expect(result.complexityLevel).toBe('original');
    });

    it('should return original content when user profile is not found', async () => {
      mockUserService.isAuthenticated.mockResolvedValueOnce(true); // User is authenticated
      mockUserService.getUserProfile.mockResolvedValueOnce(null); // But profile is not found
      const originalContent = '# Original Chapter\nThis is original content.';

      // Mock the readChapterContent method to return original content directly
      jest.spyOn(contentPersonalizer as any, 'readChapterContent').mockResolvedValue(originalContent);

      const result = await contentPersonalizer.personalizeChapter('test-path', 'nonexistent-user');

      expect(result.content).toBe(originalContent);
      expect(result.transformationApplied).toBe(false);
      expect(result.complexityLevel).toBe('original');
    });

    it('should personalize content when user ID is provided', async () => {
      const originalContent = '# Original Chapter\nThis is original content.';
      const personalizedContent = '# Personalized Chapter\nThis is personalized content.';

      // Mock the readChapterContent method to return original content directly
      jest.spyOn(contentPersonalizer as any, 'readChapterContent').mockResolvedValue(originalContent);
      mockAIService.personalizeContent.mockResolvedValueOnce(personalizedContent);

      const result = await contentPersonalizer.personalizeChapter('test-path', 'test-user-id');

      expect(result.content).toBe(personalizedContent);
      expect(result.transformationApplied).toBe(true);
      expect(mockAIService.personalizeContent).toHaveBeenCalledWith(
        originalContent,
        expect.any(Object)
      );
    });

    it('should cache personalized content', async () => {
      const originalContent = '# Original Chapter\nThis is original content.';
      const personalizedContent = '# Personalized Chapter\nThis is personalized content.';

      // Mock the readChapterContent method to return original content directly
      jest.spyOn(contentPersonalizer as any, 'readChapterContent').mockResolvedValue(originalContent);
      mockAIService.personalizeContent.mockResolvedValueOnce(personalizedContent);

      // First call
      await contentPersonalizer.personalizeChapter('test-path', 'test-user-id');

      // Second call should use cache
      const result = await contentPersonalizer.personalizeChapter('test-path', 'test-user-id');

      expect(result.content).toBe(personalizedContent);
      expect(mockAIService.personalizeContent).toHaveBeenCalledTimes(1); // Called only once due to caching
    });
  });

  describe('personalizeContent', () => {
    it('should return original content when no user ID is provided', async () => {
      const originalContent = 'This is original content.';
      const result = await contentPersonalizer.personalizeContent(originalContent, undefined);

      expect(result.content).toBe(originalContent);
      expect(result.transformationApplied).toBe(false);
      expect(result.complexityLevel).toBe('original');
    });

    it('should personalize content when user ID is provided', async () => {
      const originalContent = 'This is original content.';
      const personalizedContent = 'This is personalized content.';

      mockAIService.personalizeContent.mockResolvedValueOnce(personalizedContent);

      const result = await contentPersonalizer.personalizeContent(originalContent, 'test-user-id');

      expect(result.content).toBe(personalizedContent);
      expect(result.transformationApplied).toBe(true);
    });
  });

  describe('getAllChapters', () => {
    it('should return all markdown files from docs directory', async () => {
      // This test would require mocking the file system
      // For now, we'll just test that the function exists and returns an array
      const chapters = await contentPersonalizer.getAllChapters('docs');
      expect(Array.isArray(chapters)).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle errors gracefully and return original content', async () => {
      const filePath = 'test-path';
      const originalContent = '# Original Chapter\nThis is original content.';

      // Mock the readChapterContent method to return original content directly
      jest.spyOn(contentPersonalizer as any, 'readChapterContent').mockResolvedValue(originalContent);

      const result = await contentPersonalizer.handleError(filePath, new Error('Test error'), 'test-user-id');

      expect(result.content).toBe(originalContent);
      expect(result.complexityLevel).toBe('original');
    });
  });

  describe('cache management', () => {
    it('should clear cache when clearCache is called', () => {
      contentPersonalizer.clearCache();
      const stats = contentPersonalizer.getCacheStats();
      expect(stats.size).toBe(0);
    });

    it('should return cache statistics', () => {
      const stats = contentPersonalizer.getCacheStats();
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('keys');
      expect(Array.isArray(stats.keys)).toBe(true);
    });
  });
});