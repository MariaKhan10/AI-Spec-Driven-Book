// src/server/serviceFactory.ts - Factory for creating services after environment is loaded
import dotenv from 'dotenv';
dotenv.config();

let _contentPersonalizer: any = null;
let _userService: any = null;

export const serviceFactory = {
  getContentPersonalizer: () => {
    if (!_contentPersonalizer) {
      // Dynamically import and create the service after environment is loaded
      const { AIService } = require('../services/aiService');
      const { UserService } = require('../services/userService');
      const { ContentPersonalizer } = require('../services/contentPersonalizer');

      const aiService = new AIService();
      const userService = new UserService();
      _contentPersonalizer = new ContentPersonalizer(aiService, userService);
    }
    return _contentPersonalizer;
  },

  getUserService: () => {
    if (!_userService) {
      const { UserService } = require('../services/userService');
      _userService = new UserService();
    }
    return _userService;
  }
};