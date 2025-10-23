// =================================================================
// CHALLENGE MODES SYSTEM
// =================================================================
// Special rolling modes with restrictions and rewards

// Initialize challenge system
if (!window.gameState.challengeSystem) {
    window.gameState.challengeSystem = {
        activeChallenges: [],
        completedChallenges: [],
        totalChallengesCompleted: 0,
        highScores: {},
        unlocked: false
    };
}

// Unlock at 5,000 rolls
function checkChallengeUnlock() {
    if (!window.gameState.challengeSystem.unlocked && window.gameState.totalRolls >= 5000) {
        window.gameState.challengeSystem.unlocked = true;
        showNotification('⚔️ Challenge Modes unlocked!', 'legendary');
        saveGameState();
    }
}

// Challenge definitions
const CHALLENGES = {
    IRONMAN: {
        id: 'ironman',
        name: '⚔️ Ironman Mode',
        description: 'No potions or items allowed. +50% rare aura chance.',
        difficulty: 'Hard',
        duration: 3600000, // 1 hour
        restrictions: {
            noPotions: true,
            noItems: true
        },
        bonuses: {
            luckMultiplier: 1.5
        },
        objectives: [
            { type: 'rollCount', target: 100, current: 0, description: 'Roll 100 times' },
            { type: 'rareTier', target: 5, current: 0, description: 'Roll 5 Legendary+ auras' }
        ],
        rewards: {
            halloweenMedals: 50,
            voidCoins: 100,
            money: 5000,
            title: 'Iron Roller'
        }
    },
    
    SPEEDRUN: {
        id: 'speedrun',
        name: '⏱️ Speed Run',
        description: 'Roll 100 times in 5 minutes. Speed boost enabled.',
        difficulty: 'Medium',
        duration: 300000, // 5 minutes
        restrictions: {
            timeLimit: 300000
        },
        bonuses: {
            speedMultiplier: 3
        },
        objectives: [
            { type: 'rollCount', target: 100, current: 0, description: 'Roll 100 times in 5 minutes' }
        ],
        rewards: {
            halloweenMedals: 30,
            voidCoins: 50,
            potions: { 'Haste Potion III': 5 },
            title: 'Speed Demon'
        }
    },
    
    HARDCORE: {
        id: 'hardcore',
        name: '💀 Hardcore Mode',
        description: 'Roll "Nothing" 3 times = fail. 10x rewards on completion.',
        difficulty: 'Extreme',
        duration: 7200000, // 2 hours
        restrictions: {
            lives: 3,
            currentLives: 3
        },
        bonuses: {
            rewardMultiplier: 10
        },
        objectives: [
            { type: 'rollCount', target: 500, current: 0, description: 'Roll 500 times without failing' },
            { type: 'noDeaths', target: 1, current: 1, description: 'Don\'t roll "Nothing" 3 times' }
        ],
        rewards: {
            halloweenMedals: 500,
            voidCoins: 1000,
            darkPoints: 500,
            money: 50000,
            title: 'Hardcore Survivor'
        }
    },
    
    COLLECTOR: {
        id: 'collector',
        name: '📚 Collector Challenge',
        description: 'Collect 20 unique auras. No duplicates count.',
        difficulty: 'Medium',
        duration: 3600000, // 1 hour
        restrictions: {
            uniquesOnly: true
        },
        bonuses: {
            varietyBonus: true
        },
        objectives: [
            { type: 'uniqueAuras', target: 20, current: 0, description: 'Collect 20 unique auras' }
        ],
        rewards: {
            halloweenMedals: 40,
            items: { 'Random Rune Chest': 5 },
            title: 'Aura Collector'
        }
    },
    
    LUCKY_STREAK: {
        id: 'luckystreak',
        name: '🍀 Lucky Streak',
        description: 'Get 10 rare+ auras in a row. Base luck only.',
        difficulty: 'Hard',
        duration: 1800000, // 30 minutes
        restrictions: {
            noPotions: true,
            streakRequired: true
        },
        bonuses: {
            streakMultiplier: 1.2
        },
        objectives: [
            { type: 'rareStreak', target: 10, current: 0, description: 'Roll 10 rare+ auras in a row' }
        ],
        rewards: {
            halloweenMedals: 60,
            potions: { 'Fortune Potion III': 3 },
            title: 'Lucky Streak Master'
        }
    },
    
    MINIMALIST: {
        id: 'minimalist',
        name: '🎯 Minimalist',
        description: 'Roll only 50 times but get 5 Mythic+ auras.',
        difficulty: 'Extreme',
        duration: 1800000, // 30 minutes
        restrictions: {
            maxRolls: 50,
            currentRolls: 0
        },
        bonuses: {
            luckMultiplier: 5
        },
        objectives: [
            { type: 'mythicCount', target: 5, current: 0, description: 'Roll 5 Mythic+ auras in 50 rolls' }
        ],
        rewards: {
            halloweenMedals: 200,
            voidCoins: 500,
            potions: { 'Forbidden Potion III': 1 },
            title: 'Minimalist Master'
        }
    }
};

// Start a challenge
window.startChallenge = function(challengeId) {
    if (!window.gameState.challengeSystem.unlocked) {
        showNotification('🔒 Unlock challenges at 5,000 rolls!', 'error');
        return;
    }
    
    // Check if already in a challenge
    if (window.gameState.challengeSystem.activeChallenges.length > 0) {
        showNotification('❌ Already in a challenge!', 'error');
        return;
    }
    
    const challenge = JSON.parse(JSON.stringify(CHALLENGES[challengeId]));
    if (!challenge) return;
    
    // Initialize challenge
    challenge.startTime = Date.now();
    challenge.endTime = Date.now() + challenge.duration;
    challenge.startingRolls = window.gameState.totalRolls;
    challenge.collectedAuras = [];
    
    window.gameState.challengeSystem.activeChallenges.push(challenge);
    
    // Apply bonuses
    if (challenge.bonuses.luckMultiplier) {
        window.gameState.currentLuck *= challenge.bonuses.luckMultiplier;
    }
    if (challenge.bonuses.speedMultiplier) {
        window.gameState.currentSpeed *= challenge.bonuses.speedMultiplier;
    }
    
    showNotification(`⚔️ ${challenge.name} started!`, 'legendary');
    updateChallengeUI();
    recalculateStats();
    saveGameState();
};

// Track challenge progress
function trackChallengeProgress(aura) {
    const activeChallenges = window.gameState.challengeSystem.activeChallenges;
    if (activeChallenges.length === 0) return;
    
    activeChallenges.forEach(challenge => {
        const rollsSinceStart = window.gameState.totalRolls - challenge.startingRolls;
        
        // Check restrictions
        if (challenge.restrictions.lives !== undefined) {
            if (aura.name === 'Nothing') {
                challenge.restrictions.currentLives--;
                showNotification(`💀 Lives: ${challenge.restrictions.currentLives}/${challenge.restrictions.lives}`, 'error');
                
                if (challenge.restrictions.currentLives <= 0) {
                    failChallenge(challenge);
                    return;
                }
            }
        }
        
        if (challenge.restrictions.maxRolls !== undefined) {
            challenge.restrictions.currentRolls++;
            if (challenge.restrictions.currentRolls > challenge.restrictions.maxRolls) {
                failChallenge(challenge);
                return;
            }
        }
        
        // Track objectives
        challenge.objectives.forEach(objective => {
            switch (objective.type) {
                case 'rollCount':
                    objective.current = rollsSinceStart;
                    break;
                    
                case 'rareTier':
                    if (['legendary', 'mythic', 'exotic', 'divine', 'transcendent'].includes(aura.tier)) {
                        objective.current++;
                    }
                    break;
                    
                case 'uniqueAuras':
                    if (!challenge.collectedAuras.includes(aura.name)) {
                        challenge.collectedAuras.push(aura.name);
                        objective.current = challenge.collectedAuras.length;
                    }
                    break;
                    
                case 'rareStreak':
                    if (['rare', 'epic', 'legendary', 'mythic', 'exotic', 'divine', 'transcendent'].includes(aura.tier)) {
                        objective.current++;
                    } else {
                        objective.current = 0; // Reset streak
                    }
                    break;
                    
                case 'mythicCount':
                    if (['mythic', 'exotic', 'divine', 'transcendent'].includes(aura.tier)) {
                        objective.current++;
                    }
                    break;
            }
        });
        
        // Check completion
        const allComplete = challenge.objectives.every(obj => obj.current >= obj.target);
        if (allComplete) {
            completeChallenge(challenge);
        }
    });
    
    updateChallengeUI();
}

// Complete challenge
function completeChallenge(challenge) {
    showNotification(`🎉 ${challenge.name} Complete!`, 'legendary');
    
    // Award rewards
    const rewards = challenge.rewards;
    const multiplier = challenge.bonuses.rewardMultiplier || 1;
    
    if (rewards.halloweenMedals) {
        window.gameState.currency.halloweenMedals += rewards.halloweenMedals * multiplier;
    }
    if (rewards.voidCoins) {
        window.gameState.currency.voidCoins += rewards.voidCoins * multiplier;
    }
    if (rewards.darkPoints) {
        window.gameState.currency.darkPoints += rewards.darkPoints * multiplier;
    }
    if (rewards.money) {
        window.gameState.currency.money += rewards.money * multiplier;
    }
    if (rewards.potions) {
        for (const [potion, amount] of Object.entries(rewards.potions)) {
            if (!window.gameState.inventory.potions[potion]) {
                window.gameState.inventory.potions[potion] = { count: 0 };
            }
            window.gameState.inventory.potions[potion].count += amount;
        }
    }
    if (rewards.items) {
        for (const [item, amount] of Object.entries(rewards.items)) {
            if (!window.gameState.inventory.items[item]) {
                window.gameState.inventory.items[item] = { count: 0 };
            }
            window.gameState.inventory.items[item].count += amount;
        }
    }
    
    // Move to completed
    challenge.completedTime = Date.now();
    window.gameState.challengeSystem.completedChallenges.push(challenge);
    window.gameState.challengeSystem.activeChallenges = 
        window.gameState.challengeSystem.activeChallenges.filter(c => c.id !== challenge.id);
    window.gameState.challengeSystem.totalChallengesCompleted++;
    
    // Show rewards modal
    showChallengeRewardsModal(challenge, rewards, multiplier);
    
    // Reset bonuses
    recalculateStats();
    updateUI();
    saveGameState();
}

// Fail challenge
function failChallenge(challenge) {
    showNotification(`💀 ${challenge.name} Failed!`, 'error');
    
    window.gameState.challengeSystem.activeChallenges = 
        window.gameState.challengeSystem.activeChallenges.filter(c => c.id !== challenge.id);
    
    recalculateStats();
    updateChallengeUI();
    saveGameState();
}

// Show rewards modal
function showChallengeRewardsModal(challenge, rewards, multiplier) {
    const modal = document.createElement('div');
    modal.className = 'challenge-reward-modal';
    modal.innerHTML = `
        <div class="challenge-reward-content">
            <div class="challenge-reward-icon">🎉</div>
            <h2>${challenge.name} Complete!</h2>
            <div class="challenge-reward-list">
                ${rewards.halloweenMedals ? `<div>🎃 ${rewards.halloweenMedals * multiplier} Halloween Medals</div>` : ''}
                ${rewards.voidCoins ? `<div>🌀 ${rewards.voidCoins * multiplier} Void Coins</div>` : ''}
                ${rewards.darkPoints ? `<div>🌑 ${rewards.darkPoints * multiplier} Dark Points</div>` : ''}
                ${rewards.money ? `<div>💰 ${rewards.money * multiplier} Money</div>` : ''}
                ${rewards.title ? `<div class="reward-title">🏆 Title: ${rewards.title}</div>` : ''}
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="challenge-reward-btn">
                Claim
            </button>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(modal);
}

// Check challenge timeouts
function checkChallengeTimeouts() {
    const now = Date.now();
    window.gameState.challengeSystem.activeChallenges.forEach(challenge => {
        if (now >= challenge.endTime) {
            // Check if objectives met
            const allComplete = challenge.objectives.every(obj => obj.current >= obj.target);
            if (allComplete) {
                completeChallenge(challenge);
            } else {
                failChallenge(challenge);
            }
        }
    });
}

// Create challenge UI
function createChallengeMenu() {
    const container = document.getElementById('challengeMenuContainer');
    if (!container) return;
    
    const unlocked = window.gameState.challengeSystem.unlocked;
    
    container.innerHTML = `
        <div class="challenge-menu">
            <h2 class="challenge-title">⚔️ Challenge Modes</h2>
            
            ${!unlocked ? `
                <div class="challenge-locked">
                    🔒 Unlock at 5,000 rolls
                    <div class="challenge-progress-text">${window.gameState.totalRolls.toLocaleString()} / 5,000</div>
                </div>
            ` : `
                <div class="challenge-stats">
                    <div class="challenge-stat">
                        <span>Completed:</span>
                        <span>${window.gameState.challengeSystem.totalChallengesCompleted}</span>
                    </div>
                </div>
                
                <div id="activeChallengesDisplay" class="active-challenges-display"></div>
                
                <div class="challenge-grid">
                    ${Object.values(CHALLENGES).map(challenge => `
                        <div class="challenge-card">
                            <div class="challenge-card-header">
                                <h3>${challenge.name}</h3>
                                <span class="challenge-difficulty ${challenge.difficulty.toLowerCase()}">${challenge.difficulty}</span>
                            </div>
                            <p class="challenge-description">${challenge.description}</p>
                            <div class="challenge-objectives">
                                ${challenge.objectives.map(obj => `
                                    <div class="challenge-objective">• ${obj.description}</div>
                                `).join('')}
                            </div>
                            <div class="challenge-rewards-preview">
                                <strong>Rewards:</strong>
                                🎃 ${challenge.rewards.halloweenMedals || 0}
                                ${challenge.rewards.voidCoins ? `🌀 ${challenge.rewards.voidCoins}` : ''}
                            </div>
                            <button onclick="startChallenge('${challenge.id}')" class="challenge-start-btn">
                                START CHALLENGE
                            </button>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    `;
    
    updateChallengeUI();
}

// Update challenge UI
function updateChallengeUI() {
    const display = document.getElementById('activeChallengesDisplay');
    if (!display) return;
    
    const active = window.gameState.challengeSystem.activeChallenges;
    
    if (active.length === 0) {
        display.innerHTML = '';
        return;
    }
    
    display.innerHTML = active.map(challenge => {
        const timeLeft = challenge.endTime - Date.now();
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        
        return `
            <div class="active-challenge-card">
                <div class="active-challenge-header">
                    <strong>${challenge.name}</strong>
                    <span class="active-challenge-timer">${minutes}:${seconds.toString().padStart(2, '0')}</span>
                </div>
                <div class="active-challenge-progress">
                    ${challenge.objectives.map(obj => `
                        <div class="objective-progress">
                            <span>${obj.description}</span>
                            <span class="objective-progress-value">${obj.current}/${obj.target}</span>
                            <div class="objective-progress-bar">
                                <div class="objective-progress-fill" style="width: ${Math.min((obj.current / obj.target) * 100, 100)}%;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${challenge.restrictions.currentLives !== undefined ? `
                    <div class="challenge-lives">💀 Lives: ${challenge.restrictions.currentLives}/${challenge.restrictions.lives}</div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Hook into roll completion - with retry mechanism
function hookChallengeTracking() {
    if (typeof window.completeRoll !== 'undefined') {
        const originalCompleteRoll2 = window.completeRoll;
        window.completeRoll = async function(...args) {
            const result = await originalCompleteRoll2.apply(this, args);
            
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
                        trackChallengeProgress(auraData);
                    }
                }
            }
            
            return result;
        };
        console.log('✅ Challenge tracking hooked into completeRoll');
    } else {
        // Retry after delay
        setTimeout(hookChallengeTracking, 1000);
    }
}

// Start hooking
hookChallengeTracking();

// Auto-check timeouts
setInterval(checkChallengeTimeouts, 1000);
setInterval(updateChallengeUI, 1000);

// Initialize
if (typeof window.addEventListener === 'function') {
    window.addEventListener('DOMContentLoaded', () => {
        checkChallengeUnlock();
    });
}

console.log('✅ Challenge Modes System loaded');
