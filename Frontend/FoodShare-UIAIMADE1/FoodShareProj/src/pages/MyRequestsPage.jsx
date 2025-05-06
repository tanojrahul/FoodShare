import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiExternalLink, FiFilter, FiSearch } from 'react-icons/fi';
import StatusBadge from '../components/StatusBadge';
import authService from '../services/authService';
import BeneficiaryLayout from '../layouts/BeneficiaryLayout';
import { fetchBeneficiaryData, getBeneficiaryRequests, getClaimedDonations } from '../services/donationService';

const MyRequestsPage = ({ type = 'requests' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Determine page title and other UI text based on type
  const getPageTitle = () => {
    switch(type) {
      case 'claims':
        return 'My Claims';
      case 'history':
        return 'Request History';
      default:
        return 'My Requests';
    }
  };

  const getPageDescription = () => {
    switch(type) {
      case 'claims':
        return 'View and manage all your claimed food donations in one place.';
      case 'history':
        return 'View your past food donation requests and their outcomes.';
      default:
        return 'View and manage all your food donation requests in one place.';
    }
  };

  const getEmptyStateMessage = () => {
    switch(type) {
      case 'claims':
        return "You haven't claimed any food donations yet";
      case 'history':
        return "You don't have any request history yet";
      default:
        return "You haven't made any food donation requests yet";
    }
  };

  // Status options for filtering - different for claims vs requests
  const statusOptions = type === 'claims' 
    ? ['all', 'Pending', 'In Transit', 'Ready for Pickup', 'Completed'] 
    : ['all', 'Pending', 'Approved', 'In Transit', 'Completed', 'Declined'];

  // Mock data for fallback
  const mockRequests = [
    {
      id: 'req1',
      title: 'Fresh Vegetables Assortment',
      donorName: 'Green Grocers',
      quantity: '5 kg',
      status: 'Approved',
      requestedAt: '2025-04-14T10:30:00Z',
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      location: '123 Green St, Local City'
    },
    {
      id: 'req2',
      title: 'Bakery Items',
      donorName: 'Daily Bread',
      quantity: '10 items',
      status: 'In Transit',
      requestedAt: '2025-04-16T14:45:00Z',
      expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      location: '456 Flour Ave, Local City',
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    },
    {
      id: 'req3',
      title: 'Canned Goods',
      donorName: 'Community Pantry',
      quantity: '15 cans',
      status: 'Completed',
      requestedAt: '2025-04-10T09:15:00Z',
      completedAt: '2025-04-11T14:30:00Z',
      location: '789 Pantry St, Local City'
    },
    {
      id: 'req4',
      title: 'Dairy Products',
      donorName: 'Fresh Farms',
      quantity: '3 items',
      status: 'Pending',
      requestedAt: '2025-04-17T11:20:00Z',
      location: '234 Milk Road, Local City'
    },
    {
      id: 'req5',
      title: 'Fruit Basket',
      donorName: 'Orchard Co-op',
      quantity: '2 kg',
      status: 'Declined',
      requestedAt: '2025-04-12T16:45:00Z',
      declinedAt: '2025-04-13T10:15:00Z',
      location: '567 Apple Lane, Local City',
      declineReason: 'Items already claimed by another beneficiary'
    }
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        
        if (!currentUser) {
          throw new Error('You must be logged in to view your ' + (type === 'claims' ? 'claims' : 'requests'));
        }
        
        if (!['beneficiary', 'ngo'].includes(currentUser.role.toLowerCase())) {
          throw new Error('Only beneficiaries and NGOs can view donation ' + (type === 'claims' ? 'claims' : 'requests'));
        }
        
        // Fetch data based on the page type
        try {
          let response;
          
          if (type === 'claims') {
            // Fetch claims
            response = await getClaimedDonations(currentUser.id);
            
            // Check if response has the expected structure
            if (response && response.donations) {
              setRequests(response.donations);
              setFilteredRequests(response.donations);
            } else {
              console.log('Unexpected API response format for claims:', response);
              // Fallback to mock data
              setRequests(mockRequests);
              setFilteredRequests(mockRequests);
            }
          } else {
            // Fetch requests
            response = await getBeneficiaryRequests(currentUser.id);
            
            // Check if response has the expected structure
            if (response && response.requests) {
              setRequests(response.requests);
              setFilteredRequests(response.requests);
            } else {
              console.log('Unexpected API response format for requests:', response);
              // Fallback to mock data
              setRequests(mockRequests);
              setFilteredRequests(mockRequests);
            }
          }
        } catch (apiError) {
          console.error(`Error fetching ${type} from API:`, apiError);
          setError(apiError.message || `Failed to fetch ${type}`);
          // Fallback to mock data
          setRequests(mockRequests);
          setFilteredRequests(mockRequests);
        }
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type]);

  // Filter and search
  useEffect(() => {
    let result = requests;

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.title?.toLowerCase().includes(term) ||
        item.donorName?.toLowerCase().includes(term) ||
        item.location?.toLowerCase().includes(term)
      );
    }

    setFilteredRequests(result);
  }, [statusFilter, searchTerm, requests]);

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <BeneficiaryLayout>
      {/* Hero Banner */}
      <div className="bg-[#123458] text-white py-12 -mt-6 -mx-6 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{getPageTitle()}</h1>
          <p className="text-white/80 max-w-2xl">
            {getPageDescription()}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white shadow-md py-4 mb-6 rounded-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by food name, donor, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              <FiFilter className="mr-2" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col mr-6">
                  <label className="text-sm text-gray-600 mb-1">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(status => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1 text-sm rounded-full ${
                          statusFilter === status
                            ? 'bg-[#123458] text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {status === 'all' ? 'All' : status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#123458]">
            {isLoading ? 'Loading...' : `${filteredRequests.length} ${type === 'claims' ? 'Claims' : 'Requests'}`}
          </h2>
        </div>

        {/* Requests List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map(request => (
              <div key={request.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[#123458]">{request.title}</h3>
                      <p className="text-sm text-gray-600">From: {request.donorName}</p>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center">
                      <span className="text-gray-700">{request.quantity}</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="text-[#123458] mr-2" />
                      <span className="text-gray-700">
                        {type === 'claims' ? 'Claimed' : 'Requested'}: {formatDate(request.requestedAt || request.claimedAt)}
                      </span>
                    </div>
                    {request.completedAt && (
                      <div className="flex items-center">
                        <span className="text-gray-700">Completed: {formatDate(request.completedAt)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
                    <Link
                      to={`/donations/${request.donationId || request.id}`}
                      className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center"
                    >
                      <FiExternalLink className="mr-2" />
                      View Details
                    </Link>

                    {request.status === 'In Transit' && (
                      <Link
                        to={`/track/${request.donationId || request.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-opacity-90 transition-colors"
                      >
                        Track Delivery
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-[#123458] text-5xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No {type === 'claims' ? 'claims' : 'requests'} found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters or search terms'
                : getEmptyStateMessage()}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link
                to="/browse"
                className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors inline-block"
              >
                Browse Available Donations
              </Link>
            )}
          </div>
        )}
      </div>
    </BeneficiaryLayout>
  );
};

export default MyRequestsPage;