# Particle Music Sync System - Implementation Guide

## Overview
The particle system has been completely overhauled to provide unique, theme-appropriate particles for each biome that sync with the biome's music.

## Key Features

### 1. **Beat Detection & Pulse System** 🥁

Particles now detect and pulse to the actual beats in the music!

**How Beat Detection Works:**
- Analyzes low frequency energy (bass/drums) in real-time
- Tracks energy levels over the last 30 frames to establish a baseline
- When energy spikes 35% above average = **BEAT DETECTED**
- Minimum 200ms between beats prevents false positives
- Beat intensity scales based on how strong the spike is (0-100%)

**Visual Effects on Beats:**
- **Particle Pulse** - All particles grow 50-120% larger on beats
- **Glow Burst** - Particles emit stronger glows during beats
- **Screen Flash** - Subtle white flash on strong beats (>40% intensity)
- **Alpha Pulse** - Opacity increases on beats for dramatic effect

**Different Modes React Differently:**
- **`pulse` mode** - Maximum beat response (120% size increase!)
- **`bass` mode** - Strong beat pulse (80% increase)
- **`glow` mode** - Extra glow intensity on beats (60% increase)
- **`mid` mode** - Moderate beat pulse (50% increase)
- **`treble` mode** - Subtle beat pulse (30% increase)

### 2. **Unique Particle Types for Each Biome**

Each biome now has custom particle shapes that fit its theme:

- **Snowflake** - Snowy, Blizzard biomes (detailed 6-branch snowflakes)
- **Raindrop** - Rainy, Monsoon, Blood Rain biomes (falling rain streaks)
- **Ember** - Hell, Volcano biomes (glowing particles that rise upward with trails)
- **Lightning** - Charged biome (jagged electric bolts)
- **Leaf** - Jungle, Amazon biomes (oval leaves with veins)
- **Sand** - Sandstorm, Dunes biomes (irregular sand grains)
- **Crystal** - Hallow biome (diamond-shaped crystals with shine)
- **Void** - Void, Null biomes (dark particles that absorb light)
- **Glitch** - Glitched biome (glitchy squares with RGB offset)
- **Star** - Starfall, Dreamspace biomes (multi-pointed stars with glow)
- **Circle** - Generic/ambient biomes
- **Line** - Wind effects (Windy, Tornado, Meteor Shower)

### 3. **Music-Reactive Modes**

Particles now respond to different frequency bands of the music:

- **`bass`** - Reacts to low frequencies (drums, bass)
  - Used for: Heavy weather (Blizzard, Monsoon, Tornado)
  - Effect: Particles speed up and grow with bass hits

- **`treble`** - Reacts to high frequencies (cymbals, hi-hats)
  - Used for: Delicate effects (Snowy, Sky)
  - Effect: Particles shimmer and pulse with high notes

- **`mid`** - Reacts to mid frequencies (melody, vocals)
  - Used for: Ambient biomes (Normal, Jungle, Sandstorm)
  - Effect: Smooth particle movement with music

- **`pulse`** - Reacts to overall intensity
  - Used for: Intense biomes (Crimson, Volcano, Corruption)
  - Effect: Particles pulse in size and brightness

- **`glow`** - Creates glowing effects
  - Used for: Magical/luminous biomes (Starfall, Charged, Bioluminescent, Hell, Hallow)
  - Effect: Particles emit light halos that intensify with music

### 3. **Particle Physics**

Each particle type has appropriate movement:

- **Falling particles** (rain, snow, leaves) - Fall downward with drift
- **Rising particles** (embers) - Rise upward like hot air
- **Floating particles** (circles, stars) - Float in all directions
- **Wind particles** (lines) - Move horizontally with slight vertical drift
- **Lightning** - Moves downward with jagged paths

### 4. **Music Analysis**

The system analyzes the biome music in real-time using the Web Audio API:

```javascript
// Frequency bands analyzed:
- Bass (low): 0-33% of frequency spectrum
- Mid: 33-66% of frequency spectrum  
- Treble (high): 66-100% of frequency spectrum
- Overall intensity: Average of all frequencies
```

## Biome-Specific Configurations

| Biome | Particle Type | Music Mode | Special Features |
|-------|--------------|------------|------------------|
| Normal | Circle | Mid | Gentle floating orbs |
| Windy | Line | Mid | Fast horizontal streaks |
| Snowy | Snowflake | Treble | Detailed 6-branch flakes |
| Blizzard | Snowflake | Bass | Heavy snow, bass-reactive |
| Rainy | Raindrop | Bass | Falling rain lines |
| Monsoon | Raindrop | Bass | Intense rain, thick drops |
| Sandstorm | Sand | Mid | Irregular sand grains |
| Jungle | Leaf | Mid | Falling leaves with veins |
| Amazon | Leaf | Bass | Larger leaves, bass-reactive |
| Crimson | Circle | Pulse | Pulsing red particles |
| Starfall | Star | Glow | Glowing stars |
| Meteor Shower | Line | Glow | Glowing streaks |
| Hell | Ember | Glow | Rising embers with tails |
| Tornado | Line | Bass | Fast swirling lines |
| Dunes | Sand | Mid | Drifting sand |
| Volcano | Ember | Pulse | Intense rising embers |
| Void | Void | Mid | Dark absorbing particles |
| Sky | Circle | Treble | Light floating particles |
| Charged | Lightning | Glow | Electric bolts |
| Bioluminescent | Circle | Glow | Cyan glowing orbs |
| Ancient | Rect | Mid | Sandy rectangles |
| Hallow | Crystal | Glow | Glowing crystals |
| Corruption | Circle | Pulse | Purple pulsing orbs |
| Null | Void | Mid | Dark void particles |
| Glitched | Glitch | Pulse | Glitchy RGB offset |
| Dreamspace | Star | Glow | Multi-color stars |
| Graveyard | Circle | Mid | Gray misty particles |
| Pumpkin Moon | Circle | Pulse | Orange pulsing |
| Blood Rain | Raindrop | Bass | Dark red rain |

## Technical Implementation

### Audio Connection
```javascript
// The system automatically connects to biome music:
1. Attempts connection when particles are created
2. Retries after 1 second if audio not ready
3. Finds audio element by ID 'biomeMusic'
4. Creates Web Audio API analyzer
5. Analyzes frequency data in real-time
```

### Performance
- All particles update at 60 FPS
- Frequency analysis updates every frame
- Smooth fade transitions between biomes
- Efficient canvas 2D rendering

### How It Works
1. When a biome changes, `createBiomeParticles()` is called
2. System attempts to connect to biome music via Web Audio API
3. Particles are created with type, color, and music-reactive mode
4. Animation loop reads frequency data every frame
5. Particles adjust size, speed, glow based on music
6. Different particle types have unique drawing functions

## Visual Effects

### Glow Effects
Particles with 'glow' mode emit shadow halos that intensify with music:
- Stars twinkle brighter
- Embers pulse with inner fire
- Lightning bolts flash
- Crystals shine

### Pulse Effects
Particles with 'pulse' mode change both size and opacity:
- Size scales up to 2.2x with intense music
- Opacity modulates between 50-100%
- Creates rhythmic visual impact

### Bass/Treble/Mid Reactivity
Particles react to specific frequency ranges:
- Bass hits make particles surge forward
- Treble makes particles shimmer delicately
- Mid creates smooth synchronized movement

## Testing
To test the system:
1. Change to a biome with music
2. Watch particles sync to the music beats
3. Notice different particle types per biome
4. See glow effects during intense music sections

## Console Logs
The system provides helpful logs:
- `🎵 Audio analyzer connected to biome music` - Audio sync successful
- `🎨 Created X particles for [BIOME]` - Particles created
- `ℹ️ No biome music audio element found yet` - Waiting for audio

## Future Enhancements
Possible additions:
- Per-particle beat detection for more dramatic effects
- Trail effects for moving particles
- Particle interactions with cursor
- 3D depth layers
- Color shifts with music key changes
