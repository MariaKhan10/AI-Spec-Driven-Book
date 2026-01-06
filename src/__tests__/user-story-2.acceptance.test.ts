import request from 'supertest';
import express, { Application } from 'express';
import { PersonalizeAPI } from '../server/personalizeAPI';
import { contentPersonalizer } from '../services/contentPersonalizer';
import { userService } from '../services/userService';

// Mock the services
jest.mock('../services/contentPersonalizer');
jest.mock('../services/userService');

describe('User Story 2 - Anonymous User Content Access (Acceptance Tests)', () => {
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

  describe('Acceptance Scenario 1: Unauthenticated User Access', () => {
    it('Given an unauthenticated user (userId is undefined/null), When viewing any book chapter, Then content is displayed exactly as-is without any personalization', async () => {
      // Mock original content without personalization
      const originalContent = '# Original Chapter\nThis is the original content without any personalization.\n\n## Section\nContent remains unchanged.';

      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'test-chapter.md',
        content: originalContent,
        complexityLevel: 'original',
        transformationApplied: false
      });

      // Test with no userId provided (anonymous user)
      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'test-chapter.md' }) // No userId provided
        .expect(200);

      expect(response.body.filename).toBe('test-chapter.md');
      expect(response.body.complexityLevel).toBe('original');
      expect(response.body.transformationApplied).toBe(false);
      expect(response.body.content).toBe(originalContent);

      // Verify that the content is exactly as it was originally
      expect(response.body.content).toContain('# Original Chapter');
      expect(response.body.content).toContain('This is the original content without any personalization.');
      expect(response.body.content).toContain('## Section');
      expect(response.body.content).toContain('Content remains unchanged.');
    });
  });

  describe('Content Structure Preservation for Anonymous Users', () => {
    it('Should preserve all learning objectives, section structure, headings, formatting, links, and code blocks for anonymous users', async () => {
      const originalContentWithStructure = '# Learning Objective\n## Section Structure\n[Example Link](http://example.com)\n\n```javascript\n// Code block preserved\nconsole.log("Hello World");\n```\n\nFormatting like *italics* and **bold** preserved.';

      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'structured-chapter.md',
        content: originalContentWithStructure,
        complexityLevel: 'original',
        transformationApplied: false
      });

      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'structured-chapter.md' }) // No userId provided (anonymous)
        .expect(200);

      // Verify that all structure elements are preserved
      expect(response.body.content).toContain('# Learning Objective'); // Learning objective preserved
      expect(response.body.content).toContain('## Section Structure'); // Section structure preserved
      expect(response.body.content).toContain('[Example Link](http://example.com)'); // Link preserved
      expect(response.body.content).toContain('```javascript'); // Code block opening preserved
      expect(response.body.content).toContain('console.log("Hello World");'); // Code content preserved
      expect(response.body.content).toContain('Formatting like *italics* and **bold**'); // Formatting preserved
    });
  });

  describe('Anonymous User Content Access Verification', () => {
    it('Should ensure that anonymous users can access content without authentication requirements', async () => {
      const originalContent = '# Public Content\nThis content is available to all users.';

      (contentPersonalizer.personalizeChapter as jest.Mock).mockResolvedValue({
        filename: 'public-chapter.md',
        content: originalContent,
        complexityLevel: 'original',
        transformationApplied: false
      });

      // Anonymous user access should succeed without authentication
      const response = await request(app)
        .get('/api/personalize')
        .query({ chapter: 'public-chapter.md' })
        .expect(200);

      expect(response.body.transformationApplied).toBe(false);
      expect(response.body.complexityLevel).toBe('original');
      expect(response.body.content).toBe(originalContent);
    });
  });
});