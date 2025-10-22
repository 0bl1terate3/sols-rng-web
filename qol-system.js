// =================================================================
// Quality of Life System
// =================================================================

// QoL Settings and State
const qolState = {
    rollHistory: [],
    maxHistoryLength: 50,
    statistics: {
        sessionStart: Date.now(),
        rollsSinceRare: 0,
        rollsSinceEpic: 0,
        rollsSinceLegendary: 0,
        rollsSinceMythic: 0,
        bestRollToday: null,
        bestRollTodayTimestamp: null, // Track when best roll was set
        rollsPerMinute: 0,
        lastMinuteRolls: [],
        totalValueCollected: 0
    },
    pinnedAchievements: [],
    settings: {
        soundEnabled: true,
        notificationSound: true,
        rarityNotificationThreshold: 'epic', // 'rare', 'epic', 'legendary', 'mythic', 'exotic', 'divine'
        showRollHistory: true,
        showStatistics: true,
        confirmRareCrafts: true,
        confirmRarePotions: true,
        autoCollectItems: true,
        compactMode: false,
        performanceMode: false,
        skipCutscenes: false,
        showPityCounter: true,
        showProgressBars: true,
        keyboardShortcuts: true,
        theme: 'dark', // 'dark', 'light'
        notificationDuration: 3000
    },
    inventorySort: {
        auras: 'rarity', // 'rarity', 'alphabetical', 'count', 'recent'
        potions: 'category', // 'category', 'alphabetical', 'count'
        items: 'alphabetical'
    },
    inventoryFilter: {
        potions: 'all', // 'all', 'basic', 'advanced', 'ultimate', 'special'
        auras: 'all' // 'all', 'common', 'rare', 'epic', 'legendary', etc.
    }
};

// =================================================================
// Helper: Apply Biome Colors to Panel
// =================================================================

function applyBiomeColorToPanel(panel) {
    if (!panel) return;
    
    // Get current biome gradient from CSS variable
    const root = document.documentElement;
    const biomeGradient = getComputedStyle(root).getPropertyValue('--biome-panel-gradient').trim();
    
    // Apply immediately if gradient exists
    if (biomeGradient && biomeGradient !== '') {
        panel.style.background = biomeGradient;
        console.log('✅ Applied biome color to panel:', panel.id);
    } else {
        // Fallback - wait a bit and try again
        setTimeout(() => {
            const retryGradient = getComputedStyle(root).getPropertyValue('--biome-panel-gradient').trim();
            if (retryGradient && retryGradient !== '') {
                panel.style.background = retryGradient;
                console.log('✅ Applied biome color to panel (retry):', panel.id);
            }
        }, 200);
    }
}

// Load QoL settings from localStorage
function loadQoLSettings() {
    const saved = localStorage.getItem('qolSettings');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(qolState.settings, parsed.settings || {});
            Object.assign(qolState.inventorySort, parsed.inventorySort || {});
            Object.assign(qolState.inventoryFilter, parsed.inventoryFilter || {});
            qolState.pinnedAchievements = parsed.pinnedAchievements || [];
        } catch (e) {
            console.error('Failed to load QoL settings:', e);
        }
    }
    
    // Load roll history from localStorage
    const savedHistory = localStorage.getItem('rollHistory');
    if (savedHistory) {
        try {
            qolState.rollHistory = JSON.parse(savedHistory);
            console.log(`📜 Loaded ${qolState.rollHistory.length} rolls from history`);
        } catch (e) {
            console.error('Failed to load roll history:', e);
            qolState.rollHistory = [];
        }
    }
    
    // Load best roll today from localStorage
    const savedBestRoll = localStorage.getItem('bestRollToday');
    if (savedBestRoll) {
        try {
            const parsed = JSON.parse(savedBestRoll);
            const now = Date.now();
            const hoursSinceSet = (now - parsed.timestamp) / (1000 * 60 * 60);
            
            // Only load if less than 24 hours have passed
            if (hoursSinceSet < 24) {
                qolState.statistics.bestRollToday = parsed.roll;
                qolState.statistics.bestRollTodayTimestamp = parsed.timestamp;
                console.log(`🏆 Loaded best roll today: ${parsed.roll.name}`);
            } else {
                // More than 24 hours, clear it
                localStorage.removeItem('bestRollToday');
                console.log('🕐 Best roll today expired (>24h), cleared');
            }
        } catch (e) {
            console.error('Failed to load best roll today:', e);
        }
    }
}

// Save QoL settings to localStorage
function saveQoLSettings() {
    const toSave = {
        settings: qolState.settings,
        inventorySort: qolState.inventorySort,
        inventoryFilter: qolState.inventoryFilter,
        pinnedAchievements: qolState.pinnedAchievements
    };
    localStorage.setItem('qolSettings', JSON.stringify(toSave));
}

// =================================================================
// Roll History System
// =================================================================

function addToRollHistory(aura) {
    // Removed console.log - was causing FPS drops during auto-roll
    // console.log('Adding to roll history:', aura.name);
    
    const historyEntry = {
        name: aura.name,
        rarity: aura.rarity,
        tier: aura.tier,
        timestamp: Date.now(),
        breakthrough: aura.breakthrough || false
    };
    
    qolState.rollHistory.unshift(historyEntry);
    
    // Keep only last N rolls
    if (qolState.rollHistory.length > qolState.maxHistoryLength) {
        qolState.rollHistory.pop();
    }
    
    // Save roll history to localStorage
    try {
        localStorage.setItem('rollHistory', JSON.stringify(qolState.rollHistory));
    } catch (e) {
        console.error('Failed to save roll history:', e);
    }
    
    // Update pity counters
    updatePityCounters(aura);
    
    // Update statistics
    updateRollStatistics(aura);
    
    // Update UI
    if (qolState.settings.showRollHistory) {
        updateRollHistoryDisplay();
    }
    
    // Removed console.log - was causing FPS drops during auto-roll
    // console.log('Roll history now has', qolState.rollHistory.length, 'entries');
}

function updatePityCounters(aura) {
    const tierValues = {
        'common': 1, 'uncommon': 2, 'good': 3, 'rare': 4, 'epic': 5,
        'legendary': 6, 'mythic': 7, 'exotic': 8, 'divine': 9, 'celestial': 10, 'transcendent': 11
    };
    
    const tierValue = tierValues[aura.tier] || 0;
    
    if (tierValue >= 4) qolState.statistics.rollsSinceRare = 0;
    else qolState.statistics.rollsSinceRare++;
    
    if (tierValue >= 5) qolState.statistics.rollsSinceEpic = 0;
    else qolState.statistics.rollsSinceEpic++;
    
    if (tierValue >= 6) qolState.statistics.rollsSinceLegendary = 0;
    else qolState.statistics.rollsSinceLegendary++;
    
    if (tierValue >= 7) qolState.statistics.rollsSinceMythic = 0;
    else qolState.statistics.rollsSinceMythic++;
    
    // Update best roll today
    if (!qolState.statistics.bestRollToday || aura.rarity > qolState.statistics.bestRollToday.rarity) {
        qolState.statistics.bestRollToday = {
            name: aura.name,
            rarity: aura.rarity,
            tier: aura.tier
        };
        qolState.statistics.bestRollTodayTimestamp = Date.now();
        
        // Save to localStorage
        const toSave = {
            roll: qolState.statistics.bestRollToday,
            timestamp: qolState.statistics.bestRollTodayTimestamp
        };
        localStorage.setItem('bestRollToday', JSON.stringify(toSave));
    }
}

function updateRollStatistics(aura) {
    // Track rolls per minute
    const now = Date.now();
    qolState.statistics.lastMinuteRolls.push(now);
    
    // Remove rolls older than 1 minute
    qolState.statistics.lastMinuteRolls = qolState.statistics.lastMinuteRolls.filter(
        time => now - time < 60000
    );
    
    qolState.statistics.rollsPerMinute = qolState.statistics.lastMinuteRolls.length;
    
    // Update statistics display
    if (qolState.settings.showStatistics) {
        updateStatisticsDisplay();
    }
}

function updateRollHistoryDisplay(forceFullRebuild = false) {
    try {
        let container = document.getElementById('rollHistoryContainer');
        const isFirstRender = !container;
        
        if (!container) {
            // Create container if it doesn't exist
            container = document.createElement('div');
            container.id = 'rollHistoryContainer';
            container.className = 'panel roll-history-panel';
            
            const gameArea = document.querySelector('.game-area');
            const inventoryPanel = document.querySelector('.inventory-panel');
            
            if (gameArea && inventoryPanel) {
                // Insert before inventory panel
                gameArea.insertBefore(container, inventoryPanel);
            } else if (gameArea) {
                // Fallback: append to game area
                gameArea.appendChild(container);
            } else {
                console.warn('Game area not found for roll history');
                return;
            }
            
            // Apply current biome colors immediately
            applyBiomeColorToPanel(container);
        }
        
        // Initialize history filters - load from localStorage if available
        if (!qolState.historyFilters) {
            // Try to load saved filters
            try {
                const savedFilters = localStorage.getItem('rollHistoryFilters');
                if (savedFilters) {
                    qolState.historyFilters = JSON.parse(savedFilters);
                } else {
                    // Default filters
                    qolState.historyFilters = {
                        minTier: 'common',
                        showBreakthroughs: true,
                        sortBy: 'time', // time, rarity, name
                        displayCount: 10,
                        showRarity: true,
                        showTime: true,
                        compactMode: false
                    };
                }
            } catch (e) {
                console.error('Failed to load history filters:', e);
                // Fallback to defaults
                qolState.historyFilters = {
                    minTier: 'common',
                    showBreakthroughs: true,
                    sortBy: 'time',
                    displayCount: 10,
                    showRarity: true,
                    showTime: true,
                    compactMode: false
                };
            }
        }
        
        // Check if we need to do a full rebuild or just update the list
        const existingList = document.querySelector('.roll-history-list');
        const shouldFullRebuild = isFirstRender || forceFullRebuild || !existingList;
        
        if (shouldFullRebuild) {
            // Full rebuild - build everything
            const existingSettings = document.getElementById('historySettings');
            const settingsVisible = existingSettings && existingSettings.style.display !== 'none';
            
            let html = '<div class="roll-history-header">';
            html += '<h2>📜 Roll History</h2>';
            html += '<button class="history-settings-btn" onclick="toggleHistorySettings()">⚙️</button>';
            html += '</div>';
            
            // Customization controls - preserve visibility state
            html += '<div id="historySettings" class="history-settings" style="display: ' + (settingsVisible ? 'block' : 'none') + ';">';
            html += '<div class="history-controls">';
            
            // Filter by tier
            html += '<div class="history-control-group">';
            html += '<label>Min Tier:</label>';
            html += '<select id="historyTierFilter" onchange="updateHistoryFilter(\'minTier\', this.value)">';
            html += '<option value="common">All</option>';
            html += '<option value="uncommon">Uncommon+</option>';
            html += '<option value="rare">Rare+</option>';
            html += '<option value="epic">Epic+</option>';
            html += '<option value="legendary">Legendary+</option>';
            html += '<option value="mythic">Mythic+</option>';
            html += '<option value="exotic">Exotic+</option>';
            html += '<option value="divine">Divine+</option>';
            html += '</select>';
            html += '</div>';
            
            // Sort by
            html += '<div class="history-control-group">';
            html += '<label>Sort By:</label>';
            html += '<select id="historySortFilter" onchange="updateHistoryFilter(\'sortBy\', this.value)">';
            html += '<option value="time">Recent First</option>';
            html += '<option value="rarity">Highest Rarity</option>';
            html += '<option value="name">Alphabetical</option>';
            html += '</select>';
            html += '</div>';
            
            // Display count
            html += '<div class="history-control-group">';
            html += '<label>Show:</label>';
            html += '<select id="historyCountFilter" onchange="updateHistoryFilter(\'displayCount\', parseInt(this.value))">';
            html += '<option value="5">5 rolls</option>';
            html += '<option value="10">10 rolls</option>';
            html += '<option value="20">20 rolls</option>';
            html += '<option value="50">50 rolls</option>';
            html += '</select>';
            html += '</div>';
            
            // Toggle options
            html += '<div class="history-toggles">';
            html += '<label><input type="checkbox" id="showBreakthroughsToggle" onchange="updateHistoryFilter(\'showBreakthroughs\', this.checked)" checked> Breakthroughs Only</label>';
            html += '<label><input type="checkbox" id="showRarityToggle" onchange="updateHistoryFilter(\'showRarity\', this.checked)" checked> Show Rarity</label>';
            html += '<label><input type="checkbox" id="showTimeToggle" onchange="updateHistoryFilter(\'showTime\', this.checked)" checked> Show Time</label>';
            html += '<label><input type="checkbox" id="compactModeToggle" onchange="updateHistoryFilter(\'compactMode\', this.checked)"> Compact View</label>';
            html += '</div>';
            
            html += '</div></div>';
            
            // Add placeholder for the list
            html += '<div class="roll-history-list' + (qolState.historyFilters.compactMode ? ' compact' : '') + '"></div>';
            
            // Add buttons
            html += '<div class="history-actions">';
            html += '<button class="qol-button" onclick="exportRollHistory()">📤 Export</button>';
            html += '<button class="qol-button" onclick="clearRollHistory()">🗑️ Clear</button>';
            html += '</div>';
            
            container.innerHTML = html;
            
            // Set current filter values
            if (qolState.historyFilters) {
                const tierFilter = document.getElementById('historyTierFilter');
                const sortFilter = document.getElementById('historySortFilter');
                const countFilter = document.getElementById('historyCountFilter');
                const breakthroughToggle = document.getElementById('showBreakthroughsToggle');
                const rarityToggle = document.getElementById('showRarityToggle');
                const timeToggle = document.getElementById('showTimeToggle');
                const compactToggle = document.getElementById('compactModeToggle');
                
                if (tierFilter) tierFilter.value = qolState.historyFilters.minTier;
                if (sortFilter) sortFilter.value = qolState.historyFilters.sortBy;
                if (countFilter) countFilter.value = qolState.historyFilters.displayCount;
                if (breakthroughToggle) breakthroughToggle.checked = qolState.historyFilters.showBreakthroughs;
                if (rarityToggle) rarityToggle.checked = qolState.historyFilters.showRarity;
                if (timeToggle) timeToggle.checked = qolState.historyFilters.showTime;
                if (compactToggle) compactToggle.checked = qolState.historyFilters.compactMode;
            }
        }
        
        // Now update just the list content (whether full rebuild or not)
        updateRollHistoryListOnly();
        
    } catch (error) {
        console.error('Error updating roll history:', error);
    }
}

function updateRollHistoryListOnly() {
    try {
        const listContainer = document.querySelector('.roll-history-list');
        if (!listContainer) {
            console.warn('Roll history list container not found');
            return;
        }
        
        // Apply filters
        let filteredHistory = [...qolState.rollHistory];
        
        // Filter by tier
        if (qolState.historyFilters.minTier !== 'common') {
            const tierHierarchy = ['common', 'uncommon', 'good', 'rare', 'epic', 'legendary', 'mythic', 'exotic', 'divine', 'celestial', 'transcendent'];
            const minIndex = tierHierarchy.indexOf(qolState.historyFilters.minTier);
            filteredHistory = filteredHistory.filter(entry => {
                const entryIndex = tierHierarchy.indexOf(entry.tier);
                return entryIndex >= minIndex;
            });
        }
        
        // Filter breakthroughs only
        if (!qolState.historyFilters.showBreakthroughs) {
            // Show all
        } else if (qolState.historyFilters.showBreakthroughs && filteredHistory.some(e => e.breakthrough)) {
            // If toggle is on and there are breakthroughs, show only breakthroughs
            const breakthroughsExist = filteredHistory.some(e => e.breakthrough);
            if (breakthroughsExist) {
                // Don't filter, just highlight breakthroughs
            }
        }
        
        // Sort
        if (qolState.historyFilters.sortBy === 'rarity') {
            filteredHistory.sort((a, b) => b.rarity - a.rarity);
        } else if (qolState.historyFilters.sortBy === 'name') {
            filteredHistory.sort((a, b) => a.name.localeCompare(b.name));
        }
        // Default is time (already sorted)
        
        // Update compact mode class
        if (qolState.historyFilters.compactMode) {
            listContainer.classList.add('compact');
        } else {
            listContainer.classList.remove('compact');
        }
        
        // Build list HTML
        let html = '';
        
        if (filteredHistory.length === 0) {
            html = '<div class="empty-message">No rolls match your filters</div>';
        } else {
            const displayCount = qolState.historyFilters.displayCount;
            filteredHistory.slice(0, displayCount).forEach((entry, index) => {
                const timeAgo = qolState.historyFilters.showTime ? getTimeAgo(entry.timestamp) : '';
                const color = typeof getAuraColor === 'function' ? getAuraColor(entry.name) : '#fff';
                const breakthroughIcon = entry.breakthrough ? ' ⚡' : '';
                const rarityText = qolState.historyFilters.showRarity ? `1:${entry.rarity.toLocaleString()}` : '';
                
                html += `<div class="history-entry rarity-${entry.tier}">
                    <span class="history-name" style="color: ${color};">${entry.name}${breakthroughIcon}</span>
                    ${rarityText ? `<span class="history-rarity">${rarityText}</span>` : ''}
                    ${timeAgo ? `<span class="history-time">${timeAgo}</span>` : ''}
                </div>`;
            });
        }
        
        listContainer.innerHTML = html;
        
    } catch (error) {
        console.error('Error updating roll history list:', error);
    }
}

function updateStatisticsDisplay() {
    try {
        let container = document.getElementById('statisticsContainer');
        if (!container) {
            // Create container if it doesn't exist
            container = document.createElement('div');
            container.id = 'statisticsContainer';
            container.className = 'panel statistics-panel';
            
            const gameArea = document.querySelector('.game-area');
            const craftingPanel = document.querySelector('.crafting-panel');
            const inventoryPanel = document.querySelector('.inventory-panel');
            
            if (gameArea && craftingPanel) {
                // Insert before crafting panel
                gameArea.insertBefore(container, craftingPanel);
            } else if (gameArea && inventoryPanel) {
                // Insert before inventory panel
                gameArea.insertBefore(container, inventoryPanel);
            } else if (gameArea) {
                gameArea.appendChild(container);
            } else {
                console.warn('Game area not found for statistics');
                return;
            }
            
            // Apply current biome colors immediately
            applyBiomeColorToPanel(container);
        }
        
        const sessionTime = Math.floor((Date.now() - qolState.statistics.sessionStart) / 1000 / 60);
        const sessionHours = Math.floor(sessionTime / 60);
        const sessionMins = sessionTime % 60;
        const bestRoll = qolState.statistics.bestRollToday;
        
        // Calculate additional stats
        const totalAuras = Object.keys(gameState?.inventory?.auras || {}).length;
        const totalPotions = Object.values(gameState?.inventory?.potions || {}).reduce((sum, p) => sum + (p.count || 0), 0);
        const totalRolls = gameState?.totalRolls || 0;
        const totalLuck = (gameState?.currentLuck || 1.0).toFixed(1);
        const rollSpeed = Math.floor((gameState?.currentSpeed || 1.0) * 100);
        const breakthroughCount = qolState.rollHistory.filter(r => r.breakthrough).length;
        
        // Calculate rarity distribution
        const rarityCount = {};
        qolState.rollHistory.forEach(entry => {
            rarityCount[entry.tier] = (rarityCount[entry.tier] || 0) + 1;
        });
        
        let html = '<h2>📊 Statistics</h2>';
        html += '<div class="statistics-grid">';
        
        // Session info
        html += `<div class="stat-item highlight">
            <span class="stat-label">⏱️ Session Time:</span>
            <span class="stat-value">${sessionHours > 0 ? sessionHours + 'h ' : ''}${sessionMins}m</span>
        </div>`;
        
        html += `<div class="stat-item highlight">
            <span class="stat-label">⚡ Rolls/Min:</span>
            <span class="stat-value">${qolState.statistics.rollsPerMinute}</span>
        </div>`;
        
        // Total stats
        html += `<div class="stat-item">
            <span class="stat-label">🎲 Total Rolls:</span>
            <span class="stat-value">${totalRolls.toLocaleString()}</span>
        </div>`;
        
        html += `<div class="stat-item">
            <span class="stat-label">✨ Auras Owned:</span>
            <span class="stat-value">${totalAuras}</span>
        </div>`;
        
        html += `<div class="stat-item">
            <span class="stat-label">⚗️ Potions:</span>
            <span class="stat-value">${totalPotions}</span>
        </div>`;
        
        html += `<div class="stat-item">
            <span class="stat-label">⚡ Breakthroughs:</span>
            <span class="stat-value">${breakthroughCount}</span>
        </div>`;
        
        // Current stats
        html += `<div class="stat-item">
            <span class="stat-label">🍀 Current Luck:</span>
            <span class="stat-value">${totalLuck}x</span>
        </div>`;
        
        html += `<div class="stat-item">
            <span class="stat-label">💨 Roll Speed:</span>
            <span class="stat-value">${rollSpeed}%</span>
        </div>`;
        
        if (qolState.settings.showPityCounter) {
            html += `<div class="stat-item pity-counter">
                <span class="stat-label">Since Rare:</span>
                <span class="stat-value">${qolState.statistics.rollsSinceRare}</span>
            </div>`;
            
            html += `<div class="stat-item pity-counter">
                <span class="stat-label">Since Epic:</span>
                <span class="stat-value">${qolState.statistics.rollsSinceEpic}</span>
            </div>`;
            
            html += `<div class="stat-item pity-counter">
                <span class="stat-label">Since Legendary:</span>
                <span class="stat-value">${qolState.statistics.rollsSinceLegendary}</span>
            </div>`;
            
            html += `<div class="stat-item pity-counter">
                <span class="stat-label">Since Mythic:</span>
                <span class="stat-value">${qolState.statistics.rollsSinceMythic}</span>
            </div>`;
        }
        
        if (bestRoll) {
            const color = typeof getAuraColor === 'function' ? getAuraColor(bestRoll.name) : '#fbbf24';
            html += `<div class="stat-item best-roll">
                <span class="stat-label">🏆 Best Today:</span>
                <span class="stat-value" style="color: ${color};">${bestRoll.name}</span>
            </div>`;
        }
        
        html += '</div>';
        
        // Rarity distribution
        if (Object.keys(rarityCount).length > 0) {
            html += '<div class="rarity-distribution">';
            html += '<h3>📈 Recent Rolls Distribution</h3>';
            html += '<div class="rarity-bars">';
            
            const tiers = ['common', 'uncommon', 'good', 'rare', 'epic', 'legendary', 'mythic', 'exotic', 'divine'];
            const maxCount = Math.max(...Object.values(rarityCount));
            
            tiers.forEach(tier => {
                const count = rarityCount[tier] || 0;
                if (count > 0) {
                    const percentage = (count / maxCount) * 100;
                    html += `
                        <div class="rarity-bar-item">
                            <span class="rarity-label">${tier}:</span>
                            <div class="rarity-bar-container">
                                <div class="rarity-bar rarity-${tier}" style="width: ${percentage}%"></div>
                            </div>
                            <span class="rarity-count">${count}</span>
                        </div>
                    `;
                }
            });
            
            html += '</div></div>';
        }
        
        // Add reset button
        html += '<button class="qol-button" onclick="resetSessionStats()">🔄 Reset Session</button>';
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error updating statistics:', error);
    }
}

function clearRollHistory() {
    if (confirm('Clear roll history?')) {
        qolState.rollHistory = [];
        updateRollHistoryDisplay();
    }
}

// Toggle history settings panel
window.toggleHistorySettings = function() {
    const settings = document.getElementById('historySettings');
    if (settings) {
        settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
    }
}

// Update history filter
window.updateHistoryFilter = function(filterName, value) {
    if (!qolState.historyFilters) {
        qolState.historyFilters = {
            minTier: 'common',
            showBreakthroughs: true,
            sortBy: 'time',
            displayCount: 10,
            showRarity: true,
            showTime: true,
            compactMode: false
        };
    }
    
    qolState.historyFilters[filterName] = value;
    
    // Save to localStorage
    try {
        localStorage.setItem('rollHistoryFilters', JSON.stringify(qolState.historyFilters));
    } catch (e) {
        console.error('Failed to save history filters:', e);
    }
    
    updateRollHistoryDisplay();
    saveQoLSettings();
}

// Export roll history
window.exportRollHistory = function() {
    if (qolState.rollHistory.length === 0) {
        showNotification('⚠️ No history to export', 'warning');
        return;
    }
    
    let exportText = '📜 ROLL HISTORY EXPORT\n';
    exportText += '='.repeat(50) + '\n\n';
    exportText += `Total Rolls: ${qolState.rollHistory.length}\n`;
    exportText += `Exported: ${new Date().toLocaleString()}\n\n`;
    exportText += '='.repeat(50) + '\n\n';
    
    qolState.rollHistory.forEach((entry, index) => {
        const timeAgo = getTimeAgo(entry.timestamp);
        const breakthroughIcon = entry.breakthrough ? ' ⚡ BREAKTHROUGH' : '';
        exportText += `${index + 1}. ${entry.name}${breakthroughIcon}\n`;
        exportText += `   Rarity: 1:${entry.rarity.toLocaleString()} | Tier: ${entry.tier.toUpperCase()}\n`;
        exportText += `   Time: ${timeAgo} (${new Date(entry.timestamp).toLocaleString()})\n\n`;
    });
    
    // Copy to clipboard
    navigator.clipboard.writeText(exportText).then(() => {
        showNotification('📋 Roll history copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('❌ Failed to copy to clipboard', 'error');
    });
}

function resetSessionStats() {
    if (confirm('Reset session statistics?')) {
        qolState.statistics.sessionStart = Date.now();
        qolState.statistics.rollsSinceRare = 0;
        qolState.statistics.rollsSinceEpic = 0;
        qolState.statistics.rollsSinceLegendary = 0;
        qolState.statistics.rollsSinceMythic = 0;
        qolState.statistics.bestRollToday = null;
        qolState.statistics.bestRollTodayTimestamp = null;
        qolState.statistics.lastMinuteRolls = [];
        
        // Clear from localStorage
        localStorage.removeItem('bestRollToday');
        updateStatisticsDisplay();
    }
}

function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
}

// =================================================================
// Keyboard Shortcuts System
// =================================================================

// Flag to prevent duplicate listener registration
let keyboardShortcutsSetup = false;

function initKeyboardShortcuts() {
    if (!qolState.settings.keyboardShortcuts) return;
    
    // Prevent duplicate listener registration
    if (keyboardShortcutsSetup) return;
    keyboardShortcutsSetup = true;
    
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        // Don't trigger if modal is open (except ESC)
        const modalOpen = document.querySelector('.modal.show') || document.querySelector('.crafting-modal.show');
        if (modalOpen && e.key !== 'Escape') return;
        
        switch(e.key.toLowerCase()) {
            case 'r':
                if (!e.ctrlKey && !e.shiftKey) {
                    e.preventDefault();
                    const rollBtn = document.getElementById('rollButton');
                    if (rollBtn && !rollBtn.disabled) rollBtn.click();
                }
                break;
            case ' ':
            case 'q':
                e.preventDefault();
                const quickRollBtn = document.getElementById('quickRollButton');
                if (quickRollBtn && !quickRollBtn.disabled) quickRollBtn.click();
                break;
            case 'a':
                if (!e.ctrlKey) {
                    e.preventDefault();
                    const autoRollBtn = document.getElementById('autoRollButton');
                    if (autoRollBtn) autoRollBtn.click();
                }
                break;
            case 'i':
                e.preventDefault();
                switchToTab('items');
                break;
            case 'p':
                if (!e.ctrlKey) {
                    e.preventDefault();
                    switchToTab('potions');
                }
                break;
            case 'c':
                if (!e.ctrlKey) {
                    e.preventDefault();
                    // Open crafting panel or switch to it
                    const craftingPanel = document.querySelector('.crafting-panel');
                    if (craftingPanel) craftingPanel.scrollIntoView({ behavior: 'smooth' });
                }
                break;
            case 'escape':
                e.preventDefault();
                closeAllModals();
                break;
            case 'h':
                if (!e.ctrlKey) {
                    e.preventDefault();
                    toggleHelpPanel();
                }
                break;
            case 's':
                if (e.ctrlKey) {
                    e.preventDefault();
                    saveGameState();
                    showNotification('💾 Game saved!');
                }
                break;
            case '1':
            case '2':
            case '3':
                if (!e.ctrlKey && !e.shiftKey) {
                    const slotNum = parseInt(e.key);
                    useQuickSlot(slotNum);
                }
                break;
        }
    });
}

function switchToTab(tabName) {
    const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (tabBtn) tabBtn.click();
}

function closeAllModals() {
    document.querySelectorAll('.modal.show, .crafting-modal.show').forEach(modal => {
        modal.classList.remove('show');
    });
}

// =================================================================
// Inventory Sorting and Filtering
// =================================================================

function sortAurasInventory(sortBy) {
    qolState.inventorySort.auras = sortBy;
    saveQoLSettings();
    updateAurasInventory();
}

function filterAurasInventory(filterBy) {
    qolState.inventoryFilter.auras = filterBy;
    saveQoLSettings();
    updateAurasInventory();
}

function sortPotionsInventory(sortBy) {
    qolState.inventorySort.potions = sortBy;
    saveQoLSettings();
    updatePotionsInventory();
}

function filterPotionsInventory(filterBy) {
    qolState.inventoryFilter.potions = filterBy;
    saveQoLSettings();
    updatePotionsInventory();
}

// =================================================================
// Save/Export/Import System
// =================================================================

function exportSaveData() {
    const saveData = {
        gameState: gameState,
        qolState: {
            settings: qolState.settings,
            inventorySort: qolState.inventorySort,
            inventoryFilter: qolState.inventoryFilter,
            pinnedAchievements: qolState.pinnedAchievements
        },
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const json = JSON.stringify(saveData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `sols-rng-save-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showNotification('💾 Save exported successfully!');
}

function copyStatsToClipboard() {
    const stats = `
Sol's RNG Statistics
====================
Total Rolls: ${gameState.totalRolls.toLocaleString()}
Current Luck: ${gameState.currentLuck.toFixed(1)}x
Roll Speed: ${(gameState.currentSpeed * 100).toFixed(0)}%
Highest Rarity: 1 in ${gameState.achievements.stats.highestRarity.toLocaleString()}
Breakthroughs: ${gameState.achievements.stats.breakthroughCount}
Playtime: ${Math.floor(gameState.achievements.stats.playtimeMinutes / 60)}h ${Math.floor(gameState.achievements.stats.playtimeMinutes % 60)}m
Unique Auras: ${Object.keys(gameState.inventory.auras).length}
Achievements: ${Object.keys(gameState.achievements.unlocked).length}/${Object.keys(ACHIEVEMENTS).length}
Session Rolls/Min: ${qolState.statistics.rollsPerMinute}
Best Roll Today: ${qolState.statistics.bestRollToday ? qolState.statistics.bestRollToday.name : 'None'}
    `.trim();
    
    navigator.clipboard.writeText(stats).then(() => {
        showNotification('📋 Stats copied to clipboard!');
    }).catch(() => {
        showNotification('❌ Failed to copy stats');
    });
}

function importSaveData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const saveData = JSON.parse(event.target.result);
                
                if (!saveData.gameState || !saveData.version) {
                    throw new Error('Invalid save file format');
                }
                
                if (confirm('Import this save? This will overwrite your current progress!')) {
                    // Restore game state
                    Object.assign(gameState, saveData.gameState);
                    
                    // Restore QoL settings
                    if (saveData.qolState) {
                        Object.assign(qolState.settings, saveData.qolState.settings || {});
                        Object.assign(qolState.inventorySort, saveData.qolState.inventorySort || {});
                        Object.assign(qolState.inventoryFilter, saveData.qolState.inventoryFilter || {});
                        qolState.pinnedAchievements = saveData.qolState.pinnedAchievements || [];
                    }
                    
                    // Save and refresh
                    saveGameState();
                    saveQoLSettings();
                    location.reload();
                }
            } catch (error) {
                console.error('Import error:', error);
                showNotification('❌ Failed to import save: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// =================================================================
// Achievement Pinning System
// =================================================================

function togglePinAchievement(achievementId) {
    const index = qolState.pinnedAchievements.indexOf(achievementId);
    
    if (index === -1) {
        if (qolState.pinnedAchievements.length >= 5) {
            showNotification('⚠️ Maximum 5 pinned achievements');
            return;
        }
        qolState.pinnedAchievements.push(achievementId);
    } else {
        qolState.pinnedAchievements.splice(index, 1);
    }
    
    saveQoLSettings();
    updatePinnedAchievementsDisplay();
    updateAchievementsInventory();
}

function updatePinnedAchievementsDisplay() {
    let container = document.getElementById('pinnedAchievementsContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'pinnedAchievementsContainer';
        container.className = 'pinned-achievements-panel';
        container.style.background = 'rgba(0, 0, 0, 0.3)';
        container.style.padding = '15px';
        container.style.borderRadius = '10px';
        container.style.marginTop = '15px';
        
        const header = document.querySelector('header');
        if (header) {
            header.appendChild(container);
        }
    }
    
    if (qolState.pinnedAchievements.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'block';
    
    let html = '<h4>📌 Pinned Achievements</h4>';
    html += '<div class="pinned-achievements-list">';
    
    qolState.pinnedAchievements.forEach(id => {
        const achievement = ACHIEVEMENTS[id];
        if (!achievement) return;
        
        const isUnlocked = !!gameState.achievements.unlocked[id];
        if (isUnlocked) return; // Don't show unlocked achievements
        
        const progress = getAchievementProgress(id, achievement);
        const progressPercent = Math.min(100, (progress / achievement.requirement) * 100);
        
        html += `<div class="pinned-achievement">
            <div class="pinned-achievement-name">${achievement.name}</div>
            <div class="pinned-achievement-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <span class="progress-text">${formatProgress(progress, achievement)}</span>
            </div>
        </div>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// =================================================================
// Help System
// =================================================================

function toggleHelpPanel() {
    let panel = document.getElementById('helpPanel');
    
    if (panel) {
        panel.remove();
        return;
    }
    
    panel = document.createElement('div');
    panel.id = 'helpPanel';
    panel.className = 'modal show';
    
    panel.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <span class="close" onclick="toggleHelpPanel()">&times;</span>
            <h2>❓ Help & Keyboard Shortcuts</h2>
            
            <div class="help-section">
                <h3>⌨️ Keyboard Shortcuts</h3>
                <div class="shortcuts-grid">
                    <div class="shortcut-item"><kbd>R</kbd> Roll</div>
                    <div class="shortcut-item"><kbd>Q</kbd> or <kbd>Space</kbd> Quick Roll</div>
                    <div class="shortcut-item"><kbd>A</kbd> Toggle Auto Roll</div>
                    <div class="shortcut-item"><kbd>I</kbd> Items Tab</div>
                    <div class="shortcut-item"><kbd>P</kbd> Potions Tab</div>
                    <div class="shortcut-item"><kbd>C</kbd> Crafting Panel</div>
                    <div class="shortcut-item"><kbd>H</kbd> Toggle Help</div>
                    <div class="shortcut-item"><kbd>Ctrl+S</kbd> Save Game</div>
                    <div class="shortcut-item"><kbd>ESC</kbd> Close Modals</div>
                    <div class="shortcut-item"><kbd>1/2/3</kbd> Quick Slots</div>
                </div>
            </div>
            
            <div class="help-section">
                <h3>🖱️ Mouse Controls</h3>
                <ul>
                    <li><strong>Click</strong> - Use 1 item/potion</li>
                    <li><strong>Shift+Click</strong> - Use 10 items/potions</li>
                    <li><strong>Ctrl+Click</strong> - Use all items/potions</li>
                    <li><strong>⭐ Button</strong> - Favorite/unfavorite recipes</li>
                    <li><strong>⚡ Button</strong> - Quick craft (if materials available)</li>
                </ul>
            </div>
            
            <div class="help-section">
                <h3>💡 Tips & Tricks</h3>
                <ul>
                    <li>Pin achievements to track progress on the main screen</li>
                    <li>Use favorite recipes to keep important crafts at the top</li>
                    <li>Export your save regularly to prevent data loss</li>
                    <li>Check roll history to see your recent luck</li>
                    <li>Pity counters show rolls since last rare tier</li>
                    <li>Use bulk crafting modes for efficiency</li>
                    <li>Customize settings in the Settings tab</li>
                </ul>
            </div>
            
            <div class="help-section">
                <h3>🎮 Game Mechanics</h3>
                <ul>
                    <li><strong>Luck</strong> - Multiplies your chance of getting rare auras</li>
                    <li><strong>Speed</strong> - Reduces roll cooldown time</li>
                    <li><strong>Breakthrough</strong> - Special bonus when rolling auras</li>
                    <li><strong>Biomes</strong> - Different areas with unique aura pools</li>
                    <li><strong>Runes</strong> - Temporary powerful buffs</li>
                    <li><strong>Gear</strong> - Equippable items with passive effects</li>
                </ul>
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
}

// =================================================================
// Theme System
// =================================================================

function toggleTheme() {
    qolState.settings.theme = qolState.settings.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    saveQoLSettings();
}

function applyTheme() {
    if (qolState.settings.theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
}

// =================================================================
// Performance Mode
// =================================================================

function togglePerformanceMode() {
    qolState.settings.performanceMode = !qolState.settings.performanceMode;
    
    if (qolState.settings.performanceMode) {
        document.body.classList.add('performance-mode');
        showNotification('⚡ Performance mode enabled');
    } else {
        document.body.classList.remove('performance-mode');
        showNotification('✨ Performance mode disabled');
    }
    
    saveQoLSettings();
}

// =================================================================
// Compact Mode
// =================================================================

function toggleCompactMode() {
    qolState.settings.compactMode = !qolState.settings.compactMode;
    
    if (qolState.settings.compactMode) {
        document.body.classList.add('compact-mode');
        showNotification('📦 Compact mode enabled');
    } else {
        document.body.classList.remove('compact-mode');
        showNotification('📏 Compact mode disabled');
    }
    
    saveQoLSettings();
}

// =================================================================
// Settings Toggle Helper
// =================================================================

function toggleQoLSetting(settingName) {
    qolState.settings[settingName] = !qolState.settings[settingName];
    saveQoLSettings();
    
    // Apply changes immediately
    switch(settingName) {
        case 'showRollHistory':
            if (qolState.settings.showRollHistory) {
                updateRollHistoryDisplay();
            } else {
                const container = document.getElementById('rollHistoryContainer');
                if (container) container.remove();
            }
            break;
        case 'showStatistics':
            if (qolState.settings.showStatistics) {
                updateStatisticsDisplay();
            } else {
                const container = document.getElementById('statisticsContainer');
                if (container) container.remove();
            }
            break;
        case 'keyboardShortcuts':
            if (qolState.settings.keyboardShortcuts) {
                initKeyboardShortcuts();
            }
            showNotification(qolState.settings.keyboardShortcuts ? '⌨️ Keyboard shortcuts enabled' : '⌨️ Keyboard shortcuts disabled');
            break;
        case 'showPityCounter':
        case 'showProgressBars':
            updateStatisticsDisplay();
            break;
    }
}

// =================================================================
// Sync Settings Checkboxes
// =================================================================

function syncSettingsCheckboxes() {
    // Sync performance mode checkbox
    const perfToggle = document.getElementById('performanceModeToggle');
    if (perfToggle) {
        perfToggle.checked = qolState.settings.performanceMode;
    }
    
    // Sync compact mode checkbox
    const compactToggle = document.getElementById('compactModeToggle');
    if (compactToggle) {
        compactToggle.checked = qolState.settings.compactMode;
    }
}

// =================================================================
// Initialization
// =================================================================

let qolSystemInitialized = false; // Prevent double initialization

function initQoLSystem() {
    if (qolSystemInitialized) {
        console.log('QoL System already initialized, skipping...');
        return;
    }
    
    console.log('Initializing QoL System...');
    qolSystemInitialized = true;
    
    try {
        loadQoLSettings();
        applyTheme();
        
        if (qolState.settings.performanceMode) {
            document.body.classList.add('performance-mode');
        }
        
        if (qolState.settings.compactMode) {
            document.body.classList.add('compact-mode');
        }
        
        // Sync checkbox states
        syncSettingsCheckboxes();
        
        initKeyboardShortcuts();
        
        // Update displays
        if (qolState.settings.showRollHistory) {
            console.log('Creating roll history panel...');
            updateRollHistoryDisplay();
        }
        
        if (qolState.settings.showStatistics) {
            console.log('Creating statistics panel...');
            updateStatisticsDisplay();
        }
        
        updatePinnedAchievementsDisplay();
        
        console.log('✅ QoL System initialized successfully');
        console.log('Settings:', qolState.settings);
    } catch (error) {
        console.error('❌ Error initializing QoL System:', error);
    }
}

// Make functions globally accessible
if (typeof window !== 'undefined') {
    window.addToRollHistory = addToRollHistory;
    window.clearRollHistory = clearRollHistory;
    window.resetSessionStats = resetSessionStats;
    window.togglePinAchievement = togglePinAchievement;
    window.exportSaveData = exportSaveData;
    window.importSaveData = importSaveData;
    window.copyStatsToClipboard = copyStatsToClipboard;
    window.toggleHelpPanel = toggleHelpPanel;
    window.toggleTheme = toggleTheme;
    window.togglePerformanceMode = togglePerformanceMode;
    window.toggleCompactMode = toggleCompactMode;
    window.toggleQoLSetting = toggleQoLSetting;
    window.sortAurasInventory = sortAurasInventory;
    window.filterAurasInventory = filterAurasInventory;
    window.sortPotionsInventory = sortPotionsInventory;
    window.filterPotionsInventory = filterPotionsInventory;
    // filterAurasSearch is defined in qol-inventory.js
    window.updateRollHistoryDisplay = updateRollHistoryDisplay;
    window.updateStatisticsDisplay = updateStatisticsDisplay;
    window.qolState = qolState;
    
    console.log('QoL functions attached to window object');
}

// Initialize on page load - try multiple times to ensure DOM is ready
if (typeof window !== 'undefined') {
    // Try immediately if DOM is already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initQoLSystem, 1000);
        });
    } else {
        // DOM already loaded
        setTimeout(initQoLSystem, 1000);
    }
    
    // Also try on window load as backup
    window.addEventListener('load', () => {
        if (!document.getElementById('rollHistoryContainer') && qolState.settings.showRollHistory) {
            console.log('Retrying QoL initialization...');
            setTimeout(initQoLSystem, 500);
        }
    });
}
