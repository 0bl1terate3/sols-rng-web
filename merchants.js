// =================================================================
// Merchant System - Mari (White Merchant) & Jester (Dark Merchant)
// =================================================================

// Mari's Shop Items (White Merchant) - Random shop with common items
function generateMariShop() {
    const shop = {};
    
    // Always available basic items
    shop['Lucky Potion'] = { cost: 500, currency: 'money', type: 'potion', stock: 'unlimited' };
    shop['Speed Potion'] = { cost: 400, currency: 'money', type: 'potion', stock: 'unlimited' };
    
    // Random pool of items (3-5 items per shop)
    const possibleItems = [
        { name: 'Lucky Potion L', cost: 2000, currency: 'money', type: 'potion', stock: 10 },
        { name: 'Lucky Potion XL', cost: 5000, currency: 'money', type: 'potion', stock: 5 },
        { name: 'Speed Potion L', cost: 1800, currency: 'money', type: 'potion', stock: 8 },
        { name: 'Mixed Potion', cost: 3000, currency: 'money', type: 'potion', stock: 5 },
        { name: 'Fortune Potion I', cost: 8000, currency: 'money', type: 'potion', stock: 3 },
        { name: 'Fortune Potion II', cost: 15000, currency: 'money', type: 'potion', stock: 2 },
        { name: 'Haste Potion I', cost: 7000, currency: 'money', type: 'potion', stock: 3 },
        { name: 'Random Rune Chest', cost: 5000, currency: 'money', type: 'item', stock: 5 },
        { name: 'Void Coin', cost: 50000, currency: 'money', type: 'currency', stock: 2, amount: 1 },
        { name: 'Gear Basing', cost: 1500, currency: 'money', type: 'item', stock: 15 },
        { name: 'Rainbow Syrup', cost: 3000, currency: 'money', type: 'item', stock: 10 },
        { name: 'Jewelry Potion', cost: 10000, currency: 'money', type: 'potion', stock: 2 }
    ];
    
    // Randomly select 3-5 items
    const itemCount = 3 + Math.floor(Math.random() * 3); // 3-5 items
    const shuffled = possibleItems.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, itemCount);
    
    selected.forEach(item => {
        shop[item.name] = { ...item };
    });
    
    return shop;
}

const MARI_SHOP = generateMariShop();

// Jester's Shop Items (Dark Merchant) - Random shop with OP potions
function generateJesterShop() {
    const shop = {};
    
    // Rare mega potions with chance to appear
    // 50% chance for Heavenly Potion
    if (Math.random() < 0.5) {
        shop['Heavenly Potion'] = { cost: 25000, currency: 'money', type: 'potion', stock: 2 };
    }
    
    // 20% chance for Oblivion Potion (rarer!)
    if (Math.random() < 0.2) {
        shop['Oblivion Potion'] = { cost: 5, currency: 'voidCoins', type: 'potion', stock: 1 };
    }
    
    // Random pool of runes and dark items (3-6 items per shop)
    const possibleItems = [
        { name: 'Rune of Wind', cost: 100, currency: 'darkPoints', type: 'rune', stock: 3 },
        { name: 'Rune of Frost', cost: 100, currency: 'darkPoints', type: 'rune', stock: 3 },
        { name: 'Rune of Rainstorm', cost: 100, currency: 'darkPoints', type: 'rune', stock: 3 },
        { name: 'Rune of Dust', cost: 100, currency: 'darkPoints', type: 'rune', stock: 3 },
        { name: 'Rune of Hell', cost: 150, currency: 'darkPoints', type: 'rune', stock: 2 },
        { name: 'Rune of Galaxy', cost: 200, currency: 'darkPoints', type: 'rune', stock: 2 },
        { name: 'Rune of Corruption', cost: 200, currency: 'darkPoints', type: 'rune', stock: 2 },
        { name: 'Rune of Nothing', cost: 200, currency: 'darkPoints', type: 'rune', stock: 2 },
        { name: 'Fortune Potion III', cost: 300, currency: 'darkPoints', type: 'potion', stock: 2 },
        { name: 'Haste Potion II', cost: 250, currency: 'darkPoints', type: 'potion', stock: 2 },
        { name: 'Forbidden Potion I', cost: 180, currency: 'darkPoints', type: 'potion', stock: 3 },
        { name: 'Chaos Potion', cost: 350, currency: 'darkPoints', type: 'potion', stock: 1 }
    ];
    
    // Randomly select 3-6 items
    const itemCount = 3 + Math.floor(Math.random() * 4); // 3-6 items
    const shuffled = possibleItems.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, itemCount);
    
    selected.forEach(item => {
        shop[item.name] = { ...item };
    });
    
    return shop;
}

const JESTER_SHOP = generateJesterShop();

// Bounty Hunter Jack's Shop - Sells potions, runes, and base items (NO AURAS)
// This function generates the shop from all game data
function generateBountyJackShop() {
    const shop = {};
    
    // Base items
    shop['Lucky Potion'] = { cost: 10, type: 'potion', stock: 'unlimited' };
    shop['Speed Potion'] = { cost: 10, type: 'potion', stock: 'unlimited' };
    shop['Gear Basing'] = { cost: 50, type: 'item', stock: 'unlimited' };
    shop['Rainbow Syrup'] = { cost: 100, type: 'item', stock: 'unlimited' };
    shop['Darklight Shard'] = { cost: 150, type: 'item', stock: 'unlimited' };
    shop['Darklight Orb'] = { cost: 300, type: 'item', stock: 'unlimited' };
    shop['Darklight Core'] = { cost: 500, type: 'item', stock: 'unlimited' };
    
    // Add ALL RUNES
    const allRunes = [
        { name: 'Rune of Wind', cost: 200 },
        { name: 'Rune of Frost', cost: 200 },
        { name: 'Rune of Rainstorm', cost: 200 },
        { name: 'Rune of Dust', cost: 200 },
        { name: 'Rune of Hell', cost: 300 },
        { name: 'Rune of Galaxy', cost: 400 },
        { name: 'Rune of Corruption', cost: 400 },
        { name: 'Rune of Nothing', cost: 400 },
        { name: 'Rune of Eclipse', cost: 500 },
        { name: 'Rune of Everything', cost: 1000 },
        { name: 'Rune of Pumpkin Moon', cost: 2000 },
        { name: 'Rune of Graveyard', cost: 2000 },
        { name: 'Rune of Blood Rain', cost: 3000 }
    ];
    allRunes.forEach(rune => {
        shop[rune.name] = { cost: rune.cost, type: 'rune', stock: 'unlimited' };
    });
    
    // Add ALL POTIONS from POTION_RECIPES (if it exists)
    // Blacklist certain endgame/special potions
    const potionBlacklist = ['Pump Kings Blood', '???', 'Godlike Potion'];
    
    if (typeof POTION_RECIPES !== 'undefined') {
        POTION_RECIPES.forEach(potion => {
            // Skip blacklisted potions
            if (potionBlacklist.includes(potion.name)) return;
            
            let cost = 20; // base cost
            
            // Simple, effective pricing with hard caps
            if (potion.luckBoost) {
                if (potion.luckBoost <= 1) {
                    // 0-100% luck: 20-70 medals
                    cost += Math.floor(potion.luckBoost * 50);
                } else if (potion.luckBoost <= 5) {
                    // 100-500% luck: 70-200 medals
                    cost += Math.floor(potion.luckBoost * 30);
                } else if (potion.luckBoost <= 50) {
                    // 500%-5000% luck: 200-800 medals
                    cost += Math.floor(potion.luckBoost * 15);
                } else if (potion.luckBoost <= 1000) {
                    // 5000%-100K% luck: 800-3000 medals
                    cost += Math.floor(potion.luckBoost * 3);
                } else {
                    // Over 100K% luck: CAP at 3000-5000 based on power
                    cost += 3000 + Math.min(2000, Math.floor(Math.sqrt(potion.luckBoost)));
                }
            }
            
            if (potion.speedBoost) {
                if (potion.speedBoost <= 1) {
                    cost += Math.floor(potion.speedBoost * 100);
                } else {
                    // High speed boosts capped at +500
                    cost += Math.min(500, Math.floor(potion.speedBoost * 50));
                }
            }
            
            // Absolute maximum cost: 6,000 medals
            cost = Math.min(6000, Math.max(20, cost));
            
            shop[potion.name] = { cost, type: 'potion', stock: 'unlimited' };
        });
    }
    
    return shop;
}

const BOUNTY_JACK_SHOP = generateBountyJackShop();

// Items Jester will buy for Dark Points (biome-exclusive auras)
const JESTER_BUYLIST = {
    'Stormal': 50,
    'Permafrost': 60,
    'Aquatic': 45,
    'Wind': 30,
    'Sidereum': 70,
    'Solar': 40,
    'Lunar': 40,
    'Nautilus': 80
};

function initMerchantSystem() {
    if (!gameState.merchants) {
        gameState.merchants = {
            lastSpawn: null,
            currentMerchant: null,
            spawnTime: null,
            nextSpawnMin: 15,
            nextSpawnMax: 45,
            isActive: false,
            mariStock: generateMariShop(),
            jesterStock: generateJesterShop(),
            bountyJackStock: JSON.parse(JSON.stringify(BOUNTY_JACK_SHOP))
        };
    }
    
    // Check if it's nighttime and spawn Jack if needed
    setTimeout(() => {
        if (typeof biomeState !== 'undefined' && !biomeState.isDay) {
            if (typeof handleBountyJackSpawn === 'function') {
                handleBountyJackSpawn();
            }
        }
    }, 1000);
    
    // Initialize currency if not present
    if (!gameState.currency) {
        gameState.currency = {
            money: 0,
            voidCoins: 0,
            darkPoints: 0,
            halloweenMedals: 0
        };
    }
    
    // Add click-outside-to-close for merchant shop modal
    const merchantModal = document.getElementById('achievementsContainer');
    if (merchantModal) {
        merchantModal.addEventListener('click', (e) => {
            if (e.target === merchantModal) {
                dismissMerchant();
            }
        });
    }
    
    // Start merchant spawn timer
    scheduleMerchantSpawn();
    
    console.log('Merchant system initialized!');
}

function scheduleMerchantSpawn() {
    // Spawn every 5-10 minutes (aligned with biome/day-night cycles)
    const minTime = 5 * 60 * 1000; // 5 minutes in ms
    const maxTime = 10 * 60 * 1000; // 10 minutes in ms
    const spawnDelay = Math.random() * (maxTime - minTime) + minTime;
    
    console.log(`Next merchant will spawn in ${Math.floor(spawnDelay / 60000)} minutes`);
    
    // Clear any existing timeout
    if (gameState.merchants.spawnTimeout) {
        clearTimeout(gameState.merchants.spawnTimeout);
    }
    
    gameState.merchants.spawnTimeout = setTimeout(() => {
        // Allow multiple merchants to be active at once
        spawnMerchant();
    }, spawnDelay);
}

function spawnMerchant() {
    // Don't spawn if any merchant is already active
    if (gameState.merchants.isActive) {
        console.log('A merchant is already active, skipping spawn');
        scheduleMerchantSpawn(); // Try again later
        return;
    }
    
    // 60% chance for Mari, 40% for Jester (more balanced)
    const isMari = Math.random() < 0.6;
    const merchantType = isMari ? 'mari' : 'jester';
    
    gameState.merchants.currentMerchant = merchantType;
    gameState.merchants.isActive = true;
    gameState.merchants.spawnTime = Date.now();
    
    // Generate new random shop inventory for this spawn
    if (merchantType === 'mari') {
        gameState.merchants.mariStock = generateMariShop();
    } else {
        gameState.merchants.jesterStock = generateJesterShop();
    }
    
    // Show merchant spawn effect
    showMerchantSpawn(merchantType);
    
    console.log(`${merchantType === 'mari' ? 'Mari' : 'Jester'} has spawned!`);
    
    // Auto-dismiss after 2.5 minutes (150 seconds)
    const merchantDuration = 150 * 1000; // 2.5 minutes
    gameState.merchants.dismissTimeout = setTimeout(() => {
        if (gameState.merchants.currentMerchant === merchantType) {
            dismissMerchant();
            console.log(`${merchantType === 'mari' ? 'Mari' : 'Jester'} left after 2.5 minutes`);
        }
    }, merchantDuration);
    
    // Schedule next merchant spawn
    scheduleMerchantSpawn();
}

// Handle Bounty Hunter Jack spawning/despawning based on day/night cycle
window.handleBountyJackSpawn = function() {
    if (!biomeState) return;
    
    // Initialize merchants if not already done
    if (!gameState.merchants) {
        initMerchantSystem();
    }
    
    // Night time - spawn Jack
    if (!biomeState.isDay) {
        // If Jack is already active, don't respawn
        if (gameState.merchants.currentMerchant === 'jack') {
            console.log('🎃 Jack is already active');
            return;
        }
        
        // If another merchant is active, dismiss them for Jack
        if (gameState.merchants.isActive && gameState.merchants.currentMerchant !== 'jack') {
            console.log(`Dismissing ${gameState.merchants.currentMerchant} for Jack's arrival`);
            dismissMerchant();
        }
        
        // Spawn Jack (stays until sunrise)
        gameState.merchants.currentMerchant = 'jack';
        gameState.merchants.isActive = true;
        gameState.merchants.spawnTime = Date.now();
        
        // Clear any dismiss timeout since Jack stays until sunrise
        if (gameState.merchants.dismissTimeout) {
            clearTimeout(gameState.merchants.dismissTimeout);
            gameState.merchants.dismissTimeout = null;
        }
        
        // Show Jack's spawn with orange beam
        showMerchantSpawn('jack');
        console.log('🎃 Bounty Hunter Jack has appeared at nightfall!');
        saveGameState();
    } else {
        // Day time - despawn Jack if he's active
        if (gameState.merchants.currentMerchant === 'jack') {
            dismissMerchant();
            showNotification('🌅 Bounty Hunter Jack has departed at sunrise.');
            console.log('🌅 Bounty Hunter Jack left at sunrise');
            saveGameState();
        }
    }
};

function showMerchantSpawn(merchantType) {
    const isMari = merchantType === 'mari';
    const isJack = merchantType === 'jack';
    
    // Beam of light effect disabled by user request
    /*
    // Determine beam color
    let beamColor;
    if (isJack) {
        beamColor = 'rgba(255,140,0,0.8)'; // Orange for Jack
    } else if (isMari) {
        beamColor = 'rgba(255,255,255,0.8)'; // White for Mari
    } else {
        beamColor = 'rgba(128,0,255,0.8)'; // Purple for Jester
    }
    
    // Create beam of light effect
    const beam = document.createElement('div');
    beam.id = 'merchantBeam';
    beam.style.cssText = `
        position: fixed;
        left: 50%;
        bottom: 0;
        width: 200px;
        height: 100vh;
        margin-left: -100px;
        background: linear-gradient(to top, ${beamColor}, transparent);
        pointer-events: none;
        z-index: 9998;
        animation: beamPulse 2s ease-in-out infinite;
    `;
    
    document.body.appendChild(beam);
    */
    
    // Play unique sound for each merchant using Howler.js
    if (typeof Howl !== 'undefined') {
        let soundConfig;
        
        if (isJack) {
            // Jack: Spooky Halloween bell sound (lower pitch, eerie)
            soundConfig = {
                src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFgn17d3JpZF9hY2dpa2xvcnJ4fYGEhoiKjI2Oj5CRkpKTk5OTk5KSkI6Ni4iFgn99eXVxbmpmZGJhYGBgYWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3d3h4eXl5eXl5eHh3d3Z1dHNycW9ubGppaGdmZGNiYGBgYGBgYGBhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeFhIJ/fHl1cW1qZ2RhXltZV1VUU1JRUVBQUFBQUFBRUVJSU1RVVldYWVtdXmBjZWhrcHN2eXx/goWHiouMjY2Oj42Ni4mHhIKAfXp3c3BtamdkYV5bWVdVU1FSUFFQUFBPTk5OTk5PT1BQUVFSUlNUVVZXWFlbXV9hZGZpa3B0eHt+gYSHiYuNjo+QkJCPjo2LiYeFg4B9enZzb2tnZGFdWlhVU1BOS0lHRkVEQ0NCQkFBQUFBQkJCQ0NFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w=='],
                volume: 0.4,
                rate: 0.7,  // Lower pitch for spooky effect
                onend: function() { console.log('Jack sound finished'); }
            };
        } else if (isMari) {
            // Mari: Bright magical chime (higher pitch, cheerful)
            soundConfig = {
                src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFgn17d3JpZF9hY2dpa2xvcnJ4fYGEhoiKjI2Oj5CRkpKTk5OTk5KSkI6Ni4iFgn99eXVxbmpmZGJhYGBgYWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3d3h4eXl5eXl5eHh3d3Z1dHNycW9ubGppaGdmZGNiYGBgYGBgYGBhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeFhIJ/fHl1cW1qZ2RhXltZV1VUU1JRUVBQUFBQUFBRUVJSU1RVVldYWVtdXmBjZWhrcHN2eXx/goWHiouMjY2Oj42Ni4mHhIKAfXp3c3BtamdkYV5bWVdVU1FSUFFQUFBPTk5OTk5PT1BQUVFSUlNUVVZXWFlbXV9hZGZpa3B0eHt+gYSHiYuNjo+QkJCPjo2LiYeFg4B9enZzb2tnZGFdWlhVU1BOS0lHRkVEQ0NCQkFBQUFBQkJCQ0NFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w=='],
                volume: 0.5,
                rate: 1.5,  // Higher pitch for magical effect
                onend: function() { console.log('Mari sound finished'); }
            };
        } else {
            // Jester: Dark mysterious tone (medium-low pitch, ominous)
            soundConfig = {
                src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFgn17d3JpZF9hY2dpa2xvcnJ4fYGEhoiKjI2Oj5CRkpKTk5OTk5KSkI6Ni4iFgn99eXVxbmpmZGJhYGBgYWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3d3h4eXl5eXl5eHh3d3Z1dHNycW9ubGppaGdmZGNiYGBgYGBgYGBhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeFhIJ/fHl1cW1qZ2RhXltZV1VUU1JRUVBQUFBQUFBRUVJSU1RVVldYWVtdXmBjZWhrcHN2eXx/goWHiouMjY2Oj42Ni4mHhIKAfXp3c3BtamdkYV5bWVdVU1FSUFFQUFBPTk5OTk5PT1BQUVFSUlNUVVZXWFlbXV9hZGZpa3B0eHt+gYSHiYuNjo+QkJCPjo2LiYeFg4B9enZzb2tnZGFdWlhVU1BOS0lHRkVEQ0NCQkFBQUFBQkJCQ0NFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w=='],
                volume: 0.45,
                rate: 0.9,  // Slightly lower pitch for mysterious effect
                onend: function() { console.log('Jester sound finished'); }
            };
        }
        
        try {
            const sound = new Howl(soundConfig);
            sound.play();
        } catch (e) {
            console.log('Howler audio error:', e);
        }
    } else {
        // Fallback to basic audio if Howler not loaded
        try {
            const audio = new Audio('boom.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio play failed:', e));
        } catch (e) {
            console.log('Audio error:', e);
        }
    }
    
    // Show notification
    const notification = document.createElement('div');
    
    // Determine merchant colors and text
    let bgGradient, borderColor, icon, title;
    if (isJack) {
        bgGradient = 'linear-gradient(135deg, #ff8c00 0%, #ff6600 100%)';
        borderColor = '#ffa500';
        icon = '🎃';
        title = 'BOUNTY HUNTER JACK HAS ARRIVED!';
    } else if (isMari) {
        bgGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        borderColor = '#fff';
        icon = '✨';
        title = 'MARI HAS ARRIVED!';
    } else {
        bgGradient = 'linear-gradient(135deg, #5a189a 0%, #240046 100%)';
        borderColor = '#a855f7';
        icon = '🌀';
        title = 'JESTER HAS ARRIVED!';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${bgGradient};
        color: white;
        padding: 50px 80px;
        border-radius: 20px;
        font-size: 28px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 20px 60px rgba(0,0,0,0.7);
        animation: merchantNotif 1s ease-out;
        cursor: pointer;
        border: 4px solid ${borderColor};
    `;
    notification.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 64px; margin-bottom: 15px;">${icon}</div>
            <div style="font-size: 32px; margin-bottom: 10px;">${title}</div>
            <div style="font-size: 20px; margin-top: 15px; opacity: 0.9; background: rgba(0,0,0,0.3); padding: 15px 30px; border-radius: 10px;">👆 CLICK ANYWHERE TO OPEN SHOP</div>
        </div>
    `;
    
    notification.onclick = () => {
        if (isJack) {
            openBountyJackShop();
        } else {
            openMerchantShop(merchantType);
        }
        notification.remove();
    };
    
    document.body.appendChild(notification);
    
    // Keep notification visible for entire merchant duration
    // Mari/Jester: 2.5 minutes, Jack: until sunrise
    const notificationDuration = isJack ? 300000 : 150000; // Jack: 5 min max, others: 2.5 min
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, notificationDuration);
    
    saveGameState();
}

function openMerchantShop(merchantType) {
    const isMari = merchantType === 'mari';
    
    // Initialize merchant system if not already done
    if (!gameState.merchants) {
        initMerchantSystem();
    }
    
    // Ensure shop stock exists, initialize if missing
    if (!gameState.merchants.mariStock) {
        gameState.merchants.mariStock = JSON.parse(JSON.stringify(MARI_SHOP));
    }
    if (!gameState.merchants.jesterStock) {
        gameState.merchants.jesterStock = JSON.parse(JSON.stringify(JESTER_SHOP));
    }
    
    const shop = isMari ? gameState.merchants.mariStock : gameState.merchants.jesterStock;
    
    // Safety check: ensure shop exists after initialization
    if (!shop) {
        console.error('Shop stock still not initialized after safety check!');
        showNotification('❌ Shop initialization failed!');
        return;
    }
    
    // Quality of Life: Sort shop items by cost
    const sortedItems = Object.entries(shop).sort((a, b) => a[1].cost - b[1].cost);
    
    let html = `
        <div style="max-width: 800px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: ${isMari ? '#fff' : '#a855f7'}; font-size: 32px; margin-bottom: 10px;">
                    ${isMari ? '✨ Mari\'s Shop' : '🌀 Jester\'s Shop'}
                </h2>
                <div style="font-size: 14px; color: #aaa; margin-bottom: 15px;">
                    ${isMari ? 'The White Merchant' : 'The Dark Merchant'}
                </div>
                <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">
                    <div style="background: rgba(0,0,0,0.3); padding: 10px 20px; border-radius: 8px;">
                        <strong>💰 Money:</strong> ${gameState.currency.money.toLocaleString()}
                    </div>
                    ${!isMari ? `<div style="background: rgba(0,0,0,0.3); padding: 10px 20px; border-radius: 8px;">
                        <strong>🌑 Dark Points:</strong> ${gameState.currency.darkPoints.toLocaleString()}
                    </div>` : ''}
                    <div style="background: rgba(0,0,0,0.3); padding: 10px 20px; border-radius: 8px;">
                        <strong>🌀 Void Coins:</strong> ${gameState.currency.voidCoins.toLocaleString()}
                    </div>
                </div>
                <button onclick="dismissMerchant()" style="margin-top: 15px; padding: 10px 25px; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    Dismiss Merchant
                </button>
            </div>
            
            ${!isMari ? `
            <div style="margin-bottom: 30px; padding: 20px; background: rgba(88,28,135,0.2); border: 2px solid #a855f7; border-radius: 12px;">
                <h3 style="color: #a855f7; margin-bottom: 15px;">💰 Sell Biome Items for Dark Points</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
                    ${Object.entries(JESTER_BUYLIST).map(([item, price]) => {
                        const owned = gameState.inventory.auras[item]?.count || 0;
                        return `
                            <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; ${owned > 0 ? '' : 'opacity: 0.5;'}">
                                <div style="font-weight: bold; margin-bottom: 5px;">${item}</div>
                                <div style="font-size: 13px; color: #a855f7;">+${price} Dark Points</div>
                                <div style="font-size: 12px; color: #888; margin-top: 5px;">Owned: ${owned}</div>
                                ${owned > 0 ? `<button onclick="sellToJester('${item}')" style="margin-top: 8px; padding: 5px 15px; background: #7c3aed; color: white; border: none; border-radius: 5px; cursor: pointer; width: 100%; font-size: 12px;">Sell 1</button>` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            ` : ''}
            
            <div>
                <h3 style="color: ${isMari ? '#667eea' : '#a855f7'}; margin-bottom: 15px;">
                    🛒 ${isMari ? 'Shop Items' : 'Dark Shop Items'}
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
                    ${sortedItems.map(([itemName, data]) => {
                        // Determine currency type and check affordability
                        let currencyType, currencyIcon, currencyLabel, canAfford;
                        
                        currencyType = data.currency || (isMari ? 'money' : 'darkPoints');
                        
                        if (currencyType === 'voidCoins') {
                            currencyIcon = '🌀';
                            currencyLabel = 'Void Coins';
                            canAfford = gameState.currency.voidCoins >= data.cost;
                        } else if (currencyType === 'money') {
                            currencyIcon = '💰';
                            currencyLabel = 'Coins';
                            canAfford = gameState.currency.money >= data.cost;
                        } else {
                            currencyIcon = '🌑';
                            currencyLabel = 'Dark Points';
                            canAfford = gameState.currency.darkPoints >= data.cost;
                        }
                        
                        const stockLeft = data.stock === 'unlimited' ? '∞' : data.stock;
                        const soldOut = data.stock !== 'unlimited' && data.stock <= 0;
                        
                        // Rainbow styling for Rainbow Syrup
                        const isRainbowItem = itemName === 'Rainbow Syrup';
                        const rainbowStyle = isRainbowItem ? 'background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: rainbow-shift 3s linear infinite; background-size: 200% 100%;' : '';
                        
                        return `
                            <div style="background: ${soldOut ? 'rgba(50,50,50,0.3)' : 'rgba(0,0,0,0.3)'}; padding: 15px; border-radius: 10px; border: 2px solid ${canAfford && !soldOut ? (isMari ? '#667eea' : '#7c3aed') : '#444'}; ${soldOut ? 'opacity: 0.5;' : ''}">
                                <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; ${rainbowStyle}">${itemName}</div>
                                <div style="color: ${currencyType === 'voidCoins' ? '#c084fc' : (isMari ? '#fbbf24' : '#c084fc')}; margin-bottom: 8px;">
                                    ${currencyIcon} ${data.cost.toLocaleString()} ${currencyLabel}
                                </div>
                                <div style="font-size: 13px; color: #888; margin-bottom: 10px;">
                                    Stock: ${soldOut ? 'SOLD OUT' : stockLeft}
                                </div>
                                ${!soldOut ? `
                                    <button onclick="buyFromMerchant('${merchantType}', '${itemName}')" 
                                        style="padding: 8px 20px; background: ${canAfford ? (isMari ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #7c3aed 0%, #5a189a 100%)') : '#555'}; 
                                        color: white; border: none; border-radius: 5px; cursor: ${canAfford ? 'pointer' : 'not-allowed'}; width: 100%; font-weight: bold;"
                                        ${!canAfford ? 'disabled' : ''}>
                                        ${canAfford ? 'BUY' : 'Cannot Afford'}
                                    </button>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    
    const container = document.getElementById('achievementsContainer');
    if (container) {
        const modalContent = container.querySelector('.modal-content');
        if (modalContent) {
            modalContent.innerHTML = html;
        }
        container.classList.add('show');
    }
}

// Make functions globally available
window.buyFromMerchant = function(merchantType, itemName) {
    const isMari = merchantType === 'mari';
    const shop = isMari ? gameState.merchants.mariStock : gameState.merchants.jesterStock;
    const item = shop[itemName];
    
    if (!item) return;
    
    // Check stock
    if (item.stock !== 'unlimited' && item.stock <= 0) {
        showNotification('❌ Item sold out!');
        return;
    }
    
    // Determine currency type and check/deduct
    let currencyType = item.currency || (isMari ? 'money' : 'darkPoints');
    
    // Check if player has enough currency
    if (gameState.currency[currencyType] < item.cost) {
        const currencyName = currencyType === 'money' ? 'coins' : (currencyType === 'voidCoins' ? 'Void Coins' : 'Dark Points');
        showNotification(`❌ Not enough ${currencyName}!`);
        return;
    }
    
    // Deduct currency
    gameState.currency[currencyType] -= item.cost;
    
    // Track merchant purchase for achievements
    const merchantName = isMari ? 'Mari' : (merchantType === 'jack' ? 'Jack' : 'Jester');
    if (typeof trackMerchantPurchase === 'function') {
        trackMerchantPurchase(merchantName, item.cost);
    }
    
    // Track currency changes
    if (typeof trackCurrencyChange === 'function') {
        trackCurrencyChange(currencyType, item.cost, false);
    }
    
    // Reduce stock
    if (item.stock !== 'unlimited') {
        item.stock--;
    }
    
    // Give item
    if (item.type === 'potion') {
        if (!gameState.inventory.potions[itemName]) {
            gameState.inventory.potions[itemName] = { count: 0 };
        }
        gameState.inventory.potions[itemName].count++;
        showNotification(`✅ Purchased ${itemName}!`);
    } else if (item.type === 'item') {
        if (!gameState.inventory.items[itemName]) {
            gameState.inventory.items[itemName] = { count: 0 };
        }
        gameState.inventory.items[itemName].count++;
        showNotification(`✅ Purchased ${itemName}!`);
    } else if (item.type === 'rune') {
        if (!gameState.inventory.runes[itemName]) {
            gameState.inventory.runes[itemName] = { count: 0 };
        }
        gameState.inventory.runes[itemName].count++;
        showNotification(`✅ Purchased ${itemName}!`);
    } else if (item.type === 'currency' && itemName === 'Void Coin') {
        gameState.currency.voidCoins += (item.amount || 1);
        showNotification(`✅ Purchased ${item.amount || 1} Void Coin!`);
    }
    
    saveGameState();
    updateUI();
    updateInventoryDisplay();
    
    // Refresh shop display
    openMerchantShop(merchantType);
};

window.sellToJester = function(auraName) {
    const owned = gameState.inventory.auras[auraName]?.count || 0;
    if (owned <= 0) {
        showNotification('❌ You don\'t have this aura!');
        return;
    }
    
    const price = JESTER_BUYLIST[auraName];
    if (!price) return;
    
    // Remove one aura
    gameState.inventory.auras[auraName].count--;
    if (gameState.inventory.auras[auraName].count <= 0) {
        delete gameState.inventory.auras[auraName];
    }
    
    // Add dark points
    gameState.currency.darkPoints = (gameState.currency.darkPoints || 0) + price;
    
    showNotification(`✅ Sold ${auraName} for ${price} Dark Points!`);
    
    saveGameState();
    updateUI();
    updateInventoryDisplay();
    
    // Refresh shop
    openMerchantShop('jester');
};

window.dismissMerchant = function() {
    // Clear any active merchant
    gameState.merchants.isActive = false;
    gameState.merchants.currentMerchant = null;
    
    // Clear dismiss timeout if it exists
    if (gameState.merchants.dismissTimeout) {
        clearTimeout(gameState.merchants.dismissTimeout);
        gameState.merchants.dismissTimeout = null;
    }
    
    // Reset stocks with NEW random shops
    gameState.merchants.mariStock = generateMariShop();
    gameState.merchants.jesterStock = generateJesterShop();
    
    // Remove beam effect
    const beam = document.getElementById('merchantBeam');
    if (beam) beam.remove();
    
    // Close shop
    const container = document.getElementById('achievementsContainer');
    if (container) {
        container.classList.remove('show');
        const modalContent = container.querySelector('.modal-content');
        if (modalContent) {
            modalContent.innerHTML = '';
        }
    }
    
    saveGameState();
};

// Debug function to force spawn merchants (accessible via console)
window.debugSpawnMerchant = function(type) {
    if (!gameState.merchants) initMerchantSystem();
    const merchantType = type === 'jester' ? 'jester' : 'mari';
    gameState.merchants.currentMerchant = merchantType;
    gameState.merchants.isActive = true;
    gameState.merchants.spawnTime = Date.now();
    showMerchantSpawn(merchantType);
    console.log(`Debug: Spawned ${merchantType}!`);
};

// Bounty Hunter Jack - Always accessible shop for Halloween items
window.openBountyJackShop = function() {
    // Initialize merchant system if not already done
    if (!gameState.merchants) {
        initMerchantSystem();
    }
    
    // Ensure shop stock exists
    if (!gameState.merchants.bountyJackStock) {
        gameState.merchants.bountyJackStock = JSON.parse(JSON.stringify(BOUNTY_JACK_SHOP));
    }
    
    const shop = gameState.merchants.bountyJackStock;
    const halloweenMedals = gameState.currency?.halloweenMedals || 0;
    
    // Sort shop items by cost
    const sortedItems = Object.entries(shop).sort((a, b) => a[1].cost - b[1].cost);
    
    let html = `
        <div style="max-width: 900px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #ff8c00; font-size: 36px; margin-bottom: 10px; text-shadow: 0 0 10px rgba(255, 140, 0, 0.5);">
                    🎃 Bounty Hunter Jack 🎃
                </h2>
                <div style="font-size: 16px; color: #ff6600; margin-bottom: 15px; font-style: italic;">
                    "Trade your Halloween Bounty Medals for exclusive spooky items!"
                </div>
                <div style="background: rgba(0,0,0,0.4); padding: 15px 30px; border-radius: 12px; display: inline-block; border: 2px solid #ff8c00;">
                    <strong style="color: #ff8c00;">🏅 Halloween Bounty Medals:</strong> 
                    <span style="color: #ffa500; font-size: 20px; font-weight: bold;">${halloweenMedals.toLocaleString()}</span>
                </div>
                <div style="margin-top: 15px; font-size: 14px; color: #aaa;">
                    Earn medals by rolling Halloween biome auras!
                </div>
                <button onclick="closeBountyJackShop()" style="margin-top: 15px; padding: 10px 25px; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    Close Shop
                </button>
            </div>
            
            <div>
                <h3 style="color: #ff8c00; margin-bottom: 20px; font-size: 24px;">
                    🛒 Halloween Shop Items
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                    ${sortedItems.map(([itemName, data]) => {
                        const canAfford = halloweenMedals >= data.cost;
                        const stockLeft = data.stock === 'unlimited' ? '∞' : data.stock;
                        const soldOut = data.stock !== 'unlimited' && data.stock <= 0;
                        const isSpecial = data.special === true;
                        
                        return `
                            <div style="background: ${isSpecial ? 'linear-gradient(135deg, rgba(255,140,0,0.2) 0%, rgba(255,68,0,0.2) 100%)' : 'rgba(0,0,0,0.3)'}; 
                                padding: 20px; border-radius: 12px; 
                                border: 3px solid ${isSpecial ? '#ff8c00' : (canAfford && !soldOut ? '#ff6600' : '#444')}; 
                                ${soldOut ? 'opacity: 0.5;' : ''}
                                ${isSpecial ? 'box-shadow: 0 0 20px rgba(255,140,0,0.4);' : ''}">
                                ${isSpecial ? '<div style="background: linear-gradient(90deg, #ff8c00, #ff6600); padding: 5px; border-radius: 5px; margin-bottom: 10px; font-weight: bold; text-align: center;">⭐ LEGENDARY ITEM ⭐</div>' : ''}
                                <div style="font-weight: bold; font-size: 18px; margin-bottom: 10px; color: ${isSpecial ? '#ffaa00' : '#fff'};">${itemName}</div>
                                <div style="color: #ffa500; margin-bottom: 10px; font-size: 16px;">
                                    🏅 ${data.cost.toLocaleString()} Medals
                                </div>
                                <div style="font-size: 14px; color: #888; margin-bottom: 12px;">
                                    Stock: ${soldOut ? 'SOLD OUT' : stockLeft}
                                </div>
                                ${!soldOut ? `
                                    <button onclick="buyFromBountyJack('${itemName}')" 
                                        style="padding: 10px 20px; background: ${canAfford ? 'linear-gradient(135deg, #ff8c00 0%, #ff6600 100%)' : '#555'}; 
                                        color: white; border: none; border-radius: 8px; cursor: ${canAfford ? 'pointer' : 'not-allowed'}; 
                                        width: 100%; font-weight: bold; font-size: 16px;"
                                        ${!canAfford ? 'disabled' : ''}>
                                        ${canAfford ? '🎃 BUY' : 'Not Enough Medals'}
                                    </button>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    
    const container = document.getElementById('achievementsContainer');
    if (container) {
        const modalContent = container.querySelector('.modal-content');
        if (modalContent) {
            modalContent.innerHTML = html;
        }
        container.classList.add('show');
    }
};

window.closeBountyJackShop = function() {
    const container = document.getElementById('achievementsContainer');
    if (container) {
        container.classList.remove('show');
        const modalContent = container.querySelector('.modal-content');
        if (modalContent) {
            modalContent.innerHTML = '';
        }
    }
};

window.buyFromBountyJack = function(itemName) {
    const shop = gameState.merchants.bountyJackStock;
    const item = shop[itemName];
    
    if (!item) return;
    
    // Check stock
    if (item.stock !== 'unlimited' && item.stock <= 0) {
        showNotification('❌ Item sold out!');
        return;
    }
    
    // Check if player has enough medals
    const halloweenMedals = gameState.currency?.halloweenMedals || 0;
    if (halloweenMedals < item.cost) {
        showNotification('❌ Not enough Halloween Bounty Medals!');
        return;
    }
    
    // Deduct medals
    gameState.currency.halloweenMedals -= item.cost;
    
    // Track Bounty Hunter Jack purchase
    if (typeof trackMerchantPurchase === 'function') {
        trackMerchantPurchase('Bounty Hunter Jack', item.cost);
    }
    
    // Track currency changes
    if (typeof trackCurrencyChange === 'function') {
        trackCurrencyChange('halloweenMedals', item.cost, false);
    }
    
    // Reduce stock
    if (item.stock !== 'unlimited') {
        item.stock--;
    }
    
    // Give item
    if (item.type === 'aura') {
        // Special case: Give THANEBORNE aura
        if (!gameState.inventory.auras[itemName]) {
            gameState.inventory.auras[itemName] = { count: 0 };
        }
        gameState.inventory.auras[itemName].count++;
        showNotification(`🎃 Obtained ${itemName} aura!`);
    } else if (item.type === 'potion') {
        if (!gameState.inventory.potions[itemName]) {
            gameState.inventory.potions[itemName] = { count: 0 };
        }
        gameState.inventory.potions[itemName].count++;
        showNotification(`✅ Purchased ${itemName}!`);
    } else if (item.type === 'item') {
        if (!gameState.inventory.items[itemName]) {
            gameState.inventory.items[itemName] = { count: 0 };
        }
        gameState.inventory.items[itemName].count++;
        showNotification(`✅ Purchased ${itemName}!`);
    } else if (item.type === 'rune') {
        if (!gameState.inventory.runes[itemName]) {
            gameState.inventory.runes[itemName] = { count: 0 };
        }
        gameState.inventory.runes[itemName].count++;
        showNotification(`✅ Purchased ${itemName}!`);
    }
    
    saveGameState();
    updateUI();
    updateInventoryDisplay();
    updateCurrencyDisplay();
    
    // Refresh shop display
    openBountyJackShop();
};
