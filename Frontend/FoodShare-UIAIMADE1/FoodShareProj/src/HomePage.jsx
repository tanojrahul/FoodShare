import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaUtensils, FaHandsHelping, FaUsers } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { AiFillHeart, AiFillFacebook, AiFillTwitterCircle, AiFillInstagram, AiFillLinkedin } from "react-icons/ai";
import Navbar from "./components/Navbar";

// StatCard component
const StatCard = ({ icon, number, label }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center"
  >
    <div className="text-3xl text-[#123458] mb-3">{icon}</div>
    <h3 className="text-4xl font-bold text-[#123458] mb-1">{number}</h3>
    <p className="text-gray-600 text-center">{label}</p>
  </motion.div>
);

// Testimonial component
const Testimonial = ({ quote, author, role }) => (
  <div className="bg-white p-6 rounded-xl shadow-md mx-4 my-2 min-w-[300px] md:min-w-[400px]">
    <p className="text-gray-700 italic mb-4">"{quote}"</p>
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-[#D4C9BE] flex items-center justify-center text-[#123458] font-bold">
        {author[0]}
      </div>
      <div className="ml-3">
        <h4 className="font-semibold">{author}</h4>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  </div>
);

// HowItWorksCard component
const HowItWorksCard = ({ icon, title, description, step }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
  >
    <div className="flex items-start">
      <div className="bg-[#123458] text-white w-8 h-8 rounded-full flex items-center justify-center mr-4">
        {step}
      </div>
      <div>
        <div className="text-2xl text-[#123458] mb-3">{icon}</div>
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  </motion.div>
);

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
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
    <div className="font-sans bg-[#F1EFEC]">
      <Navbar />
      {/* Hero Section - Fixed height with absolute positioning */}
      <section className="relative w-full" style={{ height: "100vh" }}>
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            zIndex: 0
          }}
        ></div>
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#123458]/90 to-[#123458]/70"
          style={{ zIndex: 1 }}
        ></div>
        
        {/* Content Container */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left md:max-w-[600px]"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Share Food, <span className="text-[#D4C9BE]">Spread Hope</span>
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Join our mission to reduce food waste and hunger by connecting donors with those in need. Together, we can make a difference one meal at a time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-[#123458] rounded-full font-semibold hover:bg-[#D4C9BE] transition-all duration-300 shadow-lg"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-[#D4C9BE] text-[#123458] rounded-full font-semibold hover:bg-white transition-all duration-300 flex items-center justify-center shadow-lg"
                >
                  Register <FiArrowRight className="ml-2" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center" style={{ zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <a href="#how-it-works" className="text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#123458] mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our platform makes it easy to connect surplus food with those who need it most, reducing waste and fighting hunger in just a few simple steps.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      <section className="py-20 px-6 bg-gradient-to-b from-white to-[#F1EFEC]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#123458] mb-4">Our Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Together with our community, we're making a measurable difference in reducing food waste and hunger.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#123458] mb-4">What People Are Saying</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Hear from the people who are part of our community making a difference every day.</p>
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
                    <div className="max-w-3xl mx-auto">
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
            
            <div className="flex justify-center mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 mx-1 rounded-full ${
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
      <section className="py-16 px-6 bg-[#123458]">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-8 md:mb-0"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to make a difference?</h2>
              <p className="text-white/80">Join our community today and help reduce food waste.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <button className="px-8 py-3 bg-white text-[#123458] rounded-full font-semibold hover:bg-[#D4C9BE] transition-all duration-300 flex items-center">
                Get Started <FiArrowRight className="ml-2" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#030303] text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <AiFillHeart className="text-[#D4C9BE] mr-2" /> FoodShare
              </h3>
              <p className="text-gray-400 mb-4">Reducing food waste and hunger, one meal at a time.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-2xl text-gray-400 hover:text-[#D4C9BE]"><AiFillFacebook /></a>
                <a href="#" className="text-2xl text-gray-400 hover:text-[#D4C9BE]"><AiFillTwitterCircle /></a>
                <a href="#" className="text-2xl text-gray-400 hover:text-[#D4C9BE]"><AiFillInstagram /></a>
                <a href="#" className="text-2xl text-gray-400 hover:text-[#D4C9BE]"><AiFillLinkedin /></a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#D4C9BE]">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D4C9BE]">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D4C9BE]">Success Stories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D4C9BE]">Join As Donor</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D4C9BE]">Join As Beneficiary</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#D4C9BE]">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D4C9BE]">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D4C9BE]">Guidelines</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D4C9BE]">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-400 mb-2">info@foodshare.org</p>
              <p className="text-gray-400 mb-2">+1 (555) 123-4567</p>
              <p className="text-gray-400">123 Food Ave, City, Country</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2023 FoodShare. All rights reserved.</p>
              <div className="flex space-x-4 text-sm">
                <a href="#" className="text-gray-500 hover:text-[#D4C9BE]">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-[#D4C9BE]">Terms of Service</a>
                <a href="#" className="text-gray-500 hover:text-[#D4C9BE]">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
