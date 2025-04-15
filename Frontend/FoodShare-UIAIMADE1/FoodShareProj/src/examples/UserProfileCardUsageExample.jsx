import React, { useState } from 'react';
import UserProfileCard from '../components/UserProfileCard';

const UserProfileCardUsageExample = () => {
  // Sample user data
  const [userData, setUserData] = useState({
    id: '123456',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'Donor',
    phone: '(555) 123-4567',
    address: '123 Food Ave, City, Country',
    bio: 'I am passionate about reducing food waste and helping those in need. As a restaurant owner, I believe we can make a big difference together.',
    verifiedUser: true,
    points: 2350,
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    stats: {
      donations: 27,
      received: 0,
      daysActive: 45
    }
  });

  // Handle profile updates
  const handleProfileUpdate = (updatedUser) => {
    console.log('Profile updated:', updatedUser);
    setUserData(prev => ({
      ...prev,
      ...updatedUser
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#123458] mb-6">Your Profile</h1>
      <UserProfileCard 
        user={userData}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default UserProfileCardUsageExample;
