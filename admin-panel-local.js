// =================================================================
// Admin Panel - Local Backend Version
// =================================================================

class AdminPanelLocal {
    constructor() {
        this.isAdmin = false;
        this.panel = null;
        this.backendUrl = window.BACKEND_URL || 'http://localhost:8090';
    }

    // Initialize admin panel
    initialize() {
        console.log('🔐 Initializing local admin panel...');
        this.createAdminPanel();
        
        // Listen for Ctrl+Shift+A to open admin panel
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                this.showAdminPanel();
            }
        });
    }

    // Create admin panel UI
    createAdminPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'adminPanelLocal';
        this.panel.className = 'admin-panel';
        this.panel.style.display = 'none';
        this.panel.innerHTML = `
            <div class="admin-panel-content">
                <div class="admin-header">
                    <h2>🔐 Admin Panel (Local)</h2>
                    <button class="admin-close-btn" onclick="window.adminPanelLocal.hideAdminPanel()">✖</button>
                </div>

                <div class="admin-auth" id="adminAuthLocal">
                    <h3>Enter Admin Password</h3>
                    <input type="password" id="adminPasswordInputLocal" placeholder="Admin Password">
                    <button onclick="window.adminPanelLocal.authenticate()">Login</button>
                    <p class="admin-hint">Hint: Check backend console for password</p>
                </div>

                <div class="admin-controls" id="adminControlsLocal" style="display: none;">
                    <h3>✅ Authenticated</h3>
                    
                    <div class="admin-section">
                        <h4>📊 Analytics Dashboard</h4>
                        <div id="analyticsLocal" style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin: 10px 0;">
                            Loading...
                        </div>
                        <button class="admin-btn" onclick="window.adminPanelLocal.refreshAnalytics()">
                            🔄 Refresh Analytics
                        </button>
                    </div>

                    <div class="admin-section">
                        <h4>👥 Player Management</h4>
                        <input type="text" id="playerSearchLocal" placeholder="Search player by ID or name...">
                        <button class="admin-btn" onclick="window.adminPanelLocal.searchPlayers()">
                            🔍 Search Players
                        </button>
                        <button class="admin-btn" onclick="window.adminPanelLocal.viewAllPlayers()">
                            👥 View All Players
                        </button>
                        <div id="playerListLocal" style="margin-top: 10px; display: none;"></div>
                    </div>

                    <div class="admin-section">
                        <h4>🎮 Player Control Center</h4>
                        <p style="color: #888; font-size: 0.9em;">Select a player from the list above, or enter ID manually</p>
                        <input type="text" id="selectedPlayerIdLocal" placeholder="Player ID" readonly style="background: rgba(255,255,255,0.05);">
                        <input type="text" id="selectedPlayerNameLocal" placeholder="Player Name" readonly style="background: rgba(255,255,255,0.05);">
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                            <button class="admin-btn-small" onclick="window.adminPanelLocal.viewPlayerData()">
                                📋 View Data
                            </button>
                            <button class="admin-btn-small" onclick="window.adminPanelLocal.editPlayerData()">
                                ✏️ Edit Data
                            </button>
                            <button class="admin-btn-small warning" onclick="window.adminPanelLocal.banPlayer()">
                                🚫 Ban Player
                            </button>
                            <button class="admin-btn-small danger" onclick="window.adminPanelLocal.deletePlayerData()">
                                🗑️ Delete Data
                            </button>
                        </div>
                    </div>

                    <div class="admin-section">
                        <h4>🚫 Ban Management</h4>
                        <button class="admin-btn" onclick="window.adminPanelLocal.viewBans()">
                            View All Bans
                        </button>
                        <div id="banListLocal" style="margin-top: 10px; display: none;"></div>
                    </div>

                    <div class="admin-section">
                        <h4>💾 Database Backup & Restore</h4>
                        <p style="color: #888; font-size: 0.9em;">Export: Download all data as JSON file</p>
                        <button class="admin-btn" onclick="window.adminPanelLocal.exportDatabase()">
                            📥 Download Backup
                        </button>
                        
                        <p style="color: #888; font-size: 0.9em; margin-top: 15px;">Import: Restore from backup file</p>
                        <input type="file" id="importFileLocal" accept=".json" style="display: none;" onchange="window.adminPanelLocal.handleImportFile()">
                        <button class="admin-btn warning" onclick="document.getElementById('importFileLocal').click()">
                            📤 Restore Backup
                        </button>
                        <p class="admin-note">⚠️ Restoring will overwrite current data!</p>
                    </div>

                    <div class="admin-section">
                        <h4>🗑️ Danger Zone</h4>
                        <p style="color: #ff6b6b;">⚠️ These actions cannot be undone!</p>
                        
                        <button class="admin-btn warning" onclick="window.adminPanelLocal.clearLeaderboard('globals')">
                            Clear Global Auras
                        </button>
                        <button class="admin-btn warning" onclick="window.adminPanelLocal.clearLeaderboard('collectedStats')">
                            Clear Collection Stats
                        </button>
                        <button class="admin-btn danger" onclick="window.adminPanelLocal.clearAllLeaderboards()">
                            🗑️ WIPE ALL LEADERBOARDS
                        </button>
                        <button class="admin-btn danger" onclick="window.adminPanelLocal.resetAllPlayers()">
                            💀 RESET ALL PLAYER DATA
                        </button>
                        <button class="admin-btn warning" onclick="window.adminPanelLocal.clearChat()">
                            💬 Clear Chat History
                        </button>
                    </div>

                    <div class="admin-section">
                        <h4>🔧 Server Status</h4>
                        <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px;">
                            <p style="margin: 5px 0; font-family: monospace; font-size: 0.9em;">
                                <strong>Backend URL:</strong><br>
                                <span id="backendUrlDisplay" style="color: #00d4ff;">${this.backendUrl}</span>
                            </p>
                            <p style="margin: 5px 0; font-family: monospace; font-size: 0.9em;">
                                <strong>Connection:</strong> <span id="backendStatus">Checking...</span>
                            </p>
                        </div>
                        <button class="admin-btn" onclick="window.adminPanelLocal.checkBackendStatus()">
                            🔄 Check Connection
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
            document.getElementById('adminAuthLocal').style.display = 'none';
            document.getElementById('adminControlsLocal').style.display = 'block';
            this.refreshAnalytics();
            this.checkBackendStatus();
        }
    }

    // Hide admin panel
    hideAdminPanel() {
        this.panel.style.display = 'none';
    }

    // Authenticate admin
    async authenticate() {
        const inputPassword = document.getElementById('adminPasswordInputLocal').value;
        
        if (!inputPassword) {
            alert('Please enter a password');
            return;
        }

        try {
            const response = await fetch(`${this.backendUrl}/admin/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({ password: inputPassword })
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                this.isAdmin = true;
                document.getElementById('adminAuthLocal').style.display = 'none';
                document.getElementById('adminControlsLocal').style.display = 'block';
                document.getElementById('adminPasswordInputLocal').value = '';
                this.refreshAnalytics();
                this.checkBackendStatus();
            } else {
                alert('❌ Incorrect password');
                document.getElementById('adminPasswordInputLocal').value = '';
            }
        } catch (error) {
            console.error('Authentication error:', error);
            alert('Error authenticating: ' + error.message);
        }
    }

    // Refresh analytics
    async refreshAnalytics() {
        const analyticsDiv = document.getElementById('analyticsLocal');
        analyticsDiv.innerHTML = 'Loading...';

        try {
            const response = await fetch(`${this.backendUrl}/admin/analytics`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                const data = await response.json();
                
                analyticsDiv.innerHTML = `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px; border-radius: 8px;">
                            <div style="font-size: 2em; font-weight: bold; color: #fff;">${data.totalLeaderboards || 0}</div>
                            <div style="color: rgba(255,255,255,0.8); font-size: 0.9em;">Leaderboards</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 15px; border-radius: 8px;">
                            <div style="font-size: 2em; font-weight: bold; color: #fff;">${data.totalEntries || 0}</div>
                            <div style="color: rgba(255,255,255,0.8); font-size: 0.9em;">Total Entries</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 15px; border-radius: 8px;">
                            <div style="font-size: 2em; font-weight: bold; color: #fff;">${data.uniquePlayers || 0}</div>
                            <div style="color: rgba(255,255,255,0.8); font-size: 0.9em;">Unique Players</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 15px; border-radius: 8px;">
                            <div style="font-size: 2em; font-weight: bold; color: #fff;">${data.totalPlayerData || 0}</div>
                            <div style="color: rgba(255,255,255,0.8); font-size: 0.9em;">Stored Players</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 15px; border-radius: 8px;">
                            <div style="font-size: 2em; font-weight: bold; color: #fff;">${data.totalRolls ? data.totalRolls.toLocaleString() : 0}</div>
                            <div style="color: rgba(255,255,255,0.8); font-size: 0.9em;">Total Rolls</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #c92a2a 100%); padding: 15px; border-radius: 8px;">
                            <div style="font-size: 2em; font-weight: bold; color: #fff;">${data.activeBans || 0}</div>
                            <div style="color: rgba(255,255,255,0.8); font-size: 0.9em;">Active Bans</div>
                        </div>
                    </div>
                `;
            } else {
                analyticsDiv.innerHTML = '<p style="color: red;">Failed to load analytics</p>';
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
            analyticsDiv.innerHTML = '<p style="color: red;">Error loading analytics</p>';
        }
    }

    // View players
    async viewPlayers() {
        const playerListDiv = document.getElementById('playerListLocal');
        playerListDiv.innerHTML = '<p>Loading players...</p>';
        playerListDiv.style.display = 'block';

        try {
            const response = await fetch(`${this.backendUrl}/admin/players`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.players.length === 0) {
                    playerListDiv.innerHTML = '<p style="color: #888;">No players found yet.</p>';
                    return;
                }

                let html = `<div style="max-height: 400px; overflow-y: auto; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 10px;">
                    <p style="color: #888; margin-bottom: 10px;">Total Players: ${data.total}</p>`;
                
                data.players.forEach(player => {
                    const timeSince = this.getTimeSince(player.lastSeen);
                    
                    html += `
                        <div style="background: rgba(255,255,255,0.05); padding: 10px; margin: 5px 0; border-radius: 5px;">
                            <p style="margin: 0; color: #00d4ff; font-weight: bold;">👤 ${player.playerName}</p>
                            <p style="margin: 5px 0 0 0; font-size: 11px; color: #888;">
                                ID: ${player.playerId}<br>
                                Submissions: ${player.totalSubmissions} • Last seen: ${timeSince}
                            </p>
                        </div>
                    `;
                });
                
                html += '</div>';
                playerListDiv.innerHTML = html;
            } else {
                playerListDiv.innerHTML = '<p style="color: red;">Failed to load players</p>';
            }
        } catch (error) {
            console.error('Error loading players:', error);
            playerListDiv.innerHTML = '<p style="color: red;">Error loading players</p>';
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

    // Clear specific leaderboard
    async clearLeaderboard(name) {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const confirm = window.confirm(`⚠️ Are you sure you want to clear the "${name}" leaderboard?\n\nThis cannot be undone!`);
        if (!confirm) return;

        try {
            const response = await fetch(`${this.backendUrl}/leaderboard/${name}`, {
                method: 'DELETE',
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                alert(`✅ ${name} leaderboard cleared!`);
                this.refreshAnalytics();
            } else {
                alert('❌ Failed to clear leaderboard');
            }
        } catch (error) {
            console.error('Error clearing leaderboard:', error);
            alert('Error: ' + error.message);
        }
    }

    // Clear all leaderboards
    async clearAllLeaderboards() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const warning = window.confirm(
            '⚠️ WARNING ⚠️\n\n' +
            'You are about to DELETE ALL LEADERBOARD ENTRIES!\n\n' +
            '❌ THIS CANNOT BE UNDONE! ❌\n\n' +
            'Are you sure?'
        );

        if (!warning) return;

        const confirmation = prompt('Type "DELETE ALL" to confirm:', '');
        
        if (confirmation !== 'DELETE ALL') {
            alert('Cancelled');
            return;
        }

        try {
            const response = await fetch(`${this.backendUrl}/admin/leaderboards/clear`, {
                method: 'DELETE',
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                alert('✅ All leaderboards cleared!');
                this.refreshAnalytics();
            } else {
                alert('❌ Failed to clear leaderboards');
            }
        } catch (error) {
            console.error('Error clearing leaderboards:', error);
            alert('Error: ' + error.message);
        }
    }

    // Clear chat
    async clearChat() {
        if (!this.isAdmin) {
            alert('Not authenticated');
            return;
        }

        const confirm = window.confirm('⚠️ Clear all chat messages?\n\nThis cannot be undone!');
        if (!confirm) return;

        try {
            const response = await fetch(`${this.backendUrl}/chat/clear`, {
                method: 'DELETE',
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                alert('✅ Chat cleared!');
            } else {
                alert('❌ Failed to clear chat');
            }
        } catch (error) {
            console.error('Error clearing chat:', error);
            alert('Error: ' + error.message);
        }
    }

    // Check backend status
    async checkBackendStatus() {
        const statusSpan = document.getElementById('backendStatus');
        statusSpan.textContent = 'Checking...';
        statusSpan.style.color = '#ffaa00';

        try {
            const response = await fetch(`${this.backendUrl}/`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                statusSpan.textContent = '✅ Connected';
                statusSpan.style.color = '#00ff00';
            } else {
                statusSpan.textContent = '⚠️ Unreachable';
                statusSpan.style.color = '#ff6b6b';
            }
        } catch (error) {
            statusSpan.textContent = '❌ Offline';
            statusSpan.style.color = '#ff6b6b';
        }
    }

    // Search players
    async searchPlayers() {
        const searchTerm = document.getElementById('playerSearchLocal').value.trim().toLowerCase();
        if (!searchTerm) {
            alert('Please enter a search term');
            return;
        }

        const playerListDiv = document.getElementById('playerListLocal');
        playerListDiv.innerHTML = '<p>Searching...</p>';
        playerListDiv.style.display = 'block';

        try {
            const response = await fetch(`${this.backendUrl}/admin/players`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                const data = await response.json();
                const filtered = data.players.filter(p => 
                    p.playerName.toLowerCase().includes(searchTerm) ||
                    p.playerId.toLowerCase().includes(searchTerm)
                );

                if (filtered.length === 0) {
                    playerListDiv.innerHTML = '<p style="color: #888;">No players found matching that search.</p>';
                    return;
                }

                this.renderPlayerList(filtered, playerListDiv);
            } else {
                playerListDiv.innerHTML = '<p style="color: red;">Failed to search players</p>';
            }
        } catch (error) {
            console.error('Error searching players:', error);
            playerListDiv.innerHTML = '<p style="color: red;">Error searching players</p>';
        }
    }

    // View all players
    async viewAllPlayers() {
        const playerListDiv = document.getElementById('playerListLocal');
        playerListDiv.innerHTML = '<p>Loading all players...</p>';
        playerListDiv.style.display = 'block';

        try {
            const response = await fetch(`${this.backendUrl}/admin/players`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.players.length === 0) {
                    playerListDiv.innerHTML = '<p style="color: #888;">No players found yet.</p>';
                    return;
                }

                this.renderPlayerList(data.players, playerListDiv);
            } else {
                playerListDiv.innerHTML = '<p style="color: red;">Failed to load players</p>';
            }
        } catch (error) {
            console.error('Error loading players:', error);
            playerListDiv.innerHTML = '<p style="color: red;">Error loading players</p>';
        }
    }

    // Render player list
    renderPlayerList(players, container) {
        let html = `<div style="max-height: 400px; overflow-y: auto; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 10px;">
            <p style="color: #888; margin-bottom: 10px;">Total Players: ${players.length}</p>`;
        
        players.forEach(player => {
            const timeSince = this.getTimeSince(player.lastSeen);
            
            html += `
                <div onclick="window.adminPanelLocal.selectPlayer('${player.playerId}', '${player.playerName}')" 
                     style="background: rgba(255,255,255,0.05); padding: 10px; margin: 5px 0; border-radius: 5px; cursor: pointer; transition: all 0.3s;"
                     onmouseover="this.style.background='rgba(0,212,255,0.2)'" 
                     onmouseout="this.style.background='rgba(255,255,255,0.05)'">
                    <p style="margin: 0; color: #00d4ff; font-weight: bold;">👤 ${player.playerName}</p>
                    <p style="margin: 5px 0 0 0; font-size: 11px; color: #888;">
                        ID: ${player.playerId}<br>
                        Submissions: ${player.totalSubmissions} • Last seen: ${timeSince}
                    </p>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    // Select player
    selectPlayer(playerId, playerName) {
        document.getElementById('selectedPlayerIdLocal').value = playerId;
        document.getElementById('selectedPlayerNameLocal').value = playerName;
        
        if (typeof showNotification === 'function') {
            showNotification(`✅ Selected: ${playerName}`, 'info');
        } else {
            console.log(`Selected player: ${playerName} (${playerId})`);
        }
    }

    // View player data
    async viewPlayerData() {
        const playerId = document.getElementById('selectedPlayerIdLocal').value;
        if (!playerId) {
            alert('Please select a player first');
            return;
        }

        try {
            const response = await fetch(`${this.backendUrl}/admin/player/${playerId}`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    alert(`Player Data for ${playerId}:\n\n${JSON.stringify(result.data, null, 2)}`);
                } else {
                    alert('No data found for this player');
                }
            } else {
                alert('Player data not found');
            }
        } catch (error) {
            console.error('Error viewing player data:', error);
            alert('Error: ' + error.message);
        }
    }

    // Edit player data
    async editPlayerData() {
        const playerId = document.getElementById('selectedPlayerIdLocal').value;
        if (!playerId) {
            alert('Please select a player first');
            return;
        }

        const jsonData = prompt('Enter player data as JSON:\n(Leave empty to cancel)', '{\n  "example": "value"\n}');
        if (!jsonData) return;

        try {
            const data = JSON.parse(jsonData);
            
            const response = await fetch(`${this.backendUrl}/admin/player/${playerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('✅ Player data updated!');
            } else {
                alert('❌ Failed to update player data');
            }
        } catch (error) {
            alert('Invalid JSON or error: ' + error.message);
        }
    }

    // Delete player data
    async deletePlayerData() {
        const playerId = document.getElementById('selectedPlayerIdLocal').value;
        const playerName = document.getElementById('selectedPlayerNameLocal').value;
        
        if (!playerId) {
            alert('Please select a player first');
            return;
        }

        const confirm = window.confirm(`⚠️ Delete ALL data for "${playerName}"?\n\nThis cannot be undone!`);
        if (!confirm) return;

        try {
            const response = await fetch(`${this.backendUrl}/admin/player/${playerId}`, {
                method: 'DELETE',
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                alert('✅ Player data deleted!');
                document.getElementById('selectedPlayerIdLocal').value = '';
                document.getElementById('selectedPlayerNameLocal').value = '';
            } else {
                alert('❌ Failed to delete player data');
            }
        } catch (error) {
            console.error('Error deleting player data:', error);
            alert('Error: ' + error.message);
        }
    }

    // Ban player
    async banPlayer() {
        const playerId = document.getElementById('selectedPlayerIdLocal').value;
        const playerName = document.getElementById('selectedPlayerNameLocal').value;
        
        if (!playerId) {
            alert('Please select a player first');
            return;
        }

        const reason = prompt('Reason for ban:', 'Violating rules');
        if (!reason) return;

        const duration = prompt('Ban duration in hours (leave empty for permanent):', '');
        const durationMs = duration ? parseInt(duration) * 3600000 : null;

        try {
            const response = await fetch(`${this.backendUrl}/admin/ban`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    playerId,
                    playerName,
                    reason,
                    duration: durationMs
                })
            });

            if (response.ok) {
                alert(`✅ ${playerName} banned!\nReason: ${reason}\nDuration: ${duration ? duration + ' hours' : 'Permanent'}`);
            } else {
                alert('❌ Failed to ban player');
            }
        } catch (error) {
            console.error('Error banning player:', error);
            alert('Error: ' + error.message);
        }
    }

    // View bans
    async viewBans() {
        const banListDiv = document.getElementById('banListLocal');
        banListDiv.innerHTML = '<p>Loading bans...</p>';
        banListDiv.style.display = 'block';

        try {
            const response = await fetch(`${this.backendUrl}/admin/bans`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.bans.length === 0) {
                    banListDiv.innerHTML = '<p style="color: #888;">No bans found.</p>';
                    return;
                }

                let html = `<div style="max-height: 400px; overflow-y: auto; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 10px;">
                    <p style="color: #888; margin-bottom: 10px;">Total Bans: ${data.total}</p>`;
                
                data.bans.forEach(ban => {
                    const bannedTime = new Date(ban.bannedAt).toLocaleString();
                    const expiresText = ban.permanent ? 'Permanent' : (ban.expiresAt > Date.now() ? new Date(ban.expiresAt).toLocaleString() : 'Expired');
                    const isActive = ban.permanent || (ban.expiresAt && ban.expiresAt > Date.now());
                    
                    html += `
                        <div style="background: rgba(255,255,255,0.05); padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 3px solid ${isActive ? '#ff6b6b' : '#888'};">
                            <p style="margin: 0; color: ${isActive ? '#ff6b6b' : '#888'}; font-weight: bold;">
                                🚫 ${ban.playerName} ${isActive ? '' : '(Expired)'}
                            </p>
                            <p style="margin: 5px 0 0 0; font-size: 11px; color: #888;">
                                ID: ${ban.playerId}<br>
                                Reason: ${ban.reason}<br>
                                Banned: ${bannedTime}<br>
                                Expires: ${expiresText}
                            </p>
                            <button class="admin-btn-small" onclick="window.adminPanelLocal.unbanPlayer('${ban.playerId}')" style="margin-top: 5px; font-size: 0.8em;">
                                Unban
                            </button>
                        </div>
                    `;
                });
                
                html += '</div>';
                banListDiv.innerHTML = html;
            } else {
                banListDiv.innerHTML = '<p style="color: red;">Failed to load bans</p>';
            }
        } catch (error) {
            console.error('Error loading bans:', error);
            banListDiv.innerHTML = '<p style="color: red;">Error loading bans</p>';
        }
    }

    // Unban player
    async unbanPlayer(playerId) {
        const confirm = window.confirm(`Remove ban for player ${playerId}?`);
        if (!confirm) return;

        try {
            const response = await fetch(`${this.backendUrl}/admin/ban/${playerId}`, {
                method: 'DELETE',
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                alert('✅ Ban removed!');
                this.viewBans(); // Refresh ban list
            } else {
                alert('❌ Failed to remove ban');
            }
        } catch (error) {
            console.error('Error removing ban:', error);
            alert('Error: ' + error.message);
        }
    }

    // Export database
    async exportDatabase() {
        try {
            const response = await fetch(`${this.backendUrl}/admin/export`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `backup-${Date.now()}.json`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                alert('✅ Database backup downloaded!');
            } else {
                alert('❌ Failed to export database');
            }
        } catch (error) {
            console.error('Error exporting database:', error);
            alert('Error: ' + error.message);
        }
    }

    // Handle import file
    async handleImportFile() {
        const fileInput = document.getElementById('importFileLocal');
        const file = fileInput.files[0];
        
        if (!file) return;

        const confirm = window.confirm('⚠️ WARNING: This will OVERWRITE all current data!\n\nAre you sure you want to restore from this backup?');
        if (!confirm) {
            fileInput.value = '';
            return;
        }

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            const response = await fetch(`${this.backendUrl}/admin/import`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('✅ Database restored successfully!');
                this.refreshAnalytics();
            } else {
                alert('❌ Failed to restore database');
            }
        } catch (error) {
            alert('Error: Invalid backup file or ' + error.message);
        } finally {
            fileInput.value = '';
        }
    }

    // Reset all player data
    async resetAllPlayers() {
        const warning = window.confirm(
            '⚠️ DANGER ⚠️\n\n' +
            'You are about to DELETE ALL PLAYER DATA!\n\n' +
            '❌ THIS CANNOT BE UNDONE! ❌\n\n' +
            'Are you sure?'
        );

        if (!warning) return;

        const confirmation = prompt('Type "RESET ALL" to confirm:', '');
        
        if (confirmation !== 'RESET ALL') {
            alert('Cancelled');
            return;
        }

        try {
            const response = await fetch(`${this.backendUrl}/admin/allplayers`, {
                method: 'DELETE',
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                alert('✅ All player data reset!');
                this.refreshAnalytics();
            } else {
                alert('❌ Failed to reset player data');
            }
        } catch (error) {
            console.error('Error resetting player data:', error);
            alert('Error: ' + error.message);
        }
    }
}

// Initialize admin panel when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.adminPanelLocal = new AdminPanelLocal();
        window.adminPanelLocal.initialize();
    });
} else {
    window.adminPanelLocal = new AdminPanelLocal();
    window.adminPanelLocal.initialize();
}

console.log('🔐 Local Admin Panel loaded (Press Ctrl+Shift+A)');
