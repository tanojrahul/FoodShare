import axios from 'axios';
import authService from './authService';

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
   * @param {string} data.category - Food category
   * @param {string} data.expirationDate - Expiration date (YYYY-MM-DD)
   * @param {string} data.location - Pickup location
   * @param {string} [data.description] - Optional description
   * @returns {Promise<Object>} - Created donation object
   */
  async createFoodListing(data) {
    try {
      const response = await axios.post('/api/donations/create', data, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to create food listing');
    }
  }

  /**
   * Get all active food listings
   * @param {Object} [filters] - Optional filters (category, location, etc.)
   * @returns {Promise<Array>} - Array of donation listings
   */
  async getAllFoodListings(filters = {}) {
    try {
      const response = await axios.get('/api/donations/list', { 
        params: filters,
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch food listings');
    }
  }

  /**
   * Get a specific donation by ID
   * @param {string} id - Donation ID
   * @returns {Promise<Object>} - Detailed donation object
   */
  async getDonationById(id) {
    try {
      const response = await axios.get(`/api/donations/${id}`, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, `Failed to fetch donation #${id}`);
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
        `/api/donations/${id}/status`, 
        { status },
        { headers: authService.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to update donation status');
    }
  }

  /**
   * Get all donations created by a specific donor
   * @param {string} userId - Donor's user ID
   * @returns {Promise<Array>} - Array of donor's donations
   */
  async getDonorDonations(userId) {
    try {
      const response = await axios.get(`/api/donations/donor/${userId}`, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch donor donations');
    }
  }

  /**
   * Claim a donation as a beneficiary or NGO
   * @param {string} donationId - Donation ID to claim
   * @param {string} beneficiaryId - ID of claiming beneficiary/NGO
   * @returns {Promise<Object>} - Updated donation with claim information
   */
  async claimDonation(donationId, beneficiaryId) {
    try {
      const response = await axios.post(
        '/api/donations/claim',
        { donationId, beneficiaryId },
        { headers: authService.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to claim donation');
    }
  }

  /**
   * Get all donations claimed by a specific beneficiary
   * @param {string} beneficiaryId - Beneficiary's user ID
   * @returns {Promise<Array>} - Array of claimed donations
   */
  async getClaimedDonations(beneficiaryId) {
    try {
      const response = await axios.get(`/api/donations/claimed/${beneficiaryId}`, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch claimed donations');
    }
  }

  /**
   * Search for donations based on criteria
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Array>} - Array of matching donations
   */
  async searchDonations(searchParams) {
    try {
      const response = await axios.get('/api/donations/search', {
        params: searchParams,
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to search donations');
    }
  }

  /**
   * Delete a food listing
   * @param {string} id - Donation ID
   * @returns {Promise<Object>} - Response data
   */
  async deleteDonation(id) {
    try {
      const response = await axios.delete(`/api/donations/${id}`, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to delete donation');
    }
  }

  /**
   * Get donation statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Statistics object
   */
  async getDonationStats(userId) {
    try {
      const response = await axios.get(`/api/donations/stats/${userId}`, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch donation statistics');
    }
  }

  /**
   * Get beneficiary dashboard data
   * @param {string} beneficiaryId - Beneficiary user ID
   * @returns {Promise<Object>} - Dashboard data for beneficiary
   */
  async fetchBeneficiaryData(beneficiaryId) {
    try {
      const response = await axios.get(`/api/beneficiaries/${beneficiaryId}/dashboard`, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch beneficiary dashboard data');
    }
  }

  /**
   * Get donations claimed by a beneficiary
   * @param {string} beneficiaryId - Beneficiary user ID
   * @returns {Promise<Array>} - List of claimed donations
   */
  async fetchClaimedDonations(beneficiaryId) {
    try {
      const response = await axios.get(`/api/donations/claimed/${beneficiaryId}`, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch claimed donations');
    }
  }

  /**
   * Get available donations for beneficiaries to browse
   * @param {Object} filters - Search filters
   * @returns {Promise<Array>} - List of available donations
   */
  async fetchAvailableDonations(filters = {}) {
    try {
      const response = await axios.get('/api/donations/available', {
        params: filters,
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch available donations');
    }
  }

  /**
   * Request a donation as a beneficiary
   * @param {string} donationId - ID of the donation to request
   * @param {string} beneficiaryId - ID of requesting beneficiary
   * @returns {Promise<Object>} - Request response
   */
  async requestDonation(donationId, beneficiaryId) {
    try {
      const response = await axios.post('/api/donations/request', 
        { donationId, beneficiaryId },
        { headers: authService.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to request donation');
    }
  }

  /**
   * Submit a review for a donation
   * @param {string} donationId - ID of the donation
   * @param {Object} reviewData - Review data (rating, comment)
   * @returns {Promise<Object>} - Submitted review
   */
  async submitReview(donationId, reviewData) {
    try {
      const response = await axios.post(`/api/donations/${donationId}/review`, 
        reviewData,
        { headers: authService.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to submit review');
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
  fetchBeneficiaryData,
  fetchClaimedDonations,
  fetchAvailableDonations,
  requestDonation,
  submitReview
} = donationService;

// Export default service
export default donationService;
