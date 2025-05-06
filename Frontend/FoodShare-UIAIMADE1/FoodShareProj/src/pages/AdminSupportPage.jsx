import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHelpCircle, FiMessageSquare, FiCheckCircle, FiAlertCircle, 
  FiUser, FiCalendar, FiTag, FiSearch, FiFilter, FiChevronDown,
  FiRefreshCw, FiPaperclip, FiSend
} from 'react-icons/fi';
import Footer from '../components/Footer';
import authService from '../services/authService';

// Support Ticket component
const SupportTicket = ({ ticket, onSelect, isSelected }) => {
  // Determine status color based on status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => onSelect(ticket)}
      className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
            {ticket.isNew && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                New
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{ticket.message.substring(0, 90)}...</p>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <FiUser className="mr-1" />
            <span className="mr-3">{ticket.userName}</span>
            <FiCalendar className="mr-1" />
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
            {ticket.status}
          </span>
          {ticket.category && (
            <span className="mt-2 text-xs text-gray-500">
              <FiTag className="inline mr-1" /> {ticket.category}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Message component for the conversation view
const Message = ({ message, isAdmin }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) + ' - ' + date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`flex mb-4 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] px-4 py-3 rounded-lg ${
        isAdmin 
          ? 'bg-[#123458] text-white rounded-tr-none' 
          : 'bg-gray-100 text-gray-800 rounded-tl-none'
      }`}>
        <div className="flex items-center mb-1">
          <span className="font-medium">{message.sender}</span>
          <span className="ml-2 text-xs opacity-75">{formatDate(message.timestamp)}</span>
        </div>
        <p className="text-sm">{message.text}</p>
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2">
            {message.attachments.map((attachment, index) => (
              <div key={index} className={`text-xs flex items-center p-1 rounded ${
                isAdmin ? 'bg-blue-700' : 'bg-gray-200'
              }`}>
                <FiPaperclip className="mr-1" />
                <a 
                  href={attachment.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={isAdmin ? 'text-white' : 'text-blue-600'}
                >
                  {attachment.name}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminSupportPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data
  const mockTickets = [
    {
      id: 'TKT-1001',
      subject: 'Cannot complete donation',
      message: "I'm trying to donate some food but keep getting an error message when I click the submit button. The error says \"Invalid location data\". I've tried multiple times but still can't get it to work.",
      userName: 'John Smith',
      userEmail: 'john.smith@example.com',
      userRole: 'donor',
      createdAt: '2025-04-20T14:35:00Z',
      status: 'Open',
      category: 'Donations',
      isNew: true,
      conversation: [
        {
          id: 'msg-1',
          sender: 'John Smith',
          role: 'user',
          text: "I'm trying to donate some food but keep getting an error message when I click the submit button. The error says \"Invalid location data\". I've tried multiple times but still can't get it to work.",
          timestamp: '2025-04-20T14:35:00Z'
        }
      ]
    },
    {
      id: 'TKT-1002',
      subject: 'Need to change my account details',
      message: "I recently moved to a new location and need to update my address in my profile. However, I don't see any option to edit my address information. Can you please help me with this?",
      userName: 'Sarah Johnson',
      userEmail: 'sarah.j@foodbank.org',
      userRole: 'beneficiary',
      createdAt: '2025-04-18T09:15:00Z',
      status: 'In Progress',
      category: 'Account',
      isNew: false,
      conversation: [
        {
          id: 'msg-1',
          sender: 'Sarah Johnson',
          role: 'user',
          text: "I recently moved to a new location and need to update my address in my profile. However, I don't see any option to edit my address information. Can you please help me with this?",
          timestamp: '2025-04-18T09:15:00Z'
        },
        {
          id: 'msg-2',
          sender: 'Admin Support',
          role: 'admin',
          text: "Hello Sarah, thank you for reaching out. You can update your address by going to your profile settings page and clicking on the \"Edit Profile\" button. The address fields should be available there. Let me know if you're still having trouble.",
          timestamp: '2025-04-18T10:25:00Z'
        },
        {
          id: 'msg-3',
          sender: 'Sarah Johnson',
          role: 'user',
          text: "I don't see the Edit Profile button. Can you provide more specific instructions?",
          timestamp: '2025-04-18T11:42:00Z'
        }
      ]
    },
    {
      id: 'TKT-1003',
      subject: 'App crashing on login',
      message: "The mobile app keeps crashing whenever I try to log in. I'm using an iPhone 13 with the latest iOS. I've tried reinstalling the app but still have the same issue.",
      userName: 'Michael Chen',
      userEmail: 'michael.c@gmail.com',
      userRole: 'donor',
      createdAt: '2025-04-15T16:20:00Z',
      status: 'Urgent',
      category: 'Technical',
      isNew: false,
      conversation: [
        {
          id: 'msg-1',
          sender: 'Michael Chen',
          role: 'user',
          text: "The mobile app keeps crashing whenever I try to log in. I'm using an iPhone 13 with the latest iOS. I've tried reinstalling the app but still have the same issue.",
          timestamp: '2025-04-15T16:20:00Z'
        },
        {
          id: 'msg-2',
          sender: 'Admin Support',
          role: 'admin',
          text: "Hello Michael, I'm sorry to hear you're experiencing issues with the app. We've received similar reports from other iOS users and our development team is working on a fix. In the meantime, you can try using the web version at foodshare.org/app. We'll update you once the iOS app is fixed.",
          timestamp: '2025-04-15T17:05:00Z'
        }
      ]
    },
    {
      id: 'TKT-1004',
      subject: 'Donation delivery question',
      message: "I'm a new beneficiary and I'm wondering about the donation delivery process. Do I need to provide transportation or will donors deliver to our location? Our organization doesn't have a vehicle available for pickups.",
      userName: 'Community Kitchen',
      userEmail: 'info@communitykitchen.org',
      userRole: 'beneficiary',
      createdAt: '2025-04-10T13:45:00Z',
      status: 'Resolved',
      category: 'Operations',
      isNew: false,
      conversation: [
        {
          id: 'msg-1',
          sender: 'Community Kitchen',
          role: 'user',
          text: "I'm a new beneficiary and I'm wondering about the donation delivery process. Do I need to provide transportation or will donors deliver to our location? Our organization doesn't have a vehicle available for pickups.",
          timestamp: '2025-04-10T13:45:00Z'
        },
        {
          id: 'msg-2',
          sender: 'Admin Support',
          role: 'admin',
          text: "Hello Community Kitchen, thank you for your question. The delivery method depends on the donor's preference, which they specify when listing their donation. You can filter donation listings to show only those offering delivery. Alternatively, we have volunteer drivers in some areas who can help with transportation. Would you like us to check if volunteer drivers are available in your area?",
          timestamp: '2025-04-10T14:22:00Z'
        },
        {
          id: 'msg-3',
          sender: 'Community Kitchen',
          role: 'user',
          text: "Yes, please check if volunteer drivers are available in our area. We're located in downtown Riverdale.",
          timestamp: '2025-04-10T15:01:00Z'
        },
        {
          id: 'msg-4',
          sender: 'Admin Support',
          role: 'admin',
          text: "Great news! We do have volunteer drivers covering the Riverdale area. I've added a note to your account so the system will prioritize showing you donations with delivery options. You can also check the \"Delivery available\" filter when browsing donations. Is there anything else I can help you with?",
          timestamp: '2025-04-10T16:13:00Z'
        },
        {
          id: 'msg-5',
          sender: 'Community Kitchen',
          role: 'user',
          text: "That's perfect, thank you so much for your help!",
          timestamp: '2025-04-10T16:20:00Z'
        }
      ]
    },
    {
      id: 'TKT-1005',
      subject: 'Feature request: Scheduled donations',
      message: "I operate a bakery and have regular excess inventory. It would be great to have a feature to schedule recurring donations rather than creating a new listing each time. Is this something that could be implemented?",
      userName: 'Fresh Bread Bakery',
      userEmail: 'owner@freshbread.com',
      userRole: 'donor',
      createdAt: '2025-04-08T10:10:00Z',
      status: 'Closed',
      category: 'Feature Request',
      isNew: false,
      conversation: [
        {
          id: 'msg-1',
          sender: 'Fresh Bread Bakery',
          role: 'user',
          text: "I operate a bakery and have regular excess inventory. It would be great to have a feature to schedule recurring donations rather than creating a new listing each time. Is this something that could be implemented?",
          timestamp: '2025-04-08T10:10:00Z',
          attachments: [
            {
              name: 'donation_schedule_example.pdf',
              url: '#'
            }
          ]
        },
        {
          id: 'msg-2',
          sender: 'Admin Support',
          role: 'admin',
          text: "Hello Fresh Bread Bakery, thank you for this suggestion! We actually have recurring donations on our product roadmap for the next quarter. We appreciate your feedback and will take your use case into consideration as we develop this feature. Would you be interested in being a beta tester when we're ready to launch it?",
          timestamp: '2025-04-08T11:30:00Z'
        },
        {
          id: 'msg-3',
          sender: 'Fresh Bread Bakery',
          role: 'user',
          text: "Yes, I'd be very interested in being a beta tester. Please keep me updated on the development progress.",
          timestamp: '2025-04-08T13:45:00Z'
        },
        {
          id: 'msg-4',
          sender: 'Admin Support',
          role: 'admin',
          text: "Excellent! I've added you to our list of beta testers for the recurring donations feature. We'll reach out to you when we're ready to begin testing, probably in about 2-3 months. Thank you for your willingness to help improve the platform!",
          timestamp: '2025-04-08T14:20:00Z'
        }
      ]
    }
  ];

  // Category options
  const categories = [
    'All',
    'Donations',
    'Account',
    'Technical',
    'Operations',
    'Feature Request',
    'Other'
  ];

  // Status options
  const statuses = [
    'All',
    'Open',
    'In Progress',
    'Urgent',
    'Resolved',
    'Closed'
  ];

  // Initialize and fetch data
  useEffect(() => {
    // Get current user
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    // Check if user is admin
    if (currentUser && currentUser.role !== 'admin') {
      // Not an admin, will redirect in render
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setTickets(mockTickets);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle search
  const filteredTickets = tickets.filter(ticket => {
    // Apply search query filter
    const matchesSearch = 
      searchQuery === '' ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesStatus =
      statusFilter === 'all' ||
      ticket.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Apply category filter
    const matchesCategory =
      categoryFilter === 'all' ||
      ticket.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Handle reply submission
  const handleReplySubmit = () => {
    if (!replyText.trim() || !selectedTicket) return;
    
    setIsSubmitting(true);
    
    // Create new message
    const newMessage = {
      id: `msg-${selectedTicket.conversation.length + 1}`,
      sender: 'Admin Support',
      role: 'admin',
      text: replyText,
      timestamp: new Date().toISOString()
    };
    
    // Add message to conversation
    const updatedTicket = {
      ...selectedTicket,
      conversation: [...selectedTicket.conversation, newMessage],
      status: selectedTicket.status === 'Open' ? 'In Progress' : selectedTicket.status
    };
    
    // Update tickets state
    setTimeout(() => {
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === selectedTicket.id ? updatedTicket : ticket
        )
      );
      setSelectedTicket(updatedTicket);
      setReplyText('');
      setIsSubmitting(false);
    }, 500);
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    if (!selectedTicket) return;
    
    const updatedTicket = {
      ...selectedTicket,
      status: newStatus
    };
    
    // Update tickets state
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      )
    );
    setSelectedTicket(updatedTicket);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1EFEC]">
        <div className="pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
              <div className="flex space-x-6">
                <div className="w-1/3 h-screen-3/4 bg-gray-200 rounded"></div>
                <div className="w-2/3 h-screen-3/4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If not admin, redirect to home
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F1EFEC]">
      <div className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#123458]">Support Tickets</h1>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                <FiRefreshCw className="mr-2" /> Refresh
              </button>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]"
                />
              </div>
              
              <div className="relative">
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value.toLowerCase())}
                  className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458] appearance-none"
                >
                  {statuses.map((status) => (
                    <option 
                      key={status} 
                      value={status.toLowerCase()}
                    >
                      {status}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 bottom-3 text-gray-400" />
              </div>
              
              <div className="relative">
                <label className="block text-xs text-gray-500 mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value.toLowerCase())}
                  className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458] appearance-none"
                >
                  {categories.map((category) => (
                    <option 
                      key={category} 
                      value={category.toLowerCase()}
                    >
                      {category}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 bottom-3 text-gray-400" />
              </div>
              
              <div className="self-end">
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setCategoryFilter('all');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content Grid */}
          <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Tickets List */}
            <div className="lg:w-2/5 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800">
                  Support Tickets ({filteredTickets.length})
                </h2>
                <div className="text-xs text-gray-500">
                  {tickets.filter(t => t.isNew).length} new
                </div>
              </div>
              
              <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <SupportTicket
                      key={ticket.id}
                      ticket={ticket}
                      onSelect={setSelectedTicket}
                      isSelected={selectedTicket && selectedTicket.id === ticket.id}
                    />
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <FiMessageSquare className="mx-auto text-gray-300 text-4xl mb-2" />
                    <p className="text-gray-500">No tickets match your filters</p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setCategoryFilter('all');
                      }}
                      className="mt-2 text-sm text-[#123458] hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Ticket Details */}
            <div className="lg:w-3/5 bg-white rounded-lg shadow-md overflow-hidden">
              {selectedTicket ? (
                <div className="flex flex-col h-full" style={{ maxHeight: '70vh' }}>
                  {/* Ticket Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="font-semibold text-gray-800 text-lg">
                          {selectedTicket.subject}
                        </h2>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <span className="mr-3">
                            <FiUser className="inline mr-1" /> {selectedTicket.userName}
                          </span>
                          <span className="mr-3">
                            <FiTag className="inline mr-1" /> {selectedTicket.category}
                          </span>
                          <span>
                            <FiCalendar className="inline mr-1" /> {new Date(selectedTicket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <select
                          value={selectedTicket.status}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          className="text-sm border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#123458]"
                        >
                          {statuses.filter(s => s !== 'All').map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Conversation */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {selectedTicket.conversation.map((message) => (
                      <Message
                        key={message.id}
                        message={message}
                        isAdmin={message.role === 'admin'}
                      />
                    ))}
                  </div>
                  
                  {/* Reply Box */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-end space-x-3">
                      <div className="flex-1">
                        <textarea
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]"
                          rows={3}
                          disabled={isSubmitting}
                        ></textarea>
                      </div>
                      <button
                        onClick={handleReplySubmit}
                        disabled={!replyText.trim() || isSubmitting}
                        className={`px-4 py-3 bg-[#123458] text-white rounded-md flex items-center ${
                          !replyText.trim() || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
                        }`}
                      >
                        {isSubmitting ? (
                          <>Sending...</>
                        ) : (
                          <>
                            <FiSend className="mr-2" /> Reply
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex justify-between mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiPaperclip className="mr-1" />
                        <span>Attach files</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Markdown formatting supported
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-8 text-center" style={{ minHeight: '60vh' }}>
                  <div>
                    <FiMessageSquare className="mx-auto text-gray-300 text-5xl mb-3" />
                    <h3 className="text-lg font-medium text-gray-800 mb-1">No ticket selected</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Select a support ticket from the list to view details and respond to users
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Knowledge Base Quick Links */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-[#123458] mb-4 flex items-center">
              <FiHelpCircle className="mr-2" /> Knowledge Base Quick Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a 
                href="#" 
                className="p-3 border border-gray-200 rounded hover:bg-gray-50 flex items-center"
              >
                <FiCheckCircle className="text-green-500 mr-2" />
                <span>Common Donation Issues</span>
              </a>
              <a 
                href="#" 
                className="p-3 border border-gray-200 rounded hover:bg-gray-50 flex items-center"
              >
                <FiCheckCircle className="text-green-500 mr-2" />
                <span>Account Management Guide</span>
              </a>
              <a 
                href="#" 
                className="p-3 border border-gray-200 rounded hover:bg-gray-50 flex items-center"
              >
                <FiCheckCircle className="text-green-500 mr-2" />
                <span>Tech Troubleshooting</span>
              </a>
              <a 
                href="#" 
                className="p-3 border border-gray-200 rounded hover:bg-gray-50 flex items-center"
              >
                <FiCheckCircle className="text-green-500 mr-2" />
                <span>Delivery Process Guide</span>
              </a>
              <a 
                href="#" 
                className="p-3 border border-gray-200 rounded hover:bg-gray-50 flex items-center"
              >
                <FiCheckCircle className="text-green-500 mr-2" />
                <span>FAQ for New Beneficiaries</span>
              </a>
              <a 
                href="#" 
                className="p-3 border border-gray-200 rounded hover:bg-gray-50 flex items-center"
              >
                <FiCheckCircle className="text-green-500 mr-2" />
                <span>Platform Policy Guide</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminSupportPage;