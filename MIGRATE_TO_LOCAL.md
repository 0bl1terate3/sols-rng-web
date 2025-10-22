# Migration Guide: Firebase → Local Backend

## 🎯 Quick Start

### 1. Start the Backend Server

```bash
cd backend
npm install
npm start
```

Server will run on **http://localhost:8090**

### 2. Update Your HTML

Open `index.html` and replace the Firebase leaderboard script:

**FIND:**
```html
<script src="leaderboard.js"></script>
```

**REPLACE WITH:**
```html
<script src="leaderboard-local.js"></script>
```

### 3. Remove Firebase Dependencies (Optional)

You can remove these Firebase-related files/references:

#### Remove from `index.html`:
```html
<!-- Firebase SDK scripts - can be removed -->
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore-compat.js"></script>
<script src="firebase-config.js"></script>
```

#### Remove these files (after backing up):
- `leaderboard.js` (old Firebase version)
- `firebase-config.js` (contains Firebase credentials)

**⚠️ Backup first! Keep these files until you verify everything works.**

## ✅ Testing

1. Make sure backend is running (`npm start` in backend folder)
2. Open your game in browser
3. Roll a global aura (rarity > 99,999,998)
4. Check browser console for: `✅ Global aura submitted to leaderboard`
5. View leaderboard to see your entry

## 🔧 Features

### What Works:
- ✅ Submit global auras to leaderboard
- ✅ View top global auras
- ✅ Duplicate prevention (same player + aura)
- ✅ Player name management
- ✅ Leaderboard caching (1 minute)
- ✅ Works with GitHub Pages frontend

### What Changed:
- ❌ No more Firebase quota limits
- ❌ No more Firestore costs
- ✅ Data stored locally in `backend/leaderboards.json`
- ✅ Full control over your data

## 📊 Data Location

All leaderboard data is stored in:
```
backend/leaderboards.json
```

You can:
- View it directly
- Edit it manually
- Back it up
- Clear it

## 🌐 Production Notes

If you want to host this for others:

1. **Backend**: Deploy to a VPS/cloud server (not GitHub Pages)
2. **Frontend**: Keep on GitHub Pages
3. **Update URL**: In `leaderboard-local.js`, change:
   ```javascript
   this.backendUrl = 'http://your-server.com:8090';
   ```

## 🐛 Troubleshooting

### "Could not connect to local backend"
- Make sure backend server is running: `cd backend && npm start`
- Check console for port conflicts
- Verify server is on port 8090

### "Leaderboard not showing entries"
- Check browser console for errors
- Verify backend is running
- Check `backend/leaderboards.json` exists

### CORS errors
- Backend has CORS enabled for all origins
- If issues persist, check browser console

## 📝 API Differences

The local backend matches Firebase schema:

```javascript
// Firebase (old)
{
  playerId: "player_xxx",
  playerName: "Name",
  auraName: "Eden",
  auraRarity: 100000000,
  auraTier: "transcendent",
  rollCount: 1234,
  timestamp: "ISO string"
}

// Local Backend (new) - SAME FORMAT!
{
  playerId: "player_xxx",
  playerName: "Name",
  auraName: "Eden",
  auraRarity: 100000000,
  auraTier: "transcendent",
  rollCount: 1234,
  timestamp: "ISO string"
}
```

**✅ Drop-in replacement - no code changes needed!**
