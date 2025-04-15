import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiList, FiPackage, FiPieChart, FiUser, 
  FiLogOut, FiMenu, FiX, FiHeart, FiMapPin, FiSettings 
} from 'react-icons/fi';

// Mock Auth Service
const authService = {
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user')) || null;
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get current user on mount and when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(authService.getCurrentUser());
    };

    // Set initial user
    setUser(authService.getCurrentUser());
    
    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
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

  // Define navigation links based on user role
  const getNavLinks = () => {
    const commonLinks = [
      { 
        name: 'Home', 
        path: '/', 
        icon: <FiHome className="mr-2" /> 
      }
    ];

    if (!user) {
      return [
        ...commonLinks,
        { 
          name: 'Login', 
          path: '/login', 
          icon: <FiUser className="mr-2" /> 
        },
        { 
          name: 'Register', 
          path: '/register', 
          icon: <FiHeart className="mr-2" /> 
        }
      ];
    }

    switch(user.role) {
      case 'admin':
        return [
          ...commonLinks,
          { 
            name: 'Admin Panel', 
            path: '/admin', 
            icon: <FiSettings className="mr-2" /> 
          },
          { 
            name: 'Users', 
            path: '/admin?tab=users', 
            icon: <FiUser className="mr-2" /> 
          },
          { 
            name: 'Donations', 
            path: '/admin?tab=donations', 
            icon: <FiPackage className="mr-2" /> 
          },
          { 
            name: 'Impact', 
            path: '/impact', 
            icon: <FiPieChart className="mr-2" /> 
          }
        ];
        
      case 'donor':
        return [
          ...commonLinks,
          { 
            name: 'Dashboard', 
            path: '/dashboard/donor', 
            icon: <FiHome className="mr-2" /> 
          },
          { 
            name: 'My Donations', 
            path: '/my-donations', 
            icon: <FiPackage className="mr-2" /> 
          },
          { 
            name: 'Create Donation', 
            path: '/create-donation', 
            icon: <FiHeart className="mr-2" /> 
          },
          { 
            name: 'Impact', 
            path: '/impact', 
            icon: <FiPieChart className="mr-2" /> 
          }
        ];
        
      case 'beneficiary':
        return [
          ...commonLinks,
          { 
            name: 'Dashboard', 
            path: '/dashboard/beneficiary', 
            icon: <FiHome className="mr-2" /> 
          },
          { 
            name: 'Browse Food', 
            path: '/browse', 
            icon: <FiList className="mr-2" /> 
          },
          { 
            name: 'My Requests', 
            path: '/my-requests', 
            icon: <FiPackage className="mr-2" /> 
          },
          { 
            name: 'Track Donations', 
            path: '/track', 
            icon: <FiMapPin className="mr-2" /> 
          }
        ];
        
      case 'ngo':
        return [
          ...commonLinks,
          { 
            name: 'Dashboard', 
            path: '/dashboard/ngo', 
            icon: <FiHome className="mr-2" /> 
          },
          { 
            name: 'Browse Food', 
            path: '/browse', 
            icon: <FiList className="mr-2" /> 
          },
          { 
            name: 'Manage Transfers', 
            path: '/transfers', 
            icon: <FiPackage className="mr-2" /> 
          },
          { 
            name: 'Impact', 
            path: '/impact', 
            icon: <FiPieChart className="mr-2" /> 
          }
        ];
        
      default:
        return commonLinks;
    }
  };

  const navLinks = getNavLinks();

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
          <div className="hidden md:flex md:items-center md:space-x-4">
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
            
            {/* User is logged in - show logout button */}
            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-red-400 rounded-md text-sm font-medium text-red-400 hover:bg-red-400 hover:text-white transition-colors flex items-center"
              >
                <FiLogOut className="mr-2" />
                Logout
              </motion.button>
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
              
              {/* User is logged in - show logout button */}
              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-400 hover:text-white transition-colors flex items-center"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
