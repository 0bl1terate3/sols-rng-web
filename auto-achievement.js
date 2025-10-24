// Achievement Tracker System

let achievementTrackerSettings = {
    notifications: true,
    progressAlerts: true,
    alertThresholds: [50, 75, 90, 95],
    showNearCompletion: true
};

class AchievementTracker {
    constructor() {
        this.trackedProgress = {};
        this.load();
        this.startTracking();
    }

    load() {
        const saved = localStorage.getItem('achievementTrackerSettings');
        if (saved) {
            achievementTrackerSettings = { ...achievementTrackerSettings, ...JSON.parse(saved) };
        }
    }

    save() {
        localStorage.setItem('achievementTrackerSettings', JSON.stringify(achievementTrackerSettings));
    }

    startTracking() {
        setInterval(() => this.checkAchievements(), 5000);
    }

    checkAchievements() {
        if (!gameState?.achievements) return;

        for (const [id, achievement] of Object.entries(gameState.achievements)) {
            if (!achievement.completed && achievementTrackerSettings.progressAlerts) {
                this.checkProgress(id, achievement);
            }
        }
    }

    checkProgress(id, achievement) {
        if (!achievement.progress || !achievement.requirement) return;

        const percent = (achievement.progress / achievement.requirement) * 100;
        
        for (const threshold of achievementTrackerSettings.alertThresholds) {
            const key = `${id}_${threshold}`;
            
            if (percent >= threshold && !this.trackedProgress[key]) {
                this.trackedProgress[key] = true;
                
                if (typeof showNotification === 'function') {
                    showNotification(`📈 ${achievement.name}: ${percent.toFixed(0)}% complete!`, 'info');
                }
            }
        }
    }

    getCompletedCount() {
        if (!gameState?.achievements) return 0;
        return Object.values(gameState.achievements).filter(a => a.completed).length;
    }

    getInProgressCount() {
        if (!gameState?.achievements) return 0;
        return Object.values(gameState.achievements).filter(a => !a.completed && a.progress > 0).length;
    }

    getNearCompletionList() {
        if (!gameState?.achievements) return [];
        
        return Object.entries(gameState.achievements)
            .filter(([id, a]) => !a.completed && a.progress && a.requirement)
            .map(([id, a]) => ({
                id,
                name: a.name,
                progress: a.progress,
                requirement: a.requirement,
                percent: (a.progress / a.requirement * 100).toFixed(1)
            }))
            .filter(a => parseFloat(a.percent) >= 75)
            .sort((a, b) => parseFloat(b.percent) - parseFloat(a.percent));
    }

    openSettings() {
        let modal = document.getElementById('autoAchievementModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'autoAchievementModal';
            modal.className = 'modal';
            const nearCompletion = this.getNearCompletionList();
            
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h2>🏆 Achievement Tracker</h2>
                        <button class="close-btn" onclick="achievementTracker.closeSettings()">✖</button>
                    </div>
                    <div class="modal-body" style="padding: 20px;">
                        <div style="display: grid; gap: 20px;">
                            <div style="background: rgba(59, 130, 246, 0.1); border: 2px solid #3b82f6; padding: 15px; border-radius: 8px;">
                                <h3 style="color: #93c5fd; margin-top: 0;">📊 Progress Overview</h3>
                                <p style="color: #bfdbfe; margin: 10px 0;">
                                    <strong>Completed:</strong> ${this.getCompletedCount()}<br>
                                    <strong>In Progress:</strong> ${this.getInProgressCount()}<br>
                                    <strong>Near Completion (≥75%):</strong> ${nearCompletion.length}
                                </p>
                            </div>

                            ${nearCompletion.length > 0 ? `
                                <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; max-height: 300px; overflow-y: auto;">
                                    <h3>🎯 Almost There!</h3>
                                    ${nearCompletion.map(a => `
                                        <div style="background: rgba(255,255,255,0.02); padding: 10px; margin: 8px 0; border-radius: 6px; border-left: 3px solid #3b82f6;">
                                            <div style="font-weight: bold;">${a.name}</div>
                                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px;">
                                                <div style="color: #888; font-size: 0.9em;">${a.progress.toLocaleString()} / ${a.requirement.toLocaleString()}</div>
                                                <div style="color: #3b82f6; font-weight: bold;">${a.percent}%</div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}

                            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
                                <h3>⚙️ Notification Settings</h3>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0; cursor: pointer;">
                                    <input type="checkbox" id="progressAlertsCheck" ${achievementTrackerSettings.progressAlerts ? 'checked' : ''}>
                                    <span>Show progress notifications</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0; cursor: pointer;">
                                    <input type="checkbox" id="showNearCompletionCheck" ${achievementTrackerSettings.showNearCompletion ? 'checked' : ''}>
                                    <span>Highlight near-completion achievements</span>
                                </label>
                                <p style="color: #888; font-size: 0.9em; margin-top: 10px;">
                                    Alert at: 50%, 75%, 90%, 95% progress
                                </p>
                            </div>

                            <button onclick="achievementTracker.saveSettings()" 
                                    style="padding: 15px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; border: none; border-radius: 8px; font-size: 1.1em; font-weight: bold; cursor: pointer;">
                                💾 Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        modal.classList.add('show');
    }

    closeSettings() {
        const modal = document.getElementById('autoAchievementModal');
        if (modal) modal.classList.remove('show');
    }

    saveSettings() {
        achievementTrackerSettings.progressAlerts = document.getElementById('progressAlertsCheck').checked;
        achievementTrackerSettings.showNearCompletion = document.getElementById('showNearCompletionCheck').checked;
        
        this.save();
        this.closeSettings();
        
        if (typeof showNotification === 'function') {
            showNotification('✅ Achievement tracker settings saved!');
        }
    }
}

const achievementTracker = new AchievementTracker();

window.achievementTracker = achievementTracker;
window.openAchievementTracker = () => achievementTracker.openSettings();
window.openAutoAchievement = () => achievementTracker.openSettings();

console.log('🏆 Achievement Tracker loaded');
