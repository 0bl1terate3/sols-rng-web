// Quick Access Menu - Central Hub for All Systems

class QuickAccessMenu {
    constructor() {
        this.createFloatingButton();
    }

    createFloatingButton() {
        const button = document.createElement('button');
        button.id = 'quickAccessBtn';
        button.innerHTML = '⚡';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: 3px solid rgba(255,255,255,0.3);
            font-size: 28px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            transition: all 0.3s;
        `;
        
        button.onmouseover = () => {
            button.style.transform = 'scale(1.1) rotate(90deg)';
            button.style.boxShadow = '0 6px 30px rgba(102, 126, 234, 0.6)';
        };
        
        button.onmouseout = () => {
            button.style.transform = 'scale(1) rotate(0deg)';
            button.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
        };
        
        button.onclick = () => this.openMenu();
        
        document.body.appendChild(button);
    }

    openMenu() {
        let modal = document.getElementById('quickAccessModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'quickAccessModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 900px;">
                    <div class="modal-header">
                        <h2>⚡ Quick Access Menu</h2>
                        <button class="close-btn" onclick="quickAccessMenu.closeMenu()">✖</button>
                    </div>
                    <div class="modal-body" style="padding: 20px;">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                            
                            <div class="quick-access-card" onclick="openInventoryManager()">
                                <div class="card-icon">📦</div>
                                <h3>Inventory Manager</h3>
                                <p>Sort, filter, and manage your inventory</p>
                            </div>

                            <div class="quick-access-card" onclick="openAutoMerchant()">
                                <div class="card-icon">🛍️</div>
                                <h3>Auto-Merchant</h3>
                                <p>Automatically buy items from merchants</p>
                            </div>

                            <div class="quick-access-card" onclick="openBulkRoll()">
                                <div class="card-icon">🎲</div>
                                <h3>Bulk Roll</h3>
                                <p>Roll multiple times with smart pausing</p>
                            </div>

                            <div class="quick-access-card" onclick="openAnalytics()">
                                <div class="card-icon">📊</div>
                                <h3>Analytics</h3>
                                <p>View detailed session statistics</p>
                            </div>

                            <div class="quick-access-card" onclick="openAutoAchievement()">
                                <div class="card-icon">🏆</div>
                                <h3>Achievement Tracker</h3>
                                <p>Track progress & get near-completion alerts</p>
                            </div>

                            <div class="quick-access-card" onclick="openKeyboardShortcuts()">
                                <div class="card-icon">⌨️</div>
                                <h3>Keyboard Shortcuts</h3>
                                <p>Configure hotkeys for quick actions</p>
                            </div>

                            <div class="quick-access-card" onclick="openExpeditionAuto()">
                                <div class="card-icon">🗺️</div>
                                <h3>Expedition Manager</h3>
                                <p>Auto-send optimized expeditions</p>
                            </div>

                            <div class="quick-access-card" onclick="openAutoPotionSettings()">
                                <div class="card-icon">🧪</div>
                                <h3>Auto-Potion</h3>
                                <p>Strategic potion crafting & usage</p>
                            </div>

                            <div class="quick-access-card" onclick="openAutoCraftSettings()">
                                <div class="card-icon">🔧</div>
                                <h3>Auto-Craft</h3>
                                <p>Smart gear crafting & equipping</p>
                            </div>

                            <div class="quick-access-card" onclick="window.adminPanelLocal ? openAutoCraftSettings() : alert('Start backend server first')">
                                <div class="card-icon">🔐</div>
                                <h3>Admin Panel</h3>
                                <p>Server management & controls</p>
                            </div>

                        </div>
                    </div>
                </div>

                <style>
                    .quick-access-card {
                        background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
                        border: 2px solid rgba(255,255,255,0.1);
                        border-radius: 12px;
                        padding: 20px;
                        cursor: pointer;
                        transition: all 0.3s;
                        text-align: center;
                    }
                    .quick-access-card:hover {
                        transform: translateY(-5px);
                        border-color: #667eea;
                        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
                        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                    }
                    .quick-access-card .card-icon {
                        font-size: 48px;
                        margin-bottom: 10px;
                    }
                    .quick-access-card h3 {
                        margin: 10px 0;
                        color: #e5e7eb;
                        font-size: 1.1em;
                    }
                    .quick-access-card p {
                        margin: 0;
                        color: #9ca3af;
                        font-size: 0.9em;
                    }
                </style>
            `;
            document.body.appendChild(modal);
        }
        modal.classList.add('show');
    }

    closeMenu() {
        const modal = document.getElementById('quickAccessModal');
        if (modal) modal.classList.remove('show');
    }
}

const quickAccessMenu = new QuickAccessMenu();
window.quickAccessMenu = quickAccessMenu;

console.log('⚡ Quick Access Menu loaded');
