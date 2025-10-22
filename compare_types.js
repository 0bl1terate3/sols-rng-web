const fs = require('fs');

// Extract achievement types
const achievementsContent = fs.readFileSync('achievementsData.js', 'utf8');
const achievementRegex = /type:\s*'([^']+)'/g;
const achievementTypes = new Set();
let match;

while ((match = achievementRegex.exec(achievementsContent)) !== null) {
    achievementTypes.add(match[1]);
}

// Extract implemented types (case statements)
const gameLogicContent = fs.readFileSync('gameLogic.js', 'utf8');
const implementedRegex = /case\s+'([^']+)':/g;
const implementedTypes = new Set();

while ((match = implementedRegex.exec(gameLogicContent)) !== null) {
    implementedTypes.add(match[1]);
}

// Find missing types (in achievements but not in game logic)
const missingTypes = [...achievementTypes].filter(t => !implementedTypes.has(t)).sort();

// Find extra types (in game logic but not in achievements - likely gear effects)
const extraTypes = [...implementedTypes].filter(t => !achievementTypes.has(t)).sort();

console.log('='.repeat(60));
console.log('ACHIEVEMENT TRACKING STATUS');
console.log('='.repeat(60));
console.log(`\nTotal Achievement Types: ${achievementTypes.size}`);
console.log(`Implemented Types: ${implementedTypes.size}`);
console.log(`Gear/Effect Types (not achievements): ${extraTypes.length}`);
console.log(`Missing Achievement Types: ${missingTypes.length}`);
console.log('\n' + '='.repeat(60));
console.log('MISSING ACHIEVEMENT TYPES (NOT TRACKED):');
console.log('='.repeat(60));
console.log(missingTypes.join('\n'));
