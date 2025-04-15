import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, FiPackage, FiMessageSquare, FiPieChart, FiSearch, 
  FiFilter, FiDownload, FiUserCheck, FiUserX, FiEdit, FiEye, 
  FiAlertTriangle, FiCheckCircle, FiTrendingUp, FiActivity
} from 'react-icons/fi';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// Mock Auth Service
const authService = {
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user')) || { 
      id: 'user123', 
      role: 'admin',  // Change this to test access control
      name: 'Admin User'
    };
  }
};

// Small StatCard Component for Analytics
const StatCard = ({ icon, title, value, change, changeType }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xl font-bold mt-1 text-[#123458]">{value}</p>
        </div>
        <div className={`p-2 rounded-full ${icon ? 'bg-[#F1EFEC]' : ''}`}>
          {icon && icon}
        </div>
      </div>
      
      {change && (
        <div className="mt-2 flex items-center text-xs">
          <span className={`${
            changeType === 'increase' ? 'text-green-600' : 
            changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {changeType === 'increase' ? '▲' : 
             changeType === 'decrease' ? '▼' : ''}
            {' '}{change}
          </span>
          <span className="text-gray-500 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

// Mini Chart Component
const MiniChart = ({ type, data, dataKey, stroke }) => {
  return (
    <div className="h-20">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' ? (
          <LineChart data={data}>
            <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={2} dot={false} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <Bar dataKey={dataKey} fill={stroke} radius={[2, 2, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

// TabPanel Component for section switching
const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index} className={value === index ? 'block' : 'hidden'}>
      {value === index && children}
    </div>
  );
};

// AccessDenied Component for unauthorized users
const AccessDenied = ({ navigate }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#F1EFEC]">
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
      <div className="text-red-500 text-5xl mb-4">
        <FiAlertTriangle className="mx-auto" />
      </div>
      <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-6">
        You don't have permission to access the Admin Panel. 
        This area is restricted to administrator accounts only.
      </p>
      <button 
        onClick={() => navigate('/dashboard')}
        className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
      >
        Back to Dashboard
      </button>
    </div>
  </div>
);

// Main Component
const AdminPanelPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [userFilter, setUserFilter] = useState('all');
  const [donationFilter, setDonationFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Access control check
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser && currentUser.role === 'admin';

  // Mock analytics data
  const analyticsData = {
    totalDonations: {
      value: "3,240",
      change: "8.3%",
      changeType: "increase",
      trend: [
        { month: 'Jan', value: 65 },
        { month: 'Feb', value: 59 },
        { month: 'Mar', value: 80 },
        { month: 'Apr', value: 81 },
        { month: 'May', value: 56 },
        { month: 'Jun', value: 75 },
        { month: 'Jul', value: 85 }
      ]
    },
    activeUsers: {
      value: "1,857",
      change: "12.1%",
      changeType: "increase",
      trend: [
        { month: 'Jan', value: 40 },
        { month: 'Feb', value: 45 },
        { month: 'Mar', value: 55 },
        { month: 'Apr', value: 60 },
        { month: 'May', value: 65 },
        { month: 'Jun', value: 78 },
        { month: 'Jul', value: 90 }
      ]
    },
    monthlyGrowth: {
      value: "23%",
      change: "5.4%",
      changeType: "increase",
      trend: [
        { month: 'Jan', value: 12 },
        { month: 'Feb', value: 15 },
        { month: 'Mar', value: 18 },
        { month: 'Apr', value: 20 },
        { month: 'May', value: 22 },
        { month: 'Jun', value: 24 },
        { month: 'Jul', value: 28 }
      ]
    },
    platformHealth: {
      value: "98.7%",
      change: "0.5%",
      changeType: "increase",
      trend: [
        { month: 'Jan', value: 98 },
        { month: 'Feb', value: 97 },
        { month: 'Mar', value: 99 },
        { month: 'Apr', value: 98 },
        { month: 'May', value: 99 },
        { month: 'Jun', value: 98 },
        { month: 'Jul', value: 99 }
      ]
    }
  };

  // Fetch data
  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        // const usersResponse = await fetch('/api/admin/users');
        // const users = await usersResponse.json();
        
        // Mock user data
        const mockUsers = [
          { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'donor', status: 'active', joined: '2023-01-15', lastActive: '2023-05-20' },
          { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', role: 'beneficiary', status: 'active', joined: '2023-02-10', lastActive: '2023-05-18' },
          { id: 'u3', name: 'Food Rescue Inc', email: 'rescue@example.com', role: 'ngo', status: 'pending', joined: '2023-04-22', lastActive: '2023-05-22' },
          { id: 'u4', name: 'Mike Wilson', email: 'mike@example.com', role: 'donor', status: 'banned', joined: '2023-03-05', lastActive: '2023-04-15' },
          { id: 'u5', name: 'Community Helpers', email: 'community@example.com', role: 'ngo', status: 'active', joined: '2023-02-28', lastActive: '2023-05-21' }
        ];
        
        // Mock donation data
        const mockDonations = [
          { id: 'd1', title: 'Fresh Vegetables', donor: 'John Doe', recipient: 'Community Center', status: 'completed', date: '2023-05-15', quantity: '25 kg' },
          { id: 'd2', title: 'Bread Loaves', donor: 'Bakery Co', recipient: 'Homeless Shelter', status: 'in-progress', date: '2023-05-20', quantity: '15 units' },
          { id: 'd3', title: 'Canned Goods', donor: 'Super Market', recipient: 'Food Bank', status: 'pending', date: '2023-05-22', quantity: '30 units' },
          { id: 'd4', title: 'Dairy Products', donor: 'Farm Fresh', recipient: 'Senior Center', status: 'flagged', date: '2023-05-21', quantity: '10 liters' },
          { id: 'd5', title: 'Fresh Fruit', donor: 'Orchard Co', recipient: 'Children\'s Home', status: 'completed', date: '2023-05-18', quantity: '20 kg' }
        ];
        
        // Mock feedback data
        const mockFeedback = [
          { id: 'f1', user: 'John Doe', type: 'review', rating: 5, message: 'Great platform, very easy to use!', date: '2023-05-19' },
          { id: 'f2', user: 'Jane Smith', type: 'report', rating: null, message: 'Found a bug in the donation form', date: '2023-05-20' },
          { id: 'f3', user: 'Community Helpers', type: 'review', rating: 4, message: 'Very helpful for our organization', date: '2023-05-18' },
          { id: 'f4', user: 'Food Rescue Inc', type: 'suggestion', rating: null, message: 'Would be great to add delivery scheduling', date: '2023-05-21' },
          { id: 'f5', user: 'Homeless Shelter', type: 'report', rating: null, message: 'Notification emails are not working', date: '2023-05-22' }
        ];
        
        setUsers(mockUsers);
        setDonations(mockDonations);
        setFeedback(mockFeedback);
        
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAdmin]);

  // Filter user list based on role filter and search term
  const filteredUsers = users.filter(user => 
    (userFilter === 'all' || user.role === userFilter) &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Filter donation list based on status filter and search term
  const filteredDonations = donations.filter(donation => 
    (donationFilter === 'all' || donation.status === donationFilter) &&
    (donation.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     donation.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
     donation.recipient.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle user status change
  const handleUserStatusChange = (userId, newStatus) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    // In a real application, this would make an API call
    // await fetch(`/api/admin/users/${userId}/status`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ status: newStatus }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
  };

  // Handle donation status change
  const handleDonationStatusChange = (donationId, newStatus) => {
    setDonations(prevDonations => 
      prevDonations.map(donation => 
        donation.id === donationId ? { ...donation, status: newStatus } : donation
      )
    );
    // In a real application, this would make an API call
  };

  // Generate downloadable report
  const generateReport = (reportType) => {
    // In a real application, this would generate and download a report
    alert(`Generating ${reportType} report...`);
    // Mock download process
    setTimeout(() => {
      alert(`${reportType} report downloaded successfully!`);
    }, 1000);
  };

  // Show access denied screen for non-admin users
  if (!isAdmin) {
    return <AccessDenied navigate={navigate} />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F1EFEC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#123458]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1EFEC]">
      <header className="bg-[#123458] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Admin Control Center</h1>
          <p className="text-sm opacity-80">
            Manage platform operations, users, and content
          </p>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 sm:px-6">
        {/* Admin Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab(0)}
              className={`px-6 py-4 flex items-center ${
                activeTab === 0 
                ? 'border-b-2 border-[#123458] text-[#123458] font-medium' 
                : 'text-gray-500'
              }`}
            >
              <FiUsers className="mr-2" /> User Management
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`px-6 py-4 flex items-center ${
                activeTab === 1 
                ? 'border-b-2 border-[#123458] text-[#123458] font-medium' 
                : 'text-gray-500'
              }`}
            >
              <FiPackage className="mr-2" /> Donation Oversight
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`px-6 py-4 flex items-center ${
                activeTab === 2 
                ? 'border-b-2 border-[#123458] text-[#123458] font-medium' 
                : 'text-gray-500'
              }`}
            >
              <FiMessageSquare className="mr-2" /> Feedback & Reports
            </button>
            <button
              onClick={() => setActiveTab(3)}
              className={`px-6 py-4 flex items-center ${
                activeTab === 3 
                ? 'border-b-2 border-[#123458] text-[#123458] font-medium' 
                : 'text-gray-500'
              }`}
            >
              <FiPieChart className="mr-2" /> Analytics
            </button>
          </div>
        </div>
        
        {/* Tab Content Panels */}
        {/* User Management Panel */}
        <TabPanel value={activeTab} index={0}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-xl font-semibold text-[#123458] mb-4 sm:mb-0">Manage Users</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#123458] focus:border-[#123458] w-full sm:w-64"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#123458] focus:border-[#123458]"
                >
                  <option value="all">All Roles</option>
                  <option value="donor">Donors</option>
                  <option value="beneficiary">Beneficiaries</option>
                  <option value="ngo">NGOs</option>
                </select>
              </div>
            </div>
            
            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${user.role === 'donor' ? 'bg-blue-100 text-blue-800' : 
                            user.role === 'beneficiary' ? 'bg-green-100 text-green-800' : 
                            'bg-purple-100 text-purple-800'}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                            user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {user.joined}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {user.lastActive}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {user.status === 'pending' && (
                            <button
                              onClick={() => handleUserStatusChange(user.id, 'active')}
                              className="text-green-600 hover:text-green-900"
                              title="Approve User"
                            >
                              <FiUserCheck size={18} />
                            </button>
                          )}
                          {user.status !== 'banned' && (
                            <button
                              onClick={() => handleUserStatusChange(user.id, 'banned')}
                              className="text-red-600 hover:text-red-900"
                              title="Ban User"
                            >
                              <FiUserX size={18} />
                            </button>
                          )}
                          <button 
                            className="text-[#123458] hover:text-[#0a1c2e]"
                            title="View Profile"
                          >
                            <FiEye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No users match your search criteria
              </div>
            )}
          </div>
        </TabPanel>
        
        {/* Donation Oversight Panel */}
        <TabPanel value={activeTab} index={1}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-xl font-semibold text-[#123458] mb-4 sm:mb-0">Donation Oversight</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#123458] focus:border-[#123458] w-full sm:w-64"
                    placeholder="Search donations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={donationFilter}
                  onChange={(e) => setDonationFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#123458] focus:border-[#123458]"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="flagged">Flagged</option>
                </select>
              </div>
            </div>
            
            {/* Donations Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDonations.map((donation) => (
                    <tr key={donation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{donation.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{donation.donor}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{donation.recipient}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${donation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            donation.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                            donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {donation.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {donation.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDonationStatusChange(donation.id, donation.status === 'flagged' ? 'pending' : 'flagged')}
                            className={`${donation.status === 'flagged' ? 'text-green-600 hover:text-green-900' : 'text-yellow-600 hover:text-yellow-900'}`}
                            title={donation.status === 'flagged' ? 'Unflag' : 'Flag'}
                          >
                            {donation.status === 'flagged' ? 
                              <FiCheckCircle size={18} /> : 
                              <FiAlertTriangle size={18} />}
                          </button>
                          <button 
                            className="text-[#123458] hover:text-[#0a1c2e]"
                            title="View Details"
                          >
                            <FiEye size={18} />
                          </button>
                          <button 
                            className="text-gray-600 hover:text-gray-900"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredDonations.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No donations match your search criteria
              </div>
            )}
          </div>
        </TabPanel>
        
        {/* Feedback & Reports Panel */}
        <TabPanel value={activeTab} index={2}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feedback Section */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-[#123458] mb-6">User Feedback</h2>
              
              <div className="space-y-4">
                {feedback.map((item) => (
                  <div key={item.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className="font-medium">{item.user}</span>
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full
                          ${item.type === 'review' ? 'bg-green-100 text-green-800' : 
                            item.type === 'report' ? 'bg-red-100 text-red-800' : 
                            'bg-blue-100 text-blue-800'}`}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                    
                    {item.rating !== null && (
                      <div className="mb-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-gray-700">{item.message}</p>
                    
                    {item.type === 'report' && (
                      <div className="mt-3 flex justify-end space-x-2">
                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200">
                          Resolve
                        </button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200">
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Reports Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-[#123458] mb-6">Generate Reports</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Platform Activity</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Overview of donations, users, and activity metrics.
                  </p>
                  <button 
                    onClick={() => generateReport('platform-activity')}
                    className="flex items-center px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    <FiDownload className="mr-2" /> Download Report
                  </button>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-700 mb-2">User Growth</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Analysis of new users, retention, and churn.
                  </p>
                  <button 
                    onClick={() => generateReport('user-growth')}
                    className="flex items-center px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    <FiDownload className="mr-2" /> Download Report
                  </button>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-700 mb-2">Impact Metrics</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Food saved, meals provided, and environmental impact.
                  </p>
                  <button 
                    onClick={() => generateReport('impact-metrics')}
                    className="flex items-center px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    <FiDownload className="mr-2" /> Download Report
                  </button>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-700 mb-2">Custom Report</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Generate a customized report with selected metrics.
                  </p>
                  <button 
                    onClick={() => navigate('/admin/custom-report')}
                    className="flex items-center px-4 py-2 border border-[#123458] text-[#123458] rounded-md hover:bg-[#F1EFEC] transition-colors"
                  >
                    Create Custom Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        
        {/* Analytics Panel */}
        <TabPanel value={activeTab} index={3}>
          <div className="space-y-6">
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Donations Stat */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Donations</p>
                    <p className="text-2xl font-bold mt-1 text-[#123458]">{analyticsData.totalDonations.value}</p>
                  </div>
                  <div className="p-2 rounded-full bg-[#F1EFEC]">
                    <FiPackage size={20} className="text-[#123458]" />
                  </div>
                </div>
                
                <div className="mb-2 flex items-center text-xs">
                  <span className="text-green-600">
                    ▲ {analyticsData.totalDonations.change}
                  </span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
                
                <MiniChart 
                  type="bar" 
                  data={analyticsData.totalDonations.trend} 
                  dataKey="value" 
                  stroke="#123458" 
                />
              </div>
              
              {/* Active Users Stat */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold mt-1 text-[#123458]">{analyticsData.activeUsers.value}</p>
                  </div>
                  <div className="p-2 rounded-full bg-[#F1EFEC]">
                    <FiUsers size={20} className="text-[#123458]" />
                  </div>
                </div>
                
                <div className="mb-2 flex items-center text-xs">
                  <span className="text-green-600">
                    ▲ {analyticsData.activeUsers.change}
                  </span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
                
                <MiniChart 
                  type="line" 
                  data={analyticsData.activeUsers.trend} 
                  dataKey="value" 
                  stroke="#123458" 
                />
              </div>
              
              {/* Monthly Growth Stat */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Growth</p>
                    <p className="text-2xl font-bold mt-1 text-[#123458]">{analyticsData.monthlyGrowth.value}</p>
                  </div>
                  <div className="p-2 rounded-full bg-[#F1EFEC]">
                    <FiTrendingUp size={20} className="text-[#123458]" />
                  </div>
                </div>
                
                <div className="mb-2 flex items-center text-xs">
                  <span className="text-green-600">
                    ▲ {analyticsData.monthlyGrowth.change}
                  </span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
                
                <MiniChart 
                  type="line" 
                  data={analyticsData.monthlyGrowth.trend} 
                  dataKey="value" 
                  stroke="#123458" 
                />
              </div>
              
              {/* Platform Health Stat */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Platform Health</p>
                    <p className="text-2xl font-bold mt-1 text-[#123458]">{analyticsData.platformHealth.value}</p>
                  </div>
                  <div className="p-2 rounded-full bg-[#F1EFEC]">
                    <FiActivity size={20} className="text-[#123458]" />
                  </div>
                </div>
                
                <div className="mb-2 flex items-center text-xs">
                  <span className="text-green-600">
                    ▲ {analyticsData.platformHealth.change}
                  </span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
                
                <MiniChart 
                  type="line" 
                  data={analyticsData.platformHealth.trend} 
                  dataKey="value" 
                  stroke="#123458" 
                />
              </div>
            </div>
            
            {/* Detailed Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Donations by Month Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-[#123458] mb-4">Donations by Month</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Jan', value: 1200 },
                        { name: 'Feb', value: 1400 },
                        { name: 'Mar', value: 1800 },
                        { name: 'Apr', value: 2400 },
                        { name: 'May', value: 2200 },
                        { name: 'Jun', value: 2600 },
                        { name: 'Jul', value: 3200 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} donations`, 'Value']}
                        contentStyle={{ backgroundColor: '#fff', borderColor: '#ddd' }}
                      />
                      <Bar dataKey="value" fill="#123458" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* User Acquisition Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-[#123458] mb-4">User Acquisition</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { name: 'Jan', donors: 200, beneficiaries: 150, ngos: 50 },
                        { name: 'Feb', donors: 250, beneficiaries: 180, ngos: 60 },
                        { name: 'Mar', donors: 300, beneficiaries: 200, ngos: 70 },
                        { name: 'Apr', donors: 320, beneficiaries: 230, ngos: 80 },
                        { name: 'May', donors: 380, beneficiaries: 250, ngos: 85 },
                        { name: 'Jun', donors: 400, beneficiaries: 270, ngos: 90 },
                        { name: 'Jul', donors: 450, beneficiaries: 300, ngos: 95 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#ddd' }} />
                      <Legend />
                      <Line type="monotone" dataKey="donors" stroke="#123458" strokeWidth={2} />
                      <Line type="monotone" dataKey="beneficiaries" stroke="#D4C9BE" strokeWidth={2} />
                      <Line type="monotone" dataKey="ngos" stroke="#030303" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Additional Analytics Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-[#123458] mb-4">Platform Usage Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Average Session Duration</h4>
                  <p className="text-2xl font-semibold text-[#123458]">4m 32s</p>
                  <p className="text-xs text-green-600 mt-1">▲ 12.3% vs last month</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Pages per Session</h4>
                  <p className="text-2xl font-semibold text-[#123458]">5.8</p>
                  <p className="text-xs text-green-600 mt-1">▲ 8.2% vs last month</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Bounce Rate</h4>
                  <p className="text-2xl font-semibold text-[#123458]">24.7%</p>
                  <p className="text-xs text-red-600 mt-1">▼ 3.1% vs last month</p>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </main>
    </div>
  );
};

export default AdminPanelPage;
