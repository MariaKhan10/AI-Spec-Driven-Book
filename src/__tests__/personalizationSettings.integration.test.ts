
import request from 'supertest';
import express, { Application } from 'express';
import { PersonalizeAPI } from '../server/personalizeAPI';
import { userService } from '../services/userService';

// Mock the services
jest.mock('../services/userService');

describe('Personalization Settings API Integration Tests', () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Set up routes
    app.get('/api/personalization-settings', PersonalizeAPI.getPersonalizationSettings);
    app.put('/api/personalization-settings', PersonalizeAPI.putPersonalizationSettings);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/personalization-settings', () => {
    it('should return 400 when userId parameter is missing', async () => {
      const response = await request(app)
        .get('/api/personalization-settings')
        .expect(400);

      expect(response.body.error.code).toBe('MISSING_PARAMETER');
    });

    it('should return 401 when userId parameter is not an authenticated user', async () => {
      // Mock authentication to return false for any user
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .get('/api/personalization-settings')
        .query({ userId: 'invalid-user-id' }) // Valid string but not authenticated
        .expect(401);

      expect(response.body.error.code).toBe('AUTHENTICATION_REQUIRED');
    });

    it('should return 401 when user is not authenticated', async () => {
      // Mock authentication to return false
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .get('/api/personalization-settings')
        .query({ userId: 'test-user-id' })
        .expect(401);

      expect(response.body.error.code).toBe('AUTHENTICATION_REQUIRED');
    });

    it('should return 404 when user settings are not found', async () => {
      // Mock authentication to return true
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);
      // Mock settings retrieval to return null
      (userService.getUserPersonalizationSettings as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/api/personalization-settings')
        .query({ userId: 'test-user-id' })
        .expect(404);

      expect(response.body.error.code).toBe('SETTINGS_NOT_FOUND');
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

      // Mock authentication to return true
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);
      // Mock settings retrieval to return settings
      (userService.getUserPersonalizationSettings as jest.Mock).mockResolvedValue(mockSettings);

      const response = await request(app)
        .get('/api/personalization-settings')
        .query({ userId: 'test-user-id' })
        .expect(200);

      expect(response.body.userId).toBe('test-user-id');
      expect(response.body.preferredName).toBe('Test User');
      expect(response.body.contentComplexity).toBe('balanced');
      expect(response.body.learningStyle).toBe('practical');
      expect(response.body.technicalDepthPreference).toBe('moderate');
    });
  });

  describe('PUT /api/personalization-settings', () => {
    it('should return 400 when userId parameter is missing from request body', async () => {
      const response = await request(app)
        .put('/api/personalization-settings')
        .send({
          preferredName: 'Updated Name',
          contentComplexity: 'advanced'
        })
        .expect(400);

      expect(response.body.error.code).toBe('MISSING_PARAMETER');
    });

    it('should return 401 when user is not authenticated', async () => {
      // Mock authentication to return false
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

    it('should update user settings when valid parameters are provided', async () => {
      // Mock authentication to return true
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);
      // Mock settings update to return true (success)
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
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 500 when settings update fails', async () => {
      // Mock authentication to return true
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);
      // Mock settings update to return false (failure)
      (userService.updateUserPersonalizationSettings as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .put('/api/personalization-settings')
        .send({
          userId: 'test-user-id',
          preferredName: 'Updated Name'
        })
        .expect(500);

      expect(response.body.error.code).toBe('SETTINGS_UPDATE_FAILED');
    });
  });
});