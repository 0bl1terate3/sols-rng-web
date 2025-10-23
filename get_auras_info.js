const fs = require('fs');

// Read the auraData.js file
const content = fs.readFileSync('./auraData.js', 'utf8');

// Extract the array from the file content
const arrayString = content.substring(content.indexOf('[') + 1, content.lastIndexOf(']'));

// Manually parse the array string
const auras_raw = [];
const regex = /{\s*name:\s*"([^"]+)"[^}]+}/g;
let match;
while ((match = regex.exec(arrayString)) !== null) {
    auras_raw.push({ name: match[1] });
}

const all_auras = new Set(auras_raw.map(a => a.name));
const base_auras = new Set();
const mutated_auras = new Set();

for (const aura of auras_raw) {
    const name = aura.name;
    if (name.includes(':') || name.includes('-')) {
        const base_name = name.split(':')[0].split('-')[0].trim();
        mutated_auras.add(base_name);
    } else {
        base_auras.add(name);
    }
}

const non_mutated_auras = [...base_auras].filter(aura => !mutated_auras.has(aura));

console.log(`Total number of auras: ${base_auras.size}`);
console.log(`Auras without mutations: ${non_mutated_auras.length}`);
console.log("Auras that don't have mutations:");
for (const aura of non_mutated_auras.sort()) {
    console.log(`- ${aura}`);
}
