// Bulk Roll System

let bulkRollSettings = {
    enabled: false,
    rollCount: 100,
    pauseOnRarity: 1000000,
    pauseOnTier: 'legendary',
    usePresets: false,
    currentPreset: 'balanced',
    stopOnInventoryFull: true,
    resumeAfterCraft: false
};

const bulkRollPresets = {
    farmCommons: {
        name: 'Farm Commons',
        pauseOnRarity: 10000,
        rollSpeed: 'fast',
        autoCraft: true
    },
    huntLegendaries: {
        name: 'Hunt Legendaries',
        pauseOnRarity: 1000000,
        rollSpeed: 'normal',
        autoCraft: false
    },
    balanced: {
        name: 'Balanced',
        pauseOnRarity: 100000,
        rollSpeed: 'normal',
        autoCraft: true
    },
    speedRun: {
        name: 'Speed Run',
        pauseOnRarity: 10000000,
        rollSpeed: 'fastest',
        autoCraft: true
    }
};

class BulkRollSystem {
    constructor() {
        this.isRunning = false;
        this.currentRolls = 0;
        this.targetRolls = 0;
        this.sessionStats = this.resetStats();
        this.load();
    }

    resetStats() {
        return {
            totalRolls: 0,
            rarityBreakdown: {},
            bestRoll: { name: 'None', rarity: 0 },
            startTime: Date.now(),
            pauses: 0
        };
    }

    load() {
        const saved = localStorage.getItem('bulkRollSettings');
        if (saved) {
            bulkRollSettings = { ...bulkRollSettings, ...JSON.parse(saved) };
        }
    }

    save() {
        localStorage.setItem('bulkRollSettings', JSON.stringify(bulkRollSettings));
    }

    start(count) {
        if (this.isRunning) {
            console.log('Bulk roll already running');
            return;
        }

        this.isRunning = true;
        this.currentRolls = 0;
        this.targetRolls = count || bulkRollSettings.rollCount;
        this.sessionStats = this.resetStats();
        
        console.log(`🎲 Starting bulk roll: ${this.targetRolls} rolls`);
        
        if (typeof showNotification === 'function') {
            showNotification(`🎲 Bulk roll started: ${this.targetRolls} rolls`);
        }
        
        this.performRolls();
    }

    stop() {
        this.isRunning = false;
        this.showResults();
    }

    pause() {
        this.isRunning = false;
        this.sessionStats.pauses++;
        
        if (typeof showNotification === 'function') {
            showNotification(`⏸️ Bulk roll paused at ${this.currentRolls}/${this.targetRolls}`);
        }
    }

    resume() {
        if (this.currentRolls >= this.targetRolls) {
            console.log('Bulk roll already completed');
            return;
        }
        
        this.isRunning = true;
        this.performRolls();
    }

    async performRolls() {
        while (this.isRunning && this.currentRolls < this.targetRolls) {
            if (bulkRollSettings.stopOnInventoryFull && this.isInventoryFull()) {
                this.pause();
                if (typeof showNotification === 'function') {
                    showNotification('⚠️ Bulk roll paused: Inventory full!');
                }
                break;
            }

            const result = await this.performSingleRoll();
            
            if (result) {
                this.currentRolls++;
                this.sessionStats.totalRolls++;
                this.updateStats(result);
                
                if (this.shouldPause(result)) {
                    this.pause();
                    if (typeof showNotification === 'function') {
                        showNotification(`🎯 Paused on ${result.name} (${result.rarity.toLocaleString()})`);
                    }
                    break;
                }
            }
            
            await this.delay(this.getRollDelay());
        }
        
        if (this.currentRolls >= this.targetRolls) {
            this.isRunning = false;
            this.showResults();
        }
    }

    async performSingleRoll() {
        if (typeof doRoll === 'function') {
            return await doRoll();
        }
        return null;
    }

    shouldPause(result) {
        if (result.rarity >= bulkRollSettings.pauseOnRarity) return true;
        
        const tierRarities = {
            'legendary': 1000000,
            'mythic': 10000000,
            'exotic': 50000000,
            'transcendent': 100000000
        };
        
        if (bulkRollSettings.pauseOnTier && tierRarities[bulkRollSettings.pauseOnTier]) {
            if (result.rarity >= tierRarities[bulkRollSettings.pauseOnTier]) return true;
        }
        
        return false;
    }

    updateStats(result) {
        const tier = this.getRarityTier(result.rarity);
        this.sessionStats.rarityBreakdown[tier] = (this.sessionStats.rarityBreakdown[tier] || 0) + 1;
        
        if (result.rarity > this.sessionStats.bestRoll.rarity) {
            this.sessionStats.bestRoll = { name: result.name, rarity: result.rarity };
        }
    }

    getRarityTier(rarity) {
        if (rarity >= 100000000) return 'Transcendent';
        if (rarity >= 50000000) return 'Exotic';
        if (rarity >= 10000000) return 'Mythic';
        if (rarity >= 1000000) return 'Legendary';
        if (rarity >= 100000) return 'Epic';
        if (rarity >= 10000) return 'Rare';
        if (rarity >= 1000) return 'Uncommon';
        return 'Common';
    }

    getRollDelay() {
        const preset = bulkRollSettings.usePresets ? bulkRollPresets[bulkRollSettings.currentPreset] : null;
        const speed = preset?.rollSpeed || 'normal';
        
        const delays = {
            'fastest': 50,
            'fast': 100,
            'normal': 200,
            'slow': 500
        };
        
        return delays[speed] || delays.normal;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    isInventoryFull() {
        if (!gameState?.inventory?.auras) return false;
        return Object.keys(gameState.inventory.auras).length >= 500;
    }

    showResults() {
        const duration = Date.now() - this.sessionStats.startTime;
        const rollsPerMinute = (this.sessionStats.totalRolls / (duration / 60000)).toFixed(1);
        
        let breakdown = '';
        for (const [tier, count] of Object.entries(this.sessionStats.rarityBreakdown)) {
            breakdown += `${tier}: ${count}\n`;
        }
        
        const message = `
🎲 Bulk Roll Complete!

Rolls: ${this.sessionStats.totalRolls}/${this.targetRolls}
Duration: ${(duration / 1000).toFixed(1)}s
Speed: ${rollsPerMinute} rolls/min
Pauses: ${this.sessionStats.pauses}

Best Roll: ${this.sessionStats.bestRoll.name} (${this.sessionStats.bestRoll.rarity.toLocaleString()})

Breakdown:
${breakdown}
        `.trim();
        
        alert(message);
        console.log('📊 Bulk roll results:', this.sessionStats);
    }

    openSettings() {
        let modal = document.getElementById('bulkRollModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'bulkRollModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h2>🎲 Bulk Roll System</h2>
                        <button class="close-btn" onclick="bulkRollSystem.closeSettings()">✖</button>
                    </div>
                    <div class="modal-body" style="padding: 20px;">
                        <div style="display: grid; gap: 20px;">
                            <div style="background: rgba(59, 130, 246, 0.1); border: 2px solid #3b82f6; padding: 15px; border-radius: 8px;">
                                <h3 style="color: #93c5fd; margin-top: 0;">⚡ Quick Start</h3>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                                    <button onclick="bulkRollSystem.start(100)" 
                                            style="padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                                        Roll 100
                                    </button>
                                    <button onclick="bulkRollSystem.start(500)" 
                                            style="padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                                        Roll 500
                                    </button>
                                    <button onclick="bulkRollSystem.start(1000)" 
                                            style="padding: 12px; background: #8b5cf6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                                        Roll 1000
                                    </button>
                                    <button onclick="bulkRollSystem.stop()" 
                                            style="padding: 12px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                                        Stop
                                    </button>
                                </div>
                            </div>

                            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
                                <h3>⚙️ Settings</h3>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                                    <span>Default roll count:</span>
                                    <input type="number" id="rollCountInput" min="10" max="10000" step="10" value="${bulkRollSettings.rollCount}" 
                                           style="width: 100px; padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">
                                </label>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                                    <span>Pause on rarity ≥:</span>
                                    <input type="number" id="pauseRarityInput" min="0" step="100000" value="${bulkRollSettings.pauseOnRarity}" 
                                           style="width: 150px; padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">
                                </label>
                                <label style="display: flex; align-items: center; gap: 10px; margin: 10px 0; cursor: pointer;">
                                    <input type="checkbox" id="stopInventoryFullCheck" ${bulkRollSettings.stopOnInventoryFull ? 'checked' : ''}>
                                    <span>Stop when inventory full</span>
                                </label>
                            </div>

                            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
                                <h3>🎯 Presets</h3>
                                ${Object.entries(bulkRollPresets).map(([key, preset]) => `
                                    <button onclick="bulkRollSystem.applyPreset('${key}')" 
                                            style="padding: 10px; margin: 5px; background: ${bulkRollSettings.currentPreset === key ? '#3b82f6' : '#374151'}; color: white; border: none; border-radius: 6px; cursor: pointer;">
                                        ${preset.name}
                                    </button>
                                `).join('')}
                            </div>

                            <button onclick="bulkRollSystem.saveSettings()" 
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
        const modal = document.getElementById('bulkRollModal');
        if (modal) modal.classList.remove('show');
    }

    saveSettings() {
        bulkRollSettings.rollCount = parseInt(document.getElementById('rollCountInput').value);
        bulkRollSettings.pauseOnRarity = parseInt(document.getElementById('pauseRarityInput').value);
        bulkRollSettings.stopOnInventoryFull = document.getElementById('stopInventoryFullCheck').checked;
        
        this.save();
        this.closeSettings();
        
        if (typeof showNotification === 'function') {
            showNotification('✅ Bulk roll settings saved!');
        }
    }

    applyPreset(presetKey) {
        const preset = bulkRollPresets[presetKey];
        if (!preset) return;
        
        bulkRollSettings.currentPreset = presetKey;
        bulkRollSettings.pauseOnRarity = preset.pauseOnRarity;
        bulkRollSettings.usePresets = true;
        
        this.save();
        
        if (typeof showNotification === 'function') {
            showNotification(`✅ Applied preset: ${preset.name}`);
        }
        
        this.closeSettings();
        setTimeout(() => this.openSettings(), 100);
    }
}

const bulkRollSystem = new BulkRollSystem();

window.bulkRollSystem = bulkRollSystem;
window.openBulkRoll = () => bulkRollSystem.openSettings();

console.log('🎲 Bulk Roll System loaded');
