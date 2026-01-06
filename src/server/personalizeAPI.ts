// src/server/personalizeAPI.ts - Server-side API for content personalization
import { Request, Response } from 'express';
import { ContentPersonalizer } from '../services/contentPersonalizer';
import { UserService } from '../services/userService';
import { createErrorResponse } from '../services/utils';

export class PersonalizeAPI {
  static contentPersonalizer: ContentPersonalizer;
  static userService: UserService;
  /**
   * GET /api/personalize - Get personalized content for a specific chapter and user
   */
  static async getPersonalize(req: Request, res: Response) {
    const { chapter, userId } = req.query;

    // Validate required parameters
    if (!chapter) {
      return res.status(400).json(createErrorResponse(
        'MISSING_PARAMETER',
        'Chapter parameter is required'
      ));
    }

    if (typeof chapter !== 'string') {
      return res.status(400).json(createErrorResponse(
        'INVALID_PARAMETER',
        'Chapter parameter must be a string'
      ));
    }

    try {
      // Check if user is authenticated if userId is provided
      if (userId) {
        if (typeof userId !== 'string') {
          return res.status(400).json(createErrorResponse(
            'INVALID_PARAMETER',
            'UserId parameter must be a string'
          ));
        }

        const isAuthenticated = await PersonalizeAPI.userService.isAuthenticated(userId);
        if (!isAuthenticated) {
          return res.status(401).json(createErrorResponse(
            'AUTHENTICATION_REQUIRED',
            'User authentication required'
          ));
        }
      }

      // Personalize the chapter (if user is authenticated) or return original content (if anonymous)
      const result = await PersonalizeAPI.contentPersonalizer.personalizeChapter(chapter, userId as string);

      // Return the personalized content
      return res.status(200).json({
        filename: result.filename,
        content: result.content,
        complexityLevel: result.complexityLevel,
        transformationApplied: result.transformationApplied
      });
    } catch (error) {
      console.error('Error personalizing chapter:', error);
      return res.status(500).json(createErrorResponse(
        'PERSONALIZATION_FAILED',
        'Error occurred during content personalization'
      ));
    }
  }

  /**
   * POST /api/personalize - Personalize provided content based on user profile
   */
  static async postPersonalize(req: Request, res: Response) {
    const { content, userId, options } = req.body;

    // Validate required parameters
    if (!content) {
      return res.status(400).json(createErrorResponse(
        'MISSING_PARAMETER',
        'Content parameter is required'
      ));
    }

    if (typeof content !== 'string') {
      return res.status(400).json(createErrorResponse(
        'INVALID_PARAMETER',
        'Content parameter must be a string'
      ));
    }

    try {
      // Check if user is authenticated if userId is provided
      if (userId) {
        const isAuthenticated = await PersonalizeAPI.userService.isAuthenticated(userId);
        if (!isAuthenticated) {
          return res.status(401).json(createErrorResponse(
            'AUTHENTICATION_REQUIRED',
            'User authentication required'
          ));
        }
      }

      // Personalize the content
      const result = await PersonalizeAPI.contentPersonalizer.personalizeContent(content, userId);

      // Return the personalized content
      return res.status(200).json({
        personalizedContent: result.content,
        complexityLevel: result.complexityLevel,
        transformationApplied: result.transformationApplied,
        processingTime: Date.now() // Include processing time for performance monitoring
      });
    } catch (error) {
      console.error('Error personalizing content:', error);
      return res.status(500).json(createErrorResponse(
        'PERSONALIZATION_FAILED',
        'Error occurred during content personalization'
      ));
    }
  }

  /**
   * GET /api/personalization-settings - Get current personalization settings for a user
   */
  static async getPersonalizationSettings(req: Request, res: Response) {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json(createErrorResponse(
        'MISSING_PARAMETER',
        'UserId parameter is required'
      ));
    }

    if (typeof userId !== 'string') {
      return res.status(400).json(createErrorResponse(
        'INVALID_PARAMETER',
        'UserId parameter must be a string'
      ));
    }

    try {
      const isAuthenticated = await PersonalizeAPI.userService.isAuthenticated(userId);
      if (!isAuthenticated) {
        return res.status(401).json(createErrorResponse(
          'AUTHENTICATION_REQUIRED',
          'User authentication required'
        ));
      }

      // Get user's personalization settings
      const settings = await PersonalizeAPI.userService.getUserPersonalizationSettings(userId);

      if (!settings) {
        return res.status(404).json(createErrorResponse(
          'SETTINGS_NOT_FOUND',
          'User settings not found'
        ));
      }

      return res.status(200).json(settings);
    } catch (error) {
      console.error('Error fetching personalization settings:', error);
      return res.status(500).json(createErrorResponse(
        'SETTINGS_FETCH_FAILED',
        'Error occurred while fetching settings'
      ));
    }
  }

  /**
   * PUT /api/personalization-settings - Update personalization settings for a user
   */
  static async putPersonalizationSettings(req: Request, res: Response) {
    const { userId, ...settings } = req.body;

    if (!userId) {
      return res.status(400).json(createErrorResponse(
        'MISSING_PARAMETER',
        'UserId parameter is required'
      ));
    }

    try {
      const isAuthenticated = await PersonalizeAPI.userService.isAuthenticated(userId);
      if (!isAuthenticated) {
        return res.status(401).json(createErrorResponse(
          'AUTHENTICATION_REQUIRED',
          'User authentication required'
        ));
      }

      // Update user's personalization settings
      const success = await PersonalizeAPI.userService.updateUserPersonalizationSettings(userId, settings);

      if (!success) {
        return res.status(500).json(createErrorResponse(
          'SETTINGS_UPDATE_FAILED',
          'Failed to update user settings'
        ));
      }

      return res.status(200).json({
        success: true,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating personalization settings:', error);
      return res.status(500).json(createErrorResponse(
        'SETTINGS_UPDATE_FAILED',
        'Error occurred while updating settings'
      ));
    }
  }

  /**
   * POST /api/personalize/batch - Personalize multiple chapters for a user
   */
  static async postBatchPersonalize(req: Request, res: Response) {
    const { chapters, userId } = req.body;

    if (!chapters) {
      return res.status(400).json(createErrorResponse(
        'MISSING_PARAMETER',
        'Chapters parameter is required'
      ));
    }

    if (!Array.isArray(chapters)) {
      return res.status(400).json(createErrorResponse(
        'INVALID_PARAMETER',
        'Chapters must be an array'
      ));
    }

    try {
      // Check if user is authenticated if userId is provided
      if (userId) {
        const isAuthenticated = await PersonalizeAPI.userService.isAuthenticated(userId);
        if (!isAuthenticated) {
          return res.status(401).json(createErrorResponse(
            'AUTHENTICATION_REQUIRED',
            'User authentication required'
          ));
        }
      }

      // Personalize multiple chapters
      const results = await PersonalizeAPI.contentPersonalizer.personalizeMultipleChapters(chapters, userId);

      // Return the personalized content as JSON array
      return res.status(200).json(results);
    } catch (error) {
      console.error('Error in batch personalization:', error);
      return res.status(500).json(createErrorResponse(
        'PERSONALIZATION_FAILED',
        'Error occurred during batch content personalization'
      ));
    }
  }
}