import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch, FiCheckSquare, FiAlertCircle, FiDownload } from 'react-icons/fi';
import DonorLayout from '../layouts/DonorLayout';
import DonationCard from '../components/DonationCard';
import authService from '../services/authService';
import { getCompletedDonationsByDonor } from '../services/donationService';

const CompletedDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [error, setError] = useState(null);

  // Demo data while API is not complete
  const demoData = [
    {
      id: 'd3',
      title: 'Canned Food Drive Surplus',
      description: 'Various canned goods including beans, soups, and vegetables.',
      quantity: 48,
      unit: 'cans',
      status: 'Completed',
      imageUrl: 'https://images.unsplash.com/photo-1584263347416-85a696b4eda7?auto=format&fit=crop&w=400&h=250',
      createdAt: '2025-04-05T11:15:00',
      completedAt: '2025-04-08T14:30:00',
      expiresAt: '2026-04-05T00:00:00',
      location: 'Community Center',
      foodType: 'Canned Goods',
      category: 'Non-perishable',
      recipientName: 'Family Support Center',
      recipientContact: 'contact@familysupport.org',
      recipientPhone: '(555) 123-4567',
      pickupDetails: 'Picked up by volunteer John Smith',
      impactStats: {
        mealsProvided: 120,
        peopleHelped: 40,
        carbonSaved: 10
      }
    },
    {
      id: 'd6',
      title: 'Rice and Pasta Bulk Donation',
      description: 'Unopened packages of rice, pasta, and other grains from our monthly inventory surplus.',
      quantity: 75,
      unit: 'kg',
      status: 'Completed',
      imageUrl: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=400&h=250',
      createdAt: '2025-03-15T10:30:00',
      completedAt: '2025-03-17T13:15:00',
      expiresAt: '2026-03-15T00:00:00',
      location: 'Metro Grocery Distribution Center',
      foodType: 'Grains',
      category: 'Non-perishable',
      recipientName: 'Community Food Bank',
      recipientContact: 'operations@communityfoodbank.org',
      recipientPhone: '(555) 234-5678',
      pickupDetails: 'Delivered to recipient location',
      impactStats: {
        mealsProvided: 250,
        peopleHelped: 85,
        carbonSaved: 25
      }
    },
    {
      id: 'd7',
      title: 'Fresh Dairy Products',
      description: 'Assorted dairy products including milk, yogurt, and cheese approaching sell-by date but still fresh.',
      quantity: 30,
      unit: 'kg',
      status: 'Completed',
      imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&h=250',
      createdAt: '2025-04-01T09:45:00',
      completedAt: '2025-04-01T16:00:00',
      expiresAt: '2025-04-05T00:00:00',
      location: 'Fresh Farms Market',
      foodType: 'Dairy',
      category: 'Perishable',
      recipientName: 'Youth Shelter',
      recipientContact: 'coordinator@youthshelter.org',
      recipientPhone: '(555) 345-6789',
      pickupDetails: 'Emergency same-day pickup',
      impactStats: {
        mealsProvided: 80,
        peopleHelped: 25,
        carbonSaved: 15
      }
    },
    {
      id: 'd8',
      title: 'Restaurant Weekend Leftovers',
      description: 'Prepared foods from our weekend service, properly stored and refrigerated.',
      quantity: 15,
      unit: 'meals',
      status: 'Completed',
      imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&h=250',
      createdAt: '2025-03-22T22:00:00',
      completedAt: '2025-03-23T10:30:00',
      expiresAt: '2025-03-25T00:00:00',
      location: 'Bella Restaurant',
      foodType: 'Prepared Meals',
      category: 'Ready to Eat',
      recipientName: 'Homeless Outreach Program',
      recipientContact: 'outreach@homelesshelp.org',
      recipientPhone: '(555) 456-7890',
      pickupDetails: 'Picked up in temperature-controlled containers',
      impactStats: {
        mealsProvided: 15,
        peopleHelped: 15,
        carbonSaved: 5
      }
    },
    {
      id: 'd9',
      title: 'School Cafeteria Surplus',
      description: 'Unused food items from our school cafeteria before spring break.',
      quantity: 40,
      unit: 'kg',
      status: 'Completed',
      imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&h=250',
      createdAt: '2025-03-25T15:30:00',
      completedAt: '2025-03-26T14:00:00',
      expiresAt: '2025-04-05T00:00:00',
      location: 'Lincoln High School',
      foodType: 'Mixed Items',
      category: 'Mixed',
      recipientName: 'Family Crisis Center',
      recipientContact: 'services@crisiscenter.org',
      recipientPhone: '(555) 567-8901',
      pickupDetails: 'Distributed to multiple families in need',
      impactStats: {
        mealsProvided: 120,
        peopleHelped: 35,
        carbonSaved: 18
      }
    }
  ];

  useEffect(() => {
    const fetchCompletedDonations = async () => {
      setIsLoading(true);
      try {
        // Check if user is authenticated and is a donor
        const user = authService.getCurrentUser();
        if (!user || user.role !== 'donor') {
          throw new Error('You must be logged in as a donor to view completed donations');
        }

        // Try to get completed donations from the API
        // If the API call fails, use demo data
        try {
          const data = await getCompletedDonationsByDonor(user.id);
          setDonations(data);
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

    fetchCompletedDonations();
  }, []);

  // Filter and sort donations
  const getFilteredAndSortedDonations = () => {
    let filtered = [...donations];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(donation => 
        donation.title.toLowerCase().includes(term) ||
        donation.description.toLowerCase().includes(term) ||
        donation.recipientName.toLowerCase().includes(term) ||
        donation.foodType?.toLowerCase().includes(term) ||
        donation.category?.toLowerCase().includes(term)
      );
    }

    // Sort
    switch (sortBy) {
      case 'date_desc':
        filtered.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
        break;
      case 'date_asc':
        filtered.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
        break;
      case 'impact_desc':
        filtered.sort((a, b) => (b.impactStats?.mealsProvided || 0) - (a.impactStats?.mealsProvided || 0));
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredDonations = getFilteredAndSortedDonations();

  // Calculate total impact
  const totalImpact = donations.reduce((acc, donation) => {
    return {
      mealsProvided: acc.mealsProvided + (donation.impactStats?.mealsProvided || 0),
      peopleHelped: acc.peopleHelped + (donation.impactStats?.peopleHelped || 0),
      carbonSaved: acc.carbonSaved + (donation.impactStats?.carbonSaved || 0)
    };
  }, { mealsProvided: 0, peopleHelped: 0, carbonSaved: 0 });

  return (
    <DonorLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123458] mb-4 md:mb-0">
            Completed Donations
          </h1>
          
          <button 
            className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center"
            onClick={() => alert('Download functionality would be implemented here')}
          >
            <FiDownload className="mr-2" />
            Download Report
          </button>
        </div>
        
        {/* Filter and Search Bar */}
        <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search completed donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#123458] pl-10"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-2">
            <FiFilter className="text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="impact_desc">Highest Impact</option>
              <option value="name_asc">Name (A-Z)</option>
            </select>
          </div>
        </div>
        
        {/* Impact Stats Section */}
        {!isLoading && !error && donations.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-bold text-[#123458] mb-3">Your Total Impact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{totalImpact.mealsProvided}</div>
                <div className="text-sm text-gray-600">Meals Provided</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totalImpact.peopleHelped}</div>
                <div className="text-sm text-gray-600">People Helped</div>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-teal-600">{totalImpact.carbonSaved} kg</div>
                <div className="text-sm text-gray-600">CO₂ Saved</div>
              </div>
            </div>
          </div>
        )}
        
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
                  Error loading completed donations
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="text-center py-12">
            <FiCheckSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No completed donations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? 'No completed donations match your search criteria.' 
                : 'You don\'t have any completed donations yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDonations.map(donation => (
              <div key={donation.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                      <div className="relative h-48 w-full sm:w-48 rounded-md overflow-hidden">
                        <img 
                          src={donation.imageUrl} 
                          alt={donation.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{donation.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 mb-2">
                        Completed on {new Date(donation.completedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric'
                        })}
                      </p>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-700">{donation.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Quantity</p>
                          <p className="text-sm font-medium">{donation.quantity} {donation.unit}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Category</p>
                          <p className="text-sm font-medium">{donation.category}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Type</p>
                          <p className="text-sm font-medium">{donation.foodType}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs text-gray-500">Recipient</p>
                        <p className="text-sm font-medium">{donation.recipientName}</p>
                      </div>
                      
                      {donation.impactStats && (
                        <div className="mt-3 bg-gray-50 p-3 rounded-md">
                          <p className="text-xs font-medium text-gray-700 mb-2">Impact</p>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <p className="text-xs text-gray-500">Meals</p>
                              <p className="text-sm font-medium text-green-600">{donation.impactStats.mealsProvided}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">People</p>
                              <p className="text-sm font-medium text-blue-600">{donation.impactStats.peopleHelped}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">CO₂ Saved</p>
                              <p className="text-sm font-medium text-teal-600">{donation.impactStats.carbonSaved} kg</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DonorLayout>
  );
};

export default CompletedDonationsPage;