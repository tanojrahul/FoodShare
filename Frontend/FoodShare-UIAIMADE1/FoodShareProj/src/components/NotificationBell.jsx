import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FiBell, FiAlertTriangle, FiAlertCircle, FiCheck, FiSend } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getUserNotifications, 
  subscribeToRealTimeNotifications,
  markAsRead,
  markAllAsRead,
  getNotificationStats 
} from '../../../src/services/notificationService';
import authService from '../../../src/services/authService';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef(null);

  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  // Filter notifications for admin priority items
  const adminPriorityNotifications = useMemo(() => {
    if (!isAdmin || !notifications.length) return [];
    
    return notifications.filter(notification => (
      notification.type === 'warning' || 
      notification.type === 'error' ||
      notification.adminPriority === true
    ));
  }, [isAdmin, notifications]);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load notifications and subscribe to updates
  useEffect(() => {
    if (!currentUser?.id) return;
    
    // Initial fetch
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const [notifData, statsData] = await Promise.all([
          getUserNotifications(currentUser.id, { limit: 10 }),
          getNotificationStats(currentUser.id)
        ]);
        
        setNotifications(notifData);
        setUnreadCount(statsData.unread || 0);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToRealTimeNotifications(
      currentUser.id,
      (newNotification) => {
        setNotifications(prev => [newNotification, ...prev].slice(0, 10));
        setUnreadCount(prev => prev + 1);
      }
    );
    
    return unsubscribe;
  }, [currentUser?.id]);

  // Handle marking notification as read
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id);
        
        // Update UI optimistically
        setNotifications(prev => 
          prev.map(n => 
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    
    // Navigate if there's a link
    if (notification.linkTo) {
      window.location.href = notification.linkTo;
      setIsOpen(false);
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(currentUser.id);
      
      // Update UI optimistically
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Get notification icon and color based on type
  const getNotificationStyle = (type) => {
    switch(type) {
      case 'success':
        return { color: 'text-green-500', bg: 'bg-green-100' };
      case 'error':
        return { color: 'text-red-500', bg: 'bg-red-100' };
      case 'warning':
        return { color: 'text-yellow-500', bg: 'bg-yellow-100' };
      default:
        return { color: 'text-blue-500', bg: 'bg-blue-100' };
    }
  };

  // Format timestamp to a readable format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHrs = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleSendSystemNotification = () => {
    setIsOpen(false);
    window.location.href = '/admin/send-notification';
  };

  if (!currentUser) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Bell icon with badge */}
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <FiBell size={20} />
        
        {/* Notification badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg z-50"
          >
            {isAdmin && adminPriorityNotifications.length > 0 && (
              <div className="mb-3 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <h3 className="text-sm font-medium text-yellow-800">Admin Priority Alerts</h3>
                
                <div className="mt-2 space-y-2">
                  {adminPriorityNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className="flex items-start p-2 bg-white rounded border border-yellow-200 shadow-sm"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="p-1 rounded-full bg-yellow-100 mr-2">
                        {notification.type === 'error' ? (
                          <FiAlertTriangle className="text-red-600 h-4 w-4" />
                        ) : (
                          <FiAlertCircle className="text-yellow-600 h-4 w-4" />
                        )}
                      </div>
                      
                      <div className="flex-1 text-xs">
                        <div className="font-medium text-gray-800">{notification.title}</div>
                        <p className="text-gray-600">{notification.message}</p>
                        <div className="mt-1 text-xs text-gray-400">
                          {formatTime(notification.createdAt)}
                        </div>
                      </div>
                      
                      <button 
                        className="ml-2 text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAllAsRead(notification.id);
                        }}
                      >
                        <FiCheck className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-2 text-right">
                  <button 
                    className="text-xs text-yellow-700 hover:text-yellow-900 font-medium"
                    onClick={() => window.location.href = '/admin/notifications'}
                  >
                    View All Admin Alerts
                  </button>
                </div>
              </div>
            )}
            <div className="p-3 border-b flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-[#123458] hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin h-5 w-5 border-2 border-[#123458] border-t-transparent rounded-full inline-block"></div>
                <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
              </div>
            ) : notifications.length > 0 ? (
              <div>
                {notifications.map(notification => {
                  const style = getNotificationStyle(notification.type);
                  
                  return (
                    <div 
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-3 border-b hover:bg-gray-50 cursor-pointer
                        ${!notification.isRead ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex">
                        <div className={`p-2 rounded-full ${style.bg} ${style.color} mr-3`}>
                          {/* Icon would go here based on notification type */}
                        </div>
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatTime(notification.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            )}
            
            <div className="p-2 text-center border-t">
              <button 
                onClick={() => window.location.href = '/notifications'}
                className="text-sm text-[#123458] hover:underline"
              >
                View all notifications
              </button>
            </div>

            {isAdmin && (
              <div className="mt-4 border-t border-gray-100 pt-2">
                <button 
                  className="w-full py-2 text-sm text-center text-[#123458] hover:bg-gray-50 rounded transition-colors font-medium"
                  onClick={() => window.location.href = '/admin/notifications'}
                >
                  Manage System Notifications
                </button>
              </div>
            )}

            {isAdmin && (
              <div className="mt-2 border-t border-gray-100 pt-2">
                <button
                  className="w-full flex items-center justify-center py-2 text-sm font-medium text-[#123458] hover:bg-gray-50 rounded transition-colors"
                  onClick={handleSendSystemNotification}
                >
                  <FiSend className="mr-2 h-4 w-4" /> Send System Notification
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
