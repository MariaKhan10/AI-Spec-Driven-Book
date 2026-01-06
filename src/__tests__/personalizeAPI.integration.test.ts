import request from 'supertest';
import express, { Application } from 'express';
import { PersonalizeAPI } from '../server/personalizeAPI';
import { contentPersonalizer } from '../services/contentPersonalizer';
import { userService } from '../services/userService';

// Mock the services
jest.mock('../services/contentPersonalizer');
jest.mock('../services/userService');

describe('PersonalizeAPI Integration Tests', () => {
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

  describe('GET /api/personalize', () => {
    it('should return 400 when chapter parameter is missing', async () => {
      const response = await request(app)
        .get('/api/personalize')
        .expect(400);

      expect(response.body.error.code).toBe('MISSING_PARAMETER');
    });

    it('should return personalized content when valid parameters are provided', async () => {
      // Mock the content personalizer
      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'test-chapter.md',
        content: '# Personalized Content\nThis is personalized content.',
        complexityLevel: 'intermediate',
        transformationApplied: true
      });

      // Mock user authentication
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md', userId: 'test-user-id' })
        .expect(200);

      expect(response.body.filename).toBe('test-chapter.md');
      expect(response.body.complexityLevel).toBe('intermediate');
      expect(response.body.transformationApplied).toBe(true);
    });

    it('should return original content when no userId is provided', async () => {
      // Mock the content personalizer
      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'test-chapter.md',
        content: '# Original Content\nThis is original content.',
        complexityLevel: 'original',
        transformationApplied: false
      });

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md' })
        .expect(200);

      expect(response.body.complexityLevel).toBe('original');
      expect(response.body.transformationApplied).toBe(false);
    });

    it('should return 401 when user is not authenticated', async () => {
      // Mock user authentication to return false
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md', userId: 'invalid-user-id' })
        .expect(401);

      expect(response.body.error.code).toBe('AUTHENTICATION_REQUIRED');
    });
  });

  describe('POST /api/personalize', () => {
    it('should return 400 when content parameter is missing', async () => {
      const response = await request(app)
        .post('/api/personalize')
        .send({})
        .expect(400);

      expect(response.body.error.code).toBe('MISSING_PARAMETER');
    });

    it('should return personalized content when valid parameters are provided', async () => {
      // Mock the content personalizer
      (contentPersonalizer.personalizeContent as jest.Mock).mockResolvedValue({
        filename: 'dynamic-content',
        content: 'Personalized content here',
        complexityLevel: 'beginner',
        transformationApplied: true
      });

      // Mock user authentication
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .post('/api/personalize')
        .send({
          content: 'Original content',
          userId: 'test-user-id'
        })
        .expect(200);

      expect(response.body.personalizedContent).toBe('Personalized content here');
      expect(response.body.complexityLevel).toBe('beginner');
      expect(response.body.transformationApplied).toBe(true);
    });

    it('should return 401 when user is not authenticated', async () => {
      // Mock user authentication to return false
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post('/api/personalize')
        .send({
          content: 'Original content',
          userId: 'invalid-user-id'
        })
        .expect(401);

      expect(response.body.error.code).toBe('AUTHENTICATION_REQUIRED');
    });
  });

  describe('GET /api/personalization-settings', () => {
    it('should return 400 when userId parameter is missing', async () => {
      const response = await request(app)
        .get('/api/personalization-settings')
        .expect(400);

      expect(response.body.error.code).toBe('MISSING_PARAMETER');
    });

    it('should return user settings when valid userId is provided', async () => {
      const mockSettings = {
        userId: 'test-user-id',
        preferredName: 'Test User',
        contentComplexity: 'balanced',
        learningStyle: 'practical',
        technicalDepthPreference: 'moderate',
        updatedAt: new Date()
      };

      // Mock user authentication
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);
      (userService.getUserPersonalizationSettings as jest.Mock).mockResolvedValue(mockSettings);

      const response = await request(app)
        .get('/api/personalization-settings')
        .query({ userId: 'test-user-id' })
        .expect(200);

      expect(response.body.userId).toBe('test-user-id');
      expect(response.body.preferredName).toBe('Test User');
    });

    it('should return 401 when user is not authenticated', async () => {
      // Mock user authentication to return false
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .get('/api/personalization-settings')
        .query({ userId: 'invalid-user-id' })
        .expect(401);

      expect(response.body.error.code).toBe('AUTHENTICATION_REQUIRED');
    });
  });

  describe('PUT /api/personalization-settings', () => {
    it('should return 400 when userId parameter is missing', async () => {
      const response = await request(app)
        .put('/api/personalization-settings')
        .send({
          preferredName: 'Updated Name',
          contentComplexity: 'advanced'
        })
        .expect(400);

      expect(response.body.error.code).toBe('MISSING_PARAMETER');
    });

    it('should update user settings when valid parameters are provided', async () => {
      // Mock user authentication
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);
      (userService.updateUserPersonalizationSettings as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .put('/api/personalization-settings')
        .send({
          userId: 'test-user-id',
          preferredName: 'Updated Name',
          contentComplexity: 'advanced'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 401 when user is not authenticated', async () => {
      // Mock user authentication to return false
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .put('/api/personalization-settings')
        .send({
          userId: 'invalid-user-id',
          preferredName: 'Updated Name'
        })
        .expect(401);

      expect(response.body.error.code).toBe('AUTHENTICATION_REQUIRED');
    });
  });
});