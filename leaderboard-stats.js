// =================================================================
// Leaderboard Stats Tracking System
// =================================================================

class LeaderboardStatsTracker {
    constructor() {
        this.lastSubmittedGlobals = new Set();
        this.lastCollectionScore = 0;
        this.checkInterval = 30000; // Check every 30 seconds
        this.init();
    }

    init() {
        console.log('📊 Leaderboard Stats Tracker initialized');
        
        // Load last submitted data from localStorage
        const saved = localStorage.getItem('leaderboard_last_submitted');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.lastSubmittedGlobals = new Set(data.globals || []);
                this.lastCollectionScore = data.collectionScore || 0;
            } catch (e) {
                console.error('Error loading last submitted data:', e);
            }
        }

        // Start periodic checking
        setInterval(() => this.checkForUpdates(), this.checkInterval);
    }

    async checkForUpdates() {
        if (!window.globalLeaderboard) return;

        // Check for new global auras
        await this.checkGlobalAuras();
        
        // Check collection score
        await this.checkCollectionScore();
    }

    async checkGlobalAuras() {
        if (!window.auras || !window.playerName) return;

        const globalAuras = Object.entries(window.auras)
            .filter(([name, data]) => data.owned && data.rarity >= 1000000)
            .map(([name, data]) => ({ name, rarity: data.rarity }));

        for (const aura of globalAuras) {
            const key = `${aura.name}_${aura.rarity}`;
            
            if (!this.lastSubmittedGlobals.has(key)) {
                console.log('🎯 New global aura detected:', aura.name);
                
                // Auto-submit to leaderboard
                const success = await window.globalLeaderboard.submitGlobal(
                    aura.name,
                    aura.rarity,
                    window.gameState?.totalRolls || 0
                );

                if (success) {
                    this.lastSubmittedGlobals.add(key);
                    this.saveSubmittedData();
                    console.log('✅ Auto-submitted global aura:', aura.name);
                }
            }
        }
    }

    async checkCollectionScore() {
        if (!window.auras || !window.playerName) return;

        // Calculate current collection score
        const score = Object.values(window.auras)
            .filter(data => data.owned)
            .reduce((sum, data) => sum + (data.rarity || 0), 0);

        const uniqueAuras = Object.values(window.auras)
            .filter(data => data.owned).length;

        // Only submit if score increased
        if (score > this.lastCollectionScore) {
            console.log('📈 Collection score increased:', this.lastCollectionScore, '->', score);
            
            const success = await window.globalLeaderboard.submitCollectedStats(score, uniqueAuras);

            if (success) {
                this.lastCollectionScore = score;
                this.saveSubmittedData();
                console.log('✅ Auto-submitted collection stats');
            }
        }
    }

    saveSubmittedData() {
        const data = {
            globals: Array.from(this.lastSubmittedGlobals),
            collectionScore: this.lastCollectionScore
        };
        localStorage.setItem('leaderboard_last_submitted', JSON.stringify(data));
    }

    // Manual submission methods
    async submitCurrentGlobals() {
        if (!window.globalLeaderboard || !window.auras) {
            console.error('❌ Leaderboard or auras not available');
            return false;
        }

        const globalAuras = Object.entries(window.auras)
            .filter(([name, data]) => data.owned && data.rarity >= 1000000);

        let submittedCount = 0;
        for (const [name, data] of globalAuras) {
            const success = await window.globalLeaderboard.submitGlobal(
                name,
                data.rarity,
                window.gameState?.totalRolls || 0
            );
            if (success) submittedCount++;
        }

        console.log(`✅ Submitted ${submittedCount} global auras`);
        return submittedCount > 0;
    }

    async submitCurrentCollectionScore() {
        if (!window.globalLeaderboard || !window.auras) {
            console.error('❌ Leaderboard or auras not available');
            return false;
        }

        const score = Object.values(window.auras)
            .filter(data => data.owned)
            .reduce((sum, data) => sum + (data.rarity || 0), 0);

        const uniqueAuras = Object.values(window.auras)
            .filter(data => data.owned).length;

        const success = await window.globalLeaderboard.submitCollectedStats(score, uniqueAuras);
        
        if (success) {
            console.log('✅ Submitted collection stats:', { score, uniqueAuras });
        }

        return success;
    }
}

// Initialize tracker when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.leaderboardStatsTracker = new LeaderboardStatsTracker();
    });
} else {
    window.leaderboardStatsTracker = new LeaderboardStatsTracker();
}

console.log('✅ Leaderboard Stats Tracker loaded');
