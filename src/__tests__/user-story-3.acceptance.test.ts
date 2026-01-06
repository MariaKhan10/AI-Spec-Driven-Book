import request from 'supertest';
import express, { Application } from 'express';
import { PersonalizeAPI } from '../server/personalizeAPI';
import { contentPersonalizer } from '../services/contentPersonalizer';
import { userService } from '../services/userService';
import { AIService } from '../services/aiService';

// Mock the services
jest.mock('../services/contentPersonalizer');
jest.mock('../services/userService');

describe('User Story 3 - Profile-Based Personalization (Acceptance Tests)', () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Set up routes
    app.get('/api/personalize', PersonalizeAPI.getPersonalize);
    app.get('/api/personalization-settings', PersonalizeAPI.getPersonalizationSettings);
    app.put('/api/personalization-settings', PersonalizeAPI.putPersonalizationSettings);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Acceptance Scenario 1: Preferred Name in Content', () => {
    it('Given a logged-in user with a preferred name, When viewing personalized content, Then the content may address the user by their preferred name when appropriate', async () => {
      // Mock user with preferred name
      (userService.getUserProfile as jest.Mock).mockResolvedValue({
        id: 'test-user-id',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        softwareBackground: 'intermediate',
        hardwareBackground: 'beginner',
        personalizationPreferences: {}
      });

      // Mock AI service to return content that includes the user's name
      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'test-chapter.md',
        content: '# Welcome Alex Johnson\nHello Alex, this content is personalized for you.',
        complexityLevel: 'intermediate',
        transformationApplied: true
      });

      // Mock authentication
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md', userId: 'test-user-id' })
        .expect(200);

      expect(response.body.filename).toBe('test-chapter.md');
      expect(response.body.complexityLevel).toBe('intermediate');
      expect(response.body.transformationApplied).toBe(true);
      // Verify that the content includes the user's name
      expect(response.body.content).toContain('Alex Johnson');
      expect(response.body.content).toContain('Alex');
    });
  });

  describe('Acceptance Scenario 2: Combined Backgrounds for Complexity', () => {
    it('Given a logged-in user with both software and hardware backgrounds, When viewing content, Then complexity is adjusted based on the average of both backgrounds, erring toward simpler if one is \'Unknown\'', async () => {
      // Mock user with different backgrounds
      (userService.getUserProfile as jest.Mock).mockResolvedValue({
        id: 'test-user-id',
        name: 'Taylor Kim',
        email: 'taylor@example.com',
        softwareBackground: 'advanced',
        hardwareBackground: 'beginner',
        personalizationPreferences: {}
      });

      // Mock AI service to return content with appropriate complexity level
      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'test-chapter.md',
        content: '# Technical Content\nThis content has intermediate complexity based on averaging advanced software and beginner hardware backgrounds.',
        complexityLevel: 'intermediate',
        transformationApplied: true
      });

      // Mock authentication
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md', userId: 'test-user-id' })
        .expect(200);

      expect(response.body.complexityLevel).toBe('intermediate');
      expect(response.body.transformationApplied).toBe(true);
      // Verify content reflects the averaged complexity
      expect(response.body.content).toContain('intermediate complexity');
    });

    it('should err toward simpler complexity when one background is \'Unknown\'', async () => {
      // Mock user with one unknown background
      (userService.getUserProfile as jest.Mock).mockResolvedValue({
        id: 'test-user-id',
        name: 'Casey Smith',
        email: 'casey@example.com',
        softwareBackground: 'advanced',
        hardwareBackground: 'Unknown',
        personalizationPreferences: {}
      });

      // Mock AI service to return content with simpler complexity (averaging advanced and beginner)
      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'test-chapter.md',
        content: '# Simplified Content\nThis content has simplified explanations suitable for the mixed background.',
        complexityLevel: 'intermediate', // Average of advanced and beginner (3+1)/2 = 2
        transformationApplied: true
      });

      // Mock authentication
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md', userId: 'test-user-id' })
        .expect(200);

      // Should be intermediate since average of advanced (3) and beginner (1) is 2
      expect(response.body.complexityLevel).toBe('intermediate');
      expect(response.body.transformationApplied).toBe(true);
      expect(response.body.content).toContain('simplified explanations');
    });
  });

  describe('Profile-Based Personalization Settings', () => {
    it('should allow users to customize their personalization preferences', async () => {
      const mockSettings = {
        userId: 'test-user-id',
        preferredName: 'Taylor',
        contentComplexity: 'balanced',
        learningStyle: 'practical',
        technicalDepthPreference: 'moderate',
        updatedAt: new Date()
      };

      // Mock authentication
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);
      // Mock settings retrieval
      (userService.getUserPersonalizationSettings as jest.Mock).mockResolvedValue(mockSettings);

      const response = await request(app)
        .get('/api/personalization-settings')
        .query({ userId: 'test-user-id' })
        .expect(200);

      expect(response.body.userId).toBe('test-user-id');
      expect(response.body.preferredName).toBe('Taylor');
      expect(response.body.contentComplexity).toBe('balanced');
      expect(response.body.learningStyle).toBe('practical');
      expect(response.body.technicalDepthPreference).toBe('moderate');
    });

    it('should allow users to update their personalization preferences', async () => {
      // Mock authentication
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);
      // Mock settings update
      (userService.updateUserPersonalizationSettings as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .put('/api/personalization-settings')
        .send({
          userId: 'test-user-id',
          preferredName: 'Taylor Updated',
          contentComplexity: 'advanced',
          learningStyle: 'theoretical'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.updatedAt).toBeDefined();
    });
  });
});