// =================================================================
// Advanced Biome Effects with Three.js, Anime.js, and Canvas 2D
// Ultra-Enhanced 3D + 2D Hybrid Effects with Particles.js-style systems
// =================================================================

let biomeScene = null;
let biomeCamera = null;
let biomeRenderer = null;
let biomeAnimationFrame = null;
let biomeParticles = [];
let biomeEffects = {};
let biomeLights = [];
let biomeTime = 0;

// 2D Canvas overlay for hybrid effects
let canvas2D = null;
let ctx2D = null;
let particles2D = [];
let biome2DAnimationFrame = null;

// Performance helpers
function shouldUsePerformanceMode() {
    return document.body.classList.contains('performance-mode') ||
           document.body.classList.contains('no-background-effects') ||
           (typeof performanceOptimizer !== 'undefined' && performanceOptimizer.settings?.disableBackgroundEffects);
}

function getParticleCount(baseCount) {
    if (shouldUsePerformanceMode()) {
        return Math.floor(baseCount * 0.3); // 70% reduction for performance
    }
    return baseCount;
}

function getGeometrySegments(highDetail) {
    if (shouldUsePerformanceMode()) {
        return Math.max(4, Math.floor(highDetail * 0.25)); // 75% reduction
    }
    return Math.max(8, Math.floor(highDetail * 0.5)); // 50% reduction for everyone
}

// Initialize Three.js scene for biome backgrounds
function initBiomeEffects() {
    console.log('Initializing ultra-enhanced biome effects...');
    
    // Create container for biome effects
    let container = document.getElementById('biomeEffectsContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'biomeEffectsContainer';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        `;
        document.body.insertBefore(container, document.body.firstChild);
    }
    
    // Initialize Three.js with enhanced settings
    biomeScene = new THREE.Scene();
    biomeCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    biomeCamera.position.z = 8;
    
    biomeRenderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
    });
    biomeRenderer.setSize(window.innerWidth, window.innerHeight);
    biomeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    biomeRenderer.setClearColor(0x000000, 0);
    container.appendChild(biomeRenderer.domElement);
    
    // Add ambient lighting for depth
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    biomeScene.add(ambientLight);
    
    // Initialize 2D Canvas overlay for hybrid effects
    if (!canvas2D) {
        canvas2D = document.createElement('canvas');
        canvas2D.id = 'biome2DCanvas';
        canvas2D.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            pointer-events: none;
        `;
        canvas2D.width = window.innerWidth;
        canvas2D.height = window.innerHeight;
        document.body.insertBefore(canvas2D, document.body.firstChild);
        ctx2D = canvas2D.getContext('2d');
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        biomeCamera.aspect = window.innerWidth / window.innerHeight;
        biomeCamera.updateProjectionMatrix();
        biomeRenderer.setSize(window.innerWidth, window.innerHeight);
        biomeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Resize 2D canvas
        if (canvas2D) {
            canvas2D.width = window.innerWidth;
            canvas2D.height = window.innerHeight;
        }
    });
    
    console.log('✅ Ultra-enhanced biome effects initialized (3D + 2D hybrid)');
}

// =================================================================
// NORMAL BIOME - Floating magical orbs and energy streams
// =================================================================
function createNormalBiomeEffect() {
    clearBiomeEffects();
    
    // Add dynamic point lights
    for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(i % 2 === 0 ? 0x667eea : 0x764ba2, 2, 20);
        light.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 8
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Create floating orbs with enhanced materials
    const orbCount = getParticleCount(50);
    for (let i = 0; i < orbCount; i++) {
        const size = 0.08 + Math.random() * 0.15;
        const orbGeometry = new THREE.SphereGeometry(size, getGeometrySegments(16), getGeometrySegments(16));
        const color = Math.random() > 0.5 ? 0x667eea : 0x764ba2;
        
        const orbMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7,
            metalness: 0.3,
            roughness: 0.2
        });
        
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.set(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 12
        );
        
        biomeScene.add(orb);
        biomeParticles.push({
            mesh: orb,
            velocity: {
                x: (Math.random() - 0.5) * 0.03,
                y: (Math.random() - 0.5) * 0.03,
                z: (Math.random() - 0.5) * 0.03
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            waveOffset: Math.random() * Math.PI * 2
        });
        
        // Animate orb pulsing with glow
        anime({
            targets: orb.scale,
            x: [1, 1.8, 1],
            y: [1, 1.8, 1],
            z: [1, 1.8, 1],
            duration: 2000 + Math.random() * 3000,
            easing: 'easeInOutSine',
            loop: true
        });
        
        anime({
            targets: orb.material,
            emissiveIntensity: [0.5, 1.2, 0.5],
            duration: 2000 + Math.random() * 2000,
            easing: 'easeInOutSine',
            loop: true
        });
    }
    
    // Add energy ring trails
    for (let i = 0; i < getParticleCount(8); i++) {
        const ringGeometry = new THREE.TorusGeometry(0.5 + i * 0.3, 0.02, getGeometrySegments(8), getGeometrySegments(48));
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x667eea,
            transparent: true,
            opacity: 0.3
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.set(0, 0, 0);
        ring.rotation.x = Math.PI / 2;
        biomeScene.add(ring);
        
        biomeParticles.push({
            mesh: ring,
            rotationSpeed: { x: 0, y: 0, z: 0.01 + i * 0.005 },
            isRing: true
        });
    }
    
    // Add atmospheric fog
    biomeScene.fog = new THREE.Fog(0x667eea, 5, 30);
    
    // Add 2D particle overlay
    create2DParticles({
        count: 30,
        speedX: 2,
        speedY: 2,
        minSize: 3,
        maxSize: 8,
        colors: ['rgba(102, 126, 234, 0.6)', 'rgba(118, 75, 162, 0.6)', 'rgba(167, 139, 250, 0.6)'],
        type: 'circle'
    });
    
    animateBiomeEffect();
}

// =================================================================
// WINDY BIOME - Swirling wind particles and clouds
// =================================================================
function createWindyBiomeEffect() {
    clearBiomeEffects();
    
    // Add cyan point lights
    for (let i = 0; i < 2; i++) {
        const light = new THREE.PointLight(0xa5f3fc, 1.5, 25);
        light.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            5
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Create wind streaks with trails
    const streakCount = getParticleCount(80);
    for (let i = 0; i < streakCount; i++) {
        const length = 1.5 + Math.random() * 2;
        const streakGeometry = new THREE.CylinderGeometry(0.015, 0.005, length, 8);
        const streakMaterial = new THREE.MeshStandardMaterial({
            color: 0xa5f3fc,
            emissive: 0xa5f3fc,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.5,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const streak = new THREE.Mesh(streakGeometry, streakMaterial);
        streak.position.set(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 12
        );
        streak.rotation.z = Math.random() * Math.PI;
        streak.rotation.y = Math.random() * Math.PI;
        
        biomeScene.add(streak);
        biomeParticles.push({
            mesh: streak,
            velocity: {
                x: 0.15 + Math.random() * 0.15,
                y: (Math.random() - 0.5) * 0.08,
                z: (Math.random() - 0.5) * 0.05
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.05,
                y: (Math.random() - 0.5) * 0.05,
                z: (Math.random() - 0.5) * 0.15
            }
        });
        
        // Fade animation
        anime({
            targets: streak.material,
            opacity: [0.5, 0.8, 0.5],
            duration: 1500 + Math.random() * 1500,
            easing: 'easeInOutSine',
            loop: true
        });
    }
    
    // Add spiral wind patterns
    for (let i = 0; i < 3; i++) {
        const spiralParticles = 20;
        const spiralRadius = 3 + i * 2;
        for (let j = 0; j < spiralParticles; j++) {
            const angle = (j / spiralParticles) * Math.PI * 2;
            const cloudGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const cloudMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3,
                metalness: 0.1,
                roughness: 0.9
            });
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.set(
                Math.cos(angle) * spiralRadius,
                (Math.random() - 0.5) * 10,
                Math.sin(angle) * spiralRadius
            );
            biomeScene.add(cloud);
            
            biomeParticles.push({
                mesh: cloud,
                spiralAngle: angle,
                spiralRadius: spiralRadius,
                spiralSpeed: 0.02 + i * 0.01,
                spiralIndex: i
            });
        }
    }
    
    // Add fog
    biomeScene.fog = new THREE.Fog(0xa5f3fc, 8, 35);
    
    // Add 2D wind lines overlay
    create2DParticles({
        count: 40,
        speedX: 8,
        speedY: 1,
        minSize: 15,
        maxSize: 30,
        colors: ['rgba(165, 243, 252, 0.4)', 'rgba(255, 255, 255, 0.3)'],
        type: 'line'
    });
    
    animateBiomeEffect();
}

// =================================================================
// SNOWY BIOME - Falling snowflakes with depth
// =================================================================
function createSnowyBiomeEffect() {
    clearBiomeEffects();
    
    // Add blue-white ambient lighting
    const snowLight = new THREE.PointLight(0xdbeafe, 1.2, 30);
    snowLight.position.set(0, 10, 5);
    biomeScene.add(snowLight);
    biomeLights.push(snowLight);
    
    // Create multi-layered snowflakes with varying sizes
    const snowCount = getParticleCount(300);
    for (let i = 0; i < snowCount; i++) {
        const size = 0.03 + Math.random() * 0.08;
        const depth = (Math.random() - 0.5) * 15;
        
        // Use different geometries for variety
        const geometry = Math.random() > 0.7 
            ? new THREE.OctahedronGeometry(size, 0)
            : new THREE.SphereGeometry(size, 6, 6);
            
        const snowMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xdbeafe,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.85,
            metalness: 0.1,
            roughness: 0.8
        });
        
        const snowflake = new THREE.Mesh(geometry, snowMaterial);
        snowflake.position.set(
            (Math.random() - 0.5) * 25,
            Math.random() * 25,
            depth
        );
        
        biomeScene.add(snowflake);
        biomeParticles.push({
            mesh: snowflake,
            velocity: {
                x: (Math.random() - 0.5) * 0.03,
                y: -0.04 - Math.random() * 0.06,
                z: (Math.random() - 0.5) * 0.02
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.03,
                y: (Math.random() - 0.5) * 0.03,
                z: (Math.random() - 0.5) * 0.03
            },
            swayOffset: Math.random() * Math.PI * 2
        });
        
        // Gentle sparkle effect
        if (Math.random() > 0.8) {
            anime({
                targets: snowflake.material,
                emissiveIntensity: [0.2, 0.6, 0.2],
                duration: 2000 + Math.random() * 2000,
                easing: 'easeInOutSine',
                loop: true
            });
        }
    }
    
    // Add ice crystals floating
    for (let i = 0; i < 15; i++) {
        const crystalGeometry = new THREE.OctahedronGeometry(0.15, 1);
        const crystalMaterial = new THREE.MeshStandardMaterial({
            color: 0xbfdbfe,
            emissive: 0xbfdbfe,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.6,
            metalness: 0.9,
            roughness: 0.1
        });
        const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
        crystal.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10
        );
        biomeScene.add(crystal);
        
        biomeParticles.push({
            mesh: crystal,
            velocity: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            rotationSpeed: {
                x: 0.02,
                y: 0.03,
                z: 0.01
            }
        });
    }
    
    // Add fog
    biomeScene.fog = new THREE.Fog(0xdbeafe, 10, 40);
    
    // Add 2D snowflake overlay
    create2DParticles({
        count: 50,
        speedX: 1.5,
        speedY: 3,
        minSize: 4,
        maxSize: 10,
        colors: ['rgba(255, 255, 255, 0.7)', 'rgba(191, 219, 254, 0.6)'],
        type: 'star'
    });
    
    animateBiomeEffect();
}

// =================================================================
// RAINY BIOME - Heavy rain with splashes
// =================================================================
function createRainyBiomeEffect() {
    clearBiomeEffects();
    
    // Add blue-tinted lighting
    const rainLight = new THREE.PointLight(0x0ea5e9, 1, 25);
    rainLight.position.set(0, 10, 5);
    biomeScene.add(rainLight);
    biomeLights.push(rainLight);
    
    // Create raindrops with varying lengths
    const rainCount = getParticleCount(400);
    for (let i = 0; i < rainCount; i++) {
        const length = 0.4 + Math.random() * 0.6;
        const rainGeometry = new THREE.CylinderGeometry(0.008, 0.008, length, 4);
        const rainMaterial = new THREE.MeshStandardMaterial({
            color: 0x0ea5e9,
            emissive: 0x0ea5e9,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.7,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const raindrop = new THREE.Mesh(rainGeometry, rainMaterial);
        raindrop.position.set(
            (Math.random() - 0.5) * 25,
            Math.random() * 25,
            (Math.random() - 0.5) * 12
        );
        raindrop.rotation.z = -0.3;
        
        biomeScene.add(raindrop);
        biomeParticles.push({
            mesh: raindrop,
            velocity: {
                x: -0.08,
                y: -0.35 - Math.random() * 0.25,
                z: 0
            },
            rotationSpeed: { x: 0, y: 0, z: 0 }
        });
    }
    
    // Add splash ripples
    for (let i = 0; i < 20; i++) {
        const rippleGeometry = new THREE.RingGeometry(0.1, 0.3, 16);
        const rippleMaterial = new THREE.MeshBasicMaterial({
            color: 0x0ea5e9,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });
        const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
        ripple.position.set(
            (Math.random() - 0.5) * 20,
            -8,
            (Math.random() - 0.5) * 10
        );
        ripple.rotation.x = Math.PI / 2;
        biomeScene.add(ripple);
        
        biomeParticles.push({
            mesh: ripple,
            isRipple: true,
            rippleTime: Math.random() * 100
        });
        
        // Ripple expansion animation
        anime({
            targets: ripple.scale,
            x: [0.5, 2],
            y: [0.5, 2],
            z: [0.5, 2],
            duration: 2000,
            easing: 'easeOutQuad',
            loop: true
        });
        
        anime({
            targets: ripple.material,
            opacity: [0.6, 0],
            duration: 2000,
            easing: 'easeOutQuad',
            loop: true
        });
    }
    
    // Add fog
    biomeScene.fog = new THREE.Fog(0x0ea5e9, 12, 35);
    
    animateBiomeEffect();
}

// =================================================================
// SANDSTORM BIOME - Swirling sand particles
// =================================================================
function createSandstormBiomeEffect() {
    clearBiomeEffects();
    
    // Add warm amber lighting
    for (let i = 0; i < 2; i++) {
        const light = new THREE.PointLight(0xfbbf24, 1.5, 20);
        light.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            5
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Create sand particles with varied sizes
    const sandCount = getParticleCount(200);
    for (let i = 0; i < sandCount; i++) {
        const size = 0.05 + Math.random() * 0.12;
        const sandGeometry = new THREE.SphereGeometry(size, 8, 8);
        const color = Math.random() > 0.5 ? 0xfbbf24 : 0xf59e0b;
        const sandMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.6,
            metalness: 0.2,
            roughness: 0.8
        });
        
        const sand = new THREE.Mesh(sandGeometry, sandMaterial);
        sand.position.set(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 12
        );
        
        biomeScene.add(sand);
        
        // Vortex motion for sandstorm effect
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 8;
        const height = (Math.random() - 0.5) * 20;
        
        biomeParticles.push({
            mesh: sand,
            angle: angle,
            radius: radius,
            angleSpeed: 0.025 + Math.random() * 0.03,
            heightSpeed: (Math.random() - 0.5) * 0.08,
            vortexHeight: height,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.1,
                y: (Math.random() - 0.5) * 0.1,
                z: (Math.random() - 0.5) * 0.1
            }
        });
        
        // Opacity pulsing
        anime({
            targets: sand.material,
            opacity: [0.3, 0.7, 0.3],
            duration: 1500 + Math.random() * 1500,
            easing: 'easeInOutSine',
            loop: true
        });
    }
    
    // Add sand clouds
    for (let i = 0; i < 10; i++) {
        const cloudGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const cloudMaterial = new THREE.MeshStandardMaterial({
            color: 0xd97706,
            transparent: true,
            opacity: 0.2,
            metalness: 0,
            roughness: 1
        });
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloud.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 10
        );
        biomeScene.add(cloud);
        
        biomeParticles.push({
            mesh: cloud,
            velocity: {
                x: 0.05 + Math.random() * 0.05,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        });
    }
    
    // Add fog
    biomeScene.fog = new THREE.Fog(0xfbbf24, 8, 30);
    
    animateBiomeEffect();
}

// =================================================================
// HELL BIOME - Flames, embers, and heat distortion
// =================================================================
function createHellBiomeEffect() {
    clearBiomeEffects();
    
    // Add red-orange point lights for hellish glow
    for (let i = 0; i < 4; i++) {
        const light = new THREE.PointLight(i % 2 === 0 ? 0xff4444 : 0xff8800, 2.5, 18);
        light.position.set(
            (Math.random() - 0.5) * 15,
            -5 + Math.random() * 10,
            (Math.random() - 0.5) * 10
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Create rising embers with varied sizes
    const emberCount = getParticleCount(150);
    for (let i = 0; i < emberCount; i++) {
        const size = 0.05 + Math.random() * 0.12;
        const emberGeometry = new THREE.SphereGeometry(size, 12, 12);
        const color = Math.random() > 0.5 ? 0xff4444 : 0xff8800;
        const emberMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.7,
            metalness: 0.1,
            roughness: 0.3
        });
        
        const ember = new THREE.Mesh(emberGeometry, emberMaterial);
        ember.position.set(
            (Math.random() - 0.5) * 25,
            -12 + Math.random() * 8,
            (Math.random() - 0.5) * 12
        );
        
        biomeScene.add(ember);
        biomeParticles.push({
            mesh: ember,
            velocity: {
                x: (Math.random() - 0.5) * 0.06,
                y: 0.12 + Math.random() * 0.15,
                z: (Math.random() - 0.5) * 0.06
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.08,
                y: (Math.random() - 0.5) * 0.08,
                z: (Math.random() - 0.5) * 0.08
            }
        });
        
        // Pulsing glow effect with scale
        anime({
            targets: ember.material,
            emissiveIntensity: [0.8, 1.5, 0.8],
            opacity: [0.7, 1, 0.7],
            duration: 800 + Math.random() * 1200,
            easing: 'easeInOutSine',
            loop: true
        });
        
        anime({
            targets: ember.scale,
            x: [1, 1.3, 1],
            y: [1, 1.3, 1],
            z: [1, 1.3, 1],
            duration: 1000 + Math.random() * 1000,
            easing: 'easeInOutSine',
            loop: true
        });
    }
    
    // Add flame pillars
    for (let i = 0; i < 8; i++) {
        const flameGeometry = new THREE.ConeGeometry(0.3, 2, 8);
        const flameMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6600,
            emissive: 0xff6600,
            emissiveIntensity: 1.2,
            transparent: true,
            opacity: 0.6,
            metalness: 0,
            roughness: 0.5
        });
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.set(
            (Math.random() - 0.5) * 20,
            -8,
            (Math.random() - 0.5) * 10
        );
        biomeScene.add(flame);
        
        biomeParticles.push({
            mesh: flame,
            velocity: { x: 0, y: 0, z: 0 },
            rotationSpeed: { x: 0, y: 0.05, z: 0 },
            isFlame: true
        });
        
        // Flickering animation
        anime({
            targets: flame.scale,
            y: [1, 1.5, 1],
            duration: 500 + Math.random() * 500,
            easing: 'easeInOutQuad',
            loop: true
        });
    }
    
    // Add fog
    biomeScene.fog = new THREE.Fog(0x330000, 8, 28);
    
    // Add 2D ember overlay
    create2DParticles({
        count: 60,
        speedX: 1,
        speedY: -4,
        minSize: 3,
        maxSize: 8,
        colors: ['rgba(255, 68, 68, 0.8)', 'rgba(255, 136, 0, 0.7)', 'rgba(255, 102, 0, 0.6)'],
        type: 'circle'
    });
    
    animateBiomeEffect();
}

// =================================================================
// STARFALL BIOME - Shooting stars and cosmic dust
// =================================================================
function createStarfallBiomeEffect() {
    clearBiomeEffects();
    
    // Add golden-white point lights
    for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(0xffffdd, 1.5, 30);
        light.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Create stars with varied sizes and colors
    const starCount = 120;
    for (let i = 0; i < starCount; i++) {
        const size = 0.04 + Math.random() * 0.08;
        const starGeometry = Math.random() > 0.7 
            ? new THREE.OctahedronGeometry(size, 0)
            : new THREE.SphereGeometry(size, 8, 8);
        const color = Math.random() > 0.5 ? 0xffffff : 0xffffaa;
        const starMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.9,
            transparent: true,
            opacity: 0.9,
            metalness: 0.5,
            roughness: 0.2
        });
        
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 15
        );
        
        biomeScene.add(star);
        biomeParticles.push({
            mesh: star,
            velocity: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.03,
                y: (Math.random() - 0.5) * 0.03,
                z: (Math.random() - 0.5) * 0.03
            }
        });
        
        // Twinkling effect with scale
        anime({
            targets: star.material,
            emissiveIntensity: [0.5, 1.5, 0.5],
            opacity: [0.4, 1, 0.4],
            duration: 1500 + Math.random() * 2500,
            easing: 'easeInOutSine',
            loop: true
        });
        
        anime({
            targets: star.scale,
            x: [1, 1.4, 1],
            y: [1, 1.4, 1],
            z: [1, 1.4, 1],
            duration: 2000 + Math.random() * 2000,
            easing: 'easeInOutSine',
            loop: true
        });
    }
    
    // Add cosmic dust particles
    for (let i = 0; i < 40; i++) {
        const dustGeometry = new THREE.SphereGeometry(0.02, 6, 6);
        const dustMaterial = new THREE.MeshBasicMaterial({
            color: 0xaaaaff,
            transparent: true,
            opacity: 0.3
        });
        const dust = new THREE.Mesh(dustGeometry, dustMaterial);
        dust.position.set(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 12
        );
        biomeScene.add(dust);
        
        biomeParticles.push({
            mesh: dust,
            velocity: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        });
    }
    
    // Occasional shooting stars
    setInterval(() => {
        if (biomeParticles.length > 0) {
            createShootingStar();
        }
    }, 2500);
    
    // Add fog
    biomeScene.fog = new THREE.Fog(0x000033, 15, 45);
    
    // Add 2D starfield overlay
    create2DParticles({
        count: 80,
        speedX: 0.5,
        speedY: 0.5,
        minSize: 2,
        maxSize: 6,
        colors: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 170, 0.8)', 'rgba(170, 170, 255, 0.7)'],
        type: 'star'
    });
    
    animateBiomeEffect();
}

function createShootingStar() {
    const shootingStarGeometry = new THREE.CylinderGeometry(0.03, 0.03, 3, 8);
    const shootingStarMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1
    });
    
    const shootingStar = new THREE.Mesh(shootingStarGeometry, shootingStarMaterial);
    shootingStar.position.set(10, 10, 0);
    shootingStar.rotation.z = -Math.PI / 4;
    
    biomeScene.add(shootingStar);
    
    anime({
        targets: shootingStar.position,
        x: -10,
        y: -10,
        duration: 2000,
        easing: 'linear',
        complete: () => {
            biomeScene.remove(shootingStar);
        }
    });
    
    anime({
        targets: shootingStar.material,
        opacity: [1, 0],
        duration: 2000,
        easing: 'easeOutQuad'
    });
}

// =================================================================
// CORRUPTION BIOME - Dark tendrils and purple mist
// =================================================================
function createCorruptionBiomeEffect() {
    clearBiomeEffects();
    
    // Add purple point lights
    for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(0x8b5cf6, 1.8, 22);
        light.position.set(
            (Math.random() - 0.5) * 18,
            (Math.random() - 0.5) * 18,
            (Math.random() - 0.5) * 10
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Create corruption particles with varied sizes
    const corruptionCount = 130;
    for (let i = 0; i < corruptionCount; i++) {
        const size = 0.06 + Math.random() * 0.14;
        const corruptionGeometry = new THREE.SphereGeometry(size, 12, 12);
        const color = Math.random() > 0.5 ? 0x6b21a8 : 0x8b5cf6;
        const corruptionMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.7,
            metalness: 0.4,
            roughness: 0.3
        });
        
        const particle = new THREE.Mesh(corruptionGeometry, corruptionMaterial);
        particle.position.set(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 12
        );
        
        biomeScene.add(particle);
        biomeParticles.push({
            mesh: particle,
            velocity: {
                x: (Math.random() - 0.5) * 0.04,
                y: -0.03 + (Math.random() - 0.5) * 0.03,
                z: (Math.random() - 0.5) * 0.04
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.04,
                y: (Math.random() - 0.5) * 0.04,
                z: (Math.random() - 0.5) * 0.04
            }
        });
        
        // Pulsing effect with glow
        anime({
            targets: particle.scale,
            x: [1, 1.5, 1],
            y: [1, 1.5, 1],
            z: [1, 1.5, 1],
            duration: 1800 + Math.random() * 1500,
            easing: 'easeInOutSine',
            loop: true
        });
        
        anime({
            targets: particle.material,
            emissiveIntensity: [0.4, 1.0, 0.4],
            duration: 2000 + Math.random() * 1000,
            easing: 'easeInOutSine',
            loop: true
        });
    }
    
    // Add corruption tendrils
    for (let i = 0; i < 12; i++) {
        const tendrilGeometry = new THREE.CylinderGeometry(0.03, 0.01, 1.5, 6);
        const tendrilMaterial = new THREE.MeshStandardMaterial({
            color: 0x4c1d95,
            emissive: 0x4c1d95,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.5,
            metalness: 0.6,
            roughness: 0.4
        });
        const tendril = new THREE.Mesh(tendrilGeometry, tendrilMaterial);
        tendril.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10
        );
        tendril.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        biomeScene.add(tendril);
        
        biomeParticles.push({
            mesh: tendril,
            velocity: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.03,
                y: (Math.random() - 0.5) * 0.03,
                z: (Math.random() - 0.5) * 0.03
            }
        });
    }
    
    // Add fog
    biomeScene.fog = new THREE.Fog(0x4c1d95, 10, 32);
    
    animateBiomeEffect();
}

// =================================================================
// NULL BIOME - Glitchy reality fragments
// =================================================================
function createNullBiomeEffect() {
    clearBiomeEffects();
    
    // Add flickering white lights
    for (let i = 0; i < 2; i++) {
        const light = new THREE.PointLight(0xffffff, 0.8, 20);
        light.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 8
        );
        biomeScene.add(light);
        biomeLights.push(light);
        
        // Flickering light animation
        anime({
            targets: light,
            intensity: [0.3, 1.2, 0.3],
            duration: 300 + Math.random() * 400,
            easing: 'easeInOutQuad',
            loop: true
        });
    }
    
    // Create glitch cubes with varied sizes
    const glitchCount = 60;
    for (let i = 0; i < glitchCount; i++) {
        const size = 0.2 + Math.random() * 0.4;
        const glitchGeometry = new THREE.BoxGeometry(size, size, size);
        const isWireframe = Math.random() > 0.5;
        const glitchMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            emissive: 0x222222,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.7,
            wireframe: isWireframe,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const cube = new THREE.Mesh(glitchGeometry, glitchMaterial);
        cube.position.set(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 12
        );
        cube.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        biomeScene.add(cube);
        biomeParticles.push({
            mesh: cube,
            velocity: {
                x: 0,
                y: 0,
                z: 0
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.1,
                y: (Math.random() - 0.5) * 0.1,
                z: (Math.random() - 0.5) * 0.1
            },
            glitchTimer: Math.random() * 100
        });
        
        // Glitch animation with teleportation
        setInterval(() => {
            if (Math.random() > 0.7) {
                cube.position.x += (Math.random() - 0.5) * 3;
                cube.position.y += (Math.random() - 0.5) * 3;
                cube.position.z += (Math.random() - 0.5) * 2;
                cube.material.opacity = 0.3 + Math.random() * 0.6;
                cube.material.emissiveIntensity = Math.random() * 0.8;
            }
        }, 150 + Math.random() * 250);
    }
    
    // Add void particles
    for (let i = 0; i < 30; i++) {
        const voidGeometry = new THREE.SphereGeometry(0.05, 6, 6);
        const voidMaterial = new THREE.MeshBasicMaterial({
            color: 0x111111,
            transparent: true,
            opacity: 0.5
        });
        const voidParticle = new THREE.Mesh(voidGeometry, voidMaterial);
        voidParticle.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10
        );
        biomeScene.add(voidParticle);
        
        biomeParticles.push({
            mesh: voidParticle,
            velocity: {
                x: (Math.random() - 0.5) * 0.05,
                y: (Math.random() - 0.5) * 0.05,
                z: (Math.random() - 0.5) * 0.05
            }
        });
    }
    
    // Add fog
    biomeScene.fog = new THREE.Fog(0x000000, 8, 25);
    
    animateBiomeEffect();
}

// =================================================================
// GLITCHED BIOME - Digital artifacts and scan lines
// =================================================================
function createGlitchedBiomeEffect() {
    clearBiomeEffects();
    
    // Add cyan point lights
    for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(0x06b6d4, 1.6, 24);
        light.position.set(
            (Math.random() - 0.5) * 18,
            (Math.random() - 0.5) * 18,
            (Math.random() - 0.5) * 10
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Create digital particles with varied geometries
    const digitalCount = 100;
    for (let i = 0; i < digitalCount; i++) {
        const size = 0.15 + Math.random() * 0.25;
        const geometry = Math.random() > 0.6
            ? new THREE.BoxGeometry(size, size, size)
            : new THREE.OctahedronGeometry(size * 0.6, 0);
        const color = Math.random() > 0.5 ? 0x06b6d4 : 0x0891b2;
        const digitalMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.7,
            transparent: true,
            opacity: 0.8,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const cube = new THREE.Mesh(geometry, digitalMaterial);
        cube.position.set(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 12
        );
        cube.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        biomeScene.add(cube);
        biomeParticles.push({
            mesh: cube,
            velocity: {
                x: (Math.random() - 0.5) * 0.06,
                y: (Math.random() - 0.5) * 0.06,
                z: (Math.random() - 0.5) * 0.06
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.12,
                y: (Math.random() - 0.5) * 0.12,
                z: (Math.random() - 0.5) * 0.12
            }
        });
        
        // Glitch flicker animation
        anime({
            targets: cube.material,
            emissiveIntensity: [0.4, 1.2, 0.4],
            duration: 400 + Math.random() * 600,
            easing: 'easeInOutQuad',
            loop: true
        });
    }
    
    // Add scan line planes
    for (let i = 0; i < 5; i++) {
        const scanGeometry = new THREE.PlaneGeometry(15, 0.1);
        const scanMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });
        const scanLine = new THREE.Mesh(scanGeometry, scanMaterial);
        scanLine.position.set(0, -10 + i * 5, 0);
        biomeScene.add(scanLine);
        
        biomeParticles.push({
            mesh: scanLine,
            velocity: { x: 0, y: 0.1, z: 0 },
            isScanLine: true
        });
        
        // Scan line fade
        anime({
            targets: scanLine.material,
            opacity: [0.2, 0.6, 0.2],
            duration: 1000,
            easing: 'linear',
            loop: true
        });
    }
    
    // Add data stream particles
    for (let i = 0; i < 30; i++) {
        const streamGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 4);
        const streamMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffaa,
            transparent: true,
            opacity: 0.6
        });
        const stream = new THREE.Mesh(streamGeometry, streamMaterial);
        stream.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10
        );
        biomeScene.add(stream);
        
        biomeParticles.push({
            mesh: stream,
            velocity: {
                x: 0,
                y: 0.15,
                z: 0
            }
        });
    }
    
    // Add fog
    biomeScene.fog = new THREE.Fog(0x0891b2, 12, 35);
    
    animateBiomeEffect();
}

// =================================================================
// DREAMSPACE BIOME - Floating islands and ethereal lights
// =================================================================
function createDreamspaceBiomeEffect() {
    clearBiomeEffects();
    
    // Add rainbow-colored point lights
    for (let i = 0; i < 4; i++) {
        const hue = i / 4;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        const light = new THREE.PointLight(color.getHex(), 1.4, 25);
        light.position.set(
            Math.cos(i * Math.PI / 2) * 10,
            Math.sin(i * Math.PI / 2) * 10,
            (Math.random() - 0.5) * 8
        );
        biomeScene.add(light);
        biomeLights.push(light);
        
        // Slowly rotate lights
        anime({
            targets: light.position,
            x: Math.cos((i * Math.PI / 2) + Math.PI) * 10,
            z: Math.sin((i * Math.PI / 2) + Math.PI) * 10,
            duration: 8000,
            easing: 'linear',
            loop: true,
            direction: 'alternate'
        });
    }
    
    // Create dream particles with varied sizes
    const dreamCount = 80;
    for (let i = 0; i < dreamCount; i++) {
        const size = 0.1 + Math.random() * 0.2;
        const geometry = Math.random() > 0.5
            ? new THREE.SphereGeometry(size, 16, 16)
            : new THREE.OctahedronGeometry(size, 1);
        const hue = Math.random();
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        
        const dreamMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.7,
            metalness: 0.3,
            roughness: 0.4
        });
        
        const orb = new THREE.Mesh(geometry, dreamMaterial);
        orb.position.set(
            (Math.random() - 0.5) * 28,
            (Math.random() - 0.5) * 28,
            (Math.random() - 0.5) * 14
        );
        
        biomeScene.add(orb);
        biomeParticles.push({
            mesh: orb,
            velocity: {
                x: (Math.random() - 0.5) * 0.025,
                y: Math.sin(i) * 0.035,
                z: (Math.random() - 0.5) * 0.025
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            waveOffset: Math.random() * Math.PI * 2
        });
        
        // Color shifting with scale pulsing
        anime({
            targets: { hue: hue },
            hue: hue + 1,
            duration: 6000 + Math.random() * 4000,
            easing: 'linear',
            loop: true,
            update: function(anim) {
                const newColor = new THREE.Color().setHSL(anim.animations[0].currentValue % 1, 0.8, 0.6);
                orb.material.color = newColor;
                orb.material.emissive = newColor;
            }
        });
        
        anime({
            targets: orb.scale,
            x: [1, 1.4, 1],
            y: [1, 1.4, 1],
            z: [1, 1.4, 1],
            duration: 3000 + Math.random() * 2000,
            easing: 'easeInOutSine',
            loop: true
        });
    }
    
    // Add ethereal trails
    for (let i = 0; i < 15; i++) {
        const trailGeometry = new THREE.TorusGeometry(0.3, 0.03, 8, 32);
        const hue = Math.random();
        const color = new THREE.Color().setHSL(hue, 0.7, 0.5);
        const trailMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.4
        });
        const trail = new THREE.Mesh(trailGeometry, trailMaterial);
        trail.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10
        );
        trail.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        biomeScene.add(trail);
        
        biomeParticles.push({
            mesh: trail,
            velocity: {
                x: (Math.random() - 0.5) * 0.015,
                y: (Math.random() - 0.5) * 0.015,
                z: (Math.random() - 0.5) * 0.015
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        });
    }
    
    // Add fog
    biomeScene.fog = new THREE.Fog(0x9333ea, 15, 40);
    
    animateBiomeEffect();
}

// =================================================================
// GRAVEYARD BIOME - Mist, ghosts, and eerie atmosphere
// =================================================================
function createGraveyardBiomeEffect() {
    clearBiomeEffects();
    
    // Add gray point lights
    for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(0x6b7280, 1.5, 20);
        light.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Floating mist particles
    for (let i = 0; i < getParticleCount(100); i++) {
        const geometry = new THREE.SphereGeometry(0.3, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0x9ca3af,
            transparent: true,
            opacity: 0.2
        });
        const mist = new THREE.Mesh(geometry, material);
        mist.position.set(
            (Math.random() - 0.5) * 30,
            Math.random() * 20 - 5,
            (Math.random() - 0.5) * 30
        );
        biomeScene.add(mist);
        
        biomeParticles.push({
            mesh: mist,
            velocity: {
                x: (Math.random() - 0.5) * 0.01,
                y: Math.random() * 0.01,
                z: (Math.random() - 0.5) * 0.01
            }
        });
    }
    
    // Add fog
    biomeScene.fog = new THREE.Fog(0x4b5563, 10, 35);
    
    animateBiomeEffect();
}

// =================================================================
// CRIMSON BIOME - Red crystals and blood mist
// =================================================================
function createCrimsonBiomeEffect() {
    clearBiomeEffects();
    
    // Add red point lights
    for (let i = 0; i < 4; i++) {
        const light = new THREE.PointLight(0xdc2626, 2, 18);
        light.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Crimson crystal shards
    for (let i = 0; i < getParticleCount(60); i++) {
        const geometry = new THREE.OctahedronGeometry(0.3, 0);
        const material = new THREE.MeshStandardMaterial({
            color: 0xef4444,
            emissive: 0xdc2626,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2
        });
        const crystal = new THREE.Mesh(geometry, material);
        crystal.position.set(
            (Math.random() - 0.5) * 25,
            Math.random() * 20 - 5,
            (Math.random() - 0.5) * 25
        );
        crystal.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        biomeScene.add(crystal);
        
        biomeParticles.push({
            mesh: crystal,
            velocity: {
                x: (Math.random() - 0.5) * 0.015,
                y: (Math.random() - 0.5) * 0.015,
                z: (Math.random() - 0.5) * 0.015
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        });
    }
    
    // Add red fog
    biomeScene.fog = new THREE.Fog(0x991b1b, 12, 38);
    
    animateBiomeEffect();
}

// =================================================================
// PUMPKIN MOON BIOME - Orange particles and jack-o-lantern glow
// =================================================================
function createPumpkinMoonBiomeEffect() {
    clearBiomeEffects();
    
    // Add orange point lights
    for (let i = 0; i < 5; i++) {
        const light = new THREE.PointLight(0xff8c00, 2.5, 16);
        light.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Floating pumpkin embers
    for (let i = 0; i < getParticleCount(80); i++) {
        const geometry = new THREE.SphereGeometry(0.15, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0xff8c00 : 0xff6600,
            transparent: true,
            opacity: 0.8
        });
        const ember = new THREE.Mesh(geometry, material);
        ember.position.set(
            (Math.random() - 0.5) * 30,
            Math.random() * 20 - 5,
            (Math.random() - 0.5) * 30
        );
        biomeScene.add(ember);
        
        biomeParticles.push({
            mesh: ember,
            velocity: {
                x: (Math.random() - 0.5) * 0.02,
                y: Math.random() * 0.02 - 0.005,
                z: (Math.random() - 0.5) * 0.02
            },
            phase: Math.random() * Math.PI * 2
        });
    }
    
    // Add orange fog
    biomeScene.fog = new THREE.Fog(0xff4500, 15, 40);
    
    animateBiomeEffect();
}

// =================================================================
// BLOOD RAIN BIOME - Red droplets and dark atmosphere
// =================================================================
function createBloodRainBiomeEffect() {
    clearBiomeEffects();
    
    // Add dark red point lights
    for (let i = 0; i < 4; i++) {
        const light = new THREE.PointLight(0x8b0000, 2, 18);
        light.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Blood rain droplets
    for (let i = 0; i < getParticleCount(150); i++) {
        const geometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 4);
        const material = new THREE.MeshBasicMaterial({
            color: 0xdc143c,
            transparent: true,
            opacity: 0.7
        });
        const drop = new THREE.Mesh(geometry, material);
        drop.position.set(
            (Math.random() - 0.5) * 40,
            Math.random() * 25,
            (Math.random() - 0.5) * 40
        );
        drop.rotation.x = Math.PI / 2;
        biomeScene.add(drop);
        
        biomeParticles.push({
            mesh: drop,
            velocity: {
                x: 0,
                y: -0.15,
                z: 0
            },
            resetY: drop.position.y
        });
    }
    
    // Add dark red fog
    biomeScene.fog = new THREE.Fog(0x4a0000, 10, 35);
    
    animateBiomeEffect();
}

// =================================================================
// BLIZZARD BIOME - Intense snowstorm
// =================================================================
function createBlizzardBiomeEffect() {
    clearBiomeEffects();
    for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(0xbfdbfe, 2, 22);
        light.position.set((Math.random() - 0.5) * 20, Math.random() * 10, (Math.random() - 0.5) * 20);
        biomeScene.add(light);
        biomeLights.push(light);
    }
    for (let i = 0; i < getParticleCount(200); i++) {
        const geometry = new THREE.SphereGeometry(0.12, 6, 6);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
        const snow = new THREE.Mesh(geometry, material);
        snow.position.set((Math.random() - 0.5) * 40, Math.random() * 25, (Math.random() - 0.5) * 40);
        biomeScene.add(snow);
        biomeParticles.push({ mesh: snow, velocity: { x: (Math.random() - 0.5) * 0.1, y: -0.1 - Math.random() * 0.05, z: (Math.random() - 0.5) * 0.1 }, resetY: snow.position.y });
    }
    biomeScene.fog = new THREE.Fog(0xe0f2fe, 8, 30);
    animateBiomeEffect();
}

function createMonsoonBiomeEffect() {
    clearBiomeEffects();
    for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(0x1e40af, 1.8, 20);
        light.position.set((Math.random() - 0.5) * 20, Math.random() * 10, (Math.random() - 0.5) * 20);
        biomeScene.add(light);
        biomeLights.push(light);
    }
    for (let i = 0; i < getParticleCount(180); i++) {
        const geometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 4);
        const material = new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.7 });
        const drop = new THREE.Mesh(geometry, material);
        drop.position.set((Math.random() - 0.5) * 40, Math.random() * 25, (Math.random() - 0.5) * 40);
        drop.rotation.x = Math.PI / 2;
        biomeScene.add(drop);
        biomeParticles.push({ mesh: drop, velocity: { x: (Math.random() - 0.5) * 0.1, y: -0.2, z: (Math.random() - 0.5) * 0.1 }, resetY: drop.position.y });
    }
    biomeScene.fog = new THREE.Fog(0x1e40af, 12, 35);
    animateBiomeEffect();
}

function createJungleBiomeEffect() {
    clearBiomeEffects();
    for (let i = 0; i < 4; i++) {
        const light = new THREE.PointLight(0x22c55e, 1.8, 18);
        light.position.set((Math.random() - 0.5) * 20, Math.random() * 10, (Math.random() - 0.5) * 20);
        biomeScene.add(light);
        biomeLights.push(light);
    }
    for (let i = 0; i < getParticleCount(80); i++) {
        const geometry = new THREE.SphereGeometry(0.1, 6, 6);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.8 });
        const firefly = new THREE.Mesh(geometry, material);
        firefly.position.set((Math.random() - 0.5) * 25, Math.random() * 15, (Math.random() - 0.5) * 25);
        biomeScene.add(firefly);
        biomeParticles.push({ mesh: firefly, velocity: { x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02, z: (Math.random() - 0.5) * 0.02 }, phase: Math.random() * Math.PI * 2 });
    }
    biomeScene.fog = new THREE.Fog(0x059669, 15, 40);
    animateBiomeEffect();
}

function createAmazonBiomeEffect() {
    clearBiomeEffects();
    for (let i = 0; i < 5; i++) {
        const light = new THREE.PointLight(0x059669, 2, 18);
        light.position.set((Math.random() - 0.5) * 20, Math.random() * 10, (Math.random() - 0.5) * 20);
        biomeScene.add(light);
        biomeLights.push(light);
    }
    for (let i = 0; i < getParticleCount(100); i++) {
        const geometry = new THREE.OctahedronGeometry(0.15, 0);
        const material = new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0x10b981 : (i % 3 === 1 ? 0x22c55e : 0x34d399), transparent: true, opacity: 0.6 });
        const leaf = new THREE.Mesh(geometry, material);
        leaf.position.set((Math.random() - 0.5) * 30, Math.random() * 20, (Math.random() - 0.5) * 30);
        leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        biomeScene.add(leaf);
        biomeParticles.push({ mesh: leaf, velocity: { x: (Math.random() - 0.5) * 0.015, y: (Math.random() - 0.5) * 0.015, z: (Math.random() - 0.5) * 0.015 }, rotationSpeed: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01, z: (Math.random() - 0.5) * 0.01 } });
    }
    biomeScene.fog = new THREE.Fog(0x047857, 12, 38);
    animateBiomeEffect();
}

function createMeteorShowerBiomeEffect() {
    clearBiomeEffects();
    for (let i = 0; i < 5; i++) {
        const light = new THREE.PointLight(0xf59e0b, 2.5, 18);
        light.position.set((Math.random() - 0.5) * 20, Math.random() * 10, (Math.random() - 0.5) * 20);
        biomeScene.add(light);
        biomeLights.push(light);
    }
    for (let i = 0; i < getParticleCount(40); i++) {
        const geometry = new THREE.ConeGeometry(0.2, 1.5, 6);
        const material = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xf59e0b : 0xd97706, emissive: 0xd97706, emissiveIntensity: 0.8 });
        const meteor = new THREE.Mesh(geometry, material);
        meteor.position.set((Math.random() - 0.5) * 40, 15 + Math.random() * 10, (Math.random() - 0.5) * 40);
        meteor.rotation.x = Math.PI;
        biomeScene.add(meteor);
        biomeParticles.push({ mesh: meteor, velocity: { x: (Math.random() - 0.5) * 0.05, y: -0.15 - Math.random() * 0.1, z: (Math.random() - 0.5) * 0.05 }, resetY: meteor.position.y, trail: true });
    }
    biomeScene.fog = new THREE.Fog(0x78350f, 18, 45);
    animateBiomeEffect();
}

function createTornadoBiomeEffect() {
    clearBiomeEffects();
    for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(0x94a3b8, 1.8, 20);
        light.position.set((Math.random() - 0.5) * 15, Math.random() * 10, (Math.random() - 0.5) * 15);
        biomeScene.add(light);
        biomeLights.push(light);
    }
    for (let i = 0; i < getParticleCount(100); i++) {
        const geometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        const material = new THREE.MeshBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.7 });
        const debris = new THREE.Mesh(geometry, material);
        const angle = (i / 100) * Math.PI * 2;
        const radius = 5 + Math.random() * 10;
        debris.position.set(Math.cos(angle) * radius, Math.random() * 20, Math.sin(angle) * radius);
        biomeScene.add(debris);
        biomeParticles.push({ mesh: debris, angle: angle, radius: radius, velocity: { y: (Math.random() - 0.5) * 0.05, angular: 0.02 + Math.random() * 0.02 }, rotationSpeed: { x: (Math.random() - 0.5) * 0.05, y: (Math.random() - 0.5) * 0.05, z: (Math.random() - 0.5) * 0.05 } });
    }
    biomeScene.fog = new THREE.Fog(0x475569, 10, 35);
    animateBiomeEffect();
}

function createDunesBiomeEffect() {
    clearBiomeEffects();
    for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(0xf59e0b, 1.5, 20);
        light.position.set((Math.random() - 0.5) * 20, Math.random() * 10, (Math.random() - 0.5) * 20);
        biomeScene.add(light);
        biomeLights.push(light);
    }
    for (let i = 0; i < getParticleCount(90); i++) {
        const geometry = new THREE.SphereGeometry(0.1, 6, 6);
        const material = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.4 });
        const sand = new THREE.Mesh(geometry, material);
        sand.position.set((Math.random() - 0.5) * 35, Math.random() * 12, (Math.random() - 0.5) * 35);
        biomeScene.add(sand);
        biomeParticles.push({ mesh: sand, velocity: { x: (Math.random() - 0.3) * 0.03, y: (Math.random() - 0.5) * 0.01, z: (Math.random() - 0.5) * 0.02 } });
    }
    biomeScene.fog = new THREE.Fog(0xb45309, 12, 40);
    animateBiomeEffect();
}

function createVolcanoBiomeEffect() {
    clearBiomeEffects();
    for (let i = 0; i < 5; i++) {
        const light = new THREE.PointLight(0xff4500, 2.5, 18);
        light.position.set((Math.random() - 0.5) * 20, Math.random() * 10, (Math.random() - 0.5) * 20);
        biomeScene.add(light);
        biomeLights.push(light);
    }
    for (let i = 0; i < getParticleCount(70); i++) {
        const geometry = new THREE.SphereGeometry(0.15, 6, 6);
        const material = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xff4500 : 0xff6347, emissive: 0xff4500, emissiveIntensity: 0.8 });
        const ember = new THREE.Mesh(geometry, material);
        ember.position.set((Math.random() - 0.5) * 25, Math.random() * 20 - 5, (Math.random() - 0.5) * 25);
        biomeScene.add(ember);
        biomeParticles.push({ mesh: ember, velocity: { x: (Math.random() - 0.5) * 0.02, y: 0.05 + Math.random() * 0.05, z: (Math.random() - 0.5) * 0.02 }, life: Math.random() * 100 });
    }
    biomeScene.fog = new THREE.Fog(0x8b0000, 10, 35);
    animateBiomeEffect();
}

function createVoidBiomeEffect() {
    clearBiomeEffects();
    for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(0x1e1b4b, 1.5, 20);
        light.position.set((Math.random() - 0.5) * 20, Math.random() * 10, (Math.random() - 0.5) * 20);
        biomeScene.add(light);
        biomeLights.push(light);
    }
    for (let i = 0; i < getParticleCount(80); i++) {
        const geometry = new THREE.OctahedronGeometry(0.15, 0);
        const material = new THREE.MeshBasicMaterial({ color: 0x312e81, transparent: true, opacity: 0.6 });
        const fragment = new THREE.Mesh(geometry, material);
        fragment.position.set((Math.random() - 0.5) * 30, Math.random() * 20, (Math.random() - 0.5) * 30);
        biomeScene.add(fragment);
        biomeParticles.push({ mesh: fragment, velocity: { x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02, z: (Math.random() - 0.5) * 0.02 }, rotationSpeed: { x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02, z: (Math.random() - 0.5) * 0.02 } });
    }
    biomeScene.fog = new THREE.Fog(0x0a0a1a, 8, 30);
    animateBiomeEffect();
}

function createSkyBiomeEffect() {
    clearBiomeEffects();
    for (let i = 0; i < 4; i++) {
        const light = new THREE.PointLight(0x87CEEB, 2, 22);
        light.position.set((Math.random() - 0.5) * 20, Math.random() * 10, (Math.random() - 0.5) * 20);
        biomeScene.add(light);
        biomeLights.push(light);
    }
    for (let i = 0; i < getParticleCount(60); i++) {
        const geometry = new THREE.SphereGeometry(0.5, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
        const cloud = new THREE.Mesh(geometry, material);
        cloud.position.set((Math.random() - 0.5) * 40, Math.random() * 15, (Math.random() - 0.5) * 40);
        biomeScene.add(cloud);
        biomeParticles.push({ mesh: cloud, velocity: { x: 0.01 + Math.random() * 0.01, y: 0, z: (Math.random() - 0.5) * 0.005 } });
    }
    biomeScene.fog = new THREE.Fog(0x4FC3F7, 20, 50);
    animateBiomeEffect();
}

function createChargedBiomeEffect() {
    clearBiomeEffects();
    for (let i = 0; i < 5; i++) {
        const light = new THREE.PointLight(0xfbbf24, 2.5, 18);
        light.position.set((Math.random() - 0.5) * 20, Math.random() * 10, (Math.random() - 0.5) * 20);
        biomeScene.add(light);
        biomeLights.push(light);
    }
    for (let i = 0; i < getParticleCount(80); i++) {
        const geometry = new THREE.OctahedronGeometry(0.12, 0);
        const material = new THREE.MeshBasicMaterial({ color: 0xeab308, emissive: 0xfbbf24, emissiveIntensity: 1.0 });
        const spark = new THREE.Mesh(geometry, material);
        spark.position.set((Math.random() - 0.5) * 30, Math.random() * 20, (Math.random() - 0.5) * 30);
        biomeScene.add(spark);
        biomeParticles.push({ mesh: spark, velocity: { x: (Math.random() - 0.5) * 0.1, y: (Math.random() - 0.5) * 0.1, z: (Math.random() - 0.5) * 0.1 }, rotationSpeed: { x: (Math.random() - 0.5) * 0.1, y: (Math.random() - 0.5) * 0.1, z: (Math.random() - 0.5) * 0.1 } });
    }
    biomeScene.fog = new THREE.Fog(0xca8a04, 12, 38);
    animateBiomeEffect();
}

function createBioluminescentBiomeEffect() {
    clearBiomeEffects();
    for (let i = 0; i < 6; i++) {
        const light = new THREE.PointLight(0x00FFFF, 2.5, 20);
        light.position.set((Math.random() - 0.5) * 20, Math.random() * 10, (Math.random() - 0.5) * 20);
        biomeScene.add(light);
        biomeLights.push(light);
    }
    for (let i = 0; i < getParticleCount(90); i++) {
        const geometry = new THREE.SphereGeometry(0.15, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0x00FFFF : (i % 3 === 1 ? 0x00CED1 : 0x7FFFD4), emissive: 0x00FFFF, emissiveIntensity: 0.8, transparent: true, opacity: 0.9 });
        const glow = new THREE.Mesh(geometry, material);
        glow.position.set((Math.random() - 0.5) * 30, Math.random() * 20, (Math.random() - 0.5) * 30);
        biomeScene.add(glow);
        biomeParticles.push({ mesh: glow, velocity: { x: (Math.random() - 0.5) * 0.015, y: (Math.random() - 0.5) * 0.015, z: (Math.random() - 0.5) * 0.015 }, phase: Math.random() * Math.PI * 2, pulseSpeed: 0.05 + Math.random() * 0.05 });
    }
    biomeScene.fog = new THREE.Fog(0x006666, 10, 38);
    animateBiomeEffect();
}

function createAncientBiomeEffect() {
    clearBiomeEffects();
    for (let i = 0; i < 4; i++) {
        const light = new THREE.PointLight(0xD4AF37, 1.8, 20);
        light.position.set((Math.random() - 0.5) * 20, Math.random() * 10, (Math.random() - 0.5) * 20);
        biomeScene.add(light);
        biomeLights.push(light);
    }
    for (let i = 0; i < getParticleCount(70); i++) {
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.05);
        const material = new THREE.MeshBasicMaterial({ color: 0xC2B280, transparent: true, opacity: 0.7 });
        const rune = new THREE.Mesh(geometry, material);
        rune.position.set((Math.random() - 0.5) * 30, Math.random() * 18, (Math.random() - 0.5) * 30);
        rune.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        biomeScene.add(rune);
        biomeParticles.push({ mesh: rune, velocity: { x: (Math.random() - 0.5) * 0.01, y: Math.random() * 0.01, z: (Math.random() - 0.5) * 0.01 }, rotationSpeed: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01, z: (Math.random() - 0.5) * 0.01 } });
    }
    biomeScene.fog = new THREE.Fog(0x8B7355, 15, 42);
    animateBiomeEffect();
}

function createHallowBiomeEffect() {
    clearBiomeEffects();
    for (let i = 0; i < 5; i++) {
        const light = new THREE.PointLight(i % 2 === 0 ? 0xFF69B4 : 0x00CED1, 2.2, 18);
        light.position.set((Math.random() - 0.5) * 20, Math.random() * 10, (Math.random() - 0.5) * 20);
        biomeScene.add(light);
        biomeLights.push(light);
    }
    for (let i = 0; i < getParticleCount(90); i++) {
        const geometry = new THREE.OctahedronGeometry(0.15, 0);
        const material = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xFF69B4 : 0x00CED1, emissive: i % 2 === 0 ? 0xFF1493 : 0x00CED1, emissiveIntensity: 0.7, transparent: true, opacity: 0.8 });
        const sparkle = new THREE.Mesh(geometry, material);
        sparkle.position.set((Math.random() - 0.5) * 30, Math.random() * 20, (Math.random() - 0.5) * 30);
        biomeScene.add(sparkle);
        biomeParticles.push({ mesh: sparkle, velocity: { x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02, z: (Math.random() - 0.5) * 0.02 }, rotationSpeed: { x: (Math.random() - 0.5) * 0.03, y: (Math.random() - 0.5) * 0.03, z: (Math.random() - 0.5) * 0.03 } });
    }
    biomeScene.fog = new THREE.Fog(0x8B3A62, 12, 40);
    animateBiomeEffect();
}

// =================================================================
// 2D Canvas Particle Systems
// =================================================================
function create2DParticles(config) {
    particles2D = [];
    for (let i = 0; i < config.count; i++) {
        particles2D.push({
            x: Math.random() * canvas2D.width,
            y: Math.random() * canvas2D.height,
            vx: (Math.random() - 0.5) * config.speedX,
            vy: (Math.random() - 0.5) * config.speedY,
            size: config.minSize + Math.random() * (config.maxSize - config.minSize),
            color: config.colors[Math.floor(Math.random() * config.colors.length)],
            alpha: 0.3 + Math.random() * 0.5,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.05,
            type: config.type || 'circle'
        });
    }
    animate2DParticles();
}

function animate2DParticles() {
    if (!ctx2D || particles2D.length === 0) return;
    
    biome2DAnimationFrame = requestAnimationFrame(animate2DParticles);
    
    // Clear canvas with fade effect for trails
    ctx2D.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx2D.fillRect(0, 0, canvas2D.width, canvas2D.height);
    
    particles2D.forEach(p => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        
        // Wrap around screen
        if (p.x < -50) p.x = canvas2D.width + 50;
        if (p.x > canvas2D.width + 50) p.x = -50;
        if (p.y < -50) p.y = canvas2D.height + 50;
        if (p.y > canvas2D.height + 50) p.y = -50;
        
        // Draw particle
        ctx2D.save();
        ctx2D.translate(p.x, p.y);
        ctx2D.rotate(p.rotation);
        ctx2D.globalAlpha = p.alpha;
        
        if (p.type === 'circle') {
            ctx2D.fillStyle = p.color;
            ctx2D.beginPath();
            ctx2D.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx2D.fill();
            
            // Glow removed for performance (+15-25 FPS)
            // ctx2D.shadowBlur = 15;
            // ctx2D.shadowColor = p.color;
            // ctx2D.fill();
        } else if (p.type === 'star') {
            drawStar(ctx2D, 0, 0, 5, p.size, p.size / 2, p.color);
        } else if (p.type === 'line') {
            ctx2D.strokeStyle = p.color;
            ctx2D.lineWidth = 2;
            ctx2D.beginPath();
            ctx2D.moveTo(-p.size, 0);
            ctx2D.lineTo(p.size, 0);
            ctx2D.stroke();
        } else if (p.type === 'triangle') {
            ctx2D.fillStyle = p.color;
            ctx2D.beginPath();
            ctx2D.moveTo(0, -p.size);
            ctx2D.lineTo(p.size, p.size);
            ctx2D.lineTo(-p.size, p.size);
            ctx2D.closePath();
            ctx2D.fill();
        }
        
        ctx2D.restore();
    });
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
        
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

function clear2DParticles() {
    if (biome2DAnimationFrame) {
        cancelAnimationFrame(biome2DAnimationFrame);
        biome2DAnimationFrame = null;
    }
    particles2D = [];
    if (ctx2D) {
        ctx2D.clearRect(0, 0, canvas2D.width, canvas2D.height);
    }
}

// =================================================================
// Animation Loop
// =================================================================
function animateBiomeEffect() {
    biomeAnimationFrame = requestAnimationFrame(animateBiomeEffect);
    biomeTime += 0.016; // Approximate 60fps delta
    
    // Update particles
    biomeParticles.forEach((particle, index) => {
        // Handle spiral motion (windy biome)
        if (particle.spiralAngle !== undefined) {
            particle.spiralAngle += particle.spiralSpeed;
            particle.mesh.position.x = Math.cos(particle.spiralAngle) * particle.spiralRadius;
            particle.mesh.position.z = Math.sin(particle.spiralAngle) * particle.spiralRadius;
        }
        // Handle vortex motion (sandstorm)
        else if (particle.angle !== undefined && particle.vortexHeight !== undefined) {
            particle.angle += particle.angleSpeed;
            particle.mesh.position.x = Math.cos(particle.angle) * particle.radius;
            particle.mesh.position.z = Math.sin(particle.angle) * particle.radius;
            particle.mesh.position.y += particle.heightSpeed;
            
            // Wrap height for vortex
            if (particle.mesh.position.y > 12) particle.mesh.position.y = -12;
            if (particle.mesh.position.y < -12) particle.mesh.position.y = 12;
        }
        // Handle circular motion (sandstorm legacy)
        else if (particle.angle !== undefined) {
            particle.angle += particle.angleSpeed;
            particle.mesh.position.x = Math.cos(particle.angle) * particle.radius;
            particle.mesh.position.z = Math.sin(particle.angle) * particle.radius;
            particle.mesh.position.y += particle.heightSpeed;
        }
        // Handle wave motion
        else if (particle.waveOffset !== undefined) {
            particle.mesh.position.x += particle.velocity.x;
            particle.mesh.position.y += particle.velocity.y + Math.sin(biomeTime + particle.waveOffset) * 0.002;
            particle.mesh.position.z += particle.velocity.z;
        }
        // Handle sway motion (snow)
        else if (particle.swayOffset !== undefined) {
            particle.mesh.position.x += particle.velocity.x + Math.sin(biomeTime * 0.5 + particle.swayOffset) * 0.001;
            particle.mesh.position.y += particle.velocity.y;
            particle.mesh.position.z += particle.velocity.z;
        }
        // Handle ripple effects
        else if (particle.isRipple) {
            particle.rippleTime += 1;
            if (particle.rippleTime > 120) {
                particle.rippleTime = 0;
            }
        }
        // Handle scan lines
        else if (particle.isScanLine) {
            particle.mesh.position.y += particle.velocity.y;
            if (particle.mesh.position.y > 12) particle.mesh.position.y = -12;
        }
        // Standard linear motion
        else if (particle.velocity) {
            particle.mesh.position.x += particle.velocity.x;
            particle.mesh.position.y += particle.velocity.y;
            particle.mesh.position.z += particle.velocity.z;
        }
        
        // Rotation
        if (particle.rotationSpeed) {
            if (typeof particle.rotationSpeed === 'object') {
                particle.mesh.rotation.x += particle.rotationSpeed.x;
                particle.mesh.rotation.y += particle.rotationSpeed.y;
                particle.mesh.rotation.z += particle.rotationSpeed.z;
            } else {
                particle.mesh.rotation.z += particle.rotationSpeed;
            }
        }
        
        // Wrap around boundaries (extended for larger scenes)
        if (!particle.isRipple && !particle.isScanLine && !particle.spiralAngle && particle.angle === undefined) {
            if (particle.mesh.position.y < -15) particle.mesh.position.y = 15;
            if (particle.mesh.position.y > 15) particle.mesh.position.y = -15;
            if (particle.mesh.position.x < -15) particle.mesh.position.x = 15;
            if (particle.mesh.position.x > 15) particle.mesh.position.x = -15;
            if (particle.mesh.position.z < -10) particle.mesh.position.z = 10;
            if (particle.mesh.position.z > 10) particle.mesh.position.z = -10;
        }
    });
    
    // Animate lights for dynamic effect
    biomeLights.forEach((light, index) => {
        if (light.userData && light.userData.animate) {
            light.position.x += Math.sin(biomeTime * 0.1 + index) * 0.01;
            light.position.y += Math.cos(biomeTime * 0.1 + index) * 0.01;
        }
    });
    
    // Enhanced camera movement for more depth
    biomeCamera.position.x = Math.sin(biomeTime * 0.05) * 0.8;
    biomeCamera.position.y = Math.cos(biomeTime * 0.03) * 0.6;
    biomeCamera.lookAt(0, 0, 0);
    
    biomeRenderer.render(biomeScene, biomeCamera);
}

// =================================================================
// Utility Functions
// =================================================================
function clearBiomeEffects() {
    // Cancel animation frame
    if (biomeAnimationFrame) {
        cancelAnimationFrame(biomeAnimationFrame);
        biomeAnimationFrame = null;
    }
    
    // Remove all particles
    biomeParticles.forEach(particle => {
        biomeScene.remove(particle.mesh);
        if (particle.mesh.geometry) particle.mesh.geometry.dispose();
        if (particle.mesh.material) particle.mesh.material.dispose();
    });
    biomeParticles = [];
    
    // Remove all lights
    biomeLights.forEach(light => {
        biomeScene.remove(light);
    });
    biomeLights = [];
    
    // Clear fog
    biomeScene.fog = null;
    
    // Clear 2D particles
    clear2DParticles();
    
    // Reset time
    biomeTime = 0;
}

function updateBiomeEffect(biomeName) {
    // ✅ ENABLED - Cool biome effects for every biome!
    if (!biomeRenderer) {
        initBiomeEffects();
    }
    
    console.log('🎨 Updating biome effect:', biomeName);
    
    switch(biomeName.toUpperCase()) {
        case 'NORMAL':
            createNormalBiomeEffect();
            break;
        case 'WINDY':
            createWindyBiomeEffect();
            break;
        case 'SNOWY':
            createSnowyBiomeEffect();
            break;
        case 'BLIZZARD':
            createBlizzardBiomeEffect();
            break;
        case 'RAINY':
            createRainyBiomeEffect();
            break;
        case 'MONSOON':
            createMonsoonBiomeEffect();
            break;
        case 'SANDSTORM':
            createSandstormBiomeEffect();
            break;
        case 'JUNGLE':
            createJungleBiomeEffect();
            break;
        case 'AMAZON':
            createAmazonBiomeEffect();
            break;
        case 'CRIMSON':
            createCrimsonBiomeEffect();
            break;
        case 'STARFALL':
            createStarfallBiomeEffect();
            break;
        case 'METEOR_SHOWER':
            createMeteorShowerBiomeEffect();
            break;
        case 'HELL':
            createHellBiomeEffect();
            break;
        case 'TORNADO':
            createTornadoBiomeEffect();
            break;
        case 'DUNES':
            createDunesBiomeEffect();
            break;
        case 'VOLCANO':
            createVolcanoBiomeEffect();
            break;
        case 'VOID':
            createVoidBiomeEffect();
            break;
        case 'SKY':
            createSkyBiomeEffect();
            break;
        case 'CHARGED':
            createChargedBiomeEffect();
            break;
        case 'BIOLUMINESCENT':
            createBioluminescentBiomeEffect();
            break;
        case 'ANCIENT':
            createAncientBiomeEffect();
            break;
        case 'HALLOW':
            createHallowBiomeEffect();
            break;
        case 'CORRUPTION':
            createCorruptionBiomeEffect();
            break;
        case 'NULL':
            createNullBiomeEffect();
            break;
        case 'GLITCHED':
            createGlitchedBiomeEffect();
            break;
        case 'DREAMSPACE':
            createDreamspaceBiomeEffect();
            break;
        case 'GRAVEYARD':
            createGraveyardBiomeEffect();
            break;
        case 'PUMPKIN_MOON':
            createPumpkinMoonBiomeEffect();
            break;
        case 'BLOOD_RAIN':
        case 'BLOOD RAIN':
            createBloodRainBiomeEffect();
            break;
        default:
            createNormalBiomeEffect();
    }
}

// Make functions globally accessible
if (typeof window !== 'undefined') {
    window.initBiomeEffects = initBiomeEffects;
    window.updateBiomeEffect = updateBiomeEffect;
    window.clearBiomeEffects = clearBiomeEffects;
}

// Auto-initialize when DOM is ready ✅ ENABLED
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initBiomeEffects, 1000);
        });
    } else {
        setTimeout(initBiomeEffects, 1000);
    }
}
