import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiExternalLink, FiCheck, FiPlus } from 'react-icons/fi';

// Import components
import StatCard from '../components/StatCard';
import DonationCard from '../components/DonationCard';
import UserProfileCard from '../components/UserProfileCard';
import ReviewCard from '../components/ReviewCard';
import ToastAlert from '../components/ToastAlert';
import StatusBadge from '../components/StatusBadge';
import BeneficiaryLayout from '../layouts/BeneficiaryLayout';

// Import services
import { fetchBeneficiaryData, fetchClaimedDonations, getBeneficiaryRequests } from '../services/donationService';
import { getUserNotifications } from '../services/notificationService';
import authService from '../services/authService';

const BeneficiaryDashboard = () => {
  // State for dashboard data
  const [stats, setStats] = useState({
    foodClaimed: 0,
    requestsPending: 0,
    totalMealsReceived: 0,
    impactPoints: 0
  });
  
  const [claimedDonations, setClaimedDonations] = useState([]);
  const [upcomingDeliveries, setUpcomingDeliveries] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        
        if (!currentUser) {
          throw new Error('You must be logged in to view your dashboard');
        }
        
        if (!['beneficiary', 'ngo'].includes(currentUser.role.toLowerCase())) {
          throw new Error('This dashboard is only available for beneficiaries');
        }

        // Fetch data in parallel for better performance
        const [beneficiaryDataResponse, claimedDonationsResponse, notificationsResponse] = await Promise.all([
          fetchBeneficiaryData(currentUser.id),
          fetchClaimedDonations(currentUser.id),
          getUserNotifications(currentUser.id)
        ]);
        
        // Handle beneficiary stats
        if (beneficiaryDataResponse && beneficiaryDataResponse.stats) {
          setStats(beneficiaryDataResponse.stats);
        } else {
          console.log('Unexpected API response format for beneficiary data:', beneficiaryDataResponse);
          // Use default stats
        }
        
        // Handle claimed donations
        if (claimedDonationsResponse && claimedDonationsResponse.donations) {
          setClaimedDonations(claimedDonationsResponse.donations);
          
          // Filter for upcoming deliveries (items in transit)
          const deliveries = claimedDonationsResponse.donations.filter(d => 
            d.status === 'In Transit' || d.status === 'Ready for Pickup'
          );
          setUpcomingDeliveries(deliveries);
        } else {
          console.log('Unexpected API response format for claimed donations:', claimedDonationsResponse);
          // Keep default empty arrays
        }
        
        // Handle notifications
        if (notificationsResponse && notificationsResponse.notifications) {
          setNotifications(notificationsResponse.notifications);
          
          // Show notification toast if there are unread notifications
          const unreadNotifications = notificationsResponse.notifications.filter(n => !n.read);
          if (unreadNotifications.length > 0) {
            setToastMessage(`You have ${unreadNotifications.length} new notification${unreadNotifications.length > 1 ? 's' : ''}`);
            setToastType('info');
            setShowToast(true);
            
            // Auto-hide toast after 5 seconds
            setTimeout(() => {
              setShowToast(false);
            }, 5000);
          }
        } else {
          console.log('Unexpected API response format for notifications:', notificationsResponse);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError(error.message);
        setToastMessage('Failed to load dashboard data: ' + error.message);
        setToastType('error');
        setShowToast(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  // Handle donation status update
  const handleStatusUpdate = async (donationId, newStatus) => {
    try {
      // In a real implementation, you would call an API here to update the status
      // For example: await updateDonationStatus(donationId, newStatus);
      
      // Update local state
      setClaimedDonations(prevDonations => 
        prevDonations.map(donation => 
          donation.id === donationId ? { ...donation, status: newStatus } : donation
        )
      );
      
      // Update upcoming deliveries if status changed to Completed
      if (newStatus === 'Completed') {
        setUpcomingDeliveries(prev => prev.filter(d => d.id !== donationId));
      }
      
      // Show toast notification
      setToastMessage(`Donation status updated to ${newStatus}`);
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error updating donation status:', error);
      setToastMessage('Failed to update donation status');
      setToastType('error');
      setShowToast(true);
    }
  };
  
  // Handle confirm delivery
  const handleConfirmDelivery = (donationId) => {
    handleStatusUpdate(donationId, 'Completed');
  };

  return (
    <BeneficiaryLayout>
      {/* Toast Notification */}
      {showToast && (
        <ToastAlert
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#123458]">Beneficiary Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name || 'Beneficiary'}!</p>
          </div>
          <Link 
            to="/browse-food"
            className="mt-3 sm:mt-0 px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center"
          >
            <FiPlus className="mr-2" /> Browse Donations
          </Link>
        </div>
      </div>
    
      {/* Stats Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Food Claimed"
          value={stats.foodClaimed}
          icon="package"
          trend="up"
          trendValue="15%"
        />
        <StatCard 
          title="Requests Pending"
          value={stats.requestsPending}
          icon="clock"
          color="yellow"
        />
        <StatCard 
          title="Meals Received"
          value={stats.totalMealsReceived}
          icon="users"
          color="green"
        />
        <StatCard 
          title="Impact Points"
          value={stats.impactPoints}
          icon="award"
          trend="up"
          trendValue="5%"
        />
      </div>
      
      {/* Available Donations Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#123458]">Available Donations</h2>
          <Link 
            to="/browse-food"
            className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center"
          >
            <FiPlus className="mr-2" /> Browse More
          </Link>
        </div>
        <p className="text-gray-600">Browse available food donations in your area.</p>
        
        {isLoading ? (
          <div className="mt-4 p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#123458]"></div>
          </div>
        ) : upcomingDeliveries.length === 0 && claimedDonations.length === 0 ? (
          <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 text-center">
            <p>No available donations in your area right now.</p>
            <Link 
              to="/notification-preferences"
              className="mt-3 inline-block px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              Set Notification Preferences
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {claimedDonations.slice(0, 2).map(donation => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onActionClick={() => {
                  if (donation.status === 'In Transit') {
                    handleConfirmDelivery(donation.id);
                  }
                }}
                actionLabel={donation.status === 'In Transit' ? 'Confirm Receipt' : 'View Details'}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Two-column layout for requests and deliveries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Requests Column */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-[#123458] mb-4">My Request History</h2>
          
          {isLoading ? (
            <div className="p-4 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#123458]"></div>
            </div>
          ) : claimedDonations.length === 0 ? (
            <p className="text-gray-600">You haven't made any requests yet.</p>
          ) : (
            <div className="space-y-4">
              {claimedDonations.map(donation => (
                <div key={donation.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{donation.title}</h3>
                      <p className="text-sm text-gray-600">From: {donation.donorName}</p>
                    </div>
                    <StatusBadge status={donation.status} />
                  </div>
                  <div className="flex items-center text-sm mt-2 text-gray-600">
                    <FiClock className="mr-1" /> Requested on {new Date().toLocaleDateString()}
                  </div>
                  <div className="mt-3">
                    <Link 
                      to={`/donations/${donation.id}`}
                      className="text-[#123458] text-sm font-medium flex items-center"
                    >
                      View Details <FiExternalLink className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Upcoming Deliveries Column */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-[#123458] mb-4">Upcoming Deliveries</h2>
          
          {isLoading ? (
            <div className="p-4 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#123458]"></div>
            </div>
          ) : upcomingDeliveries.length === 0 ? (
            <p className="text-gray-600">No scheduled deliveries at this time.</p>
          ) : (
            <div className="space-y-4">
              {upcomingDeliveries.map(delivery => (
                <div key={delivery.id} className="p-4 border border-blue-100 rounded-lg bg-blue-50">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{delivery.title}</h3>
                    <StatusBadge status={delivery.status} />
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm">
                      <span className="font-medium">Estimated delivery:</span> {' '}
                      {delivery.estimatedDelivery ? new Date(delivery.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                    </p>
                    
                    <div className="flex items-center text-sm mt-1 text-gray-600">
                      <FiMapPin className="mr-1" /> {delivery.location}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex space-x-3">
                    <Link 
                      to={`/track/${delivery.id}`}
                      className="px-3 py-1.5 bg-[#123458] text-white text-sm rounded-md hover:bg-opacity-90 transition-colors flex items-center"
                    >
                      Track Delivery
                    </Link>
                    <button
                      onClick={() => handleConfirmDelivery(delivery.id)}
                      className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-opacity-90 transition-colors flex items-center"
                    >
                      <FiCheck className="mr-1" /> Confirm Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Profile and Reviews Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <UserProfileCard 
            user={{
              name: user?.name || 'Beneficiary User',
              role: 'Beneficiary',
              joinedDate: '2025-01-15',
              impactPoints: stats.impactPoints,
              avatar: user?.avatar || null
            }}
            showEditButton={true}
          />
        </div>
        
        {/* Reviews Section */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-[#123458] mb-4">My Reviews</h2>
          
          {isLoading ? (
            <div className="p-4 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#123458]"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">Reviews you've written for donors:</p>
              
              <ReviewCard 
                review={{
                  id: 'rev1',
                  author: user?.name || 'You',
                  recipient: 'Green Grocers',
                  rating: 5,
                  comment: 'The vegetables were very fresh and the pickup process was smooth. Thank you!',
                  date: '2025-04-10'
                }}
              />
              
              <div className="mt-4 text-center">
                <Link 
                  to="/my-reviews"
                  className="text-[#123458] font-medium hover:underline"
                >
                  View All Reviews
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </BeneficiaryLayout>
  );
};

export default BeneficiaryDashboard;
