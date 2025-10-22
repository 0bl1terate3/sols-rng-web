# Potion & Rune Stacking Fix ✅

## Problem
- **Potions**: Multiple instances of the same potion (e.g., Lucky Potion) were stacking in the Active Effects list
- **Runes**: Multiple runes could be active at the same time, creating balance issues

## Solution Implemented

### 1. **Potions** - Timer Extension Instead of Stacking
- **Before**: Using multiple potions of the same type created separate entries in Active Effects
- **After**: Using the same potion again extends the existing timer
  
**Example**:
- Use Lucky Potion (60s duration) → Active Effects: "Lucky Potion 0m 60s"
- Use Lucky Potion again → Active Effects: "Lucky Potion 2m 0s" (timer extended by 60s)
- Use Lucky Potion x5 → Timer extends by 5 minutes total

**Note**: This only applies to **timed potions** (potions with duration). One-roll potions still stack as intended.

### 2. **Runes** - Only One Rune At A Time
- **Before**: Multiple runes could be active simultaneously
- **After**: 
  - Only one rune can be active at a time
  - If you try to use a different rune while one is active, you'll see: "⚠️ [Rune Name] is already active!"
  - If you use the same rune again, it extends the timer (like potions)
  - Shift+Click and Ctrl+Click still work for extending the same rune's timer

**Example**:
- Use Rune of Heil → Active for 10 minutes
- Try to use Rune of Corruption → ❌ Blocked (warning shown)
- Use Rune of Heil again → Timer extends to 20 minutes ✅

## Technical Changes

### Modified: `gameLogic.js` (v1.1 → v1.2)

**`usePotion()` function (lines ~4948-5029)**:
- Added check for existing potion effect
- If potion already active AND has duration AND not one-roll:
  - Extends `endTime` by `duration * amount`
  - Shows console message: "Extended [Potion Name] timer by Xs (x[amount])"
- Otherwise, creates new effect(s) as before

**`useRune()` function (lines ~5035-5097)**:
- Added check for any active rune
- If rune already active:
  - Same rune: Extends timer
  - Different rune: Shows warning and blocks usage
- Forces `amount = 1` for new rune usage (no multi-stacking)
- Shows notification: "⚠️ [Rune Name] is already active!" when blocked

## Files Modified
1. ✅ `gameLogic.js` - Added stacking prevention logic
2. ✅ `index.html` - Updated gameLogic.js version to v1.2

## Testing

### Test Potions:
1. Use Lucky Potion → Check Active Effects (should show 1 entry)
2. Use Lucky Potion again → Timer should extend (not create 2nd entry)
3. Use Lucky Potion x10 (Shift+Click) → Timer should extend by 10 minutes
4. Use Speed Potion while Lucky Potion active → Both should show (different potions can coexist)

### Test Runes:
1. Use Rune of Heil → Should activate normally
2. Try to use Rune of Corruption → Should show warning and block
3. Use Rune of Heil again → Should extend timer
4. Wait for Rune of Heil to expire → Then Rune of Corruption should work

## Benefits
- ✅ Cleaner Active Effects UI (no duplicate entries)
- ✅ Easier to see what's active at a glance
- ✅ Prevents accidental over-stacking
- ✅ More balanced gameplay (one rune at a time)
- ✅ Timer extension is intuitive and convenient

## Notes
- **One-roll potions** (like Ultimate Lucky Potion) can still stack as intended - this fix only affects timed potions
- **Different potions** can still be active simultaneously (e.g., Lucky + Speed + Treasure)
- **Runes** are now exclusive - think strategically about which rune to use!
- All existing functionality (Shift+Click for x10, Ctrl+Click for all) still works for extending timers

## Clear Existing Stacked Effects
If you currently have stacked effects, they will naturally expire. Or you can:
1. Wait for them to expire naturally
2. Reload the page (effects will be cleaned up on next use)
3. The new logic will prevent future stacking automatically
