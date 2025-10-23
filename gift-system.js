// =================================================================
// Gift System - Receive Auras from Admin
// =================================================================

class GiftSystem {
    constructor() {
        this.db = null;
        this.playerId = null;
        this.initialized = false;
        this.initRetries = 0;
        this.maxRetries = 5;
    }

    // Initialize gift system
    async initialize() {
        // Wait for Firebase to be ready
        if (typeof firebase === 'undefined' || !firebase.apps.length) {
            this.initRetries++;
            if (this.initRetries <= this.maxRetries) {
                if (this.initRetries === 1) console.log('⏳ Waiting for Firebase to initialize gift system...');
                setTimeout(() => this.initialize(), 2000);
            } else {
                console.log('❌ Firebase failed to initialize. Gift system disabled.');
            }
            return;
        }

        this.db = firebase.firestore();
        this.playerId = localStorage.getItem('playerId') || this.generatePlayerId();
        
        // Save player ID if newly generated
        if (!localStorage.getItem('playerId')) {
            localStorage.setItem('playerId', this.playerId);
        }

        this.initialized = true;
        console.log('🎁 Gift system initialized for player:', this.playerId);

        // Wait for player to have a name before registering
        // Check every 500ms until name is set
        const checkForName = setInterval(async () => {
            const playerName = localStorage.getItem('playerName');
            if (playerName) {
                clearInterval(checkForName);
                // Register/update player in database
                await this.registerPlayer();
                // Check for gifts on load
                await this.checkForGifts();
            }
        }, 500);
    }

    // Register player in database with name
    async registerPlayer() {
        try {
            const playerName = localStorage.getItem('playerName') || gameState?.playerName || 'Anonymous';
            const lastSeen = Date.now();
            const totalRolls = gameState?.totalRolls || 0;

            // Always update player info (this fixes old "Anonymous" entries)
            await this.db.collection('players').doc(this.playerId).set({
                playerId: this.playerId,
                playerName: playerName,
                lastSeen: lastSeen,
                totalRolls: totalRolls
            }, { merge: true });

            console.log('✅ Player registered:', playerName);
            
            // Also update it periodically while they're playing
            this.startPeriodicUpdate();
        } catch (error) {
            console.error('Error registering player:', error);
        }
    }

    // Update player info every 5 minutes while playing
    startPeriodicUpdate() {
        setInterval(async () => {
            try {
                const playerName = localStorage.getItem('playerName') || 'Anonymous';
                const lastSeen = Date.now();
                const totalRolls = gameState?.totalRolls || 0;

                await this.db.collection('players').doc(this.playerId).set({
                    playerName: playerName,
                    lastSeen: lastSeen,
                    totalRolls: totalRolls
                }, { merge: true });
            } catch (error) {
                console.error('Error updating player info:', error);
            }
        }, 300000); // Every 5 minutes
    }

    // Generate unique player ID
    generatePlayerId() {
        return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Check for pending gifts
    async checkForGifts() {
        if (!this.initialized) return;

        try {
            const giftsSnapshot = await this.db.collection('gifts')
                .where('playerId', '==', this.playerId)
                .where('claimed', '==', false)
                .get();

            if (giftsSnapshot.empty) {
                console.log('🎁 No pending gifts');
                return;
            }

            console.log(`🎁 Found ${giftsSnapshot.size} pending gift(s)!`);

            // Claim all gifts
            for (const doc of giftsSnapshot.docs) {
                await this.claimGift(doc);
            }
        } catch (error) {
            console.error('Error checking for gifts:', error);
        }
    }

    // Claim a single gift
    async claimGift(giftDoc) {
        try {
            const gift = giftDoc.data();
            
            // Add aura to inventory
            if (typeof gameState !== 'undefined' && gameState.inventory && gameState.inventory.auras) {
                if (!gameState.inventory.auras[gift.auraName]) {
                    gameState.inventory.auras[gift.auraName] = { count: 0 };
                }
                gameState.inventory.auras[gift.auraName].count += gift.count;

                // Save game state
                if (typeof saveGame === 'function') {
                    saveGame();
                }

                // Update UI
                if (typeof updateInventoryDisplay === 'function') {
                    updateInventoryDisplay();
                }

                console.log(`🎁 Claimed: ${gift.count}x ${gift.auraName}`);

                // Show notification if requested
                if (gift.notify) {
                    this.showGiftNotification(gift);
                }

                // Mark as claimed in Firestore
                await giftDoc.ref.update({
                    claimed: true,
                    claimedAt: Date.now()
                });

            } else {
                console.error('Game state not ready, cannot claim gift');
            }
        } catch (error) {
            console.error('Error claiming gift:', error);
        }
    }

    // Show gift notification popup
    showGiftNotification(gift) {
        if (typeof showNotification === 'function') {
            showNotification(`🎁 Admin Gift Received: ${gift.count}x ${gift.auraName}!`, 'success');
        }

        // Create fancy popup
        const popup = document.createElement('div');
        popup.className = 'gift-popup';
        popup.innerHTML = `
            <div class="gift-popup-content">
                <div class="gift-icon">🎁</div>
                <h2>Admin Gift Received!</h2>
                <div class="gift-details">
                    <p class="gift-aura">${gift.count}x ${gift.auraName}</p>
                    <p class="gift-message">Added to your inventory!</p>
                </div>
                <button class="gift-close-btn" onclick="this.parentElement.parentElement.remove()">
                    Awesome!
                </button>
            </div>
        `;
        document.body.appendChild(popup);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (popup.parentElement) {
                popup.remove();
            }
        }, 10000);
    }

    // Manual check for gifts (can be called from console)
    async manualCheck() {
        console.log('🎁 Manually checking for gifts...');
        await this.checkForGifts();
    }

    // Get player ID (for sharing with admin)
    getPlayerId() {
        console.log('Your Player ID:', this.playerId);
        console.log('Copy this ID and give it to the admin to receive gifts!');
        return this.playerId;
    }
}

// Create global instance
window.giftSystem = new GiftSystem();

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.giftSystem.initialize();
    });
} else {
    window.giftSystem.initialize();
}

// Add convenient console commands
window.getMyPlayerId = () => window.giftSystem.getPlayerId();
window.checkForGifts = () => window.giftSystem.manualCheck();
