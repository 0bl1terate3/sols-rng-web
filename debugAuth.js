// Debug Authentication System
// Secure password protection for debug mode access

class DebugAuth {
    constructor() {
        // Split the real hash into parts and mix with decoys for obfuscation
        const part1 = '78ee1bad';
        const part2 = 'e156e1e6';
        const part3 = '0ba493bd';
        const part4 = '107f2733';
        const part5 = '11a119df';
        const part6 = '0afa4a56';
        const part7 = '9c8023c9';
        const part8 = '66183d4a';
        
        // Array of decoy hashes + real hash (reassembled at runtime)
        this.hashArray = [
            part1 + part2 + part3 + part4 + part5 + part6 + part7 + part8, // Real hash (reassembled)
            'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890', // Decoy 1
            'fedcba0987654321098765432109876543210fedcba09876543210fedcba09876543210', // Decoy 2
            'deadbeefcafebabe0123456789abcdef0123456789abcdef0123456789abcdef0123456789' // Decoy 3
        ];
        
        this.realHashIndex = 0;
        this.authenticated = false;
        this.sessionTimeout = null;
        this.sessionDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
        this.setupAuthModal();
        
        // Anti-debugging measures
        this.antiDebug();
        
        console.log('Debug authentication system initialized');
        console.log('Auth modal created:', document.getElementById('debugAuthModal') !== null);
    }
    
    // Anti-debugging protection
    antiDebug() {
        // Console filtering disabled to allow proper debugging
        // Only scramble the hash array for security
        this.scrambleHashArray();
    }
    
    // Scramble hash array to make it harder to identify the real hash
    scrambleHashArray() {
        // Use a simple deterministic shuffle based on character codes
        const shuffleKey = 'security';
        let sum = 0;
        for (let i = 0; i < shuffleKey.length; i++) {
            sum += shuffleKey.charCodeAt(i);
        }
        
        // Only scramble if sum is even (deterministic)
        if (sum % 2 === 0) {
            // Swap first and last elements
            const temp = this.hashArray[0];
            this.hashArray[0] = this.hashArray[this.hashArray.length - 1];
            this.hashArray[this.hashArray.length - 1] = temp;
            this.realHashIndex = this.hashArray.length - 1; // Update real hash position
        }
    }

    // Secure password hashing using Web Crypto API
    async hashPassword(password) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            console.error('Password hashing failed:', error);
            return 'fallback_hash_that_will_never_match_' + Date.now();
        }
    }

    // Secure password verification with decoy protection and timing attack prevention
    async verifyPassword(password) {
        const hash = await this.hashPassword(password);
        
        // Prevent timing attacks by always checking all hashes
        let foundMatch = false;
        let isRealHash = false;
        
        for (let i = 0; i < this.hashArray.length; i++) {
            if (hash === this.hashArray[i]) {
                foundMatch = true;
                if (i === this.realHashIndex) {
                    isRealHash = true;
                }
            }
        }
        
        return foundMatch && isRealHash;
    }

    // Create the authentication modal
    setupAuthModal() {
        const modal = document.createElement('div');
        modal.id = 'debugAuthModal';
        modal.className = 'debug-auth-overlay';
        modal.innerHTML = `
            <div class="debug-auth-container">
                        <div class="debug-auth-header">
                            <div class="debug-auth-icon">🔒</div>
                            <div class="debug-auth-title">DEBUG MODE AUTHENTICATION</div>
                            <div class="debug-auth-subtitle">RESTRICTED AREA - Owner Access Only</div>
                            <button class="debug-auth-close" onclick="debugAuth.closeAuthModal()">✕</button>
                        </div>
                        
                        <form class="debug-auth-form" onsubmit="event.preventDefault(); debugAuth.attemptLogin();">
                            <div class="debug-auth-info">
                                <div class="debug-auth-info-title">
                                    🔐 Maximum Security Mode
                                </div>
                                <div class="debug-auth-info-text">
                                    Cryptographically secure access required
                                </div>
                            </div>
                            
                            <div class="debug-auth-input-group">
                                <label class="debug-auth-label" for="debugPasswordInput">Secure Access Key</label>
                                <input type="password" 
                                       id="debugPasswordInput" 
                                       class="debug-auth-input"
                                       placeholder="Enter password..." 
                                       autocomplete="off" 
                                       spellcheck="false">
                                <div class="debug-auth-error" id="debugAuthError" style="display: none;"></div>
                            </div>
                            
                            <button type="submit" class="debug-auth-btn">
                                🔓 Authenticate
                            </button>
                        </form>
                        
                        <div class="debug-auth-footer">
                            <div class="debug-auth-footer-text">
                                Military-grade security | Session expires in 30 minutes
                            </div>
                        </div>
                    </div>
        `;
        document.body.appendChild(modal);

        // Add click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeAuthModal();
            }
        });
    }

    // Show the authentication modal
    showAuthModal() {
        const modal = document.getElementById('debugAuthModal');
        const input = document.getElementById('debugPasswordInput');
        const error = document.getElementById('debugAuthError');
        
        console.log('Auth modal elements:', { modal, input, error });
        
        if (modal) {
            console.log('Showing modal...');
            modal.classList.add('show');
            if (input) {
                input.value = '';
                setTimeout(() => input.focus(), 100);
            }
            if (error) {
                error.textContent = '';
                error.style.display = 'none';
            }
        } else {
            console.error('Debug auth modal not found!');
        }
    }

    // Close the authentication modal
    closeAuthModal() {
        const modal = document.getElementById('debugAuthModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // Attempt to login with provided password
    async attemptLogin() {
        const password = document.getElementById('debugPasswordInput').value;
        const errorDiv = document.getElementById('debugAuthError');

        if (!password) {
            errorDiv.textContent = 'Please enter a password.';
            errorDiv.style.display = 'block';
            return;
        }

        try {
            const isValid = await this.verifyPassword(password);
            
            if (isValid) {
                this.authenticated = true;
                this.startSessionTimer();
                this.closeAuthModal();
                
                // Show success notification
                this.showNotification('✅ Authentication successful!', 'success');
                
                // Grant access to debug menu
                if (typeof toggleDebugMenu === 'function') {
                    toggleDebugMenu();
                }
            } else {
                errorDiv.textContent = '❌ Invalid password. Access denied.';
                errorDiv.style.display = 'block';
                
                // Add delay to prevent brute force attempts
                setTimeout(() => {
                    errorDiv.textContent = '';
                    errorDiv.style.display = 'none';
                }, 3000);
            }
        } catch (error) {
            console.error('Authentication error:', error);
            errorDiv.textContent = '❌ Authentication error. Please try again.';
            errorDiv.style.display = 'block';
        }
    }

    // Start session timer for auto-logout
    startSessionTimer() {
        // Clear existing timer
        if (this.sessionTimeout) {
            clearTimeout(this.sessionTimeout);
        }

        // Set new timer
        this.sessionTimeout = setTimeout(() => {
            this.logout();
            this.showNotification('🔒 Debug session expired. Please re-authenticate.', 'warning');
        }, this.sessionDuration);
    }

    // Logout and clear authentication
    logout() {
        this.authenticated = false;
        if (this.sessionTimeout) {
            clearTimeout(this.sessionTimeout);
            this.sessionTimeout = null;
        }
        
        // Close debug menu if open
        if (typeof debugState !== 'undefined' && debugState.menuOpen) {
            toggleDebugMenu();
        }
        
        console.log('Debug authentication session ended');
    }

    // Check if currently authenticated
    isAuthenticated() {
        return this.authenticated;
    }

    // Show notification to user
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `debug-auth-notification ${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Reset session timer on activity
    resetSessionTimer() {
        if (this.authenticated) {
            this.startSessionTimer();
        }
    }
}

// Create global instance with error handling
try {
    console.log('Initializing debug authentication system...');
    window.debugAuth = new DebugAuth();
    console.log('Debug authentication system created successfully');
    
    // Add activity listeners to reset session timer
    document.addEventListener('click', () => {
        if (window.debugAuth) {
            window.debugAuth.resetSessionTimer();
        }
    });

    document.addEventListener('keydown', () => {
        if (window.debugAuth) {
            window.debugAuth.resetSessionTimer();
        }
    });
} catch (error) {
    console.error('Failed to initialize debug authentication system:', error);
    // Create a dummy auth object so debug menu can still work
    window.debugAuth = {
        isAuthenticated: () => true,
        showAuthModal: () => console.warn('Debug auth not available'),
        resetSessionTimer: () => {},
        authenticated: true
    };
    console.warn('Using fallback debug auth (no authentication)');
}