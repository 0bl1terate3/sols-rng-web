# Running Backend Locally for GitHub Pages

Your frontend is on **GitHub Pages** (https://0bl1terate3.github.io/sols-rng-web/)  
Your backend runs **locally on your PC**

## 🚀 Quick Setup with Ngrok

### 1. Install Ngrok

**Option A - Download:**
- Go to [ngrok.com/download](https://ngrok.com/download)
- Extract and add to PATH

**Option B - Using Chocolatey (Windows):**
```bash
choco install ngrok
```

### 2. Start Your Backend

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:8090` ✅

### 3. Expose Backend with Ngrok

Open a **new terminal** and run:

```bash
ngrok http 8090
```

You'll see output like:
```
Session Status    online
Forwarding        https://abc1234def.ngrok-free.app -> http://localhost:8090
```

**Copy the HTTPS URL** (e.g., `https://abc1234def.ngrok-free.app`)

### 4. Update Frontend Code

Edit `leaderboard-local.js` line 20:

```javascript
this.backendUrl = 'https://abc1234def.ngrok-free.app'; // Your ngrok URL
```

### 5. Push to GitHub

```bash
git add leaderboard-local.js
git commit -m "Update backend URL for ngrok"
git push
```

GitHub Pages will update in ~1 minute.

## ✅ Testing

1. Visit your GitHub Pages site
2. Open browser console (F12)
3. Look for: `🌐 Backend URL: https://your-ngrok-url`
4. Roll a global aura and check if it submits

## ⚠️ Important Notes

### Ngrok Free Tier Limitations:
- **URL changes** every time you restart ngrok
- **Solution**: Update `leaderboard-local.js` with new URL each time
- **Better option**: Sign up (free) for a static domain at ngrok.com

### Keep Backend Running:
- Your PC must be **on** and **backend running**
- If you close terminal or shut down PC, leaderboard won't work
- GitHub Pages will still load, but leaderboard features will fail silently

### Alternative: Persistent URL (Free Ngrok Account)

1. Sign up at [ngrok.com](https://ngrok.com)
2. Get your auth token
3. Run: `ngrok authtoken YOUR_AUTH_TOKEN`
4. Use a static subdomain:
   ```bash
   ngrok http 8090 --subdomain=your-chosen-name
   ```
5. URL stays the same: `https://your-chosen-name.ngrok.io`

## 🔄 Daily Workflow

### Without Static Domain:
```bash
# Terminal 1 - Start backend
cd backend
npm start

# Terminal 2 - Start ngrok
ngrok http 8090

# Copy new URL, update leaderboard-local.js, commit & push
```

### With Static Domain (Recommended):
```bash
# Terminal 1 - Start backend
cd backend
npm start

# Terminal 2 - Start ngrok with subdomain
ngrok http 8090 --subdomain=your-chosen-name

# URL never changes! No code updates needed
```

## 🌐 Alternative: Cloudflare Tunnel (Free Forever)

Another option with permanent URLs:

```bash
# Install cloudflared
npm install -g cloudflared

# Run tunnel
cloudflared tunnel --url http://localhost:8090
```

Copy the `*.trycloudflare.com` URL and use it in `leaderboard-local.js`

## 🐛 Troubleshooting

**"Mixed content" errors:**
- GitHub Pages uses HTTPS, backend must also use HTTPS
- Ngrok/Cloudflare provide HTTPS automatically ✅

**"Failed to fetch":**
- Check if backend is running
- Check if ngrok/tunnel is running
- Verify URL in `leaderboard-local.js` matches ngrok output

**Ngrok "warning" page:**
- Free ngrok shows a warning page before connecting
- Users must click "Visit Site" once
- Sign up for free ngrok account to remove this

## 💡 Pro Tip: Auto-Update URL

Add this to `leaderboard-local.js` for easier testing:

```javascript
// Set backend URL
if (this.isLocalDevelopment) {
    this.backendUrl = 'http://localhost:8090';
} else {
    // Check if there's a URL in localStorage (for easy dev)
    const savedUrl = localStorage.getItem('backendUrl');
    if (savedUrl) {
        this.backendUrl = savedUrl;
    } else {
        this.backendUrl = 'https://YOUR-NGROK-URL.ngrok-free.app';
    }
}
```

Then in browser console:
```javascript
localStorage.setItem('backendUrl', 'https://new-ngrok-url.ngrok-free.app');
location.reload();
```
