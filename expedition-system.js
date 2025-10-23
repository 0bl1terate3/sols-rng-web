// =================================================================
// AURA EXPEDITION SYSTEM
// =================================================================
// Send auras on expeditions to earn rewards

// Initialize expedition system in gameState
if (!window.gameState.expeditionSystem) {
    window.gameState.expeditionSystem = {
        activeExpeditions: [],
        completedExpeditions: 0,
        totalRewardsEarned: {},
        unlockedSlots: 1, // Start with 1 slot, unlock more
        maxSlots: 5
    };
}

// Expedition tier definitions based on aura rarity
const EXPEDITION_TIERS = {
    COMMON: { name: 'Local Scouting', duration: 1800000, rarityMin: 1, rarityMax: 9999, icon: '🚶', color: '#9ca3af' }, // 30 min
    RARE: { name: 'Regional Survey', duration: 3600000, rarityMin: 10000, rarityMax: 99999, icon: '🏃', color: '#3b82f6' }, // 1 hour
    EPIC: { name: 'Continental Quest', duration: 7200000, rarityMin: 100000, rarityMax: 999999, icon: '🏇', color: '#a855f7' }, // 2 hours
    LEGENDARY: { name: 'World Voyage', duration: 14400000, rarityMin: 1000000, rarityMax: 9999999, icon: '🚀', color: '#fbbf24' }, // 4 hours
    MYTHIC: { name: 'Dimensional Rift', duration: 28800000, rarityMin: 10000000, rarityMax: 99999999, icon: '🌌', color: '#f97316' }, // 8 hours
    TRANSCENDENT: { name: 'Cosmic Expedition', duration: 43200000, rarityMin: 100000000, rarityMax: 999999999, icon: '✨', color: '#ec4899' } // 12 hours
};

// Reward pools based on expedition tier
const EXPEDITION_REWARDS = {
    potions: [
        { name: 'Lucky Potion', weight: 50, minAmount: 5, maxAmount: 20 },
        { name: 'Speed Potion', weight: 50, minAmount: 5, maxAmount: 20 },
        { name: 'Fortune Potion I', weight: 30, minAmount: 1, maxAmount: 5 },
        { name: 'Fortune Potion II', weight: 20, minAmount: 1, maxAmount: 3 },
        { name: 'Fortune Potion III', weight: 10, minAmount: 1, maxAmount: 2 },
        { name: 'Haste Potion I', weight: 30, minAmount: 1, maxAmount: 5 },
        { name: 'Haste Potion II', weight: 20, minAmount: 1, maxAmount: 3 },
        { name: 'Mixed Potion', weight: 25, minAmount: 1, maxAmount: 4 }
    ],
    items: [
        { name: 'Darklight Shard', weight: 40, minAmount: 1, maxAmount: 3 },
        { name: 'Darklight Orb', weight: 20, minAmount: 1, maxAmount: 2 },
        { name: 'Darklight Core', weight: 5, minAmount: 1, maxAmount: 1 },
        { name: 'Random Rune Chest', weight: 30, minAmount: 1, maxAmount: 3 },
        { name: 'Gear Fragment', weight: 25, minAmount: 1, maxAmount: 5 }
    ],
    currency: [
        { type: 'money', weight: 50, minAmount: 100, maxAmount: 1000 },
        { type: 'voidCoins', weight: 30, minAmount: 10, maxAmount: 100 },
        { type: 'darkPoints', weight: 20, minAmount: 5, maxAmount: 50 },
        { type: 'halloweenMedals', weight: 15, minAmount: 1, maxAmount: 10 }
    ],
    special: [
        { type: 'auraUpgrade', weight: 5, description: 'Upgrade expedition aura rarity by 10%' },
        { type: 'bonusRoll', weight: 10, description: 'Bonus roll with expedition luck' },
        { type: 'rareFindaura', weight: 3, description: 'Rare aura discovery' }
    ]
};

// Get expedition tier for an aura
function getExpeditionTier(auraRarity) {
    for (const [tierKey, tier] of Object.entries(EXPEDITION_TIERS)) {
        if (auraRarity >= tier.rarityMin && auraRarity <= tier.rarityMax) {
            return { key: tierKey, ...tier };
        }
    }
    return { key: 'COMMON', ...EXPEDITION_TIERS.COMMON };
}

// Start an expedition
window.startExpedition = function(auraName) {
    const system = window.gameState.expeditionSystem;
    
    // Check slot availability
    if (system.activeExpeditions.length >= system.unlockedSlots) {
        showNotification('❌ No expedition slots available!', 'error');
        return;
    }
    
    // Check if aura exists
    if (!window.gameState.inventory.auras[auraName] || 
        window.gameState.inventory.auras[auraName].count < 1) {
        showNotification('❌ You don\'t have this aura!', 'error');
        return;
    }
    
    // Check if aura is already on expedition
    if (system.activeExpeditions.some(exp => exp.auraName === auraName)) {
        showNotification('❌ This aura is already on an expedition!', 'error');
        return;
    }
    
    // Get aura data
    const auraData = window.AURAS?.find(a => a.name === auraName);
    if (!auraData) return;
    
    const tier = getExpeditionTier(auraData.rarity);
    
    // Create expedition
    const expedition = {
        id: `expedition_${Date.now()}_${Math.random()}`,
        auraName: auraName,
        auraRarity: auraData.rarity,
        tier: tier,
        startTime: Date.now(),
        endTime: Date.now() + tier.duration,
        completed: false,
        claimed: false
    };
    
    // Remove aura from inventory temporarily
    window.gameState.inventory.auras[auraName].count--;
    if (window.gameState.inventory.auras[auraName].count <= 0) {
        // Don't delete, just mark as on expedition
        window.gameState.inventory.auras[auraName].onExpedition = true;
    }
    
    system.activeExpeditions.push(expedition);
    
    showNotification(`🌌 ${auraName} departed on ${tier.name}!`, 'success');
    updateExpeditionUI();
    updateInventoryDisplay();
    saveGameState();
};

// Complete an expedition
function completeExpedition(expeditionId) {
    const expedition = window.gameState.expeditionSystem.activeExpeditions.find(e => e.id === expeditionId);
    if (!expedition || expedition.completed) return;
    
    expedition.completed = true;
    
    // Generate rewards
    const rewards = generateExpeditionRewards(expedition);
    expedition.rewards = rewards;
    
    showExpeditionCompleteNotification(expedition);
    updateExpeditionUI();
    saveGameState();
}

// Generate rewards for completed expedition
function generateExpeditionRewards(expedition) {
    const rewards = {
        potions: {},
        items: {},
        currency: {},
        special: []
    };
    
    // Calculate reward multiplier based on tier
    const tierMultipliers = {
        COMMON: 1,
        RARE: 1.5,
        EPIC: 2,
        LEGENDARY: 3,
        MYTHIC: 4,
        TRANSCENDENT: 5
    };
    const multiplier = tierMultipliers[expedition.tier.key] || 1;
    
    // Generate potions (2-4 types)
    const numPotionTypes = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < numPotionTypes; i++) {
        const potion = weightedRandom(EXPEDITION_REWARDS.potions);
        if (potion) {
            const amount = Math.floor((Math.random() * (potion.maxAmount - potion.minAmount + 1) + potion.minAmount) * multiplier);
            rewards.potions[potion.name] = (rewards.potions[potion.name] || 0) + amount;
        }
    }
    
    // Generate items (1-3 types)
    const numItemTypes = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numItemTypes; i++) {
        const item = weightedRandom(EXPEDITION_REWARDS.items);
        if (item) {
            const amount = Math.floor((Math.random() * (item.maxAmount - item.minAmount + 1) + item.minAmount) * multiplier);
            rewards.items[item.name] = (rewards.items[item.name] || 0) + amount;
        }
    }
    
    // Generate currency (all types)
    EXPEDITION_REWARDS.currency.forEach(currency => {
        if (Math.random() * 100 < currency.weight) {
            const amount = Math.floor((Math.random() * (currency.maxAmount - currency.minAmount + 1) + currency.minAmount) * multiplier);
            rewards.currency[currency.type] = amount;
        }
    });
    
    // Special rewards (rare chance)
    EXPEDITION_REWARDS.special.forEach(special => {
        if (Math.random() * 100 < special.weight * multiplier) {
            rewards.special.push(special);
        }
    });
    
    return rewards;
}

// Weighted random selection
function weightedRandom(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
        random -= item.weight;
        if (random <= 0) return item;
    }
    return items[0];
}

// Claim expedition rewards
window.claimExpedition = function(expeditionId) {
    const expedition = window.gameState.expeditionSystem.activeExpeditions.find(e => e.id === expeditionId);
    if (!expedition || !expedition.completed || expedition.claimed) return;
    
    expedition.claimed = true;
    
    // Award rewards
    const rewards = expedition.rewards;
    
    // Potions
    for (const [potionName, amount] of Object.entries(rewards.potions)) {
        if (!window.gameState.inventory.potions[potionName]) {
            window.gameState.inventory.potions[potionName] = { count: 0 };
        }
        window.gameState.inventory.potions[potionName].count += amount;
    }
    
    // Items
    for (const [itemName, amount] of Object.entries(rewards.items)) {
        if (!window.gameState.inventory.items[itemName]) {
            window.gameState.inventory.items[itemName] = { count: 0 };
        }
        window.gameState.inventory.items[itemName].count += amount;
    }
    
    // Currency
    for (const [currencyType, amount] of Object.entries(rewards.currency)) {
        window.gameState.currency[currencyType] = (window.gameState.currency[currencyType] || 0) + amount;
    }
    
    // Special rewards
    rewards.special.forEach(special => {
        if (special.type === 'auraUpgrade') {
            // Upgrade aura rarity by 10%
            const auraData = window.gameState.inventory.auras[expedition.auraName];
            if (auraData) {
                auraData.rarity = Math.floor(auraData.rarity * 0.9);
                showNotification(`✨ ${expedition.auraName} has been upgraded!`, 'legendary');
            }
        }
    });
    
    // Return aura to inventory
    if (!window.gameState.inventory.auras[expedition.auraName]) {
        window.gameState.inventory.auras[expedition.auraName] = { count: 0, rarity: expedition.auraRarity };
    }
    window.gameState.inventory.auras[expedition.auraName].count++;
    window.gameState.inventory.auras[expedition.auraName].onExpedition = false;
    
    // Remove from active expeditions
    window.gameState.expeditionSystem.activeExpeditions = 
        window.gameState.expeditionSystem.activeExpeditions.filter(e => e.id !== expeditionId);
    
    window.gameState.expeditionSystem.completedExpeditions++;
    
    showNotification(`🎉 Expedition rewards claimed!`, 'success');
    
    updateExpeditionUI();
    updateInventoryDisplay();
    updateUI();
    saveGameState();
};

// Show expedition complete notification
function showExpeditionCompleteNotification(expedition) {
    const rewards = expedition.rewards;
    let rewardHTML = '';
    
    // Potions
    for (const [name, amount] of Object.entries(rewards.potions)) {
        rewardHTML += `<div class="expedition-reward-item">⚗️ ${name} x${amount}</div>`;
    }
    
    // Items
    for (const [name, amount] of Object.entries(rewards.items)) {
        rewardHTML += `<div class="expedition-reward-item">📦 ${name} x${amount}</div>`;
    }
    
    // Currency
    for (const [type, amount] of Object.entries(rewards.currency)) {
        const icons = { money: '💰', voidCoins: '🌀', darkPoints: '🌑', halloweenMedals: '🎃' };
        rewardHTML += `<div class="expedition-reward-item">${icons[type]} ${amount}</div>`;
    }
    
    // Special
    rewards.special.forEach(special => {
        rewardHTML += `<div class="expedition-reward-item special">✨ ${special.description}</div>`;
    });
    
    showNotification(`🌌 ${expedition.auraName} returned from ${expedition.tier.name}!`, 'success');
}

// Create expedition UI
function createExpeditionUI() {
    const container = document.getElementById('expeditionSystemContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="expedition-header">
            <h2 class="expedition-title">🌌 Aura Expeditions</h2>
            <div class="expedition-slots">
                <span>Slots: ${window.gameState.expeditionSystem.activeExpeditions.length}/${window.gameState.expeditionSystem.unlockedSlots}</span>
            </div>
        </div>
        
        <div class="expedition-info">
            Send auras on expeditions to earn rewards! Higher rarity auras bring back better loot.
        </div>
        
        <div id="expeditionActiveList" class="expedition-active-list"></div>
        
        <div class="expedition-send-section">
            <h3>Send on Expedition</h3>
            <div class="expedition-aura-selector">
                <input type="text" id="expeditionAuraSearch" placeholder="Search auras..." class="expedition-search-input">
                <div id="expeditionAuraList" class="expedition-aura-list"></div>
            </div>
        </div>
        
        <div class="expedition-unlock-section">
            <button onclick="unlockExpeditionSlot()" class="expedition-unlock-btn" id="unlockSlotBtn">
                🔓 Unlock Slot (Cost: <span id="slotCost">500</span> 🎃)
            </button>
        </div>
    `;
    
    updateExpeditionUI();
    setupExpeditionSearch();
}

// Update expedition UI
function updateExpeditionUI() {
    updateActiveExpeditions();
    updateAvailableAuras();
    updateUnlockButton();
}

// Update active expeditions display
function updateActiveExpeditions() {
    const container = document.getElementById('expeditionActiveList');
    if (!container) return;
    
    const active = window.gameState.expeditionSystem.activeExpeditions;
    
    if (active.length === 0) {
        container.innerHTML = '<div class="expedition-empty">No active expeditions</div>';
        return;
    }
    
    container.innerHTML = '';
    
    active.forEach(expedition => {
        const now = Date.now();
        const timeLeft = expedition.endTime - now;
        const isComplete = timeLeft <= 0 || expedition.completed;
        
        const card = document.createElement('div');
        card.className = `expedition-card ${isComplete ? 'expedition-complete' : ''}`;
        card.style.borderColor = expedition.tier.color;
        
        let timeDisplay = '';
        if (!isComplete) {
            const hours = Math.floor(timeLeft / 3600000);
            const minutes = Math.floor((timeLeft % 3600000) / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            timeDisplay = `${hours}h ${minutes}m ${seconds}s`;
        } else {
            timeDisplay = 'Complete!';
        }
        
        card.innerHTML = `
            <div class="expedition-card-header">
                <span class="expedition-icon">${expedition.tier.icon}</span>
                <div class="expedition-card-info">
                    <div class="expedition-aura-name">${expedition.auraName}</div>
                    <div class="expedition-tier-name">${expedition.tier.name}</div>
                </div>
            </div>
            
            <div class="expedition-progress">
                <div class="expedition-progress-bar">
                    <div class="expedition-progress-fill" style="width: ${Math.min((Date.now() - expedition.startTime) / expedition.tier.duration * 100, 100)}%; background: ${expedition.tier.color};"></div>
                </div>
                <div class="expedition-time">${timeDisplay}</div>
            </div>
            
            ${isComplete && !expedition.claimed ? `
                <button onclick="claimExpedition('${expedition.id}')" class="expedition-claim-btn">
                    CLAIM REWARDS
                </button>
            ` : expedition.claimed ? `
                <div class="expedition-claimed">✓ CLAIMED</div>
            ` : ''}
        `;
        
        container.appendChild(card);
    });
}

// Update available auras list
function updateAvailableAuras() {
    const container = document.getElementById('expeditionAuraList');
    if (!container) return;
    
    const search = document.getElementById('expeditionAuraSearch')?.value.toLowerCase() || '';
    const activeExpeditionAuras = window.gameState.expeditionSystem.activeExpeditions.map(e => e.auraName);
    
    container.innerHTML = '';
    
    const availableAuras = Object.entries(window.gameState.inventory.auras)
        .filter(([name, data]) => 
            data.count > 0 && 
            !activeExpeditionAuras.includes(name) &&
            name.toLowerCase().includes(search)
        )
        .sort((a, b) => b[1].rarity - a[1].rarity);
    
    if (availableAuras.length === 0) {
        container.innerHTML = '<div class="expedition-empty">No available auras</div>';
        return;
    }
    
    availableAuras.slice(0, 20).forEach(([name, data]) => {
        const auraData = window.AURAS?.find(a => a.name === name);
        if (!auraData) return;
        
        const tier = getExpeditionTier(auraData.rarity);
        
        const item = document.createElement('div');
        item.className = 'expedition-aura-item';
        item.innerHTML = `
            <div class="expedition-aura-info">
                <div class="expedition-aura-item-name">${name}</div>
                <div class="expedition-aura-item-details">
                    <span class="expedition-tier-badge" style="background: ${tier.color};">${tier.icon} ${tier.name}</span>
                    <span class="expedition-aura-count">x${data.count}</span>
                </div>
            </div>
            <button onclick="startExpedition('${name.replace(/'/g, "\\'")}' )" class="expedition-send-btn">
                SEND
            </button>
        `;
        
        container.appendChild(item);
    });
}

// Setup search functionality
function setupExpeditionSearch() {
    const search = document.getElementById('expeditionAuraSearch');
    if (search) {
        search.addEventListener('input', updateAvailableAuras);
    }
}

// Unlock expedition slot
window.unlockExpeditionSlot = function() {
    const system = window.gameState.expeditionSystem;
    
    if (system.unlockedSlots >= system.maxSlots) {
        showNotification('❌ All slots unlocked!', 'info');
        return;
    }
    
    const cost = 500 * system.unlockedSlots;
    
    if (window.gameState.currency.halloweenMedals < cost) {
        showNotification('❌ Not enough Halloween Medals!', 'error');
        return;
    }
    
    window.gameState.currency.halloweenMedals -= cost;
    system.unlockedSlots++;
    
    showNotification(`🔓 Unlocked expedition slot ${system.unlockedSlots}!`, 'success');
    updateExpeditionUI();
    updateUI();
    saveGameState();
};

// Update unlock button
function updateUnlockButton() {
    const btn = document.getElementById('unlockSlotBtn');
    const costEl = document.getElementById('slotCost');
    
    if (!btn || !costEl) return;
    
    const system = window.gameState.expeditionSystem;
    
    if (system.unlockedSlots >= system.maxSlots) {
        btn.disabled = true;
        btn.textContent = '✓ All Slots Unlocked';
        return;
    }
    
    const cost = 500 * system.unlockedSlots;
    costEl.textContent = cost;
    btn.disabled = window.gameState.currency.halloweenMedals < cost;
}

// Check for completed expeditions
function checkExpeditions() {
    const now = Date.now();
    let anyCompleted = false;
    
    window.gameState.expeditionSystem.activeExpeditions.forEach(expedition => {
        if (!expedition.completed && now >= expedition.endTime) {
            completeExpedition(expedition.id);
            anyCompleted = true;
        }
    });
    
    if (anyCompleted) {
        updateExpeditionUI();
    }
}

// Auto-update expeditions
setInterval(() => {
    checkExpeditions();
    updateActiveExpeditions();
}, 1000);

// Add CSS
const expeditionStyles = document.createElement('style');
expeditionStyles.textContent = `
    .expedition-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
    
    .expedition-title {
        font-size: 24px;
        font-weight: 700;
        margin: 0;
    }
    
    .expedition-slots {
        background: rgba(255,255,255,0.1);
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 600;
    }
    
    .expedition-info {
        background: rgba(255,255,255,0.05);
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 14px;
        color: #a0a0a0;
    }
    
    .expedition-active-list {
        display: grid;
        gap: 12px;
        margin-bottom: 24px;
    }
    
    .expedition-card {
        background: linear-gradient(135deg, #1a1f2e 0%, #242b3d 100%);
        border: 2px solid;
        border-radius: 12px;
        padding: 16px;
        transition: all 0.3s ease;
    }
    
    .expedition-complete {
        border-color: #10b981 !important;
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
    }
    
    .expedition-card-header {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 12px;
    }
    
    .expedition-icon {
        font-size: 32px;
    }
    
    .expedition-aura-name {
        font-weight: 600;
        font-size: 16px;
    }
    
    .expedition-tier-name {
        font-size: 12px;
        color: #888;
    }
    
    .expedition-progress-bar {
        height: 8px;
        background: rgba(0,0,0,0.3);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 8px;
    }
    
    .expedition-progress-fill {
        height: 100%;
        transition: width 0.3s ease;
    }
    
    .expedition-time {
        text-align: center;
        font-size: 14px;
        color: #888;
    }
    
    .expedition-claim-btn {
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #10b981, #059669);
        border: none;
        border-radius: 8px;
        color: #fff;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 12px;
    }
    
    .expedition-claim-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }
    
    .expedition-send-section {
        margin-bottom: 24px;
    }
    
    .expedition-send-section h3 {
        margin-bottom: 12px;
    }
    
    .expedition-search-input {
        width: 100%;
        padding: 12px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        color: #fff;
        font-size: 14px;
        margin-bottom: 12px;
    }
    
    .expedition-aura-list {
        display: grid;
        gap: 8px;
        max-height: 400px;
        overflow-y: auto;
    }
    
    .expedition-aura-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    
    .expedition-aura-item:hover {
        background: rgba(255,255,255,0.05);
        border-color: rgba(255,255,255,0.2);
    }
    
    .expedition-aura-item-name {
        font-weight: 600;
        margin-bottom: 4px;
    }
    
    .expedition-aura-item-details {
        display: flex;
        gap: 8px;
        font-size: 12px;
    }
    
    .expedition-tier-badge {
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
    }
    
    .expedition-send-btn {
        padding: 8px 16px;
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        border: none;
        border-radius: 6px;
        color: #fff;
        font-weight: 600;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .expedition-send-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
    
    .expedition-unlock-btn {
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #f59e0b, #d97706);
        border: none;
        border-radius: 8px;
        color: #fff;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .expedition-unlock-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
    }
    
    .expedition-unlock-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .expedition-empty {
        text-align: center;
        padding: 32px;
        color: #666;
    }
    
    .expedition-claimed {
        text-align: center;
        padding: 12px;
        background: rgba(16, 185, 129, 0.2);
        border-radius: 8px;
        color: #10b981;
        font-weight: 600;
        margin-top: 12px;
    }
`;
document.head.appendChild(expeditionStyles);

console.log('✅ Expedition System loaded');
