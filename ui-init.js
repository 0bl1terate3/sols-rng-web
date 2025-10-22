/* ============================================
   UI INITIALIZATION & INTERACTIONS
   ============================================ */

// Tab Switching
document.addEventListener('DOMContentLoaded', () => {
    // Main tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active to clicked
            button.classList.add('active');
            const tabId = button.dataset.tab + 'Tab';
            document.getElementById(tabId)?.classList.add('active');
        });
    });
    
    // Sub tabs
    const subTabButtons = document.querySelectorAll('.sub-tab-btn');
    subTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parent = button.closest('.tab-content');
            if (!parent) return;
            
            // Remove active from siblings
            parent.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
            parent.querySelectorAll('.sub-tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active to clicked
            button.classList.add('active');
            const subTabId = button.dataset.subtab + 'SubTab';
            parent.querySelector('#' + subTabId)?.classList.add('active');
        });
    });
    
    // Settings button
    document.getElementById('settingsBtn')?.addEventListener('click', () => {
        openSettingsModal();
    });
    
    // Help button
    document.getElementById('helpBtn')?.addEventListener('click', () => {
        if (typeof toggleHelpPanel === 'function') {
            toggleHelpPanel();
        }
    });
});

// Modal Functions
function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    
    // Populate settings content
    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
        modalBody.innerHTML = generateSettingsHTML();
    }
    
    // Initialize settings values from gameState
    if (typeof initializeSettingsUI === 'function') {
        initializeSettingsUI();
    }
    
    modal.classList.add('show');
}

function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal?.classList.remove('show');
}

function closeCraftingModal() {
    const modal = document.getElementById('craftingModal');
    modal?.classList.remove('show');
}

function closeAuraModal() {
    const modal = document.getElementById('auraModal');
    modal?.classList.remove('show');
}

// Generate Settings HTML
function generateSettingsHTML() {
    return `
        <div class="settings-container">
            <h3>🎵 Music & Audio</h3>
            <div class="settings-section">
                <label class="checkbox-label">
                    <input type="checkbox" id="musicEnabledToggle" onchange="toggleMusicEnabled()" checked>
                    <span>Enable Music</span>
                </label>
                <div class="volume-control">
                    <label for="musicVolumeSlider">Music Volume: <span id="musicVolumeValue">30%</span></label>
                    <input type="range" id="musicVolumeSlider" min="0" max="100" value="30" oninput="updateMusicVolume(this.value)">
                </div>
                <label class="checkbox-label">
                    <input type="checkbox" id="soundEnabledToggle" onchange="toggleQoLSetting('soundEnabled')" checked>
                    <span>Sound Effects</span>
                </label>
            </div>
            
            <h3>🔔 Notification Settings</h3>
            <div class="settings-section">
                <label class="checkbox-label">
                    <input type="checkbox" id="achievementNotificationsToggle" onchange="toggleAchievementNotifications()" checked>
                    <span>Achievement Notifications</span>
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="generalNotificationsToggle" onchange="toggleGeneralNotifications()" checked>
                    <span>General Notifications</span>
                </label>
                
                <div style="margin-top: 15px;">
                    <label for="notificationPosition">Notification Position</label>
                    <select id="notificationPosition" onchange="updateNotificationPosition(this.value)" style="width: 100%; padding: 8px; margin-top: 5px; border-radius: 4px; border: 1px solid #444; background: #1a1f2e; color: #fff;">
                        <option value="top-right">Top Right</option>
                        <option value="top-center">Top Center</option>
                        <option value="top-left">Top Left</option>
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-center">Bottom Center</option>
                        <option value="bottom-left">Bottom Left</option>
                    </select>
                </div>
                
                <div style="margin-top: 15px;">
                    <label for="notificationDuration">
                        Notification Duration: <span id="notificationDurationValue">3s</span>
                    </label>
                    <input type="range" id="notificationDuration" min="1" max="10" value="3" 
                           oninput="updateNotificationDuration(this.value)" style="width: 100%;">
                </div>
                
                <div style="margin-top: 15px;">
                    <label for="soundEffectsVolume">
                        Sound Effects Volume: <span id="soundEffectsVolumeValue">50%</span>
                    </label>
                    <input type="range" id="soundEffectsVolume" min="0" max="100" value="50" 
                           oninput="updateSoundEffectsVolume(this.value)" style="width: 100%;">
                </div>
                
                <div style="margin-top: 15px;">
                    <label for="notificationSoundVolume">
                        Notification Sound Volume: <span id="notificationSoundVolumeValue">70%</span>
                    </label>
                    <input type="range" id="notificationSoundVolume" min="0" max="100" value="70" 
                           oninput="updateNotificationSoundVolume(this.value)" style="width: 100%;">
                </div>
            </div>
            
            <h3>🔔 Advanced Alerts</h3>
            <div class="settings-section">
                <label class="checkbox-label">
                    <input type="checkbox" id="desktopNotificationsToggle" onchange="toggleDesktopNotifications()">
                    <span>Enable Desktop Notifications (Browser)</span>
                </label>
                
                <div style="margin-top: 15px;">
                    <label for="rareAuraAlertThreshold">
                        Desktop Alert for Auras: <span id="rareAuraAlertValue">1,000,000+</span>
                    </label>
                    <input type="range" id="rareAuraAlertThreshold" min="0" max="8" value="4" 
                           oninput="updateRareAuraAlertThreshold(this.value)" style="width: 100%;">
                    <div style="font-size: 0.85em; color: #888; margin-top: 5px;">
                        Send desktop notifications for rare auras
                    </div>
                </div>
                
                <label class="checkbox-label" style="margin-top: 10px;">
                    <input type="checkbox" id="biomeChangeAlertsToggle" onchange="toggleBiomeChangeAlerts()">
                    <span>Desktop Alerts for Biome Changes</span>
                </label>
                
                <div style="margin-top: 15px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <h4 style="margin-bottom: 12px; color: #00d9ff;">👤 Your Display Name</h4>
                    <p style="font-size: 0.9em; color: #888; margin-bottom: 8px;">
                        This name appears in Discord webhook notifications and leaderboards
                    </p>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <input type="text" id="playerNameDisplay" maxlength="20" placeholder="Enter your name..."
                               style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #444; background: #1a1f2e; color: #00d9ff; font-weight: 600;">
                        <button onclick="changePlayerNameFromSettings()" 
                                style="padding: 8px 16px; background: linear-gradient(135deg, #00d9ff, #00b8d4); border: none; border-radius: 4px; color: white; font-weight: 600; cursor: pointer;">
                            Save Name
                        </button>
                    </div>
                </div>
                
                <div style="margin-top: 15px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <h4 style="margin-bottom: 12px; color: #888;">🔒 Discord Webhooks (Admin Only)</h4>
                    <p style="font-size: 0.9em; color: #888;">
                        Discord webhook configuration is restricted to the admin panel.<br>
                        Press <strong>Ctrl+Shift+P</strong> to access the admin panel.
                    </p>
                </div>
            </div>
            
            <h3>🎬 Cutscene Settings</h3>
            <div class="settings-section">
                <label class="checkbox-label">
                    <input type="checkbox" id="masterCutsceneToggle" onchange="toggleMasterCutscenes()" checked>
                    <span>Enable All Cutscenes</span>
                </label>
                
                <div class="cutscene-threshold-control" style="margin-top: 15px;">
                    <label for="cutsceneRarityThreshold">
                        Cutscene Rarity Threshold: <span id="cutsceneThresholdValue">1,000,000+</span>
                    </label>
                    <input type="range" id="cutsceneRarityThreshold" min="0" max="7" value="3" 
                           oninput="updateCutsceneThreshold(this.value)" style="width: 100%;">
                    <div style="font-size: 0.85em; color: #888; margin-top: 5px;">
                        Only play cutscenes for auras at or above this rarity
                    </div>
                </div>
                
                <div class="cutscene-aura-list" style="margin-top: 20px;">
                    <h4 style="margin-bottom: 10px;">Disable Cutscenes for Specific Auras</h4>
                    <input type="text" id="cutsceneAuraSearch" placeholder="🔍 Search auras..." 
                           oninput="filterCutsceneAuraList(this.value)" 
                           style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #444;">
                    <div id="cutsceneAuraListContainer" style="max-height: 300px; overflow-y: auto; border: 1px solid #444; border-radius: 4px; padding: 10px;">
                        <!-- Populated by JavaScript -->
                    </div>
                </div>
            </div>
            
            <h3>📊 Display Settings</h3>
            <div class="settings-section">
                <label class="checkbox-label">
                    <input type="checkbox" id="showRollHistoryToggle" onchange="toggleQoLSetting('showRollHistory')" checked>
                    <span>Show Roll History</span>
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="showStatisticsToggle" onchange="toggleQoLSetting('showStatistics')" checked>
                    <span>Show Statistics</span>
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="showPityCounterToggle" onchange="toggleQoLSetting('showPityCounter')" checked>
                    <span>Show Pity Counters</span>
                </label>
            </div>
            
            <h3>⌨️ Controls</h3>
            <div class="settings-section">
                <label class="checkbox-label">
                    <input type="checkbox" id="keyboardShortcutsToggle" onchange="toggleQoLSetting('keyboardShortcuts')" checked>
                    <span>Keyboard Shortcuts (Press H for help)</span>
                </label>
            </div>
            
            <h3>⚡ Performance</h3>
            <div class="settings-section">
                <label class="checkbox-label">
                    <input type="checkbox" id="reducedAnimationsToggle" onchange="toggleReducedAnimations()">
                    <span>Reduced Animations</span>
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="disableParticlesToggle" onchange="toggleDisableParticles()">
                    <span>Disable Particles</span>
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="lowerQualityEffectsToggle" onchange="toggleLowerQualityEffects()">
                    <span>Lower Quality Effects</span>
                </label>
            </div>
            
            <h3>💾 Save Management</h3>
            <div class="settings-section">
                <button class="btn btn-primary" onclick="exportSaveData()">📤 Export Save</button>
                <button class="btn btn-secondary" onclick="importSaveData()">📥 Import Save</button>
                <button class="btn btn-secondary" onclick="copyStatsToClipboard()">📋 Copy Stats</button>
            </div>
        </div>
    `;
}

// Close modals on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSettingsModal();
        closeCraftingModal();
        closeAuraModal();
    }
});

// Close modals on background click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});

// Make functions globally available
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.closeCraftingModal = closeCraftingModal;
window.closeAuraModal = closeAuraModal;

console.log('✅ Modern UI initialized successfully!');
