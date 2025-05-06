import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch, FiInbox, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';
import DonorLayout from '../layouts/DonorLayout';
import StatusBadge from '../components/StatusBadge';
import authService from '../services/authService';
import { getDonationRequests, approveDonationRequest, rejectDonationRequest } from '../services/donationService';

const DonationRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);

  // Demo data while API is not complete
  const demoData = [
    {
      id: 'req1',
      donationId: 'd1',
      donationTitle: 'Fresh Vegetables Assortment',
      requesterId: 'b1',
      requesterName: 'Community Shelter',
      requesterType: 'organization',
      notes: 'We serve meals to approximately 50 people daily and would greatly appreciate these vegetables for our kitchen.',
      status: 'pending',
      createdAt: '2025-04-15T09:22:00',
      imageUrl: 'https://images.unsplash.com/photo-1466551294549-a6e231c02a78?auto=format&fit=crop&w=400&h=250',
    },
    {
      id: 'req2',
      donationId: 'd4',
      donationTitle: 'Organic Fruit Box',
      requesterId: 'b2',
      requesterName: 'Family Support Center',
      requesterType: 'organization',
      notes: 'Our center supports families in need and we currently have 15 families who could benefit from fresh fruit.',
      status: 'pending',
      createdAt: '2025-04-19T14:15:00',
      imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&h=250',
    },
    {
      id: 'req3',
      donationId: 'd2',
      donationTitle: 'Bakery Surplus',
      requesterId: 'b3',
      requesterName: 'Harbor Shelter',
      requesterType: 'organization',
      notes: 'We would like to provide baked goods for our morning meal service. We can pick up at the specified location.',
      status: 'approved',
      createdAt: '2025-04-13T10:45:00',
      approvedAt: '2025-04-13T15:30:00',
      imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=400&h=250',
    },
    {
      id: 'req4',
      donationId: 'd5',
      donationTitle: 'Restaurant Meal Surplus',
      requesterId: 'b4',
      requesterName: 'Youth Center',
      requesterType: 'organization',
      notes: 'We have an after-school program and would like to provide a hot meal for the children today.',
      status: 'approved',
      createdAt: '2025-04-20T15:45:00',
      approvedAt: '2025-04-20T16:10:00',
      imageUrl: 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=400&h=250',
    },
    {
      id: 'req5',
      donationId: 'd1',
      donationTitle: 'Fresh Vegetables Assortment',
      requesterId: 'b5',
      requesterName: 'Hope Kitchen',
      requesterType: 'organization',
      notes: 'We prepare meals for our local homeless community and would greatly benefit from fresh produce.',
      status: 'rejected',
      createdAt: '2025-04-16T11:20:00',
      rejectedAt: '2025-04-16T17:05:00',
      rejectionReason: 'Already promised to another organization.',
      imageUrl: 'https://images.unsplash.com/photo-1466551294549-a6e231c02a78?auto=format&fit=crop&w=400&h=250',
    }
  ];

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        // Check if user is authenticated and is a donor
        const user = authService.getCurrentUser();
        if (!user || user.role !== 'donor') {
          throw new Error('You must be logged in as a donor to view donation requests');
        }

        // Try to get requests from the API
        // If the API call fails, use demo data
        try {
          const response = await getDonationRequests(user.id);
          // Check if the response has the expected structure with requests array
          if (response && response.requests) {
            setRequests(response.requests);
          } else {
            // Handle unexpected response format
            console.log('Unexpected API response format:', response);
            // Fallback to demo data
            setRequests(demoData);
          }
        } catch (apiError) {
          console.log('Using demo data due to API error:', apiError);
          // Use demo data
          setRequests(demoData);
        }

      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle approve request
  const handleApprove = async (requestId) => {
    setProcessing(requestId);
    try {
      await approveDonationRequest(requestId);
      // Update the local state
      setRequests(prevRequests => prevRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: 'approved', approvedAt: new Date().toISOString() } 
          : request
      ));
    } catch (error) {
      console.error('Error approving request:', error);
      // For demo purposes, still update the UI
      setRequests(prevRequests => prevRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: 'approved', approvedAt: new Date().toISOString() } 
          : request
      ));
    } finally {
      setProcessing(null);
    }
  };

  // Handle reject request
  const handleReject = async (requestId) => {
    setProcessing(requestId);
    try {
      await rejectDonationRequest(requestId);
      // Update the local state
      setRequests(prevRequests => prevRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: 'rejected', rejectedAt: new Date().toISOString() } 
          : request
      ));
    } catch (error) {
      console.error('Error rejecting request:', error);
      // For demo purposes, still update the UI
      setRequests(prevRequests => prevRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: 'rejected', rejectedAt: new Date().toISOString() } 
          : request
      ));
    } finally {
      setProcessing(null);
    }
  };

  // Filter requests based on status and search term
  const getFilteredRequests = () => {
    let filtered = requests;

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(request => request.status === filter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(request => 
        request.donationTitle.toLowerCase().includes(term) ||
        request.requesterName.toLowerCase().includes(term) ||
        request.notes.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  return (
    <DonorLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123458] mb-4 md:mb-0">
            Donation Requests
          </h1>
        </div>
        
        {/* Filter and Search Bar */}
        <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#123458] pl-10"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-2">
            <FiFilter className="text-gray-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-200 h-40 rounded-lg w-full"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading donation requests
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <FiInbox className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter !== 'all' 
                ? `You don't have any ${filter} requests.` 
                : searchTerm 
                  ? 'No requests match your search criteria.' 
                  : 'You haven\'t received any donation requests yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRequests.map(request => (
              <div key={request.id} className="bg-white rounded-lg shadow-md overflow-hidden p-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  {/* Image */}
                  <div className="mb-4 sm:mb-0 sm:mr-6 sm:flex-shrink-0">
                    <div className="relative h-40 w-full sm:w-40 sm:h-40 rounded-md overflow-hidden">
                      <img 
                        src={request.imageUrl} 
                        alt={request.donationTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{request.donationTitle}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Requested by: <span className="font-medium">{request.requesterName}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(request.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <StatusBadge 
                        status={request.status.charAt(0).toUpperCase() + request.status.slice(1)} 
                        color={getStatusBadgeColor(request.status)}
                      />
                    </div>
                    
                    <div className="mt-3 sm:mt-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Request Notes:</span> {request.notes}
                      </p>
                      
                      {request.status === 'rejected' && request.rejectionReason && (
                        <p className="mt-2 text-sm text-red-600">
                          <span className="font-medium">Rejection Reason:</span> {request.rejectionReason}
                        </p>
                      )}
                    </div>
                    
                    {/* Action Buttons - only show for pending requests */}
                    {request.status === 'pending' && (
                      <div className="mt-4 sm:mt-6 flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleApprove(request.id)}
                          disabled={processing === request.id}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processing === request.id ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing
                            </span>
                          ) : (
                            <>
                              <FiCheck className="mr-2" />
                              Approve Request
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleReject(request.id)}
                          disabled={processing === request.id}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processing === request.id ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing
                            </span>
                          ) : (
                            <>
                              <FiX className="mr-2" />
                              Reject Request
                            </>
                          )}
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Stats Section */}
        {!isLoading && !error && requests.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold text-yellow-600">
                {requests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-xl font-bold text-green-600">
                {requests.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-xl font-bold text-red-600">
                {requests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </DonorLayout>
  );
};

export default DonationRequestsPage;