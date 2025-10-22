# Aura Individual Styling Progress

## Completed So Far (Part 1-3)

### Files Created:
1. **aura-individual-styles.css** - Common → Legendary tier styles (60+ auras)
2. **aura-styles-part2.css** - Mythic tier continuation (30+ auras)
3. **AURA-RENAME-PLAN.md** - Complete naming convention guide

### Styling Applied:
- **Common Tier**: Simple subtle gradients with basic animations
- **Uncommon Tier**: Brighter green gradients
- **Rare Tier**: Vibrant multi-color gradients
- **Epic Tier**: Complex animated gradients with glow effects
- **Legendary Tier**: Multi-phase complex animations
- **Mythic Tier** (partial): Advanced animations with special effects

### Animation Types Created:
- `auraShift` - Basic gradient movement
- `auraPulse` - Brightness pulsing
- `auraShimmer` - Scale + position
- `auraCrystal` - Multi-phase with saturation
- `auraStarlight` - Glow effect animation
- `auraRage` - Aggressive brightness
- `auraGlacier` - Hue rotation + brightness
- `auraGem` - Contrast + brightness
- `auraGlitch` - Position glitching
- `auraGold` - Complex 4-phase gold shimmer
- `auraJackpot` - Scale + rotate + brightness
- `auraWind` - Horizontal movement + skew
- `auraDoublestar` - Enhanced star effect
- `auraTriplestar` - Ultimate star effect
- And 20+ more specialized animations

## Still Needs Styling:

### Exotic Tier (~40 auras)
- Aquatic, Lightning, Starlight, Star Rider
- Nautilus, Permafrost, Flow, Stormal
- Comet, Exotic, and mutations

### Divine Tier (~30 auras)
- Jade, Spectre, Jazz, Aether
- Terror, Raven, Warlock
- Celestial, Kyawthuite
- And mutations

### Celestial Tier (~25 auras)
- Arcane, Astral, Cosmos
- Gravitational, Unbound, Virtual
- Poseidon, Zeus, Wonderland
- And mutations

### Transcendent Tier (~150+ auras)
- Galaxy, Vital, Twilight, Origin
- Hades, Anubis, Hyper-Volt
- Hurricane, Maelstrom, Bloodlust
- Gargantua, Sovereign, Luminosity
- All mutations and variations

### Cosmic Tier (5 auras)
- Abomination, Mastermind
- Orion, THANEBORNE, Eden

### Special Halloween Auras (~30 auras)
- PHANTASMA, APOCALYPSE
- MALEDICTION, LAMENTHYR
- Vampiric, Erebus, Accursed
- All Halloween variations

## Next Steps:

### Part 4: Exotic Tier
Create ultra-complex animations with:
- Wave effects for water auras
- Electric pulses for lightning
- Particle effects simulation
- Multi-layer gradients

### Part 5: Divine → Celestial
Premium animations with:
- Holographic effects
- 3D-style transformations
- Multiple glow layers
- Advanced color cycling

### Part 6: Transcendent Tier (Batch 1)
Split into multiple files:
- Solar/Lunar themed
- Elemental themed  
- Dark/Light themed
- Cosmic themed

### Part 7: Transcendent Tier (Batch 2)
Continue with:
- Mutation styles
- Special variations
- Boss auras
- Ultra-rare

### Part 8: Cosmic & Special
Ultimate tier styling:
- Reality-breaking effects
- Multiple animation layers
- Particle systems
- Advanced shaders

### Part 9: Implementation
- Update HTML to include all CSS files
- Add class application logic
- Test all animations
- Optimize performance

### Part 10: Special Character Names
- Update auraData.js with all new names
- Update references in other files
- Update codex descriptions
- Update achievement names

## CSS Classes Naming Convention:
- Class format: `.aura-{name-lowercase-hyphenated}`
- Example: `✦ Starlight ✦` → `.aura-starlight`
- Mutations: `{name}: {mutation}` → `.aura-{name}-{mutation}`
- Example: `Solar: Solstice` → `.aura-solar-solstice`

## Animation Performance Guidelines:
- Use `transform` and `opacity` for smooth 60fps
- Limit `filter` effects (can be GPU intensive)
- Keep gradient complexity reasonable
- Use `will-change` for frequently animated properties
- Cap animation duration between 3-10s

## Symbols Used So Far:
✿ ★ ◈ ◉ ◇ ◆ ⬡ ⟐ ⟡ ✦ ✧ ☽ ☾ ⚡ ⛧ ✞ ☠ ❄ ☀ ⋈ ♫ ⚠ ☣ ⛓ ≋ ☄ ♥ ◐ ◑ ⟬ ⟭ ⟦ ⟧ ⟪ ⟫ ♢ ▣ 『 』 《 》 { }

## Files to Update After Styling:
1. index.html - Add CSS file links
2. gameLogic.js - Apply aura classes to display
3. auraData.js - Update names with special characters
4. codex.js - Update aura names
5. font-mapping-complete.js - Update names
6. debug.js - Update test functions
7. achievementsData.js - Update requirements
8. biomes.js - Update biome aura lists (if applicable)
