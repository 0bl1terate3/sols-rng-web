// =================================================================
// MISSING BIOME EFFECTS - To be added to biome-effects.js
// =================================================================

// BLIZZARD - Intense snowstorm
function createBlizzardBiomeEffect() {
    clearBiomeEffects();
    
    // Add bright white-blue lights
    for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(0xbfdbfe, 2, 22);
        light.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Heavy snow particles
    for (let i = 0; i < getParticleCount(200); i++) {
        const geometry = new THREE.SphereGeometry(0.12, 6, 6);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        });
        const snow = new THREE.Mesh(geometry, material);
        snow.position.set(
            (Math.random() - 0.5) * 40,
            Math.random() * 25,
            (Math.random() - 0.5) * 40
        );
        biomeScene.add(snow);
        
        biomeParticles.push({
            mesh: snow,
            velocity: {
                x: (Math.random() - 0.5) * 0.1,
                y: -0.1 - Math.random() * 0.05,
                z: (Math.random() - 0.5) * 0.1
            },
            resetY: snow.position.y
        });
    }
    
    // Dense fog
    biomeScene.fog = new THREE.Fog(0xe0f2fe, 8, 30);
    animateBiomeEffect();
}

// MONSOON - Heavy rain and wind
function createMonsoonBiomeEffect() {
    clearBiomeEffects();
    
    // Dark blue lights
    for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(0x1e40af, 1.8, 20);
        light.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Torrential rain
    for (let i = 0; i < getParticleCount(180); i++) {
        const geometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 4);
        const material = new THREE.MeshBasicMaterial({
            color: 0x7dd3fc,
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
                x: (Math.random() - 0.5) * 0.1,
                y: -0.2,
                z: (Math.random() - 0.5) * 0.1
            },
            resetY: drop.position.y
        });
    }
    
    biomeScene.fog = new THREE.Fog(0x1e40af, 12, 35);
    animateBiomeEffect();
}

// JUNGLE - Green vines and fireflies
function createJungleBiomeEffect() {
    clearBiomeEffects();
    
    // Green point lights
    for (let i = 0; i < 4; i++) {
        const light = new THREE.PointLight(0x22c55e, 1.8, 18);
        light.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Firefly particles
    for (let i = 0; i < getParticleCount(80); i++) {
        const geometry = new THREE.SphereGeometry(0.1, 6, 6);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.8
        });
        const firefly = new THREE.Mesh(geometry, material);
        firefly.position.set(
            (Math.random() - 0.5) * 25,
            Math.random() * 15,
            (Math.random() - 0.5) * 25
        );
        biomeScene.add(firefly);
        
        biomeParticles.push({
            mesh: firefly,
            velocity: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            phase: Math.random() * Math.PI * 2
        });
    }
    
    biomeScene.fog = new THREE.Fog(0x059669, 15, 40);
    animateBiomeEffect();
}

// AMAZON - Enhanced jungle with more particles
function createAmazonBiomeEffect() {
    clearBiomeEffects();
    
    // Deep green lights
    for (let i = 0; i < 5; i++) {
        const light = new THREE.PointLight(0x059669, 2, 18);
        light.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Dense vegetation particles
    for (let i = 0; i < getParticleCount(100); i++) {
        const geometry = new THREE.OctahedronGeometry(0.15, 0);
        const material = new THREE.MeshBasicMaterial({
            color: i % 3 === 0 ? 0x10b981 : (i % 3 === 1 ? 0x22c55e : 0x34d399),
            transparent: true,
            opacity: 0.6
        });
        const leaf = new THREE.Mesh(geometry, material);
        leaf.position.set(
            (Math.random() - 0.5) * 30,
            Math.random() * 20,
            (Math.random() - 0.5) * 30
        );
        leaf.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        biomeScene.add(leaf);
        
        biomeParticles.push({
            mesh: leaf,
            velocity: {
                x: (Math.random() - 0.5) * 0.015,
                y: (Math.random() - 0.5) * 0.015,
                z: (Math.random() - 0.5) * 0.015
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            }
        });
    }
    
    biomeScene.fog = new THREE.Fog(0x047857, 12, 38);
    animateBiomeEffect();
}

// METEOR_SHOWER - Falling meteors with trails
function createMeteorShowerBiomeEffect() {
    clearBiomeEffects();
    
    // Orange-gold lights
    for (let i = 0; i < 5; i++) {
        const light = new THREE.PointLight(0xf59e0b, 2.5, 18);
        light.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Meteor particles
    for (let i = 0; i < getParticleCount(40); i++) {
        const geometry = new THREE.ConeGeometry(0.2, 1.5, 6);
        const material = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0xf59e0b : 0xd97706,
            emissive: 0xd97706,
            emissiveIntensity: 0.8
        });
        const meteor = new THREE.Mesh(geometry, material);
        meteor.position.set(
            (Math.random() - 0.5) * 40,
            15 + Math.random() * 10,
            (Math.random() - 0.5) * 40
        );
        meteor.rotation.x = Math.PI;
        biomeScene.add(meteor);
        
        biomeParticles.push({
            mesh: meteor,
            velocity: {
                x: (Math.random() - 0.5) * 0.05,
                y: -0.15 - Math.random() * 0.1,
                z: (Math.random() - 0.5) * 0.05
            },
            resetY: meteor.position.y,
            trail: true
        });
    }
    
    biomeScene.fog = new THREE.Fog(0x78350f, 18, 45);
    animateBiomeEffect();
}

// TORNADO - Spinning vortex particles
function createTornadoBiomeEffect() {
    clearBiomeEffects();
    
    // Gray swirling lights
    for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(0x94a3b8, 1.8, 20);
        light.position.set(
            (Math.random() - 0.5) * 15,
            Math.random() * 10,
            (Math.random() - 0.5) * 15
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Swirling debris
    for (let i = 0; i < getParticleCount(100); i++) {
        const geometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        const material = new THREE.MeshBasicMaterial({
            color: 0x64748b,
            transparent: true,
            opacity: 0.7
        });
        const debris = new THREE.Mesh(geometry, material);
        const angle = (i / 100) * Math.PI * 2;
        const radius = 5 + Math.random() * 10;
        debris.position.set(
            Math.cos(angle) * radius,
            Math.random() * 20,
            Math.sin(angle) * radius
        );
        biomeScene.add(debris);
        
        biomeParticles.push({
            mesh: debris,
            angle: angle,
            radius: radius,
            velocity: {
                y: (Math.random() - 0.5) * 0.05,
                angular: 0.02 + Math.random() * 0.02
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.05,
                y: (Math.random() - 0.5) * 0.05,
                z: (Math.random() - 0.5) * 0.05
            }
        });
    }
    
    biomeScene.fog = new THREE.Fog(0x475569, 10, 35);
    animateBiomeEffect();
}

// DUNES - Sandy waves and heat shimmer
function createDunesBiomeEffect() {
    clearBiomeEffects();
    
    // Warm orange lights
    for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(0xf59e0b, 1.5, 20);
        light.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Sand dust particles
    for (let i = 0; i < getParticleCount(90); i++) {
        const geometry = new THREE.SphereGeometry(0.1, 6, 6);
        const material = new THREE.MeshBasicMaterial({
            color: 0xfbbf24,
            transparent: true,
            opacity: 0.4
        });
        const sand = new THREE.Mesh(geometry, material);
        sand.position.set(
            (Math.random() - 0.5) * 35,
            Math.random() * 12,
            (Math.random() - 0.5) * 35
        );
        biomeScene.add(sand);
        
        biomeParticles.push({
            mesh: sand,
            velocity: {
                x: (Math.random() - 0.3) * 0.03,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.02
            }
        });
    }
    
    biomeScene.fog = new THREE.Fog(0xb45309, 12, 40);
    animateBiomeEffect();
}

// VOLCANO - Lava particles and ash
function createVolcanoBiomeEffect() {
    clearBiomeEffects();
    
    // Orange-red lights
    for (let i = 0; i < 5; i++) {
        const light = new THREE.PointLight(0xff4500, 2.5, 18);
        light.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Lava embers rising
    for (let i = 0; i < getParticleCount(70); i++) {
        const geometry = new THREE.SphereGeometry(0.15, 6, 6);
        const material = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0xff4500 : 0xff6347,
            emissive: 0xff4500,
            emissiveIntensity: 0.8
        });
        const ember = new THREE.Mesh(geometry, material);
        ember.position.set(
            (Math.random() - 0.5) * 25,
            Math.random() * 20 - 5,
            (Math.random() - 0.5) * 25
        );
        biomeScene.add(ember);
        
        biomeParticles.push({
            mesh: ember,
            velocity: {
                x: (Math.random() - 0.5) * 0.02,
                y: 0.05 + Math.random() * 0.05,
                z: (Math.random() - 0.5) * 0.02
            },
            life: Math.random() * 100
        });
    }
    
    biomeScene.fog = new THREE.Fog(0x8b0000, 10, 35);
    animateBiomeEffect();
}

// SKY - Floating clouds and birds
function createSkyBiomeEffect() {
    clearBiomeEffects();
    
    // Bright sky-blue lights
    for (let i = 0; i < 4; i++) {
        const light = new THREE.PointLight(0x87CEEB, 2, 22);
        light.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Cloud particles
    for (let i = 0; i < getParticleCount(60); i++) {
        const geometry = new THREE.SphereGeometry(0.5, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        const cloud = new THREE.Mesh(geometry, material);
        cloud.position.set(
            (Math.random() - 0.5) * 40,
            Math.random() * 15,
            (Math.random() - 0.5) * 40
        );
        biomeScene.add(cloud);
        
        biomeParticles.push({
            mesh: cloud,
            velocity: {
                x: 0.01 + Math.random() * 0.01,
                y: 0,
                z: (Math.random() - 0.5) * 0.005
            }
        });
    }
    
    biomeScene.fog = new THREE.Fog(0x4FC3F7, 20, 50);
    animateBiomeEffect();
}

// CHARGED - Electric arcs and lightning
function createChargedBiomeEffect() {
    clearBiomeEffects();
    
    // Bright yellow lights
    for (let i = 0; i < 5; i++) {
        const light = new THREE.PointLight(0xfbbf24, 2.5, 18);
        light.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Electric sparks
    for (let i = 0; i < getParticleCount(80); i++) {
        const geometry = new THREE.OctahedronGeometry(0.12, 0);
        const material = new THREE.MeshBasicMaterial({
            color: 0xeab308,
            emissive: 0xfbbf24,
            emissiveIntensity: 1.0
        });
        const spark = new THREE.Mesh(geometry, material);
        spark.position.set(
            (Math.random() - 0.5) * 30,
            Math.random() * 20,
            (Math.random() - 0.5) * 30
        );
        biomeScene.add(spark);
        
        biomeParticles.push({
            mesh: spark,
            velocity: {
                x: (Math.random() - 0.5) * 0.1,
                y: (Math.random() - 0.5) * 0.1,
                z: (Math.random() - 0.5) * 0.1
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.1,
                y: (Math.random() - 0.5) * 0.1,
                z: (Math.random() - 0.5) * 0.1
            }
        });
    }
    
    biomeScene.fog = new THREE.Fog(0xca8a04, 12, 38);
    animateBiomeEffect();
}

// BIOLUMINESCENT - Glowing cyan particles
function createBioluminescentBiomeEffect() {
    clearBiomeEffects();
    
    // Cyan glowing lights
    for (let i = 0; i < 6; i++) {
        const light = new THREE.PointLight(0x00FFFF, 2.5, 20);
        light.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Glowing organisms
    for (let i = 0; i < getParticleCount(90); i++) {
        const geometry = new THREE.SphereGeometry(0.15, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: i % 3 === 0 ? 0x00FFFF : (i % 3 === 1 ? 0x00CED1 : 0x7FFFD4),
            emissive: 0x00FFFF,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.9
        });
        const glow = new THREE.Mesh(geometry, material);
        glow.position.set(
            (Math.random() - 0.5) * 30,
            Math.random() * 20,
            (Math.random() - 0.5) * 30
        );
        biomeScene.add(glow);
        
        biomeParticles.push({
            mesh: glow,
            velocity: {
                x: (Math.random() - 0.5) * 0.015,
                y: (Math.random() - 0.5) * 0.015,
                z: (Math.random() - 0.5) * 0.015
            },
            phase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.05 + Math.random() * 0.05
        });
    }
    
    biomeScene.fog = new THREE.Fog(0x006666, 10, 38);
    animateBiomeEffect();
}

// ANCIENT - Golden dust and stone fragments
function createAncientBiomeEffect() {
    clearBiomeEffects();
    
    // Warm golden lights
    for (let i = 0; i < 4; i++) {
        const light = new THREE.PointLight(0xD4AF37, 1.8, 20);
        light.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Ancient runes and dust
    for (let i = 0; i < getParticleCount(70); i++) {
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.05);
        const material = new THREE.MeshBasicMaterial({
            color: 0xC2B280,
            transparent: true,
            opacity: 0.7
        });
        const rune = new THREE.Mesh(geometry, material);
        rune.position.set(
            (Math.random() - 0.5) * 30,
            Math.random() * 18,
            (Math.random() - 0.5) * 30
        );
        rune.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        biomeScene.add(rune);
        
        biomeParticles.push({
            mesh: rune,
            velocity: {
                x: (Math.random() - 0.5) * 0.01,
                y: Math.random() * 0.01,
                z: (Math.random() - 0.5) * 0.01
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            }
        });
    }
    
    biomeScene.fog = new THREE.Fog(0x8B7355, 15, 42);
    animateBiomeEffect();
}

// HALLOW - Pink and cyan magical particles
function createHallowBiomeEffect() {
    clearBiomeEffects();
    
    // Pink and cyan alternating lights
    for (let i = 0; i < 5; i++) {
        const light = new THREE.PointLight(i % 2 === 0 ? 0xFF69B4 : 0x00CED1, 2.2, 18);
        light.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        biomeScene.add(light);
        biomeLights.push(light);
    }
    
    // Rainbow sparkles
    for (let i = 0; i < getParticleCount(90); i++) {
        const geometry = new THREE.OctahedronGeometry(0.15, 0);
        const material = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0xFF69B4 : 0x00CED1,
            emissive: i % 2 === 0 ? 0xFF1493 : 0x00CED1,
            emissiveIntensity: 0.7,
            transparent: true,
            opacity: 0.8
        });
        const sparkle = new THREE.Mesh(geometry, material);
        sparkle.position.set(
            (Math.random() - 0.5) * 30,
            Math.random() * 20,
            (Math.random() - 0.5) * 30
        );
        biomeScene.add(sparkle);
        
        biomeParticles.push({
            mesh: sparkle,
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
    
    biomeScene.fog = new THREE.Fog(0x8B3A62, 12, 40);
    animateBiomeEffect();
}
