import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiMap, FiCalendar, FiPhone, FiMapPin, FiClock, FiAlertCircle } from 'react-icons/fi';
import authService from '../services/authService';
import { getDonationTracking } from '../services/donationService';
import BeneficiaryLayout from '../layouts/BeneficiaryLayout';

// Status badge component
const StatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status.toLowerCase()) {
      case 'in transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready for pickup':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getBadgeStyle()}`}>
      {status}
    </span>
  );
};

// Timeline step component
const TimelineStep = ({ title, time, description, status, isLast }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500 animate-pulse';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="flex items-start">
      <div className="flex flex-col items-center mr-4">
        <div className={`rounded-full h-4 w-4 ${getStatusStyle()}`}></div>
        {!isLast && <div className="w-px h-full bg-gray-300 my-1"></div>}
      </div>
      <div className="pb-6">
        <div className="flex items-center">
          <h4 className="font-medium text-gray-900">{title}</h4>
          {time && <span className="ml-2 text-sm text-gray-500">{time}</span>}
        </div>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
    </div>
  );
};

// Donation tracking card component
const DonationTrackingCard = ({ donation }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Tracking ID: #{donation.id}</p>
            <h3 className="text-xl font-semibold text-[#123458]">{donation.title}</h3>
          </div>
          <StatusBadge status={donation.status} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center">
            <FiPackage className="text-[#123458] mr-2" />
            <span className="text-gray-700">{donation.quantity} {donation.unit}</span>
          </div>
          <div className="flex items-center">
            <FiCalendar className="text-[#123458] mr-2" />
            <span className="text-gray-700">Requested: {formatDate(donation.requestedAt)}</span>
          </div>
          <div className="flex items-center">
            <FiMapPin className="text-[#123458] mr-2" />
            <span className="text-gray-700">{donation.pickupLocation}</span>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <FiClock className="mr-2" /> Tracking Timeline
          </h4>
          <div className="ml-2">
            {donation.timeline.map((step, index) => (
              <TimelineStep
                key={index}
                title={step.title}
                time={step.time}
                description={step.description}
                status={step.status}
                isLast={index === donation.timeline.length - 1}
              />
            ))}
          </div>
        </div>
        
        {/* Contact Information */}
        {donation.contactInfo && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <FiPhone className="mr-2" /> Contact Information
            </h4>
            <p className="text-sm text-gray-600">
              {donation.contactInfo.name} • {donation.contactInfo.phone}
            </p>
          </div>
        )}
        
        {/* Map Preview Placeholder */}
        {donation.status !== 'completed' && donation.status !== 'cancelled' && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <FiMap className="mr-2" /> Pickup Location
            </h4>
            <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Map view would appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DonationTrackingPage = () => {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data as fallback
  const mockDonations = [
    {
      id: 'TRK-1234',
      title: 'Fresh Vegetables Assortment',
      quantity: 10,
      unit: 'kg',
      requestedAt: '2025-04-14T10:30:00Z',
      status: 'in transit',
      pickupLocation: 'Downtown Food Bank, 123 Main St',
      contactInfo: {
        name: 'John Donor',
        phone: '(555) 123-4567'
      },
      timeline: [
        {
          title: 'Request Submitted',
          time: 'Apr 14, 10:30 AM',
          description: 'Your request was received and is awaiting approval',
          status: 'completed'
        },
        {
          title: 'Request Approved',
          time: 'Apr 14, 2:15 PM',
          description: 'The donor has approved your request',
          status: 'completed'
        },
        {
          title: 'In Transit',
          time: 'Apr 16, 9:00 AM',
          description: 'Your donation is being prepared for delivery or pickup',
          status: 'current'
        },
        {
          title: 'Ready for Pickup',
          time: null,
          description: null,
          status: 'pending'
        },
        {
          title: 'Completed',
          time: null,
          description: null,
          status: 'pending'
        }
      ]
    },
    {
      id: 'TRK-5678',
      title: 'Bakery Items',
      quantity: 25,
      unit: 'items',
      requestedAt: '2025-04-10T14:45:00Z',
      status: 'completed',
      pickupLocation: 'Sunshine Bakery, 456 Oak Ave',
      contactInfo: {
        name: 'Maria Baker',
        phone: '(555) 987-6543'
      },
      timeline: [
        {
          title: 'Request Submitted',
          time: 'Apr 10, 2:45 PM',
          description: 'Your request was received and is awaiting approval',
          status: 'completed'
        },
        {
          title: 'Request Approved',
          time: 'Apr 10, 4:30 PM',
          description: 'The donor has approved your request',
          status: 'completed'
        },
        {
          title: 'In Transit',
          time: 'Apr 11, 10:15 AM',
          description: 'Your donation is being prepared for delivery or pickup',
          status: 'completed'
        },
        {
          title: 'Ready for Pickup',
          time: 'Apr 11, 2:00 PM',
          description: 'The donation is ready for pickup at the specified location',
          status: 'completed'
        },
        {
          title: 'Completed',
          time: 'Apr 11, 5:30 PM',
          description: 'The donation has been successfully delivered/picked up',
          status: 'completed'
        }
      ]
    },
    {
      id: 'TRK-9012',
      title: 'Canned Goods',
      quantity: 30,
      unit: 'cans',
      requestedAt: '2025-04-15T09:15:00Z',
      status: 'ready for pickup',
      pickupLocation: 'Community Pantry, 789 Elm St',
      contactInfo: {
        name: 'Sarah Thompson',
        phone: '(555) 234-5678'
      },
      timeline: [
        {
          title: 'Request Submitted',
          time: 'Apr 15, 9:15 AM',
          description: 'Your request was received and is awaiting approval',
          status: 'completed'
        },
        {
          title: 'Request Approved',
          time: 'Apr 15, 11:30 AM',
          description: 'The donor has approved your request',
          status: 'completed'
        },
        {
          title: 'In Transit',
          time: 'Apr 16, 1:45 PM',
          description: 'Your donation is being prepared for delivery or pickup',
          status: 'completed'
        },
        {
          title: 'Ready for Pickup',
          time: 'Apr 17, 9:00 AM',
          description: 'The donation is ready for pickup at the specified location',
          status: 'current'
        },
        {
          title: 'Completed',
          time: null,
          description: null,
          status: 'pending'
        }
      ]
    }
  ];

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        
        if (!currentUser) {
          throw new Error('You must be logged in to track donations');
        }
        
        // Fetch tracking data from API
        try {
          let response;
          if (currentUser.role === 'donor') {
            response = await getDonationTracking({ donorId: currentUser.id });
          } else {
            response = await getDonationTracking({ beneficiaryId: currentUser.id });
          }
          
          if (response && response.donations) {
            setDonations(response.donations);
          } else {
            console.log('Unexpected API response format:', response);
            setDonations(mockDonations);
          }
        } catch (apiError) {
          console.error('Error fetching tracking data from API:', apiError);
          setError(apiError.message || 'Failed to fetch tracking data');
          setDonations(mockDonations);
        }
      } catch (error) {
        console.error('Error fetching tracking data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrackingData();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <BeneficiaryLayout>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </BeneficiaryLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <BeneficiaryLayout>
        <h1 className="text-2xl font-bold text-[#123458] mb-6">Track Your Donations</h1>
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading tracking data</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FiPackage className="text-[#123458] text-5xl mx-auto mb-4" />
          <p className="text-gray-600 mb-6">Try refreshing the page or come back later.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Refresh Page
          </motion.button>
        </div>
      </BeneficiaryLayout>
    );
  }

  // No donations state
  if (donations.length === 0) {
    return (
      <BeneficiaryLayout>
        <h1 className="text-2xl font-bold text-[#123458] mb-6">Track Your Donations</h1>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FiPackage className="text-[#123458] text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No donations to track</h2>
          <p className="text-gray-600 mb-6">You haven't {user?.role === 'donor' ? 'made' : 'requested'} any donations yet.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = user?.role === 'donor' ? '/donations/create' : '/browse'}
            className="px-6 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            {user?.role === 'donor' ? 'Create Donation' : 'Browse Available Donations'}
          </motion.button>
        </div>
      </BeneficiaryLayout>
    );
  }

  return (
    <BeneficiaryLayout>
      <h1 className="text-2xl font-bold text-[#123458] mb-6">Track Your Donations</h1>
      
      {/* Donations Tracking List */}
      <div className="space-y-6">
        {donations.map(donation => (
          <DonationTrackingCard key={donation.id} donation={donation} />
        ))}
      </div>
    </BeneficiaryLayout>
  );
};

export default DonationTrackingPage;
