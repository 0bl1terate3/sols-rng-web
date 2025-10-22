// Force Update Script - This will refresh your cache without losing save data
(function() {
    // Check if we need to force update
    const currentVersion = '2.2';
    const storedVersion = localStorage.getItem('appVersion');
    
    if (storedVersion !== currentVersion) {
        console.log('Forcing cache update...');
        
        // Clear service worker cache
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
        
        // Update version and reload
        localStorage.setItem('appVersion', currentVersion);
        
        // Show user-friendly message
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #4CAF50;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            font-size: 16px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;
        notification.innerHTML = `
            <div>🔄 Updating to latest version...</div>
            <div style="font-size: 12px; margin-top: 10px;">Your save data is safe!</div>
        `;
        document.body.appendChild(notification);
        
        // Reload after a short delay
        setTimeout(() => {
            window.location.reload(true); // Force reload from server
        }, 1500);
    }
})();