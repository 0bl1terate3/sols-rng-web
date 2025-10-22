# 🎨 Creating Icons for PWA (Chromebook Support)

Your game needs two icon sizes for Chromebook/PWA installation:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

---

## 🚀 Easiest Methods:

### **Option 1: Online Icon Generator** ⭐

1. **Visit:** https://www.pwabuilder.com/imageGenerator
2. **Upload** your game logo/image (PNG, at least 512x512)
3. **Download** the generated icons
4. **Extract** and copy `icon-192.png` and `icon-512.png` to your game folder

---

### **Option 2: RealFaviconGenerator**

1. **Visit:** https://realfavicongenerator.net/
2. **Upload** your image
3. **Generate icons**
4. **Download** package
5. **Extract** the 192x192 and 512x512 PNG files
6. **Rename** them to `icon-192.png` and `icon-512.png`
7. **Copy** to your game folder

---

### **Option 3: Manual Creation**

If you have an image editor (Photoshop, GIMP, Paint.NET):

1. **Open your logo** in the editor
2. **Resize canvas** to 512x512 pixels
3. **Export as PNG** → save as `icon-512.png`
4. **Resize to** 192x192 pixels
5. **Export as PNG** → save as `icon-192.png`
6. **Move both files** to your game folder

---

### **Option 4: Use Online Image Resizer**

1. **Visit:** https://www.iloveimg.com/resize-image
2. **Upload** your image
3. **Resize** to 512x512, download as `icon-512.png`
4. **Repeat** for 192x192, save as `icon-192.png`
5. **Copy both** to game folder

---

## ✅ Quick Check:

After creating icons, verify:
- ✅ `icon-192.png` exists in game root folder
- ✅ `icon-512.png` exists in game root folder
- ✅ Both are PNG format (not JPG)
- ✅ Transparent background (recommended but not required)

---

## 🎨 Icon Design Tips:

- **Keep it simple** - Small details won't show at 192px
- **High contrast** - Easy to see on any background
- **Centered subject** - Looks good when rounded by OS
- **No text** - Use symbols/logos instead
- **Square canvas** - Will be cropped to circle on some devices

---

## 🔧 Testing Your Icons:

1. **Add icons to game folder**
2. **Open game in Chrome**
3. **Press F12** → Application tab → Manifest
4. **Check icons** appear correctly
5. **Try installing** - icon should show in install prompt

---

## 📦 Don't Have a Logo Yet?

### **Temporary Solution:**
Use text-based icons from:
- https://www.favicon.cc/ (simple pixel art)
- https://favicon.io/favicon-generator/ (text to icon)

### **AI-Generated Icons:**
- https://www.bing.com/create (Microsoft Designer)
- Describe: "game icon for aura rolling game, colorful, mystical"

### **Icon Packs:**
- https://www.flaticon.com/ (free with attribution)
- Search: "game icon" or "dice icon" or "lucky icon"

---

## 🎯 Recommended Workflow:

1. **Create** 512x512 PNG icon
2. **Use online tool** to generate all sizes
3. **Extract** icon-192.png and icon-512.png
4. **Copy** to game folder
5. **Test** by opening game in Chrome
6. **Install** from browser to verify

---

**Without these icons, your game will still work, but won't install properly on Chromebooks!**
