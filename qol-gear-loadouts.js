// =================================================================
// Gear Loadout Presets System
// =================================================================

const gearLoadoutState = {
    loadouts: {
        1: { name: 'Loadout 1', left: null, right: null },
        2: { name: 'Loadout 2', left: null, right: null },
        3: { name: 'Loadout 3', left: null, right: null },
        4: { name: 'Loadout 4', left: null, right: null },
        5: { name: 'Loadout 5', left: null, right: null }
    },
    currentLoadout: null
};

// Load loadouts from localStorage
function loadGearLoadouts() {
    const saved = localStorage.getItem('gearLoadouts');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(gearLoadoutState.loadouts, parsed);
        } catch (e) {
            console.error('Failed to load gear loadouts:', e);
        }
    }
}

// Save loadouts to localStorage
function saveGearLoadouts() {
    localStorage.setItem('gearLoadouts', JSON.stringify(gearLoadoutState.loadouts));
}

// Save current gear to loadout
function saveToLoadout(slotNumber) {
    if (!gearLoadoutState.loadouts[slotNumber]) return;
    
    const currentLeft = gameState.equippedGear?.left || null;
    const currentRight = gameState.equippedGear?.right || null;
    
    gearLoadoutState.loadouts[slotNumber].left = currentLeft;
    gearLoadoutState.loadouts[slotNumber].right = currentRight;
    gearLoadoutState.currentLoadout = slotNumber;
    
    saveGearLoadouts();
    updateLoadoutsDisplay();
    showNotification(`💾 Saved to ${gearLoadoutState.loadouts[slotNumber].name}`);
}

// Load gear from loadout
function loadFromLoadout(slotNumber) {
    const loadout = gearLoadoutState.loadouts[slotNumber];
    if (!loadout) return;
    
    // Unequip current gear
    if (gameState.equippedGear?.left) {
        if (typeof unequipGear === 'function') {
            unequipGear('left');
        }
    }
    if (gameState.equippedGear?.right) {
        if (typeof unequipGear === 'function') {
            unequipGear('right');
        }
    }
    
    // Equip loadout gear
    if (loadout.left && typeof equipGear === 'function') {
        equipGear(loadout.left, 'left');
    }
    if (loadout.right && typeof equipGear === 'function') {
        equipGear(loadout.right, 'right');
    }
    
    gearLoadoutState.currentLoadout = slotNumber;
    updateLoadoutsDisplay();
    showNotification(`✅ Loaded ${loadout.name}`);
}

// Rename loadout
function renameLoadout(slotNumber) {
    const loadout = gearLoadoutState.loadouts[slotNumber];
    if (!loadout) return;
    
    const newName = prompt('Enter loadout name:', loadout.name);
    if (newName && newName.trim()) {
        loadout.name = newName.trim();
        saveGearLoadouts();
        updateLoadoutsDisplay();
    }
}

// Clear loadout
function clearLoadout(slotNumber) {
    const loadout = gearLoadoutState.loadouts[slotNumber];
    if (!loadout) return;
    
    if (confirm(`Clear ${loadout.name}?`)) {
        loadout.left = null;
        loadout.right = null;
        if (gearLoadoutState.currentLoadout === slotNumber) {
            gearLoadoutState.currentLoadout = null;
        }
        saveGearLoadouts();
        updateLoadoutsDisplay();
    }
}

// Update loadouts display
function updateLoadoutsDisplay() {
    let container = document.getElementById('gearLoadoutsContainer');
    
    if (!container) {
        // Create container
        container = document.createElement('div');
        container.id = 'gearLoadoutsContainer';
        container.className = 'gear-loadouts-panel';
        
        const equipmentSlots = document.querySelector('.equipment-slots');
        if (equipmentSlots) {
            equipmentSlots.insertAdjacentElement('afterend', container);
        }
    }
    
    let html = '<h3>⚔️ Gear Loadouts</h3><div class="loadouts-grid">';
    
    for (let i = 1; i <= 5; i++) {
        const loadout = gearLoadoutState.loadouts[i];
        const isEmpty = !loadout.left && !loadout.right;
        const isCurrent = gearLoadoutState.currentLoadout === i;
        
        html += `
            <div class="loadout-slot ${isCurrent ? 'active' : ''} ${isEmpty ? 'empty' : ''}">
                <div class="loadout-header">
                    <span class="loadout-name" onclick="renameLoadout(${i})" title="Click to rename">
                        ${loadout.name}
                    </span>
                    ${!isEmpty ? `<button class="loadout-clear" onclick="clearLoadout(${i})" title="Clear">✕</button>` : ''}
                </div>
                <div class="loadout-gear">
                    <div class="loadout-gear-item">
                        <span class="gear-label">L:</span>
                        <span class="gear-name">${loadout.left || 'Empty'}</span>
                    </div>
                    <div class="loadout-gear-item">
                        <span class="gear-label">R:</span>
                        <span class="gear-name">${loadout.right || 'Empty'}</span>
                    </div>
                </div>
                <div class="loadout-actions">
                    <button class="loadout-btn save" onclick="saveToLoadout(${i})" title="Save current gear">
                        💾 Save
                    </button>
                    <button class="loadout-btn load" onclick="loadFromLoadout(${i})" 
                            ${isEmpty ? 'disabled' : ''} title="Load this loadout">
                        ⚡ Load
                    </button>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// Keyboard shortcuts for loadouts
function initLoadoutShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        // Ctrl + number to load loadout
        if (e.ctrlKey && e.shiftKey && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const slotNumber = parseInt(e.key);
            saveToLoadout(slotNumber);
        } else if (e.ctrlKey && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const slotNumber = parseInt(e.key);
            loadFromLoadout(slotNumber);
        }
    });
}

// Initialize gear loadouts system
function initGearLoadouts() {
    loadGearLoadouts();
    updateLoadoutsDisplay();
    initLoadoutShortcuts();
    console.log('✅ Gear Loadouts system initialized');
}

// Make functions globally accessible
if (typeof window !== 'undefined') {
    window.gearLoadoutState = gearLoadoutState;
    window.saveToLoadout = saveToLoadout;
    window.loadFromLoadout = loadFromLoadout;
    window.renameLoadout = renameLoadout;
    window.clearLoadout = clearLoadout;
    window.updateLoadoutsDisplay = updateLoadoutsDisplay;
    window.initGearLoadouts = initGearLoadouts;
}
