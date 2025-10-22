# Sol's RNG - Aura Rolling Game

A browser-based game inspired by Sol's RNG with aura rolling, potion crafting, and item collection mechanics.

## Features

### 🎲 Aura Rolling System
- Roll for over 200+ different auras with varying rarities
- Rarities range from 1:1 (Nothing) to 1:2,500,000,000 (Equinox)
- Special auras like Memory: The Fallen (1:100) and Oblivion (1:2000)
- Luck and speed modifiers affect your rolls

### ⚗️ Potion Crafting
- Craft 20+ different potions using collected items and auras
- Potions provide various buffs:
  - **Luck Potions**: Increase chance of rare auras
  - **Speed Potions**: Roll faster
  - **Mixed Potions**: Combine multiple effects
  - **Godlike Potions**: Massive luck boosts for single rolls

### 🎒 Inventory System
- **Potions Tab**: View and use crafted potions
- **Items Tab**: See collected spawning items
- **Auras Tab**: Track all rolled auras with counts

### 🌟 Item Spawning
- Items spawn automatically while you play:
  - Lucky Potion (common)
  - Speed Potion (common)
  - Darklight Shard (rare)
  - Darklight Orb (very rare)
  - Darklight Core (ultra rare)

### 📊 Active Effects
- Track all active potion effects
- See remaining time or rolls for each effect
- Effects stack for powerful combinations

## How to Play

1. **Open `index.html`** in your web browser
2. **Click "ROLL"** to start rolling for auras
3. **Collect items** that spawn automatically
4. **Craft potions** using the recipes in the crafting panel
5. **Use potions** from your inventory to boost your luck and speed
6. **Collect rare auras** and build your collection!

## Potion Recipes

### Basic Potions
- **Fortune Potion I**: 10x Lucky Potion → +50% Luck (5 min)
- **Fortune Potion II**: 25x Lucky Potion → +75% Luck (5 min)
- **Fortune Potion III**: 50x Lucky Potion → +100% Luck (5 min)
- **Haste Potion I**: 10x Speed Potion → +20% Speed (5 min)
- **Haste Potion II**: 25x Speed Potion → +25% Speed (5 min)
- **Haste Potion III**: 50x Speed Potion → +30% Speed (5 min)

### Advanced Potions
- **Mixed Potion**: 5x Lucky + 5x Speed → +25% Luck & +10% Speed (3 min)
- **Jewelry Potion**: Requires 6 gem auras → +120% Luck (10 min)
- **Zombie Potion**: Undead + Bleeding + 10x Lucky → +150% Luck (10 min)

### Godly Potions
- **Godly Potion (Zeus)**: Requires Zeus aura → +200% Luck & +30% Speed (4 hours)
- **Godly Potion (Poseidon)**: Requires Poseidon aura → +75% Speed (4 hours)
- **Godly Potion (Hades)**: Requires Hades aura → +300% Luck (4 hours)
- **Godlike Potion**: All 3 Godly Potions + 600x Lucky → +400,000x Luck (1 roll)

### Ultimate Potions
- **Potion of Bound**: Requires Bounded aura → +50,000x Luck (1 roll)
- **Heavenly Potion**: Requires Celestial + Exotic → +150,000x Luck (1 roll)
- **Oblivion Potion**: Memory + Oblivion → +600,000x Luck (1 roll, negates buffs)
- **Warp Potion**: Requires Arcane + Comet → +1000% Speed (2000 rolls)

### Forbidden Potions
- **Forbidden Potion I**: Darklight Shard → +70% Luck & +10% Speed (30 min)
- **Forbidden Potion II**: Darklight Orb → +325% Luck & +25% Speed (1 hour)
- **Forbidden Potion III**: Darklight Core → +1350% Luck & +75% Speed (3 hours)

## Tips

1. **Start with starter items** - Accept the starter pack when prompted
2. **Craft basic potions first** - Build up your luck with Fortune Potions
3. **Stack effects** - Multiple potions can be active at once
4. **Save rare auras** - Some potions require specific auras as ingredients
5. **Use one-roll potions wisely** - Save them for when you have high base luck
6. **Watch for item spawns** - Collect items regularly to craft more potions

## Game Mechanics

### Luck System
- Base luck: 100%
- Luck multiplies your chance of getting rare auras
- Effects stack additively (e.g., +50% + +75% = +125% total)

### Speed System
- Base roll time: 3 seconds
- Speed reduces roll time (e.g., +100% speed = 1.5 second rolls)
- Faster rolling = more auras per minute

### Rarity Tiers
- **Common**: White (1:1 - 1:4)
- **Uncommon**: Green (1:5 - 1:8)
- **Rare**: Blue (1:16 - 1:150)
- **Epic**: Purple (1:256 - 1:900)
- **Legendary**: Yellow (1:1000 - 1:7000)
- **Mythic**: Orange (1:8192 - 1:32768)
- **Exotic**: Pink (1:40000 - 1:120000)
- **Divine**: Gold (1:125000 - 1:850000)
- **Celestial**: Cyan (1:1000000 - 1:4500000)
- **Transcendent**: Magenta (1:5000000+)

## Data Persistence

Your game progress is automatically saved to browser localStorage:
- Total rolls
- Inventory (potions, items, auras)
- Active effects
- Current stats

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge
- Firefox
- Safari
- Opera

## Quality of Life Features

This game includes extensive QoL improvements:

### 🎮 Core Features
- **Keyboard Shortcuts** - Press H for full guide (R to roll, Q for quick roll, etc.)
- **Roll History** - Track your last 50 rolls with timestamps
- **Statistics Panel** - Session stats, rolls/min, pity counters
- **Enhanced Inventory** - Sort, filter, and search your items
- **Advanced Crafting** - Single/Multi/Max/Insta modes with favorites
- **Achievement Pinning** - Pin up to 5 achievements to track progress
- **Save Management** - Export/import saves, copy stats to clipboard

### ⚡ Quick Actions
- **Shift+Click** - Use 10 items/potions
- **Ctrl+Click** - Use all items/potions
- **⭐ Favorite** - Mark frequently used recipes
- **⚡ Quick Craft** - One-click crafting from recipe list

### 🎨 Customization
- **Dark/Light Themes**
- **Compact Mode** - More screen space
- **Performance Mode** - Better FPS
- **Toggle Panels** - Show/hide roll history, stats, etc.

**See [QOL-FEATURES.md](QOL-FEATURES.md) for complete documentation!**

## Credits

Inspired by Sol's RNG on Roblox
Created as a web-based tribute with crafting mechanics
