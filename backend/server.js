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
  
  // Check for duplicate aura submission (same playerId + auraName)
  if (playerId && auraName) {
    const duplicate = leaderboards[name].find(
      entry => entry.playerId === playerId && entry.auraName === auraName
    );
    if (duplicate) {
      return res.status(409).json({ 
        error: 'Already submitted this aura',
        message: `⚠️ Already submitted ${auraName} to leaderboard`
      });
    }
  }
  
  // Create new entry (supports both formats)
  const entry = {
    playerId: playerId || 'local_' + Date.now(),
    playerName: String(playerName).trim(),
    timestamp: timestamp || new Date().toISOString(),
    submittedAt: submittedAt || Date.now()
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
  }
  
  // Add entry
  leaderboards[name].push(entry);
  
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
// START SERVER
// =================================================================

// Start server
initializeDataFile();
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Leaderboards stored in: ${DATA_FILE}`);
  console.log(`💬 Live Chat enabled`);
});
