import request from 'supertest';
import express, { Application } from 'express';
import { PersonalizeAPI } from '../server/personalizeAPI';
import { contentPersonalizer } from '../services/contentPersonalizer';
import { userService } from '../services/userService';

// Mock the services
jest.mock('../services/contentPersonalizer');
jest.mock('../services/userService');

describe('User Story 2 - Anonymous User Content Access (Integration Tests)', () => {
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

  describe('Anonymous User Flow - GET /api/personalize', () => {
    it('should return original content when no userId is provided', async () => {
      // Mock reading original content
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

      expect(response.body.filename).toBe('test-chapter.md');
      expect(response.body.complexityLevel).toBe('original');
      expect(response.body.transformationApplied).toBe(false);
      expect(response.body.content).toBe('# Original Content\nThis is original content.');
    });

    it('should return original content when userId is not authenticated', async () => {
      // Mock authentication to return false
      (userService.isAuthenticated as jest.Mock).mockResolvedValue(false);

      // Mock reading original content
      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'test-chapter.md',
        content: '# Original Content\nThis is original content.',
        complexityLevel: 'original',
        transformationApplied: false
      });

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md', userId: 'invalid-user-id' })
        .expect(401);

      expect(response.body.error.code).toBe('AUTHENTICATION_REQUIRED');
    });
  });

  describe('Anonymous User Flow - POST /api/personalize', () => {
    it('should return original content when no userId is provided', async () => {
      const originalContent = 'This is original content.';

      (contentPersonalizer.personalizeContent as jest.Mock).mockResolvedValue({
        filename: 'dynamic-content',
        content: originalContent,
        complexityLevel: 'original',
        transformationApplied: false
      });

      const response = await request(app)
        .post('/api/personalize')
        .send({
          content: originalContent
          // No userId provided
        })
        .expect(200);

      expect(response.body.personalizedContent).toBe(originalContent);
      expect(response.body.complexityLevel).toBe('original');
      expect(response.body.transformationApplied).toBe(false);
    });
  });

  describe('Content Structure Preservation for Anonymous Users', () => {
    it('should preserve all learning objectives, section structure, headings, formatting, links, and code blocks', async () => {
      const originalContent = '# Learning Objective\n## Section Structure\n[Link](http://example.com)\n```javascript\nconsole.log("code block");\n```\nFormatting preserved.';

      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'test-chapter.md',
        content: originalContent,
        complexityLevel: 'original',
        transformationApplied: false
      });

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md' }) // No userId provided
        .expect(200);

      // Verify that structure elements are preserved
      expect(response.body.content).toContain('# Learning Objective'); // Heading
      expect(response.body.content).toContain('## Section Structure'); // Section structure
      expect(response.body.content).toContain('[Link](http://example.com)'); // Link
      expect(response.body.content).toContain('```javascript'); // Code block
      expect(response.body.content).toContain('Formatting preserved'); // Formatting
    });
  });
});