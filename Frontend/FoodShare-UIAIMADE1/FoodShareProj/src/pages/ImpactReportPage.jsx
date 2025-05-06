import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiTrendingUp, FiSave, FiGlobe, FiThumbsUp } from 'react-icons/fi';
import Footer from '../components/Footer';
import authService from '../services/authService';
import { getGlobalImpactData } from '../services/donationService';
import BeneficiaryLayout from '../layouts/BeneficiaryLayout';
import DonorLayout from '../layouts/DonorLayout';
import NGOLayout from '../layouts/NGOLayout';
import AdminLayout from '../layouts/AdminLayout';
import ToastAlert from '../components/ToastAlert';

// StatCard component
const StatCard = ({ icon, number, label, subtitle }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-lg shadow-md"
  >
    <div className="flex items-start">
      <div className="p-3 rounded-full bg-[#123458] bg-opacity-10 mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-[#123458]">{number}</h3>
        <p className="text-gray-600">{label}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  </motion.div>
);

// Chart placeholder component
const ChartPlaceholder = ({ title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-[#123458] mb-4">{title}</h3>
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center">
      <div className="w-full h-56 bg-gray-50 rounded flex items-center justify-center">
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  </div>
);

const ImpactReportPage = () => {
  const [user, setUser] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Mock impact data
  const mockImpactData = {
    totalDonations: 3452,
    foodSaved: 45280, // kilograms
    mealsProvided: 120560,
    carbonReduced: 158480, // kg CO2e
    beneficiariesHelped: 12430,
    activeVenueCount: 325,
    successRate: 92, // percentage
    monthlySummary: [
      { month: 'Jan', donations: 220, kilograms: 3200 },
      { month: 'Feb', donations: 240, kilograms: 3420 },
      { month: 'Mar', donations: 310, kilograms: 4100 },
      { month: 'Apr', donations: 280, kilograms: 3950 },
      { month: 'May', donations: 330, kilograms: 4600 },
      { month: 'Jun', donations: 350, kilograms: 4900 },
      { month: 'Jul', donations: 370, kilograms: 5200 },
      { month: 'Aug', donations: 390, kilograms: 5500 },
      { month: 'Sep', donations: 420, kilograms: 5800 },
      { month: 'Oct', donations: 450, kilograms: 6200 },
      { month: 'Nov', donations: 480, kilograms: 6500 },
      { month: 'Dec', donations: 520, kilograms: 7100 }
    ],
    topFoodCategories: [
      { name: 'Vegetables', percentage: 35 },
      { name: 'Bakery', percentage: 25 },
      { name: 'Fruits', percentage: 15 },
      { name: 'Dairy', percentage: 12 },
      { name: 'Grains', percentage: 8 },
      { name: 'Other', percentage: 5 }
    ]
  };

  // Fetch impact data and user
  useEffect(() => {
    // Get current user
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Fetch global impact data from the API
    const fetchImpactData = async () => {
      try {
        const data = await getGlobalImpactData();
        console.log('Fetched impact data:', data);
        setImpactData(data);
      } catch (error) {
        console.error('Error fetching impact data:', error);
        setToast({
          type: 'error',
          message: `Failed to load impact data: ${error.message}`
        });
        
        // Fall back to mock data if API call fails
        setImpactData(mockImpactData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImpactData();
  }, []);

  // Function to render content based on user role
  const renderContent = () => {
    const content = (
      <>
        {/* Toast notifications */}
        {toast && (
          <ToastAlert 
            type={toast.type} 
            message={toast.message} 
            onClose={() => setToast(null)}
          />
        )}
        
        {/* Hero Banner */}
        <div className="bg-[#123458] text-white py-12 -mt-6 -mx-6 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h1>
            <p className="text-white/80 max-w-2xl">
              Together with our community, we're making a real difference in reducing food waste and fighting hunger.
            </p>
          </div>
        </div>
        
        {/* Impact Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard 
            icon={<FiSave className="text-[#123458] text-xl" />}
            number={`${(impactData.foodSaved / 1000).toFixed(1)}t`}
            label="Food Saved"
            subtitle="Diverted from landfill"
          />
          <StatCard 
            icon={<FiUsers className="text-[#123458] text-xl" />}
            number={impactData.mealsProvided.toLocaleString()}
            label="Meals Provided"
            subtitle="To those in need"
          />
          <StatCard 
            icon={<FiAward className="text-[#123458] text-xl" />}
            number={impactData.totalDonations.toLocaleString()}
            label="Total Donations"
            subtitle="Successfully completed"
          />
          <StatCard 
            icon={<FiGlobe className="text-[#123458] text-xl" />}
            number={`${(impactData.carbonReduced / 1000).toFixed(1)}t`}
            label="CO₂ Reduced"
            subtitle="Environmental impact"
          />
          <StatCard 
            icon={<FiThumbsUp className="text-[#123458] text-xl" />}
            number={`${impactData.successRate}%`}
            label="Success Rate"
            subtitle="Donations claimed"
          />
          <StatCard 
            icon={<FiTrendingUp className="text-[#123458] text-xl" />}
            number={impactData.beneficiariesHelped.toLocaleString()}
            label="People Helped"
            subtitle="Through our network"
          />
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ChartPlaceholder 
            title="Monthly Donation Trend" 
            description="Donation trend visualization would appear here" 
          />
          <ChartPlaceholder 
            title="Food Category Distribution" 
            description="Food category distribution chart would appear here" 
          />
        </div>
        
        {/* How We Calculate Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-[#123458] mb-4">How We Calculate Our Impact</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Our impact metrics are calculated based on actual donation data and industry-standard conversions:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Food Saved:</strong> Total weight of all food items successfully donated through our platform.</li>
              <li><strong>Meals Provided:</strong> We estimate that 1kg of food provides approximately 2.5 meals on average.</li>
              <li><strong>CO₂ Reduced:</strong> Each kilogram of food waste diverted from landfill saves approximately 3.5kg of CO₂ equivalent emissions.</li>
            </ul>
            <p>
              We continuously work with environmental scientists and nutrition experts to improve the accuracy of our calculations.
            </p>
          </div>
        </div>
        
        {/* User-specific impact section (if logged in) */}
        {user && (
          <div className="bg-[#123458] bg-opacity-5 p-6 rounded-lg border border-[#123458] border-opacity-20">
            <h2 className="text-xl font-semibold text-[#123458] mb-4">Your Personal Impact</h2>
            <p className="text-gray-700 mb-6">
              As a valued member of our community, you're contributing to these positive changes.
              Visit your dashboard to see your personal impact stats.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = `/dashboard/${user.role}`}
              className="px-6 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-all"
            >
              View My Dashboard
            </motion.button>
          </div>
        )}
      </>
    );

    // Return the content wrapped in the appropriate layout based on user role
    if (!user) {
      // If no user is logged in, show content without any specific navbar
      return (
        <div className="min-h-screen bg-[#F1EFEC]">
          <div className="pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {content}
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    // Use the appropriate layout based on the user's role
    switch (user.role) {
      case 'beneficiary':
        return <BeneficiaryLayout>{content}</BeneficiaryLayout>;
      case 'donor':
        return <DonorLayout>{content}</DonorLayout>;
      case 'ngo':
        return <NGOLayout>{content}</NGOLayout>;
      case 'admin':
        return <AdminLayout>{content}</AdminLayout>;
      default:
        // Fallback for unknown roles
        return (
          <div className="min-h-screen bg-[#F1EFEC]">
            <div className="pt-16 pb-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {content}
              </div>
            </div>
            <Footer />
          </div>
        );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1EFEC]">
        <div className="pt-16 px-4 max-w-7xl mx-auto">
          <div className="animate-pulse mt-8">
            <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-200 rounded-lg"></div>
              <div className="h-80 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Render the content based on user role
  return renderContent();
};

export default ImpactReportPage;
