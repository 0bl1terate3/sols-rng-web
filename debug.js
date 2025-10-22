// Debug Menu System

const debugState = {
    menuOpen: false
};

function resetAllProgress() {
    const confirmed = confirm('⚠️ WARNING ⚠️\n\nThis will permanently delete ALL your progress including:\n\n• All auras\n• All rolls\n• All achievements\n• All inventory items\n• All statistics\n• All settings\n\nThis action CANNOT be undone!\n\nAre you absolutely sure you want to reset everything?');
    
    if (!confirmed) {
        console.log('Reset cancelled by user');
        return;
    }
    
    const doubleConfirm = confirm('⚠️ FINAL WARNING ⚠️\n\nYou are about to delete EVERYTHING including:\n\n• All game progress\n• All roll history\n• All settings\n• All achievements\n• ALL localStorage data\n\nClick OK to permanently delete EVERYTHING.\nClick Cancel to keep your data.');
    
    if (!doubleConfirm) {
        console.log('Reset cancelled by user on second confirmation');
        return;
    }
    
    // Explicitly clear QoL data first (rollHistory and bestRollToday)
    localStorage.removeItem('rollHistory');
    localStorage.removeItem('bestRollToday');
    localStorage.removeItem('rollHistoryFilters');
    localStorage.removeItem('qolSettings');
    console.log('✅ QoL data (roll history, best today) explicitly cleared');
    
    // Clear ALL localStorage (no exceptions)
    localStorage.clear();
    console.log('✅ ALL localStorage has been completely cleared');
    
    // Also clear sessionStorage to be thorough
    sessionStorage.clear();
    console.log('✅ sessionStorage also cleared');
    
    // Show notification
    alert('✅ All data has been completely reset!\n\nEVERYTHING has been deleted from localStorage.\n\nThe page will now reload.');
    
    // Hard reload the page to reinitialize with default state (clears cache too)
    window.location.href = window.location.href;
}

// Initialize debug menu
function initDebugMenu() {
    console.log('Initializing debug menu...');
    createDebugMenuHTML();
    setupDebugKeyListener();
    populateDebugCutsceneSelector();
    setupDebugCutsceneSelector();
    console.log('Debug menu initialization complete');
}

// Create debug menu HTML
function createDebugMenuHTML() {
    const debugMenu = document.createElement('div');
    debugMenu.id = 'debugMenu';
    debugMenu.className = 'debug-menu';
    debugMenu.innerHTML = `
        <div class="debug-menu-content">
            <h2>🔧 Debug Menu</h2>
            <p class="debug-hint">Press / to close</p>
            
            <div class="debug-section">
                <h3>Biomes</h3>
                <div class="debug-buttons">
                    ${BIOMES.map(biome => `
                        <button onclick="setBiome('${biome.name}')">${biome.name}</button>
                    `).join('')}
                </div>
            </div>
            
            <div class="debug-section">
                <h3>Time</h3>
                <div class="debug-buttons">
                    <button onclick="setDebugTime(true)">☀️ Day</button>
                    <button onclick="setDebugTime(false)">🌙 Night</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h3>Game State</h3>
                <div class="debug-buttons">
                    <button onclick="saveGameState()">Save Game</button>
                    <button onclick="loadGameState()">Load Game</button>
                    <button onclick="debugClearBuffs()">🧹 Clear All Buffs</button>
                    <button onclick="resetAllProgress()" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; font-weight: bold;">⚠️ RESET ALL PROGRESS</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h3>Potions</h3>
                <div class="debug-buttons">
                    <button onclick="giveAllPotions()">Give All Potions (x100)</button>
                    <button onclick="giveStarterPotions()">Give Starter Potions (x1000)</button>
                </div>
                <div class="debug-potion-list">
                    ${POTION_RECIPES.filter(r => !r.isBase).map(recipe => `
                        <button onclick="givePotion('${recipe.name}', 10)" class="debug-potion-btn">
                            ${recipe.name} (x10)
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <div class="debug-section">
                <h3>Runes</h3>
                <div class="debug-buttons">
                    <button onclick="giveAllRunes()">Give All Runes (x10)</button>
                </div>
                <div class="debug-potion-list">
                    ${typeof RUNES_DATA !== 'undefined' ? RUNES_DATA.map(rune => `
                        <button onclick="giveRune('${rune.name}', 5)" class="debug-potion-btn">
                            ${rune.icon} ${rune.name} (x5)
                        </button>
                    `).join('') : ''}
                </div>
            </div>
            
            <div class="debug-section">
                <h3>Auras</h3>
                <div style="margin-bottom: 15px; padding: 10px; background: rgba(0,0,0,0.1); border-radius: 4px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Give Specific Aura:</label>
                    <select id="specificAuraSelect" style="width: 100%; padding: 8px; margin-bottom: 8px; border-radius: 4px; border: 1px solid #ccc; box-sizing: border-box;">
                        <option value="">Select an aura...</option>
                    </select>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <input type="number" id="auraQuantityInput" placeholder="Quantity" value="1" min="1" 
                               style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                        <button onclick="giveSpecificAura()" style="padding: 8px 15px; cursor: pointer; background: #4CAF50; color: white; border: none; border-radius: 4px; white-space: nowrap;">Give Aura</button>
                    </div>
                    <div id="specificAuraStatus" style="padding: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; font-size: 12px; text-align: center;">
                        Select aura and quantity above
                    </div>
                </div>
                <div style="margin-bottom: 15px; padding: 10px; background: rgba(0,0,0,0.1); border-radius: 4px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Give ALL Auras:</label>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <input type="number" id="allAurasQuantityInput" placeholder="Quantity" value="1" min="1" 
                               style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                        <button onclick="giveAllAuras()" style="padding: 8px 15px; cursor: pointer; background: #FF9800; color: white; border: none; border-radius: 4px; white-space: nowrap; font-weight: bold;">Give ALL Auras</button>
                    </div>
                    <div id="allAurasStatus" style="padding: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; font-size: 12px; text-align: center;">
                        Give every aura in the game
                    </div>
                </div>
                <div class="debug-buttons">
                    <button onclick="giveAllNullAuras()">Give All NULL Auras</button>
                    <button onclick="giveAllLimboAuras()">Give All Limbo Auras</button>
                </div>
                <div class="debug-buttons" style="margin-top: 10px;">
                    <button onclick="giveAurasByTier('rare')">Give 10 Rare Auras</button>
                    <button onclick="giveAurasByTier('epic')">Give 10 Epic Auras</button>
                    <button onclick="giveAurasByTier('legendary')">Give 10 Legendary Auras</button>
                    <button onclick="giveAurasByTier('mythic')">Give 10 Mythic Auras</button>
                    <button onclick="giveAurasByTier('exotic')">Give 10 Exotic Auras</button>
                    <button onclick="giveAurasByTier('divine')">Give 10 Divine Auras</button>
                    <button onclick="giveAurasByTier('celestial')">Give 5 Celestial Auras</button>
                    <button onclick="giveAurasByTier('transcendent')">Give 3 Transcendent Auras</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h3>Quests</h3>
                <div class="debug-buttons">
                    <button onclick="completeAllQuests()">Complete All Quests</button>
                    <button onclick="resetQuests()">Reset Quests</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h3>Rolls & Stats</h3>
                <div class="debug-buttons">
                    <button onclick="addRolls(1000)">+1,000 Rolls</button>
                    <button onclick="addRolls(10000)">+10,000 Rolls</button>
                    <button onclick="addRolls(100000)">+100,000 Rolls</button>
                </div>
                <div class="debug-buttons" style="margin-top: 10px;">
                    <button onclick="addBreakthroughs(100)">+100 Breakthroughs</button>
                    <button onclick="addBreakthroughs(1000)">+1,000 Breakthroughs</button>
                    <button onclick="addPlaytime(60)">+1 Hour Playtime</button>
                    <button onclick="addPlaytime(600)">+10 Hours Playtime</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h3>Next Roll</h3>
                <div style="margin-bottom: 10px;">
                    <label style="display: flex; align-items: center; cursor: pointer; user-select: none; margin-bottom: 10px;">
                        <input type="checkbox" id="forceNextAuraToggle" style="margin-right: 8px; cursor: pointer;">
                        <span style="font-weight: bold;">Force Next Aura</span>
                    </label>
                    <select id="nextAuraSelect" style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #ccc; box-sizing: border-box;">
                        <option value="">Select an aura...</option>
                    </select>
                    <button onclick="setNextAura()" style="width: 100%; padding: 8px; cursor: pointer; background: #4CAF50; color: white; border: none; border-radius: 4px;">Set Next Roll Aura</button>
                </div>
                <div id="nextAuraStatus" style="padding: 8px; background: rgba(0,0,0,0.1); border-radius: 4px; font-size: 12px; text-align: center;">
                    No aura selected
                </div>
            </div>
            
            <div class="debug-section">
                <h3>Limbo</h3>
                <div class="debug-buttons">
                    <button onclick="unlockLimbo()">Unlock Limbo</button>
                    <button onclick="toggleLimbo()">Toggle Limbo</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h3>Gears</h3>
                <div class="debug-buttons">
                    <button onclick="giveSampleGears()">Give Sample Gears</button>
                    <button onclick="giveAllGears()">Give All Gears (x10)</button>
                    <button onclick="giveCraftingMaterials()">Give Crafting Materials</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h3>💰 Merchants</h3>
                <div class="debug-buttons">
                    <button onclick="debugSpawnMari()">✨ Spawn Mari</button>
                    <button onclick="debugSpawnJester()">🌀 Spawn Jester</button>
                    <button onclick="openBountyJackShop()">🎃 Bounty Hunter Jack</button>
                    <button onclick="debugDismissMerchant()">❌ Dismiss Merchant</button>
                </div>
                <div class="debug-buttons" style="margin-top: 10px;">
                    <button onclick="debugAddCurrency('money', 100000)">+100K Money</button>
                    <button onclick="debugAddCurrency('voidCoins', 50)">+50 Void Coins</button>
                    <button onclick="debugAddCurrency('darkPoints', 500)">+500 Dark Points</button>
                    <button onclick="debugAddCurrency('halloweenMedals', 100000)">+100K 🎃 Medals</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h3>Cutscene Test</h3>
                <div class="debug-buttons">
                    <button onclick="testUltraRareCutscene()">Test Ultra Rare Cutscene</button>
                    <button onclick="testAbyssalHunterCutscene()">Test Abyssal Hunter Cutscene</button>
                    <button onclick="testOvertureHistoryCutscene()">Test Overture History Cutscene</button>
                    <button onclick="testOvertureFutureCutscene()">Test Overture Future Cutscene</button>
                    <button onclick="testGargantuaCutscene()">Test Gargantua Cutscene</button>
                    <button onclick="testChromaticGenesisCutscene()">Test Chromatic Genesis Cutscene</button>
                    <button onclick="testChromaticExoticCutscene()">Test Chromatic Exotic Cutscene</button>
                    <button onclick="testArchangelsCutscene()">Test Archangels Cutscene</button>
                    <button onclick="testArchangelSeraphimCutscene()">Test Archangel: Seraphim</button>
                    <button onclick="testEquinoxCutscene()">Test Equinox Cutscene</button>
                    <button onclick="testLuminosityCutscene()">Test Luminosity Cutscene</button>
                    <button onclick="testDreammetricCutscene()">Test Dreammetric Cutscene</button>
                    <button onclick="testApostolosCutscene()">Test Apostolos Cutscene</button>
                    <button onclick="testOblivionCutscene()">Test Oblivion Cutscene</button>
                    <button onclick="testAbominationCutscene()">Test Abomination Cutscene</button>
                    <button onclick="testSymphonyCutscene()">Test Symphony Cutscene</button>
                    <button onclick="testKyawthuiteCutscene()">Test Kyawthuite: Remembrance</button>
                    <button onclick="testFloraEvergreenCutscene()">Test Flora: Evergreen</button>
                    <button onclick="testMatrixOverdriveCutscene()">Test Matrix: Overdrive</button>
                    <button onclick="testMastermindCutscene()">Test Mastermind Cutscene</button>
                    <button onclick="testAegisCutscene()">Test Aegis Cutscene</button>
                    <button onclick="testOppressionCutscene()">Test Oppression Cutscene</button>
                    <button onclick="testQuickRoll()">Test Quick Roll</button>
                    <button onclick="testQuickRollRareAura()">Test Quick Roll (Rare Aura)</button>
                    <button onclick="testAutoRollToggle()">Test Auto Roll Toggle</button>
                    <button onclick="testAutoRollRareAura()">Test Auto Roll (Rare Aura)</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h3>Breakthrough Auras Test</h3>
                <div class="debug-buttons">
                    <button onclick="giveBreakthroughAura('Common: Archetype')">Give Archetype</button>
                    <button onclick="giveBreakthroughAura('Uncommon: Aberration')">Give Aberration</button>
                    <button onclick="giveBreakthroughAura('Rage: Berserker')">Give Berserker</button>
                    <button onclick="giveBreakthroughAura('Magnetic: Lodestar')">Give Lodestar</button>
                    <button onclick="giveBreakthroughAura('Flora: Photosynthesis')">Give Photosynthesis</button>
                    <button onclick="giveBreakthroughAura('Solar: Corona')">Give Corona</button>
                    <button onclick="giveBreakthroughAura('Hazard: Fallout')">Give Fallout</button>
                    <button onclick="giveBreakthroughAura('Watt: Superconductor')">Give Superconductor</button>
                    <button onclick="giveBreakthroughAura('Nautilus: Primordial')">Give Primordial</button>
                    <button onclick="giveBreakthroughAura('Flow: Stasis')">Give Stasis</button>
                    <button onclick="giveBreakthroughAura('Stormal: Eyewall')">Give Eyewall</button>
                    <button onclick="giveBreakthroughAura('Aether: Quintessence')">Give Quintessence</button>
                    <button onclick="giveBreakthroughAura('Kyawthuite: Facet')">Give Facet</button>
                    <button onclick="giveBreakthroughAura('Unbound: Freedom')">Give Freedom</button>
                    <button onclick="giveBreakthroughAura('Hades: Styx')">Give Styx</button>
                    <button onclick="giveBreakthroughAura('Nihility: Void')">Give Void</button>
                    <button onclick="giveBreakthroughAura('Bloodlust: Sanguine')">Give Sanguine</button>
                    <button onclick="giveBreakthroughAura('Chromatic: Diva')">Give Diva</button>
                    <button onclick="giveBreakthroughAura('Aviator: Fleet')">Give Fleet</button>
                    <button onclick="giveBreakthroughAura('Sailor: Battleship')">Give Battleship</button>
                    <button onclick="giveBreakthroughAura('Lullaby: Sweet Dreams')">Give Sweet Dreams</button>
                    <button onclick="giveBreakthroughAura('Dynamic Force')">Give Dynamic Force</button>
                    <button onclick="giveBreakthroughAura('Forbidden: ERROR')">Give ERROR</button>
                    <button onclick="giveBreakthroughAura('Runic: Eternal')">Give Eternal</button>
                    <button onclick="giveBreakthroughAura('M A R T Y R')">Give MARTYR</button>
                    <button onclick="giveBreakthroughAura('Nyctophobia')">Give Nyctophobia</button>
                    <button onclick="giveBreakthroughAura('Cola: Witches Brew')">Give Witches Brew</button>
                    <button onclick="giveBreakthroughAura('『E Q U I N O X』: Equilibrium')">Give Equilibrium</button>
                    <button onclick="giveBreakthroughAura('Archangel: Overheaven')">Give Overheaven</button>
                    <button onclick="giveBreakthroughAura('Uranium: Bloomed')">Give Bloomed</button>
                    <button onclick="giveBreakthroughAura('Bounded: Eternity')">Give Eternity</button>
                    <button onclick="giveBreakthroughAura('Star Rider: Impact')">Give Impact</button>
                    <button onclick="giveBreakthroughAura('Symphony: Eternal')">Give Symphony Eternal</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h3>🎯 Achievements</h3>
                <div class="debug-buttons">
                    <button onclick="unlockAllAchievements()">Unlock All Achievements</button>
                    <button onclick="resetAllAchievements()">Reset All Achievements</button>
                    <button onclick="showAchievementProgress()">Show Achievement Progress</button>
                </div>
                <div class="debug-buttons" style="margin-top: 10px;">
                    <button onclick="triggerRandomAchievement()">Trigger Random Achievement</button>
                    <button onclick="claimAllAchievementRewards()">Claim All Rewards</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h3>🎲 Luck & Multipliers</h3>
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Set Luck Percentage:</label>
                    <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                        <input type="number" id="luckPercentageInput" placeholder="Any number..." step="0.1" 
                               style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                        <button onclick="setLuckPercentage()" style="padding: 8px 15px; cursor: pointer; background: #4CAF50; color: white; border: none; border-radius: 4px;">Set Luck %</button>
                    </div>
                    <div class="debug-buttons" style="margin-bottom: 10px;">
                        <button onclick="setLuckPercentageQuick(10)">10% Luck</button>
                        <button onclick="setLuckPercentageQuick(25)">25% Luck</button>
                        <button onclick="setLuckPercentageQuick(50)">50% Luck</button>
                        <button onclick="setLuckPercentageQuick(75)">75% Luck</button>
                        <button onclick="setLuckPercentageQuick(100)">100% Luck</button>
                    </div>
                    <div id="luckPercentageStatus" style="padding: 8px; background: rgba(0,0,0,0.1); border-radius: 4px; font-size: 12px; text-align: center; margin-bottom: 10px;">
                        Current Luck: 0%
                    </div>
                </div>
                <div class="debug-buttons">
                    <button onclick="setLuckMultiplier(2)">2x Luck (5 min)</button>
                    <button onclick="setLuckMultiplier(5)">5x Luck (5 min)</button>
                    <button onclick="setLuckMultiplier(10)">10x Luck (5 min)</button>
                    <button onclick="setLuckMultiplier(100)">100x Luck (5 min)</button>
                </div>
                <div class="debug-buttons" style="margin-top: 10px;">
                    <button onclick="clearLuckMultiplier()">Clear Luck Multiplier</button>
                    <button onclick="setAutoRollSpeed(50)">Auto-Roll: 50ms</button>
                    <button onclick="setAutoRollSpeed(100)">Auto-Roll: 100ms</button>
                    <button onclick="setAutoRollSpeed(500)">Auto-Roll: 500ms</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h3>📦 Inventory Management</h3>
                <div class="debug-buttons">
                    <button onclick="clearAllInventory()">⚠️ Clear All Inventory</button>
                    <button onclick="maxOutInventory()">Max Out All Items</button>
                </div>
                <div class="debug-buttons" style="margin-top: 10px;">
                    <button onclick="clearAuras()">Clear Auras Only</button>
                    <button onclick="clearPotions()">Clear Potions Only</button>
                    <button onclick="clearRunes()">Clear Runes Only</button>
                    <button onclick="clearGears()">Clear Gears Only</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h3>🌍 Biome Testing</h3>
                <div class="debug-buttons">
                    <button onclick="forceBiomeChange()">Force Random Biome Change</button>
                    <button onclick="toggleBiomeFreeze()">Toggle Biome Freeze</button>
                    <button onclick="setTimeSpeed(10)">10x Time Speed</button>
                    <button onclick="setTimeSpeed(1)">Normal Time Speed</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h3>⚙️ Cutscene Settings</h3>
                <div style="margin-bottom: 10px;">
                    <label style="display: flex; align-items: center; cursor: pointer; user-select: none; margin-bottom: 10px;">
                        <input type="checkbox" id="cutsceneToggle" checked onclick="toggleAllCutscenes()" style="margin-right: 8px; cursor: pointer;">
                        <span style="font-weight: bold;">Master Toggle (All Cutscenes)</span>
                    </label>
                    <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                        <button onclick="enableAllIndividualCutscenes()" style="flex: 1; padding: 5px; cursor: pointer;">✓ Enable All</button>
                        <button onclick="disableAllIndividualCutscenes()" style="flex: 1; padding: 5px; cursor: pointer;">✗ Disable All</button>
                    </div>
                    <input type="text" id="cutsceneSearchInput" placeholder="Search auras..." 
                           oninput="searchCutscenes()" 
                           style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #ccc; box-sizing: border-box;">
                </div>
                <div id="individualCutsceneToggles" style="display: flex; flex-direction: column; gap: 5px; max-height: 400px; overflow-y: auto; border: 1px solid #ccc; padding: 5px; border-radius: 4px; background: rgba(0,0,0,0.05);">
                    <!-- Individual toggles will be populated here -->
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(debugMenu);
    
    // Populate cutscene toggles after menu is added
    setTimeout(() => {
        if (typeof populateIndividualCutsceneToggles === 'function') {
            populateIndividualCutsceneToggles();
        }
    }, 100);
}

// Setup keyboard listener with password protection
function setupDebugKeyListener() {
    console.log('Setting up debug key listener...');
    console.log('debugAuth available:', typeof debugAuth !== 'undefined');
    console.log('toggleDebugMenu available:', typeof toggleDebugMenu === 'function');
    
    document.addEventListener('keydown', (e) => {
        // Only log forward slash presses to reduce console spam
        if (e.key === '/') {
            // Check if user is typing in an input field
            const activeElement = document.activeElement;
            const isTypingInInput = activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'TEXTAREA' || 
                activeElement.isContentEditable
            );
            
            // Don't open debug menu if user is typing in an input field
            if (isTypingInInput) {
                console.log('Forward slash pressed in input field, skipping debug menu');
                return;
            }
            
            console.log('Forward slash key pressed!');
            console.log('Event details:', { key: e.key, code: e.code, keyCode: e.keyCode });
            e.preventDefault();
            
            // Check if authentication system is available
            if (typeof debugAuth !== 'undefined') {
                console.log('Debug auth system is available');
                // Check if already authenticated
                if (debugAuth.isAuthenticated()) {
                    console.log('User is already authenticated, toggling debug menu');
                    // Reset session timer and show debug menu
                    debugAuth.resetSessionTimer();
                    toggleDebugMenu();
                } else {
                    // Show authentication modal
                    console.log('User not authenticated, showing auth modal');
                    debugAuth.showAuthModal();
                }
            } else {
                // Fallback to direct access if auth system not loaded
                console.warn('Debug authentication system not loaded, allowing direct access');
                toggleDebugMenu();
            }
        }
    }, { passive: false });
    
    console.log('Debug keyboard listener attached successfully');
}

// Toggle debug menu
function toggleDebugMenu() {
    debugState.menuOpen = !debugState.menuOpen;
    const menu = document.getElementById('debugMenu');
    if (menu) {
        menu.classList.toggle('show', debugState.menuOpen);
        
        // Populate the next aura dropdown when opening the menu
        if (debugState.menuOpen) {
            setTimeout(() => {
                populateNextAuraDropdown();
                populateSpecificAuraDropdown();
                updateLuckPercentageDisplay();
                
                // Restore previous state if exists
                if (gameState.debug && gameState.debug.forcedNextAura) {
                    const select = document.getElementById('nextAuraSelect');
                    const toggle = document.getElementById('forceNextAuraToggle');
                    const status = document.getElementById('nextAuraStatus');
                    
                    if (select) select.value = gameState.debug.forcedNextAura;
                    if (toggle) toggle.checked = true;
                    if (status) {
                        status.textContent = `Next roll will be: ${gameState.debug.forcedNextAura}`;
                        status.style.background = 'rgba(0,255,0,0.1)';
                        status.style.color = '#44ff44';
                    }
                }
            }, 100);
        }
    }
}

// Debug functions
function setDebugTime(isDay) {
    biomeState.isDay = isDay;
    const duration = isDay ? TIME_CYCLE.dayDuration : TIME_CYCLE.nightDuration;
    biomeState.timeEndTime = Date.now() + (duration * 1000);
    updateBiomeDisplay();
    applyTimeTint();
    console.log(`Time set to: ${isDay ? 'DAY' : 'NIGHT'}`);
    
    // Trigger Bounty Hunter Jack spawn/despawn
    if (typeof handleBountyJackSpawn === 'function') {
        handleBountyJackSpawn();
    }
}

function giveAllPotions() {
    for (let recipe of POTION_RECIPES) {
        if (!recipe.isBase) {
            if (!gameState.inventory.potions[recipe.name]) {
                gameState.inventory.potions[recipe.name] = { count: 0 };
            }
            gameState.inventory.potions[recipe.name].count += 100;
        }
    }
    updateInventoryDisplay();
    saveGameState();
    console.log('Gave all potions x100');
}

function giveStarterPotions() {
    if (!gameState.inventory.potions['Lucky Potion']) {
        gameState.inventory.potions['Lucky Potion'] = { count: 0 };
    }
    if (!gameState.inventory.potions['Speed Potion']) {
        gameState.inventory.potions['Speed Potion'] = { count: 0 };
    }
    gameState.inventory.potions['Lucky Potion'].count += 1000;
    gameState.inventory.potions['Speed Potion'].count += 1000;
    updateInventoryDisplay();
    saveGameState();
    console.log('Gave Lucky & Speed Potions x1000');
}

function givePotion(name, amount) {
    if (!gameState.inventory.potions[name]) {
        gameState.inventory.potions[name] = { count: 0 };
    }
    gameState.inventory.potions[name].count += amount;
    updateInventoryDisplay();
    saveGameState();
    console.log(`Gave ${name} x${amount}`);
}

function giveRune(name, amount) {
    // Ensure runes object exists
    if (!gameState.inventory.runes) {
        gameState.inventory.runes = {};
    }
    if (!gameState.inventory.runes[name]) {
        gameState.inventory.runes[name] = { count: 0 };
    }
    gameState.inventory.runes[name].count += amount;
    console.log(`Debug: Gave ${name} x${amount}. Total: ${gameState.inventory.runes[name].count}`);
    updateInventoryDisplay();
    saveGameState();
}

function giveAllRunes() {
    // Ensure runes object exists
    if (!gameState.inventory.runes) {
        gameState.inventory.runes = {};
    }
    if (typeof RUNES_DATA !== 'undefined') {
        for (let rune of RUNES_DATA) {
            if (!gameState.inventory.runes[rune.name]) {
                gameState.inventory.runes[rune.name] = { count: 0 };
            }
            gameState.inventory.runes[rune.name].count += 10;
        }
    }
    updateInventoryDisplay();
    saveGameState();
    console.log('Debug: Gave all runes x10');
}

function giveAllNullAuras() {
    const nullAuras = ["Undefined", "Shiftlock", "Nihility", "Undefined: Defined"];
    for (let auraName of nullAuras) {
        const aura = AURAS.find(a => a.name === auraName);
        if (aura) {
            if (!gameState.inventory.auras[auraName]) {
                gameState.inventory.auras[auraName] = { count: 0, rarity: aura.rarity, tier: aura.tier };
            }
            gameState.inventory.auras[auraName].count++;
        }
    }
    updateInventoryDisplay();
    if (typeof updateQuestDisplay === 'function') {
        updateQuestDisplay();
    }
    saveGameState();
    console.log('Gave all NULL auras');
}

function giveAllLimboAuras() {
    const limboAuras = ["Nothing", "Raven", "Anima", "Juxtaposition", "Unknown", "Elude", "Prologue", "Dreamscape"];
    for (let auraName of limboAuras) {
        const aura = AURAS.find(a => a.name === auraName);
        if (aura) {
            if (!gameState.inventory.auras[auraName]) {
                gameState.inventory.auras[auraName] = { count: 0, rarity: aura.rarity, tier: aura.tier };
            }
            gameState.inventory.auras[auraName].count++;
        }
    }
    updateInventoryDisplay();
    saveGameState();
    console.log('Gave all Limbo auras');
}

function completeAllQuests() {
    for (let quest of QUESTS) {
        if (!questState.completedQuests.includes(quest.id)) {
            questState.completedQuests.push(quest.id);
            if (quest.reward === "limbo_access") {
                questState.limboUnlocked = true;
            }
        }
    }
    updateLimboToggle();
    if (typeof updateQuestDisplay === 'function') {
        updateQuestDisplay();
    }
    saveQuestState();
    console.log('Completed all quests');
}

function resetQuests() {
    questState.completedQuests = [];
    questState.limboUnlocked = false;
    limboState.inLimbo = false;
    updateLimboToggle();
    applyLimboVisuals();
    if (typeof updateQuestDisplay === 'function') {
        updateQuestDisplay();
    }
    saveQuestState();
    console.log('Reset all quests');
}

function addRolls(amount) {
    gameState.totalRolls += amount;
    updateUI();
    if (typeof updateQuestDisplay === 'function') {
        updateQuestDisplay();
    }
    saveGameState();
    console.log(`Added ${amount} rolls`);
}

function unlockLimbo() {
    questState.limboUnlocked = true;
    if (!questState.completedQuests.includes('unlock_limbo')) {
        questState.completedQuests.push('unlock_limbo');
    }
    updateLimboToggle();
    if (typeof updateQuestDisplay === 'function') {
        updateQuestDisplay();
    }
    saveQuestState();
    console.log('Unlocked Limbo');
}

function testUltraRareCutscene() {
    // Find a test aura in the ultra rare range (1M to 99.998M)
    const testAura = AURAS.find(a => a.rarity >= 1000000 && a.rarity <= 99998000) || 
                     { name: "Galaxy", rarity: 5000000, tier: "transcendent" };
    
    if (typeof playUltraRareCutscene === 'function') {
        playUltraRareCutscene(testAura);
        console.log('Testing cutscene with:', testAura.name, 'rarity:', testAura.rarity);
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testAbyssalHunterCutscene() {
    const testAura = { name: "Abyssal Hunter", rarity: 400000000, tier: "transcendent" };
    if (typeof playAbyssalHunterCutscene === 'function') {
        playAbyssalHunterCutscene(testAura);
        console.log('Testing Abyssal Hunter cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testOvertureHistoryCutscene() {
    const testAura = { name: "Overture: History", rarity: 300000000, tier: "transcendent" };
    if (typeof playOvertureHistoryCutscene === 'function') {
        playOvertureHistoryCutscene(testAura);
        console.log('Testing Overture History cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testOvertureFutureCutscene() {
    const testAura = { name: "Overture: Future", rarity: 600000000, tier: "transcendent" };
    if (typeof playOvertureFutureCutscene === 'function') {
        playOvertureFutureCutscene(testAura);
        console.log('Testing Overture Future cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testGargantuaCutscene() {
    const testAura = { name: "Gargantua", rarity: 350000000, tier: "transcendent" };
    if (typeof playGargantuaCutscene === 'function') {
        playGargantuaCutscene(testAura);
        console.log('Testing Gargantua cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testChromaticGenesisCutscene() {
    const testAura = { name: "Chromatic Genesis", rarity: 375000000, tier: "transcendent" };
    if (typeof playChromaticGenesisCutscene === 'function') {
        playChromaticGenesisCutscene(testAura);
        console.log('Testing Chromatic Genesis cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testChromaticExoticCutscene() {
    const testAura = { name: "Chromatic: Exotic", rarity: 99999999, tier: "transcendent" };
    if (typeof playChromaticExoticCutscene === 'function') {
        playChromaticExoticCutscene(testAura);
        console.log('Testing Chromatic Exotic cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testArchangelsCutscene() {
    const testAura = { name: "Archangels", rarity: 250000000, tier: "transcendent" };
    if (typeof playArchangelsCutscene === 'function') {
        playArchangelsCutscene(testAura);
        console.log('Testing Archangels cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testAegisCutscene() {
    const testAura = { name: "Aegis", rarity: 825000000, tier: "transcendent" };
    playAegisCutscene(testAura);
}

function testAegisWatergunCutscene() {
    const testAura = { name: "Aegis - Watergun", rarity: 412500000, tier: "transcendent" };
    if (typeof playAegisWatergunCutscene === 'function') {
        playAegisWatergunCutscene(testAura);
        console.log('Testing Aegis - Watergun cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testAviatorFleetCutscene() {
    const testAura = { name: "Aviator: Fleet", rarity: 100000000, tier: "legendary" };
    if (typeof playAviatorFleetCutscene === 'function') {
        playAviatorFleetCutscene(testAura);
        console.log('Testing Aviator: Fleet cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testArchangelSeraphimCutscene() {
    const testAura = { name: "Archangel: Seraphim", rarity: 1500000000, tier: "transcendent" };
    playArchangelSeraphimCutscene(testAura);
}

function testEquinoxCutscene() {
    const testAura = { name: "『E Q U I N O X』", rarity: 2500000000, tier: "transcendent" };
    playEquinoxCutscene(testAura);
}

function testLuminosityCutscene() {
    const testAura = { name: "Luminosity", rarity: 1200000000, tier: "transcendent" };
    playLuminosityCutscene(testAura);
}

function testDreammetricCutscene() {
    const testAura = { name: "Dreammetric", rarity: 520000000, tier: "transcendent" };
    playDreammetricCutscene(testAura);
}

function testKyawthuiteCutscene() {
    const testAura = { name: "Kyawthuite: Remembrance", rarity: 450000000, tier: "transcendent" };
    playKyawthuiteCutscene(testAura);
}

function giveBreakthroughAura(auraName) {
    const aura = AURAS.find(a => a.name === auraName);
    if (aura) {
        if (!gameState.inventory.auras[auraName]) {
            gameState.inventory.auras[auraName] = { count: 0, rarity: aura.rarity, tier: aura.tier };
        }
        gameState.inventory.auras[auraName].count++;
        updateInventoryDisplay();
        saveGameState();
        console.log(`Debug: Gave ${auraName} (1 in ${aura.rarity.toLocaleString()})`);
    } else {
        console.error(`Debug: Aura "${auraName}" not found!`);
    }
}

function testOppressionCutscene() {
    const testAura = { name: "Oppression", rarity: 750000000, tier: "transcendent" };
    if (typeof playOppressionCutscene === 'function') {
        playOppressionCutscene(testAura);
        console.log('Testing Oppression cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testApostolosCutscene() {
    const testAura = { name: "Apostolos", rarity: 380000000, tier: "transcendent" };
    if (typeof playApostolosCutscene === 'function') {
        playApostolosCutscene(testAura);
        console.log('Testing Apostolos cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testOblivionCutscene() {
    const testAura = { name: "Oblivion", rarity: 2000, tier: "transcendent" };
    if (typeof playOblivionCutscene === 'function') {
        playOblivionCutscene(testAura);
        console.log('Testing Oblivion cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testAbominationCutscene() {
    const testAura = { name: "Abomination", rarity: 100000000000, tier: "cosmic" };
    if (typeof playAbominationCutscene === 'function') {
        playAbominationCutscene(testAura);
        console.log('Testing Abomination cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testSymphonyCutscene() {
    const testAura = { name: "Symphony", rarity: 100000000000, tier: "cosmic" };
    if (typeof playSymphonyCutscene === 'function') {
        playSymphonyCutscene(testAura);
        console.log('Testing Symphony cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testFloraEvergreenCutscene() {
    const testAura = { name: "Flora: Evergreen", rarity: 50000000, tier: "transcendent" };
    if (typeof playFloraEvergreenCutscene === 'function') {
        playFloraEvergreenCutscene(testAura);
        console.log('Testing Flora: Evergreen cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testMatrixOverdriveCutscene() {
    const testAura = { name: "Matrix: Overdrive", rarity: 50000000, tier: "transcendent" };
    if (typeof playMatrixOverdriveCutscene === 'function') {
        playMatrixOverdriveCutscene(testAura);
        console.log('Testing Matrix: Overdrive cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

function testMastermindCutscene() {
    const testAura = { name: "Mastermind", rarity: 100000000, tier: "legendary" };
    if (typeof playMastermindCutscene === 'function') {
        playMastermindCutscene(testAura);
        console.log('Testing Mastermind cutscene');
    } else {
        console.error('Cutscene system not loaded');
    }
}

// Populate debug cutscene selector with auras that have cutscenes
function populateDebugCutsceneSelector() {
    const selector = document.getElementById('debugCutsceneSelect');
    if (!selector) return;
    
    // Clear existing options except the first one
    while (selector.options.length > 1) {
        selector.remove(1);
    }
    
    // Add auras that have cutscenes
    const cutsceneAuras = [
        { name: "Ultra Rare (Random)", function: "testUltraRareCutscene" },
        { name: "Abyssal Hunter", function: "testAbyssalHunterCutscene" },
        { name: "Overture: History", function: "testOvertureHistoryCutscene" },
        { name: "Overture: Future", function: "testOvertureFutureCutscene" },
        { name: "Gargantua", function: "testGargantuaCutscene" },
        { name: "Chromatic Genesis", function: "testChromaticGenesisCutscene" },
        { name: "Chromatic Exotic", function: "testChromaticExoticCutscene" },
        { name: "Archangels", function: "testArchangelsCutscene" },
        { name: "Apostolos", function: "testApostolosCutscene" },
        { name: "Oblivion", function: "testOblivionCutscene" },
        { name: "Abomination", function: "testAbominationCutscene" },
        { name: "Symphony", function: "testSymphonyCutscene" },
        { name: "Flora: Evergreen", function: "testFloraEvergreenCutscene" },
        { name: "Matrix: Overdrive", function: "testMatrixOverdriveCutscene" },
        { name: "Mastermind", function: "testMastermindCutscene" },
        { name: "Aegis - Watergun", function: "testAegisWatergunCutscene" },
        { name: "Aviator: Fleet", function: "testAviatorFleetCutscene" }
    ];
    
    cutsceneAuras.forEach(aura => {
        const option = document.createElement('option');
        option.value = aura.function;
        option.textContent = aura.name;
        selector.appendChild(option);
    });
}

// Setup debug cutscene selector event listener
function setupDebugCutsceneSelector() {
    const selector = document.getElementById('debugCutsceneSelect');
    if (!selector) return;
    
    selector.addEventListener('change', (e) => {
        const selectedFunction = e.target.value;
        if (selectedFunction && typeof window[selectedFunction] === 'function') {
            window[selectedFunction]();
            // Reset selector to default
            e.target.value = '';
        }
    });
}

function testQuickRoll() {
    console.log('Testing quick roll functionality...');
    quickRollAura();
}

function testQuickRollWithRare() {
    console.log('Testing quick roll with guaranteed rare aura...');
    // Temporarily modify getRandomAura to return a rare aura for testing
    const originalGetRandomAura = window.getRandomAura;
    window.getRandomAura = function() {
        // Return a rare aura that should trigger cutscene
        return { 
            name: "Abyssal Hunter", 
            tier: "legendary", 
            rarity: 10000000,
            effectiveRarity: 10000000,
            breakthrough: false
        };
    };
    
    quickRollAura();
    
    // Restore original function after a delay
    setTimeout(() => {
        window.getRandomAura = originalGetRandomAura;
        console.log('Restored original getRandomAura function');
    }, 1000);
}

function testAutoRoll() {
    console.log('Testing auto roll functionality...');
    if (typeof toggleAutoRoll === 'function') {
        toggleAutoRoll();
        console.log('Auto roll toggled');
    } else {
        console.error('toggleAutoRoll function not found');
    }
}

function testAutoRollWithRare() {
    console.log('Testing auto roll with guaranteed rare aura...');
    // Temporarily modify getRandomAura to return a rare aura for testing
    const originalGetRandomAura = window.getRandomAura;
    window.getRandomAura = function() {
        // Return a rare aura that should trigger cutscene
        return { 
            name: "Abyssal Hunter", 
            tier: "legendary", 
            rarity: 10000000,
            effectiveRarity: 10000000,
            breakthrough: false
        };
    };
    
    if (typeof toggleAutoRoll === 'function') {
        toggleAutoRoll();
        console.log('Auto roll started with rare aura');
        
        // Stop after 3 seconds and restore function
        setTimeout(() => {
            if (gameState.autoRoll.active) {
                toggleAutoRoll();
            }
            window.getRandomAura = originalGetRandomAura;
            console.log('Auto roll test completed');
        }, 3000);
    } else {
        console.error('toggleAutoRoll function not found');
    }
}

function giveSampleGears() {
    const sampleGears = [
        { name: "Iron Shield", tier: 1 },
        { name: "Steel Armor", tier: 2 },
        { name: "Mystic Robe", tier: 3 }
    ];
    
    for (let gear of sampleGears) {
        if (!gameState.inventory.gears[gear.name]) {
            gameState.inventory.gears[gear.name] = { count: 0, tier: gear.tier };
        }
        gameState.inventory.gears[gear.name].count += 5;
    }
    
    updateInventoryDisplay();
    saveGameState();
    console.log('Gave sample gears x5 each');
}

function giveAllGears() {
    // Check if gearData exists (it should be imported from gearData.js)
    if (typeof gearData === 'undefined') {
        console.error('gearData not found - make sure gearData.js is loaded');
        return;
    }
    
    // Iterate through all gears in gearData
    for (let gearName in gearData) {
        const gearInfo = gearData[gearName];
        if (!gameState.inventory.gears[gearName]) {
            gameState.inventory.gears[gearName] = { count: 0, tier: gearInfo.tier || 1 };
        }
        gameState.inventory.gears[gearName].count += 10;
    }
    
    updateInventoryDisplay();
    saveGameState();
    console.log('Gave all gears x10 each');
}

function giveCraftingMaterials() {
    // Safety check for gameState
    if (typeof gameState === 'undefined' || !gameState || !gameState.inventory) {
        return;
    }
    
    // Common crafting materials needed for gears
    const craftingMaterials = [
        { name: "Gear Basing", count: 50, type: "items" },
        { name: "Divinus", count: 25, type: "auras" },
        { name: "Rare", count: 30, type: "auras" },
        { name: "Ruby", count: 15, type: "items" },
        { name: "Topaz", count: 15, type: "items" },
        { name: "Emerald", count: 15, type: "items" },
        { name: "Sapphire", count: 15, type: "items" },
        { name: "Aquamarine", count: 15, type: "items" },
        { name: "Quartz", count: 15, type: "items" },
        { name: "Crystallized", count: 10, type: "auras" },
        { name: "Glacier", count: 10, type: "auras" },
        { name: "Permafrost", count: 10, type: "auras" },
        { name: "Solar", count: 10, type: "auras" },
        { name: "Lunar", count: 10, type: "auras" },
        { name: "Gilded", count: 10, type: "auras" },
        { name: "Precious", count: 10, type: "auras" },
        { name: "Magnetic", count: 10, type: "auras" },
        { name: "Sidereum", count: 10, type: "auras" }
    ];
    
    for (let material of craftingMaterials) {
        if (!gameState.inventory[material.type][material.name]) {
            if (material.type === "items") {
                gameState.inventory[material.type][material.name] = { count: 0, icon: "💎" };
            } else {
                gameState.inventory[material.type][material.name] = { count: 0, rarity: 1000, tier: 1 };
            }
        }
        gameState.inventory[material.type][material.name].count += material.count;
    }
    
    updateInventoryDisplay();
    saveGameState();
    console.log('Gave crafting materials for gear crafting');
}

// ============================================
// Merchant Debug Functions
// ============================================

window.debugSpawnMari = function() {
    if (!gameState.merchants) {
        console.error('Merchant system not initialized');
        showNotification('❌ Merchant system not initialized!');
        return;
    }
    
    // Dismiss current merchant if active
    if (gameState.merchants.isActive) {
        const beam = document.getElementById('merchantBeam');
        if (beam) beam.remove();
    }
    
    // Ensure stocks are initialized
    if (!gameState.merchants.mariStock) {
        gameState.merchants.mariStock = JSON.parse(JSON.stringify(MARI_SHOP));
    }
    if (!gameState.merchants.jesterStock) {
        gameState.merchants.jesterStock = JSON.parse(JSON.stringify(JESTER_SHOP));
    }
    
    // Force spawn Mari
    gameState.merchants.currentMerchant = 'mari';
    gameState.merchants.isActive = true;
    gameState.merchants.spawnTime = Date.now();
    
    showMerchantSpawn('mari');
    showNotification('✨ Debug: Mari spawned!');
    console.log('Debug: Mari spawned!');
};

window.debugSpawnJester = function() {
    if (!gameState.merchants) {
        console.error('Merchant system not initialized');
        showNotification('❌ Merchant system not initialized!');
        return;
    }
    
    // Dismiss current merchant if active
    if (gameState.merchants.isActive) {
        const beam = document.getElementById('merchantBeam');
        if (beam) beam.remove();
    }
    
    // Ensure stocks are initialized
    if (!gameState.merchants.mariStock) {
        gameState.merchants.mariStock = JSON.parse(JSON.stringify(MARI_SHOP));
    }
    if (!gameState.merchants.jesterStock) {
        gameState.merchants.jesterStock = JSON.parse(JSON.stringify(JESTER_SHOP));
    }
    
    // Force spawn Jester
    gameState.merchants.currentMerchant = 'jester';
    gameState.merchants.isActive = true;
    gameState.merchants.spawnTime = Date.now();
    
    showMerchantSpawn('jester');
    showNotification('🌀 Debug: Jester spawned!');
    console.log('Debug: Jester spawned!');
};

window.debugDismissMerchant = function() {
    if (!gameState.merchants || !gameState.merchants.isActive) {
        console.log('No merchant currently active');
        return;
    }
    
    if (typeof dismissMerchant === 'function') {
        dismissMerchant();
        console.log('Debug: Merchant dismissed');
    }
};

window.debugAddCurrency = function(currencyType, amount) {
    if (!gameState.currency) {
        gameState.currency = {
            money: 0,
            voidCoins: 0,
            darkPoints: 0,
            halloweenMedals: 0
        };
    }
    
    gameState.currency[currencyType] = (gameState.currency[currencyType] || 0) + amount;
    updateUI();
    updateCurrencyDisplay();
    saveGameState();
    
    const currencyNames = {
        money: 'Money',
        voidCoins: 'Void Coins',
        darkPoints: 'Dark Points',
        halloweenMedals: 'Halloween Medals'
    };
    
    const currencyIcons = {
        money: '💰',
        voidCoins: '🌀',
        darkPoints: '🌑',
        halloweenMedals: '🎃'
    };
    
    showNotification(`${currencyIcons[currencyType]} +${amount.toLocaleString()} ${currencyNames[currencyType]}`);
    console.log(`Debug: Added ${amount} ${currencyNames[currencyType]}`);
}

// ============================================
// Next Roll Debug Functions
// ============================================

window.populateNextAuraDropdown = function() {
    const select = document.getElementById('nextAuraSelect');
    if (!select || typeof AURAS === 'undefined') return;
    
    // Clear existing options except the first one
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Add all auras from AURAS array
    AURAS.forEach(aura => {
        const option = document.createElement('option');
        option.value = aura.name;
        option.textContent = `${aura.name} (${aura.tier})`;
        select.appendChild(option);
    });
    
    console.log('Next aura dropdown populated with', AURAS.length, 'auras');
};

window.setNextAura = function() {
    const select = document.getElementById('nextAuraSelect');
    const toggle = document.getElementById('forceNextAuraToggle');
    const status = document.getElementById('nextAuraStatus');
    
    if (!select || !toggle || !status) return;
    
    const selectedAura = select.value;
    
    if (!selectedAura) {
        status.textContent = 'Please select an aura first!';
        status.style.background = 'rgba(255,0,0,0.1)';
        status.style.color = '#ff4444';
        return;
    }
    
    // Store the forced aura in gameState
    if (!gameState.debug) {
        gameState.debug = {};
    }
    
    gameState.debug.forcedNextAura = selectedAura;
    toggle.checked = true;
    
    status.textContent = `Next roll will be: ${selectedAura}`;
    status.style.background = 'rgba(0,255,0,0.1)';
    status.style.color = '#44ff44';
    
    saveGameState();
    console.log('Next aura set to:', selectedAura);
};

window.clearForcedNextAura = function() {
    const toggle = document.getElementById('forceNextAuraToggle');
    const status = document.getElementById('nextAuraStatus');
    
    if (!toggle || !status) return;
    
    if (gameState.debug) {
        delete gameState.debug.forcedNextAura;
    }
    
    toggle.checked = false;
    status.textContent = 'No aura selected';
    status.style.background = 'rgba(0,0,0,0.1)';
    status.style.color = '#ffffff';
    
    saveGameState();
    console.log('Forced next aura cleared');
};

// Handle toggle change
document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'forceNextAuraToggle') {
        if (!e.target.checked) {
            clearForcedNextAura();
        }
    }
});

// ============================================
// Stats Manipulation Functions
// ============================================

function addBreakthroughs(amount) {
    if (!gameState.stats) {
        gameState.stats = { breakthroughsRolled: 0 };
    }
    gameState.stats.breakthroughsRolled = (gameState.stats.breakthroughsRolled || 0) + amount;
    updateUI();
    saveGameState();
    showNotification(`🔥 Added ${amount.toLocaleString()} breakthroughs`);
    console.log(`Debug: Added ${amount} breakthroughs. Total: ${gameState.stats.breakthroughsRolled}`);
}

function addPlaytime(minutes) {
    if (!gameState.stats) {
        gameState.stats = { playtime: 0 };
    }
    gameState.stats.playtime = (gameState.stats.playtime || 0) + minutes;
    updateUI();
    saveGameState();
    showNotification(`⏰ Added ${minutes} minutes playtime`);
    console.log(`Debug: Added ${minutes} minutes playtime. Total: ${gameState.stats.playtime} minutes`);
}

// ============================================
// Aura Tier Functions
// ============================================

function giveAurasByTier(tier) {
    if (typeof AURAS === 'undefined') {
        console.error('AURAS data not loaded');
        return;
    }
    
    const tierMap = {
        'rare': 'rare',
        'epic': 'epic',
        'legendary': 'legendary',
        'mythic': 'mythic',
        'exotic': 'exotic',
        'divine': 'divine',
        'celestial': 'celestial',
        'transcendent': 'transcendent'
    };
    
    const targetTier = tierMap[tier.toLowerCase()];
    if (!targetTier) {
        console.error('Invalid tier:', tier);
        return;
    }
    
    const aurasOfTier = AURAS.filter(a => a.tier && a.tier.toLowerCase() === targetTier);
    
    if (aurasOfTier.length === 0) {
        console.error('No auras found for tier:', tier);
        return;
    }
    
    // Determine how many to give based on tier rarity
    const countMap = {
        'rare': 10,
        'epic': 10,
        'legendary': 10,
        'mythic': 10,
        'exotic': 10,
        'divine': 10,
        'celestial': 5,
        'transcendent': 3
    };
    
    const maxCount = Math.min(countMap[targetTier] || 5, aurasOfTier.length);
    
    // Shuffle and pick random auras
    const shuffled = aurasOfTier.sort(() => 0.5 - Math.random());
    const selectedAuras = shuffled.slice(0, maxCount);
    
    let givenCount = 0;
    for (let aura of selectedAuras) {
        if (!gameState.inventory.auras[aura.name]) {
            gameState.inventory.auras[aura.name] = { count: 0, rarity: aura.rarity, tier: aura.tier };
        }
        gameState.inventory.auras[aura.name].count++;
        givenCount++;
    }
    
    updateInventoryDisplay();
    saveGameState();
    showNotification(`✨ Gave ${givenCount} ${tier.toUpperCase()} auras`);
    console.log(`Debug: Gave ${givenCount} ${tier} tier auras`);
}

// ============================================
// Achievement Functions
// ============================================

function unlockAllAchievements() {
    if (typeof ACHIEVEMENTS_DATA === 'undefined') {
        console.error('Achievements data not loaded');
        showNotification('❌ Achievements system not loaded');
        return;
    }
    
    if (!gameState.achievements) {
        gameState.achievements = { unlocked: [], claimed: [] };
    }
    
    let unlockedCount = 0;
    for (let achId in ACHIEVEMENTS_DATA) {
        if (!gameState.achievements.unlocked.includes(achId)) {
            gameState.achievements.unlocked.push(achId);
            unlockedCount++;
        }
    }
    
    if (typeof updateAchievementDisplay === 'function') {
        updateAchievementDisplay();
    }
    saveGameState();
    showNotification(`🎯 Unlocked ${unlockedCount} achievements!`);
    console.log(`Debug: Unlocked all achievements (${unlockedCount} total)`);
}

function resetAllAchievements() {
    if (!gameState.achievements) {
        gameState.achievements = { unlocked: [], claimed: [] };
    }
    
    const count = gameState.achievements.unlocked.length;
    gameState.achievements.unlocked = [];
    gameState.achievements.claimed = [];
    
    if (typeof updateAchievementDisplay === 'function') {
        updateAchievementDisplay();
    }
    saveGameState();
    showNotification(`🔄 Reset ${count} achievements`);
    console.log('Debug: Reset all achievements');
}

function showAchievementProgress() {
    if (typeof ACHIEVEMENTS_DATA === 'undefined') {
        console.error('Achievements data not loaded');
        return;
    }
    
    const total = Object.keys(ACHIEVEMENTS_DATA).length;
    const unlocked = gameState.achievements?.unlocked?.length || 0;
    const claimed = gameState.achievements?.claimed?.length || 0;
    const percentage = ((unlocked / total) * 100).toFixed(1);
    
    console.log('=== ACHIEVEMENT PROGRESS ===');
    console.log(`Unlocked: ${unlocked}/${total} (${percentage}%)`);
    console.log(`Claimed Rewards: ${claimed}/${unlocked}`);
    console.log('===========================');
    
    showNotification(`📊 ${unlocked}/${total} achievements (${percentage}%)`);
}

function triggerRandomAchievement() {
    if (typeof ACHIEVEMENTS_DATA === 'undefined') {
        console.error('Achievements data not loaded');
        return;
    }
    
    const allAchievements = Object.keys(ACHIEVEMENTS_DATA);
    const unlockedAchievements = gameState.achievements?.unlocked || [];
    const lockedAchievements = allAchievements.filter(id => !unlockedAchievements.includes(id));
    
    if (lockedAchievements.length === 0) {
        showNotification('✅ All achievements already unlocked!');
        return;
    }
    
    const randomAch = lockedAchievements[Math.floor(Math.random() * lockedAchievements.length)];
    const achData = ACHIEVEMENTS_DATA[randomAch];
    
    if (!gameState.achievements) {
        gameState.achievements = { unlocked: [], claimed: [] };
    }
    
    gameState.achievements.unlocked.push(randomAch);
    
    if (typeof updateAchievementDisplay === 'function') {
        updateAchievementDisplay();
    }
    saveGameState();
    showNotification(`🎯 Unlocked: ${achData.name}`);
    console.log(`Debug: Unlocked achievement: ${achData.name}`);
}

function claimAllAchievementRewards() {
    if (typeof ACHIEVEMENTS_DATA === 'undefined') {
        console.error('Achievements data not loaded');
        return;
    }
    
    if (!gameState.achievements) {
        gameState.achievements = { unlocked: [], claimed: [] };
    }
    
    let claimedCount = 0;
    for (let achId of gameState.achievements.unlocked) {
        if (!gameState.achievements.claimed.includes(achId)) {
            const achData = ACHIEVEMENTS_DATA[achId];
            if (achData && achData.reward) {
                // Apply rewards (simplified - actual implementation may vary)
                if (achData.reward.money && gameState.currency) {
                    gameState.currency.money = (gameState.currency.money || 0) + achData.reward.money;
                }
                gameState.achievements.claimed.push(achId);
                claimedCount++;
            }
        }
    }
    
    updateUI();
    if (typeof updateAchievementDisplay === 'function') {
        updateAchievementDisplay();
    }
    saveGameState();
    showNotification(`💰 Claimed ${claimedCount} achievement rewards!`);
    console.log(`Debug: Claimed ${claimedCount} achievement rewards`);
}

// ============================================
// Luck & Multiplier Functions
// ============================================

function setLuckMultiplier(multiplier) {
    if (!gameState.debug) {
        gameState.debug = {};
    }
    
    gameState.debug.luckMultiplier = multiplier;
    gameState.debug.luckMultiplierExpiry = Date.now() + (5 * 60 * 1000); // 5 minutes
    
    saveGameState();
    showNotification(`🍀 Luck multiplier set to ${multiplier}x for 5 minutes!`);
    console.log(`Debug: Luck multiplier set to ${multiplier}x`);
    
    // Auto-clear after 5 minutes
    setTimeout(() => {
        if (gameState.debug && gameState.debug.luckMultiplier === multiplier) {
            clearLuckMultiplier();
        }
    }, 5 * 60 * 1000);
}

function clearLuckMultiplier() {
    if (gameState.debug) {
        delete gameState.debug.luckMultiplier;
        delete gameState.debug.luckMultiplierExpiry;
    }
    saveGameState();
    showNotification('🔄 Luck multiplier cleared');
    console.log('Debug: Luck multiplier cleared');
}

function setAutoRollSpeed(speedMs) {
    if (!gameState.autoRoll) {
        gameState.autoRoll = { active: false, speed: 1000 };
    }
    
    gameState.autoRoll.speed = speedMs;
    saveGameState();
    showNotification(`⚡ Auto-roll speed set to ${speedMs}ms`);
    console.log(`Debug: Auto-roll speed set to ${speedMs}ms`);
}

// ============================================
// Inventory Management Functions
// ============================================

function clearAllInventory() {
    const confirmed = confirm('⚠️ WARNING: This will clear ALL inventory items (auras, potions, runes, gears, items).\n\nAre you sure?');
    if (!confirmed) return;
    
    gameState.inventory = {
        auras: {},
        potions: {},
        runes: {},
        gears: {},
        items: {}
    };
    
    updateInventoryDisplay();
    saveGameState();
    showNotification('🗑️ All inventory cleared');
    console.log('Debug: Cleared all inventory');
}

function maxOutInventory() {
    // Max out potions
    if (typeof POTION_RECIPES !== 'undefined') {
        for (let recipe of POTION_RECIPES) {
            if (!recipe.isBase) {
                if (!gameState.inventory.potions[recipe.name]) {
                    gameState.inventory.potions[recipe.name] = { count: 0 };
                }
                gameState.inventory.potions[recipe.name].count = 9999;
            }
        }
    }
    
    // Max out runes
    if (typeof RUNES_DATA !== 'undefined') {
        for (let rune of RUNES_DATA) {
            if (!gameState.inventory.runes[rune.name]) {
                gameState.inventory.runes[rune.name] = { count: 0 };
            }
            gameState.inventory.runes[rune.name].count = 999;
        }
    }
    
    // Max out gears
    if (typeof gearData !== 'undefined') {
        for (let gearName in gearData) {
            const gearInfo = gearData[gearName];
            if (!gameState.inventory.gears[gearName]) {
                gameState.inventory.gears[gearName] = { count: 0, tier: gearInfo.tier || 1 };
            }
            gameState.inventory.gears[gearName].count = 999;
        }
    }
    
    updateInventoryDisplay();
    saveGameState();
    showNotification('📦 All items maxed out!');
    console.log('Debug: Maxed out all inventory items');
}

function clearAuras() {
    const confirmed = confirm('Clear all auras from inventory?');
    if (!confirmed) return;
    
    gameState.inventory.auras = {};
    updateInventoryDisplay();
    saveGameState();
    showNotification('✨ Auras cleared');
    console.log('Debug: Cleared all auras');
}

function clearPotions() {
    const confirmed = confirm('Clear all potions from inventory?');
    if (!confirmed) return;
    
    gameState.inventory.potions = {};
    updateInventoryDisplay();
    saveGameState();
    showNotification('🧪 Potions cleared');
    console.log('Debug: Cleared all potions');
}

function clearRunes() {
    const confirmed = confirm('Clear all runes from inventory?');
    if (!confirmed) return;
    
    gameState.inventory.runes = {};
    updateInventoryDisplay();
    saveGameState();
    showNotification('🔮 Runes cleared');
    console.log('Debug: Cleared all runes');
}

function clearGears() {
    const confirmed = confirm('Clear all gears from inventory?');
    if (!confirmed) return;
    
    gameState.inventory.gears = {};
    updateInventoryDisplay();
    saveGameState();
    showNotification('⚙️ Gears cleared');
    console.log('Debug: Cleared all gears');
}

// ============================================
// Biome Testing Functions
// ============================================

function forceBiomeChange() {
    if (typeof BIOMES === 'undefined' || typeof setBiome !== 'function') {
        console.error('Biome system not loaded');
        return;
    }
    
    const randomBiome = BIOMES[Math.floor(Math.random() * BIOMES.length)];
    setBiome(randomBiome.name);
    showNotification(`🌍 Forced biome change to: ${randomBiome.name}`);
    console.log(`Debug: Forced biome change to ${randomBiome.name}`);
}

function toggleBiomeFreeze() {
    if (!gameState.debug) {
        gameState.debug = {};
    }
    
    gameState.debug.biomeFrozen = !gameState.debug.biomeFrozen;
    
    const status = gameState.debug.biomeFrozen ? 'FROZEN' : 'UNFROZEN';
    saveGameState();
    showNotification(`❄️ Biome ${status}`);
    console.log(`Debug: Biome ${status}`);
}

function setTimeSpeed(multiplier) {
    if (!gameState.debug) {
        gameState.debug = {};
    }
    
    gameState.debug.timeSpeed = multiplier;
    saveGameState();
    showNotification(`⏰ Time speed set to ${multiplier}x`);
    console.log(`Debug: Time speed set to ${multiplier}x`);
};

// ============================================
// Luck Percentage Functions
// ============================================

function setLuckPercentage() {
    const input = document.getElementById('luckPercentageInput');
    const status = document.getElementById('luckPercentageStatus');
    
    if (!input || !status) {
        console.error('Luck percentage input or status element not found');
        return;
    }
    
    let percentage = parseFloat(input.value);
    
    // Validate input
    if (isNaN(percentage)) {
        status.textContent = '⚠️ Please enter a valid number';
        status.style.background = 'rgba(255,0,0,0.1)';
        status.style.color = '#ff4444';
        return;
    }
    
    // Initialize debug object if needed
    if (!gameState.debug) {
        gameState.debug = {};
    }
    
    // Store the luck percentage (no limits!)
    gameState.debug.luckPercentage = percentage;
    
    // Update status display
    status.textContent = `Current Luck: ${percentage.toLocaleString()}%`;
    status.style.background = 'rgba(0,255,0,0.1)';
    status.style.color = '#44ff44';
    
    saveGameState();
    showNotification(`🍀 Luck set to ${percentage.toLocaleString()}%`);
    console.log(`Debug: Luck percentage set to ${percentage}%`);
}

function setLuckPercentageQuick(percentage) {
    const input = document.getElementById('luckPercentageInput');
    const status = document.getElementById('luckPercentageStatus');
    
    if (!gameState.debug) {
        gameState.debug = {};
    }
    
    gameState.debug.luckPercentage = percentage;
    
    if (input) {
        input.value = percentage;
    }
    
    if (status) {
        status.textContent = `Current Luck: ${percentage}%`;
        status.style.background = 'rgba(0,255,0,0.1)';
        status.style.color = '#44ff44';
    }
    
    saveGameState();
    showNotification(`🍀 Luck set to ${percentage}%`);
    console.log(`Debug: Luck percentage set to ${percentage}%`);
}

function updateLuckPercentageDisplay() {
    const status = document.getElementById('luckPercentageStatus');
    const input = document.getElementById('luckPercentageInput');
    
    if (!status) return;
    
    const currentLuck = (gameState.debug && gameState.debug.luckPercentage) || 0;
    
    status.textContent = `Current Luck: ${currentLuck.toFixed(1)}%`;
    
    if (currentLuck > 0) {
        status.style.background = 'rgba(0,255,0,0.1)';
        status.style.color = '#44ff44';
    } else {
        status.style.background = 'rgba(0,0,0,0.1)';
        status.style.color = '#ffffff';
    }
    
    if (input) {
        input.value = currentLuck;
    }
}

// Make functions globally accessible
window.addBreakthroughs = addBreakthroughs;
window.addPlaytime = addPlaytime;
window.giveAurasByTier = giveAurasByTier;
window.unlockAllAchievements = unlockAllAchievements;
window.resetAllAchievements = resetAllAchievements;
window.showAchievementProgress = showAchievementProgress;
window.triggerRandomAchievement = triggerRandomAchievement;
window.claimAllAchievementRewards = claimAllAchievementRewards;
window.setLuckMultiplier = setLuckMultiplier;
window.clearLuckMultiplier = clearLuckMultiplier;
window.setAutoRollSpeed = setAutoRollSpeed;
window.clearAllInventory = clearAllInventory;
window.maxOutInventory = maxOutInventory;
window.clearAuras = clearAuras;
window.clearPotions = clearPotions;
window.clearRunes = clearRunes;
window.clearGears = clearGears;
window.forceBiomeChange = forceBiomeChange;
window.toggleBiomeFreeze = toggleBiomeFreeze;
window.setTimeSpeed = setTimeSpeed;
window.setLuckPercentage = setLuckPercentage;
window.setLuckPercentageQuick = setLuckPercentageQuick;
window.updateLuckPercentageDisplay = updateLuckPercentageDisplay;

// Initialize on page load with error handling
window.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Attempting to initialize debug menu...');
        initDebugMenu();
        console.log('Debug menu initialized successfully');
    } catch (error) {
        console.error('Failed to initialize debug menu:', error);
        // Try to at least set up the keyboard listener
        try {
            setupDebugKeyListener();
            console.log('Keyboard listener set up as fallback');
        } catch (listenerError) {
            console.error('Failed to set up keyboard listener:', listenerError);
        }
    }
});

// Also ensure it works if DOM is already loaded (backup initialization)
if (document.readyState === 'loading') {
    // DOM not loaded yet, event listener will handle it
} else {
    // DOM already loaded, initialize immediately
    try {
        console.log('DOM already loaded, initializing debug menu now...');
        initDebugMenu();
    } catch (error) {
        console.error('Immediate debug menu initialization failed:', error);
    }
}

// ============================================
// Clear All Buffs/Effects
// ============================================
window.debugClearBuffs = function() {
    if (!gameState) {
        console.log('Game state not initialized');
        return;
    }
    
    // Clear active potion effects
    if (gameState.activeEffects) {
        const effectCount = gameState.activeEffects.length;
        gameState.activeEffects = [];
        console.log(`Cleared ${effectCount} active effects`);
    }
    
    // Clear special effects
    if (gameState.specialEffects) {
        gameState.specialEffects = {
            gemstoneActive: false,
            gemstoneBoost: { luck: 0, speed: 0 },
            gemstoneEndTime: null,
            twoxLuckBonus: false,
            twoxLuckNotificationShown: false,
            positiveAuraStreak: 0,
            positiveAuraStreakEndTime: null,
            skipStacks: 0,
            paradoxRewinds: 0,
            darkshaderActive: false,
            darkshaderLuckEndTime: null,
            chronosphereActive: false,
            chronosphereRollsLeft: 0,
            consecutiveCommons: 0
        };
        console.log('Cleared special effects');
    }
    
    // Recalculate stats and update UI
    if (typeof recalculateStats === 'function') {
        recalculateStats();
    }
    if (typeof updateUI === 'function') {
        updateUI();
    }
    if (typeof updateActiveEffects === 'function') {
        updateActiveEffects();
    }
    
    saveGameState();
    showNotification('🧹 All buffs and effects cleared!');
    console.log('Debug: All buffs/effects cleared successfully');
};

// ============================================
// Specific Aura Giver
// ============================================

function populateSpecificAuraDropdown() {
    const select = document.getElementById('specificAuraSelect');
    if (!select) {
        console.log('Specific aura select element not found');
        return;
    }
    
    if (typeof AURAS === 'undefined') {
        console.error('AURAS data not loaded');
        return;
    }
    
    // Clear existing options except the first one
    select.innerHTML = '<option value="">Select an aura...</option>';
    
    // Group auras by tier for better organization
    const tierOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'exotic', 'divine', 'celestial', 'transcendent', 'cosmic'];
    const aurasByTier = {};
    
    // Group auras
    AURAS.forEach(aura => {
        const tier = (aura.tier || 'common').toLowerCase();
        if (!aurasByTier[tier]) {
            aurasByTier[tier] = [];
        }
        aurasByTier[tier].push(aura);
    });
    
    // Add auras to dropdown grouped by tier
    tierOrder.forEach(tier => {
        if (aurasByTier[tier] && aurasByTier[tier].length > 0) {
            // Add tier header
            const optgroup = document.createElement('optgroup');
            optgroup.label = tier.charAt(0).toUpperCase() + tier.slice(1);
            
            // Sort auras alphabetically within tier
            aurasByTier[tier].sort((a, b) => a.name.localeCompare(b.name));
            
            // Add auras
            aurasByTier[tier].forEach(aura => {
                const option = document.createElement('option');
                option.value = aura.name;
                option.textContent = `${aura.name} (1/${aura.rarity.toLocaleString()})`;
                optgroup.appendChild(option);
            });
            
            select.appendChild(optgroup);
        }
    });
    
    console.log('Populated specific aura dropdown with', AURAS.length, 'auras');
}

function giveSpecificAura() {
    const select = document.getElementById('specificAuraSelect');
    const quantityInput = document.getElementById('auraQuantityInput');
    const status = document.getElementById('specificAuraStatus');
    
    if (!select || !quantityInput || !status) {
        console.error('Required elements not found');
        return;
    }
    
    const auraName = select.value;
    const quantity = parseInt(quantityInput.value) || 1;
    
    if (!auraName) {
        status.textContent = '⚠️ Please select an aura first';
        status.style.background = 'rgba(255,0,0,0.1)';
        status.style.color = '#ff4444';
        return;
    }
    
    if (quantity < 1) {
        status.textContent = '⚠️ Quantity must be at least 1';
        status.style.background = 'rgba(255,0,0,0.1)';
        status.style.color = '#ff4444';
        return;
    }
    
    if (typeof AURAS === 'undefined') {
        console.error('AURAS data not loaded');
        status.textContent = '⚠️ Aura data not loaded';
        status.style.background = 'rgba(255,0,0,0.1)';
        status.style.color = '#ff4444';
        return;
    }
    
    // Find the aura
    const aura = AURAS.find(a => a.name === auraName);
    
    if (!aura) {
        status.textContent = `⚠️ Aura "${auraName}" not found`;
        status.style.background = 'rgba(255,0,0,0.1)';
        status.style.color = '#ff4444';
        return;
    }
    
    // Add aura to inventory
    if (!gameState.inventory.auras[auraName]) {
        gameState.inventory.auras[auraName] = { count: 0, rarity: aura.rarity, tier: aura.tier };
    }
    gameState.inventory.auras[auraName].count += quantity;
    
    // Update displays
    updateInventoryDisplay();
    if (typeof updateQuestDisplay === 'function') {
        updateQuestDisplay();
    }
    saveGameState();
    
    // Show success message
    status.textContent = `✅ Gave ${quantity}x ${auraName}`;
    status.style.background = 'rgba(0,255,0,0.1)';
    status.style.color = '#44ff44';
    
    showNotification(`✨ Gave ${quantity}x ${auraName}`);
    console.log(`Debug: Gave ${quantity}x ${auraName}`);
}

function giveAllAuras() {
    const quantityInput = document.getElementById('allAurasQuantityInput');
    const status = document.getElementById('allAurasStatus');
    
    if (!quantityInput || !status) {
        console.error('Required elements not found');
        return;
    }
    
    const quantity = parseInt(quantityInput.value) || 1;
    
    if (quantity < 1) {
        status.textContent = '⚠️ Quantity must be at least 1';
        status.style.background = 'rgba(255,0,0,0.1)';
        status.style.color = '#ff4444';
        return;
    }
    
    if (typeof AURAS === 'undefined') {
        console.error('AURAS data not loaded');
        status.textContent = '⚠️ Aura data not loaded';
        status.style.background = 'rgba(255,0,0,0.1)';
        status.style.color = '#ff4444';
        return;
    }
    
    // Give every aura the specified quantity
    let aurasGiven = 0;
    AURAS.forEach(aura => {
        if (!gameState.inventory.auras[aura.name]) {
            gameState.inventory.auras[aura.name] = { count: 0, rarity: aura.rarity, tier: aura.tier };
        }
        gameState.inventory.auras[aura.name].count += quantity;
        aurasGiven++;
    });
    
    // Update displays
    updateInventoryDisplay();
    if (typeof updateQuestDisplay === 'function') {
        updateQuestDisplay();
    }
    saveGameState();
    
    // Show success message
    status.textContent = `✅ Gave ${quantity}x of ALL ${aurasGiven} auras!`;
    status.style.background = 'rgba(0,255,0,0.1)';
    status.style.color = '#44ff44';
    
    showNotification(`✨ Gave ${quantity}x of all ${aurasGiven} auras!`);
    console.log(`Debug: Gave ${quantity}x of all ${aurasGiven} auras`);
}

// Make functions globally accessible
window.populateSpecificAuraDropdown = populateSpecificAuraDropdown;
window.giveSpecificAura = giveSpecificAura;
window.giveAllAuras = giveAllAuras;
