import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NGONavbar from '../components/navbars/NGONavbar';
import authService from '../services/authService';

const NGOLayout = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in and has the correct role
    const user = authService.getCurrentUser();
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login');
    } else if (user.role !== 'ngo') {
      // Redirect to appropriate dashboard based on role
      navigate(`/dashboard/${user.role}`);
    }
  }, [navigate]);

  // Get the current user
  const user = authService.getCurrentUser();
  
  // Only render the layout if the user is an NGO
  if (!user || user.role !== 'ngo') {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-[#F1EFEC]">
      {/* NGO Navbar */}
      <div className="bg-[#123458] w-full fixed top-0 left-0 z-10 px-4 py-2">
        <NGONavbar />
      </div>

      {/* Main Content with top padding to account for fixed navbar */}
      <main className="container mx-auto p-6 pt-20">
        {children}
      </main>
    </div>
  );
};

export default NGOLayout;