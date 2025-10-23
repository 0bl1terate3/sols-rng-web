// ========================================
// BATTLE PASS / SEASON PASS SYSTEM
// ========================================

const BATTLE_PASS = {
    currentSeason: 1,
    seasonName: "Season of Origins",
    seasonTheme: "cosmic",
    seasonEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    
    playerData: {
        xp: 0,
        level: 1,
        hasPremium: false,
        claimedRewards: { free: [], premium: [] }
    },
    
    xpPerLevel: 1000,
    xpLevelScaling: 1.08,
    maxLevel: 100,
    
    xpRewards: {
        roll: 10, rareAura: 25, epicAura: 50, legendaryAura: 100,
        mythicAura: 200, exoticAura: 400, divineAura: 800,
        celestialAura: 1500, transcendentAura: 3000, cosmicAura: 10000,
        dailyBonus: 500, achievement: 300, biomeFirst: 150
    },
    
    // Reward data stored separately for brevity
    rewardData: null
};

// Initialize Battle Pass system
function initBattlePass() {
    loadBattlePassData();
    createBattlePassUI();
    updateBattlePassDisplay();
    checkSeasonEnd();
    console.log('⚔️ Battle Pass System Initialized!');
}

// Load saved data from localStorage
function loadBattlePassData() {
    const saved = localStorage.getItem('battlePassData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            // Merge saved data with defaults to preserve new properties
            BATTLE_PASS.playerData = {
                ...BATTLE_PASS.playerData,
                ...data
            };
            console.log(`✅ Loaded Battle Pass: Level ${BATTLE_PASS.playerData.level}, XP ${BATTLE_PASS.playerData.xp}`);
        } catch (e) {
            console.error('❌ Failed to load battle pass data:', e);
        }
    } else {
        console.log('📝 No saved Battle Pass data, starting fresh');
    }
    loadRewardTracks();
}

// Save data to localStorage
function saveBattlePassData() {
    try {
        localStorage.setItem('battlePassData', JSON.stringify(BATTLE_PASS.playerData));
        console.log(`💾 Battle Pass saved: Level ${BATTLE_PASS.playerData.level}, XP ${BATTLE_PASS.playerData.xp}`);
    } catch (e) {
        console.error('❌ Failed to save battle pass data:', e);
    }
}

// Award XP to player
function awardBattlePassXP(amount, reason = '') {
    BATTLE_PASS.playerData.xp += amount;
    
    // Check for level up
    while (BATTLE_PASS.playerData.xp >= getXPForLevel(BATTLE_PASS.playerData.level) && 
           BATTLE_PASS.playerData.level < BATTLE_PASS.maxLevel) {
        BATTLE_PASS.playerData.xp -= getXPForLevel(BATTLE_PASS.playerData.level);
        BATTLE_PASS.playerData.level++;
        onLevelUp();
    }
    
    updateBattlePassDisplay();
    saveBattlePassData();
    
    // Show XP notification
    if (reason && typeof showNotification === 'function') {
        showNotification(`+${amount} BP XP: ${reason}`, 'success');
    }
}

// Calculate XP required for a level
function getXPForLevel(level) {
    return Math.floor(BATTLE_PASS.xpPerLevel * Math.pow(BATTLE_PASS.xpLevelScaling, level - 1));
}

// Level up handler
function onLevelUp() {
    const level = BATTLE_PASS.playerData.level;
    if (typeof showNotification === 'function') {
        showNotification(`🎊 Battle Pass Level ${level}!`, 'legendary');
    }
    if (typeof playSound === 'function') {
        playSound('levelup');
    }
    
    // Check for unclaimed rewards
    checkUnclaimedRewards();
}

// Award XP based on aura rarity
function awardXPForAura(aura) {
    const tier = aura.tier.toLowerCase();
    const xpMap = {
        'rare': BATTLE_PASS.xpRewards.rareAura,
        'epic': BATTLE_PASS.xpRewards.epicAura,
        'legendary': BATTLE_PASS.xpRewards.legendaryAura,
        'mythic': BATTLE_PASS.xpRewards.mythicAura,
        'exotic': BATTLE_PASS.xpRewards.exoticAura,
        'divine': BATTLE_PASS.xpRewards.divineAura,
        'celestial': BATTLE_PASS.xpRewards.celestialAura,
        'transcendent': BATTLE_PASS.xpRewards.transcendentAura,
        'cosmic': BATTLE_PASS.xpRewards.cosmicAura
    };
    
    const xp = xpMap[tier] || BATTLE_PASS.xpRewards.roll;
    awardBattlePassXP(xp, `${aura.name}`);
}

// Claim reward
function claimBattlePassReward(level, track) {
    const reward = BATTLE_PASS.rewardData[track].find(r => r.level === level);
    if (!reward) return;
    
    // Check if already claimed
    if (BATTLE_PASS.playerData.claimedRewards[track].includes(level)) {
        if (typeof showNotification === 'function') {
            showNotification('Already claimed!', 'warning');
        }
        return;
    }
    
    // Check if premium required
    if (track === 'premium' && !BATTLE_PASS.playerData.hasPremium) {
        if (typeof showNotification === 'function') {
            showNotification('Premium Battle Pass required!', 'warning');
        }
        return;
    }
    
    // Check level requirement
    if (BATTLE_PASS.playerData.level < level) {
        if (typeof showNotification === 'function') {
            showNotification(`Reach level ${level} first!`, 'warning');
        }
        return;
    }
    
    // Grant reward
    grantReward(reward);
    BATTLE_PASS.playerData.claimedRewards[track].push(level);
    saveBattlePassData();
    updateBattlePassDisplay();
    
    if (typeof showNotification === 'function') {
        showNotification(`Claimed: ${reward.name}!`, 'success');
    }
}

// Grant the actual reward to player
function grantReward(reward) {
    switch (reward.type) {
        case 'currency':
            if (reward.item === 'Coins') {
                if (!gameState.currency) gameState.currency = {};
                gameState.currency.money = (gameState.currency.money || 0) + reward.amount;
                if (typeof updateCurrencyDisplay === 'function') {
                    updateCurrencyDisplay();
                }
            }
            break;
            
        case 'aura':
            // Add aura to inventory
            const auraObj = AURAS.find(a => a.name === reward.item);
            if (auraObj && gameState.inventory && gameState.inventory.auras) {
                if (!gameState.inventory.auras[reward.item]) {
                    gameState.inventory.auras[reward.item] = { count: 0, rarity: auraObj.rarity, tier: auraObj.tier };
                }
                gameState.inventory.auras[reward.item].count += reward.amount;
                if (typeof updateAurasInventory === 'function') {
                    updateAurasInventory();
                }
            }
            break;
            
        case 'gear':
            // Add gear to inventory
            if (gameState.inventory && gameState.inventory.gears && gearData[reward.item]) {
                gameState.inventory.gears[reward.item] = (gameState.inventory.gears[reward.item] || 0) + reward.amount;
                if (typeof updateGearsInventory === 'function') {
                    updateGearsInventory();
                }
            }
            break;
            
        case 'title':
            // Add title to collection
            if (!gameState.cosmetics) gameState.cosmetics = {};
            if (!gameState.cosmetics.titles) gameState.cosmetics.titles = [];
            if (!gameState.cosmetics.titles.includes(reward.value)) {
                gameState.cosmetics.titles.push(reward.value);
            }
            // Set as active title if none selected
            if (!gameState.cosmetics.activeTitle) {
                gameState.cosmetics.activeTitle = reward.value;
            }
            break;
            
        case 'badge':
            // Add badge to collection
            if (!gameState.cosmetics) gameState.cosmetics = {};
            if (!gameState.cosmetics.badges) gameState.cosmetics.badges = [];
            if (!gameState.cosmetics.badges.includes(reward.value)) {
                gameState.cosmetics.badges.push(reward.value);
            }
            // Set as active badge if none selected
            if (!gameState.cosmetics.activeBadge) {
                gameState.cosmetics.activeBadge = reward.value;
            }
            break;
    }
    
    if (typeof saveGameState === 'function') {
        saveGameState();
    }
}

// Purchase premium pass
function purchasePremiumPass() {
    const cost = 50000; // 50k coins
    
    if (BATTLE_PASS.playerData.hasPremium) {
        if (typeof showNotification === 'function') {
            showNotification('You already have Premium!', 'warning');
        }
        return;
    }
    
    const currentMoney = gameState.currency?.money || 0;
    if (currentMoney < cost) {
        if (typeof showNotification === 'function') {
            showNotification(`Need ${cost.toLocaleString()} coins!`, 'warning');
        }
        return;
    }
    
    gameState.currency.money -= cost;
    BATTLE_PASS.playerData.hasPremium = true;
    if (typeof updateCurrencyDisplay === 'function') {
        updateCurrencyDisplay();
    }
    saveBattlePassData();
    updateBattlePassDisplay();
    
    if (typeof showNotification === 'function') {
        showNotification('🎉 Premium Battle Pass Activated!', 'legendary');
    }
    if (typeof playSound === 'function') {
        playSound('purchase');
    }
}

// Check for unclaimed rewards
function checkUnclaimedRewards() {
    const level = BATTLE_PASS.playerData.level;
    const unclaimed = [];
    
    for (let i = 1; i <= level; i++) {
        if (!BATTLE_PASS.playerData.claimedRewards.free.includes(i)) {
            unclaimed.push({ level: i, track: 'free' });
        }
        if (BATTLE_PASS.playerData.hasPremium && !BATTLE_PASS.playerData.claimedRewards.premium.includes(i)) {
            unclaimed.push({ level: i, track: 'premium' });
        }
    }
    
    if (unclaimed.length > 0 && typeof showNotification === 'function') {
        showNotification(`${unclaimed.length} unclaimed rewards!`, 'info');
    }
}

// Check if season has ended
function checkSeasonEnd() {
    if (new Date() > BATTLE_PASS.seasonEndDate && typeof showNotification === 'function') {
        showNotification('Season has ended! New season coming soon...', 'legendary');
    }
}

// Update Battle Pass display
function updateBattlePassDisplay() {
    const modal = document.getElementById('battlePassModal');
    if (!modal || modal.style.display !== 'flex') return;
    
    // Update level and XP
    document.getElementById('bpCurrentLevel').textContent = BATTLE_PASS.playerData.level;
    document.getElementById('bpMaxLevel').textContent = BATTLE_PASS.maxLevel;
    
    const currentXP = BATTLE_PASS.playerData.xp;
    const requiredXP = getXPForLevel(BATTLE_PASS.playerData.level);
    document.getElementById('bpCurrentXP').textContent = currentXP.toLocaleString();
    document.getElementById('bpRequiredXP').textContent = requiredXP.toLocaleString();
    
    const progress = (currentXP / requiredXP) * 100;
    document.getElementById('bpProgressBar').style.width = `${Math.min(progress, 100)}%`;
    
    // Update season info
    const daysLeft = Math.ceil((BATTLE_PASS.seasonEndDate - new Date()) / (1000 * 60 * 60 * 24));
    document.getElementById('bpSeasonEnd').textContent = `${daysLeft} days left`;
    
    // Update premium status
    const premiumBtn = document.getElementById('bpPremiumBtn');
    if (premiumBtn) {
        premiumBtn.textContent = BATTLE_PASS.playerData.hasPremium ? '✅ Premium Active' : '👑 Get Premium (50,000 coins)';
        premiumBtn.disabled = BATTLE_PASS.playerData.hasPremium;
    }
    
    // Update reward tracks
    updateRewardTracks();
}

// Create Battle Pass UI in modal
function createBattlePassUI() {
    // Modal will be created when opened
}

// Open Battle Pass modal
function openBattlePassModal() {
    let modal = document.getElementById('battlePassModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'battlePassModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content modal-large battle-pass-modal">
                <div class="modal-header">
                    <h2>⚔️ Battle Pass - ${BATTLE_PASS.seasonName}</h2>
                    <button class="modal-close" onclick="closeBattlePassModal()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="bp-header">
                        <div class="bp-level-info">
                            <div class="bp-level-display">
                                <span class="bp-level-label">Level</span>
                                <span class="bp-level-number" id="bpCurrentLevel">1</span>
                                <span class="bp-level-max">/ <span id="bpMaxLevel">100</span></span>
                            </div>
                            <div class="bp-xp-bar">
                                <div class="bp-xp-fill" id="bpProgressBar"></div>
                                <span class="bp-xp-text"><span id="bpCurrentXP">0</span> / <span id="bpRequiredXP">1000</span> XP</span>
                            </div>
                        </div>
                        <div class="bp-season-info">
                            <div class="bp-season-label">Season ends in:</div>
                            <div class="bp-season-end" id="bpSeasonEnd">90 days</div>
                            <button class="btn btn-premium" id="bpPremiumBtn" onclick="purchasePremiumPass()">
                                👑 Get Premium (50,000 coins)
                            </button>
                            <button class="btn btn-cosmetics" onclick="openCosmeticsSelector()" style="margin-top: 8px;">
                                👑 Change Title & Badge
                            </button>
                        </div>
                    </div>
                    
                    <div class="bp-tracks-container">
                        <div class="bp-track-header free-track-header">
                            <span class="track-icon">🎁</span>
                            <span class="track-name">FREE TRACK</span>
                        </div>
                        <div class="bp-track-header premium-track-header">
                            <span class="track-icon">👑</span>
                            <span class="track-name">PREMIUM TRACK</span>
                        </div>
                        
                        <div class="bp-rewards-scroll" id="bpRewardsContainer">
                            <!-- Rewards will be generated here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'flex';
    updateBattlePassDisplay();
}

function closeBattlePassModal() {
    const modal = document.getElementById('battlePassModal');
    if (modal) modal.style.display = 'none';
}

// Update reward tracks display
function updateRewardTracks() {
    const container = document.getElementById('bpRewardsContainer');
    if (!container || !BATTLE_PASS.rewardData) return;
    
    let html = '';
    
    for (let level = 1; level <= BATTLE_PASS.maxLevel; level++) {
        const freeReward = BATTLE_PASS.rewardData.free.find(r => r.level === level);
        const premiumReward = BATTLE_PASS.rewardData.premium.find(r => r.level === level);
        
        const isUnlocked = BATTLE_PASS.playerData.level >= level;
        const freeClaimed = BATTLE_PASS.playerData.claimedRewards.free.includes(level);
        const premiumClaimed = BATTLE_PASS.playerData.claimedRewards.premium.includes(level);
        
        html += `
            <div class="bp-level-row ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="bp-level-marker">${level}</div>
                
                <div class="bp-reward-cell free-reward ${freeClaimed ? 'claimed' : ''}">
                    ${freeReward ? `
                        <div class="reward-icon">${freeReward.icon}</div>
                        <div class="reward-name">${freeReward.name}</div>
                        ${isUnlocked && !freeClaimed ? `
                            <button class="btn-claim" onclick="claimBattlePassReward(${level}, 'free')">Claim</button>
                        ` : ''}
                        ${freeClaimed ? '<div class="claimed-badge">✓ Claimed</div>' : ''}
                    ` : '<div class="no-reward">-</div>'}
                </div>
                
                <div class="bp-reward-cell premium-reward ${premiumClaimed ? 'claimed' : ''} ${!BATTLE_PASS.playerData.hasPremium ? 'requires-premium' : ''}">
                    ${premiumReward ? `
                        <div class="reward-icon">${premiumReward.icon}</div>
                        <div class="reward-name">${premiumReward.name}</div>
                        ${isUnlocked && !premiumClaimed && BATTLE_PASS.playerData.hasPremium ? `
                            <button class="btn-claim" onclick="claimBattlePassReward(${level}, 'premium')">Claim</button>
                        ` : ''}
                        ${premiumClaimed ? '<div class="claimed-badge">✓ Claimed</div>' : ''}
                        ${!BATTLE_PASS.playerData.hasPremium ? '<div class="premium-lock">🔒</div>' : ''}
                    ` : '<div class="no-reward">-</div>'}
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    // Auto-scroll disabled - let users scroll freely to claim missed rewards
    // const currentRow = container.querySelector(`.bp-level-row:nth-child(${BATTLE_PASS.playerData.level})`);
    // if (currentRow) {
    //     currentRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // }
}

// Load reward tracks data
function loadRewardTracks() {
    BATTLE_PASS.rewardData = {
        free: generateFreeRewards(),
        premium: generatePremiumRewards()
    };
}

// Generate free track rewards
function generateFreeRewards() {
    return [
        { level: 1, type: 'currency', item: 'Coins', amount: 500, name: '500 Coins', icon: '🪙' },
        { level: 2, type: 'title', value: 'Rookie Roller', name: 'Rookie Roller', icon: '🎖️' },
        { level: 3, type: 'aura', item: 'Rare', amount: 3, name: '3x Rare', icon: '✨' },
        { level: 4, type: 'aura', item: 'Divinus', amount: 2, name: '2x Divinus', icon: '✨' },
        { level: 5, type: 'badge', value: 'season1_bronze', name: 'Bronze Badge', icon: '🥉' },
        { level: 6, type: 'gear', item: 'Luck Glove', amount: 1, name: 'Luck Glove', icon: '🧤' },
        { level: 7, type: 'aura', item: 'Crystallized', amount: 2, name: '2x Crystallized', icon: '💎' },
        { level: 8, type: 'aura', item: 'Star', amount: 2, name: '2x Star', icon: '⭐' },
        { level: 9, type: 'aura', item: 'Rage', amount: 1, name: 'Rage', icon: '😡' },
        { level: 10, type: 'aura', item: 'Topaz', amount: 1, name: 'Topaz', icon: '💛' },
        { level: 11, type: 'currency', item: 'Coins', amount: 1000, name: '1,000 Coins', icon: '🪙' },
        { level: 12, type: 'aura', item: 'Glacier', amount: 1, name: 'Glacier', icon: '❄️' },
        { level: 13, type: 'gear', item: 'Lunar Device', amount: 1, name: 'Lunar Device', icon: '🌙' },
        { level: 14, type: 'aura', item: 'Ruby', amount: 1, name: 'Ruby', icon: '💎' },
        { level: 15, type: 'title', value: 'Apprentice Gambler', name: 'Apprentice Gambler', icon: '🎖️' },
        { level: 16, type: 'aura', item: 'Emerald', amount: 1, name: 'Emerald', icon: '💚' },
        { level: 17, type: 'aura', item: 'Gilded', amount: 1, name: 'Gilded', icon: '✨' },
        { level: 18, type: 'aura', item: 'Sapphire', amount: 1, name: 'Sapphire', icon: '💙' },
        { level: 19, type: 'aura', item: 'Aquamarine', amount: 1, name: 'Aquamarine', icon: '🌊' },
        { level: 20, type: 'badge', value: 'season1_silver', name: 'Silver Badge', icon: '🥈' },
        { level: 22, type: 'aura', item: 'Jackpot', amount: 1, name: 'Jackpot', icon: '🎰' },
        { level: 25, type: 'gear', item: 'Obsidian Grip', amount: 1, name: 'Obsidian Grip', icon: '🖤' },
        { level: 27, type: 'aura', item: '★★', amount: 1, name: 'Two Stars', icon: '⭐' },
        { level: 30, type: 'aura', item: 'Diaboli', amount: 1, name: 'Diaboli', icon: '😈' },
        { level: 32, type: 'aura', item: 'Precious', amount: 1, name: 'Precious', icon: '💎' },
        { level: 35, type: 'badge', value: 'season1_gold', name: 'Gold Badge', icon: '🥇' },
        { level: 37, type: 'aura', item: 'Magnetic', amount: 1, name: 'Magnetic', icon: '🧲' },
        { level: 40, type: 'title', value: 'Fortune Seeker', name: 'Fortune Seeker', icon: '🎖️' },
        { level: 42, type: 'aura', item: 'Ash', amount: 1, name: 'Ash', icon: '🔥' },
        { level: 45, type: 'gear', item: 'Eclipse Device', amount: 1, name: 'Eclipse Device', icon: '🌑' },
        { level: 47, type: 'aura', item: 'Lunar', amount: 1, name: 'Lunar', icon: '🌙' },
        { level: 50, type: 'badge', value: 'season1_platinum', name: 'Platinum Badge', icon: '💿' },
        { level: 52, type: 'aura', item: 'Solar', amount: 1, name: 'Solar', icon: '☀️' },
        { level: 55, type: 'title', value: 'Master Roller', name: 'Master Roller', icon: '🎖️' },
        { level: 57, type: 'aura', item: 'Eclipse', amount: 1, name: 'Eclipse', icon: '🌑' },
        { level: 60, type: 'aura', item: 'Quartz', amount: 1, name: 'Quartz', icon: '💎' },
        { level: 62, type: 'aura', item: 'Honey', amount: 1, name: 'Honey', icon: '🍯' },
        { level: 65, type: 'aura', item: '★★★', amount: 1, name: 'Three Stars', icon: '⭐' },
        { level: 70, type: 'badge', value: 'season1_diamond', name: 'Diamond Badge', icon: '💎' },
        { level: 72, type: 'aura', item: 'Undead', amount: 1, name: 'Undead', icon: '💀' },
        { level: 75, type: 'aura', item: 'Neon', amount: 1, name: 'Neon', icon: '💡' },
        { level: 77, type: 'aura', item: 'Lost Soul', amount: 1, name: 'Lost Soul', icon: '👻' },
        { level: 80, type: 'title', value: 'Cosmic Wanderer', name: 'Cosmic Wanderer', icon: '🎖️' },
        { level: 82, type: 'aura', item: 'Obsidian', amount: 1, name: 'Obsidian', icon: '🖤' },
        { level: 85, type: 'aura', item: 'Titanium', amount: 1, name: 'Titanium', icon: '⚙️' },
        { level: 87, type: 'aura', item: 'Plasma', amount: 1, name: 'Plasma', icon: '⚡' },
        { level: 90, type: 'badge', value: 'season1_master', name: 'Master Badge', icon: '👑' },
        { level: 92, type: 'aura', item: 'Aquatic', amount: 1, name: 'Aquatic', icon: '🌊' },
        { level: 93, type: 'gear', item: 'Jackpot Gauntlet', amount: 1, name: 'Jackpot Gauntlet', icon: '🎰' },
        { level: 95, type: 'aura', item: 'Lightning', amount: 1, name: 'Lightning', icon: '⚡' },
        { level: 97, type: 'aura', item: 'Starlight', amount: 1, name: 'Starlight', icon: '✨' },
        { level: 99, type: 'gear', item: 'Exo Gauntlet', amount: 1, name: 'Exo Gauntlet', icon: '🦾' },
        { level: 100, type: 'badge', value: 'season1_complete', name: 'Season Complete', icon: '🏆' }
    ];
}

// Generate premium track rewards
function generatePremiumRewards() {
    return [
        { level: 1, type: 'currency', item: 'Coins', amount: 1000, name: '1,000 Coins', icon: '🪙' },
        { level: 2, type: 'title', value: '[PREMIUM] Patron', name: '[PREMIUM] Patron', icon: '👑' },
        { level: 3, type: 'aura', item: 'Wind', amount: 1, name: 'Wind', icon: '💨' },
        { level: 4, type: 'aura', item: 'Ink', amount: 1, name: 'Ink', icon: '🖤' },
        { level: 5, type: 'gear', item: 'Desire Glove', amount: 1, name: 'Desire Glove', icon: '🧤' },
        { level: 6, type: 'aura', item: 'Espresso', amount: 1, name: 'Espresso', icon: '☕' },
        { level: 7, type: 'aura', item: 'Latte', amount: 1, name: 'Latte', icon: '☕' },
        { level: 8, type: 'aura', item: 'Cappuccino', amount: 1, name: 'Cappuccino', icon: '☕' },
        { level: 9, type: 'aura', item: 'Mocha', amount: 1, name: 'Mocha', icon: '☕' },
        { level: 10, type: 'gear', item: 'Star Band', amount: 1, name: 'Star Band', icon: '⭐' },
        { level: 12, type: 'aura', item: 'Vanilla', amount: 1, name: 'Vanilla', icon: '🍦' },
        { level: 14, type: 'aura', item: 'Cinnamon', amount: 1, name: 'Cinnamon', icon: '🌰' },
        { level: 15, type: 'title', value: 'Golden Patron', name: 'Golden Patron', icon: '👑' },
        { level: 16, type: 'aura', item: 'Maple', amount: 1, name: 'Maple', icon: '🍁' },
        { level: 18, type: 'aura', item: 'Autumn', amount: 1, name: 'Autumn', icon: '🍂' },
        { level: 20, type: 'aura', item: 'Cozy', amount: 1, name: 'Cozy', icon: '🔥' },
        { level: 22, type: 'aura', item: 'Bookshelf', amount: 1, name: 'Bookshelf', icon: '📚' },
        { level: 24, type: 'aura', item: 'Glock', amount: 1, name: 'Glock', icon: '🔫' },
        { level: 25, type: 'gear', item: 'Wind Runner', amount: 1, name: 'Wind Runner', icon: '💨' },
        { level: 26, type: 'aura', item: 'Player', amount: 1, name: 'Player', icon: '🎮' },
        { level: 28, type: 'aura', item: 'Pukeko', amount: 1, name: 'Pukeko', icon: '🐦' },
        { level: 30, type: 'gear', item: 'Ink Glove', amount: 1, name: 'Ink Glove', icon: '🖤' },
        { level: 32, type: 'aura', item: 'Cola', amount: 1, name: 'Cola', icon: '🥤' },
        { level: 34, type: 'aura', item: 'Flora', amount: 1, name: 'Flora', icon: '🌿' },
        { level: 36, type: 'aura', item: 'Sidereum', amount: 1, name: 'Sidereum', icon: '✨' },
        { level: 38, type: 'aura', item: 'Bleeding', amount: 1, name: 'Bleeding', icon: '🩸' },
        { level: 40, type: 'title', value: 'Elite Roller', name: 'Elite Roller', icon: '👑' },
        { level: 42, type: 'aura', item: 'Flushed', amount: 1, name: 'Flushed', icon: '😳' },
        { level: 44, type: 'aura', item: 'Hazard', amount: 1, name: 'Hazard', icon: '☢️' },
        { level: 45, type: 'gear', item: 'Sapphire Band', amount: 1, name: 'Sapphire Band', icon: '💙' },
        { level: 46, type: 'aura', item: 'Corrosive', amount: 1, name: 'Corrosive', icon: '🧪' },
        { level: 48, type: 'aura', item: 'Powered', amount: 1, name: 'Powered', icon: '⚡' },
        { level: 50, type: 'gear', item: 'Cursed Shard', amount: 1, name: 'Cursed Shard', icon: '🔮' },
        { level: 52, type: 'aura', item: 'Copper', amount: 1, name: 'Copper', icon: '🟤' },
        { level: 54, type: 'aura', item: 'Watt', amount: 1, name: 'Watt', icon: '⚡' },
        { level: 55, type: 'title', value: 'Premium Legend', name: 'Premium Legend', icon: '👑' },
        { level: 56, type: 'aura', item: 'Vortex', amount: 1, name: 'Vortex', icon: '🌀' },
        { level: 58, type: 'aura', item: 'Star Rider', amount: 1, name: 'Star Rider', icon: '🌟' },
        { level: 60, type: 'gear', item: 'Magnetic Ring', amount: 1, name: 'Magnetic Ring', icon: '🧲' },
        { level: 62, type: 'aura', item: 'Permafrost', amount: 1, name: 'Permafrost', icon: '❄️' },
        { level: 64, type: 'aura', item: 'Nautilus', amount: 1, name: 'Nautilus', icon: '🐚' },
        { level: 65, type: 'gear', item: 'Storm Catcher', amount: 1, name: 'Storm Catcher', icon: '⛈️' },
        { level: 66, type: 'aura', item: 'Stormal', amount: 1, name: 'Stormal', icon: '🌪️' },
        { level: 68, type: 'aura', item: 'Exotic', amount: 1, name: 'Exotic', icon: '✨' },
        { level: 70, type: 'aura', item: 'Comet', amount: 1, name: 'Comet', icon: '☄️' },
        { level: 72, type: 'aura', item: 'Jade', amount: 1, name: 'Jade', icon: '💚' },
        { level: 74, type: 'aura', item: 'Spectre', amount: 1, name: 'Spectre', icon: '👻' },
        { level: 75, type: 'gear', item: 'Ghost Glove', amount: 1, name: 'Ghost Glove', icon: '👻' },
        { level: 76, type: 'aura', item: 'Jazz', amount: 1, name: 'Jazz', icon: '🎷' },
        { level: 78, type: 'aura', item: 'Aether', amount: 1, name: 'Aether', icon: '✨' },
        { level: 80, type: 'title', value: 'Ultimate Patron', name: 'Ultimate Patron', icon: '👑' },
        { level: 82, type: 'aura', item: 'Bounded', amount: 1, name: 'Bounded', icon: '🔗' },
        { level: 84, type: 'aura', item: 'Watermelon', amount: 1, name: 'Watermelon', icon: '🍉' },
        { level: 85, type: 'gear', item: 'Aqua Device', amount: 1, name: 'Aqua Device', icon: '🌊' },
        { level: 86, type: 'aura', item: 'Celestial', amount: 1, name: 'Celestial', icon: '🌟' },
        { level: 88, type: 'aura', item: 'Terror', amount: 1, name: 'Terror', icon: '😱' },
        { level: 90, type: 'aura', item: 'Raven', amount: 1, name: 'Raven', icon: '🐦‍⬛' },
        { level: 92, type: 'aura', item: 'Warlock', amount: 1, name: 'Warlock', icon: '🧙' },
        { level: 94, type: 'aura', item: 'Kyawthuite', amount: 1, name: 'Kyawthuite', icon: '💎' },
        { level: 95, type: 'gear', item: 'Windstorm Device', amount: 1, name: 'Windstorm Device', icon: '💨' },
        { level: 96, type: 'aura', item: 'Arcane', amount: 1, name: 'Arcane', icon: '🔮' },
        { level: 98, type: 'aura', item: ':troll:', amount: 1, name: ':troll:', icon: '😈' },
        { level: 100, type: 'badge', value: 'season1_ultimate', name: 'Ultimate Badge', icon: '👑' }
    ];
}

// Call when game initializes
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            initBattlePass();
        }, 1000);
    });
    
    // Save battle pass data before page unloads
    window.addEventListener('beforeunload', () => {
        saveBattlePassData();
    });
    
    // Save battle pass data periodically (every 30 seconds)
    setInterval(() => {
        if (BATTLE_PASS && BATTLE_PASS.playerData) {
            saveBattlePassData();
        }
    }, 30000);
}
