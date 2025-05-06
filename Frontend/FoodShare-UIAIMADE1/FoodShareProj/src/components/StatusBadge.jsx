import React from 'react';
import PropTypes from 'prop-types';
import { 
  FiClock,      // Pending
  FiCheckCircle, // Accepted
  FiTruck,      // In Transit
  FiPackage,    // Delivered
  FiFlag,       // Completed
  FiXCircle     // Cancelled
} from 'react-icons/fi';

const StatusBadge = ({ status, size = 'medium' }) => {
  // Default to pending if status is not provided
  const normalizedStatus = (status || 'pending').toLowerCase();

  // Configuration for different statuses
  const statusConfig = {
    pending: {
      icon: <FiClock />,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200',
      label: 'Pending'
    },
    accepted: {
      icon: <FiCheckCircle />,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
      label: 'Accepted'
    },
    'in transit': {
      icon: <FiTruck />,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-200',
      label: 'In Transit'
    },
    delivered: {
      icon: <FiPackage />,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      label: 'Delivered'
    },
    completed: {
      icon: <FiFlag />,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
      label: 'Completed'
    },
    cancelled: {
      icon: <FiXCircle />,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      label: 'Cancelled'
    }
  };

  // Get configuration for current status or use default
  const config = statusConfig[normalizedStatus] || statusConfig.pending;

  // Size variants
  const sizeClasses = {
    small: 'text-xs px-2 py-0.5',
    medium: 'text-sm px-3 py-1',
    large: 'text-base px-4 py-1.5'
  };

  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 
        ${config.bgColor} ${config.textColor} 
        border ${config.borderColor} 
        font-semibold rounded-full
        ${sizeClasses[size]}
      `}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf([
    'pending',
    'Pending',
    'accepted',
    'Accepted',
    'in transit',
    'In Transit',
    'delivered',
    'Delivered',
    'completed',
    'Completed',
    'cancelled',
    'Cancelled'
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

StatusBadge.defaultProps = {
  status: 'pending',
  size: 'medium'
};

export default StatusBadge;
