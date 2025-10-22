// Analyze fonts script
const fs = require('fs');

// Read auraData.js to extract all aura names
const auraDataContent = fs.readFileSync('./auraData.js', 'utf8');
const auraMatches = auraDataContent.matchAll(/name:\s*"([^"]+)"/g);
const auraNames = [...new Set([...auraMatches].map(m => m[1]))];

// Read gameLogic.js to extract font mappings
const gameLogicContent = fs.readFileSync('./gameLogic.js', 'utf8');
const fontRegex = /'([^']+)':\s*'([^']+)',?/g;
const fontMap = {};
let match;
while ((match = fontRegex.exec(gameLogicContent)) !== null) {
    fontMap[match[1]] = match[2];
}

// Find auras without fonts
const missing = auraNames.filter(name => !fontMap[name]);

// Find duplicate fonts
const fontUsage = {};
Object.values(fontMap).forEach(font => {
    fontUsage[font] = (fontUsage[font] || 0) + 1;
});
const duplicates = Object.entries(fontUsage).filter(([f, count]) => count > 1).sort((a, b) => b[1] - a[1]);

console.log('=== MISSING FONTS ===');
console.log('Count:', missing.length);
missing.forEach(m => console.log('-', m));

console.log('\n=== DUPLICATE FONTS ===');
console.log('Count:', duplicates.length);
duplicates.forEach(([font, count]) => console.log('-', font, '(' + count + 'times)'));

// List which auras use each duplicate font
console.log('\n=== AURAS USING DUPLICATE FONTS ===');
duplicates.forEach(([font, count]) => {
    const aurasUsingFont = Object.entries(fontMap).filter(([n, f]) => f === font).map(([n]) => n);
    console.log(`\n${font} (${count} times):`);
    aurasUsingFont.forEach(a => console.log('  -', a));
});
