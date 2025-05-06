import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiPieChart, FiDownload, FiCalendar, FiFilter,
  FiUsers, FiPackage, FiTrendingUp, FiDollarSign
} from 'react-icons/fi';
import Footer from '../components/Footer';
import authService from '../services/authService';

// Chart placeholder component
const ChartPlaceholder = ({ title, description, height = "h-64" }) => (
  <div className="bg-white p-6 rounded-lg shadow-md h-full">
    <h3 className="text-lg font-semibold text-[#123458] mb-4">{title}</h3>
    <div className={`border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center ${height}`}>
      <div className="w-full h-full bg-gray-50 rounded flex items-center justify-center">
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  </div>
);

// Report Card component
const ReportCard = ({ title, icon, description, onClick }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-start">
      <div className="p-3 rounded-full bg-[#123458] bg-opacity-10 mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[#123458] mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </motion.div>
);

const AdminReportsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  // Tabs definition
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiPieChart /> },
    { id: 'users', label: 'User Reports', icon: <FiUsers /> },
    { id: 'donations', label: 'Donation Reports', icon: <FiPackage /> },
    { id: 'impact', label: 'Impact Reports', icon: <FiTrendingUp /> },
    { id: 'custom', label: 'Custom Reports', icon: <FiFilter /> }
  ];

  // Date range options
  const dateRanges = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
    { id: 'all', label: 'All Time' }
  ];

  // Mock report data
  const mockReportData = {
    overview: {
      totalUsers: 1250,
      activeUsers: 876,
      totalDonations: 3452,
      activeDonations: 320,
      totalFoodWeight: 45280, // kg
      totalDeliveries: 3128,
      successRate: 92, // %
      userGrowth: 15, // %
      recentSignups: [
        { name: "Food Bank NYC", role: "beneficiary", date: "2025-04-20" },
        { name: "Green Market", role: "donor", date: "2025-04-19" },
        { name: "Community Kitchen", role: "beneficiary", date: "2025-04-18" },
        { name: "Fresh Farms Co-op", role: "donor", date: "2025-04-17" },
        { name: "Neighborhood Help", role: "ngo", date: "2025-04-16" }
      ]
    },
    userReports: [
      { 
        id: 'user-growth',
        title: 'User Growth Analysis', 
        icon: <FiTrendingUp className="text-[#123458] text-xl" />,
        description: 'User acquisition and retention trends over time'
      },
      { 
        id: 'role-distribution',
        title: 'User Role Distribution', 
        icon: <FiUsers className="text-[#123458] text-xl" />,
        description: 'Breakdown of donors, beneficiaries, and NGOs'
      },
      { 
        id: 'user-activity',
        title: 'User Activity Patterns', 
        icon: <FiCalendar className="text-[#123458] text-xl" />,
        description: 'Engagement metrics and login frequency analysis'
      },
      { 
        id: 'user-demographics',
        title: 'User Demographics', 
        icon: <FiPieChart className="text-[#123458] text-xl" />,
        description: 'Geographical distribution and demographic analysis'
      }
    ],
    donationReports: [
      { 
        id: 'donation-volume',
        title: 'Donation Volume Trends', 
        icon: <FiTrendingUp className="text-[#123458] text-xl" />,
        description: 'Tracking donation quantities and frequency over time'
      },
      { 
        id: 'food-categories',
        title: 'Food Category Analysis', 
        icon: <FiPackage className="text-[#123458] text-xl" />,
        description: 'Breakdown of food types and categories donated'
      },
      { 
        id: 'expiration-analysis',
        title: 'Expiration Analysis', 
        icon: <FiCalendar className="text-[#123458] text-xl" />,
        description: 'Time between listing and expiration dates'
      },
      { 
        id: 'donation-efficiency',
        title: 'Donation Efficiency', 
        icon: <FiPieChart className="text-[#123458] text-xl" />,
        description: 'Time to claim, delivery rates, and waste prevention'
      }
    ],
    impactReports: [
      { 
        id: 'meals-provided',
        title: 'Meals Provided', 
        icon: <FiTrendingUp className="text-[#123458] text-xl" />,
        description: 'Estimates of total meals provided to those in need'
      },
      { 
        id: 'carbon-footprint',
        title: 'Carbon Footprint Reduction', 
        icon: <FiDollarSign className="text-[#123458] text-xl" />,
        description: 'Environmental impact of food waste reduction'
      },
      { 
        id: 'beneficiary-impact',
        title: 'Beneficiary Impact', 
        icon: <FiUsers className="text-[#123458] text-xl" />,
        description: 'How donations are affecting beneficiary organizations'
      },
      { 
        id: 'community-impact',
        title: 'Community Impact', 
        icon: <FiPieChart className="text-[#123458] text-xl" />,
        description: 'Overall impact on communities and economic benefits'
      }
    ]
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

    // Get date range from URL params
    const rangeParam = searchParams.get('range');
    if (rangeParam && dateRanges.some(range => range.id === rangeParam)) {
      setDateRange(rangeParam);
    }

    // Simulate API call
    setTimeout(() => {
      setReportData(mockReportData);
      setIsLoading(false);
    }, 1000);
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId, range: dateRange });
  };

  // Update URL when date range changes
  const handleDateRangeChange = (rangeId) => {
    setDateRange(rangeId);
    setSearchParams({ tab: activeTab, range: rangeId });
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {Array(6).fill().map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
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
          <h1 className="text-2xl font-bold text-[#123458] mb-6">Reports & Analytics</h1>
          
          {/* Tabs & Date Range Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div className="bg-white rounded-lg shadow-md overflow-x-auto mb-4 sm:mb-0">
              <div className="flex border-b">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-4 py-3 flex items-center hover:bg-gray-50 whitespace-nowrap ${
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
            
            <div className="bg-white rounded-lg shadow-md">
              <div className="flex">
                {dateRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => handleDateRangeChange(range.id)}
                    className={`px-3 py-2 text-sm hover:bg-gray-50 ${
                      dateRange === range.id 
                        ? 'bg-[#123458] text-white' 
                        : 'text-gray-600'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && reportData && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#123458]">Platform Overview</h2>
                  
                  <button className="flex items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                    <FiDownload className="mr-2" /> Export Data
                  </button>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                      <FiUsers className="text-[#123458]" />
                    </div>
                    <p className="text-2xl font-bold text-[#123458]">{reportData.overview.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">+{reportData.overview.userGrowth}% growth</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500">Total Donations</h3>
                      <FiPackage className="text-[#123458]" />
                    </div>
                    <p className="text-2xl font-bold text-[#123458]">{reportData.overview.totalDonations.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mt-1">{reportData.overview.activeDonations} active now</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500">Food Saved</h3>
                      <FiPieChart className="text-[#123458]" />
                    </div>
                    <p className="text-2xl font-bold text-[#123458]">{(reportData.overview.totalFoodWeight / 1000).toFixed(1)}t</p>
                    <p className="text-sm text-gray-600 mt-1">Total weight saved</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
                      <FiTrendingUp className="text-[#123458]" />
                    </div>
                    <p className="text-2xl font-bold text-[#123458]">{reportData.overview.successRate}%</p>
                    <p className="text-sm text-gray-600 mt-1">Delivery completion</p>
                  </div>
                </div>
                
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <ChartPlaceholder 
                    title="User Growth Trend" 
                    description="User growth visualization would appear here" 
                  />
                  <ChartPlaceholder 
                    title="Donation Volume Trend" 
                    description="Donation volume visualization would appear here" 
                  />
                </div>
                
                {/* Recent Activity */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#123458] mb-4">Recent Signups</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {reportData.overview.recentSignups.map((signup, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {signup.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                signup.role === 'donor' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : signup.role === 'beneficiary'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {signup.role.charAt(0).toUpperCase() + signup.role.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(signup.date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* User Reports Tab */}
            {activeTab === 'users' && reportData && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#123458]">User Reports</h2>
                  
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center px-4 py-2 bg-[#123458] text-white rounded hover:bg-opacity-90 text-sm">
                      <FiFilter className="mr-2" /> Filter
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                      <FiDownload className="mr-2" /> Export
                    </button>
                  </div>
                </div>
                
                {/* Available Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {reportData.userReports.map(report => (
                    <ReportCard
                      key={report.id}
                      title={report.title}
                      icon={report.icon}
                      description={report.description}
                      onClick={() => console.log(`Viewing report: ${report.id}`)}
                    />
                  ))}
                </div>
                
                {/* Report Preview */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#123458] mb-4">Report Preview</h3>
                  <p className="text-gray-600 mb-6">Select a report from above to view detailed analytics</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartPlaceholder 
                      title="User Growth by Type" 
                      description="Select a report to view its content" 
                    />
                    <ChartPlaceholder 
                      title="Geographical Distribution" 
                      description="Select a report to view its content" 
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Donation Reports Tab */}
            {activeTab === 'donations' && reportData && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#123458]">Donation Reports</h2>
                  
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center px-4 py-2 bg-[#123458] text-white rounded hover:bg-opacity-90 text-sm">
                      <FiFilter className="mr-2" /> Filter
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                      <FiDownload className="mr-2" /> Export
                    </button>
                  </div>
                </div>
                
                {/* Available Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {reportData.donationReports.map(report => (
                    <ReportCard
                      key={report.id}
                      title={report.title}
                      icon={report.icon}
                      description={report.description}
                      onClick={() => console.log(`Viewing report: ${report.id}`)}
                    />
                  ))}
                </div>
                
                {/* Report Preview */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#123458] mb-4">Report Preview</h3>
                  <p className="text-gray-600 mb-6">Select a report from above to view detailed analytics</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartPlaceholder 
                      title="Donation Categories" 
                      description="Select a report to view its content" 
                    />
                    <ChartPlaceholder 
                      title="Donation Timeline" 
                      description="Select a report to view its content" 
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Impact Reports Tab */}
            {activeTab === 'impact' && reportData && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#123458]">Impact Reports</h2>
                  
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center px-4 py-2 bg-[#123458] text-white rounded hover:bg-opacity-90 text-sm">
                      <FiFilter className="mr-2" /> Filter
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                      <FiDownload className="mr-2" /> Export
                    </button>
                  </div>
                </div>
                
                {/* Available Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {reportData.impactReports.map(report => (
                    <ReportCard
                      key={report.id}
                      title={report.title}
                      icon={report.icon}
                      description={report.description}
                      onClick={() => console.log(`Viewing report: ${report.id}`)}
                    />
                  ))}
                </div>
                
                {/* Report Preview */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#123458] mb-4">Report Preview</h3>
                  <p className="text-gray-600 mb-6">Select a report from above to view detailed analytics</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartPlaceholder 
                      title="Environmental Impact" 
                      description="Select a report to view its content" 
                    />
                    <ChartPlaceholder 
                      title="Community Benefits" 
                      description="Select a report to view its content" 
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Custom Reports Tab */}
            {activeTab === 'custom' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#123458]">Custom Report Builder</h2>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-[#123458] mb-4">Build Your Own Report</h3>
                  <p className="text-gray-600 mb-6">
                    Create customized reports by selecting metrics, time periods, and visualization types.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Report Type
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]">
                        <option value="user">User Analysis</option>
                        <option value="donation">Donation Analysis</option>
                        <option value="impact">Impact Analysis</option>
                        <option value="combined">Combined Metrics</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Metrics
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]">
                        <option value="growth">Growth Rate</option>
                        <option value="activity">Activity Levels</option>
                        <option value="volume">Volume & Quantity</option>
                        <option value="efficiency">Efficiency Metrics</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visualization
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]">
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                        <option value="pie">Pie Chart</option>
                        <option value="table">Data Table</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-[#123458] text-white rounded hover:bg-opacity-90">
                      Generate Report
                    </button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-[#123458]">Report Preview</h3>
                    <button className="flex items-center px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">
                      <FiDownload className="mr-1" /> Export
                    </button>
                  </div>
                  <p className="text-gray-600 mb-6">Generate a custom report to view it here</p>
                  
                  <div className="h-80 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Custom report visualization will appear here</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminReportsPage;