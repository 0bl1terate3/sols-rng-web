// =================================================================
// Comprehensive Leaderboard UI System
// =================================================================

// Leaderboard categories configuration
const LEADERBOARD_CATEGORIES = [
    {
        id: 'globals',
        name: '🏆 Global Auras',
        icon: '🏆',
        boards: [
            { key: 'globalAuras', name: 'Hall of Fame - Rarest Globals', format: 'global', sortKey: 'auraRarity' }
        ]
    },
    {
        id: 'collected',
        name: '📈 Collected Stats',
        icon: '📈',
        boards: [
            { key: 'collectedStats', name: 'Collection Score (Sum of Rarities)', format: 'collected', sortKey: 'totalScore' }
        ]
    },
    {
        id: 'core',
        name: '🎯 Core Stats',
        icon: '🎯',
        boards: [
            { key: 'totalRolls', name: 'Total Rolls', format: 'number', sortKey: 'totalRolls' },
            { key: 'rarestAuraRarity', name: 'Rarest Aura', format: 'rarity', sortKey: 'rarestAuraRarity' },
            { key: 'uniqueAurasOwned', name: 'Unique Auras', format: 'number', sortKey: 'uniqueAurasOwned' },
            { key: 'totalMoneyEarned', name: 'Total Money Earned', format: 'money', sortKey: 'totalMoneyEarned' },
            { key: 'totalVoidCoinsEarned', name: 'Void Coins Earned', format: 'number', sortKey: 'totalVoidCoinsEarned' },
            { key: 'achievementPoints', name: 'Achievement Points', format: 'number', sortKey: 'achievementPoints' }
        ]
    },
    {
        id: 'rolling',
        name: '🎲 Rolling & Luck',
        icon: '🎲',
        boards: [
            { key: 'maxLuckMultiplier', name: 'Max Luck', format: 'multiplier', sortKey: 'maxLuckMultiplier' },
            { key: 'maxSpeedMultiplier', name: 'Max Speed', format: 'multiplier', sortKey: 'maxSpeedMultiplier' },
            { key: 'totalBreakthroughs', name: 'Total Breakthroughs', format: 'number', sortKey: 'totalBreakthroughs' },
            { key: 'longestRollStreak', name: 'Longest Streak', format: 'number', sortKey: 'longestRollStreak' },
            { key: 'mostRollsIn24Hours', name: 'Most Rolls (24h)', format: 'number', sortKey: 'mostRollsIn24Hours' },
            { key: 'autoRollsCompleted', name: 'Auto-Rolls', format: 'number', sortKey: 'autoRollsCompleted' },
            { key: 'longestBreakthroughStreak', name: 'Breakthrough Streak', format: 'number', sortKey: 'longestBreakthroughStreak' }
        ]
    },
    {
        id: 'collection',
        name: '🌟 Collection',
        icon: '🌟',
        boards: [
            { key: 'totalDuplicates', name: 'Total Duplicates', format: 'number', sortKey: 'totalDuplicates' },
            { key: 'auraCollectionPercentage', name: 'Collection %', format: 'percentage', sortKey: 'auraCollectionPercentage' },
            { key: 'totalRaritySum', name: 'Total Rarity', format: 'number', sortKey: 'totalRaritySum' },
            { key: 'mostAurasInSession', name: 'Session Record', format: 'number', sortKey: 'mostAurasInSession' }
        ]
    },
    {
        id: 'economy',
        name: '💰 Economy',
        icon: '💰',
        boards: [
            { key: 'currentMoney', name: 'Current Wealth', format: 'money', sortKey: 'currentMoney' },
            { key: 'currentVoidCoins', name: 'Void Coins', format: 'number', sortKey: 'currentVoidCoins' },
            { key: 'mostExpensivePurchase', name: 'Biggest Purchase', format: 'money', sortKey: 'mostExpensivePurchase' },
            { key: 'totalMerchantSpending', name: 'Total Spent', format: 'money', sortKey: 'totalMerchantSpending' }
        ]
    },
    {
        id: 'crafting',
        name: '⚗️ Crafting',
        icon: '⚗️',
        boards: [
            { key: 'totalItemsCrafted', name: 'Items Crafted', format: 'number', sortKey: 'totalItemsCrafted' },
            { key: 'totalPotionsUsed', name: 'Potions Used', format: 'number', sortKey: 'totalPotionsUsed' },
            { key: 'uniquePotionTypesCrafted', name: 'Potion Variety', format: 'number', sortKey: 'uniquePotionTypesCrafted' },
            { key: 'longestPotionChain', name: 'Longest Chain', format: 'number', sortKey: 'longestPotionChain' }
        ]
    },
    {
        id: 'biomes',
        name: '🌍 Biomes',
        icon: '🌍',
        boards: [
            { key: 'uniqueBiomesExperienced', name: 'Biomes Discovered', format: 'number', sortKey: 'uniqueBiomesExperienced' },
            { key: 'rarestBiomeWitnessed', name: 'Rarest Biome', format: 'text', sortKey: 'rarestBiomeRarity' }
        ]
    },
    {
        id: 'achievements',
        name: '🏆 Achievements',
        icon: '🏆',
        boards: [
            { key: 'totalAchievementsCompleted', name: 'Total Completed', format: 'number', sortKey: 'totalAchievementsCompleted' },
            { key: 'achievementCompletionPercentage', name: 'Completion %', format: 'percentage', sortKey: 'achievementCompletionPercentage' },
            { key: 'dailyQuestsCompleted', name: 'Daily Quests', format: 'number', sortKey: 'dailyQuestsCompleted' }
        ]
    },
    {
        id: 'time',
        name: '⏱️ Time Stats',
        icon: '⏱️',
        boards: [
            { key: 'consecutiveDaysPlayed', name: 'Login Streak', format: 'number', sortKey: 'consecutiveDaysPlayed' },
            { key: 'longestSessionTime', name: 'Longest Session', format: 'time', sortKey: 'longestSessionTime' },
            { key: 'totalPlayTime', name: 'Total Playtime', format: 'time', sortKey: 'totalPlayTime' }
        ]
    },
    {
        id: 'special',
        name: '✨ Special',
        icon: '✨',
        boards: [
            { key: 'highestPityReached', name: 'Highest Pity', format: 'number', sortKey: 'highestPityReached' },
            { key: 'dayRolls', name: 'Day Rolls', format: 'number', sortKey: 'dayRolls' },
            { key: 'nightRolls', name: 'Night Rolls', format: 'number', sortKey: 'nightRolls' },
            { key: 'highestGearScore', name: 'Gear Score', format: 'number', sortKey: 'highestGearScore' }
        ]
    },
    {
        id: 'speed',
        name: '⚡ Speed Runs',
        icon: '⚡',
        boards: [
            { key: 'fastestTo1kRolls', name: 'First to 1K', format: 'time', sortKey: 'fastestTo1kRolls' },
            { key: 'fastestTo10kRolls', name: 'First to 10K', format: 'time', sortKey: 'fastestTo10kRolls' },
            { key: 'fastestTo100kRolls', name: 'First to 100K', format: 'time', sortKey: 'fastestTo100kRolls' }
        ]
    }
];

// Format value based on type
function formatLeaderboardValue(value, format) {
    // Only treat truly missing values as N/A (not zero - zero is valid!)
    if (value === null || value === undefined) return 'N/A';
    
    // For specific formats, check if zero should be shown
    if (value === 0) {
        switch(format) {
            case 'rarity':
            case 'text':
                return 'N/A'; // These shouldn't be zero
            default:
                // For money, numbers, percentages, etc., zero is valid
                break;
        }
    }
    
    switch(format) {
        case 'number':
            return value.toLocaleString();
        case 'money':
            return `$${value.toLocaleString()}`;
        case 'rarity':
            return `1 in ${value.toLocaleString()}`;
        case 'multiplier':
            return `${value.toFixed(2)}x`;
        case 'percentage':
            return `${value.toFixed(1)}%`;
        case 'time':
            return formatTime(value);
        case 'text':
            return value || 'None';
        default:
            return value.toString();
    }
}

function formatTime(seconds) {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
}

// Open leaderboard modal with specific category
function openLeaderboardModal(categoryId = 'core') {
    const modal = document.getElementById('leaderboardModal');
    if (!modal) {
        console.error('Leaderboard modal not found');
        return;
    }
    
    // Set active category
    currentLeaderboardCategory = categoryId;
    
    // Render leaderboard
    renderLeaderboardContent(categoryId);
    
    // Show modal
    modal.classList.add('show');
}

function closeLeaderboardModal() {
    const modal = document.getElementById('leaderboardModal');
    modal?.classList.remove('show');
}

let currentLeaderboardCategory = 'core';

function renderLeaderboardContent(categoryId) {
    const category = LEADERBOARD_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;
    
    const modalBody = document.querySelector('#leaderboardModal .modal-body');
    if (!modalBody) return;
    
    // Create category tabs
    let tabsHTML = '<div class="leaderboard-tabs">';
    LEADERBOARD_CATEGORIES.forEach(cat => {
        const active = cat.id === categoryId ? 'active' : '';
        tabsHTML += `
            <button class="leaderboard-tab ${active}" onclick="switchLeaderboardCategory('${cat.id}')">
                ${cat.icon} ${cat.name}
            </button>
        `;
    });
    tabsHTML += '</div>';
    
    // Create leaderboard content
    let contentHTML = '<div class="leaderboard-content">';
    
    category.boards.forEach(board => {
        contentHTML += `
            <div class="leaderboard-board">
                <h3 class="board-title">${board.name}</h3>
                <div id="leaderboard-${board.key}" class="board-list">
                    <div class="loading">Loading...</div>
                </div>
            </div>
        `;
    });
    
    contentHTML += '</div>';
    
    modalBody.innerHTML = tabsHTML + contentHTML;
    
    // Load leaderboard data
    loadLeaderboardData(category);
}

function switchLeaderboardCategory(categoryId) {
    currentLeaderboardCategory = categoryId;
    renderLeaderboardContent(categoryId);
}

async function loadLeaderboardData(category) {
    if (!window.globalLeaderboard?.firebaseInitialized) {
        // Show local stats only
        showLocalStats(category);
        return;
    }
    
    try {
        const db = window.globalLeaderboard.db;
        
        // Special handling for Global Auras category
        if (category.id === 'globals') {
            await loadGlobalAurasLeaderboard();
            return;
        }
        
        // Special handling for Collected Stats category
        if (category.id === 'collected') {
            await loadCollectedStatsLeaderboard();
            return;
        }
        
        for (const board of category.boards) {
            const container = document.getElementById(`leaderboard-${board.key}`);
            if (!container) continue;
            
            // Fetch top 10 for this stat
            const snapshot = await db.collection('playerStats')
                .orderBy(board.sortKey, 'desc')
                .limit(10)
                .get();
            
            let html = '';
            let rank = 1;
            
            snapshot.forEach(doc => {
                const data = doc.data();
                const value = data[board.key];
                const playerName = data.playerName || 'Unknown';
                
                const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';
                
                html += `
                    <div class="leaderboard-entry ${rankClass}">
                        <span class="entry-rank">#${rank}</span>
                        <span class="entry-name">${playerName}</span>
                        <span class="entry-value">${formatLeaderboardValue(value, board.format)}</span>
                    </div>
                `;
                rank++;
            });
            
            if (html === '') {
                html = '<div class="no-data">No data yet</div>';
            }
            
            // Add player's own stat
            if (window.leaderboardStats) {
                const playerValue = window.leaderboardStats.getStat(board.key);
                html += `
                    <div class="leaderboard-entry player-entry">
                        <span class="entry-rank">YOU</span>
                        <span class="entry-name">${window.globalLeaderboard.playerName || 'You'}</span>
                        <span class="entry-value">${formatLeaderboardValue(playerValue, board.format)}</span>
                    </div>
                `;
            }
            
            container.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading leaderboard data:', error);
        showLocalStats(category);
    }
}

function showLocalStats(category) {
    if (!window.leaderboardStats) return;
    
    category.boards.forEach(board => {
        const container = document.getElementById(`leaderboard-${board.key}`);
        if (!container) return;
        
        const value = window.leaderboardStats.getStat(board.key);
        
        container.innerHTML = `
            <div class="leaderboard-entry player-entry">
                <span class="entry-rank">YOU</span>
                <span class="entry-name">Your Stats</span>
                <span class="entry-value">${formatLeaderboardValue(value, board.format)}</span>
            </div>
            <div class="no-data">Connect to see global rankings</div>
        `;
    });
}

// Load Global Auras leaderboard (from original system)
async function loadGlobalAurasLeaderboard() {
    const container = document.getElementById('leaderboard-globalAuras');
    if (!container || !window.globalLeaderboard) return;
    
    try {
        const globals = await window.globalLeaderboard.getTopGlobals(50);
        
        if (!globals || globals.length === 0) {
            container.innerHTML = '<div class="no-data">No global auras submitted yet. Be the first!</div>';
            return;
        }
        
        let html = '';
        let rank = 1;
        
        globals.forEach(entry => {
            const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';
            const rarityText = entry.auraRarity ? `1 in ${entry.auraRarity.toLocaleString()}` : 'Unknown';
            
            html += `
                <div class="leaderboard-entry global-entry ${rankClass}">
                    <span class="entry-rank">#${rank}</span>
                    <div class="global-aura-info">
                        <div class="global-aura-name">${entry.auraName || 'Unknown'}</div>
                        <div class="global-aura-details">
                            <span class="global-player">${entry.playerName || 'Unknown'}</span>
                            <span class="global-rarity">${rarityText}</span>
                            <span class="global-rolls">${entry.rollCount ? entry.rollCount.toLocaleString() : '?'} rolls</span>
                        </div>
                    </div>
                </div>
            `;
            rank++;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading global auras:', error);
        container.innerHTML = '<div class="no-data">Error loading global auras</div>';
    }
}

// Load Collected Stats leaderboard (from original system)
async function loadCollectedStatsLeaderboard() {
    const container = document.getElementById('leaderboard-collectedStats');
    if (!container || !window.globalLeaderboard) return;
    
    try {
        const collectedStats = await window.globalLeaderboard.getTopCollectedStats(50);
        
        if (!collectedStats || collectedStats.length === 0) {
            container.innerHTML = '<div class="no-data">No collected stats submitted yet. Be the first!</div>';
            return;
        }
        
        let html = '';
        let rank = 1;
        
        collectedStats.forEach(entry => {
            const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';
            const scoreText = entry.totalScore ? entry.totalScore.toLocaleString() : '0';
            const uniqueAuras = entry.uniqueAuras || 0;
            
            html += `
                <div class="leaderboard-entry collected-entry ${rankClass}">
                    <span class="entry-rank">#${rank}</span>
                    <div class="collected-stats-info-display">
                        <div class="collected-player-name">${entry.playerName || 'Unknown'}</div>
                        <div class="collected-stats-details">
                            <span class="collected-score">Score: ${scoreText}</span>
                            <span class="collected-unique">${uniqueAuras} unique auras</span>
                        </div>
                    </div>
                </div>
            `;
            rank++;
        });
        
        // Add player's own stats
        if (typeof gameState !== 'undefined' && window.globalLeaderboard) {
            const playerStats = window.globalLeaderboard.calculateCollectedStats(gameState);
            if (playerStats && playerStats.totalScore > 0) {
                html += `
                    <div class="leaderboard-entry collected-entry player-entry">
                        <span class="entry-rank">YOU</span>
                        <div class="collected-stats-info-display">
                            <div class="collected-player-name">${window.globalLeaderboard.playerName || 'You'}</div>
                            <div class="collected-stats-details">
                                <span class="collected-score">Score: ${playerStats.totalScore.toLocaleString()}</span>
                                <span class="collected-unique">${playerStats.uniqueAuras} unique auras</span>
                            </div>
                        </div>
                        <button class="update-stats-btn" onclick="window.globalLeaderboard.submitCollectedStats(gameState)" style="margin-top: 8px;">
                            🔄 Update
                        </button>
                    </div>
                `;
            }
        }
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading collected stats:', error);
        container.innerHTML = '<div class="no-data">Error loading collected stats</div>';
    }
}

// Button is now in the top-right nav area of index.html
// No need to auto-generate it anymore

// Make functions globally available
window.openLeaderboardModal = openLeaderboardModal;
window.closeLeaderboardModal = closeLeaderboardModal;
window.switchLeaderboardCategory = switchLeaderboardCategory;

console.log('📊 Leaderboard UI initialized with 60+ categories');
