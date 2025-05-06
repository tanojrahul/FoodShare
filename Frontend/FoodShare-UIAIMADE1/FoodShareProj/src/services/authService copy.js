import axios from 'axios';

// Storage keys
const TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

/**
 * Authentication service for FoodShare application
 * Handles login, registration, logout and token management
 */
class AuthService {
  /**
   * Authenticate user and store token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - User data if successful
   */
  async login(email, password) {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
        return response.data.user;
      }
      
      return Promise.reject(new Error('Authentication failed: No token received'));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Authentication failed. Please try again.';
      return Promise.reject(new Error(errorMessage));
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User full name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.role - User role (donor, beneficiary, ngo, admin)
   * @returns {Promise} - User data if successful
   */
  async register(userData) {
    try {
      const response = await axios.post('/api/auth/register', userData);
      
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
        return response.data.user;
      }
      
      return Promise.reject(new Error('Registration failed: No token received'));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      return Promise.reject(new Error(errorMessage));
    }
  }

  /**
   * Log out current user
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }

  /**
   * Get current authenticated user data
   * @returns {Object|null} - User data or null if not authenticated
   */
  getCurrentUser() {
    try {
      const userData = localStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      this.logout(); // Clear potentially corrupted data
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Get authentication token
   * @returns {string|null} - JWT token or null if not authenticated
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Get authorization header for API requests
   * @returns {Object} - Authorization header object
   */
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Refresh authentication token (scaffold for future implementation)
   * @returns {Promise} - New token if successful
   */
  async refreshToken() {
    try {
      const response = await axios.post('/api/auth/refresh-token', {
        token: this.getToken()
      });
      
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        return response.data.token;
      }
      
      // If refresh fails, log out the user
      this.logout();
      return Promise.reject(new Error('Session expired. Please login again.'));
    } catch (error) {
      this.logout();
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;
