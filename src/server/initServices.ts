// src/server/initServices.ts - Initialize services after environment variables are loaded
import dotenv from 'dotenv';
dotenv.config();

// Import and initialize services after environment is loaded
import { AIService } from '../services/aiService';
import { UserService } from '../services/userService';
import { ContentPersonalizer } from '../services/contentPersonalizer';

// Create service instances with proper environment
const aiService = new AIService();
const userService = new UserService();
const contentPersonalizer = new ContentPersonalizer(aiService, userService);

export { aiService, userService, contentPersonalizer };