# Global Leaderboard - Quick Start Guide

## What Was Added

✅ **New Files Created**:
- `leaderboard.js` - Core leaderboard system
- `leaderboard-styles.css` - Beautiful UI styling
- `firebase-config.js` - Firebase configuration
- `LEADERBOARD-SETUP.md` - Detailed setup guide
- `LEADERBOARD-QUICK-START.md` - This file

✅ **Modified Files**:
- `index.html` - Added scripts, styles, and leaderboard button
- `gameLogic.js` - Auto-submits global auras to leaderboard

✅ **Features**:
- 🏆 Global Top 100 leaderboard
- 👤 Personal global aura tracking
- 📊 Live statistics dashboard
- 🎨 Beautiful modern UI with animations
- 🔒 Secure Firestore database
- ⚡ Smart caching (1-minute refresh)
- 🌐 Works in production, skips in local dev

## 5-Minute Setup

### 1. Create Firebase Project (2 min)
```
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it (e.g., "sols-rng-game")
4. Click through wizard → Create
```

### 2. Enable Firestore (1 min)
```
1. In Firebase Console: Build → Firestore Database
2. Click "Create database"
3. Start in production mode
4. Choose location → Enable
```

### 3. Get Configuration (1 min)
```
1. Firebase Console: Settings ⚙️ → Project settings
2. Scroll to "Your apps"
3. Click Web icon (</>)
4. Register app → Copy firebaseConfig object
```

### 4. Update Config File (1 min)
```
Open: firebase-config.js
Replace the placeholder values with your Firebase config
```

### 5. Set Security Rules
```
1. Firestore Database → Rules
2. Copy rules from LEADERBOARD-SETUP.md (Step 5)
3. Publish
```

### 6. Deploy & Test
```bash
firebase deploy
```

Done! 🎉

## How It Works

### When a Global Aura is Rolled:
1. Game detects aura rarity > 99,999,998
2. Auto-submits to Firestore database
3. Shows "LEADERBOARD ENTRY!" notification
4. Entry appears on global leaderboard

### What Players See:
- **🏆 Trophy Button** in top navigation
- **Global Top 100** - All players' best globals
- **Your Globals** - Personal collection
- **Stats** - Total entries, unique players, rarest global

## Quick Test

Want to test without rolling billions of times?

**Option 1: Debug Menu**
```javascript
// Press 'D' to open debug menu, then in console:
window.globalLeaderboard.submitGlobalAura(
    { name: "Test", rarity: 100000000, tier: "transcendent" }, 
    1234
);
```

**Option 2: Use Debug Menu Cutscene**
```javascript
// Test with actual global aura
testChromaticExoticCutscene(); // Triggers Chromatic: Exotic (99M rarity)
```

## Firebase Config Template

```javascript
// Replace these in firebase-config.js:
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456"
};
```

## Security Rules Template

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /globalLeaderboard/{entryId} {
      // Anyone can read
      allow read: if true;
      
      // Validated writes only
      allow create: if request.resource.data.keys().hasAll([
          'playerId', 'playerName', 'auraName', 'auraRarity', 
          'auraTier', 'rollCount', 'timestamp', 'submittedAt'
        ])
        && request.resource.data.playerName.size() >= 3
        && request.resource.data.playerName.size() <= 20
        && request.resource.data.auraRarity > 99999998
        && request.resource.data.rollCount >= 0;
      
      // Update own entries only
      allow update: if resource.data.playerId == request.resource.data.playerId;
      
      // No client deletions
      allow delete: if false;
    }
  }
}
```

## Troubleshooting

**"Firebase not initialized"**
→ Check firebase-config.js has your real config (not placeholders)

**Button doesn't work**
→ Check browser console for errors
→ Verify Firebase SDK loaded in Network tab

**No submissions appearing**
→ Check Firestore rules are published
→ Verify aura is actually global (>99M rarity)
→ Look in Firebase Console → Firestore Database

**Permission denied**
→ Review security rules in Firestore
→ Ensure anonymous writes are allowed

## Local Development

When running on `localhost`:
- ✅ Leaderboard UI works
- ❌ Submissions are skipped
- Console shows: "Leaderboard submission skipped (local mode)"

This prevents test data from cluttering production!

## What Auras Trigger Leaderboard?

Any aura with rarity > 99,999,998, including:
- Chromatic: Genesis (99,999,999)
- Chromatic: Exotic (99,999,999)
- Starscourge: Radiant (100,000,000)
- Equinox (2,500,000,000)
- Abomination (100,000,000,000)
- Eden (999,999,999,999)
- THANEBORNE (999,999,999,999)
- Plus: Memory: The Fallen, Oblivion (special cases)

## User Features

**Change Name**: Click "Change Name" in leaderboard modal
**View Rankings**: Click 🏆 button in top nav
**Track Progress**: Switch to "Your Globals" tab
**See Stats**: View total entries, unique players, rarest global

## Firebase Free Tier

Your leaderboard will stay 100% free with:
- 50,000 reads/day ✅
- 20,000 writes/day ✅
- 1 GB storage ✅

Estimated usage for 1000 daily players:
- ~5,000 reads/day (10% of limit)
- ~50 writes/day (0.25% of limit)
- ~10 MB storage (1% of limit)

## Need Help?

1. **Detailed Guide**: See `LEADERBOARD-SETUP.md`
2. **Browser Console**: Press F12 to see detailed errors
3. **Firebase Console**: Check Firestore Database for data
4. **Test Mode**: Use debug console to test submissions

## Key Files

```
leaderboard.js              - Core system logic
leaderboard-styles.css      - UI styling
firebase-config.js          - Your Firebase credentials (EDIT THIS!)
gameLogic.js               - Auto-submission integration
index.html                 - UI elements & script loading
```

## Next Steps

1. ✅ Complete Firebase setup (5 minutes)
2. ✅ Deploy to Firebase Hosting
3. ✅ Test the leaderboard
4. 🎮 Roll some global auras!
5. 🏆 Watch the leaderboard fill up

Enjoy your global leaderboard! 🎉
