import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  progress, 
  target,
  unit,
  loading,
  progressType
}) => {
  // Calculate progress percentage
  const calculatePercentage = () => {
    if (!progress || !target || target === 0) return 0;
    const percentage = (progress / target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  const percentage = calculatePercentage();

  // Circle Progress component
  const CircleProgress = ({ percentage }) => (
    <div className="relative h-16 w-16">
      <svg className="h-full w-full" viewBox="0 0 36 36">
        {/* Background Circle */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-[#D4C9BE]"
          strokeWidth="2"
        />
        {/* Progress Circle */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-[#123458]"
          strokeWidth="2"
          strokeDasharray="100"
          strokeDashoffset={100 - percentage}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
        />
        {/* Percentage Text */}
        <text
          x="18"
          y="18"
          dy=".3em"
          textAnchor="middle"
          className="fill-[#123458] text-xs font-medium"
        >
          {`${Math.round(percentage)}%`}
        </text>
      </svg>
    </div>
  );

  // Bar Progress component
  const BarProgress = ({ percentage }) => (
    <div className="w-full h-2 bg-[#D4C9BE] rounded-full overflow-hidden">
      <div 
        className="h-full bg-[#123458] rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );

  // Skeleton loader
  if (loading) {
    return (
      <div className="bg-[#F1EFEC] p-6 rounded-lg border border-[#D4C9BE] shadow-sm h-full animate-pulse">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="h-12 w-12 rounded-full bg-gray-200"></div>
        </div>
        <div className="mt-6 h-2 w-full bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="bg-[#F1EFEC] p-6 rounded-lg border border-[#D4C9BE] shadow-sm hover:shadow-md h-full"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-bold text-[#123458]">{value}</p>
            {unit && <p className="ml-1 text-sm text-gray-500">{unit}</p>}
          </div>
        </div>
        {icon && (
          <div className="bg-[#D4C9BE]/20 p-3 rounded-full">
            {icon}
          </div>
        )}
      </div>

      {/* Progress indicator */}
      {(progress !== undefined && target !== undefined) && (
        <div className="mt-4">
          {progressType === 'circle' ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Progress</p>
                <p className="text-sm font-medium text-[#123458]">{progress} / {target}</p>
              </div>
              <CircleProgress percentage={percentage} />
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs text-gray-500">Progress</p>
                <p className="text-xs font-medium text-[#123458]">{Math.round(percentage)}%</p>
              </div>
              <BarProgress percentage={percentage} />
              <p className="mt-1 text-xs text-gray-500 text-right">{progress} / {target}</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.element,
  progress: PropTypes.number,
  target: PropTypes.number,
  unit: PropTypes.string,
  loading: PropTypes.bool,
  progressType: PropTypes.oneOf(['bar', 'circle'])
};

StatCard.defaultProps = {
  loading: false,
  progressType: 'bar'
};

export default StatCard;
