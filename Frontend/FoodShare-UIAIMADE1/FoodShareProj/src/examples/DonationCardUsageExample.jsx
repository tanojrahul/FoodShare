import React, { useState } from 'react';
import DonationCard from '../components/DonationCard';

const DonationCardUsageExample = () => {
  // Sample donation data
  const [donations, setDonations] = useState([
    {
      id: '1',
      title: 'Fresh Vegetables',
      type: 'Vegetables',
      quantity: '5',
      unit: 'kg',
      expiresAt: '2023-06-15',
      status: 'Pending',
      donor: 'Green Grocers',
      location: '123 Main St, City',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3'
    },
    {
      id: '2',
      title: 'Rice Bags',
      type: 'Grains',
      quantity: '10',
      unit: 'bags',
      expiresAt: '2024-01-20',
      status: 'In Transit',
      donor: 'Food Co-op',
      location: '456 Oak Ave, Town',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3'
    },
    {
      id: '3',
      title: 'Canned Soup',
      type: 'Canned Goods',
      quantity: '24',
      unit: 'cans',
      expiresAt: '2023-12-30',
      status: 'Completed',
      donor: 'Local Pantry',
      location: '789 Elm St, Village',
      imageUrl: null
    }
  ]);

  // Handler functions
  const handleAccept = async (donationId) => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update donation status
    setDonations(prevDonations => 
      prevDonations.map(donation => 
        donation.id === donationId 
          ? { ...donation, status: 'Accepted' } 
          : donation
      )
    );
    
    console.log(`Accepted donation ${donationId}`);
  };

  const handleReject = async (donationId) => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update donation status
    setDonations(prevDonations => 
      prevDonations.map(donation => 
        donation.id === donationId 
          ? { ...donation, status: 'Rejected' } 
          : donation
      )
    );
    
    console.log(`Rejected donation ${donationId}`);
  };

  const handleTrack = (donationId) => {
    console.log(`Tracking donation ${donationId}`);
    // Navigate to tracking page (in a real app)
    // navigate(`/track/${donationId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#123458] mb-6">Your Donations</h1>
      
      <div className="space-y-4">
        {/* Loading state example */}
        <DonationCard isLoading={true} />
        
        {/* Actual donations */}
        {donations.map(donation => (
          <DonationCard
            key={donation.id}
            donation={donation}
            onAccept={handleAccept}
            onReject={handleReject}
            onTrack={handleTrack}
            userRole="beneficiary"
          />
        ))}
      </div>
    </div>
  );
};

export default DonationCardUsageExample;
