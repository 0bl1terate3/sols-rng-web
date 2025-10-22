# Biome Exclusive & Native Auras - Complete Fix

## Issues Fixed

### 1. **Missing `getAuraPool()` Function**
**Problem:** The game was calling `getAuraPool()` but the function didn't exist, causing crashes when rolling auras.

**Solution:** Created the `getAuraPool()` function that:
- Filters out GLITCHED-exclusive auras when not in GLITCHED biome
- Filters out DREAMSPACE-exclusive auras when not in DREAMSPACE biome
- Returns all available auras based on current biome state

### 2. **Native Aura Indicator**
**Problem:** No visual feedback when rolling an aura in its home biome (with multiplier bonus).

**Solution:** 
- Added `native` flag to all aura returns in `getRandomAura()`
- Native is `true` when `auraBiomeMult > 1` (aura gets biome bonus)
- Updated `displayAura()` to show "Native, 1 in X" below the rarity
- Green text color (#4ade80) to match the biome theme

## How It Works Now

### Biome-Exclusive Auras
Auras defined in `BIOME_AURAS` (in `biomes.js`) are now properly handled:

**Exclusive Biomes (can ONLY be rolled there):**
- **GLITCHED:** Fault, Glitch, Oppression, Forbidden: ERROR, Fatal Error, etc.
- **DREAMSPACE:** Dreammetric, ★, ★★, ★★★, and their mutations

**Native Biomes (easier to roll there):**
- **WINDY:** Wind, Stormal, Hurricane, Flow, Aviator, Maelstrom
- **SNOWY:** Glacier, Permafrost, Blizzard, Santa-Frost, Winter Fantasy, Chillsear
- **BLIZZARD:** Blizzard, Blizzard: Whiteout, Permafrost: Rime, Glacier: Winterheart, Santa-Frost: Blitzen, Abominable, etc.
- **RAINY:** Poseidon, Sailor, Sailor: Flying Dutchman, Abyssal Hunter
- **MONSOON:** Poseidon, Sailor, Abyssal Hunter, Maelstrom, Aquatic, Nautilus, Lightning, Hurricane, Stormal, Hyper-Volt, etc.
- **SANDSTORM:** Sand Bucket, Gilded, Jackpot, Anubis, Atlas
- **JUNGLE:** Natural, Flora, Emerald, Jade
- **AMAZON:** Natural: Overgrowth, Flora: Evergreen, Emerald: Verdant, Jade: Dragon, Moonflower, Watermelon, Celestial, Origin, etc.
- **CRIMSON:** Ruby, Rage, Flushed, Bleeding, Bloodlust, Terror, Vertebrae, Hemogoblin, Brain, Crimtane, Vicious, etc.
- **HELL:** Diaboli, Bleeding, Undead, Diaboli: Void, Undead: Devil, Hades, Bloodlust
- **STARFALL:** Starlight, Star Rider, Starfish Rider, Comet, Astral, Galaxy, Stargazer, Starscourge, Sirius, Gargantua
- **METEOR_SHOWER:** ★, ★★, ★★★, Starlight: Alpenglow, Sidereum: Constellation, Comet: Impactor, Galaxy: Quasar, Cosmos: Singularity, etc.
- **CORRUPTION:** Hazard, Corrosive, Hazard: Rays, Impeached
- **NULL:** Undefined, Shiftlock, Nihility, Undefined: Defined
- **PUMPKIN_MOON:** PUMP: TRICKSTER, Headless: Horseman, PHANTASMA, ARACHNOPHOBIA, Pumpkin, Autumn, Gingerbread
- **GRAVEYARD:** Headless, APOCALYPSE, BANSHEE, RAVAGE, Lost Soul, Undead, Raven, Dullahan, Spectre, Terror, Nightmare Sky
- **BLOOD_RAIN:** Erebus, Accursed, MALEDICTION, LAMENTHYR, Bloodlust, Bleeding, Crimson, Vampiric, Rage, Ruby, Diaboli

### Display Example
When you roll a native aura:
```
Wind
1 in 900
Native, 1 in 900
```

When you roll a breakthrough (outside its biome):
```
Wind
1 in 900 (Breakthrough)
```

## Technical Details

### Files Modified
1. **gameLogic.js**
   - Added `getAuraPool()` function (lines 9772-9795)
   - Added `native` flag to all aura returns in `getRandomAura()`
   - Updated `displayAura()` to show native indicator (line 9999, 10033)

### Native Detection Logic
```javascript
const isNative = auraBiomeMult > 1; // Native means aura gets biome multiplier bonus
```

### Biome Multiplier System
- **In home biome:** Multiplier > 1 (easier to get) → Shows as "Native"
- **Outside biome:** Multiplier < 1 (harder to get) → Shows as "Breakthrough"
- **Neutral:** Multiplier = 1 (normal rates)

## Testing Checklist
- [x] GLITCHED-exclusive auras only appear in GLITCHED biome
- [x] DREAMSPACE-exclusive auras only appear in DREAMSPACE biome
- [x] Native auras show "Native, 1 in X" when rolled in home biome
- [x] Breakthrough auras still show "(Breakthrough)" when rolled outside biome
- [x] All aura returns include native flag
- [x] No more crashes from missing getAuraPool()
