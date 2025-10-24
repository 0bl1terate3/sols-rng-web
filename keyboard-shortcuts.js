// Keyboard Shortcuts System

let keyboardShortcuts = {
    enabled: true,
    shortcuts: {
        'r': { action: 'roll', name: 'Roll', enabled: true },
        's': { action: 'stop', name: 'Stop Rolling', enabled: true },
        'c': { action: 'openCrafting', name: 'Open Crafting', enabled: true },
        'i': { action: 'openInventory', name: 'Open Inventory', enabled: true },
        'a': { action: 'openAchievements', name: 'Open Achievements', enabled: true },
        'm': { action: 'openMarket', name: 'Open Market', enabled: true },
        'e': { action: 'openEquipment', name: 'Open Equipment', enabled: true },
        'q': { action: 'openQuests', name: 'Open Quests', enabled: true },
        '1': { action: 'quickCraft1', name: 'Quick Craft Slot 1', enabled: true },
        '2': { action: 'quickCraft2', name: 'Quick Craft Slot 2', enabled: true },
        '3': { action: 'quickCraft3', name: 'Quick Craft Slot 3', enabled: true },
        '4': { action: 'quickCraft4', name: 'Quick Craft Slot 4', enabled: true },
        '5': { action: 'quickCraft5', name: 'Quick Craft Slot 5', enabled: true }
    }
};

class KeyboardShortcutsSystem {
    constructor() {
        this.load();
        this.setupListeners();
    }

    load() {
        const saved = localStorage.getItem('keyboardShortcuts');
        if (saved) {
            const parsed = JSON.parse(saved);
            keyboardShortcuts = { ...keyboardShortcuts, ...parsed };
        }
    }

    save() {
        localStorage.setItem('keyboardShortcuts', JSON.stringify(keyboardShortcuts));
    }

    setupListeners() {
        document.addEventListener('keydown', (e) => {
            if (!keyboardShortcuts.enabled) return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.ctrlKey || e.altKey || e.metaKey) return;

            const key = e.key.toLowerCase();
            const shortcut = keyboardShortcuts.shortcuts[key];

            if (shortcut && shortcut.enabled) {
                e.preventDefault();
                this.executeAction(shortcut.action);
            }
        });
    }

    executeAction(action) {
        const actions = {
            roll: () => {
                if (typeof startAutoRoll === 'function') startAutoRoll();
                else if (typeof doRoll === 'function') doRoll();
            },
            stop: () => {
                if (typeof stopAutoRoll === 'function') stopAutoRoll();
            },
            openCrafting: () => {
                if (typeof switchTab === 'function') switchTab('crafting');
            },
            openInventory: () => {
                if (typeof switchTab === 'function') switchTab('inventory');
            },
            openAchievements: () => {
                if (typeof switchTab === 'function') switchTab('progress');
            },
            openMarket: () => {
                if (typeof switchTab === 'function') switchTab('market');
            },
            openEquipment: () => {
                if (typeof switchTab === 'function') switchTab('equipment');
            },
            openQuests: () => {
                if (typeof switchTab === 'function') switchTab('progress');
            },
            quickCraft1: () => this.quickCraft(0),
            quickCraft2: () => this.quickCraft(1),
            quickCraft3: () => this.quickCraft(2),
            quickCraft4: () => this.quickCraft(3),
            quickCraft5: () => this.quickCraft(4)
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    quickCraft(index) {
        const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
        if (favorites[index]) {
            const fav = favorites[index];
            if (typeof quickCraft === 'function') {
                quickCraft(fav.name, fav.type);
            }
        }
    }

    openSettings() {
        let modal = document.getElementById('keyboardShortcutsModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'keyboardShortcutsModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h2>⌨️ Keyboard Shortcuts</h2>
                        <button class="close-btn" onclick="keyboardShortcutsSystem.closeSettings()">✖</button>
                    </div>
                    <div class="modal-body" style="padding: 20px;">
                        <div style="display: grid; gap: 20px;">
                            <div style="background: rgba(59, 130, 246, 0.1); border: 2px solid #3b82f6; padding: 15px; border-radius: 8px;">
                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" id="shortcutsEnabledCheck" ${keyboardShortcuts.enabled ? 'checked' : ''}>
                                    <span style="font-weight: bold; color: #93c5fd;">Enable Keyboard Shortcuts</span>
                                </label>
                            </div>

                            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
                                <h3>⚡ Available Shortcuts</h3>
                                <div style="display: grid; gap: 10px; margin-top: 15px;">
                                    ${Object.entries(keyboardShortcuts.shortcuts).map(([key, shortcut]) => `
                                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.02); border-radius: 6px;">
                                            <div style="display: flex; align-items: center; gap: 15px;">
                                                <kbd style="background: #374151; padding: 5px 12px; border-radius: 4px; font-weight: bold; min-width: 30px; text-align: center;">
                                                    ${key.toUpperCase()}
                                                </kbd>
                                                <span>${shortcut.name}</span>
                                            </div>
                                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                                <input type="checkbox" class="shortcut-toggle" data-key="${key}" ${shortcut.enabled ? 'checked' : ''}>
                                                <span style="font-size: 0.9em; color: #888;">Enabled</span>
                                            </label>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div style="background: rgba(139, 92, 246, 0.1); border: 2px solid #8b5cf6; padding: 15px; border-radius: 8px;">
                                <h4 style="margin-top: 0; color: #a78bfa;">💡 Tips</h4>
                                <ul style="color: #c4b5fd; margin: 0; padding-left: 20px;">
                                    <li>Shortcuts only work when not typing in input fields</li>
                                    <li>Use 1-5 to quickly craft favorite recipes</li>
                                    <li>Press ESC to close most modals</li>
                                </ul>
                            </div>

                            <button onclick="keyboardShortcutsSystem.saveSettings()" 
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
        const modal = document.getElementById('keyboardShortcutsModal');
        if (modal) modal.classList.remove('show');
    }

    saveSettings() {
        keyboardShortcuts.enabled = document.getElementById('shortcutsEnabledCheck').checked;
        
        document.querySelectorAll('.shortcut-toggle').forEach(checkbox => {
            const key = checkbox.getAttribute('data-key');
            if (keyboardShortcuts.shortcuts[key]) {
                keyboardShortcuts.shortcuts[key].enabled = checkbox.checked;
            }
        });
        
        this.save();
        this.closeSettings();
        
        if (typeof showNotification === 'function') {
            showNotification('✅ Keyboard shortcuts saved!');
        }
    }
}

const keyboardShortcutsSystem = new KeyboardShortcutsSystem();

window.keyboardShortcutsSystem = keyboardShortcutsSystem;
window.openKeyboardShortcuts = () => keyboardShortcutsSystem.openSettings();

console.log('⌨️ Keyboard Shortcuts loaded');
