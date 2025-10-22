# Anti-Cheat Protection Guide

## Current Vulnerabilities

Your game is **100% client-side**, meaning players can:
- Open DevTools Console and type: `gameState.money = 999999999`
- Edit localStorage directly
- Modify any game variable
- Skip cooldowns, force rare rolls, etc.

## Protection Strategies (Ranked by Security)

### 🔒 Level 1: Server-Side Validation (MOST SECURE)

**What it does:** Move critical operations to Firebase Cloud Functions that players can't access.

**Implementation:**
1. **Install Firebase Functions:**
   ```bash
   npm install -g firebase-tools
   firebase init functions
   ```

2. **Create Cloud Functions** (in `functions/index.js`):
   ```javascript
   const functions = require('firebase-functions');
   const admin = require('firebase-admin');
   admin.initializeApp();

   // Validate and process a roll
   exports.processRoll = functions.https.onCall(async (data, context) => {
       const playerId = data.playerId;
       
       // Get player data from Firestore
       const playerDoc = await admin.firestore()
           .collection('players')
           .doc(playerId)
           .get();
       
       const playerData = playerDoc.data();
       
       // SERVER-SIDE VALIDATION
       if (playerData.money < 10) {
           throw new functions.https.HttpsError('failed-precondition', 'Not enough money');
       }
       
       // Deduct money on server
       await playerDoc.ref.update({
           money: admin.firestore.FieldValue.increment(-10),
           totalRolls: admin.firestore.FieldValue.increment(1)
       });
       
       // Calculate roll result on server
       const aura = calculateAuraOnServer(playerData.luck);
       
       // Add aura to inventory
       await playerDoc.ref.update({
           [`inventory.auras.${aura.name}`]: admin.firestore.FieldValue.increment(1)
       });
       
       return { aura, newMoney: playerData.money - 10 };
   });
   
   // Validate purchases
   exports.validatePurchase = functions.https.onCall(async (data, context) => {
       // Server validates player has enough money
       // Server deducts money
       // Server adds item
       // Returns success/failure
   });
   ```

3. **Call from client:**
   ```javascript
   // In gameLogic.js
   async function rollAura() {
       try {
           const processRoll = firebase.functions().httpsCallable('processRoll');
           const result = await processRoll({ 
               playerId: localStorage.getItem('playerId')
           });
           
           // Update UI with server response
           gameState.money = result.data.newMoney;
           gameState.currentAura = result.data.aura;
           updateUI();
       } catch (error) {
           showNotification('Roll failed: ' + error.message, 'error');
       }
   }
   ```

**Pros:**
- ✅ **100% secure** - impossible to cheat
- ✅ Authoritative server
- ✅ Can detect and ban cheaters

**Cons:**
- ❌ Requires Firebase Blaze plan ($$$)
- ❌ More complex to implement
- ❌ Adds latency to actions

---

### 🔐 Level 2: Data Integrity Checks (GOOD BALANCE)

**What it does:** Encrypt/hash data to detect tampering without full server validation.

**Implementation:**

1. **Create integrity checker:**
   ```javascript
   // anti-cheat.js
   class AntiCheat {
       constructor() {
           this.salt = 'YOUR_SECRET_SALT_' + Date.now(); // Change this!
       }
       
       // Generate hash of game state
       generateHash(data) {
           const str = JSON.stringify(data) + this.salt;
           return this.simpleHash(str);
       }
       
       // Simple hash function
       simpleHash(str) {
           let hash = 0;
           for (let i = 0; i < str.length; i++) {
               const char = str.charCodeAt(i);
               hash = ((hash << 5) - hash) + char;
               hash = hash & hash; // Convert to 32bit integer
           }
           return hash.toString(36);
       }
       
       // Save with integrity check
       saveGameState(gameState) {
           const hash = this.generateHash(gameState);
           localStorage.setItem('gameState', JSON.stringify(gameState));
           localStorage.setItem('gameStateHash', hash);
       }
       
       // Load and verify
       loadGameState() {
           const savedState = localStorage.getItem('gameState');
           const savedHash = localStorage.getItem('gameStateHash');
           
           if (!savedState) return null;
           
           const gameState = JSON.parse(savedState);
           const currentHash = this.generateHash(gameState);
           
           // Check if data was tampered with
           if (currentHash !== savedHash) {
               console.warn('⚠️ SAVE DATA TAMPERING DETECTED!');
               this.handleCheatDetection();
               return null; // Reset their progress
           }
           
           return gameState;
       }
       
       // Handle detected cheating
       handleCheatDetection() {
           alert('⚠️ Save data corruption detected. Progress has been reset.');
           localStorage.clear();
           window.location.reload();
       }
       
       // Periodic integrity check (run every 30 seconds)
       startPeriodicCheck() {
           setInterval(() => {
               const savedHash = localStorage.getItem('gameStateHash');
               const currentHash = this.generateHash(gameState);
               
               if (savedHash && currentHash !== savedHash) {
                   this.handleCheatDetection();
               }
           }, 30000);
       }
   }
   
   window.antiCheat = new AntiCheat();
   ```

2. **Integrate into save/load:**
   ```javascript
   // In gameLogic.js
   function saveGame() {
       window.antiCheat.saveGameState(gameState);
   }
   
   function loadGame() {
       const loaded = window.antiCheat.loadGameState();
       if (loaded) {
           Object.assign(gameState, loaded);
       }
   }
   
   // Start periodic checks
   window.antiCheat.startPeriodicCheck();
   ```

**Pros:**
- ✅ Detects localStorage tampering
- ✅ No server costs
- ✅ Easy to implement

**Cons:**
- ⚠️ Can still be bypassed by advanced users
- ⚠️ Doesn't prevent console manipulation

---

### 🛡️ Level 3: Console Protection (BASIC)

**What it does:** Make it harder (but not impossible) to cheat via console.

**Implementation:**

```javascript
// console-protection.js
(function() {
    'use strict';
    
    // 1. Freeze gameState object (prevents direct modification)
    Object.freeze(gameState);
    
    // 2. Use getters/setters with validation
    let _money = 0;
    Object.defineProperty(gameState, 'money', {
        get: function() { return _money; },
        set: function(value) {
            // Validate changes
            if (value > _money + 1000) {
                console.warn('⚠️ Suspicious money change detected!');
                window.antiCheat?.handleCheatDetection();
                return;
            }
            _money = value;
        },
        configurable: false
    });
    
    // 3. Detect DevTools opening
    let devtoolsOpen = false;
    const detectDevTools = () => {
        const threshold = 160;
        if (window.outerWidth - window.innerWidth > threshold ||
            window.outerHeight - window.innerHeight > threshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                console.log('👀 DevTools detected - cheating is logged');
                // Could send to Firebase Analytics
            }
        }
    };
    setInterval(detectDevTools, 1000);
    
    // 4. Obfuscate critical variables
    const _vars = {
        m: 0, // money
        r: 0, // rolls
        l: 1  // luck
    };
    
    // 5. Disable console in production
    if (window.location.hostname !== 'localhost') {
        console.log = () => {};
        console.warn = () => {};
        console.error = () => {};
    }
    
    // 6. Detect common cheat attempts
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        // Log all localStorage changes
        console.log('localStorage change:', key);
        return originalSetItem.apply(this, arguments);
    };
})();
```

**Pros:**
- ✅ Quick to implement
- ✅ Deters casual cheaters

**Cons:**
- ❌ Easily bypassed by anyone who knows JavaScript
- ❌ Can be annoying for legitimate debugging

---

### 🎯 Level 4: Rate Limiting & Anomaly Detection

**What it does:** Detect impossible actions and flag/ban cheaters.

**Implementation:**

```javascript
// anomaly-detection.js
class AnomalyDetector {
    constructor() {
        this.lastRollTime = 0;
        this.rollsPerMinute = [];
        this.suspiciousActions = 0;
    }
    
    // Check if roll is too fast
    checkRollRate() {
        const now = Date.now();
        const timeSinceLastRoll = now - this.lastRollTime;
        
        // Minimum 100ms between rolls (even with auto-roll)
        if (timeSinceLastRoll < 100) {
            this.flagSuspicious('Roll too fast');
            return false;
        }
        
        this.lastRollTime = now;
        this.rollsPerMinute.push(now);
        
        // Keep only last minute of rolls
        this.rollsPerMinute = this.rollsPerMinute.filter(t => now - t < 60000);
        
        // Flag if more than 600 rolls per minute (10/sec max)
        if (this.rollsPerMinute.length > 600) {
            this.flagSuspicious('Too many rolls per minute');
            return false;
        }
        
        return true;
    }
    
    // Check for impossible money gains
    checkMoneyChange(oldMoney, newMoney) {
        const gain = newMoney - oldMoney;
        
        // Flag gains over 1M at once (unless from selling)
        if (gain > 1000000 && !this.isLegitimateTransaction) {
            this.flagSuspicious('Impossible money gain');
            return false;
        }
        
        return true;
    }
    
    // Flag suspicious activity
    flagSuspicious(reason) {
        this.suspiciousActions++;
        console.warn('⚠️ Suspicious activity:', reason);
        
        // After 3 suspicious actions, take action
        if (this.suspiciousActions >= 3) {
            this.handleCheater();
        }
    }
    
    // Handle detected cheater
    async handleCheater() {
        // Log to Firebase
        if (firebase.apps.length) {
            await firebase.firestore().collection('cheaters').add({
                playerId: localStorage.getItem('playerId'),
                timestamp: Date.now(),
                suspiciousActions: this.suspiciousActions
            });
        }
        
        // Reset their progress
        alert('⚠️ Suspicious activity detected. Your progress has been reset.');
        localStorage.clear();
        window.location.reload();
    }
}

window.anomalyDetector = new AnomalyDetector();
```

---

## Recommended Approach

**For your game, I recommend combining:**

1. **Level 2 (Data Integrity)** - Detect save tampering
2. **Level 4 (Anomaly Detection)** - Catch impossible actions
3. **Firebase Security Rules** - Prevent database manipulation

This gives you **good protection without server costs**.

---

## Firebase Security Rules

Even without Cloud Functions, secure your Firestore:

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Players can only read/write their own data
    match /players/{playerId} {
      allow read: if request.auth != null || request.auth.uid == playerId;
      allow write: if request.auth != null && request.auth.uid == playerId;
    }
    
    // Leaderboards are read-only for clients
    match /globalLeaderboard/{entry} {
      allow read: if true;
      allow write: if false; // Only server can write
    }
    
    // Admin actions only writable by admins
    match /adminActions/{action} {
      allow read: if request.auth != null;
      allow write: if false; // Only admin panel
    }
  }
}
```

---

## Quick Start Implementation

Want me to implement the **Level 2 + Level 4** approach for you? This will:
- ✅ Detect save file tampering
- ✅ Prevent impossible roll rates
- ✅ Flag suspicious money changes
- ✅ Auto-reset cheaters
- ✅ No server costs

Just say "implement anti-cheat" and I'll add it to your game!
