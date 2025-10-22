# Collapsible Panels System Guide

## Overview
The collapsible panels system makes ALL sections of the game collapsible and expandable, allowing you to customize your view and reduce clutter.

## Features

### ✅ What's Collapsible?
- **All Panels**: Inventory, Crafting, Codex, Rolling Panel
- **Header Sections**: Stats, Biome Info, Equipment Slots
- **Sub-sections**: Active Effects, Quest Tracker
- **Everything**: Literally every major section can be collapsed!

### 🎯 How to Use

#### Click to Collapse/Expand
- Each section has a **collapse button** (▼/▶) in the top-right corner
- Click the button or the header to toggle collapse/expand
- **▼** = Expanded (click to collapse)
- **▶** = Collapsed (click to expand)

#### Keyboard Shortcuts
- **Ctrl + Shift + C**: Collapse ALL panels at once
- **Ctrl + Shift + E**: Expand ALL panels at once

### 💾 Automatic State Saving
- Your collapse preferences are **automatically saved** to localStorage
- When you reload the page, panels remember if they were collapsed or expanded
- Each panel saves its state independently

### 📱 Mobile Optimized
- Smaller collapse buttons on mobile devices
- Touch-friendly tap targets
- Optimized spacing for small screens
- Works perfectly with the ultra-compact mobile UI

### 🎨 Visual Design
- Smooth animations when collapsing/expanding
- Gradient-styled collapse buttons with hover effects
- Subtle border highlights on hover
- Respects reduced motion preferences for accessibility

## Benefits

### Space Saving
- Collapse sections you're not using
- Focus on what matters to you
- Especially useful on mobile devices
- Reduces scrolling significantly

### Customization
- Create your own layout
- Hide sections you don't need right now
- Quickly access what you need

### Performance
- Collapsed sections use less resources
- Faster rendering on lower-end devices
- Reduces visual clutter

## Examples

### Common Use Cases

**Focus on Rolling:**
- Collapse: Inventory, Crafting, Codex
- Keep open: Rolling Panel, Active Effects

**Crafting Session:**
- Collapse: Rolling Panel, Quest Tracker
- Keep open: Inventory, Crafting

**Mobile Gaming:**
- Collapse everything except what you're currently using
- Use Ctrl+Shift+C to collapse all, then expand only what you need

**Checking Stats:**
- Expand Stats section
- Collapse other sections for cleaner view

## Technical Details

### Files Added
- `collapsible-panels.js` - Main functionality
- `collapsible-panels.css` - Styling
- Integrated into `index.html`

### How It Works
1. On page load, the system scans for all panels and sections
2. Adds collapse buttons to each header
3. Wraps content in collapsible containers
4. Loads saved states from localStorage
5. Applies smooth transitions

### Customization
The system automatically detects:
- `.panel` elements
- `header` element
- `.equipment-slots`
- `#activeEffects`
- `#questTracker`
- `.biome-info`
- `.stats`

New panels added dynamically will be made collapsible after 1-3 seconds.

## Accessibility

### Features
- Keyboard navigation support
- Focus indicators on buttons
- ARIA labels for screen readers
- Respects `prefers-reduced-motion`
- High contrast mode support

### Screen Reader Support
- Buttons announce "Collapse" or "Expand"
- State changes are communicated
- Semantic HTML structure maintained

## Tips & Tricks

1. **Quick Setup**: Use Ctrl+Shift+C to collapse everything, then expand only what you need
2. **Mobile**: Collapse the header to save significant vertical space
3. **Performance**: Collapse panels with lots of items (inventory) when not in use
4. **Focus Mode**: Collapse everything except the rolling panel for distraction-free gameplay
5. **Customization**: Your preferences persist across sessions - set it once!

## Troubleshooting

### Panel Won't Collapse
- Ensure JavaScript is enabled
- Check browser console for errors
- Try refreshing the page

### State Not Saving
- Check if localStorage is enabled in your browser
- Clear localStorage and try again
- Some browsers in private mode don't save localStorage

### Button Not Showing
- Panel might be dynamically added - wait 1-3 seconds
- Check if the panel has a proper ID
- Refresh the page to re-initialize

## Future Enhancements
- Custom collapse animations
- Panel grouping
- Quick presets (e.g., "Rolling Mode", "Crafting Mode")
- Drag-to-reorder panels
- Export/import collapse configurations

---

**Enjoy your customizable, clutter-free gaming experience!** 🎮✨
