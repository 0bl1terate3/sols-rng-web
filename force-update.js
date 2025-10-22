// Force Update Script - This will refresh your cache without losing save data
(function() {
    // Check if we need to force update
    const currentVersion = '2.2';
    const storedVersion = localStorage.getItem('appVersion');
    
    if (storedVersion !== currentVersion) {
        console.log('⚠️ Version mismatch detected:', storedVersion, '→', currentVersion);
        console.log('ℹ️ Auto-update disabled. Clear cache manually if needed.');
        
        // Just update the version without reloading to prevent infinite loop
        localStorage.setItem('appVersion', currentVersion);
        
        // Clear service worker cache silently
        if ('caches' in window) {
            caches.keys().then(function(cacheNames) {
                cacheNames.forEach(function(cacheName) {
                    caches.delete(cacheName);
                    console.log('Deleted cache:', cacheName);
                });
            });
        }
        
        // Unregister service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                registrations.forEach(function(registration) {
                    registration.unregister();
                    console.log('Unregistered service worker');
                });
            });
        }
    }
})();