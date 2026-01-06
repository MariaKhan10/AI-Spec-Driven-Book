const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const personalizationRoutes = require('./routes/personalization');
const preferencesRoutes = require('./routes/preferences');

// Import database migrations
const { createTables } = require('./db/migrations');

const app = express();
const PORT = process.env.API_PORT || process.env.PORT || 5001;  // Changed from 3001 to 5001 to avoid conflict

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
const allowedOrigins = process.env.AUTH_URL ?
  process.env.AUTH_URL.split(',').map(url => url.trim())
  : ['http://localhost:3000'];

// For development, also allow the API port itself
if (process.env.NODE_ENV === 'development') {
  allowedOrigins.push('http://localhost:3001');
  allowedOrigins.push('http://localhost:5001');
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/personalize', personalizationRoutes);
app.use('/api/preferences', preferencesRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Try a simple database query to verify connection
    const db = require('./config/db');
    await db.query('SELECT 1');
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
async function startServer() {
  try {
    // Run database migrations
    await createTables();
    console.log('Database initialized successfully');

    app.listen(PORT, () => {
      console.log(`Authentication API server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;