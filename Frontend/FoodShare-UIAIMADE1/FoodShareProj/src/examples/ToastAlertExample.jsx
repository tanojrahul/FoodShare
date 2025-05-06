import React, { useState } from 'react';
import ToastAlert from '../components/ToastAlert';
import { ToastProvider, useToast } from '../components/ToastContainer';

const ToastDemo = () => {
  const toast = useToast();
  
  const showSuccessToast = () => {
    toast.success('Donation successfully created!');
  };
  
  const showErrorToast = () => {
    toast.error('Failed to update profile. Please try again later.');
  };
  
  const showWarningToast = () => {
    toast.warning('Your donation is expiring in 24 hours.');
  };
  
  const showInfoToast = () => {
    toast.info('New food items are available in your area.');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <button
          onClick={showSuccessToast}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Show Success Toast
        </button>
        
        <button
          onClick={showErrorToast}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Show Error Toast
        </button>
        
        <button
          onClick={showWarningToast}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Show Warning Toast
        </button>
        
        <button
          onClick={showInfoToast}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Show Info Toast
        </button>
      </div>
    </div>
  );
};

// Individual Toast Examples
const IndividualToastExamples = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Individual Toast Components</h2>
      
      <div className="space-y-4">
        <button
          onClick={() => setShowSuccess(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Show Success Alert
        </button>
        
        {showSuccess && (
          <ToastAlert
            type="success"
            message="Donation successfully created!"
            onClose={() => setShowSuccess(false)}
            duration={3000}
          />
        )}
      </div>
      
      <div className="space-y-4">
        <button
          onClick={() => setShowError(true)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Show Error Alert
        </button>
        
        {showError && (
          <ToastAlert
            type="error"
            message="Failed to update profile. Please try again later."
            onClose={() => setShowError(false)}
            duration={3000}
          />
        )}
      </div>
      
      <div className="space-y-4">
        <button
          onClick={() => setShowWarning(true)}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Show Warning Alert
        </button>
        
        {showWarning && (
          <ToastAlert
            type="warning"
            message="Your donation is expiring in 24 hours."
            onClose={() => setShowWarning(false)}
            duration={3000}
          />
        )}
      </div>
      
      <div className="space-y-4">
        <button
          onClick={() => setShowInfo(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Show Info Alert
        </button>
        
        {showInfo && (
          <ToastAlert
            type="info"
            message="New food items are available in your area."
            onClose={() => setShowInfo(false)}
            duration={3000}
          />
        )}
      </div>
    </div>
  );
};

const ToastAlertExample = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Toast Alert Examples</h1>
      
      <div className="mb-12">
        <h2 className="text-lg font-medium mb-4">Toast Context API Example</h2>
        <ToastProvider>
          <ToastDemo />
        </ToastProvider>
      </div>
      
      <IndividualToastExamples />
    </div>
  );
};

export default ToastAlertExample;
