// Auto-Merchant System

let autoMerchantSettings = {
    enabled: false,
    autoBuyEnabled: false,
    notifyRareItems: true,
    budget: 10000,
    priorityItems: [],
    blacklist: [],
    autoRefresh: true
};

class AutoMerchant {
    constructor() {
        this.load();
        this.purchaseHistory = [];
    }

    load() {
        const saved = localStorage.getItem('autoMerchantSettings');
        if (saved) {
            autoMerchantSettings = { ...autoMerchantSettings, ...JSON.parse(saved) };
        }
        
        const history = localStorage.getItem('merchantPurchaseHistory');
        if (history) {
            this.purchaseHistory = JSON.parse(history);
        }
    }

    save() {
        localStorage.setItem('autoMerchantSettings', JSON.stringify(autoMerchantSettings));
        localStorage.setItem('merchantPurchaseHistory', JSON.stringify(this.purchaseHistory.slice(-100)));
    }

    onMerchantSpawn(merchantType) {
        if (!autoMerchantSettings.enabled) return;
        
        console.log(`🛍️ Auto-Merchant: ${merchantType} spawned`);
        
        if (autoMerchantSettings.notifyRareItems) {
            this.checkRareItems(merchantType);
        }
        
        if (autoMerchantSettings.autoBuyEnabled) {
            this.performAutoBuy(merchantType);
        }
    }

    checkRareItems(merchantType) {
        const merchant = this.getMerchantData(merchantType);
        if (!merchant) return;
        
        for (const item of merchant.inventory) {
            if (this.isRareItem(item)) {
                if (typeof showNotification === 'function') {
                    showNotification(`🌟 RARE ITEM: ${item.name} available at ${merchantType}!`, 'info');
                }
            }
        }
    }

    isRareItem(item) {
        const rareCriteria = {
            minRarity: 100000,
            uniqueEffects: ['special', 'legendary', 'mythic']
        };
        
        if (item.rarity && item.rarity >= rareCriteria.minRarity) return true;
        if (item.effects && rareCriteria.uniqueEffects.some(e => item.effects.includes(e))) return true;
        
        return false;
    }

    performAutoBuy(merchantType) {
        const merchant = this.getMerchantData(merchantType);
        if (!merchant) return;
        
        let spent = 0;
        const purchased = [];
        
        for (const item of merchant.inventory) {
            if (autoMerchantSettings.blacklist.includes(item.name)) continue;
            if (spent + item.price > autoMerchantSettings.budget) continue;
            if (gameState.money < item.price) continue;
            
            const isPriority = autoMerchantSettings.priorityItems.includes(item.name);
            const shouldBuy = isPriority || this.shouldBuyItem(item);
            
            if (shouldBuy) {
                if (this.buyItem(item)) {
                    spent += item.price;
                    purchased.push(item.name);
                    
                    this.purchaseHistory.push({
                        item: item.name,
                        price: item.price,
                        merchant: merchantType,
                        timestamp: Date.now()
                    });
                }
            }
        }
        
        if (purchased.length > 0) {
            console.log(`🛍️ Auto-bought: ${purchased.join(', ')} for $${spent}`);
            if (typeof showNotification === 'function') {
                showNotification(`🛍️ Auto-bought ${purchased.length} items for $${spent.toLocaleString()}`);
            }
        }
        
        this.save();
    }

    shouldBuyItem(item) {
        if (item.type === 'potion' && item.rarity > 10000) return true;
        if (item.type === 'gear' && item.tier >= 5) return true;
        if (item.type === 'item' && item.rare) return true;
        
        return false;
    }

    buyItem(item) {
        if (gameState.money < item.price) return false;
        
        gameState.money -= item.price;
        
        if (item.type === 'potion') {
            if (!gameState.inventory.potions[item.name]) {
                gameState.inventory.potions[item.name] = { count: 0 };
            }
            gameState.inventory.potions[item.name].count++;
        } else if (item.type === 'gear') {
            if (!gameState.inventory.gears[item.name]) {
                gameState.inventory.gears[item.name] = { count: 0, tier: item.tier };
            }
            gameState.inventory.gears[item.name].count++;
        } else if (item.type === 'item') {
            if (!gameState.inventory.items[item.name]) {
                gameState.inventory.items[item.name] = { count: 0 };
            }
            gameState.inventory.items[item.name].count++;
        }
        
        if (typeof saveGameState === 'function') saveGameState();
        if (typeof updateInventoryDisplay === 'function') updateInventoryDisplay();
        if (typeof updateMoneyDisplay === 'function') updateMoneyDisplay();
        
        return true;
    }

    getMerchantData(merchantType) {
        if (typeof window.currentMerchant !== 'undefined') {
            return window.currentMerchant;
        }
        return null;
    }

    openSettings() {
        let modal = document.getElementById('autoMerchantModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'autoMerchantModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h2>🛍️ Auto-Merchant</h2>
                        <button class="close-btn" onclick="autoMerchant.closeSettings()">✖</button>
                    </div>
                    <div class="modal-body" style="padding: 20px;">
                        <div style="display: grid; gap: 20px;">
                            <div style="background: rgba(59, 130, 246, 0.1); border: 2px solid #3b82f6; padding: 15px; border-radius: 8px;">
                                <h3 style="color: #93c5fd; margin-top: 0;">📊 Purchase History</h3>
                                <p style="color: #bfdbfe; margin: 10px 0;">
                                    <strong>Total Purchases:</strong> ${this.purchaseHistory.length}<br>
                                    <strong>Total Spent:</strong> $${this.purchaseHistory.reduce((sum, p) => sum + p.price, 0).toLocaleString()}<br>
                                    <strong>Last Purchase:</strong> ${this.purchaseHistory.length > 0 ? this.purchaseHistory[this.purchaseHistory.length - 1].item : 'None'}
                                </p>
                            </div>

                            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
                                <h3>⚙️ Settings</h3>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0; cursor: pointer;">
                                    <input type="checkbox" id="merchantEnabledCheck" ${autoMerchantSettings.enabled ? 'checked' : ''}>
                                    <span>Enable auto-merchant</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0; cursor: pointer;">
                                    <input type="checkbox" id="autoBuyCheck" ${autoMerchantSettings.autoBuyEnabled ? 'checked' : ''}>
                                    <span>Auto-buy items</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0; cursor: pointer;">
                                    <input type="checkbox" id="notifyRareCheck" ${autoMerchantSettings.notifyRareItems ? 'checked' : ''}>
                                    <span>Notify on rare items</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                                    <span>Budget per merchant:</span>
                                    <input type="number" id="budgetInput" min="0" step="1000" value="${autoMerchantSettings.budget}" 
                                           style="width: 120px; padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">
                                </label>
                            </div>

                            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
                                <h3>⭐ Priority Items</h3>
                                <p style="color: #888; font-size: 0.9em;">Items to always buy (one per line)</p>
                                <textarea id="priorityItemsInput" rows="4" 
                                          style="width: 100%; padding: 10px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; font-family: monospace;">${autoMerchantSettings.priorityItems.join('\n')}</textarea>
                            </div>

                            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
                                <h3>🚫 Blacklist</h3>
                                <p style="color: #888; font-size: 0.9em;">Items to never buy (one per line)</p>
                                <textarea id="blacklistInput" rows="4" 
                                          style="width: 100%; padding: 10px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; font-family: monospace;">${autoMerchantSettings.blacklist.join('\n')}</textarea>
                            </div>

                            <button onclick="autoMerchant.saveSettings()" 
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
        const modal = document.getElementById('autoMerchantModal');
        if (modal) modal.classList.remove('show');
    }

    saveSettings() {
        autoMerchantSettings.enabled = document.getElementById('merchantEnabledCheck').checked;
        autoMerchantSettings.autoBuyEnabled = document.getElementById('autoBuyCheck').checked;
        autoMerchantSettings.notifyRareItems = document.getElementById('notifyRareCheck').checked;
        autoMerchantSettings.budget = parseInt(document.getElementById('budgetInput').value);
        autoMerchantSettings.priorityItems = document.getElementById('priorityItemsInput').value.split('\n').filter(x => x.trim());
        autoMerchantSettings.blacklist = document.getElementById('blacklistInput').value.split('\n').filter(x => x.trim());
        
        this.save();
        this.closeSettings();
        
        if (typeof showNotification === 'function') {
            showNotification('✅ Auto-merchant settings saved!');
        }
    }
}

const autoMerchant = new AutoMerchant();

window.autoMerchant = autoMerchant;
window.openAutoMerchant = () => autoMerchant.openSettings();

console.log('🛍️ Auto-Merchant loaded');
