import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiAlertCircle } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import RoleSelector from './components/RoleSelector';

// Mock Auth Service
const authService = {
  register: (userData) => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        // For demonstration - simple validation
        if (userData.email && userData.password && userData.name && userData.role) {
          // Success case
          resolve({ 
            user: { email: userData.email, role: userData.role, name: userData.name },
            token: 'mock-jwt-token'
          });
        } else {
          // Error case
          reject({ message: 'Invalid registration data. Please fill all fields.' });
        }
      }, 1000);
    });
  }
};

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

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState('role'); // 'role' or 'details'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData(prev => ({ ...prev, role: selectedRole }));
    setStep('details');
  };

  // Form validation
  const validateForm = () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Basic password strength check
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { name, email, password, role } = formData;
      
      // Call registration service
      const response = await authService.register({ name, email, password, role });
      
      // Store token in localStorage or use a proper auth state management
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Show success message
      setSuccess('Registration successful! Redirecting to your dashboard...');
      
      // Redirect to appropriate dashboard based on role
      setTimeout(() => {
        navigate(`/dashboard/${role}`);
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
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

      <div className="max-w-xl w-full space-y-8">
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
            Join FoodShare and Start Making a Difference
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create an account to help reduce food waste and fight hunger
          </p>
        </div>

        {step === 'role' ? (
          <RoleSelector 
            onSelectRole={handleRoleSelect} 
            onBack={() => navigate('/')}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-[#123458] shadow-xl rounded-xl p-8"
          >
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-[#1e4976] text-white placeholder-gray-300 focus:ring-[#D4C9BE] focus:border-[#D4C9BE] block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg"
                    placeholder="Your Full Name"
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="bg-[#1e4976] text-white placeholder-gray-300 focus:ring-[#D4C9BE] focus:border-[#D4C9BE] block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="bg-[#1e4976] text-white placeholder-gray-300 focus:ring-[#D4C9BE] focus:border-[#D4C9BE] block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg"
                      placeholder="••••••••"
                    />
                  </div>
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
                    'Create Account'
                  )}
                </motion.button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-[#D4C9BE] hover:text-white transition-colors">
                  Login here
                </Link>
              </p>
              <button 
                onClick={() => setStep('role')}
                className="block mt-2 text-sm text-[#D4C9BE] hover:text-white transition-colors mx-auto"
              >
                Change role
              </button>
            </div>
          </motion.div>
        )}

        <div className="text-center text-xs text-gray-500">
          <p>By registering, you agree to FoodShare's Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
