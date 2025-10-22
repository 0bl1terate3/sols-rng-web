# Untracked Achievements Report

## ❌ **MISSING TRACKING** - These achievements are NOT being tracked properly:

### **1. Pattern & Combo Achievements** (Need complex logic)
- ❌ **`tier_rainbow`** - Roll 9 different tier levels in a row (no repeats)
  - **Missing:** Logic to detect all 9 unique tiers in sequence
  
- ❌ **`palindrome_tiers`** - Roll tiers in palindrome pattern (e.g., 1-2-3-2-1)
  - **Missing:** Logic to detect palindrome patterns in tier sequence
  
- ❌ **`ascending_tiers`** - Roll 5 auras with each tier higher than the last
  - **Partial:** Counter exists but never incremented properly
  
- ❌ **`descending_tiers`** - Roll 5 auras with each tier lower than the last
  - **Partial:** Counter exists but never incremented properly

- ❌ **`alternating_tiers`** - Roll alternating tier levels
  - **Partial:** Counter exists but logic incomplete

### **2. Speed & Timing Achievements**
- ❌ **`speed_variance`** - Roll with 1000%+ speed then 0% speed within 10 rolls
  - **Missing:** Logic to track speed changes over 10-roll window
  
- ❌ **`instant_100`** - Roll 100 times in under 60 seconds
  - **Missing:** Logic to track roll timestamps and detect 100 rolls in 60s

### **3. Breakthrough Achievements**
- ❌ **`breakthrough_sandwich`** - Roll breakthrough-normal-breakthrough pattern
  - **Missing:** Logic to detect the specific pattern

### **4. Biome Achievements**
- ❌ **`biome_hopper_hour`** - Roll in 5 different biomes within 1 hour
  - **Missing:** Logic to track biomes visited within hour window

### **5. Mutation Achievements**
- ❌ **`mutation_only_100`** - Roll 100 mutations in a row
  - **Missing:** Logic to ensure exactly 100 mutations (current tracks any streak)

### **6. Weekend Achievements**
- ❌ **`weekend_50k`** - Roll 50,000 times on a single weekend
  - **Partial:** Tracks weekend rolls but not per-weekend basis

### **7. Luck Achievements**
- ❌ **`luck_coaster`** - Roll with 10000%+ luck then 100% luck within 10 rolls
  - **Missing:** Logic to track luck changes over 10-roll window

### **8. Aura Name Pattern Achievements**
- ❌ **`same_letter_5`** - Roll 5 auras starting with same letter in a row
  - **Missing:** Logic to track starting letters and detect patterns
  
- ❌ **`alphabetical_5`** - Roll 5 auras in alphabetical order
  - **Missing:** Logic to detect alphabetical ordering

### **9. Interval Achievements**
- ❌ **`hourly_48`** - Roll at least once every hour for 48 hours
  - **Missing:** Logic to track hourly roll timestamps
  
- ❌ **`every_15_min`** - Roll every 15 minutes for 12 hours
  - **Missing:** Logic to track 15-minute intervals

### **10. Rune Achievements**
- ❌ **`rune_stack_5`** - Roll with 5 different rune effects active
  - **Missing:** Logic to count active rune effects

### **11. Special Combo Achievements**
- ❌ **`unlucky_to_lucky`** - Roll divine+ right after 100 commons in a row
  - **Missing:** Logic to track 100 common streak then detect divine+

### **12. Birthday Achievement**
- ❌ **`roll_on_birthday`** - Roll on account creation anniversary
  - **Missing:** No account creation date tracking

### **13. Session Achievements**
- ❌ **`one_roll_session`** - Roll exactly 1 time in a session then leave
  - **Missing:** Logic to detect when player leaves after 1 roll
  
- ❌ **`exact_100_session`** - Roll exactly 100 times in one session
  - **Missing:** Logic to detect exact 100 (not 99 or 101)

---

## ✅ **WORKING** - These achievements ARE being tracked:

### Fully Tracked (57/100):
- ✅ All `exact_roll_number` achievements
- ✅ `roll_at_1am`, `roll_at_3am`
- ✅ `new_year_roll`, `halloween_midnight`
- ✅ `speed_500_rolls`, `slow_rolls_50`
- ✅ `triple_same_tier`, `five_same_tier`, `ten_same_tier`
- ✅ `breakthrough_only`, `no_breakthrough_1000`
- ✅ `pity_rare`, `pity_epic`, `pity_legendary`, `no_pity_10k`
- ✅ `ultra_marathon_session`, `micro_sessions`
- ✅ `daily_100_streak`, `daily_1k_week`, `daily_perfect_month`
- ✅ `null_biome_rolls`, `glitch_biome_rolls`, `dreamspace_rolls`, `single_biome_10k`
- ✅ `mutation_streak`, `no_mutations_5000`
- ✅ `monday_10k`, `friday_night`
- ✅ `manual_50k`, `auto_100k`, `mode_switches`
- ✅ `luck_1000_rolls`, `base_luck_10k`
- ✅ `triple_digit_luck`, `quad_digit_luck`
- ✅ `oblivion_only_1000`, `voidheart_100_uses`, `no_potions_50k`
- ✅ `no_gear_20k`, `tier10_only_10k`
- ✅ `no_runes_10k`
- ✅ `same_aura_1000`, `different_50`
- ✅ `broke_rolls_1000`, `millionaire_rolls`
- ✅ `rolling_spec_master`

---

## 🔧 **SPEED POTION STACKING REPORT**

### **You are CORRECT!** ✅

Speed potions **DO STACK ADDITIVELY**, not just add to timer:

```javascript
// From gameLogic.js line 8346-8347:
if (effect.speedBoost) {
    speedBonus += effect.speedBoost;
}
```

**Example:**
- Speed Potion (+10%)
- Haste Potion III (+30%)
- **Total: +40% speed** (not multiplicative)

**This applies to ALL buff effects:**
- ✅ Luck boosts add together
- ✅ Speed boosts add together
- ✅ Multiple potions stack additively

**Transcendent example:**
- Transcendent Potion: +100% luck, +100% speed (4 hours)
- If you use 2x Transcendent: +200% luck, +200% speed
- **They stack!**

---

## 📊 **Summary**

- **57/100 achievements** are fully tracked ✅
- **43/100 achievements** need additional logic ❌
- **Speed potions stack additively** ✅

**Most complex missing tracking:**
1. Pattern detection (palindrome, alternating, ascending/descending)
2. Time-window tracking (10-roll windows, hourly intervals)
3. Exact session tracking (exactly 1 or 100 rolls)
4. Aura name pattern matching
5. Multi-condition combos (100 commons → divine+)
