// =================================================================
// Cutscene Settings System
// =================================================================

// Initialize cutscene settings in gameState if not present
if (!gameState.cutsceneSettings) {
    gameState.cutsceneSettings = {
        masterEnabled: true,
        rarityThreshold: 1000000, // Default: 1M+
        disabledAuras: [] // List of aura names with cutscenes disabled
    };
}

// Load settings from localStorage
try {
    const savedCutsceneSettings = localStorage.getItem('cutsceneSettings');
    if (savedCutsceneSettings) {
        const parsed = JSON.parse(savedCutsceneSettings);
        gameState.cutsceneSettings = {
            ...gameState.cutsceneSettings,
            ...parsed
        };
    }
} catch (e) {
    console.log('Could not load cutscene settings:', e);
}

// Save cutscene settings to localStorage
function saveCutsceneSettings() {
    try {
        localStorage.setItem('cutsceneSettings', JSON.stringify(gameState.cutsceneSettings));
        console.log('Cutscene settings saved');
    } catch (e) {
        console.error('Failed to save cutscene settings:', e);
    }
}

// Toggle master cutscene enable/disable
function toggleMasterCutscenes() {
    const toggle = document.getElementById('masterCutsceneToggle');
    gameState.cutsceneSettings.masterEnabled = toggle.checked;
    saveCutsceneSettings();
    showNotification(`Cutscenes ${toggle.checked ? 'enabled' : 'disabled'}`, toggle.checked ? 'success' : 'info');
}

// Rarity threshold values (0-7 slider mapped to these values)
const RARITY_THRESHOLDS = [
    { value: 0, label: 'Off (No cutscenes)', rarity: Infinity },
    { value: 100000, label: '100,000+' },
    { value: 500000, label: '500,000+' },
    { value: 1000000, label: '1,000,000+' },
    { value: 5000000, label: '5,000,000+' },
    { value: 10000000, label: '10,000,000+' },
    { value: 50000000, label: '50,000,000+' },
    { value: 99000000, label: '99,000,000+' }
];

// Update cutscene rarity threshold
function updateCutsceneThreshold(sliderValue) {
    const index = parseInt(sliderValue);
    const threshold = RARITY_THRESHOLDS[index];
    
    gameState.cutsceneSettings.rarityThreshold = threshold.rarity !== undefined ? threshold.rarity : threshold.value;
    
    const thresholdLabel = document.getElementById('cutsceneThresholdValue');
    if (thresholdLabel) {
        thresholdLabel.textContent = threshold.label;
    }
    
    saveCutsceneSettings();
    
    if (threshold.rarity === Infinity) {
        showNotification('All cutscenes disabled', 'info');
    } else {
        showNotification(`Cutscenes will only play for ${threshold.label} auras`, 'info');
    }
}

// Populate cutscene aura list (all auras that can have cutscenes, based on rarity >= 1M)
function populateCutsceneAuraList() {
    const container = document.getElementById('cutsceneAuraListContainer');
    if (!container) return;
    
    // Safety check: Make sure AURAS is loaded
    if (typeof AURAS === 'undefined') {
        container.innerHTML = '<p style="color: #888; text-align: center;">Loading aura data...</p>';
        return;
    }
    
    // Get all auras with rarity >= 1M (these can potentially have cutscenes)
    const cutsceneAuras = AURAS
        .filter(aura => aura.rarity >= 1000000)
        .sort((a, b) => b.rarity - a.rarity); // Sort by rarity descending
    
    if (cutsceneAuras.length === 0) {
        container.innerHTML = '<p style="color: #888; text-align: center;">No auras with cutscenes found</p>';
        return;
    }
    
    let html = '<div class="cutscene-aura-items">';
    
    cutsceneAuras.forEach(aura => {
        const isDisabled = gameState.cutsceneSettings.disabledAuras.includes(aura.name);
        const rarityText = (aura.rarity || aura.baseRarity).toLocaleString();
        
        html += `
            <label class="cutscene-aura-item" data-aura-name="${aura.name}" style="display: flex; align-items: center; padding: 8px; margin-bottom: 5px; border-radius: 4px; background: rgba(255,255,255,0.05); cursor: pointer;">
                <input type="checkbox" 
                       onchange="toggleAuraCutscene('${aura.name.replace(/'/g, "\\'")}', this.checked)"
                       ${isDisabled ? 'checked' : ''}
                       style="margin-right: 10px;">
                <div style="flex: 1;">
                    <div style="font-weight: bold;">${aura.name}</div>
                    <div style="font-size: 0.85em; color: #888;">1 in ${rarityText}</div>
                </div>
            </label>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Toggle cutscene for specific aura
function toggleAuraCutscene(auraName, isDisabled) {
    if (isDisabled) {
        // Add to disabled list
        if (!gameState.cutsceneSettings.disabledAuras.includes(auraName)) {
            gameState.cutsceneSettings.disabledAuras.push(auraName);
        }
        showNotification(`Cutscene disabled for ${auraName}`, 'info');
    } else {
        // Remove from disabled list
        gameState.cutsceneSettings.disabledAuras = gameState.cutsceneSettings.disabledAuras.filter(
            name => name !== auraName
        );
        showNotification(`Cutscene enabled for ${auraName}`, 'success');
    }
    
    saveCutsceneSettings();
}

// Filter aura list based on search
function filterCutsceneAuraList(searchTerm) {
    const container = document.getElementById('cutsceneAuraListContainer');
    if (!container) return;
    
    const items = container.querySelectorAll('.cutscene-aura-item');
    const lowerSearch = searchTerm.toLowerCase();
    
    items.forEach(item => {
        const auraName = item.dataset.auraName.toLowerCase();
        if (auraName.includes(lowerSearch)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Check if cutscene should play for this aura (called from gameLogic.js)
function shouldPlayCutsceneForAura(aura) {
    // 1. Check master toggle
    if (!gameState.cutsceneSettings.masterEnabled) {
        return false;
    }
    
    // 2. Check if this specific aura is disabled
    if (gameState.cutsceneSettings.disabledAuras.includes(aura.name)) {
        return false;
    }
    
    // 3. Check rarity threshold
    const auraRarity = aura.rarity || aura.baseRarity;
    if (auraRarity < gameState.cutsceneSettings.rarityThreshold) {
        return false;
    }
    
    return true;
}

// Initialize settings UI when settings modal opens
function initializeCutsceneSettingsUI() {
    // Set master toggle
    const masterToggle = document.getElementById('masterCutsceneToggle');
    if (masterToggle) {
        masterToggle.checked = gameState.cutsceneSettings.masterEnabled;
    }
    
    // Set rarity threshold slider
    const thresholdSlider = document.getElementById('cutsceneRarityThreshold');
    if (thresholdSlider) {
        // Find the closest threshold index
        const currentThreshold = gameState.cutsceneSettings.rarityThreshold;
        let closestIndex = 3; // Default to 1M
        
        for (let i = 0; i < RARITY_THRESHOLDS.length; i++) {
            const thresholdValue = RARITY_THRESHOLDS[i].rarity !== undefined 
                ? RARITY_THRESHOLDS[i].rarity 
                : RARITY_THRESHOLDS[i].value;
            
            if (currentThreshold === thresholdValue) {
                closestIndex = i;
                break;
            }
        }
        
        thresholdSlider.value = closestIndex;
        updateCutsceneThreshold(closestIndex);
    }
    
    // Populate aura list
    populateCutsceneAuraList();
}

// Hook into existing settings initialization
const originalInitializeSettingsUI = window.initializeSettingsUI;
window.initializeSettingsUI = function() {
    if (originalInitializeSettingsUI) {
        originalInitializeSettingsUI();
    }
    initializeCutsceneSettingsUI();
};

// Make functions globally available
window.toggleMasterCutscenes = toggleMasterCutscenes;
window.updateCutsceneThreshold = updateCutsceneThreshold;
window.toggleAuraCutscene = toggleAuraCutscene;
window.filterCutsceneAuraList = filterCutsceneAuraList;
window.shouldPlayCutsceneForAura = shouldPlayCutsceneForAura;

console.log('🎬 Cutscene settings system loaded');
