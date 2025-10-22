# Biome Color Fix for Roll History & Statistics Panels

## Issue
The Roll History and Statistics panels were not changing colors when biomes switched, unlike other panels in the game.

## Root Cause
These panels are dynamically created by the QoL system (`qol-system.js`) after the initial biome color update runs. The panels were being created with static CSS backgrounds that weren't updating with biome changes.

## Solution Applied

### 1. Updated CSS to Use Dynamic Biome Variables
**File: `modern-ui-effects.css`**
- Changed `.roll-history-panel` background from static `#242b3d` to `var(--biome-panel-gradient, #242b3d)`
- Changed `.statistics-panel` background from static `#242b3d` to `var(--biome-panel-gradient, #242b3d)`

This ensures panels automatically pick up biome colors via CSS variables.

### 2. Enhanced Performance Mode Compatibility
**File: `performance-optimizer.css`**
- Added override rules to preserve biome colors even when "no-background-effects" performance mode is enabled
- Ensures QoL panels use biome gradients while other panels use static backgrounds in performance mode

### 3. Added Delayed Biome Color Update
**File: `biomes.js`**
- Added 100ms delayed selector specifically targeting `#rollHistoryContainer` and `#statisticsContainer`
- Ensures panels created slightly after biome change still receive color updates

### 4. Added Immediate Color Application on Panel Creation
**File: `qol-system.js`**
- Created `applyBiomeColorToPanel()` helper function that reads current `--biome-panel-gradient` CSS variable
- Applied immediately when Roll History panel is created (line ~240)
- Applied immediately when Statistics panel is created (line ~482)
- Includes fallback retry after 200ms if CSS variable isn't available initially

## How It Works

1. **On Biome Change**: The `updateUIColors()` function in `biomes.js` sets CSS variables like `--biome-panel-gradient`
2. **CSS Variables**: Panels now reference these variables in their stylesheets, so they update automatically
3. **Delayed Update**: A 100ms timeout catches any panels that were just created
4. **Immediate Application**: When panels are first created, they immediately grab the current biome gradient
5. **Performance Mode**: Override rules ensure biome colors persist even with background effects disabled

## Files Modified
1. `modern-ui-effects.css` - Lines 253, 384
2. `performance-optimizer.css` - Lines 60-64 (new)
3. `biomes.js` - Lines 752-768 (new delayed update), Lines 809-832 (body background fix)
4. `qol-system.js` - Lines 51-76 (new helper function), Lines 240, 482 (apply on creation)

## Additional Fix: Body Background
**Issue**: The page background was staying blue instead of changing with biome colors.

**Cause**: The body element uses `--bg-primary` and `--bg-secondary` CSS variables for its gradient background, but the biome system was only setting `--biome-bg-primary` and `--biome-bg-secondary`.

**Solution**: Updated `biomes.js` to also set the main `--bg-primary` and `--bg-secondary` variables and animate the body's background gradient property instead of just backgroundColor.

## Testing
To verify the fix works:
1. Open the game and enable Roll History and Statistics panels (should be on by default)
2. Wait for or trigger a biome change
3. Both panels should smoothly transition to the new biome colors along with other UI elements
4. Test with performance mode enabled to ensure biome colors still apply

## Result
✅ Roll History and Statistics panels now properly change colors with biome transitions
✅ Page background (body) now changes with biome colors
✅ Works with all biomes (GRAVEYARD, STARFALL, HELL, CRIMSON, etc.)
✅ Compatible with performance optimization settings
✅ Smooth animated transitions matching other UI elements
