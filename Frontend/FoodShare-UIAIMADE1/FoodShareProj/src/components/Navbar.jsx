import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiLogOut, FiMenu, FiX, FiHeart
} from 'react-icons/fi';

// Import role-specific navbars
import AdminNavbar from './navbars/AdminNavbar';
import DonorNavbar from './navbars/DonorNavbar';
import BeneficiaryNavbar from './navbars/BeneficiaryNavbar';
import NGONavbar from './navbars/NGONavbar';

// Import auth service and the auth change event
import authService, { AUTH_EVENT } from '../services/authService';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get current user on mount and listen for auth state changes
  useEffect(() => {
    // Set initial user
    setUser(authService.getCurrentUser());
    
    // Listen for auth state changes
    const handleAuthChange = (event) => {
      setUser(event.detail); // event.detail contains the user data or null
    };
    
    // Listen for both storage events (from other tabs) and our custom auth event
    window.addEventListener('storage', () => setUser(authService.getCurrentUser()));
    window.addEventListener(AUTH_EVENT, handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', () => setUser(authService.getCurrentUser()));
      window.removeEventListener(AUTH_EVENT, handleAuthChange);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  // Render the appropriate navbar based on user role
  const renderRoleBasedNavbar = () => {
    if (!user) {
      return (
        <>
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center
                ${location.pathname === '/' 
                  ? 'bg-[#0a1c2e] text-white' 
                  : 'text-gray-200 hover:bg-[#1a4979] hover:text-white transition-colors'
                }`}
            >
              Home
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center
                ${location.pathname === '/'
                  ? 'bg-[#0a1c2e] text-white' 
                  : 'text-gray-200 hover:bg-[#1a4979] hover:text-white transition-colors'
                }`}
            >
              Home
            </Link>
          </div>
        </>
      );
    }

    switch(user.role.toLowerCase()) {
      case 'admin':
        return <AdminNavbar />;
      case 'donor':
        return <DonorNavbar />;
      case 'beneficiary':
        return <BeneficiaryNavbar />;
      case 'ngo':
        return <NGONavbar />;
      default:
        return (
          <>
            {/* Default Navigation for unknown roles */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center
                  ${location.pathname === '/' 
                    ? 'bg-[#0a1c2e] text-white' 
                    : 'text-gray-200 hover:bg-[#1a4979] hover:text-white transition-colors'
                  }`}
              >
                Home
              </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center
                  ${location.pathname === '/'
                    ? 'bg-[#0a1c2e] text-white' 
                    : 'text-gray-200 hover:bg-[#1a4979] hover:text-white transition-colors'
                  }`}
              >
                Home
              </Link>
            </div>
          </>
        );
    }
  };

  return (
    <nav className="bg-[#123458] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <FiHeart className="h-6 w-6 text-[#D4C9BE]" />
              <span className="ml-2 text-xl font-bold">FoodShare</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:justify-between flex-grow ml-6">
            {/* If user is logged in, render only the role-specific navbar */}
            {user ? (
              <div className="flex w-full justify-between">
                {renderRoleBasedNavbar()}
              </div>
            ) : (
              <>
                {/* For non-authenticated users, render basic navbar with login/register links */}
                <div className="flex space-x-4">
                  {renderRoleBasedNavbar()}
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium flex items-center text-gray-200 hover:bg-[#1a4979] hover:text-white transition-colors"
                  >
                    <FiUser className="mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 rounded-md text-sm font-medium flex items-center text-gray-200 hover:bg-[#1a4979] hover:text-white transition-colors"
                  >
                    <FiHeart className="mr-2" />
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-[#1a4979] focus:outline-none"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-[#123458] border-t border-[#1a4979]">
              {/* Mobile user info */}
              {user && (
                <div className="px-3 py-2 text-white font-medium border-b border-[#1a4979] mb-2">
                  Welcome, {user.name}
                </div>
              )}
              
              {/* Render role-specific navigation links or login/register links based on authentication */}
              {user ? (
                renderRoleBasedNavbar()
              ) : (
                <>
                  {renderRoleBasedNavbar()}
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-200 hover:bg-[#1a4979] hover:text-white transition-colors"
                  >
                    <FiUser className="mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-200 hover:bg-[#1a4979] hover:text-white transition-colors"
                  >
                    <FiHeart className="mr-2" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
