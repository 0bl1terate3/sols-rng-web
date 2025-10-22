// Update System using Firebase Realtime Database
// This allows you to broadcast update messages to all connected users
// and automatically update when version changes

class UpdateSystem {
    constructor() {
        this.updateOverlay = null;
        this.firebaseInitialized = false;
        this.database = null;
        this.updateRef = null;
        this.versionRef = null;
        this.initialVersion = null;
        this.currentVersion = null;
        this.isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    }

    // Initialize Firebase Realtime Database
    async initializeFirebase(firebaseConfig) {
        try {
            // Initialize Firebase if not already done
            if (!this.firebaseInitialized && typeof firebase !== 'undefined') {
                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                }
                this.database = firebase.database();
                this.updateRef = this.database.ref('system/update');
                this.versionRef = this.database.ref('appInfo/version');
                this.firebaseInitialized = true;
                
                // Listen for update broadcasts
                this.listenForUpdates();
                
                // Initialize version tracking
                this.initializeVersionTracking();
                
                console.log('Update system initialized with Firebase');
            } else {
                console.warn('Firebase not available. Update system will work locally only.');
            }
        } catch (error) {
            console.error('Error initializing Firebase for update system:', error);
            console.warn('Update system will continue without Firebase sync.');
            // Don't throw - allow the app to continue working
        }
    }

    // Initialize version tracking
    async initializeVersionTracking() {
        if (!this.versionRef || this.isLocalDevelopment) {
            console.log('Version tracking disabled for local development');
            return;
        }

        try {
            // Get the initial version when the page loads
            const snapshot = await this.versionRef.once('value');
            this.initialVersion = snapshot.val();
            this.currentVersion = this.initialVersion;
            console.log(`Current app version: ${this.initialVersion}`);
            
            // Listen for version changes
            this.listenForVersionChanges();
        } catch (error) {
            console.error('Error initializing version tracking:', error);
        }
    }

    // Listen for version changes
    listenForVersionChanges() {
        if (!this.versionRef) return;
        
        this.versionRef.on('value', (snapshot) => {
            const newVersion = snapshot.val();
            
            // If this is the first version we're getting, just store it
            if (!this.currentVersion) {
                this.currentVersion = newVersion;
                return;
            }
            
            // If the version has changed since we loaded the page
            if (newVersion !== this.initialVersion) {
                console.log(`Version change detected: ${this.initialVersion} → ${newVersion}`);
                this.currentVersion = newVersion;
                this.handleVersionChange(newVersion);
            }
        });
    }
    
    // Handle version change
    handleVersionChange(newVersion) {
        // Skip for local development
        if (this.isLocalDevelopment) return;
        
        const message = `UPDATE AVAILABLE (v${newVersion})`;
        this.showUpdateOverlay(message, true);
    }

    // Listen for update broadcasts from Firebase
    listenForUpdates() {
        if (!this.updateRef) return;

        this.updateRef.on('value', (snapshot) => {
            const updateData = snapshot.val();
            
            if (updateData && updateData.active) {
                const now = Date.now();
                
                // Check if update has a clearAt timestamp and if it's expired
                if (updateData.clearAt && now >= updateData.clearAt) {
                    console.log('⏱️ Update expired at', new Date(updateData.clearAt).toLocaleTimeString(), '- auto-clearing');
                    this.clearUpdate();
                    return;
                }
                
                // Fallback: Auto-ignore updates older than 15 seconds (safety measure)
                const updateAge = now - (updateData.timestamp || 0);
                if (updateAge > 15000 && !updateData.clearAt) {
                    console.log('⏭️ Ignoring old update (age: ' + Math.round(updateAge / 1000) + 's) - likely leftover from previous refresh');
                    return;
                }
                
                // Don't auto-refresh if admin panel is authenticated (they triggered it)
                const isAdminAuthenticated = window.adminPanel && window.adminPanel.isAdmin;
                const shouldAutoRefresh = updateData.autoRefresh && !isAdminAuthenticated;
                
                console.log('🔄 Update received:', {
                    message: updateData.message,
                    autoRefresh: updateData.autoRefresh,
                    isAdmin: isAdminAuthenticated,
                    willRefresh: shouldAutoRefresh
                });
                
                if (isAdminAuthenticated && updateData.autoRefresh) {
                    console.log('⚠️ Admin is authenticated - skipping auto-refresh to prevent loop');
                    // Still show the message but don't refresh
                    this.showUpdateOverlay(updateData.message, false);
                } else {
                    this.showUpdateOverlay(updateData.message, shouldAutoRefresh);
                }
            } else {
                this.hideUpdateOverlay();
            }
        });
        
        // Periodic check for expired updates (backup mechanism)
        setInterval(() => {
            if (this.updateRef) {
                this.updateRef.once('value', (snapshot) => {
                    const updateData = snapshot.val();
                    if (updateData && updateData.active && updateData.clearAt) {
                        const now = Date.now();
                        if (now >= updateData.clearAt) {
                            console.log('🕐 Periodic check: Update expired - auto-clearing');
                            this.clearUpdate();
                        }
                    }
                });
            }
        }, 2000); // Check every 2 seconds
    }

    // Show the update overlay
    showUpdateOverlay(message = 'UPDATE IN PROGRESS...', autoRefresh = false) {
        if (!this.updateOverlay) {
            this.createUpdateOverlay();
        }

        const messageElement = this.updateOverlay.querySelector('.update-message');
        messageElement.textContent = message;

        this.updateOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Auto refresh after delay if specified
        if (autoRefresh) {
            const countdown = this.updateOverlay.querySelector('.update-countdown');
            countdown.style.display = 'block';
            
            let seconds = 5;
            countdown.textContent = `Refreshing in ${seconds} seconds...`;
            
            const countdownInterval = setInterval(() => {
                seconds--;
                if (seconds > 0) {
                    countdown.textContent = `Refreshing in ${seconds} seconds...`;
                } else {
                    clearInterval(countdownInterval);
                    window.location.reload();
                }
            }, 1000);
        }
    }

    // Hide the update overlay
    hideUpdateOverlay() {
        if (this.updateOverlay) {
            this.updateOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Create the update overlay DOM element
    createUpdateOverlay() {
        this.updateOverlay = document.createElement('div');
        this.updateOverlay.id = 'updateOverlay';
        this.updateOverlay.className = 'update-overlay';
        this.updateOverlay.innerHTML = `
            <div class="update-content">
                <div class="update-spinner"></div>
                <div class="update-message">UPDATE IN PROGRESS...</div>
                <div class="update-countdown" style="display: none;"></div>
                <div class="update-subtitle">Please wait while we make improvements</div>
            </div>
        `;
        document.body.appendChild(this.updateOverlay);
    }

    // ADMIN FUNCTION: Broadcast update to all users
    async broadcastUpdate(message = 'UPDATE IN PROGRESS...', autoRefresh = false, duration = null) {
        if (!this.updateRef) {
            console.error('Firebase not initialized. Cannot broadcast update.');
            return;
        }

        try {
            const now = Date.now();
            const clearAt = duration ? now + duration : null;
            
            // Set update status with clearAt timestamp
            await this.updateRef.set({
                active: true,
                message: message,
                autoRefresh: autoRefresh,
                timestamp: now,
                clearAt: clearAt // Time when this update should auto-clear
            });

            console.log('Update broadcasted to all users');
            if (clearAt) {
                console.log('Update will auto-clear at:', new Date(clearAt).toLocaleTimeString());
            }

            return true;
        } catch (error) {
            console.error('Error broadcasting update:', error);
            return false;
        }
    }

    // ADMIN FUNCTION: Clear update status
    async clearUpdate() {
        if (!this.updateRef) {
            console.error('Firebase not initialized. Cannot clear update.');
            return;
        }

        try {
            await this.updateRef.set({
                active: false,
                message: '',
                autoRefresh: false,
                timestamp: Date.now(),
                clearAt: null
            });

            console.log('✅ Update status cleared');
            return true;
        } catch (error) {
            console.error('Error clearing update:', error);
            return false;
        }
    }

    // ADMIN FUNCTION: Force refresh all users
    async forceRefreshAll(message = 'UPDATE COMPLETE - REFRESHING...', delay = 5000) {
        await this.broadcastUpdate(message, true);
        
        // Clear update after refresh happens
        setTimeout(async () => {
            await this.clearUpdate();
        }, delay + 1000);
    }
}

// Create global instance
window.updateSystem = new UpdateSystem();

// NOTE: Firebase config is now in firebase-config.js
// The firebase-config.js file will auto-initialize both updateSystem and globalLeaderboard

/* 
ADMIN USAGE EXAMPLES:
====================

1. Show update overlay to all users (manual dismiss):
   updateSystem.broadcastUpdate('UPDATE IN PROGRESS...');

2. Show update overlay and auto-clear after 30 seconds:
   updateSystem.broadcastUpdate('Deploying new features...', false, 30000);

3. Show update overlay and force refresh all users after 5 seconds:
   updateSystem.forceRefreshAll('UPDATE COMPLETE - REFRESHING...', 5000);

4. Clear update overlay manually:
   updateSystem.clearUpdate();

5. Simple update with custom message:
   updateSystem.broadcastUpdate('Server maintenance in progress. Please wait...');

VERSION-BASED UPDATE SYSTEM:
===========================

This system automatically detects when you've deployed a new version of your app
and prompts users to refresh their browsers to get the latest version.

Setup Instructions:
1. In your Firebase Realtime Database, create a path: 'appInfo/version'
2. Set the initial version value (e.g., '1.0.0')
3. Deploy your app to Firebase Hosting

Deployment Process:
1. Make your code changes
2. Deploy to Firebase Hosting using 'firebase deploy'
3. Go to Firebase Realtime Database console
4. Update the version number at 'appInfo/version' (e.g., from '1.0.0' to '1.0.1')
5. All users will automatically see an update notification and their page will refresh

Notes:
- The version tracking is disabled in local development environments
- You can use any version format (semantic versioning recommended: '1.0.0')
- When a version change is detected, users will see an update overlay with auto-refresh
*/
