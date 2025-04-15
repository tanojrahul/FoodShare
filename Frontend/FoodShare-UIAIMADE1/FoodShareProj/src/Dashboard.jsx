import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import role-specific dashboard components
import DonorDashboard from './dashboards/DonorDashboard';
import BeneficiaryDashboard from './dashboards/BeneficiaryDashboard';
import NGODashboard from './dashboards/NGODashboard';
import AdminDashboard from './dashboards/AdminDashboard';

// Mock Auth Service
const authService = {
  getCurrentUser: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          resolve(user);
        } else {
          reject({ message: 'No authenticated user found' });
        }
      }, 500);
    });
  }
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1EFEC] p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-700 mb-4">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-[#0a1c2e] transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1EFEC]">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 border-4 border-[#D4C9BE] border-t-[#123458] rounded-full"
    />
    <p className="mt-4 text-[#123458] font-medium">Loading your dashboard...</p>
  </div>
);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { role: urlRole } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        setError(err.message || 'Failed to authenticate user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // If still loading, show spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // If no authenticated user, redirect to login
  if (error || !user) {
    return <Navigate to="/login" replace />;
  }

  // Determine which dashboard to render based on user role or URL parameter
  const dashboardRole = urlRole || user.role;

  // Render the appropriate dashboard based on role
  const renderDashboard = () => {
    switch (dashboardRole.toLowerCase()) {
      case 'donor':
        return <DonorDashboard user={user} />;
      case 'beneficiary':
        return <BeneficiaryDashboard user={user} />;
      case 'ngo':
        return <NGODashboard user={user} />;
      case 'admin':
        return <AdminDashboard user={user} />;
      default:
        throw new Error(`Invalid user role: ${dashboardRole}`);
    }
  };

  // Wrap the dashboard in an error boundary
  return (
    <ErrorBoundary>
      {renderDashboard()}
    </ErrorBoundary>
  );
};

export default Dashboard;
