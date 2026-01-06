// jest.setup.js
// Setup file for Jest tests

// Mock environment variables
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-key';
process.env.PERSONALIZATION_CACHE_TTL = process.env.PERSONALIZATION_CACHE_TTL || '3600';

// Add any other setup needed for tests