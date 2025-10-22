# Sol's RNG Game - Backend Server

Simple Node.js backend for managing game leaderboards.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Start Server

```bash
npm start
```

The server will run on **http://localhost:8090**

## 📡 API Endpoints

### Health Check
```
GET /
```
Returns server status and available endpoints.

### Get All Leaderboards
```
GET /leaderboards
```
Returns all leaderboards with their entries.

### Get Specific Leaderboard
```
GET /leaderboard/:name?limit=100
```
Returns entries for a specific leaderboard, sorted by score (highest first).

**Parameters:**
- `name` (path): Leaderboard name (e.g., "daily", "weekly", "alltime")
- `limit` (query, optional): Maximum number of entries to return (default: 100)

**Example:**
```
GET /leaderboard/daily?limit=10
```

### Add Entry to Leaderboard
```
POST /leaderboard/:name
Content-Type: application/json

{
  "playerName": "Player123",
  "score": 1500,
  "timestamp": "2025-10-21T22:35:00.000Z"  // optional
}
```

**Required fields:**
- `playerName`: Player's name (string)
- `score`: Player's score (number)

**Optional fields:**
- `timestamp`: ISO timestamp (defaults to current time)

### Clear Leaderboard
```
DELETE /leaderboard/:name
```
Removes all entries from the specified leaderboard.

## 💾 Data Storage

Leaderboard data is stored in `leaderboards.json` in the backend directory. The file is created automatically on first run.

**Example structure:**
```json
{
  "daily": [
    {
      "playerName": "Player1",
      "score": 2500,
      "timestamp": "2025-10-21T22:35:00.000Z"
    }
  ],
  "weekly": [
    {
      "playerName": "Player2",
      "score": 5000,
      "timestamp": "2025-10-21T22:30:00.000Z"
    }
  ]
}
```

## 🌐 CORS Configuration

The server is configured to accept requests from any origin, including:
- GitHub Pages
- localhost (any port)
- Any other domain

This makes it easy to connect your frontend hosted anywhere.

## 🔧 Frontend Integration Example

```javascript
// Submit score
async function submitScore(playerName, score) {
  const response = await fetch('http://localhost:8090/leaderboard/daily', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      playerName: playerName,
      score: score
    })
  });
  return await response.json();
}

// Get leaderboard
async function getLeaderboard(name = 'daily', limit = 10) {
  const response = await fetch(
    `http://localhost:8090/leaderboard/${name}?limit=${limit}`
  );
  return await response.json();
}
```

## 📝 Notes

- The server must be running locally for the game to access leaderboards
- Data persists between server restarts
- Multiple leaderboards are supported (e.g., daily, weekly, alltime)
- No database required - everything stored in JSON
- Simple and self-contained - easy to modify and extend
