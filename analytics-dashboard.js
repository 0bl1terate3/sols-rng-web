// Analytics Dashboard

class AnalyticsDashboard {
    constructor() {
        this.sessionStart = Date.now();
        this.sessionStats = this.resetSessionStats();
        this.records = this.loadRecords();
    }

    resetSessionStats() {
        return {
            rolls: 0,
            money: gameState?.money || 0,
            startMoney: gameState?.money || 0,
            aurasCaught: 0,
            breakthroughs: 0,
            craftedItems: 0,
            startTime: Date.now()
        };
    }

    loadRecords() {
        const saved = localStorage.getItem('analyticsRecords');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            bestSession: { rolls: 0, money: 0, duration: 0 },
            totalSessions: 0,
            allTimeRolls: 0,
            allTimeMoney: 0
        };
    }

    saveRecords() {
        localStorage.setItem('analyticsRecords', JSON.stringify(this.records));
    }

    trackRoll() {
        this.sessionStats.rolls++;
    }

    trackMoney(amount) {
        this.sessionStats.money = amount;
    }

    trackAura() {
        this.sessionStats.aurasCaught++;
    }

    trackBreakthrough() {
        this.sessionStats.breakthroughs++;
    }

    trackCraft() {
        this.sessionStats.craftedItems++;
    }

    getSessionDuration() {
        return Date.now() - this.sessionStats.startTime;
    }

    getRollsPerMinute() {
        const duration = this.getSessionDuration() / 60000;
        return duration > 0 ? (this.sessionStats.rolls / duration).toFixed(1) : 0;
    }

    getMoneyPerHour() {
        const duration = this.getSessionDuration() / 3600000;
        const earned = this.sessionStats.money - this.sessionStats.startMoney;
        return duration > 0 ? Math.floor(earned / duration) : 0;
    }

    getEfficiency() {
        return this.sessionStats.rolls > 0 ? 
            (this.sessionStats.aurasCaught / this.sessionStats.rolls * 100).toFixed(1) : 0;
    }

    endSession() {
        const duration = this.getSessionDuration();
        const moneyEarned = this.sessionStats.money - this.sessionStats.startMoney;

        if (this.sessionStats.rolls > this.records.bestSession.rolls) {
            this.records.bestSession = {
                rolls: this.sessionStats.rolls,
                money: moneyEarned,
                duration: duration
            };
        }

        this.records.totalSessions++;
        this.records.allTimeRolls += this.sessionStats.rolls;
        this.records.allTimeMoney += moneyEarned;

        this.saveRecords();
    }

    open() {
        let modal = document.getElementById('analyticsModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'analyticsModal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }

        const duration = this.getSessionDuration();
        const hours = Math.floor(duration / 3600000);
        const minutes = Math.floor((duration % 3600000) / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);

        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h2>📊 Analytics Dashboard</h2>
                    <button class="close-btn" onclick="analyticsDashboard.close()">✖</button>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; color: white;">
                            <div style="font-size: 2.5em; font-weight: bold;">${this.sessionStats.rolls}</div>
                            <div style="opacity: 0.9; margin-top: 5px;">Session Rolls</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 12px; color: white;">
                            <div style="font-size: 2.5em; font-weight: bold;">${this.getRollsPerMinute()}</div>
                            <div style="opacity: 0.9; margin-top: 5px;">Rolls/Minute</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 12px; color: white;">
                            <div style="font-size: 2.5em; font-weight: bold;">$${this.getMoneyPerHour().toLocaleString()}</div>
                            <div style="opacity: 0.9; margin-top: 5px;">Money/Hour</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 12px; color: white;">
                            <div style="font-size: 2.5em; font-weight: bold;">${this.getEfficiency()}%</div>
                            <div style="opacity: 0.9; margin-top: 5px;">Efficiency</div>
                        </div>
                    </div>

                    <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h3 style="margin-top: 0;">⏱️ Session Info</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div><strong>Duration:</strong> ${hours}h ${minutes}m ${seconds}s</div>
                            <div><strong>Auras Caught:</strong> ${this.sessionStats.aurasCaught}</div>
                            <div><strong>Money Earned:</strong> $${(this.sessionStats.money - this.sessionStats.startMoney).toLocaleString()}</div>
                            <div><strong>Breakthroughs:</strong> ${this.sessionStats.breakthroughs}</div>
                            <div><strong>Items Crafted:</strong> ${this.sessionStats.craftedItems}</div>
                            <div><strong>Current Money:</strong> $${this.sessionStats.money.toLocaleString()}</div>
                        </div>
                    </div>

                    <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px;">
                        <h3 style="margin-top: 0;">🏆 Records</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div><strong>Best Session Rolls:</strong> ${this.records.bestSession.rolls}</div>
                            <div><strong>Total Sessions:</strong> ${this.records.totalSessions}</div>
                            <div><strong>All-Time Rolls:</strong> ${this.records.allTimeRolls.toLocaleString()}</div>
                            <div><strong>All-Time Money:</strong> $${this.records.allTimeMoney.toLocaleString()}</div>
                        </div>
                    </div>

                    <div style="margin-top: 20px; display: flex; gap: 10px;">
                        <button onclick="analyticsDashboard.reset()" 
                                style="flex: 1; padding: 12px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                            🔄 Reset Session
                        </button>
                        <button onclick="analyticsDashboard.exportData()" 
                                style="flex: 1; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                            📥 Export Data
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('show');
    }

    close() {
        const modal = document.getElementById('analyticsModal');
        if (modal) modal.classList.remove('show');
    }

    reset() {
        if (!confirm('Reset session statistics?')) return;
        this.sessionStats = this.resetSessionStats();
        if (typeof showNotification === 'function') {
            showNotification('✅ Session statistics reset');
        }
        this.close();
    }

    exportData() {
        const data = {
            session: this.sessionStats,
            records: this.records,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        if (typeof showNotification === 'function') {
            showNotification('📥 Analytics data exported');
        }
    }
}

const analyticsDashboard = new AnalyticsDashboard();

window.analyticsDashboard = analyticsDashboard;
window.openAnalytics = () => analyticsDashboard.open();

console.log('📊 Analytics Dashboard loaded');
