// =================================================================
// Cosmetics Selector - Title & Badge Selection System
// =================================================================

function openCosmeticsSelector() {
    // Ensure gameState.cosmetics exists
    if (!gameState.cosmetics) {
        gameState.cosmetics = {
            titles: [],
            badges: [],
            activeTitle: null,
            activeBadge: null
        };
    }
    
    const modal = document.getElementById('cosmeticsModal');
    if (modal) {
        modal.style.display = 'flex';
        updateCosmeticsDisplay();
        return;
    }
    
    // Create modal
    const modalHTML = `
        <div id="cosmeticsModal" class="bp-modal">
            <div class="bp-modal-content" style="max-width: 600px;">
                <div class="bp-header">
                    <h2>👑 Cosmetics</h2>
                    <button class="bp-close" onclick="closeCosmeticsSelector()">✕</button>
                </div>
                
                <div class="bp-body" style="padding: 20px;">
                    <!-- Titles Section -->
                    <div class="cosmetics-section">
                        <h3>🎖️ Titles</h3>
                        <p class="cosmetics-hint">Select a title to display in chat and leaderboards</p>
                        <div id="titlesGrid" class="cosmetics-grid"></div>
                    </div>
                    
                    <!-- Badges Section -->
                    <div class="cosmetics-section">
                        <h3>🏅 Badges</h3>
                        <p class="cosmetics-hint">Select a badge to display next to your name</p>
                        <div id="badgesGrid" class="cosmetics-grid"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('cosmeticsModal').style.display = 'flex';
    updateCosmeticsDisplay();
}

function closeCosmeticsSelector() {
    const modal = document.getElementById('cosmeticsModal');
    if (modal) modal.style.display = 'none';
}

function updateCosmeticsDisplay() {
    const titles = gameState.cosmetics?.titles || [];
    const badges = gameState.cosmetics?.badges || [];
    const activeTitle = gameState.cosmetics?.activeTitle;
    const activeBadge = gameState.cosmetics?.activeBadge;
    
    // Update titles grid
    const titlesGrid = document.getElementById('titlesGrid');
    if (titlesGrid) {
        if (titles.length === 0) {
            titlesGrid.innerHTML = '<div class="cosmetics-empty">No titles unlocked yet. Level up your Battle Pass!</div>';
        } else {
            // Add "None" option
            let html = `
                <div class="cosmetic-item ${!activeTitle ? 'active' : ''}" onclick="selectTitle(null)">
                    <div class="cosmetic-name">None</div>
                    ${!activeTitle ? '<div class="cosmetic-checkmark">✓</div>' : ''}
                </div>
            `;
            
            titles.forEach(title => {
                const isActive = activeTitle === title;
                html += `
                    <div class="cosmetic-item ${isActive ? 'active' : ''}" onclick="selectTitle('${escapeForJS(title)}')">
                        <div class="cosmetic-name">[${escapeHTML(title)}]</div>
                        ${isActive ? '<div class="cosmetic-checkmark">✓</div>' : ''}
                    </div>
                `;
            });
            titlesGrid.innerHTML = html;
        }
    }
    
    // Update badges grid
    const badgesGrid = document.getElementById('badgesGrid');
    if (badgesGrid) {
        if (badges.length === 0) {
            badgesGrid.innerHTML = '<div class="cosmetics-empty">No badges unlocked yet. Level up your Battle Pass!</div>';
        } else {
            // Add "None" option
            let html = `
                <div class="cosmetic-item ${!activeBadge ? 'active' : ''}" onclick="selectBadge(null)">
                    <div class="cosmetic-name">None</div>
                    ${!activeBadge ? '<div class="cosmetic-checkmark">✓</div>' : ''}
                </div>
            `;
            
            badges.forEach(badge => {
                const isActive = activeBadge === badge;
                const icon = getBadgeIconForSelector(badge);
                html += `
                    <div class="cosmetic-item ${isActive ? 'active' : ''}" onclick="selectBadge('${escapeForJS(badge)}')">
                        <div class="cosmetic-icon">${icon}</div>
                        <div class="cosmetic-name">${getBadgeName(badge)}</div>
                        ${isActive ? '<div class="cosmetic-checkmark">✓</div>' : ''}
                    </div>
                `;
            });
            badgesGrid.innerHTML = html;
        }
    }
}

function selectTitle(title) {
    if (!gameState.cosmetics) gameState.cosmetics = {};
    gameState.cosmetics.activeTitle = title;
    
    if (typeof saveGameState === 'function') {
        saveGameState();
    }
    
    updateCosmeticsDisplay();
    
    if (typeof showNotification === 'function') {
        if (title) {
            showNotification(`Title equipped: [${title}]`, 'success');
        } else {
            showNotification('Title removed', 'info');
        }
    }
}

function selectBadge(badge) {
    if (!gameState.cosmetics) gameState.cosmetics = {};
    gameState.cosmetics.activeBadge = badge;
    
    if (typeof saveGameState === 'function') {
        saveGameState();
    }
    
    updateCosmeticsDisplay();
    
    if (typeof showNotification === 'function') {
        if (badge) {
            const icon = getBadgeIconForSelector(badge);
            showNotification(`Badge equipped: ${icon} ${getBadgeName(badge)}`, 'success');
        } else {
            showNotification('Badge removed', 'info');
        }
    }
}

function getBadgeIconForSelector(badgeValue) {
    const badgeIcons = {
        'season1_bronze': '🥉',
        'season1_silver': '🥈',
        'season1_gold': '🥇',
        'season1_platinum': '💿',
        'season1_diamond': '💎',
        'season1_master': '👑',
        'season1_complete': '🏆',
        'season1_ultimate': '👑'
    };
    return badgeIcons[badgeValue] || '⭐';
}

function getBadgeName(badgeValue) {
    const badgeNames = {
        'season1_bronze': 'Bronze Badge',
        'season1_silver': 'Silver Badge',
        'season1_gold': 'Gold Badge',
        'season1_platinum': 'Platinum Badge',
        'season1_diamond': 'Diamond Badge',
        'season1_master': 'Master Badge',
        'season1_complete': 'Season Complete',
        'season1_ultimate': 'Ultimate Badge'
    };
    return badgeNames[badgeValue] || badgeValue;
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function escapeForJS(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// Initialize on load
if (typeof window !== 'undefined') {
    console.log('✅ Cosmetics Selector loaded');
}
