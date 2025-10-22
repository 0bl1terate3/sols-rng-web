// =================================================================
// Simple 2D Biome Effects - No Three.js Required!
// =================================================================

let biomeCanvas = null;
let biomeCtx = null;
let biomeParticles = [];
let biomeAnimationFrame = null;
let currentBiomeEffect = null;
let targetBgColor = 'rgba(10, 15, 26, 0.95)';
let currentBgColor = 'rgba(10, 15, 26, 0.95)';
let bgTransitionSpeed = 0.05;
let biomeAudioContext = null;
let biomeAudioAnalyzer = null;
let biomeAudioDataArray = null;
let musicIntensity = 0; // 0-1 based on music volume
let musicBass = 0; // Low frequency intensity
let musicMid = 0; // Mid frequency intensity
let musicTreble = 0; // High frequency intensity
let maxParticles = 200; // Maximum particles allowed
let particleSpawnRate = 0; // Particles to spawn per frame based on music

// Beat detection variables
let beatDetectionHistory = [];
let beatDetectionHistorySize = 30; // Track last 30 frames
let beatThreshold = 1.35; // Energy must be 35% higher than average to count as beat
let lastBeatTime = 0;
let beatCooldown = 200; // Minimum ms between beats
let isBeat = false;
let beatIntensity = 0; // 0-1, how strong the current beat is
let beatDecay = 0.85; // How fast beat effect fades

// Helper function to interpolate between two rgba colors
function lerpColor(color1, color2, t) {
    // Parse rgba values
    const parse = (c) => {
        const match = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        return match ? {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3]),
            a: parseFloat(match[4] || 1)
        } : { r: 10, g: 15, b: 26, a: 0.95 };
    };
    
    const c1 = parse(color1);
    const c2 = parse(color2);
    
    return `rgba(${Math.round(c1.r + (c2.r - c1.r) * t)}, ${Math.round(c1.g + (c2.g - c1.g) * t)}, ${Math.round(c1.b + (c2.b - c1.b) * t)}, ${(c1.a + (c2.a - c1.a) * t).toFixed(2)})`;
}

// Connect to biome music for synchronization
function connectBiomeAudio() {
    try {
        // Find the biome music audio element - check both possible IDs
        let audioElement = document.getElementById('biomeMusic');
        
        // If not found, try to find any audio element playing biome music
        if (!audioElement) {
            const audios = document.querySelectorAll('audio');
            console.log(`🔍 Searching for audio element... Found ${audios.length} audio elements`);
            for (const audio of audios) {
                if (audio.src && audio.src.includes('.mp3')) {
                    console.log(`✅ Found audio element with src: ${audio.src}`);
                    audioElement = audio;
                    audioElement.id = 'biomeMusic'; // Set ID for future reference
                    break;
                }
            }
        } else {
            console.log(`✅ Found audio element by ID: ${audioElement.src}`);
        }
        
        if (!audioElement || !audioElement.src) {
            console.log('⚠️ No biome music audio element found - particles will not sync to music');
            return;
        }
        
        // Create audio context if needed
        if (!biomeAudioContext) {
            biomeAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Resume audio context if suspended (browser autoplay policy)
        if (biomeAudioContext.state === 'suspended') {
            biomeAudioContext.resume();
        }
        
        // Create analyzer if needed
        if (!biomeAudioAnalyzer) {
            biomeAudioAnalyzer = biomeAudioContext.createAnalyser();
            biomeAudioAnalyzer.fftSize = 256;
            biomeAudioAnalyzer.smoothingTimeConstant = 0.8;
            biomeAudioDataArray = new Uint8Array(biomeAudioAnalyzer.frequencyBinCount);
            
            // Connect audio element to analyzer
            // Note: createMediaElementSource can only be called once per audio element
            if (!window.biomeAudioSourceNode) {
                window.biomeAudioSourceNode = biomeAudioContext.createMediaElementSource(audioElement);
                console.log('🎵 Created media element source node');
            }
            
            window.biomeAudioSourceNode.connect(biomeAudioAnalyzer);
            biomeAudioAnalyzer.connect(biomeAudioContext.destination);
            
            console.log('🎵 Audio analyzer connected to biome music successfully!');
            console.log(`   FFT Size: ${biomeAudioAnalyzer.fftSize}, Frequency bins: ${biomeAudioAnalyzer.frequencyBinCount}`);
        }
    } catch (e) {
        console.error('❌ Could not connect audio analyzer:', e);
        console.error('   Error details:', e.message);
    }
}

// Initialize simple canvas
function initSimpleBiomeEffects() {
    if (biomeCanvas) return; // Already initialized
    
    biomeCanvas = document.createElement('canvas');
    biomeCanvas.id = 'simpleBiomeCanvas';
    biomeCanvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
    `;
    biomeCanvas.width = window.innerWidth;
    biomeCanvas.height = window.innerHeight;
    document.body.insertBefore(biomeCanvas, document.body.firstChild);
    biomeCtx = biomeCanvas.getContext('2d');
    
    // Handle resize
    window.addEventListener('resize', () => {
        biomeCanvas.width = window.innerWidth;
        biomeCanvas.height = window.innerHeight;
    });
    
    // Add click handler to help connect audio (browser autoplay policy)
    document.addEventListener('click', () => {
        if (!biomeAudioAnalyzer) {
            console.log('👆 Click detected - attempting audio connection...');
            connectBiomeAudio();
        }
        if (biomeAudioContext && biomeAudioContext.state === 'suspended') {
            biomeAudioContext.resume();
            console.log('🔊 Audio context resumed');
        }
    }, { once: true });
    
    console.log('✅ Simple biome effects initialized');
}

// Clear all particles (with fade transition)
function clearBiomeParticles(fadeOut = true) {
    if (fadeOut) {
        // Mark all existing particles to fade out
        biomeParticles.forEach(p => {
            p.fadingOut = true;
            p.fadeSpeed = 0.02; // How fast they fade
        });
    } else {
        // Immediate clear
        biomeParticles = [];
        if (biomeAnimationFrame) {
            cancelAnimationFrame(biomeAnimationFrame);
            biomeAnimationFrame = null;
        }
        if (biomeCtx) {
            biomeCtx.clearRect(0, 0, biomeCanvas.width, biomeCanvas.height);
        }
    }
}

// Animation loop
function animateSimpleBiomeEffect() {
    if (!biomeCtx) return;
    
    biomeAnimationFrame = requestAnimationFrame(animateSimpleBiomeEffect);
    
    // Read audio data if available
    if (biomeAudioAnalyzer && biomeAudioDataArray) {
        biomeAudioAnalyzer.getByteFrequencyData(biomeAudioDataArray);
        
        // Calculate average intensity (0-1)
        const sum = biomeAudioDataArray.reduce((a, b) => a + b, 0);
        musicIntensity = (sum / biomeAudioDataArray.length) / 255;
        
        // Debug: Log audio status once
        if (!window.audioDebugLogged) {
            console.log('🎵 Audio analyzer working! musicIntensity:', musicIntensity.toFixed(2));
            window.audioDebugLogged = true;
        }
        
        // Calculate frequency bands for more detailed music reactivity
        const third = Math.floor(biomeAudioDataArray.length / 3);
        
        // Bass (low frequencies)
        const bassSum = biomeAudioDataArray.slice(0, third).reduce((a, b) => a + b, 0);
        musicBass = (bassSum / third) / 255;
        
        // Mid frequencies
        const midSum = biomeAudioDataArray.slice(third, third * 2).reduce((a, b) => a + b, 0);
        musicMid = (midSum / third) / 255;
        
        // Treble (high frequencies)
        const trebleSum = biomeAudioDataArray.slice(third * 2).reduce((a, b) => a + b, 0);
        musicTreble = (trebleSum / (biomeAudioDataArray.length - third * 2)) / 255;
        
        // Beat detection - focus on bass frequencies for kick/drum detection
        const lowFreqSlice = biomeAudioDataArray.slice(0, Math.floor(biomeAudioDataArray.length / 4));
        const currentEnergy = lowFreqSlice.reduce((a, b) => a + b, 0) / lowFreqSlice.length;
        
        // Add to history
        beatDetectionHistory.push(currentEnergy);
        if (beatDetectionHistory.length > beatDetectionHistorySize) {
            beatDetectionHistory.shift();
        }
        
        // Debug: Log energy levels every 60 frames (once per second at 60fps)
        if (!window.beatDebugCounter) window.beatDebugCounter = 0;
        window.beatDebugCounter++;
        if (window.beatDebugCounter % 60 === 0 && beatDetectionHistory.length >= beatDetectionHistorySize) {
            const avgEnergy = beatDetectionHistory.reduce((a, b) => a + b, 0) / beatDetectionHistory.length;
            console.log(`🎵 Energy: current=${currentEnergy.toFixed(1)} avg=${avgEnergy.toFixed(1)} threshold=${(avgEnergy * beatThreshold).toFixed(1)} beatIntensity=${(beatIntensity * 100).toFixed(0)}%`);
        }
        
        // Calculate average energy
        if (beatDetectionHistory.length >= beatDetectionHistorySize) {
            const averageEnergy = beatDetectionHistory.reduce((a, b) => a + b, 0) / beatDetectionHistory.length;
            
            // Check if current energy is significantly higher than average (beat detected)
            const now = Date.now();
            if (currentEnergy > averageEnergy * beatThreshold && 
                now - lastBeatTime > beatCooldown) {
                isBeat = true;
                lastBeatTime = now;
                // Calculate beat intensity based on how much higher than average
                beatIntensity = Math.min((currentEnergy / averageEnergy - 1) * 2, 1);
                
                // Log first few beats for feedback (only in first 10 seconds)
                if (now - (window.biomeParticlesStartTime || 0) < 10000) {
                    console.log(`🥁 Beat detected! Intensity: ${(beatIntensity * 100).toFixed(0)}%`);
                }
            } else {
                isBeat = false;
            }
        }
        
        // Decay beat intensity over time
        if (!isBeat) {
            beatIntensity *= beatDecay;
            if (beatIntensity < 0.01) beatIntensity = 0;
        }
    } else {
        // No audio - reset beat detection
        beatIntensity *= beatDecay;
        if (beatIntensity < 0.01) beatIntensity = 0;
    }
    
    // Smoothly transition background color
    if (currentBgColor !== targetBgColor) {
        currentBgColor = lerpColor(currentBgColor, targetBgColor, bgTransitionSpeed);
    }
    
    // Spawn new particles based on music intensity (equalizer effect)
    if (currentBiomeEffect && biomeParticles.length < maxParticles) {
        // Calculate spawn rate based on music intensity and beats
        let spawnChance = 0;
        
        if (isBeat && beatIntensity > 0.3) {
            // On beats, spawn burst of particles
            spawnChance = beatIntensity * 3; // Up to 3 particles per beat
        } else if (musicIntensity > 0.1) {
            // Continuous spawning based on music intensity
            spawnChance = musicIntensity * 0.5; // Subtle continuous spawning
        }
        
        // Spawn particles based on chance
        const particlesToSpawn = Math.floor(spawnChance + Math.random());
        for (let i = 0; i < particlesToSpawn && biomeParticles.length < maxParticles; i++) {
            spawnMusicParticle();
        }
    }
    
    // Clear with motion trail effect - use transitioning background color with slight transparency for trails
    biomeCtx.fillStyle = currentBgColor.replace(/[\d.]+\)$/, '0.85)'); // More transparent for visible trails
    biomeCtx.fillRect(0, 0, biomeCanvas.width, biomeCanvas.height);
    
    
    // Update and draw particles
    for (let i = biomeParticles.length - 1; i >= 0; i--) {
        const particle = biomeParticles[i];
        
        // Handle fading out
        if (particle.fadingOut) {
            particle.alpha -= particle.fadeSpeed;
            if (particle.alpha <= 0) {
                // Remove particle when fully transparent
                biomeParticles.splice(i, 1);
                continue;
            }
        }
        
        // Handle fading in for new particles
        if (particle.fadingIn && particle.alpha < particle.targetAlpha) {
            particle.alpha += 0.02;
            if (particle.alpha >= particle.targetAlpha) {
                particle.fadingIn = false;
            }
        }
        
        // Apply music-reactive effects focused on motion, not pulsing/size
        // Determine relevant frequency band for this particle
        let reactLevel = musicIntensity;
        if (particle.musicReactive) {
            switch (particle.musicReactiveMode) {
                case 'bass':
                    reactLevel = musicBass;
                    break;
                case 'treble':
                    reactLevel = musicTreble;
                    break;
                case 'mid':
                    reactLevel = musicMid;
                    break;
                default:
                    reactLevel = musicIntensity;
            }
        }
        // Map reactLevel (0-1) to a dramatic speed scaling with exponential curve
        // Use power curve so loud music creates much faster movement
        const reactCurve = Math.pow(reactLevel, 0.7); // Exponential response
        const targetSpeedScale = 0.05 + (reactCurve * 6.5); // ~0.05x (nearly stopped) to ~6.5x (very fast)
        if (particle.speedScale === undefined) particle.speedScale = 1;
        // Faster response for more noticeable changes
        particle.speedScale += (targetSpeedScale - particle.speedScale) * 0.25;
        
        // Update particle life
        if (particle.life !== undefined) {
            particle.life++;
            // Fade out particles near end of life
            if (particle.life > particle.maxLife * 0.8) {
                const fadeProgress = (particle.life - particle.maxLife * 0.8) / (particle.maxLife * 0.2);
                particle.alpha = particle.targetAlpha * (1 - fadeProgress);
            }
            // Remove old particles
            if (particle.life > particle.maxLife) {
                biomeParticles.splice(i, 1);
                continue;
            }
        }
        
        // Store previous position for motion trails
        particle.prevX = particle.x;
        particle.prevY = particle.y;
        
        // Update position using music-driven speed (no size pulsing)
        particle.x += particle.vx * particle.speedScale;
        particle.y += particle.vy * particle.speedScale;
        
        // Remove particles that go off screen (they'll be respawned by music)
        if (particle.x < -100 || particle.x > biomeCanvas.width + 100 ||
            particle.y < -100 || particle.y > biomeCanvas.height + 100) {
            biomeParticles.splice(i, 1);
            continue;
        }
        
        // Update properties
        if (particle.rotation !== undefined) {
            particle.rotation += particle.rotationSpeed || 0.02;
        }
        
        // Dynamic size based on speed for more visual impact
        const speedBoost = Math.min(particle.speedScale / 3, 1.5); // Up to 1.5x size when moving fast
        const drawSize = particle.size * (0.7 + speedBoost * 0.5); // Shrink when slow, grow when fast
        
        // Draw motion trail when moving fast for dramatic effect
        if (particle.speedScale > 2 && particle.prevX !== undefined) {
            biomeCtx.save();
            biomeCtx.globalAlpha = (particle.alpha || 0.8) * 0.4;
            biomeCtx.strokeStyle = particle.color;
            biomeCtx.lineWidth = drawSize * 0.8;
            biomeCtx.lineCap = 'round';
            biomeCtx.beginPath();
            biomeCtx.moveTo(particle.prevX, particle.prevY);
            biomeCtx.lineTo(particle.x, particle.y);
            biomeCtx.stroke();
            biomeCtx.restore();
        }
        
        // Draw particle
        biomeCtx.save();
        biomeCtx.globalAlpha = particle.alpha || 0.8;
        biomeCtx.translate(particle.x, particle.y);
        if (particle.rotation) biomeCtx.rotate(particle.rotation);
        
        // Enhanced drawing with speed-based glow
        let glowIntensity = 0;
        if (particle.musicReactiveMode === 'glow' || particle.speedScale > 3) {
            glowIntensity = Math.min(particle.speedScale / 6, 1); // Glow more when moving fast
        }
        
        if (particle.type === 'circle') {
            biomeCtx.fillStyle = particle.color;
            if (glowIntensity > 0.1 || particle.speedScale > 2) {
                biomeCtx.shadowBlur = 20 * Math.max(glowIntensity, particle.speedScale / 6);
                biomeCtx.shadowColor = particle.color;
            }
            biomeCtx.beginPath();
            biomeCtx.arc(0, 0, drawSize, 0, Math.PI * 2);
            biomeCtx.fill();
            biomeCtx.shadowBlur = 0;
        } else if (particle.type === 'rect') {
            biomeCtx.fillStyle = particle.color;
            if (glowIntensity > 0.1 || particle.speedScale > 2) {
                biomeCtx.shadowBlur = 18 * Math.max(glowIntensity, particle.speedScale / 6);
                biomeCtx.shadowColor = particle.color;
            }
            biomeCtx.fillRect(-drawSize/2, -drawSize/2, drawSize, drawSize);
            biomeCtx.shadowBlur = 0;
        } else if (particle.type === 'line') {
            biomeCtx.strokeStyle = particle.color;
            biomeCtx.lineWidth = particle.lineWidth || 2;
            if (glowIntensity > 0.3) {
                biomeCtx.shadowBlur = 10 * glowIntensity;
                biomeCtx.shadowColor = particle.color;
            }
            biomeCtx.beginPath();
            biomeCtx.moveTo(0, 0);
            biomeCtx.lineTo(0, drawSize);
            biomeCtx.stroke();
            biomeCtx.shadowBlur = 0;
        } else if (particle.type === 'star') {
            if (glowIntensity > 0.1 || particle.speedScale > 2) {
                biomeCtx.shadowBlur = 25 * Math.max(glowIntensity, particle.speedScale / 5);
                biomeCtx.shadowColor = particle.color;
            }
            drawStar(biomeCtx, 0, 0, 5, drawSize, drawSize/2, particle.color);
            biomeCtx.shadowBlur = 0;
        } else if (particle.type === 'snowflake') {
            if (particle.speedScale > 2) {
                biomeCtx.shadowBlur = 15 * (particle.speedScale / 6);
                biomeCtx.shadowColor = particle.color;
            }
            drawSnowflake(biomeCtx, 0, 0, drawSize, particle.color);
            biomeCtx.shadowBlur = 0;
        } else if (particle.type === 'raindrop') {
            drawRaindrop(biomeCtx, 0, 0, drawSize, particle.color);
        } else if (particle.type === 'ember') {
            drawEmber(biomeCtx, 0, 0, drawSize, particle.color, glowIntensity);
        } else if (particle.type === 'lightning') {
            drawLightning(biomeCtx, 0, 0, drawSize, particle.color, glowIntensity);
        } else if (particle.type === 'leaf') {
            if (particle.speedScale > 2) {
                biomeCtx.shadowBlur = 12 * (particle.speedScale / 6);
                biomeCtx.shadowColor = particle.color;
            }
            drawLeaf(biomeCtx, 0, 0, drawSize, particle.color);
            biomeCtx.shadowBlur = 0;
        } else if (particle.type === 'sand') {
            if (particle.speedScale > 2) {
                biomeCtx.shadowBlur = 10 * (particle.speedScale / 6);
                biomeCtx.shadowColor = particle.color;
            }
            drawSandParticle(biomeCtx, 0, 0, drawSize, particle.color);
            biomeCtx.shadowBlur = 0;
        } else if (particle.type === 'crystal') {
            drawCrystal(biomeCtx, 0, 0, drawSize, particle.color, glowIntensity);
        } else if (particle.type === 'void') {
            if (particle.speedScale > 2) {
                biomeCtx.shadowBlur = 15 * (particle.speedScale / 6);
                biomeCtx.shadowColor = particle.color;
            }
            drawVoidParticle(biomeCtx, 0, 0, drawSize, particle.color);
            biomeCtx.shadowBlur = 0;
        } else if (particle.type === 'glitch') {
            if (particle.speedScale > 2) {
                biomeCtx.shadowBlur = 18 * (particle.speedScale / 6);
                biomeCtx.shadowColor = '#00ffff';
            }
            drawGlitchParticle(biomeCtx, 0, 0, drawSize, particle.color);
            biomeCtx.shadowBlur = 0;
        }
        
        biomeCtx.restore();
    }
}

// Drawing functions for different particle types
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos((Math.PI * 2 * i / spikes) - Math.PI / 2 + Math.PI / spikes) * innerRadius,
                   cy + Math.sin((Math.PI * 2 * i / spikes) - Math.PI / 2 + Math.PI / spikes) * innerRadius);
        ctx.lineTo(cx + Math.cos((Math.PI * 2 * (i + 1) / spikes) - Math.PI / 2) * outerRadius,
                   cy + Math.sin((Math.PI * 2 * (i + 1) / spikes) - Math.PI / 2) * outerRadius);
    }
    ctx.closePath();
    ctx.fill();
}

function drawSnowflake(ctx, cx, cy, size, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    
    // Draw 6 branches
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i;
        const dx = Math.cos(angle) * size;
        const dy = Math.sin(angle) * size;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + dx, cy + dy);
        ctx.stroke();
        
        // Add small branches
        ctx.beginPath();
        ctx.moveTo(cx + dx * 0.6, cy + dy * 0.6);
        ctx.lineTo(cx + dx * 0.6 + Math.cos(angle + Math.PI/4) * size * 0.3,
                   cy + dy * 0.6 + Math.sin(angle + Math.PI/4) * size * 0.3);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(cx + dx * 0.6, cy + dy * 0.6);
        ctx.lineTo(cx + dx * 0.6 + Math.cos(angle - Math.PI/4) * size * 0.3,
                   cy + dy * 0.6 + Math.sin(angle - Math.PI/4) * size * 0.3);
        ctx.stroke();
    }
}

function drawRaindrop(ctx, cx, cy, length, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy + length);
    ctx.stroke();
}

function drawEmber(ctx, cx, cy, size, color, glowIntensity) {
    // Draw glowing ember with tail
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, color.replace(')', ', 0.6)').replace('rgb', 'rgba'));
    gradient.addColorStop(1, color.replace(')', ', 0)').replace('rgb', 'rgba'));
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Add tail
    ctx.strokeStyle = color.replace(')', ', 0.3)').replace('rgb', 'rgba');
    ctx.lineWidth = size * 0.3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - size * 0.5, cy + size * 2);
    ctx.stroke();
}

function drawLightning(ctx, cx, cy, length, color, glowIntensity) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 + glowIntensity * 2;
    ctx.lineCap = 'round';
    
    if (glowIntensity > 0.5) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
    }
    
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    
    // Jagged lightning bolt
    const segments = 3;
    for (let i = 1; i <= segments; i++) {
        const x = cx + (Math.random() - 0.5) * length * 0.3;
        const y = cy + (length / segments) * i;
        ctx.lineTo(x, y);
    }
    
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function drawLeaf(ctx, cx, cy, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(cx, cy, size * 0.6, size, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Add vein
    ctx.strokeStyle = color.replace(')', ', 0.5)').replace('rgb', 'rgba');
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.4, cy - size * 0.4);
    ctx.lineTo(cx + size * 0.4, cy + size * 0.4);
    ctx.stroke();
}

function drawSandParticle(ctx, cx, cy, size, color) {
    // Irregular sand grain
    ctx.fillStyle = color;
    ctx.beginPath();
    const sides = 5;
    for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 / sides) * i + Math.random() * 0.3;
        const radius = size * (0.7 + Math.random() * 0.3);
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
}

function drawCrystal(ctx, cx, cy, size, color, glowIntensity) {
    // Diamond shape
    ctx.fillStyle = color;
    if (glowIntensity > 0.3) {
        ctx.shadowBlur = 15 * glowIntensity;
        ctx.shadowColor = color;
    }
    
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx + size * 0.6, cy);
    ctx.lineTo(cx, cy + size);
    ctx.lineTo(cx - size * 0.6, cy);
    ctx.closePath();
    ctx.fill();
    
    // Add inner shine
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.3, cy - size * 0.5);
    ctx.lineTo(cx + size * 0.2, cy);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
}

function drawVoidParticle(ctx, cx, cy, size, color) {
    // Dark particle that absorbs light
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(0.7, color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, size, 0, Math.PI * 2);
    ctx.fill();
}

function drawGlitchParticle(ctx, cx, cy, size, color) {
    // Glitchy squares with offset
    const offset = Math.random() * 3 - 1.5;
    
    ctx.fillStyle = color;
    ctx.fillRect(cx - size/2 + offset, cy - size/2, size, size);
    
    // Add glitch lines
    if (Math.random() > 0.7) {
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(cx - size/2 - 2, cy - size/2 + size * 0.3, size + 4, 2);
    }
    if (Math.random() > 0.7) {
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(cx - size/2 + 2, cy - size/2 + size * 0.7, size - 4, 2);
    }
}

// =================================================================
// BIOME EFFECT DEFINITIONS
// =================================================================

const SIMPLE_BIOME_EFFECTS = {
    NORMAL: {
        particles: 100,
        type: 'circle',
        colors: ['#4ade80', '#10b981', '#34d399'],
        size: [3, 7],
        speed: [0.3, 0.8],
        alpha: [0.5, 0.8],
        bgColor: 'rgba(15, 30, 20, 0.92)',
        musicReactiveMode: 'mid'
    },
    WINDY: {
        particles: 80,
        type: 'line',
        colors: ['#a5f3fc', '#67e8f9', '#22d3ee'],
        size: [15, 30],
        speed: [2, 4],
        alpha: [0.5, 0.8],
        bgColor: 'rgba(20, 40, 50, 0.92)',
        musicReactiveMode: 'mid',
        lineWidth: 1.5
    },
    SNOWY: {
        particles: 100,
        type: 'snowflake',
        colors: ['#ffffff', '#e0f2fe', '#f0f9ff'],
        size: [4, 8],
        speed: [0.5, 1.5],
        alpha: [0.6, 0.9],
        bgColor: 'rgba(30, 40, 55, 0.92)',
        musicReactiveMode: 'treble'
    },
    BLIZZARD: {
        particles: 150,
        type: 'snowflake',
        colors: ['#ffffff', '#dbeafe'],
        size: [5, 10],
        speed: [1.5, 3],
        alpha: [0.7, 1],
        bgColor: 'rgba(35, 45, 60, 0.95)',
        musicReactiveMode: 'bass'
    },
    RAINY: {
        particles: 120,
        type: 'raindrop',
        colors: ['#7dd3fc', '#38bdf8', '#0ea5e9'],
        size: [20, 35],
        speed: [3, 6],
        alpha: [0.6, 0.8],
        bgColor: 'rgba(20, 35, 50, 0.92)',
        musicReactiveMode: 'bass',
        lineWidth: 2
    },
    MONSOON: {
        particles: 180,
        type: 'raindrop',
        colors: ['#1e40af', '#3b82f6'],
        size: [25, 40],
        speed: [4, 8],
        alpha: [0.7, 0.9],
        bgColor: 'rgba(15, 25, 40, 0.95)',
        musicReactiveMode: 'bass',
        lineWidth: 3
    },
    SANDSTORM: {
        particles: 140,
        type: 'sand',
        colors: ['#fbbf24', '#f59e0b', '#d97706'],
        size: [4, 9],
        speed: [1.5, 3.5],
        alpha: [0.5, 0.8],
        bgColor: 'rgba(50, 40, 20, 0.92)',
        musicReactiveMode: 'bass'
    },
    JUNGLE: {
        particles: 110,
        type: 'leaf',
        colors: ['#22c55e', '#16a34a', '#15803d'],
        size: [5, 10],
        speed: [0.4, 1.2],
        alpha: [0.6, 0.9],
        bgColor: 'rgba(10, 35, 20, 0.92)',
        musicReactiveMode: 'bass'
    },
    AMAZON: {
        particles: 130,
        type: 'leaf',
        colors: ['#059669', '#10b981', '#34d399'],
        size: [6, 12],
        speed: [0.5, 1.5],
        alpha: [0.6, 0.9],
        bgColor: 'rgba(5, 30, 15, 0.92)',
        musicReactiveMode: 'bass'
    },
    CRIMSON: {
        particles: 120,
        type: 'circle',
        colors: ['#ef4444', '#dc2626', '#dc143c'],
        size: [4, 9],
        speed: [0.6, 1.5],
        alpha: [0.7, 1],
        bgColor: 'rgba(50, 10, 10, 0.92)',
        musicReactiveMode: 'bass'
    },
    STARFALL: {
        particles: 80,
        type: 'star',
        colors: ['#fcd34d', '#fbbf24', '#ffffff'],
        size: [5, 10],
        speed: [1, 2.5],
        alpha: [0.8, 1],
        bgColor: 'rgba(15, 15, 35, 0.92)',
        musicReactiveMode: 'glow'
    },
    METEOR_SHOWER: {
        particles: 40,
        type: 'line',
        colors: ['#f59e0b', '#d97706', '#ff6347'],
        size: [25, 45],
        speed: [4, 7],
        alpha: [0.8, 1],
        bgColor: 'rgba(25, 15, 10, 0.92)',
        musicReactiveMode: 'glow',
        lineWidth: 3
    },
    HELL: {
        particles: 120,
        type: 'ember',
        colors: ['#ef4444', '#ff4444', '#ff6347'],
        size: [5, 12],
        speed: [0.6, 2],
        alpha: [0.7, 1],
        bgColor: 'rgba(40, 10, 5, 0.92)',
        musicReactiveMode: 'glow'
    },
    TORNADO: {
        particles: 100,
        type: 'line',
        colors: ['#94a3b8', '#64748b', '#475569'],
        size: [10, 20],
        speed: [1.5, 3],
        alpha: [0.5, 0.8],
        bgColor: 'rgba(30, 35, 40, 0.92)',
        musicReactiveMode: 'bass',
        lineWidth: 2
    },
    DUNES: {
        particles: 70,
        type: 'sand',
        colors: ['#fbbf24', '#f59e0b', '#d97706'],
        size: [3, 6],
        speed: [0.8, 1.5],
        alpha: [0.3, 0.5],
        bgColor: 'rgba(45, 35, 15, 0.92)',
        musicReactiveMode: 'mid'
    },
    VOLCANO: {
        particles: 60,
        type: 'ember',
        colors: ['#ff4500', '#ff6347', '#ffa500'],
        size: [5, 12],
        speed: [0.5, 1.5],
        alpha: [0.7, 1],
        bgColor: 'rgba(40, 15, 5, 0.92)',
        musicReactiveMode: 'pulse'
    },
    VOID: {
        particles: 60,
        type: 'void',
        colors: ['#1e1b4b', '#312e81', '#4c1d95'],
        size: [4, 8],
        speed: [0.3, 0.8],
        alpha: [0.4, 0.7],
        bgColor: 'rgba(5, 5, 15, 0.95)',
        musicReactiveMode: 'mid'
    },
    SKY: {
        particles: 50,
        type: 'circle',
        colors: ['#87CEEB', '#4FC3F7', '#ffffff'],
        size: [5, 12],
        speed: [0.2, 0.6],
        alpha: [0.3, 0.6],
        bgColor: 'rgba(50, 70, 100, 0.92)',
        musicReactiveMode: 'treble'
    },
    CHARGED: {
        particles: 70,
        type: 'lightning',
        colors: ['#fbbf24', '#eab308', '#facc15'],
        size: [15, 25],
        speed: [0.8, 2],
        alpha: [0.7, 1],
        bgColor: 'rgba(30, 30, 10, 0.92)',
        musicReactiveMode: 'glow'
    },
    BIOLUMINESCENT: {
        particles: 80,
        type: 'circle',
        colors: ['#00FFFF', '#00CED1', '#7FFFD4'],
        size: [3, 7],
        speed: [0.4, 1],
        alpha: [0.7, 1],
        bgColor: 'rgba(0, 20, 25, 0.92)',
        musicReactiveMode: 'glow'
    },
    ANCIENT: {
        particles: 60,
        type: 'rect',
        colors: ['#C2B280', '#D4AF37', '#8B7355'],
        size: [3, 6],
        speed: [0.3, 0.7],
        alpha: [0.5, 0.8],
        bgColor: 'rgba(35, 30, 20, 0.92)',
        musicReactiveMode: 'mid'
    },
    HALLOW: {
        particles: 80,
        type: 'crystal',
        colors: ['#FF69B4', '#FF1493', '#00CED1'],
        size: [5, 10],
        speed: [0.6, 1.3],
        alpha: [0.6, 0.9],
        bgColor: 'rgba(40, 20, 45, 0.92)',
        musicReactiveMode: 'glow'
    },
    CORRUPTION: {
        particles: 70,
        type: 'circle',
        colors: ['#a855f7', '#9333ea', '#7e22ce'],
        size: [3, 7],
        speed: [0.5, 1.2],
        alpha: [0.6, 0.9],
        bgColor: 'rgba(25, 10, 35, 0.92)',
        musicReactiveMode: 'pulse'
    },
    NULL: {
        particles: 50,
        type: 'void',
        colors: ['#1f1f1f', '#404040', '#0a0a0a'],
        size: [4, 9],
        speed: [0.4, 1],
        alpha: [0.5, 0.8],
        bgColor: 'rgba(3, 3, 3, 0.98)',
        musicReactiveMode: 'mid'
    },
    GLITCHED: {
        particles: 60,
        type: 'glitch',
        colors: ['#22d3ee', '#06b6d4', '#0891b2'],
        size: [5, 12],
        speed: [0.8, 2],
        alpha: [0.6, 0.9],
        bgColor: 'rgba(5, 15, 20, 0.92)',
        musicReactiveMode: 'pulse'
    },
    DREAMSPACE: {
        particles: 90,
        type: 'star',
        colors: ['#ec4899', '#db2777', '#a855f7', '#8b5cf6'],
        size: [3, 8],
        speed: [0.4, 1.2],
        alpha: [0.6, 0.9],
        bgColor: 'rgba(30, 10, 25, 0.92)',
        musicReactiveMode: 'glow'
    },
    GRAVEYARD: {
        particles: 70,
        type: 'circle',
        colors: ['#6b7280', '#4b5563', '#9ca3af'],
        size: [4, 10],
        speed: [0.2, 0.6],
        alpha: [0.3, 0.6],
        bgColor: 'rgba(20, 20, 25, 0.92)',
        musicReactiveMode: 'mid'
    },
    PUMPKIN_MOON: {
        particles: 70,
        type: 'circle',
        colors: ['#ff8c00', '#ff6600', '#ff4500'],
        size: [3, 7],
        speed: [0.5, 1.2],
        alpha: [0.7, 0.9],
        bgColor: 'rgba(35, 20, 5, 0.92)',
        musicReactiveMode: 'pulse'
    },
    BLOOD_RAIN: {
        particles: 130,
        type: 'raindrop',
        colors: ['#8b0000', '#dc143c', '#a00000'],
        size: [20, 35],
        speed: [3, 6],
        alpha: [0.6, 0.8],
        bgColor: 'rgba(30, 5, 5, 0.92)',
        musicReactiveMode: 'bass',
        lineWidth: 3
    }
};

// Spawn a single particle based on current biome and music
function spawnMusicParticle() {
    if (!currentBiomeEffect || !biomeCanvas) return;
    
    const config = currentBiomeEffect;
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    const size = config.size[0] + Math.random() * (config.size[1] - config.size[0]);
    const speed = config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]);
    const alpha = config.alpha[0] + Math.random() * (config.alpha[1] - config.alpha[0]);
    
    // Determine velocity based on particle type
    let vx, vy;
    if (config.type === 'line' || config.type === 'raindrop') {
        // Rain/lines fall straight down with slight drift
        vx = (Math.random() - 0.5) * 0.5;
        vy = speed;
    } else if (config.type === 'lightning') {
        // Lightning bolts move vertically
        vx = (Math.random() - 0.5) * 0.3;
        vy = speed * 0.5;
    } else if (config.type === 'ember') {
        // Embers rise up
        vx = (Math.random() - 0.5) * speed * 0.3;
        vy = -speed * 0.5; // Negative = upward
    } else if (config.type === 'snowflake') {
        // Snowflakes drift and fall
        vx = (Math.random() - 0.5) * speed * 0.4;
        vy = speed * 0.6;
    } else if (config.type === 'leaf') {
        // Leaves flutter down
        vx = (Math.random() - 0.5) * speed;
        vy = speed * 0.4;
    } else {
        // Default: random movement
        vx = (Math.random() - 0.5) * speed;
        vy = (Math.random() - 0.5) * speed;
    }
    
    // Spawn from edges based on particle type
    let x, y;
    if (config.type === 'raindrop' || config.type === 'snowflake' || config.type === 'leaf' || config.type === 'lightning') {
        // Spawn from top
        x = Math.random() * biomeCanvas.width;
        y = -50;
    } else if (config.type === 'ember') {
        // Spawn from bottom
        x = Math.random() * biomeCanvas.width;
        y = biomeCanvas.height + 50;
    } else {
        // Spawn from random edge
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
            case 0: // top
                x = Math.random() * biomeCanvas.width;
                y = -50;
                break;
            case 1: // right
                x = biomeCanvas.width + 50;
                y = Math.random() * biomeCanvas.height;
                break;
            case 2: // bottom
                x = Math.random() * biomeCanvas.width;
                y = biomeCanvas.height + 50;
                break;
            case 3: // left
                x = -50;
                y = Math.random() * biomeCanvas.height;
                break;
        }
    }
    
    biomeParticles.push({
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        size: size,
        color: color,
        alpha: 0, // Start invisible
        targetAlpha: alpha, // Fade to this
        fadingIn: true, // Flag for fade in
        type: config.type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        life: 0, // Track particle age
        maxLife: 300 + Math.random() * 200, // Particles live 300-500 frames
        musicReactive: true,
        musicReactiveMode: config.musicReactiveMode || 'mid',
        lineWidth: config.lineWidth || 2
    });
}

// Create particles for a biome
function createBiomeParticles(biomeName) {
    clearBiomeParticles(); // Fade out old particles
    
    const config = SIMPLE_BIOME_EFFECTS[biomeName.toUpperCase().replace(' ', '_')] || SIMPLE_BIOME_EFFECTS.NORMAL;
    currentBiomeEffect = config; // Store config for background color
    
    // Set target background color for smooth transition
    targetBgColor = config.bgColor || 'rgba(10, 15, 26, 0.95)';
    
    // Reset beat detection for new biome
    beatDetectionHistory = [];
    beatIntensity = 0;
    window.biomeParticlesStartTime = Date.now();
    
    // Try to connect to audio (will retry if not ready yet)
    connectBiomeAudio();
    
    // Multiple retry attempts with increasing delays
    const retryDelays = [500, 1000, 2000, 3000];
    retryDelays.forEach(delay => {
        setTimeout(() => {
            if (!biomeAudioAnalyzer) {
                console.log(`🔄 Retrying audio connection (${delay}ms)...`);
                connectBiomeAudio();
            }
        }, delay);
    });
    
    for (let i = 0; i < config.particles; i++) {
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        const size = config.size[0] + Math.random() * (config.size[1] - config.size[0]);
        const speed = config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]);
        const alpha = config.alpha[0] + Math.random() * (config.alpha[1] - config.alpha[0]);
        
        // Determine velocity based on particle type
        let vx, vy;
        if (config.type === 'line' || config.type === 'raindrop') {
            // Rain/lines fall straight down with slight drift
            vx = (Math.random() - 0.5) * 0.5;
            vy = speed;
        } else if (config.type === 'lightning') {
            // Lightning bolts move vertically
            vx = (Math.random() - 0.5) * 0.3;
            vy = speed * 0.5;
        } else if (config.type === 'ember') {
            // Embers rise up
            vx = (Math.random() - 0.5) * speed * 0.3;
            vy = -speed * 0.5; // Negative = upward
        } else if (config.type === 'snowflake') {
            // Snowflakes drift and fall
            vx = (Math.random() - 0.5) * speed * 0.4;
            vy = speed * 0.6;
        } else if (config.type === 'leaf') {
            // Leaves flutter down
            vx = (Math.random() - 0.5) * speed;
            vy = speed * 0.4;
        } else {
            // Default: random movement
            vx = (Math.random() - 0.5) * speed;
            vy = (Math.random() - 0.5) * speed;
        }
        
        biomeParticles.push({
            x: Math.random() * biomeCanvas.width,
            y: Math.random() * biomeCanvas.height,
            vx: vx,
            vy: vy,
            size: size,
            color: color,
            alpha: 0, // Start invisible
            targetAlpha: alpha, // Fade to this
            fadingIn: true, // Flag for fade in
            type: config.type,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.05,
            life: undefined,
            maxLife: 100,
            musicReactive: true, // All particles now react to music
            musicReactiveMode: config.musicReactiveMode || 'mid',
            lineWidth: config.lineWidth || 2
        });
    }
    
    // Only start animation if not already running
    if (!biomeAnimationFrame) {
        animateSimpleBiomeEffect();
    }
    console.log(`🎨 Created ${config.particles} particles for ${biomeName}`);
}

// Main update function (called by biomes.js)
function updateSimpleBiomeEffect(biomeName) {
    if (!biomeCanvas) {
        initSimpleBiomeEffects();
    }
    createBiomeParticles(biomeName);
}

// Make globally accessible
window.updateSimpleBiomeEffect = updateSimpleBiomeEffect;
window.initSimpleBiomeEffects = initSimpleBiomeEffects;
window.connectBiomeAudio = connectBiomeAudio; // Expose for biomes.js to call

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimpleBiomeEffects);
} else {
    initSimpleBiomeEffects();
}
