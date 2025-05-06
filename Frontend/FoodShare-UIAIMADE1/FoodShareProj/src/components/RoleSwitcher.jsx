import React from 'react';
import authService from '../services/authService';

/**
 * A development component to test different user roles
 * Only use in development mode!
 */
const RoleSwitcher = () => {
  const handleRoleChange = (role) => {
    authService.mockLoginAs(role);
    // Force a reload to update the navbar
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-2 rounded-lg shadow-lg border border-gray-300">
      <div className="text-xs text-gray-500 mb-1 font-medium">Dev Tools: Switch Role</div>
      <div className="flex space-x-1">
        <button
          onClick={() => handleRoleChange('admin')}
          className="px-2 py-1 text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 rounded"
        >
          Admin
        </button>
        <button
          onClick={() => handleRoleChange('donor')}
          className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded"
        >
          Donor
        </button>
        <button
          onClick={() => handleRoleChange('beneficiary')}
          className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-800 rounded"
        >
          Beneficiary
        </button>
        <button
          onClick={() => handleRoleChange('ngo')}
          className="px-2 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded"
        >
          NGO
        </button>
        <button
          onClick={() => authService.logout()}
          className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-800 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default RoleSwitcher;