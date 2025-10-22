# 🔄 Update System Guide

This guide explains how to use the **Update Broadcast System** to show update overlays to all connected users and optionally refresh their screens.

---

## 🚀 Quick Start

### Option 1: Test Locally (No Setup Required)
1. Open your game in a browser
2. Press **Ctrl+Shift+A** or click the gear icon (⚙️) in the bottom-right corner
3. Click "**🧪 Test Locally**" to see how the update overlay looks
4. This won't broadcast to other users, just shows it on your screen

### Option 2: Broadcast to All Users (Firebase Setup Required)
To broadcast updates to all connected users, you need to set up Firebase Realtime Database.

---

## 📋 Firebase Setup Instructions

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select your existing project
3. Follow the setup wizard

### Step 2: Enable Realtime Database
1. In your Firebase project, click "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose a location (e.g., United States)
4. Start in **test mode** for now (you can secure it later)
5. Click "Enable"

### Step 3: Get Your Firebase Configuration
1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. If you haven't added a web app, click the "</>" icon to add one
5. Copy your Firebase configuration object

It will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Step 4: Update Your Code
1. Open `updateSystem.js`
2. Find the `firebaseConfig` object near the bottom (around line 156)
3. Replace the placeholder values with your actual Firebase config
4. Save the file

### Step 5: Set Database Rules (Optional but Recommended)
For security, update your Firebase Realtime Database rules:

1. Go to Firebase Console → Realtime Database → Rules
2. Replace with these rules:

```json
{
  "rules": {
    "system": {
      "update": {
        ".read": true,
        ".write": false
      }
    }
  }
}
```

This allows everyone to READ the update status, but you'll need to manually write updates through the Firebase Console or use Firebase Auth for admin users.

**For Admin Write Access**, you can use:
```json
{
  "rules": {
    "system": {
      "update": {
        ".read": true,
        ".write": "auth != null"
      }
    }
  }
}
```

Then authenticate using Firebase Auth in your admin panel.

---

## 🎮 How to Use

### Admin Panel Access
- **Keyboard Shortcut**: Press `Ctrl+Shift+A`
- **Click**: Click the gear icon (⚙️) in the bottom-right corner

### Admin Panel Options

#### 1. 📢 Show Update Overlay
- Shows the update overlay to all connected users
- Stays visible until you manually clear it
- Users can still see the overlay but can't interact with the game

**Usage:**
```javascript
updateSystem.broadcastUpdate('UPDATE IN PROGRESS...');
```

#### 2. ⏱️ Show Update (30s auto-clear)
- Shows the update overlay
- Automatically clears after 30 seconds
- Perfect for brief maintenance

**Usage:**
```javascript
updateSystem.broadcastUpdate('Deploying new features...', false, 30000);
```

#### 3. 🔄 Force Refresh All Users
- Shows an update overlay with countdown
- Automatically refreshes all users' browsers after 5 seconds
- Use this when you've deployed new code

**Usage:**
```javascript
updateSystem.forceRefreshAll('UPDATE COMPLETE - REFRESHING...', 5000);
```

#### 4. ✅ Clear Update Overlay
- Removes the update overlay from all users
- Use this when maintenance is complete

**Usage:**
```javascript
updateSystem.clearUpdate();
```

#### 5. 🧪 Test Locally
- Shows the overlay on your screen only
- Doesn't broadcast to other users
- Perfect for testing how it looks

---

## 💻 Advanced Usage (Browser Console)

You can also trigger updates from the browser console:

```javascript
// Show update to all users
updateSystem.broadcastUpdate('Server maintenance in progress...');

// Show update with auto-clear after 60 seconds
updateSystem.broadcastUpdate('Updating game data...', false, 60000);

// Force refresh all users in 10 seconds
updateSystem.forceRefreshAll('New version available!', 10000);

// Clear update
updateSystem.clearUpdate();

// Test locally (no broadcast)
updateSystem.showUpdateOverlay('Testing update screen');
updateSystem.hideUpdateOverlay();
```

---

## 🎨 Customization

### Custom Messages
Edit the message in the admin panel before clicking the button, or pass a custom message:

```javascript
updateSystem.broadcastUpdate('🎮 New features incoming! Please wait...');
```

### Change Countdown Duration
Modify the delay parameter (in milliseconds):

```javascript
// Refresh after 10 seconds instead of 5
updateSystem.forceRefreshAll('Refreshing...', 10000);
```

### Styling
Edit `style.css` starting at line 2053 to customize:
- Colors
- Animation speed
- Overlay opacity
- Font sizes
- Spinner style

---

## 🔒 Security Considerations

### For Production Use:
1. **Secure Database Rules**: Use Firebase Auth to control who can trigger updates
2. **Admin Authentication**: Add login system for admin panel
3. **Rate Limiting**: Prevent spam updates
4. **Logging**: Track who triggered updates and when

### Example Secure Setup:
```javascript
// In updateSystem.js, add authentication check
async broadcastUpdate(message, autoRefresh, duration) {
    // Check if user is admin
    const user = firebase.auth().currentUser;
    if (!user || !user.email.includes('@yourdomain.com')) {
        console.error('Unauthorized');
        return false;
    }
    
    // Continue with broadcast...
}
```

---

## 🐛 Troubleshooting

### Update Not Broadcasting
1. Check browser console for errors
2. Verify Firebase config in `updateSystem.js`
3. Ensure Firebase Realtime Database is enabled
4. Check database rules allow write access

### Overlay Not Showing
1. Check CSS is loaded properly
2. Verify no z-index conflicts
3. Check browser console for JavaScript errors

### Refresh Not Working
1. Ensure `autoRefresh` parameter is `true`
2. Check countdown is displaying
3. Verify no popup blockers are interfering

---

## 📱 Testing Workflow

1. **Local Test First**: Use "Test Locally" to verify appearance
2. **Test with Two Browsers**: Open game in two different browser windows
3. **Trigger Update**: Use admin panel to broadcast
4. **Verify Both Screens**: Confirm overlay shows on both
5. **Test Refresh**: Try force refresh and confirm both reload

---

## 🎯 Use Cases

### During Development
- Show "New features coming soon!" message
- Force refresh after deploying updates

### Scheduled Maintenance
- Show "Scheduled maintenance at 2 AM EST"
- Auto-clear when done

### Emergency Updates
- Show "Critical update in progress"
- Force immediate refresh

### New Feature Announcements
- Show "🎉 New auras added! Refreshing..."
- Refresh to load new content

---

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Firebase setup is correct
3. Test with Firebase Console directly
4. Check network requests in browser DevTools

---

## ✨ Features

- ✅ Real-time broadcast to all users
- ✅ Customizable messages
- ✅ Auto-refresh capability
- ✅ Auto-clear timers
- ✅ Beautiful animated overlay
- ✅ Admin panel with keyboard shortcut
- ✅ Local testing mode
- ✅ Works across all browsers
- ✅ Mobile-friendly

---

**Enjoy your new update system!** 🚀
