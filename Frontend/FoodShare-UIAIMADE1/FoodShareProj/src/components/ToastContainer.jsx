import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom';
import ToastAlert from './ToastAlert';

// Create a context for the toast functionality
const ToastContext = createContext(null);

// Custom hook to use the toast functionality
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Generate unique ID for each toast
  const generateId = () => `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Add a new toast
  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = generateId();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Helper functions for different toast types
  const toast = {
    show: (message, options) => addToast(message, 'info', options?.duration),
    success: (message, options) => addToast(message, 'success', options?.duration),
    error: (message, options) => addToast(message, 'error', options?.duration),
    warning: (message, options) => addToast(message, 'warning', options?.duration),
    info: (message, options) => addToast(message, 'info', options?.duration),
    remove: removeToast
  };

  // Portal for toasts
  const ToastPortal = () => {
    // Create a div for the toast container if it doesn't exist
    useEffect(() => {
      const portalDiv = document.getElementById('toast-portal');
      if (!portalDiv) {
        const div = document.createElement('div');
        div.id = 'toast-portal';
        document.body.appendChild(div);
        return () => document.body.removeChild(div);
      }
    }, []);

    const portalElement = document.getElementById('toast-portal');
    if (!portalElement) return null;

    return ReactDOM.createPortal(
      <div className="fixed bottom-0 right-0 p-4 space-y-4 pointer-events-none z-50">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastAlert
              type={toast.type}
              message={toast.message}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>,
      portalElement
    );
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastPortal />
    </ToastContext.Provider>
  );
};

// Default export for backward compatibility
export default ToastProvider;
