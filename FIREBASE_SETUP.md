# Firebase Setup Guide

This guide will help you complete the Firebase setup for analytics and push notifications.

## What's Already Set Up

✅ Firebase SDK installed
✅ Firebase Analytics initialized
✅ Firebase Cloud Messaging (FCM) configured
✅ Service Worker for push notifications created
✅ Event tracking integrated throughout the app
✅ Automatic page view tracking

## Required: Get Your VAPID Key for Push Notifications

To enable push notifications, you need to get your VAPID (Voluntary Application Server Identification) key from Firebase:

### Steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **phoneclubs**
3. Click on the **gear icon** ⚙️ next to "Project Overview"
4. Select **Project Settings**
5. Go to the **Cloud Messaging** tab
6. Under **Web Push certificates**, you'll see a key pair or a button to generate one
7. Copy the **Key pair** value (it looks like: `BK8x7...`)

### Add VAPID Key to Your Project

#### Option 1: Using Environment Variable (Recommended)

1. Create a `.env` file in the `frontend` directory (if it doesn't exist)
2. Add the following line:
   ```
   REACT_APP_FIREBASE_VAPID_KEY=your_vapid_key_here
   ```
3. Replace `your_vapid_key_here` with the actual VAPID key from Firebase Console
4. Restart your development server

#### Option 2: Direct Configuration

Edit `frontend/src/config/firebase.js` and replace `"YOUR_VAPID_KEY_HERE"` with your actual VAPID key.

## Backend Setup for Storing FCM Tokens

The frontend is set up to send FCM tokens to your backend. You'll need to create an endpoint to store these tokens.

### Required Backend Endpoint

Create a POST endpoint: `/api/users/fcm-token`

**Request Body:**
```json
{
  "fcmToken": "user_fcm_token_here"
}
```

**Headers:**
```
Authorization: Bearer <user_jwt_token>
Content-Type: application/json
```

**Example Implementation (Express/Node.js):**
```javascript
router.post('/users/fcm-token', authenticateToken, async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user.id;

    // Update user document with FCM token
    await User.findByIdAndUpdate(userId, {
      fcmToken: fcmToken,
      fcmTokenUpdatedAt: new Date()
    });

    res.json({ success: true, message: 'FCM token saved' });
  } catch (error) {
    console.error('Error saving FCM token:', error);
    res.status(500).json({ error: 'Failed to save FCM token' });
  }
});
```

## Sending Push Notifications to All Users

To send push notifications to all users from your backend:

### Using Firebase Admin SDK

1. Install Firebase Admin SDK:
   ```bash
   npm install firebase-admin
   ```

2. Initialize Firebase Admin in your backend:
   ```javascript
   const admin = require('firebase-admin');
   const serviceAccount = require('./path/to/serviceAccountKey.json');

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });
   ```

3. Send notification to all users:
   ```javascript
   const sendNotificationToAllUsers = async (title, body, data = {}) => {
     // Get all users with FCM tokens from your database
     const users = await User.find({ fcmToken: { $exists: true, $ne: null } });
     const tokens = users.map(user => user.fcmToken);

     if (tokens.length === 0) {
       console.log('No FCM tokens found');
      return;
     }

     const message = {
       notification: {
         title: title,
         body: body,
       },
       data: data,
       tokens: tokens, // Send to multiple tokens
     };

     try {
       const response = await admin.messaging().sendEachForMulticast(message);
       console.log('Successfully sent message:', response);
     } catch (error) {
       console.error('Error sending message:', error);
     }
   };
   ```

## Tracked Events

The following events are automatically tracked:

### Authentication Events
- `login` - User logs in successfully
- `login_failed` - Login attempt fails
- `sign_up` - New user registers
- `sign_up_failed` - Registration fails

### Listing Events
- `view_listing` - User views a listing
- `share_listing` - User shares a listing

### Search Events
- `search` - User performs a search

### Auction Events
- `bid_placed` - User places a bid
- `bid_failed` - Bid placement fails

### Page Views
- All page views are automatically tracked

## Custom Event Tracking

You can track custom events anywhere in your app:

```javascript
import { useFirebase } from '../context/FirebaseContext';

const MyComponent = () => {
  const { trackEvent } = useFirebase();

  const handleAction = () => {
    trackEvent('custom_event_name', {
      param1: 'value1',
      param2: 'value2',
    });
  };

  return <button onClick={handleAction}>Click Me</button>;
};
```

## Testing Push Notifications

1. Grant notification permission when prompted
2. Check browser console for FCM token
3. Send a test notification from Firebase Console:
   - Go to Cloud Messaging in Firebase Console
   - Click "Send test message"
   - Enter the FCM token from console
   - Send test notification

## Troubleshooting

### Notifications not working?
- Check if VAPID key is correctly set
- Verify service worker is registered (check browser console)
- Ensure HTTPS (required for push notifications, except localhost)
- Check notification permissions in browser settings

### Analytics not showing?
- Check Firebase Console > Analytics
- Wait a few minutes for events to appear
- Verify `measurementId` is correct in config

### Service Worker not loading?
- Check browser console for errors
- Verify `firebase-messaging-sw.js` is in the `public` folder
- Clear browser cache and reload

## Need Help?

Refer to Firebase Documentation:
- [Firebase Analytics](https://firebase.google.com/docs/analytics)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)

