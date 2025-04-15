import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiPackage, FiInfo, FiMapPin } from 'react-icons/fi';
import PropTypes from 'prop-types';

const StatusBadge = ({ status }) => {
  // Determine badge style based on status
  const getBadgeStyle = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getBadgeStyle()}`}>
      {status}
    </span>
  );
};

// Skeleton loader component for loading state
const FoodCardSkeleton = () => {
  return (
    <div className="bg-[#F1EFEC] rounded-lg border border-[#D4C9BE] shadow-sm p-4 h-full">
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded mt-4"></div>
      </div>
    </div>
  );
};

const FoodCard = ({ food, isLoading, onClick }) => {
  if (isLoading) {
    return <FoodCardSkeleton />;
  }

  // Calculate days until expiration
  const getDaysUntilExpiration = () => {
    const today = new Date();
    const expirationDate = new Date(food.expiresAt);
    const diffTime = expirationDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format the expiration date
  const formatExpirationDate = () => {
    const date = new Date(food.expiresAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get urgency class based on days until expiration
  const getUrgencyClass = () => {
    const daysLeft = getDaysUntilExpiration();
    if (daysLeft <= 0) return 'text-red-600';
    if (daysLeft <= 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-[#F1EFEC] rounded-lg border border-[#D4C9BE] shadow-sm hover:shadow-md h-full flex flex-col"
    >
      {/* Food Image */}
      {food.imageUrl ? (
        <div className="h-40 w-full overflow-hidden rounded-t-lg">
          <img 
            src={food.imageUrl} 
            alt={food.type} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-40 w-full bg-[#D4C9BE] bg-opacity-30 rounded-t-lg flex items-center justify-center">
          <FiPackage size={40} className="text-[#123458] opacity-40" />
        </div>
      )}

      {/* Food Information */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-[#123458] line-clamp-1">{food.title}</h3>
          <StatusBadge status={food.status} />
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-auto">
          <div className="flex items-center">
            <FiPackage className="mr-2 text-[#123458]" />
            <span>{food.quantity} {food.unit || 'items'}</span>
          </div>
          
          <div className="flex items-center">
            <FiCalendar className="mr-2 text-[#123458]" />
            <span>Expires: <span className={getUrgencyClass()}>{formatExpirationDate()}</span></span>
          </div>
          
          {food.location && (
            <div className="flex items-center">
              <FiMapPin className="mr-2 text-[#123458]" />
              <span className="line-clamp-1">{food.location}</span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <Link 
          to={`/donations/${food.id}`}
          onClick={onClick}
          className="mt-4 flex items-center justify-center px-4 py-2 bg-[#123458] text-white rounded hover:bg-opacity-90 transition-colors"
        >
          <FiInfo className="mr-2" />
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

FoodCard.propTypes = {
  food: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string,
    quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    unit: PropTypes.string,
    expiresAt: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    location: PropTypes.string
  }),
  isLoading: PropTypes.bool,
  onClick: PropTypes.func
};

FoodCard.defaultProps = {
  isLoading: false,
  onClick: () => {}
};

export default FoodCard;
