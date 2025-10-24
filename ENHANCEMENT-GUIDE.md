# 🚀 Enhancement Systems Guide

## Quick Access
Click the **⚡ button** in the bottom-right corner to access all enhancement systems.

---

## 📦 Inventory Manager
**Access:** Click ⚡ → Inventory Manager

### Features
- **Auto-sort** by rarity, count, name, or value
- **Bulk actions** (consume, delete, sell)
- **Low stock alerts** for crafting materials
- **Inventory value calculator**
- **One-click "Sell All Junk"** (sells all auras ≤ 1000 rarity)

### Quick Actions
- View total inventory value
- See low-stock items
- Sell commons instantly

---

## 🛍️ Auto-Merchant
**Access:** Click ⚡ → Auto-Merchant

### Features
- **Auto-buy** items when merchants spawn
- **Rare item notifications**
- **Budget management** per merchant visit
- **Priority list** (always buy these items)
- **Blacklist** (never buy these items)
- **Purchase history** tracking

### Settings
- Set budget limit (default: $10,000)
- Configure priority items
- Enable/disable notifications

---

## 🎲 Bulk Roll System
**Access:** Click ⚡ → Bulk Roll

### Features
- **Roll 100/500/1000** times automatically
- **Smart pausing** on specific rarity tiers
- **Presets**: Farm Commons, Hunt Legendaries, Balanced, Speed Run
- **Stop conditions**: inventory full, rarity threshold
- **Session statistics** with breakdown

### Presets
- **Farm Commons**: Fast rolling, auto-craft, pause on rare
- **Hunt Legendaries**: Normal speed, pause on legendary+
- **Balanced**: Good mix of speed and quality
- **Speed Run**: Maximum speed, minimal pausing

### Keyboard Shortcuts
- **R**: Start rolling
- **S**: Stop rolling

---

## 📊 Analytics Dashboard
**Access:** Click ⚡ → Analytics

### Real-Time Stats
- **Rolls per minute**
- **Money per hour**
- **Session duration**
- **Efficiency rate**
- **Auras caught**
- **Items crafted**

### Records
- Best session rolls
- All-time totals
- Session history
- Export data as JSON

---

## 🏆 Auto-Achievement
**Access:** Click ⚡ → Auto-Achievement

### Features
- **Auto-claim** completed achievements
- **Progress notifications** (80%, 90%, 95%)
- **Claim all** button for multiple achievements
- **Completion tracking**

---

## ⌨️ Keyboard Shortcuts
**Access:** Click ⚡ → Keyboard Shortcuts

### Default Shortcuts
- **R**: Roll
- **S**: Stop
- **C**: Crafting tab
- **I**: Inventory tab
- **A**: Achievements tab
- **M**: Market tab
- **E**: Equipment tab
- **Q**: Quests tab
- **1-5**: Quick craft favorite slots

### Customization
- Enable/disable individual shortcuts
- Toggle entire system on/off

---

## 🗺️ Expedition Auto-Manager
**Access:** Click ⚡ → Expedition Manager

### Features
- **Auto-send** available expeditions
- **Optimal team building** based on unit stats
- **Success rate calculation**
- **Minimum success threshold** (default: 60%)
- **Type matching** for bonus success

---

## 🧪 Auto-Potion (Enhanced)
**Access:** Crafting tab → ⚙️ Settings (purple button)

### Strategic Features
- **Craft up to 15 potions** per cycle
- **Diversity mode**: Mix of luck, speed, utility
- **Stack similar effects** or avoid duplicates
- **Efficient mode**: Use fewer rare ingredients
- **Smart categorization**: Hybrid, Luck, Speed, Utility

### Modes
- **Diversity**: Balanced approach (3 hybrid + 4 luck + 3 speed + 3 utility)
- **Power**: Craft only highest-rated potions

---

## 🔧 Auto-Craft (Enhanced)
**Access:** Crafting tab → ⚙️ Settings (blue button)

### Strategic Features
- **Craft up to 10 gears** per cycle
- **Balance slots**: Distribute across equipment types
- **Prioritize tier**: Always craft highest tier first
- **Upgrade only**: Skip gear worse than equipped
- **Efficient mode**: Minimize ingredient usage

---

## 🔐 Admin Panel (Local)
**Access:** Press **Ctrl+Shift+A** (with backend running)

### Server Management
- **Player data** management
- **Ban system**
- **Analytics dashboard**
- **Backup/restore** database
- **Leaderboard controls**

**Password:** `admin123` (change in `backend/server.js`)

---

## 🎯 Tips & Tricks

### Best Workflow
1. Enable **Auto-Potion** and **Auto-Craft**
2. Set up **Bulk Roll** with your preferred preset
3. Use **Keyboard Shortcuts** for quick actions
4. Check **Analytics** regularly for optimization
5. Use **Inventory Manager** to clean up periodically

### Performance
- All systems save settings to localStorage
- Auto-systems run on intervals (5-10 seconds)
- Analytics tracks in real-time with minimal overhead

### Keyboard Efficiency
- Use **R** to start rolling, **S** to stop
- **1-5** for instant favorite recipe crafting
- Tab shortcuts (**C**, **I**, **A**, etc.) for quick navigation

---

## 🆘 Troubleshooting

**Systems not loading?**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear cache and reload

**Auto-systems not working?**
- Check if enabled in settings
- Verify unlock requirements (rolls threshold)
- Check console for errors (F12)

**Keyboard shortcuts not responding?**
- Make sure not typing in input fields
- Check if system is enabled
- Verify shortcuts in settings

---

## 📝 Notes

- All settings persist across sessions
- Systems integrate with existing game mechanics
- No data is modified without user action
- Safe to use alongside existing QoL systems

**Enjoy the enhanced gameplay!** 🎮
