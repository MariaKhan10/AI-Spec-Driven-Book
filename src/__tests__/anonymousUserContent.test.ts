import { ContentPersonalizer } from '../services/contentPersonalizer';
import { AIService } from '../services/aiService';
import { UserService } from '../services/userService';

describe('ContentPersonalizer - Anonymous User Tests', () => {
  let contentPersonalizer: ContentPersonalizer;
  let mockAIService: jest.Mocked<AIService>;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    // Create mock services
    mockAIService = {
      personalizeContent: jest.fn().mockImplementation((content) => Promise.resolve(content)),
    } as any;

    mockUserService = {
      getUserProfile: jest.fn().mockResolvedValue(null),
      getUserPersonalizationSettings: jest.fn(),
      updateUserPersonalizationSettings: jest.fn(),
      isAuthenticated: jest.fn().mockResolvedValue(false),
      mapUserBackgroundsToLevels: jest.fn(),
    } as any;

    contentPersonalizer = new ContentPersonalizer(mockAIService, mockUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('personalizeChapter for anonymous users', () => {
    it('should return original content when no userId is provided', async () => {
      const originalContent = '# Original Chapter\nThis is original content.';

      // Mock reading the chapter content
      jest.spyOn(require('fs/promises'), 'readFile').mockResolvedValue(originalContent);

      const result = await contentPersonalizer.personalizeChapter('test-path', undefined);

      expect(result.content).toBe(originalContent);
      expect(result.transformationApplied).toBe(false);
      expect(result.complexityLevel).toBe('original');
      expect(mockAIService.personalizeContent).not.toHaveBeenCalled();
    });

    it('should return original content when userId is null', async () => {
      const originalContent = '# Original Chapter\nThis is original content.';

      // Mock reading the chapter content
      jest.spyOn(require('fs/promises'), 'readFile').mockResolvedValue(originalContent);

      const result = await contentPersonalizer.personalizeChapter('test-path', null as any);

      expect(result.content).toBe(originalContent);
      expect(result.transformationApplied).toBe(false);
      expect(result.complexityLevel).toBe('original');
      expect(mockAIService.personalizeContent).not.toHaveBeenCalled();
    });

    it('should return original content when user profile is not found', async () => {
      const originalContent = '# Original Chapter\nThis is original content.';

      // Mock reading the chapter content
      jest.spyOn(require('fs/promises'), 'readFile').mockResolvedValue(originalContent);

      // Mock user service to authenticate the user but return null profile
      mockUserService.isAuthenticated.mockResolvedValueOnce(true);
      mockUserService.getUserProfile.mockResolvedValueOnce(null);

      const result = await contentPersonalizer.personalizeChapter('test-path', 'nonexistent-user');

      expect(result.content).toBe(originalContent);
      expect(result.transformationApplied).toBe(false);
      expect(result.complexityLevel).toBe('original');
      expect(mockAIService.personalizeContent).not.toHaveBeenCalled();
    });
  });

  describe('personalizeContent for anonymous users', () => {
    it('should return original content when no userId is provided', async () => {
      const originalContent = 'This is original content.';

      const result = await contentPersonalizer.personalizeContent(originalContent, undefined);

      expect(result.content).toBe(originalContent);
      expect(result.transformationApplied).toBe(false);
      expect(result.complexityLevel).toBe('original');
      expect(mockAIService.personalizeContent).not.toHaveBeenCalled();
    });

    it('should return original content when userId is null', async () => {
      const originalContent = 'This is original content.';

      const result = await contentPersonalizer.personalizeContent(originalContent, null as any);

      expect(result.content).toBe(originalContent);
      expect(result.transformationApplied).toBe(false);
      expect(result.complexityLevel).toBe('original');
      expect(mockAIService.personalizeContent).not.toHaveBeenCalled();
    });
  });

  describe('personalizeMultipleChapters for anonymous users', () => {
    it('should return original content for all chapters when no userId is provided', async () => {
      const originalContent1 = '# Chapter 1\nContent 1';
      const originalContent2 = '# Chapter 2\nContent 2';

      // Mock reading the chapter content
      const mockReadFile = jest.fn();
      mockReadFile.mockResolvedValueOnce(originalContent1);
      mockReadFile.mockResolvedValueOnce(originalContent2);
      Object.defineProperty(require('fs/promises'), 'readFile', {
        value: mockReadFile
      });

      const result = await contentPersonalizer.personalizeMultipleChapters(
        ['path1', 'path2'],
        undefined
      );

      expect(result).toHaveLength(2);
      expect(result[0].content).toBe(originalContent1);
      expect(result[0].transformationApplied).toBe(false);
      expect(result[0].complexityLevel).toBe('original');
      expect(result[1].content).toBe(originalContent2);
      expect(result[1].transformationApplied).toBe(false);
      expect(result[1].complexityLevel).toBe('original');
      expect(mockAIService.personalizeContent).not.toHaveBeenCalled();
    });
  });
});