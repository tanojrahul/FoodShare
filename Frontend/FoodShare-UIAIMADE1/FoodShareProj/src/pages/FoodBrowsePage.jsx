import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch, FiAlertCircle } from 'react-icons/fi';
import FoodCard from '../components/FoodCard';
import authService from '../services/authService';
import { fetchAvailableDonations, requestDonation } from '../services/donationService';
import ToastAlert from '../components/ToastAlert';
import BeneficiaryLayout from '../layouts/BeneficiaryLayout';

const FoodBrowsePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    total: 0
  });
  const [filterParams, setFilterParams] = useState({
    category: '',
    distance: '',
    expiryRange: ''
  });
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null
  });

  const foodTypes = ['all', 'Vegetables', 'Fruits', 'Bakery', 'Dairy', 'Grains', 'Canned'];

  // Get user location if they allow it
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Error getting location:", error.message);
        }
      );
    }
  }, []);

  // Fetch available donations from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Prepare query parameters
        const params = {
          page: pagination.page,
          limit: pagination.limit
        };

        // Add category filter if selected
        if (selectedType !== 'all') {
          params.category = selectedType;
        }

        // Add location parameters if available
        if (location.latitude && location.longitude) {
          params.latitude = location.latitude;
          params.longitude = location.longitude;
        }

        // Add other filters
        if (filterParams.distance) {
          params.distance = filterParams.distance;
        }
        
        if (filterParams.expiryRange) {
          params.expiryRange = filterParams.expiryRange;
        }

        console.log('Making API request with params:', params);
        
        // Call the API service
        const response = await fetchAvailableDonations(params);
        
        // Debug logs
        console.log('API raw response:', response);
        
        // Handle the case where response might be undefined or null
        if (!response) {
          console.error('API response is undefined or null');
          setToast({
            type: 'error',
            message: 'Failed to get a response from the server'
          });
          setFoodItems([]);
          setFilteredItems([]);
          return;
        }
        
        // Check if response has the expected structure with donations array
        if (response.donations && Array.isArray(response.donations)) {
          console.log('Found donations array with length:', response.donations.length);
          
          // Map donation items to ensure they have all required fields
          const processedDonations = response.donations.map(donation => {
            // Create a copy to avoid mutating the original
            const processedDonation = { ...donation };
            
            // Ensure status field exists and is capitalized for consistent display
            if (!processedDonation.status) {
              processedDonation.status = 'Available';
            }
            
            // Ensure donation has a type field for filtering
            if (!processedDonation.type && processedDonation.category) {
              processedDonation.type = processedDonation.category;
            } else if (!processedDonation.type) {
              processedDonation.type = "Other";
            }
            
            // Ensure donation has a unit field
            if (!processedDonation.unit && processedDonation.quantity) {
              processedDonation.unit = 'items';
            }
            
            return processedDonation;
          });
          
          console.log('Processed donations:', processedDonations);
          
          setFoodItems(processedDonations);
          setFilteredItems(processedDonations);
          
          // Update pagination information
          setPagination({
            ...pagination,
            total: response.total || response.donations.length,
            totalPages: response.totalPages || Math.ceil(response.donations.length / pagination.limit)
          });
        } else {
          console.warn('Unexpected API response format:', response);
          
          // Try to handle case where response might be the donations array directly
          if (Array.isArray(response)) {
            console.log('Response is an array, treating as donations array');
            const processedDonations = response.map(donation => {
              return {
                ...donation,
                status: donation.status || 'Available',
                type: donation.type || donation.category || 'Other',
                unit: donation.unit || 'items'
              };
            });
            
            setFoodItems(processedDonations);
            setFilteredItems(processedDonations);
            setPagination({
              ...pagination,
              total: response.length,
              totalPages: Math.ceil(response.length / pagination.limit)
            });
          } else {
            setToast({
              type: 'warning',
              message: 'Received unexpected data format from server'
            });
            setFoodItems([]);
            setFilteredItems([]);
          }
        }
      } catch (error) {
        console.error('Error fetching available donations:', error);
        setToast({
          type: 'error',
          message: `Failed to load donations: ${error.message}`
        });
        setFoodItems([]);
        setFilteredItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Get current user
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    fetchData();
  }, [pagination.page, pagination.limit, selectedType, filterParams, location]);

  // Additional filter for search term is applied client-side
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = foodItems.filter(item => 
        item.title?.toLowerCase().includes(term) || 
        item.type?.toLowerCase().includes(term) ||
        item.location?.toLowerCase().includes(term) ||
        item.donorName?.toLowerCase().includes(term)
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(foodItems);
    }
  }, [searchTerm, foodItems]);

  // Request food item handler
  const handleRequestFood = async (foodId) => {
    if (!user) {
      setToast({
        type: 'error',
        message: 'Please log in to request food donations'
      });
      return;
    }

    try {
      // Use our API service to request the donation
      const response = await requestDonation(foodId, user.id);
      
      setToast({
        type: 'success',
        message: 'Donation request submitted successfully!'
      });
      
      // Refresh the list to update statuses
      const updatedList = foodItems.filter(item => item.id !== foodId);
      setFoodItems(updatedList);
      setFilteredItems(updatedList);
      
    } catch (error) {
      console.error('Error requesting donation:', error);
      setToast({
        type: 'error',
        message: `Failed to request donation: ${error.message}`
      });
    }
  };

  // Handle pagination change
  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage
    });
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilterParams({
      ...filterParams,
      [filterType]: value
    });
    // Reset to first page when changing filters
    setPagination({
      ...pagination,
      page: 1
    });
  };

  return (
    <BeneficiaryLayout>
      {/* Toast notification */}
      {toast && (
        <ToastAlert
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Hero Banner */}
      <div className="bg-[#123458] text-white py-12 -mt-6 -mx-6 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Available Food Donations</h1>
          <p className="text-white/80 max-w-2xl">
            Browse available food donations in your area. Request items you need for your community or organization.
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
                placeholder="Search by food type, name, or location..."
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
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t"
            >
              <div className="flex flex-wrap gap-3">
                {/* Food Type Filter */}
                <div className="flex flex-col mr-6">
                  <label className="text-sm text-gray-600 mb-1">Food Type</label>
                  <div className="flex flex-wrap gap-2">
                    {foodTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-3 py-1 text-sm rounded-full ${
                          selectedType === type
                            ? 'bg-[#123458] text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Distance Filter - Only show if we have location */}
                {location.latitude && location.longitude && (
                  <div className="flex flex-col mr-6">
                    <label className="text-sm text-gray-600 mb-1">Distance (km)</label>
                    <select 
                      value={filterParams.distance}
                      onChange={(e) => handleFilterChange('distance', e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]"
                    >
                      <option value="">Any distance</option>
                      <option value="5">Within 5 km</option>
                      <option value="10">Within 10 km</option>
                      <option value="25">Within 25 km</option>
                      <option value="50">Within 50 km</option>
                    </select>
                  </div>
                )}
                
                {/* Expiry Range Filter */}
                <div className="flex flex-col mr-6">
                  <label className="text-sm text-gray-600 mb-1">Expiration</label>
                  <select 
                    value={filterParams.expiryRange}
                    onChange={(e) => handleFilterChange('expiryRange', e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]"
                  >
                    <option value="">Any time</option>
                    <option value="today">Expiring today</option>
                    <option value="week">Within a week</option>
                    <option value="month">Within a month</option>
                    <option value="noExpiry">No expiration</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div>
        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#123458]">
            {isLoading ? 'Loading donations...' : `${pagination.total} Available Donations`}
          </h2>
        </div>
        
        {/* Food Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Show skeleton loaders while loading
            Array.from({ length: 6 }).map((_, index) => (
              <FoodCard key={index} isLoading={true} />
            ))
          ) : filteredItems.length > 0 ? (
            // Show actual food items
            filteredItems.map(food => (
              <FoodCard 
                key={food.id} 
                food={food} 
                onClick={() => handleRequestFood(food.id)}
              />
            ))
          ) : (
            // No results found
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-gray-600 mb-2">No donations found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1}
                className={`px-3 py-1 rounded-md ${
                  pagination.page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#123458] text-white hover:bg-opacity-90'
                }`}
              >
                Previous
              </button>
              
              {/* Page number buttons */}
              {[...Array(pagination.totalPages).keys()].map((pageNum) => (
                <button
                  key={pageNum + 1}
                  onClick={() => handlePageChange(pageNum + 1)}
                  className={`px-3 py-1 rounded-md ${
                    pagination.page === pageNum + 1
                      ? 'bg-[#123458] text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {pageNum + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                disabled={pagination.page === pagination.totalPages}
                className={`px-3 py-1 rounded-md ${
                  pagination.page === pagination.totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#123458] text-white hover:bg-opacity-90'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </BeneficiaryLayout>
  );
};

export default FoodBrowsePage;
