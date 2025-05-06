import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  icon: Icon = FiAlertTriangle,
  confirmButtonStyle = 'danger', // 'danger', 'primary', 'success'
  size = 'md' // 'sm', 'md', 'lg'
}) => {
  const modalRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onCancel]);

  // Handle click outside of modal
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onCancel();
    }
  };

  // Focus trap within modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  // Determine button styles based on variant
  const getConfirmButtonStyle = () => {
    switch (confirmButtonStyle) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white';
      case 'primary':
        return 'bg-[#123458] hover:bg-[#0a2440] focus:ring-[#123458] text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white';
      default:
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white';
    }
  };

  // Modal size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className={`relative w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl overflow-hidden m-4`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Close button */}
            <button
              onClick={onCancel}
              className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>

            {/* Modal content */}
            <div className="p-6">
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-red-600" aria-hidden="true" />
                </div>

                {/* Title and message */}
                <div className="flex-1 pt-0.5">
                  <h3 id="modal-title" className="text-lg font-medium text-gray-900">
                    {title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                            rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 
                            focus:ring-offset-2 focus:ring-gray-300"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none 
                            focus:ring-2 focus:ring-offset-2 ${getConfirmButtonStyle()}`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  icon: PropTypes.elementType,
  confirmButtonStyle: PropTypes.oneOf(['danger', 'primary', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export default ConfirmationModal;
