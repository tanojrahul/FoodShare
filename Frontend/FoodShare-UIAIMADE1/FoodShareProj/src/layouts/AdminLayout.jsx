import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/navbars/AdminNavbar';
import authService from '../services/authService';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in and has the correct role
    const user = authService.getCurrentUser();
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login');
    } else if (user.role !== 'admin') {
      // Redirect to appropriate dashboard based on role
      navigate(`/dashboard/${user.role}`);
    }
  }, [navigate]);

  // Get the current user
  const user = authService.getCurrentUser();
  
  // Only render the layout if the user is an admin
  if (!user || user.role !== 'admin') {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-[#F1EFEC]">
      {/* Admin Navbar */}
      <div className="bg-[#123458] w-full fixed top-0 left-0 z-10 px-4 py-2">
        <AdminNavbar />
      </div>

      {/* Main Content with top padding to account for fixed navbar */}
      <main className="container mx-auto p-6 pt-20">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;