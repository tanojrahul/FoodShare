import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiArrowLeft, FiMapPin, FiClock, FiPhoneCall, 
  FiCheckCircle, FiCalendar, FiPackage, FiUser
} from 'react-icons/fi';

// Import components
import StatusBadge from '../components/StatusBadge';
import ToastAlert from '../components/ToastAlert';
import ConfirmationModal from '../components/ConfirmationModal';
import ReviewCard from '../components/ReviewCard';

// Import services
import { getDonationById, updateDonationStatus, submitReview } from '../services/donationService';
import { getDeliveryLocation } from '../services/mapService';

const DonationTrackingPage = () => {
  const { id } = useParams(); // Get donation ID from URL
  const [donation, setDonation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState({
    rating: 5,
    comment: ''
  });

  // Fetch donation data on component mount
  useEffect(() => {
    const loadDonationData = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call
        // For now, we'll simulate the data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock donation data
        const mockDonation = {
          id,
          title: 'Bakery Items',
          donorName: 'Daily Bread',
          donorId: 'donor123',
          donorPhone: '555-123-4567',
          quantity: '10 items',
          status: 'In Transit',
          expiresAt: new Date(Date.now() + 1*24*60*60*1000).toISOString(), // 1 day from now
          requestedAt: new Date(Date.now() - 2*60*60*1000).toISOString(), // 2 hours ago
          approvedAt: new Date(Date.now() - 1*60*60*1000).toISOString(), // 1 hour ago
          dispatchedAt: new Date(Date.now() - 30*60*1000).toISOString(), // 30 minutes ago
          estimatedDelivery: new Date(Date.now() + 15*60*1000).toISOString(), // 15 minutes from now
          pickupLocation: '456 Flour Ave, Local City',
          deliveryLocation: '789 Recipient St, Local City',
          distance: '2.3 km',
          category: 'Bakery',
          description: 'Assorted bread, rolls, and pastries. All items are fresh and baked today.',
          imageUrl: null,
          hasReview: false
        };
        
        setDonation(mockDonation);
        
        // Simulate fetching delivery location for map
        const mockLocation = {
          lat: 37.7749,
          lng: -122.4194,
          address: mockDonation.deliveryLocation,
          eta: '15 minutes'
        };
        
        setDeliveryLocation(mockLocation);
      } catch (error) {
        console.error('Error loading donation data:', error);
        setToastMessage('Failed to load donation information');
        setToastType('error');
        setShowToast(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      loadDonationData();
    }
  }, [id]);

  // Calculate delivery progress (0-100%)
  const calculateProgress = () => {
    if (!donation) return 0;
    
    switch (donation.status) {
      case 'Pending Approval':
        return 10;
      case 'Approved':
        return 30;
      case 'In Transit':
        return 70;
      case 'Completed':
        return 100;
      default:
        return 0;
    }
  };

  // Handle confirm delivery
  const handleConfirmDelivery = () => {
    setShowConfirmModal(true);
  };

  // Process confirm delivery
  const confirmDelivery = async () => {
    try {
      setShowConfirmModal(false);
      setIsLoading(true);
      
      // In a real app, this would call an API
      // For now, we'll simulate the API call
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update donation status
      setDonation(prev => ({
        ...prev,
        status: 'Completed',
        deliveredAt: new Date().toISOString()
      }));
      
      // Show success toast
      setToastMessage('Delivery confirmed successfully!');
      setToastType('success');
      setShowToast(true);
      
      // Show review modal after a short delay
      setTimeout(() => {
        setShowReviewModal(true);
      }, 1500);
    } catch (error) {
      console.error('Error confirming delivery:', error);
      setToastMessage('Failed to confirm delivery');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle review change
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview({
      ...review,
      [name]: value
    });
  };

  // Handle rating change
  const handleRatingChange = (newRating) => {
    setReview({
      ...review,
      rating: newRating
    });
  };

  // Submit review
  const submitDonorReview = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, this would call an API
      // For now, we'll simulate the API call
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update donation to mark as reviewed
      setDonation(prev => ({
        ...prev,
        hasReview: true
      }));
      
      // Close review modal
      setShowReviewModal(false);
      
      // Show success toast
      setToastMessage('Thank you for your review!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error submitting review:', error);
      setToastMessage('Failed to submit review');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#F1EFEC]">
      {/* Toast Notification */}
      {showToast && (
        <ToastAlert
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmationModal
          title="Confirm Delivery Receipt"
          message="Are you sure you want to confirm that you've received this donation? This action cannot be undone."
          confirmText="Yes, Confirm Receipt"
          cancelText="Cancel"
          onConfirm={confirmDelivery}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[#123458] mb-4">Leave a Review for {donation?.donorName}</h3>
            <p className="text-gray-600 mb-4">Your feedback helps improve our community and recognizes donors for their contributions.</p>
            
            {/* Star Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className={`text-2xl ${review.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            {/* Comment */}
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Your Review (Optional)
              </label>
              <textarea
                id="comment"
                name="comment"
                value={review.comment}
                onChange={handleReviewChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent"
                placeholder="Share your experience about the donation, food quality, etc."
              ></textarea>
            </div>
            
            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
              >
                Skip
              </button>
              <button
                onClick={submitDonorReview}
                disabled={isLoading}
                className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 flex items-center"
              >
                {isLoading && <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>}
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-[#123458] text-white py-4 px-6">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-white hover:text-opacity-80 mr-3">
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">Donation Tracking</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        {isLoading && !donation ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#123458]"></div>
          </div>
        ) : !donation ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-3 text-5xl">😕</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Donation Not Found</h3>
            <p className="text-gray-600 mb-4">The donation you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/dashboard"
              className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <>
            {/* Donation Status Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-[#123458]">{donation.title}</h2>
                  <p className="text-gray-600">From: {donation.donorName}</p>
                </div>
                <StatusBadge status={donation.status} />
              </div>
              
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-[#123458] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm mt-2">
                  <span>Requested</span>
                  <span>Approved</span>
                  <span>In Transit</span>
                  <span>Delivered</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Left Column - Donation Details */}
                <div className="space-y-4">
                  <h3 className="font-medium text-[#123458]">Donation Details</h3>
                  
                  <div className="flex items-start">
                    <FiPackage className="mt-1 mr-2 text-[#123458]" />
                    <div>
                      <p className="font-medium">Items</p>
                      <p className="text-gray-600">
                        {donation.quantity} - {donation.category}
                      </p>
                      {donation.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {donation.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiCalendar className="mt-1 mr-2 text-[#123458]" />
                    <div>
                      <p className="font-medium">Timeline</p>
                      <p className="text-sm text-gray-600">
                        <span className="block">Requested: {formatDate(donation.requestedAt)}</span>
                        <span className="block">Approved: {formatDate(donation.approvedAt)}</span>
                        <span className="block">Dispatched: {formatDate(donation.dispatchedAt)}</span>
                        {donation.status === 'Completed' && (
                          <span className="block">Delivered: {formatDate(donation.deliveredAt)}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiClock className="mt-1 mr-2 text-[#123458]" />
                    <div>
                      <p className="font-medium">Expiration</p>
                      <p className="text-gray-600">
                        Expires on {new Date(donation.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Delivery Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-[#123458]">Delivery Information</h3>
                  
                  <div className="flex items-start">
                    <FiUser className="mt-1 mr-2 text-[#123458]" />
                    <div>
                      <p className="font-medium">Donor Contact</p>
                      <p className="text-gray-600">{donation.donorName}</p>
                      <a 
                        href={`tel:${donation.donorPhone}`}
                        className="text-blue-600 flex items-center text-sm mt-1"
                      >
                        <FiPhoneCall className="mr-1" /> {donation.donorPhone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiMapPin className="mt-1 mr-2 text-[#123458]" />
                    <div>
                      <p className="font-medium">Locations</p>
                      <p className="text-sm text-gray-600">
                        <span className="block font-medium text-xs text-gray-500 mt-1">From:</span>
                        <span className="block">{donation.pickupLocation}</span>
                        <span className="block font-medium text-xs text-gray-500 mt-1">To:</span>
                        <span className="block">{donation.deliveryLocation}</span>
                        <span className="block text-xs mt-1">Distance: {donation.distance}</span>
                      </p>
                    </div>
                  </div>
                  
                  {donation.status === 'In Transit' && (
                    <div className="flex items-start">
                      <FiClock className="mt-1 mr-2 text-[#123458]" />
                      <div>
                        <p className="font-medium">Estimated Delivery</p>
                        <p className="text-gray-600">
                          {new Date(donation.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {deliveryLocation?.eta && ` (${deliveryLocation.eta})`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Map Placeholder */}
              {(donation.status === 'In Transit' || donation.status === 'Approved') && (
                <div className="mt-6">
                  <h3 className="font-medium text-[#123458] mb-2">Live Tracking</h3>
                  <div className="bg-gray-100 border border-gray-200 h-64 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Map integration will be available here</p>
                    {/* In a real app, this would be replaced with an actual map component */}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="mt-6 flex flex-col md:flex-row gap-4">
                {donation.status === 'In Transit' && (
                  <button
                    onClick={handleConfirmDelivery}
                    className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
                  >
                    <FiCheckCircle className="mr-2" /> Confirm Receipt
                  </button>
                )}
                
                {donation.status === 'Completed' && !donation.hasReview && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="px-4 py-3 bg-[#123458] text-white rounded-md hover:bg-opacity-90 flex items-center justify-center"
                  >
                    Leave a Review
                  </button>
                )}
                
                <Link
                  to="/dashboard"
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 text-center"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
            
            {/* Reviews Section (if completed and has review) */}
            {donation.status === 'Completed' && donation.hasReview && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-[#123458] mb-4">Your Review</h3>
                <ReviewCard
                  review={{
                    id: 'rev1',
                    author: 'You',
                    recipient: donation.donorName,
                    rating: review.rating,
                    comment: review.comment || 'Thank you for the donation!',
                    date: new Date().toISOString().split('T')[0]
                  }}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default DonationTrackingPage;
