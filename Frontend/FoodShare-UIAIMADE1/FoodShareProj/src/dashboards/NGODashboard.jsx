import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchAvailableDonations, getDonationStats } from '../services/donationService';
import ToastAlert from '../components/ToastAlert';
import DonationCard from '../components/DonationCard';
import { FiPlus, FiBarChart2, FiTrendingUp, FiPackage } from 'react-icons/fi';

const NGODashboard = ({ user }) => {
  const [stats, setStats] = useState({
    availableDonations: 0,
    pendingRequests: 0,
    completedTransfers: 0
  });
  const [availableDonations, setAvailableDonations] = useState([]);
  const [distributionActivity, setDistributionActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch stats for the NGO
        if (user?.id) {
          const statsData = await getDonationStats(user.id);
          console.log('NGO Stats Data:', statsData);
          
          setStats({
            availableDonations: statsData.availableDonationsCount || 0,
            pendingRequests: statsData.pendingRequestsCount || 0,
            completedTransfers: statsData.completedTransfersCount || 0
          });
        }

        // Fetch available donations
        const availableData = await fetchAvailableDonations({ limit: 5 });
        console.log('Available Donations Data:', availableData);
        setAvailableDonations(availableData.donations || []);

        // For distribution activity, we would ideally have a separate API call
        // For now, we'll use completed donations as a proxy for distribution activity
        setDistributionActivity(
          availableData.donations?.filter(d => d.status === 'Completed').slice(0, 3) || []
        );
      } catch (error) {
        console.error('Error fetching NGO dashboard data:', error);
        setToast({
          type: 'error',
          message: `Failed to load dashboard data: ${error.message}`
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1EFEC]">
        <main className="container mx-auto p-6 pt-20">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow h-24 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg shadow h-32"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-lg shadow h-64"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1EFEC]">
      <main className="container mx-auto p-6 pt-20">
        {/* Toast for error messages */}
        {toast && (
          <ToastAlert 
            type={toast.type} 
            message={toast.message} 
            onClose={() => setToast(null)}
          />
        )}
        
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#123458]">NGO Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.name || 'Partner NGO'}!</p>
            </div>
            <button className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors">
              Create Distribution Plan
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow p-5"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FiPackage className="text-[#123458] text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-[#123458]">Available Donations</h3>
                <p className="text-3xl font-bold">{stats.availableDonations}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg shadow p-5"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <FiBarChart2 className="text-[#123458] text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-[#123458]">Pending Requests</h3>
                <p className="text-3xl font-bold">{stats.pendingRequests}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow p-5"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <FiTrendingUp className="text-[#123458] text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-[#123458]">Completed Transfers</h3>
                <p className="text-3xl font-bold">{stats.completedTransfers}</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Donations Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-[#123458] mb-4">Available Donations</h2>
            <p className="text-gray-600 mb-4">Connect donors with beneficiaries by managing available donations.</p>
            
            {availableDonations.length > 0 ? (
              <div className="space-y-4 mt-4">
                {availableDonations.map(donation => (
                  <DonationCard 
                    key={donation.id}
                    donation={donation}
                    compact={true}
                  />
                ))}
                <div className="text-center mt-4">
                  <button 
                    onClick={() => window.location.href = '/browse'}
                    className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    View All Available Donations
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 text-center">
                <p>No available donations to manage right now.</p>
                <button 
                  onClick={() => window.location.href = '/browse'}
                  className="mt-3 px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                  View All Donation History
                </button>
              </div>
            )}
          </div>
          
          {/* Distribution Activity Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-[#123458] mb-4">Distribution Activity</h2>
            <p className="text-gray-600 mb-4">Track and manage food distribution to beneficiaries.</p>
            
            {distributionActivity.length > 0 ? (
              <div className="space-y-4 mt-4">
                {distributionActivity.map(activity => (
                  <div 
                    key={activity.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Completed
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Quantity: {activity.quantity} {activity.unit}</p>
                      <p>Beneficiary: {activity.beneficiary?.name || 'Anonymous'}</p>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <button 
                    onClick={() => window.location.href = '/distribution'}
                    className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    View All Distribution Activity
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 text-center">
                <p>No distribution activity recorded yet.</p>
                <button className="mt-3 px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors">
                  Create Distribution Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NGODashboard;
