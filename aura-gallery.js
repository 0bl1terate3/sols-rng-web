// =================================================================
// AURA GALLERY / SHOWCASE SYSTEM
// =================================================================
// 3D viewer for collected auras with rotation, zoom, and stats

// Initialize gallery system
if (!window.gameState.gallerySystem) {
    window.gameState.gallerySystem = {
        favorites: [],
        viewHistory: [],
        totalViews: 0,
        unlockedFeatures: {
            rotation: true,
            zoom: false, // Unlock at 50 auras
            filters: false, // Unlock at 100 auras
            animations: false // Unlock at 200 auras
        }
    };
}

let galleryViewer = {
    scene: null,
    camera: null,
    renderer: null,
    currentAura: null,
    rotationSpeed: 0.01,
    autoRotate: true,
    zoom: 1
};

// Check feature unlocks
function checkGalleryUnlocks() {
    const auraCount = Object.keys(window.gameState.inventory.auras).length;
    const system = window.gameState.gallerySystem;
    
    if (!system.unlockedFeatures.zoom && auraCount >= 50) {
        system.unlockedFeatures.zoom = true;
        showNotification('🔓 Gallery: Zoom unlocked!', 'success');
    }
    if (!system.unlockedFeatures.filters && auraCount >= 100) {
        system.unlockedFeatures.filters = true;
        showNotification('🔓 Gallery: Filters unlocked!', 'success');
    }
    if (!system.unlockedFeatures.animations && auraCount >= 200) {
        system.unlockedFeatures.animations = true;
        showNotification('🔓 Gallery: Animations unlocked!', 'success');
    }
}

// Open aura gallery
window.openAuraGallery = function() {
    const modal = document.getElementById('galleryModal');
    const content = document.getElementById('galleryContent');
    
    checkGalleryUnlocks();
    
    content.innerHTML = `
        <div class="gallery-container">
            <div class="gallery-sidebar">
                <h2 class="gallery-title">🎨 Aura Gallery</h2>
                
                <div class="gallery-search">
                    <input type="text" id="gallerySearch" placeholder="Search auras..." class="gallery-search-input">
                </div>
                
                <div class="gallery-filters">
                    <select id="galleryTierFilter" class="gallery-filter-select" ${!window.gameState.gallerySystem.unlockedFeatures.filters ? 'disabled' : ''}>
                        <option value="all">All Tiers</option>
                        <option value="common">Common</option>
                        <option value="rare">Rare</option>
                        <option value="epic">Epic</option>
                        <option value="legendary">Legendary</option>
                        <option value="mythic">Mythic</option>
                        <option value="exotic">Exotic</option>
                        <option value="divine">Divine</option>
                        <option value="transcendent">Transcendent</option>
                    </select>
                    
                    <label class="gallery-checkbox">
                        <input type="checkbox" id="galleryShowOnlyOwned" checked>
                        <span>Only Owned</span>
                    </label>
                    
                    <label class="gallery-checkbox">
                        <input type="checkbox" id="galleryShowFavoritesOnly">
                        <span>⭐ Favorites Only</span>
                    </label>
                </div>
                
                <div id="galleryAuraList" class="gallery-aura-list"></div>
            </div>
            
            <div class="gallery-viewer">
                <div class="gallery-viewer-header">
                    <h3 id="galleryAuraName">Select an Aura</h3>
                    <button onclick="closeGallery()" class="gallery-close-btn">✕</button>
                </div>
                
                <div id="galleryCanvas" class="gallery-canvas">
                    <div class="gallery-placeholder">
                        <div class="gallery-placeholder-icon">✨</div>
                        <div class="gallery-placeholder-text">Select an aura to view</div>
                    </div>
                </div>
                
                <div id="galleryStats" class="gallery-stats"></div>
                
                <div class="gallery-controls">
                    <button onclick="toggleAutoRotate()" class="gallery-control-btn" id="rotateBtn">
                        🔄 Auto Rotate: ON
                    </button>
                    <button onclick="resetCamera()" class="gallery-control-btn">
                        📷 Reset View
                    </button>
                    <button onclick="toggleFavorite()" class="gallery-control-btn" id="favoriteBtn">
                        ⭐ Favorite
                    </button>
                    <button onclick="playCutscene()" class="gallery-control-btn" id="cutsceneBtn">
                        🎬 View Cutscene
                    </button>
                    <button onclick="shareAura()" class="gallery-control-btn">
                        📸 Screenshot
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    updateGalleryAuraList();
    setupGalleryListeners();
};

// Update aura list in gallery
function updateGalleryAuraList() {
    const container = document.getElementById('galleryAuraList');
    if (!container) return;
    
    const search = document.getElementById('gallerySearch')?.value.toLowerCase() || '';
    const tierFilter = document.getElementById('galleryTierFilter')?.value || 'all';
    const showOnlyOwned = document.getElementById('galleryShowOnlyOwned')?.checked ?? true;
    const showFavoritesOnly = document.getElementById('galleryShowFavoritesOnly')?.checked ?? false;
    
    let auras = window.AURAS || [];
    
    // Filter
    auras = auras.filter(aura => {
        if (search && !aura.name.toLowerCase().includes(search)) return false;
        if (tierFilter !== 'all' && aura.tier !== tierFilter) return false;
        if (showOnlyOwned && (!window.gameState.inventory.auras[aura.name] || window.gameState.inventory.auras[aura.name].count === 0)) return false;
        if (showFavoritesOnly && !window.gameState.gallerySystem.favorites.includes(aura.name)) return false;
        return true;
    });
    
    // Sort by rarity
    auras.sort((a, b) => b.rarity - a.rarity);
    
    container.innerHTML = '';
    
    if (auras.length === 0) {
        container.innerHTML = '<div class="gallery-empty">No auras found</div>';
        return;
    }
    
    auras.forEach(aura => {
        const owned = window.gameState.inventory.auras[aura.name]?.count > 0;
        const isFavorite = window.gameState.gallerySystem.favorites.includes(aura.name);
        
        const item = document.createElement('div');
        item.className = `gallery-aura-item ${!owned ? 'locked' : ''}`;
        item.innerHTML = `
            <div class="gallery-aura-icon" style="background: ${getAuraColor(aura.name)};">
                ${isFavorite ? '<span class="gallery-favorite-badge">⭐</span>' : ''}
                ${aura.name.substring(0, 2)}
            </div>
            <div class="gallery-aura-info">
                <div class="gallery-aura-item-name">${aura.name}</div>
                <div class="gallery-aura-item-rarity">1:${aura.rarity.toLocaleString()}</div>
                ${owned ? `<div class="gallery-aura-item-count">x${window.gameState.inventory.auras[aura.name].count}</div>` : ''}
            </div>
        `;
        
        if (owned) {
            item.onclick = () => viewAura(aura);
        }
        
        container.appendChild(item);
    });
}

// View aura in 3D viewer
function viewAura(aura) {
    galleryViewer.currentAura = aura;
    
    // Update header
    document.getElementById('galleryAuraName').textContent = aura.name;
    
    // Update stats
    const stats = document.getElementById('galleryStats');
    const owned = window.gameState.inventory.auras[aura.name];
    const isFavorite = window.gameState.gallerySystem.favorites.includes(aura.name);
    
    stats.innerHTML = `
        <div class="gallery-stat-grid">
            <div class="gallery-stat">
                <span class="gallery-stat-label">Rarity</span>
                <span class="gallery-stat-value">1:${aura.rarity.toLocaleString()}</span>
            </div>
            <div class="gallery-stat">
                <span class="gallery-stat-label">Tier</span>
                <span class="gallery-stat-value">${aura.tier}</span>
            </div>
            <div class="gallery-stat">
                <span class="gallery-stat-label">Owned</span>
                <span class="gallery-stat-value">${owned?.count || 0}</span>
            </div>
            <div class="gallery-stat">
                <span class="gallery-stat-label">First Roll</span>
                <span class="gallery-stat-value">${owned?.rollHistory?.[0] ? new Date(owned.rollHistory[0].timestamp).toLocaleDateString() : 'Never'}</span>
            </div>
        </div>
        
        <div class="gallery-description">
            ${getAuraDescription(aura)}
        </div>
    `;
    
    // Update favorite button
    document.getElementById('favoriteBtn').textContent = isFavorite ? '⭐ Favorited' : '☆ Favorite';
    
    // Render 3D view
    render3DAura(aura);
    
    // Track view
    window.gameState.gallerySystem.totalViews++;
    window.gameState.gallerySystem.viewHistory.push({
        auraName: aura.name,
        timestamp: Date.now()
    });
    
    // Keep only last 50 views
    if (window.gameState.gallerySystem.viewHistory.length > 50) {
        window.gameState.gallerySystem.viewHistory.shift();
    }
    
    saveGameState();
}

// Render 3D aura (simplified - creates a colored sphere with glow)
function render3DAura(aura) {
    const canvas = document.getElementById('galleryCanvas');
    if (!canvas) return;
    
    const color = getAuraColor(aura.name);
    
    canvas.innerHTML = `
        <div class="aura-3d-display" style="
            background: radial-gradient(circle, ${color}40, transparent);
            animation: auraFloat 3s ease-in-out infinite;
        ">
            <div class="aura-sphere" style="
                background: radial-gradient(circle, ${color}, ${color}80);
                box-shadow: 0 0 60px ${color}, 0 0 100px ${color}60, inset 0 0 40px ${color}40;
                animation: ${galleryViewer.autoRotate ? 'auraRotate 20s linear infinite' : 'none'};
            "></div>
            <div class="aura-particles" style="--aura-color: ${color};"></div>
        </div>
    `;
}

// Get aura description
function getAuraDescription(aura) {
    const descriptions = {
        'common': 'A common aura found throughout the world.',
        'rare': 'A rare aura with special properties.',
        'epic': 'An epic aura pulsing with power.',
        'legendary': 'A legendary aura of immense strength.',
        'mythic': 'A mythic aura that defies understanding.',
        'exotic': 'An exotic aura from beyond reality.',
        'divine': 'A divine aura touched by the gods.',
        'transcendent': 'A transcendent aura beyond mortal comprehension.'
    };
    
    return descriptions[aura.tier] || 'A mysterious aura.';
}

// Toggle auto rotate
window.toggleAutoRotate = function() {
    galleryViewer.autoRotate = !galleryViewer.autoRotate;
    document.getElementById('rotateBtn').textContent = `🔄 Auto Rotate: ${galleryViewer.autoRotate ? 'ON' : 'OFF'}`;
    
    if (galleryViewer.currentAura) {
        render3DAura(galleryViewer.currentAura);
    }
};

// Reset camera
window.resetCamera = function() {
    galleryViewer.zoom = 1;
    if (galleryViewer.currentAura) {
        render3DAura(galleryViewer.currentAura);
    }
};

// Toggle favorite
window.toggleFavorite = function() {
    if (!galleryViewer.currentAura) return;
    
    const auraName = galleryViewer.currentAura.name;
    const favorites = window.gameState.gallerySystem.favorites;
    const index = favorites.indexOf(auraName);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification(`☆ Removed from favorites`, 'info');
    } else {
        favorites.push(auraName);
        showNotification(`⭐ Added to favorites`, 'success');
    }
    
    viewAura(galleryViewer.currentAura);
    updateGalleryAuraList();
    saveGameState();
};

// Play cutscene
window.playCutscene = function() {
    if (!galleryViewer.currentAura) return;
    
    const aura = galleryViewer.currentAura;
    closeGallery();
    
    // Map of aura names to cutscene functions (from gameLogic.js)
    const cutsceneFunctions = {
        "Abyssal Hunter": window.playAbyssalHunterCutscene,
        "Overture: History": window.playOvertureHistoryCutscene,
        "Overture: Future": window.playOvertureFutureCutscene,
        "Gargantua": window.playGargantuaCutscene,
        "Chromatic: Genesis": window.playChromaticGenesisCutscene,
        "Chromatic: Exotic": window.playChromaticExoticCutscene,
        "Archangel": window.playArchangelsCutscene,
        "Archangel: Seraphim": window.playArchangelSeraphimCutscene,
        "『E Q U I N O X』": window.playEquinoxCutscene,
        "Luminosity": window.playLuminosityCutscene,
        "Dreammetric": window.playDreammetricCutscene,
        "Aegis": window.playAegisCutscene,
        "Aegis - Watergun": window.playAegisWatergunCutscene,
        "Aviator: Fleet": window.playAviatorFleetCutscene,
        "Apostolos": window.playApostolosCutscene,
        "Oblivion": window.playOblivionCutscene,
        "Abomination": window.playAbominationCutscene,
        "Memory: The Fallen": window.playMemoryCutscene,
        "Oppression": window.playOppressionCutscene,
        "Symphony": window.playSymphonyCutscene,
        "Kyawthuite: Remembrance": window.playKyawthuiteCutscene,
        "Flora: Evergreen": window.playFloraEvergreenCutscene,
        "Matrix: Overdrive": window.playMatrixOverdriveCutscene,
        "Mastermind": window.playMastermindCutscene,
        "Maelstrom": window.playMaelstromCutscene,
        "Nightmare Sky": window.playNightmareSkyCutscene,
        "Bloodlust": window.playBloodlustCutscene,
        "Eden": window.playEdenCutscene,
        "Manta": window.playMantaCutscene,
        "Bloodlust: Sanguine": window.playBloodlustSanguineCutscene,
        "Atlas": window.playAtlasCutscene,
        "Im Peach": window.playImPeachCutscene,
        "Legendarium": window.playLegendariumCutscene
    };
    
    // Check for specific video cutscene
    const cutsceneFunction = cutsceneFunctions[aura.name];
    if (cutsceneFunction && typeof cutsceneFunction === 'function') {
        cutsceneFunction(aura);
        showNotification(`🎬 Playing ${aura.name} cutscene`, 'info');
    } 
    // Check for rarity-based cutscenes
    else if (aura.rarity >= 99000000 && typeof window.playUltraRareCutscene === 'function') {
        window.playUltraRareCutscene(aura);
        showNotification(`🎬 Playing ultra-rare cutscene`, 'info');
    } 
    else if (aura.rarity >= 10000000 && typeof window.playUltraRareCutscene === 'function') {
        window.playUltraRareCutscene(aura);
        showNotification(`🎬 Playing rare cutscene`, 'info');
    } 
    else if (aura.rarity >= 1000000 && typeof window.playRareCutscene === 'function') {
        window.playRareCutscene(aura);
        showNotification(`🎬 Playing cutscene`, 'info');
    } 
    else {
        showNotification(`❌ No cutscene available for ${aura.name}`, 'error');
    }
};

// Share/Screenshot
window.shareAura = function() {
    if (!galleryViewer.currentAura) return;
    
    const aura = galleryViewer.currentAura;
    const owned = window.gameState.inventory.auras[aura.name];
    
    const text = `🎨 ${aura.name}\n` +
                `Rarity: 1:${aura.rarity.toLocaleString()}\n` +
                `Tier: ${aura.tier}\n` +
                `Owned: ${owned?.count || 0}\n` +
                `\nSol's RNG - Aura Gallery`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('📋 Aura info copied to clipboard!', 'success');
        });
    } else {
        showNotification('📋 ' + text, 'info');
    }
};

// Close gallery
window.closeGallery = function() {
    const modal = document.getElementById('galleryModal');
    modal.style.display = 'none';
    galleryViewer.currentAura = null;
};

// Setup event listeners
function setupGalleryListeners() {
    const search = document.getElementById('gallerySearch');
    const tierFilter = document.getElementById('galleryTierFilter');
    const showOnlyOwned = document.getElementById('galleryShowOnlyOwned');
    const showFavoritesOnly = document.getElementById('galleryShowFavoritesOnly');
    
    if (search) search.addEventListener('input', updateGalleryAuraList);
    if (tierFilter) tierFilter.addEventListener('change', updateGalleryAuraList);
    if (showOnlyOwned) showOnlyOwned.addEventListener('change', updateGalleryAuraList);
    if (showFavoritesOnly) showFavoritesOnly.addEventListener('change', updateGalleryAuraList);
}

console.log('✅ Aura Gallery System loaded');
