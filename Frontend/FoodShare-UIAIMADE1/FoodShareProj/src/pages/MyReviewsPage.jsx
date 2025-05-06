import React, { useState, useEffect } from 'react';
import { FiStar, FiEdit3, FiTrash2, FiFilter } from 'react-icons/fi';
import BeneficiaryLayout from '../layouts/BeneficiaryLayout';
import ReviewCard from '../components/ReviewCard';
import ToastAlert from '../components/ToastAlert';
import authService from '../services/authService';

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);

  // Mock reviews data
  const mockReviews = [
    {
      id: 'rev1',
      author: 'You',
      recipient: 'Green Grocers',
      rating: 5,
      comment: 'The vegetables were very fresh and the pickup process was smooth. Thank you!',
      date: '2025-04-10',
      donationTitle: 'Fresh Vegetables Bundle',
      type: 'donor'
    },
    {
      id: 'rev2',
      author: 'You',
      recipient: 'Daily Bread',
      rating: 4,
      comment: 'Good selection of bakery items, though one item was slightly stale.',
      date: '2025-03-22',
      donationTitle: 'Bakery Assortment',
      type: 'donor'
    },
    {
      id: 'rev3',
      author: 'You',
      recipient: 'Community Pantry',
      rating: 5,
      comment: 'Very well organized donation process and friendly staff!',
      date: '2025-03-05',
      donationTitle: 'Canned Goods',
      type: 'donor'
    }
  ];

  useEffect(() => {
    // Get current user
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Simulate API call
    setTimeout(() => {
      setReviews(mockReviews);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleDeleteReview = (reviewId) => {
    // In a real app, this would call an API
    setReviews(reviews.filter(review => review.id !== reviewId));
    setToast({
      type: 'success',
      message: 'Review deleted successfully'
    });

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(review => review.type === filter);

  return (
    <BeneficiaryLayout>
      {/* Toast notification */}
      {toast && (
        <ToastAlert
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#123458] mb-2">My Reviews</h1>
        <p className="text-gray-600">Manage the reviews you've written for food donations.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center">
          <FiFilter className="text-gray-500 mr-2" />
          <span className="mr-4 text-sm font-medium">Filter by:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === 'all'
                  ? 'bg-[#123458] text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => setFilter('donor')}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === 'donor'
                  ? 'bg-[#123458] text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Donor Reviews
            </button>
            <button
              onClick={() => setFilter('ngo')}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === 'ngo'
                  ? 'bg-[#123458] text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              NGO Reviews
            </button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
              <div className="flex justify-between">
                <div className="w-1/3 h-5 bg-gray-200 rounded"></div>
                <div className="w-20 h-5 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-3 w-full h-4 bg-gray-200 rounded"></div>
              <div className="mt-2 w-2/3 h-4 bg-gray-200 rounded"></div>
              <div className="mt-3 w-1/4 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredReviews.length > 0 ? (
        <div className="space-y-6">
          {filteredReviews.map(review => (
            <div key={review.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{review.donationTitle}</h3>
                    <p className="text-sm text-gray-600">For: {review.recipient}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      aria-label="Edit review"
                    >
                      <FiEdit3 size={18} />
                    </button>
                    <button 
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      onClick={() => handleDeleteReview(review.id)}
                      aria-label="Delete review"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center my-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={`${
                        i < review.rating 
                          ? 'text-yellow-500 fill-current' 
                          : 'text-gray-300'
                      } h-5 w-5`} 
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-[#123458] text-5xl mb-4">
            <FiStar className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No reviews yet</h3>
          <p className="text-gray-600 mb-6">
            {filter !== 'all'
              ? `You haven't written any ${filter} reviews yet.`
              : "You haven't written any reviews yet."}
          </p>
          <button
            className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors inline-block"
          >
            Browse Your Donations
          </button>
        </div>
      )}
    </BeneficiaryLayout>
  );
};

export default MyReviewsPage;