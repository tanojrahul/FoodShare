import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHeart } from 'react-icons/fi';
import FoodListingForm from '../components/FoodListingForm';
import authService from '../services/authService';
import DonorLayout from '../layouts/DonorLayout';

const CreateDonationPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Get current user on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    // Redirect if user is not logged in or not a donor
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role !== 'donor') {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  return (
    <DonorLayout>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#123458]">Create Donation</h1>
            <p className="mt-2 text-gray-600">
              Share your surplus food with those in need and reduce food waste
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center text-[#123458] hover:text-[#1a4979] font-medium"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft className="mr-2" />
            Back
          </motion.button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form column */}
        <div className="lg:col-span-2">
          <FoodListingForm />
        </div>
        
        {/* Info column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 sticky top-8">
            <div className="flex items-center mb-4 text-[#123458]">
              <FiHeart className="h-6 w-6 mr-2 text-red-500" />
              <h3 className="text-xl font-bold">Why Donate?</h3>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold">Reduce Food Waste</h4>
                <p className="text-sm">Each year, tons of food goes to waste while many go hungry. Your donation helps solve this problem.</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Help Your Community</h4>
                <p className="text-sm">Your donation directly helps individuals, families, and organizations in your local area.</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Environmental Impact</h4>
                <p className="text-sm">Reducing food waste helps minimize greenhouse gas emissions from landfills.</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Tax Benefits</h4>
                <p className="text-sm">Many food donations qualify for tax deductions. Save your donation receipts for tax season.</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-[#123458]">Donation Guidelines</h4>
              <ul className="mt-2 text-sm text-gray-700 space-y-2">
                <li>• Ensure all food is safe to consume and not expired</li>
                <li>• Perishable items should be properly stored before pickup</li>
                <li>• Non-perishable items are easiest to donate</li>
                <li>• Include allergen information when possible</li>
                <li>• Provide accurate pickup address and instructions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DonorLayout>
  );
};

export default CreateDonationPage;