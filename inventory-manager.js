// Smart Inventory Manager System

let inventoryManagerSettings = {
    autoSort: true,
    sortBy: 'rarity',
    showValue: true,
    lowStockThreshold: 5,
    lowStockAlerts: true,
    compactMode: false
};

class InventoryManager {
    constructor() {
        this.load();
    }

    load() {
        const saved = localStorage.getItem('inventoryManagerSettings');
        if (saved) {
            inventoryManagerSettings = { ...inventoryManagerSettings, ...JSON.parse(saved) };
        }
    }

    save() {
        localStorage.setItem('inventoryManagerSettings', JSON.stringify(inventoryManagerSettings));
    }

    getRarityValue(itemName) {
        if (typeof AURAS !== 'undefined' && AURAS[itemName]) {
            return AURAS[itemName].rarity || 0;
        }
        return 0;
    }

    getItemValue(itemName, count) {
        const rarity = this.getRarityValue(itemName);
        return rarity * count;
    }

    getTotalInventoryValue() {
        let total = 0;
        if (!gameState?.inventory?.auras) return 0;
        
        for (const [name, data] of Object.entries(gameState.inventory.auras)) {
            total += this.getItemValue(name, data.count);
        }
        
        return total;
    }

    sortInventory(items, sortBy) {
        const entries = Object.entries(items);
        
        switch (sortBy) {
            case 'rarity':
                entries.sort((a, b) => this.getRarityValue(b[0]) - this.getRarityValue(a[0]));
                break;
            case 'count':
                entries.sort((a, b) => b[1].count - a[1].count);
                break;
            case 'name':
                entries.sort((a, b) => a[0].localeCompare(b[0]));
                break;
            case 'value':
                entries.sort((a, b) => 
                    this.getItemValue(b[0], b[1].count) - this.getItemValue(a[0], a[1].count)
                );
                break;
        }
        
        return entries;
    }

    getLowStockItems() {
        const lowStock = [];
        if (!gameState?.inventory?.items) return lowStock;
        
        for (const [name, data] of Object.entries(gameState.inventory.items)) {
            if (data.count <= inventoryManagerSettings.lowStockThreshold) {
                lowStock.push({ name, count: data.count });
            }
        }
        
        return lowStock;
    }

    bulkConsume(category, filterFn) {
        if (!gameState?.inventory?.[category]) return 0;
        
        let count = 0;
        const items = { ...gameState.inventory[category] };
        
        for (const [name, data] of Object.entries(items)) {
            if (filterFn(name, data)) {
                if (typeof consumeItem === 'function') {
                    consumeItem(name, data.count);
                    count += data.count;
                }
            }
        }
        
        return count;
    }

    bulkDelete(category, filterFn) {
        if (!gameState?.inventory?.[category]) return 0;
        
        let count = 0;
        
        for (const [name, data] of Object.entries(gameState.inventory[category])) {
            if (filterFn(name, data)) {
                count += data.count;
                delete gameState.inventory[category][name];
            }
        }
        
        if (count > 0) {
            saveGameState();
            updateInventoryDisplay();
        }
        
        return count;
    }

    sellJunk() {
        if (!gameState?.inventory?.auras) return 0;
        
        const junkRarity = 1000;
        let totalSold = 0;
        let moneyEarned = 0;
        
        for (const [name, data] of Object.entries(gameState.inventory.auras)) {
            const rarity = this.getRarityValue(name);
            if (rarity <= junkRarity) {
                const sellPrice = Math.floor(rarity * 0.1);
                moneyEarned += sellPrice * data.count;
                totalSold += data.count;
                delete gameState.inventory.auras[name];
            }
        }
        
        gameState.money += moneyEarned;
        saveGameState();
        updateInventoryDisplay();
        updateMoneyDisplay();
        
        return { sold: totalSold, earned: moneyEarned };
    }

    openSettings() {
        let modal = document.getElementById('inventoryManagerModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'inventoryManagerModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h2>📦 Inventory Manager</h2>
                        <button class="close-btn" onclick="inventoryManager.closeSettings()">✖</button>
                    </div>
                    <div class="modal-body" style="padding: 20px;">
                        <div style="display: grid; gap: 20px;">
                            <div style="background: rgba(59, 130, 246, 0.1); border: 2px solid #3b82f6; padding: 15px; border-radius: 8px;">
                                <h3 style="color: #93c5fd; margin-top: 0;">📊 Inventory Stats</h3>
                                <p style="color: #bfdbfe; margin: 10px 0;">
                                    <strong>Total Value:</strong> ${this.getTotalInventoryValue().toLocaleString()}<br>
                                    <strong>Unique Auras:</strong> ${Object.keys(gameState.inventory.auras || {}).length}<br>
                                    <strong>Low Stock Items:</strong> ${this.getLowStockItems().length}
                                </p>
                            </div>

                            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
                                <h3>⚡ Quick Actions</h3>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                                    <button onclick="inventoryManager.performSellJunk()" 
                                            style="padding: 12px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                                        💰 Sell All Junk
                                    </button>
                                    <button onclick="inventoryManager.showLowStock()" 
                                            style="padding: 12px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                                        ⚠️ View Low Stock
                                    </button>
                                </div>
                            </div>

                            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
                                <h3>⚙️ Settings</h3>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0; cursor: pointer;">
                                    <input type="checkbox" id="autoSortCheck" ${inventoryManagerSettings.autoSort ? 'checked' : ''}>
                                    <span>Auto-sort inventory</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                                    <span>Sort by:</span>
                                    <select id="sortBySelect" style="padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">
                                        <option value="rarity" ${inventoryManagerSettings.sortBy === 'rarity' ? 'selected' : ''}>Rarity</option>
                                        <option value="count" ${inventoryManagerSettings.sortBy === 'count' ? 'selected' : ''}>Count</option>
                                        <option value="name" ${inventoryManagerSettings.sortBy === 'name' ? 'selected' : ''}>Name</option>
                                        <option value="value" ${inventoryManagerSettings.sortBy === 'value' ? 'selected' : ''}>Value</option>
                                    </select>
                                </label>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0; cursor: pointer;">
                                    <input type="checkbox" id="showValueCheck" ${inventoryManagerSettings.showValue ? 'checked' : ''}>
                                    <span>Show item values</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0; cursor: pointer;">
                                    <input type="checkbox" id="lowStockAlertsCheck" ${inventoryManagerSettings.lowStockAlerts ? 'checked' : ''}>
                                    <span>Low stock alerts</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                                    <span>Low stock threshold:</span>
                                    <input type="number" id="lowStockInput" min="1" max="50" value="${inventoryManagerSettings.lowStockThreshold}" 
                                           style="width: 70px; padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">
                                </label>
                            </div>

                            <button onclick="inventoryManager.saveSettings()" 
                                    style="padding: 15px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; border: none; border-radius: 8px; font-size: 1.1em; font-weight: bold; cursor: pointer;">
                                💾 Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        modal.classList.add('show');
    }

    closeSettings() {
        const modal = document.getElementById('inventoryManagerModal');
        if (modal) modal.classList.remove('show');
    }

    saveSettings() {
        inventoryManagerSettings.autoSort = document.getElementById('autoSortCheck').checked;
        inventoryManagerSettings.sortBy = document.getElementById('sortBySelect').value;
        inventoryManagerSettings.showValue = document.getElementById('showValueCheck').checked;
        inventoryManagerSettings.lowStockAlerts = document.getElementById('lowStockAlertsCheck').checked;
        inventoryManagerSettings.lowStockThreshold = parseInt(document.getElementById('lowStockInput').value);
        
        this.save();
        this.closeSettings();
        
        if (typeof showNotification === 'function') {
            showNotification('✅ Inventory manager settings saved!');
        }
    }

    performSellJunk() {
        const confirm = window.confirm('Sell all common auras (rarity ≤ 1000)?');
        if (!confirm) return;
        
        const result = this.sellJunk();
        
        if (typeof showNotification === 'function') {
            showNotification(`💰 Sold ${result.sold} items for $${result.earned.toLocaleString()}`);
        }
    }

    showLowStock() {
        const items = this.getLowStockItems();
        if (items.length === 0) {
            alert('No low stock items!');
            return;
        }
        
        const list = items.map(item => `${item.name}: ${item.count}`).join('\n');
        alert(`Low Stock Items:\n\n${list}`);
    }
}

const inventoryManager = new InventoryManager();

window.inventoryManager = inventoryManager;
window.openInventoryManager = () => inventoryManager.openSettings();

console.log('📦 Inventory Manager loaded');
