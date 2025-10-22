const fs = require('fs');

const content = fs.readFileSync('achievementsData.js', 'utf8');
const regex = /type:\s*'([^']+)'/g;
const types = new Set();
let match;

while ((match = regex.exec(content)) !== null) {
    types.add(match[1]);
}

const uniqueTypes = [...types].sort();
console.log('Total unique types:', uniqueTypes.length);
console.log('\nAll types:\n' + uniqueTypes.join('\n'));
