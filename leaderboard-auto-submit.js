// =================================================================
// Leaderboard Auto-Submission System
// =================================================================
// Automatically tracks and submits player stats to various leaderboards

class LeaderboardAutoSubmit {
    constructor() {
        this.submitInterval = 60000; // Submit every 60 seconds
        this.lastSubmittedStats = {};
    }

    initialize() {
        console.log('📊 Leaderboard auto-submit system initialized');
        
        // Start periodic submission
        setInterval(() => this.submitAllStats(), this.submitInterval);
        
        // Submit on page unload
        window.addEventListener('beforeunload', () => this.submitAllStats());
    }

    async submitAllStats() {
        if (!window.globalLeaderboard || !window.gameState) {
            return;
        }

        const stats = this.collectStats();
        
        // Submit each stat if it has changed
        if (stats.totalRolls !== this.lastSubmittedStats.totalRolls) {
            await this.submitStat('totalRolls', { 
                rollCount: stats.totalRolls,
                score: stats.totalRolls
            });
            this.lastSubmittedStats.totalRolls = stats.totalRolls;
        }

        if (stats.breakthroughs !== this.lastSubmittedStats.breakthroughs) {
            await this.submitStat('breakthroughs', { 
                breakthroughCount: stats.breakthroughs,
                score: stats.breakthroughs
            });
            this.lastSubmittedStats.breakthroughs = stats.breakthroughs;
        }

        if (stats.money !== this.lastSubmittedStats.money) {
            await this.submitStat('richest', { 
                money: stats.money,
                score: stats.money
            });
            this.lastSubmittedStats.money = stats.money;
        }

        // Submit fastest global if they have one
        if (stats.fastestGlobal && stats.fastestGlobal !== this.lastSubmittedStats.fastestGlobal) {
            await this.submitStat('fastestGlobal', {
                rollCount: stats.fastestGlobal.rollCount,
                auraName: stats.fastestGlobal.auraName,
                score: stats.fastestGlobal.rollCount
            });
            this.lastSubmittedStats.fastestGlobal = stats.fastestGlobal;
        }
    }

    collectStats() {
        const gameState = window.gameState || {};
        
        const stats = {
            totalRolls: gameState.totalRolls || 0,
            breakthroughs: gameState.totalBreakthroughs || 0,
            money: gameState.money || 0,
            fastestGlobal: null
        };

        // Find fastest global aura (fewest rolls)
        if (gameState.inventory && gameState.inventory.auras) {
            let fastestGlobal = null;
            let minRolls = Infinity;

            for (const [auraName, auraData] of Object.entries(gameState.inventory.auras)) {
                if (auraData.rarity && auraData.rarity > 99999998) { // Global aura
                    const rollsWhenObtained = auraData.rollsWhenObtained || gameState.totalRolls;
                    if (rollsWhenObtained < minRolls) {
                        minRolls = rollsWhenObtained;
                        fastestGlobal = {
                            rollCount: rollsWhenObtained,
                            auraName: auraName
                        };
                    }
                }
            }

            stats.fastestGlobal = fastestGlobal;
        }

        return stats;
    }

    async submitStat(category, data) {
        if (window.globalLeaderboard && typeof window.globalLeaderboard.submitToLeaderboard === 'function') {
            await window.globalLeaderboard.submitToLeaderboard(category, data);
        }
    }
}

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.leaderboardAutoSubmit = new LeaderboardAutoSubmit();
        // Delay initialization to ensure game is ready
        setTimeout(() => window.leaderboardAutoSubmit.initialize(), 5000);
    });
} else {
    window.leaderboardAutoSubmit = new LeaderboardAutoSubmit();
    setTimeout(() => window.leaderboardAutoSubmit.initialize(), 5000);
}

console.log('✅ Leaderboard auto-submit system loaded');
