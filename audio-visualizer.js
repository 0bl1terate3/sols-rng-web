// =================================================================
// Audio Visualizer System - Cool Visual Effects for Biomes
// =================================================================

let visualizerCanvas = null;
let visualizerCtx = null;
let visualizerAnimationFrame = null;
let currentVisualizerType = 'bars';
let visualizerAudioContext = null;
let visualizerAudioAnalyzer = null;
let visualizerAudioDataArray = null;
let visualizerFrequencyData = null;
let targetBgColor = 'rgba(10, 15, 26, 0.95)';
let currentBgColor = 'rgba(10, 15, 26, 0.95)';
let bgTransitionSpeed = 0.05;
let visualizerColors = ['#3b82f6', '#8b5cf6', '#ec4899'];
let visualizerConfig = {};
let connectedAudioElement = null; // Track which audio element we're connected to

// Beat detection
let beatHistory = [];
let beatHistorySize = 30;
let beatThreshold = 1.35;
let lastBeatTime = 0;
let beatCooldown = 200;
let isBeat = false;
let beatIntensity = 0;
let beatDecay = 0.85;

// Animation state
let animationTime = 0;
let particles3D = [];

// Helper function to interpolate colors
function lerpColor(color1, color2, t) {
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

// Connect to audio
function connectVisualizerAudio() {
    try {
        let audioElement = document.getElementById('biomeMusic');
        
        if (!audioElement) {
            const audios = document.querySelectorAll('audio');
            for (const audio of audios) {
                if (audio.src && audio.src.includes('.mp3')) {
                    audioElement = audio;
                    audioElement.id = 'biomeMusic';
                    break;
                }
            }
        }
        
        if (!audioElement || !audioElement.src) {
            console.log('⚠️ No audio element found for visualizer');
            return;
        }
        
        // Check if we're already connected to this exact audio element
        if (connectedAudioElement === audioElement && window.visualizerAudioSourceNode) {
            console.log('✅ Already connected to current audio element');
            // Just resume if suspended
            if (visualizerAudioContext && visualizerAudioContext.state === 'suspended') {
                visualizerAudioContext.resume();
            }
            return;
        }
        
        if (!visualizerAudioContext) {
            visualizerAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (visualizerAudioContext.state === 'suspended') {
            visualizerAudioContext.resume().then(() => {
                console.log('🎵 AudioContext resumed in connectVisualizerAudio');
            }).catch(e => {
                console.warn('⚠️ Could not resume AudioContext:', e);
            });
        }
        
        // Create or recreate analyzer
        if (!visualizerAudioAnalyzer) {
            visualizerAudioAnalyzer = visualizerAudioContext.createAnalyser();
            visualizerAudioAnalyzer.fftSize = 512; // Higher resolution
            visualizerAudioAnalyzer.smoothingTimeConstant = 0.3; // Lower = more responsive to music changes
            visualizerAudioDataArray = new Uint8Array(visualizerAudioAnalyzer.frequencyBinCount);
            visualizerFrequencyData = new Uint8Array(visualizerAudioAnalyzer.frequencyBinCount);
        }
        
        // Only create new source if audio element changed
        if (connectedAudioElement !== audioElement) {
            // Disconnect old source if it exists
            if (window.visualizerAudioSourceNode) {
                try {
                    window.visualizerAudioSourceNode.disconnect();
                    console.log('🔌 Disconnected old audio source');
                } catch (e) {
                    // Already disconnected
                }
            }
            
            // Create new source for new audio element
            try {
                window.visualizerAudioSourceNode = visualizerAudioContext.createMediaElementSource(audioElement);
                window.visualizerAudioSourceNode.connect(visualizerAudioAnalyzer);
                visualizerAudioAnalyzer.connect(visualizerAudioContext.destination);
                connectedAudioElement = audioElement; // Track the connected element
                
                console.log('🎵 Visualizer audio connected!');
                console.log('   Audio element:', audioElement);
                console.log('   Audio playing:', !audioElement.paused);
                console.log('   Audio src:', audioElement.src);
            } catch (e) {
                console.error('❌ Failed to create audio source:', e);
            }
        }
    } catch (e) {
        console.error('❌ Visualizer audio connection failed:', e);
    }
}

// Initialize canvas
function initAudioVisualizer() {
    if (visualizerCanvas) return;
    
    visualizerCanvas = document.createElement('canvas');
    visualizerCanvas.id = 'audioVisualizerCanvas';
    visualizerCanvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        margin: 0;
        padding: 0;
        z-index: -1;
        pointer-events: none;
    `;
    visualizerCanvas.width = window.innerWidth;
    visualizerCanvas.height = window.innerHeight;
    document.body.insertBefore(visualizerCanvas, document.body.firstChild);
    visualizerCtx = visualizerCanvas.getContext('2d');
    
    window.addEventListener('resize', () => {
        visualizerCanvas.width = window.innerWidth;
        visualizerCanvas.height = window.innerHeight;
    });
    
    document.addEventListener('click', () => {
        if (!visualizerAudioAnalyzer) {
            connectVisualizerAudio();
        }
        if (visualizerAudioContext && visualizerAudioContext.state === 'suspended') {
            visualizerAudioContext.resume().then(() => {
                console.log('🎵 AudioContext resumed');
            });
        }
    }); // Removed 'once' - allow multiple clicks to resume
    
    console.log('✅ Audio visualizer initialized');
}

// Visualizer: 3D Perspective Bars
function drawFrequencyBars(ctx, dataArray, width, height, colors) {
    const barCount = 32; // Reduced from 64 for performance
    const centerX = width / 2;
    const step = Math.floor(dataArray.length / barCount);
    const perspective = 0.6; // 3D depth effect
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    
    for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step] / 255;
        const barHeight = value * height * 1.2 * (1 + avgIntensity * 3); // Much more dramatic with music
        
        // Calculate 3D position
        const normalizedPos = (i / barCount) - 0.5; // -0.5 to 0.5
        const depth = Math.abs(normalizedPos) * perspective;
        const scale = 1 - depth;
        
        const barWidth = (width / barCount) * scale;
        const x = centerX + (normalizedPos * width * 0.9);
        const y = height - barHeight * scale;
        
        // Multi-color gradient
        const gradient = ctx.createLinearGradient(x, y, x, height);
        const colorIndex = Math.floor((i / barCount) * colors.length);
        const color1 = colors[colorIndex % colors.length];
        const color2 = colors[(colorIndex + 1) % colors.length];
        gradient.addColorStop(0, color1);
        gradient.addColorStop(0.5, color2);
        gradient.addColorStop(1, color1);
        
        // Draw bar with perspective
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.8 + (scale * 0.2);
        ctx.fillRect(x - barWidth/2, y, barWidth - 1, barHeight * scale);
        
        // Reflection effect
        const reflectionGradient = ctx.createLinearGradient(x, height, x, height + 50);
        reflectionGradient.addColorStop(0, color1.replace(')', ', 0.3)').replace('rgb', 'rgba'));
        reflectionGradient.addColorStop(1, color1.replace(')', ', 0)').replace('rgb', 'rgba'));
        ctx.fillStyle = reflectionGradient;
        ctx.fillRect(x - barWidth/2, height, barWidth - 1, 50);
        
        // Glow on peaks
        if (value > 0.6) {
            ctx.shadowBlur = 25 * value * scale;
            ctx.shadowColor = color1;
            ctx.fillRect(x - barWidth/2, y, barWidth - 1, barHeight * scale);
            ctx.shadowBlur = 0;
        }
    }
    ctx.globalAlpha = 1;
}

// Visualizer: Spiral Galaxy
function drawCircularSpectrum(ctx, dataArray, width, height, colors) {
    const centerX = width / 2;
    const centerY = height / 2;
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    const maxRadius = Math.min(width, height) * (0.3 + avgIntensity * 0.8); // Pulse dramatically with music
    const barCount = 64; // Reduced from 128 for performance
    const step = Math.floor(dataArray.length / barCount);
    const spiralTurns = 3;
    
    // Draw multiple spiral arms
    const arms = 3;
    for (let arm = 0; arm < arms; arm++) {
        const armOffset = (arm / arms) * Math.PI * 2;
        
        for (let i = 0; i < barCount; i++) {
            const value = dataArray[i * step] / 255;
            const progress = i / barCount;
            const angle = progress * Math.PI * 2 * spiralTurns + armOffset + avgIntensity * Math.PI * 4;
            const radius = progress * maxRadius;
            const barLength = value * 80 * (1 + avgIntensity * 3); // Much more dramatic with music
            
            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + barLength);
            const y2 = centerY + Math.sin(angle) * (radius + barLength);
            
            const colorIndex = Math.floor(progress * colors.length);
            const color = colors[colorIndex % colors.length];
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 2 + value * 3;
            ctx.lineCap = 'round';
            ctx.globalAlpha = 0.6 + value * 0.4;
            
            if (value > 0.5) {
                ctx.shadowBlur = 20 * value;
                ctx.shadowColor = color;
            }
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }
    
    // Draw pulsing rings
    for (let ring = 0; ring < 5; ring++) {
        const ringRadius = maxRadius * (0.2 + ring * 0.2);
        const ringIntensity = dataArray[ring * 20] / 255;
        
        ctx.strokeStyle = colors[ring % colors.length];
        ctx.lineWidth = 2 + ringIntensity * 4;
        ctx.globalAlpha = 0.3 + ringIntensity * 0.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Draw energy particles orbiting
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + avgIntensity * Math.PI * 4;
        const orbitRadius = maxRadius * 0.6;
        const intensity = dataArray[i * 10] / 255;
        const size = 3 + intensity * 8;
        
        const x = centerX + Math.cos(angle) * orbitRadius;
        const y = centerY + Math.sin(angle) * orbitRadius;
        
        const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        particleGradient.addColorStop(0, colors[i % colors.length]);
        particleGradient.addColorStop(1, colors[i % colors.length].replace(')', ', 0)').replace('rgb', 'rgba'));
        
        ctx.fillStyle = particleGradient;
        ctx.globalAlpha = 0.8 + intensity * 0.2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw glowing center
    ctx.globalAlpha = 1;
    const centerSize = 30 + avgIntensity * 40;
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, centerSize);
    centerGradient.addColorStop(0, colors[0]);
    centerGradient.addColorStop(0.5, colors[1 % colors.length]);
    centerGradient.addColorStop(1, colors[0].replace(')', ', 0)').replace('rgb', 'rgba'));
    ctx.fillStyle = centerGradient;
    ctx.shadowBlur = 40 * avgIntensity;
    ctx.shadowColor = colors[0];
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

// Visualizer: Liquid Waveform with Particles
function drawWaveform(ctx, dataArray, width, height, colors) {
    const sliceWidth = width / dataArray.length;
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    const centerY = height / 2;
    
    // Draw filled waveform area
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    colors.forEach((color, i) => {
        gradient.addColorStop(i / (colors.length - 1), color);
    });
    
    // Top wave
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 255;
        const x = i * sliceWidth;
        const y = centerY - (v * height * (0.35 + avgIntensity * 0.5)); // Much bigger waves with music
        
        if (i === 0) {
            ctx.lineTo(x, y);
        } else {
            // Smooth curves
            const prevX = (i - 1) * sliceWidth;
            const prevV = dataArray[i - 1] / 255;
            const prevY = centerY - (prevV * height * 0.35);
            const cpX = (prevX + x) / 2;
            ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
            ctx.lineTo(x, y);
        }
    }
    ctx.lineTo(width, centerY);
    ctx.closePath();
    
    const fillGradient = ctx.createLinearGradient(0, 0, 0, height);
    fillGradient.addColorStop(0, colors[0].replace(')', ', 0.3)').replace('rgb', 'rgba'));
    fillGradient.addColorStop(1, colors[0].replace(')', ', 0.05)').replace('rgb', 'rgba'));
    ctx.fillStyle = fillGradient;
    ctx.fill();
    
    // Outline
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Bottom wave (mirror)
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 255;
        const x = i * sliceWidth;
        const y = centerY + (v * height * 0.35);
        
        if (i === 0) {
            ctx.lineTo(x, y);
        } else {
            const prevX = (i - 1) * sliceWidth;
            const prevV = dataArray[i - 1] / 255;
            const prevY = centerY + (prevV * height * 0.35);
            const cpX = (prevX + x) / 2;
            ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
            ctx.lineTo(x, y);
        }
    }
    ctx.lineTo(width, centerY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Add glowing particles at peaks
    for (let i = 0; i < dataArray.length; i += 8) {
        const v = dataArray[i] / 255;
        if (v > 0.6) {
            const x = i * sliceWidth;
            const y = centerY - (v * height * 0.35);
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = colors[i % colors.length];
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.arc(x, y, 3 + v * 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
}

// Visualizer: DNA Helix / Double Spiral
function drawRadialWaveform(ctx, dataArray, width, height, colors) {
    const centerX = width / 2;
    const centerY = height / 2;
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    const baseRadius = Math.min(width, height) * (0.15 + avgIntensity * 0.3); // Pulse dramatically with music
    const layers = 3;
    
    for (let layer = 0; layer < layers; layer++) {
        const layerRadius = baseRadius * (1 + layer * 0.5);
        const rotation = avgIntensity * Math.PI * 8 + layer * Math.PI / 3; // Rotation entirely controlled by music
        
        // First strand
        ctx.beginPath();
        for (let i = 0; i < dataArray.length; i++) {
            const value = dataArray[i] / 255;
            const angle = (i / dataArray.length) * Math.PI * 2 + rotation;
            const radius = layerRadius + (value * layerRadius * 1.2); // More reactive
            const wave = Math.sin(angle * 3) * (20 + avgIntensity * 60); // Much bigger waves with music
            
            const x = centerX + Math.cos(angle) * (radius + wave);
            const y = centerY + Math.sin(angle) * (radius + wave);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        
        const color = colors[layer % colors.length];
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.7;
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.stroke();
        
        // Second strand (opposite phase)
        ctx.beginPath();
        for (let i = 0; i < dataArray.length; i++) {
            const value = dataArray[i] / 255;
            const angle = (i / dataArray.length) * Math.PI * 2 + rotation + Math.PI;
            const radius = layerRadius + (value * layerRadius * 0.8);
            const wave = Math.sin(angle * 3) * 20;
            
            const x = centerX + Math.cos(angle) * (radius + wave);
            const y = centerY + Math.sin(angle) * (radius + wave);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        
        const color2 = colors[(layer + 1) % colors.length];
        ctx.strokeStyle = color2;
        ctx.shadowColor = color2;
        ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
}

// Visualizer: Connected Particle Web
function drawParticleField(ctx, dataArray, width, height, colors) {
    const targetParticleCount = 40; // Reduced for performance
    const connectionDistance = 150;
    
    // Create/update particles
    while (particles3D.length < targetParticleCount) {
        particles3D.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            size: Math.random() * 2 + 2,
            colorIndex: Math.floor(Math.random() * colors.length),
            frequencyIndex: Math.floor(Math.random() * dataArray.length)
        });
    }
    
    // Update particles
    for (let i = 0; i < particles3D.length; i++) {
        const p = particles3D[i];
        const intensity = dataArray[p.frequencyIndex] / 255;
        
        // Move with music intensity
        p.x += p.vx * (0.5 + intensity * 2);
        p.y += p.vy * (0.5 + intensity * 2);
        
        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
    }
    
    // Draw connections between nearby particles
    for (let i = 0; i < particles3D.length; i++) {
        for (let j = i + 1; j < particles3D.length; j++) {
            const p1 = particles3D[i];
            const p2 = particles3D[j];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < connectionDistance) {
                const intensity1 = dataArray[p1.frequencyIndex] / 255;
                const intensity2 = dataArray[p2.frequencyIndex] / 255;
                const avgIntensity = (intensity1 + intensity2) / 2;
                const opacity = (1 - distance / connectionDistance) * 0.5 * (0.3 + avgIntensity * 0.7);
                
                ctx.strokeStyle = colors[p1.colorIndex];
                ctx.globalAlpha = opacity;
                ctx.lineWidth = 1 + avgIntensity * 2;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }
    
    // Draw particles
    for (let i = 0; i < particles3D.length; i++) {
        const p = particles3D[i];
        const intensity = dataArray[p.frequencyIndex] / 255;
        const size = p.size * (1 + intensity * 1.5);
        
        ctx.fillStyle = colors[p.colorIndex];
        ctx.globalAlpha = 0.7 + intensity * 0.3;
        
        if (intensity > 0.6) {
            ctx.shadowBlur = 20 * intensity;
            ctx.shadowColor = colors[p.colorIndex];
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    ctx.globalAlpha = 1;
}

// Visualizer: Geometric Mandala
function drawKaleidoscope(ctx, dataArray, width, height, colors) {
    const centerX = width / 2;
    const centerY = height / 2;
    const segments = 12;
    const maxRadius = Math.min(width, height) * 0.45;
    const rotation = animationTime * 0.005;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    
    // Draw multiple layers
    for (let layer = 0; layer < 3; layer++) {
        const layerRotation = layer * Math.PI / 6;
        
        for (let seg = 0; seg < segments; seg++) {
            ctx.save();
            ctx.rotate((seg / segments) * Math.PI * 2 + layerRotation);
            
            // Draw frequency-reactive shapes
            for (let i = 0; i < 24; i++) {
                const value = dataArray[i * 8] / 255;
                const distance = (i / 24) * maxRadius;
                const size = 5 + value * 25;
                const angle = (i / 24) * Math.PI * 0.5;
                
                const x = distance * Math.cos(angle);
                const y = distance * Math.sin(angle);
                
                const colorIndex = Math.floor((i / 24) * colors.length);
                const color = colors[colorIndex % colors.length];
                
                // Draw geometric shapes
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.4 + value * 0.6;
                
                if (value > 0.5) {
                    ctx.shadowBlur = 15 * value;
                    ctx.shadowColor = color;
                }
                
                // Alternate between circles and polygons
                if (i % 2 === 0) {
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Draw triangle
                    ctx.beginPath();
                    for (let v = 0; v < 3; v++) {
                        const vAngle = (v / 3) * Math.PI * 2 + rotation * 2;
                        const vx = x + Math.cos(vAngle) * size;
                        const vy = y + Math.sin(vAngle) * size;
                        if (v === 0) ctx.moveTo(vx, vy);
                        else ctx.lineTo(vx, vy);
                    }
                    ctx.closePath();
                    ctx.fill();
                }
                
                ctx.shadowBlur = 0;
                
                // Draw connecting lines
                if (i > 0 && value > 0.3) {
                    const prevValue = dataArray[(i - 1) * 8] / 255;
                    const prevDistance = ((i - 1) / 24) * maxRadius;
                    const prevAngle = ((i - 1) / 24) * Math.PI * 0.5;
                    const prevX = prevDistance * Math.cos(prevAngle);
                    const prevY = prevDistance * Math.sin(prevAngle);
                    
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1 + value * 2;
                    ctx.globalAlpha = 0.3 + value * 0.4;
                    ctx.beginPath();
                    ctx.moveTo(prevX, prevY);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            }
            
            ctx.restore();
        }
    }
    
    // Draw center ornament
    ctx.globalAlpha = 1;
    const centerSize = 20 + (dataArray[0] / 255) * 20;
    const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, centerSize);
    centerGradient.addColorStop(0, colors[0]);
    centerGradient.addColorStop(0.5, colors[1 % colors.length]);
    centerGradient.addColorStop(1, colors[0].replace(')', ', 0)').replace('rgb', 'rgba'));
    ctx.fillStyle = centerGradient;
    ctx.beginPath();
    ctx.arc(0, 0, centerSize, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    ctx.globalAlpha = 1;
}

// Visualizer: Falling Rain
function drawRainVisualizer(ctx, dataArray, width, height, colors) {
    const dropCount = 60; // Reduced for performance
    
    if (!window.rainDrops) window.rainDrops = [];
    
    // Create drops - entirely controlled by music intensity
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    if (window.rainDrops.length < dropCount && Math.random() < avgIntensity * 3) {
        window.rainDrops.push({
            x: Math.random() * width,
            y: -20,
            speed: 5 + Math.random() * 10 + avgIntensity * 15,
            length: 10 + Math.random() * 20 + avgIntensity * 30,
            opacity: 0.3 + Math.random() * 0.5,
            colorIndex: Math.floor(Math.random() * colors.length)
        });
    }
    
    // Update and draw drops
    for (let i = window.rainDrops.length - 1; i >= 0; i--) {
        const drop = window.rainDrops[i];
        drop.y += drop.speed * avgIntensity * 5; // Speed entirely controlled by music
        
        if (drop.y > height + 50) {
            window.rainDrops.splice(i, 1);
            continue;
        }
        
        ctx.strokeStyle = colors[drop.colorIndex];
        ctx.globalAlpha = drop.opacity;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 2, drop.y + drop.length);
        ctx.stroke();
        
        // Splash effect at bottom
        if (drop.y > height - 50 && drop.y < height) {
            const splashRadius = Math.abs(height - drop.y) * 0.5;
            if (splashRadius > 0) {
                ctx.globalAlpha = drop.opacity * 0.5;
                ctx.beginPath();
                ctx.arc(drop.x, height, splashRadius, 0, Math.PI, true);
                ctx.stroke();
            }
        }
    }
    ctx.globalAlpha = 1;
}

// Visualizer: Snowfall
function drawSnowVisualizer(ctx, dataArray, width, height, colors) {
    if (!window.snowflakes) window.snowflakes = [];
    
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    
    // Spawn snowflakes - entirely controlled by music
    if (window.snowflakes.length < 80 && Math.random() < avgIntensity * 2) {
        window.snowflakes.push({
            x: Math.random() * width,
            y: -10,
            vx: (Math.random() - 0.5) * 2,
            vy: 1 + Math.random() * 2,
            size: 2 + Math.random() * 4,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            opacity: 0.5 + Math.random() * 0.5,
            colorIndex: Math.floor(Math.random() * colors.length)
        });
    }
    
    // Update and draw
    for (let i = window.snowflakes.length - 1; i >= 0; i--) {
        const flake = window.snowflakes[i];
        flake.x += flake.vx * avgIntensity * 5;
        flake.y += flake.vy * avgIntensity * 10; // Speed entirely controlled by music
        flake.rotation += flake.rotationSpeed;
        
        if (flake.y > height + 10) {
            window.snowflakes.splice(i, 1);
            continue;
        }
        
        ctx.save();
        ctx.translate(flake.x, flake.y);
        ctx.rotate(flake.rotation);
        ctx.strokeStyle = colors[flake.colorIndex];
        ctx.globalAlpha = flake.opacity;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        
        // Draw snowflake
        for (let j = 0; j < 6; j++) {
            ctx.rotate(Math.PI / 3);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, flake.size);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    ctx.globalAlpha = 1;
}

// Visualizer: Lightning Storm
function drawLightningVisualizer(ctx, dataArray, width, height, colors) {
    if (!window.lightningBolts) window.lightningBolts = [];
    
    const bassIntensity = dataArray.slice(0, 32).reduce((a, b) => a + b, 0) / 32 / 255;
    
    // Spawn lightning on high bass
    if (bassIntensity > 0.6 && Math.random() < 0.1) {
        const startX = Math.random() * width;
        window.lightningBolts.push({
            x: startX,
            y: 0,
            segments: [],
            life: 0,
            maxLife: 15,
            colorIndex: Math.floor(Math.random() * colors.length)
        });
        
        // Generate lightning path
        let currentX = startX;
        let currentY = 0;
        const bolt = window.lightningBolts[window.lightningBolts.length - 1];
        
        while (currentY < height) {
            const nextX = currentX + (Math.random() - 0.5) * 60;
            const nextY = currentY + 30 + Math.random() * 50;
            bolt.segments.push({ x1: currentX, y1: currentY, x2: nextX, y2: nextY });
            currentX = nextX;
            currentY = nextY;
        }
    }
    
    // Draw and update lightning
    for (let i = window.lightningBolts.length - 1; i >= 0; i--) {
        const bolt = window.lightningBolts[i];
        bolt.life++;
        
        if (bolt.life > bolt.maxLife) {
            window.lightningBolts.splice(i, 1);
            continue;
        }
        
        const opacity = 1 - (bolt.life / bolt.maxLife);
        ctx.strokeStyle = colors[bolt.colorIndex];
        ctx.globalAlpha = opacity;
        ctx.lineWidth = 3 + Math.random() * 2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = colors[bolt.colorIndex];
        
        for (const seg of bolt.segments) {
            ctx.beginPath();
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
            ctx.stroke();
        }
        
        ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
}

// Visualizer: Fire Particles
function drawFireVisualizer(ctx, dataArray, width, height, colors) {
    if (!window.fireParticles) window.fireParticles = [];
    
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    
    // Spawn fire particles - entirely controlled by music
    if (window.fireParticles.length < 100 && Math.random() < avgIntensity * 3) {
        window.fireParticles.push({
            x: Math.random() * width,
            y: height,
            vx: (Math.random() - 0.5) * 3,
            vy: -2 - Math.random() * 4 - avgIntensity * 10, // Shoot much higher with music
            size: 3 + Math.random() * 8,
            life: 0,
            maxLife: 60 + Math.random() * 60,
            colorIndex: Math.floor(Math.random() * colors.length)
        });
    }
    
    // Update and draw
    for (let i = window.fireParticles.length - 1; i >= 0; i--) {
        const p = window.fireParticles[i];
        p.x += p.vx * avgIntensity * 3;
        p.y += p.vy * avgIntensity * 3;
        p.vy += 0.05 * avgIntensity * 3; // Gravity controlled by music
        p.life++;
        
        if (p.life > p.maxLife || p.y < -50) {
            window.fireParticles.splice(i, 1);
            continue;
        }
        
        const lifeRatio = p.life / p.maxLife;
        const opacity = 1 - lifeRatio;
        const size = p.size * (1 - lifeRatio * 0.5);
        
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
        gradient.addColorStop(0, colors[p.colorIndex]);
        gradient.addColorStop(0.5, colors[(p.colorIndex + 1) % colors.length]);
        gradient.addColorStop(1, colors[p.colorIndex].replace(')', ', 0)').replace('rgb', 'rgba'));
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = opacity;
        ctx.shadowBlur = 20 * opacity;
        ctx.shadowColor = colors[p.colorIndex];
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
}

// Visualizer: Sand Dunes Wave
function drawSandDunesVisualizer(ctx, dataArray, width, height, colors) {
    const layers = 5;
    const centerY = height * 0.7;
    
    for (let layer = 0; layer < layers; layer++) {
        const offset = animationTime * (0.5 + layer * 0.2);
        const amplitude = 30 + layer * 20;
        const frequency = 0.01 - layer * 0.001;
        const yOffset = layer * 40;
        
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        for (let x = 0; x <= width; x += 5) {
            const dataIndex = Math.floor((x / width) * dataArray.length);
            const intensity = dataArray[dataIndex] / 255;
            const wave = Math.sin(x * frequency + offset) * amplitude * (1 + intensity);
            const y = centerY + wave - yOffset;
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, height);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, centerY - yOffset - amplitude, 0, height);
        gradient.addColorStop(0, colors[layer % colors.length].replace(')', ', 0.3)').replace('rgb', 'rgba'));
        gradient.addColorStop(1, colors[layer % colors.length].replace(')', ', 0.1)').replace('rgb', 'rgba'));
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.strokeStyle = colors[layer % colors.length];
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
}

// Visualizer: Starfield
function drawStarfieldVisualizer(ctx, dataArray, width, height, colors) {
    if (!window.stars) window.stars = [];
    
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    
    // Spawn stars - fill faster with music
    if (window.stars.length < (80 + avgIntensity * 40)) {
        window.stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * 1000,
            size: Math.random() * 2,
            colorIndex: Math.floor(Math.random() * colors.length),
            twinkle: Math.random() * Math.PI * 2
        });
    }
    
    // Update and draw stars
    for (let i = window.stars.length - 1; i >= 0; i--) {
        const star = window.stars[i];
        star.z -= avgIntensity * 100; // Speed entirely controlled by music
        star.twinkle += 0.1;
        
        if (star.z < 1) {
            star.z = 1000;
            star.x = Math.random() * width;
            star.y = Math.random() * height;
        }
        
        const scale = 1000 / star.z;
        const x = (star.x - width / 2) * scale + width / 2;
        const y = (star.y - height / 2) * scale + height / 2;
        const size = star.size * scale * (1 + avgIntensity);
        const opacity = Math.sin(star.twinkle) * 0.3 + 0.7;
        
        if (x < 0 || x > width || y < 0 || y > height) continue;
        
        ctx.fillStyle = colors[star.colorIndex];
        ctx.globalAlpha = opacity * (1 - star.z / 1000);
        ctx.shadowBlur = 10 * scale;
        ctx.shadowColor = colors[star.colorIndex];
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw star trails when moving fast
        if (avgIntensity > 0.5) {
            const prevZ = star.z + 5 + avgIntensity * 20;
            const prevScale = 1000 / prevZ;
            const prevX = (star.x - width / 2) * prevScale + width / 2;
            const prevY = (star.y - height / 2) * prevScale + height / 2;
            
            ctx.strokeStyle = colors[star.colorIndex];
            ctx.lineWidth = size * 0.5;
            ctx.globalAlpha = opacity * 0.5;
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
}

// Visualizer: Crystal Formations
function drawCrystalVisualizer(ctx, dataArray, width, height, colors) {
    const centerX = width / 2;
    const centerY = height / 2;
    const crystalCount = 32;
    
    for (let i = 0; i < crystalCount; i++) {
        const angle = (i / crystalCount) * Math.PI * 2 + animationTime * 0.01;
        const intensity = dataArray[i * 8] / 255;
        const distance = 100 + i * 15;
        const height = 50 + intensity * 150;
        
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        const colorIndex = Math.floor((i / crystalCount) * colors.length);
        const color = colors[colorIndex % colors.length];
        
        // Draw crystal
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6 + intensity * 0.4;
        
        if (intensity > 0.5) {
            ctx.shadowBlur = 30 * intensity;
            ctx.shadowColor = color;
        }
        
        ctx.beginPath();
        ctx.moveTo(0, -height);
        ctx.lineTo(10, 0);
        ctx.lineTo(0, 5);
        ctx.lineTo(-10, 0);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.restore();
    }
    ctx.globalAlpha = 1;
}

// Visualizer: Digital Matrix Rain
function drawGlitchVisualizer(ctx, dataArray, width, height, colors) {
    if (!window.matrixColumns) {
        window.matrixColumns = [];
        const columnCount = Math.floor(width / 30); // Reduced columns for performance
        for (let i = 0; i < columnCount; i++) {
            window.matrixColumns.push({
                x: i * 20,
                y: Math.random() * height,
                speed: 2 + Math.random() * 8,
                chars: [],
                maxChars: 15 + Math.floor(Math.random() * 20)
            });
        }
    }
    
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    const chars = '01アイウエオカキクケコサシスセソタチツテト';
    
    // Update and draw matrix columns
    for (let i = 0; i < window.matrixColumns.length; i++) {
        const col = window.matrixColumns[i];
        const intensity = dataArray[i * 4] / 255;
        
        // Update column
        col.y += col.speed * (0.5 + avgIntensity * 1.5);
        
        // Add new character
        if (col.chars.length < col.maxChars) {
            col.chars.push({
                char: chars[Math.floor(Math.random() * chars.length)],
                brightness: 1
            });
        }
        
        // Reset column when it goes off screen
        if (col.y > height + col.maxChars * 20) {
            col.y = -col.maxChars * 20;
            col.chars = [];
        }
        
        // Draw characters
        ctx.font = '16px monospace';
        for (let j = 0; j < col.chars.length; j++) {
            const char = col.chars[j];
            const y = col.y - j * 20;
            
            if (y > -20 && y < height + 20) {
                // Fade older characters
                const brightness = j === 0 ? 1 : (1 - j / col.chars.length) * 0.7;
                const colorIndex = Math.floor((i / window.matrixColumns.length) * colors.length);
                const color = colors[colorIndex % colors.length];
                
                // Glow effect on head character
                if (j === 0 && intensity > 0.5) {
                    ctx.shadowBlur = 20 * intensity;
                    ctx.shadowColor = color;
                }
                
                ctx.fillStyle = color.replace(')', `, ${brightness})`).replace('rgb', 'rgba');
                ctx.fillText(char.char, col.x, y);
                ctx.shadowBlur = 0;
            }
        }
    }
    
    // Add occasional glitch scanlines (subtle)
    if (avgIntensity > 0.6 && Math.random() < 0.05) {
        const y = Math.random() * height;
        const colorIndex = Math.floor(Math.random() * colors.length);
        
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(0, y, width, 2);
        ctx.globalAlpha = 1;
    }
    
    // Add data packets (moving rectangles)
    if (!window.dataPackets) window.dataPackets = [];
    
    if (window.dataPackets.length < 10 && Math.random() < avgIntensity * 0.1) {
        window.dataPackets.push({
            x: Math.random() * width,
            y: 0,
            width: 40 + Math.random() * 80,
            height: 4,
            speed: 3 + Math.random() * 5,
            colorIndex: Math.floor(Math.random() * colors.length)
        });
    }
    
    // Update and draw data packets
    for (let i = window.dataPackets.length - 1; i >= 0; i--) {
        const packet = window.dataPackets[i];
        packet.y += packet.speed;
        
        if (packet.y > height) {
            window.dataPackets.splice(i, 1);
            continue;
        }
        
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = colors[packet.colorIndex];
        ctx.fillRect(packet.x, packet.y, packet.width, packet.height);
        
        // Glow trail
        ctx.globalAlpha = 0.2;
        ctx.fillRect(packet.x, packet.y - 10, packet.width, 10);
    }
    
    ctx.globalAlpha = 1;
}

// Visualizer: Tornado Vortex
function drawTornadoVisualizer(ctx, dataArray, width, height, colors) {
    const centerX = width / 2;
    const centerY = height / 2;
    const spirals = 3;
    
    for (let spiral = 0; spiral < spirals; spiral++) {
        const offset = (spiral / spirals) * Math.PI * 2;
        ctx.beginPath();
        
        for (let i = 0; i < 100; i++) {
            const progress = i / 100;
            const intensity = dataArray[i * 2] / 255;
            const angle = progress * Math.PI * 8 + animationTime * 0.02 + offset;
            const radius = progress * Math.min(width, height) * 0.4 * (1 + intensity * 0.3);
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius * 0.6; // Flatten for tornado effect
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = colors[spiral % colors.length];
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
}

// Visualizer: Blizzard - Heavy Snow with Trails
function drawBlizzardVisualizer(ctx, dataArray, width, height, colors) {
    if (!window.blizzardFlakes) window.blizzardFlakes = [];
    
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    
    // Spawn heavy snow
    if (window.blizzardFlakes.length < 200 && Math.random() < avgIntensity * 5) {
        window.blizzardFlakes.push({
            x: Math.random() * (width + 300) - 150,
            y: -20,
            vx: 3 + Math.random() * 4,
            vy: 4 + Math.random() * 6,
            size: 1.5 + Math.random() * 3,
            opacity: 0.6 + Math.random() * 0.4,
            layer: Math.random(),
            trail: [] // Store previous positions for trail effect
        });
    }
    
    // Update and draw snow with trails
    for (let i = window.blizzardFlakes.length - 1; i >= 0; i--) {
        const flake = window.blizzardFlakes[i];
        
        // Store trail
        flake.trail.push({ x: flake.x, y: flake.y });
        if (flake.trail.length > 8) flake.trail.shift();
        
        // Diagonal movement with wind
        flake.x += flake.vx * avgIntensity * 6 * flake.layer;
        flake.y += flake.vy * avgIntensity * 6 * flake.layer;
        
        // Remove if off screen
        if (flake.y > height + 20 || flake.x > width + 200) {
            window.blizzardFlakes.splice(i, 1);
            continue;
        }
        
        // Draw trail (motion blur effect)
        for (let j = 0; j < flake.trail.length; j++) {
            const t = flake.trail[j];
            const trailOpacity = (j / flake.trail.length) * flake.opacity * 0.3;
            const trailSize = flake.size * (0.5 + flake.layer * 0.5) * (j / flake.trail.length);
            
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = trailOpacity * (0.4 + flake.layer * 0.6);
            ctx.beginPath();
            ctx.arc(t.x, t.y, trailSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw snowflake
        const size = flake.size * (0.5 + flake.layer * 0.5);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = flake.opacity * (0.6 + flake.layer * 0.4);
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow to close snowflakes
        if (flake.layer > 0.7) {
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#ffffff';
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    // Draw wind gusts (curved lines)
    const gustCount = 5;
    for (let i = 0; i < gustCount; i++) {
        const intensity = dataArray[i * 50] / 255;
        if (intensity > 0.3) {
            const y = (i / gustCount) * height + Math.random() * 100;
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.1})`;
            ctx.lineWidth = 1 + intensity * 2;
            ctx.globalAlpha = intensity * 0.3;
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.quadraticCurveTo(width * 0.3, y - 30, width * 0.6, y + 20);
            ctx.quadraticCurveTo(width * 0.8, y + 40, width, y + 10);
            ctx.stroke();
        }
    }
    
    ctx.globalAlpha = 1;
}

// Visualizer: Dreamscape Psychedelic Waves
function drawDreamscapeVisualizer(ctx, dataArray, width, height, colors) {
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    const layers = 4; // Reduced from 6 for performance
    
    for (let layer = 0; layer < layers; layer++) {
        const offset = avgIntensity * Math.PI * 4 * (1 + layer * 0.5);
        const yBase = (layer / layers) * height;
        
        ctx.beginPath();
        ctx.moveTo(0, yBase);
        
        for (let x = 0; x <= width; x += 8) { // Increased step for performance
            const dataIndex = Math.floor((x / width) * dataArray.length);
            const intensity = dataArray[dataIndex] / 255;
            
            // Multiple overlapping sine waves for psychedelic effect
            const wave1 = Math.sin(x * 0.01 + offset) * 40;
            const wave2 = Math.sin(x * 0.02 - offset * 1.5) * 30;
            const wave3 = Math.cos(x * 0.005 + offset * 2) * 50;
            const musicWave = intensity * 60 * (1 + avgIntensity);
            
            const y = yBase + wave1 + wave2 + wave3 + musicWave;
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        // Vibrant gradient
        const gradient = ctx.createLinearGradient(0, yBase - 100, 0, height);
        const color1 = colors[layer % colors.length];
        const color2 = colors[(layer + 1) % colors.length];
        gradient.addColorStop(0, color1.replace(')', ', 0.4)').replace('rgb', 'rgba'));
        gradient.addColorStop(1, color2.replace(')', ', 0.1)').replace('rgb', 'rgba'));
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Glowing outline
        ctx.strokeStyle = colors[layer % colors.length];
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8 + avgIntensity * 0.2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors[layer % colors.length];
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
}

// Visualizer: NULL Static/Void
function drawNullVisualizer(ctx, dataArray, width, height, colors) {
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    const pixelSize = 8; // Increased for better performance
    
    // TV static effect
    for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
            const dataIndex = Math.floor(((x + y * width) / (width * height)) * dataArray.length);
            const intensity = dataArray[dataIndex] / 255;
            
            if (Math.random() < 0.3 + avgIntensity * 0.4) {
                const brightness = Math.floor(Math.random() * 256 * intensity);
                ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
                ctx.fillRect(x, y, pixelSize, pixelSize);
            }
        }
    }
    
    // Glitch scanlines
    for (let i = 0; i < 5; i++) {
        const y = Math.random() * height;
        const intensity = dataArray[i * 50] / 255;
        
        if (intensity > 0.5) {
            ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.3})`;
            ctx.fillRect(0, y, width, 2);
        }
    }
    
    // Void tendrils reaching from edges
    const tendrils = 8;
    for (let i = 0; i < tendrils; i++) {
        const intensity = dataArray[i * 32] / 255;
        const angle = (i / tendrils) * Math.PI * 2 + avgIntensity * Math.PI * 2;
        const length = intensity * Math.min(width, height) * 0.3;
        
        const startX = width / 2 + Math.cos(angle) * Math.min(width, height) * 0.5;
        const startY = height / 2 + Math.sin(angle) * Math.min(width, height) * 0.5;
        const endX = width / 2 + Math.cos(angle) * (Math.min(width, height) * 0.5 - length);
        const endY = height / 2 + Math.sin(angle) * (Math.min(width, height) * 0.5 - length);
        
        ctx.strokeStyle = `rgba(50, 50, 50, ${intensity * 0.6})`;
        ctx.lineWidth = 3 + intensity * 5;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}

// Visualizer: Corruption Tendrils
function drawCorruptionVisualizer(ctx, dataArray, width, height, colors) {
    if (!window.corruptionTendrils) {
        window.corruptionTendrils = [];
        for (let i = 0; i < 8; i++) { // Reduced from 12 for performance
            window.corruptionTendrils.push({
                x: Math.random() * width,
                y: height,
                segments: [],
                growing: true,
                maxSegments: 20 + Math.floor(Math.random() * 30)
            });
        }
    }
    
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    
    // Update and draw tendrils
    for (let i = 0; i < window.corruptionTendrils.length; i++) {
        const tendril = window.corruptionTendrils[i];
        const intensity = dataArray[i * 20] / 255;
        
        // Grow tendril - entirely controlled by music
        if (tendril.growing && tendril.segments.length < tendril.maxSegments && Math.random() < avgIntensity * 2) {
            const lastSeg = tendril.segments.length > 0 ? tendril.segments[tendril.segments.length - 1] : { x: tendril.x, y: tendril.y };
            
            tendril.segments.push({
                x: lastSeg.x + (Math.random() - 0.5) * 40,
                y: lastSeg.y - 10 - Math.random() * 20 - avgIntensity * 20,
                thickness: 2 + Math.random() * 4 + intensity * 6
            });
        }
        
        // Reset if too long or off screen
        if (tendril.segments.length > 0 && tendril.segments[tendril.segments.length - 1].y < -50) {
            tendril.segments = [];
            tendril.x = Math.random() * width;
            tendril.y = height;
        }
        
        // Draw tendril
        for (let j = 0; j < tendril.segments.length; j++) {
            const seg = tendril.segments[j];
            const prevSeg = j > 0 ? tendril.segments[j - 1] : { x: tendril.x, y: tendril.y };
            
            const progress = j / tendril.segments.length;
            const colorIndex = Math.floor(progress * colors.length);
            const color = colors[colorIndex % colors.length];
            
            ctx.strokeStyle = color;
            ctx.lineWidth = seg.thickness;
            ctx.lineCap = 'round';
            ctx.globalAlpha = 0.7 + intensity * 0.3;
            
            if (intensity > 0.5) {
                ctx.shadowBlur = 15 * intensity;
                ctx.shadowColor = color;
            }
            
            ctx.beginPath();
            ctx.moveTo(prevSeg.x, prevSeg.y);
            ctx.lineTo(seg.x, seg.y);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }
    ctx.globalAlpha = 1;
}

// Visualizer: Graveyard Spirits
function drawGraveyardVisualizer(ctx, dataArray, width, height, colors) {
    if (!window.spirits) window.spirits = [];
    
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    
    // Spawn spirits - entirely controlled by music
    if (window.spirits.length < 15 && Math.random() < avgIntensity * 2) {
        window.spirits.push({
            x: Math.random() * width,
            y: height + 20,
            vx: (Math.random() - 0.5) * 2,
            vy: -0.5 - Math.random() * 1.5,
            size: 20 + Math.random() * 40,
            opacity: 0.3 + Math.random() * 0.4,
            phase: Math.random() * Math.PI * 2,
            colorIndex: Math.floor(Math.random() * colors.length)
        });
    }
    
    // Update and draw spirits
    for (let i = window.spirits.length - 1; i >= 0; i--) {
        const spirit = window.spirits[i];
        const intensity = dataArray[i * 8] / 255;
        
        // Float upward - speed controlled by music
        spirit.x += spirit.vx * avgIntensity * 3;
        spirit.y += spirit.vy * avgIntensity * 5;
        spirit.phase += 0.05;
        
        if (spirit.y < -100) {
            window.spirits.splice(i, 1);
            continue;
        }
        
        // Draw wispy spirit
        const gradient = ctx.createRadialGradient(spirit.x, spirit.y, 0, spirit.x, spirit.y, spirit.size);
        const color = colors[spirit.colorIndex];
        gradient.addColorStop(0, color.replace(')', ', 0.6)').replace('rgb', 'rgba'));
        gradient.addColorStop(0.5, color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
        gradient.addColorStop(1, color.replace(')', ', 0)').replace('rgb', 'rgba'));
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = spirit.opacity * (0.8 + intensity * 0.2);
        
        // Elongated ghost shape
        ctx.save();
        ctx.translate(spirit.x, spirit.y);
        ctx.scale(1, 1.5);
        ctx.beginPath();
        ctx.arc(0, 0, spirit.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Eyes
        if (spirit.size > 30) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.globalAlpha = spirit.opacity;
            ctx.beginPath();
            ctx.arc(spirit.x - spirit.size * 0.3, spirit.y - spirit.size * 0.2, 3, 0, Math.PI * 2);
            ctx.arc(spirit.x + spirit.size * 0.3, spirit.y - spirit.size * 0.2, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    ctx.globalAlpha = 1;
}

// Visualizer: Void Portal
function drawVoidVisualizer(ctx, dataArray, width, height, colors) {
    const centerX = width / 2;
    const centerY = height / 2;
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    
    // Swirling void
    for (let layer = 0; layer < 5; layer++) {
        const rotation = animationTime * 0.01 * (layer % 2 === 0 ? 1 : -1);
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation + layer * 0.5);
        
        for (let i = 0; i < 32; i++) {
            const angle = (i / 32) * Math.PI * 2;
            const intensity = dataArray[i * 8] / 255;
            const distance = 50 + layer * 60 + intensity * 40;
            const size = 3 + intensity * 10;
            
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, colors[layer % colors.length]);
            gradient.addColorStop(1, colors[layer % colors.length].replace(')', ', 0)').replace('rgb', 'rgba'));
            
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.6 + intensity * 0.4;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    ctx.globalAlpha = 1;
}

// Visualizer: Ocean Waves
function drawOceanVisualizer(ctx, dataArray, width, height, colors) {
    const waves = 4;
    
    for (let wave = 0; wave < waves; wave++) {
        const yBase = height * (0.3 + wave * 0.15);
        const offset = animationTime * (1 + wave * 0.5);
        
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        for (let x = 0; x <= width; x += 5) {
            const dataIndex = Math.floor((x / width) * dataArray.length);
            const intensity = dataArray[dataIndex] / 255;
            const wave1 = Math.sin(x * 0.01 + offset * 0.05) * 30;
            const wave2 = Math.sin(x * 0.02 - offset * 0.03) * 20;
            const y = yBase + wave1 + wave2 + intensity * 40;
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, height);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, yBase - 50, 0, height);
        gradient.addColorStop(0, colors[wave % colors.length].replace(')', ', 0.4)').replace('rgb', 'rgba'));
        gradient.addColorStop(1, colors[wave % colors.length].replace(')', ', 0.1)').replace('rgb', 'rgba'));
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.strokeStyle = colors[wave % colors.length];
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
}

// Visualizer: Meteor Trails
function drawMeteorVisualizer(ctx, dataArray, width, height, colors) {
    if (!window.meteors) window.meteors = [];
    
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    
    // Spawn meteors - entirely controlled by music
    if (window.meteors.length < 10 && Math.random() < avgIntensity * 2) {
        window.meteors.push({
            x: Math.random() * width,
            y: -20,
            vx: (Math.random() - 0.5) * 8,
            vy: 5 + Math.random() * 10,
            size: 3 + Math.random() * 6,
            trail: [],
            colorIndex: Math.floor(Math.random() * colors.length)
        });
    }
    
    // Update and draw
    for (let i = window.meteors.length - 1; i >= 0; i--) {
        const meteor = window.meteors[i];
        meteor.trail.push({ x: meteor.x, y: meteor.y });
        if (meteor.trail.length > 20) meteor.trail.shift();
        
        meteor.x += meteor.vx * avgIntensity * 3;
        meteor.y += meteor.vy * avgIntensity * 3;
        
        if (meteor.y > height + 50) {
            window.meteors.splice(i, 1);
            continue;
        }
        
        // Draw trail
        for (let j = 0; j < meteor.trail.length; j++) {
            const t = meteor.trail[j];
            const opacity = j / meteor.trail.length;
            ctx.fillStyle = colors[meteor.colorIndex].replace(')', `, ${opacity * 0.6})`).replace('rgb', 'rgba');
            ctx.beginPath();
            ctx.arc(t.x, t.y, meteor.size * opacity, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw meteor head
        ctx.fillStyle = colors[meteor.colorIndex];
        ctx.shadowBlur = 20;
        ctx.shadowColor = colors[meteor.colorIndex];
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Visualizer: Lava Flow
function drawLavaVisualizer(ctx, dataArray, width, height, colors) {
    if (!window.lavaBlobs) window.lavaBlobs = [];
    
    const avgIntensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    
    // Spawn lava blobs throughout the entire screen
    if (window.lavaBlobs.length < 50 && Math.random() < 0.3 + avgIntensity * 0.5) {
        window.lavaBlobs.push({
            x: Math.random() * width,
            y: Math.random() * height, // Spawn anywhere on screen
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3, // Float in any direction
            size: 8 + Math.random() * 20,
            life: 0,
            maxLife: 150 + Math.random() * 150, // Live longer
            colorIndex: Math.floor(Math.random() * colors.length)
        });
    }
    
    // Update and draw
    for (let i = window.lavaBlobs.length - 1; i >= 0; i--) {
        const blob = window.lavaBlobs[i];
        blob.x += blob.vx * avgIntensity * 5;
        blob.y += blob.vy * avgIntensity * 5;
        // No gravity - float freely
        blob.life++;
        
        // Wrap around screen edges
        if (blob.x < -50) blob.x = width + 50;
        if (blob.x > width + 50) blob.x = -50;
        if (blob.y < -50) blob.y = height + 50;
        if (blob.y > height + 50) blob.y = -50;
        
        if (blob.life > blob.maxLife) {
            window.lavaBlobs.splice(i, 1);
            continue;
        }
        
        const lifeRatio = blob.life / blob.maxLife;
        const opacity = 1 - lifeRatio;
        const size = blob.size * (1 - lifeRatio * 0.3);
        
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, size);
        gradient.addColorStop(0, colors[blob.colorIndex]);
        gradient.addColorStop(0.5, colors[(blob.colorIndex + 1) % colors.length]);
        gradient.addColorStop(1, colors[blob.colorIndex].replace(')', ', 0)').replace('rgb', 'rgba'));
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = opacity;
        ctx.shadowBlur = 25 * opacity;
        ctx.shadowColor = colors[blob.colorIndex];
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
}

// Main animation loop
function animateVisualizer() {
    if (!visualizerCtx) return;
    
    visualizerAnimationFrame = requestAnimationFrame(animateVisualizer);
    animationTime++;
    
    // Get audio data
    let avgIntensity = 0;
    if (visualizerAudioAnalyzer && visualizerAudioDataArray) {
        visualizerAudioAnalyzer.getByteFrequencyData(visualizerAudioDataArray);
        const sum = visualizerAudioDataArray.reduce((a, b) => a + b, 0);
        avgIntensity = sum / visualizerAudioDataArray.length / 255;
        
        // Beat detection
        const lowFreq = visualizerAudioDataArray.slice(0, 32);
        const currentEnergy = lowFreq.reduce((a, b) => a + b, 0) / lowFreq.length;
        
        beatHistory.push(currentEnergy);
        if (beatHistory.length > beatHistorySize) beatHistory.shift();
        
        if (beatHistory.length >= beatHistorySize) {
            const avgEnergy = beatHistory.reduce((a, b) => a + b, 0) / beatHistory.length;
            const now = Date.now();
            
            if (currentEnergy > avgEnergy * beatThreshold && now - lastBeatTime > beatCooldown) {
                isBeat = true;
                lastBeatTime = now;
                beatIntensity = Math.min((currentEnergy / avgEnergy - 1) * 2, 1);
            } else {
                isBeat = false;
            }
        }
        
        if (!isBeat) {
            beatIntensity *= beatDecay;
            if (beatIntensity < 0.01) beatIntensity = 0;
        }
    }
    
    // Transition background color
    if (currentBgColor !== targetBgColor) {
        currentBgColor = lerpColor(currentBgColor, targetBgColor, bgTransitionSpeed);
    }
    
    // Clear background fully (no trails for better performance)
    visualizerCtx.fillStyle = currentBgColor;
    visualizerCtx.fillRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    
    const width = visualizerCanvas.width;
    const height = visualizerCanvas.height;
    
    // Draw visualizer - use real audio data if available, otherwise create idle animation
    let dataToUse = visualizerAudioDataArray;
    
    // Debug: Log audio data status every 60 frames
    if (animationTime % 60 === 0) {
        console.log('🎵 Audio data check:', {
            hasAnalyzer: !!visualizerAudioAnalyzer,
            hasDataArray: !!visualizerAudioDataArray,
            avgIntensity: avgIntensity.toFixed(3),
            sampleData: visualizerAudioDataArray ? Array.from(visualizerAudioDataArray.slice(0, 5)) : 'none'
        });
    }
    
    // If no audio analyzer exists, create idle animation
    if (!visualizerAudioDataArray) {
        // Create fake data for idle animation
        dataToUse = new Uint8Array(256);
        for (let i = 0; i < dataToUse.length; i++) {
            const wave = Math.sin(animationTime * 0.02 + i * 0.1) * 0.3 + 0.3;
            dataToUse[i] = wave * 128;
        }
    }
    
    // Always draw visualizer
    switch (currentVisualizerType) {
        case 'bars':
            drawFrequencyBars(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'circular':
            drawCircularSpectrum(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'waveform':
            drawWaveform(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'radial':
            drawRadialWaveform(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'particles':
            drawParticleField(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'kaleidoscope':
            drawKaleidoscope(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'rain':
            drawRainVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'snow':
            drawSnowVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'lightning':
            drawLightningVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'fire':
            drawFireVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'sand':
            drawSandDunesVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'stars':
            drawStarfieldVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'crystals':
            drawCrystalVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'glitch':
            drawGlitchVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'tornado':
            drawTornadoVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'blizzard':
            drawBlizzardVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'dreamscape':
            drawDreamscapeVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'null':
            drawNullVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'corruption':
            drawCorruptionVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'graveyard':
            drawGraveyardVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'void':
            drawVoidVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'ocean':
            drawOceanVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'meteor':
            drawMeteorVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
        case 'lava':
            drawLavaVisualizer(visualizerCtx, dataToUse, width, height, visualizerColors);
            break;
    }
    
    // No beat flash - removed for cleaner visuals
    
    // Debug: Show visualizer type on screen
    if (window.location.search.includes('debug') || true) { // Always show for now
        visualizerCtx.save();
        visualizerCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        visualizerCtx.font = '16px monospace';
        visualizerCtx.fillText(`Visualizer: ${currentVisualizerType}`, 10, 30);
        visualizerCtx.restore();
    }
}

// Biome visualizer configurations - Each biome gets a UNIQUE visualizer
const BIOME_VISUALIZERS = {
    NORMAL: { type: 'bars', colors: ['#3b82f6', '#60a5fa', '#93c5fd'], bgColor: 'rgba(10, 15, 26, 0.95)' },
    WINDY: { type: 'waveform', colors: ['#a5f3fc', '#67e8f9', '#22d3ee'], bgColor: 'rgba(20, 40, 50, 0.92)' },
    SNOWY: { type: 'snow', colors: ['#ffffff', '#e0f2fe', '#f0f9ff'], bgColor: 'rgba(30, 40, 55, 0.92)' },
    BLIZZARD: { type: 'blizzard', colors: ['#ffffff', '#dbeafe', '#bfdbfe'], bgColor: 'rgba(35, 45, 60, 0.95)' },
    RAINY: { type: 'rain', colors: ['#7dd3fc', '#38bdf8', '#0ea5e9'], bgColor: 'rgba(20, 35, 50, 0.92)' },
    MONSOON: { type: 'ocean', colors: ['#1e40af', '#3b82f6', '#60a5fa'], bgColor: 'rgba(15, 25, 40, 0.95)' },
    SANDSTORM: { type: 'sand', colors: ['#fbbf24', '#f59e0b', '#d97706'], bgColor: 'rgba(50, 40, 20, 0.92)' },
    JUNGLE: { type: 'radial', colors: ['#22c55e', '#16a34a', '#15803d'], bgColor: 'rgba(10, 35, 20, 0.92)' },
    AMAZON: { type: 'kaleidoscope', colors: ['#059669', '#10b981', '#34d399'], bgColor: 'rgba(5, 30, 15, 0.92)' },
    CRIMSON: { type: 'fire', colors: ['#ef4444', '#dc2626', '#dc143c'], bgColor: 'rgba(50, 10, 10, 0.92)' },
    STARFALL: { type: 'stars', colors: ['#fcd34d', '#fbbf24', '#ffffff'], bgColor: 'rgba(15, 15, 35, 0.92)' },
    METEOR_SHOWER: { type: 'meteor', colors: ['#f59e0b', '#d97706', '#ff6347'], bgColor: 'rgba(25, 15, 10, 0.92)' },
    HELL: { type: 'lava', colors: ['#ef4444', '#ff4444', '#ff6347'], bgColor: 'rgba(40, 10, 5, 0.92)' },
    TORNADO: { type: 'tornado', colors: ['#94a3b8', '#64748b', '#475569'], bgColor: 'rgba(30, 35, 40, 0.92)' },
    DUNES: { type: 'waveform', colors: ['#fbbf24', '#f59e0b', '#d97706'], bgColor: 'rgba(45, 35, 15, 0.92)' },
    VOLCANO: { type: 'fire', colors: ['#ff4500', '#ff6347', '#ffa500'], bgColor: 'rgba(40, 15, 5, 0.92)' },
    VOID: { type: 'void', colors: ['#1e1b4b', '#312e81', '#4c1d95'], bgColor: 'rgba(5, 5, 15, 0.95)' },
    SKY: { type: 'particles', colors: ['#87CEEB', '#4FC3F7', '#ffffff'], bgColor: 'rgba(50, 70, 100, 0.92)' },
    CHARGED: { type: 'lightning', colors: ['#fbbf24', '#eab308', '#facc15'], bgColor: 'rgba(30, 30, 10, 0.92)' },
    BIOLUMINESCENT: { type: 'crystals', colors: ['#00FFFF', '#00CED1', '#7FFFD4'], bgColor: 'rgba(0, 20, 25, 0.92)' },
    ANCIENT: { type: 'sand', colors: ['#C2B280', '#D4AF37', '#8B7355'], bgColor: 'rgba(25, 20, 15, 0.92)' },
    HALLOW: { type: 'crystals', colors: ['#a78bfa', '#8b5cf6', '#7c3aed'], bgColor: 'rgba(20, 15, 35, 0.92)' },
    GLITCHED: { type: 'glitch', colors: ['#00ffff', '#ff00ff', '#ffff00'], bgColor: 'rgba(10, 10, 15, 0.95)' },
    PUMPKIN_MOON: { type: 'fire', colors: ['#ff8c00', '#ff6600', '#ff4500'], bgColor: 'rgba(35, 20, 5, 0.92)' },
    BLOOD_RAIN: { type: 'rain', colors: ['#8b0000', '#dc143c', '#a00000'], bgColor: 'rgba(30, 5, 5, 0.92)' },
    DREAMSPACE: { type: 'dreamscape', colors: ['#ff00ff', '#00ffff', '#ffff00', '#ff0080'], bgColor: 'rgba(15, 5, 25, 0.95)' },
    NULL: { type: 'null', colors: ['#000000', '#1a1a1a', '#333333'], bgColor: 'rgba(0, 0, 0, 0.98)' },
    CORRUPTION: { type: 'corruption', colors: ['#4a0e4e', '#6a1b9a', '#8e24aa'], bgColor: 'rgba(20, 5, 25, 0.95)' },
    GRAVEYARD: { type: 'graveyard', colors: ['#4a5568', '#718096', '#a0aec0'], bgColor: 'rgba(15, 15, 20, 0.95)' }
};

// Update visualizer for biome
function updateVisualizerForBiome(biomeName) {
    if (!visualizerCanvas) {
        initAudioVisualizer();
    }
    
    const config = BIOME_VISUALIZERS[biomeName.toUpperCase().replace(' ', '_')] || BIOME_VISUALIZERS.NORMAL;
    currentVisualizerType = config.type;
    visualizerColors = config.colors;
    targetBgColor = config.bgColor;
    
    // Clear all visualizer-specific arrays
    particles3D = [];
    window.rainDrops = [];
    window.snowflakes = [];
    window.lightningBolts = [];
    window.fireParticles = [];
    window.stars = [];
    window.matrixColumns = [];
    window.dataPackets = [];
    window.meteors = [];
    window.lavaBlobs = [];
    window.corruptionTendrils = [];
    window.spirits = [];
    window.blizzardFlakes = [];
    
    console.log(`🎨 Visualizer Type Set: ${currentVisualizerType} for ${biomeName}`);
    console.log(`   Colors:`, visualizerColors);
    
    // Always try to connect/resume audio when biome changes
    if (!visualizerAudioAnalyzer || !window.visualizerAudioSourceNode) {
        setTimeout(() => {
            connectVisualizerAudio();
        }, 100);
        
        // Retry if needed
        setTimeout(() => {
            if (!visualizerAudioAnalyzer) {
                connectVisualizerAudio();
            }
        }, 500);
    } else if (visualizerAudioContext && visualizerAudioContext.state === 'suspended') {
        // Resume if suspended
        visualizerAudioContext.resume().then(() => {
            console.log('🎵 AudioContext resumed for new biome');
        });
    }
    
    if (!visualizerAnimationFrame) {
        animateVisualizer();
    }
}

// Make globally accessible
window.updateVisualizerForBiome = updateVisualizerForBiome;
window.initAudioVisualizer = initAudioVisualizer;
window.connectVisualizerAudio = connectVisualizerAudio;

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudioVisualizer);
} else {
    initAudioVisualizer();
}
