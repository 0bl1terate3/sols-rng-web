// =================================================================
// Global Leaderboard System - Local Backend Integration
// =================================================================

class GlobalLeaderboard {
    constructor() {
        // Use environment variable or default to localhost
        this.backendUrl = window.BACKEND_URL || 'http://localhost:8090';
        this.initialized = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        console.log('🏆 GlobalLeaderboard initializing with backend:', this.backendUrl);
        this.init();
    }

    async init() {
        try {
            // Test backend connection using actual leaderboard endpoint
            const response = await fetch(`${this.backendUrl}/leaderboard/globals?limit=1`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            
            if (response.ok) {
                this.initialized = true;
                console.log('✅ Backend connection established');
            } else {
                console.warn('⚠️ Backend responded but not healthy:', response.status);
            }
        } catch (error) {
            console.warn('⚠️ Backend not available:', error.message);
            console.log('💡 Leaderboard will work in offline mode');
        }
    }

    async submitGlobal(auraName, auraRarity, rollCount) {
        if (!this.initialized) {
            console.warn('⚠️ Backend not initialized, skipping submission');
            return false;
        }

        const playerName = window.playerName || 'Anonymous';
        
        try {
            const response = await fetch(`${this.backendUrl}/leaderboard/submitGlobal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    playerName,
                    auraName,
                    auraRarity,
                    rollCount
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Global aura submitted:', auraName);
                
                // Show notification if rank is good
                if (data.rank && data.rank <= 10) {
                    this.showNotification(`🏆 Rank #${data.rank} on Global Leaderboard!`, auraName);
                }
                
                return true;
            } else {
                console.error('❌ Failed to submit global:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ Error submitting global:', error);
            return false;
        }
    }

    async submitCollectedStats(totalScore, uniqueAuras) {
        if (!this.initialized) {
            console.warn('⚠️ Backend not initialized, skipping submission');
            return false;
        }

        const playerName = window.playerName || 'Anonymous';
        
        try {
            const response = await fetch(`${this.backendUrl}/leaderboard/submitCollectedStats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    playerName,
                    totalScore,
                    uniqueAuras
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Collection stats submitted');
                
                // Show notification if rank is good
                if (data.rank && data.rank <= 10) {
                    this.showNotification(`📊 Rank #${data.rank} on Collection Leaderboard!`, `Score: ${totalScore.toLocaleString()}`);
                }
                
                return true;
            } else {
                console.error('❌ Failed to submit stats:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ Error submitting stats:', error);
            return false;
        }
    }

    async getTopGlobals(limit = 50) {
        if (!this.initialized) {
            console.warn('⚠️ Backend not initialized, returning empty data');
            return [];
        }

        try {
            const response = await fetch(`${this.backendUrl}/leaderboard/globals?limit=${limit}`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                const data = await response.json();
                return data.entries || [];
            } else {
                console.error('❌ Failed to fetch globals:', response.status);
                return [];
            }
        } catch (error) {
            console.error('❌ Error fetching globals:', error);
            return [];
        }
    }

    async getTopCollectedStats(limit = 50) {
        if (!this.initialized) {
            console.warn('⚠️ Backend not initialized, returning empty data');
            return [];
        }

        try {
            const response = await fetch(`${this.backendUrl}/leaderboard/collectedStats?limit=${limit}`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                const data = await response.json();
                return data.entries || [];
            } else {
                console.error('❌ Failed to fetch stats:', response.status);
                return [];
            }
        } catch (error) {
            console.error('❌ Error fetching stats:', error);
            return [];
        }
    }

    showNotification(title, message) {
        if (typeof showNotification === 'function') {
            showNotification(title, message, 'success');
        } else {
            console.log(`🔔 ${title}: ${message}`);
        }
    }

    // Set custom backend URL (useful for ngrok or remote backends)
    setBackendUrl(url) {
        this.backendUrl = url;
        this.initialized = false;
        console.log('🔄 Backend URL updated to:', url);
        this.init();
    }
}

// Initialize global leaderboard
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.globalLeaderboard = new GlobalLeaderboard();
    });
} else {
    window.globalLeaderboard = new GlobalLeaderboard();
}

// Helper function to change backend URL
window.setLeaderboardBackend = function(url) {
    if (window.globalLeaderboard) {
        window.globalLeaderboard.setBackendUrl(url);
    }
};

console.log('✅ Global Leaderboard System loaded');
