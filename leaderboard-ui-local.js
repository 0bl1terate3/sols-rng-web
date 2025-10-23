// =================================================================
// Local Backend Leaderboard UI System - Grid-Based
// =================================================================

const LEADERBOARD_CATEGORIES = [
    {
        id: 'globals',
        name: '🏆 Global Auras',
        icon: '🏆',
        description: 'Rarest auras collected by players'
    },
    {
        id: 'collected',
        name: '📊 Collection Score',
        icon: '📊',
        description: 'Total rarity of all unique auras owned'
    },
    {
        id: 'totalRolls',
        name: '🎲 Total Rolls',
        icon: '🎲',
        description: 'Most rolls of all time'
    },
    {
        id: 'fastestGlobal',
        name: '⚡ Fastest Global',
        icon: '⚡',
        description: 'Fewest rolls to get a global aura'
    },
    {
        id: 'breakthroughs',
        name: '🔥 Breakthrough King',
        icon: '🔥',
        description: 'Most breakthrough auras'
    },
    {
        id: 'richest',
        name: '💰 Richest Players',
        icon: '💰',
        description: 'Most money earned'
    }
];

function initializeLeaderboardUI() {
    console.log('✅ Leaderboard UI initialized');
}

// Auto-refresh interval ID
let leaderboardRefreshInterval = null;
let currentOpenCategory = null;

async function openLeaderboardModal(categoryId = 'globals') {
    console.log('🎯 Opening leaderboard modal, category:', categoryId);
    let modal = document.getElementById('leaderboardModal');
    
    // Check if modal structure is valid
    const cats = document.getElementById('leaderboardCategories');
    const content = document.getElementById('leaderboardContent');
    
    if (!modal || !cats || !content) {
        console.log('🔄 Modal missing or incomplete, recreating...');
        // Remove old modal if it exists
        if (modal) {
            modal.remove();
            console.log('🗑️ Removed old modal');
        }
        modal = createLeaderboardModal();
        console.log('✅ New modal created');
    } else {
        console.log('✅ Modal structure valid');
    }
    
    modal.style.display = 'flex';
    currentOpenCategory = categoryId;
    console.log('🔄 Loading category content...');
    await loadLeaderboardCategory(categoryId);
    
    // Start periodic refresh (every 10 seconds)
    if (leaderboardRefreshInterval) {
        clearInterval(leaderboardRefreshInterval);
    }
    leaderboardRefreshInterval = setInterval(() => {
        if (currentOpenCategory) {
            console.log('🔄 Periodic refresh...');
            loadLeaderboardCategory(currentOpenCategory);
        }
    }, 10000); // 10 seconds
}

function closeLeaderboardModal() {
    const modal = document.getElementById('leaderboardModal');
    if (modal) modal.style.display = 'none';
    
    // Stop auto-refresh
    if (leaderboardRefreshInterval) {
        clearInterval(leaderboardRefreshInterval);
        leaderboardRefreshInterval = null;
    }
    currentOpenCategory = null;
}

function createLeaderboardModal() {
    console.log('🔨 Creating modal structure');
    const modal = document.createElement('div');
    modal.id = 'leaderboardModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content modal-large leaderboard-modal">
            <div class="modal-header">
                <h2>📊 Leaderboards</h2>
                <div class="modal-header-actions">
                    <button class="refresh-leaderboard-btn" onclick="refreshCurrentLeaderboard()" title="Refresh leaderboard data">
                        🔄 Refresh
                    </button>
                    <button class="modal-close" onclick="closeLeaderboardModal()">✕</button>
                </div>
            </div>
            <div class="modal-body">
                <div class="leaderboard-categories" id="leaderboardCategories"></div>
                <div id="leaderboardContent"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    console.log('✅ Modal appended to body');
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeLeaderboardModal();
    });
    
    return modal;
}

async function loadLeaderboardCategory(categoryId) {
    console.log('📋 Loading category:', categoryId);
    currentOpenCategory = categoryId; // Track current category for auto-refresh
    const categoriesDiv = document.getElementById('leaderboardCategories');
    const contentDiv = document.getElementById('leaderboardContent');
    
    if (!categoriesDiv || !contentDiv) {
        console.error('❌ Required elements not found!');
        return;
    }
    
    // Render category buttons
    categoriesDiv.innerHTML = LEADERBOARD_CATEGORIES.map(cat => `
        <button class="leaderboard-category-btn ${cat.id === categoryId ? 'active' : ''}" 
                onclick="loadLeaderboardCategory('${cat.id}')">
            ${cat.icon} ${cat.name}
        </button>
    `).join('');
    
    // Load category data
    contentDiv.innerHTML = '<div class="loading">⏳ Loading...</div>';
    
    try {
        if (categoryId === 'globals') {
            await loadGlobalsLeaderboard(contentDiv);
        } else if (categoryId === 'collected') {
            await loadCollectedStatsLeaderboard(contentDiv);
        } else if (categoryId === 'totalRolls') {
            await loadGenericLeaderboard(contentDiv, 'totalRolls', '🎲 Most Rolls All-Time', 'rollCount');
        } else if (categoryId === 'fastestGlobal') {
            await loadGenericLeaderboard(contentDiv, 'fastestGlobal', '⚡ Fastest Global Aura', 'rollCount', true);
        } else if (categoryId === 'breakthroughs') {
            await loadGenericLeaderboard(contentDiv, 'breakthroughs', '🔥 Most Breakthroughs', 'breakthroughCount');
        } else if (categoryId === 'richest') {
            await loadGenericLeaderboard(contentDiv, 'richest', '💰 Richest Players', 'money');
        }
        console.log('✅ Category loaded successfully');
    } catch (error) {
        console.error('❌ Error loading leaderboard:', error);
        contentDiv.innerHTML = '<div class="error">❌ Failed to load leaderboard<br>Check console for details</div>';
    }
}

async function loadGlobalsLeaderboard(container) {
    console.log('🏆 Loading globals leaderboard');
    
    if (!window.globalLeaderboard) {
        console.error('❌ window.globalLeaderboard not available');
        container.innerHTML = '<div class="error">❌ Leaderboard system unavailable</div>';
        return;
    }
    
    console.log('📡 Fetching top globals...');
    const entries = await window.globalLeaderboard.getTopGlobals(50);
    console.log('📊 Received entries:', entries ? entries.length : 0);
    
    if (!entries || entries.length === 0) {
        container.innerHTML = '<div class="empty">No global auras yet. Be the first!</div>';
        return;
    }
    
    container.innerHTML = `
        <div class="leaderboard-section">
            <div class="leaderboard-header">
                <h3>🏆 Hall of Fame - Rarest Global Auras</h3>
                <p>Top ${entries.length} submissions</p>
            </div>
            <div class="leaderboard-table-wrapper">
                <div class="leaderboard-grid">
                    <div class="leaderboard-grid-header">
                        <div class="grid-header-cell col-rank">Rank</div>
                        <div class="grid-header-cell col-player">Player</div>
                        <div class="grid-header-cell col-aura">Aura</div>
                        <div class="grid-header-cell col-rarity">Rarity</div>
                        <div class="grid-header-cell col-rolls">Rolls</div>
                        <div class="grid-header-cell col-date">Date</div>
                    </div>
                    ${entries.map((entry, index) => {
                        const rank = index + 1;
                        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
                        const date = entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : 'N/A';
                        
                        return `
                            <div class="leaderboard-grid-row rank-${rank}">
                                <div class="grid-cell col-rank">${medal}</div>
                                <div class="grid-cell col-player">${formatPlayerName(entry.playerName)}</div>
                                <div class="grid-cell col-aura">${escapeHtml(entry.auraName)}</div>
                                <div class="grid-cell col-rarity">${formatRarity(entry.auraRarity)}</div>
                                <div class="grid-cell col-rolls">${formatNumber(entry.rollCount)}</div>
                                <div class="grid-cell col-date">${date}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    
    console.log('✅ Globals leaderboard rendered');
}

async function loadCollectedStatsLeaderboard(container) {
    console.log('📊 Loading collection stats leaderboard');
    
    if (!window.globalLeaderboard) {
        console.error('❌ window.globalLeaderboard not available');
        container.innerHTML = '<div class="error">❌ Leaderboard system unavailable</div>';
        return;
    }
    
    try {
        console.log('📡 Fetching from:', `${window.globalLeaderboard.backendUrl}/leaderboard/collectedStats`);
        const response = await fetch(`${window.globalLeaderboard.backendUrl}/leaderboard/collectedStats?limit=50`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        
        if (!response.ok) {
            console.error('❌ Response not OK:', response.status);
            throw new Error('Failed to fetch');
        }
        
        const data = await response.json();
        console.log('📊 Received data:', data);
        const entries = data.entries || [];
        console.log('📊 Entries count:', entries.length);
        
        if (entries.length === 0) {
            container.innerHTML = '<div class="empty">No collection stats yet</div>';
            return;
        }
        
        container.innerHTML = `
            <div class="leaderboard-section">
                <div class="leaderboard-header">
                    <h3>📊 Collection Score Rankings</h3>
                    <p>Sum of all unique aura rarities owned</p>
                </div>
                <div class="leaderboard-table-wrapper">
                    <div class="leaderboard-grid" style="grid-template-columns: 100px 180px 1fr 150px 150px;">
                        <div class="leaderboard-grid-header">
                            <div class="grid-header-cell col-rank">Rank</div>
                            <div class="grid-header-cell col-player">Player</div>
                            <div class="grid-header-cell col-score">Total Score</div>
                            <div class="grid-header-cell col-auras">Unique Auras</div>
                            <div class="grid-header-cell col-date">Last Updated</div>
                        </div>
                        ${entries.map((entry, index) => {
                            const rank = index + 1;
                            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
                            const date = entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : 'N/A';
                            
                            return `
                                <div class="leaderboard-grid-row rank-${rank}">
                                    <div class="grid-cell col-rank">${medal}</div>
                                    <div class="grid-cell col-player">${formatPlayerName(entry.playerName)}</div>
                                    <div class="grid-cell col-score">${formatNumber(entry.score || entry.totalScore || 0)}</div>
                                    <div class="grid-cell col-auras">${entry.uniqueAuras || 'N/A'}</div>
                                    <div class="grid-cell col-date">${date}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
        
        console.log('✅ Collection stats leaderboard rendered');
        
    } catch (error) {
        console.error('❌ Error loading collection stats:', error);
        container.innerHTML = '<div class="error">❌ Failed to load stats<br>Make sure backend is running</div>';
    }
}

// Generic leaderboard loader for new categories
async function loadGenericLeaderboard(container, categoryId, title, scoreField, isLowerBetter = false) {
    console.log(`📊 Loading ${categoryId} leaderboard`);
    
    if (!window.globalLeaderboard) {
        container.innerHTML = '<div class="error">❌ Leaderboard system unavailable</div>';
        return;
    }
    
    try {
        const url = `${window.globalLeaderboard.backendUrl}/leaderboard/${categoryId}?limit=50`;
        console.log(`📡 Fetching from: ${url}`);
        
        const response = await fetch(url, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        
        if (!response.ok) {
            console.warn(`⚠️ No data for ${categoryId}, status: ${response.status}`);
            container.innerHTML = `<div class="empty">No entries yet. Be the first!</div>`;
            return;
        }
        
        const data = await response.json();
        console.log(`📊 Received data for ${categoryId}:`, data);
        const entries = data.entries || [];
        
        if (entries.length === 0) {
            container.innerHTML = `<div class="empty">No entries yet. Be the first!</div>`;
            return;
        }
        
        container.innerHTML = `
            <div class="leaderboard-section">
                <h3>${title}</h3>
                <p class="leaderboard-desc">Top 50 submissions</p>
                <div class="leaderboard-content">
                    <div class="leaderboard-grid">
                        <div class="leaderboard-grid-header">
                            <div class="grid-header-cell col-rank">Rank</div>
                            <div class="grid-header-cell col-player">Player</div>
                            <div class="grid-header-cell col-score">${getScoreLabel(scoreField, isLowerBetter)}</div>
                            <div class="grid-header-cell col-date">Date</div>
                        </div>
                        ${entries.map((entry, index) => {
                            const rank = index + 1;
                            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
                            const scoreValue = entry[scoreField] || entry.score || 0;
                            const date = entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : 'N/A';
                            
                            return `
                                <div class="leaderboard-grid-row rank-${rank}">
                                    <div class="grid-cell col-rank">${medal}</div>
                                    <div class="grid-cell col-player">${formatPlayerName(entry.playerName)}</div>
                                    <div class="grid-cell col-score">${formatScoreValue(scoreValue, scoreField)}</div>
                                    <div class="grid-cell col-date">${date}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
        
        console.log(`✅ ${categoryId} leaderboard rendered`);
        
    } catch (error) {
        console.error(`❌ Error loading ${categoryId}:`, error);
        container.innerHTML = '<div class="error">❌ Failed to load leaderboard</div>';
    }
}

// Helper functions for generic leaderboard
function getScoreLabel(scoreField, isLowerBetter) {
    const labels = {
        'rollCount': isLowerBetter ? 'Fewest Rolls' : 'Total Rolls',
        'breakthroughCount': 'Breakthroughs',
        'money': 'Money'
    };
    return labels[scoreField] || 'Score';
}

function formatScoreValue(value, scoreField) {
    if (scoreField === 'money') {
        return `$${formatNumber(value)}`;
    } else if (scoreField === 'rollCount' || scoreField === 'breakthroughCount') {
        return formatNumber(value);
    }
    return formatNumber(value);
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format player name with title and badge (for current player only)
function formatPlayerName(playerName) {
    const currentPlayer = localStorage.getItem('playerName') || (typeof gameState !== 'undefined' ? gameState.playerName : null);
    
    // Only show title/badge for current player
    if (playerName === currentPlayer && typeof gameState !== 'undefined' && gameState.cosmetics) {
        const activeTitle = gameState.cosmetics.activeTitle;
        const activeBadge = gameState.cosmetics.activeBadge;
        
        let display = '';
        
        if (activeBadge) {
            const badgeIcon = getBadgeIcon(activeBadge);
            display += `<span class="lb-badge">${badgeIcon}</span> `;
        }
        
        if (activeTitle) {
            display += `<span class="lb-title">[${escapeHtml(activeTitle)}]</span> `;
        }
        
        display += `<span class="lb-name">${escapeHtml(playerName)}</span>`;
        return display;
    }
    
    return `<span class="lb-name">${escapeHtml(playerName)}</span>`;
}

// Get badge icon
function getBadgeIcon(badgeValue) {
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

function formatNumber(num) {
    return num ? num.toLocaleString() : '0';
}

function formatRarity(rarity) {
    if (!rarity) return 'N/A';
    if (rarity >= 1000000) return `1 in ${(rarity / 1000000).toFixed(1)}M`;
    return `1 in ${formatNumber(rarity)}`;
}

// Auto-refresh leaderboard if modal is open
function refreshLeaderboardIfOpen(categoryId) {
    const modal = document.getElementById('leaderboardModal');
    
    // Only refresh if modal is visible
    if (modal && modal.style.display === 'flex') {
        console.log(`🔄 Auto-refreshing leaderboard: ${categoryId}`);
        loadLeaderboardCategory(categoryId);
    }
}

// Global Exports
// Manual refresh function
async function refreshCurrentLeaderboard() {
    if (currentOpenCategory) {
        console.log('🔄 Manually refreshing leaderboard:', currentOpenCategory);
        const btn = document.querySelector('.refresh-leaderboard-btn');
        if (btn) {
            btn.textContent = '⏳ Submitting...';
            btn.disabled = true;
        }
        
        // Force submit current stats first
        if (window.leaderboardAutoSubmit && typeof window.leaderboardAutoSubmit.submitAllStats === 'function') {
            console.log('📤 Force submitting current stats...');
            await window.leaderboardAutoSubmit.submitAllStats();
        }
        
        // Wait a moment for backend to process
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Then reload the leaderboard UI
        await loadLeaderboardCategory(currentOpenCategory);
        
        if (btn) {
            btn.textContent = '🔄 Refresh';
            btn.disabled = false;
        }
        console.log('✅ Leaderboard refreshed with latest stats');
    }
}

window.openLeaderboardModal = openLeaderboardModal;
window.closeLeaderboardModal = closeLeaderboardModal;
window.loadLeaderboardCategory = loadLeaderboardCategory;
window.initializeLeaderboardUI = initializeLeaderboardUI;
window.refreshLeaderboardIfOpen = refreshLeaderboardIfOpen;
window.refreshCurrentLeaderboard = refreshCurrentLeaderboard;

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLeaderboardUI);
} else {
    initializeLeaderboardUI();
}

console.log('✅ Leaderboard UI loaded');
