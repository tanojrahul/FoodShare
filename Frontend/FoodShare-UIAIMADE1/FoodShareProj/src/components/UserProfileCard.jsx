import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { 
  FiEdit, FiSave, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiAward, 
  FiShield, FiCheckCircle, FiSlash, FiUserCheck, FiUserX, FiSettings, FiAlertTriangle
} from 'react-icons/fi';

// Mock user service for API calls
const userService = {
  updateProfile: async (userId, updatedData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success (in a real app, this would be an API call)
    return {
      success: true,
      data: {
        ...updatedData,
        id: userId
      }
    };
  }
};

const UserProfileCard = ({ 
  user, 
  onProfileUpdate, 
  showActions = false, 
  onAction 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || ''
  });
  
  // Additional state for admin actions
  const [showAdminActions, setShowAdminActions] = useState(false);

  // Placeholder avatar if no image is provided
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await userService.updateProfile(user.id, formData);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        onProfileUpdate(result.data);
        
        // Reset form and exit edit mode after a short delay
        setTimeout(() => {
          setIsEditing(false);
          setSuccess(null);
        }, 1500);
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      bio: user?.bio || ''
    });
    setIsEditing(false);
    setError(null);
  };

  // Get the color based on user role
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'donor':
        return 'bg-blue-100 text-blue-800';
      case 'beneficiary':
        return 'bg-green-100 text-green-800';
      case 'ngo':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get the color based on user status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'pending verification':
        return 'bg-yellow-100 text-yellow-800';
      case 'disabled':
      case 'banned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle admin actions
  const handleAdminAction = (action) => {
    if (onAction) {
      onAction(action);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-[#F1EFEC] rounded-lg border border-[#D4C9BE] shadow-sm hover:shadow-md p-6 relative"
    >
      {/* Admin badge if showing admin actions */}
      {showActions && (
        <div className="absolute -top-2 -right-2">
          <span className="bg-[#123458] text-white text-xs px-2 py-1 rounded flex items-center">
            <FiShield className="mr-1" /> Admin View
          </span>
        </div>
      )}
      
      {/* Display mode */}
      {!isEditing ? (
        <div>
          <div className="flex items-center space-x-4">
            {/* Profile picture or avatar */}
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.name} 
                className="w-20 h-20 rounded-full object-cover border-2 border-[#123458]" 
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#123458] text-white flex items-center justify-center text-2xl font-bold">
                {getInitials(user?.name)}
              </div>
            )}
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#123458]">{user?.name}</h2>
              <div className="flex items-center mt-1 mb-2 space-x-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(user?.role)}`}>
                  {user?.role}
                </span>
                {user?.verifiedUser && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full flex items-center">
                    <FiCheckCircle className="mr-1" /> Verified
                  </span>
                )}
                {user?.status && (
                  <span className={`text-xs px-2 py-0.5 rounded-full flex items-center ${getStatusColor(user.status)}`}>
                    {user.status === 'Disabled' ? <FiSlash className="mr-1" /> : null}
                    {user.status}
                  </span>
                )}
              </div>
              
              {/* Quick stats / badges */}
              {user?.points !== undefined && (
                <div className="flex items-center text-sm text-gray-600">
                  <FiAward className="mr-1 text-[#123458]" />
                  <span>{user.points} Points</span>
                </div>
              )}
            </div>
            
            {/* Edit button - only show if not in admin view */}
            {!showActions && (
              <button 
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-full bg-[#D4C9BE] hover:bg-[#123458] text-[#123458] hover:text-white transition-colors"
                aria-label="Edit profile"
              >
                <FiEdit size={18} />
              </button>
            )}
            
            {/* Admin actions toggle button */}
            {showActions && (
              <button 
                onClick={() => setShowAdminActions(!showAdminActions)}
                className={`p-2 rounded-full ${showAdminActions ? 'bg-[#123458] text-white' : 'bg-[#D4C9BE] text-[#123458]'} hover:bg-[#123458] hover:text-white transition-colors`}
                aria-label="Admin actions"
              >
                <FiSettings size={18} />
              </button>
            )}
          </div>
          
          {/* User details */}
          <div className="mt-6 space-y-3 text-gray-700">
            <div className="flex items-center">
              <FiMail className="mr-3 text-[#123458]" />
              <span>{user?.email}</span>
            </div>
            
            {user?.phone && (
              <div className="flex items-center">
                <FiPhone className="mr-3 text-[#123458]" />
                <span>{user.phone}</span>
              </div>
            )}
            
            {user?.address && (
              <div className="flex items-start">
                <FiMapPin className="mr-3 mt-1 text-[#123458]" />
                <span>{user.address}</span>
              </div>
            )}
          </div>
          
          {/* User bio */}
          {user?.bio && (
            <div className="mt-6 pt-4 border-t border-[#D4C9BE]">
              <h3 className="text-sm font-medium text-[#123458] mb-2">About</h3>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          )}
          
          {/* Additional user stats */}
          {user?.stats && (
            <div className="mt-6 pt-4 border-t border-[#D4C9BE]">
              <h3 className="text-sm font-medium text-[#123458] mb-2">Activity</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-2 rounded text-center">
                  <div className="text-[#123458] font-bold">{user.stats.donations || 0}</div>
                  <div className="text-xs text-gray-600">Donations</div>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <div className="text-[#123458] font-bold">{user.stats.received || 0}</div>
                  <div className="text-xs text-gray-600">Received</div>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <div className="text-[#123458] font-bold">{user.stats.daysActive || 0}</div>
                  <div className="text-xs text-gray-600">Days Active</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Admin actions panel */}
          {showActions && showAdminActions && (
            <div className="mt-6 pt-4 border-t border-[#D4C9BE]">
              <h3 className="text-sm font-medium text-[#123458] mb-3 flex items-center">
                <FiShield className="mr-1" /> Administration Actions
              </h3>
              
              <div className="space-y-2">
                {/* Show different actions based on user status */}
                {user.status && user.status.toLowerCase() === 'pending verification' && (
                  <button
                    onClick={() => handleAdminAction('verify')}
                    className="w-full text-sm bg-green-600 text-white px-3 py-2 rounded flex items-center justify-center hover:bg-green-700"
                  >
                    <FiUserCheck className="mr-1" /> Verify User
                  </button>
                )}
                
                {user.status && user.status.toLowerCase() === 'active' && (
                  <button
                    onClick={() => handleAdminAction('disable')}
                    className="w-full text-sm bg-red-600 text-white px-3 py-2 rounded flex items-center justify-center hover:bg-red-700"
                  >
                    <FiUserX className="mr-1" /> Disable Account
                  </button>
                )}
                
                {user.status && user.status.toLowerCase() === 'disabled' && (
                  <button
                    onClick={() => handleAdminAction('enable')}
                    className="w-full text-sm bg-green-600 text-white px-3 py-2 rounded flex items-center justify-center hover:bg-green-700"
                  >
                    <FiUserCheck className="mr-1" /> Enable Account
                  </button>
                )}
                
                {/* Role management - shown for all users */}
                <div className="w-full">
                  <label className="block text-xs text-gray-700 mb-1">Change Role:</label>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleAdminAction('changeRole-donor')}
                      className={`text-xs px-3 py-1 rounded-md flex-1 ${user?.role?.toLowerCase() === 'donor' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                    >
                      Donor
                    </button>
                    <button 
                      onClick={() => handleAdminAction('changeRole-beneficiary')}
                      className={`text-xs px-3 py-1 rounded-md flex-1 ${user?.role?.toLowerCase() === 'beneficiary' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                    >
                      Beneficiary
                    </button>
                    <button 
                      onClick={() => handleAdminAction('changeRole-ngo')}
                      className={`text-xs px-3 py-1 rounded-md flex-1 ${user?.role?.toLowerCase() === 'ngo' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
                    >
                      NGO
                    </button>
                  </div>
                </div>
                
                {/* Points management */}
                <div className="w-full">
                  <label className="block text-xs text-gray-700 mb-1">Reward Points:</label>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleAdminAction('points-add')}
                      className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 flex-1"
                    >
                      + Add Points
                    </button>
                    <button 
                      onClick={() => handleAdminAction('points-remove')}
                      className="text-xs px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 flex-1"
                    >
                      - Remove Points
                    </button>
                  </div>
                </div>
                
                {/* Advanced actions */}
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <button
                    onClick={() => handleAdminAction('view-details')}
                    className="w-full text-sm bg-gray-600 text-white px-3 py-2 rounded flex items-center justify-center hover:bg-gray-700"
                  >
                    View Full Details
                  </button>
                  
                  <button
                    onClick={() => handleAdminAction('delete')}
                    className="w-full text-sm bg-red-100 text-red-800 px-3 py-2 mt-2 rounded flex items-center justify-center hover:bg-red-200"
                  >
                    <FiAlertTriangle className="mr-1" /> Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Edit mode
        <form onSubmit={handleSubmit}>
          {/* Avatar section in edit mode */}
          <div className="flex items-center space-x-4 mb-6">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.name} 
                className="w-20 h-20 rounded-full object-cover border-2 border-[#123458]" 
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#123458] text-white flex items-center justify-center text-2xl font-bold">
                {getInitials(formData.name)}
              </div>
            )}
            
            {/* Upload photo button - not fully implemented for brevity */}
            <button 
              type="button"
              className="text-sm text-[#123458] hover:underline"
            >
              Change photo
            </button>
          </div>
          
          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:ring-[#123458] focus:border-[#123458]"
                  placeholder="Your name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:ring-[#123458] focus:border-[#123458]"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:ring-[#123458] focus:border-[#123458]"
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:ring-[#123458] focus:border-[#123458]"
                  placeholder="123 Main St, City, Country"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#123458] focus:border-[#123458]"
                placeholder="Tell us a little about yourself..."
              ></textarea>
            </div>
          </div>
          
          {/* Error or success messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}
          
          {/* Form buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <FiX className="inline mr-1" /> Cancel
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-1" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

UserProfileCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    profileImage: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    bio: PropTypes.string,
    verifiedUser: PropTypes.bool,
    points: PropTypes.number,
    status: PropTypes.string,
    stats: PropTypes.shape({
      donations: PropTypes.number,
      received: PropTypes.number,
      daysActive: PropTypes.number
    })
  }).isRequired,
  onProfileUpdate: PropTypes.func,
  showActions: PropTypes.bool,
  onAction: PropTypes.func
};

UserProfileCard.defaultProps = {
  onProfileUpdate: () => {},
  showActions: false,
  onAction: () => {}
};

export default UserProfileCard;
