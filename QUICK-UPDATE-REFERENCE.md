# ⚡ Quick Update System Reference

## 🎮 Open Admin Panel
- Press `Ctrl+Shift+A` OR click ⚙️ icon (bottom-right)

## 📋 Common Commands

### Via Admin Panel (Easy Way)
1. Press `Ctrl+Shift+A`
2. Type your message
3. Click the button you want:
   - **Show Update** - Show to all users (stays until cleared)
   - **Show Update (30s)** - Auto-clears after 30 seconds
   - **Force Refresh** - Refreshes everyone in 5 seconds
   - **Clear Update** - Remove overlay from all users
   - **Test Locally** - Preview without broadcasting

### Via Browser Console (Advanced)
```javascript
// Show update
updateSystem.broadcastUpdate('UPDATE IN PROGRESS...');

// Show + auto-clear in 30 seconds
updateSystem.broadcastUpdate('Updating...', false, 30000);

// Force refresh all users
updateSystem.forceRefreshAll('Refreshing...', 5000);

// Clear update
updateSystem.clearUpdate();
```

## 🔧 First-Time Setup (One Time Only)

1. Go to https://console.firebase.google.com
2. Create/select project → Realtime Database → Create Database
3. Get config from Project Settings
4. Edit `updateSystem.js` line 156 with your Firebase config
5. Done! ✅

## 💡 Quick Tips

- **Testing?** Use "Test Locally" button first
- **Quick update?** Use 30s auto-clear option
- **Deployed new code?** Use Force Refresh
- **Maintenance done?** Click Clear Update

## 🎯 Common Scenarios

| Scenario | Action |
|----------|--------|
| Deploying new features | Force Refresh All |
| Brief maintenance | Show Update (30s auto-clear) |
| Long maintenance | Show Update → manually Clear when done |
| Just testing | Test Locally |
| Update complete | Clear Update |

---

**Need help?** See `UPDATE-SYSTEM-GUIDE.md` for full documentation
