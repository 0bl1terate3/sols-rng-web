// =================================================================
// AURA HUNTER BOUNTY SYSTEM
// =================================================================
// Track and complete bounties to earn Halloween Medals

// Initialize bounty system in gameState
if (!window.gameState.bountySystem) {
    window.gameState.bountySystem = {
        activeBounties: [],
        completedBounties: [],
        totalMedalsEarned: 0,
        dailyRefreshTime: Date.now() + 86400000, // 24 hours
        weeklyRefreshTime: Date.now() + 604800000 // 7 days
    };
}

// Initialize Halloween Medals currency
if (typeof window.gameState.currency === 'object' && !window.gameState.currency.halloweenMedals) {
    window.gameState.currency.halloweenMedals = 0;
}

// Bounty tier definitions
const BOUNTY_TIERS = {
    NOVICE: {
        name: 'Novice Hunter',
        icon: '🎯',
        rarityMin: 10000,
        rarityMax: 99999,
        count: 3,
        medalReward: 5,
        color: '#4ade80'
    },
    EXPERT: {
        name: 'Expert Hunter',
        icon: '🏹',
        rarityMin: 100000,
        rarityMax: 999999,
        count: 2,
        medalReward: 25,
        color: '#f59e0b'
    },
    MASTER: {
        name: 'Master Hunter',
        icon: '⚔️',
        rarityMin: 1000000,
        rarityMax: 999999999,
        count: 1,
        medalReward: 100,
        color: '#ef4444'
    }
};

// Generate random bounties
function generateBounties() {
    if (!window.AURAS || !Array.isArray(window.AURAS)) {
        console.warn('⏳ AURAS not loaded yet, deferring bounty generation...');
        return [];
    }

    const bounties = [];
    
    // Generate one bounty for each tier
    for (const [tierKey, tier] of Object.entries(BOUNTY_TIERS)) {
        // Filter auras in this tier's rarity range
        const eligibleAuras = window.AURAS.filter(aura => 
            aura.rarity >= tier.rarityMin && 
            aura.rarity <= tier.rarityMax
        );
        
        if (eligibleAuras.length === 0) continue;
        
        // Select random auras for this bounty
        const targetAuras = [];
        for (let i = 0; i < tier.count; i++) {
            const randomAura = eligibleAuras[Math.floor(Math.random() * eligibleAuras.length)];
            targetAuras.push({
                name: randomAura.name,
                rarity: randomAura.rarity,
                collected: false
            });
        }
        
        bounties.push({
            id: `bounty_${tierKey}_${Date.now()}_${Math.random()}`,
            tier: tierKey,
            tierData: tier,
            targetAuras: targetAuras,
            progress: 0,
            completed: false,
            claimed: false,
            createdAt: Date.now()
        });
    }
    
    return bounties;
}

// Initialize bounties if none exist
function initializeBounties() {
    if (!window.gameState.bountySystem.activeBounties || 
        window.gameState.bountySystem.activeBounties.length === 0) {
        window.gameState.bountySystem.activeBounties = generateBounties();
        saveGameState();
    }
}

// Check if bounties need refresh
function checkBountyRefresh() {
    const now = Date.now();
    
    // Daily refresh for claimed bounties
    if (now >= window.gameState.bountySystem.dailyRefreshTime) {
        window.gameState.bountySystem.activeBounties = generateBounties();
        window.gameState.bountySystem.dailyRefreshTime = now + 86400000;
        showNotification('🎯 New daily bounties available!', 'info');
        saveGameState();
    }
}

// Track aura rolls for bounty progress
function trackBountyProgress(aura) {
    if (!window.gameState.bountySystem || !window.gameState.bountySystem.activeBounties) return;
    
    let bountyCompleted = false;
    
    window.gameState.bountySystem.activeBounties.forEach(bounty => {
        if (bounty.completed || bounty.claimed) return;
        
        // Check if this aura is a target
        bounty.targetAuras.forEach(target => {
            if (target.name === aura.name && !target.collected) {
                target.collected = true;
                bounty.progress++;
                
                // Visual feedback
                showNotification(`🎯 Bounty Progress: ${target.name} collected! (${bounty.progress}/${bounty.targetAuras.length})`, 'success');
                
                // Check if bounty is complete
                if (bounty.progress >= bounty.targetAuras.length) {
                    bounty.completed = true;
                    bountyCompleted = true;
                    showBountyCompleteNotification(bounty);
                }
            }
        });
    });
    
    if (bountyCompleted) {
        updateBountyUI();
        saveGameState();
    }
}

// Show bounty completion notification
function showBountyCompleteNotification(bounty) {
    const notification = document.createElement('div');
    notification.className = 'bounty-complete-notification';
    notification.innerHTML = `
        <div class="bounty-complete-content">
            <div class="bounty-complete-icon">${bounty.tierData.icon}</div>
            <div class="bounty-complete-title">${bounty.tierData.name} Complete!</div>
            <div class="bounty-complete-reward">
                🎃 ${bounty.tierData.medalReward} Halloween Medals
            </div>
            <button onclick="claimBounty('${bounty.id}')" class="bounty-claim-btn">
                CLAIM REWARD
            </button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #1a1f2e 0%, #242b3d 100%);
        border: 3px solid ${bounty.tierData.color};
        border-radius: 16px;
        padding: 24px;
        z-index: 10000;
        box-shadow: 0 0 50px ${bounty.tierData.color}80, 0 8px 32px rgba(0,0,0,0.5);
        animation: bountyAppear 0.5s ease-out forwards;
        min-width: 300px;
        text-align: center;
    `;
    
    document.body.appendChild(notification);
    
    // Play sound
    if (typeof playSound === 'function') {
        playSound('achievement');
    }
    
    // Auto-remove after claim or 10 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'bountyDisappear 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 10000);
}

// Claim bounty reward
window.claimBounty = function(bountyId) {
    const bounty = window.gameState.bountySystem.activeBounties.find(b => b.id === bountyId);
    if (!bounty || bounty.claimed) return;
    
    bounty.claimed = true;
    
    // Award medals
    window.gameState.currency.halloweenMedals += bounty.tierData.medalReward;
    window.gameState.bountySystem.totalMedalsEarned += bounty.tierData.medalReward;
    
    // Move to completed
    window.gameState.bountySystem.completedBounties.push({
        ...bounty,
        claimedAt: Date.now()
    });
    
    // Show notification
    showNotification(`🎃 Claimed ${bounty.tierData.medalReward} Halloween Medals!`, 'success');
    
    // Remove notification popup
    const notifications = document.querySelectorAll('.bounty-complete-notification');
    notifications.forEach(n => {
        if (n.innerHTML.includes(bountyId)) {
            n.style.animation = 'bountyDisappear 0.3s ease-in forwards';
            setTimeout(() => n.remove(), 300);
        }
    });
    
    updateBountyUI();
    updateUI();
    saveGameState();
};

// Create bounty UI
function createBountyUI() {
    const container = document.getElementById('bountySystemContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="bounty-header">
            <h2 class="bounty-title">🎯 Aura Hunter Bounties</h2>
            <div class="bounty-medals-display">
                🎃 <span id="bountyMedalCount">${window.gameState.currency.halloweenMedals || 0}</span> Medals
            </div>
        </div>
        
        <div class="bounty-info">
            Hunt specific auras to earn Halloween Medals! Bounties refresh daily.
        </div>
        
        <div id="bountyList" class="bounty-list"></div>
        
        <div class="bounty-footer">
            <button onclick="refreshBounties()" class="bounty-refresh-btn" id="bountyRefreshBtn">
                🔄 Refresh Bounties (Cost: 50 Medals)
            </button>
            <div class="bounty-next-refresh" id="bountyNextRefresh"></div>
        </div>
    `;
    
    updateBountyUI();
    updateBountyTimer();
    setInterval(updateBountyTimer, 1000);
}

// Update bounty UI
function updateBountyUI() {
    const bountyList = document.getElementById('bountyList');
    const medalCount = document.getElementById('bountyMedalCount');
    
    if (!bountyList) return;
    if (medalCount) {
        medalCount.textContent = window.gameState.currency.halloweenMedals || 0;
    }
    
    bountyList.innerHTML = '';
    
    if (!window.gameState.bountySystem.activeBounties || 
        window.gameState.bountySystem.activeBounties.length === 0) {
        bountyList.innerHTML = '<div class="bounty-empty">No active bounties. Generate new ones!</div>';
        return;
    }
    
    window.gameState.bountySystem.activeBounties.forEach(bounty => {
        const bountyCard = document.createElement('div');
        bountyCard.className = `bounty-card ${bounty.completed ? 'bounty-completed' : ''}`;
        bountyCard.style.borderColor = bounty.tierData.color;
        
        const targetAurasHTML = bounty.targetAuras.map(target => `
            <div class="bounty-target ${target.collected ? 'collected' : ''}">
                <span class="bounty-target-icon">${target.collected ? '✓' : '○'}</span>
                <span class="bounty-target-name">${target.name}</span>
                <span class="bounty-target-rarity">(1:${target.rarity.toLocaleString()})</span>
            </div>
        `).join('');
        
        bountyCard.innerHTML = `
            <div class="bounty-card-header" style="background: linear-gradient(135deg, ${bounty.tierData.color}20, transparent);">
                <span class="bounty-tier-icon">${bounty.tierData.icon}</span>
                <span class="bounty-tier-name">${bounty.tierData.name}</span>
            </div>
            
            <div class="bounty-progress-bar">
                <div class="bounty-progress-fill" style="width: ${(bounty.progress / bounty.targetAuras.length) * 100}%; background: ${bounty.tierData.color};"></div>
                <span class="bounty-progress-text">${bounty.progress}/${bounty.targetAuras.length}</span>
            </div>
            
            <div class="bounty-targets">
                ${targetAurasHTML}
            </div>
            
            <div class="bounty-reward">
                <span class="bounty-reward-label">Reward:</span>
                <span class="bounty-reward-value">🎃 ${bounty.tierData.medalReward} Medals</span>
            </div>
            
            ${bounty.completed && !bounty.claimed ? `
                <button onclick="claimBounty('${bounty.id}')" class="bounty-claim-btn">
                    CLAIM REWARD
                </button>
            ` : bounty.claimed ? `
                <div class="bounty-claimed">✓ CLAIMED</div>
            ` : ''}
        `;
        
        bountyList.appendChild(bountyCard);
    });
}

// Update refresh timer
function updateBountyTimer() {
    const timerEl = document.getElementById('bountyNextRefresh');
    if (!timerEl) return;
    
    const now = Date.now();
    const timeLeft = window.gameState.bountySystem.dailyRefreshTime - now;
    
    if (timeLeft <= 0) {
        timerEl.textContent = 'Bounties ready to refresh!';
        checkBountyRefresh();
        return;
    }
    
    const hours = Math.floor(timeLeft / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    
    timerEl.textContent = `Next refresh: ${hours}h ${minutes}m ${seconds}s`;
}

// Manual refresh (costs medals)
window.refreshBounties = function() {
    const cost = 50;
    
    if (window.gameState.currency.halloweenMedals < cost) {
        showNotification('❌ Not enough Halloween Medals!', 'error');
        return;
    }
    
    if (!confirm(`Refresh all bounties for ${cost} Halloween Medals?`)) {
        return;
    }
    
    window.gameState.currency.halloweenMedals -= cost;
    window.gameState.bountySystem.activeBounties = generateBounties();
    
    showNotification('🔄 Bounties refreshed!', 'success');
    updateBountyUI();
    updateUI();
    saveGameState();
};

// Add CSS styles
const bountyStyles = document.createElement('style');
bountyStyles.textContent = `
    @keyframes bountyAppear {
        from { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes bountyDisappear {
        from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        to { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
    }
    
    .bounty-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
    
    .bounty-title {
        font-size: 24px;
        font-weight: 700;
        color: #fff;
        margin: 0;
    }
    
    .bounty-medals-display {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        padding: 8px 16px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 18px;
    }
    
    .bounty-info {
        background: rgba(255,255,255,0.05);
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 14px;
        color: #a0a0a0;
    }
    
    .bounty-list {
        display: grid;
        gap: 16px;
        margin-bottom: 16px;
    }
    
    .bounty-card {
        background: linear-gradient(135deg, #1a1f2e 0%, #242b3d 100%);
        border: 2px solid;
        border-radius: 12px;
        padding: 16px;
        transition: all 0.3s ease;
    }
    
    .bounty-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    }
    
    .bounty-completed {
        border-color: #10b981 !important;
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
    }
    
    .bounty-card-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border-radius: 8px;
        margin-bottom: 12px;
    }
    
    .bounty-tier-icon {
        font-size: 24px;
    }
    
    .bounty-tier-name {
        font-weight: 600;
        font-size: 16px;
    }
    
    .bounty-progress-bar {
        position: relative;
        height: 24px;
        background: rgba(0,0,0,0.3);
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 12px;
    }
    
    .bounty-progress-fill {
        height: 100%;
        transition: width 0.3s ease;
    }
    
    .bounty-progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-weight: 600;
        font-size: 12px;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }
    
    .bounty-targets {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
    }
    
    .bounty-target {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: rgba(255,255,255,0.03);
        border-radius: 6px;
        transition: all 0.3s ease;
    }
    
    .bounty-target.collected {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
    }
    
    .bounty-target-icon {
        font-size: 16px;
        width: 20px;
        text-align: center;
    }
    
    .bounty-target-name {
        flex: 1;
        font-weight: 500;
    }
    
    .bounty-target-rarity {
        font-size: 12px;
        color: #888;
    }
    
    .bounty-reward {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-radius: 8px;
        margin-bottom: 12px;
    }
    
    .bounty-reward-label {
        font-size: 14px;
        color: #888;
    }
    
    .bounty-reward-value {
        font-size: 16px;
        font-weight: 600;
        color: #f59e0b;
    }
    
    .bounty-claim-btn {
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #10b981, #059669);
        border: none;
        border-radius: 8px;
        color: #fff;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .bounty-claim-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }
    
    .bounty-claimed {
        text-align: center;
        padding: 12px;
        background: rgba(16, 185, 129, 0.2);
        border-radius: 8px;
        color: #10b981;
        font-weight: 600;
    }
    
    .bounty-footer {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .bounty-refresh-btn {
        padding: 12px;
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        border: none;
        border-radius: 8px;
        color: #fff;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .bounty-refresh-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
    
    .bounty-next-refresh {
        text-align: center;
        font-size: 14px;
        color: #888;
    }
    
    .bounty-empty {
        text-align: center;
        padding: 32px;
        color: #666;
        font-size: 16px;
    }
    
    .bounty-complete-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }
    
    .bounty-complete-icon {
        font-size: 64px;
        animation: pulse 2s ease-in-out infinite;
    }
    
    .bounty-complete-title {
        font-size: 24px;
        font-weight: 700;
        color: #fff;
    }
    
    .bounty-complete-reward {
        font-size: 20px;
        font-weight: 600;
        color: #f59e0b;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(bountyStyles);

// Initialize on load - with retry for AURAS
if (typeof window.addEventListener === 'function') {
    window.addEventListener('DOMContentLoaded', () => {
        // Try immediately
        initializeBounties();
        checkBountyRefresh();
        
        // Retry with exponential backoff if AURAS wasn't loaded yet
        let retryAttempts = 0;
        const maxRetries = 5;
        
        const retryBountyInit = () => {
            retryAttempts++;
            
            if (window.AURAS && window.AURAS.length > 0) {
                if (window.gameState.bountySystem.activeBounties.length === 0) {
                    console.log('🔄 Retrying bounty generation with loaded AURAS (' + window.AURAS.length + ' auras available)');
                    initializeBounties();
                    if (typeof createBountyUI === 'function') {
                        updateBountyUI();
                    }
                } else {
                    console.log('✅ Bounties already generated');
                }
            } else if (retryAttempts < maxRetries) {
                console.log(`⏳ AURAS still not loaded, retry ${retryAttempts}/${maxRetries} in ${1000 * retryAttempts}ms...`);
                setTimeout(retryBountyInit, 1000 * retryAttempts);
            } else {
                console.warn('❌ Failed to load AURAS after ' + maxRetries + ' attempts');
            }
        };
        
        setTimeout(retryBountyInit, 2000);
    });
}

// Hook into roll completion - with retry mechanism
function hookBountyTracking() {
    if (typeof window.completeRoll !== 'undefined') {
        const originalCompleteRoll = window.completeRoll;
        window.completeRoll = async function(...args) {
            const result = await originalCompleteRoll.apply(this, args);
            
            // Get the last rolled aura
            if (window.gameState && window.gameState.inventory && window.gameState.inventory.auras) {
                const lastAura = Object.entries(window.gameState.inventory.auras)
                    .sort((a, b) => {
                        const aTime = a[1].rollHistory?.[a[1].rollHistory.length - 1]?.timestamp || 0;
                        const bTime = b[1].rollHistory?.[b[1].rollHistory.length - 1]?.timestamp || 0;
                        return bTime - aTime;
                    })[0];
                
                if (lastAura) {
                    const auraData = window.AURAS?.find(a => a.name === lastAura[0]);
                    if (auraData) {
                        trackBountyProgress(auraData);
                    }
                }
            }
            
            return result;
        };
        console.log('✅ Bounty tracking hooked into completeRoll');
    } else {
        // Retry after delay
        setTimeout(hookBountyTracking, 1000);
    }
}

// Start hooking
hookBountyTracking();

console.log('✅ Bounty System loaded');
