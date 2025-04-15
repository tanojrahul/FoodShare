import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

// Toast Alert Component
const ToastAlert = ({ message, type, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      } text-white z-50`}
    >
      <FiAlertCircle className="mr-2" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white">
        &times;
      </button>
    </motion.div>
  );
};

const FoodListingForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    quantity: '',
    category: '',
    expiresAt: '',
    pickupLocation: '',
    description: ''
  });

  // Form status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  // Food categories
  const categories = [
    'Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Grains',
    'Beverages', 'Canned Goods', 'Snacks', 'Prepared Meals',
    'Condiments', 'Non-Veg', 'Other'
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0]; // Today in YYYY-MM-DD format

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Food title is required';
    }

    // Quantity validation
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    // Expiration date validation
    if (!formData.expiresAt) {
      newErrors.expiresAt = 'Expiration date is required';
    } else if (formData.expiresAt < today) {
      newErrors.expiresAt = 'Expiration date must be in the future';
    }

    // Pickup location validation
    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required';
    }

    // Description validation (optional but with min length if provided)
    if (formData.description && formData.description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - replace with actual API endpoint
      const response = await fetch('/api/donations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: formData.title,
          quantity: parseInt(formData.quantity),
          category: formData.category,
          expiresAt: formData.expiresAt,
          pickupLocation: formData.pickupLocation,
          description: formData.description
        })
      });

      // For demo purposes, simulate successful response
      // In production, check response.ok and parse actual response
      if (response.ok) {
        // Show success message
        setToast({
          type: 'success',
          message: 'Food listing created successfully!'
        });

        // Reset form
        setFormData({
          title: '',
          quantity: '',
          category: '',
          expiresAt: '',
          pickupLocation: '',
          description: ''
        });
      } else {
        // Handle API error
        const error = await response.json();
        throw new Error(error.message || 'Failed to create food listing');
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: error.message || 'An error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {toast && (
        <ToastAlert
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold text-[#123458] mb-6">Donate Surplus Food</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Food Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Food Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none 
                ${errors.title 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:ring-[#D4C9BE] focus:border-[#123458]'
                }`}
              placeholder="e.g., Fresh Vegetables, Bread Loaves"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Food Quantity and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity* (units/servings)
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none 
                  ${errors.quantity 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-[#D4C9BE] focus:border-[#123458]'
                  }`}
                placeholder="e.g., 5"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none 
                  ${errors.category 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-[#D4C9BE] focus:border-[#123458]'
                  }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Expiration Date and Pickup Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date*
              </label>
              <input
                type="date"
                id="expiresAt"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none 
                  ${errors.expiresAt 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-[#D4C9BE] focus:border-[#123458]'
                  }`}
              />
              {errors.expiresAt && (
                <p className="mt-1 text-sm text-red-500">{errors.expiresAt}</p>
              )}
            </div>

            <div>
              <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location*
              </label>
              <input
                type="text"
                id="pickupLocation"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none 
                  ${errors.pickupLocation 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-[#D4C9BE] focus:border-[#123458]'
                  }`}
                placeholder="e.g., 123 Main Street, City"
              />
              {errors.pickupLocation && (
                <p className="mt-1 text-sm text-red-500">{errors.pickupLocation}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none 
                ${errors.description 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:ring-[#D4C9BE] focus:border-[#123458]'
                }`}
              placeholder="Add any additional details about the food items..."
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-[#123458] hover:bg-opacity-90 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4C9BE]"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                'Submit Food Listing'
              )}
            </motion.button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-6">
          * Required fields. By submitting this form, you agree to our Terms and Conditions.
        </p>
      </motion.div>
    </div>
  );
};

export default FoodListingForm;
