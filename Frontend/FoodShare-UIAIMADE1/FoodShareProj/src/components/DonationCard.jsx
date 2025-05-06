import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { 
  FiCalendar, FiPackage, FiUser, FiMapPin, FiCheckCircle, FiXCircle, 
  FiMap, FiInfo, FiEdit, FiShield, FiAlertTriangle, FiCheck, FiX, 
  FiTruck, FiClock, FiSettings, FiAlertCircle
} from 'react-icons/fi';

// Import donation service
import { acceptDonation, rejectDonation, processDonationAction } from '../services/donationService';

// Import notification service
import { sendInAppNotification } from '../services/notificationService';

// Import auth service for current user
import authService from '../services/authService';

// Simple Toast Component
const Toast = ({ message, type, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      } text-white z-50`}
    >
      <FiAlertCircle className="mr-2" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white">
        &times;
      </button>
    </motion.div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error']).isRequired,
  onClose: PropTypes.func.isRequired
};

const StatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'in transit':
        return 'bg-indigo-100 text-indigo-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'flagged':
        return 'bg-orange-100 text-orange-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FiClock className="mr-1" />;
      case 'accepted':
        return <FiCheck className="mr-1" />;
      case 'in transit':
        return <FiTruck className="mr-1" />;
      case 'completed':
        return <FiCheckCircle className="mr-1" />;
      case 'rejected':
        return <FiX className="mr-1" />;
      case 'flagged':
        return <FiAlertTriangle className="mr-1" />;
      case 'expired':
        return <FiClock className="mr-1" />;
      case 'delivered':
        return <FiCheckCircle className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getBadgeStyle()}`}>
      {getStatusIcon()}
      {status}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired
};

const DonationCardSkeleton = () => {
  return (
    <div className="bg-[#F1EFEC] rounded-lg border border-[#D4C9BE] shadow-sm p-5 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 bg-gray-200 rounded-md"></div>
        <div className="flex-1">
          <div className="h-5 w-2/3 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </div>
      <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
        <div className="flex justify-between">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const DonationCard = ({ 
  donation, 
  isLoading, 
  onAccept, 
  onReject, 
  onTrack,
  userRole,
  isAdminView = false,
  onAdminAction
}) => {
  const [actionInProgress, setActionInProgress] = useState(false);
  const [showAdminActions, setShowAdminActions] = useState(false);
  const [adminActionNote, setAdminActionNote] = useState('');
  const [toast, setToast] = useState(null);
  
  if (isLoading) {
    return <DonationCardSkeleton />;
  }
  
  // Format the expiration date
  const formatExpirationDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate days until expiration
  const getDaysUntilExpiration = (dateString) => {
    const today = new Date();
    const expirationDate = new Date(dateString);
    const diffTime = expirationDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Get urgency class based on days until expiration
  const getUrgencyClass = (dateString) => {
    const daysLeft = getDaysUntilExpiration(dateString);
    if (daysLeft <= 0) return 'text-red-600';
    if (daysLeft <= 3) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  // Handle action button clicks with loading state
  const handleAction = async (action, donationId) => {
    setActionInProgress(true);
    const currentUser = authService.getCurrentUser();
    
    try {
      if (action === 'accept') {
        // Use the acceptDonation service directly
        const updatedDonation = await acceptDonation(donationId);
        
        // Send notification to the donor
        if (updatedDonation && updatedDonation.donorId) {
          await sendInAppNotification(
            updatedDonation.donorId,
            'Donation Accepted',
            `Your donation "${updatedDonation.title || 'Food donation'}" has been accepted by ${currentUser.name || 'a beneficiary'}.`,
            'success',
            { donationId, linkTo: `/donations/${donationId}` }
          );
        }
        
        // After successful API call, notify parent component if callback is provided
        if (onAccept) {
          onAccept(donationId);
        }
      } else if (action === 'reject') {
        // Use the rejectDonation service directly
        const updatedDonation = await rejectDonation(donationId);
        
        // Send notification to the donor
        if (updatedDonation && updatedDonation.donorId) {
          await sendInAppNotification(
            updatedDonation.donorId,
            'Donation Rejected',
            `Your donation "${updatedDonation.title || 'Food donation'}" has been rejected by ${currentUser.name || 'a beneficiary'}.`,
            'warning',
            { donationId, linkTo: `/donations/${donationId}` }
          );
        }
        
        // After successful API call, notify parent component if callback is provided
        if (onReject) {
          onReject(donationId);
        }
      } else if (action === 'track') {
        // Track action just uses the callback
        if (onTrack) {
          onTrack(donationId);
        }
      }
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
      // Show toast notification for error
      setToast({
        message: `Failed to ${action} donation: ${error.message || 'Unknown error'}`,
        type: 'error'
      });
    } finally {
      setActionInProgress(false);
    }
  };
  
  // Handle admin actions
  const handleAdminAction = async (action) => {
    setActionInProgress(true);
    try {
      // Use the processDonationAction service directly
      await processDonationAction(donation.id, action, adminActionNote);
      
      // After successful API call, notify parent component if callback is provided
      if (onAdminAction) {
        onAdminAction(donation.id, action, adminActionNote);
      }
      
      setAdminActionNote('');
      setShowAdminActions(false);
    } catch (error) {
      console.error(`Error performing admin action ${action}:`, error);
      // Show toast notification for error
      setToast({
        message: `Failed to process ${action} action: ${error.message || 'Unknown error'}`,
        type: 'error'
      });
    } finally {
      setActionInProgress(false);
    }
  };
  
  // Determine which action buttons to show based on role and status
  const showActionButtons = () => {
    const { status } = donation;
    
    // If admin view is enabled, show admin controls instead
    if (isAdminView && userRole === 'admin') {
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAdminActions(!showAdminActions)}
            className={`px-3 py-1.5 ${showAdminActions ? 'bg-[#123458] text-white' : 'border border-[#123458] text-[#123458]'} rounded flex items-center justify-center hover:bg-[#123458] hover:text-white transition-colors`}
          >
            <FiSettings className="mr-1" /> {showAdminActions ? 'Hide Actions' : 'Moderate'}
          </button>
          
          <Link 
            to={`/admin/donations/${donation.id}`} 
            className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <FiInfo className="mr-1" /> Details
          </Link>
        </div>
      );
    }
    
    // Common action - view details
    const viewDetailsButton = (
      <Link 
        to={`/donations/${donation.id}`} 
        className="px-3 py-1.5 text-[#123458] border border-[#123458] rounded hover:bg-[#123458] hover:text-white transition-colors flex items-center justify-center"
      >
        <FiInfo className="mr-1" /> Details
      </Link>
    );
    
    // Common action - track donation if in transit
    const trackButton = status.toLowerCase() === 'in transit' ? (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleAction('track', donation.id)}
        className="px-3 py-1.5 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors flex items-center justify-center"
        disabled={actionInProgress}
      >
        <FiMap className="mr-1" /> Track
      </motion.button>
    ) : null;
    
    // Role and status specific actions
    if (userRole === 'beneficiary' || userRole === 'ngo') {
      if (status.toLowerCase() === 'pending') {
        return (
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('accept', donation.id)}
              className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center justify-center"
              disabled={actionInProgress}
            >
              <FiCheckCircle className="mr-1" /> Accept
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('reject', donation.id)}
              className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center"
              disabled={actionInProgress}
            >
              <FiXCircle className="mr-1" /> Reject
            </motion.button>
            {viewDetailsButton}
          </div>
        );
      }
    }
    
    // Default actions for other statuses
    return (
      <div className="flex space-x-2">
        {trackButton}
        {viewDetailsButton}
      </div>
    );
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#F1EFEC] rounded-lg border border-[#D4C9BE] shadow-sm p-4 hover:shadow-md transition-shadow relative"
    >
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Admin badge */}
      {isAdminView && (
        <div className="absolute -top-2 -right-2">
          <span className="bg-[#123458] text-white text-xs px-2 py-1 rounded flex items-center">
            <FiShield className="mr-1" /> Admin View
          </span>
        </div>
      )}

      <div className="flex items-start">
        {/* Image or placeholder */}
        <div className="mr-4 flex-shrink-0">
          {donation.imageUrl ? (
            <img 
              src={donation.imageUrl} 
              alt={donation.type} 
              className="w-16 h-16 object-cover rounded-md" 
            />
          ) : (
            <div className="w-16 h-16 bg-[#D4C9BE] bg-opacity-30 rounded-md flex items-center justify-center">
              <FiPackage size={24} className="text-[#123458] opacity-60" />
            </div>
          )}
        </div>
        
        {/* Donation details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg text-[#123458]">
              {donation.title || donation.type}
            </h3>
            <StatusBadge status={donation.status} />
          </div>
          
          <div className="mt-1 space-y-1 text-sm text-gray-600">
            <div className="flex items-center">
              <FiPackage className="mr-2 text-[#123458]" />
              <span>{donation.quantity} {donation.unit || 'items'}</span>
            </div>
            
            <div className="flex items-center">
              <FiCalendar className="mr-2 text-[#123458]" />
              <span>
                Expires: <span className={getUrgencyClass(donation.expiresAt)}>
                  {formatExpirationDate(donation.expiresAt)}
                </span>
              </span>
            </div>
            
            {donation.donor && (
              <div className="flex items-center">
                <FiUser className="mr-2 text-[#123458]" />
                <span>{donation.donor}</span>
              </div>
            )}
            
            {donation.location && (
              <div className="flex items-center">
                <FiMapPin className="mr-2 text-[#123458]" />
                <span className="truncate">{donation.location}</span>
              </div>
            )}
            
            {/* Additional admin info */}
            {isAdminView && donation.lastUpdated && (
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <FiEdit className="mr-2" />
                <span>Last updated: {new Date(donation.lastUpdated).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="mt-4 pt-3 border-t border-dashed border-[#D4C9BE] flex justify-end">
        {showActionButtons()}
      </div>
      
      {/* Admin moderation panel */}
      {isAdminView && showAdminActions && (
        <div className="mt-3 pt-3 border-t border-[#D4C9BE]">
          <h4 className="text-sm font-medium text-[#123458] mb-2 flex items-center">
            <FiShield className="mr-1" /> Admin Actions
          </h4>
          
          <textarea
            value={adminActionNote}
            onChange={(e) => setAdminActionNote(e.target.value)}
            placeholder="Optional: Add a note about this action"
            className="w-full p-2 border border-gray-300 text-sm rounded-md focus:ring-[#123458] focus:border-[#123458] mb-3"
            rows={2}
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => handleAdminAction('approve')}
              disabled={actionInProgress}
              className="px-2 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center justify-center"
            >
              <FiCheckCircle className="mr-1" /> Approve
            </button>
            
            <button
              onClick={() => handleAdminAction('reject')}
              disabled={actionInProgress}
              className="px-2 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center justify-center"
            >
              <FiXCircle className="mr-1" /> Reject
            </button>
            
            <button
              onClick={() => handleAdminAction('flag')}
              disabled={actionInProgress}
              className="px-2 py-1.5 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 flex items-center justify-center"
            >
              <FiAlertTriangle className="mr-1" /> Flag
            </button>
            
            <button
              onClick={() => handleAdminAction('mark-delivered')}
              disabled={actionInProgress}
              className="px-2 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center justify-center"
            >
              <FiTruck className="mr-1" /> Mark Delivered
            </button>
            
            {/* Include other relevant admin actions based on donation status */}
            {donation.status.toLowerCase() === 'flagged' && (
              <button
                onClick={() => handleAdminAction('clear-flag')}
                disabled={actionInProgress}
                className="px-2 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center justify-center"
              >
                <FiCheck className="mr-1" /> Clear Flag
              </button>
            )}
            
            <button
              onClick={() => handleAdminAction('delete')}
              disabled={actionInProgress}
              className="px-2 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 flex items-center justify-center"
            >
              <FiX className="mr-1" /> Delete
            </button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            Actions taken by administrators are logged and cannot be undone.
          </div>
        </div>
      )}
      
      {/* Loading overlay for actions */}
      {actionInProgress && (
        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg flex items-center justify-center z-10">
          <div className="w-8 h-8 border-4 border-[#123458] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
};

DonationCard.propTypes = {
  donation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    type: PropTypes.string.isRequired,
    quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    unit: PropTypes.string,
    expiresAt: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    donor: PropTypes.string,
    location: PropTypes.string,
    imageUrl: PropTypes.string,
    lastUpdated: PropTypes.string
  }),
  isLoading: PropTypes.bool,
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  onTrack: PropTypes.func,
  userRole: PropTypes.oneOf(['donor', 'beneficiary', 'ngo', 'admin']),
  isAdminView: PropTypes.bool,
  onAdminAction: PropTypes.func
};

DonationCard.defaultProps = {
  isLoading: false,
  onAccept: () => {},
  onReject: () => {},
  onTrack: () => {},
  userRole: 'beneficiary',
  isAdminView: false,
  onAdminAction: null
};

export default DonationCard;
