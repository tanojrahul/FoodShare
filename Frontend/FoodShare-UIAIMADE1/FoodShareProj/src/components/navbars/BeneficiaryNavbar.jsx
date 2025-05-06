import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiList, FiMapPin, FiBarChart2, FiClipboard,
  FiClock, FiStar, FiUsers, FiShoppingBag, FiLogOut
} from 'react-icons/fi';
import authService from '../../services/authService';

const BeneficiaryNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navLinks = [
    { 
      name: 'Home', 
      path: '/', 
      icon: <FiHome className="mr-2" /> 
    },
    { 
      name: 'Dashboard', 
      path: '/dashboard/beneficiary', 
      icon: <FiBarChart2 className="mr-2" /> 
    },
    { 
      name: 'Browse Food', 
      path: '/browse', 
      icon: <FiList className="mr-2" /> 
    },
    { 
      name: 'My Requests', 
      path: '/my-requests', 
      icon: <FiClipboard className="mr-2" /> 
    },
    { 
      name: 'My Claims', 
      path: '/my-claims', 
      icon: <FiShoppingBag className="mr-2" /> 
    },
    { 
      name: 'Track Donations', 
      path: '/donations/tracking', 
      icon: <FiMapPin className="mr-2" /> 
    },
    { 
      name: 'Request History', 
      path: '/request-history', 
      icon: <FiClock className="mr-2" /> 
    },
    { 
      name: 'My Reviews', 
      path: '/reviews', 
      icon: <FiStar className="mr-2" /> 
    },
    { 
      name: 'Community', 
      path: '/community', 
      icon: <FiUsers className="mr-2" /> 
    }
  ];

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="flex justify-between items-center w-full">
      {/* Desktop Navigation Links */}
      <div className="hidden md:flex md:items-center md:space-x-4 overflow-x-auto">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center
              ${location.pathname === link.path 
                ? 'bg-[#0a1c2e] text-white' 
                : 'text-gray-200 hover:bg-[#1a4979] hover:text-white transition-colors'
              }`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </div>

      {/* Logout Button - Desktop */}
      <div className="hidden md:block">
        <button
          onClick={handleLogout}
          className="px-3 py-2 rounded-md text-sm font-medium flex items-center text-gray-200 hover:bg-red-700 hover:text-white transition-colors"
        >
          <FiLogOut className="mr-2" />
          Logout
        </button>
      </div>

      {/* Mobile Navigation Links */}
      <div className="md:hidden space-y-1 w-full">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-3 py-2 rounded-md text-base font-medium flex items-center
              ${location.pathname === link.path
                ? 'bg-[#0a1c2e] text-white' 
                : 'text-gray-200 hover:bg-[#1a4979] hover:text-white transition-colors'
              }`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
        
        {/* Logout Button - Mobile */}
        <button
          onClick={handleLogout}
          className="block w-full px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-200 hover:bg-red-700 hover:text-white transition-colors mt-4"
        >
          <FiLogOut className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default BeneficiaryNavbar;