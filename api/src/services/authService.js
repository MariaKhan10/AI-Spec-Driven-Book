const User = require('../models/User');
const Session = require('../models/Session');
const { validate } = require('../utils/validation');

class AuthService {
  // Register a new user
  static async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }

      // Create the user
      const newUser = await User.create({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        software_background: userData.software_background,
        hardware_background: userData.hardware_background
      });

      // Create a session for the new user (auto-login)
      const session = await Session.create(newUser.id);

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          software_background: newUser.software_background,
          hardware_background: newUser.hardware_background,
          email_verified: newUser.email_verified,
          created_at: newUser.created_at,
          updated_at: newUser.updated_at
        },
        token: session.token,
        expires_at: session.expires_at
      };
    } catch (error) {
      throw error;
    }
  }

  // Login user
  static async login(credentials) {
    try {
      // Find user by email
      const user = await User.findByEmail(credentials.email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await User.verifyPassword(credentials.password, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Create a new session
      const session = await Session.create(user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          software_background: user.software_background,
          hardware_background: user.hardware_background,
          email_verified: user.email_verified,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        token: session.token,
        expires_at: session.expires_at
      };
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  static async logout(token) {
    try {
      // Delete the session
      await Session.delete(token);
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Get current user profile
  static async getCurrentUser(token) {
    try {
      // Find the session by token
      const session = await Session.findByToken(token);
      if (!session) {
        throw new Error('Invalid or expired session');
      }

      // Return user data from the session
      return {
        id: session.user_id,
        email: session.email,
        name: session.name,
        software_background: session.software_background,
        hardware_background: session.hardware_background,
        email_verified: session.email_verified,
        created_at: session.created_at,
        updated_at: session.updated_at
      };
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(userId, profileData) {
    try {
      // Update the user profile
      const updatedUser = await User.updateProfile(userId, profileData);

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        software_background: updatedUser.software_background,
        hardware_background: updatedUser.hardware_background,
        email_verified: updatedUser.email_verified,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at
      };
    } catch (error) {
      throw error;
    }
  }

  // Validate user credentials
  static async validateCredentials(credentials) {
    try {
      // Find user by email
      const user = await User.findByEmail(credentials.email);
      if (!user) {
        return { isValid: false, error: 'Invalid credentials' };
      }

      // Verify password
      const isValidPassword = await User.verifyPassword(credentials.password, user.password_hash);
      if (!isValidPassword) {
        return { isValid: false, error: 'Invalid credentials' };
      }

      return { isValid: true, user };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }
}

module.exports = AuthService;