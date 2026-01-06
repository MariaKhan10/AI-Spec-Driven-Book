const db = require('../config/db');

/**
 * Create database tables for the authentication and personalization system
 */
const createTables = async () => {
  try {
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        software_background TEXT CHECK (software_background IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
        hardware_background TEXT CHECK (hardware_background IN ('low-end', 'mid', 'high')) DEFAULT 'low-end',
        email_verified INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create sessions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create user_preferences table
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        theme TEXT DEFAULT 'light',
        language TEXT DEFAULT 'en',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create indexes for performance
    await db.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);');

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  }
};

module.exports = { createTables };