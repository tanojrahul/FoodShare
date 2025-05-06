import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiAlertCircle } from 'react-icons/fi';
import Footer from '../components/Footer';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#F1EFEC] flex flex-col">
      <div className="flex-grow flex items-center justify-center pt-16 px-4">
        <div className="text-center max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FiAlertCircle className="text-[#123458] text-6xl mx-auto mb-6" />
            
            <h1 className="text-4xl font-bold text-[#123458] mb-4">Page Not Found</h1>
            
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved. 
              Sorry about that! Please check the URL or go back to the homepage.
            </p>
            
            <Link 
              to="/"
              className="inline-flex items-center px-6 py-3 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              <FiHome className="mr-2" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFoundPage;
