# Aura Styling Implementation Guide

## Step 1: Link CSS Files in HTML

Add these lines in `index.html` after the existing stylesheet links:

```html
<!-- Individual Aura Styles -->
<link rel="stylesheet" href="aura-individual-styles.css?v=1.0">
<link rel="stylesheet" href="aura-styles-part2.css?v=1.0">
<link rel="stylesheet" href="aura-styles-exotic.css?v=1.0">
<link rel="stylesheet" href="aura-styles-divine.css?v=1.0">
<link rel="stylesheet" href="aura-styles-celestial.css?v=1.0">
<link rel="stylesheet" href="aura-styles-transcendent-1.css?v=1.0">
<link rel="stylesheet" href="aura-styles-transcendent-2.css?v=1.0">
<link rel="stylesheet" href="aura-styles-cosmic.css?v=1.0">
```

## Step 2: Create Helper Function in gameLogic.js

Add this function to convert aura names to CSS class names:

```javascript
// Convert aura name to CSS class format
function getAuraClassName(auraName) {
    // Remove special characters and convert to lowercase
    return 'aura-' + auraName
        .toLowerCase()
        .replace(/[✿★◈◉◇◆⬡⟐⟡✦✧☽☾⚡⛧✞☠❄☀⋈♫⚠☣⛓≋☄♥◐◑⟬⟭⟦⟧⟪⟫♢▣『』《》\{\}\[\]<>:]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '');
}

// Examples:
// "✦ Starlight ✦" → "aura-starlight"
// "Solar: Solstice" → "aura-solar-solstice"
// "M A R T Y R" → "aura-m-a-r-t-y-r"
```

## Step 3: Apply Class to Aura Display

Modify the `displayAura()` function in gameLogic.js:

```javascript
function displayAura(aura, isAnimating = false) {
    const display = document.getElementById('currentAuraDisplay');
    const rarityClass = `rarity-${aura.tier}`;
    const auraClass = getAuraClassName(aura.name); // NEW LINE
    const showRarity = aura.rarity;
    const breakthroughLabel = aura.breakthrough ? ' (Breakthrough)' : '';
    const nativeRarity = NATIVE_RARITIES[aura.name] || showRarity;
    const nativeLabel = aura.native ? `<div class="aura-native" style="color: #4ade80; font-size: 0.85em; margin-top: 2px; padding-bottom: 4px;">Native, 1 in ${nativeRarity.toLocaleString()}</div>` : '';
    const auraFont = getAuraFont(aura.name);
    const auraColor = getAuraColor(aura.name);
    const auraGradient = getAuraGradient(aura.name);
    
    const isNewBest = aura.rarity >= gameState.achievements.stats.highestRarity;
    const newBestIndicator = isNewBest ? '<div class="new-best-indicator">🌟 NEW BEST! 🌟</div>' : '';
    
    const specialTextEffects = {
        'Mastermind': 'mastermind-text',
        'Chromatic: Diva': 'chromatic-diva-text',
        // ... rest of special effects
    };
    
    const specialTextClass = specialTextEffects[aura.name] || '';
    const specialContainerClass = specialTextClass ? 'mastermind-container' : '';
    
    // MODIFIED LINE - Add aura class to the aura-name div
    display.innerHTML = `<div class="${specialContainerClass}">
        <div class="aura-name ${rarityClass} ${auraClass} gradient-text ${specialTextClass}" 
             style="font-family: ${auraFont}; color: ${auraColor} !important; --aura-gradient: ${auraGradient};">
            ${aura.name}
        </div>
        ${newBestIndicator}
        <div class="aura-rarity">1 in ${showRarity.toLocaleString()}${breakthroughLabel}</div>
        ${nativeLabel}
    </div>`;
    
    if (!isAnimating) {
        anime({ targets: display, scale: [1.1, 1], duration: 300, easing: 'easeOutExpo' });
    }
}
```

## Step 4: Update CSS for Gradient Background

Add this to your CSS to ensure gradient backgrounds work:

```css
.aura-name {
    background-clip: text !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent;
    background-size: 200% 200%;
    padding: 10px 20px;
    border-radius: 8px;
    position: relative;
}

/* Make gradient background visible behind text */
.aura-name::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    background-clip: padding-box;
    z-index: -1;
    border-radius: inherit;
    opacity: 0.3; /* Adjust for background visibility */
}
```

## Step 5: Performance Optimization

Add this for better performance:

```css
/* Enable GPU acceleration for animated auras */
[class*="aura-"] {
    will-change: background-position, transform, filter;
    backface-visibility: hidden;
    -webkit-font-smoothing: antialiased;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
    [class*="aura-"] {
        animation: none !important;
        transition: none !important;
    }
}
```

## Step 6: Optional - Add Particle Effects

For ultra-rare auras, you can add particle effects:

```html
<!-- In index.html, add particles.js library -->
<script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
```

```javascript
// In gameLogic.js, add particle effect for cosmic tier
function displayCosmicAura(aura) {
    // Show particles for cosmic tier auras
    if (aura.tier === 'cosmic') {
        particlesJS('currentAuraDisplay', {
            particles: {
                number: { value: 80 },
                color: { value: aura.particleColor || '#ffffff' },
                shape: { type: 'circle' },
                opacity: {
                    value: 0.5,
                    random: true
                },
                size: {
                    value: 3,
                    random: true
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    out_mode: 'out'
                }
            }
        });
    }
}
```

## Step 7: Testing

Test each tier:

```javascript
// Debug console commands
function testAuraStyle(auraName) {
    const testAura = AURAS.find(a => a.name === auraName);
    if (testAura) {
        displayAura(testAura);
        console.log('Class applied:', getAuraClassName(auraName));
    }
}

// Test examples:
testAuraStyle('✦ Starlight ✦');
testAuraStyle('『E Q U I N O X』');
testAuraStyle('⟪ ABOMINATION ⟫');
```

## Step 8: Browser Compatibility

Ensure compatibility:

```css
/* Vendor prefixes for older browsers */
@-webkit-keyframes auraShift {
    /* Same as regular keyframes */
}

@-moz-keyframes auraShift {
    /* Same as regular keyframes */
}

/* Fallback for browsers without gradient support */
@supports not (background: linear-gradient(45deg, #000, #fff)) {
    .aura-name {
        background: solid color !important;
    }
}
```

## Step 9: Loading Optimization

Lazy load CSS for better initial load:

```html
<!-- Critical styles inline -->
<style>
    /* Inline critical aura styles here */
</style>

<!-- Non-critical styles deferred -->
<link rel="preload" href="aura-individual-styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="aura-individual-styles.css"></noscript>
```

## Step 10: Debugging

Add debug mode to visualize all aura styles:

```javascript
function showAllAuraStyles() {
    const container = document.createElement('div');
    container.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; padding: 20px;';
    
    AURAS.forEach(aura => {
        const div = document.createElement('div');
        div.className = `aura-name ${getAuraClassName(aura.name)}`;
        div.textContent = aura.name;
        div.style.cssText = 'padding: 20px; text-align: center; border-radius: 8px;';
        container.appendChild(div);
    });
    
    document.body.appendChild(container);
}
```

## Common Issues & Solutions:

### Issue: Animations not showing
**Solution**: Check that CSS files are loaded and classes are applied correctly

### Issue: Text not visible
**Solution**: Adjust `-webkit-text-fill-color` or use background on parent element

### Issue: Performance lag
**Solution**: Reduce number of concurrent animations, use `transform` instead of position

### Issue: Gradients look wrong
**Solution**: Check `background-size` and `background-position` values

### Issue: Special characters not displaying
**Solution**: Ensure UTF-8 encoding in HTML: `<meta charset="UTF-8">`
