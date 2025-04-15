import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1EFEC]">
      <motion.div 
        className="text-center p-8 max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <span role="img" aria-label="puzzled face" className="text-8xl">🤔</span>
        </div>
        
        <h1 className="text-9xl font-bold text-[#123458]">404</h1>
        
        <h2 className="text-3xl font-semibold text-gray-800 mt-4 mb-2">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or was moved.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-[#123458] text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            <FiHome className="mr-2" />
            Return to Home
          </Link>
        </motion.div>
        
        <p className="mt-10 text-sm text-gray-500">
          Need help? <Link to="/contact" className="text-[#123458] underline hover:text-opacity-80">Contact Support</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
