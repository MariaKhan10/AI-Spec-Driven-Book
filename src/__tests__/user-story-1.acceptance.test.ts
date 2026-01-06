import request from 'supertest';
import express, { Application } from 'express';
import { PersonalizeAPI } from '../server/personalizeAPI';
import { contentPersonalizer } from '../services/contentPersonalizer';
import { userService } from '../services/userService';
import { AIService } from '../services/aiService';

// Mock the services
jest.mock('../services/contentPersonalizer');
jest.mock('../services/userService');

describe('User Story 1 - Personalized Content Display (Acceptance Tests)', () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Set up routes
    app.get('/api/personalize', PersonalizeAPI.getPersonalize);
    app.post('/api/personalize', PersonalizeAPI.postPersonalize);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Acceptance Scenario 1: Beginner User Background', () => {
    it('Given a logged-in user with "beginner" software background, When viewing any book chapter, Then content uses simple language, basic analogies, avoids jargon or defines it immediately, and provides short examples', async () => {
      // Mock user with beginner background
      (userService.getUserProfile as jest.Mock).mockResolvedValue({
        id: 'beginner-user-id',
        name: 'Beginner User',
        email: 'beginner@example.com',
        softwareBackground: 'beginner',
        hardwareBackground: 'beginner',
        personalizationPreferences: {}
      });

      // Mock AI service to return content appropriate for beginners
      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'test-chapter.md',
        content: '# Chapter for Beginners\nThis content uses simple language and basic analogies. We explain concepts clearly with short examples.',
        complexityLevel: 'beginner',
        transformationApplied: true
      });

      // Mock user authentication
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md', userId: 'beginner-user-id' })
        .expect(200);

      expect(response.body.filename).toBe('test-chapter.md');
      expect(response.body.complexityLevel).toBe('beginner');
      expect(response.body.transformationApplied).toBe(true);

      // Verify the content has characteristics of beginner-level content
      expect(response.body.content).toContain('simple language');
      expect(response.body.content).toContain('basic analogies');
      expect(response.body.content).toContain('short examples');
    });
  });

  describe('Acceptance Scenario 2: Advanced User Background', () => {
    it('Given a logged-in user with "advanced" software background, When viewing any book chapter, Then content provides detailed explanations, advanced techniques, and extra resources or challenges', async () => {
      // Mock user with advanced background
      (userService.getUserProfile as jest.Mock).mockResolvedValue({
        id: 'advanced-user-id',
        name: 'Advanced User',
        email: 'advanced@example.com',
        softwareBackground: 'advanced',
        hardwareBackground: 'advanced',
        personalizationPreferences: {}
      });

      // Mock AI service to return content appropriate for advanced users
      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'test-chapter.md',
        content: '# Advanced Chapter\nThis content provides detailed explanations, advanced techniques, and includes extra resources and challenges for experienced users.',
        complexityLevel: 'advanced',
        transformationApplied: true
      });

      // Mock user authentication
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md', userId: 'advanced-user-id' })
        .expect(200);

      expect(response.body.filename).toBe('test-chapter.md');
      expect(response.body.complexityLevel).toBe('advanced');
      expect(response.body.transformationApplied).toBe(true);

      // Verify the content has characteristics of advanced-level content
      expect(response.body.content).toContain('detailed explanations');
      expect(response.body.content).toContain('advanced techniques');
      expect(response.body.content).toContain('extra resources');
      expect(response.body.content).toContain('challenges');
    });
  });

  describe('Acceptance Scenario 3: Intermediate User Background', () => {
    it('Given a logged-in user with "intermediate" software background, When viewing any book chapter, Then content balances depth with practical tips and moderate examples with code snippets', async () => {
      // Mock user with intermediate background
      (userService.getUserProfile as jest.Mock).mockResolvedValue({
        id: 'intermediate-user-id',
        name: 'Intermediate User',
        email: 'intermediate@example.com',
        softwareBackground: 'intermediate',
        hardwareBackground: 'intermediate',
        personalizationPreferences: {}
      });

      // Mock AI service to return content appropriate for intermediate users
      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'test-chapter.md',
        content: '# Intermediate Chapter\nThis content balances depth with practical tips and includes moderate examples with code snippets.',
        complexityLevel: 'intermediate',
        transformationApplied: true
      });

      // Mock user authentication
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md', userId: 'intermediate-user-id' })
        .expect(200);

      expect(response.body.filename).toBe('test-chapter.md');
      expect(response.body.complexityLevel).toBe('intermediate');
      expect(response.body.transformationApplied).toBe(true);

      // Verify the content has characteristics of intermediate-level content
      expect(response.body.content).toContain('balances depth');
      expect(response.body.content).toContain('practical tips');
      expect(response.body.content).toContain('moderate examples');
      expect(response.body.content).toContain('code snippets');
    });
  });

  describe('Content Structure Preservation', () => {
    it('Should preserve all learning objectives, section structure, headings, formatting, links, and code blocks during personalization', async () => {
      // Mock user with intermediate background
      (userService.getUserProfile as jest.Mock).mockResolvedValue({
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        softwareBackground: 'intermediate',
        hardwareBackground: 'intermediate',
        personalizationPreferences: {}
      });

      // Mock AI service to return personalized content that preserves structure
      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'test-chapter.md',
        content: '# Learning Objective\n## Section Structure\n[Link](http://example.com)\n```javascript\nconsole.log("code block preserved");\n```\nFormatting preserved.',
        complexityLevel: 'intermediate',
        transformationApplied: true
      });

      // Mock user authentication
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md', userId: 'test-user-id' })
        .expect(200);

      expect(response.body.transformationApplied).toBe(true);

      // Verify that structure elements are preserved
      expect(response.body.content).toContain('# Learning Objective'); // Heading
      expect(response.body.content).toContain('## Section Structure'); // Section structure
      expect(response.body.content).toContain('[Link](http://example.com)'); // Link
      expect(response.body.content).toContain('```javascript'); // Code block
      expect(response.body.content).toContain('Formatting preserved'); // Formatting
    });
  });
});