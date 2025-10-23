// =================================================================
// Admin Actions Listener - Execute Admin Commands
// =================================================================

class AdminActionsListener {
    constructor() {
        this.db = null;
        this.playerId = null;
        this.initialized = false;
        this.listener = null;
        this.initRetries = 0;
        this.maxRetries = 5;
    }

    // Initialize listener
    async initialize() {
        // Wait for Firebase to be ready
        if (typeof firebase === 'undefined' || !firebase.apps.length) {
            this.initRetries++;
            if (this.initRetries <= this.maxRetries) {
                if (this.initRetries === 1) console.log('⏳ Waiting for Firebase to initialize admin actions...');
                setTimeout(() => this.initialize(), 2000);
            } else {
                console.log('❌ Firebase failed to initialize. Admin actions disabled.');
            }
            return;
        }

        this.db = firebase.firestore();
        this.playerId = localStorage.getItem('playerId');
        
        if (!this.playerId) {
            this.initRetries++;
            if (this.initRetries <= this.maxRetries) {
                setTimeout(() => this.initialize(), 2000);
            }
            return;
        }

        this.initialized = true;
        console.log('🎮 Admin actions listener initialized');

        // Start listening for admin actions
        this.startListening();
    }

    // Listen for admin actions
    startListening() {
        this.listener = this.db.collection('adminActions')
            .where('playerId', '==', this.playerId)
            .where('executed', '==', false)
            .onSnapshot((snapshot) => {
                snapshot.forEach(async (doc) => {
                    const action = doc.data();
                    console.log('📥 Received admin action:', action.type);
                    
                    // Execute action
                    await this.executeAction(action, doc.id);
                });
            });
    }

    // Execute admin action
    async executeAction(action, docId) {
        try {
            switch (action.type) {
                case 'forceNextRoll':
                    this.forceNextRoll(action);
                    break;
                case 'giveMoney':
                    this.giveMoney(action);
                    break;
                case 'setLuck':
                    this.setLuck(action);
                    break;
                case 'sendNotification':
                    this.sendNotification(action);
                    break;
                case 'setBiome':
                    this.setBiome(action);
                    break;
                case 'giveItems':
                    this.giveItems(action);
                    break;
                case 'resetPlayerData':
                    this.resetPlayerData(action);
                    break;
            }

            // Mark as executed
            await this.db.collection('adminActions').doc(docId).update({
                executed: true,
                executedAt: Date.now()
            });

        } catch (error) {
            console.error('Error executing admin action:', error);
        }
    }

    // Force next roll
    forceNextRoll(action) {
        if (typeof gameState !== 'undefined') {
            // Store forced aura for next roll
            gameState.forcedNextAura = action.auraName;
            
            if (typeof showNotification === 'function') {
                showNotification(`🎲 Admin has blessed your next roll! You will get: ${action.auraName}`, 'success');
            }
            
            console.log('✅ Next roll forced to:', action.auraName);
        }
    }

    // Give money
    giveMoney(action) {
        if (typeof gameState !== 'undefined') {
            gameState.money += action.amount;
            
            if (typeof updateUI === 'function') {
                updateUI();
            }
            
            if (typeof showNotification === 'function') {
                showNotification(`💰 Admin gave you $${action.amount.toLocaleString()}!`, 'success');
            }
            
            console.log('✅ Money added:', action.amount);
        }
    }

    // Set luck multiplier
    setLuck(action) {
        if (typeof gameState !== 'undefined') {
            const endTime = Date.now() + action.duration;
            
            // Add admin luck buff
            if (!gameState.activeEffects) {
                gameState.activeEffects = [];
            }
            
            gameState.activeEffects.push({
                name: '👑 Admin Luck Boost',
                luckMultiplier: action.multiplier,
                endTime: endTime,
                fromAdmin: true
            });
            
            if (typeof showNotification === 'function') {
                const minutes = Math.floor(action.duration / 60000);
                showNotification(`🍀 Admin gave you ${action.multiplier}x luck for ${minutes} minutes!`, 'success');
            }
            
            if (typeof recalculateStats === 'function') {
                recalculateStats();
            }
            
            console.log('✅ Luck set:', action.multiplier, 'x');
        }
    }

    // Send notification
    sendNotification(action) {
        if (typeof showNotification === 'function') {
            showNotification(`👑 Admin: ${action.message}`, action.notificationType || 'info');
        }
        
        // Also show as alert for important messages
        if (action.notificationType === 'warning' || action.notificationType === 'error') {
            alert(`Admin Message:\n\n${action.message}`);
        }
        
        console.log('✅ Notification sent:', action.message);
    }

    // Force biome
    setBiome(action) {
        if (typeof window.setBiome === 'function' && typeof biomeState !== 'undefined') {
            const minutes = Math.floor(action.duration / 60000);
            
            // Force set the biome using the global function
            window.setBiome(action.biome);
            
            // Lock it for the duration
            biomeState.lockedByAdmin = true;
            biomeState.adminLockEndTime = Date.now() + action.duration;
            
            if (typeof showNotification === 'function') {
                showNotification(`🌍 Admin forced ${action.biome} biome for ${minutes} minutes!`, 'success');
            }
            
            // Auto-unlock after duration
            setTimeout(() => {
                if (biomeState.lockedByAdmin) {
                    biomeState.lockedByAdmin = false;
                    delete biomeState.adminLockEndTime;
                    if (typeof showNotification === 'function') {
                        showNotification(`🌍 Admin biome lock expired - biomes will rotate normally`, 'info');
                    }
                }
            }, action.duration);
            
            console.log('✅ Biome forced to:', action.biome, 'for', minutes, 'minutes');
        }
    }

    // Give items
    giveItems(action) {
        if (typeof gameState !== 'undefined' && gameState.inventory) {
            const inventory = gameState.inventory;
            const type = action.itemType;
            const name = action.itemName;
            const count = action.count;
            
            if (type === 'potion' && inventory.potions) {
                if (!inventory.potions[name]) {
                    inventory.potions[name] = { count: 0 };
                }
                inventory.potions[name].count += count;
            } else if (type === 'item' && inventory.items) {
                if (!inventory.items[name]) {
                    inventory.items[name] = { count: 0 };
                }
                inventory.items[name].count += count;
            } else if (type === 'rune' && inventory.runes) {
                if (!inventory.runes[name]) {
                    inventory.runes[name] = { count: 0 };
                }
                inventory.runes[name].count += count;
            }
            
            if (typeof updateInventoryDisplay === 'function') {
                updateInventoryDisplay();
            }
            
            if (typeof showNotification === 'function') {
                showNotification(`📦 Admin gave you ${count}x ${name}!`, 'success');
            }
            
            console.log('✅ Items added:', count, 'x', name);
        }
    }

    // Reset player data
    async resetPlayerData(action) {
        if (typeof gameState !== 'undefined') {
            // Show warning notification
            if (typeof showNotification === 'function') {
                showNotification('⚠️ Admin is resetting ALL your data...', 'warning');
            }

            const playerId = localStorage.getItem('playerId');
            
            try {
                // Delete from global leaderboard
                console.log('🗑️ Deleting from global leaderboard...');
                const leaderboardQuery = await this.db.collection('globalLeaderboard')
                    .where('playerId', '==', playerId)
                    .get();
                
                const deletePromises = [];
                leaderboardQuery.forEach(doc => {
                    deletePromises.push(doc.ref.delete());
                });
                
                // Delete from collected stats leaderboard
                console.log('🗑️ Deleting from collected stats leaderboard...');
                const collectedStatsQuery = await this.db.collection('collectedStatsLeaderboard')
                    .where('playerId', '==', playerId)
                    .get();
                
                collectedStatsQuery.forEach(doc => {
                    deletePromises.push(doc.ref.delete());
                });
                
                // Delete from player stats leaderboard
                console.log('🗑️ Deleting from player stats leaderboard...');
                const playerStatsQuery = await this.db.collection('playerStats')
                    .where('playerId', '==', playerId)
                    .get();
                
                playerStatsQuery.forEach(doc => {
                    deletePromises.push(doc.ref.delete());
                });
                
                // Delete player document
                console.log('🗑️ Deleting player document...');
                const playerQuery = await this.db.collection('players')
                    .where('playerId', '==', playerId)
                    .get();
                
                playerQuery.forEach(doc => {
                    deletePromises.push(doc.ref.delete());
                });
                
                // Wait for all deletions
                await Promise.all(deletePromises);
                
                console.log('✅ All cloud data deleted (leaderboards + player document)');
            } catch (error) {
                console.error('Error deleting cloud data:', error);
            }
            
            // RESET gameState object FIRST (before clearing localStorage)
            console.log('🗑️ Resetting gameState object...');
            if (typeof gameState !== 'undefined') {
                // Reset to default state
                Object.keys(gameState).forEach(key => delete gameState[key]);
                
                // Reinitialize with fresh default state
                Object.assign(gameState, {
                    totalRolls: 0,
                    money: 0,
                    currentAura: null,
                    inventory: {
                        auras: {},
                        potions: {},
                        items: {},
                        runes: {},
                        gears: {}
                    },
                    currency: {
                        money: 0,
                        voidCoins: 0,
                        darkPoints: 0,
                        halloweenMedals: 0
                    },
                    achievements: {
                        unlocked: {},
                        stats: {}
                    },
                    equipment: {
                        head: null,
                        body: null,
                        legs: null,
                        feet: null,
                        weapon: null,
                        accessory: null
                    }
                });
            }
            
            // COMPLETELY CLEAR ALL localStorage - including playerId
            console.log('🗑️ Clearing ALL localStorage data...');
            localStorage.clear();
            
            // Also clear sessionStorage
            sessionStorage.clear();
            
            // Clear IndexedDB if it exists
            if (window.indexedDB) {
                try {
                    indexedDB.deleteDatabase('solsRngGame');
                } catch (e) {
                    console.log('Could not delete IndexedDB:', e);
                }
            }
            
            console.log('🗑️ Admin reset complete - reloading page...');
            
            // Show final notification
            alert('👑 Admin has COMPLETELY RESET your game data!\n\n✅ All progress deleted\n✅ All leaderboard entries deleted\n✅ All cloud data deleted\n✅ Player ID removed\n✅ Game state wiped\n\nThe page will now reload. You will need to set a new name.');
            
            // Force a hard reload (bypass cache)
            window.location.href = window.location.href.split('?')[0] + '?reset=' + Date.now();
        }
    }
}

// Create global instance
window.adminActionsListener = new AdminActionsListener();

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.adminActionsListener.initialize();
    });
} else {
    window.adminActionsListener.initialize();
}
