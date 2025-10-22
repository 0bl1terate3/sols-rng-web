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
                        <h4>📊 Server Statistics</h4>
                        <div id="adminStatsLocal" style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin: 10px 0;">
                            Loading...
                        </div>
                        <button class="admin-btn" onclick="window.adminPanelLocal.refreshStats()">
                            🔄 Refresh Stats
                        </button>
                    </div>

                    <div class="admin-section">
                        <h4>👥 Active Players</h4>
                        <p>View recent players from leaderboard submissions</p>
                        <button class="admin-btn" onclick="window.adminPanelLocal.viewPlayers()">
                            👥 View Player List
                        </button>
                        <div id="playerListLocal" style="margin-top: 10px; display: none;"></div>
                    </div>

                    <div class="admin-section">
                        <h4>🗑️ Clear Leaderboards</h4>
                        <p>Choose which leaderboard to clear:</p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0;">
                            <button class="admin-btn warning" onclick="window.adminPanelLocal.clearLeaderboard('globals')">
                                Clear Global Auras
                            </button>
                            <button class="admin-btn warning" onclick="window.adminPanelLocal.clearLeaderboard('collectedStats')">
                                Clear Collection Stats
                            </button>
                        </div>
                        <button class="admin-btn danger" onclick="window.adminPanelLocal.clearAllLeaderboards()">
                            🗑️ CLEAR ALL LEADERBOARDS
                        </button>
                        <p class="admin-note" style="color: #ff6b6b;">⚠️ This cannot be undone!</p>
                    </div>

                    <div class="admin-section">
                        <h4>💬 Chat Management</h4>
                        <button class="admin-btn warning" onclick="window.adminPanelLocal.clearChat()">
                            Clear Chat History
                        </button>
                    </div>

                    <div class="admin-section">
                        <h4>🔧 Server Info</h4>
                        <p style="font-family: monospace; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px;">
                            Backend: <span id="backendUrlDisplay">${this.backendUrl}</span><br>
                            Status: <span id="backendStatus">Checking...</span>
                        </p>
                        <button class="admin-btn" onclick="window.adminPanelLocal.checkBackendStatus()">
                            Check Connection
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
            this.refreshStats();
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
                this.refreshStats();
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

    // Refresh stats
    async refreshStats() {
        const statsDiv = document.getElementById('adminStatsLocal');
        statsDiv.innerHTML = 'Loading...';

        try {
            const response = await fetch(`${this.backendUrl}/admin/stats`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                const data = await response.json();
                
                let html = `<p><strong>Total Leaderboards:</strong> ${data.totalLeaderboards}</p>`;
                
                for (const [name, info] of Object.entries(data.leaderboards)) {
                    const lastUpdate = info.lastUpdate ? new Date(info.lastUpdate).toLocaleString() : 'Never';
                    html += `
                        <div style="background: rgba(255,255,255,0.05); padding: 10px; margin: 5px 0; border-radius: 5px;">
                            <strong>${name}</strong><br>
                            <span style="color: #888; font-size: 0.9em;">
                                Entries: ${info.entries} • Last Update: ${lastUpdate}
                            </span>
                        </div>
                    `;
                }
                
                statsDiv.innerHTML = html || '<p style="color: #888;">No leaderboards yet</p>';
            } else {
                statsDiv.innerHTML = '<p style="color: red;">Failed to load stats</p>';
            }
        } catch (error) {
            console.error('Error loading stats:', error);
            statsDiv.innerHTML = '<p style="color: red;">Error loading stats</p>';
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
                this.refreshStats();
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
                this.refreshStats();
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
