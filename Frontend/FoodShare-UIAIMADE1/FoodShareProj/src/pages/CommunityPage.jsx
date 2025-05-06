import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiCalendar, FiMapPin, FiMessageSquare, FiHeart, FiShare2 } from 'react-icons/fi';
import BeneficiaryLayout from '../layouts/BeneficiaryLayout';
import authService from '../services/authService';
import ToastAlert from '../components/ToastAlert';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discussions');
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);

  // Mock data for community discussions
  const mockPosts = [
    {
      id: 'post1',
      author: 'Maria Rodriguez',
      authorRole: 'Beneficiary',
      title: 'Tips for reducing food waste at home',
      content: 'I wanted to share some tips that have helped my family reduce food waste significantly. First, we plan our meals carefully before shopping. Second, we store food properly to extend its life. Third, we have a designated "eat soon" section in our fridge...',
      createdAt: '2025-04-15T10:30:00Z',
      likes: 24,
      comments: 8,
      tags: ['food waste', 'sustainability', 'tips']
    },
    {
      id: 'post2',
      author: 'Green Grocers',
      authorRole: 'Donor',
      title: 'What types of food donations are most needed?',
      content: 'As a local grocer, we want to make sure we\'re donating the most useful items to the community. From the perspective of beneficiaries, what food items are most needed and appreciated?',
      createdAt: '2025-04-12T14:45:00Z',
      likes: 32,
      comments: 15,
      tags: ['donations', 'community needs']
    },
    {
      id: 'post3',
      author: 'Community Outreach',
      authorRole: 'NGO',
      title: 'New food distribution center opening next month',
      content: 'We\'re excited to announce that we\'ll be opening a new food distribution center on the east side of town next month. This will help us serve more families and reduce travel time for many beneficiaries...',
      createdAt: '2025-04-10T09:15:00Z',
      likes: 56,
      comments: 22,
      tags: ['announcement', 'distribution']
    }
  ];

  // Mock data for community events
  const mockEvents = [
    {
      id: 'event1',
      title: 'Community Cooking Workshop',
      organizer: 'Food Education Network',
      date: '2025-05-15T15:00:00Z',
      location: 'Community Center, 123 Main St',
      description: 'Learn how to prepare nutritious meals on a budget with simple ingredients. Free to attend, registration required.',
      attendees: 18,
      maxAttendees: 30,
      isAttending: false
    },
    {
      id: 'event2',
      title: 'Food Distribution Volunteer Day',
      organizer: 'Local Food Bank',
      date: '2025-05-10T09:00:00Z',
      location: 'Food Bank Warehouse, 456 Oak St',
      description: 'Help sort and package food donations for distribution. All volunteers will receive lunch and a t-shirt.',
      attendees: 25,
      maxAttendees: 40,
      isAttending: true
    },
    {
      id: 'event3',
      title: 'Community Garden Planning Session',
      organizer: 'Green Community Initiative',
      date: '2025-05-22T18:00:00Z',
      location: 'Public Library, 789 Elm St',
      description: 'Help plan our new community garden project that will provide fresh produce for local food programs.',
      attendees: 12,
      maxAttendees: 25,
      isAttending: false
    }
  ];

  useEffect(() => {
    // Get current user
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts);
      setEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  const handleLike = (postId) => {
    setPosts(
      posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 } 
          : post
      )
    );

    setToast({
      type: 'success',
      message: 'Post liked!'
    });

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleEventToggle = (eventId) => {
    setEvents(
      events.map(event =>
        event.id === eventId
          ? { 
              ...event, 
              isAttending: !event.isAttending,
              attendees: event.isAttending ? event.attendees - 1 : event.attendees + 1
            }
          : event
      )
    );

    const event = events.find(e => e.id === eventId);
    
    setToast({
      type: 'success',
      message: event.isAttending 
        ? 'You\'ve left the event'
        : 'You\'ve joined the event!'
    });

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <BeneficiaryLayout>
      {/* Toast notification */}
      {toast && (
        <ToastAlert
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#123458] mb-2">Community Hub</h1>
        <p className="text-gray-600">Connect with others, share ideas, and stay informed about food-sharing events.</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-t-lg shadow-sm mb-6">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'discussions'
                ? 'border-[#123458] text-[#123458]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('discussions')}
          >
            <FiMessageSquare className="inline mr-2" />
            Discussions
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'events'
                ? 'border-[#123458] text-[#123458]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('events')}
          >
            <FiCalendar className="inline mr-2" />
            Events
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
              <div className="w-1/3 h-5 bg-gray-200 rounded mb-4"></div>
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="w-full h-4 bg-gray-200 rounded mt-2"></div>
              <div className="w-2/3 h-4 bg-gray-200 rounded mt-2"></div>
              <div className="flex justify-between mt-4">
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'discussions' ? (
        <div>
          {/* Create new post button */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg font-medium text-gray-800">Recent Discussions</div>
            <button className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors">
              Start a New Discussion
            </button>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-[#123458] flex items-center justify-center text-white font-bold mr-3">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-900">{post.author}</h3>
                          <span className="ml-2 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {post.authorRole}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDate(post.createdAt)} at {formatTime(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-[#123458] mt-2 mb-1">{post.title}</h2>
                  <p className="text-gray-700">{post.content}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Post Actions */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <div className="flex space-x-4">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="flex items-center text-gray-600 hover:text-[#123458]"
                      >
                        <FiHeart className="mr-1" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-[#123458]">
                        <FiMessageSquare className="mr-1" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                    <div>
                      <button className="flex items-center text-gray-600 hover:text-[#123458]">
                        <FiShare2 className="mr-1" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Upcoming events heading */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg font-medium text-gray-800">Upcoming Events</div>
            <Link to="/community/events" className="text-[#123458] hover:underline">
              View All Events
            </Link>
          </div>

          {/* Events */}
          <div className="space-y-6">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-[#123458] mb-2">{event.title}</h2>
                  <p className="text-sm text-gray-600 mb-4">Organized by: {event.organizer}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <FiCalendar className="text-[#123458] mr-2" />
                      <span className="text-gray-700">
                        {formatDate(event.date)} at {formatTime(event.date)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiMapPin className="text-[#123458] mr-2" />
                      <span className="text-gray-700">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{event.description}</p>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <FiUsers className="inline mr-1" />
                      {event.attendees} of {event.maxAttendees} spots filled
                    </div>
                    <button
                      onClick={() => handleEventToggle(event.id)}
                      className={`px-4 py-2 rounded-md ${
                        event.isAttending
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-[#123458] text-white hover:bg-opacity-90'
                      } transition-colors`}
                    >
                      {event.isAttending ? 'Leave Event' : 'Join Event'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </BeneficiaryLayout>
  );
};

export default CommunityPage;