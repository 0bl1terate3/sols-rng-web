// =================================================================
// Admin Panel - Force Refresh & Update System
// =================================================================
// Only accessible with admin password

class AdminPanel {
    constructor() {
        this.isAdmin = false;
        // DO NOT store password in memory for security
        this.db = null;
        this.panel = null;
        this.firebaseInitialized = false;
    }

    // Initialize admin panel
    async initialize() {
        // Wait for Firebase to be ready
        if (typeof firebase === 'undefined' || !firebase.apps.length) {
            console.log('Waiting for Firebase to initialize...');
            setTimeout(() => this.initialize(), 1000);
            return;
        }

        this.db = firebase.firestore();
        this.firebaseInitialized = true; // Mark Firebase as ready
        
        // Create admin panel UI
        this.createAdminPanel();
        
        // Listen for Ctrl+Shift+P to open admin panel
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.showAdminPanel();
            }
        });

        // Admin panel ready (no console log to avoid exposing shortcut)
    }

    // Create admin panel UI
    createAdminPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'adminPanel';
        this.panel.className = 'admin-panel';
        this.panel.style.display = 'none';
        this.panel.innerHTML = `
            <div class="admin-panel-content">
                <div class="admin-header">
                    <h2>🔐 Admin Panel</h2>
                    <button class="admin-close-btn" onclick="window.adminPanel.hideAdminPanel()">✖</button>
                </div>

                <div class="admin-auth" id="adminAuth">
                    <h3>Enter Admin Password</h3>
                    <input type="password" id="adminPasswordInput" placeholder="Admin Password">
                    <button onclick="window.adminPanel.authenticate()">Login</button>
                    <p class="admin-hint">Hint: Set password in Firestore > admin/config</p>
                </div>

                <div class="admin-controls" id="adminControls" style="display: none;">
                    <h3>✅ Authenticated</h3>
                    
                    <div class="admin-section">
                        <h4>🔄 Force Refresh All Players</h4>
                        <p>This will immediately refresh all connected players' browsers</p>
                        <button class="admin-btn danger" onclick="window.adminPanel.forceRefreshAll()">
                            🔄 Force Refresh Everyone
                        </button>
                    </div>

                    <div class="admin-section">
                        <h4>📢 Broadcast Update Message</h4>
                        <input type="text" id="broadcastMessage" placeholder="UPDATE IN PROGRESS..." value="UPDATE IN PROGRESS...">
                        <label>
                            <input type="checkbox" id="autoRefreshCheck" checked>
                            Auto-refresh after 5 seconds
                        </label>
                        <label>
                            <input type="number" id="broadcastDuration" placeholder="Duration (ms)" value="30000">
                            Auto-clear after (milliseconds)
                        </label>
                        <button class="admin-btn" onclick="window.adminPanel.broadcastUpdate()">
                            📢 Broadcast Update
                        </button>
                        <button class="admin-btn warning" onclick="window.adminPanel.clearUpdate()">
                            Clear Active Update
                        </button>
                    </div>

                    <div class="admin-section">
                        <h4>🔢 Version Management</h4>
                        <input type="text" id="versionInput" placeholder="e.g., 2.5.0">
                        <button class="admin-btn" onclick="window.adminPanel.updateVersion()">
                            Update Version
                        </button>
                        <p class="admin-note">Changing version triggers auto-refresh on all clients</p>
                    </div>

                    <div class="admin-section">
                        <h4>👥 Active Players</h4>
                        <p>View recent players and their IDs</p>
                        <button class="admin-btn" onclick="window.adminPanel.viewPlayers()">
                            👥 View Player List
                        </button>
                        <div id="playerList" style="margin-top: 10px; display: none;"></div>
                    </div>

                    <div class="admin-section">
                        <h4>🎯 Player Control Center</h4>
                        <p>Control and interact with players</p>
                        <input type="text" id="controlPlayerId" placeholder="Player ID">
                        <input type="text" id="controlPlayerName" placeholder="Selected Player" readonly style="background: rgba(255,255,255,0.1);">
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                            <button class="admin-btn-small" onclick="window.adminPanel.forceNextRoll()">
                                🎲 Force Next Roll
                            </button>
                            <button class="admin-btn-small" onclick="window.adminPanel.giveMoney()">
                                💰 Give Money
                            </button>
                            <button class="admin-btn-small" onclick="window.adminPanel.setLuck()">
                                🍀 Set Luck
                            </button>
                            <button class="admin-btn-small" onclick="window.adminPanel.sendNotification()">
                                📢 Send Message
                            </button>
                            <button class="admin-btn-small" onclick="window.adminPanel.setBiome()">
                                🌍 Force Biome
                            </button>
                            <button class="admin-btn-small" onclick="window.adminPanel.giveItems()">
                                📦 Give Items
                            </button>
                            <button class="admin-btn-small danger" onclick="window.adminPanel.resetPlayerData()">
                                🗑️ Reset Data
                            </button>
                        </div>
                    </div>

                    <div class="admin-section">
                        <h4>⚠️ DANGER ZONE - Mass Actions</h4>
                        <p style="color: #ff6b6b;">Use these actions with extreme caution!</p>
                        
                        <button class="admin-btn danger" onclick="window.adminPanel.wipeAllLeaderboards()">
                            📊 WIPE ALL LEADERBOARDS
                        </button>
                        <p class="admin-note" style="color: #ffaa00; font-weight: bold;">
                            ⚠️ This will delete ALL leaderboard entries but keep player data!
                        </p>
                        
                        <button class="admin-btn danger" onclick="window.adminPanel.resetAllPlayers()">
                            🗑️ RESET ALL PLAYERS PROGRESS
                        </button>
                        <p class="admin-note" style="color: #ff6b6b; font-weight: bold;">
                            ⚠️ This will reset ALL players AND leaderboards! Cannot be undone!
                        </p>
                    </div>

                    <div class="admin-section">
                        <h4>🎁 Gift Aura to Player</h4>
                        <p>Send an aura directly to a player's inventory</p>
                        <input type="text" id="giftPlayerId" placeholder="Player ID (e.g., player_1234567890)">
                        <input type="text" id="giftPlayerName" placeholder="Player Name (optional - for your reference)" readonly style="background: rgba(255,255,255,0.1);">
                        <input type="text" id="giftAuraName" placeholder="Aura Name (e.g., Celestial)">
                        <input type="number" id="giftAuraCount" placeholder="Count" value="1" min="1">
                        <label>
                            <input type="checkbox" id="giftNotify" checked>
                            Notify player with popup
                        </label>
                        <button class="admin-btn" onclick="window.adminPanel.giftAura()">
                            🎁 Send Aura Gift
                        </button>
                        <p class="admin-note">Tip: Click on a player in the list above to auto-fill their ID</p>
                    </div>

                    <div class="admin-section">
                        <h4>🔔 Discord Webhook Configuration</h4>
                        <p style="color: #888; font-size: 0.9em; margin-bottom: 10px;">
                            Configure global Discord webhooks for player activities. These will broadcast events from all players.
                        </p>
                        
                        <div style="margin-bottom: 10px;">
                            <label style="font-weight: 600; color: #00d9ff;">🌟 Rare Auras (1M+)</label>
                            <input type="text" id="adminWebhookRareAuras" placeholder="https://discord.com/api/webhooks/..." 
                                   style="width: 100%; padding: 8px; margin-top: 4px; border-radius: 4px; border: 1px solid #444; background: #0f1419; color: #fff;">
                        </div>
                        
                        <div style="margin-bottom: 10px;">
                            <label style="font-weight: 600; color: #00d9ff;">🎲 Milestones (Rolls/Breakthroughs)</label>
                            <input type="text" id="adminWebhookMilestones" placeholder="https://discord.com/api/webhooks/..." 
                                   style="width: 100%; padding: 8px; margin-top: 4px; border-radius: 4px; border: 1px solid #444; background: #0f1419; color: #fff;">
                        </div>
                        
                        <div style="margin-bottom: 10px;">
                            <label style="font-weight: 600; color: #00d9ff;">🏆 Achievements</label>
                            <input type="text" id="adminWebhookAchievements" placeholder="https://discord.com/api/webhooks/..." 
                                   style="width: 100%; padding: 8px; margin-top: 4px; border-radius: 4px; border: 1px solid #444; background: #0f1419; color: #fff;">
                        </div>
                        
                        <div style="margin-bottom: 10px;">
                            <label style="font-weight: 600; color: #00d9ff;">🌍 Biome Changes</label>
                            <input type="text" id="adminWebhookBiomes" placeholder="https://discord.com/api/webhooks/..." 
                                   style="width: 100%; padding: 8px; margin-top: 4px; border-radius: 4px; border: 1px solid #444; background: #0f1419; color: #fff;">
                        </div>
                        
                        <div style="margin-bottom: 10px;">
                            <label style="font-weight: 600; color: #00d9ff;">📈 New Records</label>
                            <input type="text" id="adminWebhookRecords" placeholder="https://discord.com/api/webhooks/..." 
                                   style="width: 100%; padding: 8px; margin-top: 4px; border-radius: 4px; border: 1px solid #444; background: #0f1419; color: #fff;">
                        </div>
                        
                        <button class="admin-btn" onclick="window.adminPanel.saveWebhooks()">
                            💾 Save Webhooks
                        </button>
                        <button class="admin-btn" onclick="window.adminPanel.testAllWebhooks()">
                            🧪 Test All Webhooks
                        </button>
                        <p class="admin-note">These webhooks will receive events from ALL players globally.</p>
                    </div>

                    <div class="admin-section">
                        <h4>📊 Statistics</h4>
                        <div id="adminStats">Loading...</div>
                        <button class="admin-btn" onclick="window.adminPanel.refreshStats()">
                            Refresh Stats
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.panel);
    }

    // Show admin panel
    showAdminPanel() {
        this.panel.style.display = 'flex';
        if (this.isAdmin) {
            document.getElementById('adminAuth').style.display = 'none';
            document.getElementById('adminControls').style.display = 'block';
            this.loadWebhookSettings(); // Load webhook settings when opening panel
        }
    }

    // Hide admin panel
    hideAdminPanel() {
        this.panel.style.display = 'none';
    }

    // Authenticate admin
    async authenticate() {
        const inputPassword = document.getElementById('adminPasswordInput').value;
        
        if (!inputPassword) {
            alert('Please enter a password');
            return;
        }

        try {
            // Get admin password from Firestore
            const adminDoc = await this.db.collection('admin').doc('config').get();
            
            if (!adminDoc.exists) {
                alert('Admin config not found. Please set up admin password in Firestore:\n\nCollection: admin\nDocument: config\nField: password\nValue: your_secret_password');
                return;
            }

            const storedPassword = adminDoc.data().password;
            
            if (inputPassword === storedPassword) {
                this.isAdmin = true;
                // DO NOT store password - only auth status
                document.getElementById('adminAuth').style.display = 'none';
                document.getElementById('adminControls').style.display = 'block';
                // No console log to avoid exposing auth status
                
                // Clear the input field immediately
                document.getElementById('adminPasswordInput').value = '';
                
                this.refreshStats();
                this.loadWebhookSettings(); // Load webhook settings after login
            } else {
                alert('❌ Incorrect password');
                document.getElementById('adminPasswordInput').value = '';
            }
        } catch (error) {
            console.error('Authentication error:', error);
            alert('Error authenticating. Check console for details.');
        }
    }

    // Force refresh all players
    async forceRefreshAll() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const confirm = window.confirm('⚠️ This will IMMEDIATELY refresh all connected players.\n\nAre you sure?');
        if (!confirm) return;

        try {
            // Use existing update system
            if (window.updateSystem) {
                // Broadcast with 6 second auto-clear (players refresh at 5 seconds)
                await window.updateSystem.broadcastUpdate('🔄 UPDATING GAME... Page will refresh now!', true, 6000);
                alert('✅ Force refresh broadcasted!\n\nAll players will refresh in 5 seconds.\nUpdate will auto-clear in 6 seconds.\n\nYou can close this window now.');
            } else {
                alert('❌ Update system not available');
            }
        } catch (error) {
            console.error('Error force refreshing:', error);
            alert('Error: ' + error.message);
        }
    }

    // Broadcast update message
    async broadcastUpdate() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const message = document.getElementById('broadcastMessage').value;
        const autoRefresh = document.getElementById('autoRefreshCheck').checked;
        const duration = parseInt(document.getElementById('broadcastDuration').value);

        try {
            if (window.updateSystem) {
                await window.updateSystem.broadcastUpdate(message, autoRefresh, duration);
                alert('✅ Update broadcasted!');
            } else {
                alert('❌ Update system not available');
            }
        } catch (error) {
            console.error('Error broadcasting update:', error);
            alert('Error: ' + error.message);
        }
    }

    // Clear active update
    async clearUpdate() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        try {
            if (window.updateSystem) {
                await window.updateSystem.clearUpdate();
                alert('✅ Update cleared!');
            } else {
                alert('❌ Update system not available');
            }
        } catch (error) {
            console.error('Error clearing update:', error);
            alert('Error: ' + error.message);
        }
    }

    // Update version
    async updateVersion() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const version = document.getElementById('versionInput').value;
        if (!version) {
            alert('Please enter a version number');
            return;
        }

        const confirm = window.confirm(`⚠️ This will update the version to ${version} and trigger auto-refresh on all clients.\n\nAre you sure?`);
        if (!confirm) return;

        try {
            const database = firebase.database();
            await database.ref('appInfo/version').set(version);
            alert(`✅ Version updated to ${version}!\nAll clients will auto-refresh.`);
        } catch (error) {
            console.error('Error updating version:', error);
            alert('Error: ' + error.message);
        }
    }

    // View active players
    async viewPlayers() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const playerListDiv = document.getElementById('playerList');
        playerListDiv.innerHTML = '<p>Loading players...</p>';
        playerListDiv.style.display = 'block';

        try {
            const playersSnapshot = await this.db.collection('players')
                .orderBy('lastSeen', 'desc')
                .limit(50)
                .get();

            if (playersSnapshot.empty) {
                playerListDiv.innerHTML = '<p style="color: #888;">No players found yet.</p>';
                return;
            }

            let html = '<div style="max-height: 400px; overflow-y: auto; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 10px;">';
            
            playersSnapshot.forEach(doc => {
                const player = doc.data();
                const timeSince = this.getTimeSince(player.lastSeen);
                
                html += `
                    <div class="player-item" onclick="window.adminPanel.selectPlayer('${player.playerId}', '${player.playerName}')" 
                         style="background: rgba(255,255,255,0.05); padding: 10px; margin: 5px 0; border-radius: 5px; cursor: pointer; transition: all 0.3s;"
                         onmouseover="this.style.background='rgba(0,212,255,0.2)'" 
                         onmouseout="this.style.background='rgba(255,255,255,0.05)'">
                        <p style="margin: 0; color: #00d4ff; font-weight: bold;">👤 ${player.playerName}</p>
                        <p style="margin: 5px 0 0 0; font-size: 11px; color: #888;">ID: ${player.playerId}</p>
                        <p style="margin: 5px 0 0 0; font-size: 11px; color: #888;">Rolls: ${player.totalRolls || 0} • Last seen: ${timeSince}</p>
                    </div>
                `;
            });
            
            html += '</div>';
            playerListDiv.innerHTML = html;
        } catch (error) {
            console.error('Error loading players:', error);
            playerListDiv.innerHTML = '<p style="color: red;">Error loading players</p>';
        }
    }

    // Select player (auto-fill gift and control forms)
    selectPlayer(playerId, playerName) {
        // Fill gift form
        document.getElementById('giftPlayerId').value = playerId;
        document.getElementById('giftPlayerName').value = playerName;
        
        // Fill control form
        document.getElementById('controlPlayerId').value = playerId;
        document.getElementById('controlPlayerName').value = playerName;
        
        // Visual feedback
        if (typeof showNotification === 'function') {
            showNotification(`✅ Selected: ${playerName}`, 'info');
        }
    }

    // Get time since timestamp
    getTimeSince(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
        if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
        return Math.floor(seconds / 86400) + 'd ago';
    }

    // Force next roll for player
    async forceNextRoll() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const playerId = document.getElementById('controlPlayerId').value.trim();
        if (!playerId) {
            alert('Please select a player first');
            return;
        }

        const auraName = prompt('Enter aura name to force on their next roll:');
        if (!auraName) return;

        try {
            await this.db.collection('adminActions').add({
                type: 'forceNextRoll',
                playerId: playerId,
                auraName: auraName,
                timestamp: Date.now(),
                executed: false
            });

            alert(`✅ ${auraName} will be their next roll!`);
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    }

    // Give money to player
    async giveMoney() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const playerId = document.getElementById('controlPlayerId').value.trim();
        if (!playerId) {
            alert('Please select a player first');
            return;
        }

        const amount = prompt('Enter money amount to give:');
        if (!amount || isNaN(amount)) return;

        try {
            await this.db.collection('adminActions').add({
                type: 'giveMoney',
                playerId: playerId,
                amount: parseInt(amount),
                timestamp: Date.now(),
                executed: false
            });

            alert(`✅ $${amount} will be added to their account!`);
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    }

    // Set luck multiplier for player
    async setLuck() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const playerId = document.getElementById('controlPlayerId').value.trim();
        if (!playerId) {
            alert('Please select a player first');
            return;
        }

        const multiplier = prompt('Enter luck multiplier (e.g., 100 for 100x):');
        if (!multiplier || isNaN(multiplier)) return;

        const duration = prompt('Duration in minutes:', '10');
        if (!duration || isNaN(duration)) return;

        try {
            await this.db.collection('adminActions').add({
                type: 'setLuck',
                playerId: playerId,
                multiplier: parseFloat(multiplier),
                duration: parseInt(duration) * 60000,
                timestamp: Date.now(),
                executed: false
            });

            alert(`✅ ${multiplier}x luck for ${duration} minutes!`);
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    }

    // Send notification to player
    async sendNotification() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const playerId = document.getElementById('controlPlayerId').value.trim();
        if (!playerId) {
            alert('Please select a player first');
            return;
        }

        const message = prompt('Enter message to send:');
        if (!message) return;

        const type = prompt('Message type (success/info/warning/error):', 'info');

        try {
            await this.db.collection('adminActions').add({
                type: 'sendNotification',
                playerId: playerId,
                message: message,
                notificationType: type || 'info',
                timestamp: Date.now(),
                executed: false
            });

            alert(`✅ Message will be sent!`);
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    }

    // Force biome for player
    async setBiome() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const playerId = document.getElementById('controlPlayerId').value.trim();
        if (!playerId) {
            alert('Please select a player first');
            return;
        }

        const biome = prompt('Enter biome name (e.g., HELL, STARFALL, PUMPKIN_MOON):');
        if (!biome) return;

        const duration = prompt('Duration in minutes:', '10');
        if (!duration || isNaN(duration)) return;

        try {
            await this.db.collection('adminActions').add({
                type: 'setBiome',
                playerId: playerId,
                biome: biome.toUpperCase(),
                duration: parseInt(duration) * 60000,
                timestamp: Date.now(),
                executed: false
            });

            alert(`✅ ${biome} biome for ${duration} minutes!`);
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    }

    // Give items to player
    async giveItems() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const playerId = document.getElementById('controlPlayerId').value.trim();
        if (!playerId) {
            alert('Please select a player first');
            return;
        }

        const itemType = prompt('Item type (potion/item/rune):');
        if (!itemType) return;

        const itemName = prompt('Item name:');
        if (!itemName) return;

        const count = prompt('Count:', '1');
        if (!count || isNaN(count)) return;

        try {
            await this.db.collection('adminActions').add({
                type: 'giveItems',
                playerId: playerId,
                itemType: itemType,
                itemName: itemName,
                count: parseInt(count),
                timestamp: Date.now(),
                executed: false
            });

            alert(`✅ ${count}x ${itemName} will be added!`);
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    }

    // Reset player data
    async resetPlayerData() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const playerId = document.getElementById('controlPlayerId').value.trim();
        const playerName = document.getElementById('controlPlayerName').value.trim();
        
        if (!playerId) {
            alert('Please select a player first');
            return;
        }

        const confirmation = prompt(`⚠️ WARNING: This will COMPLETELY WIPE all data for "${playerName}"!\n\nThis includes:\n- All auras and inventory\n- Money and progress\n- Achievements and quests\n- Gear and equipment\n- Leaderboard entries\n- Cloud save data\n\n❌ CANNOT BE UNDONE! ❌\n\nType "RESET" to confirm:`, '');
        
        if (confirmation !== 'RESET') {
            alert('Reset cancelled');
            return;
        }

        try {
            await this.db.collection('adminActions').add({
                type: 'resetPlayerData',
                playerId: playerId,
                timestamp: Date.now(),
                executed: false
            });

            alert(`✅ Complete wipe command sent!\n\nPlayer "${playerName}" will have ALL their data (including leaderboard and cloud data) deleted when they next load the game.`);
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    }

    // Wipe all leaderboards only
    async wipeAllLeaderboards() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const warning = window.confirm(
            '⚠️ WARNING ⚠️\n\n' +
            'You are about to DELETE ALL LEADERBOARD ENTRIES!\n\n' +
            'This will:\n' +
            '- Delete ENTIRE global leaderboard\n' +
            '- Remove ALL player rankings\n' +
            '- Clear ALL leaderboard data\n\n' +
            'Player progress and game data will NOT be affected.\n\n' +
            '❌ THIS CANNOT BE UNDONE! ❌\n\n' +
            'Are you sure?'
        );

        if (!warning) {
            alert('Cancelled');
            return;
        }

        const confirmation = prompt(
            '⚠️ Type "WIPE LEADERBOARDS" exactly to confirm (case-sensitive):',
            ''
        );

        if (confirmation !== 'WIPE LEADERBOARDS') {
            alert('❌ Confirmation text did not match. Leaderboard wipe cancelled.');
            return;
        }

        try {
            console.log('🗑️ Wiping all leaderboards...');
            
            // Wipe globalLeaderboard collection
            const globalLeaderboardSnapshot = await this.db.collection('globalLeaderboard').get();
            
            // Wipe collectedStatsLeaderboard collection
            const collectedStatsSnapshot = await this.db.collection('collectedStatsLeaderboard').get();
            
            // Wipe playerStats collection (for stats leaderboards)
            const playerStatsSnapshot = await this.db.collection('playerStats').get();
            
            const totalGlobal = globalLeaderboardSnapshot.size;
            const totalCollected = collectedStatsSnapshot.size;
            const totalPlayerStats = playerStatsSnapshot.size;
            const totalEntries = totalGlobal + totalCollected + totalPlayerStats;
            
            if (totalEntries === 0) {
                alert('No leaderboard entries found.');
                return;
            }

            const batchConfirm = window.confirm(
                `Found ${totalEntries} total leaderboard entries:\n` +
                `- Global Auras: ${totalGlobal}\n` +
                `- Collected Stats: ${totalCollected}\n` +
                `- Player Stats (60+ categories): ${totalPlayerStats}\n\n` +
                'Proceed with deletion of ALL leaderboard data?'
            );

            if (!batchConfirm) {
                alert('Cancelled');
                return;
            }

            let deleted = 0;
            let errors = 0;

            // Delete all global leaderboard entries
            console.log('🗑️ Deleting Global Auras leaderboard...');
            for (const doc of globalLeaderboardSnapshot.docs) {
                try {
                    await doc.ref.delete();
                    deleted++;
                } catch (error) {
                    console.error('Error deleting global leaderboard entry:', error);
                    errors++;
                }
            }

            // Delete all collected stats leaderboard entries
            console.log('🗑️ Deleting Collected Stats leaderboard...');
            for (const doc of collectedStatsSnapshot.docs) {
                try {
                    await doc.ref.delete();
                    deleted++;
                } catch (error) {
                    console.error('Error deleting collected stats entry:', error);
                    errors++;
                }
            }

            // Delete all player stats entries
            console.log('🗑️ Deleting Player Stats leaderboard (60+ categories)...');
            for (const doc of playerStatsSnapshot.docs) {
                try {
                    await doc.ref.delete();
                    deleted++;
                } catch (error) {
                    console.error('Error deleting player stats entry:', error);
                    errors++;
                }
            }

            console.log(`✅ All leaderboards wiped complete`);

            alert(
                `✅ ALL Leaderboards Wiped Complete!\n\n` +
                `📊 Statistics:\n` +
                `- Global Auras deleted: ${totalGlobal}\n` +
                `- Collected Stats deleted: ${totalCollected}\n` +
                `- Player Stats deleted: ${totalPlayerStats}\n` +
                `- Total entries deleted: ${deleted}\n` +
                `- Errors: ${errors}\n\n` +
                `All leaderboard data has been completely wiped.\n` +
                `Player game data remains intact.`
            );

        } catch (error) {
            console.error('Error wiping leaderboards:', error);
            alert('❌ Error: ' + error.message);
        }
    }

    // Reset ALL players data
    async resetAllPlayers() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const warning1 = window.confirm(
            '⚠️⚠️⚠️ DANGER ⚠️⚠️⚠️\n\n' +
            'You are about to COMPLETELY WIPE ALL PLAYERS!\n\n' +
            'This will:\n' +
            '- Delete ALL player progress\n' +
            '- Delete ALL inventories\n' +
            '- Delete ALL achievements\n' +
            '- Delete ENTIRE leaderboard\n' +
            '- Delete ALL player documents\n' +
            '- Delete ALL cloud save data\n\n' +
            '❌ THIS CANNOT BE UNDONE! ❌\n' +
            '❌ EVERYTHING WILL BE GONE! ❌\n\n' +
            'Are you ABSOLUTELY SURE?'
        );

        if (!warning1) {
            alert('Cancelled');
            return;
        }

        const warning2 = window.confirm(
            '⚠️ FINAL WARNING ⚠️\n\n' +
            'This is your LAST CHANCE to cancel!\n\n' +
            'ALL PLAYERS will lose EVERYTHING!\n' +
            'LEADERBOARDS will be WIPED!\n' +
            'ALL CLOUD DATA will be DELETED!\n\n' +
            'Click OK to proceed with COMPLETE DATABASE WIPE'
        );

        if (!warning2) {
            alert('Cancelled');
            return;
        }

        const confirmation = prompt(
            '⚠️ Type "RESET ALL PLAYERS" exactly to confirm (case-sensitive):\n\n' +
            'This action is IRREVERSIBLE!',
            ''
        );

        if (confirmation !== 'RESET ALL PLAYERS') {
            alert('❌ Confirmation text did not match. Mass reset cancelled.');
            return;
        }

        try {
            // Get all players
            const playersSnapshot = await this.db.collection('players').get();
            
            if (playersSnapshot.empty) {
                alert('No players found in database.');
                return;
            }

            const playerCount = playersSnapshot.size;
            const batchConfirm = window.confirm(
                `Found ${playerCount} players.\n\n` +
                'This will:\n' +
                '- Delete ALL leaderboard entries\n' +
                '- Delete ALL player documents\n' +
                '- Reset ALL local game data\n\n' +
                'Proceed with COMPLETE wipe?'
            );

            if (!batchConfirm) {
                alert('Cancelled');
                return;
            }

            // Delete all leaderboard entries
            console.log('🗑️ Deleting all leaderboard entries...');
            const leaderboardSnapshot = await this.db.collection('globalLeaderboard').get();
            let leaderboardDeleted = 0;
            
            for (const doc of leaderboardSnapshot.docs) {
                try {
                    await doc.ref.delete();
                    leaderboardDeleted++;
                } catch (error) {
                    console.error('Error deleting leaderboard entry:', error);
                }
            }

            console.log(`✅ Deleted ${leaderboardDeleted} leaderboard entries`);

            // Create reset actions and delete player documents
            let actionsCreated = 0;
            let documentsDeleted = 0;
            let errors = 0;

            for (const doc of playersSnapshot.docs) {
                const player = doc.data();
                try {
                    // Create reset action for localStorage clearing
                    await this.db.collection('adminActions').add({
                        type: 'resetPlayerData',
                        playerId: player.playerId,
                        timestamp: Date.now(),
                        executed: false,
                        massReset: true
                    });
                    actionsCreated++;

                    // Delete player document
                    await doc.ref.delete();
                    documentsDeleted++;
                } catch (error) {
                    console.error(`Failed to reset ${player.playerId}:`, error);
                    errors++;
                }
            }

            alert(
                `✅ COMPLETE Mass Reset Executed!\n\n` +
                `📊 Statistics:\n` +
                `- Leaderboard entries deleted: ${leaderboardDeleted}\n` +
                `- Player documents deleted: ${documentsDeleted}\n` +
                `- Reset actions created: ${actionsCreated}\n` +
                `- Errors: ${errors}\n\n` +
                `All cloud data has been WIPED.\n` +
                `Players will have fresh accounts when they next login.`
            );

        } catch (error) {
            console.error('Error in mass reset:', error);
            alert('❌ Error: ' + error.message);
        }
    }

    // Gift aura to player
    async giftAura() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const playerId = document.getElementById('giftPlayerId').value.trim();
        const auraName = document.getElementById('giftAuraName').value.trim();
        const count = parseInt(document.getElementById('giftAuraCount').value) || 1;
        const notify = document.getElementById('giftNotify').checked;

        if (!playerId) {
            alert('Please enter a Player ID');
            return;
        }

        if (!auraName) {
            alert('Please enter an Aura Name');
            return;
        }

        const confirm = window.confirm(`Gift ${count}x "${auraName}" to player "${playerId}"?\n\n${notify ? 'Player will be notified with a popup.' : 'Gift will be added silently.'}`);
        if (!confirm) return;

        try {
            // Create gift document in Firestore
            await this.db.collection('gifts').add({
                playerId: playerId,
                auraName: auraName,
                count: count,
                notify: notify,
                timestamp: Date.now(),
                claimed: false,
                fromAdmin: true
            });

            alert(`✅ Gift sent successfully!\n\n${count}x "${auraName}" → "${playerId}"\n\nThe player will receive it when they next load the game.`);
            
            // Clear inputs
            document.getElementById('giftPlayerId').value = '';
            document.getElementById('giftAuraName').value = '';
            document.getElementById('giftAuraCount').value = '1';
        } catch (error) {
            console.error('Error gifting aura:', error);
            alert('Error: ' + error.message);
        }
    }

    // Refresh statistics
    async refreshStats() {
        if (!this.isAdmin) return;

        const statsDiv = document.getElementById('adminStats');
        statsDiv.innerHTML = 'Loading...';

        try {
            // Get leaderboard count
            const leaderboardSnapshot = await this.db.collection('globalLeaderboard').get();
            const leaderboardCount = leaderboardSnapshot.size;

            // Get current version
            const database = firebase.database();
            const versionSnapshot = await database.ref('appInfo/version').once('value');
            const currentVersion = versionSnapshot.val() || 'Not set';

            // Get active update status
            const updateSnapshot = await database.ref('system/update').once('value');
            const updateData = updateSnapshot.val();
            const updateStatus = updateData?.active ? '🔴 Active' : '🟢 Clear';

            // Get pending gifts count
            const giftsSnapshot = await this.db.collection('gifts').where('claimed', '==', false).get();
            const pendingGifts = giftsSnapshot.size;

            statsDiv.innerHTML = `
                <p><strong>Current Version:</strong> ${currentVersion}</p>
                <p><strong>Update Status:</strong> ${updateStatus}</p>
                <p><strong>Leaderboard Entries:</strong> ${leaderboardCount}</p>
                <p><strong>Pending Gifts:</strong> ${pendingGifts}</p>
                <p><strong>Last Updated:</strong> ${new Date().toLocaleTimeString()}</p>
            `;
        } catch (error) {
            console.error('Error loading stats:', error);
            statsDiv.innerHTML = '<p style="color: red;">Error loading stats</p>';
        }
    }

    // ===================================================================
    // WEBHOOK MANAGEMENT
    // ===================================================================

    // Load webhook settings from Firestore (GLOBAL)
    async loadWebhookSettings() {
        console.log('📥 Attempting to load webhooks...', {
            firebaseInitialized: this.firebaseInitialized,
            hasDb: !!this.db
        });
        
        if (!this.firebaseInitialized || !this.db) {
            console.warn('⚠️ Cannot load webhooks - Firebase not ready');
            return;
        }
        
        try {
            console.log('🔍 Fetching webhooks from Firestore...');
            const webhookDoc = await this.db.collection('admin').doc('webhooks').get();
            
            if (!webhookDoc.exists) {
                console.log('ℹ️ No global webhooks configured yet. This is normal for first-time setup.');
                return;
            }
            
            const data = webhookDoc.data();
            const webhooks = data.webhooks || {};
            
            const inputs = {
                rareAuras: 'adminWebhookRareAuras',
                milestones: 'adminWebhookMilestones',
                achievements: 'adminWebhookAchievements',
                biomes: 'adminWebhookBiomes',
                records: 'adminWebhookRecords'
            };
            
            let loadedCount = 0;
            for (const [category, inputId] of Object.entries(inputs)) {
                const input = document.getElementById(inputId);
                if (input) {
                    input.value = webhooks[category] || '';
                    if (webhooks[category]) loadedCount++;
                }
            }
            
            console.log(`✅ Loaded ${loadedCount} global webhook(s) from Firestore`);
        } catch (error) {
            console.error('❌ Error loading webhooks from Firestore:', error);
        }
    }

    // Save webhooks from admin panel to Firestore (GLOBAL)
    async saveWebhooks() {
        if (!this.isAdmin) {
            alert('Admin authentication required!');
            return;
        }
        
        console.log('💾 Attempting to save webhooks...', {
            firebaseInitialized: this.firebaseInitialized,
            hasDb: !!this.db
        });
        
        if (!this.firebaseInitialized || !this.db) {
            alert('❌ Firebase not initialized. Cannot save webhooks globally.');
            console.error('Firebase check failed:', {
                firebaseInitialized: this.firebaseInitialized,
                hasDb: !!this.db
            });
            return;
        }
        
        // Get values from admin inputs
        const inputs = {
            rareAuras: 'adminWebhookRareAuras',
            milestones: 'adminWebhookMilestones',
            achievements: 'adminWebhookAchievements',
            biomes: 'adminWebhookBiomes',
            records: 'adminWebhookRecords'
        };
        
        const webhooks = {};
        let savedCount = 0;
        const savedCategories = [];
        
        for (const [category, inputId] of Object.entries(inputs)) {
            const input = document.getElementById(inputId);
            if (input) {
                const value = input.value.trim();
                webhooks[category] = value;
                if (value) {
                    savedCount++;
                    savedCategories.push(category);
                }
            }
        }
        
        // Save to Firestore (accessible by ALL players globally)
        try {
            console.log('🔥 Saving to Firestore admin/webhooks...');
            
            await this.db.collection('admin').doc('webhooks').set({
                webhooks: webhooks,
                updatedAt: new Date().toISOString(),
                updatedBy: this.playerId || 'admin'
            });
            
            console.log(`✅ Saved ${savedCount} webhook(s) to Firestore (GLOBAL):`, savedCategories);
            console.log('📦 Webhook data:', webhooks);
            
            alert(`✅ Webhooks saved globally to Firestore!\n\n${savedCount} webhook(s) configured:\n${savedCategories.join(', ')}\n\n🌍 ALL PLAYERS will now send events to these webhooks!`);
        } catch (e) {
            console.error('❌ Error saving webhooks to Firestore:', e);
            alert('❌ Error saving webhooks: ' + e.message);
        }
    }

    // Test all webhooks
    async testAllWebhooks() {
        if (!this.isAdmin) {
            alert('Admin authentication required!');
            return;
        }
        
        if (typeof testAllWebhooks === 'function') {
            await testAllWebhooks();
        } else {
            alert('⚠️ Webhook test function not loaded');
        }
    }
}

// Initialize admin panel when page loads
window.adminPanel = new AdminPanel();
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.adminPanel.initialize();
    });
} else {
    window.adminPanel.initialize();
}
