import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiGift, // Donor
  FiHome, // Beneficiary
  FiUsers, // NGO
  FiShield // Admin
} from 'react-icons/fi';

const roleInfo = [
  {
    id: 'donor',
    name: 'Donor',
    icon: <FiGift className="text-2xl" />,
    description: 'Share surplus food with those in need. Restaurants, grocery stores, and individuals can donate excess food.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'beneficiary',
    name: 'Beneficiary',
    icon: <FiHome className="text-2xl" />,
    description: 'Receive food donations for individuals, families, or community organizations in need.',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'ngo',
    name: 'NGO',
    icon: <FiUsers className="text-2xl" />,
    description: 'Connect donors with beneficiaries and help facilitate food distribution in your community.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'admin',
    name: 'Admin',
    icon: <FiShield className="text-2xl" />,
    description: 'Manage the platform, users, and operations (requires special authorization).',
    color: 'from-red-500 to-red-600'
  }
];

const RoleSelector = ({ onSelectRole, onBack, initialRole = null }) => {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [error, setError] = useState('');
  
  const handleContinue = () => {
    if (!selectedRole) {
      setError('Please select a role to continue');
      return;
    }
    onSelectRole(selectedRole);
  };
  
  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setError('');
  };
  
  return (
    <div className="max-w-md mx-auto bg-[#F1EFEC] p-8 rounded-xl shadow-md">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          {onBack && (
            <button 
              onClick={onBack} 
              className="mr-4 text-[#123458] hover:text-[#0a1c2e] transition-colors"
              aria-label="Go back"
            >
              <FiArrowLeft size={20} />
            </button>
          )}
          <h2 className="text-2xl font-bold text-[#123458]">Select Your Role</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Choose the role that best describes how you'll use FoodShare. This determines which features you'll have access to.
        </p>
        
        <div className="space-y-4">
          {roleInfo.map((role) => (
            <motion.div
              key={role.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect(role.id)}
              className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
                selectedRole === role.id 
                  ? 'ring-2 ring-[#123458]' 
                  : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-start p-4 bg-white">
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center 
                  bg-gradient-to-b ${role.color} text-white shadow-sm
                `}>
                  {role.icon}
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium text-lg text-[#123458]">
                      {role.name}
                    </h3>
                    <div className="ml-auto">
                      <div className={`w-5 h-5 rounded-full border ${
                        selectedRole === role.id 
                          ? 'border-[#123458] bg-[#123458]' 
                          : 'border-gray-300'
                      }`}>
                        {selectedRole === role.id && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {role.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {error && (
          <p className="text-red-500 mt-4 text-sm">{error}</p>
        )}
        
        <div className="mt-8">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            className="w-full py-3 px-4 bg-[#123458] hover:bg-opacity-90 text-white rounded-lg font-medium transition-colors duration-300"
          >
            Continue
          </motion.button>
          
          {onBack && (
            <button 
              onClick={onBack}
              className="w-full mt-3 text-center text-gray-600 hover:text-[#123458] transition-colors py-2 text-sm"
            >
              Go Back
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelector;
