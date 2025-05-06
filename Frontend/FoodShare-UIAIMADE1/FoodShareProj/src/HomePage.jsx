import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaUtensils, FaHandsHelping, FaUsers } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { AiFillHeart, AiFillFacebook, AiFillTwitterCircle, AiFillInstagram, AiFillLinkedin } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import authService from "./services/authService";

// StatCard component
const StatCard = ({ icon, number, label }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md flex flex-col items-center"
  >
    <div className="text-2xl sm:text-3xl text-[#123458] mb-2 sm:mb-3">{icon}</div>
    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#123458] mb-1">{number}</h3>
    <p className="text-sm sm:text-base text-gray-600 text-center">{label}</p>
  </motion.div>
);

// Testimonial component
const Testimonial = ({ quote, author, role }) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mx-2 sm:mx-4 my-2 min-w-[280px] xs:min-w-[300px] md:min-w-[400px]">
    <p className="text-sm sm:text-base text-gray-700 italic mb-3 sm:mb-4">"{quote}"</p>
    <div className="flex items-center">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#D4C9BE] flex items-center justify-center text-[#123458] font-bold">
        {author[0]}
      </div>
      <div className="ml-2 sm:ml-3">
        <h4 className="text-sm sm:text-base font-semibold">{author}</h4>
        <p className="text-xs sm:text-sm text-gray-500">{role}</p>
      </div>
    </div>
  </div>
);

// HowItWorksCard component
const HowItWorksCard = ({ icon, title, description, step }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
  >
    <div className="flex items-start">
      <div className="bg-[#123458] text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
        {step}
      </div>
      <div>
        <div className="text-xl sm:text-2xl text-[#123458] mb-2 sm:mb-3">{icon}</div>
        <h3 className="font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-gray-600">{description}</p>
      </div>
    </div>
  </motion.div>
);

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  // Check authentication status when component mounts
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  // Testimonials data
  const testimonials = [
    {
      quote: "FoodShare has enabled our restaurant to reduce waste while helping our community. It's a win-win for everyone involved.",
      author: "Sarah Johnson",
      role: "Restaurant Owner & Donor"
    },
    {
      quote: "Thanks to FoodShare, our shelter can provide fresh meals to people in need, making a real difference in their lives.",
      author: "Michael Chen",
      role: "NGO Coordinator"
    },
    {
      quote: "The platform is intuitive and makes the entire donation process seamless. We've increased our donations by 50% since joining.",
      author: "David Williams",
      role: "Grocery Store Manager"
    },
    {
      quote: "FoodShare has been a lifeline for our community center, connecting us with quality food that would otherwise go to waste.",
      author: "Priya Sharma",
      role: "Community Center Director"
    }
  ];

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="w-full">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full">
        <Navbar />
      </div>
      
      {/* Hero Section */}
      <section 
        className="relative w-full h-[90vh] md:h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#123458]/90 to-[#123458]/70"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left md:max-w-[600px]"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4">
              Share Food, <span className="text-[#D4C9BE]">Spread Hope</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8">
              Join our mission to reduce food waste and hunger by connecting donors with those in need. Together, we can make a difference one meal at a time.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              {!user ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/login')}
                    className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-[#123458] rounded-full font-semibold hover:bg-[#D4C9BE] transition-all duration-300 shadow-lg text-sm sm:text-base"
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/register')}
                    className="px-6 sm:px-8 py-2 sm:py-3 bg-[#D4C9BE] text-[#123458] rounded-full font-semibold hover:bg-white transition-all duration-300 flex items-center justify-center shadow-lg text-sm sm:text-base"
                  >
                    Register <FiArrowRight className="ml-2" />
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/dashboard/${user.role}`)}
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-[#123458] rounded-full font-semibold hover:bg-[#D4C9BE] transition-all duration-300 shadow-lg flex items-center justify-center text-sm sm:text-base"
                >
                  Go to Dashboard <FiArrowRight className="ml-2" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <a href="#how-it-works" className="text-white">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Rest of the content with improved container classes */}
      <div className="bg-[#F1EFEC]">
        {/* How It Works Section */}
        <section id="how-it-works" className="py-12 sm:py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#123458] mb-2 sm:mb-4">How It Works</h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">Our platform makes it easy to connect surplus food with those who need it most, reducing waste and fighting hunger in just a few simple steps.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <HowItWorksCard 
                icon={<FaLeaf />}
                title="Register"
                description="Sign up as a donor, beneficiary, or NGO to join our community dedicated to reducing food waste."
                step="1"
              />
              <HowItWorksCard 
                icon={<FaUtensils />}
                title="List Donations"
                description="Donors can easily list available food items, quantities, and pickup details."
                step="2"
              />
              <HowItWorksCard 
                icon={<FaHandsHelping />}
                title="Connect"
                description="Our system matches donations with nearby beneficiaries and facilitates the exchange."
                step="3"
              />
              <HowItWorksCard 
                icon={<FaUsers />}
                title="Make an Impact"
                description="Track your contribution to fighting hunger and reducing environmental waste."
                step="4"
              />
            </div>
          </div>
        </section>

        {/* Impact Metrics Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-[#F1EFEC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#123458] mb-2 sm:mb-4">Our Impact</h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">Together with our community, we're making a measurable difference in reducing food waste and hunger.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <StatCard 
                icon={<FaUtensils />}
                number="120,000+"
                label="Meals Served"
              />
              <StatCard 
                icon={<FaLeaf />}
                number="45,000 kg"
                label="Food Saved"
              />
              <StatCard 
                icon={<FaUsers />}
                number="2,400+"
                label="Active Donors"
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#123458] mb-2 sm:mb-4">What People Are Saying</h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">Hear from the people who are part of our community making a difference every day.</p>
            </motion.div>
            
            <div className="relative">
              <div className="overflow-hidden">
                <motion.div
                  animate={{ x: `-${currentTestimonial * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="flex"
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="min-w-full px-4">
                      <div className="max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto">
                        <Testimonial
                          quote={testimonial.quote}
                          author={testimonial.author}
                          role={testimonial.role}
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
              
              <div className="flex justify-center mt-4 sm:mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 mx-1 rounded-full ${
                      currentTestimonial === index ? 'bg-[#123458]' : 'bg-[#D4C9BE]'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 sm:py-12 md:py-16 bg-[#123458]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="mb-6 md:mb-0"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Ready to make a difference?</h2>
                <p className="text-sm sm:text-base text-white/80">Join our community today and help reduce food waste.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                {!user ? (
                  <button 
                    onClick={() => navigate('/register')} 
                    className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-[#123458] rounded-full font-semibold hover:bg-[#D4C9BE] transition-all duration-300 flex items-center text-sm sm:text-base w-full sm:w-auto justify-center"
                  >
                    Get Started <FiArrowRight className="ml-2" />
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate(`/dashboard/${user.role}`)} 
                    className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-[#123458] rounded-full font-semibold hover:bg-[#D4C9BE] transition-all duration-300 flex items-center text-sm sm:text-base w-full sm:w-auto justify-center"
                  >
                    Dashboard <FiArrowRight className="ml-2" />
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
