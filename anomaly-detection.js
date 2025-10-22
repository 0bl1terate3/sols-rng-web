// =================================================================
// Anomaly Detection System
// =================================================================
// Detects impossible actions and flags suspicious behavior

class AnomalyDetector {
    constructor() {
        // Rate limiting
        this.lastRollTime = 0;
        this.rollsPerMinute = [];
        this.lastMoneyChange = 0;
        this.moneyChangesPerMinute = [];
        
        // Tracking
        this.suspiciousActions = [];
        this.warningCount = 0;
        this.isBanned = false;
        
        // Thresholds
        this.MAX_ROLLS_PER_MINUTE = 600; // 10 rolls/sec max (even with auto-roll)
        this.MIN_ROLL_INTERVAL = 50; // 50ms minimum between rolls
        this.MAX_MONEY_GAIN_PER_ACTION = 1000000; // 1M max gain at once
        this.MAX_MONEY_CHANGES_PER_MINUTE = 100;
        this.MAX_WARNINGS = 3; // Reset after 3 warnings
        
        // Legitimate transaction flag
        this.isLegitimateTransaction = false;
    }

    // Check if roll rate is suspicious
    checkRollRate() {
        const now = Date.now();
        const timeSinceLastRoll = now - this.lastRollTime;

        // Check minimum interval
        if (this.lastRollTime > 0 && timeSinceLastRoll < this.MIN_ROLL_INTERVAL) {
            this.flagSuspicious('Roll too fast', {
                interval: timeSinceLastRoll,
                minimum: this.MIN_ROLL_INTERVAL
            });
            return false;
        }

        this.lastRollTime = now;
        this.rollsPerMinute.push(now);

        // Keep only last minute of rolls
        this.rollsPerMinute = this.rollsPerMinute.filter(t => now - t < 60000);

        // Check rolls per minute
        if (this.rollsPerMinute.length > this.MAX_ROLLS_PER_MINUTE) {
            this.flagSuspicious('Too many rolls per minute', {
                count: this.rollsPerMinute.length,
                maximum: this.MAX_ROLLS_PER_MINUTE
            });
            return false;
        }

        return true;
    }

    // Check for impossible money changes
    checkMoneyChange(oldMoney, newMoney, context = 'unknown') {
        const now = Date.now();
        const change = newMoney - oldMoney;
        const gain = Math.abs(change);

        // Skip check if this is a legitimate transaction (selling, crafting, etc.)
        if (this.isLegitimateTransaction) {
            this.isLegitimateTransaction = false; // Reset flag
            return true;
        }

        // Track money changes
        this.moneyChangesPerMinute.push(now);
        this.moneyChangesPerMinute = this.moneyChangesPerMinute.filter(t => now - t < 60000);

        // Check for too many money changes
        if (this.moneyChangesPerMinute.length > this.MAX_MONEY_CHANGES_PER_MINUTE) {
            this.flagSuspicious('Too many money changes per minute', {
                count: this.moneyChangesPerMinute.length,
                maximum: this.MAX_MONEY_CHANGES_PER_MINUTE
            });
            return false;
        }

        // Check for impossible gains
        if (gain > this.MAX_MONEY_GAIN_PER_ACTION) {
            this.flagSuspicious('Impossible money gain', {
                oldMoney,
                newMoney,
                gain,
                maximum: this.MAX_MONEY_GAIN_PER_ACTION,
                context
            });
            return false;
        }

        // Check for negative money (should never happen)
        if (newMoney < 0) {
            this.flagSuspicious('Negative money detected', {
                oldMoney,
                newMoney,
                context
            });
            return false;
        }

        this.lastMoneyChange = now;
        return true;
    }

    // Mark next transaction as legitimate (for selling, etc.)
    markLegitimateTransaction() {
        this.isLegitimateTransaction = true;
    }

    // Check inventory changes
    checkInventoryChange(itemType, itemName, oldCount, newCount) {
        const change = newCount - oldCount;

        // Check for impossible item gains (more than 100 at once is suspicious)
        if (change > 100 && !this.isLegitimateTransaction) {
            this.flagSuspicious('Impossible inventory gain', {
                itemType,
                itemName,
                oldCount,
                newCount,
                gain: change
            });
            return false;
        }

        // Check for negative counts
        if (newCount < 0) {
            this.flagSuspicious('Negative inventory count', {
                itemType,
                itemName,
                count: newCount
            });
            return false;
        }

        return true;
    }

    // Check for impossible stat values
    checkStatValue(statName, value) {
        const impossibleStats = {
            luck: 1000000, // Max luck multiplier
            speed: 100, // Max speed multiplier
            level: 10000 // Max level
        };

        if (impossibleStats[statName] && value > impossibleStats[statName]) {
            this.flagSuspicious('Impossible stat value', {
                stat: statName,
                value,
                maximum: impossibleStats[statName]
            });
            return false;
        }

        return true;
    }

    // Flag suspicious activity
    flagSuspicious(reason, details = {}) {
        if (this.isBanned) {
            return; // Already banned
        }

        const suspiciousAction = {
            reason,
            details,
            timestamp: Date.now()
        };

        this.suspiciousActions.push(suspiciousAction);
        this.warningCount++;

        console.warn('⚠️ SUSPICIOUS ACTIVITY DETECTED:', reason, details);

        // Log to Firebase
        this.logSuspiciousActivity(suspiciousAction);

        // Show warning to player
        if (this.warningCount === 1) {
            if (typeof showNotification === 'function') {
                showNotification('⚠️ Unusual activity detected. Please play normally.', 'warning');
            }
        }

        // Take action after multiple warnings
        if (this.warningCount >= this.MAX_WARNINGS) {
            this.handleCheater();
        }
    }

    // Log suspicious activity to Firebase
    async logSuspiciousActivity(action) {
        try {
            if (typeof firebase !== 'undefined' && firebase.apps.length) {
                const db = firebase.firestore();
                const playerId = localStorage.getItem('playerId');
                const playerName = localStorage.getItem('playerName');

                await db.collection('suspiciousActivity').add({
                    playerId: playerId || 'unknown',
                    playerName: playerName || 'unknown',
                    reason: action.reason,
                    details: action.details,
                    timestamp: action.timestamp,
                    warningCount: this.warningCount,
                    userAgent: navigator.userAgent
                });

                console.log('📊 Suspicious activity logged');
            }
        } catch (error) {
            console.error('Error logging suspicious activity:', error);
        }
    }

    // Handle detected cheater
    async handleCheater() {
        if (this.isBanned) {
            return;
        }

        this.isBanned = true;
        console.error('🚨 CHEATER DETECTED - TAKING ACTION');

        // Log final cheat detection
        try {
            if (typeof firebase !== 'undefined' && firebase.apps.length) {
                const db = firebase.firestore();
                const playerId = localStorage.getItem('playerId');
                const playerName = localStorage.getItem('playerName');

                await db.collection('bannedPlayers').add({
                    playerId: playerId || 'unknown',
                    playerName: playerName || 'unknown',
                    reason: 'Multiple suspicious activities detected',
                    suspiciousActions: this.suspiciousActions,
                    timestamp: Date.now(),
                    userAgent: navigator.userAgent
                });

                console.log('🚫 Player banned and logged');
            }
        } catch (error) {
            console.error('Error logging ban:', error);
        }

        // Show message and reset
        alert(
            '🚨 ANTI-CHEAT VIOLATION\n\n' +
            'Multiple suspicious activities have been detected.\n\n' +
            'Violations:\n' +
            this.suspiciousActions.map(a => `• ${a.reason}`).join('\n') +
            '\n\n' +
            'Your progress has been reset and this incident has been logged.\n\n' +
            'If you believe this is an error, please contact support.'
        );

        // Reset progress
        this.resetProgress();
    }

    // Reset player progress
    resetProgress() {
        console.log('🗑️ Resetting progress due to cheating...');
        
        // Clear all data
        localStorage.clear();
        sessionStorage.clear();
        
        // Reload page
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    // Get statistics
    getStats() {
        return {
            rollsPerMinute: this.rollsPerMinute.length,
            moneyChangesPerMinute: this.moneyChangesPerMinute.length,
            suspiciousActions: this.suspiciousActions.length,
            warningCount: this.warningCount,
            isBanned: this.isBanned
        };
    }

    // Reset warnings (for testing or after time period)
    resetWarnings() {
        this.warningCount = 0;
        this.suspiciousActions = [];
        console.log('✅ Warnings reset');
    }

    // Check if player is currently flagged
    isFlagged() {
        return this.warningCount > 0;
    }
}

// Create global instance
window.anomalyDetector = new AnomalyDetector();

console.log('🔍 Anomaly detection system initialized');
