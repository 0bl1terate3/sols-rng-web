// =================================================================
// Advanced Notification Settings System
// =================================================================

// Initialize notification settings in gameState
if (!gameState.notificationSettings) {
    gameState.notificationSettings = {
        position: 'top-right',
        duration: 3, // seconds
        soundEffectsVolume: 0.5,
        notificationSoundVolume: 0.7,
        desktopNotifications: false,
        rareAuraAlertThreshold: 1000000, // 1M default
        biomeChangeAlerts: false,
        discordWebhook: '', // Legacy single webhook
        webhooks: {
            rareAuras: '',
            milestones: '',
            achievements: '',
            biomes: '',
            records: ''
        },
        globalWebhooks: null, // Cached global webhooks from Firestore
        lastWebhookFetch: 0
    };
}

// Load settings from localStorage
try {
    const savedNotificationSettings = localStorage.getItem('notificationSettings');
    if (savedNotificationSettings) {
        const parsed = JSON.parse(savedNotificationSettings);
        gameState.notificationSettings = {
            ...gameState.notificationSettings,
            ...parsed
        };
        
        // Ensure webhooks object exists after loading
        if (!gameState.notificationSettings.webhooks) {
            gameState.notificationSettings.webhooks = {
                rareAuras: '',
                milestones: '',
                achievements: '',
                biomes: '',
                records: ''
            };
        }
        
        console.log('✅ Notification settings loaded from localStorage');
    }
} catch (e) {
    console.log('Could not load notification settings:', e);
}

// Save notification settings
function saveNotificationSettings() {
    try {
        localStorage.setItem('notificationSettings', JSON.stringify(gameState.notificationSettings));
        console.log('💾 Notification settings saved to localStorage');
    } catch (e) {
        console.error('Error saving notification settings:', e);
    }
}

// Auto-save notification settings periodically (backup)
setInterval(() => {
    if (typeof gameState !== 'undefined' && gameState.notificationSettings) {
        saveNotificationSettings();
    }
}, 60000); // Every 60 seconds

// ===================================================================
// NOTIFICATION POSITION
// ===================================================================

function updateNotificationPosition(position) {
    gameState.notificationSettings.position = position;
    saveNotificationSettings();
    
    // Apply position to notification container
    const container = document.getElementById('notification-container') || createNotificationContainer();
    applyNotificationPosition(container, position);
    
    showNotification(`Notification position: ${position.replace('-', ' ')}`, 'info');
}

function createNotificationContainer() {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.position = 'fixed';
        container.style.zIndex = '10000';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.maxWidth = '400px';
        document.body.appendChild(container);
    }
    return container;
}

function applyNotificationPosition(container, position) {
    // Reset all positions
    container.style.top = '';
    container.style.bottom = '';
    container.style.left = '';
    container.style.right = '';
    container.style.transform = '';
    
    switch(position) {
        case 'top-right':
            container.style.top = '80px';
            container.style.right = '20px';
            break;
        case 'top-center':
            container.style.top = '80px';
            container.style.left = '50%';
            container.style.transform = 'translateX(-50%)';
            break;
        case 'top-left':
            container.style.top = '80px';
            container.style.left = '20px';
            break;
        case 'bottom-right':
            container.style.bottom = '20px';
            container.style.right = '20px';
            container.style.flexDirection = 'column-reverse';
            break;
        case 'bottom-center':
            container.style.bottom = '20px';
            container.style.left = '50%';
            container.style.transform = 'translateX(-50%)';
            container.style.flexDirection = 'column-reverse';
            break;
        case 'bottom-left':
            container.style.bottom = '20px';
            container.style.left = '20px';
            container.style.flexDirection = 'column-reverse';
            break;
    }
}

// ===================================================================
// NOTIFICATION DURATION
// ===================================================================

function updateNotificationDuration(seconds) {
    gameState.notificationSettings.duration = parseInt(seconds);
    const label = document.getElementById('notificationDurationValue');
    if (label) label.textContent = `${seconds}s`;
    saveNotificationSettings();
}

// ===================================================================
// SOUND VOLUME CONTROLS
// ===================================================================

function updateSoundEffectsVolume(volume) {
    const vol = parseInt(volume) / 100;
    gameState.notificationSettings.soundEffectsVolume = vol;
    
    const label = document.getElementById('soundEffectsVolumeValue');
    if (label) label.textContent = `${volume}%`;
    
    // Apply to all sound effects (if you have a global sound manager)
    if (window.soundEffects) {
        Object.values(window.soundEffects).forEach(sound => {
            if (sound instanceof Audio) {
                sound.volume = vol;
            }
        });
    }
    
    saveNotificationSettings();
}

function updateNotificationSoundVolume(volume) {
    const vol = parseInt(volume) / 100;
    gameState.notificationSettings.notificationSoundVolume = vol;
    
    const label = document.getElementById('notificationSoundVolumeValue');
    if (label) label.textContent = `${volume}%`;
    
    saveNotificationSettings();
}

// ===================================================================
// DESKTOP NOTIFICATIONS
// ===================================================================

async function toggleDesktopNotifications() {
    const toggle = document.getElementById('desktopNotificationsToggle');
    
    if (toggle.checked) {
        // Request permission
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                gameState.notificationSettings.desktopNotifications = true;
                showNotification('Desktop notifications enabled!', 'success');
                
                // Test notification
                new Notification('Sol\'s RNG', {
                    body: 'Desktop notifications are now enabled!',
                    icon: 'favicon.ico'
                });
            } else {
                toggle.checked = false;
                showNotification('Desktop notification permission denied', 'error');
                gameState.notificationSettings.desktopNotifications = false;
            }
        } else {
            toggle.checked = false;
            showNotification('Desktop notifications not supported in this browser', 'error');
            gameState.notificationSettings.desktopNotifications = false;
        }
    } else {
        gameState.notificationSettings.desktopNotifications = false;
        showNotification('Desktop notifications disabled', 'info');
    }
    
    saveNotificationSettings();
}

// Rarity thresholds for desktop alerts
const DESKTOP_ALERT_THRESHOLDS = [
    { value: 0, label: 'Off', rarity: Infinity },
    { value: 100000, label: '100,000+' },
    { value: 500000, label: '500,000+' },
    { value: 1000000, label: '1,000,000+' },
    { value: 5000000, label: '5,000,000+' },
    { value: 10000000, label: '10,000,000+' },
    { value: 50000000, label: '50,000,000+' },
    { value: 99000000, label: '99,000,000+' },
    { value: 999000000, label: '999,000,000+' }
];

function updateRareAuraAlertThreshold(sliderValue) {
    const index = parseInt(sliderValue);
    const threshold = DESKTOP_ALERT_THRESHOLDS[index];
    
    gameState.notificationSettings.rareAuraAlertThreshold = threshold.rarity !== undefined ? threshold.rarity : threshold.value;
    
    const label = document.getElementById('rareAuraAlertValue');
    if (label) label.textContent = threshold.label;
    
    saveNotificationSettings();
}

function toggleBiomeChangeAlerts() {
    const toggle = document.getElementById('biomeChangeAlertsToggle');
    gameState.notificationSettings.biomeChangeAlerts = toggle.checked;
    saveNotificationSettings();
    showNotification(`Biome alerts ${toggle.checked ? 'enabled' : 'disabled'}`, toggle.checked ? 'success' : 'info');
}

// ===================================================================
// DISCORD WEBHOOK - GLOBAL FETCHING
// ===================================================================

// Fetch global webhooks from Firestore (called by ALL players)
async function fetchGlobalWebhooks(forceRefresh = false) {
    // Check if we have a cached version (refresh every 5 minutes)
    const now = Date.now();
    if (!forceRefresh && gameState.notificationSettings.globalWebhooks && 
        (now - gameState.notificationSettings.lastWebhookFetch) < 300000) {
        console.log('📦 Using cached global webhooks');
        return gameState.notificationSettings.globalWebhooks;
    }

    // Try to fetch from Firestore
    try {
        if (window.globalLeaderboard && window.globalLeaderboard.db) {
            console.log('🔍 Fetching global webhooks from Firestore...');
            const webhookDoc = await window.globalLeaderboard.db.collection('admin').doc('webhooks').get();
            
            if (webhookDoc.exists) {
                const data = webhookDoc.data();
                gameState.notificationSettings.globalWebhooks = data.webhooks || {};
                gameState.notificationSettings.lastWebhookFetch = now;
                console.log('✅ Fetched global webhooks from Firestore:', Object.keys(data.webhooks || {}).filter(k => data.webhooks[k]).length + ' configured');
                console.log('📋 Webhook categories:', data.webhooks);
                return gameState.notificationSettings.globalWebhooks;
            } else {
                console.warn('⚠️ No webhooks document found in Firestore admin/webhooks');
            }
        } else {
            console.warn('⚠️ Firebase not ready for webhook fetch');
        }
    } catch (error) {
        console.error('❌ Error fetching global webhooks:', error);
    }

    // Return empty webhooks if fetch failed
    return {};
}

// Force refresh webhooks (for debugging)
async function forceRefreshWebhooks() {
    console.log('🔄 Force refreshing global webhooks...');
    gameState.notificationSettings.globalWebhooks = null;
    gameState.notificationSettings.lastWebhookFetch = 0;
    const webhooks = await fetchGlobalWebhooks(true);
    const count = Object.keys(webhooks).filter(k => webhooks[k]).length;
    alert(`✅ Refreshed webhooks!\n\n${count} webhook(s) configured.`);
    console.log('✅ Webhook refresh complete:', webhooks);
}

// Get webhook for a specific category (global or local fallback)
async function getWebhookForCategory(category) {
    // First try to get global webhooks from Firestore
    const globalWebhooks = await fetchGlobalWebhooks();
    
    if (globalWebhooks && globalWebhooks[category]) {
        return globalWebhooks[category];
    }
    
    // Fallback to local webhooks (for backwards compatibility)
    if (gameState.notificationSettings.webhooks && gameState.notificationSettings.webhooks[category]) {
        return gameState.notificationSettings.webhooks[category];
    }
    
    // Legacy fallback
    return gameState.notificationSettings.discordWebhook || '';
}

// ===================================================================
// DISCORD WEBHOOK - LOCAL MANAGEMENT (for backwards compatibility)
// ===================================================================

function updateWebhook(category, url) {
    if (!gameState.notificationSettings.webhooks) {
        gameState.notificationSettings.webhooks = {
            rareAuras: '',
            milestones: '',
            achievements: '',
            biomes: '',
            records: ''
        };
    }
    gameState.notificationSettings.webhooks[category] = url.trim();
    saveNotificationSettings();
}

function updateDiscordWebhook(url) {
    gameState.notificationSettings.discordWebhook = url.trim();
    saveNotificationSettings();
}

async function testWebhook(webhook, categoryName) {
    if (!webhook) {
        showNotification(`No webhook set for ${categoryName}`, 'error');
        return false;
    }
    
    try {
        const response = await fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: `🎮 ${categoryName} Webhook Test`,
                    description: 'Your Discord webhook is working correctly!',
                    color: 0x00d9ff,
                    timestamp: new Date().toISOString(),
                    footer: { text: 'Sol\'s RNG Notification System' }
                }]
            })
        });
        
        if (response.ok) {
            showNotification(`✅ ${categoryName} webhook working!`, 'success');
            return true;
        } else {
            showNotification(`❌ ${categoryName} webhook failed. Check your URL.`, 'error');
            return false;
        }
    } catch (error) {
        console.error(`${categoryName} webhook test error:`, error);
        showNotification(`❌ ${categoryName} webhook error: ` + error.message, 'error');
        return false;
    }
}

async function testAllWebhooks() {
    const webhooks = gameState.notificationSettings.webhooks || {};
    const categories = {
        rareAuras: 'Rare Auras',
        milestones: 'Milestones',
        achievements: 'Achievements',
        biomes: 'Biomes',
        records: 'Records'
    };
    
    let tested = 0;
    let successful = 0;
    
    for (const [key, name] of Object.entries(categories)) {
        if (webhooks[key]) {
            tested++;
            const result = await testWebhook(webhooks[key], name);
            if (result) successful++;
            await new Promise(resolve => setTimeout(resolve, 500)); // Delay between tests
        }
    }
    
    if (tested === 0) {
        showNotification('No webhooks configured to test', 'error');
    } else {
        showNotification(`Tested ${tested} webhooks: ${successful} successful`, successful === tested ? 'success' : 'warning');
    }
}

async function testDiscordWebhook() {
    const webhook = gameState.notificationSettings.discordWebhook;
    await testWebhook(webhook, 'Legacy Webhook');
}

// ===================================================================
// NOTIFICATION TRIGGERS
// ===================================================================

// Get player name from multiple sources (unified system)
function getPlayerName() {
    // Try main playerName first (from name picker)
    const mainName = localStorage.getItem('playerName');
    if (mainName) return mainName;
    
    // Fallback to leaderboard name (legacy)
    const leaderboardName = localStorage.getItem('playerLeaderboardName');
    if (leaderboardName) return leaderboardName;
    
    // Try gameState
    if (typeof gameState !== 'undefined' && gameState.playerName) {
        return gameState.playerName;
    }
    
    // Try global leaderboard
    if (window.globalLeaderboard && window.globalLeaderboard.playerName) {
        return window.globalLeaderboard.playerName;
    }
    
    return 'Anonymous';
}

// Call this when a rare aura is obtained
async function sendRareAuraNotification(aura) {
    const settings = gameState.notificationSettings;
    const auraRarity = aura.rarity || aura.baseRarity;
    
    // Get player name
    const playerName = getPlayerName();
    
    // Desktop notification
    if (settings.desktopNotifications && auraRarity >= settings.rareAuraAlertThreshold) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`🌟 Rare Aura Found!`, {
                body: `${playerName} has found ${aura.name} with a chance of 1 in ${auraRarity.toLocaleString()}`,
                icon: 'favicon.ico',
                badge: 'favicon.ico'
            });
        }
    }
    
    // Discord webhook (fetch global webhook from Firestore)
    if (auraRarity >= 1000000) {
        const webhook = await getWebhookForCategory('rareAuras');
        if (webhook) {
            sendDiscordAuraNotification(aura, playerName, webhook);
        }
    }
}

async function sendDiscordAuraNotification(aura, playerName, webhook) {
    if (!webhook) return;
    
    const auraRarity = aura.rarity || aura.baseRarity;
    const rarityText = auraRarity.toLocaleString();
    
    // Determine color based on rarity
    let color = 0x00d9ff; // Default cyan
    if (auraRarity >= 999000000) color = 0xff00ff; // Magenta for ultra-rare
    else if (auraRarity >= 99000000) color = 0xff0000; // Red for globals
    else if (auraRarity >= 10000000) color = 0xffa500; // Orange
    else if (auraRarity >= 1000000) color = 0xffd700; // Gold
    
    try {
        await fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: `🌟 Rare Aura Found!`,
                    description: `**${playerName}** has found **${aura.name}** with a chance of \`1 in ${rarityText}\``,
                    color: color,
                    timestamp: new Date().toISOString(),
                    footer: { text: `Total Rolls: ${gameState.totalRolls.toLocaleString()}` }
                }]
            })
        });
    } catch (error) {
        console.error('Discord notification error:', error);
    }
}

// Call this when a biome changes
async function sendBiomeChangeNotification(biomeName) {
    const settings = gameState.notificationSettings;
    
    // Get player name
    const playerName = getPlayerName();
    
    // Desktop notification
    if (settings.desktopNotifications && settings.biomeChangeAlerts) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`🌍 Biome Changed!`, {
                body: `${playerName} has entered the ${biomeName} biome!`,
                icon: 'favicon.ico'
            });
        }
    }
    
    // Discord webhook (fetch global webhook from Firestore)
    if (biomeName !== 'NORMAL') {
        const webhook = await getWebhookForCategory('biomes');
        if (webhook) {
            sendBiomeChangeWebhook(biomeName, playerName, webhook);
        }
    }
}

async function sendBiomeChangeWebhook(biomeName, playerName, webhook) {
    try {
        await fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: `🌍 Biome Changed!`,
                    description: `**${playerName}** has entered the **${biomeName}** biome!`,
                    color: 0x10b981,
                    timestamp: new Date().toISOString(),
                    footer: { text: 'Sol\'s RNG Biome Tracker' }
                }]
            })
        });
    } catch (error) {
        console.error('Biome webhook error:', error);
    }
}

// ===================================================================
// INITIALIZE SETTINGS UI
// ===================================================================

// Change player name from settings (reads from input field)
function changePlayerNameFromSettings() {
    const nameInput = document.getElementById('playerNameDisplay');
    if (!nameInput) return;
    
    const newName = nameInput.value.trim();
    
    // Validate name
    if (!newName || newName.length < 3 || newName.length > 20) {
        showNotification('❌ Name must be 3-20 characters', 'error');
        nameInput.style.borderColor = '#ff6b6b';
        return;
    }
    
    // Clean the name (allow letters, numbers, spaces, and basic symbols)
    const cleanName = newName.replace(/[^a-zA-Z0-9_\s\-\.]/g, '').trim();
    
    if (cleanName.length < 3) {
        showNotification('❌ Name must contain at least 3 valid characters', 'error');
        nameInput.style.borderColor = '#ff6b6b';
        return;
    }
    
    // Save to ALL storage locations (unified system)
    localStorage.setItem('playerName', cleanName);
    localStorage.setItem('playerLeaderboardName', cleanName);
    
    // Update gameState
    if (typeof gameState !== 'undefined') {
        gameState.playerName = cleanName;
    }
    
    // Sync with global leaderboard
    if (window.globalLeaderboard) {
        window.globalLeaderboard.playerName = cleanName;
    }
    
    // Sync with name picker
    if (window.namePicker) {
        window.namePicker.playerName = cleanName;
    }
    
    // Update display
    nameInput.value = cleanName;
    nameInput.style.borderColor = '#444';
    showNotification(`✅ Name changed to: ${cleanName}`, 'success');
    
    console.log('✅ Name changed to:', cleanName);
}

// Update player name display in settings
function updatePlayerNameDisplay() {
    const nameInput = document.getElementById('playerNameDisplay');
    if (nameInput) {
        // Use unified name system (prioritize main playerName)
        const playerName = localStorage.getItem('playerName') || localStorage.getItem('playerLeaderboardName') || 'Not Set';
        nameInput.value = playerName;
        nameInput.style.color = playerName === 'Not Set' ? '#ff6b6b' : '#00d9ff';
    }
}

function initializeNotificationSettingsUI() {
    const settings = gameState.notificationSettings;
    
    // Update player name display
    updatePlayerNameDisplay();
    
    // Position
    const positionSelect = document.getElementById('notificationPosition');
    if (positionSelect) {
        positionSelect.value = settings.position;
        const container = createNotificationContainer();
        applyNotificationPosition(container, settings.position);
    }
    
    // Duration
    const durationSlider = document.getElementById('notificationDuration');
    if (durationSlider) {
        durationSlider.value = settings.duration;
        updateNotificationDuration(settings.duration);
    }
    
    // Sound volumes
    const sfxSlider = document.getElementById('soundEffectsVolume');
    if (sfxSlider) {
        sfxSlider.value = settings.soundEffectsVolume * 100;
        updateSoundEffectsVolume(settings.soundEffectsVolume * 100);
    }
    
    const notifSoundSlider = document.getElementById('notificationSoundVolume');
    if (notifSoundSlider) {
        notifSoundSlider.value = settings.notificationSoundVolume * 100;
        updateNotificationSoundVolume(settings.notificationSoundVolume * 100);
    }
    
    // Desktop notifications
    const desktopToggle = document.getElementById('desktopNotificationsToggle');
    if (desktopToggle) {
        desktopToggle.checked = settings.desktopNotifications;
    }
    
    // Rare aura threshold
    const rareThresholdSlider = document.getElementById('rareAuraAlertThreshold');
    if (rareThresholdSlider) {
        const index = DESKTOP_ALERT_THRESHOLDS.findIndex(t => 
            (t.rarity !== undefined ? t.rarity : t.value) === settings.rareAuraAlertThreshold
        );
        rareThresholdSlider.value = index >= 0 ? index : 4;
        updateRareAuraAlertThreshold(rareThresholdSlider.value);
    }
    
    // Biome alerts
    const biomeToggle = document.getElementById('biomeChangeAlertsToggle');
    if (biomeToggle) {
        biomeToggle.checked = settings.biomeChangeAlerts;
    }
    
    // Discord webhooks (category-specific)
    if (settings.webhooks) {
        const webhookInputs = {
            rareAuras: 'webhookRareAuras',
            milestones: 'webhookMilestones',
            achievements: 'webhookAchievements',
            biomes: 'webhookBiomes',
            records: 'webhookRecords'
        };
        
        for (const [category, inputId] of Object.entries(webhookInputs)) {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = settings.webhooks[category] || '';
            }
        }
    }
}

// Hook into existing settings initialization
const originalInitSettings = window.initializeSettingsUI;
window.initializeSettingsUI = function() {
    if (originalInitSettings) originalInitSettings();
    initializeNotificationSettingsUI();
};

// Make functions globally available
window.updateNotificationPosition = updateNotificationPosition;
window.updateNotificationDuration = updateNotificationDuration;
window.updateSoundEffectsVolume = updateSoundEffectsVolume;
window.updateNotificationSoundVolume = updateNotificationSoundVolume;
window.toggleDesktopNotifications = toggleDesktopNotifications;
window.updateRareAuraAlertThreshold = updateRareAuraAlertThreshold;
window.toggleBiomeChangeAlerts = toggleBiomeChangeAlerts;
window.updateWebhook = updateWebhook;
window.updateDiscordWebhook = updateDiscordWebhook;
window.testWebhook = testWebhook;
window.testAllWebhooks = testAllWebhooks;
window.testDiscordWebhook = testDiscordWebhook;
window.sendRareAuraNotification = sendRareAuraNotification;
window.sendBiomeChangeNotification = sendBiomeChangeNotification;
window.changePlayerNameFromSettings = changePlayerNameFromSettings;
window.updatePlayerNameDisplay = updatePlayerNameDisplay;
window.getPlayerName = getPlayerName;
window.fetchGlobalWebhooks = fetchGlobalWebhooks;
window.getWebhookForCategory = getWebhookForCategory;
window.forceRefreshWebhooks = forceRefreshWebhooks;

console.log('🔔 Advanced notification settings loaded');
