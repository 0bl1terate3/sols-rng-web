// Admin Panel for Update System
// This provides a UI for triggering updates to all connected users

class AdminPanel {
    constructor() {
        this.isVisible = false;
        this.panel = null;
        this.toggle = null;
        this.setupAdminPanel();
        this.setupKeyboardShortcut();
    }

    setupAdminPanel() {
        // Create admin toggle button
        this.toggle = document.createElement('div');
        this.toggle.className = 'admin-toggle';
        this.toggle.onclick = () => this.togglePanel();
        this.toggle.title = 'Admin Panel (Ctrl+Shift+A)';
        document.body.appendChild(this.toggle);

        // Create admin panel
        this.panel = document.createElement('div');
        this.panel.className = 'admin-panel hidden';
        this.panel.innerHTML = `
            <h3>🔧 Admin Update Control</h3>
            
            <input type="text" id="adminUpdateMessage" placeholder="Update message..." value="UPDATE IN PROGRESS...">
            
            <button onclick="adminPanel.showUpdate()">
                📢 Show Update Overlay
            </button>
            
            <button onclick="adminPanel.showUpdateWithTimer()">
                ⏱️ Show Update (30s auto-clear)
            </button>
            
            <button onclick="adminPanel.forceRefreshAll()">
                🔄 Force Refresh All Users
            </button>
            
            <button onclick="adminPanel.clearUpdate()">
                ✅ Clear Update Overlay
            </button>
            
            <hr style="border: 1px solid rgba(255,255,255,0.2); margin: 15px 0;">
            
            <button onclick="adminPanel.testLocal()" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);">
                🧪 Test Locally (No Broadcast)
            </button>
            
            <button onclick="adminPanel.togglePanel()" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                ❌ Close Panel
            </button>
        `;
        document.body.appendChild(this.panel);
    }

    setupKeyboardShortcut() {
        // Ctrl+Shift+A to toggle admin panel
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                this.togglePanel();
            }
        });
    }

    togglePanel() {
        this.isVisible = !this.isVisible;
        
        if (this.isVisible) {
            this.panel.classList.remove('hidden');
            this.toggle.style.display = 'none';
        } else {
            this.panel.classList.add('hidden');
            this.toggle.style.display = 'flex';
        }
    }

    getCustomMessage() {
        const input = document.getElementById('adminUpdateMessage');
        return input ? input.value.trim() || 'UPDATE IN PROGRESS...' : 'UPDATE IN PROGRESS...';
    }

    async showUpdate() {
        const message = this.getCustomMessage();
        
        if (typeof updateSystem !== 'undefined') {
            const success = await updateSystem.broadcastUpdate(message, false);
            if (success) {
                alert('✅ Update overlay shown to all users!');
            } else {
                alert('⚠️ Firebase not configured. Update shown locally only.');
                updateSystem.showUpdateOverlay(message, false);
            }
        } else {
            alert('❌ Update system not loaded');
        }
    }

    async showUpdateWithTimer() {
        const message = this.getCustomMessage();
        
        if (typeof updateSystem !== 'undefined') {
            const success = await updateSystem.broadcastUpdate(message, false, 30000);
            if (success) {
                alert('✅ Update overlay shown! Auto-clearing in 30 seconds.');
            } else {
                alert('⚠️ Firebase not configured. Update shown locally only.');
                updateSystem.showUpdateOverlay(message, false);
                setTimeout(() => updateSystem.hideUpdateOverlay(), 30000);
            }
        } else {
            alert('❌ Update system not loaded');
        }
    }

    async forceRefreshAll() {
        if (!confirm('⚠️ This will refresh ALL connected users in 5 seconds. Continue?')) {
            return;
        }

        const message = 'UPDATE COMPLETE - REFRESHING...';
        
        if (typeof updateSystem !== 'undefined') {
            const success = await updateSystem.forceRefreshAll(message, 5000);
            if (success) {
                alert('✅ Force refresh triggered for all users!');
            } else {
                alert('⚠️ Firebase not configured. Refreshing locally only.');
                updateSystem.showUpdateOverlay(message, true);
            }
        } else {
            alert('❌ Update system not loaded');
        }
    }

    async clearUpdate() {
        if (typeof updateSystem !== 'undefined') {
            const success = await updateSystem.clearUpdate();
            if (success) {
                alert('✅ Update overlay cleared for all users!');
            } else {
                alert('⚠️ Firebase not configured. Cleared locally only.');
                updateSystem.hideUpdateOverlay();
            }
        } else {
            alert('❌ Update system not loaded');
        }
    }

    testLocal() {
        const message = this.getCustomMessage();
        
        if (typeof updateSystem !== 'undefined') {
            updateSystem.showUpdateOverlay(message, false);
            
            setTimeout(() => {
                if (confirm('Test complete. Clear the overlay?')) {
                    updateSystem.hideUpdateOverlay();
                }
            }, 3000);
        } else {
            alert('❌ Update system not loaded');
        }
    }
}

// Create global admin panel instance
window.adminPanel = new AdminPanel();

console.log('%c Admin Panel Loaded! ', 'background: #667eea; color: white; font-size: 16px; padding: 10px;');
console.log('%c Press Ctrl+Shift+A or click the gear icon to open the admin panel ', 'color: #fbbf24; font-size: 14px;');
