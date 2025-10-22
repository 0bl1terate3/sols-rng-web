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
    }
];

function initializeLeaderboardUI() {
    console.log('✅ Leaderboard UI initialized');
}

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
    console.log('🔄 Loading category content...');
    await loadLeaderboardCategory(categoryId);
}

function closeLeaderboardModal() {
    const modal = document.getElementById('leaderboardModal');
    if (modal) modal.style.display = 'none';
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
                <button class="modal-close" onclick="closeLeaderboardModal()">✕</button>
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
                                <div class="grid-cell col-player">${escapeHtml(entry.playerName)}</div>
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
                                    <div class="grid-cell col-player">${escapeHtml(entry.playerName)}</div>
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

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(num) {
    return num ? num.toLocaleString() : '0';
}

function formatRarity(rarity) {
    if (!rarity) return 'N/A';
    if (rarity >= 1000000) return `1 in ${(rarity / 1000000).toFixed(1)}M`;
    return `1 in ${formatNumber(rarity)}`;
}

// Global Exports
window.openLeaderboardModal = openLeaderboardModal;
window.closeLeaderboardModal = closeLeaderboardModal;
window.loadLeaderboardCategory = loadLeaderboardCategory;
window.initializeLeaderboardUI = initializeLeaderboardUI;

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLeaderboardUI);
} else {
    initializeLeaderboardUI();
}

console.log('✅ Leaderboard UI loaded');
