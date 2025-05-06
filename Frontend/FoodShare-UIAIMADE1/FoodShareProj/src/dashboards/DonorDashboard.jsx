import React, { useState } from 'react';
import FoodListingForm from '../components/FoodListingForm';
import DonorLayout from '../layouts/DonorLayout';

const DonorDashboard = ({ user }) => {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <DonorLayout>
      {/* Welcome message integrated into the first content box */}
      {!showForm ? (
        <>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-[#123458]">Donor Dashboard</h1>
                <p className="text-gray-600">Welcome, {user?.name || 'Donor'}!</p>
              </div>
              <button 
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Donate Food
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#123458]">My Donation Activity</h2>
            <p className="text-gray-600 mt-4">Your recent donations will appear here.</p>
            
            {/* Placeholder content */}
            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 text-center">
              <p>You haven't made any donations yet.</p>
            </div>
          </div>
          
          {/* Rest of dashboard content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-[#123458] mb-4">Impact Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-[#F1EFEC] rounded-lg">
                  <p className="text-sm text-gray-600">Total Donations</p>
                  <p className="text-2xl font-bold text-[#123458]">0</p>
                </div>
                <div className="text-center p-3 bg-[#F1EFEC] rounded-lg">
                  <p className="text-sm text-gray-600">People Helped</p>
                  <p className="text-2xl font-bold text-[#123458]">0</p>
                </div>
                <div className="text-center p-3 bg-[#F1EFEC] rounded-lg">
                  <p className="text-sm text-gray-600">Food Saved (kg)</p>
                  <p className="text-2xl font-bold text-[#123458]">0</p>
                </div>
                <div className="text-center p-3 bg-[#F1EFEC] rounded-lg">
                  <p className="text-sm text-gray-600">CO₂ Reduced</p>
                  <p className="text-2xl font-bold text-[#123458]">0 kg</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-[#123458] mb-4">Upcoming Pickups</h2>
              <p className="text-gray-600">No scheduled pickups at this time.</p>
            </div>
          </div>
        </>
      ) : (
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => setShowForm(false)}
              className="mr-4 text-[#123458] hover:underline"
            >
              ← Back to Dashboard
            </button>
            <h2 className="text-xl font-semibold text-[#123458]">Create New Donation</h2>
          </div>
          <FoodListingForm />
        </div>
      )}
    </DonorLayout>
  );
};

export default DonorDashboard;
