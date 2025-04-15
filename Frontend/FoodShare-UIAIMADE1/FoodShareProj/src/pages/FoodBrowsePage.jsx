import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFilter, FiSearch, FiArrowLeft, FiMapPin, FiCalendar } from 'react-icons/fi';

// Import components
import FoodCard from '../components/FoodCard';
import ToastAlert from '../components/ToastAlert';
import ConfirmationModal from '../components/ConfirmationModal';

// Import services
import { fetchAvailableDonations, requestDonation } from '../services/donationService';

const FoodBrowsePage = () => {
  // State variables
  const [availableDonations, setAvailableDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    distance: '',
    expiryRange: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  // Categories for filter
  const categories = [
    'All Categories',
    'Vegetables',
    'Fruits',
    'Dairy',
    'Bakery',
    'Grains',
    'Beverages',
    'Canned Goods',
    'Snacks',
    'Prepared Meals',
    'Condiments',
    'Non-Veg'
  ];

  // Distance options
  const distanceOptions = [
    'Any Distance',
    'Less than 1 km',
    '1-5 km',
    '5-10 km',
    'More than 10 km'
  ];

  // Expiry ranges
  const expiryRanges = [
    'Any Time',
    'Today',
    'Within 3 days',
    'Within a week',
    'More than a week'
  ];

  // Fetch available donations on component mount
  useEffect(() => {
    const loadAvailableDonations = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call with filters
        // For now, we'll simulate the data
        
        // Mock data for available donations
        const mockDonations = [
          {
            id: 'don101',
            title: 'Fresh Organic Vegetables',
            type: 'Vegetables',
            quantity: '8',
            unit: 'kg',
            expiresAt: new Date(Date.now() + 4*24*60*60*1000).toISOString(), // 4 days from now
            status: 'Available',
            imageUrl: null,
            location: '123 Green St, Local City',
            donorName: 'Green Grocers',
            distance: '0.8 km'
          },
          {
            id: 'don102',
            title: 'Whole Grain Bread Loaves',
            type: 'Bakery',
            quantity: '5',
            unit: 'loaves',
            expiresAt: new Date(Date.now() + 2*24*60*60*1000).toISOString(), // 2 days from now
            status: 'Available',
            imageUrl: null,
            location: '456 Flour Ave, Local City',
            donorName: 'Daily Bread',
            distance: '1.2 km'
          },
          {
            id: 'don103',
            title: 'Milk and Yogurt Pack',
            type: 'Dairy',
            quantity: '10',
            unit: 'items',
            expiresAt: new Date(Date.now() + 3*24*60*60*1000).toISOString(), // 3 days from now
            status: 'Available',
            imageUrl: null,
            location: '789 Dairy Rd, Local City',
            donorName: 'Fresh Farms',
            distance: '3.5 km'
          },
          {
            id: 'don104',
            title: 'Mixed Fruit Basket',
            type: 'Fruits',
            quantity: '1',
            unit: 'basket',
            expiresAt: new Date(Date.now() + 5*24*60*60*1000).toISOString(), // 5 days from now
            status: 'Available',
            imageUrl: null,
            location: '321 Orchard Ln, Local City',
            donorName: 'Fruit Market',
            distance: '2.1 km'
          },
          {
            id: 'don105',
            title: 'Canned Soup Collection',
            type: 'Canned Goods',
            quantity: '12',
            unit: 'cans',
            expiresAt: new Date(Date.now() + 90*24*60*60*1000).toISOString(), // 90 days from now
            status: 'Available',
            imageUrl: null,
            location: '654 Pantry St, Local City',
            donorName: 'Community Pantry',
            distance: '4.7 km'
          },
          {
            id: 'don106',
            title: 'Rice and Pasta Pack',
            type: 'Grains',
            quantity: '3',
            unit: 'kg',
            expiresAt: new Date(Date.now() + 60*24*60*60*1000).toISOString(), // 60 days from now
            status: 'Available',
            imageUrl: null,
            location: '987 Grain Blvd, Local City',
            donorName: 'Food Bank',
            distance: '5.3 km'
          }
        ];
        
        // Apply any initial filters or search
        setAvailableDonations(mockDonations);
      } catch (error) {
        console.error('Error loading available donations:', error);
        setToastMessage('Failed to load available donations');
        setToastType('error');
        setShowToast(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAvailableDonations();
  }, []);

  // Apply filters and search to the donations
  const filteredDonations = availableDonations.filter(donation => {
    // Apply category filter
    if (filters.category && filters.category !== 'All Categories' && donation.type !== filters.category) {
      return false;
    }
    
    // Apply search query
    if (searchQuery && !donation.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !donation.donorName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !donation.type.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply distance filter - simplified for demo
    if (filters.distance === 'Less than 1 km') {
      if (parseFloat(donation.distance) >= 1) return false;
    } else if (filters.distance === '1-5 km') {
      const dist = parseFloat(donation.distance);
      if (dist < 1 || dist > 5) return false;
    } else if (filters.distance === '5-10 km') {
      const dist = parseFloat(donation.distance);
      if (dist < 5 || dist > 10) return false;
    } else if (filters.distance === 'More than 10 km') {
      if (parseFloat(donation.distance) <= 10) return false;
    }
    
    // Apply expiry filter - simplified for demo
    const today = new Date();
    const expiryDate = new Date(donation.expiresAt);
    const daysDiff = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (filters.expiryRange === 'Today') {
      if (daysDiff > 0) return false;
    } else if (filters.expiryRange === 'Within 3 days') {
      if (daysDiff > 3) return false;
    } else if (filters.expiryRange === 'Within a week') {
      if (daysDiff > 7) return false;
    } else if (filters.expiryRange === 'More than a week') {
      if (daysDiff <= 7) return false;
    }
    
    return true;
  });

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle request food
  const handleRequestFood = (donation) => {
    setSelectedDonation(donation);
    setShowConfirmModal(true);
  };

  // Confirm food request
  const confirmFoodRequest = async () => {
    try {
      setShowConfirmModal(false);
      
      // In a real app, this would call an API to request the donation
      // For now, we'll simulate the API call
      
      // Show loading toast
      setToastMessage('Processing your request...');
      setToastType('info');
      setShowToast(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the donation status in the local state
      setAvailableDonations(prevDonations => 
        prevDonations.map(donation => 
          donation.id === selectedDonation.id 
            ? { ...donation, status: 'Pending Approval' } 
            : donation
        )
      );
      
      // Show success toast
      setToastMessage(`Successfully requested ${selectedDonation.title}`);
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error requesting donation:', error);
      setToastMessage('Failed to process your request');
      setToastType('error');
      setShowToast(true);
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
      {showConfirmModal && selectedDonation && (
        <ConfirmationModal
          title="Confirm Food Request"
          message={`Are you sure you want to request "${selectedDonation.title}" from ${selectedDonation.donorName}?`}
          confirmText="Request Food"
          cancelText="Cancel"
          onConfirm={confirmFoodRequest}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      
      {/* Header with back button */}
      <header className="bg-[#123458] text-white py-4 px-6">
        <div className="container mx-auto">
          <div className="flex items-center mb-2">
            <Link to="/dashboard" className="text-white hover:text-opacity-80 mr-3">
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">Browse Available Food</h1>
          </div>
          <p className="text-sm text-gray-200">Find and request available food donations in your area</p>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-grow relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search for food, donors, categories..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
            >
              <FiFilter className="mr-2" /> Filters
            </button>
          </div>
          
          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Distance Filter */}
              <div>
                <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
                  Distance
                </label>
                <select
                  id="distance"
                  name="distance"
                  value={filters.distance}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent"
                >
                  {distanceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Expiry Filter */}
              <div>
                <label htmlFor="expiryRange" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Time
                </label>
                <select
                  id="expiryRange"
                  name="expiryRange"
                  value={filters.expiryRange}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent"
                >
                  {expiryRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
        
        {/* Results Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#123458]">
              {filteredDonations.length} {filteredDonations.length === 1 ? 'Result' : 'Results'}
            </h2>
            <div className="text-sm text-gray-500">
              Showing donations within your area
            </div>
          </div>
          
          {/* Food Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-8 bg-gray-200 rounded mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-gray-400 mb-3 text-5xl">😕</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No matching donations found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setFilters({
                    category: '',
                    distance: '',
                    expiryRange: ''
                  });
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonations.map(donation => (
                <div key={donation.id} className="flex flex-col bg-white rounded-lg shadow h-full">
                  {/* Food Image */}
                  <div className="h-40 w-full bg-[#D4C9BE] bg-opacity-30 rounded-t-lg"></div>
                  
                  {/* Food Info */}
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-semibold text-lg text-[#123458]">{donation.title}</h3>
                    <p className="text-sm text-gray-700 mb-1">From: {donation.donorName}</p>
                    
                    <div className="my-2 flex items-center text-sm text-gray-600">
                      <FiCalendar className="mr-1" /> 
                      <span>Expires: {new Date(donation.expiresAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <FiMapPin className="mr-1" /> 
                      <span>{donation.location} ({donation.distance})</span>
                    </div>
                    
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Quantity:</span> {donation.quantity} {donation.unit}
                    </div>
                    
                    <div className="mt-auto pt-4">
                      {donation.status === 'Available' ? (
                        <button
                          onClick={() => handleRequestFood(donation)}
                          className="w-full py-2 bg-[#123458] text-white rounded hover:bg-opacity-90 transition-colors"
                        >
                          Request Food
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
                        >
                          {donation.status}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FoodBrowsePage;
