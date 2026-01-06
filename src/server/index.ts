// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

// Import services after environment is loaded
import express, { Request, Response } from 'express';
import cors from 'cors';

// Import types for TypeScript
import { ContentPersonalizer } from '../services/contentPersonalizer';
import { UserService } from '../services/userService';

// Import PersonalizeAPI class
import { PersonalizeAPI } from './personalizeAPI';

// Create service instances after environment is loaded
// We'll use dynamic imports to ensure environment is loaded first
async function initializeServices() {
  // Dynamic import to ensure environment variables are loaded
  const { AIService } = await import('../services/aiService');
  const { UserService } = await import('../services/userService');
  const { ContentPersonalizer } = await import('../services/contentPersonalizer');

  const aiService = new AIService();
  const userService = new UserService();
  const contentPersonalizer = new ContentPersonalizer(aiService, userService);

  // Set the initialized services on PersonalizeAPI
  PersonalizeAPI.contentPersonalizer = contentPersonalizer;
  PersonalizeAPI.userService = userService;

  return { aiService, userService, contentPersonalizer };
}

// Initialize services and start server
initializeServices()
  .then(() => {
    const app = express();
    const PORT = 3001; // Force port 3001 to match client expectations

    // CORS configuration to allow requests from Docusaurus app
    const corsOptions = {
      origin: [
        'http://localhost:3000',
        'http://localhost:3000/AI-Spec-Driven-Book', // In case of base URL
        'http://localhost:5001', // Backend API for internal communication
        'http://localhost:3001'  // Self-origin
      ],
      credentials: true,
      optionsSuccessStatus: 200
    };

    // Middleware
    app.use(cors(corsOptions));
    app.use(express.json());

    // API Routes
    app.get('/api/personalize', PersonalizeAPI.getPersonalize);
    app.post('/api/personalize', PersonalizeAPI.postPersonalize);
    app.get('/api/personalization-settings', PersonalizeAPI.getPersonalizationSettings);
    app.put('/api/personalization-settings', PersonalizeAPI.putPersonalizationSettings);
    app.post('/api/personalize/batch', PersonalizeAPI.postBatchPersonalize);

    // Health check endpoint
    app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch(error => {
    console.error('Error initializing services:', error);
    process.exit(1);
  });