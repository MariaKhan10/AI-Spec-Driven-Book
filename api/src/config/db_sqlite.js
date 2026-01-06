const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Use SQLite for development, PostgreSQL for production
const isProduction = process.env.NODE_ENV === 'production';
let db;

if (isProduction) {
  // Use PostgreSQL (existing code)
  const { Pool } = require('pg');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Neon connection
    },
    max: 5, // Lower max connections for serverless
    min: 1, // Minimum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 10000, // Increase timeout for serverless wake-up
    keepAlive: true, // Enable keep alive
    keepAliveInitialDelayMillis: 5000, // Send keep alive after 5 seconds
  });

  // Handle connection errors gracefully
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  // Export database utilities for PostgreSQL
  module.exports = {
    query: async (text, params) => {
      try {
        return await pool.query(text, params);
      } catch (error) {
        console.error('Database query error:', error);
        throw error;
      }
    },
    pool
  };
} else {
  // Use SQLite for development
  const dbPath = path.join(__dirname, '../../database.sqlite');
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening SQLite database:', err);
    } else {
      console.log('Connected to SQLite database');

      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON;', (err) => {
        if (err) {
          console.error('Error enabling foreign keys:', err);
        } else {
          console.log('Foreign keys enabled');
        }
      });
    }
  });

  // Export database utilities for SQLite
  module.exports = {
    query: (text, params = []) => {
      return new Promise((resolve, reject) => {
        // Convert PostgreSQL-style $1, $2 placeholders to SQLite ? placeholders
        const sqliteQuery = text.replace(/\$(\d+)/g, '?');

        if (text.trim().toUpperCase().startsWith('SELECT')) {
          // For SELECT queries
          db.all(sqliteQuery, params, (err, rows) => {
            if (err) {
              console.error('Database query error:', err);
              reject(err);
            } else {
              resolve({ rows });
            }
          });
        } else {
          // For INSERT, UPDATE, DELETE queries
          db.run(sqliteQuery, params, function (err) {
            if (err) {
              console.error('Database query error:', err);
              reject(err);
            } else {
              resolve({
                rowCount: this.changes,
                lastID: this.lastID
              });
            }
          });
        }
      });
    },
    close: () => {
      if (db) {
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('Database connection closed');
          }
        });
      }
    }
  };
}