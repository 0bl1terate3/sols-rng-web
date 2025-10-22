// =================================================================
// Local Backend Leaderboard System (Replaces Firebase)
// =================================================================
// Uses local Node.js backend instead of Firebase Firestore

class GlobalLeaderboard {
    constructor() {
        // Auto-detect backend URL based on environment
        this.isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        // Set backend URL
        if (this.isLocalDevelopment) {
            this.backendUrl = 'http://localhost:8090';
        } else {
            // PRODUCTION: Ngrok URL for local backend
            this.backendUrl = 'https://awilda-overmagnetic-deceptively.ngrok-free.dev';
        }
        
        this.firebaseInitialized = false; // Keep for compatibility
        this.playerName = null;
        this.playerId = null;
        this.leaderboardCache = [];
        this.lastUpdate = 0;
        this.collectedStatsCache = [];
        this.lastCollectedStatsUpdate = 0;
        this.cacheTimeout = 60000; // 1 minute cache
        
        // Leaderboard is now LOCAL - always enabled!
        this.LEADERBOARD_DISABLED = false;
        
        console.log(`🌐 Backend URL: ${this.backendUrl}`);
        
        // Auto-initialize
        this.initializeLocal();
    }

    // Initialize local backend (replaces Firebase init)
    async initializeLocal() {
        try {
            // Test backend connection
            const response = await fetch(this.backendUrl);
            if (response.ok) {
                console.log('✅ Local backend connected successfully');
                this.firebaseInitialized = true; // For compatibility
                
                // Get or create player ID
                this.playerId = this.getOrCreatePlayerId();
                
                return true;
            } else {
                console.warn('⚠️ Backend not responding. Make sure server is running on port 8090');
                return false;
            }
        } catch (error) {
            console.warn('⚠️ Could not connect to local backend:', error.message);
            console.log('💡 Start the backend with: cd backend && npm start');
            return false;
        }
    }

    // Dummy method for compatibility (no longer needed)
    async initializeFirebase(firebaseConfig) {
        return this.initializeLocal();
    }

    // Get or create a unique player ID
    getOrCreatePlayerId() {
        let playerId = localStorage.getItem('playerLeaderboardId');
        if (!playerId) {
            playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('playerLeaderboardId', playerId);
        }
        return playerId;
    }

    // Get player's current name
    getPlayerName() {
        let name = localStorage.getItem('playerLeaderboardName');
        if (!name) {
            name = this.promptForName();
        }
        this.playerName = name;
        return name;
    }

    // Prompt player to set their name
    promptForName() {
        const name = prompt('Enter your name for the Global Leaderboard (3-20 characters):', '');
        if (name && name.length >= 3 && name.length <= 20) {
            const cleanName = name.replace(/[^a-zA-Z0-9_\s-]/g, '').trim();
            if (cleanName.length >= 3) {
                localStorage.setItem('playerLeaderboardName', cleanName);
                return cleanName;
            }
        }
        const defaultName = 'Player_' + Math.random().toString(36).substr(2, 6);
        localStorage.setItem('playerLeaderboardName', defaultName);
        return defaultName;
    }

    // Change player name
    async changePlayerName(newName) {
        if (!newName || newName.length < 3 || newName.length > 20) {
            alert('Name must be between 3 and 20 characters!');
            return false;
        }

        const cleanName = newName.replace(/[^a-zA-Z0-9_\s-]/g, '').trim();
        if (cleanName.length < 3) {
            alert('Invalid name! Use only letters, numbers, spaces, hyphens, and underscores.');
            return false;
        }

        localStorage.setItem('playerLeaderboardName', cleanName);
        this.playerName = cleanName;

        console.log('✅ Player name updated locally');
        return true;
    }

    // Check if an aura qualifies for the leaderboard (globals only)
    isGlobalAura(aura) {
        return aura.rarity > 99999998 || 
               aura.name === 'Memory: The Fallen' || 
               aura.name === 'Oblivion' || 
               aura.name === 'Eden' ||
               aura.name === 'THANEBORNE';
    }

    // Submit a global aura to the leaderboard
    async submitGlobalAura(aura, rollCount) {
        if (this.LEADERBOARD_DISABLED) {
            console.log('🔴 Leaderboard disabled - submission skipped');
            return;
        }

        if (!this.firebaseInitialized) {
            console.log('Leaderboard not initialized (backend not available)');
            return;
        }

        if (!this.isGlobalAura(aura)) {
            return; // Not a global aura
        }

        try {
            const playerName = this.getPlayerName();
            
            // Submit to local backend
            const response = await fetch(`${this.backendUrl}/leaderboard/globals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playerId: this.playerId,
                    playerName: playerName,
                    auraName: aura.name,
                    auraRarity: aura.rarity,
                    auraTier: aura.tier || 'transcendent',
                    rollCount: rollCount || 0,
                    timestamp: new Date().toISOString(),
                    submittedAt: Date.now()
                })
            });

            const result = await response.json();

            if (response.status === 409) {
                // Duplicate - already submitted
                console.log('⚠️ Already submitted this aura to leaderboard:', aura.name);
                return;
            }

            if (response.ok) {
                console.log('✅ Global aura submitted to leaderboard:', aura.name);
                
                // Send Discord webhook notification (if enabled)
                if (aura.rarity >= 1000000) {
                    this.sendLeaderboardWebhook(aura, playerName);
                }
                
                // Show notification
                this.showLeaderboardNotification(aura.name);
                
                // Invalidate cache
                this.lastUpdate = 0;
            } else {
                console.error('❌ Error submitting to leaderboard:', result.error);
            }

        } catch (error) {
            console.error('❌ Error submitting to leaderboard:', error);
        }
    }

    // Show notification when submitted to leaderboard
    showLeaderboardNotification(auraName) {
        const notification = document.createElement('div');
        notification.className = 'leaderboard-notification';
        notification.innerHTML = `
            <div class="notification-icon">🏆</div>
            <div class="notification-content">
                <div class="notification-title">LEADERBOARD ENTRY!</div>
                <div class="notification-text">${auraName} added to Global Leaderboard</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    // Get top global auras from all players
    async getTopGlobals(limit = 50) {
        if (this.LEADERBOARD_DISABLED) {
            console.log('🔴 Leaderboard disabled');
            return [];
        }

        if (!this.firebaseInitialized) {
            return [];
        }

        // Check cache
        const now = Date.now();
        if (this.leaderboardCache.length > 0 && (now - this.lastUpdate) < this.cacheTimeout) {
            return this.leaderboardCache.slice(0, limit);
        }

        try {
            const response = await fetch(`${this.backendUrl}/leaderboard/globals?limit=${limit}`);
            if (!response.ok) {
                throw new Error('Failed to fetch leaderboard');
            }

            const data = await response.json();
            this.leaderboardCache = data.entries || [];
            this.lastUpdate = now;

            return this.leaderboardCache;

        } catch (error) {
            console.error('❌ Error fetching leaderboard:', error);
            return [];
        }
    }

    // Get player's collected auras
    async getPlayerCollectedAuras(playerId = null) {
        if (this.LEADERBOARD_DISABLED) {
            return [];
        }

        if (!this.firebaseInitialized) {
            return [];
        }

        const targetPlayerId = playerId || this.playerId;

        try {
            const response = await fetch(`${this.backendUrl}/leaderboard/globals?limit=1000`);
            if (!response.ok) {
                throw new Error('Failed to fetch leaderboard');
            }

            const data = await response.json();
            const playerEntries = data.entries.filter(entry => entry.playerId === targetPlayerId);

            return playerEntries;

        } catch (error) {
            console.error('❌ Error fetching player auras:', error);
            return [];
        }
    }

    // Get statistics about collected auras (all players)
    async getCollectedAuraStats() {
        if (this.LEADERBOARD_DISABLED) {
            return {};
        }

        // Check cache
        const now = Date.now();
        if (this.collectedStatsCache.length > 0 && (now - this.lastCollectedStatsUpdate) < this.cacheTimeout) {
            return this.collectedStatsCache;
        }

        try {
            const response = await fetch(`${this.backendUrl}/leaderboard/globals?limit=10000`);
            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }

            const data = await response.json();
            const entries = data.entries || [];

            // Count unique players per aura
            const stats = {};
            entries.forEach(entry => {
                if (!stats[entry.auraName]) {
                    stats[entry.auraName] = new Set();
                }
                stats[entry.auraName].add(entry.playerId);
            });

            // Convert sets to counts
            const result = {};
            Object.keys(stats).forEach(auraName => {
                result[auraName] = stats[auraName].size;
            });

            this.collectedStatsCache = result;
            this.lastCollectedStatsUpdate = now;

            return result;

        } catch (error) {
            console.error('❌ Error fetching stats:', error);
            return {};
        }
    }

    // Calculate Collected Stats (sum of unique aura rarities)
    calculateCollectedStats(gameState) {
        if (!gameState || !gameState.inventory || !gameState.inventory.auras) {
            return { totalScore: 0, uniqueAuras: 0, aurasList: [] };
        }

        const AURAS_ARRAY = typeof AURAS !== 'undefined' ? AURAS : [];
        let totalScore = 0;
        let uniqueAuras = 0;
        const aurasList = [];

        // For each unique aura in inventory, add its rarity to total
        for (const auraName in gameState.inventory.auras) {
            const baseAura = AURAS_ARRAY.find(a => a.name === auraName);
            if (baseAura) {
                totalScore += baseAura.rarity;
                uniqueAuras++;
                aurasList.push({
                    name: auraName,
                    rarity: baseAura.rarity,
                    tier: baseAura.tier
                });
            }
        }

        return { totalScore, uniqueAuras, aurasList };
    }

    // Submit or update Collected Stats to leaderboard
    async submitCollectedStats(gameState) {
        if (this.LEADERBOARD_DISABLED) {
            console.log('🔴 Leaderboard disabled - stats submission skipped');
            return;
        }

        if (!this.firebaseInitialized) {
            console.log('Collected Stats submission skipped (backend not initialized)');
            return;
        }

        try {
            const playerName = this.getPlayerName();
            const stats = this.calculateCollectedStats(gameState);

            if (stats.uniqueAuras === 0) {
                return; // No auras collected yet
            }

            // Submit to local backend (collectedStats leaderboard)
            const response = await fetch(`${this.backendUrl}/leaderboard/collectedStats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playerId: this.playerId,
                    playerName: playerName,
                    totalScore: stats.totalScore,
                    uniqueAuras: stats.uniqueAuras,
                    timestamp: new Date().toISOString(),
                    lastUpdated: Date.now()
                })
            });

            if (response.ok) {
                console.log('✅ Collected Stats submitted to leaderboard');
                this.collectedStatsCache = [];
                this.lastCollectedStatsUpdate = 0;
            } else {
                console.error('❌ Failed to submit collected stats:', await response.text());
            }

        } catch (error) {
            console.error('❌ Error submitting collected stats:', error);
        }
    }

    // Send Discord webhook (keep for compatibility)
    sendLeaderboardWebhook(aura, playerName) {
        // Keep this method if you have Discord webhooks configured
        // Otherwise it's a no-op
        console.log('Discord webhook:', playerName, 'got', aura.name);
    }

    // Clear player's leaderboard entries (admin function)
    async clearPlayerEntries(playerId = null) {
        console.log('⚠️ Clear function not implemented for local backend');
        console.log('You can manually edit backend/leaderboards.json if needed');
        return false;
    }
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.globalLeaderboard = new GlobalLeaderboard();
    console.log('🎮 Local leaderboard system loaded');
}
