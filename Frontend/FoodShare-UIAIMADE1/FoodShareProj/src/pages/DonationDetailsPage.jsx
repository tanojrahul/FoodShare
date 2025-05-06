import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiCalendar, FiMapPin, FiPackage, FiUser, 
  FiAlertCircle, FiCheck, FiClock, FiHeart,
  FiStar
} from 'react-icons/fi';
import Footer from '../components/Footer';
import ConfirmationModal from '../components/ConfirmationModal';
import authService from '../services/authService';
import { getDonationById, claimDonation, requestDonation } from '../services/donationService';
import BeneficiaryLayout from '../layouts/BeneficiaryLayout';
import DonorLayout from '../layouts/DonorLayout';
import NGOLayout from '../layouts/NGOLayout';
import AdminLayout from '../layouts/AdminLayout';

const DonationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  // Fetch donation data using our API
  useEffect(() => {
    const fetchDonation = async () => {
      setIsLoading(true);
      try {
        const donationData = await getDonationById(id);
        setDonation(donationData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching donation:', error);
        setError(error.message || 'Failed to load donation details');
        setIsLoading(false);
      }
    };

    // Get current user
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    fetchDonation();
  }, [id]);

  // Format the expiration date
  const formatExpirationDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  // Handle request submission
  const handleRequestSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const response = await requestDonation(id, user.id, requestNotes);
      
      setShowRequestModal(false);
      setIsSubmitting(false);
      setSuccess({
        message: 'Donation request submitted successfully!',
        type: 'request',
        data: response
      });
      
      // After a success, wait 2 seconds and navigate to requests page
      setTimeout(() => {
        navigate('/my-requests');
      }, 2000);
      
    } catch (error) {
      setIsSubmitting(false);
      setError(error.message || 'Failed to submit request');
      setShowRequestModal(false);
    }
  };
  
  // Handle direct claim submission
  const handleClaimSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const response = await claimDonation(id, user.id, requestNotes);
      
      setShowClaimModal(false);
      setIsSubmitting(false);
      setSuccess({
        message: 'Donation claimed successfully!',
        type: 'claim',
        data: response
      });
      
      // After a success, wait 2 seconds and navigate to claims page
      setTimeout(() => {
        navigate('/my-claims');
      }, 2000);
      
    } catch (error) {
      setIsSubmitting(false);
      setError(error.message || 'Failed to claim donation');
      setShowClaimModal(false);
    }
  };

  // Check if user is eligible to request
  const canRequest = () => {
    if (!user) return false;
    return ['beneficiary', 'ngo'].includes(user.role);
  };
  
  // Check if user is eligible to directly claim
  const canClaim = () => {
    if (!user) return false;
    return ['beneficiary', 'ngo'].includes(user.role);
  };

  // Close error or success message
  const handleDismissMessage = () => {
    setError(null);
    setSuccess(null);
  };

  // Function to render the appropriate layout based on user role
  const renderWithLayout = (content) => {
    if (!user) {
      // If no user is logged in, show content without any specific navbar
      return (
        <div className="min-h-screen bg-[#F1EFEC]">
          <div className="pt-16 pb-12">
            {content}
          </div>
          <Footer />
        </div>
      );
    }

    // Use the appropriate layout based on the user's role
    switch (user.role) {
      case 'beneficiary':
        return <BeneficiaryLayout>{content}</BeneficiaryLayout>;
      case 'donor':
        return <DonorLayout>{content}</DonorLayout>;
      case 'ngo':
        return <NGOLayout>{content}</NGOLayout>;
      case 'admin':
        return <AdminLayout>{content}</AdminLayout>;
      default:
        // Fallback for unknown roles
        return (
          <div className="min-h-screen bg-[#F1EFEC]">
            <div className="pt-16 pb-12">
              {content}
            </div>
            <Footer />
          </div>
        );
    }
  };

  // Show loading state
  if (isLoading) {
    return renderWithLayout(
      <div className="animate-pulse mt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="h-60 bg-gray-200 rounded mb-6"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return renderWithLayout(
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FiAlertCircle className="text-red-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => navigate(-1)} 
            className="px-6 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90"
          >
            Go Back
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show success state if just completed an action
  if (success) {
    return renderWithLayout(
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FiCheck className="text-green-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
        <p className="text-gray-600 mb-6">{success.message}</p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => navigate(success.type === 'claim' ? '/my-claims' : '/my-requests')} 
            className="px-6 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90"
          >
            View My {success.type === 'claim' ? 'Claims' : 'Requests'}
          </button>
          <button 
            onClick={handleDismissMessage} 
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  // No donation found
  if (!donation) {
    return renderWithLayout(
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FiAlertCircle className="text-yellow-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Donation Not Found</h2>
        <p className="text-gray-600 mb-6">The donation you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/browse')} 
          className="px-6 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90"
        >
          Browse Available Donations
        </button>
      </div>
    );
  }

  const mainContent = (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mt-6 flex items-center text-[#123458] hover:underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Donations
      </button>
      
      {/* Main Content Section */}
      <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
        {/* Food Image */}
        <div className="relative h-64 sm:h-96 bg-gray-200">
          {donation.imageUrl ? (
            <img
              src={donation.imageUrl}
              alt={donation.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <FiPackage size={60} className="text-gray-400" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              donation.status === 'Available' 
                ? 'bg-green-100 text-green-800' 
                : donation.status === 'Pending' || donation.status === 'Pending Approval'
                ? 'bg-yellow-100 text-yellow-800'
                : donation.status === 'In Transit'
                ? 'bg-blue-100 text-blue-800'
                : donation.status === 'Delivered' || donation.status === 'Completed'
                ? 'bg-teal-100 text-teal-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {donation.status}
            </span>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123458] mb-4">{donation.title}</h1>
          
          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center">
              <FiPackage className="text-[#123458] mr-2 flex-shrink-0" />
              <span className="text-gray-700">{donation.quantity} {donation.unit}</span>
            </div>
            <div className="flex items-center">
              <FiCalendar className="text-[#123458] mr-2 flex-shrink-0" />
              <span className={`text-gray-700 ${getUrgencyClass(donation.expiresAt)}`}>
                Expires: {formatExpirationDate(donation.expiresAt)}
              </span>
            </div>
            <div className="flex items-center">
              <FiMapPin className="text-[#123458] mr-2 flex-shrink-0" />
              <span className="text-gray-700">{donation.location}</span>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#123458] mb-2">Description</h2>
            <p className="text-gray-700">{donation.description}</p>
          </div>
          
          {/* Two-column layout for additional details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <h2 className="text-xl font-semibold text-[#123458] mb-3">Donation Details</h2>
              
              <div className="space-y-4">
                {donation.foodType && (
                  <div>
                    <h3 className="font-medium text-gray-800">Type</h3>
                    <p className="text-gray-700">{donation.foodType}</p>
                  </div>
                )}
                
                {donation.category && (
                  <div>
                    <h3 className="font-medium text-gray-800">Category</h3>
                    <p className="text-gray-700">{donation.category}</p>
                  </div>
                )}
                
                {donation.nutritionalInfo && (
                  <div>
                    <h3 className="font-medium text-gray-800">Nutritional Information</h3>
                    <p className="text-gray-700">{donation.nutritionalInfo}</p>
                  </div>
                )}
                
                {donation.allergens && (
                  <div>
                    <h3 className="font-medium text-gray-800">Allergens</h3>
                    <p className="text-gray-700">{donation.allergens}</p>
                  </div>
                )}
                
                {donation.storageInstructions && (
                  <div>
                    <h3 className="font-medium text-gray-800">Storage Instructions</h3>
                    <p className="text-gray-700">{donation.storageInstructions}</p>
                  </div>
                )}
                
                {donation.additionalNotes && (
                  <div>
                    <h3 className="font-medium text-gray-800">Additional Notes</h3>
                    <p className="text-gray-700">{donation.additionalNotes}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              <h2 className="text-xl font-semibold text-[#123458] mb-3">Donor Information</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-start mb-3">
                  <FiUser className="text-[#123458] mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium text-gray-800">{donation.donor?.name || donation.donorName}</h3>
                    {donation.donor?.type && <p className="text-gray-600 text-sm">{donation.donor.type}</p>}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-700">
                  {donation.donor?.contactPerson && (
                    <p>Contact: {donation.donor.contactPerson}</p>
                  )}
                  
                  {donation.pickupInstructions && (
                    <div className="mt-4">
                      <h3 className="font-medium text-gray-800">Pickup Instructions</h3>
                      <p className="text-gray-700">{donation.pickupInstructions}</p>
                    </div>
                  )}
                  
                  {donation.logistics && (
                    <div className="mt-4">
                      <h3 className="font-medium text-gray-800">Logistics</h3>
                      {donation.logistics.pickupAddress && (
                        <p>Pickup: {donation.logistics.pickupAddress}</p>
                      )}
                      {donation.logistics.dropoffAddress && (
                        <p>Dropoff: {donation.logistics.dropoffAddress}</p>
                      )}
                      {donation.logistics.deliveryType && (
                        <p>Delivery Type: {donation.logistics.deliveryType}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {/* Request Button - show for available donations to beneficiaries/NGOs */}
                {canRequest() && donation.status === 'Available' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowRequestModal(true)}
                    className="w-full py-3 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center"
                  >
                    <FiHeart className="mr-2" />
                    Request This Donation
                  </motion.button>
                )}
                
                {/* Claim Button - direct claim for eligible users */}
                {canClaim() && donation.status === 'Available' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowClaimModal(true)}
                    className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <FiCheck className="mr-2" />
                    Claim Now
                  </motion.button>
                )}
                
                {/* Review Button - show for completed donations */}
                {user && ['Delivered', 'Completed'].includes(donation.status) && (
                  donation.recipientId === user.id && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/donations/${id}/review`)}
                      className="w-full py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center"
                    >
                      <FiStar className="mr-2" />
                      Leave a Review
                    </motion.button>
                  )
                )}
                
                {/* Not Available Message */}
                {donation.status !== 'Available' && !(user && ['Delivered', 'Completed'].includes(donation.status) && donation.recipientId === user.id) && (
                  <div className="w-full py-3 bg-gray-200 text-gray-600 rounded-md flex items-center justify-center">
                    <FiClock className="mr-2" />
                    This donation is {donation.status.toLowerCase()}
                  </div>
                )}
                
                {/* Login to Request Message */}
                {!user && donation.status === 'Available' && (
                  <div className="text-center">
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full py-3 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
                    >
                      Login to Request
                    </button>
                    <p className="mt-2 text-sm text-gray-600">Only beneficiaries and NGOs can request donations</p>
                  </div>
                )}
                
                {/* Not Eligible Message */}
                {user && !canRequest() && donation.status === 'Available' && (
                  <div className="text-center">
                    <div className="w-full py-3 bg-gray-200 text-gray-600 rounded-md flex items-center justify-center">
                      <FiAlertCircle className="mr-2" />
                      Your account type cannot request donations
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Request Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onConfirm={handleRequestSubmit}
        title="Confirm Donation Request"
        message={`Are you sure you want to request "${donation.title}" (${donation.quantity} ${donation.unit})? You will be notified once the donor approves your request.`}
        confirmText={isSubmitting ? "Submitting..." : "Yes, Request Donation"}
        cancelText="Cancel"
        icon={<FiHeart className="text-white text-xl" />}
        isLoading={isSubmitting}
      >
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add a note to the donor (optional):
          </label>
          <textarea
            value={requestNotes}
            onChange={(e) => setRequestNotes(e.target.value)}
            placeholder="Explain why you need this donation or add details about pickup..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458] text-sm"
            rows={3}
          />
        </div>
      </ConfirmationModal>
      
      {/* Claim Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        onConfirm={handleClaimSubmit}
        title="Confirm Direct Claim"
        message={`Are you sure you want to directly claim "${donation.title}" (${donation.quantity} ${donation.unit})? This will immediately reserve the donation for you.`}
        confirmText={isSubmitting ? "Processing..." : "Yes, Claim Now"}
        cancelText="Cancel"
        icon={<FiCheck className="text-white text-xl" />}
        isLoading={isSubmitting}
      >
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add claim notes (optional):
          </label>
          <textarea
            value={requestNotes}
            onChange={(e) => setRequestNotes(e.target.value)}
            placeholder="Add details about pickup time or special instructions..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458] text-sm"
            rows={3}
          />
        </div>
      </ConfirmationModal>
    </div>
  );

  return renderWithLayout(mainContent);
};

export default DonationDetailsPage;
