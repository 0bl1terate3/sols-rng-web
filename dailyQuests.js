// Daily Quest System
// Refreshes at 7 PM CST every day
// 3 quests per day with various rewards

const DAILY_QUEST_POOL = [
    // Roll-based quests
    { id: 'roll_100', name: 'Casual Roller', description: 'Roll 100 times', type: 'rolls', requirement: 100, reward: { money: 500, potions: { 'Lucky Potion': 5 } } },
    { id: 'roll_500', name: 'Active Roller', description: 'Roll 500 times', type: 'rolls', requirement: 500, reward: { money: 2000, potions: { 'Lucky Potion L': 2 } } },
    { id: 'roll_1000', name: 'Power Roller', description: 'Roll 1,000 times', type: 'rolls', requirement: 1000, reward: { money: 5000, potions: { 'Heavenly Potion': 1 } } },
    { id: 'roll_5000', name: 'Mega Roller', description: 'Roll 5,000 times', type: 'rolls', requirement: 5000, reward: { money: 15000, items: { 'Random Rune Chest': 2 } } },
    
    // Biome-based quests
    { id: 'see_windy', name: 'Feel the Wind', description: 'Experience the WINDY biome', type: 'biome', requirement: 'WINDY', reward: { money: 1000, potions: { 'Lucky Potion': 3 } } },
    { id: 'see_snowy', name: 'Winter Wonderland', description: 'Experience the SNOWY biome', type: 'biome', requirement: 'SNOWY', reward: { money: 1000, potions: { 'Lucky Potion': 3 } } },
    { id: 'see_rainy', name: 'Rainy Day', description: 'Experience the RAINY biome', type: 'biome', requirement: 'RAINY', reward: { money: 1500, potions: { 'Lucky Potion L': 1 } } },
    { id: 'see_sandstorm', name: 'Desert Storm', description: 'Experience the SANDSTORM biome', type: 'biome', requirement: 'SANDSTORM', reward: { money: 2000, potions: { 'Lucky Potion L': 1 } } },
    { id: 'see_jungle', name: 'Into the Jungle', description: 'Experience the JUNGLE biome', type: 'biome', requirement: 'JUNGLE', reward: { money: 2000, potions: { 'Lucky Potion L': 1 } } },
    { id: 'see_starfall', name: 'Wish Upon a Star', description: 'Experience the STARFALL biome', type: 'biome', requirement: 'STARFALL', reward: { money: 3000, items: { 'Random Rune Chest': 1 } } },
    { id: 'see_hell', name: 'Hell on Earth', description: 'Experience the HELL biome', type: 'biome', requirement: 'HELL', reward: { money: 3000, items: { 'Random Rune Chest': 1 } } },
    { id: 'see_corruption', name: 'Corrupted Lands', description: 'Experience the CORRUPTION biome', type: 'biome', requirement: 'CORRUPTION', reward: { money: 3500, items: { 'Random Rune Chest': 1 } } },
    { id: 'see_null', name: 'Into the Void', description: 'Experience the NULL biome', type: 'biome', requirement: 'NULL', reward: { money: 5000, items: { 'Void Coin': 1 } } },
    { id: 'see_glitched', name: 'Reality Break', description: 'Experience the GLITCHED biome', type: 'biome', requirement: 'GLITCHED', reward: { money: 10000, items: { 'Void Coin': 2 } } },
    
    // Rarity-based quests
    { id: 'roll_rare', name: 'Rare Find', description: 'Roll a Rare tier aura or higher', type: 'rarity', requirement: 16, reward: { money: 300, potions: { 'Lucky Potion': 2 } } },
    { id: 'roll_epic', name: 'Epic Discovery', description: 'Roll an Epic tier aura or higher', type: 'rarity', requirement: 256, reward: { money: 800, potions: { 'Lucky Potion': 5 } } },
    { id: 'roll_legendary', name: 'Legendary Hunt', description: 'Roll a Legendary tier aura or higher', type: 'rarity', requirement: 1000, reward: { money: 2000, potions: { 'Lucky Potion L': 1 } } },
    { id: 'roll_mythic', name: 'Mythical Journey', description: 'Roll a Mythic tier aura or higher', type: 'rarity', requirement: 8192, reward: { money: 5000, items: { 'Random Rune Chest': 1 } } },
    { id: 'roll_exotic', name: 'Exotic Expedition', description: 'Roll an Exotic tier aura or higher', type: 'rarity', requirement: 40000, reward: { money: 10000, items: { 'Random Rune Chest': 2 } } },
    
    // Breakthrough quests
    { id: 'breakthrough_1', name: 'First Break', description: 'Roll 1 breakthrough', type: 'breakthrough', requirement: 1, reward: { money: 1000, items: { 'Random Rune Chest': 1 } } },
    { id: 'breakthrough_5', name: 'Breaking Through', description: 'Roll 5 breakthroughs', type: 'breakthrough', requirement: 5, reward: { money: 3000, items: { 'Random Rune Chest': 2 } } },
    { id: 'breakthrough_10', name: 'Breakthrough Master', description: 'Roll 10 breakthroughs', type: 'breakthrough', requirement: 10, reward: { money: 5000, items: { 'Random Rune Chest': 3 } } },
    
    // Potion quests
    { id: 'use_10_potions', name: 'Potion Consumer', description: 'Use 10 potions', type: 'potions', requirement: 10, reward: { money: 500, potions: { 'Lucky Potion': 5 } } },
    { id: 'use_50_potions', name: 'Potion Addict', description: 'Use 50 potions', type: 'potions', requirement: 50, reward: { money: 2000, potions: { 'Lucky Potion L': 2 } } },
    { id: 'use_100_potions', name: 'Potion Master Daily', description: 'Use 100 potions', type: 'potions', requirement: 100, reward: { money: 5000, potions: { 'Heavenly Potion': 1 } } },
    
    // Playtime quests
    { id: 'play_30min', name: 'Short Session', description: 'Play for 30 minutes', type: 'playtime', requirement: 30, reward: { money: 1000, potions: { 'Lucky Potion': 5 } } },
    { id: 'play_1hour', name: 'Extended Session', description: 'Play for 1 hour', type: 'playtime', requirement: 60, reward: { money: 3000, potions: { 'Lucky Potion L': 2 } } },
    { id: 'play_2hours', name: 'Long Session', description: 'Play for 2 hours', type: 'playtime', requirement: 120, reward: { money: 8000, potions: { 'Heavenly Potion': 1 } } }
];

// Daily quest state
const dailyQuestState = {
    activeQuests: [],
    questProgress: {},
    lastReset: null,
    completedToday: [],
    refreshesRemaining: 3,
    totalRefreshesUsed: 0
};

// Initialize daily quest system
function initDailyQuests() {
    console.log('Initializing daily quests...');
    loadDailyQuestState();
    
    // Fix: Recalculate reset time if it seems wrong
    if (dailyQuestState.lastReset) {
        const savedResetTime = new Date(dailyQuestState.lastReset);
        const hoursUntilReset = (dailyQuestState.lastReset - Date.now()) / (1000 * 60 * 60);
        
        // Check if the saved reset time is at midnight UTC (7 PM CDT globally)
        const isAtMidnightUTC = savedResetTime.getUTCHours() === 0;
        
        // Recalculate if: wrong time, too far in future, or in the past
        if (!isAtMidnightUTC || hoursUntilReset > 24 || hoursUntilReset < 0) {
            console.log('Reset time seems wrong (saved UTC hour:', savedResetTime.getUTCHours(), '), recalculating...');
            dailyQuestState.lastReset = getNextResetTime().getTime();
            saveDailyQuestState();
        }
    }
    
    // If no quests exist, generate them immediately
    if (!dailyQuestState.activeQuests || dailyQuestState.activeQuests.length === 0) {
        resetDailyQuests();
    } else {
        checkDailyReset();
    }
    
    updateDailyQuestDisplay();
    
    // Check for reset every minute
    setInterval(checkDailyReset, 60000);
    
    // Update display every 5 seconds to refresh timer
    setInterval(updateDailyQuestDisplay, 5000);
    
    console.log('Daily quests initialized:', dailyQuestState.activeQuests.length, 'quests active');
}

// Get next 7 PM Central Time reset (globally synchronized)
function getNextResetTime() {
    const now = new Date();
    
    // Central Time: CDT is UTC-5 (summer), CST is UTC-6 (winter)
    // 7 PM CDT = 12 AM (midnight) UTC
    // 7 PM CST = 1 AM UTC
    // We'll use midnight UTC which is 7 PM CDT (current daylight time)
    const todayResetUTC = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0, // Midnight UTC = 7 PM CDT
        0,
        0,
        0
    ));
    
    // If we're already past today's reset, move to tomorrow
    if (now.getTime() >= todayResetUTC.getTime()) {
        todayResetUTC.setUTCDate(todayResetUTC.getUTCDate() + 1);
    }
    
    return todayResetUTC;
}

// Check if daily quests need to reset
function checkDailyReset() {
    const now = Date.now();
    
    // If never reset, or reset time has passed
    if (!dailyQuestState.lastReset || now >= dailyQuestState.lastReset) {
        console.log('Daily quest reset triggered');
        resetDailyQuests();
    } else {
        console.log('Next reset in:', Math.floor((dailyQuestState.lastReset - now) / 60000), 'minutes');
    }
}

// Reset daily quests (happens at 7 PM CST)
function resetDailyQuests() {
    console.log('Resetting daily quests...');
    
    try {
        // Clear completed quests
        dailyQuestState.completedToday = [];
        
        // Reset refreshes
        dailyQuestState.refreshesRemaining = 3;
        
        // Generate 3 random quests
        dailyQuestState.activeQuests = generateDailyQuests(3);
        console.log('Generated quests:', dailyQuestState.activeQuests);
        
        // Reset progress
        dailyQuestState.questProgress = {};
        for (const quest of dailyQuestState.activeQuests) {
            dailyQuestState.questProgress[quest.id] = {
                current: 0,
                startRolls: (typeof gameState !== 'undefined' ? gameState.totalRolls : 0) || 0,
                startBreakthroughs: (typeof gameState !== 'undefined' ? gameState.achievements?.stats?.breakthroughCount : 0) || 0,
                startPotions: (typeof gameState !== 'undefined' ? gameState.achievements?.stats?.potionsUsed : 0) || 0,
                startPlaytime: (typeof gameState !== 'undefined' ? gameState.achievements?.stats?.playtimeMinutes : 0) || 0
            };
        }
        
        // Set next reset time
        dailyQuestState.lastReset = getNextResetTime().getTime();
        
        saveDailyQuestState();
        updateDailyQuestDisplay();
        
        if (typeof showNotification === 'function') {
            showNotification('🎯 Daily quests have been reset!');
        }
        
        console.log('Daily quests reset complete');
    } catch (error) {
        console.error('Error resetting daily quests:', error);
    }
}

// Generate random daily quests
function generateDailyQuests(count) {
    const shuffled = [...DAILY_QUEST_POOL].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Check daily quest progress
function checkDailyQuestProgress() {
    if (!dailyQuestState.activeQuests || dailyQuestState.activeQuests.length === 0) return;
    
    // Check if gameState exists
    if (typeof gameState === 'undefined') {
        console.warn('gameState not defined yet');
        return;
    }
    
    for (const quest of dailyQuestState.activeQuests) {
        if (dailyQuestState.completedToday.includes(quest.id)) continue;
        
        const progress = dailyQuestState.questProgress[quest.id];
        if (!progress) continue;
        
        let completed = false;
        
        switch (quest.type) {
            case 'rolls':
                const rollsSinceStart = (gameState.totalRolls || 0) - progress.startRolls;
                progress.current = rollsSinceStart;
                completed = rollsSinceStart >= quest.requirement;
                break;
                
            case 'biome':
                // Check if player has seen this biome
                if (typeof biomeState !== 'undefined' && biomeState.currentBiome === quest.requirement) {
                    progress.current = 1;
                    completed = true;
                }
                break;
                
            case 'rarity':
                const highestRarity = gameState.achievements?.stats?.highestRarity || 0;
                progress.current = highestRarity;
                completed = highestRarity >= quest.requirement;
                break;
                
            case 'breakthrough':
                const btSinceStart = (gameState.achievements?.stats?.breakthroughCount || 0) - progress.startBreakthroughs;
                progress.current = btSinceStart;
                completed = btSinceStart >= quest.requirement;
                break;
                
            case 'potions':
                const potionsSinceStart = (gameState.achievements?.stats?.potionsUsed || 0) - progress.startPotions;
                progress.current = potionsSinceStart;
                completed = potionsSinceStart >= quest.requirement;
                break;
                
            case 'playtime':
                const playtimeSinceStart = (gameState.achievements?.stats?.playtimeMinutes || 0) - progress.startPlaytime;
                progress.current = playtimeSinceStart;
                completed = playtimeSinceStart >= quest.requirement;
                break;
        }
        
        if (completed && !dailyQuestState.completedToday.includes(quest.id)) {
            completeDailyQuest(quest);
        }
    }
    
    saveDailyQuestState();
    updateDailyQuestDisplay();
}

// Complete daily quest
function completeDailyQuest(quest) {
    dailyQuestState.completedToday.push(quest.id);
    
    // Grant rewards
    if (typeof grantAchievementReward === 'function') {
        grantAchievementReward(quest.reward);
    }
    
    // Track achievements
    if (typeof gameState !== 'undefined' && gameState.achievements && gameState.achievements.stats) {
        gameState.achievements.stats.dailyQuestsCompleted = (gameState.achievements.stats.dailyQuestsCompleted || 0) + 1;
    }
    
    // Track leaderboard stats
    if (window.leaderboardStats) {
        window.leaderboardStats.stats.dailyQuestsCompleted++;
        window.leaderboardStats.saveStats();
    }
    
    saveDailyQuestState();
    
    // Show notification
    showDailyQuestNotification(quest);
    
    console.log(`Daily quest completed: ${quest.name}`);
}

// Show daily quest completion notification
function showDailyQuestNotification(quest) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification daily-quest-notification';
    notification.innerHTML = `
        <div class="achievement-badge">🎯</div>
        <div class="achievement-content">
            <div class="achievement-title">Daily Quest Complete!</div>
            <div class="achievement-name">${quest.name}</div>
            <div class="achievement-desc">${quest.description}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Update daily quest display
function updateDailyQuestDisplay() {
    const container = document.getElementById('dailyQuestsContainer');
    if (!container) {
        console.warn('Daily quests container not found');
        return;
    }
    
    console.log('Updating daily quest display. Active quests:', dailyQuestState.activeQuests?.length);
    
    if (!dailyQuestState.activeQuests || dailyQuestState.activeQuests.length === 0) {
        container.innerHTML = '<p style="color: #94a3b8; padding: 20px; text-align: center;">Generating daily quests...</p>';
        // Try to generate quests if they don't exist
        setTimeout(() => {
            if (!dailyQuestState.activeQuests || dailyQuestState.activeQuests.length === 0) {
                console.log('Attempting to generate quests after delay...');
                resetDailyQuests();
            }
        }, 1000);
        return;
    }
    
    // Calculate time until reset
    const resetTime = new Date(dailyQuestState.lastReset);
    const now = new Date();
    const timeUntil = resetTime - now;
    const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));
    const minutesUntil = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
    
    // Format the local time when reset happens
    const resetLocalTime = resetTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    
    let html = `<div class="daily-quest-header">
        <h3>Daily Quests (${dailyQuestState.completedToday.length}/${dailyQuestState.activeQuests.length} Complete)</h3>
        <div class="reset-timer">Resets at ${resetLocalTime} (${hoursUntil}h ${minutesUntil}m)</div>
    </div>
    <div class="quest-refresh-section">
        <button class="refresh-quests-btn" onclick="refreshDailyQuests()" ${dailyQuestState.refreshesRemaining <= 0 ? 'disabled' : ''}>
            🔄 Refresh Quests (${dailyQuestState.refreshesRemaining}/3 remaining)
        </button>
        <p class="refresh-info">Too hard? Refresh to get new quests!</p>
    </div>`;
    
    for (const quest of dailyQuestState.activeQuests) {
        const isCompleted = dailyQuestState.completedToday.includes(quest.id);
        const progress = dailyQuestState.questProgress[quest.id] || { current: 0 };
        
        const percentage = quest.type === 'biome' 
            ? (progress.current > 0 ? 100 : 0)
            : Math.min(100, (progress.current / quest.requirement * 100));
        
        const rewardText = [];
        if (quest.reward.money) rewardText.push(`${quest.reward.money} coins`);
        if (quest.reward.potions) {
            for (const [name, count] of Object.entries(quest.reward.potions)) {
                rewardText.push(`${count}x ${name}`);
            }
        }
        if (quest.reward.items) {
            for (const [name, count] of Object.entries(quest.reward.items)) {
                rewardText.push(`${count}x ${name}`);
            }
        }
        
        html += `
            <div class="daily-quest-item ${isCompleted ? 'completed' : ''}">
                <div class="quest-header">
                    <div class="quest-name">${quest.name}</div>
                    ${isCompleted ? '<div class="quest-checkmark">✓</div>' : ''}
                </div>
                <div class="quest-description">${quest.description}</div>
                <div class="quest-progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="quest-progress-text">${progress.current} / ${quest.requirement}</div>
                <div class="quest-reward">Reward: ${rewardText.join(', ')}</div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Load daily quest state
function loadDailyQuestState() {
    const saved = localStorage.getItem('solsRngDailyQuests');
    if (saved) {
        try {
            const loaded = JSON.parse(saved);
            Object.assign(dailyQuestState, loaded);
        } catch (e) {
            console.error('Failed to load daily quest state:', e);
        }
    }
}

// Refresh daily quests (manual refresh by player)
function refreshDailyQuests() {
    if (dailyQuestState.refreshesRemaining <= 0) {
        showNotification('❌ No refreshes remaining! Wait until 7 PM CST reset.');
        return;
    }
    
    // Use a refresh
    dailyQuestState.refreshesRemaining--;
    dailyQuestState.totalRefreshesUsed++;
    
    // Keep completed quests but generate new ones
    const incompletedIds = dailyQuestState.completedToday;
    dailyQuestState.completedToday = [];
    
    // Generate 3 new quests
    dailyQuestState.activeQuests = generateDailyQuests(3);
    
    // Reset progress for new quests
    dailyQuestState.questProgress = {};
    for (const quest of dailyQuestState.activeQuests) {
        dailyQuestState.questProgress[quest.id] = {
            current: 0,
            startRolls: (typeof gameState !== 'undefined' ? gameState.totalRolls : 0) || 0,
            startBreakthroughs: (typeof gameState !== 'undefined' ? gameState.achievements?.stats?.breakthroughCount : 0) || 0,
            startPotions: (typeof gameState !== 'undefined' ? gameState.achievements?.stats?.potionsUsed : 0) || 0,
            startPlaytime: (typeof gameState !== 'undefined' ? gameState.achievements?.stats?.playtimeMinutes : 0) || 0
        };
    }
    
    // Restore completed quests
    dailyQuestState.completedToday = incompletedIds;
    
    saveDailyQuestState();
    updateDailyQuestDisplay();
    
    showNotification(`🔄 Quests refreshed! ${dailyQuestState.refreshesRemaining} refreshes remaining.`);
}

// Save daily quest state
function saveDailyQuestState() {
    localStorage.setItem('solsRngDailyQuests', JSON.stringify(dailyQuestState));
}
