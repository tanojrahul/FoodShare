import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiPlus, FiUsers, FiFilter, FiChevronDown, FiEdit2, FiTrash2 } from 'react-icons/fi';
import NGOLayout from '../layouts/NGOLayout';
import ToastAlert from '../components/ToastAlert';

// Event Card Component
const EventCard = ({ event, onEdit, onDelete }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-[#D4C9BE]"
    >
      {/* Event Header with Status */}
      <div className="bg-[#123458] px-4 py-3 flex justify-between items-center">
        <h3 className="text-white font-medium">{event.title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          event.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' : 
          event.status === 'active' ? 'bg-green-100 text-green-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </span>
      </div>
      
      {/* Event Details */}
      <div className="p-4">
        <div className="flex items-start mb-3">
          <FiCalendar className="text-[#123458] mt-1 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">Date</p>
            <p className="text-sm text-gray-600">{event.date}</p>
          </div>
        </div>
        
        <div className="flex items-start mb-3">
          <FiClock className="text-[#123458] mt-1 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">Time</p>
            <p className="text-sm text-gray-600">{event.time}</p>
          </div>
        </div>
        
        <div className="flex items-start mb-3">
          <FiMapPin className="text-[#123458] mt-1 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-sm text-gray-600">{event.location}</p>
          </div>
        </div>
        
        <div className="flex items-start mb-4">
          <FiUsers className="text-[#123458] mt-1 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">Expected Participants</p>
            <p className="text-sm text-gray-600">{event.participants} people</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 mb-4">{event.description}</p>
        
        {/* Action Buttons */}
        <div className="flex justify-end pt-2 border-t">
          <button 
            onClick={() => onEdit(event)}
            className="mr-2 p-2 text-[#123458] hover:bg-blue-50 rounded-full transition-colors"
          >
            <FiEdit2 />
          </button>
          <button 
            onClick={() => onDelete(event.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Modal for creating/editing events
const EventFormModal = ({ isOpen, onClose, onSubmit, event = null }) => {
  const [formData, setFormData] = useState(
    event || {
      title: '',
      date: '',
      time: '',
      location: '',
      participants: '',
      description: '',
      status: 'upcoming'
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="bg-[#123458] px-6 py-4 rounded-t-lg">
          <h2 className="text-white text-xl font-semibold">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Expected Participants</label>
            <input
              type="number"
              name="participants"
              value={formData.participants}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]"
            >
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#123458]"
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md mr-2 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Main Events Page Component
const EventsPage = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Food Distribution Drive',
      date: '2025-05-15',
      time: '10:00 - 14:00',
      location: 'Community Center, 123 Main St',
      participants: 150,
      description: 'Monthly food distribution for registered families. We will be distributing fresh produce, canned goods, and essentials. Volunteers should arrive at 8:30 AM for setup.',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Cooking Workshop',
      date: '2025-05-10',
      time: '15:00 - 17:00',
      location: 'Public Library, 456 Oak Avenue',
      participants: 30,
      description: 'Learn to prepare nutritious meals on a budget. Participants will receive a free cookbook and ingredients to take home.',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Easter Food Pantry',
      date: '2025-04-20',
      time: '09:00 - 12:00',
      location: 'Hope Church, 789 Faith Road',
      participants: 100,
      description: 'Special holiday food distribution providing Easter meal ingredients for families in need.',
      status: 'completed'
    }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);

  // Filter events based on status
  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.status === filter);

  // Handle creating/updating an event
  const handleSubmitEvent = (eventData) => {
    if (currentEvent) {
      // Update existing event
      const updatedEvents = events.map(event => 
        event.id === currentEvent.id ? { ...eventData, id: event.id } : event
      );
      setEvents(updatedEvents);
      setToast({
        type: 'success',
        message: 'Event updated successfully!'
      });
    } else {
      // Create new event
      const newEvent = {
        ...eventData,
        id: events.length + 1
      };
      setEvents([...events, newEvent]);
      setToast({
        type: 'success',
        message: 'New event created successfully!'
      });
    }
    setModalOpen(false);
    setCurrentEvent(null);
  };

  // Open modal for editing an event
  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setModalOpen(true);
  };

  // Delete an event
  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    setToast({
      type: 'success',
      message: 'Event deleted successfully!'
    });
  };

  return (
    <NGOLayout>
      {/* Toast notifications */}
      {toast && (
        <ToastAlert 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#123458]">Events Management</h1>
          <p className="text-gray-600">Organize and manage your food distribution events</p>
        </div>
        
        <button
          onClick={() => {
            setCurrentEvent(null);
            setModalOpen(true);
          }}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          <FiPlus className="mr-2" />
          Create New Event
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center">
          <FiFilter className="mr-2 text-[#123458]" />
          <span className="font-medium">Filter Events:</span>
          
          <div className="ml-4 flex flex-wrap gap-2">
            {['all', 'upcoming', 'active', 'completed', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === status
                    ? 'bg-[#123458] text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FiCalendar className="mx-auto text-[#123458] text-4xl mb-4" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">No events found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? "You haven't created any events yet." 
              : `No ${filter} events found.`}
          </p>
          <button
            onClick={() => {
              setCurrentEvent(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-[#123458] text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            <FiPlus className="inline mr-2" />
            Create your first event
          </button>
        </div>
      )}
      
      {/* Event Form Modal */}
      <EventFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCurrentEvent(null);
        }}
        onSubmit={handleSubmitEvent}
        event={currentEvent}
      />
    </NGOLayout>
  );
};

export default EventsPage;