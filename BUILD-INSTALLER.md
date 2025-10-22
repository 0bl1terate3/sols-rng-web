# Building Sol's RNG Installer

## 📦 Quick Start

### 1. Install Dependencies
Open terminal in this folder and run:
```bash
npm install
```

### 2. Test the App (Optional)
Run in Electron to test before building:
```bash
npm run electron
```

Or with DevTools enabled:
```bash
npm run electron-dev
```

### 3. Build the Installer

**Windows (creates .exe installer):**
```bash
npm run dist-win
```

**Mac (creates .dmg):**
```bash
npm run dist-mac
```

**Linux (creates AppImage):**
```bash
npm run dist-linux
```

**All platforms:**
```bash
npm run dist
```

### 4. Find Your Installer
The installer will be created in the `dist/` folder!

---

## 🎨 Adding App Icons (Optional)

For a professional look, add these icon files to the root folder:

- **Windows:** `icon.ico` (256x256 or larger)
- **Mac:** `icon.icns` (512x512 or larger)
- **Linux:** `icon.png` (512x512 or larger)

You can create icons from a PNG using online tools like:
- https://convertico.com/
- https://cloudconvert.com/

---

## 📝 Build Options

### Create portable version (no installer)
```bash
npm run pack
```

### Test before building
```bash
npm run electron-dev
```

---

## 🚀 Distribution

After building, you can distribute the installer file from `dist/`:

- **Windows:** `Sol's RNG Setup 1.0.0.exe`
- **Mac:** `Sol's RNG-1.0.0.dmg`
- **Linux:** `sols-rng-game-1.0.0.AppImage`

Users just download and run the installer - no coding knowledge needed!

---

## 🛠️ Troubleshooting

**Error: "Cannot find module 'electron'"**
- Run: `npm install`

**Build fails on Windows**
- Make sure you have Windows Build Tools
- Run as administrator: `npm install --global windows-build-tools`

**Icon not showing**
- Add icon.ico (Windows) or icon.png (Linux/Mac) to root folder
- Rebuild with `npm run dist-win`

**App won't start**
- Test with: `npm run electron-dev` to see error messages
- Check browser console for JavaScript errors

---

## 📋 File Structure

```
sols-rng-game/
├── index.html              # Main game file
├── gameLogic.js            # Game code
├── auraData.js             # Aura data
├── electron-main.js        # Electron entry point (NEW)
├── package.json            # Build configuration (UPDATED)
├── icon.ico/png/icns       # App icons (OPTIONAL)
└── dist/                   # Built installers (created after build)
```

---

## 🎮 Features

Your installer will include:
- ✅ Desktop shortcuts
- ✅ Start menu shortcuts
- ✅ Proper uninstaller
- ✅ Custom installation directory
- ✅ Offline - no internet required
- ✅ Runs like a native app

---

## 📦 Installer Size

Expect installer to be around:
- Windows: ~70-120 MB
- Mac: ~90-150 MB
- Linux: ~80-130 MB

(Size includes Chromium engine for game rendering)

---

## 🔄 Updating

To release an update:
1. Change version in `package.json` (e.g., "1.0.0" → "1.0.1")
2. Rebuild: `npm run dist-win`
3. Distribute new installer

---

Need help? Check the console output when building for detailed error messages!
