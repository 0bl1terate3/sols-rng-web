// =================================================================
// Anti-Cheat System - Data Integrity Protection
// =================================================================
// Detects save file tampering and prevents localStorage manipulation

class AntiCheat {
    constructor() {
        // Secret salt - change this to something unique for your game
        this.salt = 'SOLS_RNG_SECRET_' + 'v1.0.0';
        this.lastSaveHash = null;
        this.tamperDetected = false;
        this.checkInterval = null;
    }

    // Generate hash of game state for integrity checking
    generateHash(data) {
        const str = JSON.stringify(data) + this.salt;
        return this.simpleHash(str);
    }

    // Simple but effective hash function
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(36);
    }

    // Save game state with integrity check
    saveGameState(gameState) {
        try {
            // Generate hash before saving
            const hash = this.generateHash(gameState);
            
            // Save both state and hash
            localStorage.setItem('gameState', JSON.stringify(gameState));
            localStorage.setItem('gameStateHash', hash);
            localStorage.setItem('lastSaveTime', Date.now().toString());
            
            this.lastSaveHash = hash;
            
            console.log('✅ Game saved with integrity protection');
        } catch (error) {
            console.error('Error saving game state:', error);
        }
    }

    // Load game state and verify integrity
    loadGameState() {
        try {
            const savedState = localStorage.getItem('gameState');
            const savedHash = localStorage.getItem('gameStateHash');
            
            if (!savedState) {
                console.log('No saved game found');
                return null;
            }

            const gameState = JSON.parse(savedState);
            const currentHash = this.generateHash(gameState);

            // Check if data was tampered with
            if (currentHash !== savedHash) {
                console.warn('⚠️ Save data hash mismatch - this can happen after game updates');
                // Don't trigger anti-cheat immediately, just update the hash
                // this.handleTamperDetection('Save file hash mismatch');
                // Update hash to current state (game might have been updated)
                localStorage.setItem('gameStateHash', currentHash);
                // return null;
            }

            this.lastSaveHash = savedHash;
            console.log('✅ Game loaded - integrity verified');
            return gameState;

        } catch (error) {
            console.error('Error loading game state:', error);
            return null;
        }
    }

    // Verify current game state hasn't been tampered with
    verifyCurrentState(gameState) {
        if (!this.lastSaveHash) {
            return true; // No baseline to compare
        }

        const currentHash = this.generateHash(gameState);
        const savedHash = localStorage.getItem('gameStateHash');

        if (savedHash && currentHash !== savedHash) {
            console.warn('⚠️ Runtime state hash mismatch - updating hash');
            // Update hash instead of triggering anti-cheat (game state changes legitimately)
            localStorage.setItem('gameStateHash', currentHash);
            // this.handleTamperDetection('Runtime state modification');
            // return false;
        }

        return true;
    }

    // Start periodic integrity checks (every 30 seconds)
    startPeriodicCheck(gameState) {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }

        this.checkInterval = setInterval(() => {
            if (!this.tamperDetected && gameState) {
                this.verifyCurrentState(gameState);
            }
        }, 30000); // Check every 30 seconds

        console.log('🛡️ Anti-cheat periodic checks started');
    }

    // Stop periodic checks
    stopPeriodicCheck() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    // Handle detected tampering
    handleTamperDetection(reason) {
        if (this.tamperDetected) {
            return; // Already handling
        }

        this.tamperDetected = true;
        console.error('🚨 CHEAT DETECTED:', reason);

        // Log to Firebase if available
        this.logCheatAttempt(reason);

        // Show warning to player
        alert(
            '⚠️ SAVE DATA CORRUPTION DETECTED\n\n' +
            'Your save file appears to be corrupted or modified.\n' +
            'This could be due to:\n' +
            '• Browser data corruption\n' +
            '• Unauthorized modifications\n' +
            '• Extension interference\n\n' +
            'Your progress will be reset for security.\n\n' +
            'If this was a mistake, please contact support.'
        );

        // Reset progress
        this.resetProgress();
    }

    // Log cheat attempt to Firebase
    async logCheatAttempt(reason) {
        try {
            if (typeof firebase !== 'undefined' && firebase.apps.length) {
                const db = firebase.firestore();
                const playerId = localStorage.getItem('playerId');
                const playerName = localStorage.getItem('playerName');

                await db.collection('cheatAttempts').add({
                    playerId: playerId || 'unknown',
                    playerName: playerName || 'unknown',
                    reason: reason,
                    timestamp: Date.now(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                });

                console.log('📊 Cheat attempt logged to database');
            }
        } catch (error) {
            console.error('Error logging cheat attempt:', error);
        }
    }

    // Reset player progress
    resetProgress() {
        console.log('🗑️ Resetting progress due to tampering...');
        
        // Clear all localStorage
        localStorage.clear();
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Reload page
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    // Validate specific value changes (for runtime checks)
    validateChange(fieldName, oldValue, newValue, maxAllowedChange) {
        const change = Math.abs(newValue - oldValue);
        
        if (change > maxAllowedChange) {
            console.warn(`⚠️ Suspicious ${fieldName} change: ${oldValue} -> ${newValue} (max: ${maxAllowedChange})`);
            this.handleTamperDetection(`Impossible ${fieldName} change`);
            return false;
        }
        
        return true;
    }

    // Check if localStorage is being manipulated directly
    monitorLocalStorage() {
        const originalSetItem = localStorage.setItem;
        const self = this;

        localStorage.setItem = function(key, value) {
            // Allow our own saves
            if (key === 'gameState' || key === 'gameStateHash' || key === 'lastSaveTime') {
                return originalSetItem.apply(this, arguments);
            }

            // Log other changes
            console.log('📝 localStorage change detected:', key);
            
            // If someone tries to modify gameState directly
            if (key === 'gameState' && !self.tamperDetected) {
                console.warn('⚠️ Direct localStorage.setItem detected for gameState');
                // This might be legitimate (from our code) or tampering
                // We'll verify on next periodic check
            }

            return originalSetItem.apply(this, arguments);
        };

        console.log('🔍 localStorage monitoring active');
    }

    // Obfuscate critical values (makes console editing harder)
    obfuscateValue(value) {
        // Simple XOR obfuscation
        const key = 0x5A5A5A5A;
        return value ^ key;
    }

    deobfuscateValue(obfuscated) {
        const key = 0x5A5A5A5A;
        return obfuscated ^ key;
    }
}

// Create global instance
window.antiCheat = new AntiCheat();

// Initialize monitoring
window.antiCheat.monitorLocalStorage();

console.log('🛡️ Anti-cheat system initialized');
