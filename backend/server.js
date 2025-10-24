const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8090;
const DATA_FILE = path.join(__dirname, 'leaderboards.json');

// Middleware
app.use(cors()); // Allow all origins (GitHub Pages, localhost, etc.)
app.use(express.json());

// Bypass ngrok browser warning
app.use((req, res, next) => {
    res.setHeader('ngrok-skip-browser-warning', 'true');
    next();
});

// Initialize data file if it doesn't exist
function initializeDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}), 'utf8');
    console.log('Created leaderboards.json');
  }
}

// Read leaderboards from file
function readLeaderboards() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading leaderboards:', error);
    return {};
  }
}

// Write leaderboards to file
function writeLeaderboards(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing leaderboards:', error);
    return false;
  }
}

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Sol\'s RNG Game Backend Server',
    endpoints: {
      'GET /leaderboards': 'Get all leaderboards',
      'GET /leaderboard/:name': 'Get specific leaderboard',
      'POST /leaderboard/:name': 'Add entry to leaderboard',
      'DELETE /leaderboard/:name': 'Clear specific leaderboard'
    }
  });
});

// Get all leaderboards
app.get('/leaderboards', (req, res) => {
  const leaderboards = readLeaderboards();
  res.json(leaderboards);
});

// Get specific leaderboard
app.get('/leaderboard/:name', (req, res) => {
  const { name } = req.params;
  const limit = parseInt(req.query.limit) || 100; // Default to top 100
  
  const leaderboards = readLeaderboards();
  const leaderboard = leaderboards[name] || [];
  
  // Sort by auraRarity (if available) or score, descending
  const sorted = leaderboard
    .sort((a, b) => {
      const aValue = a.auraRarity !== undefined ? a.auraRarity : (a.score || 0);
      const bValue = b.auraRarity !== undefined ? b.auraRarity : (b.score || 0);
      return bValue - aValue;
    })
    .slice(0, limit);
  
  res.json({
    name,
    entries: sorted,
    total: leaderboard.length
  });
});

// Post new entry to leaderboard (supports both simple and Firebase schema)
app.post('/leaderboard/:name', (req, res) => {
  const { name } = req.params;
  const { 
    playerId, 
    playerName, 
    auraName, 
    auraRarity, 
    auraTier, 
    rollCount,
    score,
    uniqueAuras,
    timestamp,
    submittedAt
  } = req.body;
  
  // Validate input - support both simple (score) and full (aura) format
  if (!playerName) {
    return res.status(400).json({ 
      error: 'Missing required field: playerName' 
    });
  }
  
  if (!auraName && (score === undefined || score === null)) {
    return res.status(400).json({ 
      error: 'Missing required field: auraName or score' 
    });
  }
  
  const leaderboards = readLeaderboards();
  
  // Initialize leaderboard if it doesn't exist
  if (!leaderboards[name]) {
    leaderboards[name] = [];
  }
  
  // Check for existing entry by playerName and update it instead of creating duplicate
  const existingIndex = leaderboards[name].findIndex(
    entry => entry.playerName === String(playerName).trim()
  );
  
  // Create entry data (supports both formats)
  const entry = {
    playerId: playerId || (existingIndex >= 0 ? leaderboards[name][existingIndex].playerId : 'local_' + Date.now()),
    playerName: String(playerName).trim(),
    timestamp: timestamp || (existingIndex >= 0 ? leaderboards[name][existingIndex].timestamp : new Date().toISOString()),
    submittedAt: Date.now()
  };
  
  // Add aura-specific fields if provided
  if (auraName) {
    entry.auraName = auraName;
    entry.auraRarity = auraRarity || 0;
    entry.auraTier = auraTier || 'common';
    entry.rollCount = rollCount || 0;
  } else {
    // Simple score format (collected stats)
    entry.score = Number(score);
    if (uniqueAuras !== undefined && uniqueAuras !== null) {
      entry.uniqueAuras = Number(uniqueAuras);
    }
    // Copy over other fields from request body
    if (req.body.rollCount !== undefined) entry.rollCount = req.body.rollCount;
    if (req.body.breakthroughCount !== undefined) entry.breakthroughCount = req.body.breakthroughCount;
    if (req.body.money !== undefined) entry.money = req.body.money;
  }
  
  // Update existing entry or add new one
  if (existingIndex >= 0) {
    leaderboards[name][existingIndex] = entry;
    console.log(`Updated entry for ${playerName} in ${name}`);
  } else {
    leaderboards[name].push(entry);
    console.log(`Added new entry for ${playerName} in ${name}`);
  }
  
  // Save to file
  if (writeLeaderboards(leaderboards)) {
    res.status(201).json({ 
      success: true, 
      message: 'Entry added successfully',
      entry 
    });
  } else {
    res.status(500).json({ 
      error: 'Failed to save leaderboard' 
    });
  }
});

// Delete/clear specific leaderboard
app.delete('/leaderboard/:name', (req, res) => {
  const { name } = req.params;
  
  const leaderboards = readLeaderboards();
  
  if (!leaderboards[name]) {
    return res.status(404).json({ 
      error: 'Leaderboard not found' 
    });
  }
  
  delete leaderboards[name];
  
  if (writeLeaderboards(leaderboards)) {
    res.json({ 
      success: true, 
      message: `Leaderboard '${name}' cleared successfully` 
    });
  } else {
    res.status(500).json({ 
      error: 'Failed to clear leaderboard' 
    });
  }
});

// =================================================================
// CHAT ENDPOINTS
// =================================================================

let chatMessages = [];
let chatMessageIdCounter = 1;

// Get recent chat messages
app.get('/chat/messages', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const recentMessages = chatMessages.slice(-limit);
  
  res.json({
    messages: recentMessages,
    total: chatMessages.length
  });
});

// Post a new chat message
app.post('/chat/message', (req, res) => {
  const { username, message } = req.body;
  
  if (!username || !message) {
    return res.status(400).json({ error: 'Username and message required' });
  }
  
  const newMessage = {
    id: chatMessageIdCounter++,
    username,
    message: message.substring(0, 200), // Limit message length
    timestamp: Date.now()
  };
  
  chatMessages.push(newMessage);
  
  // Keep only last 100 messages in memory
  if (chatMessages.length > 100) {
    chatMessages = chatMessages.slice(-100);
  }
  
  res.json({ success: true, message: newMessage });
});

// Clear chat (admin only - optional)
app.delete('/chat/clear', (req, res) => {
  chatMessages = [];
  chatMessageIdCounter = 1;
  res.json({ success: true, message: 'Chat cleared' });
});

// =================================================================
// ADMIN ENDPOINTS
// =================================================================

// Admin password - Change this to your own secure password
const ADMIN_PASSWORD = 'admin123';

// Player data storage
const PLAYER_DATA_FILE = path.join(__dirname, 'players.json');
const BANS_FILE = path.join(__dirname, 'bans.json');

// Initialize player data files
function initializePlayerDataFiles() {
  if (!fs.existsSync(PLAYER_DATA_FILE)) {
    fs.writeFileSync(PLAYER_DATA_FILE, JSON.stringify({}), 'utf8');
    console.log('Created players.json');
  }
  if (!fs.existsSync(BANS_FILE)) {
    fs.writeFileSync(BANS_FILE, JSON.stringify([]), 'utf8');
    console.log('Created bans.json');
  }
}

// Read/write player data
function readPlayerData() {
  try {
    const data = fs.readFileSync(PLAYER_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading player data:', error);
    return {};
  }
}

function writePlayerData(data) {
  try {
    fs.writeFileSync(PLAYER_DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing player data:', error);
    return false;
  }
}

// Read/write bans
function readBans() {
  try {
    const data = fs.readFileSync(BANS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading bans:', error);
    return [];
  }
}

function writeBans(data) {
  try {
    fs.writeFileSync(BANS_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing bans:', error);
    return false;
  }
}

// Admin authentication
app.post('/admin/auth', (req, res) => {
  const { password } = req.body;
  
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, message: 'Authenticated' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

// Get all leaderboards summary
app.get('/admin/stats', (req, res) => {
  const leaderboards = readLeaderboards();
  
  const stats = {
    totalLeaderboards: Object.keys(leaderboards).length,
    leaderboards: {}
  };
  
  for (const [name, entries] of Object.entries(leaderboards)) {
    stats.leaderboards[name] = {
      entries: entries.length,
      lastUpdate: entries.length > 0 ? Math.max(...entries.map(e => e.submittedAt || 0)) : 0
    };
  }
  
  res.json(stats);
});

// Clear all leaderboards
app.delete('/admin/leaderboards/clear', (req, res) => {
  try {
    writeLeaderboards({});
    res.json({ success: true, message: 'All leaderboards cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear leaderboards' });
  }
});

// Clear specific leaderboard (already exists, but adding to admin section for clarity)
// app.delete('/leaderboard/:name') - already defined above

// Get recent players from leaderboards
app.get('/admin/players', (req, res) => {
  const leaderboards = readLeaderboards();
  const playersMap = new Map();
  
  // Collect unique players from all leaderboards
  for (const entries of Object.values(leaderboards)) {
    for (const entry of entries) {
      if (entry.playerName && entry.playerId) {
        if (!playersMap.has(entry.playerId)) {
          playersMap.set(entry.playerId, {
            playerId: entry.playerId,
            playerName: entry.playerName,
            lastSeen: entry.submittedAt || entry.timestamp || 0,
            totalSubmissions: 1
          });
        } else {
          const player = playersMap.get(entry.playerId);
          player.totalSubmissions++;
          if ((entry.submittedAt || entry.timestamp || 0) > player.lastSeen) {
            player.lastSeen = entry.submittedAt || entry.timestamp || 0;
          }
        }
      }
    }
  }
  
  // Convert to array and sort by last seen
  const players = Array.from(playersMap.values())
    .sort((a, b) => b.lastSeen - a.lastSeen);
  
  res.json({ players, total: players.length });
});

// Get player data by ID
app.get('/admin/player/:playerId', (req, res) => {
  const { playerId } = req.params;
  const playerData = readPlayerData();
  
  if (playerData[playerId]) {
    res.json({ success: true, data: playerData[playerId] });
  } else {
    res.status(404).json({ success: false, message: 'Player not found' });
  }
});

// Save/update player data
app.post('/admin/player/:playerId', (req, res) => {
  const { playerId } = req.params;
  const playerData = readPlayerData();
  
  playerData[playerId] = {
    ...req.body,
    lastModified: Date.now(),
    playerId
  };
  
  if (writePlayerData(playerData)) {
    res.json({ success: true, message: 'Player data saved' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save player data' });
  }
});

// Delete player data
app.delete('/admin/player/:playerId', (req, res) => {
  const { playerId } = req.params;
  const playerData = readPlayerData();
  
  if (playerData[playerId]) {
    delete playerData[playerId];
    if (writePlayerData(playerData)) {
      res.json({ success: true, message: 'Player data deleted' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete player data' });
    }
  } else {
    res.status(404).json({ success: false, message: 'Player not found' });
  }
});

// Get all player data
app.get('/admin/allplayers', (req, res) => {
  const playerData = readPlayerData();
  res.json({ players: playerData, total: Object.keys(playerData).length });
});

// Reset all player data
app.delete('/admin/allplayers', (req, res) => {
  try {
    writePlayerData({});
    res.json({ success: true, message: 'All player data reset' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset player data' });
  }
});

// Ban management
app.get('/admin/bans', (req, res) => {
  const bans = readBans();
  res.json({ bans, total: bans.length });
});

app.post('/admin/ban', (req, res) => {
  const { playerId, playerName, reason, duration } = req.body;
  
  if (!playerId || !playerName) {
    return res.status(400).json({ error: 'playerId and playerName required' });
  }
  
  const bans = readBans();
  const existingIndex = bans.findIndex(b => b.playerId === playerId);
  
  const ban = {
    playerId,
    playerName,
    reason: reason || 'No reason provided',
    bannedAt: Date.now(),
    expiresAt: duration ? Date.now() + duration : null,
    permanent: !duration
  };
  
  if (existingIndex >= 0) {
    bans[existingIndex] = ban;
  } else {
    bans.push(ban);
  }
  
  if (writeBans(bans)) {
    res.json({ success: true, message: 'Player banned', ban });
  } else {
    res.status(500).json({ error: 'Failed to save ban' });
  }
});

app.delete('/admin/ban/:playerId', (req, res) => {
  const { playerId } = req.params;
  const bans = readBans();
  const filtered = bans.filter(b => b.playerId !== playerId);
  
  if (writeBans(filtered)) {
    res.json({ success: true, message: 'Ban removed' });
  } else {
    res.status(500).json({ error: 'Failed to remove ban' });
  }
});

// Check if player is banned
app.get('/admin/checkban/:playerId', (req, res) => {
  const { playerId } = req.params;
  const bans = readBans();
  const ban = bans.find(b => b.playerId === playerId);
  
  if (ban) {
    if (ban.permanent || (ban.expiresAt && ban.expiresAt > Date.now())) {
      res.json({ banned: true, ban });
    } else {
      // Ban expired, remove it
      const filtered = bans.filter(b => b.playerId !== playerId);
      writeBans(filtered);
      res.json({ banned: false });
    }
  } else {
    res.json({ banned: false });
  }
});

// Export database (backup)
app.get('/admin/export', (req, res) => {
  const data = {
    leaderboards: readLeaderboards(),
    players: readPlayerData(),
    bans: readBans(),
    exportedAt: new Date().toISOString()
  };
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="backup-${Date.now()}.json"`);
  res.send(JSON.stringify(data, null, 2));
});

// Import database (restore)
app.post('/admin/import', (req, res) => {
  try {
    const { leaderboards, players, bans } = req.body;
    
    if (leaderboards) writeLeaderboards(leaderboards);
    if (players) writePlayerData(players);
    if (bans) writeBans(bans);
    
    res.json({ success: true, message: 'Data imported successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import data: ' + error.message });
  }
});

// Analytics endpoint
app.get('/admin/analytics', (req, res) => {
  const leaderboards = readLeaderboards();
  const playerData = readPlayerData();
  const bans = readBans();
  
  // Calculate analytics
  let totalEntries = 0;
  let totalPlayers = new Set();
  let totalRolls = 0;
  
  for (const entries of Object.values(leaderboards)) {
    totalEntries += entries.length;
    entries.forEach(entry => {
      if (entry.playerId) totalPlayers.add(entry.playerId);
      if (entry.rollCount) totalRolls += entry.rollCount;
    });
  }
  
  res.json({
    totalLeaderboards: Object.keys(leaderboards).length,
    totalEntries,
    uniquePlayers: totalPlayers.size,
    totalPlayerData: Object.keys(playerData).length,
    totalBans: bans.length,
    activeBans: bans.filter(b => b.permanent || (b.expiresAt && b.expiresAt > Date.now())).length,
    totalRolls
  });
});

// =================================================================
// START SERVER
// =================================================================

// Start server
initializeDataFile();
initializePlayerDataFiles();
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Leaderboards stored in: ${DATA_FILE}`);
  console.log(`👥 Player data stored in: ${PLAYER_DATA_FILE}`);
  console.log(`🚫 Bans stored in: ${BANS_FILE}`);
  console.log(`💬 Live Chat enabled`);
  console.log(`🔐 Admin password: ${ADMIN_PASSWORD}`);
  console.log(`\n📋 Admin Panel: Press Ctrl+Shift+A in the game`);
});
