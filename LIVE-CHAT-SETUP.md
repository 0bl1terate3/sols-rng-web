# Live Chat System Setup Guide

## 🎯 Overview
The live chat system allows all players to talk to each other in real-time using Firebase Realtime Database.

## ✅ Features
- ✨ Real-time messaging
- 👥 Online user counter
- 🔒 Anti-spam protection (2 second cooldown)
- 🗑️ Automatic message cleanup (24 hours)
- 📱 Mobile responsive
- ⚙️ Customizable username
- 💬 Minimizable chat window
- 🎨 Beautiful UI with animations

---

## 🔧 Firebase Setup

### 1. Enable Firebase Realtime Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`solsrngweb`)
3. Click **"Realtime Database"** in the left sidebar
4. Click **"Create Database"**
5. Choose location: `us-central1`
6. Start in **"Test mode"** (we'll secure it next)

### 2. Configure Security Rules

Go to the **"Rules"** tab in Realtime Database and replace with:

```json
{
  "rules": {
    "chat": {
      "messages": {
        ".read": true,
        ".write": true,
        "$messageId": {
          ".validate": "newData.hasChildren(['username', 'text', 'timestamp', 'uid'])",
          "username": {
            ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 20"
          },
          "text": {
            ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 200"
          },
          "timestamp": {
            ".validate": "newData.val() === now"
          },
          "uid": {
            ".validate": "newData.isString()"
          }
        }
      },
      "online": {
        ".read": true,
        ".write": true,
        "$userId": {
          ".validate": "newData.hasChildren(['username', 'uid', 'timestamp'])"
        }
      }
    }
  }
}
```

### 3. Publish Rules

Click **"Publish"** to save the rules.

---

## 🎮 How to Use

### For Players:

1. **Open the game** - Chat will appear in bottom-right corner
2. **Type a message** in the input box
3. **Press Enter or click Send** to send
4. **See online users** counter at bottom
5. **Click ⚙️** to change username
6. **Click −** to minimize chat

### Chat Commands:

- **Type normally** - Send a message
- **Enter key** - Send message
- **Settings button** - Change username
- **Minimize button** - Hide/show chat

---

## 🛠️ Features Explained

### Auto-Spam Protection
- Players can send 1 message every 2 seconds
- Prevents chat flooding

### Message Cleanup
- Messages older than 24 hours are automatically deleted
- Keeps database clean and fast

### Online Users
- Shows how many players are online in real-time
- Updates automatically when players join/leave

### Username System
- Uses player's in-game name by default
- Can be customized via settings
- Stored in localStorage

---

## 🎨 Customization

### Change Chat Position

Edit `live-chat-styles.css`:

```css
.live-chat-container {
    bottom: 20px;  /* Distance from bottom */
    right: 20px;   /* Distance from right */
    /* Change to left: 20px for left side */
}
```

### Change Chat Size

```css
.live-chat-container {
    width: 350px;   /* Chat width */
    height: 500px;  /* Chat height */
}
```

### Change Colors

```css
.live-chat-container {
    background: linear-gradient(135deg, 
        rgba(30, 30, 50, 0.95) 0%, 
        rgba(20, 20, 40, 0.95) 100%);
    border: 2px solid rgba(102, 126, 234, 0.3);
}
```

---

## 🔍 Troubleshooting

### Chat not appearing?
1. Check browser console (F12) for errors
2. Make sure Firebase is configured correctly
3. Verify `firebase-config.js` has correct credentials

### Messages not sending?
1. Check Firebase Realtime Database rules are published
2. Verify database URL in `firebase-config.js`
3. Check browser console for permission errors

### "Waiting for Firebase" message?
- Firebase is still loading, wait a few seconds
- Check internet connection
- Verify Firebase SDK is loaded

### No online users showing?
- Refresh the page
- Check Firebase Realtime Database is enabled
- Verify security rules allow read/write to `chat/online`

---

## 📊 Database Structure

```
chat/
├── messages/
│   ├── message_id_1/
│   │   ├── username: "Player1"
│   │   ├── text: "Hello!"
│   │   ├── timestamp: 1234567890
│   │   └── uid: "user_xyz"
│   └── message_id_2/
│       └── ...
└── online/
    ├── user_id_1/
    │   ├── username: "Player1"
    │   ├── uid: "user_xyz"
    │   └── timestamp: 1234567890
    └── user_id_2/
        └── ...
```

---

## 🚀 Advanced Features (Optional)

### Add Emoji Support
Users can already type emojis: 😀 🎮 ⚡ 🌟

### Add Moderators
Edit `live-chat.js` to add admin features:
```javascript
const MODERATORS = ['admin_uid_1', 'admin_uid_2'];
```

### Add Message Reactions
Extend the message object with reactions field

### Add Private Messages
Create separate database path for DMs

---

## 📝 Notes

- Chat is global - all players see same messages
- Messages are stored for 24 hours max
- Username length: 1-20 characters
- Message length: 1-200 characters
- Spam protection: 1 message per 2 seconds

---

## ✅ Testing

1. Open game in two different browsers/tabs
2. Send message from first tab
3. Message should appear in both tabs instantly
4. Check online counter shows "2 online"

---

## 🎉 You're Done!

The live chat system is now fully functional! Players can now communicate in real-time while playing the game.

### Support
If you need help, check the browser console (F12) for error messages.
