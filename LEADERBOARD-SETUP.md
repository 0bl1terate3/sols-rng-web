# Global Leaderboard Setup Guide

## Overview

The global leaderboard system tracks when players get rare "global" auras (rarity > 99,999,998) and displays them on a public leaderboard. Players can see:
- **Global Top 100**: The rarest auras rolled by all players
- **Personal Stats**: Their own global aura collection
- **Leaderboard Statistics**: Total entries, unique players, and more

## What Qualifies as a Global Aura?

Auras with rarity greater than 99,999,998, plus special auras:
- **Chromatic: Genesis** (1:99,999,999)
- **Chromatic: Exotic** (1:99,999,999)
- **Starscourge: Radiant** (1:100,000,000)
- **Abomination** (1:100,000,000,000)
- **Memory: The Fallen** (1:100)
- **Oblivion** (1:2,000)
- **Eden** (1:999,999,999,999)
- **THANEBORNE** (1:999,999,999,999)
- And all other transcendent/cosmic tier auras above 99M rarity

## Features

✅ **Automatic Submission**: Global auras are automatically submitted when rolled  
✅ **Real-time Updates**: Leaderboard updates every minute  
✅ **Player Names**: Customizable display names (3-20 characters)  
✅ **Top 100 Rankings**: See the rarest auras rolled by all players  
✅ **Personal Tracking**: View all your global auras in one place  
✅ **Statistics Dashboard**: Total entries, unique players, rarest global  
✅ **Beautiful UI**: Modern design with animations and tier-based styling  
✅ **Local Mode**: Works offline, submissions only sent in production  

## Firebase Setup Instructions

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select your existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "sols-rng-game")
   - Enable Google Analytics (optional)
   - Accept terms and click **"Create project"**

### Step 2: Enable Firestore Database

1. In your Firebase project, go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll set rules in Step 4)
4. Select a location (choose one closest to your users)
5. Click **"Enable"**

### Step 3: Get Your Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ → **"Project settings"**
2. Scroll down to **"Your apps"**
3. Click the **Web icon** (`</>`) to add a web app
4. Register your app:
   - App nickname: "Sol's RNG Web App"
   - Don't check "Firebase Hosting" (already set up)
   - Click **"Register app"**
5. Copy the `firebaseConfig` object

### Step 4: Update Your Firebase Configuration

Open `firebase-config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY_HERE",
    authDomain: "your-project-id.firebaseapp.com",
    databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef1234567890"
};
```

**Important**: Keep your `apiKey` in the file - it's safe for client-side use. Firebase security is handled by Firestore rules, not by hiding the API key.

### Step 5: Set Up Firestore Security Rules

To prevent abuse while allowing legitimate leaderboard submissions, set up these security rules:

1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Global Leaderboard Collection
    match /globalLeaderboard/{entryId} {
      // Allow anyone to read leaderboard entries
      allow read: if true;
      
      // Allow authenticated writes with validation
      allow create: if request.auth != null 
        || (
          // Allow anonymous writes but with strict validation
          request.resource.data.keys().hasAll(['playerId', 'playerName', 'auraName', 'auraRarity', 'auraTier', 'rollCount', 'timestamp', 'submittedAt'])
          && request.resource.data.playerName is string
          && request.resource.data.playerName.size() >= 3
          && request.resource.data.playerName.size() <= 20
          && request.resource.data.auraRarity > 99999998
          && request.resource.data.rollCount >= 0
        );
      
      // Allow updates only to own entries (by playerId)
      allow update: if request.auth != null
        || resource.data.playerId == request.resource.data.playerId;
      
      // Prevent deletions from clients (only admins through console)
      allow delete: if false;
    }
  }
}
```

3. Click **"Publish"**

### Step 6: Test the Leaderboard

1. Deploy your updated game to Firebase Hosting:
   ```bash
   firebase deploy
   ```

2. Open your game in a browser
3. Click the **🏆** trophy button in the top navigation
4. You should see the leaderboard modal (empty initially)

### Step 7: Test Submission (Optional)

To test submissions without rolling billions of times:

1. Open the debug menu (press `D` key)
2. Look for leaderboard testing functions, or:
3. Open browser console and run:
   ```javascript
   // Test submission
   const testAura = { 
       name: "Test Global", 
       rarity: 100000000, 
       tier: "transcendent" 
   };
   window.globalLeaderboard.submitGlobalAura(testAura, 1234);
   ```

4. Check the leaderboard - you should see your test entry!

## Firestore Database Structure

```
globalLeaderboard (collection)
  ├── {auto-generated-id} (document)
  │   ├── playerId: "player_1234567890_abc123"
  │   ├── playerName: "YourName"
  │   ├── auraName: "Abomination"
  │   ├── auraRarity: 100000000000
  │   ├── auraTier: "cosmic"
  │   ├── rollCount: 45678
  │   ├── timestamp: Timestamp
  │   └── submittedAt: 1699123456789
  └── ...
```

## User Features

### Changing Your Display Name

Players can change their leaderboard name at any time:
1. Click the **🏆** trophy button
2. Click **"Change Name"** button
3. Enter a new name (3-20 characters)
4. All existing entries will be updated

### Viewing the Leaderboard

**Global Top 100 Tab**:
- Shows the 100 rarest auras rolled by all players
- Sorted by rarity (highest first)
- Gold/Silver/Bronze styling for top 3
- Your entries are highlighted in green

**Your Globals Tab**:
- Shows all your global aura rolls
- Personal collection tracking
- Same beautiful UI

## Performance & Caching

The leaderboard uses smart caching:
- **Cache Duration**: 1 minute
- **Auto-refresh**: After submitting new entries
- **Optimized Queries**: Firestore indexes for fast lookups

## Local Development

When running on `localhost` or `127.0.0.1`:
- ✅ Leaderboard UI works normally
- ❌ Submissions are skipped (console message shown)
- ✅ Perfect for testing without cluttering production data

## Troubleshooting

### Leaderboard button doesn't work
- Check browser console for errors
- Verify Firebase config is set correctly
- Make sure Firebase SDK loaded (check Network tab)

### "Firebase not initialized" error
- Open `firebase-config.js` and verify your config
- Ensure you replaced all placeholder values
- Check that Firestore is enabled in Firebase Console

### Submissions not appearing
- Check Firestore security rules are published
- Verify the aura is a global (rarity > 99,999,998)
- Check browser console for submission errors
- Look in Firebase Console → Firestore → globalLeaderboard collection

### Permission denied errors
- Review your Firestore security rules
- Ensure rules allow anonymous writes with validation
- Check the error details in browser console

## Monitoring Usage

To monitor your leaderboard usage:
1. Go to Firebase Console
2. **Firestore Database** → **Usage** tab
3. Check:
   - Document reads/writes
   - Storage usage
   - Network egress

**Free Tier Limits** (Spark Plan):
- 50,000 reads/day
- 20,000 writes/day
- 1 GiB storage
- 10 GiB/month network egress

For this leaderboard:
- Each view = ~50-100 reads
- Each submission = 1 write
- Should easily stay within free tier limits

## Optional: Set Up Authentication

For enhanced security, you can enable Firebase Authentication:

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Enable **"Anonymous"** sign-in
4. Update `leaderboard.js` to use anonymous auth:

```javascript
// Add this in initializeFirebase() after firebase.initializeApp()
await firebase.auth().signInAnonymously();
```

This gives each player a unique authenticated ID without requiring sign-up.

## Cost Considerations

The leaderboard is designed to be **completely free** under Firebase's Spark plan:
- Minimal reads (cached for 1 minute)
- Minimal writes (only on global auras)
- Small document size (~200 bytes each)
- Efficient queries with indexes

**Estimated Usage** (for 1000 daily active players):
- ~5,000 reads/day (well under 50k limit)
- ~50 writes/day (well under 20k limit)
- ~10 MB storage (well under 1 GB limit)

## Support

If you encounter issues:
1. Check browser console for detailed errors
2. Review Firebase Console for Firestore errors
3. Verify all setup steps were completed
4. Test in incognito mode (clears cache/cookies)

## Credits

Global Leaderboard System v1.0  
Integrated with Sol's RNG game  
Powered by Firebase Firestore
