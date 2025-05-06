import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiPackage, FiPieChart, FiSettings,
  FiBarChart2, FiUsers, FiFileText, FiHelpCircle, FiLogOut
} from 'react-icons/fi';
import authService from '../../services/authService';

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navLinks = [
    { 
      name: 'Home', 
      path: '/', 
      icon: <FiHome className="mr-2" /> 
    },
    { 
      name: 'Admin Dashboard', 
      path: '/dashboard/admin', 
      icon: <FiBarChart2 className="mr-2" /> 
    },
    { 
      name: 'Admin Panel', 
      path: '/admin', 
      icon: <FiSettings className="mr-2" /> 
    },
    { 
      name: 'Users', 
      path: '/admin?tab=users', 
      icon: <FiUsers className="mr-2" /> 
    },
    { 
      name: 'Donations', 
      path: '/admin?tab=donations', 
      icon: <FiPackage className="mr-2" /> 
    },
    { 
      name: 'Reports', 
      path: '/admin/reports', 
      icon: <FiFileText className="mr-2" /> 
    },
    { 
      name: 'Impact', 
      path: '/impact', 
      icon: <FiPieChart className="mr-2" /> 
    },
    { 
      name: 'Support', 
      path: '/admin/support', 
      icon: <FiHelpCircle className="mr-2" /> 
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
              ${location.pathname === link.path || 
                (link.path.includes('?tab=') && location.pathname === link.path.split('?')[0])
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
              ${location.pathname === link.path ||
                (link.path.includes('?tab=') && location.pathname === link.path.split('?')[0])
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

export default AdminNavbar;