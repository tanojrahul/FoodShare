import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaHeart } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: <FaFacebook />, url: 'https://facebook.com/foodshare', name: 'Facebook' },
    { icon: <FaTwitter />, url: 'https://twitter.com/foodshare', name: 'Twitter' },
    { icon: <FaLinkedin />, url: 'https://linkedin.com/company/foodshare', name: 'LinkedIn' },
    { icon: <FaInstagram />, url: 'https://instagram.com/foodshare', name: 'Instagram' }
  ];

  const navLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact Us', path: '/contact' }
  ];

  return (
    <footer className="bg-[#030303] text-[#D4C9BE] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Mission Statement */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <FaHeart className="text-2xl text-[#D4C9BE] mr-2" />
              <h3 className="text-xl font-bold text-white">FoodShare</h3>
            </div>
            <p className="mb-4">
              Our mission is to reduce food waste and hunger by connecting surplus food with those who need it most. Together, we can make a difference one meal at a time.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4C9BE] hover:text-[#F1EFEC] text-xl transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-[#D4C9BE] hover:text-[#F1EFEC] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Get Involved</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register?role=donor" className="text-[#D4C9BE] hover:text-[#F1EFEC] transition-colors">
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link to="/register?role=beneficiary" className="text-[#D4C9BE] hover:text-[#F1EFEC] transition-colors">
                  Register as Beneficiary
                </Link>
              </li>
              <li>
                <Link to="/register?role=ngo" className="text-[#D4C9BE] hover:text-[#F1EFEC] transition-colors">
                  Partner as NGO
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-[#D4C9BE] hover:text-[#F1EFEC] transition-colors">
                  Volunteer Opportunities
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-[#D4C9BE] hover:text-[#F1EFEC] transition-colors">
                  Support Our Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <FiMail className="mt-1 mr-3 text-[#D4C9BE]" />
                <a href="mailto:info@foodshare.org" className="text-[#D4C9BE] hover:text-[#F1EFEC] transition-colors">
                  info@foodshare.org
                </a>
              </div>
              <div className="flex items-start">
                <FiPhone className="mt-1 mr-3 text-[#D4C9BE]" />
                <a href="tel:+1-555-123-4567" className="text-[#D4C9BE] hover:text-[#F1EFEC] transition-colors">
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-start">
                <FiMapPin className="mt-1 mr-3 text-[#D4C9BE]" />
                <address className="not-italic text-[#D4C9BE]">
                  123 Food Ave, City, Country
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © {currentYear} FoodShare. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <Link to="/terms" className="hover:text-[#D4C9BE] transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="hover:text-[#D4C9BE] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="hover:text-[#D4C9BE] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
