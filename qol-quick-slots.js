// =================================================================
// Quick Slot Customization System
// =================================================================

const quickSlotState = {
    slots: {
        1: { type: null, name: null, icon: '1' },
        2: { type: null, name: null, icon: '2' },
        3: { type: null, name: null, icon: '3' }
    },
    draggedItem: null,
    customizationMode: false
};

// Load quick slots from localStorage
function loadQuickSlots() {
    const saved = localStorage.getItem('quickSlots');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(quickSlotState.slots, parsed);
            updateQuickSlotsDisplay();
        } catch (e) {
            console.error('Failed to load quick slots:', e);
        }
    }
}

// Save quick slots to localStorage
function saveQuickSlots() {
    localStorage.setItem('quickSlots', JSON.stringify(quickSlotState.slots));
}

// Assign item to quick slot
function assignToQuickSlot(slotNumber, itemType, itemName) {
    if (!quickSlotState.slots[slotNumber]) return;
    
    // Get item icon
    let icon = slotNumber.toString();
    if (itemType === 'potion' && gameState.inventory.potions[itemName]) {
        icon = '⚗️';
    } else if (itemType === 'item' && gameState.inventory.items[itemName]) {
        icon = gameState.inventory.items[itemName].icon || '📦';
    } else if (itemType === 'rune' && gameState.inventory.runes[itemName]) {
        icon = '📿';
    }
    
    quickSlotState.slots[slotNumber] = {
        type: itemType,
        name: itemName,
        icon: icon
    };
    
    saveQuickSlots();
    updateQuickSlotsDisplay();
    showNotification(`✅ ${itemName} assigned to slot ${slotNumber}`);
}

// Clear quick slot
function clearQuickSlot(slotNumber) {
    if (!quickSlotState.slots[slotNumber]) return;
    
    quickSlotState.slots[slotNumber] = {
        type: null,
        name: null,
        icon: slotNumber.toString()
    };
    
    saveQuickSlots();
    updateQuickSlotsDisplay();
}

// Use quick slot
function useQuickSlot(slotNumber) {
    const slot = quickSlotState.slots[slotNumber];
    if (!slot || !slot.type || !slot.name) {
        showNotification(`⚠️ Quick slot ${slotNumber} is empty. Right-click items to assign.`);
        return;
    }
    
    // Check if item exists in inventory
    let hasItem = false;
    let count = 0;
    
    if (slot.type === 'potion' && gameState.inventory.potions[slot.name]) {
        hasItem = true;
        count = gameState.inventory.potions[slot.name].count;
    } else if (slot.type === 'item' && gameState.inventory.items[slot.name]) {
        hasItem = true;
        count = gameState.inventory.items[slot.name].count;
    } else if (slot.type === 'rune' && gameState.inventory.runes[slot.name]) {
        hasItem = true;
        count = gameState.inventory.runes[slot.name].count;
    }
    
    if (!hasItem || count <= 0) {
        showNotification(`❌ No ${slot.name} in inventory`);
        return;
    }
    
    // Use the item
    if (slot.type === 'potion') {
        if (typeof usePotion === 'function') {
            usePotion(slot.name);
        }
    } else if (slot.type === 'rune') {
        if (typeof activateRune === 'function') {
            activateRune(slot.name);
        }
    }
    
    updateQuickSlotsDisplay();
}

// Update quick slots display
function updateQuickSlotsDisplay() {
    for (let i = 1; i <= 3; i++) {
        const slotElement = document.getElementById(`quickSlot${i}`);
        if (!slotElement) continue;
        
        const slot = quickSlotState.slots[i];
        
        if (slot.type && slot.name) {
            // Get count
            let count = 0;
            if (slot.type === 'potion' && gameState.inventory.potions[slot.name]) {
                count = gameState.inventory.potions[slot.name].count;
            } else if (slot.type === 'item' && gameState.inventory.items[slot.name]) {
                count = gameState.inventory.items[slot.name].count;
            } else if (slot.type === 'rune' && gameState.inventory.runes[slot.name]) {
                count = gameState.inventory.runes[slot.name].count;
            }
            
            slotElement.innerHTML = `
                <div class="quick-slot-icon">${slot.icon}</div>
                <div class="quick-slot-name">${slot.name.substring(0, 10)}</div>
                <div class="quick-slot-count">${count}</div>
                <div class="quick-slot-key">${i}</div>
            `;
            slotElement.classList.add('assigned');
        } else {
            slotElement.innerHTML = `<span>${i}</span>`;
            slotElement.classList.remove('assigned');
        }
        
        // Update title
        if (slot.type && slot.name) {
            slotElement.title = `${slot.name} (Key: ${i})\nRight-click to clear`;
        } else {
            slotElement.title = `Quick Slot ${i} (Key: ${i})\nRight-click items to assign`;
        }
    }
}

// Flag to prevent duplicate listener registration
let quickSlotListenersSetup = false;

// Enable right-click to assign items
function enableQuickSlotAssignment() {
    // Prevent duplicate listener registration
    if (quickSlotListenersSetup) return;
    quickSlotListenersSetup = true;
    
    // Add context menu to inventory items
    document.addEventListener('contextmenu', (e) => {
        const itemElement = e.target.closest('.inventory-item, .potion-item, .rune-item');
        if (!itemElement) return;
        
        e.preventDefault();
        
        // Get item info from element
        const itemName = itemElement.dataset.itemName || itemElement.querySelector('.item-name, .potion-name, .rune-name')?.textContent;
        const itemType = itemElement.dataset.itemType || 
                        (itemElement.classList.contains('potion-item') ? 'potion' : 
                         itemElement.classList.contains('rune-item') ? 'rune' : 'item');
        
        if (!itemName) return;
        
        showQuickSlotMenu(e.clientX, e.clientY, itemType, itemName);
    });
    
    // Add click and right-click handlers to quick slots
    for (let i = 1; i <= 3; i++) {
        const slotElement = document.getElementById(`quickSlot${i}`);
        if (slotElement) {
            // Left-click to use the quick slot
            slotElement.addEventListener('click', () => {
                useQuickSlot(i);
            });
            
            // Right-click to clear quick slot
            slotElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const slot = quickSlotState.slots[i];
                if (slot.type && slot.name) {
                    clearQuickSlot(i);
                }
            });
        }
    }
}

// Show quick slot assignment menu
function showQuickSlotMenu(x, y, itemType, itemName) {
    // Remove existing menu
    const existingMenu = document.getElementById('quickSlotMenu');
    if (existingMenu) existingMenu.remove();
    
    // Create menu
    const menu = document.createElement('div');
    menu.id = 'quickSlotMenu';
    menu.className = 'context-menu';
    menu.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        background: #2a2a2a;
        border: 2px solid #555;
        border-radius: 8px;
        padding: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    `;
    
    // Create header
    const header = document.createElement('div');
    header.style.cssText = 'color: #aaa; font-size: 12px; padding: 4px 8px; border-bottom: 1px solid #444; margin-bottom: 4px;';
    header.textContent = 'Assign to Quick Slot:';
    menu.appendChild(header);
    
    // Create buttons with event listeners instead of inline onclick (prevents XSS)
    for (let i = 1; i <= 3; i++) {
        const btn = document.createElement('button');
        btn.className = 'context-menu-btn';
        btn.textContent = `Slot ${i} (Key: ${i})`;
        btn.addEventListener('click', () => {
            assignToQuickSlot(i, itemType, itemName);
            menu.remove();
        });
        menu.appendChild(btn);
    }
    
    document.body.appendChild(menu);
    
    // Close menu on click outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu() {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        });
    }, 100);
}

// Initialize quick slots system
function initQuickSlots() {
    loadQuickSlots();
    updateQuickSlotsDisplay();
    enableQuickSlotAssignment();
    console.log('✅ Quick Slots system initialized');
}

// Make functions globally accessible
if (typeof window !== 'undefined') {
    window.quickSlotState = quickSlotState;
    window.assignToQuickSlot = assignToQuickSlot;
    window.clearQuickSlot = clearQuickSlot;
    window.useQuickSlot = useQuickSlot;
    window.updateQuickSlotsDisplay = updateQuickSlotsDisplay;
    window.initQuickSlots = initQuickSlots;
}
