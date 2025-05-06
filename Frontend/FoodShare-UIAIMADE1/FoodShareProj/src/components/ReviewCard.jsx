import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { FiStar, FiEdit, FiTrash2, FiFlag, FiCheckCircle, FiClock, FiAlertTriangle, FiShield } from 'react-icons/fi';

// Star rating component - can be interactive or display-only
const StarRating = ({ rating, maxRating = 5, isEditable = false, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleClick = (selectedRating) => {
    if (isEditable && onChange) {
      onChange(selectedRating);
    }
  };
  
  const handleMouseEnter = (hoveredRating) => {
    if (isEditable) {
      setHoverRating(hoveredRating);
    }
  };
  
  const handleMouseLeave = () => {
    if (isEditable) {
      setHoverRating(0);
    }
  };
  
  return (
    <div className="flex">
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        const filled = (hoverRating || rating) >= starValue;
        
        return (
          <span
            key={i}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            className={`text-xl ${isEditable ? 'cursor-pointer' : ''} ${
              filled ? 'text-[#D4C9BE] fill-current' : 'text-gray-300'
            }`}
          >
            <FiStar className={filled ? 'fill-[#D4C9BE] stroke-[#D4C9BE]' : ''} />
          </span>
        );
      })}
    </div>
  );
};

// Skeleton loading state for when data is being fetched
const ReviewCardSkeleton = () => (
  <div className="bg-[#F1EFEC] p-5 rounded-lg animate-pulse">
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-2/4"></div>
      </div>
    </div>
    <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
    <div className="flex justify-between items-center mt-4">
      <div className="h-5 bg-gray-300 rounded w-1/4"></div>
      <div className="h-8 bg-gray-300 rounded w-16"></div>
    </div>
  </div>
);

// Main ReviewCard component
const ReviewCard = ({ 
  review, 
  isLoading = false, 
  isMine = false,
  showModeration = false,
  onEdit,
  onDelete,
  onReport,
  onModerate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState({
    rating: review?.rating || 0,
    comment: review?.comment || ''
  });
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [moderationNotes, setModerationNotes] = useState('');
  const [showModerationForm, setShowModerationForm] = useState(false);
  
  if (isLoading) {
    return <ReviewCardSkeleton />;
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get the user's initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Get status badge styling
  const getStatusBadge = () => {
    if (!review.status) return null;
    
    const statusStyles = {
      approved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <FiCheckCircle className="mr-1" />
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <FiClock className="mr-1" />
      },
      flagged: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <FiAlertTriangle className="mr-1" />
      }
    };
    
    const style = statusStyles[review.status.toLowerCase()] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      icon: null
    };
    
    return (
      <span className={`text-xs ${style.bg} ${style.text} px-2 py-1 rounded-full flex items-center`}>
        {style.icon}
        {review.status}
      </span>
    );
  };

  // Handle edit form submission
  const handleSubmit = async () => {
    if (!editedReview.comment.trim()) {
      return;
    }
    
    setIsActionLoading(true);
    try {
      // Call the edit callback with updated review data
      await onEdit({
        ...review,
        rating: editedReview.rating,
        comment: editedReview.comment
      });
      
      // Exit edit mode after successful update
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update review:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setIsActionLoading(true);
      try {
        await onDelete(review.id);
      } catch (error) {
        console.error("Failed to delete review:", error);
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  // Handle report review
  const handleReport = async () => {
    if (window.confirm("Report this review as inappropriate?")) {
      setIsActionLoading(true);
      try {
        await onReport(review.id);
      } catch (error) {
        console.error("Failed to report review:", error);
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  // Handle moderation action
  const handleModeration = async (action) => {
    setIsActionLoading(true);
    try {
      await onModerate(review.id, action, moderationNotes);
      setShowModerationForm(false);
      setModerationNotes('');
    } catch (error) {
      console.error("Failed to moderate review:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#F1EFEC] p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow relative"
    >
      {/* Admin Badge if moderation is enabled */}
      {showModeration && (
        <div className="absolute right-2 top-2">
          <span className="bg-[#123458] text-white text-xs px-2 py-1 rounded flex items-center">
            <FiShield className="mr-1" /> Admin View
          </span>
        </div>
      )}

      {/* Reviewer info and rating */}
      <div className="flex items-center mb-3">
        {/* Reviewer avatar */}
        {review.reviewerImage ? (
          <img
            src={review.reviewerImage}
            alt={review.reviewerName}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#123458] text-white flex items-center justify-center font-medium mr-3">
            {getInitials(review.author || review.reviewerName)}
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-[#030303]">{review.author || review.reviewerName}</h3>
              <p className="text-xs text-gray-500">
                {review.reviewerRole || 'User'} 
                {review.recipient && <span> • Review for <span className="font-medium">{review.recipient}</span></span>}
              </p>
            </div>
            {getStatusBadge()}
          </div>
        </div>
      </div>

      {/* Review content - either display or edit mode */}
      {isEditing ? (
        <div className="mb-4">
          <StarRating 
            rating={editedReview.rating} 
            isEditable={true}
            onChange={(newRating) => setEditedReview({ ...editedReview, rating: newRating })}
          />
          <textarea
            value={editedReview.comment}
            onChange={(e) => setEditedReview({ ...editedReview, comment: e.target.value })}
            className="mt-2 w-full p-2 border border-gray-300 rounded focus:ring-[#123458] focus:border-[#123458]"
            rows={3}
            placeholder="Write your review here..."
          />
        </div>
      ) : (
        <>
          <div className="mb-1">
            <StarRating rating={review.rating} />
          </div>
          <p className="text-[#030303] my-3">{review.comment}</p>
        </>
      )}

      {/* Review metadata and actions */}
      <div className="flex flex-wrap justify-between items-center mt-4 pt-2 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          {review.date && formatDate(review.date)}
        </div>
        
        <div className="flex space-x-2">
          {/* Edit/Save actions (only show if it's the user's review) */}
          {isMine && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              disabled={isActionLoading}
              className="text-sm text-[#123458] hover:text-[#0a1c2e] flex items-center"
              aria-label="Edit review"
            >
              <FiEdit className="mr-1" /> Edit
            </button>
          )}
          
          {isMine && isEditing && (
            <>
              <button
                onClick={handleSubmit}
                disabled={isActionLoading}
                className="text-sm bg-[#123458] text-white px-3 py-1 rounded hover:bg-opacity-90"
              >
                {isActionLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={isActionLoading}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1"
              >
                Cancel
              </button>
            </>
          )}
          
          {/* Delete action (only show if it's the user's review) */}
          {isMine && !isEditing && onDelete && (
            <button
              onClick={handleDelete}
              disabled={isActionLoading}
              className="text-sm text-red-600 hover:text-red-800 flex items-center"
              aria-label="Delete review"
            >
              <FiTrash2 className="mr-1" /> Delete
            </button>
          )}
          
          {/* Report action (only show for other users' reviews) */}
          {!isMine && onReport && !isEditing && !showModeration && (
            <button
              onClick={handleReport}
              disabled={isActionLoading}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              aria-label="Report review"
            >
              <FiFlag className="mr-1" /> Report
            </button>
          )}
          
          {/* Admin moderation actions */}
          {showModeration && onModerate && !showModerationForm && (
            <div className="flex space-x-2">
              <button
                onClick={() => setShowModerationForm(true)}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                <FiFlag className="mr-1 inline" /> Moderate
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Show donation info if available */}
      {review.donationTitle && (
        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
          Review for: <span className="font-medium">{review.donationTitle}</span>
        </div>
      )}
      
      {/* Admin moderation form */}
      {showModerationForm && (
        <div className="mt-4 pt-3 border-t">
          <h4 className="text-sm font-medium text-[#123458] mb-2">Moderation Actions</h4>
          <textarea
            value={moderationNotes}
            onChange={(e) => setModerationNotes(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-[#123458] focus:border-[#123458] mb-3"
            rows={2}
            placeholder="Optional moderation notes..."
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => handleModeration('remove')}
              disabled={isActionLoading}
              className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              {isActionLoading ? 'Processing...' : 'Remove Review'}
            </button>
            <button
              onClick={() => handleModeration('flag')}
              disabled={isActionLoading}
              className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Flag
            </button>
            <button
              onClick={() => handleModeration('approve')}
              disabled={isActionLoading}
              className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => setShowModerationForm(false)}
              disabled={isActionLoading}
              className="text-sm text-gray-600 px-3 py-1 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

ReviewCard.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    reviewerName: PropTypes.string,
    author: PropTypes.string,
    recipient: PropTypes.string,
    reviewerImage: PropTypes.string,
    reviewerRole: PropTypes.string,
    status: PropTypes.string,
    donationTitle: PropTypes.string
  }),
  isLoading: PropTypes.bool,
  isMine: PropTypes.bool,
  showModeration: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onReport: PropTypes.func,
  onModerate: PropTypes.func
};

ReviewCard.defaultProps = {
  isLoading: false,
  isMine: false,
  showModeration: false,
  onEdit: () => {},
  onDelete: null,
  onReport: null,
  onModerate: null
};

export default ReviewCard;
