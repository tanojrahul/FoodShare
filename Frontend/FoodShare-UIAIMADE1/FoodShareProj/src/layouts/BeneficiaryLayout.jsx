import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BeneficiaryNavbar from '../components/navbars/BeneficiaryNavbar';
import NGONavbar from '../components/navbars/NGONavbar';
import authService from '../services/authService';

const BeneficiaryLayout = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const user = authService.getCurrentUser();
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login');
    } else if (user.role && !['beneficiary', 'ngo'].includes(user.role.toLowerCase())) {
      // Redirect to appropriate dashboard if not beneficiary or NGO
      navigate(`/dashboard/${user.role}`);
    }
  }, [navigate]);

  // Get the current user
  const user = authService.getCurrentUser();
  
  // Only render the layout if the user is a beneficiary or NGO
  if (!user || (user.role && !['beneficiary', 'ngo'].includes(user.role.toLowerCase()))) {
    return null; // Don't render anything while redirecting
  }

  // Determine which navbar to show based on user role
  const Navbar = user.role.toLowerCase() === 'ngo' ? NGONavbar : BeneficiaryNavbar;

  return (
    <div className="min-h-screen bg-[#F1EFEC]">
      {/* Dynamic Navbar based on role */}
      <div className="bg-[#123458] w-full fixed top-0 left-0 z-10 px-4 py-2">
        <Navbar />
      </div>

      {/* Main Content with top padding to account for fixed navbar */}
      <main className="container mx-auto p-6 pt-20">
        {children}
      </main>
    </div>
  );
};

export default BeneficiaryLayout;