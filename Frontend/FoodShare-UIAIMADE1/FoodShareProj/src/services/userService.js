import axios from 'axios';
import authService from './authService';

// Base URL for the API
const API_BASE_URL = 'https://0694ccf2-041a-4b78-8059-c26c5104da1d.mock.pstmn.io';

/**
 * Service for managing user-related API operations
 * Handles API communications for user profile management and administration
 */
class UserService {
  /**
   * Get detailed user profile information
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User profile data
   */
  async getUserProfile(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/${userId}`, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch user profile');
    }
  }

  /**
   * Update a user's profile information
   * @param {string} userId - User ID
   * @param {Object} payload - Updated profile data
   * @returns {Promise<Object>} - Updated user profile
   */
  async updateUserProfile(userId, payload) {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/${userId}`, payload, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to update user profile');
    }
  }

  /**
   * Get list of all users (admin only)
   * @param {Object} [filters] - Optional filters (role, status, etc.)
   * @returns {Promise<Array>} - List of users
   */
  async getAllUsers(filters = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        params: filters,
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch users list');
    }
  }

  /**
   * Change a user's role (admin only)
   * @param {string} userId - User ID
   * @param {string} newRole - New role to assign (donor, beneficiary, ngo, admin)
   * @returns {Promise<Object>} - Updated user data
   */
  async changeUserRole(userId, newRole) {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: authService.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to change user role');
    }
  }

  /**
   * Get reward point history for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - List of reward transactions
   */
  async getRewardHistory(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/rewards/${userId}`, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch reward history');
    }
  }

  /**
   * Deactivate a user account (admin only)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Response data
   */
  async deactivateUser(userId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to deactivate user');
    }
  }

  /**
   * Get user statistics and activity data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User statistics
   */
  async getUserStats(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/stats`, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch user statistics');
    }
  }

  /**
   * Search for users based on criteria (admin only)
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Array>} - List of matching users
   */
  async searchUsers(searchParams) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/users/search`, {
        params: searchParams,
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to search users');
    }
  }

  /**
   * Add reward points to a user (admin only)
   * @param {string} userId - User ID
   * @param {number} points - Points to add
   * @param {string} reason - Reason for adding points
   * @returns {Promise<Object>} - Updated rewards data
   */
  async addRewardPoints(userId, points, reason) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/rewards/${userId}/add`,
        { points, reason },
        { headers: authService.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to add reward points');
    }
  }

  /**
   * Verify a user's identity (admin only)
   * @param {string} userId - User ID
   * @param {boolean} isVerified - Verification status
   * @returns {Promise<Object>} - Updated user data
   */
  async verifyUser(userId, isVerified) {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/admin/users/${userId}/verify`,
        { isVerified },
        { headers: authService.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to update user verification status');
    }
  }

  /**
   * Update a user's status (active, disabled, pending) - admin only
   * @param {string} userId - User ID
   * @param {string} status - New status (active, disabled, pending)
   * @returns {Promise<Object>} - Updated user data
   */
  async updateUserStatus(userId, status) {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/admin/users/${userId}/status`,
        { status },
        { headers: authService.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to update user status');
    }
  }

  /**
   * Handle API errors consistently
   * @private
   * @param {Error} error - The error object
   * @param {string} defaultMessage - Default error message
   */
  _handleError(error, defaultMessage) {
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      defaultMessage;
    
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
}

// Create singleton instance
const userService = new UserService();

// Export individual methods for direct import
export const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  changeUserRole,
  getRewardHistory,
  deactivateUser,
  getUserStats,
  searchUsers,
  addRewardPoints,
  verifyUser,
  updateUserStatus
} = userService;

// Export the entire service as default
export default userService;
