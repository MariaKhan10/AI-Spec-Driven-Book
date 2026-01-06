const { query } = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); // Add UUID library

class User {
  constructor(userData) {
    this.id = userData.id || null;
    this.email = userData.email;
    this.name = userData.name || null;
    this.password_hash = userData.password_hash;
    this.software_background = userData.software_background || 'beginner';
    this.hardware_background = userData.hardware_background || 'low-end';
    this.email_verified = userData.email_verified || 0; // 0 for false in SQLite
    this.created_at = userData.created_at || new Date().toISOString();
    this.updated_at = userData.updated_at || new Date().toISOString();
  }

  // Create a new user
  static async create(userData) {
    const { email, password, name, software_background, hardware_background } = userData;

    // Hash the password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const userId = uuidv4(); // Generate UUID manually for SQLite

    const queryText = `
      INSERT INTO users (id, email, name, password_hash, software_background, hardware_background, email_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [userId, email, name, password_hash, software_background, hardware_background, 0, new Date().toISOString(), new Date().toISOString()];

    try {
      await query(queryText, values);

      // Return the created user
      return await User.findById(userId);
    } catch (error) {
      // SQLite unique constraint error code is different
      if (error.errno === 19 || error.code === 'SQLITE_CONSTRAINT') { // Unique constraint violation
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const queryText = 'SELECT * FROM users WHERE email = ?';
    const values = [email];

    const result = await query(queryText, values);
    const user = Array.isArray(result.rows) ? result.rows[0] : null;

    // Convert SQLite integer boolean to JavaScript boolean
    if (user) {
      user.email_verified = Boolean(user.email_verified);
    }

    return user;
  }

  // Find user by ID
  static async findById(id) {
    const queryText = 'SELECT id, email, name, software_background, hardware_background, email_verified, created_at, updated_at FROM users WHERE id = ?';
    const values = [id];

    const result = await query(queryText, values);
    const user = Array.isArray(result.rows) ? result.rows[0] : null;

    // Convert SQLite integer boolean to JavaScript boolean
    if (user) {
      user.email_verified = Boolean(user.email_verified);
    }

    return user;
  }

  // Update user profile
  static async updateProfile(userId, profileData) {
    const { software_background, hardware_background, name } = profileData;

    if (name !== undefined) {
      // Update name along with other fields
      const queryText = `
        UPDATE users
        SET software_background = ?, hardware_background = ?, name = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const values = [software_background, hardware_background, name, userId];

      await query(queryText, values);
    } else {
      // Update only background fields without changing name
      const queryText = `
        UPDATE users
        SET software_background = ?, hardware_background = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const values = [software_background, hardware_background, userId];

      await query(queryText, values);
    }

    return await User.findById(userId);
  }

  // Verify password
  static async verifyPassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }

  // Check if email exists
  static async emailExists(email) {
    const queryText = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
    const values = [email];

    const result = await query(queryText, values);
    const row = Array.isArray(result.rows) ? result.rows[0] : null;
    return row ? parseInt(row.count) > 0 : 0;
  }
}

module.exports = User;