// =================================================================
// Optimized Logging System - Prevents FPS Loss
// =================================================================

const Logger = {
    enabled: false, // Set to true only for debugging
    debugMode: false,
    
    // Enable/disable logging
    enable() {
        this.enabled = true;
        console.log('🔧 Logger enabled');
    },
    
    disable() {
        this.enabled = false;
    },
    
    // Enable debug mode (more verbose)
    enableDebug() {
        this.debugMode = true;
        this.enabled = true;
        console.log('🐛 Debug mode enabled');
    },
    
    // Log only if enabled
    log(...args) {
        if (this.enabled) {
            console.log(...args);
        }
    },
    
    // Debug logs (only in debug mode)
    debug(...args) {
        if (this.debugMode) {
            console.log('[DEBUG]', ...args);
        }
    },
    
    // Warnings always show (important)
    warn(...args) {
        console.warn(...args);
    },
    
    // Errors always show (critical)
    error(...args) {
        console.error(...args);
    },
    
    // Performance-critical: only log in debug mode
    perf(...args) {
        if (this.debugMode) {
            console.log('[PERF]', ...args);
        }
    },
    
    // Group logging (collapsible)
    group(label) {
        if (this.enabled) {
            console.group(label);
        }
    },
    
    groupEnd() {
        if (this.enabled) {
            console.groupEnd();
        }
    }
};

// Auto-detect if DevTools is open
(function detectDevTools() {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
        // DevTools likely open, enable logging
        Logger.enable();
    }
})();

// Keyboard shortcut to toggle logging (Ctrl+Shift+L)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        if (Logger.enabled) {
            Logger.disable();
            console.log('🔇 Logger disabled - Better FPS!');
        } else {
            Logger.enable();
        }
    }
    
    // Ctrl+Shift+D for debug mode
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        if (Logger.debugMode) {
            Logger.debugMode = false;
            console.log('🐛 Debug mode disabled');
        } else {
            Logger.enableDebug();
        }
    }
});

// Make globally accessible
window.Logger = Logger;

// Usage:
// Replace: console.log('message')
// With: Logger.log('message')
//
// For performance-critical code:
// Logger.perf('animation frame'); // Only logs in debug mode
//
// For important warnings/errors:
// Logger.warn('warning'); // Always logs
// Logger.error('error'); // Always logs
