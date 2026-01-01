// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJlCzmJzAwh43N3PmnDZFtGd9cV43IbSY",
  authDomain: "phoneclubs.firebaseapp.com",
  projectId: "phoneclubs",
  storageBucket: "phoneclubs.firebasestorage.app",
  messagingSenderId: "94538997256",
  appId: "1:94538997256:web:2c75b84e07b59d3c1d3bbd",
  measurementId: "G-W0THCJN38W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only if supported)
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch((error) => {
  console.error("Analytics not supported:", error);
});

// Initialize Cloud Messaging (only in browser environment)
let messaging = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error("Messaging initialization error:", error);
  }
}

// Request notification permission and get FCM token
const requestNotificationPermission = async () => {
  if (!messaging) {
    console.warn("Messaging not available");
    return null;
  }

  try {
    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Get FCM token
      // TODO: Replace with your VAPID key from Firebase Console
      // Go to Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
      // Generate a key pair if you haven't already, then replace the value below
      const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY || "YOUR_VAPID_KEY_HERE";
      
      if (vapidKey === "YOUR_VAPID_KEY_HERE") {
        console.warn('FCM VAPID key not configured. Please add REACT_APP_FIREBASE_VAPID_KEY to your .env file');
        return null;
      }
      
      const token = await getToken(messaging, { vapidKey });
      
      if (token) {
        console.log('FCM Token:', token);
        // Store token in localStorage
        localStorage.setItem('fcm_token', token);
        return token;
      } else {
        console.warn('No registration token available.');
        return null;
      }
    } else {
      console.warn('Notification permission denied.');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission or token:', error);
    return null;
  }
};

// Listen for foreground messages
const onMessageListener = () => {
  return new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log('Message received in foreground:', payload);
        resolve(payload);
      });
    }
  });
};

export { app, analytics, messaging, requestNotificationPermission, onMessageListener };

