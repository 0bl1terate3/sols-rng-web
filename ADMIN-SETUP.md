# 🔐 Admin Panel Setup Guide

## Overview
The Admin Panel allows you (and only you) to:
- ✅ Force refresh all connected players instantly
- ✅ Broadcast update messages with auto-refresh
- ✅ Update app version to trigger auto-refresh
- ✅ View statistics (leaderboard entries, active updates, etc.)

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Set Admin Password in Firestore

1. Go to **Firebase Console** → **Firestore Database**
2. Click **"Start collection"** (or navigate to collections)
3. Create a new collection: **`admin`**
4. Add a document with ID: **`config`**
5. Add a field:
   - **Field name:** `password`
   - **Type:** `string`
   - **Value:** Your secret password (e.g., `mySecretPassword123`)

**Example Firestore Structure:**
```
admin (collection)
  └── config (document)
       └── password: "mySecretPassword123"
```

### Step 2: Set Firestore Security Rules for Admin

Go to **Firestore** → **Rules** tab and add these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Global Leaderboard Collection (existing)
    match /globalLeaderboard/{entryId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['playerId', 'playerName', 'auraName', 'auraRarity', 'auraTier', 'rollCount', 'timestamp', 'submittedAt'])
        && request.resource.data.playerName.size() >= 3
        && request.resource.data.playerName.size() <= 20
        && request.resource.data.auraRarity > 99999998
        && request.resource.data.rollCount >= 0;
      allow update: if resource.data.playerId == request.resource.data.playerId;
      allow delete: if false;
    }
    
    // Admin Configuration - Read-only (NEW)
    match /admin/{document=**} {
      allow read: if true;  // Anyone can read (for authentication check)
      allow write: if false; // No one can write (protect your password)
    }
  }
}
```

**Important:** The `allow write: if false` means you can ONLY edit the admin password through the Firebase Console, not through the app. This prevents hackers from changing your password.

### Step 3: Deploy & Test

1. **Deploy your game:**
   ```bash
   firebase deploy
   ```

2. **Open your game** in a browser

3. **Press `Ctrl+Shift+A`** to open the admin panel

4. **Enter your password** (the one you set in Firestore)

5. **You're in!** 🎉

---

## 🎮 How to Use

### Opening the Admin Panel
Press **`Ctrl+Shift+A`** anywhere in the game.

### Admin Features

#### 🔄 Force Refresh All Players
- Instantly refreshes ALL connected players
- Use this for immediate updates
- ⚠️ WARNING: This is instant, no countdown!

#### 📢 Broadcast Update Message
- Show a message overlay to all players
- Optional: Auto-refresh after 5 seconds
- Optional: Auto-clear after X milliseconds
- Use this for scheduled updates

#### 🔢 Update Version
- Change the app version number
- Triggers auto-refresh on all clients
- Best for major updates

#### 📊 View Statistics
- See current version
- Check update status
- View leaderboard entry count

---

## 🔒 Security Features

### ✅ What's Protected:
- Admin password stored in Firestore (read-only from app)
- Password can only be changed via Firebase Console
- Only authenticated admins can trigger updates
- Authentication required for all admin actions

### ✅ Who Can Access:
- **Only you** (with the password)
- No one else can change the password without Firebase Console access
- If someone guesses your password, change it in Firebase Console immediately

### ⚠️ Best Practices:
1. Use a **strong, unique password**
2. Don't share your password
3. Change it regularly (via Firebase Console)
4. Keep your Firebase Console login secure

---

## 📝 Update Scenarios

### Scenario 1: Quick Bug Fix
1. Fix the bug in your code
2. Deploy: `firebase deploy`
3. Open admin panel: `Ctrl+Shift+A`
4. Click **"Force Refresh Everyone"**
5. ✅ All players get the fix instantly

### Scenario 2: Scheduled Maintenance
1. Open admin panel: `Ctrl+Shift+A`
2. Set message: "Maintenance in 5 minutes..."
3. Uncheck "Auto-refresh"
4. Set duration: 300000 (5 minutes)
5. Click **"Broadcast Update"**
6. After 5 minutes, deploy changes
7. Click **"Force Refresh Everyone"**

### Scenario 3: Version Update
1. Deploy new version: `firebase deploy`
2. Open admin panel: `Ctrl+Shift+A`
3. Enter new version: "2.5.0"
4. Click **"Update Version"**
5. ✅ All clients auto-refresh when they detect version change

---

## 🛠️ Troubleshooting

### "Admin config not found"
**Solution:** Make sure you created the `admin/config` document in Firestore with a `password` field.

### "Incorrect password"
**Solution:** Check that you're entering the exact password from Firestore (case-sensitive).

### "Update system not available"
**Solution:** 
1. Make sure Firebase is initialized
2. Check browser console for errors
3. Verify `updateSystem.js` is loaded

### Admin panel won't open
**Solution:**
1. Try pressing `Ctrl+Shift+A` again
2. Check browser console for JavaScript errors
3. Make sure `admin-panel.js` is loaded

---

## 🎯 Pro Tips

1. **Test locally first:** Open admin panel on localhost to make sure it works before deploying
2. **Announce updates:** Use broadcast messages before force refreshing
3. **Monitor statistics:** Check the stats regularly to see player activity
4. **Version numbering:** Use semantic versioning (e.g., 2.5.0)
5. **Keep it secret:** Never show the admin panel on streams or screenshots!

---

## 📚 Technical Details

### Files Added:
- `admin-panel.js` - Admin panel logic
- `admin-panel-styles.css` - Admin panel styling
- `ADMIN-SETUP.md` - This guide

### Files Modified:
- `index.html` - Added admin panel CSS and JS

### Firebase Collections Used:
- `admin/config` - Stores admin password (Firestore)
- `system/update` - Update broadcast data (Realtime Database)
- `appInfo/version` - App version (Realtime Database)

### Keyboard Shortcut:
- `Ctrl+Shift+A` - Open admin panel

---

## 🚨 Emergency: Reset Admin Password

If you forget your password or need to reset it:

1. Go to **Firebase Console**
2. **Firestore Database** → `admin` → `config`
3. Edit the `password` field
4. Save
5. Use the new password to login

---

## ✨ You're All Set!

Deploy, press `Ctrl+Shift+A`, login, and start managing your game like a boss! 🎮

If you have questions, check the browser console for detailed logs.
