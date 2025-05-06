import axios from 'axios';

// Storage keys
const TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Custom event name for auth state changes
const AUTH_STATE_CHANGE_EVENT = 'authStateChanged';

// Base URL for the API
const API_BASE_URL = 'https://0694ccf2-041a-4b78-8059-c26c5104da1d.mock.pstmn.io';

class AuthService {
  /**
   * Dispatch auth state change event
   * @private
   */
  _dispatchAuthStateChanged() {
    // Create and dispatch a custom event when auth state changes
    window.dispatchEvent(new CustomEvent(AUTH_STATE_CHANGE_EVENT, {
      detail: this.getCurrentUser()
    }));
  }

  /**
   * Authenticate user and store token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - User data if successful
   */
  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
        
        // Dispatch custom event
        this._dispatchAuthStateChanged();
        
        return response.data.user;
      }
      
      return Promise.reject(new Error('Authentication failed: No token received'));
    } catch (error) {
      // Handle specific error status codes as per API documentation
      if (error.response) {
        switch (error.response.status) {
          case 400:
            return Promise.reject(new Error('Invalid input data. Please check your email and password.'));
          case 401:
            return Promise.reject(new Error('Invalid credentials. Please check your email and password.'));
          case 403:
            return Promise.reject(new Error('Account disabled or pending verification. Please contact support.'));
          case 500:
            return Promise.reject(new Error('Server error. Please try again later.'));
          default:
            return Promise.reject(new Error(error.response.data?.message || 'Authentication failed. Please try again.'));
        }
      }
      return Promise.reject(new Error('Authentication failed. Please check your network connection.'));
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User full name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.role - User role (donor, beneficiary, ngo, admin)
   * @param {Object} userData.address - User address information
   * @param {string} userData.phone - User phone number
   * @returns {Promise} - User data if successful
   */
  async register(userData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
        
        // Dispatch custom event
        this._dispatchAuthStateChanged();
        
        return response.data.user;
      }
      
      return Promise.reject(new Error('Registration failed: No token received'));
    } catch (error) {
      // Handle specific error status codes as per API documentation
      if (error.response) {
        switch (error.response.status) {
          case 400:
            return Promise.reject(new Error('Invalid input data or validation errors. Please check your information.'));
          case 409:
            return Promise.reject(new Error('Email already registered. Please use a different email or try logging in.'));
          case 500:
            return Promise.reject(new Error('Server error. Please try again later.'));
          default:
            return Promise.reject(new Error(error.response.data?.message || 'Registration failed. Please try again.'));
        }
      }
      return Promise.reject(new Error('Registration failed. Please check your network connection.'));
    }
  }

  /**
   * Log out current user
   */
  async logout() {
    const token = this.getToken();
    
    try {
      if (token) {
        // Notify server about logout to invalidate the token
        await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.warn('Logout notification failed', error);
    } finally {
      // Always clear local storage, even if server logout fails
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      
      // Dispatch custom event
      this._dispatchAuthStateChanged();
    }
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
    return !!this.getToken() && !!this.getCurrentUser();
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
   * Check if user has specific role
   * @param {string|string[]} roles - Role or array of roles to check
   * @returns {boolean} - True if user has any of the specified roles
   */
  hasRole(roles) {
    const user = this.getCurrentUser();
    
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  }

  /**
   * Update user profile data
   * @param {Object} updatedData - User data to update (name, address, phone)
   * @returns {Promise} - Updated user data
   */
  async updateProfile(updatedData) {
    try {
      const token = this.getToken();
      
      if (!token) {
        return Promise.reject(new Error('Authentication required. Please login.'));
      }
      
      const response = await axios.put(
        `${API_BASE_URL}/api/auth/profile`, 
        updatedData,
        { 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.user) {
        // Update the user data in local storage
        const currentUser = this.getCurrentUser();
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
        return updatedUser;
      }
      
      return Promise.reject(new Error('Profile update failed: No user data received'));
    } catch (error) {
      // Handle specific error status codes as per API documentation
      if (error.response) {
        switch (error.response.status) {
          case 400:
            return Promise.reject(new Error('Invalid input data. Please check your information.'));
          case 401:
            this.logout(); // Token is invalid, so logout
            return Promise.reject(new Error('Authentication required. Please login again.'));
          case 500:
            return Promise.reject(new Error('Server error. Please try again later.'));
          default:
            return Promise.reject(new Error(error.response.data?.message || 'Profile update failed. Please try again.'));
        }
      }
      return Promise.reject(new Error('Profile update failed. Please check your network connection.'));
    }
  }

  /**
   * Refresh authentication token
   * @returns {Promise} - New token if successful
   */
  async refreshToken() {
    try {
      const currentToken = this.getToken();
      
      if (!currentToken) {
        return Promise.reject(new Error('No token available to refresh'));
      }
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {
        token: currentToken
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        
        // Store expiration time if provided
        if (response.data.expiresAt) {
          localStorage.setItem('tokenExpiresAt', response.data.expiresAt);
        }
        
        return response.data.token;
      }
      
      // If refresh fails, log out the user
      this.logout();
      return Promise.reject(new Error('Token refresh failed. Please login again.'));
    } catch (error) {
      // Handle specific error status codes as per API documentation
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // Invalid token
            this.logout();
            return Promise.reject(new Error('Invalid token. Please login again.'));
          case 403:
            // Token revoked or refresh not allowed
            this.logout();
            return Promise.reject(new Error('Session expired or revoked. Please login again.'));
          case 500:
            return Promise.reject(new Error('Server error. Please try again later.'));
          default:
            this.logout();
            return Promise.reject(new Error('Session expired. Please login again.'));
        }
      }
      
      this.logout();
      return Promise.reject(new Error('Token refresh failed. Please check your network connection.'));
    }
  }

  /**
   * Mock login function for testing different user roles
   * Only for development use!
   * @param {string} role - Role to login as ('admin', 'donor', 'beneficiary', 'ngo')
   */
  mockLoginAs(role) {
    const validRoles = ['admin', 'donor', 'beneficiary', 'ngo'];
    
    if (!validRoles.includes(role)) {
      console.error(`Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`);
      return;
    }
    
    // Create mock user data
    const mockUser = {
      id: `mock-${role}-1`,
      name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
      email: `${role}@example.com`,
      role: role,
      avatar: null,
      createdAt: new Date().toISOString()
    };
    
    // Create mock token
    const mockToken = `mock-${role}-token-${Date.now()}`;
    
    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(mockUser));
    
    // Dispatch auth state change event
    this._dispatchAuthStateChanged();
    
    console.log(`[DEV] Logged in as ${role} user:`, mockUser);
    return mockUser;
  }
}

// Export event name as well
export const AUTH_EVENT = AUTH_STATE_CHANGE_EVENT;

// Create and export singleton instance
const authService = new AuthService();
export default authService;
