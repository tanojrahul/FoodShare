import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiUsers, FiPackage, FiPieChart, FiAlertCircle,
  FiUserPlus, FiEdit, FiTrash2, FiFilter, FiRefreshCw
} from 'react-icons/fi';
import Footer from '../components/Footer';
import authService from '../services/authService';
import { getAllUsers, deactivateUser, updateUserProfile, updateUserStatus, changeUserRole } from '../services/userService';
import { getAllFoodListings, deleteDonation } from '../services/donationService';
import ToastAlert from '../components/ToastAlert';

const AdminPanelPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('users');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteDonationConfirm, setShowDeleteDonationConfirm] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    role: '',
    status: ''
  });
  const [toast, setToast] = useState(null);

  // Tabs definition
  const tabs = [
    { id: 'users', label: 'Users', icon: <FiUsers /> },
    { id: 'donations', label: 'Donations', icon: <FiPackage /> },
    { id: 'statistics', label: 'Statistics', icon: <FiPieChart /> }
  ];

  // Mock data
  const mockUsers = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'donor',
      status: 'active',
      joinedAt: '2024-10-15T10:30:00Z',
      donations: 12
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@foodbank.org',
      role: 'beneficiary',
      status: 'active',
      joinedAt: '2024-11-05T15:45:00Z',
      donations: 0
    },
    {
      id: '3',
      name: 'Community Helpers NGO',
      email: 'info@communityhelpers.org',
      role: 'ngo',
      status: 'pending',
      joinedAt: '2025-03-20T09:15:00Z',
      donations: 0
    },
    {
      id: '4',
      name: 'Robert Chen',
      email: 'robert@localfarm.com',
      role: 'donor',
      status: 'active',
      joinedAt: '2024-12-12T11:20:00Z',
      donations: 8
    },
    {
      id: '5',
      name: 'Homeless Shelter',
      email: 'contact@homelessshelter.org',
      role: 'beneficiary',
      status: 'active',
      joinedAt: '2025-01-08T16:10:00Z',
      donations: 0
    }
  ];

  const mockDonations = [
    {
      id: '1',
      title: 'Fresh Vegetables Assortment',
      donor: {
        id: '1',
        name: 'John Smith'
      },
      quantity: 20,
      unit: 'kg',
      expiresAt: '2025-04-25T00:00:00Z',
      status: 'available',
      createdAt: '2025-04-15T10:30:00Z',
      updatedAt: '2025-04-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Bread and Pastries',
      donor: {
        id: '4',
        name: 'Robert Chen'
      },
      quantity: 15,
      unit: 'items',
      expiresAt: '2025-04-19T00:00:00Z',
      status: 'claimed',
      createdAt: '2025-04-14T09:15:00Z',
      updatedAt: '2025-04-16T14:20:00Z'
    },
    {
      id: '3',
      title: 'Canned Goods Collection',
      donor: {
        id: '1',
        name: 'John Smith'
      },
      quantity: 40,
      unit: 'cans',
      expiresAt: '2025-06-30T00:00:00Z',
      status: 'available',
      createdAt: '2025-04-10T11:45:00Z',
      updatedAt: '2025-04-10T11:45:00Z'
    },
    {
      id: '4',
      title: 'Dairy Products',
      donor: {
        id: '4',
        name: 'Robert Chen'
      },
      quantity: 10,
      unit: 'items',
      expiresAt: '2025-04-18T00:00:00Z',
      status: 'expired',
      createdAt: '2025-04-12T15:30:00Z',
      updatedAt: '2025-04-18T00:01:00Z'
    }
  ];

  const mockStatistics = {
    userStats: {
      total: 250,
      donors: 120,
      beneficiaries: 80,
      ngos: 50,
      growth: 15 // percentage growth in last month
    },
    donationStats: {
      total: 1540,
      active: 320,
      completed: 1100,
      expired: 120,
      volume: 45280 // kg
    },
    topDonors: [
      { id: '1', name: 'John Smith', donations: 12, quantity: 350 },
      { id: '4', name: 'Robert Chen', donations: 8, quantity: 280 },
      { id: '7', name: 'Fresh Market Co.', donations: 25, quantity: 1200 }
    ],
    topBeneficiaries: [
      { id: '5', name: 'Homeless Shelter', received: 35, quantity: 1400 },
      { id: '9', name: 'Community Kitchen', received: 28, quantity: 950 },
      { id: '12', name: 'Youth Center', received: 20, quantity: 780 }
    ]
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to fetch admin dashboard data
  const fetchAdminData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch data based on active tab to avoid unnecessary API calls
      if (activeTab === 'users' || activeTab === 'statistics') {
        const usersData = await getAllUsers();
        console.log('Users data:', usersData);
        
        // Check if the response is an array (direct API format) or has a users property
        if (usersData) {
          // Handle both array format and object with users property
          const usersList = Array.isArray(usersData) ? usersData : 
                           (usersData.users && Array.isArray(usersData.users) ? usersData.users : []);
          
          setUsers(usersList);
        } else {
          // Fallback to mock data if API response is empty
          setUsers(mockUsers);
          console.warn('No user data returned from API. Using mock data instead.');
        }
      }
      
      if (activeTab === 'donations' || activeTab === 'statistics') {
        const donationsData = await getAllFoodListings({
          page: 1,
          limit: 10,
          includeDetails: true
        });
        console.log('Donations data:', donationsData);
        
        // Handle both array format and object with donations property
        if (donationsData) {
          const donationsList = Array.isArray(donationsData) ? donationsData : 
                               (donationsData.donations && Array.isArray(donationsData.donations) ? 
                                donationsData.donations : []);
          
          setDonations(donationsList);
        } else {
          // Fallback to mock data if API response is empty
          setDonations(mockDonations);
          console.warn('No donation data returned from API. Using mock data instead.');
        }
      }
      
      if (activeTab === 'statistics') {
        try {
          // For statistics tab, calculate stats from the fetched data
          const userGroups = users.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
          }, {});
          
          const donationStatuses = donations.reduce((acc, donation) => {
            acc[donation.status] = (acc[donation.status] || 0) + 1;
            return acc;
          }, {});
          
          // Calculate total food volume
          const totalVolume = donations.reduce((sum, donation) => {
            return sum + (Number(donation.quantity) || 0);
          }, 0);
          
          // Generate stats object
          const calculatedStats = {
            userStats: {
              total: users.length,
              donors: userGroups.donor || 0,
              beneficiaries: userGroups.beneficiary || 0,
              ngos: userGroups.ngo || 0,
              growth: 5 // Hardcoded without historical data
            },
            donationStats: {
              total: donations.length,
              active: donationStatuses.available || 0,
              completed: donationStatuses.completed || 0,
              expired: donationStatuses.expired || 0,
              volume: totalVolume
            },
            // For top donors and beneficiaries, we'd need another API call in a real app
            topDonors: mockStatistics.topDonors,
            topBeneficiaries: mockStatistics.topBeneficiaries
          };
          
          setStatistics(calculatedStats);
        } catch (error) {
          console.error('Error calculating statistics:', error);
          // Fall back to mock statistics
          setStatistics(mockStatistics);
          console.warn('Error calculating statistics. Using mock data instead.');
        }
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      
      // Fallback to mock data
      if (activeTab === 'users') setUsers(mockUsers);
      if (activeTab === 'donations') setDonations(mockDonations);
      if (activeTab === 'statistics') setStatistics(mockStatistics);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle opening the Edit User modal
  const handleEditUser = (selectedUser) => {
    setSelectedUserId(selectedUser.id);
    setEditUserData({
      name: selectedUser.name || '',
      email: selectedUser.email || '',
      role: selectedUser.role || 'donor',
      status: selectedUser.status || 'active'
    });
    setShowEditUserModal(true);
  };

  // Handle saving edited user data
  const handleSaveUserEdit = async () => {
    try {
      // Call API to update user profile
      const updatedUser = await updateUserProfile(selectedUserId, editUserData);
      
      // Also update user status if it changed
      if (editUserData.status) {
        await updateUserStatus(selectedUserId, editUserData.status);
      }
      
      // Also update user role if it changed
      if (editUserData.role) {
        await changeUserRole(selectedUserId, editUserData.role);
      }
      
      // Update the user in the local state
      setUsers(users.map(user => 
        user.id === selectedUserId ? { ...user, ...editUserData } : user
      ));
      
      // Close the modal
      setShowEditUserModal(false);
      setSelectedUserId(null);
      
      // Show success message
      console.log(`User ${selectedUserId} successfully updated`);
      setToast({
        type: 'success',
        message: 'User updated successfully'
      });
    } catch (error) {
      console.error('Error updating user:', error);
      setToast({
        type: 'error',
        message: `Failed to update user: ${error.message}`
      });
    }
  };

  // Initialize with URL params and fetch data
  useEffect(() => {
    // Get current user
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    // Check if user is admin
    if (currentUser && currentUser.role !== 'admin') {
      // Not an admin, will redirect in render
      setIsLoading(false);
      return;
    }

    // Get tab from URL params
    const tabParam = searchParams.get('tab');
    if (tabParam && tabs.some(tab => tab.id === tabParam)) {
      setActiveTab(tabParam);
    }

    // Fetch real data from API
    fetchAdminData();
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    
    // Force a new data fetch when tab changes
    fetchAdminData();
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    try {
      // Call the API to deactivate the user
      await deactivateUser(selectedUserId);
      
      // Update UI by removing the user from the list
      setUsers(users.filter(user => user.id !== selectedUserId));
      
      // Close modal
      setShowDeleteConfirm(false);
      setSelectedUserId(null);
      
      // Show success message in console (you could add a toast notification here)
      console.log(`User ${selectedUserId} successfully deleted`);
    } catch (error) {
      console.error('Error deleting user:', error);
      
      // Show error message in console (you could add a toast notification here)
      console.error(`Failed to delete user: ${error.message}`);
    }
  };

  // Handle donation deletion
  const handleDeleteDonation = async () => {
    try {
      // Call the API to delete the donation
      await deleteDonation(selectedDonationId);
      
      // Update UI by removing the donation from the list
      setDonations(donations.filter(donation => donation.id !== selectedDonationId));
      
      // Close modal
      setShowDeleteDonationConfirm(false);
      setSelectedDonationId(null);
      
      // Show success message in console (you could add a toast notification here)
      console.log(`Donation ${selectedDonationId} successfully deleted`);
    } catch (error) {
      console.error('Error deleting donation:', error);
      
      // Show error message in console (you could add a toast notification here)
      console.error(`Failed to delete donation: ${error.message}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1EFEC]">
        <div className="pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-12 bg-gray-200 rounded mb-8"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If not admin, redirect to home
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F1EFEC]">
      <div className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-[#123458] mb-6">Admin Panel</h1>
          
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex border-b overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-6 py-3 flex items-center hover:bg-gray-50 ${
                    activeTab === tab.id 
                      ? 'border-b-2 border-[#123458] text-[#123458] font-medium' 
                      : 'text-gray-600'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#123458] mb-2 sm:mb-0">User Management</h2>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">
                      <FiFilter className="mr-1" /> Filter
                    </button>
                    <button className="flex items-center px-3 py-2 bg-[#123458] text-white rounded hover:bg-opacity-90">
                      <FiUserPlus className="mr-1" /> Add User
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                            {user.email}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                              ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'donor' ? 'bg-blue-100 text-blue-800' :
                                user.role === 'beneficiary' ? 'bg-green-100 text-green-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                              ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                                user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                            {formatDate(user.joinedAt)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="text-blue-600 hover:text-blue-900 mr-3"
                              onClick={() => handleEditUser(user)}
                            >
                              <FiEdit />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setShowDeleteConfirm(true);
                              }}
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination placeholder */}
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{users.length}</span> of <span className="font-medium">{mockStatistics.userStats.total}</span> users
                  </p>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Donations Tab */}
            {activeTab === 'donations' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#123458] mb-2 sm:mb-0">Donation Management</h2>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">
                      <FiFilter className="mr-1" /> Filter
                    </button>
                    <button className="flex items-center px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">
                      <FiRefreshCw className="mr-1" /> Refresh
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Donation
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Donor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expires
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {donations.map((donation) => (
                        <tr key={donation.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{donation.title}</div>
                            <div className="text-xs text-gray-500">ID: {donation.id}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                            {donation.donor && donation.donor.name ? donation.donor.name : 
                             donation.donorName || 'Unknown donor'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                            {donation.quantity} {donation.unit || ''}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                              ${donation.status === 'available' ? 'bg-green-100 text-green-800' :
                                donation.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                                donation.status === 'expired' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {donation.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                            {donation.expiresAt ? formatDate(donation.expiresAt) : 'N/A'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <FiEdit />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => {
                                setSelectedDonationId(donation.id);
                                setShowDeleteDonationConfirm(true);
                              }}
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination placeholder */}
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{donations.length}</span> of <span className="font-medium">{mockStatistics.donationStats.total}</span> donations
                  </p>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Statistics Tab */}
            {activeTab === 'statistics' && statistics && (
              <div>
                <h2 className="text-xl font-semibold text-[#123458] mb-6">Platform Statistics</h2>
                
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* User Stats */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-4">User Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold text-[#123458]">{statistics.userStats.total}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Monthly Growth</p>
                        <p className="text-2xl font-bold text-green-600">+{statistics.userStats.growth}%</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Donors</p>
                        <p className="text-2xl font-bold text-blue-600">{statistics.userStats.donors}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Beneficiaries</p>
                        <p className="text-2xl font-bold text-green-600">{statistics.userStats.beneficiaries}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Donation Stats */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-4">Donation Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Total Donations</p>
                        <p className="text-2xl font-bold text-[#123458]">{statistics.donationStats.total}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Active Donations</p>
                        <p className="text-2xl font-bold text-green-600">{statistics.donationStats.active}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Food Volume</p>
                        <p className="text-2xl font-bold text-blue-600">{Math.round(statistics.donationStats.volume / 1000)}t</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Completion Rate</p>
                        <p className="text-2xl font-bold text-green-600">
                          {Math.round((statistics.donationStats.completed / statistics.donationStats.total) * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Top Contributors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Donors */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Top Donors</h3>
                    <div className="bg-white rounded-lg shadow-sm">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Donor
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Donations
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity (kg)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {statistics.topDonors.map((donor, index) => (
                            <tr key={donor.id}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="font-medium text-gray-900">
                                  {index + 1}. {donor.name}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-gray-600">
                                {donor.donations}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-gray-600">
                                {donor.quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Top Beneficiaries */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Top Beneficiaries</h3>
                    <div className="bg-white rounded-lg shadow-sm">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Beneficiary
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Received
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity (kg)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {statistics.topBeneficiaries.map((beneficiary, index) => (
                            <tr key={beneficiary.id}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="font-medium text-gray-900">
                                  {index + 1}. {beneficiary.name}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-gray-600">
                                {beneficiary.received}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-gray-600">
                                {beneficiary.quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete User Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center text-red-600 mb-4">
              <FiAlertCircle className="text-2xl mr-2" />
              <h3 className="text-lg font-medium">Confirm Deletion</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Donation Confirmation Modal */}
      {showDeleteDonationConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center text-red-600 mb-4">
              <FiAlertCircle className="text-2xl mr-2" />
              <h3 className="text-lg font-medium">Confirm Deletion</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this donation? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteDonationConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDonation}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 w-full">
            <div className="flex items-center text-blue-600 mb-4">
              <FiEdit className="text-2xl mr-2" />
              <h3 className="text-lg font-medium">Edit User</h3>
            </div>
            
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editUserData.name}
                  onChange={(e) => setEditUserData({...editUserData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={editUserData.role}
                  onChange={(e) => setEditUserData({...editUserData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="donor">Donor</option>
                  <option value="beneficiary">Beneficiary</option>
                  <option value="ngo">NGO</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editUserData.status}
                  onChange={(e) => setEditUserData({...editUserData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditUserModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUserEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <ToastAlert
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminPanelPage;
