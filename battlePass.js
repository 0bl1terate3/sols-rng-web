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
        const data = JSON.parse(saved);
        BATTLE_PASS.playerData = data;
    }
    loadRewardTracks();
}

// Save data to localStorage
function saveBattlePassData() {
    localStorage.setItem('battlePassData', JSON.stringify(BATTLE_PASS.playerData));
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
    if (reason) {
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
    showNotification(`🎊 Battle Pass Level ${level}!`, 'legendary');
    playSound('levelup');
    
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
        showNotification('Already claimed!', 'warning');
        return;
    }
    
    // Check if premium required
    if (track === 'premium' && !BATTLE_PASS.playerData.hasPremium) {
        showNotification('Premium Battle Pass required!', 'warning');
        return;
    }
    
    // Check level requirement
    if (BATTLE_PASS.playerData.level < level) {
        showNotification(`Reach level ${level} first!`, 'warning');
        return;
    }
    
    // Grant reward
    grantReward(reward);
    BATTLE_PASS.playerData.claimedRewards[track].push(level);
    saveBattlePassData();
    updateBattlePassDisplay();
    
    showNotification(`Claimed: ${reward.name}!`, 'success');
}

// Grant the actual reward to player
function grantReward(reward) {
    switch (reward.type) {
        case 'currency':
            if (reward.item === 'Coins') {
                gameState.money += reward.amount;
                updateMoneyDisplay();
            }
            break;
            
        case 'aura':
            // Add aura to inventory
            const auraObj = AURAS.find(a => a.name === reward.item);
            if (auraObj && gameState.auras) {
                gameState.auras[reward.item] = (gameState.auras[reward.item] || 0) + reward.amount;
                updateAurasInventory();
            }
            break;
            
        case 'gear':
            // Add gear to inventory
            if (gameState.gears && gearData[reward.item]) {
                gameState.gears[reward.item] = (gameState.gears[reward.item] || 0) + reward.amount;
                updateGearsInventory();
            }
            break;
            
        case 'cosmetic':
            // Add cosmetic to collection
            if (!gameState.cosmetics) gameState.cosmetics = {};
            if (reward.item === 'title') {
                if (!gameState.cosmetics.titles) gameState.cosmetics.titles = [];
                gameState.cosmetics.titles.push(reward.value);
            } else if (reward.item === 'badge') {
                if (!gameState.cosmetics.badges) gameState.cosmetics.badges = [];
                gameState.cosmetics.badges.push(reward.value);
            } else if (reward.item === 'effect') {
                if (!gameState.cosmetics.effects) gameState.cosmetics.effects = [];
                gameState.cosmetics.effects.push(reward.value);
            }
            break;
    }
    
    saveGame();
}

// Purchase premium pass
function purchasePremiumPass() {
    const cost = 50000; // 50k coins
    
    if (BATTLE_PASS.playerData.hasPremium) {
        showNotification('You already have Premium!', 'warning');
        return;
    }
    
    if (gameState.money < cost) {
        showNotification(`Need ${cost.toLocaleString()} coins!`, 'warning');
        return;
    }
    
    gameState.money -= cost;
    BATTLE_PASS.playerData.hasPremium = true;
    updateMoneyDisplay();
    saveBattlePassData();
    updateBattlePassDisplay();
    
    showNotification('🎉 Premium Battle Pass Activated!', 'legendary');
    playSound('purchase');
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
    
    if (unclaimed.length > 0) {
        showNotification(`${unclaimed.length} unclaimed rewards!`, 'info');
    }
}

// Check if season has ended
function checkSeasonEnd() {
    if (new Date() > BATTLE_PASS.seasonEndDate) {
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
    
    // Scroll to current level
    const currentRow = container.querySelector(`.bp-level-row:nth-child(${BATTLE_PASS.playerData.level})`);
    if (currentRow) {
        currentRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
        { level: 1, type: 'currency', item: 'Coins', amount: 500, name: 'Welcome Coins', icon: '🪙' },
        { level: 2, type: 'cosmetic', item: 'title', value: 'Rookie Roller', name: 'Title: Rookie Roller', icon: '🎖️' },
        { level: 3, type: 'aura', item: 'Rare', amount: 3, name: '3x Rare Auras', icon: '✨' },
        { level: 5, type: 'cosmetic', item: 'badge', value: 'season1_bronze', name: 'Bronze Badge', icon: '🥉' },
        { level: 6, type: 'gear', item: 'Luck Glove', amount: 1, name: 'Luck Glove', icon: '🧤' },
        { level: 10, type: 'cosmetic', item: 'effect', value: 'sparkle_trail', name: 'Sparkle Trail', icon: '✨' },
        { level: 13, type: 'gear', item: 'Lunar Device', amount: 1, name: 'Lunar Device', icon: '🌙' },
        { level: 15, type: 'cosmetic', item: 'title', value: 'Apprentice Gambler', name: 'Title: Apprentice', icon: '🎖️' },
        { level: 20, type: 'cosmetic', item: 'badge', value: 'season1_silver', name: 'Silver Badge', icon: '🥈' },
        { level: 25, type: 'gear', item: 'Obsidian Grip', amount: 1, name: 'Obsidian Grip', icon: '🖤' },
        { level: 30, type: 'cosmetic', item: 'effect', value: 'cosmic_aura', name: 'Cosmic Aura', icon: '🌌' },
        { level: 35, type: 'cosmetic', item: 'badge', value: 'season1_gold', name: 'Gold Badge', icon: '🥇' },
        { level: 40, type: 'cosmetic', item: 'title', value: 'Fortune Seeker', name: 'Title: Fortune Seeker', icon: '🎖️' },
        { level: 45, type: 'gear', item: 'Eclipse Device', amount: 1, name: 'Eclipse Device', icon: '🌑' },
        { level: 50, type: 'cosmetic', item: 'badge', value: 'season1_platinum', name: 'Platinum Badge', icon: '💿' },
        { level: 55, type: 'cosmetic', item: 'title', value: 'Master Roller', name: 'Title: Master Roller', icon: '🎖️' },
        { level: 60, type: 'cosmetic', item: 'effect', value: 'rainbow_trail', name: 'Rainbow Trail', icon: '🌈' },
        { level: 70, type: 'cosmetic', item: 'badge', value: 'season1_diamond', name: 'Diamond Badge', icon: '💎' },
        { level: 80, type: 'cosmetic', item: 'title', value: 'Cosmic Wanderer', name: 'Title: Cosmic Wanderer', icon: '🎖️' },
        { level: 90, type: 'cosmetic', item: 'badge', value: 'season1_master', name: 'Master Badge', icon: '👑' },
        { level: 93, type: 'gear', item: 'Jackpot Gauntlet', amount: 1, name: 'Jackpot Gauntlet', icon: '🎰' },
        { level: 99, type: 'gear', item: 'Exo Gauntlet', amount: 1, name: 'Exo Gauntlet', icon: '🦾' },
        { level: 100, type: 'cosmetic', item: 'badge', value: 'season1_complete', name: 'Season Complete', icon: '🏆' }
    ];
}

// Generate premium track rewards
function generatePremiumRewards() {
    return [
        { level: 1, type: 'currency', item: 'Coins', amount: 1000, name: '1,000 Coins', icon: '🪙' },
        { level: 2, type: 'cosmetic', item: 'title', value: '[PREMIUM] Patron', name: 'Premium Patron', icon: '👑' },
        { level: 5, type: 'gear', item: 'Desire Glove', amount: 1, name: 'Desire Glove', icon: '🧤' },
        { level: 8, type: 'cosmetic', item: 'effect', value: 'premium_glow', name: 'Premium Glow', icon: '✨' },
        { level: 10, type: 'gear', item: 'Star Band', amount: 1, name: 'Star Band', icon: '⭐' },
        { level: 15, type: 'cosmetic', item: 'title', value: 'Golden Patron', name: 'Title: Golden Patron', icon: '👑' },
        { level: 20, type: 'cosmetic', item: 'effect', value: 'gold_sparkles', name: 'Gold Sparkles', icon: '✨' },
        { level: 25, type: 'gear', item: 'Wind Runner', amount: 1, name: 'Wind Runner', icon: '💨' },
        { level: 30, type: 'gear', item: 'Ink Glove', amount: 1, name: 'Ink Glove', icon: '🖤' },
        { level: 35, type: 'cosmetic', item: 'effect', value: 'autumn_leaves', name: 'Autumn Leaves', icon: '🍂' },
        { level: 40, type: 'cosmetic', item: 'title', value: 'Elite Roller', name: 'Title: Elite Roller', icon: '👑' },
        { level: 45, type: 'gear', item: 'Sapphire Band', amount: 1, name: 'Sapphire Band', icon: '💙' },
        { level: 50, type: 'gear', item: 'Cursed Shard', amount: 1, name: 'Cursed Shard', icon: '🔮' },
        { level: 55, type: 'cosmetic', item: 'title', value: 'Premium Legend', name: 'Premium Legend', icon: '👑' },
        { level: 60, type: 'gear', item: 'Magnetic Ring', amount: 1, name: 'Magnetic Ring', icon: '🧲' },
        { level: 65, type: 'gear', item: 'Storm Catcher', amount: 1, name: 'Storm Catcher', icon: '⛈️' },
        { level: 70, type: 'cosmetic', item: 'effect', value: 'premium_diamond', name: 'Diamond Effect', icon: '💎' },
        { level: 75, type: 'gear', item: 'Ghost Glove', amount: 1, name: 'Ghost Glove', icon: '👻' },
        { level: 80, type: 'cosmetic', item: 'title', value: 'Ultimate Patron', name: 'Ultimate Patron', icon: '👑' },
        { level: 85, type: 'gear', item: 'Aqua Device', amount: 1, name: 'Aqua Device', icon: '🌊' },
        { level: 90, type: 'cosmetic', item: 'effect', value: 'ultimate_aura', name: 'Ultimate Aura', icon: '🌟' },
        { level: 95, type: 'gear', item: 'Windstorm Device', amount: 1, name: 'Windstorm Device', icon: '💨' },
        { level: 100, type: 'cosmetic', item: 'badge', value: 'season1_ultimate', name: 'Ultimate Badge', icon: '👑' }
    ];
}

// Call when game initializes
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            initBattlePass();
        }, 1000);
    });
}
