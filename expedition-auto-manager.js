// Expedition Auto-Manager

let expeditionAutoSettings = {
    autoSend: false,
    optimizeTeams: true,
    preferHighReward: true,
    minSuccessRate: 60
};

class ExpeditionAutoManager {
    constructor() {
        this.load();
        this.startChecking();
    }

    load() {
        const saved = localStorage.getItem('expeditionAutoSettings');
        if (saved) {
            expeditionAutoSettings = { ...expeditionAutoSettings, ...JSON.parse(saved) };
        }
    }

    save() {
        localStorage.setItem('expeditionAutoSettings', JSON.stringify(expeditionAutoSettings));
    }

    startChecking() {
        setInterval(() => {
            if (expeditionAutoSettings.autoSend) {
                this.checkAndSendExpeditions();
            }
        }, 10000);
    }

    checkAndSendExpeditions() {
        if (!gameState?.expeditions) return;

        const available = this.getAvailableExpeditions();
        if (available.length === 0) return;

        for (const expedition of available) {
            const team = this.buildOptimalTeam(expedition);
            const successRate = this.calculateSuccessRate(team, expedition);

            if (successRate >= expeditionAutoSettings.minSuccessRate) {
                this.sendExpedition(expedition, team);
            }
        }
    }

    getAvailableExpeditions() {
        if (!gameState?.expeditions?.available) return [];
        return gameState.expeditions.available.filter(e => !e.active);
    }

    buildOptimalTeam(expedition) {
        const team = [];
        const available = this.getAvailableUnits();

        available.sort((a, b) => {
            const aScore = this.getUnitScore(a, expedition);
            const bScore = this.getUnitScore(b, expedition);
            return bScore - aScore;
        });

        const maxTeamSize = expedition.teamSize || 3;
        for (let i = 0; i < Math.min(maxTeamSize, available.length); i++) {
            team.push(available[i]);
        }

        return team;
    }

    getAvailableUnits() {
        if (!gameState?.expeditions?.units) return [];
        return gameState.expeditions.units.filter(u => !u.onExpedition);
    }

    getUnitScore(unit, expedition) {
        let score = unit.level || 1;
        
        if (expedition.preferredType && unit.type === expedition.preferredType) {
            score *= 1.5;
        }

        if (unit.skills) {
            score += unit.skills.length * 2;
        }

        return score;
    }

    calculateSuccessRate(team, expedition) {
        if (team.length === 0) return 0;

        let totalPower = team.reduce((sum, unit) => sum + (unit.power || 10), 0);
        let requiredPower = expedition.difficulty || 30;

        let rate = Math.min((totalPower / requiredPower) * 100, 100);

        if (expedition.preferredType) {
            const hasType = team.some(u => u.type === expedition.preferredType);
            if (hasType) rate = Math.min(rate * 1.2, 100);
        }

        return Math.floor(rate);
    }

    sendExpedition(expedition, team) {
        if (typeof startExpedition === 'function') {
            startExpedition(expedition.id, team.map(u => u.id));
            console.log(`📤 Auto-sent expedition: ${expedition.name} with ${team.length} units`);
        }
    }

    getRewardValue(expedition) {
        if (!expedition.rewards) return 0;
        let value = 0;
        
        if (expedition.rewards.money) value += expedition.rewards.money;
        if (expedition.rewards.items) value += expedition.rewards.items.length * 100;
        if (expedition.rewards.auras) value += expedition.rewards.auras.length * 1000;
        
        return value;
    }

    openSettings() {
        let modal = document.getElementById('expeditionAutoModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'expeditionAutoModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h2>🗺️ Expedition Auto-Manager</h2>
                        <button class="close-btn" onclick="expeditionAutoManager.closeSettings()">✖</button>
                    </div>
                    <div class="modal-body" style="padding: 20px;">
                        <div style="display: grid; gap: 20px;">
                            <div style="background: rgba(59, 130, 246, 0.1); border: 2px solid #3b82f6; padding: 15px; border-radius: 8px;">
                                <h3 style="color: #93c5fd; margin-top: 0;">⚙️ Auto-Send Settings</h3>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0; cursor: pointer;">
                                    <input type="checkbox" id="autoSendCheck" ${expeditionAutoSettings.autoSend ? 'checked' : ''}>
                                    <span>Enable auto-send expeditions</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0; cursor: pointer;">
                                    <input type="checkbox" id="optimizeTeamsCheck" ${expeditionAutoSettings.optimizeTeams ? 'checked' : ''}>
                                    <span>Optimize team composition</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0; cursor: pointer;">
                                    <input type="checkbox" id="preferHighRewardCheck" ${expeditionAutoSettings.preferHighReward ? 'checked' : ''}>
                                    <span>Prefer high-reward expeditions</span>
                                </label>
                            </div>

                            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
                                <h3>🎯 Success Rate Filter</h3>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                                    <span>Minimum success rate:</span>
                                    <input type="number" id="minSuccessInput" min="0" max="100" step="5" value="${expeditionAutoSettings.minSuccessRate}" 
                                           style="width: 80px; padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">
                                    <span>%</span>
                                </label>
                                <p style="color: #888; font-size: 0.9em; margin-top: 10px;">Only send expeditions with at least this success rate</p>
                            </div>

                            <button onclick="expeditionAutoManager.saveSettings()" 
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
        const modal = document.getElementById('expeditionAutoModal');
        if (modal) modal.classList.remove('show');
    }

    saveSettings() {
        expeditionAutoSettings.autoSend = document.getElementById('autoSendCheck').checked;
        expeditionAutoSettings.optimizeTeams = document.getElementById('optimizeTeamsCheck').checked;
        expeditionAutoSettings.preferHighReward = document.getElementById('preferHighRewardCheck').checked;
        expeditionAutoSettings.minSuccessRate = parseInt(document.getElementById('minSuccessInput').value);
        
        this.save();
        this.closeSettings();
        
        if (typeof showNotification === 'function') {
            showNotification('✅ Expedition auto-manager settings saved!');
        }
    }
}

const expeditionAutoManager = new ExpeditionAutoManager();

window.expeditionAutoManager = expeditionAutoManager;
window.openExpeditionAuto = () => expeditionAutoManager.openSettings();

console.log('🗺️ Expedition Auto-Manager loaded');
