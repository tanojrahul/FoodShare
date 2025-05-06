import React, { useState } from 'react';
import ReviewCard from '../components/ReviewCard';

const ReviewCardUsageExample = () => {
  // Sample reviews data
  const [reviews, setReviews] = useState([
    {
      id: '1',
      rating: 5,
      comment: "The donor was extremely prompt and the food was fresh. This donation really helped our shelter prepare meals for 30 people this evening. Thank you so much for your generosity!",
      date: '2023-05-15T14:30:00Z',
      reviewerName: 'Jane Smith',
      reviewerImage: 'https://randomuser.me/api/portraits/women/44.jpg',
      reviewerRole: 'Beneficiary',
      status: 'Approved',
      donationTitle: 'Fresh Vegetables Assortment'
    },
    {
      id: '2',
      rating: 4,
      comment: "Good quality food, though the pickup process was a bit confusing. Overall a positive experience and I'd be happy to receive donations from this donor again.",
      date: '2023-05-10T09:15:00Z',
      reviewerName: 'Mark Johnson',
      reviewerRole: 'NGO Coordinator',
      status: 'Approved',
      donationTitle: 'Bakery Items Bundle'
    },
    {
      id: '3',
      rating: 3,
      comment: "This is my review that I wrote. The beneficiary was on time but didn't bring their own containers as requested in the listing.",
      date: '2023-05-08T16:45:00Z',
      reviewerName: 'Current User',
      reviewerRole: 'Donor',
      isMine: true,
      donationTitle: 'Pasta and Sauce Collection'
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Handler functions
  const handleEditReview = async (updatedReview) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update reviews state
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === updatedReview.id ? updatedReview : review
      )
    );
    
    setIsLoading(false);
    alert('Review updated successfully!');
  };
  
  const handleDeleteReview = async (reviewId) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove the review from state
    setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
    
    setIsLoading(false);
    alert('Review deleted successfully!');
  };
  
  const handleReportReview = async (reviewId) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    alert('Review reported. Our team will review it shortly.');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#123458] mb-6">Reviews</h1>
      
      {/* Loading state example */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Loading Example</h2>
        <ReviewCard isLoading={true} />
      </div>
      
      {/* Reviews list */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium mb-3">Reviews List</h2>
        
        {reviews.map(review => (
          <ReviewCard
            key={review.id}
            review={review}
            isMine={review.reviewerName === 'Current User'}
            isLoading={isLoading}
            onEdit={handleEditReview}
            onDelete={review.reviewerName === 'Current User' ? handleDeleteReview : null}
            onReport={review.reviewerName !== 'Current User' ? handleReportReview : null}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewCardUsageExample;
