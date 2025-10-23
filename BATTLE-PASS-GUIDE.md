# 📊 Battle Pass / Season Pass System Guide

## Overview
The Battle Pass system provides a seasonal progression system with **100 levels** of rewards across **FREE** and **PREMIUM** tracks.

## Features

### 🎯 XP Progression
- **XP per Level**: Starts at 1,000 XP, increases by 8% each level
- **Max Level**: 100
- **Season Duration**: 90 days

### 💰 XP Earning Methods
| Action | XP Reward |
|--------|-----------|
| Regular Roll | 10 XP |
| Rare Aura | 25 XP |
| Epic Aura | 50 XP |
| Legendary Aura | 100 XP |
| Mythic Aura | 200 XP |
| Exotic Aura | 400 XP |
| Divine Aura | 800 XP |
| Celestial Aura | 1,500 XP |
| Transcendent Aura | 3,000 XP |
| Cosmic Aura | 10,000 XP |
| Daily Bonus | 500 XP |
| Achievement | 300 XP |
| First Biome Visit | 150 XP |

## Reward Tracks

### 🎁 FREE Track Highlights
- **Level 1**: 500 Coins
- **Level 5**: Bronze Badge
- **Level 6**: Luck Glove gear
- **Level 10**: Sparkle Trail effect
- **Level 20**: Silver Badge
- **Level 30**: Cosmic Aura effect
- **Level 35**: Gold Badge
- **Level 45**: Eclipse Device gear
- **Level 50**: Platinum Badge
- **Level 70**: Diamond Badge
- **Level 93**: Jackpot Gauntlet gear
- **Level 99**: Exo Gauntlet gear
- **Level 100**: Season Complete Badge

### 👑 PREMIUM Track Highlights
- **Level 1**: 1,000 Coins
- **Level 2**: [PREMIUM] Patron title
- **Level 5**: Desire Glove gear
- **Level 8**: Premium Glow effect
- **Level 10**: Star Band gear
- **Level 20**: Gold Sparkles effect
- **Level 30**: Ink Glove gear
- **Level 40**: Elite Roller title
- **Level 50**: Cursed Shard gear
- **Level 60**: Magnetic Ring gear
- **Level 75**: Ghost Glove gear
- **Level 85**: Aqua Device gear
- **Level 95**: Windstorm Device gear
- **Level 100**: Ultimate Badge

## Premium Pass

### 💎 Purchase
- **Cost**: 50,000 Coins
- **Benefits**: 
  - Unlock all premium rewards
  - Exclusive titles and badges
  - Premium visual effects
  - Exclusive high-tier gear

### How to Purchase
1. Open Battle Pass (⚔️ button in navigation)
2. Click "Get Premium" button
3. Confirm purchase (requires 50,000 coins)

## UI Navigation

### Opening Battle Pass
- Click the **⚔️ Battle Pass** button in top navigation
- Or press the hotkey (if assigned)

### Battle Pass Interface
- **Header**: Shows current level, XP progress, season end date
- **Free Track**: Left column (blue theme)
- **Premium Track**: Right column (purple theme)
- **Rewards**: Scrollable list showing all 100 levels
- **Claim Buttons**: Appear when level is reached

### Claiming Rewards
1. Reach the required level
2. Scroll to that level in the rewards list
3. Click "Claim" button on the reward
4. Reward is automatically added to your inventory

## Reward Types

### 🪙 Currency
- **Coins**: Added directly to your balance
- Amounts range from 500 to 200,000

### 🎖️ Cosmetics
- **Titles**: Display names (e.g., "Rookie Roller", "Master Roller")
- **Badges**: Collection badges (Bronze, Silver, Gold, Platinum, Diamond)
- **Effects**: Visual effects (Sparkle Trail, Cosmic Aura, Rainbow Trail)

### ✨ Auras
- Pre-rolled auras added to inventory
- Includes various tiers from Rare to Star Rider
- Multiple copies of some auras

### 🧤 Gear
- Exclusive Battle Pass gear items
- Includes gloves, devices, and accessories
- T1-T3 gear items

## Season Information

### Current Season
- **Season 1**: "Season of Origins"
- **Theme**: Cosmic
- **Duration**: 90 days
- **Start Date**: When first loaded
- **End Date**: Displays remaining days in UI

### After Season Ends
- Progress is saved
- New season begins with fresh rewards
- Previous season rewards become legacy items

## Tips & Strategies

### 🎯 XP Optimization
1. **Roll Frequently**: Base 10 XP per roll adds up
2. **Target High Tiers**: Cosmic auras give 10,000 XP
3. **Complete Achievements**: 300 XP bonus
4. **Visit New Biomes**: 150 XP first visit
5. **Daily Login**: 500 XP daily bonus

### 💡 Level Progression
- **Early Levels (1-30)**: Fast progression, basic rewards
- **Mid Levels (31-60)**: Moderate pace, quality gear
- **Late Levels (61-100)**: Slower, exclusive items

### 💰 Premium Worth It?
**Premium is worth it if you**:
- Play frequently (daily)
- Want exclusive cosmetics
- Need high-tier gear
- Collect all items
- Can afford 50k coins

**Skip premium if you**:
- Play casually
- Low on coins
- Only want gameplay items (free track has gear)

## Technical Details

### Data Storage
- Progress saved in `localStorage`
- Key: `battlePassData`
- Includes: XP, level, premium status, claimed rewards

### Integration
- XP awarded automatically after each roll
- Integrates with existing achievement system
- Works with leaderboard tracking
- Compatible with all game features

## Troubleshooting

### XP Not Increasing
- Check that Battle Pass initialized (console log)
- Verify rolls are completing normally
- Clear cache and reload if stuck

### Rewards Not Claimable
- Ensure you've reached the required level
- Premium rewards require Premium Pass
- Check if already claimed

### UI Issues
- Refresh page if modal doesn't appear
- Check browser console for errors
- Ensure JavaScript is enabled

## Future Updates

### Planned Features
- Weekly challenges for bonus XP
- Special event seasons
- Seasonal leaderboards
- Reward preview system
- Gift premium to friends

## Commands (Debug)

```javascript
// Add XP
awardBattlePassXP(1000, 'Debug Test');

// Set Level
BATTLE_PASS.playerData.level = 50;
saveBattlePassData();
updateBattlePassDisplay();

// Unlock Premium
BATTLE_PASS.playerData.hasPremium = true;
saveBattlePassData();
updateBattlePassDisplay();

// Reset Progress
BATTLE_PASS.playerData = {
    xp: 0, level: 1, hasPremium: false,
    claimedRewards: { free: [], premium: [] }
};
saveBattlePassData();
```

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify localStorage is not full
3. Clear cache and reload
4. Report bugs with console logs

---

**Enjoy the Season of Origins!** ⚔️✨
