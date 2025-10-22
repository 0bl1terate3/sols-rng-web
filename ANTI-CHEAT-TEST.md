# Anti-Cheat System - Testing Guide

## ✅ Installation Complete

The anti-cheat system has been successfully installed in your game!

### Files Added:
1. **anti-cheat.js** - Data integrity protection
2. **anomaly-detection.js** - Impossible action detection
3. **ANTI-CHEAT-GUIDE.md** - Full documentation

### Files Modified:
1. **gameLogic.js** - Integrated save/load protection and roll rate limiting
2. **index.html** - Added anti-cheat scripts

---

## 🧪 How to Test

### Test 1: Save File Tampering Detection

1. **Start the game** and play normally for a bit
2. **Open DevTools** (F12) → Application → Local Storage
3. **Find** `gameState` key
4. **Edit** the value directly (change any number)
5. **Refresh the page**
6. **Expected Result:** ⚠️ Alert appears saying "SAVE DATA CORRUPTION DETECTED" and progress is reset

### Test 2: Console Money Manipulation

1. **Start the game** and note your current money
2. **Open DevTools Console** (F12)
3. **Type:** `gameState.currency.money = 999999999`
4. **Wait 30 seconds** (for periodic integrity check)
5. **Expected Result:** ⚠️ Warning appears and data is flagged as tampered

### Test 3: Roll Rate Limiting

1. **Open DevTools Console**
2. **Try rapid rolls:** 
   ```javascript
   for(let i = 0; i < 100; i++) { rollAura(); }
   ```
3. **Expected Result:** ⚠️ Rolls are blocked after a few attempts with "Roll rate check failed"

### Test 4: Impossible Money Gain

1. **Open DevTools Console**
2. **Try to give yourself huge money:**
   ```javascript
   gameState.currency.money = (gameState.currency.money || 0) + 10000000000;
   ```
3. **Save the game** (it auto-saves every 30 seconds)
4. **Expected Result:** Next integrity check will detect the impossible gain

---

## 🛡️ What's Protected

### ✅ Protected Actions:
- **Save file tampering** - Detected via hash mismatch
- **Impossible roll rates** - Max 600 rolls/minute (10/sec)
- **Suspicious money changes** - Max 1M gain per action (unless selling)
- **Negative values** - Money/inventory can't go negative
- **Impossible inventory gains** - Max 100 items at once

### ✅ Legitimate Actions Allowed:
- **Selling auras** - Marked as legitimate transaction
- **Selling potions** - Marked as legitimate transaction
- **Achievement rewards** - Marked as legitimate transaction
- **Normal gameplay** - All normal actions work fine

---

## 📊 Monitoring Cheaters

### View Cheat Attempts (Firebase Console)

1. Go to **Firebase Console** → **Firestore Database**
2. Check these collections:
   - `cheatAttempts` - All tampering detections
   - `suspiciousActivity` - Flagged actions
   - `bannedPlayers` - Players who hit 3+ warnings

### Example Cheat Log:
```json
{
  "playerId": "player_1234567890",
  "playerName": "TestPlayer",
  "reason": "Save file hash mismatch",
  "timestamp": 1729512345678,
  "userAgent": "Mozilla/5.0..."
}
```

---

## ⚙️ Configuration

### Adjust Thresholds (in `anomaly-detection.js`):

```javascript
// Current settings:
this.MAX_ROLLS_PER_MINUTE = 600;           // 10 rolls/sec max
this.MIN_ROLL_INTERVAL = 50;               // 50ms minimum between rolls
this.MAX_MONEY_GAIN_PER_ACTION = 1000000;  // 1M max gain at once
this.MAX_WARNINGS = 3;                     // Reset after 3 warnings
```

To make it **stricter**, lower these values.  
To make it **more lenient**, raise these values.

---

## 🔧 Disable Anti-Cheat (For Testing)

If you need to disable it temporarily:

1. **Open `index.html`**
2. **Comment out** the anti-cheat scripts:
   ```html
   <!-- <script src="anti-cheat.js?v=1.0"></script> -->
   <!-- <script src="anomaly-detection.js?v=1.0"></script> -->
   ```
3. **Refresh** the page

---

## 🚨 What Happens When Cheating is Detected?

### After 1st Suspicious Action:
- ⚠️ Warning notification shown
- 📊 Logged to Firebase

### After 2nd Suspicious Action:
- ⚠️ Another warning
- 📊 Logged to Firebase

### After 3rd Suspicious Action:
- 🚫 **BANNED** - Progress reset
- 📊 Logged to `bannedPlayers` collection
- 🔄 Page reloads with fresh start

---

## 💡 Tips

### For Legitimate Players:
- The anti-cheat **won't affect normal gameplay**
- Auto-roll, selling, and achievements all work fine
- Periodic checks run every 30 seconds in the background

### For Developers:
- Use **Debug Menu** (Ctrl+Shift+D) for testing instead of console
- Mark transactions as legitimate with:
  ```javascript
  window.anomalyDetector.markLegitimateTransaction();
  gameState.currency.money += amount;
  ```

### For Admins:
- Admin panel actions **bypass** anti-cheat
- Use admin panel to give items/money safely

---

## 📈 Statistics

View anti-cheat stats in console:
```javascript
window.anomalyDetector.getStats()
```

Output:
```json
{
  "rollsPerMinute": 45,
  "moneyChangesPerMinute": 3,
  "suspiciousActions": 0,
  "warningCount": 0,
  "isBanned": false
}
```

---

## ✅ Success!

Your game now has **multi-layered anti-cheat protection**:

1. ✅ **Data Integrity Checks** - Detects save tampering
2. ✅ **Anomaly Detection** - Catches impossible actions
3. ✅ **Rate Limiting** - Prevents rapid exploitation
4. ✅ **Firebase Logging** - Tracks all violations
5. ✅ **Automatic Bans** - Resets cheaters after 3 warnings

**The system is now active and protecting your game!** 🛡️
