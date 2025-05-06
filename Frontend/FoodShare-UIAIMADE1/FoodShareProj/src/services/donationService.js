import axios from 'axios';
import authService from './authService';

// Base URL for the API
const API_BASE_URL = 'https://0694ccf2-041a-4b78-8059-c26c5104da1d.mock.pstmn.io';

/**
 * Service for managing food listings and donation-related operations
 * Handles API communications for creation, updates, and queries
 */
class DonationService {
  /**
   * Create a new food donation listing
   * @param {Object} data - Food listing data
   * @param {string} data.title - Title of the food listing
   * @param {string} data.foodType - Type of food being donated
   * @param {number|string} data.quantity - Amount of food
   * @param {string} data.unit - Unit of measurement (kg, lb, boxes, etc.)
   * @param {string} data.category - Food category (Produce, Canned, etc.)
   * @param {string} data.expiresAt - Expiration date in ISO format
   * @param {string} data.location - Pickup location
   * @param {string} [data.description] - Optional description
   * @returns {Promise<Object>} - Created donation object
   */
  async createFoodListing(data) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/donations/create`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      // Handle specific error status codes as per API documentation
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error('Invalid input data. Please check your donation information.');
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You do not have permission to create donations. Donor role required.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to create food listing');
        }
      }
      throw new Error('Failed to create food listing. Please check your network connection.');
    }
  }

  /**
   * Get all food listings with optional filters and pagination
   * @param {Object} [params] - Optional query parameters
   * @param {string} [params.category] - Filter by food category
   * @param {string} [params.status] - Filter by donation status
   * @param {string} [params.fromDate] - Filter donations created after date
   * @param {string} [params.toDate] - Filter donations created before date
   * @param {number} [params.page] - Page number for pagination
   * @param {number} [params.limit] - Number of results per page
   * @returns {Promise<Object>} - Paginated donations response with metadata
   */
  async getAllFoodListings(params = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/donations/list`, { 
        params,
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      // Handle specific error status codes as per API documentation
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to fetch food listings');
        }
      }
      throw new Error('Failed to fetch food listings. Please check your network connection.');
    }
  }

  /**
   * Get a specific donation by ID with detailed information
   * @param {string} id - Donation ID
   * @returns {Promise<Object>} - Detailed donation object with donor, recipient, and logistics information
   */
  async getDonationById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/donations/${id}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      // Handle specific error status codes as per API documentation
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You do not have permission to access this donation.');
          case 404:
            throw new Error(`Donation with ID ${id} not found.`);
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || `Failed to fetch donation #${id}`);
        }
      }
      throw new Error(`Failed to fetch donation #${id}. Please check your network connection.`);
    }
  }

  /**
   * Update the status of a donation
   * @param {string} id - Donation ID
   * @param {string} status - New status (Pending, Accepted, In Transit, Completed, Cancelled)
   * @returns {Promise<Object>} - Updated donation object
   */
  async updateDonationStatus(id, status) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/donations/${id}/status`, 
        { status },
        { 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error('Invalid status value.');
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You do not have permission to update this donation.');
          case 404:
            throw new Error('Donation not found.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to update donation status');
        }
      }
      throw new Error('Failed to update donation status. Please check your network connection.');
    }
  }

  /**
   * Accept a donation as a beneficiary or NGO
   * @param {string} donationId - ID of the donation to accept
   * @returns {Promise<Object>} - Updated donation object
   */
  async acceptDonation(donationId) {
    return this.updateDonationStatus(donationId, 'Accepted');
  }

  /**
   * Reject a donation as a beneficiary or NGO
   * @param {string} donationId - ID of the donation to reject
   * @returns {Promise<Object>} - Updated donation object
   */
  async rejectDonation(donationId) {
    return this.updateDonationStatus(donationId, 'Rejected');
  }

  /**
   * Process an admin action on a donation
   * @param {string} donationId - ID of the donation
   * @param {string} action - Admin action (approve, reject, flag, mark-delivered, etc.)
   * @param {string} [note] - Optional admin note
   * @returns {Promise<Object>} - Updated donation object
   */
  async processDonationAction(donationId, action, note = '') {
    let status;
    
    switch (action) {
      case 'approve':
        status = 'Approved';
        break;
      case 'reject':
        status = 'Rejected';
        break;
      case 'flag':
        status = 'Flagged';
        break;
      case 'mark-delivered':
        status = 'Delivered';
        break;
      case 'clear-flag':
        status = 'Available';
        break;
      default:
        status = action;
    }
    
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/donations/${donationId}/admin-action`, 
        { status, note },
        { 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
          } 
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error('Invalid action or parameters.');
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You do not have permission to perform this action.');
          case 404:
            throw new Error('Donation not found.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || `Failed to perform admin action: ${action}`);
        }
      }
      throw new Error(`Failed to perform admin action. Please check your network connection.`);
    }
  }

  /**
   * Get all donations created by a specific donor
   * @param {string} userId - Donor's user ID
   * @returns {Promise<Array>} - Array of donor's donations
   */
  async getDonorDonations(userId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/donations/donor/${userId}`, 
        {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You do not have permission to view these donations.');
          case 404:
            throw new Error('User or donations not found.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to fetch donor donations');
        }
      }
      throw new Error('Failed to fetch donor donations. Please check your network connection.');
    }
  }

  /**
   * Claim a donation as a beneficiary or NGO
   * @param {string} donationId - Donation ID to claim
   * @param {string} beneficiaryId - ID of claiming beneficiary/NGO
   * @param {string} [claimNotes] - Optional notes about the claim
   * @returns {Promise<Object>} - Updated donation with claim information
   */
  async claimDonation(donationId, beneficiaryId, claimNotes = '') {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/donations/claim`,
        { donationId, beneficiaryId, claimNotes },
        { 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes as per API documentation
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error('Invalid request or donation not available.');
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You do not have permission to claim donations. Beneficiary or NGO role required.');
          case 404:
            throw new Error('Donation not found.');
          case 409:
            throw new Error('This donation has already been claimed by another user.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to claim donation');
        }
      }
      throw new Error('Failed to claim donation. Please check your network connection.');
    }
  }

  /**
   * Get all donations claimed by a specific beneficiary
   * @param {string} beneficiaryId - Beneficiary's user ID
   * @param {Object} [params] - Optional query parameters
   * @param {string} [params.status] - Filter by donation status
   * @param {number} [params.page] - Page number for pagination
   * @param {number} [params.limit] - Number of results per page
   * @returns {Promise<Object>} - Object containing claimed donations and pagination info
   */
  async getClaimedDonations(beneficiaryId, params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/donations/claimed/${beneficiaryId}`, 
        {
          params,
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes as per API documentation
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You do not have permission to view these donations.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to fetch claimed donations');
        }
      }
      throw new Error('Failed to fetch claimed donations. Please check your network connection.');
    }
  }

  /**
   * Get available donations for beneficiaries to browse with optional filtering
   * @param {Object} [params] - Optional query parameters
   * @param {string} [params.category] - Filter by food category
   * @param {number} [params.distance] - Maximum distance in km
   * @param {number} [params.latitude] - Latitude for location-based search
   * @param {number} [params.longitude] - Longitude for location-based search
   * @param {string} [params.expiryRange] - Filter by expiration timeframe
   * @param {number} [params.page] - Page number for pagination
   * @param {number} [params.limit] - Number of results per page
   * @returns {Promise<Object>} - Object containing available donations and pagination info
   */
  async fetchAvailableDonations(params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/donations/available`, 
        {
          params,
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes as per API documentation
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to fetch available donations');
        }
      }
      throw new Error('Failed to fetch available donations. Please check your network connection.');
    }
  }

  /**
   * Request a donation as a beneficiary
   * @param {string} donationId - ID of the donation to request
   * @param {string} beneficiaryId - ID of requesting beneficiary
   * @param {string} [requestNotes] - Optional notes about the request
   * @returns {Promise<Object>} - Request response data
   */
  async requestDonation(donationId, beneficiaryId, requestNotes = '') {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/donations/request`, 
        { donationId, beneficiaryId, requestNotes },
        { 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes as per API documentation
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error('Invalid request. Please check your information.');
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You do not have permission to request donations. Beneficiary or NGO role required.');
          case 404:
            throw new Error('Donation not found.');
          case 409:
            throw new Error('This donation has already been requested or is no longer available.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to request donation');
        }
      }
      throw new Error('Failed to request donation. Please check your network connection.');
    }
  }

  /**
   * Submit a review for a donation
   * @param {string} donationId - ID of the donation
   * @param {Object} reviewData - Review data
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {string} reviewData.comment - Review comment
   * @returns {Promise<Object>} - Submitted review data
   */
  async submitReview(donationId, reviewData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/donations/${donationId}/review`, 
        reviewData,
        { 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes as per API documentation
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error('Invalid review data. Please check your information.');
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You are not authorized to review this donation.');
          case 404:
            throw new Error('Donation not found.');
          case 409:
            throw new Error('You have already reviewed this donation.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to submit review');
        }
      }
      throw new Error('Failed to submit review. Please check your network connection.');
    }
  }

  /**
   * Delete a food listing
   * @param {string} id - Donation ID
   * @returns {Promise<Object>} - Response data
   */
  async deleteDonation(id) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/donations/${id}`, 
        {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes as per API documentation
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You are not authorized to delete this donation.');
          case 404:
            throw new Error('Donation not found.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to delete donation');
        }
      }
      throw new Error('Failed to delete donation. Please check your network connection.');
    }
  }

  /**
   * Search for donations based on various criteria
   * @param {Object} [params] - Search parameters
   * @param {string} [params.query] - Text search query
   * @param {string} [params.category] - Filter by food category
   * @param {string} [params.status] - Filter by donation status
   * @param {string} [params.fromDate] - Filter by date range start
   * @param {string} [params.toDate] - Filter by date range end
   * @param {number} [params.page] - Page number for pagination
   * @param {number} [params.limit] - Number of results per page
   * @returns {Promise<Object>} - Object containing search results and pagination info
   */
  async searchDonations(params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/donations/search`, 
        {
          params,
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes as per API documentation
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error('Invalid search parameters. Please check your input.');
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to search donations');
        }
      }
      throw new Error('Failed to search donations. Please check your network connection.');
    }
  }

  /**
   * Get donation statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Statistics object with counts, impact metrics, and trends
   */
  async getDonationStats(userId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/donations/stats/${userId}`, 
        {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes as per API documentation
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You are not authorized to view these statistics.');
          case 404:
            throw new Error('User not found.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to fetch donation statistics');
        }
      }
      throw new Error('Failed to fetch donation statistics. Please check your network connection.');
    }
  }

  /**
   * Get all donation requests for a specific donor
   * @param {string} donorId - Donor's user ID
   * @param {Object} [params] - Optional query parameters
   * @returns {Promise<Array>} - Array of donation requests
   */
  async getDonationRequests(donorId, params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/donations/requests/${donorId}`, 
        {
          params,
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You do not have permission to view these donation requests.');
          case 404:
            throw new Error('User or donation requests not found.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to fetch donation requests');
        }
      }
      throw new Error('Failed to fetch donation requests. Please check your network connection.');
    }
  }

  /**
   * Approve a donation request
   * @param {string} requestId - ID of the request to approve
   * @returns {Promise<Object>} - Updated request object
   */
  async approveDonationRequest(requestId) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/donations/requests/${requestId}/approve`,
        {},
        { 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error('Invalid request or already processed.');
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You do not have permission to approve this request.');
          case 404:
            throw new Error('Request not found.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to approve donation request');
        }
      }
      throw new Error('Failed to approve donation request. Please check your network connection.');
    }
  }

  /**
   * Reject a donation request
   * @param {string} requestId - ID of the request to reject
   * @param {string} [rejectionReason] - Optional reason for rejection
   * @returns {Promise<Object>} - Updated request object
   */
  async rejectDonationRequest(requestId, rejectionReason = '') {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/donations/requests/${requestId}/reject`,
        { rejectionReason },
        { 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error('Invalid request or already processed.');
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You do not have permission to reject this request.');
          case 404:
            throw new Error('Request not found.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to reject donation request');
        }
      }
      throw new Error('Failed to reject donation request. Please check your network connection.');
    }
  }

  /**
   * Get all requests made by a specific beneficiary
   * @param {string} beneficiaryId - Beneficiary's user ID
   * @param {Object} [params] - Optional query parameters
   * @returns {Promise<Object>} - Object containing requests and pagination info
   */
  async getBeneficiaryRequests(beneficiaryId, params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/donations/beneficiary-requests/${beneficiaryId}`, 
        {
          params,
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You do not have permission to view these requests.');
          case 404:
            throw new Error('User or requests not found.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to fetch beneficiary requests');
        }
      }
      throw new Error('Failed to fetch beneficiary requests. Please check your network connection.');
    }
  }

  /**
   * Fetch detailed beneficiary data including stats, donations, and impact metrics
   * @param {string} beneficiaryId - Beneficiary's user ID
   * @returns {Promise<Object>} - Object containing beneficiary stats and dashboard data
   */
  async fetchBeneficiaryData(beneficiaryId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/beneficiaries/${beneficiaryId}/dashboard`, 
        {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You do not have permission to access this beneficiary data.');
          case 404:
            throw new Error('Beneficiary not found.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to fetch beneficiary data');
        }
      }
      throw new Error('Failed to fetch beneficiary data. Please check your network connection.');
    }
  }

  /**
   * Get tracking information for donations
   * @param {Object} params - Query parameters
   * @param {string} [params.donorId] - Filter by donor ID
   * @param {string} [params.beneficiaryId] - Filter by beneficiary ID
   * @param {string} [params.status] - Filter by status
   * @returns {Promise<Object>} - Object containing donation tracking information
   */
  async getDonationTracking(params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/donations/tracking`, 
        {
          params,
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 403:
            throw new Error('You do not have permission to access this tracking information.');
          case 404:
            throw new Error('Tracking information not found.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to fetch tracking information');
        }
      }
      throw new Error('Failed to fetch tracking information. Please check your network connection.');
    }
  }

  /**
   * Get global impact metrics and statistics
   * @returns {Promise<Object>} - Object containing platform-wide impact statistics
   */
  async getGlobalImpactData() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/impact/global`, 
        {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      // Handle specific error status codes
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Authentication required. Please login again.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to fetch impact data');
        }
      }
      throw new Error('Failed to fetch impact data. Please check your network connection.');
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
const donationService = new DonationService();

// Export individual methods for direct import
export const {
  // Original methods
  createFoodListing,
  getAllFoodListings,
  getDonationById,
  updateDonationStatus,
  getDonorDonations,
  claimDonation,
  getClaimedDonations,
  searchDonations,
  deleteDonation,
  getDonationStats,
  
  // New methods for beneficiary flow
  fetchAvailableDonations,
  fetchBeneficiaryData,
  fetchClaimedDonations,
  requestDonation,
  submitReview,
  getBeneficiaryRequests,
  
  // Additional methods used in DonationCard.jsx
  acceptDonation,
  rejectDonation,
  processDonationAction,
  
  // New methods for donation requests
  getDonationRequests,
  approveDonationRequest,
  rejectDonationRequest,

  // New method for donation tracking
  getDonationTracking,

  // New method for global impact data
  getGlobalImpactData
} = donationService;

// Add alias for getDonationsByDonor
export const getDonationsByDonor = getDonorDonations;
// Add alias for getCompletedDonationsByDonor (used in CompletedDonationsPage)
export const getCompletedDonationsByDonor = (userId) => {
  // We'll use the existing getDonorDonations method but add a status filter
  // This function gets all donations by a donor and filters for completed ones
  return getDonorDonations(userId)
    .then(donations => donations.filter(donation => 
      donation.status === 'Completed' || donation.status === 'Delivered'
    ));
};

// Export default service
export default donationService;
