const { query } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class UserPreferences {
  constructor(preferencesData) {
    this.id = preferencesData.id || null;
    this.user_id = preferencesData.user_id;
    this.theme = preferencesData.theme || 'light';
    this.language = preferencesData.language || 'en';
    this.created_at = preferencesData.created_at || new Date().toISOString();
    this.updated_at = preferencesData.updated_at || new Date().toISOString();
  }

  // Create or update user preferences
  static async upsert(userId, preferencesData) {
    const { theme, language } = preferencesData;

    // First, check if preferences already exist for this user
    const existing = await UserPreferences.findByUserId(userId);

    if (existing) {
      // Update existing preferences
      return await UserPreferences.update(userId, preferencesData);
    } else {
      // Create new preferences
      return await UserPreferences.create(userId, preferencesData);
    }
  }

  // Create new user preferences
  static async create(userId, preferencesData) {
    const { theme = 'light', language = 'en' } = preferencesData || {};

    const id = uuidv4();
    const queryText = `
      INSERT INTO user_preferences (id, user_id, theme, language, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [id, userId, theme, language, new Date().toISOString(), new Date().toISOString()];

    await query(queryText, values);

    return await UserPreferences.findByUserId(userId);
  }

  // Update user preferences
  static async update(userId, preferencesData) {
    const { theme, language } = preferencesData;

    const queryText = `
      UPDATE user_preferences
      SET theme = ?, language = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `;

    const values = [theme, language, userId];

    await query(queryText, values);

    return await UserPreferences.findByUserId(userId);
  }

  // Find user preferences by user ID
  static async findByUserId(userId) {
    const queryText = 'SELECT * FROM user_preferences WHERE user_id = ?';
    const values = [userId];

    const result = await query(queryText, values);
    return Array.isArray(result.rows) ? result.rows[0] : null;
  }

  // Get user preferences by ID
  static async findById(id) {
    const queryText = 'SELECT * FROM user_preferences WHERE id = ?';
    const values = [id];

    const result = await query(queryText, values);
    return Array.isArray(result.rows) ? result.rows[0] : null;
  }

  // Delete user preferences
  static async deleteByUserId(userId) {
    const queryText = 'DELETE FROM user_preferences WHERE user_id = ?';
    const values = [userId];

    await query(queryText, values);
  }
}

module.exports = UserPreferences;