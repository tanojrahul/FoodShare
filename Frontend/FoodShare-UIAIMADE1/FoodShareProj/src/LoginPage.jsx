import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import authService from './services/authService';

// Toast Alert Component
const ToastAlert = ({ message, type, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      } text-white`}
    >
      <FiAlertCircle className="mr-2" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white">
        &times;
      </button>
    </motion.div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { email, password } = formData;
      
      // Use the actual API service for login
      const user = await authService.login(email, password);
      
      // Show success message
      setSuccess('Login successful! Redirecting...');
      
      // Redirect based on role
      setTimeout(() => {
        navigate(`/dashboard/${user.role}`);
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1EFEC] py-12 px-4 sm:px-6 lg:px-8">
      {error && (
        <ToastAlert 
          message={error} 
          type="error" 
          onClose={() => setError(null)} 
        />
      )}
      
      {success && (
        <ToastAlert 
          message={success} 
          type="success" 
          onClose={() => setSuccess(null)} 
        />
      )}

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <AiFillHeart className="text-4xl text-[#123458]" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-extrabold text-[#123458]">
            Welcome Back to FoodShare
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue your journey in reducing food waste
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-[#123458] shadow-xl rounded-xl p-8"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-[#1e4976] text-white placeholder-gray-300 focus:ring-[#D4C9BE] focus:border-[#D4C9BE] block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-[#1e4976] text-white placeholder-gray-300 focus:ring-[#D4C9BE] focus:border-[#D4C9BE] block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-[#123458] font-medium bg-[#D4C9BE] hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4C9BE] transition-colors duration-200"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-[#123458]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Login'
                )}
              </motion.button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-[#D4C9BE] hover:text-white transition-colors">
                Register here
              </Link>
            </p>
            <Link to="/" className="block mt-2 text-sm text-[#D4C9BE] hover:text-white transition-colors">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
