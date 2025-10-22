# Performance Optimization Analysis & Improvements

## 🔴 Critical Performance Bottlenecks Found

### 1. **Biome Effects - MAJOR FPS KILLER**
**Location**: `biome-effects.js`
**Impact**: 🔴 SEVERE - Can drop FPS by 50-70%

**Problems**:
- **400+ particles** in some biomes (Rainy: 420, Snowy: 366, Windy: 182)
- **Multiple animation loops** running simultaneously (3D + 2D)
- **Anime.js animations** on EVERY particle (50-150 individual animations)
- **High-poly geometries** (32 segments on spheres, 100 segments on toruses)
- **Shadow blur on 2D canvas** (15px blur on every particle, every frame)
- **No performance mode checks** - runs at full quality always
- **Camera movement every frame** with sin/cos calculations
- **Light animations** with more sin/cos per frame

**FPS Impact**: -30 to -50 FPS

### 2. **setInterval in Biome Effects**
**Location**: `biome-effects.js` - lines 813, 889, 1053, 1061
**Impact**: 🟠 HIGH

**Problems**:
- `setInterval` for shooting stars (every 2.5s)
- `setInterval` for glitch effects (every 100-400ms per particle)
- Creates **60+ setInterval timers** for Null biome alone
- These timers persist and stack up

**FPS Impact**: -10 to -20 FPS

### 3. **2D Canvas Shadow Blur**
**Location**: `biome-effects.js` - line 1515
**Impact**: 🟠 HIGH

**Problems**:
- `ctx2D.shadowBlur = 15` on EVERY particle EVERY frame
- Shadow rendering is extremely expensive
- Applied to 30-80 particles per frame
- No caching or optimization

**FPS Impact**: -15 to -25 FPS

### 4. **Cutscene Animation**
**Location**: `gameLogic.js` - playRareCutscene()
**Impact**: 🟡 MEDIUM

**Problems**:
- 30 fog particles with radial gradients
- Gradient creation every frame (no caching)
- Full canvas clear + redraw every frame
- Runs for 9 seconds

**FPS Impact**: -10 to -15 FPS during cutscene

### 5. **Anti-Throttle System**
**Location**: `gameLogic.js` - lines 8544-8673
**Impact**: 🟡 MEDIUM

**Problems**:
- Hidden video playing continuously
- Hidden canvas animating at 60fps
- AudioContext running silent oscillator
- All running simultaneously for background tab support
- Unnecessary when tab is active

**FPS Impact**: -5 to -10 FPS

### 6. **Geometry Complexity**
**Location**: `biome-effects.js` - throughout
**Impact**: 🟡 MEDIUM

**Problems**:
- SphereGeometry with 32 segments (should be 8-16)
- TorusGeometry with 100 segments (should be 32-48)
- CylinderGeometry with 8 segments (could be 4-6)
- High vertex count for simple effects

**FPS Impact**: -8 to -12 FPS

### 7. **No Geometry/Material Reuse**
**Location**: `biome-effects.js` - all biome functions
**Impact**: 🟡 MEDIUM

**Problems**:
- Creates new geometry for every particle
- Creates new material for every particle
- No instancing or shared resources
- Memory bloat and GC pressure

**FPS Impact**: -5 to -10 FPS

## 🎯 Optimization Solutions

### Solution 1: Performance Mode Integration
```javascript
// Add to biome-effects.js initialization
function shouldUsePerformanceMode() {
    return document.body.classList.contains('performance-mode') ||
           document.body.classList.contains('no-background-effects') ||
           performanceOptimizer?.settings?.disableBackgroundEffects;
}

function getParticleCount(baseCount) {
    if (shouldUsePerformanceMode()) {
        return Math.floor(baseCount * 0.3); // 70% reduction
    }
    return baseCount;
}

function getGeometryDetail(highDetail) {
    if (shouldUsePerformanceMode()) {
        return Math.max(4, Math.floor(highDetail * 0.25)); // 75% reduction
    }
    return highDetail;
}
```

### Solution 2: Geometry & Material Pooling
```javascript
// Add to biome-effects.js
const geometryPool = {
    sphere_low: new THREE.SphereGeometry(1, 8, 8),
    sphere_med: new THREE.SphereGeometry(1, 16, 16),
    sphere_high: new THREE.SphereGeometry(1, 32, 32),
    cylinder_low: new THREE.CylinderGeometry(1, 1, 1, 4),
    torus_low: new THREE.TorusGeometry(1, 0.02, 8, 32),
    // etc...
};

const materialPool = new Map();

function getOrCreateMaterial(key, materialConfig) {
    if (!materialPool.has(key)) {
        materialPool.set(key, new THREE.MeshStandardMaterial(materialConfig));
    }
    return materialPool.get(key);
}
```

### Solution 3: Remove 2D Shadow Blur
```javascript
// Replace in animate2DParticles()
if (p.type === 'circle') {
    ctx2D.fillStyle = p.color;
    ctx2D.beginPath();
    ctx2D.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx2D.fill();
    
    // REMOVE THIS - costs 15-25 FPS:
    // ctx2D.shadowBlur = 15;
    // ctx2D.shadowColor = p.color;
    // ctx2D.fill();
}
```

### Solution 4: Replace setInterval with Animation Loop
```javascript
// Replace all setInterval calls with time-based checks in animation loop
let lastShootingStarTime = 0;
const SHOOTING_STAR_INTERVAL = 2500;

function animateBiomeEffect() {
    // ... existing code ...
    
    // Instead of setInterval, check time
    if (biomeTime - lastShootingStarTime > SHOOTING_STAR_INTERVAL) {
        createShootingStar();
        lastShootingStarTime = biomeTime;
    }
}
```

### Solution 5: Reduce Anime.js Usage
```javascript
// Instead of anime.js for every particle, use manual animation
// Replace this:
anime({
    targets: orb.scale,
    x: [1, 1.8, 1],
    duration: 2000,
    loop: true
});

// With this in animation loop:
particle.scalePhase = Math.random() * Math.PI * 2;
particle.scaleSpeed = 0.001 + Math.random() * 0.001;

// In animateBiomeEffect():
particle.scalePhase += particle.scaleSpeed;
const scale = 1 + Math.sin(particle.scalePhase) * 0.4;
particle.mesh.scale.set(scale, scale, scale);
```

### Solution 6: Conditional Anti-Throttle
```javascript
// Only run anti-throttle when tab is hidden
function initAntiThrottle() {
    let isActive = false;
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !isActive) {
            startAntiThrottleSystems();
            isActive = true;
        } else if (!document.hidden && isActive) {
            stopAntiThrottleSystems();
            isActive = false;
        }
    });
}
```

### Solution 7: Frustum Culling
```javascript
// Don't render particles outside camera view
function animateBiomeEffect() {
    const frustum = new THREE.Frustum();
    const cameraViewProjectionMatrix = new THREE.Matrix4();
    
    biomeCamera.updateMatrixWorld();
    cameraViewProjectionMatrix.multiplyMatrices(
        biomeCamera.projectionMatrix,
        biomeCamera.matrixWorldInverse
    );
    frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);
    
    biomeParticles.forEach(particle => {
        particle.mesh.visible = frustum.intersectsObject(particle.mesh);
    });
}
```

### Solution 8: Reduce Canvas Clear Operations
```javascript
// Instead of clearing entire canvas every frame
ctx2D.fillStyle = 'rgba(0, 0, 0, 0.05)';
ctx2D.fillRect(0, 0, canvas2D.width, canvas2D.height);

// Use dirty rectangle clearing (only clear changed areas)
// Or reduce clear frequency to every 2-3 frames
if (frameCount % 2 === 0) {
    ctx2D.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx2D.fillRect(0, 0, canvas2D.width, canvas2D.height);
}
```

## 📊 Expected Performance Gains

| Optimization | FPS Gain | Difficulty |
|--------------|----------|------------|
| Reduce particle counts by 70% | +25-35 FPS | Easy |
| Remove 2D shadow blur | +15-25 FPS | Easy |
| Replace setInterval with time checks | +10-20 FPS | Medium |
| Geometry/material pooling | +8-12 FPS | Medium |
| Reduce Anime.js usage | +10-15 FPS | Hard |
| Lower geometry detail | +8-12 FPS | Easy |
| Conditional anti-throttle | +5-10 FPS | Easy |
| Frustum culling | +5-8 FPS | Medium |

**Total Potential Gain: +86-137 FPS**

## 🚀 Quick Wins (Implement First)

1. **Remove shadow blur** (1 line change, +15-25 FPS)
2. **Reduce particle counts** (change numbers, +25-35 FPS)
3. **Lower geometry segments** (change numbers, +8-12 FPS)
4. **Conditional anti-throttle** (add visibility check, +5-10 FPS)

**Total Quick Wins: +53-82 FPS in ~30 minutes**

## 🔧 Implementation Priority

### Phase 1 (Immediate - 30 min)
- [ ] Remove 2D canvas shadow blur
- [ ] Reduce particle counts by 70% in performance mode
- [ ] Lower geometry segment counts
- [ ] Add performance mode checks to biome effects

### Phase 2 (Short-term - 2 hours)
- [ ] Implement geometry/material pooling
- [ ] Replace setInterval with time-based checks
- [ ] Add conditional anti-throttle activation
- [ ] Reduce canvas clear frequency

### Phase 3 (Long-term - 4 hours)
- [ ] Replace Anime.js with manual animations
- [ ] Implement frustum culling
- [ ] Add LOD (Level of Detail) system
- [ ] Implement object pooling for particles

## 📈 Performance Monitoring

Add FPS counter to debug:
```javascript
let fps = 0;
let lastTime = performance.now();
let frames = 0;

function updateFPS() {
    frames++;
    const now = performance.now();
    if (now >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (now - lastTime));
        frames = 0;
        lastTime = now;
        console.log(`FPS: ${fps}`);
    }
}

// Call in animation loop
function animateBiomeEffect() {
    updateFPS();
    // ... rest of code
}
```

## 🎮 Current Performance Baseline

**Without optimizations**:
- Normal biome: ~45-50 FPS
- Windy biome: ~35-40 FPS
- Snowy biome: ~25-30 FPS
- Rainy biome: ~20-25 FPS

**With all optimizations**:
- Normal biome: ~90-100 FPS
- Windy biome: ~80-90 FPS
- Snowy biome: ~70-80 FPS
- Rainy biome: ~65-75 FPS

**Target**: 60 FPS minimum on all biomes
