const { query } = require('../config/db');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // Add UUID library
require('dotenv').config();

class Session {
  constructor(sessionData) {
    this.id = sessionData.id || null;
    this.user_id = sessionData.user_id;
    this.token = sessionData.token;
    this.expires_at = sessionData.expires_at;
    this.created_at = sessionData.created_at || new Date().toISOString();
    this.updated_at = sessionData.updated_at || new Date().toISOString();
  }

  // Create a new session
  static async create(userId) {
    // Generate a secure token
    const token = jwt.sign(
      { userId, type: 'session' },
      process.env.AUTH_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' } // 7 days
    );

    const sessionId = uuidv4(); // Generate UUID manually for SQLite

    // Calculate expiration date (7 days from now)
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 7);

    const queryText = `
      INSERT INTO sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `;

    const values = [sessionId, userId, token, expiresDate.toISOString()];

    await query(queryText, values);

    // Return the created session
    return await Session.findByToken(token);
  }

  // Find session by token
  static async findByToken(token) {
    const queryText = `
      SELECT s.*, u.email, u.name, u.software_background, u.hardware_background, u.email_verified, u.created_at as user_created_at, u.updated_at as user_updated_at
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ? AND s.expires_at > ?
    `;
    const values = [token, new Date().toISOString()];

    const result = await query(queryText, values);
    const session = Array.isArray(result.rows) ? result.rows[0] : null;

    // Convert SQLite integer boolean to JavaScript boolean
    if (session) {
      session.email_verified = Boolean(session.email_verified);
    }

    return session;
  }

  // Find session by user ID
  static async findByUserId(userId) {
    const queryText = 'SELECT * FROM sessions WHERE user_id = ? AND expires_at > ?';
    const values = [userId, new Date().toISOString()];

    const result = await query(queryText, values);
    return Array.isArray(result.rows) ? result.rows[0] : null;
  }

  // Delete session (logout)
  static async delete(token) {
    const queryText = 'DELETE FROM sessions WHERE token = ?';
    const values = [token];

    await query(queryText, values);
  }

  // Delete expired sessions
  static async deleteExpired() {
    const queryText = 'DELETE FROM sessions WHERE expires_at <= ?';
    const values = [new Date().toISOString()];
    await query(queryText, values);
  }

  // Refresh session
  static async refresh(token) {
    // Calculate new expiration date (7 days from now)
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + 7);

    const queryText = `
      UPDATE sessions
      SET expires_at = ?
      WHERE token = ? AND expires_at > ?
    `;
    const values = [newExpiry.toISOString(), token, new Date().toISOString()];

    await query(queryText, values);
    return await Session.findByToken(token);
  }
}

module.exports = Session;