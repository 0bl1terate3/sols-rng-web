// =================================================================
// Performance Optimizer - Reduce Lag & Improve FPS
// =================================================================

const performanceOptimizer = {
    settings: {
        reducedAnimations: false,
        disableParticles: false,
        lowerQualityEffects: false,
        reducedCutscenes: false,
        disableBackgroundEffects: false,
        limitHistorySize: false,
        throttleUpdates: false
    },
    
    originalFunctions: {},
    throttledFunctions: new Map()
};

// =================================================================
// Throttle Helper
// =================================================================

function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return func.apply(this, args);
        }
    };
}

// =================================================================
// Performance Optimization Functions
// =================================================================

function toggleReducedAnimations() {
    performanceOptimizer.settings.reducedAnimations = !performanceOptimizer.settings.reducedAnimations;
    
    if (performanceOptimizer.settings.reducedAnimations) {
        document.body.classList.add('reduced-animations');
        showNotification('⚡ Reduced animations enabled - Faster UI');
    } else {
        document.body.classList.remove('reduced-animations');
        showNotification('✨ Full animations restored');
    }
    
    savePerformanceSettings();
}

function toggleDisableParticles() {
    performanceOptimizer.settings.disableParticles = !performanceOptimizer.settings.disableParticles;
    
    if (performanceOptimizer.settings.disableParticles) {
        document.body.classList.add('no-particles');
        showNotification('🚫 Particles disabled - Better performance');
    } else {
        document.body.classList.remove('no-particles');
        showNotification('✨ Particles enabled');
    }
    
    savePerformanceSettings();
}

function toggleLowerQualityEffects() {
    performanceOptimizer.settings.lowerQualityEffects = !performanceOptimizer.settings.lowerQualityEffects;
    
    if (performanceOptimizer.settings.lowerQualityEffects) {
        document.body.classList.add('low-quality-effects');
        showNotification('📉 Lower quality effects - Faster rendering');
    } else {
        document.body.classList.remove('low-quality-effects');
        showNotification('📈 High quality effects restored');
    }
    
    savePerformanceSettings();
}

function toggleReducedCutscenes() {
    performanceOptimizer.settings.reducedCutscenes = !performanceOptimizer.settings.reducedCutscenes;
    
    if (performanceOptimizer.settings.reducedCutscenes) {
        showNotification('⏩ Cutscenes will be shorter and simpler');
    } else {
        showNotification('🎬 Full cutscenes restored');
    }
    
    savePerformanceSettings();
}

function toggleDisableBackgroundEffects() {
    performanceOptimizer.settings.disableBackgroundEffects = !performanceOptimizer.settings.disableBackgroundEffects;
    
    if (performanceOptimizer.settings.disableBackgroundEffects) {
        document.body.classList.add('no-background-effects');
        showNotification('🎨 Background effects disabled - Major performance boost');
    } else {
        document.body.classList.remove('no-background-effects');
        showNotification('🎨 Background effects enabled');
    }
    
    savePerformanceSettings();
}

function toggleLimitHistorySize() {
    performanceOptimizer.settings.limitHistorySize = !performanceOptimizer.settings.limitHistorySize;
    
    if (performanceOptimizer.settings.limitHistorySize) {
        // Limit roll history to last 100 items
        if (typeof qolState !== 'undefined' && qolState.rollHistory) {
            qolState.rollHistory = qolState.rollHistory.slice(-100);
            if (typeof updateRollHistoryDisplay === 'function') {
                updateRollHistoryDisplay();
            }
        }
        showNotification('📊 History limited to 100 items - Reduced memory usage');
    } else {
        showNotification('📊 Full history enabled');
    }
    
    savePerformanceSettings();
}

function toggleThrottleUpdates() {
    performanceOptimizer.settings.throttleUpdates = !performanceOptimizer.settings.throttleUpdates;
    
    if (performanceOptimizer.settings.throttleUpdates) {
        // Throttle UI updates
        applyUpdateThrottling();
        showNotification('⏱️ UI updates throttled - Smoother performance');
    } else {
        removeUpdateThrottling();
        showNotification('⏱️ Normal update speed restored');
    }
    
    savePerformanceSettings();
}

// =================================================================
// Apply Throttling to UI Updates
// =================================================================

function applyUpdateThrottling() {
    // Throttle updateUI to 30fps (33ms)
    if (typeof updateUI === 'function' && !performanceOptimizer.originalFunctions.updateUI) {
        performanceOptimizer.originalFunctions.updateUI = updateUI;
        window.updateUI = throttle(updateUI, 33);
    }
    
    // Throttle updateInventoryDisplay to 15fps (66ms)
    if (typeof updateInventoryDisplay === 'function' && !performanceOptimizer.originalFunctions.updateInventoryDisplay) {
        performanceOptimizer.originalFunctions.updateInventoryDisplay = updateInventoryDisplay;
        window.updateInventoryDisplay = throttle(updateInventoryDisplay, 66);
    }
    
    // Throttle updateStatisticsDisplay to 10fps (100ms)
    if (typeof updateStatisticsDisplay === 'function' && !performanceOptimizer.originalFunctions.updateStatisticsDisplay) {
        performanceOptimizer.originalFunctions.updateStatisticsDisplay = updateStatisticsDisplay;
        window.updateStatisticsDisplay = throttle(updateStatisticsDisplay, 100);
    }
}

function removeUpdateThrottling() {
    // Restore original functions
    if (performanceOptimizer.originalFunctions.updateUI) {
        window.updateUI = performanceOptimizer.originalFunctions.updateUI;
        delete performanceOptimizer.originalFunctions.updateUI;
    }
    
    if (performanceOptimizer.originalFunctions.updateInventoryDisplay) {
        window.updateInventoryDisplay = performanceOptimizer.originalFunctions.updateInventoryDisplay;
        delete performanceOptimizer.originalFunctions.updateInventoryDisplay;
    }
    
    if (performanceOptimizer.originalFunctions.updateStatisticsDisplay) {
        window.updateStatisticsDisplay = performanceOptimizer.originalFunctions.updateStatisticsDisplay;
        delete performanceOptimizer.originalFunctions.updateStatisticsDisplay;
    }
}

// =================================================================
// Enable All Performance Optimizations
// =================================================================

function enableAllPerformanceOptimizations() {
    if (!performanceOptimizer.settings.reducedAnimations) toggleReducedAnimations();
    if (!performanceOptimizer.settings.disableParticles) toggleDisableParticles();
    if (!performanceOptimizer.settings.lowerQualityEffects) toggleLowerQualityEffects();
    if (!performanceOptimizer.settings.reducedCutscenes) toggleReducedCutscenes();
    if (!performanceOptimizer.settings.disableBackgroundEffects) toggleDisableBackgroundEffects();
    if (!performanceOptimizer.settings.limitHistorySize) toggleLimitHistorySize();
    if (!performanceOptimizer.settings.throttleUpdates) toggleThrottleUpdates();
    
    showNotification('🚀 ULTRA PERFORMANCE MODE - All optimizations enabled!');
}

function disableAllPerformanceOptimizations() {
    if (performanceOptimizer.settings.reducedAnimations) toggleReducedAnimations();
    if (performanceOptimizer.settings.disableParticles) toggleDisableParticles();
    if (performanceOptimizer.settings.lowerQualityEffects) toggleLowerQualityEffects();
    if (performanceOptimizer.settings.reducedCutscenes) toggleReducedCutscenes();
    if (performanceOptimizer.settings.disableBackgroundEffects) toggleDisableBackgroundEffects();
    if (performanceOptimizer.settings.limitHistorySize) toggleLimitHistorySize();
    if (performanceOptimizer.settings.throttleUpdates) toggleThrottleUpdates();
    
    showNotification('✨ Full quality mode - All optimizations disabled');
}

// =================================================================
// Save/Load Settings
// =================================================================

function savePerformanceSettings() {
    try {
        localStorage.setItem('performanceOptimizer', JSON.stringify(performanceOptimizer.settings));
    } catch (e) {
        console.error('Failed to save performance settings:', e);
    }
}

function loadPerformanceSettings() {
    try {
        const saved = localStorage.getItem('performanceOptimizer');
        if (saved) {
            const settings = JSON.parse(saved);
            Object.assign(performanceOptimizer.settings, settings);
            
            // Apply saved settings
            if (settings.reducedAnimations) document.body.classList.add('reduced-animations');
            if (settings.disableParticles) document.body.classList.add('no-particles');
            if (settings.lowerQualityEffects) document.body.classList.add('low-quality-effects');
            if (settings.disableBackgroundEffects) document.body.classList.add('no-background-effects');
            if (settings.throttleUpdates) applyUpdateThrottling();
        }
    } catch (e) {
        console.error('Failed to load performance settings:', e);
    }
}

// =================================================================
// Sync Checkboxes
// =================================================================

function syncPerformanceCheckboxes() {
    const checkboxes = {
        'reducedAnimationsToggle': 'reducedAnimations',
        'disableParticlesToggle': 'disableParticles',
        'lowerQualityEffectsToggle': 'lowerQualityEffects',
        'reducedCutscenesToggle': 'reducedCutscenes',
        'disableBackgroundEffectsToggle': 'disableBackgroundEffects',
        'limitHistorySizeToggle': 'limitHistorySize',
        'throttleUpdatesToggle': 'throttleUpdates'
    };
    
    for (const [id, setting] of Object.entries(checkboxes)) {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = performanceOptimizer.settings[setting];
        }
    }
}

// =================================================================
// Initialize
// =================================================================

function initPerformanceOptimizer() {
    console.log('Initializing Performance Optimizer...');
    loadPerformanceSettings();
    
    // Sync checkboxes after a short delay to ensure DOM is ready
    setTimeout(syncPerformanceCheckboxes, 100);
}

// Export functions to global scope
window.toggleReducedAnimations = toggleReducedAnimations;
window.toggleDisableParticles = toggleDisableParticles;
window.toggleLowerQualityEffects = toggleLowerQualityEffects;
window.toggleReducedCutscenes = toggleReducedCutscenes;
window.toggleDisableBackgroundEffects = toggleDisableBackgroundEffects;
window.toggleLimitHistorySize = toggleLimitHistorySize;
window.toggleThrottleUpdates = toggleThrottleUpdates;
window.enableAllPerformanceOptimizations = enableAllPerformanceOptimizations;
window.disableAllPerformanceOptimizations = disableAllPerformanceOptimizations;
window.initPerformanceOptimizer = initPerformanceOptimizer;
window.syncPerformanceCheckboxes = syncPerformanceCheckboxes;
