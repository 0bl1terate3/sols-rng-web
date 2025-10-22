const fs = require('fs');

const content = fs.readFileSync('gameLogic.js', 'utf8');
const regex = /case\s+'([^']+)':/g;
const implementedTypes = new Set();
let match;

while ((match = regex.exec(content)) !== null) {
    implementedTypes.add(match[1]);
}

const uniqueImplemented = [...implementedTypes].sort();
console.log('Total implemented types:', uniqueImplemented.length);
console.log('\nImplemented types:\n' + uniqueImplemented.join('\n'));
