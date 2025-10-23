// =================================================================
// Global Roll Notifications - Notify all players of global aura rolls
// =================================================================

class GlobalNotifications {
    constructor() {
        this.db = null;
        this.initialized = false;
        this.listener = null;
        this.playerId = null;
        this.initRetries = 0;
        this.maxRetries = 5;
    }

    // Initialize system
    async initialize() {
        // Wait for Firebase to be ready
        if (typeof firebase === 'undefined' || !firebase.apps.length) {
            this.initRetries++;
            if (this.initRetries <= this.maxRetries) {
                if (this.initRetries === 1) console.log('⏳ Waiting for Firebase to initialize global notifications...');
                setTimeout(() => this.initialize(), 2000);
            } else {
                console.log('❌ Firebase failed to initialize. Global notifications disabled.');
            }
            return;
        }

        this.db = firebase.firestore();
        this.playerId = localStorage.getItem('playerId');
        
        this.initialized = true;
        console.log('🌍 Global notifications initialized');

        // Start listening for global rolls
        this.startListening();
    }

    // Listen for new global rolls
    startListening() {
        // Listen to last 10 rolls from the past 5 minutes
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        
        this.listener = this.db.collection('globalRolls')
            .where('timestamp', '>', fiveMinutesAgo)
            .orderBy('timestamp', 'desc')
            .limit(10)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const roll = change.doc.data();
                        
                        // Don't notify for our own rolls
                        if (roll.playerId === this.playerId) {
                            return;
                        }
                        
                        // Only show if this is a recent roll (within last 10 seconds)
                        if (Date.now() - roll.timestamp < 10000) {
                            this.showGlobalNotification(roll);
                        }
                    }
                });
            });
    }

    // Broadcast a global roll
    async broadcastGlobalRoll(auraName, rarity, playerName) {
        if (!this.initialized) return;

        try {
            await this.db.collection('globalRolls').add({
                playerId: this.playerId,
                playerName: playerName || localStorage.getItem('playerName') || 'Anonymous',
                auraName: auraName,
                rarity: rarity,
                timestamp: Date.now()
            });

            console.log('🌍 Broadcasted global roll:', auraName);
        } catch (error) {
            console.error('Error broadcasting global roll:', error);
        }
    }

    // Show notification for someone else's global roll
    showGlobalNotification(roll) {
        const rarityText = this.formatRarity(roll.rarity);
        
        // Show in-game notification
        if (typeof showNotification === 'function') {
            showNotification(
                `🌍 ${roll.playerName} just rolled ${roll.auraName}! (1:${rarityText})`,
                'info'
            );
        }

        // Create fancy popup notification
        this.createPopupNotification(roll, rarityText);
        
        console.log(`🌍 ${roll.playerName} rolled ${roll.auraName}`);
    }

    // Create fancy popup notification
    createPopupNotification(roll, rarityText) {
        const popup = document.createElement('div');
        popup.className = 'global-notification-popup';
        popup.innerHTML = `
            <div class="global-notification-content">
                <div class="global-notification-icon">🌍</div>
                <div class="global-notification-text">
                    <p class="global-notification-title">GLOBAL ROLL!</p>
                    <p class="global-notification-player">${this.escapeHtml(roll.playerName)}</p>
                    <p class="global-notification-aura">${this.escapeHtml(roll.auraName)}</p>
                    <p class="global-notification-rarity">1:${rarityText}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);

        // Animate in
        setTimeout(() => {
            popup.classList.add('show');
        }, 100);

        // Auto-remove after 8 seconds
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
            }, 500);
        }, 8000);
    }

    // Format rarity number with suffixes
    formatRarity(rarity) {
        if (rarity >= 1000000000) {
            return (rarity / 1000000000).toFixed(2) + 'B';
        } else if (rarity >= 1000000) {
            return (rarity / 1000000).toFixed(2) + 'M';
        } else if (rarity >= 1000) {
            return (rarity / 1000).toFixed(2) + 'K';
        }
        return rarity.toLocaleString();
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Clean up old rolls (run periodically)
    async cleanupOldRolls() {
        if (!this.initialized) return;

        try {
            const oneHourAgo = Date.now() - (60 * 60 * 1000);
            const oldRolls = await this.db.collection('globalRolls')
                .where('timestamp', '<', oneHourAgo)
                .get();

            const batch = this.db.batch();
            oldRolls.forEach(doc => {
                batch.delete(doc.ref);
            });

            if (oldRolls.size > 0) {
                await batch.commit();
                console.log(`🧹 Cleaned up ${oldRolls.size} old global rolls`);
            }
        } catch (error) {
            console.error('Error cleaning up old rolls:', error);
        }
    }
}

// Create global instance
window.globalNotifications = new GlobalNotifications();

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.globalNotifications.initialize();
    });
} else {
    window.globalNotifications.initialize();
}

// Cleanup old rolls every 10 minutes
setInterval(() => {
    if (window.globalNotifications) {
        window.globalNotifications.cleanupOldRolls();
    }
}, 600000);
