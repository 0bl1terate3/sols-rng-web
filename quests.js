// Quest System

const QUESTS = [
    {
        id: "unlock_limbo",
        name: "Journey to The Limbo",
        description: "Roll 10,000 total auras and obtain ALL NULL biome auras to unlock The Limbo",
        requirements: {
            totalRolls: 10000,
            aurasAll: ["Undefined", "Shiftlock", "Nihility", "Undefined: Defined"] // Need all
        },
        reward: "limbo_access",
        completed: false
    }
];

// Quest state
const questState = {
    completedQuests: [],
    limboUnlocked: false
};

// Initialize quest system
function initQuestSystem() {
    loadQuestState();
    loadLimboState();
    checkQuestProgress();
    updateQuestDisplay();
    applyLimboVisuals(); // Apply limbo visuals if in limbo
}

// Load quest state
function loadQuestState() {
    const saved = localStorage.getItem('solsRngQuests');
    if (saved) {
        const loaded = JSON.parse(saved);
        Object.assign(questState, loaded);
    }
}

// Save quest state
function saveQuestState() {
    localStorage.setItem('solsRngQuests', JSON.stringify(questState));
}

// Check quest progress
function checkQuestProgress() {
    for (let quest of QUESTS) {
        if (questState.completedQuests.includes(quest.id)) {
            continue;
        }
        
        if (checkQuestRequirements(quest)) {
            completeQuest(quest);
        }
    }
}

// Check if quest requirements are met
function checkQuestRequirements(quest) {
    // Check total rolls
    if (quest.requirements.totalRolls) {
        if (gameState.totalRolls < quest.requirements.totalRolls) {
            return false;
        }
    }
    
    // Check auras (need at least one from the list)
    if (quest.requirements.auras) {
        let hasRequiredAura = false;
        for (let auraName of quest.requirements.auras) {
            if (gameState.inventory.auras[auraName] && gameState.inventory.auras[auraName].count > 0) {
                hasRequiredAura = true;
                break;
            }
        }
        if (!hasRequiredAura) {
            return false;
        }
    }
    
    // Check auras (need ALL from the list)
    if (quest.requirements.aurasAll) {
        for (let auraName of quest.requirements.aurasAll) {
            if (!gameState.inventory.auras[auraName] || gameState.inventory.auras[auraName].count <= 0) {
                return false;
            }
        }
    }
    
    return true;
}

// Complete quest
function completeQuest(quest) {
    questState.completedQuests.push(quest.id);
    
    // Apply rewards
    if (quest.reward === "limbo_access") {
        questState.limboUnlocked = true;
        showQuestNotification(quest);
        updateLimboToggle();
    }
    
    saveQuestState();
    console.log(`Quest completed: ${quest.name}`);
}

// Show quest completion notification
function showQuestNotification(quest) {
    const notification = document.getElementById('itemSpawnNotification');
    notification.style.background = 'linear-gradient(135deg, #000000 0%, #4c1d95 100%)';
    notification.textContent = `🏆 Quest Complete: ${quest.name} - The Limbo Unlocked!`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        notification.style.background = 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)';
    }, 8000);
}

// Update limbo toggle visibility
function updateLimboToggle() {
    const limboToggle = document.getElementById('limboToggle');
    if (limboToggle) {
        limboToggle.style.display = questState.limboUnlocked ? 'flex' : 'none';
    }
}

// Toggle limbo state
function toggleLimbo() {
    if (!questState.limboUnlocked) {
        return;
    }
    
    limboState.inLimbo = !limboState.inLimbo;
    
    // Save limbo state
    saveLimboState();
    
    // Update UI
    const toggleBtn = document.getElementById('limboToggleBtn');
    if (toggleBtn) {
        toggleBtn.textContent = limboState.inLimbo ? '🌌 Exit Limbo' : '🌌 Enter Limbo';
        toggleBtn.style.background = limboState.inLimbo 
            ? 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)'
            : 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)';
    }
    
    // Apply limbo visuals
    applyLimboVisuals();
    
    // Show notification
    const notification = document.getElementById('itemSpawnNotification');
    notification.style.background = 'linear-gradient(135deg, #000000 0%, #4c1d95 100%)';
    notification.textContent = limboState.inLimbo ? '🌌 Entered The Limbo' : '🌍 Exited The Limbo';
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        notification.style.background = 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)';
    }, 3000);
}

// Limbo state
const limboState = {
    inLimbo: false
};

// Load limbo state
function loadLimboState() {
    const saved = localStorage.getItem('limboState');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            limboState.inLimbo = parsed.inLimbo || false;
        } catch (e) {
            console.error('Failed to load limbo state:', e);
        }
    }
}

// Save limbo state
function saveLimboState() {
    localStorage.setItem('limboState', JSON.stringify(limboState));
}

// Limbo exclusive auras (these already exist in AURAS but are only obtainable in Limbo)
const LIMBO_EXCLUSIVE_NAMES = [
    "Nothing",
    "Raven",
    "Anima",
    "Phantom",
    "Singularity",
    "Eventide",
    "Collapse",
    "Dreamscape"
];

// Voidheart exclusive aura (only rollable with Voidheart potion active)
const VOIDHEART_EXCLUSIVE = ["Eden"];

// Get Limbo auras from main AURAS array
function getLimboAuras() {
    return AURAS.filter(aura => LIMBO_EXCLUSIVE_NAMES.includes(aura.name));
}

function applyLimboVisuals() {
    const body = document.body;
    
    if (limboState.inLimbo) {
        body.classList.add('in-limbo');
    } else {
        body.classList.remove('in-limbo');
    }
}

// Get aura pool based on location
function getAuraPool() {
    // Oblivion Potion exclusive auras
    const OBLIVION_EXCLUSIVE = ["Memory: The Fallen", "Oblivion"];
    
    // Check if Voidheart is active
    const hasVoidheart = gameState.activeEffects?.some(effect => effect.voidheartMode) || false;
    
    if (gameState.oblivionPotionActive) {
        // With Oblivion Potion: All normal auras + Memory and Oblivion
        if (limboState.inLimbo) {
            // Limbo + Oblivion exclusives
            const limboPool = getLimboAuras();
            const nullAuras = BIOME_AURAS["NULL"];
            for (let auraName of nullAuras) {
                const aura = AURAS.find(a => a.name === auraName);
                if (aura && !limboPool.includes(aura)) {
                    limboPool.push(aura);
                }
            }
            // Add Oblivion exclusives
            for (let auraName of OBLIVION_EXCLUSIVE) {
                const aura = AURAS.find(a => a.name === auraName);
                if (aura && !limboPool.includes(aura)) {
                    limboPool.push(aura);
                }
            }
            // Add Eden if Voidheart is active
            if (hasVoidheart) {
                for (let auraName of VOIDHEART_EXCLUSIVE) {
                    const aura = AURAS.find(a => a.name === auraName);
                    if (aura && !limboPool.includes(aura)) {
                        limboPool.push(aura);
                    }
                }
            }
            return limboPool;
        } else {
            // Normal pool + Oblivion exclusives
            let normalPool = AURAS.filter(aura => !LIMBO_EXCLUSIVE_NAMES.includes(aura.name) && !VOIDHEART_EXCLUSIVE.includes(aura.name));
            // Add Eden if Voidheart is active
            if (hasVoidheart) {
                for (let auraName of VOIDHEART_EXCLUSIVE) {
                    const aura = AURAS.find(a => a.name === auraName);
                    if (aura && !normalPool.includes(aura)) {
                        normalPool.push(aura);
                    }
                }
            }
            return normalPool; // This includes OBLIVION_EXCLUSIVE auras
        }
    }
    
    if (limboState.inLimbo) {
        // In Limbo: Only Limbo exclusives and NULL biome auras (exclude Oblivion exclusives)
        const limboPool = getLimboAuras().filter(aura => !OBLIVION_EXCLUSIVE.includes(aura.name));
        
        // Add NULL biome auras
        const nullAuras = BIOME_AURAS["NULL"];
        for (let auraName of nullAuras) {
            const aura = AURAS.find(a => a.name === auraName);
            if (aura && !limboPool.includes(aura) && !OBLIVION_EXCLUSIVE.includes(aura.name)) {
                limboPool.push(aura);
            }
        }
        
        // Add Eden if Voidheart is active
        if (hasVoidheart) {
            for (let auraName of VOIDHEART_EXCLUSIVE) {
                const aura = AURAS.find(a => a.name === auraName);
                if (aura && !limboPool.includes(aura)) {
                    limboPool.push(aura);
                }
            }
        }
        
        return limboPool;
    } else {
        // Normal: All auras except Limbo exclusives, Oblivion exclusives, and Voidheart exclusives
        let normalPool = AURAS.filter(aura => 
            !LIMBO_EXCLUSIVE_NAMES.includes(aura.name) && 
            !OBLIVION_EXCLUSIVE.includes(aura.name) &&
            !VOIDHEART_EXCLUSIVE.includes(aura.name)
        );
        
        // Add Eden if Voidheart is active
        if (hasVoidheart) {
            for (let auraName of VOIDHEART_EXCLUSIVE) {
                const aura = AURAS.find(a => a.name === auraName);
                if (aura && !normalPool.includes(aura)) {
                    normalPool.push(aura);
                }
            }
        }
        
        return normalPool;
    }
}

// Check quest progress after each roll
function checkQuestsAfterRoll() {
    checkQuestProgress();
    updateQuestDisplay();
}

// Update quest display
function updateQuestDisplay() {
    const questsList = document.getElementById('questsList');
    if (!questsList) return;
    
    questsList.innerHTML = QUESTS.map(quest => {
        const isCompleted = questState.completedQuests.includes(quest.id);
        const completedClass = isCompleted ? 'completed' : '';
        
        let progressHTML = '';
        
        if (!isCompleted) {
            // Show progress for total rolls
            if (quest.requirements.totalRolls) {
                const current = gameState.totalRolls;
                const required = quest.requirements.totalRolls;
                const percentage = Math.min(100, (current / required * 100)).toFixed(1);
                const progressClass = current >= required ? '' : 'incomplete';
                progressHTML += `<div class="quest-progress ${progressClass}">Rolls: ${current.toLocaleString()} / ${required.toLocaleString()} (${percentage}%)</div>`;
            }
            
            // Show progress for auras (at least one)
            if (quest.requirements.auras) {
                let hasAura = false;
                for (let auraName of quest.requirements.auras) {
                    if (gameState.inventory.auras[auraName] && gameState.inventory.auras[auraName].count > 0) {
                        hasAura = true;
                        progressHTML += `<div class="quest-progress">✓ ${auraName} obtained!</div>`;
                        break;
                    }
                }
                if (!hasAura) {
                    progressHTML += `<div class="quest-progress incomplete">Need: ${quest.requirements.auras.join(' or ')}</div>`;
                }
            }
            
            // Show progress for auras (need all)
            if (quest.requirements.aurasAll) {
                for (let auraName of quest.requirements.aurasAll) {
                    const hasAura = gameState.inventory.auras[auraName] && gameState.inventory.auras[auraName].count > 0;
                    const progressClass = hasAura ? '' : 'incomplete';
                    const checkmark = hasAura ? '✓' : '✗';
                    progressHTML += `<div class="quest-progress ${progressClass}">${checkmark} ${auraName}</div>`;
                }
            }
        } else {
            progressHTML = '<div class="quest-progress">✓ Completed! The Limbo is now accessible.</div>';
        }
        
        return `
            <div class="quest-item ${completedClass}">
                <div class="quest-name">${quest.name}</div>
                <div class="quest-description">${quest.description}</div>
                ${progressHTML}
            </div>
        `;
    }).join('');
}