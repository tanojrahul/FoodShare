import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import emailjs from 'emailjs-com';
import { createClient } from '@supabase/supabase-js';
import authService from './authService';

// Config constants - using Vite's environment variables
const EMAIL_SERVICE_ID = import.meta.env.VITE_EMAIL_SERVICE_ID;
const EMAIL_TEMPLATE_ID = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
const EMAIL_USER_ID = import.meta.env.VITE_EMAIL_USER_ID;

// Initialize Supabase for real-time notifications (optional)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
let supabase;

// Only initialize Supabase if credentials are available
if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_url_here') {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
}

// Event bus for in-app notifications
const notificationEventBus = {
  listeners: {},
  
  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.unsubscribe(event, callback);
  },
  
  unsubscribe(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  },
  
  publish(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in notification event listener:', error);
      }
    });
  }
};

/**
 * Service for managing notifications across the FoodShare application
 */
class NotificationService {
  constructor() {
    this.activeSubscriptions = new Map();
  }

  /**
   * Send an in-app notification to a user
   * @param {string} userId - Target user ID
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {string} type - Notification type: 'success', 'warning', 'info', 'error'
   * @param {Object} [options] - Additional options (link, expiry, etc.)
   * @returns {Promise<Object>} - The created notification
   */
  async sendInAppNotification(userId, title, message, type = 'info', options = {}) {
    try {
      // Create notification object
      const notification = {
        id: uuidv4(),
        userId,
        title,
        message,
        type,
        isRead: false,
        createdAt: new Date().toISOString(),
        ...options
      };

      // Save to database via API
      const response = await axios.post('/api/notifications', notification, {
        headers: authService.getAuthHeader()
      });

      // Trigger local event for immediate UI update
      notificationEventBus.publish('new-notification', response.data);

      // Trigger real-time notification if Supabase is available
      if (supabase) {
        await supabase
          .from('notifications')
          .insert([response.data]);
      }

      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to send in-app notification');
      
      // Fallback logging
      console.log('Notification not delivered:', { userId, title, message, type });
      
      // Return minimal object for UI to still function
      return { id: uuidv4(), title, message, type, error: true };
    }
  }

  /**
   * Send an email notification
   * @param {string} toEmail - Recipient email
   * @param {string} subject - Email subject
   * @param {string} htmlBody - Email HTML content
   * @param {Object} [templateParams] - Additional template parameters
   * @returns {Promise<Object>} - Email sending result
   */
  async sendEmailNotification(toEmail, subject, htmlBody, templateParams = {}) {
    try {
      // Prepare email template parameters
      const emailParams = {
        to_email: toEmail,
        subject: subject,
        message: htmlBody,
        ...templateParams
      };

      // Use EmailJS to send the email
      const result = await emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        emailParams,
        EMAIL_USER_ID
      );

      return {
        success: true,
        messageId: result.messageId || `email-${Date.now()}`,
        status: result.status || 200
      };
    } catch (error) {
      this._handleError(error, 'Failed to send email notification');
      
      // Fallback logging
      console.log('Email not delivered:', { toEmail, subject });
      
      // Also try server API as fallback
      try {
        const response = await axios.post('/api/notifications/email', {
          toEmail,
          subject,
          htmlBody,
          templateParams
        }, {
          headers: authService.getAuthHeader()
        });
        return response.data;
      } catch (backupError) {
        console.error('Backup email delivery also failed:', backupError);
        return { success: false, error: error.message };
      }
    }
  }

  /**
   * Notify both donor and recipient about a donation match
   * @param {string} donorId - ID of the donor
   * @param {string} recipientId - ID of the recipient
   * @param {Object} donationDetails - Donation information
   * @returns {Promise<Array>} - Results of notification operations
   */
  async notifyOnDonationMatch(donorId, recipientId, donationDetails) {
    try {
      const results = [];
      
      // Get user information for both parties
      const [donorResponse, recipientResponse] = await Promise.all([
        axios.get(`/api/users/${donorId}`, { headers: authService.getAuthHeader() }),
        axios.get(`/api/users/${recipientId}`, { headers: authService.getAuthHeader() })
      ]);
      
      const donor = donorResponse.data;
      const recipient = recipientResponse.data;
      
      // Notify donor
      if (donor) {
        const donorNotification = await this.sendInAppNotification(
          donorId,
          'Donation Matched!',
          `Your donation "${donationDetails.title}" has been matched with ${recipient.name}.`,
          'success',
          { donationId: donationDetails.id, linkTo: `/donations/${donationDetails.id}` }
        );
        results.push(donorNotification);
        
        // Email to donor
        if (donor.email) {
          const donorEmail = await this.sendEmailNotification(
            donor.email,
            `Your FoodShare donation has been matched`,
            this._generateMatchEmailForDonor(donor.name, donationDetails, recipient),
            { donorName: donor.name, recipientName: recipient.name }
          );
          results.push(donorEmail);
        }
      }
      
      // Notify recipient
      if (recipient) {
        const recipientNotification = await this.sendInAppNotification(
          recipientId,
          'New Donation Match!',
          `You've been matched with "${donationDetails.title}" from ${donor.name}.`,
          'success',
          { donationId: donationDetails.id, linkTo: `/donations/${donationDetails.id}` }
        );
        results.push(recipientNotification);
        
        // Email to recipient
        if (recipient.email) {
          const recipientEmail = await this.sendEmailNotification(
            recipient.email,
            `You've been matched with a FoodShare donation`,
            this._generateMatchEmailForRecipient(recipient.name, donationDetails, donor),
            { recipientName: recipient.name, donorName: donor.name }
          );
          results.push(recipientEmail);
        }
      }
      
      return results;
    } catch (error) {
      this._handleError(error, 'Failed to send donation match notifications');
      return [{ success: false, error: error.message }];
    }
  }

  /**
   * Send alerts for donations near expiration
   * @param {string} donationId - Donation ID
   * @param {Date|string} expirationDate - When the donation expires
   * @returns {Promise<boolean>} - Success indicator
   */
  async notifyBeforeExpiration(donationId, expirationDate) {
    try {
      // Get donation details
      const donationResponse = await axios.get(`/api/donations/${donationId}`, {
        headers: authService.getAuthHeader()
      });
      const donation = donationResponse.data;
      
      // Calculate hours until expiration
      const expTime = new Date(expirationDate).getTime();
      const currentTime = new Date().getTime();
      const hoursLeft = Math.max(0, (expTime - currentTime) / (1000 * 60 * 60));
      
      // Only alert if less than threshold (e.g., 3 hours)
      if (hoursLeft <= 3) {
        // Notify donor
        await this.sendInAppNotification(
          donation.donorId,
          'Donation Expiring Soon!',
          `Your donation "${donation.title}" will expire in ${hoursLeft < 1 ? 'less than an hour' : `${Math.floor(hoursLeft)} hours`}.`,
          'warning',
          { donationId, linkTo: `/donations/${donationId}` }
        );
        
        // Notify admin as well
        await this.sendInAppNotification(
          'admin', // Generic admin notification
          'Donation Expiring Soon',
          `Donation "${donation.title}" by ${donation.donorName} will expire in ${hoursLeft < 1 ? 'less than an hour' : `${Math.floor(hoursLeft)} hours`}.`,
          'warning',
          { donationId, linkTo: `/admin/donations/${donationId}` }
        );
        
        // Send email to donor
        if (donation.donorEmail) {
          await this.sendEmailNotification(
            donation.donorEmail,
            'Your donation is expiring soon',
            this._generateExpirationEmail(donation, hoursLeft),
            { donationTitle: donation.title, hoursLeft: Math.floor(hoursLeft) }
          );
        }
        
        return true;
      }
      
      return false; // Not yet time to notify
    } catch (error) {
      this._handleError(error, 'Failed to send expiration notification');
      return false;
    }
  }

  /**
   * Subscribe to real-time notifications
   * @param {string} userId - User ID to subscribe for
   * @param {function} callback - Callback function when notification arrives
   * @returns {function} - Unsubscribe function
   */
  subscribeToRealTimeNotifications(userId, callback) {
    // First register with the local event bus
    const localUnsubscribe = notificationEventBus.subscribe('new-notification', notification => {
      if (notification.userId === userId) {
        callback(notification);
      }
    });
    
    // If Supabase is available, also subscribe to real-time updates
    let supabaseSubscription;
    if (supabase) {
      supabaseSubscription = supabase
        .from(`notifications:userId=eq.${userId}`)
        .on('INSERT', payload => {
          callback(payload.new);
        })
        .subscribe();
      
      // Store the subscription
      this.activeSubscriptions.set(userId, supabaseSubscription);
    }
    
    // Return unsubscribe function
    return () => {
      localUnsubscribe();
      if (supabaseSubscription) {
        supabase.removeSubscription(supabaseSubscription);
        this.activeSubscriptions.delete(userId);
      }
    };
  }

  /**
   * Fetch notifications for a specific user
   * @param {string} userId - User ID
   * @param {Object} [options] - Query options (limit, offset, filter)
   * @returns {Promise<Array>} - User notifications
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const { limit = 20, offset = 0, unreadOnly = false } = options;
      
      const response = await axios.get(`/api/notifications/user/${userId}`, {
        params: { limit, offset, unreadOnly },
        headers: authService.getAuthHeader()
      });
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch notifications');
      return []; // Return empty array as fallback
    }
  }

  /**
   * Get system notifications for admin dashboard
   * @param {Object} [options] - Query options (limit, offset, type)
   * @returns {Promise<Array>} - System notifications
   */
  async getSystemNotifications(options = {}) {
    try {
      const { limit = 20, offset = 0, type = null } = options;
      
      const response = await axios.get('/api/notifications/system', {
        params: { limit, offset, type },
        headers: authService.getAuthHeader()
      });
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch system notifications');
      return []; // Return empty array as fallback
    }
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} - Updated notification
   */
  async markAsRead(notificationId) {
    try {
      const response = await axios.patch(`/api/notifications/${notificationId}/read`, {}, {
        headers: authService.getAuthHeader()
      });
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to mark notification as read');
      return { id: notificationId, error: true };
    }
  }

  /**
   * Mark all notifications as read for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Result summary
   */
  async markAllAsRead(userId) {
    try {
      const response = await axios.post(`/api/notifications/user/${userId}/read-all`, {}, {
        headers: authService.getAuthHeader()
      });
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to mark all notifications as read');
      return { success: false, error: error.message };
    }
  }

  /**
   * Send a system notification to all users or specific roles
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {string} type - Notification type
   * @param {Array<string>} [roles] - Optional roles to target
   * @returns {Promise<Object>} - Result summary
   */
  async sendSystemNotification(title, message, type = 'info', roles = null) {
    try {
      const response = await axios.post('/api/notifications/system', {
        title,
        message,
        type,
        roles
      }, {
        headers: authService.getAuthHeader()
      });
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to send system notification');
      return { success: false, error: error.message };
    }
  }

  /**
   * Get notification statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Notification stats
   */
  async getNotificationStats(userId) {
    try {
      const response = await axios.get(`/api/notifications/user/${userId}/stats`, {
        headers: authService.getAuthHeader()
      });
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch notification statistics');
      return { total: 0, unread: 0 };
    }
  }

  /**
   * Generate HTML email for donor after match
   * @private
   * @param {string} donorName - Donor's name
   * @param {Object} donation - Donation details
   * @param {Object} recipient - Recipient details
   * @returns {string} - HTML email content
   */
  _generateMatchEmailForDonor(donorName, donation, recipient) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #123458;">Good news, ${donorName}!</h2>
        <p>Your donation <strong>${donation.title}</strong> has been matched with ${recipient.name}.</p>
        <p>They will be contacting you soon to arrange pickup.</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #123458;">
          <p style="margin: 0;"><strong>Donation Details:</strong></p>
          <p style="margin: 5px 0;">Title: ${donation.title}</p>
          <p style="margin: 5px 0;">Quantity: ${donation.quantity}</p>
          <p style="margin: 5px 0;">Expiration: ${new Date(donation.expiresAt).toLocaleDateString()}</p>
        </div>
        <p>Thank you for making a difference with FoodShare!</p>
        <a href="${import.meta.env.VITE_WEBSITE_URL}/donations/${donation.id}" style="display: inline-block; background-color: #123458; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">View Donation Details</a>
      </div>
    `;
  }

  /**
   * Generate HTML email for recipient after match
   * @private
   * @param {string} recipientName - Recipient's name
   * @param {Object} donation - Donation details
   * @param {Object} donor - Donor details
   * @returns {string} - HTML email content
   */
  _generateMatchEmailForRecipient(recipientName, donation, donor) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #123458;">Great news, ${recipientName}!</h2>
        <p>You've been matched with a donation from ${donor.name}.</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #123458;">
          <p style="margin: 0;"><strong>Donation Details:</strong></p>
          <p style="margin: 5px 0;">Title: ${donation.title}</p>
          <p style="margin: 5px 0;">Quantity: ${donation.quantity}</p>
          <p style="margin: 5px 0;">Expiration: ${new Date(donation.expiresAt).toLocaleDateString()}</p>
          <p style="margin: 5px 0;">Pickup Location: ${donation.location || 'Contact donor for details'}</p>
        </div>
        <p>Please contact the donor to arrange pickup details.</p>
        <a href="${import.meta.env.VITE_WEBSITE_URL}/donations/${donation.id}" style="display: inline-block; background-color: #123458; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">View Donation Details</a>
      </div>
    `;
  }

  /**
   * Generate HTML email for expiration notification
   * @private
   * @param {Object} donation - Donation details
   * @param {number} hoursLeft - Hours until expiration
   * @returns {string} - HTML email content
   */
  _generateExpirationEmail(donation, hoursLeft) {
    const hoursText = hoursLeft < 1 ? 'less than an hour' : `${Math.floor(hoursLeft)} hours`;
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #123458;">Donation Expiring Soon</h2>
        <p>Your donation <strong>${donation.title}</strong> will expire in ${hoursText}.</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #FF9800;">
          <p style="margin: 0;"><strong>Donation Details:</strong></p>
          <p style="margin: 5px 0;">Title: ${donation.title}</p>
          <p style="margin: 5px 0;">Quantity: ${donation.quantity}</p>
          <p style="margin: 5px 0;">Expiration: ${new Date(donation.expiresAt).toLocaleDateString()}</p>
        </div>
        <p>If this donation hasn't been claimed yet, consider extending the expiration date or redistributing it.</p>
        <a href="${import.meta.env.VITE_WEBSITE_URL}/donations/${donation.id}" style="display: inline-block; background-color: #123458; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">Manage This Donation</a>
      </div>
    `;
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
    return errorMessage;
  }
}

// Create singleton instance
const notificationService = new NotificationService();

// Export individual methods for direct import
export const {
  sendInAppNotification,
  sendEmailNotification,
  notifyOnDonationMatch,
  notifyBeforeExpiration,
  subscribeToRealTimeNotifications,
  getUserNotifications,
  getSystemNotifications,
  markAsRead,
  markAllAsRead,
  sendSystemNotification,
  getNotificationStats
} = notificationService;

// Export the entire service as default
export default notificationService;
