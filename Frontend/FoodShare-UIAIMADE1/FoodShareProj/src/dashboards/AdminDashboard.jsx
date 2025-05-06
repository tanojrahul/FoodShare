import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiUsers, FiPackage, FiCheckCircle, FiBell, FiFilter, 
  FiMap, FiSettings, FiFileText, FiBarChart2, FiActivity, FiSearch
} from 'react-icons/fi';

// Import components
import StatCard from '../components/StatCard';
import DonationCard from '../components/DonationCard';
import UserProfileCard from '../components/UserProfileCard';
import ReviewCard from '../components/ReviewCard';
import ToastAlert from '../components/ToastAlert';
import ConfirmationModal from '../components/ConfirmationModal';

// Import services
import { getDonationStats, updateDonationStatus } from '../services/donationService';
import { getUserStats, updateUserStatus } from '../services/userService';
import { getSystemNotifications, sendSystemNotification } from '../services/notificationService';

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    onConfirm: () => {},
    isDanger: false
  });
  
  // Dashboard data state
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalBeneficiaries: 0,
    totalNGOs: 0,
    totalDonations: 0,
    activeDonations: 0,
    completedTransfers: 0,
    systemAlerts: 0,
    foodSaved: 0,
    pendingApprovals: 0
  });
  
  const [recentDonations, setRecentDonations] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [userList, setUserList] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Fetch dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch donation statistics from the API
        const donationStatsData = await getDonationStats();
        console.log('Donation stats data:', donationStatsData);
        
        // Fetch user statistics from the API
        const userStatsData = await getUserStats();
        console.log('User stats data:', userStatsData);
        
        // Fetch system notifications from the API
        const notificationsData = await getSystemNotifications();
        console.log('Notifications data:', notificationsData);
        
        // Create combined stats object from API responses
        const combinedStats = {
          totalUsers: userStatsData?.totalUsers || 0,
          totalDonors: userStatsData?.donors || 0,
          totalBeneficiaries: userStatsData?.beneficiaries || 0,
          totalNGOs: userStatsData?.ngos || 0,
          totalDonations: donationStatsData?.total || 0,
          activeDonations: donationStatsData?.active || 0,
          completedTransfers: donationStatsData?.completed || 0,
          systemAlerts: notificationsData?.filter(n => n.type === 'alert' && !n.read)?.length || 0,
          foodSaved: donationStatsData?.foodSaved || 0, // in kg
          pendingApprovals: donationStatsData?.pendingApproval || 0
        };
        
        // If we have actual data from APIs, use it
        if (donationStatsData && userStatsData) {
          setStats(combinedStats);
          setPendingApprovals(donationStatsData.pendingDonations || []);
          setRecentDonations(donationStatsData.recentDonations || []);
          setUserList(userStatsData.recentUsers || []);
          setRecentReviews(donationStatsData.recentReviews || []);
          setNotifications(notificationsData || []);
        } else {
          // If APIs don't return the expected data, fall back to mock data
          console.warn('API data incomplete, using mock data instead');
          
          // Mock data for demonstration
          const mockStats = {
            totalUsers: 248,
            totalDonors: 112,
            totalBeneficiaries: 96,
            totalNGOs: 40,
            totalDonations: 437,
            activeDonations: 53,
            completedTransfers: 384,
            systemAlerts: 2,
            foodSaved: 2750, // in kg
            pendingApprovals: 8
          };
          
          // Simulate donations that need approval
          const mockPendingApprovals = [
            {
              id: 'don001',
              title: 'Fresh Vegetables Bundle',
              donorName: 'Green Grocers',
              donorId: 'usr112',
              quantity: '15 kg',
              status: 'Pending Approval',
              category: 'Vegetables',
              expiresAt: new Date(Date.now() + 3*24*60*60*1000).toISOString(),
              createdAt: new Date(Date.now() - 2*60*60*1000).toISOString(),
              location: '123 Market St, Local City'
            },
            {
              id: 'don002',
              title: 'Bakery Items - Assorted',
              donorName: 'Daily Bread',
              donorId: 'usr098',
              quantity: '24 items',
              status: 'Pending Approval',
              category: 'Bakery',
              expiresAt: new Date(Date.now() + 2*24*60*60*1000).toISOString(),
              createdAt: new Date(Date.now() - 5*60*60*1000).toISOString(),
              location: '456 Baker Ave, Local City'
            },
            {
              id: 'don003',
              title: 'Canned Food Collection',
              donorName: 'Community Pantry',
              donorId: 'usr134',
              quantity: '12 cans',
              status: 'Pending Approval',
              category: 'Canned Goods',
              expiresAt: new Date(Date.now() + 90*24*60*60*1000).toISOString(),
              createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
              location: '789 Storage Rd, Local City'
            }
          ];
          
          // Simulate recent donations (a mix of different statuses)
          const mockRecentDonations = [
            {
              id: 'don025',
              title: 'Rice and Pasta Pack',
              donorName: 'Food Bank',
              quantity: '20 kg',
              status: 'In Transit',
              category: 'Grains',
              expiresAt: new Date(Date.now() + 60*24*60*60*1000).toISOString(),
              createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
            },
            {
              id: 'don024',
              title: 'Milk and Dairy Products',
              donorName: 'Fresh Farms',
              quantity: '15 items',
              status: 'Approved',
              category: 'Dairy',
              expiresAt: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
              createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
            },
            {
              id: 'don023',
              title: 'Mixed Fruit Basket',
              donorName: 'Fruit Orchard',
              quantity: '10 kg',
              status: 'Completed',
              category: 'Fruits',
              expiresAt: new Date(Date.now() + 5*24*60*60*1000).toISOString(),
              createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
              completedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
            }
          ];
          
          // Simulate recent user signups
          const mockUsers = [
            {
              id: 'usr201',
              name: 'Jane Cooper',
              role: 'Donor',
              joinedDate: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
              status: 'Active',
              location: 'Local City',
              donationsCount: 3,
              avatar: null
            },
            {
              id: 'usr202',
              name: 'Food For All NGO',
              role: 'NGO',
              joinedDate: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
              status: 'Pending Verification',
              location: 'Local City',
              claimedDonations: 0,
              avatar: null
            },
            {
              id: 'usr203',
              name: 'Robert Johnson',
              role: 'Beneficiary',
              joinedDate: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
              status: 'Active',
              location: 'Local City',
              claimedDonations: 2,
              avatar: null
            }
          ];
          
          // Simulate recent reviews
          const mockReviews = [
            {
              id: 'rev101',
              author: 'Robert Johnson',
              authorId: 'usr203',
              recipient: 'Fruit Orchard',
              recipientId: 'usr187',
              rating: 5,
              comment: 'The fruits were fresh and delivery was prompt. Very satisfied with this donor!',
              date: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
              status: 'Active'
            },
            {
              id: 'rev102',
              author: 'Community Shelter',
              authorId: 'usr156',
              recipient: 'Daily Bread',
              recipientId: 'usr098',
              rating: 4,
              comment: 'Good quality bakery items that helped feed many people at our shelter.',
              date: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
              status: 'Active'
            }
          ];
          
          // Simulate system notifications
          const mockNotifications = [
            {
              id: 'not201',
              type: 'alert',
              message: 'Multiple food donations approaching expiration',
              timestamp: new Date(Date.now() - 1*60*60*1000).toISOString(),
              read: false,
              priority: 'high'
            },
            {
              id: 'not202',
              type: 'system',
              message: 'Scheduled maintenance in 48 hours',
              timestamp: new Date(Date.now() - 5*60*60*1000).toISOString(),
              read: true,
              priority: 'medium'
            }
          ];
          
          // Update all state with mock data
          setStats(mockStats);
          setPendingApprovals(mockPendingApprovals);
          setRecentDonations(mockRecentDonations);
          setUserList(mockUsers);
          setRecentReviews(mockReviews);
          setNotifications(mockNotifications);
        }
      } catch (error) {
        console.error('Error loading admin dashboard data:', error);
        setToastMessage('Failed to load dashboard data');
        setToastType('error');
        setShowToast(true);
        
        // Fallback to mock data in case of API error
        // (Same mock data as above...)
        const mockStats = {
          totalUsers: 248,
          totalDonors: 112,
          totalBeneficiaries: 96,
          totalNGOs: 40,
          totalDonations: 437,
          activeDonations: 53,
          completedTransfers: 384,
          systemAlerts: 2,
          foodSaved: 2750,
          pendingApprovals: 8
        };
        
        // Update with basic mock data
        setStats(mockStats);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  // Handle donation approval
  const handleDonationAction = (donationId, action) => {
    const donation = [...pendingApprovals, ...recentDonations].find(d => d.id === donationId);
    
    if (!donation) return;
    
    if (action === 'approve') {
      setModalConfig({
        title: 'Approve Donation',
        message: `Are you sure you want to approve "${donation.title}" from ${donation.donorName}?`,
        confirmText: 'Approve',
        cancelText: 'Cancel',
        onConfirm: () => confirmDonationAction(donationId, 'Approved'),
        isDanger: false
      });
    } else if (action === 'reject') {
      setModalConfig({
        title: 'Reject Donation',
        message: `Are you sure you want to reject "${donation.title}" from ${donation.donorName}?`,
        confirmText: 'Reject',
        cancelText: 'Cancel',
        onConfirm: () => confirmDonationAction(donationId, 'Rejected'),
        isDanger: true
      });
    } else if (action === 'mark-delivered') {
      setModalConfig({
        title: 'Mark as Delivered',
        message: `Are you sure you want to mark "${donation.title}" as delivered?`,
        confirmText: 'Confirm Delivery',
        cancelText: 'Cancel',
        onConfirm: () => confirmDonationAction(donationId, 'Completed'),
        isDanger: false
      });
    }
    
    setShowModal(true);
  };

  // Confirm donation action (approve, reject, mark delivered)
  const confirmDonationAction = async (donationId, newStatus) => {
    try {
      setShowModal(false);
      setIsLoading(true);
      
      // Call the API to update donation status
      await updateDonationStatus(donationId, newStatus);
      console.log(`Donation ${donationId} status updated to ${newStatus}`);
      
      // Update pending approvals list
      setPendingApprovals(prev => 
        prev.filter(donation => donation.id !== donationId)
      );
      
      // Update recent donations list with new status
      if (newStatus !== 'Rejected') {
        const affectedDonation = [...pendingApprovals, ...recentDonations].find(d => d.id === donationId);
        
        if (affectedDonation) {
          const updatedDonation = {
            ...affectedDonation,
            status: newStatus,
            updatedAt: new Date().toISOString()
          };
          
          setRecentDonations(prev => [updatedDonation, ...prev.filter(d => d.id !== donationId)]);
        }
      }
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1,
        activeDonations: newStatus === 'Approved' ? prev.activeDonations + 1 : prev.activeDonations,
        completedTransfers: newStatus === 'Completed' ? prev.completedTransfers + 1 : prev.completedTransfers
      }));
      
      // Show success message
      const actionText = newStatus === 'Approved' ? 'approved' : newStatus === 'Completed' ? 'marked as delivered' : 'rejected';
      setToastMessage(`Donation successfully ${actionText}`);
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error updating donation status:', error);
      setToastMessage('Failed to update donation status');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user management actions
  const handleUserAction = (userId, action) => {
    const user = userList.find(u => u.id === userId);
    
    if (!user) return;
    
    if (action === 'verify') {
      setModalConfig({
        title: 'Verify User',
        message: `Are you sure you want to verify ${user.name}?`,
        confirmText: 'Verify',
        cancelText: 'Cancel',
        onConfirm: () => confirmUserAction(userId, 'Active', 'verified'),
        isDanger: false
      });
    } else if (action === 'disable') {
      setModalConfig({
        title: 'Disable Account',
        message: `Are you sure you want to disable ${user.name}'s account?`,
        confirmText: 'Disable Account',
        cancelText: 'Cancel',
        onConfirm: () => confirmUserAction(userId, 'Disabled'),
        isDanger: true
      });
    }
    
    setShowModal(true);
  };

  // Confirm user action
  const confirmUserAction = async (userId, newStatus, action) => {
    try {
      setShowModal(false);
      setIsLoading(true);
      
      // Call the API to update user status
      await updateUserStatus(userId, newStatus);
      console.log(`User ${userId} status updated to ${newStatus}`);
      
      // Update user list with new status
      setUserList(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      
      // Show success message
      const actionText = action === 'verified' ? 'verified' : newStatus.toLowerCase();
      setToastMessage(`User account successfully ${actionText}`);
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error updating user status:', error);
      setToastMessage('Failed to update user status');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle review moderation
  const handleReviewAction = (reviewId, action) => {
    const review = recentReviews.find(r => r.id === reviewId);
    
    if (!review) return;
    
    if (action === 'remove') {
      setModalConfig({
        title: 'Remove Review',
        message: 'Are you sure you want to remove this review? This action cannot be undone.',
        confirmText: 'Remove Review',
        cancelText: 'Cancel',
        onConfirm: () => confirmReviewAction(reviewId, 'Removed'),
        isDanger: true
      });
      setShowModal(true);
    }
  };

  // Confirm review action
  const confirmReviewAction = async (reviewId, newStatus) => {
    try {
      setShowModal(false);
      setIsLoading(true);
      
      // In a real app, this would call the API
      // For now, we'll simulate the state change
      
      // Remove review from list
      setRecentReviews(prev => 
        prev.filter(review => review.id !== reviewId)
      );
      
      // Show success message
      setToastMessage('Review successfully removed');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error moderating review:', error);
      setToastMessage('Failed to moderate review');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending system notification
  const handleSendNotification = async (type, message, recipients = 'all') => {
    try {
      setIsLoading(true);
      
      // Call the API to send a system notification
      await sendSystemNotification({
        type,
        message,
        recipients,
        priority: type === 'alert' ? 'high' : type === 'maintenance' ? 'medium' : 'normal'
      });
      
      console.log(`System notification sent: ${message}`);
      
      // Show success message
      setToastMessage('Notification sent successfully');
      setToastType('success');
      setShowToast(true);
      
      // Refresh notifications list
      const updatedNotifications = await getSystemNotifications();
      setNotifications(updatedNotifications || []);
      
      // Update system alerts count
      setStats(prev => ({
        ...prev,
        systemAlerts: updatedNotifications?.filter(n => n.type === 'alert' && !n.read)?.length || prev.systemAlerts
      }));
      
    } catch (error) {
      console.error('Error sending notification:', error);
      setToastMessage('Failed to send notification');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1EFEC]">
      {/* Toast Notification */}
      {showToast && (
        <ToastAlert
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      
      {/* Confirmation Modal */}
      {showModal && (
        <ConfirmationModal
          title={modalConfig.title}
          message={modalConfig.message}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
          onConfirm={modalConfig.onConfirm}
          onCancel={() => setShowModal(false)}
          isDanger={modalConfig.isDanger}
        />
      )}
      
      <main className="container mx-auto p-6 pt-20">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#123458]">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.name || 'Administrator'}!</p>
            </div>
            <button
              onClick={() => navigate('/admin/settings')}
              className="mt-3 sm:mt-0 px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center"
            >
              <FiSettings className="mr-2" /> System Settings
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex flex-wrap -mb-px">
            <button
              className={`mr-4 py-2 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'overview'
                  ? 'border-[#123458] text-[#123458]'
                  : 'border-transparent text-gray-500 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`mr-4 py-2 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'donations'
                  ? 'border-[#123458] text-[#123458]'
                  : 'border-transparent text-gray-500 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('donations')}
            >
              Donations
            </button>
            <button
              className={`mr-4 py-2 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'users'
                  ? 'border-[#123458] text-[#123458]'
                  : 'border-transparent text-gray-500 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={`mr-4 py-2 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-[#123458] text-[#123458]'
                  : 'border-transparent text-gray-500 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button
              className={`mr-4 py-2 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'map'
                  ? 'border-[#123458] text-[#123458]'
                  : 'border-transparent text-gray-500 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('map')}
            >
              Map View
            </button>
            <button
              className={`mr-4 py-2 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'notifications'
                  ? 'border-[#123458] text-[#123458]'
                  : 'border-transparent text-gray-500 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
          </div>
        </div>
        
        {/* Main Content Area */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#123458]"></div>
          </div>
        ) : activeTab === 'overview' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard 
                title="Total Users"
                value={stats.totalUsers}
                icon="users"
                trend="up"
                trendValue="8%"
              />
              <StatCard 
                title="Active Donations"
                value={stats.activeDonations}
                icon="package"
                trend="up"
                trendValue="12%"
              />
              <StatCard 
                title="Completed Transfers"
                value={stats.completedTransfers}
                icon="check-square"
                trend="up"
                trendValue="5%"
              />
              <StatCard 
                title="System Alerts"
                value={stats.systemAlerts}
                icon="alert-circle"
                color={stats.systemAlerts > 0 ? "red" : "green"}
              />
            </div>
            
            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-[#123458] mb-3">User Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Donors</span>
                    <span className="font-semibold">{stats.totalDonors}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(stats.totalDonors / stats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Beneficiaries</span>
                    <span className="font-semibold">{stats.totalBeneficiaries}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(stats.totalBeneficiaries / stats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">NGOs</span>
                    <span className="font-semibold">{stats.totalNGOs}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(stats.totalNGOs / stats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-[#123458] mb-3">Monthly Progress</h3>
                <div className="flex items-center justify-center h-32">
                  {/* This would be a chart in a real implementation */}
                  <div className="text-center text-gray-500">
                    <FiBarChart2 className="mx-auto h-10 w-10 mb-2" />
                    <p>Monthly statistics chart will be displayed here</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-[#123458] mb-3">Impact Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Food Saved</span>
                    <span className="font-semibold">{stats.foodSaved} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">CO₂ Reduced</span>
                    <span className="font-semibold">{(stats.foodSaved * 2.5).toFixed(1)} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Meals Provided</span>
                    <span className="font-semibold">{Math.floor(stats.foodSaved / 0.5)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                <h2 className="text-xl font-semibold text-[#123458] mb-4">Recent Activity</h2>
                
                <div className="space-y-4">
                  {recentDonations.slice(0, 5).map((donation, index) => (
                    <div key={donation.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{donation.title}</p>
                          <p className="text-sm text-gray-600">By: {donation.donorName}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          donation.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          donation.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                          donation.status === 'Approved' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {donation.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center">
                    <button 
                      onClick={() => setActiveTab('donations')}
                      className="text-[#123458] hover:underline text-sm font-medium"
                    >
                      View All Activity
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-[#123458] mb-4">Quick Actions</h2>
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="p-3 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors text-left flex items-center"
                  >
                    <FiUsers className="mr-2" /> Manage Users
                  </button>
                  <button 
                    onClick={() => setActiveTab('donations')}
                    className="p-3 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors text-left flex items-center"
                  >
                    <FiPackage className="mr-2" /> Approve Donations ({stats.pendingApprovals})
                  </button>
                  <button 
                    onClick={() => navigate('/admin/settings')}
                    className="p-3 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors text-left flex items-center"
                  >
                    <FiSettings className="mr-2" /> System Settings
                  </button>
                  <button 
                    onClick={() => navigate('/admin/reports')}
                    className="p-3 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors text-left flex items-center"
                  >
                    <FiFileText className="mr-2" /> Generate Reports
                  </button>
                </div>
                
                {stats.systemAlerts > 0 && (
                  <div className="mt-4 p-3 border border-red-200 bg-red-50 rounded-md">
                    <p className="text-red-700 font-medium flex items-center">
                      <FiBell className="mr-1" /> {stats.systemAlerts} system alert(s) require attention
                    </p>
                    <button 
                      onClick={() => setActiveTab('notifications')}
                      className="mt-2 text-sm text-red-700 font-medium hover:underline"
                    >
                      View Alerts
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : activeTab === 'donations' ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#123458]">Donations Management</h2>
                <div className="flex items-center">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search donations..." 
                      className="px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent"
                    />
                    <FiSearch className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex border-b border-gray-200 mb-4">
                <button className="py-2 px-4 border-b-2 border-[#123458] text-[#123458] font-medium">
                  Pending Approval ({pendingApprovals.length})
                </button>
                <button className="py-2 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                  All Donations
                </button>
                <button className="py-2 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                  In Transit
                </button>
                <button className="py-2 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                  Completed
                </button>
              </div>
              
              {/* Donations List */}
              <div className="space-y-4">
                {pendingApprovals.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">No pending donations to approve</p>
                  </div>
                ) : (
                  pendingApprovals.map(donation => (
                    <div key={donation.id} className="bg-white rounded-lg shadow p-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-3 md:mb-0">
                          <h3 className="font-medium">{donation.title}</h3>
                          <p className="text-sm text-gray-600">By: {donation.donorName}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                              {donation.quantity}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                              {donation.category}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                              Expires: {new Date(donation.expiresAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleDonationAction(donation.id, 'approve')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleDonationAction(donation.id, 'reject')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => navigate(`/admin/donations/${donation.id}`)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : activeTab === 'users' ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#123458]">User Management</h2>
                <div className="flex items-center">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      className="px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent"
                    />
                    <FiSearch className="absolute right-3 top-3 text-gray-400" />
                  </div>
                  <div className="ml-2">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent">
                      <option value="">All Roles</option>
                      <option value="donor">Donors</option>
                      <option value="beneficiary">Beneficiaries</option>
                      <option value="ngo">NGOs</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Users Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userList.map(user => (
                  <div key={user.id} className="bg-white rounded-lg shadow">
                    <div className="p-4">
                      <UserProfileCard 
                        user={user}
                        showActions={true}
                        onAction={(action) => handleUserAction(user.id, action)}
                      />
                      
                      {user.role === 'NGO' && user.status === 'Pending Verification' && (
                        <div className="mt-2 flex justify-end">
                          <button 
                            onClick={() => handleUserAction(user.id, 'verify')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Verify NGO
                          </button>
                        </div>
                      )}
                      
                      {user.status === 'Active' && (
                        <div className="mt-2 flex justify-end">
                          <button 
                            onClick={() => handleUserAction(user.id, 'disable')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Disable Account
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : activeTab === 'reviews' ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#123458]">Reviews Moderation</h2>
              </div>
              
              {/* Reviews List */}
              <div className="space-y-4">
                {recentReviews.map(review => (
                  <div key={review.id} className="bg-white rounded-lg shadow p-4">
                    <ReviewCard 
                      review={review}
                      showModeration={true}
                      onModerate={(action) => handleReviewAction(review.id, action)}
                    />
                  </div>
                ))}
                
                {recentReviews.length === 0 && (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">No reviews to moderate</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : activeTab === 'map' ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#123458]">Delivery Map</h2>
                <div className="flex items-center">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent">
                    <option value="all">All Deliveries</option>
                    <option value="in-transit">In Transit</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              
              {/* Map View */}
              <div className="bg-white rounded-lg shadow">
                <div className="h-96 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FiMap className="mx-auto h-12 w-12 mb-2" />
                    <p className="font-medium">Interactive Map</p>
                    <p className="text-sm mt-1">The delivery tracking map will be displayed here</p>
                    <p className="text-xs mt-3">Powered by Mapbox</p>
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-200">
                  <h3 className="font-medium text-[#123458] mb-2">Active Deliveries</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {recentDonations.filter(d => d.status === 'In Transit').map(delivery => (
                      <div key={delivery.id} className="p-3 border border-blue-100 bg-blue-50 rounded text-sm">
                        <p className="font-medium">{delivery.title}</p>
                        <p>From: {delivery.donorName}</p>
                        <div className="mt-1 flex justify-end">
                          <button 
                            onClick={() => navigate(`/admin/deliveries/${delivery.id}`)}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Track Details
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {recentDonations.filter(d => d.status === 'In Transit').length === 0 && (
                      <div className="col-span-3 text-center py-3 text-gray-500">
                        No active deliveries at the moment
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === 'notifications' ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#123458]">Notification Center</h2>
                <button 
                  onClick={() => {
                    setModalConfig({
                      title: 'Send System Notification',
                      message: (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Type
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                              <option value="alert">Alert</option>
                              <option value="maintenance">Maintenance</option>
                              <option value="announcement">Announcement</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Message
                            </label>
                            <textarea 
                              rows="3" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="Enter notification message..."
                            ></textarea>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Recipients
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                              <option value="all">All Users</option>
                              <option value="donors">Donors Only</option>
                              <option value="beneficiaries">Beneficiaries Only</option>
                              <option value="ngos">NGOs Only</option>
                            </select>
                          </div>
                        </div>
                      ),
                      confirmText: 'Send Notification',
                      cancelText: 'Cancel',
                      onConfirm: () => handleSendNotification('alert', 'Test message'),
                      isDanger: false,
                      isCustomContent: true
                    });
                    setShowModal(true);
                  }}
                  className="px-4 py-2 bg-[#123458] text-white rounded-lg flex items-center"
                >
                  <FiBell className="mr-2" /> Send New Notification
                </button>
              </div>
              
              {/* Notifications List */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="font-medium text-[#123458]">System Notifications</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {notifications.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No notifications</p>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-4 border rounded-lg ${
                            notification.priority === 'high' 
                              ? 'border-red-200 bg-red-50' 
                              : notification.priority === 'medium'
                              ? 'border-yellow-200 bg-yellow-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className={`font-medium ${notification.priority === 'high' ? 'text-red-700' : 'text-gray-900'}`}>
                                {notification.message}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(notification.timestamp).toLocaleString()}
                                {notification.type === 'alert' && <span className="ml-2 text-red-600 font-medium">Alert</span>}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => navigate(`/admin/notifications/${notification.id}`)}
                                className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-100"
                              >
                                Details
                              </button>
                              <button 
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};

export default AdminDashboard;
