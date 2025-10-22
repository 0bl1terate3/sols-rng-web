// =================================================================
// Global Leaderboard System using Firebase Firestore
// =================================================================
// Tracks and displays players' best global aura rolls (rarity > 99,999,998)

class GlobalLeaderboard {
    constructor() {
        this.firebaseInitialized = false;
        this.db = null;
        this.playerName = null;
        this.playerId = null;
        this.leaderboardCache = [];
        this.lastUpdate = 0;
        this.collectedStatsCache = [];
        this.lastCollectedStatsUpdate = 0;
        this.cacheTimeout = 60000; // 1 minute cache
        this.isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        // 🔴 LEADERBOARD DISABLED - Saving Firebase quota
        // Global notifications still work! Only leaderboard features are disabled.
        this.LEADERBOARD_DISABLED = true;
    }

    // Initialize Firebase Firestore
    async initializeFirebase(firebaseConfig) {
        try {
            if (!this.firebaseInitialized && typeof firebase !== 'undefined') {
                // Initialize Firebase if not already done
                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                }
                
                // Initialize Firestore
                this.db = firebase.firestore();
                this.firebaseInitialized = true;
                
                // Get or create player ID
                this.playerId = this.getOrCreatePlayerId();
                
                // 🔴 LEADERBOARD DISABLED - Name prompt removed
                // Prompt for name after a short delay (non-blocking)
                // const hasName = localStorage.getItem('playerLeaderboardName');
                // if (!hasName) {
                //     setTimeout(() => {
                //         const name = this.promptForName();
                //         if (name) {
                //             console.log(`✅ Player name set: ${name}`);
                //         }
                //     }, 2000); // Wait 2 seconds after load to avoid interrupting game start
                // }
                
                console.log('✅ Global Leaderboard initialized with Firebase');
                return true;
            } else if (typeof firebase === 'undefined') {
                console.warn('⚠️ Firebase not available. Leaderboard disabled.');
                return false;
            }
        } catch (error) {
            console.error('❌ Error initializing Firebase for leaderboard:', error);
            return false;
        }
    }

    // Get or create a unique player ID
    getOrCreatePlayerId() {
        let playerId = localStorage.getItem('playerLeaderboardId');
        if (!playerId) {
            // Generate a unique ID
            playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('playerLeaderboardId', playerId);
        }
        return playerId;
    }

    // Get player's current name
    getPlayerName() {
        let name = localStorage.getItem('playerLeaderboardName');
        if (!name) {
            // Prompt for a name
            name = this.promptForName();
        }
        this.playerName = name;
        return name;
    }

    // Prompt player to set their name
    promptForName() {
        const name = prompt('Enter your name for the Global Leaderboard (3-20 characters):', '');
        if (name && name.length >= 3 && name.length <= 20) {
            // Clean the name (remove special characters)
            const cleanName = name.replace(/[^a-zA-Z0-9_\s-]/g, '').trim();
            if (cleanName.length >= 3) {
                localStorage.setItem('playerLeaderboardName', cleanName);
                return cleanName;
            }
        }
        // Default name if invalid
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

        // Update all existing records with new name
        if (this.firebaseInitialized) {
            try {
                const snapshot = await this.db.collection('globalLeaderboard')
                    .where('playerId', '==', this.playerId)
                    .get();
                
                const batch = this.db.batch();
                snapshot.docs.forEach(doc => {
                    batch.update(doc.ref, { playerName: cleanName });
                });
                await batch.commit();
                console.log('✅ Updated player name in leaderboard');
            } catch (error) {
                console.error('Error updating name:', error);
            }
        }

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
        if (!this.firebaseInitialized || this.isLocalDevelopment) {
            console.log('Leaderboard submission skipped (local mode or not initialized)');
            return;
        }

        if (!this.isGlobalAura(aura)) {
            return; // Not a global aura
        }

        try {
            const playerName = this.getPlayerName();
            
            // Check if player already submitted this aura (prevent duplicates)
            const existingEntry = await this.db.collection('globalLeaderboard')
                .where('playerId', '==', this.playerId)
                .where('auraName', '==', aura.name)
                .limit(1)
                .get();

            if (!existingEntry.empty) {
                console.log('⚠️ Already submitted this aura to leaderboard:', aura.name);
                return; // Already submitted this aura
            }

            const timestamp = firebase.firestore.FieldValue.serverTimestamp();

            // Create leaderboard entry
            const entry = {
                playerId: this.playerId,
                playerName: playerName,
                auraName: aura.name,
                auraRarity: aura.rarity,
                auraTier: aura.tier || 'transcendent',
                rollCount: rollCount || 0,
                timestamp: timestamp,
                submittedAt: Date.now()
            };

            // Add to Firestore
            await this.db.collection('globalLeaderboard').add(entry);
            
            console.log('✅ Global aura submitted to leaderboard:', aura.name);
            
            // Send Discord webhook notification (global)
            if (aura.rarity >= 1000000) {
                this.sendLeaderboardWebhook(aura, playerName);
            }
            
            // Show notification
            this.showLeaderboardNotification(aura.name);
            
            // Invalidate cache
            this.lastUpdate = 0;

        } catch (error) {
            console.error('❌ Error submitting to leaderboard:', error);
        }
    }

    // Show notification when submitted to leaderboard
    showLeaderboardNotification(auraName) {
        // Create notification element
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
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 5 seconds
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
            const snapshot = await this.db.collection('globalLeaderboard')
                .orderBy('auraRarity', 'desc')
                .orderBy('submittedAt', 'asc')
                .limit(limit)
                .get();

            const leaderboard = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                leaderboard.push({
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate() || new Date(data.submittedAt)
                });
            });

            // Update cache
            this.leaderboardCache = leaderboard;
            this.lastUpdate = now;

            return leaderboard;
        } catch (error) {
            console.error('❌ Error fetching leaderboard:', error);
            return [];
        }
    }

    // Get specific player's global auras
    async getPlayerGlobals(playerId = null) {
        if (this.LEADERBOARD_DISABLED) {
            console.log('🔴 Leaderboard disabled');
            return [];
        }
        if (!this.firebaseInitialized) {
            return [];
        }

        const targetPlayerId = playerId || this.playerId;

        try {
            const snapshot = await this.db.collection('globalLeaderboard')
                .where('playerId', '==', targetPlayerId)
                .orderBy('auraRarity', 'desc')
                .get();

            const playerGlobals = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                playerGlobals.push({
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate() || new Date(data.submittedAt)
                });
            });

            return playerGlobals;
        } catch (error) {
            console.error('❌ Error fetching player globals:', error);
            return [];
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
        if (!this.firebaseInitialized || this.isLocalDevelopment) {
            console.log('Collected Stats submission skipped (local mode or not initialized)');
            return;
        }

        try {
            const playerName = this.getPlayerName();
            const stats = this.calculateCollectedStats(gameState);

            if (stats.uniqueAuras === 0) {
                return; // No auras collected yet
            }

            // Check if player already has a Collected Stats entry
            const existingEntry = await this.db.collection('collectedStatsLeaderboard')
                .where('playerId', '==', this.playerId)
                .limit(1)
                .get();

            const timestamp = firebase.firestore.FieldValue.serverTimestamp();

            const entry = {
                playerId: this.playerId,
                playerName: playerName,
                totalScore: stats.totalScore,
                uniqueAuras: stats.uniqueAuras,
                timestamp: timestamp,
                lastUpdated: Date.now()
            };

            if (!existingEntry.empty) {
                // Update existing entry
                const docRef = existingEntry.docs[0].ref;
                await docRef.update(entry);
                console.log('✅ Collected Stats updated on leaderboard');
            } else {
                // Create new entry
                await this.db.collection('collectedStatsLeaderboard').add(entry);
                console.log('✅ Collected Stats submitted to leaderboard');
            }

            // Invalidate cache
            this.collectedStatsCache = [];
            this.lastCollectedStatsUpdate = 0;

        } catch (error) {
            console.error('❌ Error submitting Collected Stats:', error);
        }
    }

    // Get top Collected Stats from all players
    async getTopCollectedStats(limit = 50) {
        if (this.LEADERBOARD_DISABLED) {
            console.log('🔴 Leaderboard disabled');
            return [];
        }
        if (!this.firebaseInitialized) {
            return [];
        }

        // Check cache
        const now = Date.now();
        if (this.collectedStatsCache && this.collectedStatsCache.length > 0 && 
            (now - (this.lastCollectedStatsUpdate || 0)) < this.cacheTimeout) {
            return this.collectedStatsCache.slice(0, limit);
        }

        try {
            const snapshot = await this.db.collection('collectedStatsLeaderboard')
                .orderBy('totalScore', 'desc')
                .orderBy('lastUpdated', 'asc')
                .limit(limit)
                .get();

            const leaderboard = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                leaderboard.push({
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate() || new Date(data.lastUpdated)
                });
            });

            // Update cache
            this.collectedStatsCache = leaderboard;
            this.lastCollectedStatsUpdate = now;

            return leaderboard;
        } catch (error) {
            console.error('❌ Error fetching Collected Stats leaderboard:', error);
            return [];
        }
    }

    // Get leaderboard statistics
    async getLeaderboardStats() {
        if (this.LEADERBOARD_DISABLED) {
            console.log('🔴 Leaderboard disabled');
            return null;
        }
        if (!this.firebaseInitialized) {
            return null;
        }

        try {
            const snapshot = await this.db.collection('globalLeaderboard').get();
            
            const stats = {
                totalEntries: snapshot.size,
                uniquePlayers: new Set(),
                rarestAura: null,
                mostCommonGlobal: {}
            };

            snapshot.forEach(doc => {
                const data = doc.data();
                stats.uniquePlayers.add(data.playerId);
                
                // Track rarest
                if (!stats.rarestAura || data.auraRarity > stats.rarestAura.rarity) {
                    stats.rarestAura = {
                        name: data.auraName,
                        rarity: data.auraRarity,
                        player: data.playerName
                    };
                }

                // Count most common global
                if (!stats.mostCommonGlobal[data.auraName]) {
                    stats.mostCommonGlobal[data.auraName] = 0;
                }
                stats.mostCommonGlobal[data.auraName]++;
            });

            stats.uniquePlayers = stats.uniquePlayers.size;

            return stats;
        } catch (error) {
            console.error('❌ Error fetching stats:', error);
            return null;
        }
    }

    // Display leaderboard UI
    async displayLeaderboard() {
        const leaderboard = await this.getTopGlobals(100);
        const playerGlobals = await this.getPlayerGlobals();
        const stats = await this.getLeaderboardStats();
        const collectedStats = await this.getTopCollectedStats(100);
        
        // Calculate player's own collected stats
        const playerCollectedStats = typeof gameState !== 'undefined' ? this.calculateCollectedStats(gameState) : null;

        // Create or get leaderboard modal
        let modal = document.getElementById('leaderboardModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'leaderboardModal';
            modal.className = 'leaderboard-modal';
            document.body.appendChild(modal);
        }

        // Build HTML
        let html = `
            <div class="leaderboard-content">
                <div class="leaderboard-header">
                    <h2>🏆 Global Leaderboard</h2>
                    <button class="close-btn" onclick="window.globalLeaderboard.closeLeaderboard()">✕</button>
                </div>

                ${stats ? `
                <div class="leaderboard-stats">
                    <div class="stat-box">
                        <div class="stat-label">Total Global Rolls</div>
                        <div class="stat-value">${stats.totalEntries}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Players on Board</div>
                        <div class="stat-value">${stats.uniquePlayers}</div>
                    </div>
                    ${stats.rarestAura ? `
                    <div class="stat-box">
                        <div class="stat-label">Rarest Global</div>
                        <div class="stat-value">${stats.rarestAura.name}</div>
                        <div class="stat-subtext">by ${stats.rarestAura.player}</div>
                    </div>
                    ` : ''}
                </div>
                ` : ''}

                <div class="leaderboard-tabs">
                    <button class="tab-btn active" onclick="window.globalLeaderboard.switchTab('global')">
                        🌍 Global Top 100
                    </button>
                    <button class="tab-btn" onclick="window.globalLeaderboard.switchTab('personal')">
                        👤 Your Globals (${playerGlobals.length})
                    </button>
                    <button class="tab-btn" onclick="window.globalLeaderboard.switchTab('collected')">
                        📚 Collected Stats
                    </button>
                </div>

                <div class="leaderboard-player-info">
                    <span>Your Name: <strong>${this.playerName || 'Not Set'}</strong></span>
                    <button class="change-name-btn" onclick="window.globalLeaderboard.promptNameChange()">Change Name</button>
                </div>

                <div class="leaderboard-tab-content" id="globalTab">
                    <div class="leaderboard-list">
                        ${this.renderLeaderboardEntries(leaderboard)}
                    </div>
                </div>

                <div class="leaderboard-tab-content" id="personalTab" style="display: none;">
                    <div class="leaderboard-list">
                        ${this.renderLeaderboardEntries(playerGlobals, true)}
                    </div>
                </div>

                <div class="leaderboard-tab-content" id="collectedTab" style="display: none;">
                    ${playerCollectedStats ? `
                    <div class="collected-stats-info">
                        <div class="stat-highlight">
                            <span class="stat-label">Your Score:</span>
                            <span class="stat-value">${this.formatNumber(playerCollectedStats.totalScore)}</span>
                        </div>
                        <div class="stat-highlight">
                            <span class="stat-label">Unique Auras:</span>
                            <span class="stat-value">${playerCollectedStats.uniqueAuras}</span>
                        </div>
                        <button class="submit-stats-btn" onclick="window.globalLeaderboard.submitCollectedStats(gameState)">
                            🔄 Update My Stats
                        </button>
                    </div>
                    ` : ''}
                    <div class="leaderboard-list">
                        ${this.renderCollectedStatsEntries(collectedStats)}
                    </div>
                </div>
            </div>
        `;

        modal.innerHTML = html;
        modal.style.display = 'flex';
    }

    // Render leaderboard entries
    renderLeaderboardEntries(entries, isPersonal = false) {
        if (entries.length === 0) {
            return `<div class="no-entries">
                ${isPersonal ? 'You haven\'t rolled any global auras yet!' : 'No entries yet. Be the first!'}
            </div>`;
        }

        let html = '<div class="leaderboard-entries">';
        entries.forEach((entry, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const isPlayer = entry.playerId === this.playerId;
            const rarityFormatted = this.formatNumber(entry.auraRarity);
            const date = entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : 'Unknown';

            html += `
                <div class="leaderboard-entry ${rankClass} ${isPlayer ? 'player-entry' : ''}">
                    <div class="entry-rank">${this.getRankIcon(rank)}</div>
                    <div class="entry-details">
                        <div class="entry-aura">${entry.auraName}</div>
                        <div class="entry-meta">
                            <span class="entry-player">${entry.playerName}${isPlayer ? ' (You)' : ''}</span>
                            <span class="entry-rarity">1:${rarityFormatted}</span>
                            <span class="entry-date">${date}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }

    // Render Collected Stats leaderboard entries
    renderCollectedStatsEntries(entries) {
        if (entries.length === 0) {
            return `<div class="no-entries">
                No entries yet. Collect more auras and submit your stats!
            </div>`;
        }

        let html = '<div class="leaderboard-entries">';
        entries.forEach((entry, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const isPlayer = entry.playerId === this.playerId;
            const scoreFormatted = this.formatNumber(entry.totalScore);

            html += `
                <div class="leaderboard-entry ${rankClass} ${isPlayer ? 'player-entry' : ''}">
                    <div class="entry-rank">${this.getRankIcon(rank)}</div>
                    <div class="entry-details">
                        <div class="entry-aura">${entry.playerName}${isPlayer ? ' (You)' : ''}</div>
                        <div class="entry-meta">
                            <span class="entry-rarity">Score: ${scoreFormatted}</span>
                            <span class="entry-player">${entry.uniqueAuras} Unique Auras</span>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }

    // Get rank icon
    getRankIcon(rank) {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    }

    // Format large numbers
    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toLocaleString();
    }

    // Switch between tabs
    switchTab(tabName) {
        const globalTab = document.getElementById('globalTab');
        const personalTab = document.getElementById('personalTab');
        const collectedTab = document.getElementById('collectedTab');
        const buttons = document.querySelectorAll('.leaderboard-tabs .tab-btn');

        buttons.forEach(btn => btn.classList.remove('active'));

        if (tabName === 'global') {
            globalTab.style.display = 'block';
            personalTab.style.display = 'none';
            if (collectedTab) collectedTab.style.display = 'none';
            buttons[0].classList.add('active');
        } else if (tabName === 'personal') {
            globalTab.style.display = 'none';
            personalTab.style.display = 'block';
            if (collectedTab) collectedTab.style.display = 'none';
            buttons[1].classList.add('active');
        } else if (tabName === 'collected') {
            globalTab.style.display = 'none';
            personalTab.style.display = 'none';
            if (collectedTab) collectedTab.style.display = 'block';
            buttons[2].classList.add('active');
        }
    }

    // Prompt for name change
    async promptNameChange() {
        const newName = prompt('Enter your new name for the Global Leaderboard (3-20 characters):', this.playerName || '');
        if (newName) {
            const success = await this.changePlayerName(newName);
            if (success) {
                alert('✅ Name changed successfully!');
                // Refresh leaderboard
                this.displayLeaderboard();
            }
        }
    }

    // Send Discord webhook for leaderboard submission (global)
    async sendLeaderboardWebhook(aura, playerName) {
        try {
            // Fetch global webhook from Firestore
            if (typeof window.getWebhookForCategory !== 'function') {
                console.log('⚠️ Webhook function not available yet');
                return;
            }
            
            const webhook = await window.getWebhookForCategory('rareAuras');
            if (!webhook) {
                console.log('ℹ️ No webhook configured for rare auras');
                return;
            }
            
            const auraRarity = aura.rarity || aura.baseRarity;
            const rarityText = auraRarity.toLocaleString();
            
            // Determine color based on rarity
            let color = 0x00d9ff; // Default cyan
            if (auraRarity >= 1000000000) {
                color = 0xff00ff; // Purple for 1B+
            } else if (auraRarity >= 500000000) {
                color = 0xff0000; // Red for 500M+
            } else if (auraRarity >= 100000000) {
                color = 0xff6b00; // Orange for 100M+
            } else if (auraRarity >= 10000000) {
                color = 0xffd700; // Gold for 10M+
            }
            
            const embed = {
                title: `🌟 ${aura.name} Found!`,
                description: `**${playerName}** has found **${aura.name}** with a chance of **1 in ${rarityText}**!`,
                color: color,
                timestamp: new Date().toISOString(),
                footer: { text: 'Sol\'s RNG Global Leaderboard' }
            };
            
            await fetch(webhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });
            
            console.log('🔔 Discord webhook sent for global aura:', aura.name);
        } catch (error) {
            console.error('❌ Error sending leaderboard webhook:', error);
        }
    }

    // Close leaderboard
    closeLeaderboard() {
        const modal = document.getElementById('leaderboardModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Create global instance
window.globalLeaderboard = new GlobalLeaderboard();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlobalLeaderboard;
}
