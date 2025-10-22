// =================================================================
// Local Backend Leaderboard UI System (REST API)
// =================================================================

// Simplified leaderboard categories for local backend
const LEADERBOARD_CATEGORIES = [
    {
        id: 'globals',
        name: '🏆 Global Auras',
        icon: '🏆',
        description: 'Rarest auras collected by players'
    },
    {
        id: 'collected',
        name: '📈 Collection Score',
        icon: '📈',
        description: 'Total rarity of all unique auras owned'
    }
];

// Initialize leaderboard UI
function initializeLeaderboardUI() {
    console.log('📊 Leaderboard UI initialized with local backend');
}

// Open leaderboard modal
async function openLeaderboardModal(categoryId = 'globals') {
    console.log('🎯 Opening leaderboard modal, category:', categoryId);
    let modal = document.getElementById('leaderboardModal');
    if (!modal) {
        console.log('📦 Creating new modal...');
        modal = createLeaderboardModal();
    }
    
    modal.style.display = 'flex';
    console.log('📂 Loading category:', categoryId);
    await loadLeaderboardCategory(categoryId);
}

// Close leaderboard modal
function closeLeaderboardModal() {
    const modal = document.getElementById('leaderboardModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Create leaderboard modal HTML
function createLeaderboardModal() {
    const modal = document.createElement('div');
    modal.id = 'leaderboardModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h2>📊 Leaderboards</h2>
                <button class="modal-close" onclick="closeLeaderboardModal()">✕</button>
            </div>
            <div class="modal-body">
                <div class="leaderboard-categories" id="leaderboardCategories"></div>
                <div class="leaderboard-content" id="leaderboardContent"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLeaderboardModal();
        }
    });
    
    return modal;
}

// Load leaderboard category
async function loadLeaderboardCategory(categoryId) {
    const categoriesDiv = document.getElementById('leaderboardCategories');
    const contentDiv = document.getElementById('leaderboardContent');
    
    if (!categoriesDiv || !contentDiv) return;
    
    // Render category buttons
    categoriesDiv.innerHTML = LEADERBOARD_CATEGORIES.map(cat => `
        <button class="leaderboard-category-btn ${cat.id === categoryId ? 'active' : ''}" 
                onclick="loadLeaderboardCategory('${cat.id}')">
            ${cat.icon} ${cat.name}
        </button>
    `).join('');
    
    // Load category data
    contentDiv.innerHTML = '<div class="loading">Loading...</div>';
    
    try {
        if (categoryId === 'globals') {
            await loadGlobalsLeaderboard(contentDiv);
        } else if (categoryId === 'collected') {
            await loadCollectedStatsLeaderboard(contentDiv);
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        contentDiv.innerHTML = `
            <div class="error">
                <p>❌ Failed to load leaderboard</p>
                <p>Make sure the backend server is running</p>
            </div>
        `;
    }
}

// Load globals leaderboard
async function loadGlobalsLeaderboard(container) {
    console.log('🔍 Loading globals leaderboard...');
    if (!window.globalLeaderboard) {
        console.error('❌ globalLeaderboard not available');
        container.innerHTML = '<div class="error">❌ Leaderboard system not available</div>';
        return;
    }
    
    console.log('📡 Fetching top globals from backend...');
    const entries = await window.globalLeaderboard.getTopGlobals(50);
    console.log('📊 Received entries:', entries.length, entries);
    
    if (!entries || entries.length === 0) {
        container.innerHTML = '<div class="empty">No global auras submitted yet. Be the first!</div>';
        return;
    }
    
    let html = `
        <div class="leaderboard-header">
            <h3>🏆 Hall of Fame - Rarest Global Auras</h3>
            <p>Top ${entries.length} global aura submissions</p>
        </div>
        <div class="leaderboard-table">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Aura</th>
                        <th>Rarity</th>
                        <th>Rolls</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    entries.forEach((entry, index) => {
        const rank = index + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
        const date = entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : 'N/A';
        
        html += `
            <tr class="${rank <= 3 ? 'top-three' : ''}">
                <td class="rank">${medal}</td>
                <td class="player">${escapeHtml(entry.playerName)}</td>
                <td class="aura">${escapeHtml(entry.auraName)}</td>
                <td class="rarity">${formatRarity(entry.auraRarity)}</td>
                <td class="rolls">${formatNumber(entry.rollCount)}</td>
                <td class="date">${date}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

// Load collected stats leaderboard
async function loadCollectedStatsLeaderboard(container) {
    console.log('🔍 Loading collected stats leaderboard...');
    if (!window.globalLeaderboard) {
        console.error('❌ globalLeaderboard not available');
        container.innerHTML = '<div class="error">❌ Leaderboard system not available</div>';
        return;
    }
    
    try {
        console.log('📡 Fetching collected stats from:', `${window.globalLeaderboard.backendUrl}/leaderboard/collectedStats`);
        const response = await fetch(`${window.globalLeaderboard.backendUrl}/leaderboard/collectedStats?limit=50`, {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        console.log('📊 Received data:', data);
        const entries = data.entries || [];
        console.log('📊 Total entries:', entries.length);
        
        if (entries.length === 0) {
            container.innerHTML = '<div class="empty">No collection stats submitted yet</div>';
            return;
        }
        
        let html = `
            <div class="leaderboard-header">
                <h3>📈 Collection Score Rankings</h3>
                <p>Sum of all unique aura rarities owned</p>
            </div>
            <div class="leaderboard-table">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Total Score</th>
                            <th>Unique Auras</th>
                            <th>Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        entries.forEach((entry, index) => {
            const rank = index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
            const date = entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : 'N/A';
            
            html += `
                <tr class="${rank <= 3 ? 'top-three' : ''}">
                    <td class="rank">${medal}</td>
                    <td class="player">${escapeHtml(entry.playerName)}</td>
                    <td class="score">${formatNumber(entry.totalScore)}</td>
                    <td class="auras">${entry.uniqueAuras}</td>
                    <td class="date">${date}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading collected stats:', error);
        container.innerHTML = '<div class="error">❌ Failed to load stats</div>';
    }
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(num) {
    if (!num) return '0';
    return num.toLocaleString();
}

function formatRarity(rarity) {
    if (!rarity) return 'N/A';
    if (rarity >= 1000000) {
        return `1 in ${(rarity / 1000000).toFixed(1)}M`;
    }
    return `1 in ${formatNumber(rarity)}`;
}

// Make functions globally accessible
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

console.log('✅ Local leaderboard UI loaded');
