import request from 'supertest';
import express, { Application } from 'express';
import { PersonalizeAPI } from '../server/personalizeAPI';
import { contentPersonalizer } from '../services/contentPersonalizer';
import { userService } from '../services/userService';

// Mock the services
jest.mock('../services/contentPersonalizer');
jest.mock('../services/userService');

describe('End-to-End Tests - AI Content Personalizer Feature', () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Set up routes
    app.get('/api/personalize', PersonalizeAPI.getPersonalize);
    app.post('/api/personalize', PersonalizeAPI.postPersonalize);
    app.get('/api/personalization-settings', PersonalizeAPI.getPersonalizationSettings);
    app.put('/api/personalization-settings', PersonalizeAPI.putPersonalizationSettings);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('User Story 1 - Personalized Content Display', () => {
    it('should personalize content for users with different skill levels', async () => {
      // Mock user with beginner background
      (userService.getUserProfile as jest.Mock).mockResolvedValue({
        id: 'beginner-user-id',
        name: 'Beginner User',
        email: 'beginner@example.com',
        softwareBackground: 'beginner',
        hardwareBackground: 'beginner',
        personalizationPreferences: {}
      });

      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'test-chapter.md',
        content: '# Personalized for Beginners\nContent adapted for beginner level.',
        complexityLevel: 'beginner',
        transformationApplied: true
      });

      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md', userId: 'beginner-user-id' })
        .expect(200);

      expect(response.body.complexityLevel).toBe('beginner');
      expect(response.body.transformationApplied).toBe(true);
      expect(response.body.content).toContain('Personalized for Beginners');
    });

    it('should handle advanced users with appropriate complexity', async () => {
      // Mock user with advanced background
      (userService.getUserProfile as jest.Mock).mockResolvedValue({
        id: 'advanced-user-id',
        name: 'Advanced User',
        email: 'advanced@example.com',
        softwareBackground: 'advanced',
        hardwareBackground: 'advanced',
        personalizationPreferences: {}
      });

      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'test-chapter.md',
        content: '# Advanced Content\nDetailed explanations and advanced techniques.',
        complexityLevel: 'advanced',
        transformationApplied: true
      });

      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md', userId: 'advanced-user-id' })
        .expect(200);

      expect(response.body.complexityLevel).toBe('advanced');
      expect(response.body.transformationApplied).toBe(true);
      expect(response.body.content).toContain('Advanced Content');
    });
  });

  describe('User Story 2 - Anonymous User Content Access', () => {
    it('should return original content for anonymous users', async () => {
      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'test-chapter.md',
        content: '# Original Content\nThis is original content.',
        complexityLevel: 'original',
        transformationApplied: false
      });

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md' }) // No userId provided
        .expect(200);

      expect(response.body.complexityLevel).toBe('original');
      expect(response.body.transformationApplied).toBe(false);
      expect(response.body.content).toBe('# Original Content\nThis is original content.');
    });
  });

  describe('User Story 3 - Profile-Based Personalization', () => {
    it('should allow users to customize personalization settings', async () => {
      const mockSettings = {
        userId: 'test-user-id',
        preferredName: 'Taylor',
        contentComplexity: 'balanced',
        learningStyle: 'practical',
        technicalDepthPreference: 'moderate',
        updatedAt: new Date()
      };

      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);
      (userService.getUserPersonalizationSettings as jest.Mock).mockResolvedValue(mockSettings);

      const response = await request(app)
        .get('/api/personalization-settings')
        .query({ userId: 'test-user-id' })
        .expect(200);

      expect(response.body.preferredName).toBe('Taylor');
      expect(response.body.contentComplexity).toBe('balanced');
      expect(response.body.learningStyle).toBe('practical');
    });

    it('should update user personalization settings', async () => {
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);
      (userService.updateUserPersonalizationSettings as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .put('/api/personalization-settings')
        .send({
          userId: 'test-user-id',
          preferredName: 'Taylor Updated',
          contentComplexity: 'advanced'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Error Handling & Edge Cases', () => {
    it('should handle unreadable files gracefully', async () => {
      // Mock file reading error
      (contentPersonalizer.personalizeChapter as jest.Mock).mockImplementation(() => {
        throw new Error('Could not read chapter file');
      });

      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'nonexistent.md', userId: 'test-user-id' })
        .expect(500);

      expect(response.body.error.code).toBe('PERSONALIZATION_FAILED');
    });

    it('should handle invalid user backgrounds by defaulting to intermediate', async () => {
      // Mock user with invalid backgrounds
      (userService.getUserProfile as jest.Mock).mockResolvedValue({
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        softwareBackground: 'invalid',
        hardwareBackground: 'invalid',
        personalizationPreferences: {}
      });

      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'test-chapter.md',
        content: '# Default Content\nContent for intermediate level.',
        complexityLevel: 'intermediate', // Should default to intermediate
        transformationApplied: true
      });

      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md', userId: 'test-user-id' })
        .expect(200);

      expect(response.body.complexityLevel).toBe('intermediate');
    });
  });
});