import React from 'react';

const NGODashboard = ({ user }) => {
  return (
    <div className="min-h-screen bg-[#F1EFEC]">
      <header className="bg-[#123458] text-white py-4 px-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">NGO Dashboard</h1>
          <p>Welcome, {user?.name || 'Partner NGO'}!</p>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-medium text-[#123458]">Available Donations</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-medium text-[#123458]">Pending Requests</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-medium text-[#123458]">Completed Transfers</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-[#123458] mb-4">Available Donations</h2>
            <p className="text-gray-600">Connect donors with beneficiaries by managing available donations.</p>
            
            {/* Placeholder content */}
            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 text-center">
              <p>No available donations to manage right now.</p>
              <button className="mt-3 px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors">
                View All Donation History
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-[#123458] mb-4">Distribution Activity</h2>
            <p className="text-gray-600">Track and manage food distribution to beneficiaries.</p>
            
            {/* Placeholder content */}
            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 text-center">
              <p>No distribution activity recorded yet.</p>
              <button className="mt-3 px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors">
                Create Distribution Plan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NGODashboard;
