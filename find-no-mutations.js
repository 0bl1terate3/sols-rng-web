const fs = require('fs');

// Read the auraData.js file
const content = fs.readFileSync('./auraData.js', 'utf8');

// Extract aura names using regex
const auraMatches = content.matchAll(/{\s*name:\s*"([^"]+)"/g);
const auraNames = Array.from(auraMatches, m => m[1]);

// Separate base auras and mutations
const baseAuras = new Set();
const mutatedBases = new Set();

auraNames.forEach(name => {
    // Check if this is a mutation (contains : in a specific pattern)
    const colonIndex = name.indexOf(':');
    
    if (colonIndex > 0 && colonIndex < name.length - 1) {
        // This might be a mutation
        const baseName = name.substring(0, colonIndex).trim();
        
        // Skip special cases like ":troll:", "PUMP : TRICKSTER", special unicode names
        if (!name.startsWith(':') && !name.includes('《') && !name.includes('〔') && 
            !name.includes('<') && !name.includes('[') && baseName !== 'PUMP' && 
            baseName !== 'Memory' && baseName !== 'Aegis - Watergun' &&
            baseName !== 'Headless ') {
            mutatedBases.add(baseName);
        }
    }
    
    // Add as base aura if it doesn't contain a colon or is a special case
    if (!name.includes(':') || name === ':troll:' || name.startsWith('《') || 
        name.startsWith('〔') || name.startsWith('<') || name.startsWith('[') ||
        name === 'PUMP : TRICKSTER' || name === 'Memory: The Fallen' ||
        name === 'Aegis - Watergun' || name.includes('Headless :')) {
        baseAuras.add(name);
    }
});

// Find auras without mutations
const noMutations = Array.from(baseAuras).filter(name => {
    // Must not have mutations
    if (mutatedBases.has(name)) return false;
    
    // Must not contain ":"
    if (name.includes(':')) return false;
    
    // Filter out special cases/special characters
    if (name.includes('《') || name.includes('〔') || name.includes('<') || name.includes('[')) return false;
    if (name.includes('★') || name === ':troll:') return false;
    
    // Filter out special tier and cosmic tier
    const auraObj = auraNames.find(n => n === name);
    
    // Filter out ultra-low commons and special auras
    const skipAuras = [
        'Nothing', 'Basic', 'Simple', 'Plain', 'Standard', 'Ordinary',
        'Memory', 'Oblivion', 'Mastermind', 'Abomination', 'Orion',
        'THANEBORNE', 'Eden', 'APOCALYPSE', 'PHANTASMA', 'RAVAGE',
        'MALEDICTION', 'LAMENTHYR', 'Erebus', 'Accursed', 'PUMP',
        'Brain', 'Unknown', 'Headless', 'BANSHEE', 'ARACHNOPHOBIA',
        'Pump', 'Aegis - Watergun', 'Rare', 'Star'
    ];
    
    if (skipAuras.includes(name)) return false;
    
    return true;
});

console.log(`\n=== BASE AURAS THAT COULD USE MUTATIONS (${noMutations.length}) ===\n`);

noMutations.sort().forEach(name => {
    console.log(`- ${name}`);
});
