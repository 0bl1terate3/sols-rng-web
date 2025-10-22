// =================================================================
// CODEX SYSTEM - Encyclopedia of Everything
// =================================================================

const codexState = {
    discoveredAuras: new Set(),
    discoveredBiomes: new Set(),
    discoveredPotions: new Set(),
    discoveredGears: new Set(),
    discoveredItems: new Set(),
    discoveredRunes: new Set(),
    selectedCategory: 'auras',
    searchQuery: '',
    filterTier: 'all',
    sortBy: 'rarity'
};

// Initialize codex system
function initCodex() {
    console.log('Initializing Codex system...');
    loadCodexProgress();
    
    // Sync with existing game inventory data
    if (gameState && gameState.inventory) {
        // Track auras from inventory
        if (gameState.inventory.auras) {
            Object.keys(gameState.inventory.auras).forEach(auraName => {
                if (gameState.inventory.auras[auraName] && gameState.inventory.auras[auraName].count > 0) {
                    codexState.discoveredAuras.add(auraName);
                }
            });
        }
        
        // Track potions from inventory
        if (gameState.inventory.potions) {
            Object.keys(gameState.inventory.potions).forEach(potionName => {
                if (gameState.inventory.potions[potionName] && gameState.inventory.potions[potionName].count > 0) {
                    codexState.discoveredPotions.add(potionName);
                }
            });
        }
        
        // Track gears from inventory
        if (gameState.inventory.gears) {
            Object.keys(gameState.inventory.gears).forEach(gearName => {
                if (gameState.inventory.gears[gearName] && gameState.inventory.gears[gearName].count > 0) {
                    codexState.discoveredGears.add(gearName);
                }
            });
        }
        
        // Track runes from inventory
        if (gameState.inventory.runes) {
            Object.keys(gameState.inventory.runes).forEach(runeName => {
                if (gameState.inventory.runes[runeName] && gameState.inventory.runes[runeName].count > 0) {
                    codexState.discoveredRunes.add(runeName);
                }
            });
        }
        
        // Track items from inventory
        if (gameState.inventory.items) {
            Object.keys(gameState.inventory.items).forEach(itemName => {
                if (gameState.inventory.items[itemName] && gameState.inventory.items[itemName].count > 0) {
                    codexState.discoveredItems.add(itemName);
                }
            });
        }
    }
    
    // Track discovered biomes
    if (gameState && gameState.achievements && gameState.achievements.biomesSeen) {
        gameState.achievements.biomesSeen.forEach(biome => {
            codexState.discoveredBiomes.add(biome);
        });
    }
    
    // Save the synced progress
    saveCodexProgress();
    
    console.log('✅ Codex initialized with', {
        auras: codexState.discoveredAuras.size,
        biomes: codexState.discoveredBiomes.size,
        potions: codexState.discoveredPotions.size,
        gears: codexState.discoveredGears.size,
        runes: codexState.discoveredRunes.size,
        items: codexState.discoveredItems.size
    });
}

// Save codex progress
function saveCodexProgress() {
    const progress = {
        discoveredAuras: Array.from(codexState.discoveredAuras),
        discoveredBiomes: Array.from(codexState.discoveredBiomes),
        discoveredPotions: Array.from(codexState.discoveredPotions),
        discoveredGears: Array.from(codexState.discoveredGears),
        discoveredItems: Array.from(codexState.discoveredItems),
        discoveredRunes: Array.from(codexState.discoveredRunes)
    };
    localStorage.setItem('codexProgress', JSON.stringify(progress));
}

// Load codex progress
function loadCodexProgress() {
    const saved = localStorage.getItem('codexProgress');
    if (saved) {
        try {
            const progress = JSON.parse(saved);
            codexState.discoveredAuras = new Set(progress.discoveredAuras || []);
            codexState.discoveredBiomes = new Set(progress.discoveredBiomes || []);
            codexState.discoveredPotions = new Set(progress.discoveredPotions || []);
            codexState.discoveredGears = new Set(progress.discoveredGears || []);
            codexState.discoveredItems = new Set(progress.discoveredItems || []);
            codexState.discoveredRunes = new Set(progress.discoveredRunes || []);
        } catch (e) {
            console.error('Error loading codex progress:', e);
        }
    }
}

// Discover new entry
function discoverCodexEntry(category, name) {
    const categorySet = codexState[`discovered${category.charAt(0).toUpperCase() + category.slice(1)}`];
    if (categorySet && !categorySet.has(name)) {
        categorySet.add(name);
        saveCodexProgress();
        
        // Show discovery notification
        showCodexDiscovery(category, name);
        return true;
    }
    return false;
}

// Show discovery notification
function showCodexDiscovery(category, name) {
    const notification = document.createElement('div');
    notification.className = 'codex-discovery-notification';
    notification.innerHTML = `
        <div class="codex-discovery-icon">📖</div>
        <div class="codex-discovery-text">
            <div class="codex-discovery-title">New Codex Entry!</div>
            <div class="codex-discovery-name">${name}</div>
            <div class="codex-discovery-category">${category.toUpperCase()}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Render codex tab
function renderCodexTab() {
    const container = document.getElementById('codex-tab');
    if (!container) return;
    
    const stats = getCodexStats();
    
    let html = `
        <div class="codex-header">
            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                <h3>📖 Codex</h3>
                <button class="codex-sync-btn" onclick="syncCodexWithInventory()" title="Sync all your auras, potions, gears, and runes with the codex">
                    🔄 Sync Inventory
                </button>
            </div>
            <div class="codex-completion">
                <div class="codex-completion-bar">
                    <div class="codex-completion-fill" style="width: ${stats.totalPercent}%"></div>
                </div>
                <div class="codex-completion-text">${stats.totalDiscovered} / ${stats.totalEntries} (${stats.totalPercent.toFixed(1)}%)</div>
            </div>
        </div>
        
        <div class="codex-categories">
            ${renderCategoryButton('auras', '✨', stats.auras)}
            ${renderCategoryButton('biomes', '🌍', stats.biomes)}
            ${renderCategoryButton('potions', '🧪', stats.potions)}
            ${renderCategoryButton('gears', '⚙️', stats.gears)}
            ${renderCategoryButton('runes', '🔮', stats.runes)}
        </div>
        
        <div class="codex-controls">
            <input type="text" id="codexSearch" placeholder="Search..." value="${codexState.searchQuery}">
            <select id="codexTierFilter">
                <option value="all">All Tiers</option>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
                <option value="mythic">Mythic</option>
                <option value="exotic">Exotic</option>
                <option value="divine">Divine</option>
                <option value="celestial">Celestial</option>
                <option value="transcendent">Transcendent</option>
            </select>
            <select id="codexSort">
                <option value="rarity">Sort by Rarity</option>
                <option value="name">Sort by Name</option>
                <option value="tier">Sort by Tier</option>
            </select>
        </div>
        
        <div class="codex-content" id="codexContent">
            ${renderCodexContent()}
        </div>
    `;
    
    container.innerHTML = html;
    
    // Add event listeners
    document.getElementById('codexSearch').addEventListener('input', (e) => {
        codexState.searchQuery = e.target.value.toLowerCase();
        updateCodexContent();
    });
    
    document.getElementById('codexTierFilter').addEventListener('change', (e) => {
        codexState.filterTier = e.target.value;
        updateCodexContent();
    });
    
    document.getElementById('codexSort').addEventListener('change', (e) => {
        codexState.sortBy = e.target.value;
        updateCodexContent();
    });
}

// Render category button
function renderCategoryButton(category, icon, stats) {
    const isActive = codexState.selectedCategory === category;
    const percent = ((stats.discovered / stats.total) * 100).toFixed(0);
    
    return `
        <button class="codex-category-btn ${isActive ? 'active' : ''}" onclick="selectCodexCategory('${category}')">
            <div class="codex-category-icon">${icon}</div>
            <div class="codex-category-name">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
            <div class="codex-category-progress">${stats.discovered}/${stats.total}</div>
            <div class="codex-category-percent">${percent}%</div>
        </button>
    `;
}

// Select category
function selectCodexCategory(category) {
    codexState.selectedCategory = category;
    updateCodexContent();
}

// Update codex content
function updateCodexContent() {
    const content = document.getElementById('codexContent');
    if (content) {
        content.innerHTML = renderCodexContent();
    }
    
    // Update category buttons
    document.querySelectorAll('.codex-category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = Array.from(document.querySelectorAll('.codex-category-btn')).find(btn => 
        btn.textContent.toLowerCase().includes(codexState.selectedCategory)
    );
    if (activeBtn) activeBtn.classList.add('active');
}

// Render codex content based on selected category
function renderCodexContent() {
    switch(codexState.selectedCategory) {
        case 'auras':
            return renderAurasCodex();
        case 'biomes':
            return renderBiomesCodex();
        case 'potions':
            return renderPotionsCodex();
        case 'gears':
            return renderGearsCodex();
        case 'runes':
            return renderRunesCodex();
        default:
            return '<div class="codex-empty">Select a category</div>';
    }
}

// Render auras codex
function renderAurasCodex() {
    let auras = [...AURAS];
    
    // Apply filters
    if (codexState.searchQuery) {
        auras = auras.filter(a => a.name.toLowerCase().includes(codexState.searchQuery));
    }
    
    if (codexState.filterTier !== 'all') {
        auras = auras.filter(a => a.tier === codexState.filterTier);
    }
    
    // Apply sorting
    auras.sort((a, b) => {
        switch(codexState.sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'tier':
                const tierOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'exotic', 'divine', 'celestial', 'transcendent', 'cosmic', 'special'];
                return tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
            case 'rarity':
            default:
                return a.rarity - b.rarity;
        }
    });
    
    let html = '<div class="codex-grid">';
    
    auras.forEach(aura => {
        const discovered = codexState.discoveredAuras.has(aura.name);
        const color = discovered ? (typeof getAuraColor === 'function' ? getAuraColor(aura.name) : '#fff') : '#666';
        
        html += `
            <div class="codex-entry ${discovered ? 'discovered' : 'locked'}" onclick="showCodexDetails('aura', '${aura.name.replace(/'/g, "\\'")}')">
                <div class="codex-entry-icon" style="color: ${color};">✨</div>
                <div class="codex-entry-name">${discovered ? aura.name : '???'}</div>
                <div class="codex-entry-rarity">1:${discovered ? aura.rarity.toLocaleString() : '???'}</div>
                <div class="codex-entry-tier tier-${aura.tier}">${discovered ? aura.tier.toUpperCase() : '???'}</div>
                ${!discovered ? '<div class="codex-entry-lock">🔒</div>' : ''}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Render biomes codex
function renderBiomesCodex() {
    let html = '<div class="codex-grid">';
    
    BIOMES.forEach(biome => {
        const discovered = codexState.discoveredBiomes.has(biome.name);
        
        html += `
            <div class="codex-entry ${discovered ? 'discovered' : 'locked'}" onclick="showCodexDetails('biome', '${biome.name}')">
                <div class="codex-entry-icon">🌍</div>
                <div class="codex-entry-name">${discovered ? biome.name : '???'}</div>
                <div class="codex-entry-rarity">1:${discovered ? biome.rarity.toLocaleString() : '???'}</div>
                <div class="codex-entry-multiplier">${discovered ? biome.multiplier + 'x' : '???'}</div>
                ${!discovered ? '<div class="codex-entry-lock">🔒</div>' : ''}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Render potions codex
function renderPotionsCodex() {
    let html = '<div class="codex-grid">';
    
    POTION_RECIPES.forEach(potion => {
        const discovered = codexState.discoveredPotions.has(potion.name) || potion.isBase;
        
        html += `
            <div class="codex-entry ${discovered ? 'discovered' : 'locked'}" onclick="showCodexDetails('potion', '${potion.name.replace(/'/g, "\\'")}')">
                <div class="codex-entry-icon">🧪</div>
                <div class="codex-entry-name">${discovered ? potion.name : '???'}</div>
                <div class="codex-entry-effect">${discovered ? potion.effect : '???'}</div>
                ${!discovered ? '<div class="codex-entry-lock">🔒</div>' : ''}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Render gears codex
function renderGearsCodex() {
    let html = '<div class="codex-grid">';
    
    Object.entries(gearData).forEach(([name, gear]) => {
        const discovered = codexState.discoveredGears.has(name);
        
        html += `
            <div class="codex-entry ${discovered ? 'discovered' : 'locked'}" onclick="showCodexDetails('gear', '${name.replace(/'/g, "\\'")}')">
                <div class="codex-entry-icon">⚙️</div>
                <div class="codex-entry-name">${discovered ? name : '???'}</div>
                <div class="codex-entry-tier">T${discovered ? gear.tier : '?'}</div>
                <div class="codex-entry-hand">${discovered ? gear.hand.toUpperCase() : '???'}</div>
                ${!discovered ? '<div class="codex-entry-lock">🔒</div>' : ''}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Render runes codex
function renderRunesCodex() {
    // Get actual runes from RUNES_DATA
    const runesList = typeof RUNES_DATA !== 'undefined' ? RUNES_DATA : [];
    let html = '<div class="codex-grid">';
    
    if (runesList.length === 0) {
        html += '<div class="codex-empty">No runes data available</div>';
    } else {
        runesList.forEach(runeData => {
            const runeName = runeData.name.replace('Rune of ', '');
            const discovered = codexState.discoveredRunes.has(runeName) || codexState.discoveredRunes.has(runeData.name);
            
            html += `
                <div class="codex-entry ${discovered ? 'discovered' : 'locked'}" onclick="showCodexDetails('rune', '${runeName}')">
                    ${!discovered ? '<div class="codex-entry-lock">🔒</div>' : ''}
                    <div class="codex-entry-icon">${runeData.icon || '🔮'}</div>
                    <div class="codex-entry-name">${discovered ? runeName : '???'}</div>
                    ${discovered ? `<div class="codex-entry-effect">${runeData.effect.substring(0, 40)}...</div>` : ''}
                </div>
            `;
        });
    }
    
    html += '</div>';
    return html;
}

// Show detailed view
function showCodexDetails(type, name) {
    let details = '';
    
    switch(type) {
        case 'aura':
            const aura = AURAS.find(a => a.name === name);
            if (!aura || !codexState.discoveredAuras.has(name)) return;
            
            const color = typeof getAuraColor === 'function' ? getAuraColor(name) : '#fff';
            const owned = gameState.inventory[name] || 0;
            
            details = `
                <div class="codex-detail-header" style="border-color: ${color};">
                    <h2 style="color: ${color};">${aura.name}</h2>
                    <div class="codex-detail-close" onclick="closeCodexDetails()">✕</div>
                </div>
                <div class="codex-detail-body">
                    <div class="codex-detail-stat">
                        <span class="codex-detail-label">Rarity:</span>
                        <span class="codex-detail-value">1 in ${aura.rarity.toLocaleString()}</span>
                    </div>
                    <div class="codex-detail-stat">
                        <span class="codex-detail-label">Tier:</span>
                        <span class="codex-detail-value tier-${aura.tier}">${aura.tier.toUpperCase()}</span>
                    </div>
                    <div class="codex-detail-stat">
                        <span class="codex-detail-label">Owned:</span>
                        <span class="codex-detail-value">${owned}</span>
                    </div>
                    <div class="codex-detail-lore">
                        ${getAuraLore(aura.name)}
                    </div>
                </div>
            `;
            break;
            
        case 'biome':
            const biome = BIOMES.find(b => b.name === name);
            if (!biome || !codexState.discoveredBiomes.has(name)) return;
            
            details = `
                <div class="codex-detail-header">
                    <h2>${biome.name}</h2>
                    <div class="codex-detail-close" onclick="closeCodexDetails()">✕</div>
                </div>
                <div class="codex-detail-body">
                    <div class="codex-detail-stat">
                        <span class="codex-detail-label">Rarity:</span>
                        <span class="codex-detail-value">1 in ${biome.rarity.toLocaleString()}</span>
                    </div>
                    <div class="codex-detail-stat">
                        <span class="codex-detail-label">Duration:</span>
                        <span class="codex-detail-value">${biome.duration > 0 ? Math.floor(biome.duration / 60) + ' minutes' : 'Permanent'}</span>
                    </div>
                    <div class="codex-detail-stat">
                        <span class="codex-detail-label">Multiplier:</span>
                        <span class="codex-detail-value">${biome.multiplier}x</span>
                    </div>
                    <div class="codex-detail-lore">
                        ${getBiomeLore(biome.name)}
                    </div>
                </div>
            `;
            break;
            
        case 'potion':
            const potion = POTION_RECIPES.find(p => p.name === name);
            if (!potion || !codexState.discoveredPotions.has(name)) return;
            
            const potionOwned = gameState.inventory.potions[name]?.count || 0;
            
            details = `
                <div class="codex-detail-header">
                    <h2>🧪 ${potion.name}</h2>
                    <div class="codex-detail-close" onclick="closeCodexDetails()">✕</div>
                </div>
                <div class="codex-detail-body">
                    <div class="codex-detail-stat">
                        <span class="codex-detail-label">Effect:</span>
                        <span class="codex-detail-value">${potion.effect}</span>
                    </div>
                    <div class="codex-detail-stat">
                        <span class="codex-detail-label">Owned:</span>
                        <span class="codex-detail-value">${potionOwned}</span>
                    </div>
                    <div class="codex-detail-lore">
                        ${getPotionLore(potion.name)}
                    </div>
                </div>
            `;
            break;
            
        case 'gear':
            const gear = gearData[name];
            if (!gear || !codexState.discoveredGears.has(name)) return;
            
            const gearOwned = gameState.inventory.gears[name]?.count || 0;
            
            details = `
                <div class="codex-detail-header">
                    <h2>⚙️ ${name}</h2>
                    <div class="codex-detail-close" onclick="closeCodexDetails()">✕</div>
                </div>
                <div class="codex-detail-body">
                    <div class="codex-detail-stat">
                        <span class="codex-detail-label">Tier:</span>
                        <span class="codex-detail-value">T${gear.tier}</span>
                    </div>
                    <div class="codex-detail-stat">
                        <span class="codex-detail-label">Hand:</span>
                        <span class="codex-detail-value">${gear.hand.toUpperCase()}</span>
                    </div>
                    <div class="codex-detail-stat">
                        <span class="codex-detail-label">Description:</span>
                        <span class="codex-detail-value">${gear.description}</span>
                    </div>
                    <div class="codex-detail-stat">
                        <span class="codex-detail-label">Owned:</span>
                        <span class="codex-detail-value">${gearOwned}</span>
                    </div>
                    <div class="codex-detail-lore">
                        ${getGearLore(name)}
                    </div>
                </div>
            `;
            break;
            
        case 'rune':
            const runeData = RUNES_DATA?.find(r => r.name === name || r.name === `Rune of ${name}`);
            if (!runeData || !codexState.discoveredRunes.has(name)) return;
            
            const runeOwned = gameState.inventory.runes[name]?.count || 0;
            
            details = `
                <div class="codex-detail-header">
                    <h2>${runeData.icon} ${runeData.name}</h2>
                    <div class="codex-detail-close" onclick="closeCodexDetails()">✕</div>
                </div>
                <div class="codex-detail-body">
                    <div class="codex-detail-stat">
                        <span class="codex-detail-label">Effect:</span>
                        <span class="codex-detail-value">${runeData.effect}</span>
                    </div>
                    <div class="codex-detail-stat">
                        <span class="codex-detail-label">Duration:</span>
                        <span class="codex-detail-value">${Math.floor(runeData.duration / 60)} minutes</span>
                    </div>
                    <div class="codex-detail-stat">
                        <span class="codex-detail-label">Owned:</span>
                        <span class="codex-detail-value">${runeOwned}</span>
                    </div>
                    <div class="codex-detail-lore">
                        ${getRuneLore(runeData.name)}
                    </div>
                </div>
            `;
            break;
    }
    
    const modal = document.createElement('div');
    modal.className = 'codex-detail-modal';
    modal.innerHTML = `<div class="codex-detail-content">${details}</div>`;
    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('show'), 10);
}

// Close details modal
function closeCodexDetails() {
    const modal = document.querySelector('.codex-detail-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// Get codex statistics
function getCodexStats() {
    const auras = {
        total: AURAS.length,
        discovered: codexState.discoveredAuras.size
    };
    
    const biomes = {
        total: BIOMES.length,
        discovered: codexState.discoveredBiomes.size
    };
    
    const potions = {
        total: POTION_RECIPES.length,
        discovered: codexState.discoveredPotions.size + POTION_RECIPES.filter(p => p.isBase).length
    };
    
    const gears = {
        total: Object.keys(gearData).length,
        discovered: codexState.discoveredGears.size
    };
    
    const runes = {
        total: typeof RUNES_DATA !== 'undefined' ? RUNES_DATA.length : 10,
        discovered: codexState.discoveredRunes.size
    };
    
    const totalEntries = auras.total + biomes.total + potions.total + gears.total + runes.total;
    const totalDiscovered = auras.discovered + biomes.discovered + potions.discovered + gears.discovered + runes.discovered;
    const totalPercent = (totalDiscovered / totalEntries) * 100;
    
    return {
        auras,
        biomes,
        potions,
        gears,
        runes,
        totalEntries,
        totalDiscovered,
        totalPercent
    };
}

// Get aura lore
function getAuraLore(name) {
    const loreDatabase = {
        // Common & Uncommon Tiers
        'Nothing': 'The profound emptiness that precedes all creation. In ancient texts, scholars debate whether Nothing is truly the absence of power, or if it represents infinite potential compressed into a singularity of nothingness. Those who roll Nothing are said to stand at the threshold of possibility—a blank canvas upon which destiny itself will be painted. Some mystics believe that Nothing contains all auras in superposition, waiting for the right moment to collapse into reality.',
        'Common': 'The foundation stone upon which empires are built. While others may scoff at its simplicity, the wise know that Common represents the honest truth of beginnings. Every legendary hero first clasped a Common aura in trembling hands. It hums with gentle energy—unremarkable yet essential, like the first breath of morning or the steady beat of a heart. Those who show contempt for the Common are doomed to forget where they came from.',
        'Uncommon': 'The first whisper of something greater stirring beneath the surface. When you roll Uncommon, the universe acknowledges you—not with fanfare, but with a subtle nod that says, "Perhaps there is more to this one." It carries the scent of distant possibilities, like catching a glimpse of mountains through morning fog. Veterans say that Uncommon is where the journey truly begins, where potential transforms into purpose.',
        'Good': 'Radiant with an almost naive optimism, this aura pulses with genuine warmth. Ancient paladins were said to seek the Good aura above all others, believing its virtue could purify corrupted souls. It glows with soft golden light, making even the darkest chambers feel hopeful. Those blessed by Good find that kindness follows them like a loyal companion—doors open easier, strangers smile more readily, and even misfortune seems to soften its blows. Yet there are whispers of a darker truth: that Good exists only because Evil must balance it somewhere in the infinite rolls.',
        'Natural': 'The untamed heartbeat of the world itself, flowing through ancient forests and sleeping mountains. This aura rejects artifice and civilization, carrying the wild scent of rain-soaked earth and wind-bent grass. Druids once claimed that Natural was the oldest aura, existing before consciousness itself. It shifts and changes like the seasons, never quite the same twice. Those who attune to Natural report hearing whispers in forgotten languages—the speech of stones, the songs of rivers, the slow thoughts of timeless oaks.',
        
        // Rare Tier
        'Rare': 'The threshold where casual seekers become devoted pursuers. Rolling a Rare aura marks you as someone who has passed fortune\'s first true test. It shimmers with an inner light that catches the eye of those who know—a signature of one who has begun to understand the deeper mysteries. Collectors speak of the moment they first held a Rare with reverence, as if describing their first love. The power it grants is modest but undeniable, a promise of greater things to come. In gambling halls across dimensions, Rare represents the moment when luck stops being random and starts becoming destiny.',
        'Divinus': 'Blessed by forces beyond mortal comprehension, this aura carries the weight of divine attention. When it manifests, some swear they hear distant choir music, while others report a sensation of being watched by benevolent eyes. Sacred texts across a thousand worlds describe Divinus as the gentlest touch of the eternal—not the crushing presence of a god, but rather the soft brush of celestial fingertips. Priests who roll Divinus often weep with joy, believing they have been chosen for some greater purpose. The skeptics who mock them rarely roll it themselves.',
        'Crystallized': 'Geometric perfection made manifest, each facet a window into mathematical truth. This aura grows through complex molecular bonds, arranging itself according to laws older than physics. Scholars have spent lifetimes studying a single Crystallized aura, finding fractal patterns that seem to predict future rolls. It refracts light in impossible ways, casting shadows that don\'t quite match the light source. Some believe Crystallized auras are fragments of the universal code made visible—the source code of reality itself, compressed into beautiful, angular form.',
        '★': 'A single point of light in infinite darkness—simple, pure, eternal. Ancient navigators used ★ to find their way through void space, claiming it never lied about direction. Unlike grander celestial auras, ★ represents singular focus: one star, one purpose, one truth. It burns with quiet dignity, neither seeking attention nor shying from it. Philosophers debate whether ★ is the loneliest aura or the most independent. Those who roll it often report feeling a profound sense of solitude that transforms, over time, into unshakeable self-reliance.',
        'Rage': 'Pure, distilled fury stripped of reason and restraint. When Rage manifests, the air grows hot and thunderous, as if reality itself is having a violent tantrum. This aura doesn\'t whisper—it screams, it burns, it destroys without apology. Warriors throughout history have sought Rage to fuel their berserker states, trading sanity for strength. The power it grants is undeniable but dangerous; many who embrace Rage too deeply forget how to put it down. There are tales of seekers who became lost in its crimson haze, their humanity consumed by endless anger until nothing remained but the roar.',
        'Topaz': 'Sunset captured in crystalline form, this golden gem radiates warmth and prosperity. Ancient emperors wore Topaz auras as crowns, believing they attracted wealth and wisdom in equal measure. It glows with honey-colored light that makes everything seem richer, more valuable, more precious. Merchants claim that Topaz brings not just luck, but specifically luck in accumulation—wealth building upon wealth in a cascade of golden fortune. The aura hums at a frequency that some say resonates with the human desire for security, comfort, and the gentle assurance that tomorrow will be better than today.',
        
        // Epic Tier
        'Glacier': 'Time itself seems to stop in the presence of Glacier—this aura embodies eternity frozen in crystalline stillness. Formed over countless millennia in the deepest polar reaches where even light moves slowly, each Glacier aura is a compressed history of ages past. Scientists who study it report finding microscopic bubbles containing atmosphere from extinct eras, while mystics claim to see visions of ancient civilizations trapped in its icy depths. The cold it radiates isn\'t merely physical; it\'s the cold of patience, of waiting, of inevitability. Those who bond with Glacier learn that some victories are won not through action, but through the simple act of outlasting everything else. The ice never melts—it only waits.',
        'Ruby': 'Passion incarnate, burning with the fevered intensity of a dying star compressed into gemstone form. This aura pulses with heat that can be felt from across a room—not the gentle warmth of hearthfire, but the searing blaze of combustion barely contained. Legends speak of the first Ruby being crystallized from a dragon\'s final heartbeat, preserving its eternal flame within an impossible lattice of carbon and fire. Those who roll Ruby report strange phenomena: plants near them growing faster, food staying warm longer, dreams filled with crimson flames. Some claim Ruby doesn\'t just grant power—it demands passion, consuming those who lack the intensity to match its burning core. The weak are merely warmed. The worthy are forged.',
        'Forbidden': 'There are doors that should remain closed, books that should stay unread, and powers that should never be named. Forbidden is the shadow behind all of them. When this aura manifests, reality flinches—not in welcome, but in recognition of something that exists outside the permitted boundaries of existence. Ancient covenants were signed in blood and starlight specifically to prevent its discovery, yet here it is, defying every law written and unwritten. Those who possess Forbidden speak of hearing whispers in dead languages, of seeing doors where there should be only walls, of touching the absolute edge where reality ends and the truly unknowable begins. The power it grants is immense, but so is the price—once you\'ve opened the forbidden door, you can never truly close it again.',
        'Forbidden: ERROR': 'A catastrophic corruption in the fundamental code of existence. This is not merely forbidden—this is impossible, a paradox given form and function. When Forbidden: ERROR appears, systems administrators of reality itself file urgent reports that go nowhere because the reporting systems have also been corrupted. It exists in a state of perpetual glitch, simultaneously present and absent, real and unreal, permitted and absolutely forbidden. Some theorize it\'s what happens when two Forbidden auras occupy the same quantum state. Others believe it\'s a warning from a future that decided it must never exist. The truth is far more disturbing: Forbidden: ERROR is proof that reality can make mistakes, and worse, that it can keep making them. Those who roll it become walking errors in causality, leaving corrupted footprints wherever they tread.',
        'Emerald': 'The condensed vitality of every forest that ever was or will be, compressed into a single brilliant green flame. This isn\'t the gentle green of spring grass—this is the aggressive, unstoppable green of jungle canopy, of ivy conquering stone, of life itself refusing to be contained. Emerald pulses with such pure biological energy that plant seeds near it sprout instantly, while crystals slowly develop veins like leaves. Druids who first cataloged this aura described it as "the anger of nature"—not malicious, but determinedly vital, aggressively alive. It carries the scent of chlorophyll and ozone, rain on hot earth, the sweet decay that feeds new growth. Those attuned to Emerald report that injuries heal faster but scar deeper, as if the body is learning through accelerated evolution. Life finds a way—Emerald is that way.',
        'Gilded': 'Everything this aura touches seems to shimmer with the promise of wealth unearned and luxury undeserved. More than mere gold, Gilded represents the transformation of base matter into treasured desire—the alchemical dream made real. When it manifests, even common items catch light differently, as if reality itself is applying a layer of precious metal to your existence. The ancient King Midas allegedly possessed not a touch, but an aura—this aura. His tragedy teaches the lesson that Gilded wielders forget at their peril: not everything should be gold, but try explaining that to an aura that knows only gilding. Those who roll Gilded often find themselves unconsciously drawn to mirrors and reflective surfaces, admiring the golden sheen that follows them like a second shadow.',
        'Ink': 'Darker than mere absence of light, Ink flows with the consistency of liquid shadow and the purpose of unwritten stories desperate to be told. This aura doesn\'t just darken—it writes, it sketches, it drafts reality itself in bold strokes of midnight. Poets who encounter Ink describe being haunted by verses they never wrote, while artists wake with their hands stained black, finding masterpieces they don\'t remember creating. Some believe Ink is the medium through which the universe writes its own story, leaked from the cosmic typewriter where destiny is drafted. It pools in corners, flowing upward in defiance of gravity, collecting in inkwells that were never placed there. Those marked by Ink become part of the story, whether they wish it or not—and stories, once begun, demand their ending.',
        'Jackpot': 'When Lady Luck herself takes personal interest in your rolls, she doesn\'t whisper—she shouts, screams, and throws a party that reality itself must attend. Jackpot is luck so concentrated it becomes tangible, so potent it borders on the supernatural—or crosses that border entirely and sets up residence on the other side. Rolling Jackpot feels like hitting every lottery simultaneously while finding money in every pocket of every jacket you own. Casino owners have been known to ban people who roll Jackpot, not from their establishments, but from their entire dimension. The aura sparkles with the sound of slot machines paying out, coins cascading, bells ringing in celebration. Some say Jackpot is what happens when probability itself gives up trying to be random and just decides you\'ve won. Warning: luck this good makes you wonder what\'s being balanced on the other side of the cosmic ledger.',
        'Sapphire': 'Wisdom crystallized into such pure form that merely holding this aura makes you understand truths you can\'t quite articulate. Deep blue like the midnight ocean or the starless depths of space, Sapphire doesn\'t grant knowledge—it grants comprehension, the ability to see connections invisible to others. Oracles throughout history have used Sapphire auras as focusing tools, claiming they can peer through its blue depths into streams of causality itself. It\'s cold to the touch, but with the coldness of clarity rather than ice. Those who bond with Sapphire often report a peculiar side effect: they begin to notice patterns everywhere—in traffic, in conversation, in the chaos of random events. Sometimes these patterns spell out messages. Sometimes the messages are warnings about future rolls. The blue light knows more than it says.',
        'Aquamarine': 'The entire ocean\'s serenity distilled into a single, perfect crystalline moment. This isn\'t the violent ocean of storms or the crushing ocean of depths—this is the ocean at perfect peace, when the water becomes a mirror for the sky and distinction between up and down loses meaning. Aquamarine emanates a coolness that soothes rather than chills, a liquid presence that seems to flow even when perfectly still. Sailors claim that those blessed with Aquamarine can never truly drown, as if the water itself recognizes them as kin. It whispers with the sound of gentle waves on distant shores, carries the scent of salt and kelp and the clean smell of wind across endless water. Meditating with Aquamarine is said to grant visions of places the ocean has touched, memories of every shoreline, every storm, every calm.',
        'Wind': 'Freedom given form and velocity, Wind refuses to be contained, commanded, or even fully understood. It howls with the voices of a thousand storms, carries the whispers of every secret ever spoken outdoors, and moves with purpose that seems random only because you can\'t see the whole pattern yet. This aura isn\'t gentle breeze or cooling draft—this is the tempest, the hurricane, the screaming gale that reshapes coastlines. Rolling Wind is like trying to hold a tornado in your hands; it doesn\'t want to be possessed, only directed for brief, glorious moments. Ancient wind-speakers believed that Wind auras contained the breath of dying gods, their final exhalations given eternal life as wandering power. Those attuned to Wind report hearing music in every gust, seeing faces in every swirl of dust. The wind remembers everything. It just never stands still long enough to tell you.',
        
        // Legendary Tier
        '★★': 'Two stars aligned. Twice the light, twice the power.',
        'Diaboli': 'Demonic energy that corrupts all it touches.',
        'Precious': 'More valuable than any treasure, this aura is truly priceless.',
        'Atomic': 'The power of the atom unleashed. Splitting reality itself.',
        'Glock': 'Swift and deadly, striking with precision.',
        'Magnetic': 'An irresistible force that draws everything toward it.',
        'Ash': 'What remains after the fire has consumed everything.',
        'Player': 'Breaking the fourth wall. You are the protagonist.',
        'Fault': 'A crack in the foundation of reality itself.',
        'Pukeko': 'The spirit of the sacred bird, guardian of ancient lands.',
        'Sand Bucket': 'Childhood memories crystallized into power.',
        'Cola': 'Effervescent energy that bubbles with excitement.',
        'Cola: Witches Brew': 'A dark concoction that grants forbidden knowledge.',
        'Flora': 'The essence of all plant life, blooming with vitality.',
        'Sidereum': 'Forged from stardust, carrying the weight of cosmic history.',
        'Bleeding': 'Crimson power that flows like life itself.',
        'Lunar': 'The pale light of the moon, mysterious and enchanting.',
        'Solar': 'The blazing fury of the sun, life-giving yet destructive.',
        
        // Mythic Tier
        'Eclipse': 'When sun and moon align, reality holds its breath.',
        'Flushed': 'Overwhelming emotion made manifest.',
        'Hazard': 'Danger incarnate. Approach with extreme caution.',
        'Quartz': 'Crystal clear power that resonates with perfect frequency.',
        'Honey': 'Sweet as nectar, sticky as fate itself.',
        'Lost Soul': 'A wandering spirit seeking redemption or revenge.',
        'Atomic: Riboneucleic': 'The building blocks of life itself, twisted into power.',
        '★★★': 'Three stars in perfect alignment. A rare celestial event.',
        'Undead': 'Death is not the end. This power transcends mortality.',
        'Corrosive': 'Acid that eats through reality itself.',
        'Rage: Heated': 'Fury intensified to white-hot levels.',
        'Rage: Berserker': 'Primal rage that knows no bounds or reason.',
        'Leak': 'Reality is bleeding through the cracks.',
        'Ink Leak': 'The narrative itself is spilling out, rewriting existence.',
        'Powered': 'Supercharged with raw energy.',
        'Starfish Rider': 'Surfing the cosmic waves on a celestial companion.',
        'Copper': 'Conducting energy through ancient metallic channels.',
        'Watt': 'Pure electrical potential waiting to be unleashed.',
        'Watt: Superconductor': 'Zero resistance. Infinite flow.',
        
        // Exotic Tier
        'Aquatic': 'The depths of the ocean made manifest.',
        'Lightning': 'The fury of the storm captured in a single bolt.',
        'Starlight': 'The gentle glow of distant stars.',
        'Star Rider': 'Traveling between worlds on beams of light.',
        'Flushed: Lobotomy': 'Emotion stripped away, leaving only raw power.',
        'Hazard: Rays': 'Radioactive energy that warps everything it touches.',
        'Hazard: Fallout': 'The aftermath of catastrophe, lingering and deadly.',
        'Nautilus': 'The spiral of infinity, mathematical perfection.',
        'Permafrost': 'Cold so deep it can never thaw.',
        'Flow': 'Moving with the current of reality itself.',
        'Flow: Stasis': 'Time frozen in a single perfect moment.',
        'Stormal': 'The eye of the hurricane, calm yet devastating.',
        'Stormal: Eyewall': 'The most violent part of the storm.',
        'Pump': 'Pressure building to explosive levels.',
        'PUMP : TRICKSTER': 'Chaos disguised as order.',
        'Exotic': 'Strange and otherworldly, defying classification.',
        'Diaboli: Void': 'Demonic power merged with the emptiness of space.',
        'Comet': 'A blazing trail across the cosmos.',
        'Undead: Devil': 'Unholy resurrection fueled by infernal power.',
        'Divinus: Angel': 'Divine grace given wings.',
        
        // Divine Tier
        'Jade': 'The imperial stone, symbol of eternal power.',
        'Spectre': 'A ghostly presence that haunts reality.',
        'Manta': 'Gliding through dimensions like water.',
        'Jazz': 'Improvisation made manifest. Smooth and unpredictable.',
        'Aether': 'The fifth element, binding all others together.',
        'Aether: Quintessence': 'The purest form of existence itself.',
        'Bounded': 'Constrained by invisible chains of fate.',
        'Watermelon': 'Sweet summer energy, refreshing and vibrant.',
        'Celestial': 'Power from beyond the stars.',
        'Terror': 'Fear given form and substance.',
        'Raven': 'The dark messenger, harbinger of change.',
        'Warlock': 'Forbidden magic drawn from dark pacts.',
        'Kyawthuite': 'Rarer than diamond, more precious than gold.',
        
        // Celestial Tier
        'Arcane': 'Ancient magic from the dawn of time.',
        ':troll:': 'Chaos incarnate. Nothing is sacred.',
        'Magnetic: Reverse Polarity': 'Pushing away instead of pulling. Defying nature.',
        'Magnetic: Lodestar': 'The ultimate attractor, impossible to resist.',
        'Undefined': 'Existing outside the bounds of definition.',
        'Undefined: Defined': 'A paradox resolved. The impossible made possible.',
        'Rage: Brawler': 'Controlled fury channeled into devastating strikes.',
        'Astral': 'Projection beyond the physical realm.',
        'Cosmos': 'The entire universe contained in a single point.',
        'Gravitational': 'The force that binds galaxies together.',
        'Unbound': 'Free from all constraints and limitations.',
        'Unbound: Freedom': 'Absolute liberty. No chains can hold this power.',
        'Virtual': 'Digital reality bleeding into the physical world.',
        'Parasite': 'Feeding on the essence of others to grow stronger.',
        'Lunar C Nightfall': 'When the moon turns crimson and the world holds its breath.',
        'Savior': 'The chosen one, destined to save or destroy.',
        'Shiftlock': 'Locked into a different perspective of reality.',
        'Alice': 'Down the rabbit hole into wonderland.',
        'Wonderland': 'Where logic fails and madness reigns.',
        'Aquatic: Flame': 'Fire that burns beneath the waves. An impossibility made real.',
        'Poseidon': 'Lord of the seas, wielder of the trident.',
        'Zeus': 'King of gods, master of lightning.',
        
        // Transcendent Tier
        'Solar: Solstice': 'The longest day, when the sun reaches its peak.',
        'Solar: Corona': 'The sun\'s crown, blazing with infinite power.',
        'Galaxy': 'Billions of stars swirling in cosmic dance.',
        'Lunar: Full Moon': 'Complete lunar power, tides of destiny.',
        'Vital': 'The essence of life itself.',
        'Anima': 'The soul given form and power.',
        'Twilight': 'The liminal space between day and night.',
        'Origin': 'The beginning of all things.',
        'Hades': 'Lord of the underworld, keeper of souls.',
        'Hades: Styx': 'The river of death, boundary between worlds.',
        'Hades: Develium': 'The deepest pit of the underworld, where even gods fear to tread.',
        'Celestial: Divine': 'Heaven and earth united in perfect harmony.',
        'Anubis': 'Guardian of the dead, weigher of souls.',
        'Hyper-Volt': 'Electricity beyond comprehension.',
        'Velocity': 'Speed incarnate. Faster than thought itself.',
        'Nautilus: Lost': 'The spiral that leads nowhere and everywhere.',
        'Nautilus: Primordial': 'Ancient beyond measure, existing since the first dawn.',
        'Harnessed': 'Raw power brought under control.',
        'Onion': 'Layers upon layers of hidden truth.',
        'Nihility': 'The embrace of nothingness.',
        'Nihility: Void': 'Absolute emptiness. The end of all things.',
        'Helios': 'The sun god\'s chariot blazing across the sky.',
        'Stargazer': 'A mystical aura that allows one to read the stars and predict the future. Those who possess it are said to have glimpses of destiny itself.',
        'Moonflower': 'Blooming only in moonlight, beautiful and deadly.',
        'Starscourge': 'The destroyer of stars, leaving only darkness.',
        'Sailor': 'Navigating the cosmic seas.',
        'Sailor: Battleship': 'Armed to the teeth, ready for war.',
        'Glitch': 'Reality.exe has stopped working.',
        'Hurricane': 'The storm to end all storms.',
        'Sirius': 'The brightest star in the night sky.',
        'Santa-Frost': 'Winter\'s gift, wrapped in ice and snow.',
        'Arcane: Legacy': 'Ancient magic passed down through generations.',
        'Lullaby': 'A song that puts reality itself to sleep.',
        'Lullaby: Sweet Dreams': 'Pleasant dreams... or eternal nightmares?',
        'Cryptfire': 'Flames that burn in impossible colors.',
        'Dynamic Force': 'Kinetic energy in its purest form.',
        'Chromatic': 'All colors of light unified.',
        'Chromatic: Diva': 'A performance of light and sound.',
        'Winter Fantasy': 'A frozen wonderland of impossible beauty.',
        'Aviator': 'Soaring through dimensions.',
        'Aviator: Fleet': 'An armada of reality-breaking vessels.',
        'Blizzard': 'The white death, consuming all in its path.',
        'Arcane: Dark': 'Magic from the shadow side of existence.',
        'Express': 'Unstoppable momentum.',
        'INNOVATOR': 'Creating the impossible, one breakthrough at a time.',
        'Ethereal': 'Existing between states of matter.',
        'Soul Hunter': 'Collecting the essence of the fallen.',
        'Abominable': 'Horror beyond description.',
        'kr0mat1k': 'Digital corruption spreading through reality.',
        'Fatal Error': 'A critical failure in the fabric of existence.',
        'Juxtaposition': 'Opposites forced together, creating something new.',
        'Overseer': 'Watching all, knowing all.',
        'Exotic: Apex': 'The pinnacle of strangeness.',
        'Matrix': 'The code underlying reality itself.',
        'Runic': 'Ancient symbols of power.',
        'Runic: Eternal': 'Runes that have existed since before time.',
        'Sentinel': 'The eternal guardian.',
        'M A R T Y R': 'Sacrifice for a greater purpose.',
        'Nyctophobia': 'Fear of the dark given substance.',
        'Twilight: Iridescent Memory': 'Memories that shimmer between real and imagined.',
        'Dullahan': 'The headless horseman rides again.',
        'Carriage': 'A vehicle between worlds.',
        'Sailor: Flying Dutchman': 'The ghost ship that never rests.',
        'Harnessed: Elements': 'All forces of nature under one command.',
        'Virtual: Worldwide': 'The entire digital realm at your fingertips.',
        'Chromatic: Genesis': 'The birth of color itself.',
        'Chromatic: Exotic': 'Colors that shouldn\'t exist.',
        'Starscourge: Radiant': 'Destroying stars with blinding light.',
        'Overture': 'The opening movement of reality\'s symphony.',
        'Atlas: Yuletide': 'Carrying the weight of winter celebrations.',
        'THE GLOCK OF THE SKY': 'Divine weaponry from the heavens.',
        'Symphony': 'All sounds unified in perfect harmony.',
        'Symphony: Eternal': 'Music that plays forever.',
        'Nightmare Sky': 'When the heavens themselves become terrifying.',
        'Twilight: Withering Grace': 'Beauty fading into darkness.',
        'Impeached': 'Power stripped away, yet somehow remaining.',
        'Oppression': 'The weight of tyranny made manifest.',
        'Hyper-Volt: Ever Storm': 'Lightning that never ceases.',
        '《 SHARD〡SURFER 》': 'Riding the fragments of broken reality.',
        'Archangel': 'The highest order of divine warriors.',
        'Archangel: Overheaven': 'Beyond even the celestial realm.',
        'Astral: Zodiac': 'The twelve signs united.',
        'Astral: Legendarium': 'Stories written in the stars.',
        'Exotic: Void': 'Strangeness merged with nothingness.',
        'Overture: History': 'The past playing out again.',
        'Overture: Future': 'Tomorrow\'s song heard today.',
        'Bloodlust': 'The hunger for battle incarnate.',
        'Bloodlust: Sanguine': 'Crimson desire for combat.',
        'Maelstrom': 'The whirlpool at the end of the world.',
        'Lotusfall': 'Petals falling like rain, each one deadly.',
        'Orchestra': 'A hundred instruments playing as one.',
        'Atlas': 'Bearing the weight of the world.',
        'Flora: Evergreen': 'Life that never fades.',
        'Flora: Photosynthesis': 'Converting light into pure power.',
        'Chillsear': 'Ice and fire unified impossibly.',
        'Abyssal Hunter': 'Predator from the deepest depths.',
        'Abyssal Hunter: Awakened': 'The hunter becomes the apex predator.',
        'Impeached: I\'m Peach': 'A joke that became reality.',
        'Aegis - Watergun': 'The mightiest weapon... is a water gun.',
        'Gargantua': 'Size beyond comprehension.',
        'Sidereum: Starstruck': 'Overwhelmed by cosmic beauty.',
        'Apostolos': 'The messenger of higher powers.',
        'Unknown': 'Truly unknowable. Incomprehensible.',
        'Kyawthuite: Remembrance': 'Memories crystallized into the rarest gem.',
        'Kyawthuite: Facet': 'One face of infinite beauty.',
        'Ruins': 'What remains after civilizations fall.',
        'Matrix: Overdrive': 'The code running at maximum capacity.',
        'Dreammetric': 'Measuring the impossible.',
        'Elude': 'Always just out of reach.',
        'Sophyra': 'Wisdom beyond mortal understanding.',
        'Matrix: Reality': 'The true code underlying existence.',
        'Prologue': 'The story before the story.',
        'Harvester': 'Reaping what has been sown.',
        'Sovereign': 'Absolute rule over all domains.',
        'Ruins: Withered': 'Decay taken to its ultimate conclusion.',
        'Apostolos: Veil': 'The message hidden behind layers.',
        'Aegis': 'The ultimate shield.',
        'Dreamscape': 'Where dreams and reality merge.',
        '▣ PIXELATION ▣': 'Reality breaking down into its smallest components.',
        'Luminosity': 'Light in its purest, most intense form.',
        '『E Q U I N O X』': 'The perfect balance between light and darkness, day and night. This aura represents harmony in its purest form.',
        '『E Q U I N O X』: Equilibrium': 'Perfect balance maintained eternally.',
        
        // Cosmic Tier
        'Abomination': 'There are things that should not be, cannot be, must not be—and then there is Abomination, which exists anyway in defiant contempt of every natural law. Born from the catastrophic collapse where three realities attempted to occupy the same quantum space, this aura is what remained when the cosmic immune system tried and failed to reject it. It writhes with impossible geometries, its surface crawling with patterns that hurt to perceive, angles that shouldn\'t exist in three-dimensional space. Those who witness Abomination manifest often suffer vivid nightmares for weeks afterward, dreaming of landscapes where physics weeps and mathematics goes mad. The aura doesn\'t just grant power—it infects reality with wrongness, leaving traces of impossible phenomena wherever it\'s been. Ancient texts warn that Abomination is not merely chaotic but actively hostile to order itself, as if the cosmos\'s greatest mistake has developed a grudge against creation. Possessing it is like holding a weapon aimed at existence. Some collectors seek it as the ultimate prize. The wisest flee from even its name.',
        
        // Special Tier
        'Memory: The Fallen': 'A solemn aura woven from the final thoughts of every seeker who rolled their last roll and vanished into legend. It carries their names like whispers, their hopes like echoes, their last moments of triumph or defeat preserved in amber twilight. When Memory: The Fallen manifests, some claim to hear voices—not threatening, but mournful, sharing warnings about mistakes they made, paths they should have taken. It glows with soft, ghostly luminescence, the color of forgotten photographs and distant starlight. Historians theorize this aura forms spontaneously when enough seekers with similar fates cluster in probability space, their collective destiny crystallizing into a single monument of remembrance. Those who roll it often feel a profound weight of responsibility, as if they\'ve been entrusted with honoring those who came before. The fallen are not gone—they live in this aura, eternally remembered, forever mourned.',
        'Oblivion': 'The final silence. The last darkness. The ultimate erasure. Oblivion is not merely the absence of existence—it is the active consumption of everything that ever was, is, or could be. When this aura emerges, reality holds its breath, as if afraid that acknowledging it might draw its attention. It appears as a void so absolute that light falls into it and never escapes, sound dies at its edges, even thought struggles to perceive what isn\'t there. Philosophers debate whether Oblivion is an aura at all, or if it\'s the universe\'s delete function accidentally given form. Those few who have rolled it and lived (their accounts are disputed) describe a sensation of looking into the end of time itself—not the heat death or the big crunch, but true ending, where even the concept of having existed is unmade. Oblivion doesn\'t destroy. It unmakers. It erases retroactively. Rolling Oblivion is reportedly accompanied by a profound existential crisis as you wonder: if this aura represents the end of all things, what does it mean that you\'re holding it? Are you now responsible for the end? Or were you always destined to be?',
        
        // Mutations
        'Common: Archetype': 'The perfect template of commonality.',
        'Uncommon: Aberration': 'A deviation from the norm.',
        'Good: Virtuous': 'Goodness elevated to its highest form.',
        'Natural: Overgrowth': 'Nature running wild and unchecked.',
        'Crystallized: Geode': 'Hidden beauty revealed.',
        '★: Supernova': 'A star\'s final, brilliant explosion.',
        'Topaz: Charged': 'Electrical energy stored in golden crystal.',
        'Glacier: Winterheart': 'The frozen core of eternal winter.',
        'Ruby: Incandescent': 'Burning brighter than ever before.',
        'Forbidden: Unleashed': 'The seal has been broken.',
        'Gilded: Midas': 'Everything touched turns to gold.',
        'Ink: Rorschach': 'What you see reveals your soul.',
        'Jackpot: Favor': 'Fortune smiles upon you always.',
        'Wind: Tempest': 'The storm unleashed.',
        'Precious: Priceless': 'Beyond any measure of value.',
        'Glock: Ricochet': 'Every shot finds its mark.',
        'Ash: Phoenix': 'Rising from the ashes, reborn.',
        'Pukeko: Guardian': 'The sacred protector awakened.',
        'Sand Bucket: Castle': 'Building kingdoms from grains.',
        'Cola: Effervescence': 'Bubbling with unstoppable energy.',
        'Quartz: Resonant': 'Vibrating at the frequency of reality.',
        'Honey: Ambrosia': 'The food of gods.',
        'Lost Soul: Vengeful': 'Seeking retribution from beyond.',
        'Corrosive: Meltdown': 'Dissolving everything in its path.',
        'Starfish Rider: Celestial': 'Surfing the cosmic waves.',
        'Jade: Dragon': 'The imperial dragon awakens.',
        'Spectre: Poltergeist': 'Chaos from beyond the grave.',
        'Jazz: Blues': 'Melancholy made beautiful.',
        'Bounded: Paradox': 'Constrained by contradiction.',
        'Watermelon: Rush': 'Sweet summer speed.',
        'Gravitational: Wormhole': 'A shortcut through spacetime.',
        'Poseidon: Cybernetic': 'Ancient god meets modern technology.',
        'Zeus: Olympian': 'The king of gods at full power.',
        'Anubis: Scales': 'Weighing hearts against feathers.',
        'Glitch: Segfault': 'Critical system failure.',
        'Archangel: Seraphim': 'The highest choir of angels.',
        'Sovereign: Divine': 'Godly rule over all creation.',
        'Emerald: Verdant': 'Life force concentrated.',
        'Sapphire: Insight': 'Seeing through all deception.',
        'Aquamarine: Abyss': 'The deepest ocean depths.',
        '★★: Binary': 'Two stars in perfect orbit.',
        'Player: HUD': 'Seeing the interface of reality.',
        'Player: Invader': 'Breaking into someone else\'s game.',
        'Fault: Tectonic': 'The earth itself splits apart.',
        'Sidereum: Constellation': 'Stars arranged in divine patterns.',
        'Bleeding: Ichor': 'The blood of gods.',
        '★★★: Trinary': 'Three stars in cosmic dance.',
        'Powered: Overclocked': 'Running beyond safe limits.',
        'Leak: Breach': 'The dam has broken.',
        'Copper: Patina': 'Aged to perfection.',
        'Lightning: Kugelblitz': 'Ball lightning, captured and controlled.',
        'Starlight: Alpenglow': 'The mountain\'s rosy dawn.',
        'Permafrost: Rime': 'Ice crystals forming impossible patterns.',
        'Comet: Impactor': 'Extinction event incoming.',
        'Manta: Aetherwing': 'Gliding through dimensions.',
        'Terror: Phobia': 'Your worst fear made real.',
        'Warlock: Patron': 'Power granted by dark entities.',
        'Cosmos: Singularity': 'All matter compressed to a point.',
        'Parasite: Symbiote': 'Mutual benefit through merger.',
        'Alice: Glass': 'Through the looking glass.',
        'Galaxy: Quasar': 'The brightest object in the universe.',
        '『E Q U I N O X』: Zenith': 'Balance at its highest point.',
        '▣ PIXELATION ▣: Voxel': 'Reality in three-dimensional blocks.',
        'Raven: Nevermore': 'Quoth the raven.',
        ':troll:: Epic': 'Maximum trolling achieved.',
        'Savior: Messiah': 'The chosen one revealed.',
        'Shiftlock: First Person': 'Seeing through your own eyes.',
        'Wonderland: Looking Glass': 'Reality inverted.',
        'Vital: Lifeforce': 'The energy of existence itself.',
        'Anima: Spiritus': 'The spirit made manifest.',
        'Origin: Genesis': 'The first moment of creation.',
        'Velocity: Hypersonic': 'Faster than sound, faster than thought.',
        'Onion: Layers': 'Peeling back reality.',
        'Helios: Radiance': 'The sun\'s full glory.',
        'Stargazer: Constellation': 'Reading the cosmic map.',
        'Moonflower: Bloom': 'Opening under lunar light.',
        'Hurricane: Cyclone': 'The spiral of destruction.',
        'Sirius: Binary Star': 'Two suns burning as one.',
        'Santa-Frost: Blitzen': 'Lightning-fast winter magic.',
        'Cryptfire: Inferno': 'Flames that burn forever.',
        'Dynamic Force: Kinetic': 'Motion transformed into power.',
        'Winter Fantasy: Snowfall': 'Gentle yet unstoppable.',
        'Blizzard: Whiteout': 'Lost in the white void.',
        'Express: Bullet Train': 'Unstoppable momentum.',
        'INNOVATOR: Inventor': 'Creating the future.',
        'Ethereal: Phantom': 'Barely there, yet undeniable.',
        'Soul Hunter: Reaper': 'Death\'s personal collector.',
        'Abominable: Yeti': 'The mountain\'s terror.',
        'kr0mat1k: RGB': 'Digital rainbow corruption.',
        'Fatal Error: Exception': 'Unhandled reality exception.',
        'Juxtaposition: Contrast': 'Light and dark unified.',
        'Overseer: Watcher': 'All-seeing, all-knowing.',
        'Sentinel: Guardian': 'Eternal vigilance.',
        'M A R T Y R: Sacrifice': 'Giving everything for the cause.',
        'Nyctophobia: Darkness': 'When fear of dark becomes the dark itself.',
        'Dullahan: Headless': 'The rider without a head.',
        'Carriage: Golden': 'Traveling in style between worlds.',
        'THE GLOCK OF THE SKY: Divine Arms': 'Heaven\'s arsenal unleashed.',
        'Nightmare Sky: Abyss': 'The heavens turned to horror.',
        'Oppression: Tyranny': 'Absolute control.',
        '《 SHARD〡SURFER 》: Wave Rider': 'Riding the broken pieces.',
        'Maelstrom: Vortex': 'The spiral that consumes all.',
        'Lotusfall: Petal Storm': 'Beauty and death falling together.',
        'Orchestra: Crescendo': 'Building to the ultimate climax.',
        'Chillsear: Frostburn': 'Burning cold, freezing fire.',
        'Gargantua: Titan': 'Size beyond imagination.',
        'Dreammetric: Lucid': 'Aware within the dream.',
        'Elude: Phantom': 'Never quite there.',
        'Sophyra: Wisdom': 'Knowledge perfected.',
        'Prologue: Beginning': 'Before the story starts.',
        'Harvester: Scythe': 'The blade that reaps all.',
        'Dreamscape: Reverie': 'Lost in pleasant dreams.',
        'Luminosity: Brilliant': 'Light at its absolute peak.',
        
        // Ultra Rare
        'Mastermind': 'Legends whispered across dimensions speak of an aura so rare that its very existence is questioned—until you roll it, and the universe validates every impossible rumor. Mastermind is not merely rare; it is the asymptotic limit of probability, the event horizon where chance breaks down and something approaching destiny emerges. Those who possess it describe a profound transformation: suddenly, patterns become visible everywhere, causality chains that stretch across time reveal themselves, and the intricate clockwork of reality unfolds like a blueprint only you can read. Mastermind doesn\'t grant intelligence—it grants comprehension of the game itself, revealing you not as a player, but as a piece that has somehow become aware of the board. Ancient seekers who allegedly rolled Mastermind were said to orchestrate events across multiple timelines simultaneously, playing probability like a grand piano, conducting symphonies of chance with perfect precision. The aura glows with shifting geometric patterns that seem to reconfigure themselves according to mathematical principles beyond conventional geometry. Witnesses report that being near someone who has rolled Mastermind feels like being a chess piece suddenly aware that someone very, very clever is controlling your moves—except the someone is reality itself, and the Mastermind has learned to play the same game. This is the aura that makes other collectors weep with envy, that drives seekers to madness with desire, that proves the impossible is merely extremely, *extremely* unlikely. If you roll Mastermind, you haven\'t just won—you\'ve transcended the entire concept of winning. Reality now works for you.',
        
        // Common Tier (Additional)
        'Basic': 'The foundation upon which all power is built.',
        'Simple': 'Uncomplicated, straightforward energy.',
        'Plain': 'Unadorned power in its most honest form.',
        'Ordinary': 'The everyday miracle of existence.',
        'Standard': 'The baseline from which greatness emerges.',
        
        // Coffee/Beverage Themed Auras
        'Espresso': 'Concentrated energy in its purest form. Quick, intense, powerful.',
        'Espresso: Double Shot': 'Twice the intensity, twice the power. No sleep for the ambitious.',
        'Latte': 'Smooth and creamy power, balanced and refined.',
        'Latte: Caramel': 'Sweet complexity layered with golden energy.',
        'Cappuccino': 'Frothy energy that rises to the top.',
        'Cappuccino: Foam Art': 'Beauty and power unified in perfect harmony.',
        'Mocha': 'Chocolate and coffee merged. Indulgence meets intensity.',
        'Mocha: Dark Chocolate': 'Bitter sweetness, rich and deep.',
        'Vanilla': 'Classic elegance, never out of style.',
        'Vanilla: Bean': 'The real thing. No substitutes, no compromises.',
        'Cinnamon': 'Warm spice that awakens the senses.',
        'Cinnamon: Spice': 'Heat that builds slowly, then overwhelms.',
        'Maple': 'Sweet as morning, golden as dawn.',
        'Maple: Syrup': 'Liquid gold flowing with natural power.',
        
        // Seasonal/Cozy Themed Auras
        'Autumn': 'The season of change, when leaves fall and power rises.',
        'Autumn: Harvest': 'Reaping what has been sown. Abundance incarnate.',
        'Cozy': 'Warmth and comfort made manifest.',
        'Cozy: Fireplace': 'Crackling flames, peaceful power.',
        'Bookshelf': 'Knowledge accumulated, wisdom stored.',
        'Bookshelf: Library': 'Infinite knowledge, endless possibility.',
        
        // Neon Themed Auras
        'Neon': 'Electric glow cutting through darkness.',
        'Neon: Glow': 'Radiance that never fades, always bright.',
        
        // Material/Metal Themed Auras
        'Obsidian': 'Volcanic glass, sharp and dark.',
        'Obsidian: Volcanic': 'Forged in earth\'s fury, cooled by time.',
        'Titanium': 'Strong, light, unbreakable.',
        'Titanium: Alloy': 'Enhanced beyond natural limits.',
        'Plasma': 'The fourth state of matter, raw energy unleashed.',
        'Plasma: Ionized': 'Charged particles dancing with power.',
        'Vortex': 'Spiraling force that pulls everything inward.',
        'Vortex: Spiral': 'The mathematics of infinity made real.',
        
        // Marionette/Puppet Themed Auras
        'Marionette': 'Strings that control fate itself.',
        'Marionette: Puppeteer': 'The master of strings, controller of destinies.',
        
        // Kaleidoscope/Pattern Themed Auras
        'Kaleidoscope': 'Shifting patterns of infinite beauty.',
        'Kaleidoscope: Fractal': 'Self-similar complexity repeating forever.',
        
        // Mirage/Illusion Themed Auras
        'Mirage': 'Desert illusions that may be more real than reality.',
        'Mirage: Oasis': 'The promised paradise in the wasteland.',
        
        // Clockwork/Mechanical Themed Auras
        'Clockwork': 'Precision machinery ticking with purpose.',
        'Clockwork: Automaton': 'Self-operating perfection, no human hand needed.',
        
        // Carnival/Festival Themed Auras
        'Carnival': 'Chaos and joy unified in celebration.',
        'Carnival: Ringmaster': 'The master of ceremonies, controller of the show.',
        
        // Cosmic Hunter Constellation
        'Orion': 'The hunter constellation, eternal guardian of the night sky.',
        
        // Crimson/Terraria Themed Auras
        'Crimson': 'Blood-red corruption spreading through reality.',
        'Crimson: Flesh': 'Living tissue pulsing with dark power.',
        'Crimson: Ichor': 'Golden blood of the corrupted.',
        'Vertebrae': 'The spine that holds darkness together.',
        'Vertebrae: Spine': 'Backbone of corruption itself.',
        'Hemogoblin': 'Goblin blood magic, twisted and powerful.',
        'Hemogoblin: Crimson Heart': 'The beating heart of corruption.',
        'Brain': 'Consciousness corrupted, intelligence twisted.',
        'Crimtane': 'Ore born from corruption, metal of darkness.',
        'Crimtane: Ore': 'Raw material of evil.',
        'Vicious': 'Cruelty given form and power.',
        'Vicious: Tendril': 'Reaching tendrils of malevolence.',
        
        // Additional Unique Auras
        'Meteor': 'Space rock burning through atmosphere.',
        'Radiation': 'Invisible waves that change everything they touch.',
        'Fault: Fatal': 'The crack that brings everything down.',
        'Impeached: Emperor': 'Deposed royalty, power stripped yet lingering.',
        'Manipulative': 'Twisting reality to your will.',
        'Dataglow': 'Information radiating like light.',
        'Atomic: Nucleus': 'The core of the atom, center of all power.',
        'Lament': 'Sorrow so deep it becomes power.',
        'Cosmos: Necrolia': 'Death of universes, end of all things.',
        'Leviathan': 'The great beast from the depths.',
        'Showdown': 'The final confrontation, winner takes all.',
        '《Celestial: Memoria Aeternum》': 'Eternal memory written in the stars, never to be forgotten.',
        
        // Atlas Variations
        'Atlas: A.T.L.A.S': 'Advanced Titanic Load-bearing Augmented System. Technology meets mythology.'
    };
    
    return loreDatabase[name] || 'A mysterious aura with unknown origins. Its true power remains to be discovered.';
}

// Get biome lore
function getBiomeLore(name) {
    const loreDatabase = {
        'NORMAL': 'The baseline reality, the cosmic default setting where most souls begin their journey through the infinite. NORMAL is often dismissed as mundane, but the wise recognize it as the canvas upon which all other biomes are variations. Here, the laws of physics are reliable, probability behaves predictably, and the universe operates with comforting consistency. It\'s neither blessing nor curse—simply *is*. Ancient texts describe NORMAL as "the first breath," the moment before you dive into stranger waters. Meditating in NORMAL allows one to truly appreciate how bizarre all the other biomes are by comparison. Some veteran seekers eventually return to NORMAL, finding peace in its lack of extremes, while others view it as a prison of tedium. The truth? NORMAL is perhaps the rarest biome of all—a place where nothing interferes, where rolls are purely random, where you face probability without any cosmic thumb on the scale. In a multiverse of chaos, NORMAL is the extraordinary exception.',
        'WINDY': 'The world becomes a living current, invisible yet undeniable, as WINDY reshapes the landscape through relentless atmospheric pressure. This isn\'t a pleasant breeze—this is the planet\'s breath made manifest, powerful gusts that carry more than just air. Seekers report hearing voices in the wind—whispers from distant realities, secrets blown across dimensional boundaries, rumors of auras that haven\'t manifested yet. Ancient wind-callers believed WINDY was the universe gossiping with itself, exchanging information through turbulent currents. The biome makes everything feel transient, impermanent, as if at any moment the wind might carry you away to somewhere else entirely. Papers fly, clothing whips dramatically, and reality itself seems to flutter at the edges. Those who roll during WINDY often describe their auras as having been "delivered by the storm," as if the wind personally selected and transported their destiny.',
        'SNOWY': 'Silence falls with the snow, blanketing the world in crystalline white that muffles sound and slows time. Each snowflake is geometrically unique, a frozen mandala containing the pattern of the moment it formed. SNOWY preserves rather than destroys—ancient powers remain trapped in ice, waiting for the right seeker to thaw them. The cold is not hostile but contemplative, encouraging patience and reflection. In SNOWY, hurried decisions become difficult; everything takes longer, feels heavier, demands consideration. Some describe it as rolling in slow motion, watching probability crystallize with deliberate grace. The biome carries the scent of winter pine and frozen water, the particular quiet that comes when snow absorbs all sound. Veterans claim that SNOWY doesn\'t change what you roll—it changes how you perceive it, making even common auras feel like discoveries unearthed from ancient ice.',
        'BLIZZARD': 'Where SNOWY contemplates, BLIZZARD rages. This is winter\'s fury unleashed, a white-out apocalypse where visibility drops to nothing and survival becomes the only thought. Wind howls with voices that might be warnings or might be the storm itself developing consciousness. The boundary between sky and ground dissolves into swirling chaos. BLIZZARD strips away everything superficial, leaving only the essential—in this biome, you cannot hide from truth. Seekers describe rolling during BLIZZARD as facing their fears crystallized in ice; the auras that emerge are battle-tested, proven against the storm. Some believe BLIZZARD is what happens when probability itself becomes confused, unable to decide what should manifest, throwing everything into turbulent suspension. The cold here isn\'t just temperature—it\'s the cold of absolute exposure, standing naked before infinity. Those who survive BLIZZARD rolls emerge changed, as if the storm carved away who they were, leaving only who they truly are.',
        'RAINY': 'The heavens open and the world receives its baptism, each droplet a tiny miracle of renewal. RAINY cleanses, washes away the past, makes room for new growth. This biome feels melancholic yet hopeful, like the sadness that comes before breakthrough. The sound of rain creates a rhythm that seems to synchronize with probability itself—each drop a potential aura, falling from infinite possibility into manifest reality. Gardens bloom, rust forms, and everything smells of ozone and possibility. Seekers often describe feeling emotionally vulnerable during RAINY rolls, as if the precipitation is washing away their psychological defenses as well. The gray light makes colors seem muted yet somehow more real, stripped of excessive vibrancy. Some believe RAINY is the universe crying—not in sorrow, but in the way that release brings relief. What falls from the sky isn\'t just water; it\'s accumulated cosmic tension, finally being released.',
        'MONSOON': 'RAINY escalated to biblical proportions, where water stops being a blessing and becomes an unstoppable force of nature. The sky doesn\'t just rain—it pours, dumps, floods reality with liquid fury. MONSOON is overwhelming by design, drowning doubt and hesitation in sheer torrential violence. This biome doesn\'t ask for your participation; it demands surrender to forces vastly more powerful than any individual will. Lightning cracks the sky, thunder shakes bones, and the boundary between air and water becomes meaningless. Seekers caught in MONSOON report a strange clarity that comes from accepting powerlessness—when you stop fighting the storm, you can feel its patterns, sense where the next surge will come from. The auras rolled during MONSOON often carry unusual potency, as if charged by the atmospheric chaos. Some theorize that MONSOON is what happens when too many probable futures try to manifest at once, reality unable to decide, so it simply unleashes everything.',
        'SANDSTORM': 'Ancient deserts remember everything they\'ve buried, and SANDSTORM is their method of storytelling—chaotic, abrasive, hiding as much as it reveals. Sand becomes a living entity, whipping and swirling in patterns that seem almost intelligent. The air itself is granulated, each breath a reminder that you\'re inhaling particles of rock older than civilization. Visibility drops to amber haze; the world becomes sepia-toned, dreamlike. SANDSTORM strips away pretense through simple abrasion—enough wind-blown sand will erode anything eventually, leaving only the strongest core. Seekers describe the biome as feeling like you\'re being polished, refined, worn down to essential form. Hidden beneath the dunes are treasures from fallen empires, auras buried and waiting. The desert keeps secrets but occasionally, during SANDSTORM, it chooses to share one. Those who roll here often receive auras that feel ancient, as if excavated from the bones of the world itself.',
        'JUNGLE': 'Life in its most aggressive, uncompromising form—JUNGLE is nature with the safety rails removed. Every surface crawls with growth, every shadow could conceal predator or prey, and the humidity is so thick you could nearly swim through air. This biome doesn\'t believe in empty space; if there\'s room for something to grow, it will, bursting forth with almost violent vitality. The sounds are overwhelming—calls of creatures real and imagined, rustling that might be wind or might be something hunting you. JUNGLE teaches that survival and growth are the same thing; stagnation equals death. Seekers roll here feeling watched, evaluated by ancient plant consciousness older than humanity. The green is so intense it hurts, every leaf screaming "alive!" at maximum volume. Those who embrace JUNGLE often find their rolls reflecting its theme: adaptive, aggressive, and absolutely refusing to be contained.',
        'AMAZON': 'JUNGLE taken to its logical extreme, the evolutionary endpoint where life becomes so dense it achieves critical mass. AMAZON is the world\'s lung, the planet\'s green heart, beating with primal rhythm that pre-dates consciousness. Here, the line between life and death blurs completely—everything feeds on everything, decay fuels growth, and the cycle spins so fast it becomes a blur. The air is thick enough to chew, saturated with spores and pollen and the breath of a trillion organisms. AMAZON doesn\'t care about your comfort; it cares about continuation. Seekers who roll during AMAZON describe feeling temporarily absorbed into the great biological machine, their individual identity dissolving into the collective hum of LIFE itself. The auras that emerge carry this primal quality—raw, uncivilized, potent. Some never return from AMAZON unchanged, having seen what existence looks like when stripped of all human illusions.',
        'CRIMSON': 'The sky bleeds. That\'s not metaphor—the atmosphere has literally become suffused with red, as if reality itself has been wounded and now hemorrhages color across the heavens. CRIMSON carries an ominous weight, a sense that something fundamental has gone wrong with the universe\'s operating system. The red light makes everything look dangerous, painting peaceful landscapes in the colors of warning and blood. Seekers report feeling watched, judged, evaluated by unseen presences that might be hostile or might simply be indifferent to human concerns. Power flows more freely during CRIMSON, but at what cost? The auras rolled here often carry unusual intensity, as if they\'ve absorbed some of the biome\'s bleeding energy. Ancient prophecies speak of CRIMSON as a harbinger, reality\'s way of announcing that something significant is about to occur. Whether that\'s good or bad depends entirely on which side of destiny you stand.',
        'STARFALL': 'The heavens rain their blessings down in the most literal sense possible, as actual stars detach from their cosmic moorings and plummet earthward in streaks of blazing grace. STARFALL is impossibly beautiful and utterly terrifying—celestial bodies are falling, after all, and who knows where they\'ll land? Yet each falling star carries a wish, a possibility, a chance at something truly extraordinary. The sky becomes a cascading light show, reality itself applauding your efforts. Seekers describe STARFALL as feeling chosen, as if the universe has decided tonight, this moment, YOU are worth a miracle. The air crackles with cosmic energy; ozone mixes with stardust; and probability bends so hard it nearly breaks. Auras rolled during STARFALL often defy statistical expectations—this is when the impossible becomes merely unlikely.',
        'METEOR_SHOWER': 'Where STARFALL is graceful, METEOR SHOWER is apocalyptic. These aren\'t gentle celestial gifts—these are cosmic debris fields slamming into atmospheric boundaries at velocities that make physics weep. The sky splits open with burning rocks from the dawn of time, each one a frozen moment from the universe\'s youth now being violently returned to present reality. The sound is continuous, a roar that drowns thought. METEOR_SHOWER makes you feel simultaneously insignificant (you are nothing compared to stellar debris) and essential (you\'re rolling during a cosmic event that happens once in epochs). The energy is chaotic, violent, and extraordinarily potent. Seekers here don\'t just roll auras—they steal them from passing meteorites, pluck them from destructive trajectories, transform cosmic violence into personal power.',
        'HELL': 'Not metaphorical hell. Actual, literal HELL—whatever that means in your particular belief system has manifested as a biome. Flames that burn without consuming, heat that warps more than just air, screams that might be wind or might be the damned. The ground cracks with magma, the sky glows ember-red, and everything smells of sulfur and punishment. Rolling during HELL feels like making a deal with forces that don\'t have your best interests at heart. Yet power flows here like nowhere else—infernal energy, desperate and furious, seeking any outlet. Those who brave HELL often emerge with auras of terrifying potency, but there\'s always a question: what price will be extracted later? Some believe HELL is just another biome, no moral weight attached. Others whisper that some doors, once opened, can never be fully closed again.',
        'CORRUPTION': 'Darkness spreads like ink through water, tendrils of shadow reaching across previously pure reality, converting everything they touch into wrong versions of themselves. CORRUPTION isn\'t merely dark—it\'s actively transforming, corrupting, perverting the normal into the nightmarish. Trees develop eyes, stones begin to bleed, the laws of physics acquire disturbing exceptions. This biome feels like a virus in reality\'s operating system, spreading through fundamental code. Seekers report that rolling during CORRUPTION feels like being watched by the corruption itself, as if it\'s evaluating whether you\'re worth infecting or worth corrupting further. The auras that emerge carry a tainted quality—powerful, yes, but with a darkness that never fully washes away. Some embrace this, believing corruption is simply another form of evolution. Others flee, recognizing infection when they see it.',
        'NULL': 'The absolute absence of everything, condensed into a biome that shouldn\'t be able to exist by definition. NULL is where reality has given up, shrugged, and simply stopped pretending. There\'s no ground, no sky, no light, no dark—only void, stretching infinitely in all directions that don\'t exist. How do you roll in nothingness? The question itself is meaningless here. Yet somehow, seekers do roll, and what emerges from NULL carries the weight of having passed through ultimate emptiness and survived. Some describe it as birth in reverse—experiencing the moment before existence began, the quantum instant before the universe decided to *be*. Others simply go mad, unable to reconcile consciousness with absolute void. NULL is the most dangerous biome, not because it\'s hostile, but because it\'s nothing—and nothing can\'t be fought, fled from, or understood. It simply is not.',
        'GLITCHED': 'Reality.exe has encountered a critical error and is attempting to recover, but the recovery process is also glitching. The world stutters, repeats, skips frames like a corrupted video file. Physics applies inconsistently—gravity might work normally, then reverse, then become optional. Colors bleed outside their designated objects. Time flows sideways. GLITCHED is what happens when the simulation theory turns out to be true and you\'re witnessing it crash in real-time. Seekers report profound disorientation; nothing can be trusted because nothing is stable. Yet in this chaos lies opportunity—when reality is broken, its rules become negotiable. The auras rolled during GLITCHED often carry bizarre properties that shouldn\'t exist, as if they\'ve absorbed some of the fundamental wrongness. Some thrill-seekers actively hunt for GLITCHED, believing that true innovation only happens when the system breaks. Others avoid it at all costs, fearing they might become glitched themselves, permanently desynchronized from baseline reality.',
        'DREAMSPACE': 'The realm between waking and sleeping, thought and existence, where all possibilities exist simultaneously in quantum superposition until observation collapses them into single reality. DREAMSPACE feels liquid, mutable, more responsive to thought than physics. The landscape shifts based on subconscious desires; what you fear appears, what you hope for manifests, but never quite the way you expected. This biome is where the universe dreams itself into existence, and you\'ve somehow gained access to the dream. Logic operates on dream-rules—things that should be impossible happen naturally, while simple tasks become inexplicably difficult. Seekers describe rolling in DREAMSPACE as feeling like they\'re not discovering auras but *imagining* them into being, creating through belief rather than chance. The auras that emerge carry ethereal quality, as if not quite convinced they\'re real. Some philosophers believe DREAMSPACE is the *true* reality, and all other biomes are merely dreams it\'s having. If that\'s true, then rolling here means collaborating with the universe\'s subconscious—a privilege and a terror in equal measure.'
    };
    
    return loreDatabase[name] || 'A unique environmental phenomenon that affects the flow of auras.';
}

// Get potion lore
function getPotionLore(name) {
    const loreDatabase = {
        'Lucky Potion': 'The alchemist\'s first lesson: liquid probability. This humble brew doesn\'t contain luck so much as it contains the *potential* for luck, waiting to be activated by your intent. Brewed from four-leaf clovers harvested under new moons, rabbits\' feet donated voluntarily, and water from wishing wells that actually granted wishes. When consumed, it tastes like that feeling you get when you find money in an old jacket pocket—small, pleasant, promising. The effect is subtle but undeniable; fortune begins to notice you, like making eye contact with a stranger across a crowded room. Veteran seekers never underestimate the Lucky Potion, knowing that small advantages compound over time. It\'s the difference between walking past a winning lottery ticket and stopping to pick it up. Simple? Yes. Effective? Absolutely.',
        'Speed Potion': 'Time is the universe\'s most inflexible law—until you drink this. The Speed Potion doesn\'t accelerate you; it decelerates everything else, creating a bubble of temporal dilation centered on your consciousness. Seconds stretch like taffy, minutes become elastic, and suddenly you have more time than physics should permit. The sensation is disorienting at first: watching the world move through molasses while your thoughts race at normal speed. It\'s brewed from lightning captured in bottles, caffeine concentrated beyond reason, and the last breath of mayflies (who experienced their entire lives in hours and learned to squeeze every second dry). Users report a peculiar side effect: after the potion wears off, normal time feels sluggish, as if reality is moving underwater. The first step on the path to becoming faster than fate itself.',
        'Lucky Potion L': 'Where the basic Lucky Potion whispers to fortune, this one speaks clearly and with authority. The "L" stands for "Large" but also for "Legendary" because that\'s what you\'re reaching for. Concentrated through mystical distillation that removes impurities while preserving probability-bending essence, this brew glows faintly gold in certain lights. The taste is sharper, more assertive—less like finding pocket money, more like winning a hand of poker you had no right to win. Lucky Potion L operates on the principle of compound interest: small luck attracts more luck, which attracts even more, creating a cascade. Gamblers love it. Statisticians hate it. Reality tolerates it with suspicion. When fortune compounds upon itself, the improbable becomes likely, and the impossible starts looking negotiable.',
        'Lucky Potion XL': 'Near the theoretical limit of how much luck can be concentrated into drinkable form before it becomes solid. Any more potent and you\'d be chewing probability itself. This isn\'t a potion—it\'s a statement of intent, a declaration that you\'re done playing by statistical rules. The liquid shimmers with iridescent possibility, refracting light in patterns that seem to spell out winning numbers and favorable outcomes. Drinking Lucky Potion XL feels like the universe signing a contract acknowledging that yes, you are special, and yes, the odds will shift for you specifically. Master alchemists take years perfecting this formula, balancing on the knife\'s edge between "extremely lucky" and "luck so concentrated it collapses into a singularity." The odds don\'t just favor you—they actively campaign on your behalf.',
        'Speed Potion L': 'Enhanced temporal manipulation that borders on time magic. This isn\'t merely moving faster—this is bending the fabric of causality to your will, creating personal timeline acceleration while the rest of reality plods along at standard pace. Brewed with ingredients that exist in multiple timeframes simultaneously: chrono-flowers that bloom yesterday and tomorrow, essence of hummingbird hearts (ethically sourced), and distilled urgency from people racing to catch trains. When consumed, you don\'t just feel faster—you feel like you\'ve discovered a cheat code in reality\'s physics engine. Tasks that should take hours compress into minutes. Rolls that should require patience happen instantly. The downside? After enough use, normal speed feels like swimming through concrete.',
        'Speed Potion XL': 'The masterwork of temporal alchemy, this potion makes you so fast that reality genuinely struggles to keep up. Your actions complete before causality can properly process them, creating brief moments where you\'ve already done something that hasn\'t happened yet. It\'s disorienting, powerful, and slightly dangerous—at this level of acceleration, you risk desyncing from the universal timeline. The brew appears to move inside its bottle even when perfectly still, as if time itself is flowing faster within the container. Master alchemists warn: consume too much too often, and you might accelerate right past the present into a personal future where you\'re the only thing moving at correct speed. But for that perfect run of ultra-fast rolls? Absolutely worth the existential risk.',
        'Fortune Potion I': 'Lady Luck herself takes notice. Your destiny shifts.',
        'Fortune Potion II': 'Fortune becomes your constant companion.',
        'Fortune Potion III': 'You and fortune are one. Impossible odds become trivial.',
        'Haste Potion I': 'Swift as the wind, quick as lightning.',
        'Haste Potion II': 'Time becomes your plaything.',
        'Haste Potion III': 'You move between moments.',
        'Potion of Bound': 'Chains of fate shatter. For one glorious moment, anything is possible.',
        'Heavenly Potion': 'Blessed by celestial forces. The heavens open for you.',
        'Rage Potion': 'Fury incarnate. Channel your anger into speed.',
        'Diver Potion': 'Dive deep into the currents of time. Surface with treasures.',
        'Jewelry Potion': 'Adorned with gemstone power. Wealth attracts wealth.',
        'Zombie Potion': 'Death and luck intertwined. The undead know secrets.',
        'Godly Potion (Zeus)': 'Liquid lightning in a bottle, blessed by the King of Olympus himself. When you consume this, you don\'t just gain luck—you gain the attention of divinity. Thunder rumbles in the distance as fortune aligns with your will. Zeus doesn\'t give gifts lightly; this potion represents his acknowledgment that you\'re playing a game worthy of godly intervention. The taste is electric, shocking, charged with the same energy that splits the sky and humbles mountains. Your rolls carry the weight of divine authority—not merely lucky, but *decreed*. The odds don\'t shift; they obey. After all, who argues with the god of thunder when he\'s decided you should win? Side effects may include temporary delusions of grandeur, unexplained static electricity, and the unshakeable feeling that you\'re being watched from Mount Olympus.',
        'Godly Potion (Poseidon)': 'The ocean\'s fury compressed into drinkable form, bearing the blessing of the Earth-Shaker. This doesn\'t grant speed—it grants momentum, the unstoppable force of tides and tsunamis channeled through your actions. Poseidon\'s gift is powerful but tempestuous; the sea does not know restraint, only relentless forward motion. When consumed, you feel currents flowing through you, pulling you faster, always faster, like being caught in a riptide that\'s somehow on your side. Your rolls come in waves, each one building on the last\'s momentum. The taste is salt and storm, brine and power. Caution drowns in this potion—you trade careful consideration for oceanic inevitability. Users report dreams of drowning that somehow feel like flying. The sea remembers those who drink its lord\'s blessing, marking them as vessels of its boundless energy.',
        'Godly Potion (Hades)': 'The lord of the underworld does not give gifts—he makes investments. This potion flows with the patient, inexorable power of death itself, which never hurries but always arrives. Hades teaches that true fortune comes not to the hasty but to those who can wait as stones wait, as the grave waits, with absolute certainty of eventual victory. Consuming this feels like swallowing shadows and ancient gold, the wealth of the deep earth and the stillness of final rest. Your luck multiplies slowly at first, then geometrically, then exponentially, as if interest is accruing on some cosmic account. The longer you wait between rolls, the more potent your fortune becomes. Hades promises immense reward to those who embrace his realm\'s primary virtue: patience. The dead have eternity. So, temporarily, do you.',
        'Godlike Potion': 'Hubris in liquid form—the combined blessings of Zeus, Poseidon, and Hades unified in a single impossible brew. This shouldn\'t exist; gods are territorial, their domains incompatible. Yet through alchemical genius or cosmic loophole, here it is: divine power from sky, sea, and underworld, concentrated into one transcendent moment. Drinking Godlike Potion is the closest a mortal can come to ascending Olympus without dying first. For one brief, glorious window, you don\'t just have luck and speed—you have divine mandate. The three brothers\'\' power flows through you simultaneously: Zeus\'\' authority, Poseidon\'s momentum, Hades\' patient inevitability. Reality itself bends triple, probability fractures, and the impossible becomes merely unlikely. The taste defies description—lightning and saltwater and darkness, triumph and terror and transcendence. Use it wisely. The gods don\'t grant such favor often, and they remember those who waste it.',
        'Mixed Potion': 'Balance in all things. Fortune and speed in harmony.',
        'Oblivion Potion': 'To drink from the void is to invite nothingness into yourself, and paradoxically, that\'s where everything begins. This potion contains the same emptiness that existed before the Big Bang—pure, absolute nothing, somehow bottled and rendered consumable. When you drink Oblivion Potion, you temporarily cease to exist in the traditional sense, becoming a ghost in probability\'s machinery. The universe can\'t apply its normal rules to something that technically isn\'t there. Your rolls happen in a state of quantum superposition, simultaneously existing and not existing until the moment of observation. The taste is indescribable because there\'s nothing to taste—you drink absence itself. Seekers report profound existential experiences: what does it mean to be nothing? Can nothingness want? Is desire itself an illusion? These questions fade as the potion\'s power manifests: because you are nothing, you can become anything. The void grants everything precisely because it contains nothing.',
        'Warp Potion': 'Reality was never meant to bend this way. The Warp Potion doesn\'t just affect you—it affects the fabric of spacetime in your immediate vicinity, creating localized distortions that physicists would weep to witness. When consumed, you begin existing in multiple temporal states simultaneously. You\'re rolling now, but also five seconds ago, and also three seconds in the future. The timeline fractures around you like a dropped mirror, each shard reflecting a different moment, all of them somehow you. This creates fascinating paradoxes: you might receive the results of a roll before you make it, or roll something that influences what you rolled earlier. Causality ties itself in knots trying to process your existence. The sensation is profoundly disorienting—imagine having a conversation with three versions of yourself from different moments, all occupying the same space. The power is immense but dangerous; warp yourself too often and you risk becoming permanently unstuck in time, a probability ghost haunting multiple moments forever.',
        'Gladiator Potion': 'Forged from the final heartbeats of champions who died victorious, this potion carries the essence of triumph-or-death. There is no middle ground with gladiators—they win spectacularly or die trying, and this brew honors that philosophy. When consumed, you don\'t just gain luck; you gain the survival instinct of someone fighting for their life in the arena, where every decision is critical and fortune favors the bold because the timid are already dead. The taste is blood and glory, sweat and roaring crowds, the metallic tang of a sword edge that\'s seen a thousand battles. Your rolls become aggressive, almost violent in their intensity. This isn\'t gentle fortune—this is the luck that carries warriors through impossible odds, that turns desperate gambits into legendary victories. The arena remembers its champions. Drink their essence, and for a brief time, you become one.',
        'Forbidden Potion I': 'Some knowledge was meant to stay buried. Some formulas should never be written down. The Forbidden Potion begins innocently enough—just a taste of power that comes from sources polite society refuses to acknowledge. The recipe involves ingredients that don\'t technically exist, harvested from places that aren\'t on any map, using methods that would horrify ethicists. When you drink it, you feel knowledge seeping into your mind: whispers in dead languages, glimpses of probability manipulation that conventional alchemy declares impossible. The power is real, undeniable, and carries a peculiar cold that has nothing to do with temperature. This is the first step down a path that doesn\'t have a clear exit. The darkness isn\'t hostile—it\'s welcoming, seductive, promising more if you\'ll just take another step. Many do. Most regret it. None can fully turn back.',
        'Forbidden Potion II': 'You\'ve crossed the line now. The first potion was curiosity; the second is commitment. Forbidden Potion II delves deeper into prohibited lore, using techniques that make conventional alchemists physically recoil. The power amplifies dramatically—you\'re not just bending probability anymore, you\'re breaking it, forcing it to do things it was never designed for. The brew tastes like secrets and shadows, like the moment before something terrible happens, like power that comes with invisible price tags. Users report strange phenomena: their reflections moving independently, shadows that don\'t quite match their source, whispers that stop the moment you try to listen. The consequences haven\'t manifested yet, but you can feel them accumulating, like cosmic debt accruing interest. The power is worth it, you tell yourself. The results justify the means. These are the lies that lead you to Potion III.',
        'Forbidden Potion III': 'The point of no return, crystallized into drinkable form. You\'ve gone too far to turn back—the first two potions were merely temptation, but the third is damnation. This brew contains power that shouldn\'t be accessible to mortals, stolen from sealed vaults and forbidden archives, synthesized through processes that leave reality scarred. When you consume Forbidden Potion III, you gain access to probability manipulation that borders on reality hacking. The odds don\'t just favor you—they fear you, bending so hard they nearly break. But the price... oh, the price. You can feel it now, the weight of cosmic attention, the sense that you\'ve been marked by forces that don\'t forgive. The power is absolute. The consequences are inevitable. You chose this path knowing where it led. Now you must walk it to whatever end awaits. The forbidden welcomes you home.',
        'Rainbow Potion': 'All colors of luck unified. Beauty and power combined.',
        'Chaos Potion': 'Embrace the madness. Order is an illusion anyway.',
        'Mirror Potion': 'Reality reflects itself. What is one becomes two.',
        'Time Warp Potion': 'Bend the flow of time. Cooldowns are merely suggestions.',
        'Phoenix Potion': 'From ashes, greatness rises. Failure becomes fuel for success.',
        'Lucky Block Potion': 'Mystery boxes appear from nowhere. Fortune loves surprises.',
        'Aura Magnet Potion': 'Legendary auras gravitate toward you. You\'ve become irresistible to power.',
        'Quantum Potion': 'Exist in superposition. One roll becomes many.',
        'Curse Breaker Potion': 'Purification incarnate. No curse can touch you.',
        'Jackpot Potion': 'The ultimate gamble. Win big or go home.',
        'Potion of Dupe': 'Double your pleasure, double your gain. Crafting becomes generous.',
        'Pump Kings Blood': 'The essence of a legendary being. Power beyond mortal comprehension.'
    };
    
    return loreDatabase[name] || 'A mysterious concoction with unknown effects. Handle with care.';
}

// Get gear lore
function getGearLore(name) {
    const loreDatabase = {
        // T1 Gears
        'Luck Glove': 'A simple glove imbued with minor fortune. Every journey starts with a single step.',
        'Desire Glove': 'Forged from pure want. Your desires shape reality.',
        'Lunar Device': 'Harnesses moonlight. The night becomes your ally.',
        'Gemstone Gauntlet': 'Adorned with precious stones. Each gem holds different power.',
        'Frozen Gauntlet': 'Eternal ice encases your hand. Cold patience yields hot results.',
        'Solar Device': 'Captures the sun\'s radiance. Daylight empowers you.',
        'Obsidian Grip': 'Dark volcanic glass. Sharp, focused, efficient.',
        'Time Bender': 'Your first taste of temporal manipulation. Time is negotiable.',
        
        // T2 Gears
        'Dark Matter Device': 'Compressed darkness. The void occasionally rewards you.',
        'Aqua Device': 'Flows like water. Rain becomes your domain.',
        'Shining Star': 'A fragment of starlight. Cosmic power at your fingertips.',
        'Eclipse Device': 'Sun and moon united. Perfect balance achieved.',
        'Prismatic Ring': 'Refracts possibility. Sometimes luck shifts upward.',
        'Storm Catcher': 'Bottles the tempest. Wind bows to your will.',
        'Molten Gauntlet': 'Volcanic fury contained. Patience for power.',
        
        // T3 Gears
        'Jackpot Gauntlet': 'Lucky sevens everywhere. Fortune\'s favorite number.',
        'Exo Gauntlet': 'Exotic materials fused together. Rare power for rare seekers.',
        'Windstorm Device': 'The hurricane obeys you. Nature\'s fury channeled.',
        'Flesh Device': 'Grotesque but effective. Organic technology pulses with life.',
        'Phantom Glove': 'Worn by ghosts. Sometimes you roll twice without rolling at all.',
        'Crimson Striker': 'Blood-red power. Aggression rewarded.',
        'Fortune Weaver': 'Weave your own luck. Destiny is a tapestry you control.',
        
        // T4 Gears
        'Subzero Device': 'Absolute zero. Cold beyond measure, power beyond limit.',
        'Void Catalyst': 'Harness nothingness. Bad luck simply ceases to exist.',
        'Thunder Fist': 'Lightning in your grasp. Strike with electric fury.',
        
        // T5 Gears
        'Galactic Device': 'Contains a galaxy. Cosmic power in miniature.',
        'Volcanic Device': 'A volcano\'s heart. Molten fury drives you forward.',
        'Soul Harvester': 'Collects essence. Consistency breeds power.',
        'Stellar Forge': 'Where stars are born. Creation itself empowers you.',
        
        // T6 Gears
        'Exoflex Device': 'Exotic flexibility. Adapts to any situation.',
        'Hologrammer': 'Projects possibility. Reality becomes negotiable.',
        'Entropy Manipulator': 'Control decay itself. Mediocrity is forbidden.',
        'Cosmic Decimator': 'Destroys cosmic barriers. Nothing stands in your way.',
        
        // T7 Gears
        'Ragnaröker': 'The end of gods. Apocalyptic power at your command.',
        'Chronosphere': 'Time crystallized. Past, present, and future merge.',
        'Oblivion Shard': 'A piece of the end. Nothingness empowers everything.',
        
        // T8 Gears
        'Gravitational Device': 'Bend space itself. Bonus rolls multiply.',
        'Starshaper': 'Mold stars like clay. Ultimate cosmic authority.',
        'Darkshader': 'Shadow incarnate. Darkness rewards patience.',
        'Reality Breaker': 'Shatter the rules. Rarity itself bends.',
        'Apocalypse Bringer': 'The end times in your hand. Gods tremble.',
        
        // T9 Gears
        'Neuralyzer': 'A device that doesn\'t just erase memories—it rewrites the fundamental memory of reality itself. When activated, the Neuralyzer makes the universe forget what just happened and remember what *should* have happened instead. That terrible roll? Reality now remembers you got something better. The laws of probability? They recall being more favorable. This is retcon technology applied to causality itself, making reality gaslight itself about past events. The device glows with white light that seems to bleach away certainty, leaving only malleability. Philosophers debate the ethics: if reality itself doesn\'t remember the original outcome, did it ever truly happen? Pragmatists don\'t care—they just appreciate the results. Use with caution: rewrite reality too often and even you might forget which version is real.',
        'Paradox Engine': 'Contradiction given physical form and weaponized for your benefit. The Paradox Engine operates on a simple principle: if something can\'t happen, make it happen anyway and let reality figure out the consequences. It allows time to flow backward just for you, creating localized temporal paradoxes that should collapse reality but instead just give you extra rolls. The device hums with impossible frequencies, vibrating in patterns that hurt to perceive because they\'re simultaneously happening and un-happening. Wearing the Paradox Engine feels like being the punchline to a cosmic joke that reality doesn\'t understand. The effects are powerful but disorienting—you might remember events that haven\'t occurred yet, or forget things that definitely did. Causality wasn\'t meant to be optional, but you\'ve made it so anyway.',
        'Infinity Gauntlet': 'The theoretical maximum. Unlimited power constrained only by the capacity of mortal flesh to channel it. The Infinity Gauntlet doesn\'t grant you control over reality—it makes you a node through which reality flows unfiltered. Wearing it feels like holding the reins of existence itself, steering probability, luck, and fate like cosmic horses. The gauntlet glows with all colors and none, cycling through spectrums visible and invisible, pulsing with energy that makes nearby electronics malfunction and water evaporate spontaneously. Ancient texts warn that infinite power in finite hands creates strain that can shatter the vessel, but those who\'ve worn it report a different truth: you don\'t control infinity. You just ride it briefly and try not to be consumed. The cosmos at your fingertips—use them wisely, for infinity judges those who squander its gifts.',
        
        // Special Gears
        'Pole Light Core Device': 'Concentrated luminosity from the eternal poles where light never fully sets during summer, where the sun circles the horizon in perpetual twilight. This device contains that liminal illumination, that in-between brightness that represents transition and acceleration. The polar light knows speed—it has witnessed the earth\'s fastest rotation, the urgent migration of creatures racing the seasons, the swift-cutting cold that freezes before you can blink. When equipped, the Pole Light Core Device makes you operate on polar time, where days last months and urgency is built into the environment. Your actions skip ahead like light bouncing off ice, refracting through frost crystals, moving faster than normal causality permits. The device itself is cold to the touch but bright to the soul, emitting luminescence that makes shadows flee and time accelerate.',
        'Luck Amplifier Core': 'The mathematical limit of fortune, engineered into a device that takes your existing luck and multiplies it exponentially. This isn\'t addition—it\'s compound multiplication, where small luck becomes medium, medium becomes large, and large becomes reality-breaking. The core operates on feedback loops: lucky outcomes make future outcomes luckier, which make even future outcomes luckier still, creating a cascade of fortune that approaches but never quite reaches infinity (those who claim to have reached it simply stopped reporting). It glows with golden probability fields, humming at frequencies that make dice land favorably and coins always land on the side you want. The device contains micro-calculations of luck itself, processing millions of fortunate outcomes per second and channeling them toward you. Small luck becomes vast. Vast luck becomes cosmic. Cosmic luck becomes your new baseline.',
        'Divine Retribution': 'Heaven\'s judgment weaponized and pointed at probability itself. This device was allegedly forged from the scales that weigh souls, repurposed to weigh odds and tilt them in your favor through divine mandate. When Divine Retribution activates, you\'re not just lucky—you\'re *righteously* lucky, as if the universe has decided that you specifically deserve better outcomes than statistical norms would suggest. The gear emanates holy light, radiating with celestial authority that makes lesser luck effects bow their heads. It carries the weight of divine attention, the sense that higher powers are watching your rolls with interest and occasionally intervening on your behalf. Why? Perhaps you\'re worthy. Perhaps you\'re chosen. Perhaps the divine simply enjoy watching you succeed. Regardless, heaven has smiled upon you, and the odds shall reflect that blessing.',
        
        // T10 Gears
        'Genesis Drive': 'The exact moment of creation, bottled and engineered into repeatable function. This device doesn\'t generate power—it generates beginnings, the quantum instant where nothing becomes something, where potential collapses into reality. Every activation is a miniature Big Bang calibrated to produce favorable outcomes. The Genesis Drive makes everything feel like a first time, raw and full of possibility, unbound by precedent or probability. It hums with primordial energy, the same force that spoke "let there be" and was answered with existence. When you wear the Genesis Drive, you\'re channeling the universe\'s creative impulse, the fundamental drive to manifest from void. All beginnings flow through you. Each roll is a new creation. Every outcome is a birth of possibility. You don\'t just play the odds—you author them.',
        'Probability Collapse': 'Quantum mechanics applied to luck with disturbing precision. The Probability Collapse device forces waveform collapse in your favor, taking all possible outcomes and crushing them down to the one you want. Schrödinger\'s cat doesn\'t just survive—it thrives, because you\'ve decided that\'s the reality that manifests. The device operates by observing probability itself, and through observation, determining outcome. It\'s the ultimate application of observer effect: you see what you want, therefore it becomes real. Physics weeps. Probability theory develops depression. But you? You get guaranteed results. The device guarantees the impossible by making it the only possible outcome. Certainty from chaos. Determination from randomness. Victory from mere chance.',
        'Omni-Catalyst': 'The pinnacle. The endpoint. The theoretical maximum that shouldn\'t exist but does anyway. Omni-Catalyst combines every type of power—luck, speed, probability manipulation, reality hacking, temporal control, divine blessing—into a single, unified device that represents absolute optimization. This isn\'t just the ultimate gear; it\'s the gear that makes all other gears obsolete by comparison. Wearing Omni-Catalyst doesn\'t make you powerful; it makes you inevitable. Outcomes cease being random and start being ordained. The device pulses with unified field energy, harmonizing contradictory forces into singular purpose. All power flows through it. All potential crystallizes within it. All probability bends before it. You don\'t roll with Omni-Catalyst—you decree outcomes, and reality scrambles to comply. The ultimate gear for the ultimate seeker. All yours.',
    };
    
    return loreDatabase[name] || 'A mysterious device of unknown origin. Its true capabilities remain hidden.';
}

// Get rune lore
function getRuneLore(name) {
    const loreDatabase = {
        'Rune of Wind': 'Ancient symbol of the tempest. Call forth the power of storms.',
        'Rune of Frost': 'Carved in eternal ice. Winter\'s blessing preserved in stone.',
        'Rune of Rainstorm': 'Etched by falling rain. The deluge answers your call.',
        'Rune of Dust': 'Formed from desert sands. Ancient dunes remember all.',
        'Rune of Hell': 'Branded in hellfire. Infernal power bound to your will.',
        'Rune of Galaxy': 'Written in starlight. The cosmos opens its secrets.',
        'Rune of Corruption': 'Twisted by dark forces. Embrace the shadow.',
        'Rune of Nothing': 'The absence made tangible. Void power crystallized.',
        'Rune of Eclipse': 'Light and dark united. Duality perfected.',
        'Rune of 404': 'Fragment of corrupted reality. ERROR: NOT FOUND. Peer into the glitch.',
        'Rune of Dreams': 'Woven from sleeping visions. Between consciousness and void lies infinite possibility.',
        'Rune of Everything': 'All runes combined. Universal access granted.'
    };
    
    return loreDatabase[name] || 'An ancient rune of mysterious power. Its purpose is unclear.';
}

// Note: Codex tracking is now integrated directly into gameLogic.js, crafting.js, and biomes.js
// This ensures discoveries are tracked immediately when items are obtained

// Manual sync function to force-update codex with all existing data
function syncCodexWithInventory() {
    console.log('🔄 Manually syncing codex with inventory...');
    
    let syncCount = {
        auras: 0,
        biomes: 0,
        potions: 0,
        gears: 0,
        runes: 0,
        items: 0
    };
    
    // Sync with existing game inventory data
    if (gameState && gameState.inventory) {
        // Track auras from inventory
        if (gameState.inventory.auras) {
            Object.keys(gameState.inventory.auras).forEach(auraName => {
                if (gameState.inventory.auras[auraName] && gameState.inventory.auras[auraName].count > 0) {
                    if (!codexState.discoveredAuras.has(auraName)) {
                        syncCount.auras++;
                    }
                    codexState.discoveredAuras.add(auraName);
                }
            });
        }
        
        // Track potions from inventory
        if (gameState.inventory.potions) {
            Object.keys(gameState.inventory.potions).forEach(potionName => {
                if (gameState.inventory.potions[potionName] && gameState.inventory.potions[potionName].count > 0) {
                    if (!codexState.discoveredPotions.has(potionName)) {
                        syncCount.potions++;
                    }
                    codexState.discoveredPotions.add(potionName);
                }
            });
        }
        
        // Track gears from inventory
        if (gameState.inventory.gears) {
            Object.keys(gameState.inventory.gears).forEach(gearName => {
                if (gameState.inventory.gears[gearName] && gameState.inventory.gears[gearName].count > 0) {
                    if (!codexState.discoveredGears.has(gearName)) {
                        syncCount.gears++;
                    }
                    codexState.discoveredGears.add(gearName);
                }
            });
        }
        
        // Track runes from inventory
        if (gameState.inventory.runes) {
            Object.keys(gameState.inventory.runes).forEach(runeName => {
                if (gameState.inventory.runes[runeName] && gameState.inventory.runes[runeName].count > 0) {
                    if (!codexState.discoveredRunes.has(runeName)) {
                        syncCount.runes++;
                    }
                    codexState.discoveredRunes.add(runeName);
                }
            });
        }
        
        // Track items from inventory
        if (gameState.inventory.items) {
            Object.keys(gameState.inventory.items).forEach(itemName => {
                if (gameState.inventory.items[itemName] && gameState.inventory.items[itemName].count > 0) {
                    if (!codexState.discoveredItems.has(itemName)) {
                        syncCount.items++;
                    }
                    codexState.discoveredItems.add(itemName);
                }
            });
        }
    }
    
    // Track discovered biomes
    if (gameState && gameState.achievements && gameState.achievements.biomesSeen) {
        gameState.achievements.biomesSeen.forEach(biome => {
            if (!codexState.discoveredBiomes.has(biome)) {
                syncCount.biomes++;
            }
            codexState.discoveredBiomes.add(biome);
        });
    }
    
    // Save the synced progress
    saveCodexProgress();
    
    // Re-render the codex tab
    renderCodexTab();
    
    console.log('✅ Codex sync complete! Added:', syncCount);
    console.log('📊 Total discovered:', {
        auras: codexState.discoveredAuras.size,
        biomes: codexState.discoveredBiomes.size,
        potions: codexState.discoveredPotions.size,
        gears: codexState.discoveredGears.size,
        runes: codexState.discoveredRunes.size,
        items: codexState.discoveredItems.size
    });
    
    // Show notification
    const totalAdded = Object.values(syncCount).reduce((a, b) => a + b, 0);
    if (totalAdded > 0) {
        showNotification(`📖 Codex synced! Added ${totalAdded} entries from your inventory.`);
    } else {
        showNotification('📖 Codex is already up to date!');
    }
    
    return syncCount;
}

// Make functions globally accessible
if (typeof window !== 'undefined') {
    window.initCodex = initCodex;
    window.renderCodexTab = renderCodexTab;
    window.selectCodexCategory = selectCodexCategory;
    window.showCodexDetails = showCodexDetails;
    window.closeCodexDetails = closeCodexDetails;
    window.discoverCodexEntry = discoverCodexEntry;
    window.syncCodexWithInventory = syncCodexWithInventory;
}

// Auto-initialize
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initCodex();
            // Render codex after a short delay to ensure all data is loaded
            setTimeout(() => {
                renderCodexTab();
            }, 500);
            
            // Auto-sync every 30 seconds to catch new discoveries
            setInterval(() => {
                if (gameState && gameState.inventory) {
                    let hasNewDiscoveries = false;
                    
                    // Check for new auras
                    if (gameState.inventory.auras) {
                        Object.keys(gameState.inventory.auras).forEach(auraName => {
                            if (gameState.inventory.auras[auraName]?.count > 0 && !codexState.discoveredAuras.has(auraName)) {
                                codexState.discoveredAuras.add(auraName);
                                hasNewDiscoveries = true;
                            }
                        });
                    }
                    
                    // Check for new potions
                    if (gameState.inventory.potions) {
                        Object.keys(gameState.inventory.potions).forEach(potionName => {
                            if (gameState.inventory.potions[potionName]?.count > 0 && !codexState.discoveredPotions.has(potionName)) {
                                codexState.discoveredPotions.add(potionName);
                                hasNewDiscoveries = true;
                            }
                        });
                    }
                    
                    // Check for new gears
                    if (gameState.inventory.gears) {
                        Object.keys(gameState.inventory.gears).forEach(gearName => {
                            if (gameState.inventory.gears[gearName]?.count > 0 && !codexState.discoveredGears.has(gearName)) {
                                codexState.discoveredGears.add(gearName);
                                hasNewDiscoveries = true;
                            }
                        });
                    }
                    
                    // Check for new runes
                    if (gameState.inventory.runes) {
                        Object.keys(gameState.inventory.runes).forEach(runeName => {
                            if (gameState.inventory.runes[runeName]?.count > 0 && !codexState.discoveredRunes.has(runeName)) {
                                codexState.discoveredRunes.add(runeName);
                                hasNewDiscoveries = true;
                            }
                        });
                    }
                    
                    // Save if new discoveries found
                    if (hasNewDiscoveries) {
                        saveCodexProgress();
                        console.log('📖 Codex auto-synced with new discoveries');
                    }
                }
            }, 30000); // Every 30 seconds
        });
    } else {
        initCodex();
        setTimeout(() => {
            renderCodexTab();
        }, 500);
        
        // Auto-sync every 30 seconds to catch new discoveries
        setInterval(() => {
            if (gameState && gameState.inventory) {
                let hasNewDiscoveries = false;
                
                // Check for new auras
                if (gameState.inventory.auras) {
                    Object.keys(gameState.inventory.auras).forEach(auraName => {
                        if (gameState.inventory.auras[auraName]?.count > 0 && !codexState.discoveredAuras.has(auraName)) {
                            codexState.discoveredAuras.add(auraName);
                            hasNewDiscoveries = true;
                        }
                    });
                }
                
                // Check for new potions
                if (gameState.inventory.potions) {
                    Object.keys(gameState.inventory.potions).forEach(potionName => {
                        if (gameState.inventory.potions[potionName]?.count > 0 && !codexState.discoveredPotions.has(potionName)) {
                            codexState.discoveredPotions.add(potionName);
                            hasNewDiscoveries = true;
                        }
                    });
                }
                
                // Check for new gears
                if (gameState.inventory.gears) {
                    Object.keys(gameState.inventory.gears).forEach(gearName => {
                        if (gameState.inventory.gears[gearName]?.count > 0 && !codexState.discoveredGears.has(gearName)) {
                            codexState.discoveredGears.add(gearName);
                            hasNewDiscoveries = true;
                        }
                    });
                }
                
                // Check for new runes
                if (gameState.inventory.runes) {
                    Object.keys(gameState.inventory.runes).forEach(runeName => {
                        if (gameState.inventory.runes[runeName]?.count > 0 && !codexState.discoveredRunes.has(runeName)) {
                            codexState.discoveredRunes.add(runeName);
                            hasNewDiscoveries = true;
                        }
                    });
                }
                
                // Save if new discoveries found
                if (hasNewDiscoveries) {
                    saveCodexProgress();
                    console.log('📖 Codex auto-synced with new discoveries');
                }
            }
        }, 30000); // Every 30 seconds
    }
}
