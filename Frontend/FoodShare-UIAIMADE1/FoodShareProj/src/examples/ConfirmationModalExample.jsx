import React, { useState } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';
import { FiTrash2, FiLogOut, FiCheck, FiShield } from 'react-icons/fi';

const ConfirmationModalExample = () => {
  // State for managing different modal states
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  
  // Mock action handlers
  const handleDelete = () => {
    setDeleteModalOpen(false);
    // In a real app, you would delete the resource here
    setTimeout(() => {
      alert('Donation deleted successfully!');
    }, 500);
  };

  const handleLogout = () => {
    setLogoutModalOpen(false);
    // In a real app, you would log the user out here
    setTimeout(() => {
      alert('You have been logged out successfully!');
    }, 500);
  };
  
  const handleApprove = () => {
    setApproveModalOpen(false);
    // In a real app, you would approve the resource here
    setTimeout(() => {
      alert('Donation approved successfully!');
    }, 500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Confirmation Modal Examples</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Delete Example */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Delete Confirmation</h2>
          <p className="text-gray-600 mb-4">
            Shows a confirmation dialog before deleting a donation.
          </p>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <FiTrash2 className="mr-2" /> Delete Donation
          </button>
          
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            title="Delete Donation"
            message="Are you sure you want to delete this donation? This action cannot be undone and all associated data will be permanently removed."
            onConfirm={handleDelete}
            onCancel={() => setDeleteModalOpen(false)}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            icon={FiTrash2}
            confirmButtonStyle="danger"
          />
        </div>
        
        {/* Logout Example */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Logout Confirmation</h2>
          <p className="text-gray-600 mb-4">
            Confirms that the user wants to log out of the application.
          </p>
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
          
          <ConfirmationModal
            isOpen={isLogoutModalOpen}
            title="Confirm Logout"
            message="Are you sure you want to log out of your account? Any unsaved changes will be lost."
            onConfirm={handleLogout}
            onCancel={() => setLogoutModalOpen(false)}
            confirmLabel="Logout"
            cancelLabel="Stay Logged In"
            icon={FiLogOut}
            confirmButtonStyle="primary"
            size="sm"
          />
        </div>
        
        {/* Approve Example */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Approve Donation</h2>
          <p className="text-gray-600 mb-4">
            Confirms approval of a donation request before processing.
          </p>
          <button
            onClick={() => setApproveModalOpen(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <FiCheck className="mr-2" /> Approve Request
          </button>
          
          <ConfirmationModal
            isOpen={isApproveModalOpen}
            title="Approve Donation Request"
            message="By approving this donation, you're confirming that the food meets our quality standards and will be made available to beneficiaries. Proceed?"
            onConfirm={handleApprove}
            onCancel={() => setApproveModalOpen(false)}
            confirmLabel="Approve"
            cancelLabel="Review Again"
            icon={FiShield}
            confirmButtonStyle="success"
            size="lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModalExample;
