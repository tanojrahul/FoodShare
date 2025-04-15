import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const ToastAlert = ({ 
  type = 'info', 
  message, 
  onClose, 
  duration = 5000,
  position = 'bottom-right',
  showCloseButton = true
}) => {
  // Configure toast styling based on type
  const toastConfig = {
    success: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      icon: <FiCheck className="w-5 h-5" />
    },
    error: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      icon: <FiX className="w-5 h-5" />
    },
    warning: {
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200',
      icon: <FiAlertTriangle className="w-5 h-5" />
    },
    info: {
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
      icon: <FiInfo className="w-5 h-5" />
    }
  };

  const config = toastConfig[type] || toastConfig.info;

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  // Auto dismiss after duration
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Animation variants
  const variants = {
    initial: { 
      opacity: 0,
      y: position.includes('top') ? -20 : 20,
      scale: 0.9
    },
    animate: { 
      opacity: 1,
      y: 0,
      scale: 1
    },
    exit: { 
      opacity: 0,
      y: position.includes('top') ? -20 : 20,
      scale: 0.9
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.3 }}
        className={`fixed z-50 ${positionClasses[position]} max-w-md w-full sm:w-auto`}
      >
        <div className={`
          flex items-center justify-between
          px-4 py-3 rounded-lg shadow-lg
          ${config.bgColor} ${config.textColor} border ${config.borderColor}
        `}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {config.icon}
            </div>
            <div className="ml-3 mr-7">
              <p className="text-sm font-medium">{message}</p>
            </div>
          </div>
          
          {showCloseButton && (
            <button
              onClick={onClose}
              className={`ml-auto -mx-1.5 -my-1.5 ${config.bgColor} ${config.textColor} rounded-lg focus:ring-2 p-1.5 
                inline-flex h-8 w-8 hover:bg-opacity-75 focus:outline-none`}
            >
              <span className="sr-only">Close</span>
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

ToastAlert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
  position: PropTypes.oneOf([
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
    'top-center',
    'bottom-center'
  ]),
  showCloseButton: PropTypes.bool
};

ToastAlert.defaultProps = {
  type: 'info',
  duration: 5000,
  position: 'bottom-right',
  showCloseButton: true
};

export default ToastAlert;
