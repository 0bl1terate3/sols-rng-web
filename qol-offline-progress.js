// =================================================================
// Offline Progress Tracking System
// =================================================================

const offlineProgressState = {
    lastOnlineTime: Date.now(),
    offlineRolls: 0,
    offlineAuras: [],
    offlineItems: [],
    sessionStart: Date.now()
};

// Save offline state
function saveOfflineState() {
    localStorage.setItem('offlineProgress', JSON.stringify({
        lastOnlineTime: Date.now(),
        autoRollActive: gameState?.autoRoll?.active || false
    }));
}

// Calculate offline progress
function calculateOfflineProgress() {
    const saved = localStorage.getItem('offlineProgress');
    if (!saved) return null;
    
    try {
        const data = JSON.parse(saved);
        const now = Date.now();
        const timeAway = now - data.lastOnlineTime;
        
        // Only show if away for more than 5 minutes
        if (timeAway < 5 * 60 * 1000) return null;
        
        // Only calculate if auto-roll was active
        if (!data.autoRollActive) return null;
        
        const minutesAway = Math.floor(timeAway / 60000);
        const hoursAway = Math.floor(minutesAway / 60);
        
        // Calculate rolls based on speed (assuming average 1 roll per second with auto-roll)
        const estimatedRolls = Math.floor(timeAway / 1000);
        
        return {
            timeAway: timeAway,
            minutesAway: minutesAway,
            hoursAway: hoursAway,
            estimatedRolls: estimatedRolls,
            timeAwayText: hoursAway > 0 ? 
                `${hoursAway}h ${minutesAway % 60}m` : 
                `${minutesAway}m`
        };
    } catch (e) {
        console.error('Failed to calculate offline progress:', e);
        return null;
    }
}

// Show offline progress modal
function showOfflineProgressModal(progress) {
    if (!progress) return;
    
    const modal = document.createElement('div');
    modal.id = 'offlineProgressModal';
    modal.className = 'modal show';
    modal.style.zIndex = '10001';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; text-align: center;">
            <h2 style="color: #4CAF50; margin-bottom: 20px;">⏰ Welcome Back!</h2>
            
            <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; margin: 20px 0;">
                <div style="font-size: 18px; color: #aaa; margin-bottom: 10px;">You were away for:</div>
                <div style="font-size: 32px; color: #fff; font-weight: bold; margin-bottom: 20px;">
                    ${progress.timeAwayText}
                </div>
                
                <div style="font-size: 16px; color: #aaa; margin-bottom: 10px;">
                    Auto-roll was active! Estimated progress:
                </div>
                <div style="font-size: 24px; color: #4CAF50; font-weight: bold;">
                    ~${progress.estimatedRolls.toLocaleString()} rolls
                </div>
            </div>
            
            <div style="background: rgba(255,193,7,0.1); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,193,7,0.3); margin: 20px 0;">
                <div style="color: #FFC107; font-size: 14px;">
                    💡 <strong>Tip:</strong> Your actual progress may vary based on luck multipliers, 
                    breakthrough chances, and active effects during your session.
                </div>
            </div>
            
            <button onclick="closeOfflineProgressModal()" class="qol-button" style="padding: 12px 30px; font-size: 16px;">
                Continue Playing
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Close offline progress modal
function closeOfflineProgressModal() {
    const modal = document.getElementById('offlineProgressModal');
    if (modal) modal.remove();
}

// Auto-save indicator
let autoSaveIndicator = null;
let autoSaveTimeout = null;

function showAutoSaveIndicator() {
    if (!autoSaveIndicator) {
        autoSaveIndicator = document.createElement('div');
        autoSaveIndicator.id = 'autoSaveIndicator';
        autoSaveIndicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(76, 175, 80, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        autoSaveIndicator.innerHTML = '💾 Game Saved';
        document.body.appendChild(autoSaveIndicator);
    }
    
    // Clear existing timeout
    if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
    }
    
    // Show indicator
    autoSaveIndicator.style.opacity = '1';
    
    // Hide after 2 seconds
    autoSaveTimeout = setTimeout(() => {
        autoSaveIndicator.style.opacity = '0';
    }, 2000);
}

// Wrap the original saveGameState function
function wrapSaveGameState() {
    if (typeof window.saveGameState === 'function') {
        const originalSave = window.saveGameState;
        window.saveGameState = function() {
            originalSave.apply(this, arguments);
            showAutoSaveIndicator();
            saveOfflineState();
        };
    }
}

// Initialize offline progress system
function initOfflineProgress() {
    // DISABLED: Offline progress feature removed
    // No longer shows "Welcome Back" modal with offline rolls
    console.log('⚠️ Offline Progress system DISABLED');
}

// Make functions globally accessible
if (typeof window !== 'undefined') {
    window.offlineProgressState = offlineProgressState;
    window.showOfflineProgressModal = showOfflineProgressModal;
    window.closeOfflineProgressModal = closeOfflineProgressModal;
    window.showAutoSaveIndicator = showAutoSaveIndicator;
    window.initOfflineProgress = initOfflineProgress;
}
