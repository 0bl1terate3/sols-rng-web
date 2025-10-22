// Mobile Enhancement Script for Sol's RNG
(function() {
    'use strict';
    
    // Mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Add mobile class to body for CSS targeting
    function addMobileClasses() {
        if (!document.body) return;
        
        if (isMobile) {
            document.body.classList.add('mobile-device');
        }
        
        if (isTouchDevice) {
            document.body.classList.add('touch-device');
        }
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addMobileClasses);
    } else {
        addMobileClasses();
    }
    
    // Prevent zoom on double tap for touch devices
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Prevent zoom on pinch
    document.addEventListener('gesturestart', function(event) {
        event.preventDefault();
    });
    
    // Optimize touch targets
    function optimizeTouchTargets() {
        const touchElements = document.querySelectorAll('button, .tab-btn, .inventory-item, .aura-item, .recipe-item, .quick-action-slot');
        
        touchElements.forEach(element => {
            // Ensure minimum touch target size
            const rect = element.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                element.style.minWidth = '44px';
                element.style.minHeight = '44px';
            }
            
            // Add touch feedback
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            element.addEventListener('touchend', function() {
                this.style.transform = '';
            });
            
            element.addEventListener('touchcancel', function() {
                this.style.transform = '';
            });
        });
    }
    
    // Handle orientation change
    function handleOrientationChange() {
        // Force repaint to fix layout issues
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
        
        // Adjust viewport for safe areas on iOS
        if (isMobile && window.CSS && CSS.supports('padding-top: env(safe-area-inset-top)')) {
            document.documentElement.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
            document.documentElement.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
            document.documentElement.style.setProperty('--safe-area-left', 'env(safe-area-inset-left)');
            document.documentElement.style.setProperty('--safe-area-right', 'env(safe-area-inset-right)');
        }
    }
    
    // Optimize scrolling performance
    function optimizeScrolling() {
        const scrollableElements = document.querySelectorAll('.inventory-grid, .auras-list, .recipes-list, #dailyQuestsContainer, #achievementsInventory');
        
        scrollableElements.forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
            element.style.transform = 'translateZ(0)';
            element.style.willChange = 'transform';
        });
    }
    
    // Add swipe gestures for quick actions
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(event) {
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    }, false);
    
    document.addEventListener('touchend', function(event) {
        touchEndX = event.changedTouches[0].screenX;
        touchEndY = event.changedTouches[0].screenY;
        handleSwipeGesture();
    }, false);
    
    function handleSwipeGesture() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const minSwipeDistance = 50;
        
        // Horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - could trigger quick action
                console.log('Swiped right');
            } else {
                // Swipe left - could trigger another quick action
                console.log('Swiped left');
            }
        }
        
        // Vertical swipes
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
                // Swipe down - could close modals
                console.log('Swiped down');
            } else {
                // Swipe up - could open inventory
                console.log('Swiped up');
            }
        }
    }
    
    // Handle keyboard appearance on mobile
    function handleKeyboardAppearance() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                document.body.classList.add('keyboard-open');
                // Scroll input into view
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
            
            input.addEventListener('blur', function() {
                document.body.classList.remove('keyboard-open');
            });
        });
    }
    
    // Optimize animations for mobile
    function optimizeAnimations() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion || isMobile) {
            // Disable heavy animations on mobile or when reduced motion is preferred
            const style = document.createElement('style');
            style.textContent = `
                .current-aura-display.rolling { animation: none !important; }
                .current-aura-display.rolling .aura-name { animation: none !important; }
                .aura-name { animation: none !important; }
                header::before { animation: none !important; }
                .panel::before { transition: none !important; }
                button::before { transition: none !important; }
                @keyframes particleFloat { 0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; } }
                @keyframes headerGlow { 0%, 100% { transform: translate(0, 0); } }
                @keyframes titlePulse { 0%, 100% { filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.5)); } }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Handle safe areas for notched devices
    function handleSafeAreas() {
        if (isMobile && window.CSS && CSS.supports('padding-top: env(safe-area-inset-top)')) {
            // Apply safe area insets
            const style = document.createElement('style');
            style.textContent = `
                .currency-bar {
                    padding-top: max(8px, env(safe-area-inset-top));
                }
                
                .container {
                    padding-top: max(10px, env(safe-area-inset-top));
                    padding-bottom: max(10px, env(safe-area-inset-bottom));
                    padding-left: max(10px, env(safe-area-inset-left));
                    padding-right: max(10px, env(safe-area-inset-right));
                }
                
                .quick-actions {
                    bottom: max(20px, env(safe-area-inset-bottom));
                    right: max(20px, env(safe-area-inset-right));
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Performance monitoring
    function monitorPerformance() {
        if ('PerformanceObserver' in window) {
            // Monitor long tasks that could cause jank
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) { // Tasks longer than 50ms
                        // Disabled - console spam was causing FPS drops (ironic!)
                        // console.warn('Long task detected:', entry.duration + 'ms');
                    }
                }
            });
            
            observer.observe({ entryTypes: ['longtask'] });
        }
    }
    
    // Initialize all mobile optimizations
    function initializeMobileOptimizations() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeMobileOptimizations);
            return;
        }
        
        optimizeTouchTargets();
        optimizeScrolling();
        handleOrientationChange();
        handleKeyboardAppearance();
        optimizeAnimations();
        handleSafeAreas();
        monitorPerformance();
        
        // Add event listeners
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);
        
        // Handle visibility change to pause/resume animations
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                document.body.classList.add('paused');
            } else {
                document.body.classList.remove('paused');
            }
        });
        
        console.log('Mobile optimizations initialized');
    }
    
    // Auto-initialize
    initializeMobileOptimizations();
    
    // Export utilities for other scripts to use
    window.MobileUtils = {
        isMobile: isMobile,
        isTouchDevice: isTouchDevice,
        optimizeTouchTargets: optimizeTouchTargets,
        handleOrientationChange: handleOrientationChange
    };
    
})();