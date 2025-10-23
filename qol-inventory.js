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
        
        // Get last roll info
        const lastRoll = data.rollHistory && data.rollHistory.length > 0 
            ? data.rollHistory[data.rollHistory.length - 1] 
            : null;
        const lastRollText = lastRoll 
            ? `Last rolled at ${(lastRoll.finalLuck * 100).toFixed(1)}% luck` 
            : 'No roll history';
        
        return `<div class="aura-item" onclick="showAuraRollHistory('${name.replace(/'/g, "\\'")}')" style="cursor: pointer;" title="Click to view roll history • ${lastRollText}">
            <div class="aura-item-name" style="font-family: ${auraFont}; color: ${auraColor};">${name}${breakthroughIndicator}</div>
            <div class="aura-item-rarity">1 in ${displayRarity.toLocaleString()} • x${data.count}</div>
            <button class="aura-delete-btn" onclick="event.stopPropagation(); deleteAuraPrompt('${name.replace(/'/g, "\\'")}')">🗑️</button>
        </div>`;
    }).join('');
}

function filterAurasSearch(searchTerm) {
    updateAurasInventoryEnhanced();
}

// Show detailed roll history for an aura
function showAuraRollHistory(auraName) {
    const auraData = gameState.inventory.auras[auraName];
    if (!auraData) return;
    
    const rollHistory = auraData.rollHistory || [];
    const baseAura = AURAS.find(a => a.name === auraName);
    const displayRarity = baseAura ? baseAura.rarity : auraData.rarity;
    
    // Get aura styling
    const auraFont = getAuraFont(auraName);
    const auraColor = getAuraColor(auraName);
    
    // Format roll history
    let historyHTML = '';
    if (rollHistory.length === 0) {
        historyHTML = '<div style="text-align: center; padding: 20px; color: #888;">No roll history available for this aura.</div>';
    } else {
        // Reverse to show most recent first
        const reversedHistory = [...rollHistory].reverse();
        
        historyHTML = `
            <div style="max-height: 400px; overflow-y: auto; padding: 10px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead style="position: sticky; top: 0; background: #1a1a2e; z-index: 1;">
                        <tr style="border-bottom: 2px solid #fbbf24;">
                            <th style="padding: 10px; text-align: left; color: #fbbf24;">#</th>
                            <th style="padding: 10px; text-align: left; color: #fbbf24;">Date & Time</th>
                            <th style="padding: 10px; text-align: right; color: #fbbf24;">Base Luck</th>
                            <th style="padding: 10px; text-align: right; color: #fbbf24;">Final Luck</th>
                            <th style="padding: 10px; text-align: center; color: #fbbf24;">Type</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        reversedHistory.forEach((roll, index) => {
            const rollNumber = rollHistory.length - index;
            const date = new Date(roll.timestamp);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            
            const baseLuck = (roll.luck * 100).toFixed(2) + '%';
            const finalLuck = (roll.finalLuck * 100).toFixed(2) + '%';
            
            // Determine badge based on roll type
            let typeBadge;
            if (roll.duplicated) {
                const source = roll.source || 'unknown';
                typeBadge = `<span style="background: linear-gradient(135deg, #a855f7, #8b5cf6); padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">📋 DUPLICATED (${source})</span>`;
            } else if (roll.breakthrough) {
                typeBadge = '<span style="background: linear-gradient(135deg, #fbbf24, #f59e0b); padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">⚡ BREAKTHROUGH</span>';
            } else {
                typeBadge = '<span style="color: #888;">Normal Roll</span>';
            }
            
            // Alternate row colors
            const rowBg = index % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'transparent';
            
            historyHTML += `
                <tr style="background: ${rowBg}; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <td style="padding: 8px; color: #aaa;">${rollNumber}</td>
                    <td style="padding: 8px; color: #ddd;">
                        <div>${dateStr}</div>
                        <div style="font-size: 11px; color: #888;">${timeStr}</div>
                    </td>
                    <td style="padding: 8px; text-align: right; color: #667eea; font-weight: bold;">${baseLuck}</td>
                    <td style="padding: 8px; text-align: right; color: #10b981; font-weight: bold;">${finalLuck}</td>
                    <td style="padding: 8px; text-align: center;">${typeBadge}</td>
                </tr>
            `;
        });
        
        historyHTML += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // Calculate statistics
    const avgBaseLuck = rollHistory.length > 0 
        ? (rollHistory.reduce((sum, r) => sum + r.luck, 0) / rollHistory.length * 100).toFixed(2) + '%'
        : 'N/A';
    const avgFinalLuck = rollHistory.length > 0 
        ? (rollHistory.reduce((sum, r) => sum + r.finalLuck, 0) / rollHistory.length * 100).toFixed(2) + '%'
        : 'N/A';
    const breakthroughCount = rollHistory.filter(r => r.breakthrough).length;
    const breakthroughRate = rollHistory.length > 0 
        ? ((breakthroughCount / rollHistory.length) * 100).toFixed(1) + '%'
        : '0%';
    const duplicatedCount = rollHistory.filter(r => r.duplicated).length;
    const duplicatedRate = rollHistory.length > 0 
        ? ((duplicatedCount / rollHistory.length) * 100).toFixed(1) + '%'
        : '0%';
    
    // Find best and worst luck rolls
    const bestLuckRoll = rollHistory.length > 0 
        ? rollHistory.reduce((best, r) => r.finalLuck > best.finalLuck ? r : best, rollHistory[0])
        : null;
    const worstLuckRoll = rollHistory.length > 0 
        ? rollHistory.reduce((worst, r) => r.finalLuck < worst.finalLuck ? r : worst, rollHistory[0])
        : null;
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'auraRollHistoryModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    modal.innerHTML = `
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); 
                    border: 3px solid #fbbf24; 
                    border-radius: 16px; 
                    padding: 30px; 
                    max-width: 800px; 
                    width: 90%; 
                    max-height: 80vh; 
                    overflow-y: auto;
                    box-shadow: 0 10px 50px rgba(251, 191, 36, 0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #fbbf24; font-size: 24px;">
                    📊 Roll History
                </h2>
                <button onclick="closeAuraRollHistoryModal()" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">✕</button>
            </div>
            
            <div style="text-align: center; margin-bottom: 25px; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 12px; border: 2px solid rgba(251, 191, 36, 0.3);">
                <div style="font-family: ${auraFont}; color: ${auraColor}; font-size: 32px; font-weight: bold; margin-bottom: 10px;">
                    ${auraName}
                </div>
                <div style="color: #ddd; font-size: 16px; margin-bottom: 5px;">
                    Rarity: <span style="color: #fbbf24; font-weight: bold;">1 in ${displayRarity.toLocaleString()}</span>
                </div>
                <div style="color: #ddd; font-size: 16px;">
                    Total Rolls: <span style="color: #10b981; font-weight: bold;">${rollHistory.length}</span>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 25px;">
                <div style="background: rgba(102, 126, 234, 0.2); padding: 15px; border-radius: 10px; border: 2px solid #667eea;">
                    <div style="color: #667eea; font-size: 12px; font-weight: bold; margin-bottom: 5px;">AVG BASE LUCK</div>
                    <div style="color: white; font-size: 20px; font-weight: bold;">${avgBaseLuck}</div>
                </div>
                <div style="background: rgba(16, 185, 129, 0.2); padding: 15px; border-radius: 10px; border: 2px solid #10b981;">
                    <div style="color: #10b981; font-size: 12px; font-weight: bold; margin-bottom: 5px;">AVG FINAL LUCK</div>
                    <div style="color: white; font-size: 20px; font-weight: bold;">${avgFinalLuck}</div>
                </div>
                <div style="background: rgba(251, 191, 36, 0.2); padding: 15px; border-radius: 10px; border: 2px solid #fbbf24;">
                    <div style="color: #fbbf24; font-size: 12px; font-weight: bold; margin-bottom: 5px;">BREAKTHROUGHS</div>
                    <div style="color: white; font-size: 20px; font-weight: bold;">${breakthroughCount} (${breakthroughRate})</div>
                </div>
                ${duplicatedCount > 0 ? `
                <div style="background: rgba(168, 85, 247, 0.2); padding: 15px; border-radius: 10px; border: 2px solid #a855f7;">
                    <div style="color: #a855f7; font-size: 12px; font-weight: bold; margin-bottom: 5px;">DUPLICATED</div>
                    <div style="color: white; font-size: 20px; font-weight: bold;">${duplicatedCount} (${duplicatedRate})</div>
                </div>
                ` : ''}
                ${bestLuckRoll ? `
                <div style="background: rgba(34, 197, 94, 0.2); padding: 15px; border-radius: 10px; border: 2px solid #22c55e;">
                    <div style="color: #22c55e; font-size: 12px; font-weight: bold; margin-bottom: 5px;">BEST LUCK</div>
                    <div style="color: white; font-size: 20px; font-weight: bold;">${(bestLuckRoll.finalLuck * 100).toFixed(2)}%</div>
                </div>
                ` : ''}
                ${worstLuckRoll ? `
                <div style="background: rgba(239, 68, 68, 0.2); padding: 15px; border-radius: 10px; border: 2px solid #ef4444;">
                    <div style="color: #ef4444; font-size: 12px; font-weight: bold; margin-bottom: 5px;">WORST LUCK</div>
                    <div style="color: white; font-size: 20px; font-weight: bold;">${(worstLuckRoll.finalLuck * 100).toFixed(2)}%</div>
                </div>
                ` : ''}
            </div>
            
            <div style="background: rgba(0,0,0,0.4); border-radius: 12px; padding: 15px; border: 2px solid rgba(251, 191, 36, 0.3);">
                <h3 style="color: #fbbf24; margin-top: 0; margin-bottom: 15px;">📜 Detailed Roll Log</h3>
                ${historyHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAuraRollHistoryModal();
        }
    });
}

function closeAuraRollHistoryModal() {
    const modal = document.getElementById('auraRollHistoryModal');
    if (modal) {
        modal.remove();
    }
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
    window.showAuraRollHistory = showAuraRollHistory;
    window.closeAuraRollHistoryModal = closeAuraRollHistoryModal;
    
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
