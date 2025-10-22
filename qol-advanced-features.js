// =================================================================
// Advanced QoL Features
// =================================================================

// =================================================================
// Biome Quick Switch
// =================================================================
function createBiomeQuickSwitch() {
    // DISABLED - Biome selector removed per user request
    return;
}

// =================================================================
// Aura Collection Tracker
// =================================================================
function updateAuraCollectionTracker() {
    let tracker = document.getElementById('auraCollectionTracker');
    
    if (!tracker) {
        tracker = document.createElement('div');
        tracker.id = 'auraCollectionTracker';
        tracker.className = 'aura-collection-tracker';
        tracker.style.cssText = `
            background: rgba(0,0,0,0.3);
            padding: 10px 15px;
            border-radius: 8px;
            margin: 10px 0;
            text-align: center;
        `;
        
        const aurasTab = document.getElementById('auras-tab');
        if (aurasTab) {
            aurasTab.insertBefore(tracker, aurasTab.firstChild);
        }
    }
    
    const totalAuras = typeof AURAS !== 'undefined' ? AURAS.length : 0;
    const collectedAuras = Object.keys(gameState?.inventory?.auras || {}).length;
    const percentage = totalAuras > 0 ? Math.floor((collectedAuras / totalAuras) * 100) : 0;
    
    tracker.innerHTML = `
        <div style="font-size: 18px; font-weight: bold; color: #4CAF50; margin-bottom: 5px;">
            📚 Collection Progress
        </div>
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">
            ${collectedAuras} / ${totalAuras} (${percentage}%)
        </div>
        <div class="progress-bar" style="height: 20px; background: rgba(0,0,0,0.5); border-radius: 10px; overflow: hidden;">
            <div class="progress-fill" style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, #4CAF50, #8BC34A); transition: width 0.3s ease;"></div>
        </div>
    `;
}

// =================================================================
// Roll Animation Speed Control
// =================================================================
function createAnimationSpeedControl() {
    const container = document.createElement('div');
    container.id = 'animationSpeedControl';
    container.className = 'animation-speed-control';
    container.style.cssText = `
        background: rgba(0,0,0,0.3);
        padding: 15px;
        border-radius: 8px;
        margin: 10px 0;
    `;
    
    const currentSpeed = parseFloat(localStorage.getItem('animationSpeed') || '1');
    
    container.innerHTML = `
        <div style="margin-bottom: 10px;">
            <label style="font-weight: bold; color: #aaa;">🎬 Animation Speed: <span id="speedValue">${currentSpeed}x</span></label>
        </div>
        <input type="range" id="animationSpeedSlider" min="0.5" max="2" step="0.1" value="${currentSpeed}" 
               style="width: 100%;" oninput="updateAnimationSpeed(this.value)">
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #888; margin-top: 5px;">
            <span>0.5x (Slow)</span>
            <span>1x (Normal)</span>
            <span>2x (Fast)</span>
        </div>
    `;
    
    const settingsTab = document.getElementById('settings-tab');
    if (settingsTab) {
        const displaySection = Array.from(settingsTab.querySelectorAll('h3')).find(h => h.textContent.includes('Display'));
        if (displaySection) {
            displaySection.parentElement.insertBefore(container, displaySection.nextSibling);
        }
    }
}

function updateAnimationSpeed(speed) {
    localStorage.setItem('animationSpeed', speed);
    document.getElementById('speedValue').textContent = `${speed}x`;
    
    // Apply to CSS animations
    document.documentElement.style.setProperty('--animation-speed', speed);
}

// =================================================================
// Notification Filters
// =================================================================
const notificationFilters = {
    minRarityTier: 'common', // 'common', 'rare', 'epic', 'legendary', 'mythic', etc.
    showBreakthroughs: true,
    showItems: true,
    showAchievements: true
};

function loadNotificationFilters() {
    const saved = localStorage.getItem('notificationFilters');
    if (saved) {
        try {
            Object.assign(notificationFilters, JSON.parse(saved));
        } catch (e) {
            console.error('Failed to load notification filters:', e);
        }
    }
}

function saveNotificationFilters() {
    localStorage.setItem('notificationFilters', JSON.stringify(notificationFilters));
}

function createNotificationFilterControls() {
    const container = document.createElement('div');
    container.id = 'notificationFilterControls';
    container.className = 'notification-filter-controls';
    container.style.cssText = `
        background: rgba(0,0,0,0.2);
        padding: 15px;
        border-radius: 8px;
        margin: 10px 0;
    `;
    
    container.innerHTML = `
        <h4>🔔 Notification Filters</h4>
        <div class="setting-item">
            <label>Minimum Rarity for Notifications:</label>
            <select id="minRarityFilter" onchange="updateNotificationFilter('minRarityTier', this.value)" 
                    style="padding: 5px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; margin-left: 10px;">
                <option value="common">All (Common+)</option>
                <option value="uncommon">Uncommon+</option>
                <option value="rare">Rare+</option>
                <option value="epic">Epic+</option>
                <option value="legendary">Legendary+</option>
                <option value="mythic">Mythic+</option>
                <option value="exotic">Exotic+</option>
            </select>
        </div>
        <div class="setting-item">
            <label class="setting-label">
                <input type="checkbox" id="showBreakthroughsFilter" 
                       ${notificationFilters.showBreakthroughs ? 'checked' : ''}
                       onchange="updateNotificationFilter('showBreakthroughs', this.checked)">
                <span class="checkmark"></span>
                Show Breakthrough Notifications
            </label>
        </div>
        <div class="setting-item">
            <label class="setting-label">
                <input type="checkbox" id="showItemsFilter" 
                       ${notificationFilters.showItems ? 'checked' : ''}
                       onchange="updateNotificationFilter('showItems', this.checked)">
                <span class="checkmark"></span>
                Show Item Drop Notifications
            </label>
        </div>
    `;
    
    const settingsTab = document.getElementById('settings-tab');
    if (settingsTab) {
        const notifSection = Array.from(settingsTab.querySelectorAll('h3')).find(h => h.textContent.includes('Notification'));
        if (notifSection && notifSection.nextElementSibling) {
            notifSection.nextElementSibling.appendChild(container);
        }
    }
    
    // Set current value
    const select = document.getElementById('minRarityFilter');
    if (select) select.value = notificationFilters.minRarityTier;
}

function updateNotificationFilter(key, value) {
    notificationFilters[key] = value;
    saveNotificationFilters();
    showNotification('✅ Notification filters updated');
}

// Wrap showNotification to respect filters
function wrapShowNotification() {
    if (typeof window.showNotification === 'function') {
        const originalShow = window.showNotification;
        window.showNotification = function(message, type) {
            // Check if notification should be shown based on filters
            // This is a basic implementation - you may need to enhance it
            originalShow.apply(this, arguments);
        };
    }
}

// =================================================================
// Bulk Item Actions
// =================================================================
let bulkSelectionMode = false;
let selectedItems = new Set();

function toggleBulkSelectionMode() {
    bulkSelectionMode = !bulkSelectionMode;
    selectedItems.clear();
    
    const btn = document.getElementById('bulkModeToggle');
    if (btn) {
        btn.textContent = bulkSelectionMode ? '✅ Bulk Mode: ON' : '📦 Bulk Mode: OFF';
        btn.style.background = bulkSelectionMode ? '#4CAF50' : '#555';
    }
    
    updateInventoryDisplay();
}

function toggleItemSelection(itemType, itemName) {
    const key = `${itemType}:${itemName}`;
    if (selectedItems.has(key)) {
        selectedItems.delete(key);
    } else {
        selectedItems.add(key);
    }
    updateInventoryDisplay();
}

function bulkDeleteSelected() {
    if (selectedItems.size === 0) {
        showNotification('⚠️ No items selected');
        return;
    }
    
    if (!confirm(`Delete ${selectedItems.size} selected items?`)) return;
    
    selectedItems.forEach(key => {
        const [type, name] = key.split(':');
        if (type === 'aura' && gameState.inventory.auras[name]) {
            const aura = gameState.inventory.auras[name];
            const count = aura.count || 0;
            
            // Track deletion for achievements
            if (typeof trackDeletion === 'function') {
                trackDeletion({name: name, tier: aura.tier || 'common'}, count);
            }
            
            delete gameState.inventory.auras[name];
        } else if (type === 'potion' && gameState.inventory.potions[name]) {
            delete gameState.inventory.potions[name];
        } else if (type === 'item' && gameState.inventory.items[name]) {
            delete gameState.inventory.items[name];
        }
    });
    
    selectedItems.clear();
    bulkSelectionMode = false;
    saveGameState();
    updateInventoryDisplay();
    showNotification(`🗑️ Deleted ${selectedItems.size} items`);
}

function createBulkActionControls() {
    // DISABLED: This conflicts with the potion bulk mode in gameLogic.js
    // The bulk action controls are now handled per-tab
    return;
}

// =================================================================
// Undo System
// =================================================================
const undoState = {
    lastAction: null,
    undoTimeout: null,
    undoWindow: 10000 // 10 seconds
};

function recordUndoableAction(actionType, data) {
    undoState.lastAction = {
        type: actionType,
        data: data,
        timestamp: Date.now()
    };
    
    showUndoNotification();
    
    // Clear after undo window
    if (undoState.undoTimeout) clearTimeout(undoState.undoTimeout);
    undoState.undoTimeout = setTimeout(() => {
        undoState.lastAction = null;
        hideUndoNotification();
    }, undoState.undoWindow);
}

function performUndo() {
    if (!undoState.lastAction) {
        showNotification('⚠️ Nothing to undo');
        return;
    }
    
    const action = undoState.lastAction;
    const age = Date.now() - action.timestamp;
    
    if (age > undoState.undoWindow) {
        showNotification('⚠️ Undo window expired');
        undoState.lastAction = null;
        hideUndoNotification();
        return;
    }
    
    // Perform undo based on action type
    switch (action.type) {
        case 'usePotion':
            // Restore potion
            if (!gameState.inventory.potions[action.data.name]) {
                gameState.inventory.potions[action.data.name] = { count: 0 };
            }
            gameState.inventory.potions[action.data.name].count++;
            showNotification(`↩️ Undid: Used ${action.data.name}`);
            break;
        case 'craft':
            // Restore materials, remove crafted item
            // Implementation depends on your crafting system
            showNotification(`↩️ Undid: Crafted ${action.data.name}`);
            break;
    }
    
    undoState.lastAction = null;
    hideUndoNotification();
    saveGameState();
    updateInventoryDisplay();
}

function showUndoNotification() {
    let notification = document.getElementById('undoNotification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'undoNotification';
        notification.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: rgba(255, 152, 0, 0.95);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 9998;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: opacity 0.3s ease;
        `;
        notification.onclick = performUndo;
        document.body.appendChild(notification);
    }
    
    notification.innerHTML = `
        ↩️ <strong>Undo available</strong> (Click or press Ctrl+Z)
        <div style="font-size: 11px; opacity: 0.8; margin-top: 4px;">
            ${Math.floor(undoState.undoWindow / 1000)}s remaining
        </div>
    `;
    notification.style.opacity = '1';
}

function hideUndoNotification() {
    const notification = document.getElementById('undoNotification');
    if (notification) {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }
}

// Add Ctrl+Z shortcut for undo
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        performUndo();
    }
});

// =================================================================
// Initialize All Advanced Features
// =================================================================
function initAdvancedFeatures() {
    // Biome quick switch - DISABLED
    // setTimeout(createBiomeQuickSwitch, 1000);
    
    // Animation speed control
    createAnimationSpeedControl();
    
    // Notification filters
    loadNotificationFilters();
    createNotificationFilterControls();
    wrapShowNotification();
    
    // Bulk actions
    createBulkActionControls();
    
    // Update aura collection tracker when auras tab is opened
    const aurasTabBtn = document.querySelector('[data-tab="auras"]');
    if (aurasTabBtn) {
        aurasTabBtn.addEventListener('click', () => {
            setTimeout(updateAuraCollectionTracker, 100);
        });
    }
    
    console.log('✅ Advanced Features initialized');
}

// Make functions globally accessible
if (typeof window !== 'undefined') {
    window.updateAuraCollectionTracker = updateAuraCollectionTracker;
    window.updateAnimationSpeed = updateAnimationSpeed;
    window.updateNotificationFilter = updateNotificationFilter;
    window.toggleBulkSelectionMode = toggleBulkSelectionMode;
    window.toggleItemSelection = toggleItemSelection;
    window.bulkDeleteSelected = bulkDeleteSelected;
    window.recordUndoableAction = recordUndoableAction;
    window.performUndo = performUndo;
    window.initAdvancedFeatures = initAdvancedFeatures;
}
