import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  analytics, 
  messaging, 
  requestNotificationPermission, 
  onMessageListener 
} from '../config/firebase';
import { logEvent } from 'firebase/analytics';
import { useAuth } from './AuthContext';

// Create a wrapper to handle Analytics when it might be null
const safeLogEvent = (analyticsInstance, eventName, params) => {
  if (analyticsInstance) {
    try {
      logEvent(analyticsInstance, eventName, params);
    } catch (error) {
      console.error('Error logging event:', error);
    }
  }
};

const FirebaseContext = createContext();

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider = ({ children }) => {
  const [fcmToken, setFcmToken] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const { user } = useAuth();

  useEffect(() => {
    // Initialize notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Request notification permission on mount
    const initializeNotifications = async () => {
      try {
        const token = await requestNotificationPermission();
        if (token) {
          setFcmToken(token);
          // Send token to backend for storing user device tokens
          if (user) {
            sendTokenToBackend(token);
          }
        }
        if ('Notification' in window) {
          setNotificationPermission(Notification.permission);
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    // Listen for foreground messages
    if (messaging) {
      onMessageListener()
        .then((payload) => {
          console.log('Foreground message received:', payload);
          // You can show a notification here
          if (payload.notification) {
            showNotification(payload.notification);
          }
        })
        .catch((error) => {
          console.error('Error listening for messages:', error);
        });
    }

    // Request permission after a delay to avoid blocking initial load
    setTimeout(initializeNotifications, 2000);

    // Re-request permission if user logs in
    if (user && fcmToken) {
      sendTokenToBackend(fcmToken);
    }
  }, [user]);

  // Send FCM token to backend
  const sendTokenToBackend = async (token) => {
    try {
      // You'll need to create an endpoint in your backend to store this token
      const response = await fetch('/api/users/fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fcmToken: token })
      });
      
      if (response.ok) {
        console.log('FCM token sent to backend successfully');
      }
    } catch (error) {
      console.error('Error sending FCM token to backend:', error);
    }
  };

  // Show notification
  const showNotification = (notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon || '/logo.png',
        badge: '/logo.png',
      });
    }
  };

  // Track event in Analytics
  const trackEvent = (eventName, eventParams = {}) => {
    safeLogEvent(analytics, eventName, {
      ...eventParams,
      user_id: user?.id || user?._id || 'anonymous',
      timestamp: new Date().toISOString(),
    });
    console.log('Event tracked:', eventName, eventParams);
  };

  // Track page view
  const trackPageView = (pageName, pagePath) => {
    safeLogEvent(analytics, 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_path: pagePath,
    });
  };

  // Request notification permission manually
  const requestPermission = async () => {
    try {
      const token = await requestNotificationPermission();
      if (token) {
        setFcmToken(token);
        if (user) {
          sendTokenToBackend(token);
        }
      }
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
      return token;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return null;
    }
  };

  const value = {
    analytics,
    messaging,
    fcmToken,
    notificationPermission,
    trackEvent,
    trackPageView,
    requestPermission,
    sendTokenToBackend,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

