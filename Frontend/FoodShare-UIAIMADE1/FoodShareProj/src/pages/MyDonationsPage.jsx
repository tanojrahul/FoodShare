import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiPlus, FiSearch, FiPackage, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import DonorLayout from '../layouts/DonorLayout';
import DonationCard from '../components/DonationCard';
import StatusBadge from '../components/StatusBadge';
import authService from '../services/authService';
import { getDonationsByDonor } from '../services/donationService';

const MyDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Demo data while API is not complete
  const demoData = [
    {
      id: 'd1',
      title: 'Fresh Vegetables Assortment',
      description: 'Assortment of fresh vegetables including carrots, tomatoes, and lettuce.',
      quantity: 10,
      unit: 'kg',
      status: 'Available',
      imageUrl: 'https://images.unsplash.com/photo-1466551294549-a6e231c02a78?auto=format&fit=crop&w=400&h=250',
      createdAt: '2025-04-10T14:48:00',
      expiresAt: '2025-04-30T00:00:00',
      location: 'Downtown Food Bank',
      foodType: 'Vegetables',
      category: 'Perishable',
      nutritionalInfo: 'Rich in vitamins and minerals',
      allergens: 'None',
      storageInstructions: 'Keep refrigerated',
      requestCount: 2
    },
    {
      id: 'd2',
      title: 'Bakery Surplus',
      description: 'Fresh bread, muffins, and pastries from today\'s baking.',
      quantity: 24,
      unit: 'items',
      status: 'Pending',
      imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=400&h=250',
      createdAt: '2025-04-12T09:30:00',
      expiresAt: '2025-04-15T00:00:00',
      location: 'Sunrise Bakery',
      foodType: 'Bakery',
      category: 'Perishable',
      nutritionalInfo: 'Contains wheat, dairy',
      allergens: 'Wheat, dairy, may contain nuts',
      storageInstructions: 'Store in a cool, dry place',
      requestCount: 1,
      recipientName: 'Harbor Shelter'
    },
    {
      id: 'd3',
      title: 'Canned Food Drive Surplus',
      description: 'Various canned goods including beans, soups, and vegetables.',
      quantity: 48,
      unit: 'cans',
      status: 'Completed',
      imageUrl: 'https://images.unsplash.com/photo-1584263347416-85a696b4eda7?auto=format&fit=crop&w=400&h=250',
      createdAt: '2025-04-05T11:15:00',
      expiresAt: '2026-04-05T00:00:00',
      location: 'Community Center',
      foodType: 'Canned Goods',
      category: 'Non-perishable',
      nutritionalInfo: 'Varies by item',
      allergens: 'See individual cans for details',
      storageInstructions: 'Store in a cool, dry place',
      requestCount: 3,
      recipientName: 'Family Support Center',
      completedDate: '2025-04-08T14:30:00'
    },
    {
      id: 'd4',
      title: 'Organic Fruit Box',
      description: 'Box of assorted organic fruits including apples, bananas, and berries.',
      quantity: 15,
      unit: 'kg',
      status: 'Available',
      imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&h=250',
      createdAt: '2025-04-18T13:20:00',
      expiresAt: '2025-04-25T00:00:00',
      location: 'Green Earth Market',
      foodType: 'Fruits',
      category: 'Perishable',
      nutritionalInfo: 'High in vitamins and fiber',
      allergens: 'None known',
      storageInstructions: 'Refrigerate upon receipt',
      requestCount: 0
    },
    {
      id: 'd5',
      title: 'Restaurant Meal Surplus',
      description: 'Prepared meals from today\'s lunch service. Various dishes available.',
      quantity: 20,
      unit: 'meals',
      status: 'In Transit',
      imageUrl: 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=400&h=250',
      createdAt: '2025-04-20T15:00:00',
      expiresAt: '2025-04-21T15:00:00',
      location: 'The Garden Restaurant',
      foodType: 'Prepared Meals',
      category: 'Ready to Eat',
      nutritionalInfo: 'Balanced meals with protein, carbs, and vegetables',
      allergens: 'May contain gluten, dairy, nuts',
      storageInstructions: 'Keep refrigerated, reheat thoroughly before serving',
      requestCount: 1,
      recipientName: 'Youth Center'
    }
  ];

  useEffect(() => {
    const fetchDonations = async () => {
      setIsLoading(true);
      try {
        // Check if user is authenticated and is a donor
        const user = authService.getCurrentUser();
        if (!user || user.role !== 'donor') {
          throw new Error('You must be logged in as a donor to view donations');
        }

        // Try to get donations from the API
        // If the API call fails, use demo data
        try {
          const response = await getDonationsByDonor(user.id);
          // Check if the response has the expected structure with donations array
          if (response && response.donations) {
            setDonations(response.donations);
          } else {
            // Handle unexpected response format
            console.log('Unexpected API response format:', response);
            // Fallback to demo data
            setDonations(demoData);
          }
        } catch (apiError) {
          console.log('Using demo data due to API error:', apiError);
          // Use demo data
          setDonations(demoData);
        }

      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Filter donations based on status
  const getFilteredDonations = () => {
    let filtered = donations;

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(donation => 
        donation.status.toLowerCase() === filter.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(donation => 
        donation.title.toLowerCase().includes(term) ||
        donation.description.toLowerCase().includes(term) ||
        donation.foodType?.toLowerCase().includes(term) ||
        donation.category?.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const filteredDonations = getFilteredDonations();

  return (
    <DonorLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123458] mb-4 md:mb-0">
            My Donations
          </h1>
          
          <Link to="/donations/create">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center"
            >
              <FiPlus className="mr-2" />
              Create New Donation
            </motion.button>
          </Link>
        </div>
        
        {/* Filter and Search Bar */}
        <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search donations..."
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
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="in transit">In Transit</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-200 h-60 rounded-lg w-full"></div>
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
                  Error loading donations
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="text-center py-12">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No donations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter !== 'all' 
                ? `You don't have any ${filter.toLowerCase()} donations.` 
                : searchTerm 
                  ? 'No donations match your search criteria.' 
                  : 'You haven\'t created any donations yet.'}
            </p>
            <div className="mt-6">
              <Link
                to="/donations/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-[#123458] hover:bg-opacity-90"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                Create a donation
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDonations.map(donation => (
              <div key={donation.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <DonationCard 
                  donation={donation}
                  showStatus={true}
                  showActions={true}
                  linkTo={`/donations/${donation.id}`}
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Stats Section */}
        {!isLoading && !error && donations.length > 0 && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Total Donations</p>
              <p className="text-xl font-bold text-[#123458]">{donations.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-xl font-bold text-green-600">
                {donations.filter(d => d.status === 'Available').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-xl font-bold text-yellow-600">
                {donations.filter(d => d.status === 'Pending' || d.status === 'In Transit').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-xl font-bold text-blue-600">
                {donations.filter(d => d.status === 'Completed').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </DonorLayout>
  );
};

export default MyDonationsPage;