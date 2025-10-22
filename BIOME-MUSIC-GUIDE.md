# Biome Music System Guide

## Overview
The biome music system automatically plays ambient music when specific biomes are active. Music fades in/out smoothly when biomes change.

## Current Biome Music
- **SANDSTORM** - `sandstorm.mp3` (30% volume, looping)

## How to Add More Biome Music

### 1. Add your music file to the project root
Place your `.mp3` file in the same directory as `sandstorm.mp3`

### 2. Update the BIOME_MUSIC configuration in `biomes.js`
Find the `BIOME_MUSIC` object (around line 230) and add your biome:

```javascript
const BIOME_MUSIC = {
    SANDSTORM: {
        file: 'sandstorm.mp3',
        volume: 0.3,
        loop: true
    },
    HELL: {
        file: 'hell-ambience.mp3',
        volume: 0.4,
        loop: true
    },
    STARFALL: {
        file: 'cosmic-stars.mp3',
        volume: 0.25,
        loop: true
    }
    // Add more biomes here
};
```

### 3. Configuration Options

- **file**: Path to the music file (relative to project root)
- **volume**: Volume level (0.0 to 1.0). Recommended: 0.2-0.4
- **loop**: Boolean - whether the music should loop continuously

## Features

### Automatic Crossfade
- When biomes change, the old music fades out over 1 second
- New music fades in over 2 seconds
- Smooth transitions between biomes

### User Control
- Music respects the `Sound Enabled` setting in QoL options
- If sound is disabled, biome music won't play

### NORMAL Biome Behavior
- When returning to NORMAL biome, all music stops
- This gives players a break from ambient music

## Biome Names Reference

Available biomes for music (use these exact names):
- `NORMAL` - Default biome (no music recommended)
- `WINDY`
- `SNOWY`
- `BLIZZARD`
- `RAINY`
- `MONSOON`
- `SANDSTORM` ✅ (music added)
- `JUNGLE`
- `AMAZON`
- `CRIMSON`
- `STARFALL`
- `METEOR_SHOWER`
- `HELL`
- `CORRUPTION`
- `NULL`
- `GLITCHED`
- `DREAMSPACE`
- `PUMPKIN_MOON`
- `GRAVEYARD`
- `BLOOD_RAIN`

## Technical Details

### Uses Howler.js
The system uses Howler.js for audio playback, which provides:
- Cross-browser audio support
- Smooth fading
- Efficient memory management
- HTML5 audio optimization for long tracks

### Memory Management
- Music is properly unloaded when stopped
- Only one biome track plays at a time
- Previous track is cleaned up before new one starts

## Troubleshooting

### Music not playing?
1. Check browser console for loading errors
2. Verify file path is correct
3. Ensure Sound Enabled in settings
4. Check file format (MP3 recommended)
5. Verify volume isn't set to 0

### Music too loud/quiet?
Adjust the `volume` property in BIOME_MUSIC configuration (0.0-1.0)

### Music cutting off?
Ensure `loop: true` is set if you want continuous music

## Example: Adding Hell Biome Music

```javascript
const BIOME_MUSIC = {
    SANDSTORM: {
        file: 'sandstorm.mp3',
        volume: 0.3,
        loop: true
    },
    HELL: {
        file: 'hell-fire.mp3',
        volume: 0.35,
        loop: true
    }
};
```

That's it! The music will automatically play when the HELL biome activates.
