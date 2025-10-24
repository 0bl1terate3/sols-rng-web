// System Integrations - Connects all enhancement systems

(function() {
    'use strict';

    const originalCompleteRoll = window.completeRoll;
    if (originalCompleteRoll) {
        window.completeRoll = function(result) {
            if (window.analyticsDashboard) {
                analyticsDashboard.trackRoll();
                if (result) analyticsDashboard.trackAura();
            }
            return originalCompleteRoll.apply(this, arguments);
        };
    }

    const originalAddMoney = window.addMoney;
    if (originalAddMoney) {
        window.addMoney = function(amount) {
            const result = originalAddMoney.apply(this, arguments);
            if (window.analyticsDashboard && gameState) {
                analyticsDashboard.trackMoney(gameState.money);
            }
            return result;
        };
    }

    const originalCraftPotion = window.craftPotion;
    if (originalCraftPotion) {
        window.craftPotion = function(name) {
            const result = originalCraftPotion.apply(this, arguments);
            if (window.analyticsDashboard) {
                analyticsDashboard.trackCraft();
            }
            return result;
        };
    }

    const originalCraftGear = window.craftGear;
    if (originalCraftGear) {
        window.craftGear = function(name) {
            const result = originalCraftGear.apply(this, arguments);
            if (window.analyticsDashboard) {
                analyticsDashboard.trackCraft();
            }
            return result;
        };
    }

    setInterval(() => {
        if (window.inventoryManager && inventoryManagerSettings.lowStockAlerts) {
            const lowStock = inventoryManager.getLowStockItems();
            if (lowStock.length > 0 && Math.random() < 0.1) {
                console.log(`⚠️ Low stock: ${lowStock.length} items`);
            }
        }
    }, 60000);

    if (typeof spawnMerchant !== 'undefined') {
        const originalSpawnMerchant = window.spawnMerchant;
        window.spawnMerchant = function(type) {
            const result = originalSpawnMerchant.apply(this, arguments);
            if (window.autoMerchant) {
                setTimeout(() => autoMerchant.onMerchantSpawn(type), 500);
            }
            return result;
        };
    }

    window.addEventListener('beforeunload', () => {
        if (window.analyticsDashboard) {
            analyticsDashboard.endSession();
        }
    });

    console.log('🔗 System integrations initialized');
})();
