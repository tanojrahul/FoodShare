import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, FiPackage, FiCalendar, FiMapPin, FiUser, FiClock, 
  FiPhone, FiTag, FiEdit, FiCheck, FiX, FiStar, FiAlertTriangle, FiFileText 
} from 'react-icons/fi';

// Mock Auth Service
const authService = {
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user')) || { 
      id: 'user123', 
      role: 'donor', // Change this to test different roles: 'donor', 'beneficiary', 'ngo', 'admin'
      name: 'John Doe'
    };
  }
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Ready for Pickup':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'In Transit':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Delivered':
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

// Timeline Component
const Timeline = ({ status, timestamps }) => {
  // All possible statuses in order
  const allStatuses = [
    { id: 'created', label: 'Created', icon: <FiEdit /> },
    { id: 'accepted', label: 'Accepted', icon: <FiCheck /> },
    { id: 'readyForPickup', label: 'Ready for Pickup', icon: <FiPackage /> },
    { id: 'inTransit', label: 'In Transit', icon: <FiClock /> },
    { id: 'delivered', label: 'Delivered', icon: <FiMapPin /> }
  ];

  // Current status index
  const getCurrentIndex = () => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Accepted':
        return 1;
      case 'Ready for Pickup':
        return 2;
      case 'In Transit':
        return 3;
      case 'Delivered':
      case 'Completed':
        return 4;
      case 'Cancelled':
        return -1; // Special case
      default:
        return 0;
    }
  };

  const currentIndex = getCurrentIndex();
  
  // If cancelled, show a special timeline
  if (status === 'Cancelled') {
    return (
      <div className="mt-6 mb-4">
        <div className="flex items-center p-4 bg-red-50 rounded-lg">
          <FiAlertTriangle className="text-red-500 mr-2" size={20} />
          <div>
            <p className="font-medium text-red-800">This donation has been cancelled</p>
            {timestamps.cancelled && (
              <p className="text-sm text-red-700">
                {new Date(timestamps.cancelled).toLocaleDateString()} at {' '}
                {new Date(timestamps.cancelled).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 mb-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Donation Timeline</h3>
      <div className="relative">
        {/* Progress Bar */}
        <div className="overflow-hidden h-2 mb-6 flex rounded bg-gray-200">
          <motion.div 
            className="bg-[#123458]" 
            initial={{ width: '0%' }}
            animate={{ width: `${(currentIndex / (allStatuses.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Timeline Items */}
        <ol className="relative border-l border-gray-300 ml-3">
          {allStatuses.map((item, index) => {
            const isActive = index <= currentIndex;
            const timestamp = timestamps[item.id];
            
            return (
              <li key={item.id} className="mb-6 ml-6">
                <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 
                  ${isActive 
                    ? 'bg-[#123458] text-white' 
                    : 'bg-gray-200 text-gray-500'}`}
                >
                  {item.icon}
                </span>
                <h3 className={`flex items-center mb-1 text-lg font-semibold
                  ${isActive ? 'text-[#123458]' : 'text-gray-500'}`}>
                  {item.label}
                </h3>
                {timestamp ? (
                  <time className="block mb-2 text-sm font-normal leading-none text-gray-500">
                    {new Date(timestamp).toLocaleDateString()} at {' '}
                    {new Date(timestamp).toLocaleTimeString()}
                  </time>
                ) : (
                  <p className="text-sm text-gray-400">Pending</p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#D4C9BE] flex items-center justify-center text-[#123458] mr-3">
            {review.reviewerName.charAt(0)}
          </div>
          <div>
            <h4 className="font-medium">{review.reviewerName}</h4>
            <p className="text-sm text-gray-500">{review.reviewerRole}</p>
          </div>
        </div>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <FiStar 
              key={i} 
              className={`${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
        </div>
      </div>
      <p className="text-gray-600">{review.comment}</p>
      <p className="text-xs text-gray-400 mt-2">
        {new Date(review.date).toLocaleDateString()}
      </p>
    </div>
  );
};

// Review Form Component
const ReviewForm = ({ onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    onSubmitReview({ rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium mb-4">Leave a Review</h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Rating
        </label>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-2xl mr-1 focus:outline-none"
            >
              <FiStar 
                className={`
                  ${(hoverRating || rating) > i 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                  }
                `} 
              />
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="comment" className="block text-gray-700 text-sm font-medium mb-2">
          Comment
        </label>
        <textarea
          id="comment"
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]"
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </div>
      
      <button 
        type="submit" 
        className="bg-[#123458] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
      >
        Submit Review
      </button>
    </form>
  );
};

// Main Component
const DonationDetailsPage = () => {
  const { donationId } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        // This would be a real API call in production
        // const response = await fetch(`/api/donations/${donationId}`);
        // const data = await response.json();
        
        // Mock data for demonstration purposes
        const mockDonation = {
          id: donationId || '123',
          title: 'Fresh Vegetables Assortment',
          description: 'Assorted fresh vegetables including carrots, broccoli, and bell peppers. All organic and freshly harvested yesterday.',
          quantity: 10,
          category: 'Vegetables',
          expiresAt: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
          status: 'In Transit', // Pending, Accepted, Ready for Pickup, In Transit, Delivered, Completed, Cancelled
          createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
          imageUrl: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
          donor: {
            id: 'donor123',
            name: 'Green Grocers',
            phone: '(555) 123-4567',
            address: '123 Main St, Cityville'
          },
          recipient: {
            id: 'recipient456',
            name: 'Community Food Bank',
            phone: '(555) 987-6543',
            address: '456 Oak Ave, Townsville'
          },
          ngo: {
            id: 'ngo789',
            name: 'Food Rescue Initiative',
            phone: '(555) 456-7890'
          },
          timestamps: {
            created: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
            accepted: new Date(Date.now() - 86400000 * 0.8).toISOString(), // 0.8 days ago
            readyForPickup: new Date(Date.now() - 86400000 * 0.5).toISOString(), // 0.5 days ago
            inTransit: new Date(Date.now() - 86400000 * 0.2).toISOString(), // 0.2 days ago
            delivered: null,
            cancelled: null
          },
          logistics: {
            pickupAddress: '123 Main St, Cityville',
            dropoffAddress: '456 Oak Ave, Townsville',
            deliveryType: 'NGO Logistics', // or "Manual Pickup"
            eta: new Date(Date.now() + 86400000 * 0.5).toISOString() // 0.5 days from now
          },
          flags: [
            { issue: 'Incorrect quantity reported', date: new Date(Date.now() - 86400000 * 0.3).toISOString() }
          ]
        };
        
        setDonation(mockDonation);
        
        // Mock reviews
        const mockReviews = [
          {
            id: 'review1',
            donationId: mockDonation.id,
            reviewerId: 'donor123',
            reviewerName: 'Green Grocers',
            reviewerRole: 'Donor',
            rating: 5,
            comment: 'The food bank was very professional and picked up the items promptly. Will definitely donate again!',
            date: new Date(Date.now() - 86400000 * 0.1).toISOString() // 0.1 days ago
          }
        ];
        
        setReviews(mockReviews);
        
        // Check if current user has already submitted a review
        const hasReviewed = mockReviews.some(review => review.reviewerId === currentUser.id);
        setUserHasReviewed(hasReviewed);
        
      } catch (err) {
        console.error('Error fetching donation details:', err);
        setError('Failed to load donation details');
      } finally {
        setLoading(false);
      }
    };

    fetchDonationDetails();
  }, [donationId, currentUser.id]);

  // Handle submit review
  const handleSubmitReview = async (reviewData) => {
    try {
      // This would be a real API call in production
      // const response = await fetch('/api/reviews', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({
      //     donationId: donation.id,
      //     rating: reviewData.rating,
      //     comment: reviewData.comment
      //   })
      // });
      // const data = await response.json();
      
      // Mock response
      const newReview = {
        id: `review-${Date.now()}`,
        donationId: donation.id,
        reviewerId: currentUser.id,
        reviewerName: currentUser.name,
        reviewerRole: currentUser.role === 'ngo' ? 'NGO' : 
                     currentUser.role === 'beneficiary' ? 'Beneficiary' : 'Donor',
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: new Date().toISOString()
      };
      
      setReviews([...reviews, newReview]);
      setUserHasReviewed(true);
      
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    }
  };

  // Handle status update actions
  const handleStatusUpdate = async (newStatus) => {
    try {
      // This would be a real API call in production
      // const response = await fetch(`/api/donations/${donation.id}/status`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ status: newStatus })
      // });
      // const data = await response.json();
      
      // Mock update
      const updatedDonation = {
        ...donation,
        status: newStatus,
        timestamps: {
          ...donation.timestamps,
          [newStatus.toLowerCase().replace(/ /g, '')]: new Date().toISOString()
        }
      };
      
      setDonation(updatedDonation);
      
    } catch (err) {
      console.error('Error updating donation status:', err);
      alert('Failed to update donation status. Please try again.');
    }
  };

  // Handle flagging donation
  const handleFlagDonation = () => {
    alert('Donation flagged for review. This would trigger an API call in production.');
  };

  // Determine if user can review
  const canReview = () => {
    if (userHasReviewed) return false;
    
    // Different roles can review at different stages
    if (donation.status !== 'Delivered' && donation.status !== 'Completed') return false;
    
    // Only participants can review
    return (
      (currentUser.role === 'donor' && donation.donor.id === currentUser.id) || 
      (currentUser.role === 'beneficiary' && donation.recipient.id === currentUser.id) ||
      (currentUser.role === 'ngo' && donation.ngo.id === currentUser.id)
    );
  };

  // Determine which action buttons to show based on user role and donation status
  const getActionButtons = () => {
    // Admin-specific actions
    if (currentUser.role === 'admin') {
      return (
        <div className="flex flex-wrap gap-3">
          {donation.status === 'Pending' && (
            <>
              <button 
                onClick={() => handleStatusUpdate('Approved')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors flex items-center"
              >
                <FiCheck className="mr-2" /> Approve Donation
              </button>
              <button 
                onClick={() => handleStatusUpdate('Rejected')}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors flex items-center"
              >
                <FiX className="mr-2" /> Reject Donation
              </button>
            </>
          )}
          
          {['Approved', 'Ready for Pickup', 'In Transit'].includes(donation.status) && (
            <button 
              onClick={() => handleStatusUpdate('Completed')}
              className="bg-[#123458] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors flex items-center"
            >
              <FiCheck className="mr-2" /> Mark as Completed
            </button>
          )}
          
          {donation.status !== 'Cancelled' && (
            <button 
              onClick={() => handleStatusUpdate('Cancelled')}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors flex items-center"
            >
              <FiX className="mr-2" /> Cancel Donation
            </button>
          )}
          
          <div className="w-full mt-4">
            <button 
              onClick={() => navigate(`/admin/donations/edit/${donation.id}`)}
              className="border border-[#123458] text-[#123458] px-4 py-2 rounded-md hover:bg-[#F1EFEC] transition-colors flex items-center"
            >
              <FiEdit className="mr-2" /> Edit Details
            </button>
          </div>
          
          {/* Admin-specific report generation */}
          <div className="w-full mt-2">
            <button 
              onClick={() => window.print()}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center"
            >
              <FiFileText className="mr-2" /> Generate Report
            </button>
          </div>
        </div>
      );
    }

    if (currentUser.role === 'donor' && donation.donor.id === currentUser.id) {
      // Donor actions
      if (donation.status === 'Pending') {
        return (
          <div className="flex space-x-4">
            <button 
              onClick={() => handleStatusUpdate('Ready for Pickup')}
              className="bg-[#123458] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
            >
              Mark as Ready
            </button>
            <button 
              onClick={() => handleStatusUpdate('Cancelled')}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
            >
              Cancel Donation
            </button>
          </div>
        );
      }
    } else if (currentUser.role === 'beneficiary' && donation.recipient.id === currentUser.id) {
      // Beneficiary actions
      if (donation.status === 'Pending') {
        return (
          <button 
            onClick={() => handleStatusUpdate('Accepted')}
            className="bg-[#123458] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Accept Donation
          </button>
        );
      } else if (donation.status === 'In Transit') {
        return (
          <button 
            onClick={() => handleStatusUpdate('Delivered')}
            className="bg-[#123458] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Mark as Received
          </button>
        );
      }
    } else if (currentUser.role === 'ngo' && donation.ngo.id === currentUser.id) {
      // NGO actions
      if (donation.status === 'Ready for Pickup') {
        return (
          <button 
            onClick={() => handleStatusUpdate('In Transit')}
            className="bg-[#123458] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Start Delivery
          </button>
        );
      }
    }
    
    return null;
  };

  // Format the expiration date
  const formatExpirationDate = (expiresAt) => {
    const date = new Date(expiresAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate days until expiration
  const getDaysUntilExpiration = (expiresAt) => {
    const today = new Date();
    const expirationDate = new Date(expiresAt);
    const diffTime = expirationDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F1EFEC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#123458]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F1EFEC] p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F1EFEC] p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-[#123458] mb-4">Donation Not Found</h2>
          <p className="text-gray-700 mb-4">The donation you're looking for doesn't exist or you don't have permission to view it.</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1EFEC]">
      <header className="bg-[#123458] text-white py-4 px-6">
        <div className="container mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:underline mb-2"
          >
            <FiArrowLeft className="mr-1" /> Back
          </button>
          <h1 className="text-2xl font-bold">Donation Details</h1>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {/* Header Section with Status */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-[#123458]">{donation.title}</h2>
                <div className="flex items-center mt-2 text-gray-600">
                  <FiPackage className="mr-1" />
                  <span className="mr-3">{donation.quantity} units</span>
                  <span className="bg-[#123458] text-white text-xs px-2 py-0.5 rounded-full">
                    {donation.category}
                  </span>
                </div>
              </div>
              <StatusBadge status={donation.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Left Column - Food Details */}
            <div className="p-6 md:border-r border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Food Details</h3>
              
              {/* Food Image */}
              {donation.imageUrl && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={donation.imageUrl} 
                    alt={donation.title} 
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              {/* Food Description */}
              <p className="text-gray-600 mb-4">
                {donation.description}
              </p>
              
              {/* Details List */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <FiTag className="mr-2 text-[#123458]" />
                  <span className="font-medium mr-2">Category:</span>
                  {donation.category}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <FiPackage className="mr-2 text-[#123458]" />
                  <span className="font-medium mr-2">Quantity:</span>
                  {donation.quantity} units
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <FiCalendar className="mr-2 text-[#123458]" />
                  <span className="font-medium mr-2">Expires:</span>
                  {formatExpirationDate(donation.expiresAt)}
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full 
                    ${getDaysUntilExpiration(donation.expiresAt) <= 1 
                      ? 'bg-red-100 text-red-800' 
                      : getDaysUntilExpiration(donation.expiresAt) <= 3 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'}
                  `}>
                    {getDaysUntilExpiration(donation.expiresAt) <= 0 
                      ? 'Expires Today!' 
                      : `${getDaysUntilExpiration(donation.expiresAt)} days left`}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <FiClock className="mr-2 text-[#123458]" />
                  <span className="font-medium mr-2">Posted:</span>
                  {new Date(donation.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {/* Middle Column - Participants */}
            <div className="p-6 md:border-r border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Participants</h3>
              
              {/* Donor Info */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-[#123458] flex items-center">
                  <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-[#123458] text-white text-xs mr-1">D</span>
                  Donor
                </h4>
                <div className="ml-7 mt-2">
                  <p className="font-medium">{donation.donor.name}</p>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <FiPhone className="mr-1" />
                    {donation.donor.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <FiMapPin className="mr-1" />
                    {donation.donor.address}
                  </div>
                </div>
                <Link to={`/profile/${donation.donor.id}`} className="ml-7 text-sm text-[#123458] hover:underline block mt-1">
                  View Profile
                </Link>
              </div>
              
              {/* Recipient Info */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-[#123458] flex items-center">
                  <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-[#D4C9BE] text-[#123458] text-xs mr-1">B</span>
                  Recipient
                </h4>
                <div className="ml-7 mt-2">
                  <p className="font-medium">{donation.recipient.name}</p>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <FiPhone className="mr-1" />
                    {donation.recipient.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <FiMapPin className="mr-1" />
                    {donation.recipient.address}
                  </div>
                </div>
                <Link to={`/profile/${donation.recipient.id}`} className="ml-7 text-sm text-[#123458] hover:underline block mt-1">
                  View Profile
                </Link>
              </div>
              
              {/* NGO Info */}
              {donation.ngo && (
                <div>
                  <h4 className="text-md font-medium text-[#123458] flex items-center">
                    <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-[#F1EFEC] text-[#123458] text-xs mr-1">N</span>
                    NGO
                  </h4>
                  <div className="ml-7 mt-2">
                    <p className="font-medium">{donation.ngo.name}</p>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <FiPhone className="mr-1" />
                      {donation.ngo.phone}
                    </div>
                  </div>
                  <Link to={`/profile/${donation.ngo.id}`} className="ml-7 text-sm text-[#123458] hover:underline block mt-1">
                    View Profile
                  </Link>
                </div>
              )}
            </div>
            
            {/* Right Column - Logistics & Actions */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Logistics</h3>
              
              <div className="mb-6">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Pickup Address</h4>
                  <p className="text-gray-600">{donation.logistics.pickupAddress}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Dropoff Address</h4>
                  <p className="text-gray-600">{donation.logistics.dropoffAddress}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Delivery Type</h4>
                  <p className="text-gray-600">{donation.logistics.deliveryType}</p>
                </div>
                
                {donation.logistics.eta && donation.status !== 'Completed' && donation.status !== 'Delivered' && (
                  <div className="p-3 bg-[#F1EFEC] rounded-lg">
                    <h4 className="text-sm font-medium text-[#123458]">Estimated Delivery</h4>
                    <p className="text-gray-600">
                      {new Date(donation.logistics.eta).toLocaleDateString()} at {' '}
                      {new Date(donation.logistics.eta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="mt-6">
                {getActionButtons()}
              </div>
              
              {/* Link to tracking */}
              {donation.status === 'In Transit' && (
                <Link 
                  to={`/track/${donation.id}`}
                  className="mt-4 text-[#123458] hover:underline flex items-center"
                >
                  <FiMapPin className="mr-1" /> Track live location
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Admin Controls */}
        {currentUser.role === 'admin' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Controls</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Moderation Actions</h4>
                {getActionButtons()}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Flagged Issues</h4>
                <div className="space-y-3">
                  {donation.flags ? (
                    donation.flags.map((flag, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-sm text-red-800">
                          <span className="font-medium">Issue:</span> {flag.issue}
                        </p>
                        <p className="text-xs text-red-700 mt-1">
                          Reported on {new Date(flag.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No issues flagged for this donation</p>
                  )}
                </div>
                
                <div className="mt-4">
                  <button 
                    onClick={() => handleFlagDonation()}
                    className="flex items-center text-gray-700 hover:text-red-600"
                  >
                    <FiAlertTriangle className="mr-1" /> Flag for review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 p-6">
          <Timeline status={donation.status} timestamps={donation.timestamps} />
        </div>
        
        {/* Reviews Section */}
        {(donation.status === 'Delivered' || donation.status === 'Completed') && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <h3 className="text-xl font-semibold text-[#123458] mb-4">Reviews & Feedback</h3>
            
            {reviews.length > 0 ? (
              <div className="mb-6">
                {reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mb-6">No reviews yet for this donation.</p>
            )}
            
            {/* Show review form if user can review */}
            {canReview() && (
              <ReviewForm onSubmitReview={handleSubmitReview} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DonationDetailsPage;
