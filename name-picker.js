// =================================================================
// Name Picker - First-Time Setup
// =================================================================

class NamePicker {
    constructor() {
        this.modal = null;
        this.playerName = null;
    }

    // Initialize name picker
    initialize() {
        // Check if player already has a name
        this.playerName = localStorage.getItem('playerName');
        
        if (!this.playerName) {
            // Show name picker modal
            this.showNamePicker();
        } else {
            console.log('✅ Welcome back,', this.playerName);
            // Set name in gameState
            if (typeof gameState !== 'undefined') {
                gameState.playerName = this.playerName;
            }
        }
    }

    // Show name picker modal
    showNamePicker() {
        // Block game until name is chosen
        this.modal = document.createElement('div');
        this.modal.id = 'namePickerModal';
        this.modal.className = 'name-picker-modal';
        this.modal.innerHTML = `
            <div class="name-picker-content">
                <div class="name-picker-header">
                    <h1>🎮 Welcome to Sol's RNG!</h1>
                    <p>Choose your player name to begin</p>
                </div>
                
                <div class="name-picker-body">
                    <input type="text" id="playerNameInput" placeholder="Enter your name..." maxlength="20" autocomplete="off">
                    <p class="name-picker-hint">3-20 characters • Will appear on leaderboards</p>
                    
                    <div class="name-picker-requirements">
                        <p id="nameReq1" class="req-item">✗ At least 3 characters</p>
                        <p id="nameReq2" class="req-item">✗ No more than 20 characters</p>
                        <p id="nameReq3" class="req-item">✗ Valid characters only</p>
                    </div>
                </div>
                
                <div class="name-picker-footer">
                    <button id="namePickerSubmit" class="name-picker-btn" disabled>
                        Start Playing →
                    </button>
                    <p class="name-picker-note">You can change your name later in settings</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.modal);
        
        // Focus input
        const input = document.getElementById('playerNameInput');
        input.focus();
        
        // Add event listeners
        input.addEventListener('input', (e) => this.validateName(e.target.value));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.isValidName(e.target.value)) {
                this.submitName();
            }
        });
        
        document.getElementById('namePickerSubmit').addEventListener('click', () => this.submitName());
        
        console.log('📝 Name picker shown - waiting for player name...');
    }

    // Validate name in real-time
    validateName(name) {
        const req1 = document.getElementById('nameReq1');
        const req2 = document.getElementById('nameReq2');
        const req3 = document.getElementById('nameReq3');
        const submitBtn = document.getElementById('namePickerSubmit');
        
        // Check length (min 3)
        if (name.length >= 3) {
            req1.className = 'req-item valid';
            req1.textContent = '✓ At least 3 characters';
        } else {
            req1.className = 'req-item';
            req1.textContent = '✗ At least 3 characters';
        }
        
        // Check length (max 20)
        if (name.length <= 20) {
            req2.className = 'req-item valid';
            req2.textContent = '✓ No more than 20 characters';
        } else {
            req2.className = 'req-item';
            req2.textContent = '✗ No more than 20 characters';
        }
        
        // Check valid characters (letters, numbers, spaces, basic symbols)
        const validPattern = /^[a-zA-Z0-9\s\-_\.]+$/;
        if (name.length > 0 && validPattern.test(name)) {
            req3.className = 'req-item valid';
            req3.textContent = '✓ Valid characters only';
        } else if (name.length === 0) {
            req3.className = 'req-item';
            req3.textContent = '✗ Valid characters only';
        } else {
            req3.className = 'req-item';
            req3.textContent = '✗ Invalid characters detected';
        }
        
        // Enable/disable submit button
        if (this.isValidName(name)) {
            submitBtn.disabled = false;
            submitBtn.classList.add('enabled');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.remove('enabled');
        }
    }

    // Check if name is valid
    isValidName(name) {
        const validPattern = /^[a-zA-Z0-9\s\-_\.]+$/;
        return name.length >= 3 && name.length <= 20 && validPattern.test(name);
    }

    // Submit name
    submitName() {
        const input = document.getElementById('playerNameInput');
        const name = input.value.trim();
        
        if (!this.isValidName(name)) {
            alert('Please enter a valid name (3-20 characters)');
            return;
        }
        
        // Save name to ALL storage locations (unified system)
        this.playerName = name;
        localStorage.setItem('playerName', name);
        localStorage.setItem('playerLeaderboardName', name); // Also set leaderboard name
        
        // Set in gameState
        if (typeof gameState !== 'undefined') {
            gameState.playerName = name;
        }
        
        // Sync with global leaderboard if available
        if (typeof window.globalLeaderboard !== 'undefined' && window.globalLeaderboard) {
            window.globalLeaderboard.playerName = name;
        }
        
        console.log('✅ Player name set:', name);
        
        // Show welcome message
        if (typeof showNotification === 'function') {
            showNotification(`🎮 Welcome, ${name}!`, 'success');
        }
        
        // Remove modal with animation
        this.modal.classList.add('fade-out');
        setTimeout(() => {
            this.modal.remove();
        }, 500);
    }

    // Get player name
    getPlayerName() {
        return this.playerName || localStorage.getItem('playerName') || 'Anonymous';
    }

    // Change name (can be called from settings)
    changeName() {
        const newName = prompt('Enter new player name (3-20 characters):', this.playerName);
        
        if (newName && this.isValidName(newName.trim())) {
            this.playerName = newName.trim();
            // Update ALL name storage locations
            localStorage.setItem('playerName', this.playerName);
            localStorage.setItem('playerLeaderboardName', this.playerName);
            
            if (typeof gameState !== 'undefined') {
                gameState.playerName = this.playerName;
            }
            
            // Sync with global leaderboard
            if (typeof window.globalLeaderboard !== 'undefined' && window.globalLeaderboard) {
                window.globalLeaderboard.playerName = this.playerName;
            }
            
            if (typeof showNotification === 'function') {
                showNotification(`✅ Name changed to: ${this.playerName}`, 'success');
            }
            
            console.log('✅ Name changed to:', this.playerName);
        } else if (newName) {
            alert('Invalid name. Must be 3-20 characters with letters, numbers, spaces, or -_.symbols');
        }
    }
}

// Create global instance
window.namePicker = new NamePicker();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.namePicker.initialize();
    });
} else {
    window.namePicker.initialize();
}

// Add convenient console command
window.changeMyName = () => window.namePicker.changeName();
