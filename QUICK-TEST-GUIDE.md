# 🧪 Quick Test Guide - Enhanced QoL Features

## 🚀 Quick Start Testing

Follow this guide to quickly test all 20 new QoL features.

---

## ✅ Pre-Test Checklist

1. **Open the game** in your browser
2. **Open browser console** (F12) to see initialization messages
3. **Look for**: `🎮 All Enhanced QoL Systems Initialized!`
4. **If you see errors**, check that all files are present

---

## 🎯 Feature Testing (5 Minutes)

### 1. Quick Slots (30 seconds)
```
✓ Go to Potions tab
✓ Right-click any potion
✓ Select "Slot 1 (Key: 1)"
✓ Press "1" key to use it
✓ Right-click the quick slot to clear it
```
**Expected**: Item appears in slot, pressing 1 uses it

---

### 2. Crafting Queue (1 minute)
```
✓ Go to Crafting panel
✓ Find a recipe you can craft
✓ Click the 📋 button on the recipe
✓ Enter "3" when prompted
✓ Check the queue panel appears above recipes
✓ Toggle "Auto-Process" checkbox
✓ Watch items craft automatically
```
**Expected**: Queue shows 3 items, auto-crafts them

---

### 3. Offline Progress (30 seconds)
```
✓ Look at bottom-right corner
✓ Do any action that saves (roll, craft, etc.)
✓ See "💾 Game Saved" appear for 2 seconds
```
**Expected**: Save indicator appears and fades

**To test offline progress**:
```
✓ Enable auto-roll
✓ Close the tab/browser
✓ Wait 5+ minutes
✓ Reopen the game
✓ See welcome back modal with estimated progress
```

---

### 4. Gear Loadouts (1 minute)
```
✓ Scroll to Equipment section
✓ Look for "⚔️ Gear Loadouts" panel below equipment
✓ Equip any gear (left or right hand)
✓ Click "💾 Save" on Loadout 1
✓ Unequip the gear
✓ Click "⚡ Load" on Loadout 1
✓ See gear re-equipped
```
**Expected**: Gear saves and loads correctly

**Test keyboard shortcuts**:
```
✓ Press Ctrl+Shift+1 to save
✓ Press Ctrl+1 to load
```

---

### 5. Biome Quick Switch (15 seconds)
```
✓ Look at the header near biome display
✓ Find the dropdown menu
✓ Select different biome (e.g., HELL)
✓ See biome change instantly
```
**Expected**: Biome changes without navigation

---

### 6. Aura Collection Tracker (15 seconds)
```
✓ Go to Auras tab
✓ Look at the top for "📚 Collection Progress"
✓ See progress bar with X/Y count
```
**Expected**: Shows your collection progress

---

### 7. Animation Speed Control (30 seconds)
```
✓ Go to Settings tab
✓ Find "🎬 Animation Speed" slider
✓ Move slider to 2x
✓ Do a roll and see faster animation
✓ Move slider to 0.5x
✓ Do a roll and see slower animation
```
**Expected**: Roll animations speed up/slow down

---

### 8. Notification Filters (30 seconds)
```
✓ Go to Settings tab
✓ Find "🔔 Notification Filters"
✓ Change "Minimum Rarity" to "Epic+"
✓ Uncheck "Show Item Drop Notifications"
```
**Expected**: Settings save and apply

---

### 9. Bulk Item Actions (45 seconds)
```
✓ Go to any inventory tab (Potions, Items, Auras)
✓ Look for "📦 Bulk Mode: OFF" button
✓ Click it to enable bulk mode
✓ Click several items to select them
✓ See selection counter update
✓ Click "🗑️ Delete Selected"
✓ Confirm deletion
```
**Expected**: Multiple items deleted at once

---

### 10. Undo System (30 seconds)
```
✓ Go to Potions tab
✓ Use any potion (click it)
✓ See orange notification appear bottom-right
✓ Click the notification OR press Ctrl+Z
✓ See potion restored
```
**Expected**: Potion use is undone within 10 seconds

---

## 🎮 Advanced Testing (Optional)

### Test All Keyboard Shortcuts
```
1, 2, 3           → Use quick slots
Ctrl+1-5          → Load gear loadouts
Ctrl+Shift+1-5    → Save gear loadouts
Ctrl+Z            → Undo last action
```

### Test Context Menus
```
Right-click items     → Assign to quick slot menu
Right-click slots     → Clear quick slot
```

### Test Persistence
```
1. Configure all features (slots, queue, loadouts, settings)
2. Refresh the page (F5)
3. Verify everything is still configured
```

### Test Edge Cases
```
✓ Try to use empty quick slot
✓ Try to queue with no materials
✓ Try to load empty loadout
✓ Try to undo after 10 seconds
✓ Try bulk mode with nothing selected
```

---

## 🐛 Troubleshooting

### If Features Don't Appear

**Check Console**:
```javascript
// Open console (F12) and type:
console.log(typeof initQuickSlots);        // Should be "function"
console.log(typeof initCraftingQueue);     // Should be "function"
console.log(typeof initOfflineProgress);   // Should be "function"
console.log(typeof initGearLoadouts);      // Should be "function"
console.log(typeof initAdvancedFeatures);  // Should be "function"
```

**If any return "undefined"**:
1. Check that all script files are loaded in index.html
2. Look for JavaScript errors in console
3. Verify file paths are correct
4. Clear browser cache and reload

**Check Files Exist**:
```
✓ qol-quick-slots.js
✓ qol-crafting-queue.js
✓ qol-offline-progress.js
✓ qol-gear-loadouts.js
✓ qol-advanced-features.js
✓ qol-enhanced-styles.css
```

### If Settings Don't Save

**Check localStorage**:
```javascript
// In console:
console.log(localStorage.getItem('quickSlots'));
console.log(localStorage.getItem('craftingQueue'));
console.log(localStorage.getItem('gearLoadouts'));
console.log(localStorage.getItem('notificationFilters'));
```

**If null or errors**:
1. Check localStorage is enabled in browser
2. Check no extensions blocking storage
3. Try incognito mode
4. Check browser storage quota

### If UI Looks Wrong

**Check CSS**:
```
✓ Verify qol-enhanced-styles.css is loaded
✓ Check for CSS conflicts in console
✓ Try disabling browser extensions
✓ Test in different browser
```

---

## ✅ Success Criteria

After testing, you should have:

- ✅ **Quick slots** assigned and working
- ✅ **Crafting queue** with items queued
- ✅ **Auto-save indicator** appearing
- ✅ **Gear loadouts** saved
- ✅ **Biome dropdown** working
- ✅ **Collection tracker** visible
- ✅ **Animation speed** adjustable
- ✅ **Notification filters** set
- ✅ **Bulk mode** functional
- ✅ **Undo** working with Ctrl+Z

---

## 📊 Performance Check

### Check Performance
```javascript
// In console, check memory usage:
console.log(performance.memory); // Chrome only

// Check initialization time:
// Look for console messages with timestamps
```

**Expected**:
- All systems initialize within 2 seconds
- No memory leaks
- Smooth animations
- Responsive UI

---

## 🎉 Test Complete!

If all features work as expected, you're ready to enjoy the enhanced Sol's RNG experience!

### What to Do Next

1. **Customize your setup**
   - Assign your favorite potions to quick slots
   - Create gear loadouts for different strategies
   - Set notification filters to your preference
   - Adjust animation speed to your liking

2. **Start playing efficiently**
   - Use quick slots for fast potion access
   - Queue crafting recipes overnight
   - Switch biomes quickly for farming
   - Track your collection progress

3. **Share feedback**
   - Note any bugs or issues
   - Suggest improvements
   - Report performance problems

---

## 📞 Need Help?

### Resources
- **User Guide**: ENHANCED-QOL-GUIDE.md (detailed feature explanations)
- **Implementation**: IMPLEMENTATION-SUMMARY.md (technical details)
- **Console**: Check for error messages
- **Browser DevTools**: Inspect elements and network requests

### Common Solutions
1. **Refresh page** (Ctrl+F5 for hard refresh)
2. **Clear cache** and reload
3. **Check console** for errors
4. **Verify files** are all present
5. **Test in incognito** mode
6. **Try different browser**

---

**Happy Testing! 🎮✨**

Remember: All features are designed to enhance your experience without breaking existing functionality. If something doesn't work, it's likely a simple fix!
