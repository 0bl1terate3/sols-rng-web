// =================================================================
// Crafting Queue System
// =================================================================

const craftingQueueState = {
    queue: [],
    isProcessing: false,
    maxQueueSize: 20,
    autoProcess: true
};

// Load crafting queue from localStorage
function loadCraftingQueue() {
    const saved = localStorage.getItem('craftingQueue');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            craftingQueueState.queue = parsed.queue || [];
            craftingQueueState.autoProcess = parsed.autoProcess !== false;
        } catch (e) {
            console.error('Failed to load crafting queue:', e);
        }
    }
}

// Save crafting queue to localStorage
function saveCraftingQueue() {
    localStorage.setItem('craftingQueue', JSON.stringify({
        queue: craftingQueueState.queue,
        autoProcess: craftingQueueState.autoProcess
    }));
}

// Add recipe to queue
function addToQueue(recipeName, recipeType, amount = 1) {
    if (craftingQueueState.queue.length >= craftingQueueState.maxQueueSize) {
        showNotification('⚠️ Queue is full (max 20 items)');
        return false;
    }
    
    craftingQueueState.queue.push({
        name: recipeName,
        type: recipeType,
        amount: amount,
        id: Date.now() + Math.random()
    });
    
    saveCraftingQueue();
    updateQueueDisplay();
    showNotification(`➕ Added ${amount}x ${recipeName} to queue`);
    
    if (craftingQueueState.autoProcess && !craftingQueueState.isProcessing) {
        processQueue();
    }
    
    return true;
}

// Remove from queue
function removeFromQueue(queueId) {
    craftingQueueState.queue = craftingQueueState.queue.filter(item => item.id !== queueId);
    saveCraftingQueue();
    updateQueueDisplay();
}

// Clear entire queue
function clearQueue() {
    if (confirm('Clear entire crafting queue?')) {
        craftingQueueState.queue = [];
        saveCraftingQueue();
        updateQueueDisplay();
        showNotification('🗑️ Queue cleared');
    }
}

// Process queue
async function processQueue() {
    if (craftingQueueState.isProcessing || craftingQueueState.queue.length === 0) {
        return;
    }
    
    craftingQueueState.isProcessing = true;
    updateQueueDisplay();
    
    while (craftingQueueState.queue.length > 0) {
        const item = craftingQueueState.queue[0];
        
        // Check if we can craft
        let recipe;
        if (item.type === 'potion') {
            recipe = POTION_RECIPES.find(r => r.name === item.name);
        } else if (item.type === 'gear') {
            if (typeof gearData !== 'undefined' && gearData[item.name]) {
                recipe = { ingredients: gearData[item.name].recipe };
            }
        } else if (item.type === 'item') {
            if (typeof ITEM_RECIPES !== 'undefined' && ITEM_RECIPES[item.name]) {
                recipe = { ingredients: ITEM_RECIPES[item.name].recipe };
            }
        }
        
        if (!recipe) {
            console.warn('Recipe not found:', item.name);
            craftingQueueState.queue.shift();
            continue;
        }
        
        // Check materials
        const canCraft = checkCanCraft(recipe);
        
        if (!canCraft) {
            showNotification(`⚠️ Cannot craft ${item.name} - insufficient materials. Pausing queue.`);
            break;
        }
        
        // Craft the item
        let success = false;
        if (item.type === 'potion' && typeof craftPotion === 'function') {
            craftPotion(item.name);
            success = true;
        } else if (item.type === 'gear' && typeof craftGear === 'function') {
            craftGear(item.name);
            success = true;
        } else if (item.type === 'item' && typeof craftItem === 'function') {
            craftItem(item.name);
            success = true;
        }
        
        if (success) {
            item.amount--;
            if (item.amount <= 0) {
                craftingQueueState.queue.shift();
            }
            
            saveCraftingQueue();
            updateQueueDisplay();
            
            // Small delay between crafts
            await new Promise(resolve => setTimeout(resolve, 300));
        } else {
            craftingQueueState.queue.shift();
        }
    }
    
    craftingQueueState.isProcessing = false;
    updateQueueDisplay();
    
    if (craftingQueueState.queue.length === 0) {
        showNotification('✅ Queue completed!');
    }
}

// Toggle auto-process
function toggleAutoProcess() {
    craftingQueueState.autoProcess = !craftingQueueState.autoProcess;
    saveCraftingQueue();
    updateQueueDisplay();
    
    if (craftingQueueState.autoProcess && craftingQueueState.queue.length > 0 && !craftingQueueState.isProcessing) {
        processQueue();
    }
}

// Update queue display
function updateQueueDisplay() {
    let container = document.getElementById('craftingQueueContainer');
    
    if (!container) {
        // Create container
        container = document.createElement('div');
        container.id = 'craftingQueueContainer';
        container.className = 'crafting-queue-panel';
        
        const craftingPanel = document.querySelector('.crafting-panel');
        if (craftingPanel) {
            craftingPanel.appendChild(container);
        }
    }
    
    if (craftingQueueState.queue.length === 0) {
        container.innerHTML = `
            <div class="queue-header">
                <h3>📋 Crafting Queue (0/${craftingQueueState.maxQueueSize})</h3>
                <div class="queue-controls">
                    <label style="font-size: 12px; color: #aaa;">
                        <input type="checkbox" ${craftingQueueState.autoProcess ? 'checked' : ''} 
                               onchange="toggleAutoProcess()"> Auto-Process
                    </label>
                </div>
            </div>
            <div class="queue-empty">Queue is empty. Add recipes from the list below.</div>
        `;
        return;
    }
    
    let html = `
        <div class="queue-header">
            <h3>📋 Crafting Queue (${craftingQueueState.queue.length}/${craftingQueueState.maxQueueSize})</h3>
            <div class="queue-controls">
                <label style="font-size: 12px; color: #aaa; margin-right: 10px;">
                    <input type="checkbox" ${craftingQueueState.autoProcess ? 'checked' : ''} 
                           onchange="toggleAutoProcess()"> Auto-Process
                </label>
                ${!craftingQueueState.isProcessing && craftingQueueState.queue.length > 0 ? 
                    '<button class="qol-button" onclick="processQueue()">▶️ Start</button>' : ''}
                ${craftingQueueState.isProcessing ? 
                    '<span style="color: #4CAF50;">⚙️ Processing...</span>' : ''}
                <button class="qol-button" onclick="clearQueue()">🗑️ Clear</button>
            </div>
        </div>
        <div class="queue-list">
    `;
    
    craftingQueueState.queue.forEach((item, index) => {
        const icon = item.type === 'potion' ? '⚗️' : item.type === 'gear' ? '⚙️' : '📦';
        const isFirst = index === 0 && craftingQueueState.isProcessing;
        
        html += `
            <div class="queue-item ${isFirst ? 'processing' : ''}">
                <span class="queue-icon">${icon}</span>
                <span class="queue-name">${item.name}</span>
                <span class="queue-amount">x${item.amount}</span>
                <button class="queue-remove" onclick="removeFromQueue(${item.id})" title="Remove">✕</button>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Add "Add to Queue" button to recipe cards
function enhanceRecipeCardsWithQueue() {
    // This will be called after recipes are rendered
    const recipeItems = document.querySelectorAll('.recipe-item');
    recipeItems.forEach(item => {
        if (item.querySelector('.queue-add-btn')) return; // Already enhanced
        
        const recipeName = item.querySelector('.recipe-name')?.textContent?.replace(/[⚗️⚙️📦]/g, '').trim();
        if (!recipeName) return;
        
        // Determine type
        let recipeType = 'potion';
        if (item.textContent.includes('⚙️')) recipeType = 'gear';
        if (item.textContent.includes('📦')) recipeType = 'item';
        
        const buttonContainer = item.querySelector('[style*="position: absolute"]');
        if (buttonContainer) {
            const queueBtn = document.createElement('button');
            queueBtn.className = 'queue-add-btn';
            queueBtn.innerHTML = '📋';
            queueBtn.title = 'Add to queue';
            queueBtn.style.cssText = 'background: #2196F3; color: white; border: none; border-radius: 4px; padding: 2px 6px; cursor: pointer; font-size: 12px;';
            queueBtn.onclick = (e) => {
                e.stopPropagation();
                const amount = prompt('How many to queue?', '1');
                if (amount && !isNaN(amount)) {
                    addToQueue(recipeName, recipeType, parseInt(amount));
                }
            };
            buttonContainer.appendChild(queueBtn);
        }
    });
}

// Initialize crafting queue
function initCraftingQueue() {
    loadCraftingQueue();
    updateQueueDisplay();
    
    // Enhance recipe cards when recipes list updates
    const observer = new MutationObserver(() => {
        enhanceRecipeCardsWithQueue();
    });
    
    const recipesList = document.getElementById('recipesList');
    if (recipesList) {
        observer.observe(recipesList, { childList: true, subtree: true });
    }
    
    console.log('✅ Crafting Queue system initialized');
}

// Make functions globally accessible
if (typeof window !== 'undefined') {
    window.craftingQueueState = craftingQueueState;
    window.addToQueue = addToQueue;
    window.removeFromQueue = removeFromQueue;
    window.clearQueue = clearQueue;
    window.processQueue = processQueue;
    window.toggleAutoProcess = toggleAutoProcess;
    window.updateQueueDisplay = updateQueueDisplay;
    window.initCraftingQueue = initCraftingQueue;
}
