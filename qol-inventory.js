// =================================================================
// QoL Inventory Enhancements
// =================================================================

// Enhanced Auras Inventory with Sorting and Filtering
function updateAurasInventoryEnhanced() {
    const container = document.getElementById('aurasInventory');
    if (!container) return;
    
    const auras = gameState.inventory.auras;
    if (Object.keys(auras).length === 0) {
        container.innerHTML = '<div class="inv-empty-message" style="grid-column: 1 / -1;">No auras rolled</div>';
        return;
    }
    
    // Add controls if they don't exist
    let controlsContainer = document.getElementById('aurasInventoryControls');
    if (!controlsContainer) {
        controlsContainer = document.createElement('div');
        controlsContainer.id = 'aurasInventoryControls';
        controlsContainer.className = 'inventory-controls';
        container.parentNode.insertBefore(controlsContainer, container);
    }
    
    // Render controls
    controlsContainer.innerHTML = `
        <div class="search-container">
            <input type="text" id="aurasSearchInput" placeholder="Search auras..." oninput="filterAurasSearch(this.value)">
        </div>
        <label>Sort:</label>
        <select id="aurasSortSelect" onchange="sortAurasInventory(this.value)">
            <option value="rarity" ${qolState.inventorySort.auras === 'rarity' ? 'selected' : ''}>Rarity (High to Low)</option>
            <option value="rarity-low" ${qolState.inventorySort.auras === 'rarity-low' ? 'selected' : ''}>Rarity (Low to High)</option>
            <option value="alphabetical" ${qolState.inventorySort.auras === 'alphabetical' ? 'selected' : ''}>Alphabetical</option>
            <option value="count" ${qolState.inventorySort.auras === 'count' ? 'selected' : ''}>Count (High to Low)</option>
            <option value="recent" ${qolState.inventorySort.auras === 'recent' ? 'selected' : ''}>Recently Obtained</option>
        </select>
        <label>Filter:</label>
        <select id="aurasFilterSelect" onchange="filterAurasInventory(this.value)">
            <option value="all" ${qolState.inventoryFilter.auras === 'all' ? 'selected' : ''}>All Tiers</option>
            <option value="common" ${qolState.inventoryFilter.auras === 'common' ? 'selected' : ''}>Common</option>
            <option value="uncommon" ${qolState.inventoryFilter.auras === 'uncommon' ? 'selected' : ''}>Uncommon</option>
            <option value="rare" ${qolState.inventoryFilter.auras === 'rare' ? 'selected' : ''}>Rare+</option>
            <option value="epic" ${qolState.inventoryFilter.auras === 'epic' ? 'selected' : ''}>Epic+</option>
            <option value="legendary" ${qolState.inventoryFilter.auras === 'legendary' ? 'selected' : ''}>Legendary+</option>
            <option value="mythic" ${qolState.inventoryFilter.auras === 'mythic' ? 'selected' : ''}>Mythic+</option>
            <option value="exotic" ${qolState.inventoryFilter.auras === 'exotic' ? 'selected' : ''}>Exotic+</option>
            <option value="divine" ${qolState.inventoryFilter.auras === 'divine' ? 'selected' : ''}>Divine+</option>
            <option value="celestial" ${qolState.inventoryFilter.auras === 'celestial' ? 'selected' : ''}>Celestial+</option>
            <option value="transcendent" ${qolState.inventoryFilter.auras === 'transcendent' ? 'selected' : ''}>Transcendent</option>
        </select>
    `;
    
    // Get search term
    const searchInput = document.getElementById('aurasSearchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    // Filter auras
    let filteredAuras = Object.entries(auras);
    
    // Apply search filter
    if (searchTerm) {
        filteredAuras = filteredAuras.filter(([name]) => name.toLowerCase().includes(searchTerm));
    }
    
    // Apply tier filter
    if (qolState.inventoryFilter.auras !== 'all') {
        const tierHierarchy = ['common', 'uncommon', 'good', 'rare', 'epic', 'legendary', 'mythic', 'exotic', 'divine', 'celestial', 'transcendent'];
        const filterIndex = tierHierarchy.indexOf(qolState.inventoryFilter.auras);
        
        filteredAuras = filteredAuras.filter(([name, data]) => {
            const auraIndex = tierHierarchy.indexOf(data.tier);
            return auraIndex >= filterIndex;
        });
    }
    
    // Sort auras
    filteredAuras.sort((a, b) => {
        const [nameA, dataA] = a;
        const [nameB, dataB] = b;
        
        switch(qolState.inventorySort.auras) {
            case 'rarity':
                const auraA = AURAS.find(aura => aura.name === nameA);
                const auraB = AURAS.find(aura => aura.name === nameB);
                const rarityA = auraA ? auraA.rarity : dataA.rarity;
                const rarityB = auraB ? auraB.rarity : dataB.rarity;
                return rarityB - rarityA; // High to low
            case 'rarity-low':
                const auraA2 = AURAS.find(aura => aura.name === nameA);
                const auraB2 = AURAS.find(aura => aura.name === nameB);
                const rarityA2 = auraA2 ? auraA2.rarity : dataA.rarity;
                const rarityB2 = auraB2 ? auraB2.rarity : dataB.rarity;
                return rarityA2 - rarityB2; // Low to high
            case 'alphabetical':
                return nameA.localeCompare(nameB);
            case 'count':
                return dataB.count - dataA.count;
            case 'recent':
                // Assuming more recent = higher in history
                const indexA = qolState.rollHistory.findIndex(entry => entry.name === nameA);
                const indexB = qolState.rollHistory.findIndex(entry => entry.name === nameB);
                if (indexA === -1 && indexB === -1) return 0;
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            default:
                return 0;
        }
    });
    
    // Render auras
    if (filteredAuras.length === 0) {
        container.innerHTML = '<div class="inv-empty-message" style="grid-column: 1 / -1;">No auras match your filters</div>';
        return;
    }
    
    container.innerHTML = filteredAuras.map(([name, data]) => {
        const auraFont = getAuraFont(name);
        const auraColor = getAuraColor(name);
        
        // Get the base rarity from AURAS array
        const baseAura = AURAS.find(a => a.name === name);
        const displayRarity = baseAura ? baseAura.rarity : data.rarity;
        
        const breakthroughIndicator = data.lastWasBreakthrough ? ' ⚡' : '';
        
        return `<div class="aura-item" title="${data.lastWasBreakthrough ? 'Breakthrough obtained!' : ''}">
            <div class="aura-item-name" style="font-family: ${auraFont}; color: ${auraColor};">${name}${breakthroughIndicator}</div>
            <div class="aura-item-rarity">1 in ${displayRarity.toLocaleString()} • x${data.count}</div>
            <button class="aura-delete-btn" onclick="deleteAuraPrompt('${name.replace(/'/g, "\\'")}')">🗑️</button>
        </div>`;
    }).join('');
}

function filterAurasSearch(searchTerm) {
    updateAurasInventoryEnhanced();
}

// Enhanced Potions Inventory with Filtering
function updatePotionsInventoryEnhanced() {
    const container = document.getElementById('potionsInventory');
    if (!container) return;
    
    const potions = gameState.inventory.potions || {};
    
    // Add controls if they don't exist
    let controlsContainer = document.getElementById('potionsInventoryControls');
    if (!controlsContainer) {
        controlsContainer = document.createElement('div');
        controlsContainer.id = 'potionsInventoryControls';
        controlsContainer.className = 'inventory-controls';
        container.parentNode.insertBefore(controlsContainer, container);
    }
    
    // Render controls
    controlsContainer.innerHTML = `
        <div class="filter-pills">
            <button class="filter-pill ${qolState.inventoryFilter.potions === 'all' ? 'active' : ''}" onclick="filterPotionsInventory('all')">All</button>
            <button class="filter-pill ${qolState.inventoryFilter.potions === 'basic' ? 'active' : ''}" onclick="filterPotionsInventory('basic')">Basic</button>
            <button class="filter-pill ${qolState.inventoryFilter.potions === 'advanced' ? 'active' : ''}" onclick="filterPotionsInventory('advanced')">Advanced</button>
            <button class="filter-pill ${qolState.inventoryFilter.potions === 'ultimate' ? 'active' : ''}" onclick="filterPotionsInventory('ultimate')">Ultimate</button>
            <button class="filter-pill ${qolState.inventoryFilter.potions === 'special' ? 'active' : ''}" onclick="filterPotionsInventory('special')">Special</button>
        </div>
    `;
    
    if (Object.keys(potions).length === 0) {
        container.innerHTML = '<div class="empty-inventory">No potions available. Roll to find potions!</div>';
        return;
    }
    
    // Filter potions
    let filteredPotions = Object.entries(potions);
    
    if (qolState.inventoryFilter.potions !== 'all') {
        filteredPotions = filteredPotions.filter(([name]) => {
            const category = getPotionCategory(POTION_RECIPES.find(r => r.name === name));
            return category.includes(qolState.inventoryFilter.potions);
        });
    }
    
    if (filteredPotions.length === 0) {
        container.innerHTML = '<div class="empty-inventory">No potions match your filter</div>';
        return;
    }
    
    container.innerHTML = filteredPotions.map(([name, data]) => {
        const recipe = typeof POTION_RECIPES !== 'undefined' ? POTION_RECIPES.find(r => r.name === name) : null;
        const isUsable = recipe && (
            recipe.luckBoost !== undefined || 
            recipe.speedBoost !== undefined ||
            recipe.chaosMode !== undefined ||
            recipe.mirrorChance !== undefined ||
            recipe.cooldownReduction !== undefined ||
            recipe.phoenixMode !== undefined ||
            recipe.bonusSpawnChance !== undefined ||
            recipe.legendaryOnly !== undefined ||
            recipe.quantumChance !== undefined ||
            recipe.curseImmunity !== undefined ||
            recipe.jackpotMode !== undefined ||
            recipe.guaranteeRarity !== undefined ||
            recipe.oneRoll !== undefined ||
            recipe.rollCount !== undefined ||
            recipe.negatesBuffs !== undefined ||
            recipe.dupeChance !== undefined ||
            // NEW POTION MODES
            recipe.clarityMode !== undefined ||
            recipe.hindsightMode !== undefined ||
            recipe.patienceMode !== undefined ||
            recipe.momentumMode !== undefined ||
            recipe.focusTier !== undefined ||
            recipe.gamblerMode !== undefined ||
            recipe.extremesMode !== undefined ||
            recipe.allOrNothingMode !== undefined ||
            recipe.sacrificeMode !== undefined ||
            recipe.hourMode !== undefined ||
            recipe.adaptationMode !== undefined ||
            recipe.explorationMode !== undefined ||
            recipe.nightMode !== undefined ||
            recipe.dayMode !== undefined ||
            recipe.consistencyMode !== undefined ||
            recipe.varietyMode !== undefined ||
            recipe.breakthroughMode !== undefined ||
            recipe.conservationMode !== undefined ||
            recipe.insightMode !== undefined ||
            recipe.collectorMode !== undefined ||
            recipe.beginnerMode !== undefined ||
            recipe.masteryMode !== undefined
        );
        
        const categoryClass = getPotionCategory(recipe);
        const effectDescription = recipe?.effect || 'No description available';
        const durationText = recipe?.duration ? ` (${Math.floor(recipe.duration / 60)}m ${recipe.duration % 60}s)` : '';
        
        // Check if Potion of the Beginner is disabled (100+ rolls)
        const isBeginnerDisabled = recipe?.beginnerMode && gameState.totalRolls >= 100;
        
        // Check if night/day potions are disabled (wrong time)
        const isNightDisabled = recipe?.nightMode && gameState.timeOfDay !== 'night';
        const isDayDisabled = recipe?.dayMode && gameState.timeOfDay !== 'day';
        
        const disabledText = isBeginnerDisabled ? ' [DISABLED - Requires <100 rolls]' : 
                            isNightDisabled ? ' [NIGHTTIME ONLY]' :
                            isDayDisabled ? ' [DAYTIME ONLY]' : '';
        const disabledClass = (isBeginnerDisabled || isNightDisabled || isDayDisabled) ? ' potion-disabled' : '';
        
        const usageText = isBeginnerDisabled ? 'DISABLED: Only works with less than 100 total rolls' : 
                         isNightDisabled ? 'DISABLED: Only usable during nighttime' :
                         isDayDisabled ? 'DISABLED: Only usable during daytime' :
                         isUsable ? 'Click: Use 1 | Shift+Click: Use 10 | Ctrl+Click: Use All' : 'Not usable';
        const tooltip = `${usageText}\n\n${effectDescription}${durationText}`;
        
        // Check if this potion is selected in bulk mode
        const isSelected = gameState?.bulkMode?.selectedPotions?.includes(name);
        const selectionClass = isSelected ? ' potion-selected' : '';
        
        const clickHandler = (isUsable && !isBeginnerDisabled && !isNightDisabled && !isDayDisabled) ? `onclick="usePotionPrompt('${name}', event)"` : '';
        
        return `<div class="inventory-item ${categoryClass}${selectionClass}${disabledClass}" ${clickHandler} title="${tooltip}"><div class="inventory-item-icon">⚗️</div><div class="inventory-item-name">${name}${disabledText}</div><div class="inventory-item-count">x${data.count}</div></div>`;
    }).join('');
}

// Add achievement pinning to achievements display
function updateAchievementsInventoryEnhanced() {
    const container = document.getElementById('achievementsInventory');
    if (!container) return;
    
    const unlocked = gameState.achievements.unlocked || {};
    const unlockedCount = Object.keys(unlocked).length;
    const totalCount = Object.keys(ACHIEVEMENTS).length;
    
    let html = `<div style="margin-bottom: 20px; text-align: center;">
        <h3 style="color: #fbbf24;">🏆 Achievements: ${unlockedCount}/${totalCount}</h3>
        <div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
            <div><strong>Total Rolls:</strong> ${gameState.totalRolls.toLocaleString()}</div>
            <div><strong>Highest Rarity:</strong> 1 in ${gameState.achievements.stats.highestRarity.toLocaleString()}</div>
            <div><strong>Breakthroughs:</strong> ${gameState.achievements.stats.breakthroughCount.toLocaleString()}</div>
            <div><strong>Playtime:</strong> ${Math.floor(gameState.achievements.stats.playtimeMinutes / 60)}h ${Math.floor(gameState.achievements.stats.playtimeMinutes % 60)}m</div>
            <div><strong>Potions Used:</strong> ${gameState.achievements.stats.potionsUsed.toLocaleString()}</div>
        </div>
    </div>`;
    
    // Group achievements by category
    const categoryOrder = ['ROLLS', 'RARITY', 'PLAYTIME', 'BREAKTHROUGHS', 'BIOMES', 'AURAS', 'POTIONS', 'RUNES', 'CRAFTING', 'GEAR', 'SPEED', 'STREAKS', 'COLLECTION', 'CHALLENGES', 'DAILY', 'META'];
    
    for (const category of categoryOrder) {
        const achievements = Object.entries(ACHIEVEMENTS).filter(([id, ach]) => ach.category === category);
        if (achievements.length === 0) continue;
        
        const categoryTitles = {
            'ROLLS': '🎲 Roll Milestones',
            'RARITY': '💎 Rarity Hunter',
            'PLAYTIME': '⏰ Time Traveler',
            'BREAKTHROUGHS': '⚡ Breakthrough Master',
            'BIOMES': '🌍 Biome Explorer',
            'AURAS': '✨ Aura Collection',
            'POTIONS': '🧪 Potion Master',
            'RUNES': '📿 Rune Master',
            'CRAFTING': '⚒️ Crafting Master',
            'GEAR': '🛡️ Gear Master',
            'SPEED': '⚡ Speed Runner',
            'STREAKS': '🔥 Lucky Streaks',
            'COLLECTION': '📚 Collection Specialist',
            'CHALLENGES': '🏆 Special Challenges',
            'DAILY': '📅 Daily/Session',
            'META': '🎖️ Achievement Hunter'
        };
        
        html += `<div style="margin-bottom: 20px;">
            <h4 style="color: #667eea; margin-bottom: 10px;">${categoryTitles[category] || category}</h4>`;
        
        for (const [id, achievement] of achievements) {
            const isUnlocked = !!unlocked[id];
            const isPinned = qolState.pinnedAchievements.includes(id);
            const progress = getAchievementProgress(id, achievement);
            const progressPercent = Math.min(100, (progress / achievement.requirement) * 100);
            const rewardsText = formatAchievementRewards(achievement.reward);
            
            html += `<div style="background: ${isUnlocked ? 'rgba(251, 191, 36, 0.2)' : 'rgba(0,0,0,0.3)'}; border: 2px solid ${isUnlocked ? '#fbbf24' : '#444'}; border-radius: 8px; padding: 12px; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="font-size: 32px;">${isUnlocked ? '🏆' : '🔒'}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: bold; color: ${isUnlocked ? '#fbbf24' : '#888'};">${achievement.name}</div>
                        <div style="font-size: 13px; color: #aaa;">${achievement.description}</div>
                        ${rewardsText ? `<div style="margin-top: 5px; font-size: 12px; color: #fbbf24;">🎁 Rewards: ${rewardsText}</div>` : ''}
                        ${!isUnlocked ? `<div style="margin-top: 5px; font-size: 12px; color: #667eea;">Progress: ${formatProgress(progress, achievement)}</div>` : ''}
                        ${!isUnlocked && progressPercent > 0 ? `<div style="background: #333; height: 6px; border-radius: 3px; margin-top: 5px; overflow: hidden;"><div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${progressPercent}%; transition: width 0.3s;"></div></div>` : ''}
                    </div>
                    ${!isUnlocked ? `<button class="achievement-pin-btn ${isPinned ? 'pinned' : ''}" onclick="togglePinAchievement('${id}')">📌 ${isPinned ? 'Unpin' : 'Pin'}</button>` : ''}
                </div>
            </div>`;
        }
        
        html += `</div>`;
    }
    
    container.innerHTML = html;
}

// Make functions globally accessible immediately
if (typeof window !== 'undefined') {
    window.updateAurasInventoryEnhanced = updateAurasInventoryEnhanced;
    window.updatePotionsInventoryEnhanced = updatePotionsInventoryEnhanced;
    window.updateAchievementsInventoryEnhanced = updateAchievementsInventoryEnhanced;
    window.filterAurasSearch = filterAurasSearch;
    
    console.log('QoL inventory functions attached to window object');
}

// Override the original functions if they exist
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for gameState to be available
        setTimeout(() => {
            if (typeof updateAurasInventory !== 'undefined') {
                window.updateAurasInventory = updateAurasInventoryEnhanced;
            }
            if (typeof updatePotionsInventory !== 'undefined') {
                window.updatePotionsInventory = updatePotionsInventoryEnhanced;
            }
            if (typeof updateAchievementsInventory !== 'undefined') {
                window.updateAchievementsInventory = updateAchievementsInventoryEnhanced;
            }
            console.log('QoL inventory overrides applied');
        }, 1000);
    });
}
