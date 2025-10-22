// =================================================================
// Gear & Item Data
// =================================================================
// gearData and ITEM_RECIPES are loaded from gearData.js as global variables

// =================================================================
// =================================================================
// Ultra Rare Cutscene System
// =================================================================

const cutsceneState = {
    active: false,
    canvas: null,
    ctx: null,
    particles: [],
    cracks: [],
    shards: [],
    warpStars: [],
    warpActive: false,
    warpSpeed: 0,
    currentColor: '#ffffff',
    sealRadius: 200,
    crackProgress: 0,
    glowIntensity: 0,
    cameraShake: 0,
    cameraZoom: 1,
    text3D: {
        opacity: 0,
        scale: 0.8,
        yOffset: 50,
        depth: 15
    },
    currentAuraRarity: 0, // Will store the rarity for the post-cutscene check
    // NEW Star-like Cutscene properties (for 100M+)
    starCore: {
        radius: 0,
        opacity: 0,
        glow: 0,
        color: '#ffffff'
    },
    starParticles: [], // For particles bursting from the core
    cosmicAura: { // For the aura reveal itself
        opacity: 0,
        scale: 0.8,
        yOffset: 50,
        depth: 15
    }
};

// Deep fried effect function for global auras after cutscenes
// Deep fried effect function for global auras after cutscenes
// Deep fried effect function for global auras after cutscenes
// =================================================================
// Ultra Rare Cutscene System
// =================================================================

// ... (keep the rest of the cutsceneState object as is) ...

// Check if aura should trigger deep-fried effect
function shouldTriggerDeepFriedEffect(aura) {
    // Trigger for globals (>99999998 rarity) OR Memory/Oblivion/Eden specifically
    return aura.rarity > 99999998 || aura.name === 'Memory: The Fallen' || aura.name === 'Oblivion' || aura.name === 'Eden';
}

// Deep fried effect function for global auras after cutscenes
async function triggerDeepFriedEffect() {
    console.log('Triggering GLOBAL AURA effect...');
    
    // Create the visual effect overlay
    const overlay = document.createElement('div');
    overlay.id = 'globalAuraOverlay';
    
    // Set initial styles
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0);
        filter: grayscale(0%) contrast(100%) brightness(100%);
        z-index: 9999;
        pointer-events: none;
        opacity: 1;
        transition: background-color 1.5s ease-in-out, filter 0.8s ease-in-out;
    `;
    
    // Add the overlay to the page
    document.body.appendChild(overlay);
    
    // Also apply filter to body for better monochrome effect
    document.body.style.transition = 'filter 0.8s ease-in-out, transform 0.05s ease-in-out';
    
    // 1. Play a loud sound
    try {
        const boomSound = new Audio('boom.mp3');
        boomSound.volume = 0.9;
        await boomSound.play().catch(e => console.log('Boom sound failed:', e));
    } catch (e) {
        console.log('Could not play boom sound:', e);
    }
    
    // 2. Screen shake
    const shakeSequence = [
        { x: -12, y: 12 }, { x: 12, y: -12 }, { x: -12, y: -12 }, { x: 12, y: 12 },
        { x: -18, y: 8 }, { x: 18, y: -8 }, { x: -8, y: 18 }, { x: 8, y: -18 },
        { x: -10, y: 10 }, { x: 10, y: -10 }, { x: 0, y: 0 }
    ];
    
    for (const shake of shakeSequence) {
        document.body.style.transform = `translate(${shake.x}px, ${shake.y}px)`;
        await new Promise(resolve => setTimeout(resolve, 40)); 
    }
    
    // 3. Apply MONOCHROME effect to the entire page
    console.log('Applying high-contrast monochrome effect...');
    document.body.style.filter = 'grayscale(100%) contrast(300%) brightness(120%)';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';

    // Hold the monochrome effect
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    // 4. SLOW fade to white
    console.log('Fading to white...');
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    document.body.style.filter = 'grayscale(0%) contrast(100%) brightness(100%)';

    // Hold the white
    await new Promise(resolve => setTimeout(resolve, 800));

    // 5. SLOW fade out from white
    console.log('Fading back...');
    overlay.style.transition = 'opacity 2s ease-out';
    overlay.style.opacity = '0';

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clean up
    overlay.remove();
    document.body.style.transition = '';
    document.body.style.transform = '';
    document.body.style.filter = '';
    
    console.log('Global aura effect completed.');
}

// **MODIFIED:** Now handles ultra-rares (10M+) including globals
// MODIFIED: Now handles ultra-rares (10M+) including globals 
function shouldTriggerCutscene(aura) {
    // This function is now ONLY responsible for checking rarity for the default canvas cutscene (10-98 million).
    // It no longer needs a list of video auras.
    return aura.rarity >= 10000000 && aura.rarity < 99000000;
}

function shouldTriggerRareCutscene(aura) {
    return aura.rarity >= 1000000 && aura.rarity < 10000000;
}

function shouldTriggerUltraRareCutscene(aura) {
    return aura.rarity >= 99000000;
}

function getAuraColor(auraName) {
    const auraColors = {
        // Common & Uncommon
        'Nothing': '#9ca3af', 'Common': '#d1d5db', 'Uncommon': '#86efac', 'Good': '#4ade80', 'Natural': '#22c55e',
        'Common: Archetype': '#e5e7eb', 'Uncommon: Aberration': '#4ade80',
        'Good: Virtuous': '#65a30d', 'Natural: Overgrowth': '#15803d',
        
        // Rare
        'Rare': '#3b82f6', 'Divinus': '#fbbf24', 'Crystallized': '#06b6d4', 'Star': '#fcd34d', 'Rage': '#ef4444',
        'Topaz': '#f59e0b', 'Crystallized: Geode': '#0891b2', 'Star: Supernova': '#facc15', 'Topaz: Charged': '#ea580c',
        
        // Epic
        'Glacier': '#bfdbfe', 'Ruby': '#dc2626', 'Forbidden': '#7c2d12', 'Emerald': '#10b981', 'Gilded': '#fcd34d',
        'Ink': '#1e293b', 'Jackpot': '#facc15', 'Sapphire': '#3b82f6', 'Aquamarine': '#06b6d4', 'Wind': '#93c5fd',
        'Glacier: Winterheart': '#7dd3fc', 'Ruby: Incandescent': '#f87171', 'Forbidden: Unleashed': '#b91c1c', 'Forbidden: ERROR': '#ef4444',
        'Gilded: Midas': '#eab308', 'Ink: Rorschach': '#0f172a', 'Jackpot: Favor': '#fde047', 'Wind: Tempest': '#60a5fa',
        'Emerald: Verdant': '#059669', 'Sapphire: Insight': '#2563eb', 'Aquamarine: Abyss': '#0284c7',
        
        // Legendary
        'Two Stars': '#fde047', 'Diaboli': '#dc2626', 'Precious': '#a855f7', 'Atomic': '#22d3ee', 'Glock': '#64748b',
        'Magnetic': '#6366f1', 'Ash': '#78716c', 'Player': '#10b981', 'Fault': '#e11d48', 'Pukeko': '#38bdf8',
        'Sand Bucket': '#f59e0b', 'Cola': '#f43f5e', 'Cola: Witches Brew': '#581c87', 'Flora': '#22c55e', 'Sidereum': '#818cf8', 'Bleeding': '#b91c1c',
        'Lunar': '#93c5fd', 'Solar': '#fb923c', 'Eclipse': '#1e1b4b', 'Flushed': '#ec4899', 'Hazard': '#eab308',
        'Precious: Priceless': '#c084fc', 'Glock: Ricochet': '#94a3b8', 'Ash: Phoenix': '#f97316', 'Pukeko: Guardian': '#0ea5e9',
        'Sand Bucket: Castle': '#d97706', 'Cola: Effervescence': '#fda4af', 'Two Stars: Binary': '#fef3c7',
        'Player: HUD': '#34d399', 'Fault: Tectonic': '#fbbf24', 'Sidereum: Constellation': '#a5b4fc', 'Bleeding: Ichor': '#be123c',
        
        // Mythic
        'Quartz': '#e9d5ff', 'Honey': '#facc15', 'Lost Soul': '#6366f1', 'Atomic: Riboneucleic': '#14b8a6',
        'Three Stars': '#fde68a', 'Undead': '#4ade80', 'Corrosive': '#84cc16', 'Rage: Heated': '#f97316',
        'Rage: Berserker': '#dc2626', 'Leak': '#0ea5e9', 'Ink Leak': '#334155', 'Powered': '#fde047', 'Starfish Rider': '#fb923c',
        'Copper': '#ea580c', 'Watt': '#fef08a', 'Watt: Superconductor': '#fbbf24', 'Quartz: Resonant': '#f3e8ff', 'Honey: Ambrosia': '#fef9c3',
        'Lost Soul: Vengeful': '#7c3aed', 'Corrosive: Meltdown': '#a3e635', 'Starfish Rider: Celestial': '#fed7aa',
        'Three Stars: Trinary': '#fef3c7', 'Powered: Overclocked': '#fbbf24', 'Leak: Breach': '#67e8f9',
        'Copper: Patina': '#16a34a', 'Eclipse: Total': '#0c0a09', 'Ink Leak: Flood': '#0f172a', 'Prism': '#ddd6fe', 'Prism: Spectrum': '#e9d5ff',
        
        // Exotic
        'Aquatic': '#2dd4bf', 'Lightning': '#fef08a', 'Starlight': '#fef3c7', 'Star Rider': '#fbbf24',
        'Flushed: Lobotomy': '#f472b6', 'Hazard: Rays': '#fcd34d', 'Hazard: Fallout': '#65a30d', 'Nautilus': '#38bdf8', 'Permafrost': '#e0f2fe',
        'Flow': '#67e8f9', 'Flow: Stasis': '#22d3ee', 'Stormal': '#94a3b8', 'Stormal: Eyewall': '#475569', 'Pump': '#e11d48', 'Exotic': '#f9a8d4', 'Diaboli: Void': '#7c2d12',
        'Comet': '#fef3c7', 'Undead: Devil': '#16a34a', 'Divinus: Angel': '#fef9c3',
        'Lightning: Kugelblitz': '#fde047', 'Starlight: Alpenglow': '#fef9c3', 'Permafrost: Rime': '#f0f9ff',
        'Comet: Impactor': '#fde68a', 'Radiation': '#84cc16', 'Radiation: Ultraviolet': '#a855f7', 'Star Rider: Nebula': '#c084fc',
        
        // Divine
        'Jade': '#10b981', 'Spectre': '#a78bfa', 'Manta': '#22d3ee', 'Jazz': '#8b5cf6', 'Aether': '#c4b5fd',
        'Aether: Quintessence': '#e9d5ff', 'Bounded': '#7c3aed', 'Retrospective': '#22c55e', 'Watermelon': '#fb7185', 'Celestial': '#fef3c7', 'Terror': '#1e293b', 'Raven': '#0f172a',
        'Warlock': '#9333ea', 'Kyawthuite': '#f97316', 'Jade: Dragon': '#059669', 'Spectre: Poltergeist': '#a855f7',
        'Jazz: Blues': '#6d28d9', 'Bounded: Paradox': '#581c87', 'Watermelon: Rush': '#f43f5e', 'Manta: Aetherwing': '#0ea5e9',
        'Terror: Phobia': '#111827', 'Warlock: Patron': '#7e22ce', 'Meteor': '#f59e0b', 'Meteor: Impact': '#dc2626', 'Retrospective: Nostalgia': '#059669',
        
        // Celestial
        'Arcane': '#9333ea', ':troll:': '#22c55e', 'Magnetic: Reverse Polarity': '#ef4444',
        'Magnetic: Lodestar': '#818cf8', 'Undefined': '#000000', 'Undefined: Defined': '#ffffff', 'Rage: Brawler': '#f87171',
        'Astral': '#6366f1', 'Cosmos': '#8b5cf6', 'Gravitational': '#0ea5e9', 'Unbound': '#fdba74',
        'Unbound: Freedom': '#fef3c7',
        'Virtual': '#10b981', 'Parasite': '#84cc16', 'Lunar C Nightfall': '#1e3a8a', 'Savior': '#fde68a',
        'Shiftlock': '#475569', 'Alice': '#ec4899', 'Wonderland': '#f472b6', 'Aquatic: Flame': '#0891b2',
        'Poseidon': '#0284c7', 'Zeus': '#fbbf24', 'Gravitational: Wormhole': '#22d3ee', 'Poseidon: Cybernetic': '#14b8a6',
        'Zeus: Olympian': '#fde047', 'Cosmos: Singularity': '#d946ef', 'Parasite: Symbiote': '#a3e635', 'Alice: Glass': '#f9a8d4',
        'Lunar C Nightfall: Eclipse': '#0c0a09',
        
        // Transcendent
        'Solar: Solstice': '#fb923c', 'Solar: Corona': '#f97316', 'Galaxy': '#7c3aed', 'Lunar: Full Moon': '#7dd3fc', 'Vital': '#ef4444',
        'Anima': '#c026d3', 'Twilight': '#6366f1', 'Origin': '#fef08a', 'Hades': '#be123c',
        'Hades: Styx': '#7c2d12', 'Hades: Develium': '#4a044e', 'Celestial: Divine': '#fde68a', 'Anubis': '#d97706', 'Hyper-Volt': '#facc15', 'Velocity': '#2dd4bf',
        'Nautilus: Lost': '#0891b2', 'Nautilus: Primordial': '#0c4a6e', 'Harnessed': '#fcd34d', 'Onion': '#fdba74', 'Nihility': '#000000',
        'Nihility: Void': '#09090b',
        'Helios': '#f59e0b', 'Stargazer': '#fbbf24', 'Moonflower': '#e879f9', 'Starscourge': '#fde047',
        'Sailor': '#0284c7', 'Sailor: Battleship': '#0c4a6e', 'Glitch': '#06b6d4', 'Hurricane': '#64748b', 'Sirius': '#f0f9ff',
        'Santa-Frost': '#ddd6fe', 'Arcane: Legacy': '#a855f7', 'Lullaby': '#e9d5ff', 'Lullaby: Sweet Dreams': '#c4b5fd', 'Cryptfire': '#9333ea', 'Dynamic Force': '#eab308',
        'Chromatic': '#ec4899', 'Chromatic: Diva': '#f9a8d4', 'Winter Fantasy': '#cbd5e1', 'Aviator': '#94a3b8', 'Aviator: Fleet': '#475569', 'Blizzard': '#bfdbfe',
        'Arcane: Dark': '#581c87', 'Express': '#f43f5e', 'INNOVATOR': '#14b8a6', 'Ethereal': '#d8b4fe',
        'Soul Hunter': '#7c2d12', 'Abominable': '#f0f9ff', 'kr0mat1k': '#d946ef', 'Fatal Error': '#f87171',
        'Juxtaposition': '#171717', 'Overseer': '#fed7aa', 'Exotic: Apex': '#f9a8d4', 'Matrix': '#10b981',
        'Runic': '#818cf8', 'Runic: Eternal': '#6366f1', 'Sentinel': '#64748b', 'M A R T Y R': '#fbbf24', 'Nyctophobia': '#0f172a', 'Twilight: Iridescent Memory': '#f0abfc', 'Dullahan': '#1e293b',
        'Carriage': '#78350f', 'Sailor: Flying Dutchman': '#0c4a6e', 'Harnessed: Elements': '#fdba74',
        'Virtual: Worldwide': '#34d399', 'Chromatic: Genesis': '#f472b6', 'Chromatic: Exotic': '#f9a8d4',
        'Starscourge: Radiant': '#fef9c3', 'Overture': '#9333ea', 'Atlas: Yuletide': '#e0f2fe',
        'THE GLOCK OF THE SKY': '#cbd5e1', 'Symphony': '#a78bfa', 'Symphony: Eternal': '#8b5cf6', 'Nightmare Sky': '#1e1b4b',
        'Twilight: Withering Grace': '#8b5cf6', 'Impeached': '#fef3c7', 'Oppression': '#0f172a',
        'Hyper-Volt: Ever Storm': '#fef08a', '《 SHARD〡SURFER 》': '#38bdf8', 'Archangel': '#fffbeb', 'Archangel: Overheaven': '#fef3c7',
        'Astral: Zodiac': '#818cf8', 'Astral: Legendarium': '#a5b4fc', 'Exotic: Void': '#581c87',
        'Overture: History': '#a855f7', 'Bloodlust': '#be123c', 'Bloodlust: Sanguine': '#7f1d1d', 'Maelstrom': '#0369a1', 'Lotusfall': '#f9a8d4',
        'Orchestra': '#ddd6fe', 'Atlas': '#94a3b8', 'Flora: Evergreen': '#16a34a', 'Flora: Photosynthesis': '#15803d', 'Chillsear': '#67e8f9',
        'Abyssal Hunter': '#0c4a6e', 'Abyssal Hunter: Awakened': '#164e63', 'Impeached: I\'m Peach': '#fdba74', 'Aegis - Watergun': '#0ea5e9',
        'Gargantua': '#78350f', 'Apostolos': '#fffbeb', 'PUMP : TRICKSTER': '#f97316', 'Unknown': '#444444', 'Kyawthuite: Remembrance': '#fb923c', 'Kyawthuite: Facet': '#ea580c',
        'Ruins': '#78716c', 'Matrix: Overdrive': '#059669',        'Dreammetric': '#f9a8d4', 'Elude': '#0ea5e9', 'Sophyra': '#a855f7', 'Matrix: Reality': '#34d399',
        'Prologue': '#6366f1', 'Harvester': '#f59e0b', 'Sovereign': '#fef3c7', 'Ruins: Withered': '#0f172a',
        'Apostolos: Veil': '#fde68a', 'Aegis': '#0ea5e9', 'Dreamscape': '#e879f9', '▣ PIXELATION ▣': '#94a3b8',
        'Luminosity': '#fefce8', '『E Q U I N O X』': '#f472b6', '『E Q U I N O X』: Equilibrium': '#c026d3',
        'Anubis: Scales': '#ea580c', 'Glitch: Segfault': '#14b8a6', 'Archangel: Seraphim': '#fefce8',
        'Sovereign: Divine': '#fef08a', 'Galaxy: Quasar': '#c026d3', '『E Q U I N O X』: Zenith': '#ec4899',
        '▣ PIXELATION ▣: Voxel': '#22d3ee',
        'Mastermind': '#000000',
        'Manipulative': '#7c3aed', 'Manipulative: Puppetmaster': '#581c87',
        'Dataglow': '#22d3ee', 'Dataglow: Binary': '#06b6d4',
        'Lament': '#6366f1', 'Lament: Requiem': '#4338ca',
        'Showdown': '#fbbf24', 'Showdown: High Noon': '#f59e0b',
        'Leviathan': '#0c4a6e', 'Leviathan: Depths': '#082f49',
        'Aegis: Fortress': '#0284c7',
        
        // New Unique Auras
        'Marionette': '#9333ea', 'Marionette: Puppeteer': '#7e22ce',
        'Kaleidoscope': '#ec4899', 'Kaleidoscope: Fractal': '#db2777',
        'Mirage': '#f59e0b', 'Mirage: Oasis': '#d97706',
        'Clockwork': '#78716c', 'Clockwork: Automaton': '#57534e',
        'Carnival': '#f43f5e', 'Carnival: Ringmaster': '#e11d48',
        'Orion': '#fef3c7',
        
        // Crimson Biome Auras
        'Crimson': '#dc2626', 'Crimson: Flesh': '#991b1b', 'Crimson: Ichor': '#7f1d1d',
        'Vertebrae': '#f87171', 'Vertebrae: Spine': '#ef4444',
        'Hemogoblin': '#b91c1c', 'Hemogoblin: Crimson Heart': '#7c2d12',
        'Brain': '#be123c', 'Crimtane': '#dc2626', 'Crimtane: Ore': '#991b1b',
        'Vicious': '#ef4444', 'Vicious: Tendril': '#b91c1c',
        
        // Coffee/Cozy Themed Auras
        'Espresso': '#78350f', 'Espresso: Double Shot': '#451a03',
        'Latte': '#d97706', 'Latte: Caramel': '#b45309',
        'Cappuccino': '#92400e', 'Cappuccino: Foam Art': '#78350f',
        'Mocha': '#713f12', 'Mocha: Dark Chocolate': '#422006',
        'Vanilla': '#fef3c7', 'Vanilla: Bean': '#fde68a',
        'Cinnamon': '#ea580c', 'Cinnamon: Spice': '#c2410c',
        'Maple': '#f59e0b', 'Maple: Syrup': '#d97706',
        'Autumn': '#f97316', 'Autumn: Harvest': '#ea580c',
        'Cozy': '#fb923c', 'Cozy: Fireplace': '#f97316',
        'Bookshelf': '#78716c', 'Bookshelf: Library': '#57534e',
        
        // Mid-Tier Auras
        'Neon': '#22d3ee', 'Neon: Glow': '#06b6d4',
        'Obsidian': '#0f172a', 'Obsidian: Volcanic': '#7c2d12',
        'Titanium': '#cbd5e1', 'Titanium: Alloy': '#94a3b8',
        'Plasma': '#a855f7', 'Plasma: Ionized': '#9333ea',
        'Vortex': '#6366f1', 'Vortex: Spiral': '#4f46e5',
        
        // Additional New Auras
        'Meteor': '#f59e0b', 'Radiation': '#84cc16',
        'Fault: Fatal': '#dc2626', 'Impeached: Emperor': '#fde68a',
        'Manipulative': '#7c3aed', 'Dataglow': '#22d3ee',
        'Atomic: Nucleus': '#14b8a6', 'Lament': '#6366f1',
        'Cosmos: Necrolia': '#581c87', 'Leviathan': '#0c4a6e',
        'Showdown': '#fbbf24', '《Celestial: Memoria Aeternum》': '#fef9c3',
        'Atlas: A.T.L.A.S': '#64748b',
        
        // Common Auras
        'Basic': '#d1d5db', 'Simple': '#d1d5db', 'Plain': '#d1d5db',
        'Ordinary': '#d1d5db', 'Standard': '#d1d5db',
        
        // Cosmic
        'Abomination': '#7c2d12',
        
        // Halloween Auras - Pumpkin Moon
        'Pumpkin': '#ff8c00', 'Pumpkin: Spice': '#f97316', 'Pumpkin: Lantern': '#fbbf24',
        'Gingerbread': '#8b4513', 'Gingerbread: Haunted': '#7c2d12',
        'Headless :Horseman': '#1e293b', 'PHANTASMA': '#8b5cf6',
        '< A R A C H N O P H O B I A >': '#0f172a', 'Autumn: Spooky': '#dc2626',
        
        // Halloween Auras - Graveyard
        'Headless': '#64748b', 'APOCALYPSE': '#7c2d12', '〔BANSHEE〕': '#c4b5fd',
        'RAVAGE': '#991b1b', 'Lost Soul': '#6366f1', 'Lost Soul: Vengeful': '#7c3aed', 'Lost Soul: Tormented': '#581c87',
        'Undead': '#4ade80', 'Undead: Devil': '#16a34a', 'Undead: Lich': '#059669',
        'Raven': '#0f172a', 'Raven: Nevermore': '#1e293b', 'Raven: Omen': '#374151',
        'Dullahan': '#1e293b', 'Dullahan: Headless': '#475569', 'Dullahan: Reaper': '#0f172a',
        'Spectre': '#a78bfa', 'Spectre: Poltergeist': '#a855f7', 'Spectre: Wraith': '#9333ea',
        'Terror': '#1e293b', 'Terror: Phobia': '#111827', 'Terror: Nightmare': '#0f172a',
        'Nightmare Sky': '#1e1b4b', 'Nightmare Sky: Abyss': '#1e3a8a', 'Nightmare Sky: Eclipse': '#0c0a09',
        
        // Halloween Auras - Blood Rain
        'Vampiric': '#be123c', 'Vampiric: Bloodmoon': '#991b1b',
        'Accursed': '#b91c1c', 'MALEDICTION': '#7c2d12', 'LAMENTHYR': '#450a0a',
        'Erebus': '#450a0a',
        'Bloodlust': '#be123c', 'Bloodlust: Sanguine': '#7f1d1d', 'Bloodlust: Carnage': '#450a0a',
        'Bleeding': '#b91c1c', 'Bleeding: Ichor': '#be123c', 'Bleeding: Hemophilia': '#991b1b',
        'Crimson': '#dc2626', 'Crimson: Flesh': '#991b1b', 'Crimson: Ichor': '#7f1d1d', 'Crimson: Corruption': '#7c2d12',
        'Rage: Bloodrage': '#7c0000',
        'Ruby: Bloodstone': '#b91c1c',
        'Diaboli': '#dc2626', 'Diaboli: Void': '#7c2d12', 'Diaboli: Hellspawn': '#991b1b',
        
        // Special
        'Memory: The Fallen': '#64748b', 'Oblivion': '#0f172a'
    };
    return auraColors[auraName] || '#ffffff';
}

// Get unique Google Font for each aura
function getAuraFont(auraName) {
    const auraFonts = {
        // Common & Uncommon
        'Nothing': 'Arial',
        'Common': 'Segoe UI',
        'Common: Archetype': 'Teko',
        'Uncommon': 'Roboto',
        'Uncommon: Aberration': 'Righteous',
        'Good': 'Lato',
        'Natural': 'Exo 2',
        'Good: Virtuous': 'Cinzel',
        'Natural: Overgrowth': 'MedievalSharp',
        
        // Rare
        'Rare': 'Orbitron',
        'Divinus': 'Cinzel Decorative',
        'Crystallized': 'Share Tech Mono',
        '★': 'Russo One',
        'Rage': 'Black Ops One',
        'Topaz': 'Audiowide',
        'Crystallized: Geode': 'Iceland',
        '★: Supernova': 'Atomic Age',
        'Topaz: Charged': 'Bungee',
        
        // Epic
        'Glacier': 'Play',
        'Ruby': 'Metal Mania',
        'Forbidden': 'Butcherman',
        'Forbidden: ERROR': 'Press Start 2P',
        'Emerald': 'Uncial Antiqua',
        'Gilded': 'Rye',
        'Ink': 'Special Elite',
        'Jackpot': 'Bungee Shade',
        'Sapphire': 'Anton',
        'Aquamarine': 'Gruppo',
        'Wind': 'Caesar Dressing',
        'Glacier: Winterheart': 'Permanent Marker',
        'Ruby: Incandescent': 'Eater',
        'Forbidden: Unleashed': 'Emblema One',
        'Gilded: Midas': 'UnifrakturMaguntia',
        'Ink: Rorschach': 'Creepster',
        'Jackpot: Favor': 'Fascinate',
        'Wind: Tempest': 'Trade Winds',
        'Emerald: Verdant': 'Shadows Into Light',
        'Sapphire: Insight': 'Saira',
        'Aquamarine: Abyss': 'Nova Mono',
        
        // Legendary
        '★★': 'Bebas Neue',
        'Diaboli': 'Dokdo',
        'Precious': 'Rubik Mono One',
        'Atomic': 'Michroma',
        'Glock': 'Rammetto One',
        'Magnetic': 'Electrolize',
        'Ash': 'Smokum',
        'Player': 'Silkscreen',
        'Fault': 'Rubik Moonrocks',
        'Pukeko': 'Sniglet',
        'Sand Bucket': 'Pirata One',
        'Cola': 'Knewave',
        'Flora': 'Lacquer',
        'Sidereum': 'Orbitron',
        'Bleeding': 'Barrio',
        'Lunar': 'Quicksand',
        'Solar': 'Sunflower',
        'Eclipse': 'Holtwood One SC',
        'Flushed': 'Freckle Face',
        'Hazard': 'Sarpanch',
        'Precious: Priceless': 'Megrim',
        'Glock: Ricochet': 'Jolly Lodger',
        'Ash: Phoenix': 'Henny Penny',
        'Pukeko: Guardian': 'Dela Gothic One',
        'Sand Bucket: Castle': 'Mountains of Christmas',
        'Cola: Effervescence': 'Fontdiner Swanky',
        'Cola: Witches Brew': 'Griffy',
        '★★: Binary': 'Monoton',
        'Player: HUD': 'VT323',
        'Player: Invader': 'Pixelify Sans',
        '▣ PIXELATION ▣': 'Rubik Pixels',
        '▣ PIXELATION ▣: Voxel': 'Pixelify Sans',
        'Mastermind': 'Rubik Pixels',
        'Fault: Tectonic': 'New Rocker',
        'Sidereum: Constellation': 'Geostar',
        'Bleeding: Ichor': 'Iceberg',
        
        // Mythic
        'Quartz': 'Qwitcher Grypen',
        'Honey': 'Lily Script One',
        'Lost Soul': 'Nosifer',
        'Atomic: Riboneucleic': 'Share Tech',
        '★★★': 'Faster One',
        'Undead': 'Underdog',
        'Corrosive': 'Stalinist One',
        'Rage: Heated': 'Rubik Burned',
        'Rage: Berserker': 'Rubik Wet Paint',
        'Leak': 'Warnes',
        'Ink Leak': 'Courier Prime',
        'Powered': 'Wallpoet',
        'Eclipse: Total': 'Butcherman',
        'Ink Leak: Flood': 'Special Elite',
        'Prism': 'Almendra',
        'Prism: Spectrum': 'Spectral',
        'Starfish Rider': 'Sail',
        'Copper': 'Sevillana',
        'Watt': 'Turret Road',
        'Watt: Superconductor': 'Geo',
        'Quartz: Resonant': 'Aladin',
        'Honey: Ambrosia': 'Pinyon Script',
        'Lost Soul: Vengeful': 'Londrina Shadow',
        'Corrosive: Meltdown': 'Erica One',
        'Starfish Rider: Celestial': 'Sail',
        '★★★: Trinary': 'Zen Dots',
        'Powered: Overclocked': 'Audiowide',
        'Leak: Breach': 'Nabla',
        'Copper: Patina': 'IM Fell English SC',
        
        // Exotic
        'Aquatic': 'Water Brush',
        'Lightning': 'Electrolize',
        'Starlight': 'Italiana',
        'Star Rider': 'Sancreek',
        'Flushed: Lobotomy': 'Finger Paint',
        'Hazard: Rays': 'Iceberg',
        'Hazard: Fallout': 'Radioactive',
        'Nautilus': 'Sahitya',
        'Permafrost': 'Iceland',
        'Flow': 'IBM Plex Mono',
        'Flow: Stasis': 'Oxanium',
        'Stormal': 'Squada One',
        'Stormal: Eyewall': 'Metal',
        'Pump': 'Bowlby One SC',
        'PUMP : TRICKSTER': 'Ruge Boogie',
        'Exotic': 'Josefin Slab',
        'Diaboli: Void': 'Bonbon',
        'Comet': 'Bakbak One',
        'Undead: Devil': 'Macabre',
        'Divinus: Angel': 'Cinzel',
        'Lightning: Kugelblitz': 'Geostar Fill',
        'Starlight: Alpenglow': 'Almendra',
        'Permafrost: Rime': 'Gravitas One',
        'Comet: Impactor': 'Unlock',
        'Radiation': 'Radioactive',
        'Radiation: Ultraviolet': 'Audiowide',
        'Star Rider': 'Sancreek',
        'Star Rider: Nebula': 'Italiana',
        
        // Divine
        'Jade': 'Suwannaphum',
        'Spectre': 'Creepster',
        'Manta': 'Bahiana',
        'Jazz': 'Jura',
        'Aether': 'Abril Fatface',
        'Aether: Quintessence': 'Uncial Antiqua',
        'Bounded': 'Rubik Glitch',
        'Retrospective': 'Press Start 2P',
        'Retrospective: Nostalgia': 'Silkscreen',
        'Watermelon': 'Modak',
        'Celestial': 'Philosopher',
        'Terror': 'Plaster',
        'Raven': 'Federant',
        'Warlock': 'Metamorphous',
        'Kyawthuite': 'Megrim',
        'Jade: Dragon': 'Kablammo',
        'Spectre: Poltergeist': 'Spectral',
        'Jazz: Blues': 'Bebas Neue',
        'Bounded: Paradox': 'Major Mono Display',
        'Watermelon: Rush': 'Libre Barcode 39',
        'Manta: Aetherwing': 'Manrope',
        'Terror: Phobia': 'Rubik Spray Paint',
        'Warlock: Patron': 'Sedgwick Ave',
        'Raven: Nevermore': 'Henny Penny',
        'Meteor': 'Bakbak One',
        'Meteor: Impact': 'Eater',
        
        // Celestial
        'Arcane': 'Nosifer',
        ':troll:': 'Comic Neue',
        ':troll:: Epic': 'Slackey',
        'Magnetic: Reverse Polarity': 'Quantico',
        'Magnetic: Lodestar': 'Jost',
        'Undefined': 'Azeret Mono',
        'Undefined: Defined': 'Inconsolata',
        'Rage: Brawler': 'Fugaz One',
        'Astral': 'Spline Sans Mono',
        'Cosmos': 'Space Mono',
        'Gravitational': 'Rubik Iso',
        'Unbound': 'Rubik Doodle Shadow',
        'Unbound: Freedom': 'Libre Franklin',
        'Virtual': 'Matrix',
        'Parasite': 'Rubik Vinyl',
        'Lunar C Nightfall': 'Offside',
        'Savior': 'Righteous',
        'Shiftlock': 'Lexend',
        'Alice': 'Mrs Saint Delafield',
        'Wonderland': 'Happy Monkey',
        'Aquatic: Flame': 'Rubik Gemstones',
        'Poseidon': 'Stick No Bills',
        'Zeus': 'Yusei Magic',
        'Gravitational: Wormhole': 'Vast Shadow',
        'Poseidon: Cybernetic': 'Exo',
        'Zeus: Olympian': 'Bigelow Rules',
        'Cosmos: Singularity': 'Poiret One',
        'Parasite: Symbiote': 'Emilys Candy',
        'Alice: Glass': 'Glass Antiqua',
        'Savior: Messiah': 'Almendra Display',
        'Shiftlock: First Person': 'Amiri',
        'Wonderland: Looking Glass': 'Alice',
        'Lunar C Nightfall: Eclipse': 'Nosifer',
        
        // Transcendent
        'Solar: Solstice': 'Flavors',
        'Solar: Corona': 'Flamenco',
        'Galaxy': 'Germania One',
        'Lunar: Full Moon': 'Milonga',
        'Vital': 'Lobster Two',
        'Anima': 'Spirax',
        'Twilight': 'Indie Flower',
        'Origin': 'Cinzel Decorative',
        'Hades': 'Creepster',
        'Hades: Styx': 'Nosifer',
        'Hades: Develium': 'Griffy',
        'Celestial: Divine': 'Cinzel',
        'Anubis': 'Cinzel Decorative',
        'Hyper-Volt': 'Electrolize',
        'Velocity': 'Turret Road',
        'Nautilus: Lost': 'Mochiy Pop One',
        'Nautilus: Primordial': 'Sedgwick Ave Display',
        'Harnessed': 'Purple Purse',
        'Onion': 'Fascinate Inline',
        'Nihility': 'Zeyada',
        'Nihility: Void': 'Rubik Maze',
        'Helios': 'Rubik Moonrocks',
        'Stargazer': 'Astloch',
        'Moonflower': 'Meddon',
        'Starscourge': 'Rubik Marker Hatch',
        'Sailor': 'Rum Raisin',
        'Sailor: Battleship': 'Piedra',
        'Sailor: Flying Dutchman': 'Pirata One',
        'Glitch': 'Gluten',
        'Hurricane': 'Rampart One',
        'Sirius': 'Siemreap',
        'Santa-Frost': 'Snowburst One',
        'Arcane: Legacy': 'Uncial Antiqua',
        'Lullaby': 'Liu Jian Mao Cao',
        'Lullaby: Sweet Dreams': 'Long Cang',
        'Cryptfire': 'Eater',
        'Dynamic Force': 'Dynalight',
        'Chromatic': 'Rubik Pixels',
        'Chromatic: Diva': 'Shojumaru',
        'Chromatic: Genesis': 'Shrikhand',
        'Chromatic: Exotic': 'Sirin Stencil',
        'Winter Fantasy': 'Trade Winds',
        'Aviator': 'Arapey',
        'Aviator: Fleet': 'Berkshire Swash',
        'Blizzard': 'Bungee Hairline',
        'Arcane: Dark': 'Jacquarda Bastarda 9',
        'Express': 'Racing Sans One',
        'INNOVATOR': 'Michroma',
        'Ethereal': 'Cormorant Garamond',
        'Soul Hunter': 'Creepster',
        'Abominable': 'Snowburst One',
        'kr0mat1k': 'Rubik Distressed',
        'Fatal Error': 'Rubik Glitch',
        'Juxtaposition': 'Judson',
        'Overseer': 'Jomhuria',
        'Exotic: Apex': 'Rubik Broken Fax',
        'Exotic: Void': 'Butcherman',
        'Matrix': 'Share Tech Mono',
        'Runic': 'UnifrakturMaguntia',
        'Runic: Eternal': 'Cinzel Decorative',
        'Sentinel': 'Saira Condensed',
        'M A R T Y R': 'Martian Mono',
        'Nyctophobia': 'Nosifer',
        'Twilight: Iridescent Memory': 'Tangerine',
        'Twilight: Withering Grace': 'Great Vibes',
        'Dullahan': 'Rye',
        'Carriage': 'Carattere',
        'Harnessed: Elements': 'Kolker Brush',
        'Virtual: Worldwide': 'Overpass Mono',
        'Starscourge: Radiant': 'Rubik Storm',
        'Overture': 'Orelega One',
        'Overture: History': 'MedievalSharp',
        'Overture: Future': 'Orbitron',
        'Atlas': 'Yatra One',
        'Atlas: Yuletide': 'Mountains of Christmas',
        'THE GLOCK OF THE SKY': 'Faster One',
        'THE GLOCK OF THE SKY: Divine Arms': 'Lacquer',
        'Symphony': 'Cinzel Decorative',
        'Symphony: Eternal': 'Cormorant Garamond',
        'Nightmare Sky': 'Nosifer',
        'Nightmare Sky: Abyss': 'Rubik Burned',
        'Impeached': 'Rubik Dirt',
        'Impeached: I\'m Peach': 'Dangrek',
        'Oppression': 'Black Ops One',
        'Oppression: Tyranny': 'Saira Condensed',
        'Hyper-Volt: Ever Storm': 'Electrolize',
        '《 SHARD〡SURFER 》': 'Rakkas',
        '《 SHARD〡SURFER 》: Wave Rider': 'Sahitya',
        'Archangel': 'Cinzel Decorative',
        'Archangel: Overheaven': 'Luxurious Script',
        'Archangel: Seraphim': 'Great Vibes',
        'Astral: Zodiac': 'Ruge Boogie',
        'Astral: Legendarium': 'Rubik Glitch',
        'Bloodlust': 'Rubik Vinyl',
        'Bloodlust: Sanguine': 'Metal Mania',
        'Maelstrom': 'Mochiy Pop One',
        'Maelstrom: Vortex': 'Meddon',
        'Lotusfall': 'Londrina Outline',
        'Lotusfall: Petal Storm': 'Londrina Shadow',
        'Orchestra': 'Oleo Script',
        'Orchestra: Crescendo': 'Orbitron',
        'Flora: Evergreen': 'Fleur De Leah',
        'Flora: Photosynthesis': 'Fontdiner Swanky',
        'Chillsear': 'Iceland',
        'Chillsear: Frostburn': 'Caesar Dressing',
        'Abyssal Hunter': 'Gruppo',
        'Abyssal Hunter: Awakened': 'Gravitas One',
        'Aegis - Watergun': 'Water Brush',
        'Aegis': 'Rubik Iso',
        'Gargantua': 'Metal',
        'Gargantua: Titan': 'Eater',
        'Apostolos': 'Amatic SC',
        'Apostolos: Veil': 'Almendra',
        'Unknown': 'VT323',
        'Kyawthuite: Remembrance': 'Bahiana',
        'Kyawthuite: Facet': 'Geo',
        'Ruins': 'Metamorphous',
        'Ruins: Withered': 'Creepster',
        'Matrix: Overdrive': 'Rubik Gemstones',
        'Matrix: Reality': 'Nova Mono',
        'Dreammetric': 'Rubik Marker Hatch',
        'Dreammetric: Lucid': 'Fontdiner Swanky',
        'Dreamscape': 'Rubik Doodle Shadow',
        'Dreamscape: Reverie': 'Sail',
        'Elude': 'Rubik Wet Paint',
        'Elude: Phantom': 'Megrim',
        'Sophyra': 'Philosopher',
        'Sophyra: Wisdom': 'Lacquer',
        'Prologue': 'Paprika',
        'Prologue: Beginning': 'Piedra',
        'Harvester': 'Metal Mania',
        'Harvester: Scythe': 'Bonbon',
        'Sovereign': 'Sevillana',
        'Sovereign: Divine': 'Rammetto One',
        'Luminosity': 'Combo',
        'Manipulative': 'Sedgwick Ave',
        'Manipulative: Puppetmaster': 'Creepster',
        'Dataglow': 'Matrix',
        'Dataglow: Binary': 'VT323',
        'Lament': 'Londrina Shadow',
        'Lament: Requiem': 'Cinzel',
        'Showdown': 'Yusei Magic',
        'Showdown: High Noon': 'Rye',
        'Leviathan': 'Stick No Bills',
        'Leviathan: Depths': 'Sahitya',
        'Aegis: Fortress': 'Germania One',
        'Luminosity: Brilliant': 'UnifrakturMaguntia',
        '『E Q U I N O X』': 'Quantico',
        '『E Q U I N O X』: Equilibrium': 'Aladin',
        '『E Q U I N O X』: Zenith': 'Play',
        'Anubis: Scales': 'Righteous',
        'Glitch: Segfault': 'Share Tech Mono',
        'Galaxy: Quasar': 'Wallpoet',
        'Vital: Lifeforce': 'Lobster Two',
        'Anima: Spiritus': 'Spirax',
        'Origin: Genesis': 'Zilla Slab',
        'Velocity: Hypersonic': 'Faster One',
        'Onion: Layers': 'Fascinate Inline',
        'Helios: Radiance': 'Rubik Moonrocks',
        'Stargazer: Constellation': 'Astloch',
        'Moonflower: Bloom': 'Meddon',
        'Hurricane: Cyclone': 'Rampart One',
        'Sirius: Binary Star': 'Siemreap',
        'Santa-Frost: Blitzen': 'Snowburst One',
        'Cryptfire: Inferno': 'Eater',
        'Dynamic Force: Kinetic': 'Dynalight',
        'Winter Fantasy: Snowfall': 'Trade Winds',
        'Blizzard: Whiteout': 'Bungee Hairline',
        'Express: Bullet Train': 'Pacifico',
        'INNOVATOR: Inventor': 'Advent Pro',
        'Ethereal: Phantom': 'Engagement',
        'Soul Hunter: Reaper': 'Rubik Beastly',
        'Abominable: Yeti': 'Snowburst One',
        'kr0mat1k: RGB': 'Rubik Distressed',
        'Fatal Error: Exception': 'Rubik Glitch',
        'Juxtaposition: Contrast': 'Judson',
        'Overseer: Watcher': 'Jomhuria',
        'Sentinel: Guardian': 'Sintony',
        'M A R T Y R: Sacrifice': 'Martian Mono',
        'Nyctophobia: Darkness': 'Nosifer',
        'Dullahan: Headless': 'Rye',
        'Carriage: Golden': 'Carattere',
        
        // Cosmic
        'Abomination': 'New Rocker',
        
        // Special
        'Memory: The Fallen': 'Special Elite',
        'Oblivion': 'Shadows Into Light Two',
        
        // New Unique Auras
        'Marionette': 'Creepster', 'Marionette: Puppeteer': 'Nosifer',
        'Kaleidoscope': 'Righteous', 'Kaleidoscope: Fractal': 'Orbitron',
        'Mirage': 'Almendra', 'Mirage: Oasis': 'Sahitya',
        'Clockwork': 'Michroma', 'Clockwork: Automaton': 'Share Tech Mono',
        'Carnival': 'Bungee Shade', 'Carnival: Ringmaster': 'Fascinate',
        'Orion': 'Geostar',
        
        // Crimson Biome Auras
        'Crimson': 'Metal Mania', 'Crimson: Flesh': 'Butcherman', 'Crimson: Ichor': 'Eater',
        'Vertebrae': 'UnifrakturMaguntia', 'Vertebrae: Spine': 'Dokdo',
        'Hemogoblin': 'Barrio', 'Hemogoblin: Crimson Heart': 'Iceberg',
        'Brain': 'Rubik Glitch', 'Crimtane': 'Ruge Boogie', 'Crimtane: Ore': 'Smokum',
        'Vicious': 'Fugaz One', 'Vicious: Tendril': 'Rubik Wet Paint',
        
        // Coffee/Cozy Themed Auras
        'Espresso': 'Bebas Neue', 'Espresso: Double Shot': 'Anton',
        'Latte': 'Quicksand', 'Latte: Caramel': 'Modak',
        'Cappuccino': 'Jura', 'Cappuccino: Foam Art': 'Lily Script One',
        'Mocha': 'Sevillana', 'Mocha: Dark Chocolate': 'IM Fell English SC',
        'Vanilla': 'Pinyon Script', 'Vanilla: Bean': 'Almendra Display',
        'Cinnamon': 'Spicy Rice', 'Cinnamon: Spice': 'Flamenco',
        'Maple': 'Flavors', 'Maple: Syrup': 'Mountains of Christmas',
        'Autumn': 'Sunflower', 'Autumn: Harvest': 'Holtwood One SC', 'Autumn: Spooky': 'Creepster',
        'Cozy': 'Happy Monkey', 'Cozy: Fireplace': 'Henny Penny',
        'Bookshelf': 'Philosopher', 'Bookshelf: Library': 'Libre Baskerville',
        
        // Halloween Auras - Pumpkin Moon
        'Pumpkin': 'Creepster', 'Pumpkin: Spice': 'Eater', 'Pumpkin: Lantern': 'Jolly Lodger',
        'Gingerbread': 'Nosifer', 'Gingerbread: Haunted': 'Butcherman',
        'Headless :Horseman': 'Metal Mania', 'PHANTASMA': 'Nosifer',
        '< A R A C H N O P H O B I A >': 'Creepster',
        
        // Halloween Auras - Graveyard
        'Headless': 'Butcherman', 'APOCALYPSE': 'Metal Mania', '〔BANSHEE〕': 'Eater',
        'RAVAGE': 'Nosifer',
        'Lost Soul: Tormented': 'Creepster',
        'Undead: Lich': 'UnifrakturMaguntia',
        'Raven: Nevermore': 'Metal Mania', 'Raven: Omen': 'Butcherman',
        'Dullahan: Reaper': 'Eater',
        'Spectre: Wraith': 'Nosifer',
        'Terror: Nightmare': 'Creepster',
        'Nightmare Sky: Abyss': 'Metal Mania', 'Nightmare Sky: Eclipse': 'Eater',
        
        // Halloween Auras - Blood Rain
        'Vampiric': 'Nosifer', 'Vampiric: Bloodmoon': 'Creepster',
        'Accursed': 'Metal Mania', 'MALEDICTION': 'Eater', 'LAMENTHYR': 'Butcherman',
        'Erebus': 'Nosifer',
        'Bloodlust: Carnage': 'Metal Mania',
        'Bleeding: Hemophilia': 'Butcherman',
        'Crimson: Corruption': 'Eater',
        'Rage: Bloodrage': 'Metal Mania',
        'Ruby: Bloodstone': 'Eater',
        'Diaboli: Hellspawn': 'Nosifer',
        
        // Mid-Tier Auras
        'Neon': 'Electrolize', 'Neon: Glow': 'Turret Road',
        'Obsidian': 'Plaster', 'Obsidian: Volcanic': 'Rubik Burned',
        'Titanium': 'Exo', 'Titanium: Alloy': 'Quantico',
        'Plasma': 'Audiowide', 'Plasma: Ionized': 'Wallpoet',
        'Vortex': 'Squada One', 'Vortex: Spiral': 'Vast Shadow',
        
        // Additional New Auras
        'Meteor': 'Bakbak One', 'Radiation': 'Radioactive',
        'Fault: Fatal': 'Rubik Moonrocks', 'Impeached: Emperor': 'Bigelow Rules',
        'Manipulative': 'Sedgwick Ave', 'Dataglow': 'Matrix',
        'Atomic: Nucleus': 'Geo', 'Lament': 'Londrina Shadow',
        'Cosmos: Necrolia': 'Metamorphous', 'Leviathan': 'Stick No Bills',
        'Showdown': 'Yusei Magic', '《Celestial: Memoria Aeternum》': 'Cinzel Decorative',
        'Atlas: A.T.L.A.S': 'Germania One',
        
        // Common Auras
        'Basic': 'Segoe UI', 'Simple': 'Roboto', 'Plain': 'Lato',
        'Ordinary': 'Arial', 'Standard': 'Helvetica'
    };
    return auraFonts[auraName] || 'Orbitron';
}

// Get gradient for each aura
function getAuraGradient(auraName) {
    const color = getAuraColor(auraName);
    // Create a gradient based on the base color
    return `linear-gradient(135deg, ${color}, ${shadeColor(color, -0.2)})`;
}

function initCutsceneSystem() {
    const canvas = document.getElementById('cutsceneCanvas');
    if (!canvas) return;
    cutsceneState.canvas = canvas;
    cutsceneState.ctx = canvas.getContext('2d');
    resizeCutsceneCanvas();
    window.addEventListener('resize', resizeCutsceneCanvas);
}

function resizeCutsceneCanvas() {
    if (cutsceneState.canvas) {
        cutsceneState.canvas.width = window.innerWidth;
        cutsceneState.canvas.height = window.innerHeight;
    }
}

async function playUltraRareCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    
    // Save scroll position before cutscene
    cutsceneState.savedScrollX = window.scrollX || window.pageXOffset;
    cutsceneState.savedScrollY = window.scrollY || window.pageYOffset;
    
    // Get elements first
    const cutscene = document.getElementById('ultraRareCutscene');
    const title = document.getElementById('cutsceneTitle');
    const auraNameEl = document.getElementById('cutsceneAuraName');
    const rarityEl = document.getElementById('cutsceneRarity');
    
    // Hide aura name, rarity, and title IMMEDIATELY to prevent flash during bass drop
    auraNameEl.style.display = 'none';
    rarityEl.style.display = 'none';
    title.style.display = 'none';
    
    // Check if this is a global aura (>99999998 rarity)
    const isGlobal = aura.rarity > 99999998;
    
    // If it's a global, add fade to black intro with bass drop
    if (isGlobal) {
        await fadeToBlackIntro();
    }

    Object.assign(cutsceneState, {
        currentColor: getAuraColor(aura.name), crackProgress: 0, cracks: [], shards: [],
        warpStars: [], warpActive: false, warpSpeed: 0, cameraShake: 0, cameraZoom: 1,
        text3D: { opacity: 0, scale: 0.8, yOffset: 50, depth: 15 },
        currentAuraRarity: aura.rarity // **MODIFIED:** Store the rarity here
    });

    cutscene.style.opacity = 1;
    auraNameEl.textContent = aura.name; // Keep this for the draw3DText to pick up
    auraNameEl.style.fontFamily = getAuraFont(aura.name);
    title.textContent = `THE SEAL IS BREAKING...`;
    title.style.color = '#ffffff';
    [title].forEach(el => el.style.opacity = 0); // Only title needs opacity 0 initially

    cutscene.classList.add('active');
    
    // Pause biome music during cutscene
    if (typeof pauseBiomeMusic === 'function') {
        pauseBiomeMusic();
    }
    
    generateCracks();
    startParticleSystem();
    startCutsceneAnimation(); 

    await animateSealBreakingTimeline(title, auraNameEl, rarityEl, aura);
}

function animateSealBreakingTimeline(title, auraNameEl, rarityEl, aura) {
    const cutsceneEl = document.getElementById('ultraRareCutscene');
    
    // Elements are already hidden in playUltraRareCutscene() function

    // Add reality warp overlay for dramatic effect
    const warpOverlay = document.createElement('div');
    Object.assign(warpOverlay.style, { 
        position: 'absolute', top: 0, left: 0, width: '100%', 
        height: '100%', background: 'radial-gradient(circle, transparent 0%, rgba(0,0,0,0.5) 100%)',
        opacity: 0, zIndex: 1, pointerEvents: 'none',
        mixBlendMode: 'multiply'
    });
    cutsceneEl.appendChild(warpOverlay);

    // Energy wave rings for dramatic effect
    cutsceneState.energyWaves = [];
    
    const timeline = anime.timeline({
        easing: 'easeOutExpo',
        complete: async () => {
            warpOverlay.remove();
            await closeCutscene(cutsceneEl);
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect(); 
            }
        }
    });

    timeline
        // Phase 1: Dramatic intro with reality distortion
        .add({ 
            targets: warpOverlay, 
            opacity: [0, 0.8], 
            duration: 800,
            easing: 'easeInOutQuad'
        })
        .add({ 
            targets: title, 
            opacity: [0, 1], 
            translateY: [-50, 0],
            scale: [0.8, 1],
            duration: 800,
            easing: 'easeOutElastic(1, .6)'
        }, '-=400')
        .add({ 
            targets: cutsceneState, 
            crackProgress: 0.3, 
            glowIntensity: 0.5, 
            duration: 600, 
            easing: 'easeInQuad',
            begin: () => {
                // Text glitch effect
                const originalText = title.textContent;
                let glitchCount = 0;
                const glitchInterval = setInterval(() => {
                    if (glitchCount++ > 3) {
                        clearInterval(glitchInterval);
                        title.textContent = originalText;
                        return;
                    }
                    title.textContent = '█̴̢̛̗͕̮͎̩̯̺̫̟̹̖̪͎̖̻̠̩̐̂̀̾̎̓́̂̆̾̽̋́͜͝H̷̡̡̢̧̨̘̗̘̪͙̟̳̬͇̘̪͆̌̋̿̈͐̂͒̈́̚̚͜E̸̢̡̘̮͓̫̥̜̗̩̪͉̙̣̝̊̒̆̀͑͂̈́́̒̄̑̚͜͝ ̷̡̧̢̛̗͕̮͎̩̯̺̫̟̹̖̪͎̖̻̠̩̐̂̀̾̎̓́̂̆̾̽̋́͜͝S̷̨̨̧̫̟̹̖̪͎̖̻̠̩̐̂̀̾̎̓́̂̆̾̽̋́͜͝E̸̢̡̘̮͓̫̥̜̗̩̪͉̙̣̝̊̒̆̀͑͂̈́́̒̄̑̚͜͝A̷̡̧̢̛̗͕̮͎̩̯̺̫̟̹̖̪͎̖̻̠̩̐̂̀̾̎̓́̂̆̾̽̋́͜͝L̴̢̛̗͕̮͎̩̯̺̫̟̹̖̪͎̖̻̠̩̐̂̀̾̎̓́̂̆̾̽̋́͜͝...';
                    setTimeout(() => title.textContent = originalText, 50);
                }, 150);
            }
        }, '-=200')
        
        // Phase 2: First major crack with screen shake
        .add({ 
            targets: title,
            color: ['#ffffff', '#ffaa00', '#ffffff'],
            duration: 300,
            easing: 'easeInOutQuad'
        })
        .add({ 
            targets: cutsceneState, 
            crackProgress: 0.6, 
            cameraShake: 15, 
            glowIntensity: 2,
            duration: 700, 
            easing: 'easeInQuad',
            begin: () => {
                // Create energy wave
                createEnergyWave(cutsceneState, getAuraColor(aura.name));
            }
        }, '-=100')
        
        // Phase 3: Reality fracture intensifies
        .add({ 
            targets: title,
            textContent: 'REALITY FRACTURING...',
            duration: 1,
            easing: 'linear'
        })
        .add({ 
            targets: cutsceneState, 
            crackProgress: 0.85, 
            cameraShake: 25,
            glowIntensity: 3.5,
            cameraZoom: 1.1,
            duration: 800, 
            easing: 'easeInQuad',
            begin: () => {
                createEnergyWave(cutsceneState, getAuraColor(aura.name));
                // Pulse effect on title
                anime({
                    targets: title,
                    scale: [1, 1.1, 1],
                    duration: 300,
                    easing: 'easeInOutQuad'
                });
            }
        })
        
        // Phase 4: CRITICAL - Seal shattering
        .add({ 
            targets: title,
            textContent: 'THE SEAL SHATTERS!',
            duration: 1,
            easing: 'linear'
        })
        .add({
            targets: cutsceneState, 
            crackProgress: 1.0, 
            glowIntensity: 6, 
            cameraShake: 35, 
            cameraZoom: 1.25, 
            duration: 500, 
            easing: 'easeInExpo',
            begin: () => {
                // Multiple energy waves
                createEnergyWave(cutsceneState, getAuraColor(aura.name));
                setTimeout(() => createEnergyWave(cutsceneState, '#ffffff'), 100);
                setTimeout(() => createEnergyWave(cutsceneState, getAuraColor(aura.name)), 200);
                
                // Screen flash effect
                const flashOverlay = document.createElement('div');
                Object.assign(flashOverlay.style, { 
                    position: 'absolute', top: 0, left: 0, width: '100%', 
                    height: '100%', backgroundColor: getAuraColor(aura.name), 
                    opacity: 0, zIndex: 9998, mixBlendMode: 'screen'
                });
                cutsceneEl.appendChild(flashOverlay);
                anime({ 
                    targets: flashOverlay, 
                    opacity: [0, 0.7, 0], 
                    duration: 600, 
                    easing: 'easeInOutQuad',
                    complete: () => flashOverlay.remove()
                });
                
                // Fade out title dramatically
                anime({
                    targets: title,
                    opacity: 0,
                    scale: 1.5,
                    filter: ['blur(0px)', 'blur(10px)'],
                    duration: 400,
                    easing: 'easeInQuad'
                });
            },
            complete: () => { 
                createSealShards(); 
                startWarpEffect(); 
            }
        })
        
        // Phase 5: Warp tunnel with dimensional rift effect
        .add({ 
            targets: cutsceneState, 
            warpSpeed: 35, 
            cameraShake: 0, 
            cameraZoom: 1,
            duration: 2000, 
            easing: 'easeInCubic',
            begin: () => {
                // Add chromatic aberration effect
                const canvas = document.getElementById('cutsceneCanvas');
                if (canvas) {
                    canvas.style.filter = 'contrast(1.2) saturate(1.3)';
                }
            }
        }, '-=200')
        
        // Phase 6: Aura revelation with dramatic entrance
        .add({ 
            targets: cutsceneState.text3D, 
            opacity: [0, 1], 
            scale: [0.5, 1.2, 1], 
            yOffset: [100, -20, 0], 
            duration: 1400, 
            easing: 'easeOutElastic(1, .6)',
            begin: () => {
                cutsceneState.currentAuraRarity = aura.rarity;
                
                // Create expanding light ring
                const lightRing = document.createElement('div');
                Object.assign(lightRing.style, { 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    width: '50px', 
                    height: '50px',
                    borderRadius: '50%',
                    border: `3px solid ${getAuraColor(aura.name)}`,
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.8,
                    zIndex: 100,
                    boxShadow: `0 0 30px ${getAuraColor(aura.name)}`
                });
                cutsceneEl.appendChild(lightRing);
                anime({ 
                    targets: lightRing, 
                    width: '800px',
                    height: '800px',
                    opacity: 0,
                    duration: 1200, 
                    easing: 'easeOutQuad',
                    complete: () => lightRing.remove()
                });
            }
        }, '-=1200')
        
        // Phase 7: Final dramatic exit
        .add({
            targets: cutsceneEl, 
            opacity: 0, 
            duration: 600, 
            easing: 'easeInQuad',
            begin: () => {
                const flash = document.createElement('div');
                Object.assign(flash.style, { 
                    position: 'absolute', top: 0, left: 0, width: '100%', 
                    height: '100%', backgroundColor: '#ffffff', opacity: 0, zIndex: 9999 
                });
                cutsceneEl.appendChild(flash);
                anime({ 
                    targets: flash, 
                    opacity: [0, 1, 0], 
                    duration: 500, 
                    easing: 'easeInOutQuad', 
                    complete: () => flash.remove() 
                });
            }
        }, '+=2200');

    return timeline.finished;
}

// Helper function to create energy wave effects
function createEnergyWave(state, color) {
    if (!state.energyWaves) state.energyWaves = [];
    state.energyWaves.push({
        radius: 0,
        opacity: 1,
        color: color
    });
}

// =================================================================
// NEW: 100M+ Cosmic Star Cutscene (Replaces the lightning one)
// =================================================================

async function playUltraRare99MCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    
    // Fade to black with bass drop
    await fadeToBlackIntro();
    
    const cutscene = document.getElementById('ultraRareCutscene');
    const cutsceneCanvas = document.getElementById('cutsceneCanvas');

    if (cutsceneCanvas) cutsceneCanvas.style.display = 'block';

    Object.assign(cutsceneState, {
        currentColor: getAuraColor(aura.name),
        starCore: { radius: 0, opacity: 0, glow: 0, color: getAuraColor(aura.name) },
        starParticles: [],
        cosmicAura: { opacity: 0, scale: 0.8, yOffset: 50, depth: 15 },
        warpActive: false,
        warpSpeed: 0,
        cameraShake: 0,
        cameraZoom: 1,
        currentAuraRarity: aura.rarity
    });

    cutscene.style.opacity = 1;
    cutscene.classList.add('active');
    
    // Pause biome music during cutscene
    if (typeof pauseBiomeMusic === 'function') {
        pauseBiomeMusic();
    }
    
    document.getElementById('cutsceneTitle').style.opacity = 0;
    document.getElementById('cutsceneAuraName').textContent = aura.name;
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;

    startParticleSystem();
    startWarpEffect();
    startCutsceneAnimation();

    await animateCosmicStarTimeline(cutscene, aura);
}

function animateCosmicStarTimeline(cutsceneEl, aura) {
    return new Promise((resolve) => {
        const timeline = anime.timeline({
            easing: 'easeOutExpo',
            complete: async () => {
                await closeCutscene(cutsceneEl);
                if (shouldTriggerDeepFriedEffect(aura)) {
                    await triggerDeepFriedEffect();
                }
                resolve();
            }
        });

        timeline
            .add({ 
                targets: cutsceneState.starCore, 
                radius: [0, 50],
                opacity: [0, 1],
                glow: [0, 3],
                duration: 1000 
            })
            .add({ 
                targets: cutsceneState, 
                warpSpeed: 2, 
                duration: 2000, 
                easing: 'easeInQuad' 
            }, '-=500')
            .add({ 
                targets: cutsceneState.starCore, 
                radius: 200,
                glow: 8, 
                duration: 3000, 
                easing: 'easeInQuad' 
            })
            .add({
                targets: cutsceneState,
                cameraZoom: 1.5,
                cameraShake: 15,
                duration: 1000,
                easing: 'easeInExpo'
            })
            .add({ 
                targets: cutsceneState.cosmicAura, 
                opacity: 1,
                scale: 1,
                yOffset: 0,
                duration: 1500,
                easing: 'easeOutCubic'
            }, '-=1000')
            .add({
                targets: cutsceneState.starCore,
                opacity: 0,
                radius: 500,
                duration: 800,
                easing: 'easeInExpo'
            })
            .add({
                duration: 500
            });
    });
}



// **MODIFIED:** Now async and triggers the deep fried effect
async function closeCutscene(cutscene) {
    // Instantly hide the cutscene container
    cutscene.style.opacity = '0';
    cutscene.classList.remove('active');
    
    // Resume biome music after cutscene
    if (typeof resumeBiomeMusic === 'function') {
        resumeBiomeMusic();
    }
    
    // Reset the state
    cutsceneState.active = false;
    if (cutsceneState.ctx) {
        cutsceneState.ctx.clearRect(0, 0, cutsceneState.canvas.width, cutsceneState.canvas.height);
    }
    cutsceneState.currentAuraRarity = 0; // Reset rarity tracker
    
    // Restore scroll position after cutscene
    if (cutsceneState.savedScrollX !== undefined && cutsceneState.savedScrollY !== undefined) {
        window.scrollTo(cutsceneState.savedScrollX, cutsceneState.savedScrollY);
        cutsceneState.savedScrollX = undefined;
        cutsceneState.savedScrollY = undefined;
    }
    
    // Force pointer events to be disabled immediately
    cutscene.style.pointerEvents = 'none';
    
    // Ensure all video elements are stopped and hidden
    document.querySelectorAll('#ultraRareCutscene video').forEach(video => {
        video.pause();
        video.currentTime = 0;
        video.style.display = 'none';
    });
    // Ensure the canvas is re-enabled for the next non-video cutscene
    const canvas = document.getElementById('cutsceneCanvas');
    if (canvas) canvas.style.display = 'block';
}


// =================================================================
// Special Cutscene Functions for MP4 Videos
// =================================================================

// Helper function for fade-to-black intro
async function fadeToBlackIntro() {
    const cutscene = document.getElementById('ultraRareCutscene');
    
    // Hide ALL text elements IMMEDIATELY before showing black screen
    const title = document.getElementById('cutsceneTitle');
    const auraName = document.getElementById('cutsceneAuraName');
    const rarity = document.getElementById('cutsceneRarity');
    if (title) title.style.display = 'none';
    if (auraName) auraName.style.display = 'none';
    if (rarity) rarity.style.display = 'none';
    
    cutscene.style.opacity = 1;
    cutscene.classList.add('active');
    cutscene.style.backgroundColor = 'rgba(0, 0, 0, 1)';
    
    // Pause biome music during cutscene
    if (typeof pauseBiomeMusic === 'function') {
        pauseBiomeMusic();
    }
    
    // Play bass drop sound
    const bassDropAudio = new Audio('bass drop.mp3');
    bassDropAudio.volume = 0.7;
    bassDropAudio.play().catch(err => console.log('Bass drop audio failed:', err));
    
    await new Promise(resolve => {
        anime({
            targets: cutscene,
            opacity: [0, 1],
            duration: 800,
            easing: 'easeInQuad',
            complete: resolve
        });
    });
    
    // Wait 1.5 seconds in darkness
    await new Promise(resolve => setTimeout(resolve, 1500));
}

// Helper function to configure video for mobile playback
function setupVideoForMobile(videoElement) {
    videoElement.playsInline = true; // Critical for iOS
    videoElement.muted = false; // Enable audio
    videoElement.volume = 1.0; // Full volume
    videoElement.setAttribute('playsinline', ''); // Webkit compatibility
    videoElement.setAttribute('webkit-playsinline', ''); // Older iOS
    videoElement.setAttribute('autoplay', ''); // Try autoplay
    videoElement.controls = false;
    videoElement.preload = 'auto';
    videoElement.defaultMuted = false;
}

// Helper function to play video with fallback for mobile
async function playVideoWithFallback(videoElement) {
    try {
        // Try to play the video
        await videoElement.play();
        console.log('✅ Video playing successfully');
        return true;
    } catch (error) {
        console.warn('⚠️ Autoplay blocked:', error.message);
        
        // Show tap-to-play overlay for mobile
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                cursor: pointer;
            `;
            
            overlay.innerHTML = `
                <div style="text-align: center; color: white;">
                    <div style="font-size: 64px; margin-bottom: 20px;">▶️</div>
                    <div style="font-size: 24px; font-weight: bold;">Tap to Play Cutscene</div>
                </div>
            `;
            
            const handleTap = async () => {
                try {
                    await videoElement.play();
                    overlay.remove();
                    resolve(true);
                } catch (err) {
                    console.error('Error playing video after tap:', err);
                    overlay.remove();
                    resolve(false);
                }
            };
            
            overlay.addEventListener('click', handleTap);
            overlay.addEventListener('touchend', handleTap);
            
            document.getElementById('ultraRareCutscene').appendChild(overlay);
        });
    }
}

async function playAbyssalHunterCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    
    // Fade to black + wait
    await fadeToBlackIntro();
    
    // Now setup and play video
    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active'); // SHOW the cutscene container!
    
    const videoElement = document.getElementById('abyssalHunterVideo');
    setupVideoForMobile(videoElement); // Configure for mobile
    videoElement.innerHTML = `<source src="abyssal_hunter.mp4" type="video/mp4">`;
    videoElement.load();
    
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;
    
    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

// =================================================================


async function playAbominationCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;
    
    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();
    
    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('abominationVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="abomination.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';

    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;
    
    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

function generateCosmicCracks() {
    // This is a placeholder as it's not currently used by the video cutscenes.
    // Kept for potential future use or other custom cutscenes.
}


async function playApostolosCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('apostolosVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="apos.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';

    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playOblivionCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('oblivionVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="oblivion.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';

    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playMemoryCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('memoryVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="memory.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;
    
    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playEdenCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    // Hide video elements and use canvas
    document.getElementById('cutsceneCanvas').style.display = 'block';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    const canvas = document.getElementById('cutsceneCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Hide default text elements
    document.getElementById('cutsceneTitle').style.display = 'none';
    document.getElementById('cutsceneAuraName').style.display = 'none';
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    cutsceneState.ctx = ctx;
    cutsceneState.canvas = canvas;
    
    // Dialogue sequence
    const dialogue = [
        { speaker: "???", text: "You have ventured beyond the veil...", duration: 3000 },
        { speaker: "???", text: "Into the space between existence and nothing.", duration: 3500 },
        { speaker: "EDEN", text: "I am Eden.", duration: 2500 },
        { speaker: "EDEN", text: "Born from the architect of The Limbo.", duration: 3000 },
        { speaker: "EDEN", text: "I am the void's consciousness...", duration: 3000 },
        { speaker: "EDEN", text: "The silence that speaks.", duration: 2500 },
        { speaker: "EDEN", text: "You have been chosen.", duration: 2500 }
    ];
    
    return new Promise(async (resolve) => {
        let animationFrame;
        let time = 0;
        let dialogueIndex = 0;
        let dialogueStartTime = Date.now();
        let voidParticles = [];
        let cracks = [];
        let crackProgress = 0;
        
        // Initialize void particles
        for (let i = 0; i < 150; i++) {
            voidParticles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.3,
                pulseSpeed: Math.random() * 0.02 + 0.01
            });
        }
        
        // Initialize cracks
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            cracks.push({
                startX: canvas.width / 2,
                startY: canvas.height / 2,
                angle: angle,
                length: 0,
                maxLength: Math.random() * 300 + 200,
                branches: []
            });
        }
        
        const animate = () => {
            time += 0.016;
            
            // Black background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw void particles (white)
            voidParticles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                
                // Wrap around screen
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                
                // Pulse effect
                p.opacity += Math.sin(time * p.pulseSpeed) * 0.01;
                p.opacity = Math.max(0.2, Math.min(0.8, p.opacity));
                
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            // Draw void cracks (white lines)
            if (dialogueIndex >= 2) {
                crackProgress += 0.02;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 2;
                
                cracks.forEach(crack => {
                    const currentLength = Math.min(crack.length + 5, crack.maxLength * Math.min(crackProgress, 1));
                    crack.length = currentLength;
                    
                    const endX = crack.startX + Math.cos(crack.angle) * currentLength;
                    const endY = crack.startY + Math.sin(crack.angle) * currentLength;
                    
                    ctx.beginPath();
                    ctx.moveTo(crack.startX, crack.startY);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                    
                    // Add glow
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.lineWidth = 6;
                    ctx.stroke();
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.lineWidth = 2;
                });
            }
            
            // Draw central void eye
            if (dialogueIndex >= 3) {
                const eyeRadius = 50 + Math.sin(time * 2) * 10;
                const gradient = ctx.createRadialGradient(
                    canvas.width / 2, canvas.height / 2, 0,
                    canvas.width / 2, canvas.height / 2, eyeRadius
                );
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height / 2, eyeRadius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Draw dialogue
            const currentDialogue = dialogue[dialogueIndex];
            if (currentDialogue) {
                const elapsed = Date.now() - dialogueStartTime;
                const fadeInDuration = 500;
                const fadeOutDuration = 500;
                const displayDuration = currentDialogue.duration - fadeOutDuration;
                
                let alpha = 1;
                if (elapsed < fadeInDuration) {
                    alpha = elapsed / fadeInDuration;
                } else if (elapsed > displayDuration) {
                    alpha = Math.max(0, 1 - (elapsed - displayDuration) / fadeOutDuration);
                }
                
                // Speaker name
                ctx.font = 'bold 32px Arial';
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.textAlign = 'center';
                ctx.fillText(currentDialogue.speaker, canvas.width / 2, canvas.height - 150);
                
                // Dialogue text
                ctx.font = '24px Arial';
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
                ctx.fillText(currentDialogue.text, canvas.width / 2, canvas.height - 100);
                
                // Check if dialogue should advance
                if (elapsed >= currentDialogue.duration) {
                    dialogueIndex++;
                    dialogueStartTime = Date.now();
                    
                    if (dialogueIndex >= dialogue.length) {
                        // Show Eden name and rarity
                        setTimeout(async () => {
                            // Draw final Eden reveal
                            ctx.fillStyle = '#000000';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            
                            // Draw massive void burst
                            for (let i = 0; i < 5; i++) {
                                const burstRadius = 200 + i * 100;
                                const gradient = ctx.createRadialGradient(
                                    canvas.width / 2, canvas.height / 2, 0,
                                    canvas.width / 2, canvas.height / 2, burstRadius
                                );
                                gradient.addColorStop(0, `rgba(255, 255, 255, ${0.8 - i * 0.15})`);
                                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                                
                                ctx.fillStyle = gradient;
                                ctx.beginPath();
                                ctx.arc(canvas.width / 2, canvas.height / 2, burstRadius, 0, Math.PI * 2);
                                ctx.fill();
                            }
                            
                            // Draw EDEN text
                            ctx.font = 'bold 120px Arial';
                            ctx.fillStyle = '#FFFFFF';
                            ctx.textAlign = 'center';
                            ctx.strokeStyle = '#000000';
                            ctx.lineWidth = 4;
                            ctx.strokeText('EDEN', canvas.width / 2, canvas.height / 2);
                            ctx.fillText('EDEN', canvas.width / 2, canvas.height / 2);
                            
                            // Draw rarity (always show 1/1000 for Eden, even though base rarity is 999 billion)
                            ctx.font = '32px Arial';
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                            ctx.fillText('1 in 1,000', canvas.width / 2, canvas.height / 2 + 80);
                            
                            await new Promise(r => setTimeout(r, 3000));
                            
                            cancelAnimationFrame(animationFrame);
                            await closeCutscene(cutscene);
                            
                            // Trigger deep fried effect
                            await triggerDeepFriedEffect();
                            
                            cutsceneState.active = false;
                            resolve();
                        }, 1000);
                        return;
                    }
                }
            }
            
            animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    });
}

async function playMantaCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('mantaVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="manta.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playBloodlustSanguineCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('sanguineVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="sanguine.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playAtlasCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('atlasVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="atlas.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playAviatorFleetCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('fleetVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="fleet.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playImPeachCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('imPeachVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="im peach.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playLegendariumCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('legendariumVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="legendarium.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playLotusfallCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('lotusfallVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="lotusfall.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playOrchestraCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('orchestraVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="orchestra.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playRuinsCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('ruinsVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="ruins.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playUnknownCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('unknownVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="unknown.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playAegisWatergunCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('watergunVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="watergun.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playWitheringGraceCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('witheringGraceVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="witheringgrace.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playOppressionCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('oppressionVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="opp.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playChromaticGenesisCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    console.log('🎬 Starting Chromatic Genesis cutscene...');
    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('chromaticGenesisVideo');
    console.log('📹 Video element found:', !!videoElement);
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="gen.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            console.log('✅ Chromatic Genesis cutscene ended');
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = (e) => {
            console.error('❌ Chromatic Genesis video error:', e);
            console.error('Video src:', videoElement.currentSrc);
            handleCutsceneEnd();
        };
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement).catch(err => {
            console.error('❌ Failed to play video:', err);
            handleCutsceneEnd();
        });
    });
}

async function playChromaticExoticCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('chromaticExoticVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="chromexotic.mp4" type="video/mp4">`;
    videoElement.load();
    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playArchangelsCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('archangelsVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="arch.mp4" type="video/mp4">`;
    videoElement.load();

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playEquinoxCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('equinoxVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="EQUINOX.mp4" type="video/mp4">`;
    videoElement.load();
    
    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    videoElement.style.display = 'block';

    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playArchangelSeraphimCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('archangelSeraphimVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="sera.mp4" type="video/mp4">`;
    videoElement.load();
    
    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    videoElement.style.display = 'block';

    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playLuminosityCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('luminosityVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="lumi.mp4" type="video/mp4">`;
    videoElement.load();
    
    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    videoElement.style.display = 'block';

    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playDreammetricCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('dreammetricVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="dream.mp4" type="video/mp4">`;
    videoElement.load();
    
    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    videoElement.style.display = 'block';

    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playAegisCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('aegisVideo');
    setupVideoForMobile(videoElement);
    videoElement.innerHTML = `<source src="aegis.mp4" type="video/mp4">`;
    videoElement.load();
    
    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    videoElement.style.display = 'block';

    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playAegisWatergunCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    const cutscene = document.getElementById('ultraRareCutscene');
    
    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();
    
    cutscene.classList.add('active');
    const videoElement = document.getElementById('watergunVideo');
    videoElement.innerHTML = `<source src="watergun.mp4" type="video/mp4">`;
    videoElement.load();

    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playFloraEvergreenCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    const cutscene = document.getElementById('ultraRareCutscene');
    
    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();
    
    cutscene.classList.add('active');
    const videoElement = document.getElementById('evergreenVideo');
    videoElement.innerHTML = `<source src="evergreen.mp4" type="video/mp4">`;
    videoElement.load();

    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;
    
    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playMatrixOverdriveCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    const cutscene = document.getElementById('ultraRareCutscene');
    
    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();
    
    cutscene.classList.add('active');
    const videoElement = document.getElementById('overdriveVideo');
    videoElement.innerHTML = `<source src="overdrive.mp4" type="video/mp4">`;
    videoElement.load();

    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;
    
    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playOvertureFutureCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('overtureFutureVideo');
    videoElement.innerHTML = `<source src="overture future.mp4" type="video/mp4">`;
    videoElement.load();
    
    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;
    
    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playOvertureHistoryCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity; // This correctly sets the rarity

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('overtureHistoryVideo');
    videoElement.innerHTML = `<source src="overture_history.mp4" type="video/mp4">`;
    videoElement.load();
    
    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;
    
    return new Promise((resolve) => {
        let ended = false;

        // =================================================================
        // THIS IS THE CORRECTED LOGIC
        // =================================================================
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;

            // Close cutscene first to show main UI
            await closeCutscene(cutscene);
            
            // THEN trigger deep-fried effect over the main UI (not black screen)
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd; // Also handle errors
        videoElement.play().catch(handleCutsceneEnd); // And play failures
        // =================================================================
    });
}

async function playGargantuaCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('gargantuaVideo');
    videoElement.innerHTML = `<source src="garg.mp4" type="video/mp4">`;
    videoElement.load();

    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playSymphonyCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('symphonyVideo');
    videoElement.innerHTML = `<source src="symphony.mp4" type="video/mp4">`;
    videoElement.load();
    
    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playKyawthuiteCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('kyawthuiteCutsceneVideo');
    videoElement.innerHTML = `<source src="kya.mp4" type="video/mp4">`;
    videoElement.load();
    
    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playMastermindCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    const cutscene = document.getElementById('ultraRareCutscene');
    cutscene.classList.add('active');
    const videoElement = document.getElementById('mastermindVideo');
    videoElement.innerHTML = `<source src="mastermind.mp4" type="video/mp4">`;
    videoElement.load();
    
    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}

async function playAviatorFleetCutscene(aura) {
    if (cutsceneState.active) return;
    cutsceneState.active = true;
    cutsceneState.currentAuraRarity = aura.rarity;

    const cutscene = document.getElementById('ultraRareCutscene');
    const videoElement = document.getElementById('fleetVideo');
    videoElement.innerHTML = `<source src="fleet.mp4" type="video/mp4">`;
    videoElement.load();
    
    document.getElementById('cutsceneCanvas').style.display = 'none';
    await fadeToBlackIntro();

    videoElement.style.display = 'block';
    
    // Hide ALL text during video - keep screen clean, video shows everything
    document.getElementById('cutsceneTitle').style.display = 'none';
    const cutsceneAuraNameEl = document.getElementById('cutsceneAuraName');
    cutsceneAuraNameEl.textContent = aura.name;
    cutsceneAuraNameEl.style.fontFamily = getAuraFont(aura.name);
    cutsceneAuraNameEl.style.display = 'none';
    document.getElementById('cutsceneRarity').textContent = `1 in ${(aura.baseRarity || aura.rarity).toLocaleString()}`;
    document.getElementById('cutsceneRarity').style.display = 'none';
    
    videoElement.currentTime = 0;

    return new Promise((resolve) => {
        let ended = false;
        const handleCutsceneEnd = async () => {
            if (ended) return;
            ended = true;
            
            // Close cutscene first, THEN trigger effect over main UI
            await closeCutscene(cutscene);
            
            if (shouldTriggerDeepFriedEffect(aura)) {
                await triggerDeepFriedEffect();
            }
            
            resolve();
        };

        videoElement.onended = handleCutsceneEnd;
        videoElement.onerror = handleCutsceneEnd;
        
        // Use fallback for mobile
        playVideoWithFallback(videoElement);
    });
}


// =================================================================
// Cutscene Drawing Functions (For Ultra Rare Canvas)
// =================================================================

function generateCracks() {
    cutsceneState.cracks = [];
    for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const length = cutsceneState.sealRadius * (0.8 + Math.random() * 0.4);
        cutsceneState.cracks.push({
            points: [
                { x: Math.cos(angle) * (5 + Math.random() * 20), y: Math.sin(angle) * (5 + Math.random() * 20) }
            ],
            length: length,
            angle: angle + (Math.random() - 0.5) * 0.5,
            split: false
        });
    }
}

function getCrackColor(progress) {
    const p = Math.min(1, progress * 2);
    const r = Math.floor(255 * (1 - p) + 255 * p);
    const g = Math.floor(255 * (1 - p) + 223 * p);
    const b = Math.floor(255 * (1 - p) + 184 * p);
    return `rgb(${r},${g},${b})`;
}

function drawSeal() {
    const { ctx, canvas, crackProgress, glowIntensity, sealRadius, currentColor } = cutsceneState;
    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.shadowBlur = 40 * glowIntensity;
    ctx.shadowColor = currentColor;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, sealRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.strokeStyle = getCrackColor(crackProgress);
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15 * glowIntensity;
    ctx.shadowColor = getCrackColor(crackProgress);

    cutsceneState.cracks.forEach(crack => {
        ctx.beginPath();
        ctx.moveTo(centerX + crack.points[0].x, centerY + crack.points[0].y);
        for (let i = 1; i < crack.points.length; i++) {
            ctx.lineTo(centerX + crack.points[i].x, centerY + crack.points[i].y);
        }
        ctx.stroke();
    });

    ctx.shadowBlur = 0;
}

function startWarpEffect() {
    cutsceneState.warpActive = true;
    cutsceneState.warpStars = Array.from({ length: 500 }, () => ({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random()
    }));
}

function updateAndDrawWarpStars() {
    const { ctx, canvas, warpStars, warpSpeed, currentColor } = cutsceneState;
    if (!warpStars.length) return;
    
    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.fillStyle = currentColor;
    ctx.strokeStyle = currentColor;

    warpStars.forEach(star => {
        star.z -= 0.0005 * warpSpeed;
        if (star.z <= 0) {
            star.x = Math.random() * 2 - 1;
            star.y = Math.random() * 2 - 1;
            star.z = 1;
        }

        const k = 128 / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;

        if (px > 0 && px < width && py > 0 && py < height) {
            const size = (1 - star.z) * 5;
            const prevZ = star.z + 0.0006 * warpSpeed;
            const prevK = 128 / prevZ;
            const prevX = star.x * prevK + centerX;
            const prevY = star.y * prevK + centerY;

            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(px, py);
            ctx.stroke();
        }
    });
}

function shadeColor(color, percent) {
    let f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = (f >> 8) & 0x00FF, B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
}

function draw3DText(text, x, y, size, color, depth, opacity, scale) {
    const { ctx } = cutsceneState;
    ctx.font = `bold ${size * scale}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < depth; i++) {
        const offset = depth - i;
        ctx.fillStyle = shadeColor(color, -0.05 * i);
        ctx.globalAlpha = opacity;
        ctx.fillText(text, x + offset, y + offset);
    }
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.fillText(text, x, y);
    ctx.globalAlpha = 1;
}

function createSealShards() {
    const numShards = 50;
    for (let i = 0; i < numShards; i++) {
        const angle = (i / numShards) * Math.PI * 2;
        const velocity = 5 + Math.random() * 10;
        cutsceneState.shards.push({
            x: Math.cos(angle) * cutsceneState.sealRadius,
            y: Math.sin(angle) * cutsceneState.sealRadius,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            rotation: Math.random() * Math.PI * 2,
            vr: (Math.random() - 0.5) * 0.2,
            size: 10 + Math.random() * 20,
            opacity: 1
        });
    }
}

function updateAndDrawShards() {
    const { ctx, canvas, shards } = cutsceneState;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    shards.forEach(shard => {
        shard.x += shard.vx;
        shard.y += shard.vy;
        shard.rotation += shard.vr;
        shard.opacity -= 0.01;

        ctx.save();
        ctx.translate(centerX + shard.x, centerY + shard.y);
        ctx.rotate(shard.rotation);
        ctx.globalAlpha = shard.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-shard.size / 2, -shard.size / 2, shard.size, shard.size);
        ctx.restore();
    });
    cutsceneState.shards = shards.filter(s => s.opacity > 0);
}

function updateAndDrawEnergyWaves() {
    const { ctx, canvas, energyWaves } = cutsceneState;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    energyWaves.forEach(wave => {
        wave.radius += 8; // Expand outward
        wave.opacity -= 0.015; // Fade out

        ctx.save();
        ctx.globalAlpha = wave.opacity;
        
        // Draw the ring with glow effect
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 20;
        ctx.shadowColor = wave.color;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw a second inner glow ring
        ctx.lineWidth = 2;
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(centerX, centerY, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    });
    
    cutsceneState.energyWaves = energyWaves.filter(w => w.opacity > 0 && w.radius < Math.max(canvas.width, canvas.height));
}

function startParticleSystem() {
    cutsceneState.particles = [];
    for(let i = 0; i < 100; i++) {
        createParticle();
    }
}

function createParticle() {
    const { canvas } = cutsceneState;
    cutsceneState.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.5 + 0.5
    });
}

function updateParticles() {
    const { ctx, canvas, particles, currentColor } = cutsceneState;
    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = currentColor;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    });
}

function animateCutsceneLoop() {
    if (!cutsceneState.active) return;
    const { ctx, canvas, cameraShake, cameraZoom, text3D, cosmicAura, starCore } = cutsceneState;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(cameraZoom, cameraZoom);
    ctx.translate(
        (Math.random() - 0.5) * cameraShake,
        (Math.random() - 0.5) * cameraShake
    );
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw nebula fog (enhanced background)
    if (cutsceneState.nebulaFog) {
        updateAndDrawNebulaFog();
    }
    
    // Draw background particles (cosmic dust)
    updateParticles();
    
    // Draw distortion waves
    if (cutsceneState.distortionWaves && cutsceneState.distortionWaves.length > 0) {
        updateAndDrawDistortionWaves();
    }
    
    // Draw light beams radiating from center
    if (cutsceneState.lightBeams && cutsceneState.lightBeams.length > 0) {
        drawLightBeams();
    }
    
    // Draw celestial orbs
    if (cutsceneState.celestialOrbs && cutsceneState.celestialOrbs.length > 0) {
        drawCelestialOrbs();
    }
    
    // Draw the central star core
    if (starCore.radius > 0) {
        drawStarCore();
    }
    
    // Update and draw particles bursting from the star core
    updateAndDrawStarParticles();

    // Draw energy waves
    if (cutsceneState.energyWaves && cutsceneState.energyWaves.length > 0) {
        updateAndDrawEnergyWaves();
    }

    // Draw the warp effect when active
    if (cutsceneState.warpActive) {
        updateAndDrawWarpStars();
    }

    // Draw the 3D aura name and rarity text
    if (cosmicAura.opacity > 0) {
        const auraName = document.getElementById('cutsceneAuraName').textContent;
        const rarityText = `1 in ${cutsceneState.currentAuraRarity.toLocaleString()}`;
        
        draw3DText(auraName, canvas.width / 2, canvas.height / 2 - 50 + cosmicAura.yOffset, 80, cutsceneState.currentColor, cosmicAura.depth, cosmicAura.opacity, cosmicAura.scale);
        draw3DText(rarityText, canvas.width / 2, canvas.height / 2 + 50 + cosmicAura.yOffset, 40, '#ffffff', cosmicAura.depth / 2, cosmicAura.opacity, cosmicAura.scale);
    }
    
    // Legacy support: Draw seal-breaking effect for 10M-99M rarity cutscene
    if (cutsceneState.crackProgress < 1) {
        drawSeal();
    } else if (cutsceneState.shards && cutsceneState.shards.length > 0) {
        updateAndDrawShards();
    }

    if (text3D.opacity > 0 && cosmicAura.opacity === 0) {
        const auraName = document.getElementById('cutsceneAuraName').textContent;
        const rarityText = `1 in ${cutsceneState.currentAuraRarity.toLocaleString()}`;
        
        draw3DText(auraName, canvas.width / 2, canvas.height / 2 - 50 + text3D.yOffset, 80, cutsceneState.currentColor, text3D.depth, text3D.opacity, text3D.scale);
        draw3DText(rarityText, canvas.width / 2, canvas.height / 2 + 50 + text3D.yOffset, 40, '#ffffff', text3D.depth / 2, text3D.opacity, text3D.scale);
    }
    
    ctx.restore();
    requestAnimationFrame(animateCutsceneLoop);
}

function startCutsceneAnimation() {
    if (cutsceneState.active) {
        animateCutsceneLoop();
    }
}

// =================================================================
// Cosmic Star Cutscene Helper Functions (for 100M+)
// =================================================================

function generateStarParticles(count, centerX, centerY) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const size = Math.random() * 3 + 1;
        
        cutsceneState.starParticles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: size,
            life: 1,
            decay: Math.random() * 0.02 + 0.01,
            color: cutsceneState.starCore.color
        });
    }
}

function updateAndDrawStarParticles() {
    const { ctx } = cutsceneState;
    
    for (let i = cutsceneState.starParticles.length - 1; i >= 0; i--) {
        const p = cutsceneState.starParticles[i];
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        
        // Remove dead particles
        if (p.life <= 0) {
            cutsceneState.starParticles.splice(i, 1);
            continue;
        }
        
        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawStarCore() {
    const { ctx, canvas, starCore } = cutsceneState;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    if (starCore.radius <= 0 || starCore.opacity <= 0) return;
    
    ctx.save();
    
    // Draw outer glow
    const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, starCore.radius * (1 + starCore.glow * 0.5)
    );
    gradient.addColorStop(0, starCore.color);
    gradient.addColorStop(0.3, starCore.color + '80');
    gradient.addColorStop(0.6, starCore.color + '40');
    gradient.addColorStop(1, 'transparent');
    
    ctx.globalAlpha = starCore.opacity * 0.6;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, starCore.radius * (1 + starCore.glow * 0.5), 0, Math.PI * 2);
    ctx.fill();
    
    // Draw core
    const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, starCore.radius
    );
    coreGradient.addColorStop(0, '#ffffff');
    coreGradient.addColorStop(0.5, starCore.color);
    coreGradient.addColorStop(1, starCore.color + '00');
    
    ctx.globalAlpha = starCore.opacity;
    ctx.shadowBlur = starCore.glow * 20;
    ctx.shadowColor = starCore.color;
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, starCore.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function updateAndDrawNebulaFog() {
    const { ctx, canvas } = cutsceneState;
    if (!cutsceneState.nebulaFog) return;
    
    // Parse RGB from hex color
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 0, b: 255 };
    };
    
    const rgb = hexToRgb(cutsceneState.currentColor);
    
    cutsceneState.nebulaFog.forEach(fog => {
        // Update position
        fog.x += fog.vx;
        fog.y += fog.vy;
        fog.opacity += fog.opacityV;
        
        // Wrap around screen
        if (fog.x - fog.radius > canvas.width) fog.x = -fog.radius;
        if (fog.x + fog.radius < 0) fog.x = canvas.width + fog.radius;
        if (fog.y - fog.radius > canvas.height) fog.y = -fog.radius;
        if (fog.y + fog.radius < 0) fog.y = canvas.height + fog.radius;
        
        // Reverse opacity direction at limits
        if (fog.opacity <= 0.005 || fog.opacity >= 0.08) fog.opacityV *= -1;
        
        // Draw fog
        const gradient = ctx.createRadialGradient(fog.x, fog.y, 0, fog.x, fog.y, fog.radius);
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${fog.opacity})`);
        gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${fog.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(fog.x, fog.y, fog.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawCelestialOrbs() {
    const { ctx } = cutsceneState;
    if (!cutsceneState.celestialOrbs) return;
    
    cutsceneState.celestialOrbs.forEach(orb => {
        if (orb.opacity <= 0) return;
        
        // Update rotation
        orb.rotation += orb.rotationSpeed;
        
        ctx.save();
        ctx.translate(orb.x, orb.y);
        ctx.rotate(orb.rotation);
        
        // Draw glow
        const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, orb.size * (1 + orb.glow * 0.3));
        glowGradient.addColorStop(0, cutsceneState.currentColor);
        glowGradient.addColorStop(0.4, cutsceneState.currentColor + '80');
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.globalAlpha = orb.opacity * 0.5;
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(0, 0, orb.size * (1 + orb.glow * 0.3), 0, Math.PI * 2);
        ctx.fill();
        
        // Draw star shape
        ctx.globalAlpha = orb.opacity;
        ctx.shadowBlur = orb.glow * 15;
        ctx.shadowColor = cutsceneState.currentColor;
        drawStarShape(ctx, orb.size, orb.size * 0.4, 8, cutsceneState.currentColor, 0);
        
        ctx.restore();
    });
}

function drawLightBeams() {
    const { ctx, canvas } = cutsceneState;
    if (!cutsceneState.lightBeams) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    cutsceneState.lightBeams.forEach(beam => {
        if (beam.opacity <= 0 || beam.length <= 0) return;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(beam.angle);
        
        // Draw beam with gradient
        const gradient = ctx.createLinearGradient(0, 0, beam.length, 0);
        gradient.addColorStop(0, cutsceneState.currentColor + Math.floor(beam.opacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.3, cutsceneState.currentColor + Math.floor(beam.opacity * 200).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, cutsceneState.currentColor + '00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, -beam.width / 2);
        ctx.lineTo(beam.length, -beam.width / 4);
        ctx.lineTo(beam.length, beam.width / 4);
        ctx.lineTo(0, beam.width / 2);
        ctx.closePath();
        ctx.fill();
        
        // Add glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = cutsceneState.currentColor;
        ctx.fill();
        
        ctx.restore();
    });
}

function updateAndDrawDistortionWaves() {
    const { ctx, canvas } = cutsceneState;
    if (!cutsceneState.distortionWaves) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = cutsceneState.distortionWaves.length - 1; i >= 0; i--) {
        const wave = cutsceneState.distortionWaves[i];
        
        // Expand wave
        wave.radius += 15;
        wave.opacity -= 0.01;
        
        // Remove if fully expanded or faded
        if (wave.radius >= wave.maxRadius || wave.opacity <= 0) {
            cutsceneState.distortionWaves.splice(i, 1);
            continue;
        }
        
        // Draw distortion ring
        ctx.save();
        ctx.strokeStyle = cutsceneState.currentColor + Math.floor(wave.opacity * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = cutsceneState.currentColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw inner glow ring
        ctx.globalAlpha = wave.opacity * 0.3;
        ctx.lineWidth = 20;
        ctx.shadowBlur = 30;
        ctx.stroke();
        ctx.restore();
    }
}

// =================================================================
// Rare Cutscene System (1M to 9.99M)
// =================================================================

function drawGlowStar(ctx, x, y, size, rotation, color, glow, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    const baseOuterRadius = size / 2;
    const baseInnerRadius = size / 12;
    const points = 8;

    ctx.save();
    ctx.globalAlpha = opacity * 0.3;
    ctx.shadowBlur = 60 * glow;
    ctx.shadowColor = color;
    drawStarShape(ctx, baseOuterRadius * 1.4, baseInnerRadius * 1.2, points, color, 0);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = opacity * 0.9;
    ctx.shadowBlur = 35 * glow;
    ctx.shadowColor = color;
    drawStarShape(ctx, baseOuterRadius, baseInnerRadius, points, color, 0);
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = opacity * 0.6;
    ctx.rotate(-rotation * 0.5);
    ctx.shadowBlur = 25 * glow;
    ctx.shadowColor = '#ffffff';
    drawStarShape(ctx, baseOuterRadius * 0.8, baseInnerRadius * 0.7, points, color, 0);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.rotate(rotation * 0.25);
    drawStarShape(ctx, baseOuterRadius * 0.65, baseInnerRadius * 0.6, points, 'rgba(255,255,255,0)', 2, '#ffffff');
    ctx.restore();
    
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = opacity * 0.8;
    ctx.rotate(-rotation * 0.75);
    drawStarShape(ctx, baseOuterRadius * 0.3, baseInnerRadius * 0.2, points, '#ffffff', 0);
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.shadowBlur = 30 * glow;
    ctx.shadowColor = '#ffffff';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
}

function drawStarShape(ctx, outerRadius, innerRadius, points, fillStyle, strokeWidth = 0, strokeStyle = 'white') {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / points) * i - (Math.PI / 2);
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();

    ctx.fillStyle = fillStyle;
    ctx.fill();

    if (strokeWidth > 0) {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
}

async function playRareCutscene(aura) {
    const cutsceneEl = document.getElementById('rareCutscene');
    const canvas = document.getElementById('rareCutsceneCanvas');
    if (!cutsceneEl || !canvas) return;
    const ctx = canvas.getContext('2d');

    // Save scroll position before cutscene
    const savedScrollX = window.scrollX || window.pageXOffset;
    const savedScrollY = window.scrollY || window.pageYOffset;
    
    // Store scroll position in a global variable for restoration
    window._savedScrollPosition = { x: savedScrollX, y: savedScrollY };

    const audio = new Audio('1milplus.mp3');

    document.getElementById('rareAuraName').style.opacity = 0;
    document.getElementById('rareAuraRarity').style.opacity = 0;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const auraColor = getAuraColor(aura.name) || '#FF0000';
    const auraRgb = hexToRgb(auraColor);

    cutsceneEl.classList.add('active');
    
    Object.assign(cutsceneEl.style, {
        position: 'fixed', top: '0', left: '0', width: '100%',
        height: '100%', zIndex: '9999', backgroundColor: 'rgba(0, 0, 0, 1)',
        opacity: '1'
    });

    let star = {
        x: canvas.width / 2, y: canvas.height / 2, size: 50,
        rotation: Math.PI / 4, rotationSpeed: 0.005, glow: 0.3, opacity: 0,
    };

    let fogParticles = [];
    const numFogParticles = 30;
    for (let i = 0; i < numFogParticles; i++) {
        fogParticles.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            radius: Math.random() * 200 + 150, opacity: Math.random() * 0.05 + 0.02,
            vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
            opacityV: (Math.random() - 0.5) * 0.0005
        });
    }

    function updateAndDrawFog() {
        fogParticles.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.opacity += p.opacityV;
            if (p.x - p.radius > canvas.width) p.x = -p.radius;
            if (p.x + p.radius < 0) p.x = canvas.width + p.radius;
            if (p.y - p.radius > canvas.height) p.y = -p.radius;
            if (p.y + p.radius < 0) p.y = canvas.height + p.radius;
            if (p.opacity <= 0.01 || p.opacity >= 0.1) p.opacityV *= -1;
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
            gradient.addColorStop(0, `rgba(${auraRgb.r}, ${auraRgb.g}, ${auraRgb.b}, ${p.opacity})`);
            gradient.addColorStop(1, `rgba(${auraRgb.r}, ${auraRgb.g}, ${auraRgb.b}, 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    let animationFrameId;
    function drawLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateAndDrawFog();
        star.rotation += star.rotationSpeed;
        drawGlowStar(ctx, star.x, star.y, star.size, star.rotation, auraColor, star.glow, star.opacity);
        animationFrameId = requestAnimationFrame(drawLoop);
    }
    drawLoop();

    const timeline = anime.timeline();
    timeline.add({ targets: star, opacity: 1, duration: 1125, easing: 'linear' });
    timeline.add({ targets: star, size: 300, glow: 2, duration: 6300, easing: 'easeInCubic' }, '+=225');
    timeline.add({ targets: star, size: 4000, glow: 40, opacity: 0, duration: 788, easing: 'easeInExpo' })
    .add({ targets: cutsceneEl, backgroundColor: auraColor, duration: 1013, direction: 'alternate', easing: 'easeOutQuad' }, '-=788');

    setTimeout(() => {
        // Cancel animation frame properly
        if (animationFrameId !== undefined) {
            cancelAnimationFrame(animationFrameId);
        }
        closeRareCutscene(cutsceneEl, canvas, savedScrollX, savedScrollY);
    }, 9000);

    audio.play();
}

function closeRareCutscene(cutsceneEl, canvas, savedScrollX, savedScrollY) {
    if (!cutsceneEl || !cutsceneEl.classList.contains('active')) return;
    
    anime({
        targets: cutsceneEl,
        opacity: 0,
        duration: 500,
        easing: 'easeInQuad',
        complete: () => {
            cutsceneEl.classList.remove('active');
            Object.assign(cutsceneEl.style, {
                position: '', top: '', left: '', width: '',
                height: '', zIndex: '', backgroundColor: ''
            });
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            document.getElementById('rareAuraName').style.opacity = 0;
            document.getElementById('rareAuraRarity').style.opacity = 0;
            
            // Use requestAnimationFrame to ensure DOM has updated before scrolling
            requestAnimationFrame(() => {
                // Restore scroll position from global or parameters
                const scrollX = window._savedScrollPosition?.x ?? savedScrollX ?? 0;
                const scrollY = window._savedScrollPosition?.y ?? savedScrollY ?? 0;
                
                window.scrollTo(scrollX, scrollY);
                
                // Clear the saved position
                delete window._savedScrollPosition;
            });
        }
    });
}


// =================================================================
// Achievement System
// =================================================================
// Using the full 93-achievement list from achievementsData.js
// The ACHIEVEMENTS_DATA object is loaded from achievementsData.js before this file

// Create ACHIEVEMENTS from external data if available, otherwise use fallback
const ACHIEVEMENTS = typeof ACHIEVEMENTS_DATA !== 'undefined' ? ACHIEVEMENTS_DATA : {
    // Fallback minimal achievements if external file fails to load
    'first_roll': { name: 'I just started Sol\'s RNG', description: 'Roll once.', requirement: 1, type: 'rolls', reward: { money: 10 } },
    'hundred_rolls': { name: 'A little bit of rolls', description: 'Roll 100 times.', requirement: 100, type: 'rolls', reward: { money: 50 } },
    'thousand_rolls': { name: 'I\'m addicted to Sol\'s RNG', description: 'Roll 1,000 times.', requirement: 1000, type: 'rolls', reward: { money: 300 } }
};

// =================================================================
// Main Game Logic
// =================================================================

window.gameState = {
    totalRolls: 0,
    currentLuck: 1.0,
    currentSpeed: 1.0,
    currentRollCount: 0,
    targetRollCount: 10,
    inventory: { potions: {}, items: {}, auras: {}, gears: {}, runes: {} },
    bulkMode: {
        active: false,
        selectedPotions: [] // Array of potion names selected in bulk mode
    },
    equipped: { right: null, left: null, accessory: null },
    activeEffects: [],
    specialEffects: {
        gemstoneActive: false,
        gemstoneBoost: { luck: 0, speed: 0 },
        gemstoneEndTime: 0,
        twoxLuckBonus: false
    },
    isRolling: false,
    rollsRemaining: {},
    autoRoll: { active: false, interval: null, delay: 600 },
    settings: {
        cutscenes: {
            enabled: true, // Master toggle for all cutscenes
            individualToggles: {} // Individual toggles per aura name
        }
    },
    currency: {
        money: 0,
        voidCoins: 0,
        darkPoints: 0,
        halloweenMedals: 0
    },
    merchants: {
        lastSpawn: null,
        currentMerchant: null,
        spawnTime: null,
        nextSpawnMin: 15,
        nextSpawnMax: 45,
        isActive: false
    },
    achievements: {
        unlocked: {},
        stats: {
            highestRarity: 0,
            playtimeMinutes: 0,
            breakthroughCount: 0,
            potionsUsed: 0,
            runesUsed: 0,
            biomesSeen: [],
            chestsOpened: 0,
            craftsMade: 0,
            gearsCrafted: 0,
            potionsCrafted: 0,
            highestGearTierCrafted: 0,
            sessionRolls: 0,
            dailyRolls: 0,
            autoRollsCompleted: 0,
            quickRollStreak: 0,
            maxSpeedAchieved: 0,
            maxLuckAchieved: 0,
            continuousMinutes: 0,
            rareStreak: 0,
            epicStreak: 0,
            legendaryStreak: 0,
            noCommonStreak: 0,
            breakthroughStreak: 0,
            sameAuraStreak: 0,
            lastAuraRolled: null,
            sameAuraCount: 0,
            gearEquipped: 0,
            bothSlotsEquipped: false,
            highestTierEquipped: 0,
            uniqueGearsOwned: 0,
            gearSwaps: 0,
            noPotionRolls: 0,
            noGearRolls: 0,
            manualOnlyRolls: 0,
            dailyBiomes: [],
            dailyRunes: [],
            dailyMythicCount: 0,
            loginStreak: 0,
            lastLoginDate: null,
            sessionCount: 0,
            lastSessionDate: null,
            nightRolls: 0,
            lastPlaytimeUpdate: Date.now(),
            sessionStartTime: Date.now(),
            lastDailyReset: Date.now(),
            
            // Rolling Specialist Tracking
            lastRollTimestamp: Date.now(),
            rollsAt1AM: 0,
            rollsAt3AM: 0,
            birthdayRollDone: false,
            newYearRollDone: false,
            halloweenMidnightDone: false,
            lastTierPattern: [],
            alternatingTierCount: 0,
            ascendingTierCount: 0,
            descendingTierCount: 0,
            rollsWithSpeed500: 0,
            rollsWithSpeedUnder50: 0,
            sameTierStreak: 0,
            lastTierForStreak: null,
            breakthroughOnlyStreak: 0,
            noBreakthroughCount: 0,
            rollsSinceRare: 0,
            rollsSinceEpic: 0,
            rollsSinceLegendary: 0,
            maxRollsWithoutRare: 0,
            currentSessionRolls: 0,
            microSessionCount: 0,
            dailyRollsHistory: {},
            rollsInNULL: 0,
            rollsInGLITCH: 0,
            rollsInDREAMSPACE: 0,
            currentBiomeRolls: 0,
            lastBiome: null,
            mutationStreak: 0,
            noMutationCount: 0,
            weekendRolls: 0,
            mondayRolls: 0,
            fridayNightRolls: 0,
            manualRolls: 0,
            autoRolls: 0,
            modeSwitches: 0,
            lastRollMode: null,
            rollsWithLuck1000: 0,
            rollsWithBaseLuck: 0,
            oblivionOnlyRolls: 0,
            voidheartUses: 0,
            rollsWithoutPotions: 0,
            rollsWithNoGear: 0,
            rollsWithTier10Only: 0,
            rollsWithoutRunes: 0,
            sameAuraLifetimeCount: {},
            differentAuraStreak: 0,
            lastDifferentAuras: [],
            brokeRolls: 0,
            millionaireRolls: 0,
            rollsSinceCommon: 0,
            
            // ========== STAGE 1: 221 MISSING ACHIEVEMENT TYPES ==========
            // Deletion/Management Tracking
            exoticDeletes: 0,
            commonsDeleted: 0,
            deletesAt66: 0,
            legendaryDeletes: 0,
            mythicDeletes: 0,
            totalDeletes: 0,
            deletionHistory: [],
            noDeleteStreak: 0,
            accidentalExoticDeletes: 0,
            craftWithoutUse: 0,
            inventoryFull: false,
            
            // Advanced Biome Tracking
            biomeVisitCounts: {},
            biomeSpeedrunRecord: 0,
            weeklyBiomesTracked: [],
            biomeCombosCompleted: 0,
            allBiomesSeen: [],
            allBiomes1000Done: false,
            biomeChampion: false,
            biomeCompletionist: false,
            bloodRainVisits: 0,
            celestialBiomesVisited: 0,
            dangerBiomesVisited: 0,
            extremeBiomesVisited: 0,
            graveyardVisits: 0,
            pumpkinMoonVisits: 0,
            starfallVisits: 0,
            weatherBiomesVisited: 0,
            solarLunarHourDone: false,
            
            // Luck & Rarity Tracking
            highRarityNoBuffsList: [],
            billionBaseLuckRolls: 0,
            blessedByRNG: 0,
            consistentLuckStreak: 0,
            earlyGameLucky: false,
            earlyLuckRareCount: 0,
            fortuneFavored: 0,
            fortuneSmile: 0,
            insaneLuck100m: false,
            lowLuckBillionDone: false,
            luckChainCount: 0,
            luckMastery: 0,
            luckSpikeCount: 0,
            luckyAfterUnluckyDone: false,
            luckyStreakBest: 0,
            millionLuckRolls: 0,
            mythicBaseLuckDone: false,
            noBuffMythicDone: false,
            reverseLuckDone: false,
            transcendentBaseLuckDone: false,
            againstOddsDone: false,
            blessedRNGCount: 0,
            
            // Rolling Pattern Tracking
            autoMarathonDone: false,
            billionRollsDone: false,
            daily100kRollsDone: false,
            dailyBillionAurasDone: false,
            dailyRollAddictDone: false,
            dawnPatrolRolls: 0,
            exact420Done: false,
            exact69Done: false,
            exact1337PotionDone: false,
            exact777CoinsDone: false,
            exactStreaksCompleted: {},
            firstRollDivineDone: false,
            goldenHourRolls: 0,
            hourlyRollTracker: {},
            insaneSpeedRolls: 0,
            lightSpeedRolls: 0,
            marathonRollingDone: false,
            midnightRollsCount: 0,
            nakedRollsCount: 0,
            overnightAutoRollDone: false,
            rapidRollsCount: 0,
            session666Done: false,
            
            // Speed & Timing
            fastExoticCount: 0,
            perfectTimingDone: false,
            slowRollsCount: 0,
            speedRollingCount: 0,
            speedRollingProDone: false,
            weekendRollsTotal: 0,
            weekly50kDone: false,
            yearStreakDays: 0,
            voluntaryBreakDone: false,
            
            // Streaks & Combos
            breakthroughChainMax: 0,
            comebackKingDone: false,
            commonStreakMax: 0,
            consecutiveCombos: 0,
            divineStreakCount: 0,
            divineStreak100Done: false,
            escalationCombos: 0,
            noCommonComboCount: 0,
            noCommons100kDone: false,
            noCommons10kDone: false,
            noLegendary10kDone: false,
            noLegendaryStreakMax: 0,
            sameCommon100Done: false,
            sessionCombosCompleted: [],
            themeCombosCount: 0,
            tierClimbStreak: 0,
            transcendentStreakCount: 0,
            transcendentStreak50Done: false,
            
            // Mutations Extended
            mutationChainInsaneMax: 0,
            mutationCollectionDone: false,
            mutationHuntingCount: 0,
            mutationObtainedFirst: false,
            mutationPairsCount: 0,
            mutationSupremeDone: false,
            uniqueMutationsList: [],
            
            // Halloween Extended
            dailyHalloweenBiomesList: [],
            glitchAurasCount: 0,
            glitchBiomesCount: 0,
            halloweenAurasList: [],
            halloweenBiomeTripleDone: false,
            halloweenBiomesSeenList: [],
            halloweenCompleteDone: false,
            halloweenGodDone: false,
            halloweenMedalBalancePeak: 0,
            halloweenMedalsEarnedTotal: 0,
            halloweenRunesUsedCount: 0,
            halloweenSupremeDone: false,
            pumpkinAuraDone: false,
            
            // Merchants
            jackPurchasesCount: 0,
            jesterPurchasesCount: 0,
            mariPurchasesCount: 0,
            merchantBillionDone: false,
            merchantSpendingTotal: 0,
            metBountyJackDone: false,
            moneySpentMerchantsTotal: 0,
            
            // Currency
            darkPointsEarnedTotal: 0,
            moneyBalancePeak: 0,
            moneyGainFastestAmount: 0,
            moneyLossFastestAmount: 0,
            voidCoin100kDone: false,
            voidCoinBalancePeak: 0,
            voidCoinsEarnedTotal: 0,
            voidCoinsLifetimeTotal: 0,
            voidCoinsSpentTotal: 0,
            zeroMoneyRollsCount: 0,
            exact777CoinsBalanceDone: false,
            
            // Potions Extended
            allPotions10kDone: false,
            clarityUsedCount: 0,
            hindsightRerollsCount: 0,
            jackpotTriggeredCount: 0,
            oblivionUsedCount: 0,
            oneRollPotionsCount: 0,
            phoenixRevivalsCount: 0,
            potionHoardMaxAmount: 0,
            potionOverdoseCount: 0,
            potionStackMaxCount: 0,
            potionsConservedCount: 0,
            quantumChainMaxLength: 0,
            
            // Runes Extended
            allRunes5kDone: false,
            runeEclipseUsedCount: 0,
            runeEverythingUsedCount: 0,
            runeStackMaxCount: 0,
            singleRuneHoardMax: 0,
            totalRunesUsedLifetime: 0,
            
            // Gears Extended
            crimsonHeartBonusCount: 0,
            gearCollectionCompleteDone: false,
            gemstoneTriggersCount: 0,
            orionBeltEquippedMinutes: 0,
            tier10BothSlotsDone: false,
            tier10CompleteDone: false,
            uniqueGearsCraftedCount: 0,
            divineOneGearDone: false,
            cosmicObtainedDone: false,
            
            // Collections
            cosmicCollectionDone: false,
            cosmicAurasCount: 0,
            elementCollectionsList: {},
            elementMasterDone: false,
            errorTrioDone: false,
            godlyTrioDone: false,
            oneAuraMillionDone: false,
            oneEachAuraDone: false,
            onlyOneTypeDone: false,
            over9000AuraDone: false,
            powerTrinityDone: false,
            starCollectionSimultaneousDone: false,
            transcendentCollectionCount: 0,
            
            // Crafting Extended
            dailyCraftingInsaneDone: false,
            dailyCraftCountToday: 0,
            darklightCraftsCount: 0,
            millionCraftsDone: false,
            uniquePotionsCraftedCount: 0,
            
            // Daily/Session Extended
            dailyBiomeChangesCount: 0,
            dailyBreakthroughsCount: 0,
            dailyChestOpeningCount: 0,
            dailySessionsCount: 0,
            earlyLoginDone: false,
            perfectDayRollsDone: false,
            perfectSessionDone: false,
            sessionBreakthroughsCount: 0,
            voluntaryBreakTaken: false,
            
            // Special/Meme/Godlike
            bigBrainStacksCount: 0,
            earlyMythicTrioDone: false,
            elementalSessionDone: false,
            f2pGrindDone: false,
            godlikeMasterDone: false,
            insaneMasterDone: false,
            memeMasterDone: false,
            painAfterGloryDone: false,
            rareMutationRarity: 0,
            rareSessionComboCount: 0,
            raritySurgeCount: 0,
            rollingSupremeDone: false,
            specificMasterDone: false,
            syrupUsedCount: 0,
            
            // Ultimate
            millionBreakthroughsDone: false,
            trillionRarityDone: false,
            ultimateBreakthroughsDone: false,
            ultimateCollectionDone: false,
            ultimateMasterDone: false,
            ultimateRarityDone: false,
            ultimateRollsDone: false,
            
            // Misc Tracking
            manualOnlyRollsCount: 0,
            uniquePotionsOwnedList: [],
            unluckyStreakMax: 0,
            rareSessionCombos: 0,
            session666Completed: false,
            comboMasterCount: 0,
            luckSupremeDone: false
        }
    }
};

// =================================================================
// Achievement Functions
// =================================================================

function trackBiomeSeen(biomeName) {
    if (!gameState.achievements.stats.biomesSeen) {
        gameState.achievements.stats.biomesSeen = [];
    }
    if (!gameState.achievements.stats.biomesSeen.includes(biomeName)) {
        gameState.achievements.stats.biomesSeen.push(biomeName);
        saveGameState();
        checkAchievements();
    }
}

// ========== STAGE 3: HELPER FUNCTIONS FOR 221 MISSING TYPES ==========

// Helper: Check if player has completed hourly rolls requirement
function checkHourlyRolls(stats, hours) {
    if (!stats.hourlyRollTracker) return false;
    const now = Date.now();
    let consecutiveHours = 0;
    
    for (let i = 0; i < hours; i++) {
        const hourKey = Math.floor((now - i * 3600000) / 3600000);
        if (stats.hourlyRollTracker[hourKey] && stats.hourlyRollTracker[hourKey] > 0) {
            consecutiveHours++;
        } else {
            break;
        }
    }
    
    return consecutiveHours >= hours;
}

// Helper: Check element collection completion
function checkElementCollection(stats, elementType) {
    if (!stats.elementCollectionsList) stats.elementCollectionsList = {};
    return stats.elementCollectionsList[elementType] || false;
}

// Helper: Check if specific potion was used
function checkSpecificPotionUsed(stats, potionName) {
    if (!stats.specificPotionsUsed) stats.specificPotionsUsed = {};
    return stats.specificPotionsUsed[potionName] || false;
}

// Helper: Track deletion event
function trackDeletion(aura, count) {
    const stats = gameState.achievements.stats;
    if (!stats) return;
    
    stats.totalDeletes = (stats.totalDeletes || 0) + count;
    
    // Track by tier
    const tier = aura.tier;
    if (tier === 'common') {
        stats.commonsDeleted = (stats.commonsDeleted || 0) + count;
    } else if (tier === 'legendary') {
        stats.legendaryDeletes = (stats.legendaryDeletes || 0) + count;
    } else if (tier === 'mythic') {
        stats.mythicDeletes = (stats.mythicDeletes || 0) + count;
    } else if (tier === 'exotic') {
        stats.accidentalExoticDeletes = (stats.accidentalExoticDeletes || 0) + count;
    }
    
    // Check if deleting at exactly 66
    const auraInventoryCount = gameState.inventory.auras[aura.name]?.count || 0;
    if (auraInventoryCount === 66) {
        stats.deletesAt66 = (stats.deletesAt66 || 0) + 1;
    }
    
    // Add to deletion history
    if (!stats.deletionHistory) stats.deletionHistory = [];
    stats.deletionHistory.push({
        aura: aura.name,
        tier: aura.tier,
        count: count,
        timestamp: Date.now()
    });
    
    // Keep only last 1000 deletions
    if (stats.deletionHistory.length > 1000) {
        stats.deletionHistory.shift();
    }
    
    saveGameState();
    checkAchievements();
}

// Helper: Track merchant purchase
function trackMerchantPurchase(merchantName, amount) {
    const stats = gameState.achievements.stats;
    if (!stats) return;
    
    if (merchantName === 'Jack' || merchantName === 'Bounty Hunter Jack') {
        stats.jackPurchasesCount = (stats.jackPurchasesCount || 0) + 1;
        stats.metBountyJackDone = true;
    } else if (merchantName === 'Jester') {
        stats.jesterPurchasesCount = (stats.jesterPurchasesCount || 0) + 1;
    } else if (merchantName === 'Mari') {
        stats.mariPurchasesCount = (stats.mariPurchasesCount || 0) + 1;
    }
    
    stats.merchantSpendingTotal = (stats.merchantSpendingTotal || 0) + amount;
    stats.moneySpentMerchantsTotal = (stats.moneySpentMerchantsTotal || 0) + amount;
    
    if (stats.merchantSpendingTotal >= 1000000000) {
        stats.merchantBillionDone = true;
    }
    
    // Track leaderboard stats
    if (window.leaderboardStats) {
        window.leaderboardStats.stats.totalMerchantSpending += amount;
        window.leaderboardStats.stats.mostExpensivePurchase = Math.max(
            window.leaderboardStats.stats.mostExpensivePurchase || 0,
            amount
        );
        window.leaderboardStats.saveStats();
    }
    
    saveGameState();
    checkAchievements();
}

// Helper: Track currency changes
function trackCurrencyChange(type, amount, isGain) {
    const stats = gameState.achievements.stats;
    if (!stats) return;
    
    if (type === 'money') {
        // Track peak balance
        stats.moneyBalancePeak = Math.max(stats.moneyBalancePeak || 0, gameState.currency.money);
        
        // Track fastest gain/loss
        if (isGain) {
            stats.moneyGainFastestAmount = Math.max(stats.moneyGainFastestAmount || 0, amount);
        } else {
            stats.moneyLossFastestAmount = Math.max(stats.moneyLossFastestAmount || 0, amount);
        }
        
        // Check exact 777 coins
        if (gameState.currency.money === 777) {
            stats.exact777CoinsDone = true;
        }
        
        // Track money records
        if (window.leaderboardStats) {
            window.leaderboardStats.trackMoney(gameState.currency.money);
        }
    } else if (type === 'voidCoins') {
        stats.voidCoinBalancePeak = Math.max(stats.voidCoinBalancePeak || 0, gameState.currency.voidCoins);
        stats.voidCoinsLifetimeTotal = (stats.voidCoinsLifetimeTotal || 0) + (isGain ? amount : 0);
        stats.voidCoinsEarnedTotal = (stats.voidCoinsEarnedTotal || 0) + (isGain ? amount : 0);
        stats.voidCoinsSpentTotal = (stats.voidCoinsSpentTotal || 0) + (isGain ? 0 : amount);
        
        if (stats.voidCoinsLifetimeTotal >= 100000) {
            stats.voidCoin100kDone = true;
        }
        
        // Track void coins records
        if (window.leaderboardStats) {
            window.leaderboardStats.trackVoidCoins(gameState.currency.voidCoins);
        }
    } else if (type === 'darkPoints') {
        stats.darkPointsEarnedTotal = (stats.darkPointsEarnedTotal || 0) + (isGain ? amount : 0);
    } else if (type === 'halloweenMedals') {
        stats.halloweenMedalBalancePeak = Math.max(stats.halloweenMedalBalancePeak || 0, gameState.currency.halloweenMedals || 0);
        stats.halloweenMedalsEarnedTotal = (stats.halloweenMedalsEarnedTotal || 0) + (isGain ? amount : 0);
    }
    
    checkAchievements();
}

// Helper: Track potion special effects
function trackPotionEffect(potionName, effectType) {
    const stats = gameState.achievements.stats;
    if (!stats) return;
    
    // Track specific potion usage
    if (!stats.specificPotionsUsed) stats.specificPotionsUsed = {};
    stats.specificPotionsUsed[potionName] = true;
    
    // Track special effect triggers
    if (effectType === 'clarity') {
        stats.clarityUsedCount = (stats.clarityUsedCount || 0) + 1;
    } else if (effectType === 'hindsight') {
        stats.hindsightRerollsCount = (stats.hindsightRerollsCount || 0) + 1;
    } else if (effectType === 'phoenix') {
        stats.phoenixRevivalsCount = (stats.phoenixRevivalsCount || 0) + 1;
    } else if (effectType === 'jackpot') {
        stats.jackpotTriggeredCount = (stats.jackpotTriggeredCount || 0) + 1;
    } else if (effectType === 'quantum') {
        // Track quantum chain length
        if (!stats.currentQuantumChain) stats.currentQuantumChain = 0;
        stats.currentQuantumChain++;
        stats.quantumChainMaxLength = Math.max(stats.quantumChainMaxLength || 0, stats.currentQuantumChain);
    } else if (effectType === 'conservation') {
        stats.potionsConservedCount = (stats.potionsConservedCount || 0) + 1;
    }
    
    // Count Oblivion usage
    if (potionName === 'Oblivion Potion') {
        stats.oblivionUsedCount = (stats.oblivionUsedCount || 0) + 1;
    }
    
    // Check for potion overdose (5+ active)
    if (gameState.activeEffects.length >= 5) {
        stats.potionOverdoseCount = (stats.potionOverdoseCount || 0) + 1;
    }
    
    // Track potion stack max
    stats.potionStackMaxCount = Math.max(stats.potionStackMaxCount || 0, gameState.activeEffects.length);
    
    checkAchievements();
}

// Helper: Track gear effects
function trackGearEffect(gearName, effectType) {
    const stats = gameState.achievements.stats;
    if (!stats) return;
    
    if (gearName === 'Gemstone Gauntlet' && effectType === 'trigger') {
        stats.gemstoneTriggersCount = (stats.gemstoneTriggersCount || 0) + 1;
    } else if (gearName === 'Crimson Heart' && effectType === 'bonus') {
        stats.crimsonHeartBonusCount = (stats.crimsonHeartBonusCount || 0) + 1;
    }
    
    checkAchievements();
}

// Helper: Track biome visit
function trackBiomeVisit(biomeName) {
    const stats = gameState.achievements.stats;
    if (!stats) return;
    
    // Initialize tracking
    if (!stats.biomeVisitCounts) stats.biomeVisitCounts = {};
    stats.biomeVisitCounts[biomeName] = (stats.biomeVisitCounts[biomeName] || 0) + 1;
    
    // Track specific biomes
    if (biomeName === 'BLOOD_RAIN') {
        stats.bloodRainVisits = (stats.bloodRainVisits || 0) + 1;
    } else if (biomeName === 'GRAVEYARD') {
        stats.graveyardVisits = (stats.graveyardVisits || 0) + 1;
    } else if (biomeName === 'PUMPKIN_MOON') {
        stats.pumpkinMoonVisits = (stats.pumpkinMoonVisits || 0) + 1;
    } else if (biomeName === 'STARFALL') {
        stats.starfallVisits = (stats.starfallVisits || 0) + 1;
    }
    
    // Track weather biomes (WINDY, RAINY, SNOWY)
    if (['WINDY', 'RAINY', 'SNOWY'].includes(biomeName)) {
        stats.weatherBiomesVisited = (stats.weatherBiomesVisited || 0) + 1;
    }
    
    // Track extreme biomes (SANDSTORM, HURRICANE)
    if (['SANDSTORM', 'HURRICANE'].includes(biomeName)) {
        stats.extremeBiomesVisited = (stats.extremeBiomesVisited || 0) + 1;
    }
    
    // Track celestial biomes (STARFALL, ECLIPSE)
    if (['STARFALL', 'ECLIPSE'].includes(biomeName)) {
        stats.celestialBiomesVisited = (stats.celestialBiomesVisited || 0) + 1;
    }
    
    // Track danger biomes (HELL, CORRUPTION)
    if (['HELL', 'CORRUPTION'].includes(biomeName)) {
        stats.dangerBiomesVisited = (stats.dangerBiomesVisited || 0) + 1;
    }
    
    // Track Halloween biomes
    if (['PUMPKIN_MOON', 'GRAVEYARD', 'BLOOD_RAIN'].includes(biomeName)) {
        if (!stats.halloweenBiomesSeenList) stats.halloweenBiomesSeenList = [];
        if (!stats.halloweenBiomesSeenList.includes(biomeName)) {
            stats.halloweenBiomesSeenList.push(biomeName);
        }
    }
    
    checkAchievements();
}

// Helper: Track collection completions
function checkCollectionComplete(collectionType) {
    const stats = gameState.achievements.stats;
    const auras = gameState.inventory.auras;
    
    switch(collectionType) {
        case 'cosmic':
            const cosmicAuras = ['Galaxy', 'Universe', 'Cosmos', 'Quasar'];
            stats.cosmicCollectionDone = cosmicAuras.every(a => !!auras[a]);
            stats.cosmicAurasCount = cosmicAuras.filter(a => !!auras[a]).length;
            break;
            
        case 'error_trio':
            const errorAuras = ['Glitch', 'ERROR', 'Segfault'];
            stats.errorTrioDone = errorAuras.every(a => !!auras[a]);
            break;
            
        case 'godly_trio':
            const godlyAuras = ['Godly Potion (Zeus)', 'Godly Potion (Poseidon)', 'Godly Potion (Hades)'];
            stats.godlyTrioDone = godlyAuras.every(a => !!auras[a]);
            break;
            
        case 'power_trinity':
            const powerAuras = ['Power', 'Powered', 'Overpower'];
            stats.powerTrinityDone = powerAuras.every(a => !!auras[a]);
            break;
    }
    
    checkAchievements();
}

// ========== STAGE 4: COMPREHENSIVE NEW ACHIEVEMENT TRACKING ==========
function trackNewAchievements(aura) {
    const stats = gameState.achievements.stats;
    if (!stats) return;
    
    // Track exact item counts (69, 420, 777, 1337)
    checkExactCounts();
    
    // Track luck-based achievements
    trackLuckAchievements(aura);
    
    // Track speed-based achievements
    trackSpeedAchievements();
    
    // Track timing achievements (midnight, dawn, golden hour, etc.)
    trackTimingAchievements();
    
    // Track streak achievements
    trackAdvancedStreaks(aura);
    
    // Track currency peaks
    trackCurrencyChange('money', 0, false); // Update peaks without change
    
    // Track roll milestones
    if (gameState.totalRolls === 1000000000) stats.billionRollsDone = true;
    if (gameState.totalRolls === 1) stats.firstRollDivineDone = (aura.tier === 'divine');
    
    // Track collections
    checkAllCollections();
    
    // Track session/daily stats
    trackSessionStats(aura);
    
    // Track active effects (potion overdose, etc.)
    trackActiveEffects();
}

// Check for exact item counts (69, 420, etc.)
function checkExactCounts() {
    const stats = gameState.achievements.stats;
    
    // Check auras
    for (const auraName in gameState.inventory.auras) {
        const count = gameState.inventory.auras[auraName].count;
        if (count === 69) stats.exact69Done = true;
        if (count === 420) stats.exact420Done = true;
        if (count === 9001) stats.over9000AuraDone = true;
        if (count === 1000000) stats.oneAuraMillionDone = true;
    }
    
    // Check potions
    for (const potionName in gameState.inventory.potions) {
        const count = gameState.inventory.potions[potionName].count;
        if (count === 69) stats.exact69Done = true;
        if (count === 420) stats.exact420Done = true;
        if (count === 1337) stats.exact1337PotionDone = true;
    }
    
    // Check money
    if (gameState.currency.money === 777) stats.exact777CoinsDone = true;
    if (gameState.currency.money === 0) stats.zeroMoneyRollsCount = (stats.zeroMoneyRollsCount || 0) + 1;
}

// Track luck-based achievements
function trackLuckAchievements(aura) {
    const stats = gameState.achievements.stats;
    const currentLuck = gameState.currentLuck;
    
    // Track base luck achievements
    if (currentLuck === 1 && aura.tier === 'mythic') stats.mythicBaseLuckDone = true;
    if (currentLuck === 1 && aura.tier === 'transcendent') stats.transcendentBaseLuckDone = true;
    
    // Track high rarity with no buffs
    if (gameState.activeEffects.length === 0 && ['exotic', 'divine', 'transcendent', 'special'].includes(aura.tier)) {
        if (!stats.highRarityNoBuffsList) stats.highRarityNoBuffsList = [];
        stats.highRarityNoBuffsList.push(aura.name);
    }
    
    // Track luck with billion base luck
    if (currentLuck >= 1000000000) {
        stats.billionBaseLuckRolls = (stats.billionBaseLuckRolls || 0) + 1;
    }
    
    // Track lucky streaks (high rarity in a row)
    if (['legendary', 'mythic', 'exotic', 'divine', 'transcendent'].includes(aura.tier)) {
        stats.luckyStreakCurrent = (stats.luckyStreakCurrent || 0) + 1;
        stats.luckyStreakBest = Math.max(stats.luckyStreakBest || 0, stats.luckyStreakCurrent);
    } else {
        stats.luckyStreakCurrent = 0;
    }
}

// Track speed-based achievements
function trackSpeedAchievements() {
    const stats = gameState.achievements.stats;
    const currentSpeed = gameState.currentSpeed;
    
    // Track speed milestones
    if (currentSpeed >= 5) {
        stats.insaneSpeedRolls = (stats.insaneSpeedRolls || 0) + 1;
    }
    if (currentSpeed >= 10) {
        stats.lightSpeedRolls = (stats.lightSpeedRolls || 0) + 1;
    }
    
    // Track slow rolls
    if (currentSpeed <= 0.5) {
        stats.slowRollsCount = (stats.slowRollsCount || 0) + 1;
    }
}

// Track timing achievements (time of day, hourly patterns)
function trackTimingAchievements() {
    const stats = gameState.achievements.stats;
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Track hourly roll tracker
    const hourKey = Math.floor(Date.now() / 3600000);
    if (!stats.hourlyRollTracker) stats.hourlyRollTracker = {};
    stats.hourlyRollTracker[hourKey] = (stats.hourlyRollTracker[hourKey] || 0) + 1;
    
    // Clean old hourly data (keep last 48 hours)
    const cutoffKey = hourKey - 48;
    for (const key in stats.hourlyRollTracker) {
        if (parseInt(key) < cutoffKey) {
            delete stats.hourlyRollTracker[key];
        }
    }
    
    // Track midnight rolls (12 AM)
    if (hour === 0) {
        stats.midnightRollsCount = (stats.midnightRollsCount || 0) + 1;
    }
    
    // Track dawn patrol (5-7 AM)
    if (hour >= 5 && hour <= 7) {
        stats.dawnPatrolRolls = (stats.dawnPatrolRolls || 0) + 1;
    }
    
    // Track golden hour (5-6 PM)
    if (hour >= 17 && hour <= 18) {
        stats.goldenHourRolls = (stats.goldenHourRolls || 0) + 1;
    }
    
    // Track weekend rolls
    if (day === 0 || day === 6) {
        stats.weekendRollsTotal = (stats.weekendRollsTotal || 0) + 1;
    }
    
    // Track early login (before 6 AM)
    if (hour < 6) {
        stats.earlyLoginDone = true;
    }
}

// Track advanced streak patterns
function trackAdvancedStreaks(aura) {
    const stats = gameState.achievements.stats;
    
    // Track common streak
    if (aura.tier === 'common') {
        stats.commonStreakCurrent = (stats.commonStreakCurrent || 0) + 1;
        stats.commonStreakMax = Math.max(stats.commonStreakMax || 0, stats.commonStreakCurrent);
    } else {
        stats.commonStreakCurrent = 0;
    }
    
    // Track no legendary streak
    if (aura.tier !== 'legendary') {
        stats.noLegendaryStreakCurrent = (stats.noLegendaryStreakCurrent || 0) + 1;
        stats.noLegendaryStreakMax = Math.max(stats.noLegendaryStreakMax || 0, stats.noLegendaryStreakCurrent);
    } else {
        stats.noLegendaryStreakCurrent = 0;
    }
    
    // Track divine streak
    if (aura.tier === 'divine') {
        stats.divineStreakCount = (stats.divineStreakCount || 0) + 1;
        if (stats.divineStreakCount >= 100) stats.divineStreak100Done = true;
    }
    
    // Track transcendent streak
    if (aura.tier === 'transcendent') {
        stats.transcendentStreakCount = (stats.transcendentStreakCount || 0) + 1;
        if (stats.transcendentStreakCount >= 50) stats.transcendentStreak50Done = true;
    }
    
    // Track no common streaks
    if (aura.tier !== 'common') {
        stats.noCommonComboCount = (stats.noCommonComboCount || 0) + 1;
        
        if (gameState.totalRolls >= 10000 && stats.commonsDeleted === 0) {
            stats.noCommons10kDone = true;
        }
        if (gameState.totalRolls >= 100000 && stats.commonsDeleted === 0) {
            stats.noCommons100kDone = true;
        }
    }
}

// Check all collection completions
function checkAllCollections() {
    const stats = gameState.achievements.stats;
    const auras = gameState.inventory.auras;
    
    // Cosmic collection
    const cosmicAuras = ['Galaxy', 'Universe', 'Cosmos', 'Quasar'];
    stats.cosmicCollectionDone = cosmicAuras.every(a => !!auras[a]);
    stats.cosmicAurasCount = cosmicAuras.filter(a => !!auras[a]).length;
    
    // Error trio
    const errorAuras = ['Glitch', 'ERROR', 'Segfault'];
    stats.errorTrioDone = errorAuras.every(a => !!auras[a]);
    
    // Godly trio
    const godlyAuras = ['Godly Potion (Zeus)', 'Godly Potion (Poseidon)', 'Godly Potion (Hades)'];
    stats.godlyTrioDone = godlyAuras.every(a => !!auras[a]);
    
    // Power trinity
    const powerAuras = ['Power', 'Powered', 'Overpower'];
    stats.powerTrinityDone = powerAuras.every(a => !!auras[a]);
    
    // Check for one aura having over 9000
    for (const auraName in auras) {
        if (auras[auraName].count >= 9001) {
            stats.over9000AuraDone = true;
        }
    }
    
    // Check if player has at least one of each aura type
    const totalUniqueAuras = Object.keys(auras).length;
    if (typeof AURAS !== 'undefined' && totalUniqueAuras >= AURAS.length) {
        stats.oneEachAuraDone = true;
    }
    
    // Track transcendent count
    const transcendentCount = Object.values(auras).filter(a => a.tier === 'transcendent').length;
    stats.transcendentCollectionCount = transcendentCount;
}

// Track session and daily stats
function trackSessionStats(aura) {
    const stats = gameState.achievements.stats;
    
    // Track session rolls
    stats.sessionRolls = (stats.sessionRolls || 0) + 1;
    
    // Track session breakthroughs
    if (aura.isBreakthrough) {
        stats.sessionBreakthroughsCount = (stats.sessionBreakthroughsCount || 0) + 1;
        stats.breakthroughChainCurrent = (stats.breakthroughChainCurrent || 0) + 1;
        stats.breakthroughChainMax = Math.max(stats.breakthroughChainMax || 0, stats.breakthroughChainCurrent);
    } else {
        stats.breakthroughChainCurrent = 0;
    }
    
    // Track daily breakthroughs
    if (aura.isBreakthrough) {
        stats.dailyBreakthroughsCount = (stats.dailyBreakthroughsCount || 0) + 1;
    }
    
    // Track manual vs auto rolls
    if (gameState.autoRoll && gameState.autoRoll.active) {
        stats.autoRolls = (stats.autoRolls || 0) + 1;
    } else {
        stats.manualRolls = (stats.manualRolls || 0) + 1;
        stats.manualOnlyRollsCount = (stats.manualOnlyRollsCount || 0) + 1;
    }
    
    // Track naked rolls (no buffs)
    const hasNoBuffs = gameState.activeEffects.length === 0 && 
                       (!gameState.equipped || Object.keys(gameState.equipped).length === 0);
    if (hasNoBuffs) {
        stats.nakedRollsCount = (stats.nakedRollsCount || 0) + 1;
    }
    
    // Track rapid rolls (under 1 second)
    const now = Date.now();
    if (stats.lastRollTime && (now - stats.lastRollTime) < 1000) {
        stats.rapidRollsCount = (stats.rapidRollsCount || 0) + 1;
    }
    stats.lastRollTime = now;
    
    // Track mutations
    if (aura.isMutation || aura.mutation) {
        stats.mutationObtainedFirst = true;
        stats.mutationHuntingCount = (stats.mutationHuntingCount || 0) + 1;
        
        // Track unique mutations
        if (!stats.uniqueMutationsList) stats.uniqueMutationsList = [];
        if (!stats.uniqueMutationsList.includes(aura.name)) {
            stats.uniqueMutationsList.push(aura.name);
        }
        
        // Track mutation streaks
        stats.mutationStreakCurrent = (stats.mutationStreakCurrent || 0) + 1;
        stats.mutationChainInsaneMax = Math.max(stats.mutationChainInsaneMax || 0, stats.mutationStreakCurrent);
    } else {
        stats.mutationStreakCurrent = 0;
    }
    
    // Track early game achievements (under 100 rolls)
    if (gameState.totalRolls <= 100 && ['legendary', 'mythic', 'exotic'].includes(aura.tier)) {
        stats.earlyGameLucky = true;
        stats.earlyLuckRareCount = (stats.earlyLuckRareCount || 0) + 1;
    }
    
    // Track fast exotic (exotic within 1000 rolls)
    if (gameState.totalRolls <= 1000 && aura.tier === 'exotic') {
        stats.fastExoticCount = (stats.fastExoticCount || 0) + 1;
    }
    
    // Track speed rolling achievements
    if (stats.rapidRollsCount >= 1000) {
        stats.speedRollingCount = (stats.speedRollingCount || 0) + 1;
    }
    if (stats.rapidRollsCount >= 10000) {
        stats.speedRollingProDone = true;
    }
    
    // Check for perfect session (no commons in 100+ rolls)
    if (stats.sessionRolls >= 100) {
        const commonsInSession = stats.sessionCommonsCount || 0;
        if (commonsInSession === 0) {
            stats.perfectSessionDone = true;
        }
    }
    if (aura.tier === 'common') {
        stats.sessionCommonsCount = (stats.sessionCommonsCount || 0) + 1;
    }
    
    // Track Halloween auras and biomes
    trackHalloweenProgress(aura);
    
    // Track daily stats
    trackDailyProgress(aura);
}

// Track Halloween-specific achievements
function trackHalloweenProgress(aura) {
    const stats = gameState.achievements.stats;
    
    // Track Halloween auras obtained
    const halloweenAuras = ['Pumpkin', 'Haunted', 'Spooky', 'Ghost', 'Witch', 'Vampire', 'Reaper', 'THANEBORNE'];
    if (halloweenAuras.some(name => aura.name.includes(name))) {
        if (!stats.halloweenAurasList) stats.halloweenAurasList = [];
        if (!stats.halloweenAurasList.includes(aura.name)) {
            stats.halloweenAurasList.push(aura.name);
            stats.halloweenAurasCount = stats.halloweenAurasList.length;
        }
    }
    
    // Track Halloween biomes visited
    const halloweenBiomes = ['Graveyard', 'Blood Rain', 'Pumpkin Moon'];
    if (halloweenBiomes.includes(gameState.currentBiome)) {
        if (!stats.halloweenBiomesSeenList) stats.halloweenBiomesSeenList = [];
        if (!stats.halloweenBiomesSeenList.includes(gameState.currentBiome)) {
            stats.halloweenBiomesSeenList.push(gameState.currentBiome);
        }
        
        // Track daily Halloween biome rolls
        if (!stats.dailyHalloweenBiomesList) stats.dailyHalloweenBiomesList = [];
        if (!stats.dailyHalloweenBiomesList.includes(gameState.currentBiome)) {
            stats.dailyHalloweenBiomesList.push(gameState.currentBiome);
        }
        
        // Check if all 3 Halloween biomes visited today
        if (stats.dailyHalloweenBiomesList.length >= 3) {
            stats.dailyHalloweenBiomesDone = true;
        }
    }
    
    // Track Halloween Bounty Medal earnings
    if (gameState.currency.halloweenMedals >= 1000) {
        stats.halloweenMedals1kDone = true;
    }
    if (gameState.currency.halloweenMedals >= 10000) {
        stats.halloweenMedals10kDone = true;
    }
}

// Track daily progress
function trackDailyProgress(aura) {
    const stats = gameState.achievements.stats;
    
    // Track daily roll count
    stats.dailyRollsToday = (stats.dailyRollsToday || 0) + 1;
    
    // Track daily auras obtained
    stats.dailyAurasToday = (stats.dailyAurasToday || 0) + 1;
    
    // Check daily roll milestones
    if (stats.dailyRollsToday >= 1000) stats.daily1kRollsDone = true;
    if (stats.dailyRollsToday >= 10000) stats.daily10kRollsDone = true;
    if (stats.dailyRollsToday >= 100000) stats.daily100kRollsDone = true;
    
    // Check daily aura milestone
    if (stats.dailyAurasToday >= 1000000000) stats.dailyBillionAurasDone = true;
    
    // Track login streak
    const now = Date.now();
    const lastLogin = stats.lastLoginDate || 0;
    const daysSinceLastLogin = Math.floor((now - lastLogin) / (24 * 60 * 60 * 1000));
    
    if (daysSinceLastLogin === 1) {
        // Consecutive day
        stats.loginStreakCurrent = (stats.loginStreakCurrent || 0) + 1;
        stats.loginStreakMax = Math.max(stats.loginStreakMax || 0, stats.loginStreakCurrent);
    } else if (daysSinceLastLogin > 1) {
        // Streak broken
        stats.loginStreakCurrent = 1;
    }
    
    stats.lastLoginDate = now;
    
    // Track specific day achievements
    const date = new Date();
    const dayOfWeek = date.getDay();
    const month = date.getMonth();
    const dayOfMonth = date.getDate();
    
    // Track Friday 13th
    if (dayOfWeek === 5 && dayOfMonth === 13) {
        stats.friday13thRollsDone = true;
    }
    
    // Track Halloween (Oct 31)
    if (month === 9 && dayOfMonth === 31) {
        stats.halloweenDayRollsDone = true;
    }
    
    // Track New Year (Jan 1)
    if (month === 0 && dayOfMonth === 1) {
        stats.newYearRollsDone = true;
    }
}

// Track active effects (potion overdose, gear effects, etc.)
function trackActiveEffects() {
    const stats = gameState.achievements.stats;
    
    // Count active potion effects
    const activePotions = gameState.activeEffects.filter(e => !e.type || e.type === 'potion').length;
    stats.maxSimultaneousPotions = Math.max(stats.maxSimultaneousPotions || 0, activePotions);
    
    // Check potion overdose (10+ potions active)
    if (activePotions >= 10) {
        stats.potionOverdoseDone = true;
    }
    
    // Track specific potion effects
    gameState.activeEffects.forEach(effect => {
        if (effect.clarityMode) {
            stats.clarityModeUsedCount = (stats.clarityModeUsedCount || 0) + 1;
        }
        if (effect.phoenixMode) {
            stats.phoenixModeUsedCount = (stats.phoenixModeUsedCount || 0) + 1;
        }
        if (effect.quantumChance) {
            stats.quantumModeUsedCount = (stats.quantumModeUsedCount || 0) + 1;
        }
        if (effect.jackpotMode) {
            stats.jackpotModeUsedCount = (stats.jackpotModeUsedCount || 0) + 1;
        }
        if (effect.gamblerMode) {
            stats.gamblerModeUsedCount = (stats.gamblerModeUsedCount || 0) + 1;
        }
        if (effect.voidheartMode) {
            stats.voidheartModeUsedCount = (stats.voidheartModeUsedCount || 0) + 1;
        }
        if (effect.allOrNothingMode) {
            stats.allOrNothingModeUsedCount = (stats.allOrNothingModeUsedCount || 0) + 1;
        }
        if (effect.insightMode) {
            stats.insightModeUsedCount = (stats.insightModeUsedCount || 0) + 1;
        }
    });
    
    // Track gear effects
    if (gameState.equipped) {
        let gearCount = 0;
        for (const slot in gameState.equipped) {
            if (gameState.equipped[slot]) gearCount++;
        }
        stats.maxGearsEquipped = Math.max(stats.maxGearsEquipped || 0, gearCount);
        
        // Track full set (all 8 slots)
        if (gearCount >= 8) {
            stats.fullGearSetDone = true;
        }
        
        // Track gemstone gear equipped
        const gemstoneSlots = ['Helmet', 'Chestplate', 'Leggings', 'Boots'];
        let gemstoneCount = 0;
        gemstoneSlots.forEach(slot => {
            if (gameState.equipped[slot] && gameState.equipped[slot].name && 
                gameState.equipped[slot].name.includes('Gemstone')) {
                gemstoneCount++;
            }
        });
        if (gemstoneCount >= 4) {
            stats.gemstoneFullSetDone = true;
        }
    }
    
    // Track active rune count
    const activeRunes = gameState.activeEffects.filter(e => e.type === 'rune').length;
    if (activeRunes >= 5) {
        stats.runeStack5Done = true;
    }
}

function checkComplexAchievement(achievement) {
    const auras = gameState.inventory.auras;
    const AURAS_ARRAY = typeof AURAS !== 'undefined' ? AURAS : [];
    
    switch (achievement.type) {
        case 'tier_collection':
            // Check if all auras of a specific tier are collected
            const tierMap = {
                'all_common': 'common',
                'all_uncommon': 'uncommon',
                'all_rare': 'rare',
                'all_epic': 'epic',
                'all_legendary': 'legendary',
                'all_mythic': 'mythic',
                'all_exotic': 'exotic',
                'all_divine': 'divine'
            };
            const targetTier = tierMap[achievement.requirement];
            if (!targetTier) return false;
            
            const tierAuras = AURAS_ARRAY.filter(a => a.tier === targetTier);
            return tierAuras.every(a => !!auras[a.name]);
            
        case 'aura_hoard_count':
            // Check if any aura has the required count
            return Object.values(auras).some(a => a.count >= achievement.requirement);
            
        case 'tier_diversity':
            // Check if player has at least one aura from each tier
            const allTiers = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'exotic', 'divine', 'celestial', 'transcendent'];
            const ownedTiers = new Set(Object.values(auras).map(a => a.tier));
            return allTiers.every(tier => ownedTiers.has(tier));
            
        case 'star_collection':
            // Check if player has all star auras (★, ★★, ★★★)
            const starAuras = ['★', '★★', '★★★'];
            return starAuras.filter(name => !!auras[name]).length >= achievement.requirement;
            
        case 'mutations_collected':
            // Count mutation auras (auras with : in name typically)
            return Object.keys(auras).filter(name => name.includes(':')).length >= achievement.requirement;
            
        case 'complete_collection':
            // Check if all auras are collected
            return AURAS_ARRAY.every(a => !!auras[a.name]);
            
        case 'biome_complete':
            // Check if all auras from any one biome are collected
            const BIOME_AURAS_OBJ = typeof BIOME_AURAS !== 'undefined' ? BIOME_AURAS : {};
            for (const biomeAurasList of Object.values(BIOME_AURAS_OBJ)) {
                if (biomeAurasList.every(auraName => !!auras[auraName])) {
                    return true;
                }
            }
            return false;
            
        case 'tier_set_complete':
            // Check if all T1 gears are owned
            if (achievement.requirement === 'all_t1') {
                const t1Gears = Object.entries(gearData || {}).filter(([name, gear]) => gear.tier === 1);
                return t1Gears.every(([name]) => gameState.inventory.gears && gameState.inventory.gears[name]);
            }
            return false;
            
        default:
            return false;
    }
}

// Track streak mechanics
function trackStreaks(aura) {
    const stats = gameState.achievements.stats;
    const tierValues = {
        'common': 1, 'uncommon': 2, 'good': 3, 'rare': 4, 'epic': 5, 
        'legendary': 6, 'mythic': 7, 'exotic': 8, 'divine': 9, 'celestial': 10, 'transcendent': 11
    };
    
    const tierValue = tierValues[aura.tier] || 0;
    
    // Rare streak (rare+)
    if (tierValue >= 4) {
        stats.rareStreak = (stats.rareStreak || 0) + 1;
    } else {
        stats.rareStreak = 0;
    }
    
    // Epic streak (epic+)
    if (tierValue >= 5) {
        stats.epicStreak = (stats.epicStreak || 0) + 1;
    } else {
        stats.epicStreak = 0;
    }
    
    // Legendary streak (legendary+)
    if (tierValue >= 6) {
        stats.legendaryStreak = (stats.legendaryStreak || 0) + 1;
    } else {
        stats.legendaryStreak = 0;
    }
    
    // No common streak
    if (tierValue > 1) {
        stats.noCommonStreak = (stats.noCommonStreak || 0) + 1;
    } else {
        stats.noCommonStreak = 0;
    }
    
    // Breakthrough streak
    if (aura.breakthrough) {
        stats.breakthroughStreak = (stats.breakthroughStreak || 0) + 1;
    } else {
        stats.breakthroughStreak = 0;
    }
    
    // Same aura streak/count
    if (stats.lastAuraRolled === aura.name) {
        stats.sameAuraStreak = (stats.sameAuraStreak || 0) + 1;
        stats.sameAuraCount = Math.max(stats.sameAuraCount || 0, stats.sameAuraStreak);
    } else {
        stats.sameAuraStreak = 1;
    }
    stats.lastAuraRolled = aura.name;
    
    // Track mythic rolls for daily count
    if (tierValue >= 7) {
        stats.dailyMythicCount = (stats.dailyMythicCount || 0) + 1;
    }
    
    // Track night rolls (midnight to 4am)
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 4) {
        stats.nightRolls = (stats.nightRolls || 0) + 1;
    }
}

function checkAchievements() {
    const stats = gameState.achievements.stats;
    
    for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (gameState.achievements.unlocked[id]) continue; // Already unlocked
        
        let unlocked = false;
        
        switch (achievement.type) {
            case 'rolls':
                unlocked = gameState.totalRolls >= achievement.requirement;
                break;
            case 'rarity':
                unlocked = stats.highestRarity >= achievement.requirement;
                break;
            case 'playtime':
                unlocked = stats.playtimeMinutes >= achievement.requirement;
                break;
            case 'breakthroughs':
                unlocked = stats.breakthroughCount >= achievement.requirement;
                break;
            case 'potions_used':
                unlocked = stats.potionsUsed >= achievement.requirement;
                break;
            case 'runes_used':
                unlocked = stats.runesUsed >= achievement.requirement;
                break;
            case 'chests_opened':
                unlocked = stats.chestsOpened >= achievement.requirement;
                break;
            case 'crafts_made':
                unlocked = stats.craftsMade >= achievement.requirement;
                break;
            case 'gears_crafted':
                unlocked = stats.gearsCrafted >= achievement.requirement;
                break;
            case 'potions_crafted':
                unlocked = stats.potionsCrafted >= achievement.requirement;
                break;
            case 'gear_tier_crafted':
                unlocked = stats.highestGearTierCrafted >= achievement.requirement;
                break;
            case 'session_rolls':
                unlocked = stats.sessionRolls >= achievement.requirement;
                break;
            case 'daily_rolls':
                unlocked = stats.dailyRolls >= achievement.requirement;
                break;
            case 'auto_roll_used':
                unlocked = stats.autoRollsCompleted >= achievement.requirement;
                break;
            case 'auto_rolls_completed':
                unlocked = stats.autoRollsCompleted >= achievement.requirement;
                break;
            case 'quick_roll_streak':
                unlocked = stats.quickRollStreak >= achievement.requirement;
                break;
            case 'max_speed_achieved':
                unlocked = stats.maxSpeedAchieved >= achievement.requirement;
                break;
            case 'max_luck_achieved':
                unlocked = stats.maxLuckAchieved >= achievement.requirement;
                break;
            case 'continuous_minutes':
                unlocked = stats.continuousMinutes >= achievement.requirement;
                break;
            case 'rare_streak':
                unlocked = stats.rareStreak >= achievement.requirement;
                break;
            case 'epic_streak':
                unlocked = stats.epicStreak >= achievement.requirement;
                break;
            case 'legendary_streak':
                unlocked = stats.legendaryStreak >= achievement.requirement;
                break;
            case 'no_common_streak':
                unlocked = stats.noCommonStreak >= achievement.requirement;
                break;
            case 'breakthrough_streak':
                unlocked = stats.breakthroughStreak >= achievement.requirement;
                break;
            case 'same_aura_count':
                unlocked = stats.sameAuraCount >= achievement.requirement;
                break;
            case 'gear_equipped':
                unlocked = stats.gearEquipped >= achievement.requirement;
                break;
            case 'both_slots_equipped':
                unlocked = stats.bothSlotsEquipped;
                break;
            case 'tier_equipped':
                unlocked = stats.highestTierEquipped >= achievement.requirement;
                break;
            case 'unique_gears_owned':
                const gearCount = Object.keys(gameState.inventory.gears || {}).length;
                unlocked = gearCount >= achievement.requirement;
                break;
            case 'gear_swaps':
                unlocked = stats.gearSwaps >= achievement.requirement;
                break;
            case 'no_potion_rolls':
                unlocked = stats.noPotionRolls >= achievement.requirement;
                break;
            case 'no_gear_rolls':
                unlocked = stats.noGearRolls >= achievement.requirement;
                break;
            case 'manual_only_rolls':
                unlocked = stats.manualOnlyRolls >= achievement.requirement;
                break;
            case 'daily_biomes':
                unlocked = (stats.dailyBiomes || []).length >= achievement.requirement;
                break;
            case 'daily_runes':
                unlocked = (stats.dailyRunes || []).length >= achievement.requirement;
                break;
            case 'daily_mythic_count':
                unlocked = stats.dailyMythicCount >= achievement.requirement;
                break;
            case 'daily_login_streak':
                unlocked = stats.loginStreak >= achievement.requirement;
                break;
            case 'night_rolls':
                unlocked = stats.nightRolls >= achievement.requirement;
                break;
            case 'specific_aura':
                unlocked = !!gameState.inventory.auras[achievement.requirement];
                break;
            case 'biome_seen':
                if (!stats.biomesSeen) stats.biomesSeen = [];
                unlocked = stats.biomesSeen.includes(achievement.requirement);
                break;
            case 'unique_auras':
                const uniqueAuraCount = Object.keys(gameState.inventory.auras).length;
                unlocked = uniqueAuraCount >= achievement.requirement;
                break;
            case 'achievement_count':
                const count = Object.keys(gameState.achievements.unlocked).length;
                unlocked = count >= achievement.requirement;
                break;
            // Complex achievement types that need special checking
            case 'tier_collection':
            case 'tier_set_complete':
            case 'tier_diversity':
            case 'aura_hoard_count':
            case 'mutations_collected':
            case 'star_collection':
            case 'biome_complete':
            case 'complete_collection':
                unlocked = checkComplexAchievement(achievement);
                break;
            
            // Rolling Specialist Achievements
            case 'exact_roll_number':
                unlocked = gameState.totalRolls === achievement.requirement;
                break;
            case 'roll_at_1am':
                unlocked = stats.rollsAt1AM >= achievement.requirement;
                break;
            case 'roll_at_3am':
                unlocked = stats.rollsAt3AM >= achievement.requirement;
                break;
            case 'birthday_roll':
                unlocked = stats.birthdayRollDone;
                break;
            case 'new_year_roll':
                unlocked = stats.newYearRollDone;
                break;
            case 'halloween_midnight_roll':
                unlocked = stats.halloweenMidnightDone;
                break;
            case 'alternating_tiers':
                unlocked = stats.alternatingTierCount >= achievement.requirement;
                break;
            case 'ascending_tiers':
                unlocked = stats.ascendingTierCount >= achievement.requirement;
                break;
            case 'descending_tiers':
                unlocked = stats.descendingTierCount >= achievement.requirement;
                break;
            case 'tier_rainbow':
            case 'palindrome_tiers':
            case 'speed_variance':
            case 'instant_100_rolls':
            case 'breakthrough_sandwich':
            case 'biome_hopper_hour':
            case 'mutation_only_100':
            case 'weekend_50k':
            case 'luck_coaster':
            case 'same_letter_5':
            case 'alphabetical_5':
            case 'hourly_48':
            case 'every_15_min':
            case 'rune_stack_5':
            case 'unlucky_to_lucky':
                // These are one-time achievements marked as done
                unlocked = stats[achievement.type + 'Done'];
                break;
            case 'speed_500_rolls':
                unlocked = stats.rollsWithSpeed500 >= achievement.requirement;
                break;
            case 'slow_rolls_50':
                unlocked = stats.rollsWithSpeedUnder50 >= achievement.requirement;
                break;
            case 'triple_same_tier':
            case 'five_same_tier':
            case 'ten_same_tier':
                unlocked = stats.sameTierStreak >= achievement.requirement;
                break;
            case 'breakthrough_only':
                unlocked = stats.breakthroughOnlyStreak >= achievement.requirement;
                break;
            case 'no_breakthrough_1000':
                unlocked = stats.noBreakthroughCount >= achievement.requirement;
                break;
            case 'pity_rare':
                unlocked = stats.rollsSinceRare >= achievement.requirement;
                break;
            case 'pity_epic':
                unlocked = stats.rollsSinceEpic >= achievement.requirement;
                break;
            case 'pity_legendary':
                unlocked = stats.rollsSinceLegendary >= achievement.requirement;
                break;
            case 'no_pity_10k':
                unlocked = gameState.totalRolls >= 10000 && stats.maxRollsWithoutRare <= 50;
                break;
            case 'one_roll_session':
            case 'exact_100_session':
                unlocked = stats[achievement.type + 'Done'];
                break;
            case 'ultra_marathon_session':
                unlocked = stats.currentSessionRolls >= achievement.requirement;
                break;
            case 'micro_sessions':
                unlocked = stats.microSessionCount >= achievement.requirement;
                break;
            case 'daily_100_streak':
            case 'daily_1k_week':
            case 'daily_perfect_month':
                // Check daily streak achievements
                unlocked = checkDailyStreakAchievement(achievement, stats);
                break;
            case 'null_biome_rolls':
                unlocked = stats.rollsInNULL >= achievement.requirement;
                break;
            case 'glitch_biome_rolls':
                unlocked = stats.rollsInGLITCH >= achievement.requirement;
                break;
            case 'dreamspace_rolls':
                unlocked = stats.rollsInDREAMSPACE >= achievement.requirement;
                break;
            case 'single_biome_10k':
                unlocked = stats.currentBiomeRolls >= achievement.requirement;
                break;
            case 'mutation_streak':
                unlocked = stats.mutationStreak >= achievement.requirement;
                break;
            case 'no_mutations_5000':
                unlocked = stats.noMutationCount >= achievement.requirement;
                break;
            case 'monday_10k':
                unlocked = stats.mondayRolls >= achievement.requirement;
                break;
            case 'friday_night':
                unlocked = stats.fridayNightRolls >= achievement.requirement;
                break;
            case 'manual_50k':
                unlocked = stats.manualRolls >= achievement.requirement;
                break;
            case 'auto_100k':
                unlocked = stats.autoRolls >= achievement.requirement;
                break;
            case 'mode_switches':
                unlocked = stats.modeSwitches >= achievement.requirement;
                break;
            case 'luck_1000_rolls':
                unlocked = stats.rollsWithLuck1000 >= achievement.requirement;
                break;
            case 'base_luck_10k':
                unlocked = stats.rollsWithBaseLuck >= achievement.requirement;
                break;
            case 'triple_digit_luck':
            case 'quad_digit_luck':
                unlocked = stats[achievement.type + 'Done'];
                break;
            case 'oblivion_only_1000':
                unlocked = stats.oblivionOnlyRolls >= achievement.requirement;
                break;
            case 'voidheart_100_uses':
                unlocked = stats.voidheartUses >= achievement.requirement;
                break;
            case 'no_potions_50k':
                unlocked = stats.rollsWithoutPotions >= achievement.requirement;
                break;
            case 'no_gear_20k':
                unlocked = stats.rollsWithNoGear >= achievement.requirement;
                break;
            case 'tier10_only_10k':
                unlocked = stats.rollsWithTier10Only >= achievement.requirement;
                break;
            case 'no_runes_10k':
                unlocked = stats.rollsWithoutRunes >= achievement.requirement;
                break;
            case 'same_aura_1000':
                if (!stats.sameAuraLifetimeCount) stats.sameAuraLifetimeCount = {};
                unlocked = Object.values(stats.sameAuraLifetimeCount).some(count => count >= achievement.requirement);
                break;
            case 'different_50':
                unlocked = stats.differentAuraStreak >= achievement.requirement;
                break;
            case 'broke_rolls_1000':
                unlocked = stats.brokeRolls >= achievement.requirement;
                break;
            case 'millionaire_rolls':
                unlocked = stats.millionaireRolls >= achievement.requirement;
                break;
            case 'rolling_spec_master':
                // Check if all rolling specialist achievements are complete
                const rollingSpecAchievements = Object.entries(ACHIEVEMENTS).filter(([id, ach]) => 
                    ach.category === 'ROLLING_SPEC' && id !== 'rolling_specialist_master'
                );
                unlocked = rollingSpecAchievements.every(([id]) => gameState.achievements.unlocked[id]);
                break;
                
            // ========== STAGE 2: 221 MISSING ACHIEVEMENT CASE STATEMENTS ==========
            
            // DELETION/MANAGEMENT ACHIEVEMENTS
            case 'accidental_exotic_delete':
                unlocked = stats.accidentalExoticDeletes >= achievement.requirement;
                break;
            case 'commons_deleted':
                unlocked = stats.commonsDeleted >= achievement.requirement;
                break;
            case 'delete_66':
                unlocked = stats.deletesAt66 >= achievement.requirement;
                break;
            case 'delete_legendary':
                unlocked = stats.legendaryDeletes >= achievement.requirement;
                break;
            case 'delete_mythic':
                unlocked = stats.mythicDeletes >= achievement.requirement;
                break;
            case 'no_delete_10k':
                unlocked = gameState.totalRolls >= 10000 && stats.totalDeletes === 0;
                break;
            case 'regret_master':
                unlocked = stats.totalDeletes >= achievement.requirement;
                break;
            case 'total_deletes':
                unlocked = stats.totalDeletes >= achievement.requirement;
                break;
            case 'inventory_explosion':
                unlocked = stats.inventoryFull;
                break;
            case 'craft_no_use':
                unlocked = stats.craftWithoutUse >= achievement.requirement;
                break;
            case 'gear_swap_addict':
                unlocked = stats.gearSwaps >= achievement.requirement;
                break;

            // BIOME ACHIEVEMENTS
            case 'all_biomes':
                unlocked = stats.allBiomesSeen.length >= achievement.requirement;
                break;
            case 'all_biomes_1000':
                unlocked = stats.allBiomes1000Done;
                break;
            case 'biome_champion':
                unlocked = stats.biomeChampion;
                break;
            case 'biome_combo_specific':
                unlocked = stats.biomeCombosCompleted >= achievement.requirement;
                break;
            case 'biome_completionist':
                unlocked = stats.biomeCompletionist;
                break;
            case 'biome_speedrun':
                unlocked = stats.biomeSpeedrunRecord >= achievement.requirement;
                break;
            case 'biome_visits':
                const biomeName2 = achievement.requirement;
                unlocked = (stats.biomeVisitCounts[biomeName2] || 0) >= achievement.count;
                break;
            case 'blood_rain_visits':
                unlocked = stats.bloodRainVisits >= achievement.requirement;
                break;
            case 'celestial_biomes':
                unlocked = stats.celestialBiomesVisited >= achievement.requirement;
                break;
            case 'danger_biomes':
                unlocked = stats.dangerBiomesVisited >= achievement.requirement;
                break;
            case 'extreme_biomes':
                unlocked = stats.extremeBiomesVisited >= achievement.requirement;
                break;
            case 'graveyard_visits':
                unlocked = stats.graveyardVisits >= achievement.requirement;
                break;
            case 'pumpkin_moon_visits':
                unlocked = stats.pumpkinMoonVisits >= achievement.requirement;
                break;
            case 'starfall_visits':
                unlocked = stats.starfallVisits >= achievement.requirement;
                break;
            case 'weather_biomes':
                unlocked = stats.weatherBiomesVisited >= achievement.requirement;
                break;
            case 'weekly_biomes':
                unlocked = stats.weeklyBiomesTracked.length >= achievement.requirement;
                break;
            case 'solar_lunar_hour':
                unlocked = stats.solarLunarHourDone;
                break;

            // LUCK & RARITY ACHIEVEMENTS
            case 'against_odds':
                unlocked = stats.againstOddsDone;
                break;
            case 'billion_base_luck':
                unlocked = stats.billionBaseLuckRolls >= achievement.requirement;
                break;
            case 'blessed_rng':
                unlocked = stats.blessedRNGCount >= achievement.requirement;
                break;
            case 'consistent_luck':
                unlocked = stats.consistentLuckStreak >= achievement.requirement;
                break;
            case 'early_game_luck':
                unlocked = stats.earlyGameLucky;
                break;
            case 'early_luck':
                unlocked = stats.earlyLuckRareCount >= achievement.requirement;
                break;
            case 'fortune_favored':
                unlocked = stats.fortuneFavored >= achievement.requirement;
                break;
            case 'fortune_smile':
                unlocked = stats.fortuneSmile >= achievement.requirement;
                break;
            case 'high_rarity_no_buffs':
                unlocked = stats.highRarityNoBuffsList.length >= achievement.requirement;
                break;
            case 'insane_luck_100m':
                unlocked = stats.insaneLuck100m;
                break;
            case 'low_luck_billion':
                unlocked = stats.lowLuckBillionDone;
                break;
            case 'luck_chain':
                unlocked = stats.luckChainCount >= achievement.requirement;
                break;
            case 'luck_mastery':
                unlocked = stats.luckMastery >= achievement.requirement;
                break;
            case 'luck_spike':
                unlocked = stats.luckSpikeCount >= achievement.requirement;
                break;
            case 'luck_supreme':
                unlocked = stats.luckSupremeDone;
                break;
            case 'lucky_after_unlucky':
                unlocked = stats.luckyAfterUnluckyDone;
                break;
            case 'lucky_streak':
                unlocked = stats.luckyStreakBest >= achievement.requirement;
                break;
            case 'million_luck':
                unlocked = stats.millionLuckRolls >= achievement.requirement;
                break;
            case 'mythic_base_luck':
                unlocked = stats.mythicBaseLuckDone;
                break;
            case 'no_buff_mythic':
                unlocked = stats.noBuffMythicDone;
                break;
            case 'reverse_luck':
                unlocked = stats.reverseLuckDone;
                break;
            case 'transcendent_base_luck':
                unlocked = stats.transcendentBaseLuckDone;
                break;

            // ROLLING PATTERN ACHIEVEMENTS
            case 'auto_marathon':
                unlocked = stats.autoMarathonDone;
                break;
            case 'billion_rolls':
                unlocked = stats.billionRollsDone;
                break;
            case 'daily_100k_rolls':
                unlocked = stats.daily100kRollsDone;
                break;
            case 'daily_billion_auras':
                unlocked = stats.dailyBillionAurasDone;
                break;
            case 'daily_roll_addict':
                unlocked = stats.dailyRollAddictDone;
                break;
            case 'dawn_patrol':
                unlocked = stats.dawnPatrolRolls >= achievement.requirement;
                break;
            case 'exact_1337_potion':
                unlocked = stats.exact1337PotionDone;
                break;
            case 'exact_420':
                unlocked = stats.exact420Done;
                break;
            case 'exact_69':
                unlocked = stats.exact69Done;
                break;
            case 'exact_777_coins':
                unlocked = stats.exact777CoinsDone;
                break;
            case 'exact_rolls':
                unlocked = gameState.totalRolls === achievement.requirement;
                break;
            case 'exact_streak':
                unlocked = stats.exactStreaksCompleted[achievement.requirement] || false;
                break;
            case 'first_roll_divine':
                unlocked = stats.firstRollDivineDone;
                break;
            case 'golden_hour':
                unlocked = stats.goldenHourRolls >= achievement.requirement;
                break;
            case 'hourly_rolls':
                unlocked = checkHourlyRolls(stats, achievement.requirement);
                break;
            case 'insane_speed':
                unlocked = stats.insaneSpeedRolls >= achievement.requirement;
                break;
            case 'light_speed':
                unlocked = stats.lightSpeedRolls >= achievement.requirement;
                break;
            case 'marathon_rolling':
                unlocked = stats.marathonRollingDone;
                break;
            case 'midnight_rolls':
                unlocked = stats.midnightRollsCount >= achievement.requirement;
                break;
            case 'naked_rolls':
                unlocked = stats.nakedRollsCount >= achievement.requirement;
                break;
            case 'overnight_autoroll':
                unlocked = stats.overnightAutoRollDone;
                break;
            case 'rapid_rolls':
                unlocked = stats.rapidRollsCount >= achievement.requirement;
                break;
            case 'session_666':
                unlocked = stats.session666Done;
                break;
            case 'slow_rolls':
                unlocked = stats.slowRollsCount >= achievement.requirement;
                break;
            case 'speed_rolling':
                unlocked = stats.speedRollingCount >= achievement.requirement;
                break;
            case 'speed_rolling_pro':
                unlocked = stats.speedRollingProDone;
                break;
            case 'weekend_rolls':
                unlocked = stats.weekendRollsTotal >= achievement.requirement;
                break;
            case 'weekly_50k':
                unlocked = stats.weekly50kDone;
                break;
            case 'year_streak':
                unlocked = stats.yearStreakDays >= achievement.requirement;
                break;

            // SPEED & TIMING
            case 'fast_exotic_count':
                unlocked = stats.fastExoticCount >= achievement.requirement;
                break;
            case 'perfect_timing':
                unlocked = stats.perfectTimingDone;
                break;
            case 'voluntary_break':
                unlocked = stats.voluntaryBreakTaken;
                break;

            // STREAKS & COMBOS
            case 'breakthrough_chain':
                unlocked = stats.breakthroughChainMax >= achievement.requirement;
                break;
            case 'combo_master':
                unlocked = stats.comboMasterCount >= achievement.requirement;
                break;
            case 'comeback_commons':
                unlocked = stats.comebackKingDone;
                break;
            case 'common_streak':
                unlocked = stats.commonStreakMax >= achievement.requirement;
                break;
            case 'consecutive_combo':
                unlocked = stats.consecutiveCombos >= achievement.requirement;
                break;
            case 'divine_streak':
                unlocked = stats.divineStreakCount >= achievement.requirement;
                break;
            case 'divine_streak_100':
                unlocked = stats.divineStreak100Done;
                break;
            case 'escalation_combo':
                unlocked = stats.escalationCombos >= achievement.requirement;
                break;
            case 'no_common_combo':
                unlocked = stats.noCommonComboCount >= achievement.requirement;
                break;
            case 'no_commons_100k':
                unlocked = stats.noCommons100kDone;
                break;
            case 'no_commons_10k':
                unlocked = stats.noCommons10kDone;
                break;
            case 'no_legendary_10k':
                unlocked = stats.noLegendary10kDone;
                break;
            case 'no_legendary_streak':
                unlocked = stats.noLegendaryStreakMax >= achievement.requirement;
                break;
            case 'same_common_100':
                unlocked = stats.sameCommon100Done;
                break;
            case 'session_combo':
                unlocked = stats.sessionCombosCompleted.length >= achievement.requirement;
                break;
            case 'theme_combo':
                unlocked = stats.themeCombosCount >= achievement.requirement;
                break;
            case 'tier_climb_streak':
                unlocked = stats.tierClimbStreak >= achievement.requirement;
                break;
            case 'transcendent_streak':
                unlocked = stats.transcendentStreakCount >= achievement.requirement;
                break;
            case 'transcendent_streak_50':
                unlocked = stats.transcendentStreak50Done;
                break;

            // MUTATIONS
            case 'mutation_chain_insane':
                unlocked = stats.mutationChainInsaneMax >= achievement.requirement;
                break;
            case 'mutation_complete':
                unlocked = stats.mutationCollectionDone;
                break;
            case 'mutation_hunting':
                unlocked = stats.mutationHuntingCount >= achievement.requirement;
                break;
            case 'mutation_obtained':
                unlocked = stats.mutationObtainedFirst;
                break;
            case 'mutation_pairs':
                unlocked = stats.mutationPairsCount >= achievement.requirement;
                break;
            case 'mutation_supreme':
                unlocked = stats.mutationSupremeDone;
                break;
            case 'unique_mutations':
                unlocked = stats.uniqueMutationsList.length >= achievement.requirement;
                break;

            // HALLOWEEN
            case 'daily_halloween_biomes':
                unlocked = stats.dailyHalloweenBiomesList.length >= achievement.requirement;
                break;
            case 'glitch_auras':
                unlocked = stats.glitchAurasCount >= achievement.requirement;
                break;
            case 'glitch_biomes':
                unlocked = stats.glitchBiomesCount >= achievement.requirement;
                break;
            case 'halloween_auras_collected':
                unlocked = stats.halloweenAurasList.length >= achievement.requirement;
                break;
            case 'halloween_biome_triple':
                unlocked = stats.halloweenBiomeTripleDone;
                break;
            case 'halloween_biomes_seen':
                unlocked = stats.halloweenBiomesSeenList.length >= achievement.requirement;
                break;
            case 'halloween_complete':
                unlocked = stats.halloweenCompleteDone;
                break;
            case 'halloween_god':
                unlocked = stats.halloweenGodDone;
                break;
            case 'halloween_medal_balance':
                unlocked = stats.halloweenMedalBalancePeak >= achievement.requirement;
                break;
            case 'halloween_medals_earned':
                unlocked = stats.halloweenMedalsEarnedTotal >= achievement.requirement;
                break;
            case 'halloween_runes_used':
                unlocked = stats.halloweenRunesUsedCount >= achievement.requirement;
                break;
            case 'halloween_supreme':
                unlocked = stats.halloweenSupremeDone;
                break;
            case 'pumpkin_aura_obtained':
                unlocked = stats.pumpkinAuraDone;
                break;

            // MERCHANTS
            case 'jack_purchases':
                unlocked = stats.jackPurchasesCount >= achievement.requirement;
                break;
            case 'jester_purchases':
                unlocked = stats.jesterPurchasesCount >= achievement.requirement;
                break;
            case 'mari_purchases':
                unlocked = stats.mariPurchasesCount >= achievement.requirement;
                break;
            case 'merchant_billion':
                unlocked = stats.merchantBillionDone;
                break;
            case 'merchant_spending_insane':
                unlocked = stats.merchantSpendingTotal >= achievement.requirement;
                break;
            case 'met_bounty_jack':
                unlocked = stats.metBountyJackDone;
                break;
            case 'money_spent_merchants':
                unlocked = stats.moneySpentMerchantsTotal >= achievement.requirement;
                break;

            // CURRENCY
            case 'dark_points_earned':
                unlocked = stats.darkPointsEarnedTotal >= achievement.requirement;
                break;
            case 'money_balance':
                unlocked = stats.moneyBalancePeak >= achievement.requirement;
                break;
            case 'money_gain_fast':
                unlocked = stats.moneyGainFastestAmount >= achievement.requirement;
                break;
            case 'money_loss_fast':
                unlocked = stats.moneyLossFastestAmount >= achievement.requirement;
                break;
            case 'void_coin_100k':
                unlocked = stats.voidCoin100kDone;
                break;
            case 'void_coin_balance':
                unlocked = stats.voidCoinBalancePeak >= achievement.requirement;
                break;
            case 'void_coin_spending':
                unlocked = stats.voidCoinsSpentTotal >= achievement.requirement;
                break;
            case 'void_coins_earned':
                unlocked = stats.voidCoinsEarnedTotal >= achievement.requirement;
                break;
            case 'void_coins_lifetime':
                unlocked = stats.voidCoinsLifetimeTotal >= achievement.requirement;
                break;
            case 'zero_money':
                unlocked = stats.zeroMoneyRollsCount >= achievement.requirement;
                break;

            // POTIONS EXTENDED
            case 'all_potions_10k':
                unlocked = stats.allPotions10kDone;
                break;
            case 'clarity_used':
                unlocked = stats.clarityUsedCount >= achievement.requirement;
                break;
            case 'hindsight_rerolls':
                unlocked = stats.hindsightRerollsCount >= achievement.requirement;
                break;
            case 'jackpot_triggered':
                unlocked = stats.jackpotTriggeredCount >= achievement.requirement;
                break;
            case 'oblivion_used':
                unlocked = stats.oblivionUsedCount >= achievement.requirement;
                break;
            case 'one_roll_potions_used':
                unlocked = stats.oneRollPotionsCount >= achievement.requirement;
                break;
            case 'phoenix_revivals':
                unlocked = stats.phoenixRevivalsCount >= achievement.requirement;
                break;
            case 'potion_hoard':
                unlocked = stats.potionHoardMaxAmount >= achievement.requirement;
                break;
            case 'potion_overdose':
                unlocked = stats.potionOverdoseCount >= achievement.requirement;
                break;
            case 'potion_stack':
                unlocked = stats.potionStackMaxCount >= achievement.requirement;
                break;
            case 'potions_conserved':
                unlocked = stats.potionsConservedCount >= achievement.requirement;
                break;
            case 'quantum_chain':
                unlocked = stats.quantumChainMaxLength >= achievement.requirement;
                break;

            // RUNES EXTENDED
            case 'all_runes_5k':
                unlocked = stats.allRunes5kDone;
                break;
            case 'rune_eclipse_used':
                unlocked = stats.runeEclipseUsedCount >= achievement.requirement;
                break;
            case 'rune_everything_used':
                unlocked = stats.runeEverythingUsedCount >= achievement.requirement;
                break;
            case 'rune_stack':
                unlocked = stats.runeStackMaxCount >= achievement.requirement;
                break;
            case 'single_rune_hoard':
                unlocked = stats.singleRuneHoardMax >= achievement.requirement;
                break;
            case 'total_runes':
                unlocked = stats.totalRunesUsedLifetime >= achievement.requirement;
                break;

            // GEARS EXTENDED
            case 'crimson_heart_bonus':
                unlocked = stats.crimsonHeartBonusCount >= achievement.requirement;
                break;
            case 'gear_collection_complete':
                unlocked = stats.gearCollectionCompleteDone;
                break;
            case 'gemstone_triggers':
                unlocked = stats.gemstoneTriggersCount >= achievement.requirement;
                break;
            case 'orion_equipped_minutes':
                unlocked = stats.orionBeltEquippedMinutes >= achievement.requirement;
                break;
            case 'tier10_both_slots':
                unlocked = stats.tier10BothSlotsDone;
                break;
            case 'tier10_complete':
                unlocked = stats.tier10CompleteDone;
                break;
            case 'unique_gears_crafted':
                unlocked = stats.uniqueGearsCraftedCount >= achievement.requirement;
                break;
            case 'divine_one_gear':
                unlocked = stats.divineOneGearDone;
                break;
            case 'cosmic_obtained':
                unlocked = stats.cosmicObtainedDone;
                break;

            // COLLECTIONS
            case 'cosmic_collection':
                unlocked = stats.cosmicCollectionDone;
                break;
            case 'element_collection':
                unlocked = checkElementCollection(stats, achievement.requirement);
                break;
            case 'element_master':
                unlocked = stats.elementMasterDone;
                break;
            case 'error_trio':
                unlocked = stats.errorTrioDone;
                break;
            case 'godly_trio':
                unlocked = stats.godlyTrioDone;
                break;
            case 'one_aura_million':
                unlocked = stats.oneAuraMillionDone;
                break;
            case 'one_each_aura':
                unlocked = stats.oneEachAuraDone;
                break;
            case 'only_one_type':
                unlocked = stats.onlyOneTypeDone;
                break;
            case 'over_9000_aura':
                unlocked = stats.over9000AuraDone;
                break;
            case 'power_trinity':
                unlocked = stats.powerTrinityDone;
                break;
            case 'star_collection_simultaneous':
                unlocked = stats.starCollectionSimultaneousDone;
                break;
            case 'transcendent_collection':
                unlocked = stats.transcendentCollectionCount >= achievement.requirement;
                break;
            case 'transcendent_count':
                unlocked = stats.transcendentTotalCount >= achievement.requirement;
                break;

            // CRAFTING EXTENDED
            case 'daily_crafting_insane':
                unlocked = stats.dailyCraftingInsaneDone;
                break;
            case 'daily_crafts':
                unlocked = stats.dailyCraftCountToday >= achievement.requirement;
                break;
            case 'darklight_crafts':
                unlocked = stats.darklightCraftsCount >= achievement.requirement;
                break;
            case 'million_crafts':
                unlocked = stats.millionCraftsDone;
                break;
            case 'unique_potions_crafted':
                unlocked = stats.uniquePotionsCraftedCount >= achievement.requirement;
                break;

            // DAILY/SESSION EXTENDED
            case 'daily_biome_changes':
                unlocked = stats.dailyBiomeChangesCount >= achievement.requirement;
                break;
            case 'daily_breakthroughs':
                unlocked = stats.dailyBreakthroughsCount >= achievement.requirement;
                break;
            case 'daily_chest_opening':
                unlocked = stats.dailyChestOpeningCount >= achievement.requirement;
                break;
            case 'daily_sessions':
                unlocked = stats.dailySessionsCount >= achievement.requirement;
                break;
            case 'early_login':
                unlocked = stats.earlyLoginDone;
                break;
            case 'perfect_day_rolls':
                unlocked = stats.perfectDayRollsDone;
                break;
            case 'perfect_session':
                unlocked = stats.perfectSessionDone;
                break;
            case 'session_breakthroughs':
                unlocked = stats.sessionBreakthroughsCount >= achievement.requirement;
                break;

            // SPECIAL/MEME/GODLIKE
            case 'big_brain_stacks':
                unlocked = stats.bigBrainStacksCount >= achievement.requirement;
                break;
            case 'early_mythic_trio':
                unlocked = stats.earlyMythicTrioDone;
                break;
            case 'elemental_session':
                unlocked = stats.elementalSessionDone;
                break;
            case 'f2p_grind':
                unlocked = stats.f2pGrindDone;
                break;
            case 'godlike_master':
                unlocked = stats.godlikeMasterDone;
                break;
            case 'insane_master':
                unlocked = stats.insaneMasterDone;
                break;
            case 'meme_master':
                unlocked = stats.memeMasterDone;
                break;
            case 'pain_after_glory':
                unlocked = stats.painAfterGloryDone;
                break;
            case 'rare_mutation':
                unlocked = stats.rareMutationRarity >= achievement.requirement;
                break;
            case 'rare_session_combo':
                unlocked = stats.rareSessionComboCount >= achievement.requirement;
                break;
            case 'rarity_surge':
                unlocked = stats.raritySurgeCount >= achievement.requirement;
                break;
            case 'rolling_supreme':
                unlocked = stats.rollingSupremeDone;
                break;
            case 'specific_master':
                unlocked = stats.specificMasterDone;
                break;
            case 'specific_potion_used':
                unlocked = checkSpecificPotionUsed(stats, achievement.requirement);
                break;
            case 'syrup_used':
                unlocked = stats.syrupUsedCount >= achievement.requirement;
                break;

            // ULTIMATE
            case 'million_breakthroughs':
                unlocked = stats.millionBreakthroughsDone;
                break;
            case 'trillion_rarity':
                unlocked = stats.trillionRarityDone;
                break;
            case 'ultimate_breakthroughs':
                unlocked = stats.ultimateBreakthroughsDone;
                break;
            case 'ultimate_collection':
                unlocked = stats.ultimateCollectionDone;
                break;
            case 'ultimate_master':
                unlocked = stats.ultimateMasterDone;
                break;
            case 'ultimate_rarity':
                unlocked = stats.ultimateRarityDone;
                break;
            case 'ultimate_rolls':
                unlocked = stats.ultimateRollsDone;
                break;

            // MISC
            case 'manual_only':
                unlocked = stats.manualOnlyRollsCount >= achievement.requirement;
                break;
            case 'unique_potions':
                unlocked = stats.uniquePotionsOwnedList.length >= achievement.requirement;
                break;
            case 'unlucky_streak':
                unlocked = stats.unluckyStreakMax >= achievement.requirement;
                break;
        }
        
        if (unlocked) {
            unlockAchievement(id, achievement);
        }
    }
}

// Helper function to check daily streak achievements
function checkDailyStreakAchievement(achievement, stats) {
    if (!stats.dailyRollsHistory) return false;
    
    const dates = Object.keys(stats.dailyRollsHistory).sort();
    if (dates.length === 0) return false;
    
    switch (achievement.type) {
        case 'daily_100_streak': {
            // Check for 30 consecutive days with 100+ rolls each
            let streak = 0;
            for (let i = dates.length - 1; i >= 0; i--) {
                if (stats.dailyRollsHistory[dates[i]] >= 100) {
                    streak++;
                    if (streak >= 30) return true;
                } else {
                    break;
                }
            }
            return false;
        }
        case 'daily_1k_week': {
            // Check for 7 consecutive days with 1000+ rolls each
            let streak = 0;
            for (let i = dates.length - 1; i >= 0; i--) {
                if (stats.dailyRollsHistory[dates[i]] >= 1000) {
                    streak++;
                    if (streak >= 7) return true;
                } else {
                    break;
                }
            }
            return false;
        }
        case 'daily_perfect_month': {
            // Check for 30 consecutive days with at least 1 roll each
            let streak = 0;
            for (let i = dates.length - 1; i >= 0; i--) {
                if (stats.dailyRollsHistory[dates[i]] >= 1) {
                    streak++;
                    if (streak >= 30) return true;
                } else {
                    break;
                }
            }
            return false;
        }
        default:
            return false;
    }
}

// Main tracking function for Rolling Specialist achievements
function trackRollingSpecialistAchievements(aura) {
    const stats = gameState.achievements.stats;
    if (!stats) return;
    
    // Initialize tracking objects if they don't exist
    if (!stats.sameAuraLifetimeCount) stats.sameAuraLifetimeCount = {};
    if (!stats.lastTierPattern) stats.lastTierPattern = [];
    if (!stats.lastDifferentAuras) stats.lastDifferentAuras = [];
    if (!stats.dailyRollsHistory) stats.dailyRollsHistory = {};
    
    // Get current time info
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const isWeekend = day === 0 || day === 6;
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Track roll mode (manual vs auto)
    const currentMode = gameState.autoRoll.active ? 'auto' : 'manual';
    if (stats.lastRollMode && stats.lastRollMode !== currentMode) {
        stats.modeSwitches = (stats.modeSwitches || 0) + 1;
    }
    stats.lastRollMode = currentMode;
    
    if (currentMode === 'manual') {
        stats.manualRolls = (stats.manualRolls || 0) + 1;
    } else {
        stats.autoRolls = (stats.autoRolls || 0) + 1;
    }
    
    // Timing-based achievements
    if (hour === 1 && minute === 0) {
        stats.rollsAt1AM = (stats.rollsAt1AM || 0) + 1;
    }
    if (hour === 3 && minute === 0) {
        stats.rollsAt3AM = (stats.rollsAt3AM || 0) + 1;
    }
    
    // New Year (Jan 1, 12:00 AM)
    if (now.getMonth() === 0 && now.getDate() === 1 && hour === 0 && minute === 0) {
        stats.newYearRollDone = true;
    }
    
    // Halloween midnight (Oct 31, 12:00 AM)
    if (now.getMonth() === 9 && now.getDate() === 31 && hour === 0 && minute === 0) {
        stats.halloweenMidnightDone = true;
    }
    
    // Speed tracking
    const currentSpeed = Math.floor(gameState.currentSpeed * 100);
    if (currentSpeed >= 500) {
        stats.rollsWithSpeed500 = (stats.rollsWithSpeed500 || 0) + 1;
    }
    if (currentSpeed < 50) {
        stats.rollsWithSpeedUnder50 = (stats.rollsWithSpeedUnder50 || 0) + 1;
    }
    
    // Same tier streak
    const tierValues = { 'common': 1, 'uncommon': 2, 'good': 3, 'rare': 4, 'epic': 5, 
                        'legendary': 6, 'mythic': 7, 'exotic': 8, 'divine': 9, 'celestial': 10, 'transcendent': 11 };
    const currentTierValue = tierValues[aura.tier] || 0;
    
    if (stats.lastTierForStreak === currentTierValue) {
        stats.sameTierStreak = (stats.sameTierStreak || 0) + 1;
    } else {
        stats.sameTierStreak = 1;
        stats.lastTierForStreak = currentTierValue;
    }
    
    // Tier patterns
    stats.lastTierPattern = stats.lastTierPattern || [];
    stats.lastTierPattern.push(currentTierValue);
    if (stats.lastTierPattern.length > 10) stats.lastTierPattern.shift();
    
    // Breakthrough tracking
    if (aura.breakthrough) {
        stats.breakthroughOnlyStreak = (stats.breakthroughOnlyStreak || 0) + 1;
        stats.noBreakthroughCount = 0;
    } else {
        stats.breakthroughOnlyStreak = 0;
        stats.noBreakthroughCount = (stats.noBreakthroughCount || 0) + 1;
    }
    
    // Biome tracking
    if (gameState.currentBiome === 'NULL') {
        stats.rollsInNULL = (stats.rollsInNULL || 0) + 1;
    } else if (gameState.currentBiome === 'GLITCHED') {
        stats.rollsInGLITCH = (stats.rollsInGLITCH || 0) + 1;
    } else if (gameState.currentBiome === 'DREAMSPACE') {
        stats.rollsInDREAMSPACE = (stats.rollsInDREAMSPACE || 0) + 1;
    }
    
    // Same biome tracking
    if (stats.lastBiome === gameState.currentBiome) {
        stats.currentBiomeRolls = (stats.currentBiomeRolls || 0) + 1;
    } else {
        stats.currentBiomeRolls = 1;
        stats.lastBiome = gameState.currentBiome;
    }
    
    // Mutation tracking
    const isMutation = aura.name.includes(':');
    if (isMutation) {
        stats.mutationStreak = (stats.mutationStreak || 0) + 1;
        stats.noMutationCount = 0;
    } else {
        stats.mutationStreak = 0;
        stats.noMutationCount = (stats.noMutationCount || 0) + 1;
    }
    
    // Weekend/day tracking
    if (isWeekend) {
        stats.weekendRolls = (stats.weekendRolls || 0) + 1;
    }
    if (day === 1) { // Monday
        stats.mondayRolls = (stats.mondayRolls || 0) + 1;
    }
    if (day === 5 && hour >= 18 && hour < 22) { // Friday 6-10 PM
        stats.fridayNightRolls = (stats.fridayNightRolls || 0) + 1;
    }
    
    // Luck tracking
    const currentLuck = Math.floor(gameState.currentLuck * 100);
    if (currentLuck >= 1000) {
        stats.rollsWithLuck1000 = (stats.rollsWithLuck1000 || 0) + 1;
    }
    if (currentLuck === 100) {
        stats.rollsWithBaseLuck = (stats.rollsWithBaseLuck || 0) + 1;
        // Check for triple/quad digit luck achievements
        if (currentTierValue >= 4 && !stats.tripleDigitLuckDone) { // Rare+
            stats.tripleDigitLuckDone = true;
        }
    }
    if (currentLuck === 1000 && currentTierValue >= 6 && !stats.quadDigitLuckDone) { // Legendary+
        stats.quadDigitLuckDone = true;
    }
    
    // Potion tracking
    const hasOblivionOnly = gameState.activeEffects.length === 1 && 
                           gameState.activeEffects.some(e => e.name === 'Oblivion Potion');
    if (hasOblivionOnly) {
        stats.oblivionOnlyRolls = (stats.oblivionOnlyRolls || 0) + 1;
    }
    
    if (gameState.activeEffects.length === 0) {
        stats.rollsWithoutPotions = (stats.rollsWithoutPotions || 0) + 1;
    }
    
    // Gear tracking
    const hasNoGear = !gameState.equipped.right && !gameState.equipped.left;
    if (hasNoGear) {
        stats.rollsWithNoGear = (stats.rollsWithNoGear || 0) + 1;
    }
    
    // Money tracking
    if (gameState.currency.money === 0) {
        stats.brokeRolls = (stats.brokeRolls || 0) + 1;
    }
    if (gameState.currency.money >= 1000000) {
        stats.millionaireRolls = (stats.millionaireRolls || 0) + 1;
    }
    
    // Same aura lifetime count
    stats.sameAuraLifetimeCount[aura.name] = (stats.sameAuraLifetimeCount[aura.name] || 0) + 1;
    
    // Different aura streak
    if (!stats.lastDifferentAuras.includes(aura.name)) {
        stats.lastDifferentAuras.push(aura.name);
        if (stats.lastDifferentAuras.length > 50) stats.lastDifferentAuras.shift();
        stats.differentAuraStreak = stats.lastDifferentAuras.length;
    } else {
        stats.lastDifferentAuras = [aura.name];
        stats.differentAuraStreak = 1;
    }
    
    // Daily rolls tracking
    if (!stats.dailyRollsHistory[dateStr]) {
        stats.dailyRollsHistory[dateStr] = 0;
    }
    stats.dailyRollsHistory[dateStr]++;
    
    // Session rolls
    stats.currentSessionRolls = (stats.currentSessionRolls || 0) + 1;
    
    // Pity counter tracking - update max
    stats.maxRollsWithoutRare = Math.max(stats.maxRollsWithoutRare || 0, stats.rollsSinceRare || 0);
}

function unlockAchievement(id, achievement) {
    gameState.achievements.unlocked[id] = {
        unlockedAt: Date.now(),
        name: achievement.name
    };
    
    console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
    showAchievementNotification(achievement);
    grantAchievementReward(achievement.reward);
    saveGameState();
    
    // Track for leaderboards (with achievement details for webhook)
    if (typeof leaderboardStats !== 'undefined') {
        leaderboardStats.trackAchievement(achievement.name, achievement.description);
    }
    
    // Check for achievement milestone achievements
    setTimeout(() => checkAchievements(), 100);
}

function showAchievementNotification(achievement) {
    // Check if achievement notifications are enabled
    if (gameState.settings?.notifications?.achievements === false) {
        return;
    }
    
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    
    let rewardsHtml = '';
    if (achievement.reward) {
        rewardsHtml = '<div class="achievement-rewards">';
        
        if (achievement.reward.money) {
            rewardsHtml += `<span class="reward-item">💰 ${achievement.reward.money.toLocaleString()} coins</span>`;
        }
        
        if (achievement.reward.items) {
            for (const [itemName, count] of Object.entries(achievement.reward.items)) {
                if (itemName === 'Void Coin' || itemName === 'Void Coins') {
                    rewardsHtml += `<span class="reward-item">🌀 ${count} Void Coin${count > 1 ? 's' : ''}</span>`;
                } else {
                    rewardsHtml += `<span class="reward-item">📦 ${count}x ${itemName}</span>`;
                }
            }
        }
        
        if (achievement.reward.potions) {
            for (const [potionName, count] of Object.entries(achievement.reward.potions)) {
                rewardsHtml += `<span class="reward-item">🧪 ${count}x ${potionName}</span>`;
            }
        }
        
        if (achievement.reward.buff) {
            rewardsHtml += `<span class="reward-item">⚡ ${achievement.reward.buff}</span>`;
        }
        
        rewardsHtml += '</div>';
    }
    
    notification.innerHTML = `
        <div class="achievement-badge">🏆</div>
        <div class="achievement-content">
            <div class="achievement-title">Achievement Unlocked!</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
            ${rewardsHtml}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

function grantAchievementReward(reward) {
    if (!reward) return;
    
    // Grant money
    if (reward.money) {
        const oldMoney = gameState.currency.money || 0;
        const newMoney = oldMoney + reward.money;
        
        // Anti-cheat: Mark this as a legitimate transaction
        if (window.anomalyDetector) {
            window.anomalyDetector.markLegitimateTransaction();
        }
        
        gameState.currency.money = newMoney;
        trackCurrencyChange('money', reward.money, true);
        // FIX: Check the ACHIEVEMENT notification setting before showing the reward message.
        if (gameState.settings?.notifications?.achievements !== false) {
            showNotification(`💰 Received ${reward.money.toLocaleString()} coins!`);
        }
        console.log(`Received ${reward.money} coins!`);
    }
    
    // Grant potions
    if (reward.potions) {
        for (const [potionName, count] of Object.entries(reward.potions)) {
            if (!gameState.inventory.potions[potionName]) {
                gameState.inventory.potions[potionName] = { count: 0 };
            }
            gameState.inventory.potions[potionName].count += count;
            console.log(`Received ${count}x ${potionName}!`);
        }
    }
    
    // Grant items
    if (reward.items) {
        for (const [itemName, count] of Object.entries(reward.items)) {
            // Check if it's Void Coins (special currency)
            if (itemName === 'Void Coin' || itemName === 'Void Coins') {
                gameState.currency.voidCoins = (gameState.currency.voidCoins || 0) + count;
                 // FIX: Check the ACHIEVEMENT notification setting here as well.
                if (gameState.settings?.notifications?.achievements !== false) {
                    showNotification(`🌀 Received ${count} Void Coin${count > 1 ? 's' : ''}!`);
                }
                console.log(`Received ${count}x Void Coins!`);
            } else {
                if (!gameState.inventory.items[itemName]) {
                    gameState.inventory.items[itemName] = { count: 0 };
                }
                gameState.inventory.items[itemName].count += count;
                console.log(`Received ${count}x ${itemName}!`);
            }
        }
    }
    
    // Grant buffs (logged but not implemented)
    if (reward.buff) {
        console.log(`Received buff: ${reward.buff}!`);
    }
    
    updateUI();
    updateInventoryDisplay();
    saveGameState();
}

function updatePlaytime() {
    const now = Date.now();
    const elapsed = now - gameState.achievements.stats.lastPlaytimeUpdate;
    const minutes = elapsed / (1000 * 60);
    
    gameState.achievements.stats.playtimeMinutes += minutes;
    gameState.achievements.stats.lastPlaytimeUpdate = now;
    
    saveGameState();
    checkAchievements();
}

function trackBreakthrough() {
    gameState.achievements.stats.breakthroughCount++;
    checkAchievements();
}

function trackPotionUse() {
    gameState.achievements.stats.potionsUsed++;
    checkAchievements();
}

function trackAuraRarity(rarity) {
    if (rarity > gameState.achievements.stats.highestRarity) {
        gameState.achievements.stats.highestRarity = rarity;
        checkAchievements();
    }
}

function showNotification(message, type = 'info') {
    // FIX: Check if general notifications are enabled before showing any toast.
    if (gameState.settings?.notifications?.general === false) {
        return; // Exit immediately if general notifications are disabled
    }

    // Determine toast type based on message content for better feedback
    let toastType = type;
    if (message.includes('✅') || message.includes('Purchased') || message.includes('Unlocked')) {
        toastType = 'success';
    } else if (message.includes('❌') || message.includes('Cannot') || message.includes('Not enough')) {
        toastType = 'error';
    } else if (message.includes('⚠️')) {
        toastType = 'warning';
    } else if (message.includes('✨') || message.includes('Rare') || message.includes('Mythic') || message.includes('Divine')) {
        toastType = 'rare';
    } else if (message.includes('💊') || message.includes('Found')) {
        // Use the default 'info' type for item drops
        toastType = 'info';
    }
    
    showToast(message, toastType);
}

function checkDailyReset() {
    const now = new Date();
    const today = now.toDateString();
    const stats = gameState.achievements.stats;
    
    // Check if it's a new day
    if (stats.lastLoginDate !== today) {
        const lastDate = stats.lastLoginDate ? new Date(stats.lastLoginDate) : null;
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Update login streak
        if (!stats.loginStreak) stats.loginStreak = 0;
        
        if (!lastDate) {
            // First time login
            stats.loginStreak = 1;
        } else if (lastDate.toDateString() === yesterday.toDateString()) {
            // Logged in yesterday - continue streak
            stats.loginStreak++;
        } else {
            // Missed a day - reset streak
            stats.loginStreak = 1;
        }
        
        // Reset daily stats
        stats.dailyRolls = 0;
        stats.dailyBiomes = [];
        stats.dailyRunes = [];
        stats.dailyMythicCount = 0;
        stats.lastLoginDate = today;
        
        console.log(`Daily reset! Login streak: ${stats.loginStreak} days`);
        
        saveGameState();
        checkAchievements();
    }
}

function initGame() {
    console.log('Initializing game...');
    loadGameState();
    
    // Check for daily reset and login streak
    checkDailyReset();
    
    // Perform catch-up rolls if auto-roll was active when page was closed
    performCatchUpRolls();
    
    setupEventListeners();
    initCutsceneSystem();
    if (typeof initBiomeSystem === 'function') initBiomeSystem();
    if (typeof initMerchantSystem === 'function') initMerchantSystem();
    
    // Initialize all sidebar displays
    initializeSidebarCards();
    
    updateUI();
    updateInventoryDisplay();
    updateActiveEffects();
    updateEquipmentDisplay();
    if (typeof updateRecipesList === 'function') updateRecipesList();
    updateAutoRollButton();
    initAchievementSystem();
    if (typeof initDailyQuests === 'function') initDailyQuests();
    if (typeof initQuestSystem === 'function') initQuestSystem();
    initializeBulkModeControls();
    console.log('Game initialized!');
}

function initializeSidebarCards() {
    // Ensure biome icon is visible
    const biomeIcon = document.querySelector('.biome-icon');
    if (biomeIcon && !biomeIcon.textContent) {
        biomeIcon.textContent = '🌟';
    }
    
    // Ensure biome display is set
    const biomeDisplay = document.getElementById('biomeDisplay');
    if (biomeDisplay && biomeDisplay.textContent === 'STAR') {
        // Force update from biome state if available
        if (typeof biomeState !== 'undefined' && biomeState.currentBiome) {
            biomeDisplay.textContent = biomeState.currentBiome;
        }
    }
    
    // Force update time display
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay && typeof biomeState !== 'undefined') {
        const timeIcon = timeDisplay.querySelector('.time-icon');
        const timeText = timeDisplay.querySelector('.time-text');
        if (timeIcon && timeText) {
            timeIcon.textContent = biomeState.isDay ? '☀️' : '🌙';
            timeText.textContent = biomeState.isDay ? 'Day' : 'Night';
        }
    }
    
    console.log('Sidebar cards initialized');
}

function performCatchUpRolls() {
    // Only perform catch-up if auto-roll was active
    if (!gameState.autoRoll || !gameState.autoRoll.active) return;
    
    // Check if we have a last active time
    if (!gameState.lastActiveTime) {
        gameState.lastActiveTime = Date.now();
        return;
    }
    
    const now = Date.now();
    const timeSinceLastActive = now - gameState.lastActiveTime;
    
    // Only catch up if less than 24 hours have passed (prevent excessive rolls)
    if (timeSinceLastActive > 24 * 60 * 60 * 1000) {
        console.log('More than 24 hours passed - skipping catch-up rolls');
        gameState.lastActiveTime = now;
        return;
    }
    
    const baseDelay = gameState.autoRoll.delay || 600;
    const effectiveDelay = Math.max(50, baseDelay / (gameState.currentSpeed || 1.0));
    const missedRolls = Math.floor(timeSinceLastActive / effectiveDelay);
    
    if (missedRolls > 0) {
        const cappedRolls = Math.min(missedRolls, 200); // Cap at 200 catch-up rolls on page load
        console.log(`🔄 Page reload catch-up: Performing ${cappedRolls} rolls (offline for ${(timeSinceLastActive / 1000).toFixed(1)}s)`);
        
        // Perform catch-up rolls instantly (no animation)
        for (let i = 0; i < cappedRolls; i++) {
            if (!gameState.autoRoll.active) break;
            instantRollAura();
        }
        
        // Show notification to user
        if (cappedRolls >= 10) {
            setTimeout(() => {
                showToast(`Auto-roll catch-up: ${cappedRolls} rolls completed!`, 'success', 3000);
            }, 1000);
        }
    }
    
    gameState.lastActiveTime = now;
}

function initAchievementSystem() {
    // Update playtime every minute
    setInterval(updatePlaytime, 60000);
    
    // Save game state every 30 seconds to keep lastActiveTime current
    setInterval(() => {
        if (gameState.autoRoll && gameState.autoRoll.active) {
            saveGameState();
        }
    }, 30000);
    
    // Check achievements on init
    checkAchievements();
    
    // Initialize anti-cheat periodic checks
    if (window.antiCheat) {
        window.antiCheat.startPeriodicCheck(gameState);
        console.log('🛡️ Anti-cheat system active');
    }
}

function saveGameState() { 
    // Save last active timestamp for catch-up rolls
    gameState.lastActiveTime = Date.now();
    
    // Use anti-cheat system if available
    if (window.antiCheat) {
        window.antiCheat.saveGameState(gameState);
    } else {
        // Fallback to normal save
        localStorage.setItem('solsRngGame', JSON.stringify(gameState));
    }
}
function loadGameState() {
    // Use anti-cheat system if available
    let loadedState = null;
    if (window.antiCheat) {
        loadedState = window.antiCheat.loadGameState();
        if (loadedState) {
            Object.assign(gameState, loadedState);
        }
    } else {
        // Fallback to normal load
        const saved = localStorage.getItem('solsRngGame');
        if (saved) Object.assign(gameState, JSON.parse(saved));
    }
    
    gameState.isRolling = false;
    if (!gameState.inventory.potions) gameState.inventory.potions = {};
    if (!gameState.inventory.items) gameState.inventory.items = {};
    if (!gameState.inventory.auras) gameState.inventory.auras = {};
    if (!gameState.inventory.gears) gameState.inventory.gears = {};
    if (!gameState.inventory.runes) gameState.inventory.runes = {};
    if (!gameState.equipped) gameState.equipped = { right: null, left: null };
    if (!gameState.specialEffects) {
        gameState.specialEffects = {
            gemstoneActive: false,
            gemstoneBoost: { luck: 0, speed: 0 },
            gemstoneEndTime: 0
        };
    }
    if (!gameState.autoRoll) {
        gameState.autoRoll = { active: false, interval: null, delay: 600 };
    } else {
        if (gameState.autoRoll.interval) clearInterval(gameState.autoRoll.interval);
        gameState.autoRoll.interval = null;
        gameState.autoRoll.active = false;
    }
    // Initialize settings if they don't exist
    if (!gameState.settings) {
        gameState.settings = {
            cutscenes: {
                enabled: true,
                individualToggles: {}
            },
            notifications: {
                achievements: true,
                general: true
            },
            music: {
                enabled: true,
                volume: 0.3 // 30%
            }
        };
    }
    if (!gameState.settings.cutscenes) {
        gameState.settings.cutscenes = {
            enabled: true,
            individualToggles: {}
        };
    }
    if (!gameState.settings.cutscenes.individualToggles) {
        gameState.settings.cutscenes.individualToggles = {};
    }
    if (!gameState.settings.notifications) {
        gameState.settings.notifications = {
            achievements: true,
            general: true
        };
    }
    if (!gameState.settings.music) {
        gameState.settings.music = {
            enabled: true,
            volume: 0.3 // 30%
        };
    }
    // Initialize achievements if they don't exist
    if (!gameState.achievements) {
        gameState.achievements = {
            unlocked: {},
            stats: {
                highestRarity: 0,
                playtimeMinutes: 0,
                breakthroughCount: 0,
                potionsUsed: 0,
                lastPlaytimeUpdate: Date.now()
            }
        };
    }
    if (!gameState.achievements.stats) {
        gameState.achievements.stats = {
            highestRarity: 0,
            playtimeMinutes: 0,
            breakthroughCount: 0,
            potionsUsed: 0,
            lastPlaytimeUpdate: Date.now()
        };
    }
    if (!gameState.achievements.stats.lastPlaytimeUpdate) {
        gameState.achievements.stats.lastPlaytimeUpdate = Date.now();
    }
    
    // Initialize Rolling Specialist tracking variables if they don't exist
    const stats = gameState.achievements.stats;
    if (!stats.sameAuraLifetimeCount) stats.sameAuraLifetimeCount = {};
    if (!stats.lastTierPattern) stats.lastTierPattern = [];
    // Fix lastDifferentAuras if it was saved as object instead of array
    if (!stats.lastDifferentAuras || !Array.isArray(stats.lastDifferentAuras)) {
        stats.lastDifferentAuras = [];
    }
    if (!stats.dailyRollsHistory) stats.dailyRollsHistory = {};
    if (stats.rollsAt1AM === undefined) stats.rollsAt1AM = 0;
    if (stats.rollsAt3AM === undefined) stats.rollsAt3AM = 0;
    if (stats.rollsWithSpeed500 === undefined) stats.rollsWithSpeed500 = 0;
    if (stats.rollsWithSpeedUnder50 === undefined) stats.rollsWithSpeedUnder50 = 0;
    if (stats.sameTierStreak === undefined) stats.sameTierStreak = 0;
    if (stats.breakthroughOnlyStreak === undefined) stats.breakthroughOnlyStreak = 0;
    if (stats.noBreakthroughCount === undefined) stats.noBreakthroughCount = 0;
    if (stats.currentSessionRolls === undefined) stats.currentSessionRolls = 0;
    if (stats.microSessionCount === undefined) stats.microSessionCount = 0;
    if (stats.rollsInNULL === undefined) stats.rollsInNULL = 0;
    if (stats.rollsInGLITCH === undefined) stats.rollsInGLITCH = 0;
    if (stats.rollsInDREAMSPACE === undefined) stats.rollsInDREAMSPACE = 0;
    if (stats.currentBiomeRolls === undefined) stats.currentBiomeRolls = 0;
    if (stats.mutationStreak === undefined) stats.mutationStreak = 0;
    if (stats.noMutationCount === undefined) stats.noMutationCount = 0;
    if (stats.weekendRolls === undefined) stats.weekendRolls = 0;
    if (stats.mondayRolls === undefined) stats.mondayRolls = 0;
    if (stats.fridayNightRolls === undefined) stats.fridayNightRolls = 0;
    if (stats.manualRolls === undefined) stats.manualRolls = 0;
    if (stats.autoRolls === undefined) stats.autoRolls = 0;
    if (stats.modeSwitches === undefined) stats.modeSwitches = 0;
    if (stats.rollsWithLuck1000 === undefined) stats.rollsWithLuck1000 = 0;
    if (stats.rollsWithBaseLuck === undefined) stats.rollsWithBaseLuck = 0;
    if (stats.oblivionOnlyRolls === undefined) stats.oblivionOnlyRolls = 0;
    if (stats.voidheartUses === undefined) stats.voidheartUses = 0;
    if (stats.rollsWithoutPotions === undefined) stats.rollsWithoutPotions = 0;
    if (stats.rollsWithNoGear === undefined) stats.rollsWithNoGear = 0;
    if (stats.rollsWithTier10Only === undefined) stats.rollsWithTier10Only = 0;
    if (stats.rollsWithoutRunes === undefined) stats.rollsWithoutRunes = 0;
    if (stats.differentAuraStreak === undefined) stats.differentAuraStreak = 0;
    if (stats.brokeRolls === undefined) stats.brokeRolls = 0;
    if (stats.millionaireRolls === undefined) stats.millionaireRolls = 0;
    if (stats.maxRollsWithoutRare === undefined) stats.maxRollsWithoutRare = 0;
    
    // Initialize Stage 1: 221 Missing Achievement Variables
    if (!stats.deletionHistory) stats.deletionHistory = [];
    if (!stats.biomeVisitCounts) stats.biomeVisitCounts = {};
    if (!stats.weeklyBiomesTracked) stats.weeklyBiomesTracked = [];
    if (!stats.allBiomesSeen) stats.allBiomesSeen = [];
    if (!stats.highRarityNoBuffsList) stats.highRarityNoBuffsList = [];
    if (!stats.exactStreaksCompleted) stats.exactStreaksCompleted = {};
    if (!stats.hourlyRollTracker) stats.hourlyRollTracker = {};
    if (!stats.sessionCombosCompleted) stats.sessionCombosCompleted = [];
    if (!stats.uniqueMutationsList) stats.uniqueMutationsList = [];
    if (!stats.dailyHalloweenBiomesList) stats.dailyHalloweenBiomesList = [];
    if (!stats.halloweenAurasList) stats.halloweenAurasList = [];
    if (!stats.halloweenBiomesSeenList) stats.halloweenBiomesSeenList = [];
    if (!stats.elementCollectionsList) stats.elementCollectionsList = {};
    if (!stats.uniquePotionsOwnedList) stats.uniquePotionsOwnedList = [];
    if (!stats.specificPotionsUsed) stats.specificPotionsUsed = {};
    
    // Update UI to match loaded settings
    updateCutsceneSettingsUI();
}

// Flag to prevent duplicate event listener registration
let eventListenersSetup = false;

function setupEventListeners() {
    // Prevent duplicate listener registration
    if (eventListenersSetup) return;
    eventListenersSetup = true;
    
    document.getElementById('rollButton').addEventListener('click', rollAura);
    document.getElementById('quickRollButton').addEventListener('click', quickRollAura);
    document.getElementById('autoRollButton').addEventListener('click', toggleAutoRoll);
    
    // Recipe search functionality
    const recipeSearch = document.getElementById('recipeSearch');
    if (recipeSearch) {
        recipeSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterRecipes(searchTerm);
        });
    }
    
    // Main tab switching (hierarchical tabs)
    document.querySelectorAll('.tab-btn[data-main-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mainTab = btn.dataset.mainTab;
            
            // Remove active from all main tabs and main tab contents
            document.querySelectorAll('.tab-btn[data-main-tab]').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            
            // Activate clicked main tab and its content
            btn.classList.add('active');
            const mainTabContent = document.getElementById(mainTab + '-main-tab');
            if (mainTabContent) {
                mainTabContent.classList.add('active');
            }
            
            // Handle special cases
            if (mainTab === 'progress') {
                // Update achievements if visible
                const achievementsTab = document.getElementById('achievements-tab');
                if (achievementsTab && achievementsTab.classList.contains('active')) {
                    updateAchievementsInventory();
                }
            }
            if (mainTab === 'settings') {
                initializeSettingsUI();
            }
        });
    });
    
    // Sub-tab switching
    document.querySelectorAll('.sub-tab-btn[data-sub-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            const subTab = btn.dataset.subTab;
            
            // Get the parent sub-tabs container to only affect siblings
            const parentSubTabs = btn.closest('.sub-tabs');
            const parentMainTab = btn.closest('.tab-content');
            
            if (parentSubTabs && parentMainTab) {
                // Remove active from sibling sub-tab buttons
                parentSubTabs.querySelectorAll('.sub-tab-btn').forEach(el => el.classList.remove('active'));
                
                // Remove active from sibling sub-tab contents
                parentMainTab.querySelectorAll('.sub-tab-content').forEach(el => el.classList.remove('active'));
                
                // Activate clicked sub-tab and its content
                btn.classList.add('active');
                const subTabContent = document.getElementById(subTab + '-tab');
                if (subTabContent) {
                    subTabContent.classList.add('active');
                }
                
                // Update achievements display when switching to achievements sub-tab
                if (subTab === 'achievements') {
                    updateAchievementsInventory();
                }
            }
        });
    });
}

// Helper function to get the rolled aura without displaying it
function getActualRolledAura() {
    // Check if there's a forced next aura from ADMIN
    if (gameState.forcedNextAura) {
        const forcedAuraName = gameState.forcedNextAura;
        
        // Find the aura in the AURAS array
        const forcedAura = AURAS.find(aura => aura.name === forcedAuraName);
        
        if (forcedAura) {
            // Clear the forced aura after using it
            delete gameState.forcedNextAura;
            
            console.log('👑 Admin: Forced aura used:', forcedAuraName);
            showNotification(`👑 Admin blessed you with: ${forcedAuraName}!`, 'success');
            return forcedAura;
        }
    }
    
    // Check if there's a forced next aura from debug menu
    if (gameState.debug && gameState.debug.forcedNextAura) {
        const forcedAuraName = gameState.debug.forcedNextAura;
        
        // Find the aura in the AURAS array
        const forcedAura = AURAS.find(aura => aura.name === forcedAuraName);
        
        if (forcedAura) {
            // Clear the forced aura after using it
            delete gameState.debug.forcedNextAura;
            
            // Update debug UI if available
            const toggle = document.getElementById('forceNextAuraToggle');
            const status = document.getElementById('nextAuraStatus');
            if (toggle) toggle.checked = false;
            if (status) {
                status.textContent = 'Forced aura used - No aura selected';
                status.style.background = 'rgba(0,0,0,0.1)';
                status.style.color = '#ffffff';
            }
            
            console.log('Debug: Forced aura used:', forcedAuraName);
            return forcedAura;
        }
    }
    
    return getRandomAura();
}

// Spawn base potions with configurable drop rates
function spawnBasePotions() {
    // Drop rates: Higher = more common
    const dropRates = {
        'Lucky Potion': 0.15,    // 15% chance per roll
        'Speed Potion': 0.12     // 12% chance per roll
    };
    
    for (const [potionName, dropRate] of Object.entries(dropRates)) {
        if (Math.random() < dropRate) {
            // Award the potion
            if (!gameState.inventory.potions[potionName]) {
                gameState.inventory.potions[potionName] = { count: 0 };
            }
            
            // Random amount between 1-3
            const amount = Math.floor(Math.random() * 3) + 1;
            gameState.inventory.potions[potionName].count += amount;
            
            // Show notification
            showNotification(`💊 Found ${amount}x ${potionName}!`);
        }
    }
}

// Helper function to complete roll logic with a pre-rolled aura
// Helper function to complete roll logic with a pre-rolled aura
async function completeRollWithAura(aura, isQuickRoll = false) {
    // Store base rarity for display purposes (before any modifications)
    if (!aura.baseRarity) {
        aura.baseRarity = aura.rarity;
    }
    
    // Track Rolling Specialist achievements
    trackRollingSpecialistAchievements(aura);
    
    // Apply 2x luck bonus if active
    if (gameState.specialEffects.twoxLuckBonus) {
        // Double the effective rarity for better aura selection (but don't modify the actual rarity for display)
        aura.effectiveRarity = (aura.effectiveRarity || aura.rarity) * 2;
        // Don't double aura.rarity - keep it at original value for display purposes
        
        // Clear the bonus flag and hide UI indicator
        gameState.specialEffects.twoxLuckBonus = false;
        const bonusIndicator = document.getElementById('bonusRollIndicator');
        if (bonusIndicator) {
            bonusIndicator.style.display = 'none';
        }
        
        // Show notification that bonus was used (only if not already shown)
        if (!gameState.specialEffects.twoxLuckNotificationShown) {
            showNotification('2X LUCK BONUS ACTIVATED!');
            gameState.specialEffects.twoxLuckNotificationShown = true;
            
            // Clear the notification flag after a short delay to prevent spam
            setTimeout(() => {
                gameState.specialEffects.twoxLuckNotificationShown = false;
            }, 1000);
        }
    }
    
    const storedRarity = aura.effectiveRarity || aura.rarity;
    const isNewAura = !gameState.inventory.auras[aura.name];
    if (isNewAura) {
        gameState.inventory.auras[aura.name] = { count: 0, rarity: storedRarity, tier: aura.tier };
    }
    gameState.inventory.auras[aura.name].rarity = Math.min(gameState.inventory.auras[aura.name].rarity, storedRarity);
    gameState.inventory.auras[aura.name].count++;
    gameState.inventory.auras[aura.name].lastWasBreakthrough = !!aura.breakthrough;
    
    // Auto-submit collected stats when a new unique aura is collected
    if (isNewAura && typeof window.globalLeaderboard !== 'undefined' && 
        typeof window.globalLeaderboard.submitCollectedStats === 'function') {
        // Debounce to avoid spamming the database
        clearTimeout(window.collectedStatsSubmitTimeout);
        window.collectedStatsSubmitTimeout = setTimeout(() => {
            // Calculate total score and unique auras count
            const totalScore = Object.values(gameState.inventory.auras)
                .filter(data => data.count > 0)
                .reduce((sum, data) => sum + (data.rarity || 0), 0);
            const uniqueAuras = Object.values(gameState.inventory.auras)
                .filter(data => data.count > 0).length;
            window.globalLeaderboard.submitCollectedStats(totalScore, uniqueAuras);
        }, 2000); // Wait 2 seconds after collecting to batch multiple new auras
    }
    
    // Halloween Bounty Medal rewards for Halloween biome auras
    const halloweenAuras = [
        // Pumpkin Moon auras
        'Pumpkin', 'Pumpkin: Spice', 'Pumpkin: Lantern', 'Gingerbread', 'Gingerbread: Haunted', 
        'Headless :Horseman', 'PHANTASMA', '< A R A C H N O P H O B I A >', 'Autumn', 'Autumn: Harvest', 'Autumn: Spooky', 'Pump', 'PUMP : TRICKSTER',
        // Graveyard auras
        'Headless', 'APOCALYPSE', '〔BANSHEE〕', 'RAVAGE', 'Lost Soul', 'Lost Soul: Vengeful', 'Lost Soul: Tormented',
        'Undead', 'Undead: Devil', 'Undead: Lich', 'Raven', 'Raven: Nevermore', 'Raven: Omen', 
        'Dullahan', 'Dullahan: Headless', 'Dullahan: Reaper', 'Spectre', 'Spectre: Poltergeist', 'Spectre: Wraith',
        'Terror', 'Terror: Phobia', 'Terror: Nightmare', 'Nightmare Sky', 'Nightmare Sky: Abyss', 'Nightmare Sky: Eclipse',
        'Soul Hunter', 'Soul Hunter: Reaper',
        // Blood Rain auras
        'Vampiric', 'Vampiric: Bloodmoon', 'Accursed', 'MALEDICTION', 'LAMENTHYR', 'Erebus',
        'Bloodlust', 'Bloodlust: Sanguine', 'Bloodlust: Carnage', 'Bleeding', 'Bleeding: Ichor', 'Bleeding: Hemophilia', 
        'Crimson', 'Crimson: Ichor', 'Crimson: Corruption', 'Rage', 'Rage: Heated', 'Rage: Bloodrage',
        'Ruby', 'Ruby: Incandescent', 'Ruby: Bloodstone', 'Diaboli', 'Diaboli: Void', 'Diaboli: Hellspawn',
        // Halloween-themed transcendent auras
        'Lunar', 'Lunar: Full Moon', 'Lunar C Nightfall', 'Vital', 'Vital: Lifeforce',
        'Moonflower', 'Moonflower: Bloom', 'Harvester', 'Harvester: Scythe', 'Apostolos: Veil'
    ];
    
    if (halloweenAuras.includes(aura.name)) {
        // Calculate medal reward based on rarity tier
        let medalReward = 0;
        const tier = aura.tier?.toLowerCase();
        
        if (tier === 'common' || tier === 'uncommon') medalReward = 1;
        else if (tier === 'good' || tier === 'rare') medalReward = 2;
        else if (tier === 'epic') medalReward = 3;
        else if (tier === 'legendary') medalReward = 5;
        else if (tier === 'mythic') medalReward = 10;
        else if (tier === 'exotic') medalReward = 25;
        else if (tier === 'divine') medalReward = 50;
        else if (tier === 'celestial') medalReward = 100;
        else if (tier === 'transcendent') medalReward = 250;
        else if (tier === 'cosmic') medalReward = 1000;
        
        if (medalReward > 0) {
            gameState.currency.halloweenMedals = (gameState.currency.halloweenMedals || 0) + medalReward;
            showNotification(`🎃 +${medalReward} Halloween Bounty Medals!`);
        }
    }
    
    // Track aura discovery in codex
    if (typeof discoverCodexEntry === 'function') {
        discoverCodexEntry('auras', aura.name);
    }

    // Submit to global leaderboard if this is a global aura
    if (typeof window.globalLeaderboard !== 'undefined' && 
        typeof window.globalLeaderboard.isGlobalAura === 'function' &&
        window.globalLeaderboard.isGlobalAura(aura)) {
        try {
            window.globalLeaderboard.submitGlobalAura(aura, window.gameState.totalRolls || 0);
            
            // Broadcast global roll notification to all players
            if (typeof window.globalNotifications !== 'undefined') {
                const playerName = localStorage.getItem('playerName') || 'Anonymous';
                window.globalNotifications.broadcastGlobalRoll(aura.name, aura.rarity, playerName);
            }
        } catch (error) {
            console.error('Error submitting to leaderboard:', error);
        }
    }

    // Process special potion effects
    const processedAura = processSpecialPotionEffects(aura);
    if (processedAura) {
        aura = processedAura; // Use the processed aura if it was changed
    }

    // Quantum Potion: Chance for instant re-roll
    const quantumPotion = gameState.activeEffects.find(effect => effect.quantumChance);
    if (quantumPotion && Math.random() < quantumPotion.quantumChance) {
        // Check max chain limit
        if (!quantumPotion.quantumChain) quantumPotion.quantumChain = 0;
        if (quantumPotion.quantumChain < quantumPotion.maxQuantumChain) {
            quantumPotion.quantumChain++;
            
            showNotification(`Quantum Potion activated! Chain ${quantumPotion.quantumChain} - Instant re-roll!`);
            
            // Visual feedback
            const display = document.getElementById('currentAuraDisplay');
            if (display) {
                display.classList.add('quantum-reroll');
                setTimeout(() => display.classList.remove('quantum-reroll'), 1000);
            }
            
            // Reset chain after delay to prevent infinite chains
            setTimeout(() => {
                quantumPotion.quantumChain = 0;
            }, 1000);
            
            // Trigger instant re-roll
            setTimeout(() => {
                if (!gameState.isRolling) {
                    quickRollAura();
                }
            }, 500);
        }
    }

    // Process special gear effects
    const gearProcessedAura = processSpecialGearEffects(aura);
    if (gearProcessedAura) {
        aura = gearProcessedAura; // Use the processed aura if it was changed
    }

    // Specific cutscene mappings (MP4 videos only)
    const specificCutscenes = {
        "Abyssal Hunter": playAbyssalHunterCutscene,
        "Overture: History": playOvertureHistoryCutscene,
        "Overture: Future": playOvertureFutureCutscene,
        "Gargantua": playGargantuaCutscene,
        "Chromatic: Genesis": playChromaticGenesisCutscene,
        "Chromatic: Exotic": playChromaticExoticCutscene,
        "Archangel": playArchangelsCutscene,
        "Archangel: Seraphim": playArchangelSeraphimCutscene,
        "『E Q U I N O X』": playEquinoxCutscene,
        "Luminosity": playLuminosityCutscene,
        "Dreammetric": playDreammetricCutscene,
        "Aegis": playAegisCutscene,
        "Apostolos": playApostolosCutscene,
        "Oblivion": playOblivionCutscene,
        "Abomination": playAbominationCutscene,
        "Memory: The Fallen": playMemoryCutscene,
        "Eden": playEdenCutscene,
        "Oppression": playOppressionCutscene,
        "Symphony": playSymphonyCutscene,
        "Kyawthuite: Remembrance": playKyawthuiteCutscene,
        "Flora: Evergreen": playFloraEvergreenCutscene,
        "Matrix: Overdrive": playMatrixOverdriveCutscene,
        "Mastermind": playMastermindCutscene,
        "Manta": playMantaCutscene,
        "Bloodlust: Sanguine": playBloodlustSanguineCutscene,
        "Atlas": playAtlasCutscene,
        "Aviator: Fleet": playAviatorFleetCutscene,
        "Impeached: I'm Peach": playImPeachCutscene,
        "Astral: Legendarium": playLegendariumCutscene,
        "Lotusfall": playLotusfallCutscene,
        "Orchestra": playOrchestraCutscene,
        "Ruins": playRuinsCutscene,
        "Unknown": playUnknownCutscene,
        "Aegis - Watergun": playAegisWatergunCutscene,
        "Twilight: Withering Grace": playWitheringGraceCutscene
    };

    const videoFunction = specificCutscenes[aura.name];

    // Check cutscene settings using new comprehensive system
    const shouldPlayCutscene = typeof shouldPlayCutsceneForAura === 'function' 
        ? shouldPlayCutsceneForAura(aura)
        : true; // Fallback to true if function not loaded

    if (shouldPlayCutscene) {
        if (videoFunction) {
            // 1. First, check for specific, named cutscenes (including MP4s)
            await videoFunction(aura);
        }
        else if (shouldTriggerUltraRareCutscene(aura)) { 
            // 2. If no specific cutscene, check for 99M+ rarity - use enhanced seal breaking cutscene (with fade to black for globals)
            await playUltraRareCutscene(aura);
        }
        else if (shouldTriggerCutscene(aura)) {
            // 3. Then, check for the 10M-98.9M rarity.
            await playUltraRareCutscene(aura);
        }
        else if (shouldTriggerRareCutscene(aura)) {
            // 4. Finally, check for the 1M-9.9M rarity.
            await playRareCutscene(aura);
        }
    }

    // Don't call displayAura here - we already displayed it during the animation

    const oneRollIndex = gameState.activeEffects.findIndex(effect => effect.oneRoll);
    if (oneRollIndex !== -1) {
        gameState.activeEffects.splice(oneRollIndex, 1);
    }

    // Check if we had cooldown removal before filtering
    const hadCooldownRemoval = gameState.activeEffects.some(e => e.removeCooldown && e.rollCount);
    
    for (const effect of gameState.activeEffects) {
        if (effect.rollCount) {
            effect.rollsLeft = (effect.rollsLeft || effect.rollCount) - 1;
        }
    }
    gameState.activeEffects = gameState.activeEffects.filter(effect => !effect.rollCount || effect.rollsLeft > 0);
    
    // Restore normal cooldown if removeCooldown potion ran out
    if (hadCooldownRemoval && !gameState.activeEffects.some(e => e.removeCooldown)) {
        if (gameState.autoRoll && gameState.autoRoll.active && autoRollWorker) {
            const baseDelay = gameState.autoRoll.delay || 600;
            const normalDelay = Math.max(50, baseDelay / gameState.currentSpeed);
            console.log('⏱️ Warp/Transcendent expired - restoring cooldown:', normalDelay, 'ms');
            autoRollWorker.postMessage({
                type: 'updateDelay',
                delay: normalDelay
            });
        }
    }

    // Spawn base potions (Lucky Potion and Speed Potion)
    spawnBasePotions();

    // QoL: Add to roll history
    if (typeof addToRollHistory === 'function') {
        addToRollHistory(aura);
    }
    
    // Track achievements
    trackAuraRarity(aura.rarity);
    if (aura.breakthrough) {
        trackBreakthrough();
    }
    trackStreaks(aura);
    
    // Track session and daily rolls
    gameState.achievements.stats.sessionRolls = (gameState.achievements.stats.sessionRolls || 0) + 1;
    gameState.achievements.stats.dailyRolls = (gameState.achievements.stats.dailyRolls || 0) + 1;
    
    // Track auto roll completion
    if (gameState.autoRoll.active) {
        gameState.achievements.stats.autoRollsCompleted = (gameState.achievements.stats.autoRollsCompleted || 0) + 1;
    }
    
    // Track max luck and speed
    const currentLuck = Math.floor(gameState.currentLuck * 100);
    const currentSpeed = Math.floor(gameState.currentSpeed * 100);
    gameState.achievements.stats.maxLuckAchieved = Math.max(gameState.achievements.stats.maxLuckAchieved || 0, currentLuck);
    gameState.achievements.stats.maxSpeedAchieved = Math.max(gameState.achievements.stats.maxSpeedAchieved || 0, currentSpeed);
    
    // ========== STAGE 4: NEW ACHIEVEMENT TRACKING LOGIC ==========
    trackNewAchievements(aura);
    
    checkAchievements();
    
    // Send notifications for rare auras (desktop/Discord)
    if (typeof sendRareAuraNotification === 'function') {
        sendRareAuraNotification(aura);
    }
    
    // Track comprehensive leaderboard stats
    if (typeof leaderboardStats !== 'undefined') {
        leaderboardStats.trackRoll(aura);
        leaderboardStats.trackAura(aura);
        if (aura.breakthrough) {
            leaderboardStats.trackBreakthrough();
        }
        leaderboardStats.trackLuckSpeed(gameState.currentLuck, gameState.currentSpeed);
        if (gameState.currentBiome) {
            leaderboardStats.trackBiomeRoll(gameState.currentBiome);
        }
        if (gameState.autoRoll?.active) {
            leaderboardStats.trackAutoRoll();
        }
    }

    recalculateStats();
    updateUI();
    // Skip recipe update during auto-roll to prevent UI shifting
    updateInventoryDisplay(gameState.autoRoll?.active);
    updateRollCounter(); // Update roll counter to show bonus status
    
    // Check auto-craft unlock and trigger
    if (typeof checkAutoCraftUnlock === 'function') {
        checkAutoCraftUnlock();
    }
    if (typeof updateAutoCraftButton === 'function') {
        updateAutoCraftButton();
    }
    if (typeof autoCraftAndEquip === 'function') {
        autoCraftAndEquip();
    }
    
    // Check auto-potion unlock and trigger
    if (typeof checkAutoPotionUnlock === 'function') {
        checkAutoPotionUnlock();
    }
    if (typeof updateAutoPotionButton === 'function') {
        updateAutoPotionButton();
    }
    if (typeof autoCraftAndUsePotion === 'function') {
        autoCraftAndUsePotion();
    }
    
    saveGameState();
    gameState.isRolling = false;
    document.getElementById('rollButton').disabled = false;
    document.getElementById('quickRollButton').disabled = false;
    
    // Fast auto roll trigger: If auto roll is active, trigger quick roll with animation
    if (gameState.autoRoll.active && !cutsceneState.active) {
        setTimeout(() => {
            if (gameState.autoRoll.active && !gameState.isRolling && !cutsceneState.active) {
                quickRollAura(); // Use quick roll for fast animated next roll
            }
        }, 150); // Quick speed - 0.15 second delay
    }
}

function rollAura() {
    if (gameState.isRolling) return;
    
    // Anti-cheat: Check roll rate
    if (window.anomalyDetector && !window.anomalyDetector.checkRollRate()) {
        console.warn('Roll rate check failed');
        return;
    }
    
    gameState.isRolling = true;
    document.getElementById('rollButton').disabled = true;

    // Increment total rolls and check for 10th roll bonus
    gameState.totalRolls++;
    if (gameState.totalRolls % 10 === 0) {
        gameState.specialEffects.twoxLuckBonus = true;
        const bonusIndicator = document.getElementById('bonusRollIndicator');
        if (bonusIndicator) {
            bonusIndicator.textContent = '2X LUCK READY!';
            bonusIndicator.style.display = 'block';
        }
    }
    
    // Increment roll counter
    gameState.currentRollCount = (gameState.currentRollCount + 1) % 10;
    
    // Update roll counter display
    updateRollCounter();
    
    // Hide bonus roll indicator when rolling
    const bonusIndicator = document.getElementById('bonusRollIndicator');
    if (bonusIndicator) {
        bonusIndicator.style.display = 'none';
    }

    // Check for rollCooldownReduction effect from Time Bender and Time Warp Potion
    let cooldownReduction = 0;
    for (let slot in gameState.equipped) {
        const gearName = gameState.equipped[slot];
        if (gearName && gearData[gearName]?.effects?.special === 'rollCooldownReduction') {
            cooldownReduction = gearData[gearName].effects.reduction || 0;
        }
    }
    
    // Apply Time Warp Potion cooldown reduction
    const timeWarpPotion = gameState.activeEffects.find(effect => effect.cooldownReduction);
    if (timeWarpPotion) {
        cooldownReduction += timeWarpPotion.cooldownReduction;
    }

    const baseRollTime = 1500; // Changed from 3000 to 1500 (half as long)
    const rollTime = (baseRollTime - (baseRollTime * cooldownReduction)) / gameState.currentSpeed;
    const display = document.getElementById('currentAuraDisplay');
    
    // Add rolling animation class
    display.classList.add('rolling');
    
    // Keep cycling at consistent speed until the end
    const startTime = Date.now();
    let lastUpdateTime = startTime;
    const cycleInterval = 50; // Consistent fast cycling
    
    function cycleAura() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = elapsed / rollTime;
        
        if (progress >= 1) {
            // Stop cycling
            display.classList.remove('rolling');
            
            // Get the actual rolled aura first
            const finalAura = getActualRolledAura();
            
            // Brief pause then reveal with animation
            setTimeout(() => {
                // Display the actual result
                displayAura(finalAura, false);
                
                // Animate the reveal
                anime({
                    targets: display,
                    scale: [1.2, 1],
                    opacity: [0, 1],
                    duration: 600,
                    easing: 'easeOutElastic(1, .6)'
                });
                
                // Complete the roll logic (save to inventory, etc)
                setTimeout(() => {
                    completeRollWithAura(finalAura);
                }, 300);
            }, 100);
            return;
        }
        
        // Keep cycling at consistent speed until the end
        if (currentTime - lastUpdateTime >= cycleInterval) {
            lastUpdateTime = currentTime;
            
            // Get random aura and display
            const auraPool = getAuraPool();
            const randomAura = auraPool[Math.floor(Math.random() * auraPool.length)];
            
            // Quick fade animation for each cycle
            anime({
                targets: display,
                scale: [0.98, 1],
                opacity: [0.9, 1],
                duration: 40,
                easing: 'linear'
            });
            
            displayAura(randomAura, true);
        }
        
        // Continue cycling - use background-compatible animation frame
        backgroundRequestAnimationFrame(cycleAura);
    }
    
    cycleAura();
}

function quickRollAura() {
    if (gameState.isRolling) return;
    gameState.isRolling = true;
    document.getElementById('quickRollButton').disabled = true;
    document.getElementById('rollButton').disabled = true;

    // Increment total rolls and check for 10th roll bonus
    gameState.totalRolls++;
    if (gameState.totalRolls % 10 === 0) {
        gameState.specialEffects.twoxLuckBonus = true;
        const bonusIndicator = document.getElementById('bonusRollIndicator');
        if (bonusIndicator) {
            bonusIndicator.textContent = '2X LUCK READY!';
            bonusIndicator.style.display = 'block';
        }
    }
    
    // Increment roll counter
    gameState.currentRollCount = (gameState.currentRollCount + 1) % 10;
    
    // Update roll counter display
    updateRollCounter();

    // Check for rollCooldownReduction effect from Time Bender and Time Warp Potion
    let cooldownReduction = 0;
    for (let slot in gameState.equipped) {
        const gearName = gameState.equipped[slot];
        if (gearName && gearData[gearName]?.effects?.special === 'rollCooldownReduction') {
            cooldownReduction = gearData[gearName].effects.reduction || 0;
        }
    }
    
    // Apply Time Warp Potion cooldown reduction
    const timeWarpPotion = gameState.activeEffects.find(effect => effect.cooldownReduction);
    if (timeWarpPotion) {
        cooldownReduction += timeWarpPotion.cooldownReduction;
    }

    const quickRollTime = 250; // Changed from 500 to 250 (half as long)
    const rollTime = (quickRollTime - (quickRollTime * cooldownReduction)) / gameState.currentSpeed;
    const display = document.getElementById('currentAuraDisplay');
    
    // Add rolling animation
    display.classList.add('rolling');
    
    // Fast cycling for quick roll
    const startTime = Date.now();
    let lastUpdateTime = startTime;
    const cycleInterval = 30;
    
    function cycleAura() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        
        if (elapsed >= rollTime) {
            display.classList.remove('rolling');
            
            // Get the actual rolled aura
            const finalAura = getActualRolledAura();
            
            // Display and animate reveal
            displayAura(finalAura, false);
            anime({
                targets: display,
                scale: [1.1, 1],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuad'
            });
            
            // Complete the roll logic
            setTimeout(() => {
                completeRollWithAura(finalAura, true);
            }, 150);
            return;
        }
        
        if (currentTime - lastUpdateTime >= cycleInterval) {
            lastUpdateTime = currentTime;
            
            const auraPool = getAuraPool();
            const randomAura = auraPool[Math.floor(Math.random() * auraPool.length)];
            displayAura(randomAura, true);
        }
        
        // Continue cycling - use background-compatible animation frame
        backgroundRequestAnimationFrame(cycleAura);
    }
    
    cycleAura();
}

function toggleAutoRoll() {
    const autoRollButton = document.getElementById('autoRollButton');
    
    if (gameState.autoRoll.active) {
        gameState.autoRoll.active = false;
        if (gameState.autoRoll.interval) {
            clearInterval(gameState.autoRoll.interval);
            gameState.autoRoll.interval = null;
        }
        // Stop Web Worker
        if (autoRollWorker) {
            autoRollWorker.postMessage({type: 'stop'});
            autoRollWorker.terminate();
            autoRollWorker = null;
        }
    } else {
        gameState.autoRoll.active = true;
        lastRollTime = Date.now(); // Initialize timestamp
        
        // Check if any active potion removes cooldown (Warp or Transcendent)
        let hasCooldownRemoval = false;
        if (gameState.activePotions) {
            hasCooldownRemoval = gameState.activePotions.some(potion => {
                const recipe = POTION_RECIPES.find(r => r.name === potion.name);
                return recipe && recipe.removeCooldown === true;
            });
        }
        
        // Calculate effective delay based on roll speed
        const baseDelay = gameState.autoRoll.delay || 600;
        let effectiveDelay;
        
        if (hasCooldownRemoval) {
            // Remove cooldown entirely for super fast rolling
            effectiveDelay = 0;
            console.log('🚀 WARP/TRANSCENDENT ACTIVE - COOLDOWN REMOVED!');
        } else {
            effectiveDelay = Math.max(50, baseDelay / gameState.currentSpeed); // Min 50ms
        }
        
        expectedNextRollTime = lastRollTime + effectiveDelay;
        
        // Start anti-throttle system on user interaction
        if (window.startAntiThrottle) {
            window.startAntiThrottle();
        }
        
        performAutoRoll();
        
        // Use Web Worker for better background performance
        if (typeof Worker !== 'undefined') {
            autoRollWorker = createAutoRollWorker();
            autoRollWorker.postMessage({
                type: 'start',
                delay: effectiveDelay
            });
        } else {
            // Fallback to regular interval if Web Workers not supported
            gameState.autoRoll.interval = setInterval(() => {
                // Check both isRolling and cutscene state
                if (gameState.autoRoll.active && !gameState.isRolling && !cutsceneState.active) {
                    performAutoRoll();
                }
            }, effectiveDelay);
        }
    }
    updateAutoRollButton();
    saveGameState();
}

// Keep auto roll running when tab is not active
document.addEventListener('visibilitychange', () => {
    if (gameState.autoRoll && gameState.autoRoll.active) {
        if (!document.hidden) {
            // Tab became visible - worker already handled catch-up rolls in real-time
            console.log(`✅ Tab visible - switching to animated rolls`);
            
            // Perform one normal roll with animation
            if (!gameState.isRolling && !cutsceneState.active) {
                performAutoRoll();
            }
        } else {
            // Tab became hidden - worker will now do instant rolls
            console.log(`🌙 Tab hidden - switching to instant rolls (full speed)`);
        }
    }
});

// Background-compatible timer system
let backgroundTimer = null;
let backgroundInterval = null;

function startBackgroundTimer(callback, delay) {
    // Use Web Worker timer for background compatibility
    if (typeof Worker !== 'undefined') {
        const workerCode = `
            let timerId = null;
            self.onmessage = function(e) {
                if (e.data.type === 'start') {
                    const delay = e.data.delay;
                    if (timerId) clearTimeout(timerId);
                    timerId = setTimeout(() => {
                        self.postMessage({type: 'tick'});
                    }, delay);
                } else if (e.data.type === 'stop') {
                    if (timerId) {
                        clearTimeout(timerId);
                        timerId = null;
                    }
                }
            };
        `;
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));
        
        worker.onmessage = function(e) {
            if (e.data.type === 'tick') {
                callback();
            }
        };
        
        worker.postMessage({ type: 'start', delay: delay });
        return worker;
    } else {
        // Fallback to regular setTimeout
        return setTimeout(callback, delay);
    }
}

function stopBackgroundTimer(timer) {
    if (timer && timer.postMessage) {
        timer.postMessage({ type: 'stop' });
        timer.terminate();
    } else if (timer) {
        clearTimeout(timer);
    }
}

// Replace requestAnimationFrame with background-compatible alternative
function backgroundRequestAnimationFrame(callback) {
    if (document.hidden) {
        // Use setTimeout when tab is hidden (approx 60fps)
        return setTimeout(callback, 16);
    } else {
        return requestAnimationFrame(callback);
    }
}

// Override the global requestAnimationFrame for background compatibility
const originalRAF = window.requestAnimationFrame;
window.requestAnimationFrame = function(callback) {
    if (document.hidden) {
        return setTimeout(callback, 16); // ~60fps when hidden
    }
    return originalRAF.call(window, callback);
};

// Alternative approach using Web Workers for background processing
let autoRollWorker = null;
let lastRollTime = 0;
let expectedNextRollTime = 0;

function createAutoRollWorker() {
    const workerCode = `
        let intervalId = null;
        let backupIntervalId = null;
        let isActive = false;
        let delay = 600;
        let lastRollTime = 0;
        let rollCount = 0;
        
        // Multi-timer approach to fight throttling
        function startRolling() {
            if (intervalId) clearInterval(intervalId);
            if (backupIntervalId) clearInterval(backupIntervalId);
            
            lastRollTime = Date.now();
            
            // Primary timer - runs at requested delay
            intervalId = setInterval(() => {
                if (isActive) {
                    const now = Date.now();
                    rollCount++;
                    self.postMessage({type: 'roll', timestamp: now, expectedDelay: delay, rollCount: rollCount});
                    lastRollTime = now;
                }
            }, delay);
            
            // Backup timer - runs slightly faster to detect throttling
            // If primary is throttled, this will catch it
            backupIntervalId = setInterval(() => {
                if (isActive) {
                    const now = Date.now();
                    const timeSinceLastRoll = now - lastRollTime;
                    
                    // If we haven't rolled in 1.5x the expected delay, force a roll
                    if (timeSinceLastRoll > delay * 1.5) {
                        rollCount++;
                        self.postMessage({type: 'roll', timestamp: now, expectedDelay: delay, rollCount: rollCount, backup: true});
                        lastRollTime = now;
                    }
                }
            }, Math.max(100, delay / 2)); // Check at half the delay or minimum 100ms
        }
        
        self.onmessage = function(e) {
            switch(e.data.type) {
                case 'start':
                    isActive = true;
                    delay = e.data.delay || 600;
                    startRolling();
                    break;
                case 'stop':
                    isActive = false;
                    if (intervalId) {
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                    if (backupIntervalId) {
                        clearInterval(backupIntervalId);
                        backupIntervalId = null;
                    }
                    break;
                case 'updateDelay':
                    delay = e.data.delay;
                    if (isActive) {
                        startRolling();
                    }
                    break;
            }
        };
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    
    worker.onmessage = function(e) {
        if (e.data.type === 'roll' && gameState.autoRoll.active) {
            const now = Date.now();
            const timeSinceLastRoll = now - lastRollTime;
            const expectedDelay = e.data.expectedDelay;
            
            // Calculate how many rolls we missed due to throttling
            let missedRolls = 0;
            if (timeSinceLastRoll > expectedDelay * 1.2) { // More sensitive threshold (1.2x instead of 1.5x)
                missedRolls = Math.floor(timeSinceLastRoll / expectedDelay) - 1;
                missedRolls = Math.max(0, Math.min(missedRolls, 100)); // Increased cap to 100 catch-up rolls per cycle
                
                if (missedRolls > 0) {
                    const secondsDelayed = (timeSinceLastRoll / 1000).toFixed(1);
                    if (e.data.backup) {
                        console.log(`🔄 Background throttling detected: ${missedRolls} instant rolls (${secondsDelayed}s delay)`);
                    } else {
                        console.log(`⚡ Catch-up: ${missedRolls} instant rolls (${secondsDelayed}s delay)`);
                    }
                }
            }
            
            // Do ALL missed rolls instantly (no animation) - this keeps pace even when throttled
            for (let i = 0; i < missedRolls; i++) {
                if (!gameState.autoRoll.active) break;
                instantRollAura();
            }
            
            // Do the current roll - instant if tab is hidden, animated if visible
            if (gameState.autoRoll.active && !cutsceneState.active) {
                if (document.hidden) {
                    // Instant roll when tab is hidden for maximum speed
                    instantRollAura();
                } else {
                    // Animated roll when tab is visible
                    if (!gameState.isRolling) {
                        performAutoRoll();
                    }
                }
            }
            
            lastRollTime = now;
            expectedNextRollTime = now + expectedDelay;
        }
    };
    
    return worker;
}

function performAutoRoll() {
    // Wait if rolling OR if a cutscene is active
    if (gameState.isRolling || !gameState.autoRoll.active || cutsceneState.active) return;
    quickRollAura(); // Use quick roll for fast auto rolls with animation
}

function instantRollAura() {
    // Truly instant roll for catch-up (no animation, no delay)
    const finalAura = getActualRolledAura();
    
    // Increment roll counter
    gameState.currentRollCount = (gameState.currentRollCount + 1) % 10;
    
    // Update roll counter display
    updateRollCounter();
    
    // Complete immediately without setting isRolling flag
    // This allows multiple instant rolls in succession
    completeRollWithAura(finalAura, true);
}

function updateAutoRollButton() {
    const autoRollButton = document.getElementById('autoRollButton');
    if (!autoRollButton) return;
    if (gameState.autoRoll.active) {
        autoRollButton.textContent = 'AUTO ROLL: ON';
        autoRollButton.classList.add('active');
    } else {
        autoRollButton.textContent = 'AUTO ROLL: OFF';
        autoRollButton.classList.remove('active');
    }
}

function equipGear(gearName, slot) {
    if (!gameState.inventory.gears[gearName] || gameState.inventory.gears[gearName].count <= 0) return;
    const gearInfo = gearData[gearName];
    if (!gearInfo || (gearInfo.hand && gearInfo.hand !== slot)) return;
    
    if (gameState.equipped[slot]) unequipGear(slot);
    
    gameState.equipped[slot] = gearName;
    gameState.inventory.gears[gearName].count--;
    if (gameState.inventory.gears[gearName].count <= 0) {
        delete gameState.inventory.gears[gearName];
    }
    
    // Track achievements
    if (!gameState.achievements.stats.gearEquipped) {
        gameState.achievements.stats.gearEquipped = 0;
    }
    gameState.achievements.stats.gearEquipped++;
    
    // Track gear swaps
    gameState.achievements.stats.gearSwaps = (gameState.achievements.stats.gearSwaps || 0) + 1;
    
    // Track highest tier equipped
    const gearTier = gearInfo.tier || 1;
    if (gearTier > (gameState.achievements.stats.highestTierEquipped || 0)) {
        gameState.achievements.stats.highestTierEquipped = gearTier;
    }
    
    // Check if both slots equipped (left and right hands)
    if (gameState.equipped.left && gameState.equipped.right) {
        gameState.achievements.stats.bothSlotsEquipped = true;
    }
    
    checkAchievements();
    
    applyGearEffects();
    updateEquipmentDisplay();
    updateInventoryDisplay();
    updateActiveEffects();
    saveGameState();
}

function unequipGear(slot) {
    const equippedGear = gameState.equipped[slot];
    if (!equippedGear) return;
    
    if (!gameState.inventory.gears[equippedGear]) {
        gameState.inventory.gears[equippedGear] = { count: 0, tier: gearData[equippedGear]?.tier || 1 };
    }
    gameState.inventory.gears[equippedGear].count++;
    gameState.equipped[slot] = null;
    
    applyGearEffects();
    updateEquipmentDisplay();
    updateInventoryDisplay();
    updateActiveEffects();
    saveGameState();
}

function applyGearEffects() {
    recalculateStats();
}

function updateEquipmentDisplay() {
    const rightSlot = document.getElementById('rightHandSlot');
    const leftSlot = document.getElementById('leftHandSlot');
    const accessorySlot = document.getElementById('accessorySlot');
    const rightUnequipBtn = document.querySelector('[data-slot="right"] .unequip-btn');
    const leftUnequipBtn = document.querySelector('[data-slot="left"] .unequip-btn');
    const accessoryUnequipBtn = document.querySelector('[data-slot="accessory"] .unequip-btn');
    
    // Update right hand slot
    if (gameState.equipped.right) {
        const gearInfo = gearData[gameState.equipped.right];
        const effects = getGearEffectsText(gearInfo);
        if (rightSlot) {
            rightSlot.innerHTML = `
                <div class="equipped-gear-name">${gameState.equipped.right}</div>
                <div class="equipped-gear-tier">Tier ${gearInfo?.tier || 1}</div>
                <div class="equipped-gear-effects">${effects}</div>
            `;
            rightSlot.classList.add('equipped');
        }
        if (rightUnequipBtn) rightUnequipBtn.style.display = 'flex';
    } else {
        if (rightSlot) {
            rightSlot.innerHTML = '<div class="empty-slot-text">Empty</div>';
            rightSlot.classList.remove('equipped');
        }
        if (rightUnequipBtn) rightUnequipBtn.style.display = 'none';
    }
    
    // Update left hand slot
    if (gameState.equipped.left) {
        const gearInfo = gearData[gameState.equipped.left];
        const effects = getGearEffectsText(gearInfo);
        if (leftSlot) {
            leftSlot.innerHTML = `
                <div class="equipped-gear-name">${gameState.equipped.left}</div>
                <div class="equipped-gear-tier">Tier ${gearInfo?.tier || 1}</div>
                <div class="equipped-gear-effects">${effects}</div>
            `;
            leftSlot.classList.add('equipped');
        }
        if (leftUnequipBtn) leftUnequipBtn.style.display = 'flex';
    } else {
        if (leftSlot) {
            leftSlot.innerHTML = '<div class="empty-slot-text">Empty</div>';
            leftSlot.classList.remove('equipped');
        }
        if (leftUnequipBtn) leftUnequipBtn.style.display = 'none';
    }
    
    // Update accessory slot
    if (gameState.equipped.accessory) {
        const gearInfo = gearData[gameState.equipped.accessory];
        const effects = getGearEffectsText(gearInfo);
        if (accessorySlot) {
            accessorySlot.innerHTML = `
                <div class="equipped-gear-name">${gameState.equipped.accessory}</div>
                <div class="equipped-gear-tier">Tier ${gearInfo?.tier || 1}</div>
                <div class="equipped-gear-effects">${effects}</div>
            `;
            accessorySlot.classList.add('equipped');
        }
        if (accessoryUnequipBtn) accessoryUnequipBtn.style.display = 'flex';
    } else {
        if (accessorySlot) {
            accessorySlot.innerHTML = '<div class="empty-slot-text">Empty</div>';
            accessorySlot.classList.remove('equipped');
        }
        if (accessoryUnequipBtn) accessoryUnequipBtn.style.display = 'none';
    }
}

function getGearEffectsText(gearInfo) {
    if (!gearInfo || !gearInfo.effects) return '';
    
    const effects = [];
    if (gearInfo.effects.luck) effects.push(`+${gearInfo.effects.luck}% Luck`);
    if (gearInfo.effects.rollSpeed) effects.push(`+${gearInfo.effects.rollSpeed}% Speed`);
    if (gearInfo.effects.special) {
        const specialName = gearInfo.effects.effect || gearInfo.effects.special;
        effects.push(`✨ ${specialName}`);
    }
    
    return effects.join(' • ');
}

function processSpecialGearEffects(aura) {
    // Process effects that trigger when rolling
    for (let slot in gameState.equipped) {
        const gearName = gameState.equipped[slot];
        if (gearName && gearData[gearName]?.effects?.special) {
            const gearEffects = gearData[gearName].effects;
            const special = gearEffects.special;
            
            switch(special) {
                case 'randomGemBoost':
                    // Chance to activate gem boost with random values
                    if (Math.random() < 0.15) { // 15% chance to activate
                        const randomLuck = Math.floor(Math.random() * gearEffects.maxLuck) + 5; // At least 5% luck
                        const randomSpeed = Math.floor(Math.random() * gearEffects.maxRollSpeed) + 5; // At least 5% speed
                        
                        gameState.specialEffects.gemstoneBoost = {
                            luck: randomLuck,
                            speed: randomSpeed
                        };
                        gameState.specialEffects.gemstoneActive = true;
                        gameState.specialEffects.gemstoneEndTime = Date.now() + (gearEffects.duration * 1000); // duration in seconds
                        
                        // Show visual feedback
                        const display = document.getElementById('currentAuraDisplay');
                        if (display) {
                            display.classList.add('gem-boost');
                            setTimeout(() => display.classList.remove('gem-boost'), 1000);
                        }
                        
                        // Show notification
                        showNotification(`Gemstone Gauntlet activated! +${randomLuck}% Luck, +${randomSpeed}% Roll Speed for ${gearEffects.duration} seconds`);
                        
                        // Deactivate after duration
                        setTimeout(() => {
                            if (gameState.specialEffects.gemstoneEndTime <= Date.now()) {
                                gameState.specialEffects.gemstoneActive = false;
                                showNotification('Gemstone Gauntlet effect has worn off');
                            }
                        }, gearEffects.duration * 1000);
                    }
                    break;
                case 'auraTierUpChance':
                    // Chance to upgrade the tier of the aura rolled
                    if (Math.random() < gearEffects.chance) {
                        // Upgrade the aura tier if possible
                        const tierOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'divine', 'celestial'];
                        const currentTierIndex = tierOrder.indexOf(aura.tier);
                        
                        // Only upgrade if not already at the highest tier
                        if (currentTierIndex >= 0 && currentTierIndex < tierOrder.length - 1) {
                            const upgradedTier = tierOrder[currentTierIndex + 1];
                            aura.tier = upgradedTier;
                            
                            // Adjust rarity to match the new tier (simplified approach)
                            if (aura.effectiveRarity) {
                                aura.effectiveRarity *= 10; // Increase rarity by an order of magnitude
                            }
                            
                            // Show notification
                            showNotification(`Prismatic Ring activated! Aura tier upgraded to ${upgradedTier}!`);
                            
                            // Visual feedback
                            const display = document.getElementById('currentAuraDisplay');
                            if (display) {
                                display.classList.add('tier-up');
                                setTimeout(() => display.classList.remove('tier-up'), 1000);
                            }
                        }
                    }
                    break;
                case 'ghostRollChance':
                    // Chance to get bonus rolls
                    if (Math.random() < gearEffects.chance) {
                        // Schedule bonus rolls
                        const bonusRolls = gearEffects.bonusRolls || 2;
                        showNotification(`Phantom Glove activated! ${bonusRolls} bonus rolls incoming!`);
                        
                        // Visual feedback
                        const display = document.getElementById('currentAuraDisplay');
                        if (display) {
                            display.classList.add('ghost-roll');
                            setTimeout(() => display.classList.remove('ghost-roll'), 1000);
                        }
                        
                        // Schedule the bonus rolls with a slight delay between them
                        for (let i = 0; i < bonusRolls; i++) {
                            setTimeout(() => {
                                if (!gameState.isRolling) {
                                    quickRollAura();
                                }
                            }, (i + 1) * 1500); // 1.5 second between each roll
                        }
                    }
                    break;
                case 'duplicationChance':
                    // Chance to duplicate the aura rolled
                    if (Math.random() < gearEffects.chance) {
                        // Add an extra count of the rolled aura
                        if (gameState.inventory.auras[aura.name]) {
                            gameState.inventory.auras[aura.name].count++;
                        }
                    }
                    break;
                case 'negativeAuraReroll':
                    // Allows rerolling negative auras
                    // Check if the aura is considered "negative" (below epic tier)
                    if (aura.tier === 'common' || aura.tier === 'uncommon' || aura.tier === 'rare') {
                        // Get the max number of rerolls allowed
                        const maxRerolls = gearEffects.maxRerolls || 3;
                        
                        // Check if we have rerolls left
                        if (!gameState.specialEffects.voidCatalystRerolls) {
                            gameState.specialEffects.voidCatalystRerolls = 0;
                        }
                        
                        if (gameState.specialEffects.voidCatalystRerolls < maxRerolls) {
                            // Increment reroll count
                            gameState.specialEffects.voidCatalystRerolls++;
                            
                            // Show notification
                            showNotification(`Void Catalyst activated! Rerolling negative aura (${gameState.specialEffects.voidCatalystRerolls}/${maxRerolls})`);
                            
                            // Get a new aura (this will be returned instead)
                            return getRandomAura();
                        } else if (gameState.specialEffects.voidCatalystRerolls === maxRerolls) {
                            // Reset rerolls after reaching max
                            showNotification(`Void Catalyst depleted! Recharge needed.`);
                            gameState.specialEffects.voidCatalystRerolls = 0;
                        }
                    }
                    break;
                case 'auraStreakBonus':
                    // Bonus for maintaining a streak of positive auras
                    if (!gameState.specialEffects) {
                        gameState.specialEffects = {};
                    }
                    
                    // Initialize streak counter if it doesn't exist
                    if (gameState.specialEffects.positiveAuraStreak === undefined) {
                        gameState.specialEffects.positiveAuraStreak = 0;
                    }
                    
                    // Check if current aura is positive (epic or higher)
                    const positiveAuraTiers = ['epic', 'legendary', 'mythic', 'divine', 'celestial'];
                    const isPositiveAura = positiveAuraTiers.includes(aura.tier);
                    
                    if (isPositiveAura) {
                        // Increment streak
                        gameState.specialEffects.positiveAuraStreak++;
                        
                        // Apply bonus based on streak length
                        if (gameState.specialEffects.positiveAuraStreak >= 3) {
                            // Apply multiplier to aura effect
                            const streakMultiplier = 1 + (Math.min(gameState.specialEffects.positiveAuraStreak, 10) * 0.1); // Cap at 2x (10 streaks)
                            
                            // Apply multiplier to aura stats
                            if (aura.luckBoost) aura.luckBoost *= streakMultiplier;
                            if (aura.speedBoost) aura.speedBoost *= streakMultiplier;
                            if (aura.rarityBoost) aura.rarityBoost *= streakMultiplier;
                            
                            // Show notification
                            showNotification(`Soul Harvester activated! Streak of ${gameState.specialEffects.positiveAuraStreak} - Aura boosted by ${Math.round((streakMultiplier-1)*100)}%!`);
                            
                            // Visual feedback
                            const display = document.getElementById('currentAuraDisplay');
                            if (display) {
                                display.classList.add('streak-bonus');
                                setTimeout(() => display.classList.remove('streak-bonus'), 1000);
                            }
                        }
                    } else {
                        // Reset streak on negative aura
                        gameState.specialEffects.positiveAuraStreak = 0;
                    }
                    break;
                case 'rarityFloorIncrease':
                    // Increase minimum aura rarity - affects randomness
                    // This affects getRandomAura function, not the complete roll
                    if (!gameState.specialEffects) gameState.specialEffects = {};
                    if (!gameState.specialEffects.rarityFloorIncrease) gameState.specialEffects.rarityFloorIncrease = 0;
                    gameState.specialEffects.rarityFloorIncrease += (gearEffects.floor || 10);
                    break;
                case 'rarityMultiplierBoost':
                    // Multiply aura rarity
                    // This affects the aura selection process
                    if (!gameState.specialEffects) gameState.specialEffects = {};
                    if (!gameState.specialEffects.rarityMultiplierBoost) gameState.specialEffects.rarityMultiplierBoost = 1;
                    gameState.specialEffects.rarityMultiplierBoost *= (gearEffects.multiplier || 1.5);
                    break;
                case 'skipStacks':
                    // Pole Light Core Device: Grant stacks based on trigger
                    if (!gameState.specialEffects) gameState.specialEffects = {};
                    if (!gameState.specialEffects.skipStacks) gameState.specialEffects.skipStacks = 0;
                    
                    // Handle automatic stack granting based on trigger
                    if (gearEffects.trigger) {
                        if (!gameState.specialEffects.skipStacksRollCount) {
                            gameState.specialEffects.skipStacksRollCount = 0;
                        }
                        gameState.specialEffects.skipStacksRollCount++;
                        
                        // Parse trigger from string like "every 30th roll"
                        const triggerText = gearEffects.trigger;
                        const triggerMatch = triggerText.match(/every (\d+)th roll/);
                        const triggerRolls = triggerMatch ? parseInt(triggerMatch[1]) : 30;
                        
                        // Check if we should grant stacks
                        if (gameState.specialEffects.skipStacksRollCount >= triggerRolls) {
                            gameState.specialEffects.skipStacksRollCount = 0;
                            const stacksToGrant = gearEffects.stacks || 5;
                            gameState.specialEffects.skipStacks += stacksToGrant;
                            
                            showNotification(`Pole Light Core Device: Granted ${stacksToGrant} skip stacks! Total: ${gameState.specialEffects.skipStacks}`);
                            
                            // Visual feedback
                            const display = document.getElementById('currentAuraDisplay');
                            if (display) {
                                display.classList.add('skip-stacks-granted');
                                setTimeout(() => display.classList.remove('skip-stacks-granted'), 1000);
                            }
                        }
                    }
                    break;
                case 'guaranteedHighTier':
                    // Check if the effect is on cooldown
                    if (!gameState.specialEffects) {
                        gameState.specialEffects = {};
                    }
                    
                    // Initialize cooldown counter if it doesn't exist
                    if (gameState.specialEffects.guaranteedHighTierCooldown === undefined) {
                        gameState.specialEffects.guaranteedHighTierCooldown = 0;
                    }
                    
                    // Only activate if not on cooldown
                    if (gameState.specialEffects.guaranteedHighTierCooldown <= 0) {
                        // Guarantee a high-tier aura (divine or celestial)
                        const highTiers = ['divine', 'celestial'];
                        aura.tier = highTiers[Math.floor(Math.random() * highTiers.length)];
                        
                        // Adjust rarity to match the high tier
                        aura.effectiveRarity = aura.tier === 'divine' ? 10000 : 100000;
                        
                        // Show notification
                        showNotification('Probability Collapse activated! Guaranteed high-tier aura!');
                        
                        // Visual feedback
                        const display = document.getElementById('currentAuraDisplay');
                        if (display) {
                            display.classList.add('high-tier-guaranteed');
                            setTimeout(() => display.classList.remove('high-tier-guaranteed'), 1500);
                        }
                        
                        // Set cooldown (from gear effect definition)
                        gameState.specialEffects.guaranteedHighTierCooldown = gearEffects.cooldown || 100;
                    } else {
                        // Decrease cooldown counter
                        gameState.specialEffects.guaranteedHighTierCooldown--;
                        
                        // Show cooldown notification every 10 rolls
                        if (gameState.specialEffects.guaranteedHighTierCooldown % 10 === 0) {
                            showNotification(`Probability Collapse cooldown: ${gameState.specialEffects.guaranteedHighTierCooldown} rolls remaining`);
                        }
                    }
                    break;
                case 'reverseTimeOnBad':
                    // Rewind rolls if get bad aura
                    const badTiers = ['common', 'uncommon', 'rare', 'epic'];
                    if (badTiers.includes(aura.tier)) {
                        if (!gameState.specialEffects.paradoxRewinds) gameState.specialEffects.paradoxRewinds = 0;
                        const maxRewinds = gearEffects.rewindRolls || 3;
                        
                        if (gameState.specialEffects.paradoxRewinds < maxRewinds) {
                            gameState.specialEffects.paradoxRewinds++;
                            showNotification(`Paradox Engine activated! Rewinding time... (${gameState.specialEffects.paradoxRewinds}/${maxRewinds})`);
                            
                            // Visual feedback
                            const display = document.getElementById('currentAuraDisplay');
                            if (display) {
                                display.classList.add('time-rewind');
                                setTimeout(() => display.classList.remove('time-rewind'), 1000);
                            }
                            
                            // Return new aura
                            return getRandomAura();
                        }
                    }
                    break;
                case 'windyBiomeBonus':
                    // Check if in windy biome
                    if (gameState.currentBiome === 'WINDY') {
                        const bonus = gearEffects.windyBonus || 80;
                        if (!gameState.specialEffects.biomeBonusActive) {
                            gameState.specialEffects.biomeBonusActive = true;
                            gameState.specialEffects.biomeBonus = bonus;
                            showNotification(`Storm Catcher: Windy biome bonus active! +${bonus}% luck`);
                        }
                    }
                    break;
                case 'jackpotMiniBonus':
                    // Small jackpot-themed bonus
                    const jackpotBonus = gearEffects.bonus || 30;
                    if (Math.random() < 0.1) { // 10% chance
                        if (!gameState.specialEffects.jackpotMiniBonusActive) {
                            gameState.specialEffects.jackpotMiniBonusActive = true;
                            gameState.specialEffects.jackpotMiniBonus = jackpotBonus;
                            showNotification(`Fortune Weaver: Lucky! +${jackpotBonus}% luck bonus!`);
                            
                            setTimeout(() => {
                                gameState.specialEffects.jackpotMiniBonusActive = false;
                            }, 5000);
                        }
                    }
                    break;
                case 'gildedBonus':
                    // Midas Touch: Bonus when rolling Gilded auras
                    if (aura.name.includes('Gilded')) {
                        const gildedBonus = gearEffects.bonus || 100;
                        if (!gameState.specialEffects.gildedBonusActive) {
                            gameState.specialEffects.gildedBonusActive = true;
                            gameState.specialEffects.gildedBonus = gildedBonus;
                            showNotification(`✨ Midas Touch: Gilded aura rolled! +${gildedBonus}% luck bonus for 10 seconds!`);
                            
                            setTimeout(() => {
                                gameState.specialEffects.gildedBonusActive = false;
                                gameState.specialEffects.gildedBonus = 0;
                                showNotification('Midas Touch bonus expired.');
                            }, 10000);
                        }
                    }
                    break;
                case 'timeWarpBonus':
                    // Double speed every N rolls
                    if (!gameState.specialEffects.timeWarpCounter) gameState.specialEffects.timeWarpCounter = 0;
                    gameState.specialEffects.timeWarpCounter++;
                    
                    if (gameState.specialEffects.timeWarpCounter >= 15) {
                        gameState.specialEffects.timeWarpCounter = 0;
                        gameState.specialEffects.timeWarpActive = true;
                        gameState.specialEffects.timeWarpRollsLeft = 5;
                        gameState.currentSpeed *= 2;
                        showNotification('Chronosphere: Time warp activated! Double speed for 5 rolls!');
                        
                        const display = document.getElementById('currentAuraDisplay');
                        if (display) {
                            display.classList.add('time-warp');
                            setTimeout(() => display.classList.remove('time-warp'), 1000);
                        }
                    }
                    
                    if (gameState.specialEffects.timeWarpActive) {
                        gameState.specialEffects.timeWarpRollsLeft--;
                        if (gameState.specialEffects.timeWarpRollsLeft <= 0) {
                            gameState.specialEffects.timeWarpActive = false;
                            gameState.currentSpeed /= 2;
                            showNotification('Chronosphere: Time warp ended');
                        }
                    }
                    break;
                case 'exponentialLuckGrowth':
                    // Luck grows exponentially with each roll
                    if (!gameState.specialEffects.exponentialLuck) gameState.specialEffects.exponentialLuck = 1;
                    
                    const growth = gearEffects.baseGrowth || 1.02;
                    const cap = gearEffects.capMultiplier || 3;
                    
                    gameState.specialEffects.exponentialLuck = Math.min(
                        gameState.specialEffects.exponentialLuck * growth,
                        cap
                    );
                    
                    if (gameState.specialEffects.exponentialLuck > 1.5) {
                        showNotification(`Luck Amplifier Core: ${(gameState.specialEffects.exponentialLuck * 100).toFixed(0)}% luck multiplier active!`);
                    }
                    break;
                case 'divineBiomeBonus':
                    // Bonus in specific biomes
                    const divBiomes = gearEffects.biomes || ['STARFALL', 'GLITCH'];
                    if (divBiomes.includes(gameState.currentBiome)) {
                        const divBonus = gearEffects.bonus || 300;
                        if (!gameState.specialEffects.divineBiomeBonusActive) {
                            gameState.specialEffects.divineBiomeBonusActive = true;
                            gameState.specialEffects.divineBiomeBonus = divBonus;
                            showNotification(`Divine Retribution: Divine biome bonus active! +${divBonus}% luck`);
                        }
                    } else {
                        gameState.specialEffects.divineBiomeBonusActive = false;
                    }
                    break;
                case 'naturalAttunement':
                    // Rootbinder Gauntlets: Bonus on rolling Flora aura
                    if (aura.name.includes('Flora')) {
                        const natBonus = gearEffects.bonus || 25;
                        if (!gameState.specialEffects.naturalAttunementActive) {
                            gameState.specialEffects.naturalAttunementActive = true;
                            gameState.specialEffects.naturalAttunement = natBonus;
                            showNotification(`🌿 Rootbinder: Flora aura rolled! +${natBonus}% luck bonus for 8 seconds!`);
                            setTimeout(() => {
                                gameState.specialEffects.naturalAttunementActive = false;
                                gameState.specialEffects.naturalAttunement = 0;
                            }, 8000);
                        }
                    }
                    break;
                case 'tailwind':
                    // Gale Weavers: Every 10th roll is 50% faster
                    if (!gameState.specialEffects.tailwindCounter) gameState.specialEffects.tailwindCounter = 0;
                    gameState.specialEffects.tailwindCounter++;
                    if (gameState.specialEffects.tailwindCounter >= 10) {
                        gameState.specialEffects.tailwindCounter = 0;
                        gameState.specialEffects.tailwindActive = true;
                        showNotification('💨 Gale Weavers: Tailwind! Next roll 50% faster!');
                    }
                    break;
                case 'solarFlare':
                    // Inferno Heart Forge: Bonus on rolling Solar aura
                    if (aura.name.includes('Solar')) {
                        const solarBonus = gearEffects.bonus || 200;
                        if (!gameState.specialEffects.solarFlareActive) {
                            gameState.specialEffects.solarFlareActive = true;
                            gameState.specialEffects.solarFlare = solarBonus;
                            showNotification(`☀️ Inferno Heart: Solar flare! +${solarBonus}% luck for 10 seconds!`);
                            setTimeout(() => {
                                gameState.specialEffects.solarFlareActive = false;
                                gameState.specialEffects.solarFlare = 0;
                            }, 10000);
                        }
                    }
                    break;
                case 'etherealBoost':
                    // Aetheric Weave: Multiplier on rolling Celestial or higher
                    const tierOrder = { 'common': 1, 'uncommon': 2, 'rare': 3, 'epic': 4, 'legendary': 5, 'mythic': 6, 'exotic': 7, 'divine': 8, 'celestial': 9, 'transcendent': 10, 'cosmic': 11 };
                    if (tierOrder[aura.tier] >= 9) {
                        const multiplier = gearEffects.multiplier || 1.1;
                        if (!gameState.specialEffects.etherealBoostActive) {
                            gameState.specialEffects.etherealBoostActive = true;
                            gameState.specialEffects.etherealBoostMultiplier = multiplier;
                            showNotification(`✨ Aetheric Weave: Ethereal boost! ${multiplier}x luck multiplier for 15 seconds!`);
                            setTimeout(() => {
                                gameState.specialEffects.etherealBoostActive = false;
                            }, 15000);
                        }
                    }
                    break;
                case 'finalJudgment':
                    // Anubis' Scales: 100th roll guaranteed Mythic+
                    if (!gameState.specialEffects.judgmentCounter) gameState.specialEffects.judgmentCounter = 0;
                    gameState.specialEffects.judgmentCounter++;
                    if (gameState.specialEffects.judgmentCounter >= 100) {
                        gameState.specialEffects.judgmentReady = true;
                        showNotification('⚖️ Anubis\' Scales: Final judgment ready! Next roll guaranteed Mythic+!');
                    }
                    break;
                case 'crescendo':
                    // The Conductor's Baton: Increase stats with consecutive rolls
                    if (!gameState.specialEffects.crescendoStack) gameState.specialEffects.crescendoStack = 0;
                    if (!gameState.specialEffects.lastRollTime) gameState.specialEffects.lastRollTime = Date.now();
                    
                    const timeSinceLastRoll = Date.now() - gameState.specialEffects.lastRollTime;
                    if (timeSinceLastRoll < 5000) {
                        gameState.specialEffects.crescendoStack = Math.min(gameState.specialEffects.crescendoStack + 2, 50);
                    } else {
                        gameState.specialEffects.crescendoStack = 0;
                    }
                    gameState.specialEffects.lastRollTime = Date.now();
                    break;
                case 'soulTax':
                    // The Reaper's Toll: Lost Soul aura makes next 5 rolls faster
                    if (aura.name.includes('Lost Soul')) {
                        gameState.specialEffects.soulTaxActive = true;
                        gameState.specialEffects.soulTaxRolls = 5;
                        showNotification('💀 Reaper\'s Toll: Soul collected! Next 5 rolls 20% faster!');
                    }
                    if (gameState.specialEffects.soulTaxActive && gameState.specialEffects.soulTaxRolls > 0) {
                        gameState.specialEffects.soulTaxRolls--;
                        if (gameState.specialEffects.soulTaxRolls <= 0) {
                            gameState.specialEffects.soulTaxActive = false;
                        }
                    }
                    break;
                case 'divineDomain':
                    // Pantheon's Will: Bonus in specific biomes
                    const pantheonBiomes = ['STARFALL', 'WINDY', 'RAINY'];
                    if (pantheonBiomes.includes(gameState.currentBiome)) {
                        if (!gameState.specialEffects.divineDomainActive) {
                            gameState.specialEffects.divineDomainActive = true;
                            gameState.specialEffects.divineDomainBonus = gearEffects.luckBonus || 100;
                            showNotification('⚡ Pantheon\'s Will: Divine domain active!');
                        }
                    } else {
                        gameState.specialEffects.divineDomainActive = false;
                    }
                    break;
                case 'starDeath':
                    // Supernova Catalyst: Cosmic aura gives massive boost
                    if (aura.tier === 'cosmic') {
                        gameState.specialEffects.starDeathActive = true;
                        gameState.specialEffects.starDeathRolls = 3;
                        showNotification('💥 Supernova Catalyst: Star death! Next 3 rolls have DOUBLE luck and speed!');
                    }
                    if (gameState.specialEffects.starDeathActive && gameState.specialEffects.starDeathRolls > 0) {
                        gameState.specialEffects.starDeathRolls--;
                        if (gameState.specialEffects.starDeathRolls <= 0) {
                            gameState.specialEffects.starDeathActive = false;
                        }
                    }
                    break;
                case 'blindIdiotGod':
                    // Azathoth's Fidget: Random chaos every 10 rolls
                    if (!gameState.specialEffects.chaosCounter) gameState.specialEffects.chaosCounter = 0;
                    gameState.specialEffects.chaosCounter++;
                    if (gameState.specialEffects.chaosCounter >= 10) {
                        gameState.specialEffects.chaosCounter = 0;
                        const randomLuck = Math.floor(Math.random() * 4000) - 1000;
                        const randomSpeed = Math.floor(Math.random() * 190) + 10;
                        gameState.specialEffects.chaosLuck = randomLuck;
                        gameState.specialEffects.chaosSpeed = randomSpeed;
                        showNotification(`🌀 Azathoth's Fidget: CHAOS! Luck: ${randomLuck > 0 ? '+' : ''}${randomLuck}%, Speed: ${randomSpeed}%`);
                    }
                    break;
                case 'soulChain':
                    // Soul Shackles: Mythic+ streak bonus
                    if (aura.tier === 'mythic' || aura.tier === 'exotic' || aura.tier === 'divine' || 
                        aura.tier === 'celestial' || aura.tier === 'transcendent' || aura.tier === 'cosmic') {
                        if (!gameState.specialEffects.soulChainStacks) gameState.specialEffects.soulChainStacks = 0;
                        gameState.specialEffects.soulChainStacks = Math.min(gameState.specialEffects.soulChainStacks + 1, 10);
                        showNotification(`⛓️ Soul Shackles: Chain +${gameState.specialEffects.soulChainStacks * 5}% luck (${gameState.specialEffects.soulChainStacks}/10 stacks)`);
                    } else {
                        gameState.specialEffects.soulChainStacks = 0;
                    }
                    break;
                case 'temporalHarvest':
                    // Death's Hourglass: Stack collection
                    if (!gameState.specialEffects.hourglassStacks) gameState.specialEffects.hourglassStacks = 0;
                    if (gameState.totalRolls % 100 === 0) {
                        gameState.specialEffects.hourglassStacks++;
                        showNotification(`⏳ Death's Hourglass: Stack collected! (${gameState.specialEffects.hourglassStacks} stacks)`);
                    }
                    break;
                case 'finalCut':
                    // Reaper's Scythe: Transcendent+ bonus
                    if (aura.tier === 'transcendent' || aura.tier === 'cosmic') {
                        gameState.specialEffects.finalCutActive = true;
                        gameState.specialEffects.finalCutBonus = 300;
                        showNotification('💀 Reaper\'s Scythe: Final Cut! +300% luck for 20 seconds!');
                        setTimeout(() => {
                            gameState.specialEffects.finalCutActive = false;
                            gameState.specialEffects.finalCutBonus = 0;
                        }, 20000);
                    }
                    break;
                case 'manaFlow':
                    // Spellweaver Gauntlets: Every 5th roll instant
                    if (!gameState.specialEffects.manaFlowCounter) gameState.specialEffects.manaFlowCounter = 0;
                    gameState.specialEffects.manaFlowCounter++;
                    if (gameState.specialEffects.manaFlowCounter >= 5) {
                        gameState.specialEffects.manaFlowCounter = 0;
                        gameState.specialEffects.instantRollNext = true;
                        showNotification('✨ Spellweaver: Mana Flow! Next roll is INSTANT!');
                    }
                    break;
                case 'arcaneSurge':
                    // Mystic Talisman: Divine+ boost (passive, handled in roll logic)
                    break;
                case 'infiniteKnowledge':
                    // Infinity Codex: Reveal next 3 tiers (passive display)
                    break;
                case 'titanStrength':
                    // Atlas Gauntlets: Luck floor (passive, handled in stat calculation)
                    break;
                case 'immovableForce':
                    // World Anchor: Double set bonuses (passive multiplier)
                    break;
                case 'titanicImpact':
                    // Colossus Fist: 50th roll guaranteed Celestial+
                    if (gameState.totalRolls % 50 === 0) {
                        gameState.specialEffects.guaranteedCelestial = true;
                        showNotification('🏔️ Colossus Fist: TITANIC IMPACT! Next roll guaranteed Celestial+!');
                    }
                    break;
                case 'superposition':
                    // Schrödinger's Gloves: 10% chance double roll
                    if (Math.random() < 0.1) {
                        gameState.specialEffects.doubleRollNext = true;
                        showNotification('🌀 Schrödinger\'s Gloves: SUPERPOSITION! Rolling TWO auras!');
                    }
                    break;
                case 'quantumFlux':
                    // Probability Manipulator: Reroll tracker
                    if (!gameState.specialEffects.quantumFluxCounter) gameState.specialEffects.quantumFluxCounter = 0;
                    gameState.specialEffects.quantumFluxCounter++;
                    if (gameState.specialEffects.quantumFluxCounter >= 200) {
                        gameState.specialEffects.quantumFluxCounter = 0;
                        gameState.specialEffects.quantumRerollAvailable = true;
                        showNotification('⚛️ Probability Manipulator: Quantum reroll available!');
                    }
                    break;
                case 'reverseTime':
                    // Entropy Reverser: Auto-reroll Nothing (handled in roll logic)
                    break;
                case 'cosmicAuthority':
                    // Universe Shaper: All auras 10% more common (passive, handled in roll logic)
                    break;
                case 'omnipotence':
                    // Reality Crown: Permanent luck growth
                    if (!gameState.specialEffects.omnipotenceLuck) gameState.specialEffects.omnipotenceLuck = 0;
                    if (gameState.totalRolls % 1000 === 0) {
                        gameState.specialEffects.omnipotenceLuck++;
                        showNotification(`👑 Reality Crown: OMNIPOTENCE! Permanent luck +${gameState.specialEffects.omnipotenceLuck}%!`);
                    }
                    break;
                case 'snapOfFate':
                    // Infinity Gauntlet: 500th roll guaranteed Cosmic
                    if (gameState.totalRolls % 500 === 0) {
                        gameState.specialEffects.guaranteedCosmic = true;
                        showNotification('♾️ Infinity Gauntlet: SNAP OF FATE! Next roll guaranteed COSMIC!');
                    }
                    break;
            }
            
            // Handle special2 effects (for gears with multiple special effects like Darkshader)
            if (gearEffects.special2) {
                switch(gearEffects.special2) {
                    case 'luckMultiplier':
                        // Track roll count for trigger
                        if (!gameState.specialEffects.luckMultiplierRollCount) {
                            gameState.specialEffects.luckMultiplierRollCount = 0;
                        }
                        gameState.specialEffects.luckMultiplierRollCount++;
                        
                        // Check if luckMultiplier is active and decrement duration
                        if (gameState.specialEffects.luckMultiplierActive) {
                            gameState.specialEffects.luckMultiplierRollsLeft--;
                            if (gameState.specialEffects.luckMultiplierRollsLeft <= 0) {
                                gameState.specialEffects.luckMultiplierActive = false;
                                showNotification('Darkshader: Luck multiplier effect has worn off');
                            }
                        }
                        
                        // Parse trigger from string like "every 20th roll"
                        const triggerText = gearEffects.trigger || 'every 20th roll';
                        const triggerMatch = triggerText.match(/every (\d+)th roll/);
                        const triggerRolls = triggerMatch ? parseInt(triggerMatch[1]) : 20;
                        
                        // Check if we should trigger
                        if (gameState.specialEffects.luckMultiplierRollCount >= triggerRolls && !gameState.specialEffects.luckMultiplierActive) {
                            // Reset counter
                            gameState.specialEffects.luckMultiplierRollCount = 0;
                            
                            // Activate multiplier
                            gameState.specialEffects.luckMultiplierActive = true;
                            gameState.specialEffects.luckMultiplierValue = gearEffects.multiplier || 2.5;
                            gameState.specialEffects.luckMultiplierRollsLeft = gearEffects.duration || 10;
                            
                            showNotification(`Darkshader: Luck multiplier activated! ${gearEffects.multiplier}x luck for ${gearEffects.duration} rolls!`);
                            
                            // Visual feedback
                            const display = document.getElementById('currentAuraDisplay');
                            if (display) {
                                display.classList.add('luck-multiplier');
                                setTimeout(() => display.classList.remove('luck-multiplier'), 1000);
                            }
                        }
                        break;
                }
            }
        }
    }
    
    return aura;
}

function processSpecialPotionEffects(aura) {
    // Initialize special effects tracking if needed
    if (!gameState.specialEffects) gameState.specialEffects = {};
    
    // Process each active potion effect
    for (const effect of gameState.activeEffects) {
        switch(effect.name) {
            case "Chaos Potion":
                // Randomly change luck and speed every 30 seconds
                if (!effect.lastChaosChange || Date.now() - effect.lastChaosChange > 30000) {
                    const luckChange = (Math.random() - 0.5) * 2; // -100% to +100%
                    const speedChange = (Math.random() - 0.5) * 1; // -50% to +50%
                    
                    effect.chaosLuck = luckChange;
                    effect.chaosSpeed = speedChange;
                    effect.lastChaosChange = Date.now();
                    
                    // Apply temporary changes to this roll
                    if (effect.chaosLuck) {
                        // Temporarily modify the aura's effective rarity based on chaos luck
                        const chaosMultiplier = 1 + effect.chaosLuck;
                        if (aura.effectiveRarity) {
                            aura.effectiveRarity = Math.max(1, Math.round(aura.effectiveRarity / chaosMultiplier));
                        }
                    }
                }
                break;
                
            case "Mirror Potion":
                // Chance to duplicate the rolled aura
                if (effect.mirrorCount > 0 && Math.random() < effect.mirrorChance) {
                    // Add an extra count of the rolled aura
                    if (gameState.inventory.auras[aura.name]) {
                        gameState.inventory.auras[aura.name].count++;
                        
                        // Show notification
                        showNotification(`Mirror Potion activated! ${aura.name} duplicated!`);
                        
                        // Visual feedback
                        const display = document.getElementById('currentAuraDisplay');
                        if (display) {
                            display.classList.add('mirror-bonus');
                            setTimeout(() => display.classList.remove('mirror-bonus'), 1000);
                        }
                    }
                    effect.mirrorCount--;
                }
                break;
                
            case "Lucky Block Potion":
                // Chance to spawn bonus potions/items
                if (Math.random() < effect.bonusSpawnChance) {
                    // Spawn random potion or item
                    const spawnOptions = [];
                    
                    // Add potions
                    if (typeof POTION_RECIPES !== 'undefined') {
                        const potionRecipes = POTION_RECIPES.filter(recipe => recipe.isBase);
                        spawnOptions.push(...potionRecipes.map(recipe => ({ name: recipe.name, type: 'potion' })));
                    }
                    
                    // Add items
                    if (typeof SPAWN_ITEMS !== 'undefined') {
                        spawnOptions.push(...SPAWN_ITEMS.map(item => ({ name: item.name, type: 'item' })));
                    }
                    
                    if (spawnOptions.length > 0) {
                        const selectedSpawn = spawnOptions[Math.floor(Math.random() * spawnOptions.length)];
                        
                        // Add to inventory
                        if (selectedSpawn.type === 'potion') {
                            if (!gameState.inventory.potions[selectedSpawn.name]) {
                                gameState.inventory.potions[selectedSpawn.name] = { count: 0 };
                            }
                            gameState.inventory.potions[selectedSpawn.name].count += Math.floor(Math.random() * 3) + 1;
                        } else {
                            if (!gameState.inventory.items[selectedSpawn.name]) {
                                gameState.inventory.items[selectedSpawn.name] = { count: 0 };
                            }
                            gameState.inventory.items[selectedSpawn.name].count += 1;
                        }
                        
                        showNotification(`Lucky Block! Bonus ${selectedSpawn.name} spawned!`);
                        
                        // Visual feedback
                        const display = document.getElementById('currentAuraDisplay');
                        if (display) {
                            display.classList.add('lucky-block-bonus');
                            setTimeout(() => display.classList.remove('lucky-block-bonus'), 1000);
                        }
                        
                        updateInventoryDisplay();
                    }
                }
                break;
                
            case "Jackpot Potion":
                // Massive bonus rewards for transcendent+ auras
                if (effect.jackpotMode && aura.tier === 'transcendent') {
                    // Base bonus: 1 potion per million rarity (significantly nerfed)
                    const baseBonusPotions = Math.floor(aura.rarity / 1000000);
                    
                    // Multiplier based on aura rarity tier (reduced multipliers)
                    let multiplier = 1;
                    if (aura.rarity >= 100000000) multiplier = 1.5; // 100M+ rarity
                    else if (aura.rarity >= 50000000) multiplier = 1.25; // 50M+ rarity
                    else if (aura.rarity >= 10000000) multiplier = 1.1; // 10M+ rarity
                    
                    const totalBonusPotions = Math.floor(baseBonusPotions * multiplier);
                    
                    // Bonus Speed Potions too (50% of Lucky Potion amount)
                    const bonusSpeedPotions = Math.floor(totalBonusPotions * 0.5);
                    
                    if (totalBonusPotions > 0) {
                        // Add bonus Lucky Potions
                        if (!gameState.inventory.potions['Lucky Potion']) {
                            gameState.inventory.potions['Lucky Potion'] = { count: 0 };
                        }
                        gameState.inventory.potions['Lucky Potion'].count += totalBonusPotions;
                        
                        // Add bonus Speed Potions
                        if (bonusSpeedPotions > 0) {
                            if (!gameState.inventory.potions['Speed Potion']) {
                                gameState.inventory.potions['Speed Potion'] = { count: 0 };
                            }
                            gameState.inventory.potions['Speed Potion'].count += bonusSpeedPotions;
                        }
                        
                        // Special reward for ultra-rare auras (100M+ rarity)
                        let specialReward = '';
                        if (aura.rarity >= 100000000) {
                            // Bonus Gilded items for ultra-rare hits
                            const bonusGilded = Math.floor(multiplier);
                            if (!gameState.inventory.items['Gilded']) {
                                gameState.inventory.items['Gilded'] = { count: 0 };
                            }
                            gameState.inventory.items['Gilded'].count += bonusGilded;
                            specialReward = ` and ${bonusGilded} Gilded`;
                        }
                        
                        showNotification(`🎰 JACKPOT! +${totalBonusPotions} Lucky Potions${bonusSpeedPotions > 0 ? `, +${bonusSpeedPotions} Speed Potions` : ''}${specialReward} from ${aura.name}!`);
                        
                        // Enhanced visual feedback
                        const display = document.getElementById('currentAuraDisplay');
                        if (display) {
                            display.classList.add('jackpot-bonus');
                            display.classList.add('jackpot-mega-bonus');
                            setTimeout(() => {
                                display.classList.remove('jackpot-bonus');
                                display.classList.remove('jackpot-mega-bonus');
                            }, 2000);
                        }
                        
                        updateInventoryDisplay();
                    }
                }
                break;
        }
        
        // ============================================================
        // NEW POTION EFFECTS
        // ============================================================
        
        // Clarity Mode - Show exact rarity before roll
        if (effect.clarityMode && effect.oneRoll) {
            showNotification(`🔮 Clarity: Next aura will be 1/${aura.rarity} (${aura.name})`, 'info');
        }
        
        // Hindsight Mode - Store last aura for reroll
        if (effect.hindsightMode && effect.oneRoll) {
            if (!gameState.specialEffects.lastAura) {
                gameState.specialEffects.lastAura = aura;
                showNotification(`⏪ Hindsight: Aura stored. Roll again to compare!`, 'info');
            } else {
                const lastAura = gameState.specialEffects.lastAura;
                const betterAura = aura.rarity > lastAura.rarity ? aura : lastAura;
                showNotification(`⏪ Hindsight: Kept ${betterAura.name} (1/${betterAura.rarity})`, 'success');
                gameState.specialEffects.lastAura = null;
                return betterAura;
            }
        }
        
        // Patience Mode - Can't roll during duration, but stacks luck
        if (effect.patienceMode) {
            if (effect.endTime && Date.now() < effect.endTime) {
                // Disable roll buttons
                const rollBtn = document.getElementById('rollButton');
                const quickRollBtn = document.getElementById('quickRollButton');
                if (rollBtn) rollBtn.disabled = true;
                if (quickRollBtn) quickRollBtn.disabled = true;
            } else if (effect.endTime && Date.now() >= effect.endTime) {
                // Re-enable roll buttons when patience expires
                const rollBtn = document.getElementById('rollButton');
                const quickRollBtn = document.getElementById('quickRollButton');
                if (rollBtn) rollBtn.disabled = false;
                if (quickRollBtn) quickRollBtn.disabled = false;
            }
        }
        
        // Momentum Mode - Stack luck for consecutive fast rolls
        if (effect.momentumMode) {
            const now = Date.now();
            if (effect.momentumLastRoll && (now - effect.momentumLastRoll) < 5000) {
                effect.momentumStack = Math.min(10, (effect.momentumStack || 0) + 1);
                const bonusLuck = effect.momentumStack * 0.05;
                aura.effectiveRarity = Math.round(aura.effectiveRarity || aura.rarity) * (1 + bonusLuck);
                showNotification(`⚡ Momentum x${effect.momentumStack}: +${Math.round(bonusLuck * 100)}% luck!`, 'info');
            } else {
                effect.momentumStack = 0;
            }
            effect.momentumLastRoll = now;
        }
        
        // Focus Mode - Boost specific tier
        if (effect.focusTier && effect.focusBoost && aura.tier === effect.focusTier) {
            aura.effectiveRarity = Math.round((aura.effectiveRarity || aura.rarity) * (1 + effect.focusBoost));
            showNotification(`🎯 Focus: ${effect.focusTier} tier boosted!`, 'success');
        }
        
        // Gambler Mode - Random luck change
        if (effect.gamblerMode && !effect.gamblerApplied) {
            const isWin = Math.random() < 0.5;
            if (isWin) {
                effect.luckBoost = (effect.luckBoost || 0) + 1.0;
                showNotification(`🎲 Gambler: DOUBLED LUCK!`, 'success');
            } else {
                effect.luckBoost = (effect.luckBoost || 0) - 0.5;
                showNotification(`🎲 Gambler: Luck halved...`, 'warning');
            }
            effect.gamblerApplied = true;
        }
        
        // Extremes Mode - Filter out low tiers
        if (effect.extremesMode) {
            if (aura.tier === 'common' || aura.tier === 'uncommon' || aura.tier === 'good') {
                // Reroll to get a higher tier
                return getRandomAura();
            }
        }
        
        // All-or-Nothing Mode
        if (effect.allOrNothingMode && effect.oneRoll) {
            if (aura.tier === 'legendary' || aura.tier === 'mythic' || aura.tier === 'exotic' || 
                aura.tier === 'divine' || aura.tier === 'celestial' || aura.tier === 'transcendent') {
                showNotification(`🎰 All-or-Nothing: SUCCESS!`, 'success');
            } else {
                showNotification(`🎰 All-or-Nothing: FAILED! -100% luck for 30s`, 'error');
                gameState.activeEffects.push({
                    name: 'All-or-Nothing Penalty',
                    luckBoost: -1.0,
                    endTime: Date.now() + 30000
                });
            }
        }
        
        // Sacrifice Mode - Consume auras for luck
        if (effect.sacrificeMode && !effect.sacrificeApplied) {
            const auraNames = Object.keys(gameState.inventory.auras);
            let consumed = 0;
            for (let i = 0; i < Math.min(5, auraNames.length); i++) {
                const auraName = auraNames[i];
                if (gameState.inventory.auras[auraName].count > 0) {
                    gameState.inventory.auras[auraName].count--;
                    if (gameState.inventory.auras[auraName].count === 0) {
                        delete gameState.inventory.auras[auraName];
                    }
                    consumed++;
                }
            }
            if (consumed > 0) {
                showNotification(`⚗️ Sacrifice: Consumed ${consumed} auras for +100% luck!`, 'success');
                effect.sacrificeApplied = true;
            }
        }
        
        // Hour Mode - Luck based on session time
        if (effect.hourMode) {
            const sessionMinutes = Math.floor((Date.now() - (gameState.sessionStartTime || Date.now())) / 60000);
            const bonusLuck = Math.min(1.0, sessionMinutes * 0.1);
            aura.effectiveRarity = Math.round((aura.effectiveRarity || aura.rarity) * (1 + bonusLuck));
            if (bonusLuck > 0) {
                showNotification(`⏰ Hour: +${Math.round(bonusLuck * 100)}% luck (${sessionMinutes} min)`, 'info');
            }
        }
        
        // Adaptation Mode - Boost current biome
        if (effect.adaptationMode && effect.adaptationBiome === gameState.currentBiome) {
            showNotification(`🌍 Adaptation: Biome bonus active!`, 'success');
        }
        
        // Exploration Mode - Trigger on biome change
        if (effect.explorationMode) {
            const currentBiome = gameState.currentBiome;
            
            // Check if bonus expired and reset trigger
            if (effect.explorationBonus && Date.now() >= effect.explorationBonus) {
                effect.explorationTriggered = false;
                effect.explorationBonus = null;
            }
            
            // Trigger on biome change
            if (!effect.explorationTriggered && effect.lastBiome && effect.lastBiome !== currentBiome) {
                effect.explorationTriggered = true;
                effect.explorationBonus = Date.now() + 30000;
                showNotification(`🗺️ Exploration: Biome changed! +200% luck for 30s!`, 'success');
            }
            effect.lastBiome = currentBiome;
            
            // Apply bonus if active
            if (effect.explorationBonus && Date.now() < effect.explorationBonus) {
                aura.effectiveRarity = Math.round((aura.effectiveRarity || aura.rarity) * 3);
            }
        }
        
        // Night/Day Mode
        if (effect.nightMode && gameState.timeOfDay === 'night') {
            showNotification(`🌙 Nightowl: Night bonus active!`, 'info');
        }
        if (effect.dayMode && gameState.timeOfDay === 'day') {
            showNotification(`☀️ Sunseeker: Day bonus active!`, 'info');
        }
        
        // Consistency Mode - Same tier bonus
        if (effect.consistencyMode) {
            if (effect.consistencyLastTier === aura.tier) {
                effect.consistencyBonus = true;
                aura.effectiveRarity = Math.round((aura.effectiveRarity || aura.rarity) * 1.5);
                showNotification(`🔄 Consistency: Same tier! +50% luck!`, 'success');
            }
            effect.consistencyLastTier = aura.tier;
        }
        
        // Variety Mode - Different auras bonus
        if (effect.varietyMode) {
            if (!effect.varietyRolls) effect.varietyRolls = [];
            effect.varietyRolls.push(aura.name);
            if (effect.varietyRolls.length > 5) effect.varietyRolls.shift();
            
            const uniqueAuras = new Set(effect.varietyRolls);
            if (uniqueAuras.size === 5) {
                aura.effectiveRarity = Math.round((aura.effectiveRarity || aura.rarity) * 4);
                showNotification(`🎨 Variety: 5 different auras! +300% luck!`, 'success');
                effect.varietyRolls = [];
            }
        }
        
        // Breakthrough Catalyst
        if (effect.breakthroughMode && Math.random() < 0.5) {
            // Double breakthrough chance (handled in getRandomAura)
            gameState.specialEffects.breakthroughBoost = true;
        }
        
        // Efficiency Mode - Save materials during crafting
        if (effect.efficiencyMode && effect.materialSaveChance) {
            // This is handled in craftPotion function
            gameState.specialEffects.efficiencyActive = true;
            gameState.specialEffects.materialSaveChance = effect.materialSaveChance;
        }
        
        // Potion of Dupe - Chance to duplicate rolled aura
        if (effect.dupeChance && Math.random() < effect.dupeChance) {
            // Add an extra count of the rolled aura
            if (gameState.inventory.auras[aura.name]) {
                gameState.inventory.auras[aura.name].count++;
                showNotification(`🎲 Potion of Dupe: ${aura.name} duplicated!`, 'success');
                
                // Visual feedback
                const display = document.getElementById('currentAuraDisplay');
                if (display) {
                    display.classList.add('dupe-bonus');
                    setTimeout(() => display.classList.remove('dupe-bonus'), 1000);
                }
            }
        }
        
        // Insight Mode - Show next materials
        if (effect.insightMode && effect.insightCount > 0) {
            showNotification(`🔍 Insight: You'll get ${aura.name} this roll`, 'info');
            effect.insightCount--;
        }
        
        // Collector Mode - Luck per unique aura
        if (effect.collectorMode) {
            const uniqueAuras = Object.keys(gameState.inventory.auras).length;
            const bonusLuck = Math.min(2.0, uniqueAuras * 0.05);
            aura.effectiveRarity = Math.round((aura.effectiveRarity || aura.rarity) * (1 + bonusLuck));
            showNotification(`📚 Collector: +${Math.round(bonusLuck * 100)}% luck (${uniqueAuras} auras)`, 'info');
        }
        
        // Beginner Mode - Only works under 100 rolls
        if (effect.beginnerMode) {
            if (gameState.totalRolls < 100) {
                showNotification(`🌱 Beginner: Bonus active! (${gameState.totalRolls}/100 rolls)`, 'success');
            } else {
                // Remove effect if over 100 rolls
                const index = gameState.activeEffects.indexOf(effect);
                if (index > -1) {
                    gameState.activeEffects.splice(index, 1);
                    showNotification(`🌱 Beginner: Bonus expired (100+ rolls)`, 'warning');
                }
            }
        }
        
        // Mastery Mode - Luck per 1000 rolls
        if (effect.masteryMode) {
            const bonusLuck = Math.min(3.0, Math.floor(gameState.totalRolls / 1000) * 0.01);
            aura.effectiveRarity = Math.round((aura.effectiveRarity || aura.rarity) * (1 + bonusLuck));
            if (bonusLuck > 0) {
                showNotification(`🎓 Mastery: +${Math.round(bonusLuck * 100)}% luck (${Math.floor(gameState.totalRolls / 1000)}k rolls)`, 'info');
            }
        }
    }
    
    return aura; // Return the (potentially modified) aura
}

async function completeRoll(isQuickRoll = false) {

    
    const aura = getRandomAura();

    const storedRarity = aura.effectiveRarity || aura.rarity;
    if (!gameState.inventory.auras[aura.name]) {
        gameState.inventory.auras[aura.name] = { count: 0, rarity: storedRarity, tier: aura.tier };
    }
    gameState.inventory.auras[aura.name].rarity = Math.min(gameState.inventory.auras[aura.name].rarity, storedRarity);
    gameState.inventory.auras[aura.name].count++;
    gameState.inventory.auras[aura.name].lastWasBreakthrough = !!aura.breakthrough;

    // =================================================================
    // NEW AND IMPROVED CUTSCENE LOGIC
    // =================================================================
    
    // This map is now the SINGLE SOURCE OF TRUTH for video cutscenes.
    const allCutscenes = {
        "Abyssal Hunter": playAbyssalHunterCutscene,
        "Overture: History": playOvertureHistoryCutscene,
        "Overture: Future": playOvertureFutureCutscene,
        "Gargantua": playGargantuaCutscene,
        "Chromatic: Genesis": playChromaticGenesisCutscene,
        "Chromatic: Exotic": playChromaticExoticCutscene,
        "Archangel": playArchangelsCutscene,
        "Archangel: Seraphim": playArchangelSeraphimCutscene,
        "『E Q U I N O X』": playEquinoxCutscene,
        "Luminosity": playLuminosityCutscene,
        "Dreammetric": playDreammetricCutscene,
        "Aegis": playAegisCutscene,
        "Aegis - Watergun": playAegisWatergunCutscene,
        "Aviator: Fleet": playAviatorFleetCutscene,
        "Apostolos": playApostolosCutscene,
        "Oblivion": playOblivionCutscene,
        "Abomination": playAbominationCutscene,
        "Memory: The Fallen": playMemoryCutscene,
        "Oppression": playOppressionCutscene,
        "Symphony": playSymphonyCutscene,
        "Kyawthuite: Remembrance": playKyawthuiteCutscene,
        "Flora: Evergreen": playFloraEvergreenCutscene,
        "Matrix: Overdrive": playMatrixOverdriveCutscene,
        "Mastermind": playMastermindCutscene,
        "Maelstrom": playMaelstromCutscene,
        "Nightmare Sky": playNightmareSkyCutscene,
        "Bloodlust": playBloodlustCutscene
    };

    const videoFunction = allCutscenes[aura.name];

    // Check cutscene settings using new comprehensive system
    const shouldPlayCutscene2 = typeof shouldPlayCutsceneForAura === 'function' 
        ? shouldPlayCutsceneForAura(aura)
        : true; // Fallback to true if function not loaded

    if (shouldPlayCutscene2) {
            if (videoFunction) {
                // If the aura name is in our map, play its specific video.
                await videoFunction(aura);
            }
            else if (shouldTriggerUltraRareCutscene(aura)) {
                // Check for 99M+ rarity first - use enhanced seal breaking cutscene (with fade to black for globals)
                await playUltraRareCutscene(aura);
            }
            else if (shouldTriggerCutscene(aura)) {
                // IF NOT a video aura, THEN check if it's rare enough for the default canvas cutscene (10-98M).
                await playUltraRareCutscene(aura);
            }
            else if (shouldTriggerRareCutscene(aura)) {
                // Otherwise, check if it's rare enough for the 1M+ cutscene.
                await playRareCutscene(aura);
            }
        }
    
    // =================================================================

    // Process special gear effects
    processSpecialGearEffects(aura);
    
    // QoL: Add to roll history
    if (typeof addToRollHistory === 'function') {
        addToRollHistory(aura);
    }

    displayAura(aura);

    const oneRollIndex = gameState.activeEffects.findIndex(effect => effect.oneRoll);
    if (oneRollIndex !== -1) {
        gameState.activeEffects.splice(oneRollIndex, 1);
    }

    // Check if we had cooldown removal before filtering
    const hadCooldownRemoval = gameState.activeEffects.some(e => e.removeCooldown && e.rollCount);
    
    for (const effect of gameState.activeEffects) {
        if (effect.rollCount) {
            effect.rollsLeft = (effect.rollsLeft || effect.rollCount) - 1;
        }
    }
    gameState.activeEffects = gameState.activeEffects.filter(effect => !effect.rollCount || effect.rollsLeft > 0);
    
    // Restore normal cooldown if removeCooldown potion ran out
    if (hadCooldownRemoval && !gameState.activeEffects.some(e => e.removeCooldown)) {
        if (gameState.autoRoll && gameState.autoRoll.active && autoRollWorker) {
            const baseDelay = gameState.autoRoll.delay || 600;
            const normalDelay = Math.max(50, baseDelay / gameState.currentSpeed);
            console.log('⏱️ Warp/Transcendent expired - restoring cooldown:', normalDelay, 'ms');
            autoRollWorker.postMessage({
                type: 'updateDelay',
                delay: normalDelay
            });
        }
    }

    recalculateStats();
    updateUI();
    updateInventoryDisplay();
    saveGameState();
    gameState.isRolling = false;
    document.getElementById('rollButton').disabled = false;
    document.getElementById('quickRollButton').disabled = false;
    
    // Fast auto roll trigger - roll again with quick animation if auto roll is active
    if (gameState.autoRoll.active && !gameState.cutscenePlaying) {
        setTimeout(() => {
            if (gameState.autoRoll.active && !gameState.cutscenePlaying) {
                quickRollAura(); // Use quick roll for fast animated next roll
            }
        }, 200); // Quick speed - 0.2 second delay
    }
}

// Hardcoded native rarities for biome-exclusive auras
const NATIVE_RARITIES = {
    "Wind": 300,
    "✿ Flow ✿": 29000,
    "Stormal": 30000,
    "Hurricane": 4500000,
    "★ AVIATOR ★": 8000000,
    "Maelstrom": 103333333,
    "Glacier": 768,
    "Permafrost": 24500,
    "Blizzard": 9105000,
    "Chillsear": 125000000,
    "Wonderland": 4000000,
    "Santa-Frost": 15000000,
    "< Winter Fantasy >": 24000000,
    "Express": 30000000,
    "{ABOMINABLE}": 40000000,
    "《 Shard┃Surfer 》": 75000000,
    "Atlas : Yuletide": 170000000,
    "Poseidon": 1000000,
    "Sailor": 3000000,
    "Sailor : Flying Dutchman": 20000000,
    "Abyssal Hunter": 100000000,
    "Gilded": 128,
    "Jackpot": 194,
    "Anubis": 1800000,
    "Atlas": 90000000,
    "Starlight": 10000,
    "Star Rider": 10000,
    "Comet": 24000,
    "Starfish Rider": 25000,
    "Astral": 267200,
    "Galaxy": 1000000,
    "Starscourge": 2000000,
    "Sirius": 2800000,
    "Starscourge: Radiant": 20000000,
    "Astral: Legendarium": 53440000,
    "Astral: Zodiac": 53440000,
    "Gargantua": 86000000,
    "Hazard": 1400,
    "Corrosive": 2400,
    "Hazard: Rays": 14000,
    "Parasite": 600000,
    "Impeached": 40000000,
    "Undead": 2000,
    "Undead: Devil": 111111,
    "Hades": 1111111,
    "Bloodlust": 50000000,
    "Solar": 5000,
    "Solar: Solstice": 500000,
    "Lunar": 5000,
    "Lunar: Full Moon": 500000,
    "Twilight": 600000,
    "Lullaby": 1700000,
    "Twilight: Iridescent Memory": 6000000,
    "Twilight: Withering Grace": 18000000,
    "Undefined": 1111,
    "Undefined: Defined": 2222,
    "Shiftlock": 3325,
    "Nihility": 9000
};

// Get the pool of available auras based on current biome
function getAuraPool() {
    // Get current biome
    const currentBiome = typeof biomeState !== 'undefined' ? biomeState.currentBiome : 'NORMAL';
    
    // Get active rune biomes to check if exclusive auras should be included
    const activeRuneBiomes = typeof getActiveRuneBiomes === 'function' ? getActiveRuneBiomes() : [];
    
    // Filter auras based on biome exclusivity
    return AURAS.filter(aura => {
        // Check if this aura is exclusive to certain biomes (can ONLY be rolled there)
        if (typeof BIOME_AURAS !== 'undefined') {
            // GLITCHED exclusive auras - can ONLY be rolled in GLITCHED biome OR with Rune of 404
            if (BIOME_AURAS["GLITCHED"]?.includes(aura.name)) {
                return currentBiome === "GLITCHED" || activeRuneBiomes.includes("GLITCHED");
            }
            
            // DREAMSPACE exclusive auras - can ONLY be rolled in DREAMSPACE biome OR with Rune of Dreams
            if (BIOME_AURAS["DREAMSPACE"]?.includes(aura.name)) {
                return currentBiome === "DREAMSPACE" || activeRuneBiomes.includes("DREAMSPACE");
            }
        }
        
        // All other auras are available (biome multipliers will be applied in getRandomAura)
        return true;
    });
}

function getRandomAura() {
    const auraPool = getAuraPool();
    const sortedAuras = [...auraPool].sort((a, b) => b.rarity - a.rarity);
    const luck = gameState.currentLuck;
    const currentBiome = typeof biomeState !== 'undefined' ? biomeState.currentBiome : 'NORMAL';
    
    // Limbo-exclusive aura drop rates (only active when in limbo)
    const LIMBO_AURA_DROP_RATES = {
        "Nothing": 1,                    // 1 in 1
        "Raven": 500000,                 // 1 in 500k
        "Anima": 5730000,                // 1 in 5,730,000
        "Juxtaposition": 40000000,       // 1 in 40 million
        "Unknown": 444444444,            // 1 in 444,444,444
        "Elude": 555555555,              // 1 in 555,555,555
        "Prologue": 666666111,           // 1 in 666,666,111
        "Dreamscape": 850000000          // 1 in 850 million
    };
    
    // =================================================================
    // LINEAR LUCK SCALING - ACCURATE SYSTEM
    // Luck directly multiplies your chance. 
    // 1.0 = 100% (base), 2.0 = 200% (2x chance), etc.
    // This makes the displayed luck percentage mathematically accurate.
    // =================================================================
    const luckFactor = luck; 

    // Handle special potion effects
    const rainbowPotion = gameState.activeEffects.find(effect => effect.guaranteeRarity === "epic");
    const auraMagnetPotion = gameState.activeEffects.find(effect => effect.legendaryOnly);
    const phoenixPotion = gameState.activeEffects.find(effect => effect.phoenixMode);
    const curseImmunity = gameState.activeEffects.some(effect => effect.curseImmunity);

    // Check if player is in limbo for limbo-exclusive auras
    const isInLimbo = typeof limboState !== 'undefined' && limboState.inLimbo;
    
    // Handle limbo-exclusive auras with custom drop rates
    if (isInLimbo) {
        // Get all limbo-exclusive auras from the current pool
        const limboAuras = sortedAuras.filter(aura => LIMBO_AURA_DROP_RATES.hasOwnProperty(aura.name));
        
        // Try to roll for each limbo-exclusive aura with custom rates
        for (const aura of limboAuras) {
            const customRarity = LIMBO_AURA_DROP_RATES[aura.name];
            const chance = (1 / customRarity) * luckFactor;
            
            if (Math.random() < chance) {
                const effectiveRarity = Math.max(1, Math.round(customRarity / luckFactor));
                return { ...aura, effectiveRarity, breakthrough: false, native: false };
            }
        }
    }

    // Phoenix Potion: Track consecutive common rolls
    if (!gameState.specialEffects) gameState.specialEffects = {};
    if (!gameState.specialEffects.consecutiveCommons) gameState.specialEffects.consecutiveCommons = 0;

    const hasOblivionPotion = gameState.activeEffects.some(effect => effect.name === 'Oblivion Potion');

    if (hasOblivionPotion) {
        if (Math.random() < 0.01) {
            const memoryAura = auraPool.find(aura => aura.name === 'Memory: The Fallen');
            if (memoryAura) return { ...memoryAura, effectiveRarity: 100, breakthrough: false, native: false };
        }
        if (Math.random() < 0.001) {
            const oblivionAura = auraPool.find(aura => aura.name === 'Oblivion');
            if (oblivionAura) return { ...oblivionAura, effectiveRarity: 1000, breakthrough: false, native: false };
        }
    }

    // Voidheart: Makes Eden obtainable at 1/1000
    const hasVoidheart = gameState.activeEffects.some(effect => effect.voidheartMode);
    
    if (hasVoidheart) {
        if (Math.random() < 0.001) { // 1/1000 chance
            const edenAura = auraPool.find(aura => aura.name === 'Eden');
            if (edenAura) return { ...edenAura, effectiveRarity: 1000, breakthrough: false, native: false };
        }
    }

    // Rainbow Potion: Guarantee Epic-Exotic tier ONLY (capped, no Divine+)
    if (rainbowPotion && !rainbowPotion.guaranteeUsed) {
        const tierOrder = { 'common': 1, 'uncommon': 2, 'rare': 3, 'epic': 4, 'legendary': 5, 'mythic': 6, 'exotic': 7, 'divine': 8, 'celestial': 9, 'transcendent': 10 };
        
        // Cap at Exotic tier (4-7), excludes Divine/Celestial/Transcendent
        const cappedEpicAuras = sortedAuras.filter(aura => {
            const auraTier = tierOrder[aura.tier] || 0;
            return auraTier >= 4 && auraTier <= 7; // Epic through Exotic only
        });
        
        if (cappedEpicAuras.length > 0) {
            const selectedAura = cappedEpicAuras[Math.floor(Math.random() * cappedEpicAuras.length)];
            rainbowPotion.guaranteeUsed = true;
            return { ...selectedAura, effectiveRarity: selectedAura.rarity, breakthrough: false, native: false };
        }
    }

    // Aura Magnet Potion: Only affect Legendary+ auras
    if (auraMagnetPotion) {
        const legendaryPlusAuras = sortedAuras.filter(aura => {
            const tierOrder = { 'common': 1, 'uncommon': 2, 'rare': 3, 'epic': 4, 'legendary': 5, 'mythic': 6, 'exotic': 7, 'divine': 8, 'celestial': 9, 'transcendent': 10 };
            const auraTier = tierOrder[aura.tier] || 0;
            return auraTier >= 5; // Legendary or higher
        });
        
        // Apply bonus luck only to Legendary+ auras
        for (const aura of legendaryPlusAuras) {
            let auraBiomeMult = 1;
            if (typeof getAuraBiomeMultiplier === 'function') {
                auraBiomeMult = getAuraBiomeMultiplier(aura.name) || 1;
            }

            const chance = (1 / aura.rarity) * luckFactor * auraBiomeMult * (1 + auraMagnetPotion.luckBoost);

            if (Math.random() < chance) {
                const effectiveRarity = Math.max(1, Math.round(aura.rarity / (luckFactor * auraBiomeMult * (1 + auraMagnetPotion.luckBoost))));
                const isNative = auraBiomeMult > 1;
                return { ...aura, effectiveRarity, breakthrough: false, native: isNative, biomeMult: auraBiomeMult };
            }
        }
    }

    const filteredAuras = sortedAuras.filter(aura => {
        if (!hasOblivionPotion && (aura.name === 'Oblivion' || aura.name === 'Memory: The Fallen')) return false;
        
        // Exclude limbo-exclusive auras when not in limbo
        if (!isInLimbo && LIMBO_AURA_DROP_RATES.hasOwnProperty(aura.name)) return false;
        
        // GLITCHED and DREAMSPACE exclusivity is now handled in getAuraPool()
        return true;
    });

    for (const aura of filteredAuras) {
        let auraBiomeMult = 1;
        if (typeof getAuraBiomeMultiplier === 'function') {
            auraBiomeMult = getAuraBiomeMultiplier(aura.name) || 1;
        }

        // Linear luck: your displayed luck % directly equals your chance multiplier
        const chance = (1 / aura.rarity) * luckFactor * auraBiomeMult;

        if (Math.random() < chance) {
            // Phoenix Potion: Reset consecutive commons counter
            if (phoenixPotion) {
                gameState.specialEffects.consecutiveCommons = 0;
            }
            
            // Calculate effective rarity: what the odds were with your current luck
            const effectiveRarity = Math.max(1, Math.round(aura.rarity / (luckFactor * auraBiomeMult)));
            const isBreakthrough = auraBiomeMult < 1; // Breakthrough occurs when biome multiplier is negative
            const isNative = auraBiomeMult > 1; // Native means aura is being rolled in its home biome with a multiplier bonus
            return { ...aura, effectiveRarity, breakthrough: isBreakthrough, native: isNative, biomeMult: auraBiomeMult };
        }
    }

    // Phoenix Potion: Track consecutive common rolls
    if (phoenixPotion) {
        gameState.specialEffects.consecutiveCommons++;
        
        // If 10 commons in a row, guarantee rare+ next roll
        if (gameState.specialEffects.consecutiveCommons >= 10) {
            const rarePlusAuras = sortedAuras.filter(aura => {
                const tierOrder = { 'common': 1, 'uncommon': 2, 'rare': 3, 'epic': 4, 'legendary': 5, 'mythic': 6, 'exotic': 7, 'divine': 8, 'celestial': 9, 'transcendent': 10 };
                const auraTier = tierOrder[aura.tier] || 0;
                return auraTier >= 3; // Rare or higher
            });
            
            if (rarePlusAuras.length > 0) {
                const selectedAura = rarePlusAuras[Math.floor(Math.random() * rarePlusAuras.length)];
                gameState.specialEffects.consecutiveCommons = 0;
                return { ...selectedAura, effectiveRarity: selectedAura.rarity, breakthrough: false, native: false };
            }
        }
    }

    // Fallback aura if nothing is rolled (should be extremely rare with high luck)
    let fallback = sortedAuras[sortedAuras.length - 1];
    
    // Kismet Regulator: Prevent rolling "Nothing"
    const hasKismetRegulator = Object.values(gameState.equipped || {}).some(gearName => {
        return gearName && gearData[gearName]?.effects?.special === 'preventNothing';
    });
    
    if (hasKismetRegulator && fallback.name === 'Nothing') {
        // Find the next lowest rarity aura that isn't "Nothing"
        fallback = sortedAuras.find(aura => aura.name !== 'Nothing') || fallback;
    }
    
    const fallbackEffectiveRarity = Math.max(1, Math.round(fallback.rarity / luckFactor));
    
    // Phoenix Potion: Increment consecutive commons for fallback
    if (phoenixPotion && fallback.tier === 'common') {
        gameState.specialEffects.consecutiveCommons++;
    }
    
    return { ...fallback, effectiveRarity: fallbackEffectiveRarity, breakthrough: false, native: false };
}

function displayAura(aura, isAnimating = false) {
    const display = document.getElementById('currentAuraDisplay');
    const rarityClass = `rarity-${aura.tier}`;
    const showRarity = aura.rarity; // Always show actual aura rarity, not effective rarity
    const breakthroughLabel = aura.breakthrough ? ' (Breakthrough)' : '';
    
    // Use hardcoded native rarity if available, otherwise fallback to base rarity
    const nativeRarity = NATIVE_RARITIES[aura.name] || showRarity;
    const nativeLabel = aura.native ? `<div class="aura-native" style="color: #4ade80; font-size: 0.85em; margin-top: 2px; padding-bottom: 4px;">Native, 1 in ${nativeRarity.toLocaleString()}</div>` : '';
    const auraFont = getAuraFont(aura.name);
    const auraColor = getAuraColor(aura.name); // Use specific aura color
    const auraGradient = getAuraGradient(aura.name);
    
    // Check if this is a new best aura
    const isNewBest = aura.rarity >= gameState.achievements.stats.highestRarity;
    const newBestIndicator = isNewBest ? '<div class="new-best-indicator">🌟 NEW BEST! 🌟</div>' : '';
    
    // Special text effects for 98M+ auras
    const specialTextEffects = {
        'Mastermind': 'mastermind-text',
        'Chromatic': 'chromatic-rainbow',
        'Chromatic: Diva': 'chromatic-diva-text',
        'Chromatic: Genesis': 'chromatic-genesis-text',
        'Runic: Eternal': 'runic-eternal-text',
        'M A R T Y R': 'martyr-text',
        'Starscourge: Radiant': 'starscourge-radiant-text',
        'Symphony': 'symphony-text',
        'Overture': 'overture-text',
        'Aviator: Fleet': 'aviator-fleet-text',
        'Sovereign': 'sovereign-text',
        'Abomination': 'abomination-text',
        '『E Q U I N O X』': 'equinox-text',
        'Luminosity': 'luminosity-text',
        'Dreamscape': 'dreamscape-text',
        'Aegis': 'aegis-text',
        'Gargantua': 'gargantua-text',
        'Apostolos': 'apostolos-text',
        '▣ PIXELATION ▣': 'pixelation-text',
        'Dreammetric': 'dreammetric-text'
    };
    
    const specialTextClass = specialTextEffects[aura.name] || '';
    const specialContainerClass = specialTextClass ? 'mastermind-container' : '';
    
    // Create dynamic glow effect using the aura's color
    // Use both text-shadow and filter drop-shadow for maximum compatibility
    const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    const glowColor = hexToRgba(auraColor, 0.8);
    const glowColorLight = hexToRgba(auraColor, 0.4);
    const glowStyle = `text-shadow: 0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 60px ${glowColorLight} !important; filter: drop-shadow(0 0 20px ${glowColor}) drop-shadow(0 0 40px ${glowColorLight}) !important;`;
    
    // Special case: Display image for Twilight: Withering Grace
    if (aura.name === 'Twilight: Withering Grace') {
        display.innerHTML = `<div class="${specialContainerClass}">
            <img src="twg.png" alt="Twilight: Withering Grace" class="withering-grace-image" style="filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 40px rgba(167, 139, 250, 0.5));">
            ${newBestIndicator}
            <div class="aura-rarity">1 in ${showRarity.toLocaleString()}${breakthroughLabel}</div>
            ${nativeLabel}
        </div>`;
    } else {
        display.innerHTML = `<div class="${specialContainerClass}"><div class="aura-name ${rarityClass} gradient-text ${specialTextClass}" style="font-family: ${auraFont}; color: ${auraColor} !important; --aura-gradient: ${auraGradient}; ${glowStyle}">${aura.name}</div>${newBestIndicator}<div class="aura-rarity">1 in ${showRarity.toLocaleString()}${breakthroughLabel}</div>${nativeLabel}</div>`;
    }
    if (!isAnimating) {
        anime({ targets: display, scale: [1.1, 1], duration: 300, easing: 'easeOutExpo' });
    }
    
    // Special effect for Chromatic: Genesis - emanating words
    if (aura.name === 'Chromatic: Genesis') {
        createGenesisEmanatingWords();
    }
}

// Create emanating words for Chromatic: Genesis
function createGenesisEmanatingWords() {
    const display = document.getElementById('currentAuraDisplay');
    if (!display) {
        console.error('currentAuraDisplay element not found');
        return;
    }
    
    const words = ['WAKE', 'FROM', 'STAY', 'AWAY', 'KEEP', 'THERE', 'THAT', 'HERE', 'WORRY'];
    
    // Remove any existing words container
    const existingContainer = display.querySelector('.genesis-words-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    // Create container for words
    const container = document.createElement('div');
    container.className = 'genesis-words-container';
    display.appendChild(container);
    
    // Function to spawn a word
    function spawnWord() {
        const word = words[Math.floor(Math.random() * words.length)];
        const wordEl = document.createElement('div');
        wordEl.className = 'genesis-word';
        wordEl.textContent = word;
        
        // Random starting position near center
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 30;
        const startX = 150 + Math.cos(angle) * distance;
        const startY = 150 + Math.sin(angle) * distance;
        
        // Calculate end position (further out in same direction)
        const endDistance = 80 + Math.random() * 60;
        const endX = 150 + Math.cos(angle) * endDistance;
        const endY = 150 + Math.sin(angle) * endDistance;
        
        wordEl.style.left = startX + 'px';
        wordEl.style.top = startY + 'px';
        
        container.appendChild(wordEl);
        
        // Animate to end position
        anime({
            targets: wordEl,
            left: endX + 'px',
            top: endY + 'px',
            duration: 2500,
            easing: 'easeOutQuad',
            complete: () => wordEl.remove()
        });
    }
    
    // Spawn words continuously
    spawnWord();
    const interval = setInterval(spawnWord, 300);
    
    // Stop after 10 seconds
    setTimeout(() => {
        clearInterval(interval);
        setTimeout(() => {
            if (container.parentNode) {
                container.remove();
            }
        }, 3000);
    }, 10000);
}

// Special Effects Functions

function calculateSpecialEffects() {
    let luckBonus = 0;
    let speedBonus = 0;
    const baseLuck = 1.0;
    
    // Apply special effects from equipped gear
    for (let slot in gameState.equipped) {
        const gearName = gameState.equipped[slot];
        if (gearName && gearData[gearName]?.effects?.special) {
            const gearEffects = gearData[gearName].effects;
            const special = gearEffects.special;
            
            switch(special) {
                case 'randomGemBoost':
                    // Adds random luck and rollSpeed boost for a duration
                    if (gameState.specialEffects.gemstoneActive) {
                        luckBonus += gameState.specialEffects.gemstoneBoost.luck / 100;
                        speedBonus += gameState.specialEffects.gemstoneBoost.speed / 100;
                    }
                    break;
                case 'rainyBiomeBonus':
                    // Bonus in rainy biomes (if biome system is active)
                    if (typeof biomeState !== 'undefined' && biomeState.currentBiome === 'RAINY') {
                        luckBonus += gearEffects.rainyBonus / 100;
                    }
                    break;
                case 'starfallBiomeBonus':
                    // Bonus in starfall biomes (if biome system is active)
                    if (typeof biomeState !== 'undefined' && biomeState.currentBiome === 'STARFALL') {
                        luckBonus += gearEffects.starfallBonus / 100;
                    }
                    break;
                case 'windyBiomeBonus':
                    // Bonus in windy biomes (if biome system is active)
                    if (typeof biomeState !== 'undefined' && biomeState.currentBiome === 'WINDY') {
                        luckBonus += gearEffects.windyBonus / 100;
                    }
                    break;
                case 'jackpotBonus':
                    // Apply jackpot bonus
                    luckBonus += gearEffects.bonus / 100;
                    break;
                case 'jackpotMiniBonus':
                    // Apply mini jackpot bonus
                    luckBonus += gearEffects.bonus / 100;
                    break;
                case 'timeWarpBonus':
                    // Bonus that increases with time since last roll
                    if (!gameState.specialEffects) {
                        gameState.specialEffects = {};
                    }
                    
                    // Initialize time warp tracking if it doesn't exist
                    if (gameState.specialEffects.lastRollTime === undefined) {
                        gameState.specialEffects.lastRollTime = Date.now();
                    }
                    
                    // Calculate time since last roll
                    const currentTime = Date.now();
                    const timeSinceLastRoll = (currentTime - gameState.specialEffects.lastRollTime) / 1000; // in seconds
                    
                    // Apply time warp bonus based on time elapsed
                    const timeWarpBonus = gameState.specialEffects.timeWarpBonus || 0;
                    if (timeWarpBonus > 0 && timeSinceLastRoll > 5) { // Only apply if more than 5 seconds have passed
                        // Calculate bonus multiplier (increases with time, caps at 2x after 60 seconds)
                        const maxBonusTime = 60; // 60 seconds for max bonus
                        const timeBonusMultiplier = 1 + (Math.min(timeSinceLastRoll / maxBonusTime, 1) * timeWarpBonus);
                        
                        // Apply bonus to aura stats
                        if (aura.luckBoost) aura.luckBoost *= timeBonusMultiplier;
                        if (aura.speedBoost) aura.speedBoost *= timeBonusMultiplier;
                        if (aura.rarityBoost) aura.rarityBoost *= timeBonusMultiplier;
                        
                        // Show notification
                        const bonusPercent = Math.round((timeBonusMultiplier - 1) * 100);
                        showNotification(`Time Warp activated! ${bonusPercent}% bonus after ${Math.round(timeSinceLastRoll)}s!`);
                        
                        // Visual feedback
                        const display = document.getElementById('currentAuraDisplay');
                        if (display) {
                            display.classList.add('time-warp-bonus');
                            setTimeout(() => display.classList.remove('time-warp-bonus'), 1000);
                        }
                    }
                    
                    // Update last roll time for next calculation
                    gameState.specialEffects.lastRollTime = currentTime;
                    break;
                case 'bonusRollPointChance':
                    // Chance to gain bonus roll points on each roll
                    if (!gameState.specialEffects) {
                        gameState.specialEffects = {};
                    }
                    
                    // Initialize roll points if they don't exist
                    if (gameState.specialEffects.rollPoints === undefined) {
                        gameState.specialEffects.rollPoints = 0;
                    }
                    
                    // Calculate chance to gain bonus roll points
                    const bonusRollChance = gameState.specialEffects.bonusRollPointChance || 0;
                    if (bonusRollChance > 0 && Math.random() < bonusRollChance) {
                        // Gain bonus roll points
                        const pointsGained = Math.floor(Math.random() * 3) + 1; // 1-3 points
                        gameState.specialEffects.rollPoints += pointsGained;
                        
                        // Show notification
                        showNotification(`Lucky Charm activated! +${pointsGained} Roll Points!`);
                        
                        // Visual feedback
                        const display = document.getElementById('currentAuraDisplay');
                        if (display) {
                            display.classList.add('lucky-bonus');
                            setTimeout(() => display.classList.remove('lucky-bonus'), 1000);
                        }
                    }
                    break;
                case 'permanentBonusRoll':
                    // Permanent bonus roll chance that accumulates over time
                    if (!gameState.specialEffects) {
                        gameState.specialEffects = {};
                    }
                    
                    // Initialize permanent bonus roll chance if it doesn't exist
                    if (gameState.specialEffects.permanentBonusRoll === undefined) {
                        gameState.specialEffects.permanentBonusRoll = 0;
                    }
                    
                    // Increase permanent bonus roll chance slightly with each roll
                    const bonusRollIncrease = gameState.specialEffects.permanentBonusRoll || 0;
                    if (bonusRollIncrease > 0) {
                        // Add small permanent increase (0.01% per roll)
                        gameState.specialEffects.permanentBonusRoll += 0.0001;
                        
                        // Check for bonus roll activation
                        if (Math.random() < gameState.specialEffects.permanentBonusRoll) {
                            // Trigger bonus roll
                            showNotification(`Eternal Ring activated! Permanent bonus roll triggered!`);
                            
                            // Add a small luck boost for this roll
                            if (aura.luckBoost) {
                                aura.luckBoost *= 1.1;
                            } else {
                                aura.luckBoost = 1.1;
                            }
                            
                            // Visual feedback
                            const display = document.getElementById('currentAuraDisplay');
                            if (display) {
                                display.classList.add('eternal-bonus');
                                setTimeout(() => display.classList.remove('eternal-bonus'), 1000);
                            }
                        }
                    }
                    break;
                case 'negativeAuraReroll':
                    // This effect is passive, allows rerolling negative auras
                    break;
                case 'biomeBonus':
                    // Apply biome-specific bonuses (if biome system is active)
                    if (typeof biomeState !== 'undefined' && gearEffects.biomes) {
                        if (gearEffects.biomes.includes(biomeState.currentBiome)) {
                            luckBonus += gearEffects.luckBonus / 100;
                            speedBonus += gearEffects.rollSpeedBonus / 100;
                        }
                    }
                    break;
                case 'divineBiomeBonus':
                    // Apply divine biome bonuses (if biome system is active)
                    if (typeof biomeState !== 'undefined' && gearEffects.biomes) {
                        if (gearEffects.biomes.includes(biomeState.currentBiome)) {
                            luckBonus += gearEffects.bonus / 100;
                        }
                    }
                    break;
                case 'rarityFloorIncrease':
                    // This effect modifies the aura rolling process
                    break;
                case 'rarityMultiplierBoost':
                    // Multiplies the rarity multiplier for better aura chances
                    if (!gameState.specialEffects) {
                        gameState.specialEffects = {};
                    }
                    
                    // Initialize rarity multiplier boost if it doesn't exist
                    if (gameState.specialEffects.rarityMultiplierBoost === undefined) {
                        gameState.specialEffects.rarityMultiplierBoost = 1;
                    }
                    
                    // Apply rarity multiplier boost to current aura
                    const rarityMultiplier = gameState.specialEffects.rarityMultiplierBoost;
                    if (rarityMultiplier > 1) {
                        // Apply multiplier to aura rarity
                        if (aura.rarity) {
                            aura.rarity = Math.max(1, aura.rarity * rarityMultiplier);
                        }
                        
                        // Show notification
                        const multiplierPercent = Math.round((rarityMultiplier - 1) * 100);
                        showNotification(`Rarity Multiplier activated! ${multiplierPercent}% boost to aura rarity!`);
                        
                        // Visual feedback
                        const display = document.getElementById('currentAuraDisplay');
                        if (display) {
                            display.classList.add('rarity-boost');
                            setTimeout(() => display.classList.remove('rarity-boost'), 1000);
                        }
                    }
                    break;
                case 'guaranteedHighTier':
                    // This effect would be handled during aura rolling
                    break;
                case 'bonusRollMultiplier':
                    // Progressive bonus roll multiplier (2 -> 6 every 10 rolls)
                    if (!gameState.specialEffects) gameState.specialEffects = {};
                    
                    // Initialize tracking for progressive multiplier
                    if (!gameState.specialEffects.bonusRollMultiplierRollCount) {
                        gameState.specialEffects.bonusRollMultiplierRollCount = 0;
                    }
                    if (!gameState.specialEffects.bonusRollMultiplierCurrent) {
                        gameState.specialEffects.bonusRollMultiplierCurrent = 2; // Start at 2x
                    }
                    
                    // Parse the multiplier progression from string like "2 -> 6"
                    let baseMultiplier = 2;
                    let maxMultiplier = 6;
                    if (gearEffects.multiplier && typeof gearEffects.multiplier === 'string') {
                        const match = gearEffects.multiplier.match(/(\d+)\s*->\s*(\d+)/);
                        if (match) {
                            baseMultiplier = parseInt(match[1]);
                            maxMultiplier = parseInt(match[2]);
                        }
                    } else {
                        // Fallback for non-string multipliers
                        baseMultiplier = gearEffects.multiplier || 2;
                        maxMultiplier = baseMultiplier;
                    }
                    
                    // Increment roll count
                    gameState.specialEffects.bonusRollMultiplierRollCount++;
                    
                    // Check if we've reached 10 rolls
                    if (gameState.specialEffects.bonusRollMultiplierRollCount >= 10) {
                        // Reset counter and increase multiplier
                        gameState.specialEffects.bonusRollMultiplierRollCount = 0;
                        gameState.specialEffects.bonusRollMultiplierCurrent = Math.min(
                            gameState.specialEffects.bonusRollMultiplierCurrent + 1,
                            maxMultiplier
                        );
                        
                        // Show notification about multiplier increase
                        showNotification(`Bonus Roll Multiplier increased! Now ${gameState.specialEffects.bonusRollMultiplierCurrent}x!`);
                        
                        // Visual feedback
                        const display = document.getElementById('currentAuraDisplay');
                        if (display) {
                            display.classList.add('multiplier-increase');
                            setTimeout(() => display.classList.remove('multiplier-increase'), 1000);
                        }
                    }
                    
                    // Set the current multiplier for use in other calculations
                    gameState.specialEffects.bonusRollMultiplier = gameState.specialEffects.bonusRollMultiplierCurrent;
                    break;
                case 'bonusRollCountdown':
                    // Counts down to a guaranteed bonus roll
                    if (!gameState.specialEffects) gameState.specialEffects = {};
                    if (!gameState.specialEffects.bonusRollCountdown) gameState.specialEffects.bonusRollCountdown = 0;
                    
                    // Handle the countdown parameter (e.g., "10 -> 5" for Darkshader)
                    if (gearEffects.countdown && typeof gearEffects.countdown === 'string' && gearEffects.countdown.includes('->')) {
                        const [from, to] = gearEffects.countdown.split('->').map(num => parseInt(num.trim()));
                        // Reduce the countdown from default (10) to the specified value (5)
                        if (!gameState.specialEffects.currentCountdown || gameState.specialEffects.currentCountdown > to) {
                            gameState.specialEffects.currentCountdown = to;
                            showNotification(`Darkshader activated! Bonus roll countdown reduced to ${to} rolls!`);
                        }
                    } else {
                        // Default behavior for other items
                        gameState.specialEffects.bonusRollCountdown += gearEffects.count || 50;
                    }
                    break;
                case 'reverseTimeOnBad':
                    // Stores bad rolls to potentially reverse them
                    if (!gameState.specialEffects) gameState.specialEffects = {};
                    if (!gameState.specialEffects.reverseTimeOnBad) gameState.specialEffects.reverseTimeOnBad = 0;
                    gameState.specialEffects.reverseTimeOnBad += gearEffects.chance || 0.1;
                    luckBonus += Math.min(growth, cap) - baseLuck;
                    break;
                case 'auraStreakBonus':
                    // Bonus for maintaining a streak of positive auras
                    if (!gameState.specialEffects) {
                        gameState.specialEffects = {};
                    }
                    
                    // Initialize streak counter if it doesn't exist
                    if (gameState.specialEffects.positiveAuraStreak === undefined) {
                        gameState.specialEffects.positiveAuraStreak = 0;
                    }
                    
                    // Check if current aura is positive (epic or higher)
                    const positiveAuraTiers = ['epic', 'legendary', 'mythic', 'divine', 'celestial'];
                    const isPositiveAura = positiveAuraTiers.includes(aura.tier);
                    
                    if (isPositiveAura) {
                        // Increment streak
                        gameState.specialEffects.positiveAuraStreak++;
                        
                        // Apply bonus based on streak length
                        if (gameState.specialEffects.positiveAuraStreak >= 3) {
                            // Apply multiplier to aura effect
                            const streakMultiplier = 1 + (Math.min(gameState.specialEffects.positiveAuraStreak, 10) * 0.1); // Cap at 2x (10 streaks)
                            
                            // Apply multiplier to aura stats
                            if (aura.luckBoost) aura.luckBoost *= streakMultiplier;
                            if (aura.speedBoost) aura.speedBoost *= streakMultiplier;
                            if (aura.rarityBoost) aura.rarityBoost *= streakMultiplier;
                            
                            // Show notification
                            showNotification(`Soul Harvester activated! Streak of ${gameState.specialEffects.positiveAuraStreak} - Aura boosted by ${Math.round((streakMultiplier-1)*100)}%!`);
                            
                            // Visual feedback
                            const display = document.getElementById('currentAuraDisplay');
                            if (display) {
                                display.classList.add('streak-bonus');
                                setTimeout(() => display.classList.remove('streak-bonus'), 1000);
                            }
                        }
                    } else {
                        // Reset streak on negative aura
                        gameState.specialEffects.positiveAuraStreak = 0;
                    }
                    break;
                case 'rollCooldownReduction':
                    // This effect reduces roll cooldown (passive)
                    // Apply this when setting the cooldown in rollAura function
                    break;
                case 'bonusRollPointChance':
                    // This effect gives chance for bonus roll points (passive)
                    if (Math.random() < gearEffects.chance) {
                        // Add bonus roll points
                        const bonusPoints = gearEffects.points || 1;
                        gameState.rollPoints = (gameState.rollPoints || 0) + bonusPoints;
                        showNotification(`Dark Matter Device activated! +${bonusPoints} roll point${bonusPoints > 1 ? 's' : ''}`);
                        
                        // Visual feedback
                        const display = document.getElementById('currentAuraDisplay');
                        if (display) {
                            display.classList.add('bonus-point');
                            setTimeout(() => display.classList.remove('bonus-point'), 1000);
                        }
                    }
                    break;
                case 'permanentBonusRoll':
                    // This affects bonus roll system (passive)
                    break;
                case 'timeWarpBonus':
                    // This effect would be handled during specific roll triggers
                    break;
            }
        }
    }
    
    return { luckBonus, speedBonus };
}

function recalculateStats() {
    let luckBonus = 0;
    let speedBonus = 0;
    let baseLuck = 1.0;

    // --- FIX STARTS HERE ---

    // Find ALL "one-roll" effects active (to allow stacking)
    const oneRollEffects = gameState.activeEffects.filter(e => e.oneRoll);

    // Add luck from only the FIRST one-roll potion (don't stack luck from multiple one-roll potions)
    // Multiple one-roll potions should give multiple rolls with the same luck, not additive luck
    if (oneRollEffects.length > 0) {
        const firstOneRollEffect = oneRollEffects[0];
        if (firstOneRollEffect.luckBoost) {
            luckBonus += firstOneRollEffect.luckBoost - 1; // Subtract 1 because we start with a base of 1.
        }
    }

    // Now, add luck from all OTHER active potions (that are not one-roll)
    for (const effect of gameState.activeEffects) {
        if (effect.luckBoost && !effect.oneRoll) {
            luckBonus += effect.luckBoost;
        }
        if (effect.speedBoost && !effect.oneRoll) {
            speedBonus += effect.speedBoost;
        }
        
        // Handle new potion modes
        if (effect.nightMode && gameState.timeOfDay === 'night') {
            luckBonus += effect.luckBoost || 0;
        }
        if (effect.dayMode && gameState.timeOfDay === 'day') {
            luckBonus += effect.luckBoost || 0;
        }
        if (effect.adaptationMode && effect.adaptationBiome === gameState.currentBiome) {
            luckBonus += effect.luckBoost || 0;
        }
        if (effect.beginnerMode && gameState.totalRolls < 100) {
            luckBonus += effect.luckBoost || 0;
        }
    }
    
    // Add luck from equipped GEAR (base stats)
    for (let slot in gameState.equipped) {
        const gearName = gameState.equipped[slot];
        if (gearName && gearData[gearName]?.effects?.luck) {
            // Gear luck is given as a percentage, so we divide by 100.
            luckBonus += gearData[gearName].effects.luck / 100;
        }
    }

    // Apply special effects from equipped gear
    for (let slot in gameState.equipped) {
        const gearName = gameState.equipped[slot];
        if (gearName && gearData[gearName]?.effects?.special) {
            const gearEffects = gearData[gearName].effects;
            const special = gearEffects.special;
            
            switch(special) {
                case 'randomGemBoost':
                    // Adds random luck and rollSpeed boost for a duration
                    // Check if duration has expired
                    if (gameState.specialEffects.gemstoneActive && 
                        gameState.specialEffects.gemstoneEndTime <= Date.now()) {
                        gameState.specialEffects.gemstoneActive = false;
                    }
                    if (gameState.specialEffects.gemstoneActive) {
                        luckBonus += gameState.specialEffects.gemstoneBoost.luck / 100;
                        speedBonus += gameState.specialEffects.gemstoneBoost.speed / 100;
                    }
                    break;
                case 'rainyBiomeBonus':
                    // Bonus in rainy biomes (if biome system is active)
                    if (typeof biomeState !== 'undefined' && biomeState.currentBiome === 'RAINY') {
                        luckBonus += gearEffects.rainyBonus / 100;
                    }
                    break;
                case 'starfallBiomeBonus':
                    // Bonus in starfall biomes (if biome system is active)
                    if (typeof biomeState !== 'undefined' && biomeState.currentBiome === 'STARFALL') {
                        luckBonus += gearEffects.starfallBonus / 100;
                    }
                    break;
                case 'windyBiomeBonus':
                    // Bonus in windy biomes (if biome system is active)
                    if (typeof biomeState !== 'undefined' && biomeState.currentBiome === 'WINDY') {
                        luckBonus += gearEffects.windyBonus / 100;
                    }
                    break;
                case 'jackpotBonus':
                    // Apply jackpot bonus
                    luckBonus += gearEffects.bonus / 100;
                    break;
                case 'jackpotMiniBonus':
                    // Apply mini jackpot bonus
                    luckBonus += gearEffects.bonus / 100;
                    break;
                case 'skipStacks':
                    // Allows skipping multiple rolls at once
                    if (!gameState.specialEffects) {
                        gameState.specialEffects = {};
                    }
                    
                    // Initialize skip stacks if they don't exist
                    if (gameState.specialEffects.skipStacks === undefined) {
                        gameState.specialEffects.skipStacks = 0;
                    }
                    
                    // Check if we have skip stacks available
                    const skipStacks = gameState.specialEffects.skipStacks;
                    if (skipStacks > 0) {
                        // Use a skip stack to get a guaranteed better aura
                        showNotification(`Skip Stacks activated! Using ${skipStacks} stacks for better odds...`);
                        
                        // Apply bonus based on number of stacks used
                        const stackBonus = 1 + (skipStacks * 0.05); // 5% bonus per stack
                        
                        // Apply bonus to aura stats (handled in aura processing functions)
                        // if (aura.luckBoost) aura.luckBoost *= stackBonus;
                        // if (aura.speedBoost) aura.speedBoost *= stackBonus;
                        // if (aura.rarityBoost) aura.rarityBoost *= stackBonus;
                        
                        // Consume one stack
                        gameState.specialEffects.skipStacks--;
                        
                        // Visual feedback
                        const display = document.getElementById('currentAuraDisplay');
                        if (display) {
                            display.classList.add('skip-bonus');
                            setTimeout(() => display.classList.remove('skip-bonus'), 1000);
                        }
                        
                        // Show success message
                        showNotification(`Skip Stacks used! ${skipStacks-1} stacks remaining!`);
                    }
                    break;
                case 'bonusRollMultiplier':
                    // Multiplies the effectiveness of bonus rolls (progressive 2 -> 6)
                    if (!gameState.specialEffects) {
                        gameState.specialEffects = {};
                    }
                    
                    // Initialize specialEffects if it doesn't exist
                    if (!gameState.specialEffects) {
                        gameState.specialEffects = {};
                    }
                    
                    // Initialize bonus roll multiplier if it doesn't exist
                    if (gameState.specialEffects.bonusRollMultiplier === undefined) {
                        gameState.specialEffects.bonusRollMultiplier = 2; // Start at 2x
                    }
                    if (gameState.specialEffects.bonusRollMultiplierRollCount === undefined) {
                        gameState.specialEffects.bonusRollMultiplierRollCount = 0;
                    }
                    
                    // Apply bonus roll multiplier to current aura (handled in aura processing functions)
                    const bonusMultiplier = gameState.specialEffects.bonusRollMultiplier;
                    if (bonusMultiplier > 1) {
                        // Apply multiplier to aura stats (handled in aura processing functions)
                        // if (aura.luckBoost) aura.luckBoost *= bonusMultiplier;
                        // if (aura.speedBoost) aura.speedBoost *= bonusMultiplier;
                        // if (aura.rarityBoost) aura.rarityBoost *= bonusMultiplier;
                        
                        // Show notification with current multiplier and progress
                        
                        // Update bonus roll indicator
                        const bonusIndicator = document.getElementById('bonusRollIndicator');
                        if (bonusIndicator) {
                            bonusIndicator.textContent = `(LUCK)${bonusMultiplier}X LUCK READY!`;
                            bonusIndicator.style.display = 'block';
                        }
                        const multiplierPercent = Math.round((bonusMultiplier - 1) * 100);
                        const rollsUntilNext = 10 - gameState.specialEffects.bonusRollMultiplierRollCount;
                        showNotification(`Bonus Roll Multiplier: ${bonusMultiplier}x active! (${multiplierPercent}% boost) - Next increase in ${rollsUntilNext} rolls`);
                        
                        // Visual feedback
                        const display = document.getElementById('currentAuraDisplay');
                        if (display) {
                            display.classList.add('bonus-multiplier');
                            setTimeout(() => display.classList.remove('bonus-multiplier'), 1000);
                        }
                    }
                    break;
                case 'bonusRollCountdown':
                    // Provides a bonus after a certain number of rolls
                    if (!gameState.specialEffects) {
                        gameState.specialEffects = {};
                    }
                    
                    // Initialize countdown tracking if it doesn't exist
                    if (gameState.specialEffects.bonusRollCountdown === undefined) {
                        gameState.specialEffects.bonusRollCountdown = 0;
                    }
                    
                    // Initialize current countdown if it doesn't exist
                    if (gameState.specialEffects.currentCountdown === undefined) {
                        gameState.specialEffects.currentCountdown = 10; // Default 10 rolls
                    }
                    
                    // Decrement countdown
                    gameState.specialEffects.currentCountdown--;
                    
                    // Check if countdown has reached zero
                    if (gameState.specialEffects.currentCountdown <= 0) {
                        // Reset countdown
                        gameState.specialEffects.currentCountdown = 10;
                        
                        // Apply bonus based on countdown value
                        const countdownBonus = gameState.specialEffects.bonusRollCountdown || 0;
                        if (countdownBonus > 0) {
                            // Apply bonus to aura stats (handled in aura processing functions)
                            const bonusMultiplier = 1 + (countdownBonus * 0.5); // 50% bonus per countdown level
                            
                            // if (aura.luckBoost) aura.luckBoost *= bonusMultiplier;
                            // if (aura.speedBoost) aura.speedBoost *= bonusMultiplier;
                            // if (aura.rarityBoost) aura.rarityBoost *= bonusMultiplier;
                            
                            // Show notification
                            const bonusPercent = Math.round((bonusMultiplier - 1) * 100);
                            showNotification(`Countdown Bonus activated! ${bonusPercent}% boost after 10 rolls!`);
                            
                            // Visual feedback
                            const display = document.getElementById('currentAuraDisplay');
                            if (display) {
                                display.classList.add('countdown-bonus');
                                setTimeout(() => display.classList.remove('countdown-bonus'), 1000);
                            }
                        }
                    } else {
                        // Show countdown progress
                        const progressPercent = Math.round(((10 - gameState.specialEffects.currentCountdown) / 10) * 100);
                        if (progressPercent % 25 === 0 && progressPercent > 0) {
                            showNotification(`Countdown progress: ${progressPercent}% to bonus!`);
                        }
                    }
                    break;
                case 'negativeAuraReroll':
                    // This effect is passive, allows rerolling negative auras
                    break;
                case 'biomeBonus':
                    // Apply biome-specific bonuses (if biome system is active)
                    if (typeof biomeState !== 'undefined' && gearEffects.biomes) {
                        if (gearEffects.biomes.includes(biomeState.currentBiome)) {
                            luckBonus += gearEffects.luckBonus / 100;
                            speedBonus += gearEffects.rollSpeedBonus / 100;
                        }
                    }
                    break;
                case 'divineBiomeBonus':
                    // Apply divine biome bonuses (if biome system is active)
                    if (typeof biomeState !== 'undefined' && gearEffects.biomes) {
                        if (gearEffects.biomes.includes(biomeState.currentBiome)) {
                            luckBonus += gearEffects.bonus / 100;
                        }
                    }
                    break;
                case 'rarityFloorIncrease':
                    // This effect modifies the aura rolling process
                    break;
                case 'rarityMultiplierBoost':
                    // This effect modifies the aura rolling process
                    break;
                case 'guaranteedHighTier':
                    // This effect would be handled during aura rolling
                    break;
                case 'bonusRollMultiplier':
                    // This effect likely modifies bonus rolls system (if present)
                    break;
                case 'bonusRollCountdown':
                    // This effect would be handled during specific roll triggers
                    break;
                case 'reverseTimeOnBad':
                    // This effect is passive, allows rerolling negative auras
                    break;
                case 'skipStacks':
                    // This effect would be handled during specific roll triggers
                    break;
                case 'exponentialLuckGrowth':
                    // Apply exponential growth from special effects
                    if (gameState.specialEffects && gameState.specialEffects.exponentialLuck) {
                        luckBonus += (gameState.specialEffects.exponentialLuck - 1);
                    }
                    break;
                case 'auraStreakBonus':
                    // This effect would be handled during aura rolling based on streaks
                    if (gameState.specialEffects && gameState.specialEffects.positiveAuraStreak >= 3) {
                        const streakBonus = Math.min(gameState.specialEffects.positiveAuraStreak, 10) * 0.1;
                        luckBonus += streakBonus;
                    }
                    break;
                case 'rollCooldownReduction':
                    // Reduces roll cooldown time
                    if (!gameState.specialEffects) gameState.specialEffects = {};
                    if (!gameState.specialEffects.rollCooldownReduction) gameState.specialEffects.rollCooldownReduction = 0;
                    gameState.specialEffects.rollCooldownReduction += (gearEffects.reduction || 0.1);
                    break;
                case 'bonusRollPointChance':
                    // Gives chance to earn bonus roll points
                    if (!gameState.specialEffects) gameState.specialEffects = {};
                    if (!gameState.specialEffects.bonusRollPointChance) gameState.specialEffects.bonusRollPointChance = 0;
                    gameState.specialEffects.bonusRollPointChance += (gearEffects.chance || 0.05);
                    break;
                case 'permanentBonusRoll':
                    // Grants permanent bonus roll charges
                    if (!gameState.specialEffects) gameState.specialEffects = {};
                    if (!gameState.specialEffects.permanentBonusRoll) gameState.specialEffects.permanentBonusRoll = 0;
                    gameState.specialEffects.permanentBonusRoll += (gearEffects.charges || 1);
                    break;
                case 'timeWarpBonus':
                    // Accelerates time-based effects
                    if (!gameState.specialEffects) gameState.specialEffects = {};
                    if (!gameState.specialEffects.timeWarpBonus) gameState.specialEffects.timeWarpBonus = 0;
                    gameState.specialEffects.timeWarpBonus += (gearEffects.acceleration || 0.2);
                    break;
                case 'coffeeCombo':
                    // Bonus when using coffee-themed auras
                    luckBonus += gearEffects.bonus / 100;
                    break;
                case 'warmthBonus':
                    // Periodic luck bonus from cozy warmth
                    if (!gameState.specialEffects) gameState.specialEffects = {};
                    if (!gameState.specialEffects.warmthBonusActive) {
                        gameState.specialEffects.warmthBonusActive = true;
                        gameState.specialEffects.warmthBonusEndTime = Date.now() + (gearEffects.duration * 1000);
                    }
                    if (gameState.specialEffects.warmthBonusActive && 
                        gameState.specialEffects.warmthBonusEndTime > Date.now()) {
                        luckBonus += gearEffects.luckBonus / 100;
                    } else if (gameState.specialEffects.warmthBonusEndTime <= Date.now()) {
                        gameState.specialEffects.warmthBonusActive = false;
                    }
                    break;
                case 'crimsonBiomeBonus':
                    // Bonus in crimson biome
                    if (typeof biomeState !== 'undefined' && biomeState.currentBiome === 'CRIMSON') {
                        luckBonus += gearEffects.crimsonBonus / 100;
                    }
                    break;
                case 'puppeteerControl':
                    // Chance to manipulate roll outcomes (handled during roll)
                    if (!gameState.specialEffects) gameState.specialEffects = {};
                    gameState.specialEffects.puppeteerControl = gearEffects.chance || 0.08;
                    break;
                case 'patternBonus':
                    // Multiplier bonus from kaleidoscope patterns
                    if (gearEffects.multiplier) {
                        luckBonus *= gearEffects.multiplier;
                    }
                    break;
                case 'mechanicalPrecision':
                    // Guaranteed rare+ every 25 rolls (handled during roll)
                    if (!gameState.specialEffects) gameState.specialEffects = {};
                    gameState.specialEffects.mechanicalPrecision = true;
                    break;
                case 'festivalBonus':
                    // Festival bonus from carnival
                    luckBonus += gearEffects.bonus / 100;
                    break;
            }
        }
    }

    // Add special effect bonuses to luck
    if (gameState.specialEffects) {
        // Biome bonuses
        if (gameState.specialEffects.biomeBonusActive && gameState.specialEffects.biomeBonus) {
            luckBonus += gameState.specialEffects.biomeBonus / 100;
        }
        if (gameState.specialEffects.divineBiomeBonusActive && gameState.specialEffects.divineBiomeBonus) {
            luckBonus += gameState.specialEffects.divineBiomeBonus / 100;
        }
        // Jackpot mini bonus
        if (gameState.specialEffects.jackpotMiniBonusActive && gameState.specialEffects.jackpotMiniBonus) {
            luckBonus += gameState.specialEffects.jackpotMiniBonus / 100;
        }
        // Gilded bonus (Midas Touch)
        if (gameState.specialEffects.gildedBonusActive && gameState.specialEffects.gildedBonus) {
            luckBonus += gameState.specialEffects.gildedBonus / 100;
        }
        // Natural attunement (Rootbinder Gauntlets)
        if (gameState.specialEffects.naturalAttunementActive && gameState.specialEffects.naturalAttunement) {
            luckBonus += gameState.specialEffects.naturalAttunement / 100;
        }
        // Solar flare (Inferno Heart Forge)
        if (gameState.specialEffects.solarFlareActive && gameState.specialEffects.solarFlare) {
            luckBonus += gameState.specialEffects.solarFlare / 100;
        }
        // Divine domain (Pantheon's Will)
        if (gameState.specialEffects.divineDomainActive && gameState.specialEffects.divineDomainBonus) {
            luckBonus += gameState.specialEffects.divineDomainBonus / 100;
        }
        // Crescendo (The Conductor's Baton)
        if (gameState.specialEffects.crescendoStack) {
            luckBonus += gameState.specialEffects.crescendoStack / 100;
        }
        // Chaos luck (Azathoth's Fidget)
        if (gameState.specialEffects.chaosLuck) {
            luckBonus += gameState.specialEffects.chaosLuck / 100;
        }
        // Rarity multiplier boost
        if (gameState.specialEffects.rarityMultiplierBoost && gameState.specialEffects.rarityMultiplierBoost > 1) {
            luckBonus *= gameState.specialEffects.rarityMultiplierBoost;
        }
        // Ethereal boost multiplier (Aetheric Weave)
        if (gameState.specialEffects.etherealBoostActive && gameState.specialEffects.etherealBoostMultiplier) {
            luckBonus *= gameState.specialEffects.etherealBoostMultiplier;
        }
        // Star death multiplier (Supernova Catalyst)
        if (gameState.specialEffects.starDeathActive) {
            luckBonus *= 2;
        }
        // Soul chain stacks (Soul Shackles)
        if (gameState.specialEffects.soulChainStacks) {
            luckBonus += (gameState.specialEffects.soulChainStacks * 5) / 100;
        }
        // Final cut bonus (Reaper's Scythe)
        if (gameState.specialEffects.finalCutActive && gameState.specialEffects.finalCutBonus) {
            luckBonus += gameState.specialEffects.finalCutBonus / 100;
        }
        // Omnipotence permanent luck (Reality Crown)
        if (gameState.specialEffects.omnipotenceLuck) {
            luckBonus += gameState.specialEffects.omnipotenceLuck / 100;
        }
    }
    
    // Debug luck percentage override
    if (gameState.debug && typeof gameState.debug.luckPercentage === 'number') {
        luckBonus += gameState.debug.luckPercentage / 100;
    }

    gameState.luckBonus = baseLuck + luckBonus;
    gameState.currentLuck = baseLuck + luckBonus; // CRITICAL FIX: Actually apply the luck bonus!
    
    // Apply titan strength floor (Atlas Gauntlets)
    if (gameState.equipped && Object.values(gameState.equipped).some(gear => 
        gear && gearData[gear]?.effects?.special === 'titanStrength')) {
        if (gameState.currentLuck < 5) { // 500% = 5.0 multiplier
            gameState.currentLuck = 5;
        }
    }
    
    // Apply luck multiplier after calculating base luck (for Darkshader special2 effect)
    if (gameState.specialEffects && gameState.specialEffects.luckMultiplierActive && gameState.specialEffects.luckMultiplierValue) {
        gameState.currentLuck *= gameState.specialEffects.luckMultiplierValue;
    }
    
    // Prevent overflow by capping luck at a reasonable maximum (999M%)
    // This prevents JavaScript number precision issues with very large numbers
    const maxLuckPercent = 999000000; // 999 million percent
    if (gameState.currentLuck * 100 > maxLuckPercent) {
        gameState.currentLuck = maxLuckPercent / 100; // Cap at 999M% (9.99M base luck)
    }

    // --- FIX ENDS HERE ---


    // Speed calculations remain the same
    for (const effect of gameState.activeEffects) {
        if (effect.speedBoost) {
            speedBonus += effect.speedBoost;
        }
    }
    for (let slot in gameState.equipped) {
        const gearName = gameState.equipped[slot];
        if (gearName && gearData[gearName]?.effects?.rollSpeed) {
            speedBonus += gearData[gearName].effects.rollSpeed / 100;
        }
    }
    
    gameState.currentSpeed = 1 + speedBonus; // CRITICAL FIX: Actually apply the speed bonus!
    
    // Apply special effect speed bonuses
    if (gameState.specialEffects) {
        // Tailwind (Gale Weavers) - 50% faster on 10th roll
        if (gameState.specialEffects.tailwindActive) {
            speedBonus += 0.5;
            gameState.specialEffects.tailwindActive = false;
        }
        // Soul tax (The Reaper's Toll) - 20% faster for 5 rolls
        if (gameState.specialEffects.soulTaxActive) {
            speedBonus += 0.2;
        }
        // Crescendo (The Conductor's Baton)
        if (gameState.specialEffects.crescendoStack) {
            speedBonus += gameState.specialEffects.crescendoStack / 100;
        }
        // Chaos speed (Azathoth's Fidget)
        if (gameState.specialEffects.chaosSpeed) {
            speedBonus = (gameState.specialEffects.chaosSpeed - 100) / 100;
        }
        // Star death (Supernova Catalyst) - double speed
        if (gameState.specialEffects.starDeathActive) {
            speedBonus *= 2;
        }
    }
    
    gameState.currentSpeed = 1.0 + speedBonus;
    
    // updateUI is now called at the end to reflect the new stats
    updateUI(); 
}

// Function to update roll counter
function updateRollCounter() {
    const rollCounter = document.getElementById('rollCounter');
    if (rollCounter) {
        // Check if bonus roll is active
        const hasBonusRoll = gameState.specialEffects && gameState.specialEffects.bonusRollMultiplier !== undefined;
        const hasGeneralBonusRoll = gameState.specialEffects && gameState.specialEffects.generalBonusRollMultiplier !== undefined;
        const justAppliedGeneralBonus = gameState.specialEffects && gameState.specialEffects.justAppliedGeneralBonus === true;
        
        // Check if we have bonusRollCountdown active (Darkshader)
        if (gameState.specialEffects && gameState.specialEffects.bonusRollCountdown !== undefined) {
            const countdownValue = gameState.specialEffects.bonusRollCountdown || 0;
            if (countdownValue > 0) {
                rollCounter.textContent = `Roll: ${countdownValue}/5`;
                rollCounter.style.color = hasBonusRoll || hasGeneralBonusRoll || justAppliedGeneralBonus ? '#FFD700' : ''; // Gold color for bonus roll
                return;
            }
        }
        
        // If we have Gravitational Device, show progress to next bonus roll
        if (gameState.specialEffects && gameState.specialEffects.bonusRollMultiplierRollCount !== undefined) {
            const bonusRollProgress = gameState.specialEffects.bonusRollMultiplierRollCount || 0;
            const displayValue = bonusRollProgress === 0 ? 10 : bonusRollProgress;
            
            if (hasBonusRoll) {
                const multiplier = gameState.specialEffects.bonusRollMultiplier;
                rollCounter.textContent = `Roll: ${displayValue}/10 (${multiplier}x BONUS!)`;
                rollCounter.style.color = '#FFD700'; // Gold color
            } else if (hasGeneralBonusRoll || justAppliedGeneralBonus) {
                const multiplier = hasGeneralBonusRoll ? gameState.specialEffects.generalBonusRollMultiplier : 2;
                rollCounter.textContent = `Roll: ${displayValue}/10 (${multiplier}x LUCK!)`;
                rollCounter.style.color = '#FFD700'; // Gold color
            } else {
                rollCounter.textContent = `Roll: ${displayValue}/10`;
                rollCounter.style.color = ''; // Reset color
            }
            return;
        }
        
        // Default roll counter - show 10/10 instead of 0/10
        const displayValue = gameState.currentRollCount === 0 ? 10 : gameState.currentRollCount;
        
        if (hasBonusRoll) {
            const multiplier = gameState.specialEffects.bonusRollMultiplier;
            rollCounter.textContent = `Roll: ${displayValue}/10 (${multiplier}x BONUS!)`;
            rollCounter.style.color = '#FFD700'; // Gold color
        } else if (hasGeneralBonusRoll || justAppliedGeneralBonus) {
            const multiplier = hasGeneralBonusRoll ? gameState.specialEffects.generalBonusRollMultiplier : 2;
            rollCounter.textContent = `Roll: ${displayValue}/10 (${multiplier}x LUCK!)`;
            rollCounter.style.color = '#FFD700'; // Gold color
        } else {
            rollCounter.textContent = `Roll: ${displayValue}/10`;
            rollCounter.style.color = ''; // Reset color
        }
    }
}

function updateUI() {
    const totalRollsEl = document.getElementById('totalRolls');
    const luckEl = document.getElementById('currentLuck');
    const speedEl = document.getElementById('rollSpeed');
    
    if (totalRollsEl) totalRollsEl.textContent = gameState.totalRolls.toLocaleString();
    if (luckEl) luckEl.textContent = `${gameState.currentLuck.toFixed(1)}x`;
    if (speedEl) speedEl.textContent = `${Math.floor(gameState.currentSpeed * 100)}%`;
    
    // Update roll counter
    updateRollCounter();
    
    // Update currency displays
    updateCurrencyDisplay();
}

function updateCurrencyDisplay() {
    const money = gameState.currency?.money || 0;
    const voidCoins = gameState.currency?.voidCoins || 0;
    const darkPoints = gameState.currency?.darkPoints || 0;
    const halloweenMedals = gameState.currency?.halloweenMedals || 0;
    
    const moneyEl = document.getElementById('moneyDisplay');
    const voidEl = document.getElementById('voidCoinsDisplay');
    const darkEl = document.getElementById('darkPointsDisplay');
    const halloweenEl = document.getElementById('halloweenMedalsDisplay');
    
    if (moneyEl) animateNumber(moneyEl, money);
    if (voidEl) animateNumber(voidEl, voidCoins);
    if (darkEl) animateNumber(darkEl, darkPoints);
    if (halloweenEl) animateNumber(halloweenEl, halloweenMedals);
}

function animateNumber(element, newValue) {
    const oldValue = parseInt(element.textContent.replace(/,/g, ''), 10) || 0;
    if (oldValue === newValue) return;
    
    const duration = 500;
    const steps = 20;
    const stepValue = (newValue - oldValue) / steps;
    let currentStep = 0;
    
    const interval = setInterval(() => {
        currentStep++;
        const currentValue = Math.floor(oldValue + (stepValue * currentStep));
        element.textContent = currentValue.toLocaleString();
        
        if (currentStep >= steps) {
            element.textContent = newValue.toLocaleString();
            clearInterval(interval);
        }
    }, duration / steps);
}

function updateActiveEffects() {
    const effectsList = document.getElementById('effectsList');
    const allEffects = [];
    
    // Group one-roll effects by name to show count
    const oneRollEffects = gameState.activeEffects.filter(e => e.oneRoll);
    const oneRollCounts = {};
    oneRollEffects.forEach(effect => {
        oneRollCounts[effect.name] = (oneRollCounts[effect.name] || 0) + 1;
    });
    
    // Add grouped one-roll effects
    Object.entries(oneRollCounts).forEach(([name, count]) => {
        // Check if this one-roll potion has a duration (for display purposes)
        const recipe = typeof POTION_RECIPES !== 'undefined' ? POTION_RECIPES.find(r => r.name === name) : null;
        const hasDuration = recipe?.duration && recipe.duration > 0;
        let timeText = count > 1 ? `Next ${count} Rolls` : 'Next Roll';
        if (hasDuration && recipe.duration <= 10) {
            timeText += ' (Instant)';
        }
        allEffects.push({
            name: name,
            timeText: timeText,
            type: 'potion'
        });
    });
    
    // Add other effects (non-oneRoll)
    allEffects.push(...gameState.activeEffects.filter(e => !e.oneRoll).map(effect => {
        let timeText = '';
        if (effect.rollCount) {
            timeText = `${effect.rollsLeft} rolls left`;
        } else if (effect.insightMode && effect.insightCount !== undefined) {
            timeText = `${effect.insightCount} insights left`;
        } else if (effect.momentumMode) {
            timeText = `Stack: ${effect.momentumStack || 0}/10`;
        } else if (effect.varietyMode && effect.varietyRolls) {
            timeText = `${effect.varietyRolls.length}/5 different`;
        } else if (effect.endTime) {
            const remaining = Math.max(0, effect.endTime - Date.now());
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000).toString().padStart(2, '0');
            timeText = `${minutes}m ${seconds}s`;
        }
        const type = effect.type === 'rune' ? 'rune' : 'potion';
        return { name: effect.name, timeText: timeText, type: type };
    }));
    
    ['right', 'left'].forEach(slot => {
        const gearName = gameState.equipped[slot];
        if (gearName) {
            const gearInfo = gearData[gearName];
            if (gearInfo?.effects) {
                const effects = [];
                if (gearInfo.effects.luck) effects.push(`+${gearInfo.effects.luck}% Luck`);
                if (gearInfo.effects.rollSpeed) effects.push(`${gearInfo.effects.rollSpeed > 0 ? '+' : ''}${gearInfo.effects.rollSpeed}% RS`);
                if (gearInfo.effects.special) effects.push(`Special`);
                allEffects.push({
                    name: `🛡️ ${gearName} (${effects.join(', ')})`,
                    timeText: `Equipped (${slot})`,
                    type: 'gear'
                });
            }
        }
    });
    
    if (allEffects.length === 0) {
        effectsList.innerHTML = `<div style="opacity: 0.6;">No active effects</div>`;
        return;
    }
    
    effectsList.innerHTML = allEffects.map(effect => 
        `<div class="effect-item ${effect.type}"><span class="effect-name">${effect.name}</span><span class="effect-time">${effect.timeText}</span></div>`
    ).join('');
}

setInterval(() => {
    const initialEffectCount = gameState.activeEffects.length;
    const hadEfficiency = gameState.activeEffects.some(e => e.efficiencyMode);
    const hadCooldownRemoval = gameState.activeEffects.some(e => e.removeCooldown);
    
    gameState.activeEffects = gameState.activeEffects.filter(effect => effect.endTime ? effect.endTime >= Date.now() : true);
    
    // Clear efficiency flags if the efficiency effect expired
    if (hadEfficiency && !gameState.activeEffects.some(e => e.efficiencyMode)) {
        gameState.specialEffects.efficiencyActive = false;
        gameState.specialEffects.materialSaveChance = 0;
        showNotification('⚡ Potion of Efficiency expired', 'info');
    }
    
    // Restore normal cooldown if removeCooldown potion expired
    if (hadCooldownRemoval && !gameState.activeEffects.some(e => e.removeCooldown)) {
        if (gameState.autoRoll && gameState.autoRoll.active && autoRollWorker) {
            const baseDelay = gameState.autoRoll.delay || 600;
            const normalDelay = Math.max(50, baseDelay / gameState.currentSpeed);
            console.log('⏱️ Restoring normal autoroll cooldown:', normalDelay, 'ms');
            autoRollWorker.postMessage({
                type: 'updateDelay',
                delay: normalDelay
            });
        }
    }
    
    if (initialEffectCount !== gameState.activeEffects.length) {
        recalculateStats();
    }
    updateActiveEffects();
}, 1000);

// Debounce timer for recipe list updates
let recipeListUpdateTimer = null;

function updateInventoryDisplay(skipRecipeUpdate = false) {
    updatePotionsInventory();
    updateItemsInventory();
    updateRunesInventory();
    updateGearsInventory();
    updateAurasInventory();
    updateAchievementsInventory();
    
    // Only update recipes if not skipped
    if (!skipRecipeUpdate) {
        // Use efficient count update if list is built, otherwise do full build
        if (typeof updateRecipeCounts === 'function') {
            // Debounce during auto-roll for performance
            if (gameState.autoRoll?.active) {
                if (recipeListUpdateTimer) clearTimeout(recipeListUpdateTimer);
                recipeListUpdateTimer = setTimeout(() => {
                    updateRecipeCounts();
                }, 200); // 200ms delay during auto-roll
            } else {
                // Instant update when not auto-rolling
                updateRecipeCounts();
            }
        } else if (typeof updateRecipesList === 'function') {
            // Fallback if new function not available
            updateRecipesList();
        }
    }
}

// Helper to check if element is visible
function isElementVisible(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
}

function getPotionCategory(recipe) {
    if (!recipe) return '';
    const name = recipe.name.toLowerCase();
    if (name.includes('pump king') || name.includes('halloween') || name.includes('blood')) return 'potion-ultimate';
    if (name.includes('godlike') || name.includes('godly')) return 'potion-godly';
    if (name.includes('forbidden')) return 'potion-forbidden';
    if (name.includes('ultimate') || name.includes('heavenly') || name.includes('oblivion') || name.includes('bound')) return 'potion-ultimate';
    if (name.includes('chaos') || name.includes('mirror') || name.includes('quantum') || name.includes('phoenix') || name.includes('jackpot')) return 'potion-special';
    if (name.includes('fortune') || name.includes('haste') || name.includes('mixed') || name.includes('gladiator')) return 'potion-advanced';
    return 'potion-basic';
}

function updatePotionsInventory() {
    const container = document.getElementById('potionsInventory');
    if (!container) return;
    const potions = gameState.inventory.potions || {};
    if (Object.keys(potions).length === 0) {
        container.innerHTML = '<div class="empty-inventory">No potions available. Roll to find potions!</div>';
        return;
    }
    container.innerHTML = Object.entries(potions).map(([name, data]) => {
        const recipe = typeof POTION_RECIPES !== 'undefined' ? POTION_RECIPES.find(r => r.name === name) : null;
        const isUsable = recipe && (
            recipe.luckBoost !== undefined || 
            recipe.speedBoost !== undefined ||
            recipe.chaosMode !== undefined ||
            recipe.mirrorChance !== undefined ||
            recipe.cooldownReduction !== undefined ||
            recipe.phoenixMode !== undefined ||
            recipe.bonusSpawnChance !== undefined ||
            recipe.legendaryOnly !== undefined ||
            recipe.quantumChance !== undefined ||
            recipe.curseImmunity !== undefined ||
            recipe.jackpotMode !== undefined ||
            recipe.guaranteeRarity !== undefined ||
            recipe.oneRoll !== undefined ||
            recipe.rollCount !== undefined ||
            recipe.negatesBuffs !== undefined ||
            recipe.dupeChance !== undefined ||
            // NEW POTION MODES
            recipe.clarityMode !== undefined ||
            recipe.hindsightMode !== undefined ||
            recipe.patienceMode !== undefined ||
            recipe.momentumMode !== undefined ||
            recipe.focusTier !== undefined ||
            recipe.gamblerMode !== undefined ||
            recipe.extremesMode !== undefined ||
            recipe.allOrNothingMode !== undefined ||
            recipe.sacrificeMode !== undefined ||
            recipe.hourMode !== undefined ||
            recipe.adaptationMode !== undefined ||
            recipe.explorationMode !== undefined ||
            recipe.nightMode !== undefined ||
            recipe.dayMode !== undefined ||
            recipe.consistencyMode !== undefined ||
            recipe.varietyMode !== undefined ||
            recipe.breakthroughMode !== undefined ||
            recipe.conservationMode !== undefined ||
            recipe.insightMode !== undefined ||
            recipe.collectorMode !== undefined ||
            recipe.beginnerMode !== undefined ||
            recipe.masteryMode !== undefined ||
            recipe.voidheartMode !== undefined
        );
        
        const categoryClass = getPotionCategory(recipe);
        const effectDescription = recipe?.effect || 'No description available';
        const durationText = recipe?.duration ? ` (${Math.floor(recipe.duration / 60)}m ${recipe.duration % 60}s)` : '';
        
        // Check if Potion of the Beginner is disabled (100+ rolls)
        const isBeginnerDisabled = recipe?.beginnerMode && gameState.totalRolls >= 100;
        
        // Check if night/day potions are disabled (wrong time)
        const isNightDisabled = recipe?.nightMode && gameState.timeOfDay !== 'night';
        const isDayDisabled = recipe?.dayMode && gameState.timeOfDay !== 'day';
        
        const disabledText = isBeginnerDisabled ? ' [DISABLED - Requires <100 rolls]' : 
                            isNightDisabled ? ' [NIGHTTIME ONLY]' :
                            isDayDisabled ? ' [DAYTIME ONLY]' : '';
        const disabledClass = (isBeginnerDisabled || isNightDisabled || isDayDisabled) ? ' potion-disabled' : '';
        
        const usageText = isBeginnerDisabled ? 'DISABLED: Only works with less than 100 total rolls' : 
                         isNightDisabled ? 'DISABLED: Only usable during nighttime' :
                         isDayDisabled ? 'DISABLED: Only usable during daytime' :
                         isUsable ? 'Click: Use 1 | Shift+Click: Use 10 | Ctrl+Click: Use All' : 'Not usable';
        const tooltip = `${usageText}\n\n${effectDescription}${durationText}`;
        
        // Check if this potion is selected in bulk mode
        const isSelected = gameState.bulkMode.selectedPotions.includes(name);
        const selectionClass = isSelected ? ' potion-selected' : '';
        
        const clickHandler = (isUsable && !isBeginnerDisabled && !isNightDisabled && !isDayDisabled) ? `onclick="usePotionPrompt('${name}', event)"` : '';
        const rightClickHandler = `oncontextmenu="openSellPotionModal('${name}', event); return false;"`;
        
        // No special styling in inventory - keep it clean and simple
        return `<div class="inventory-item ${categoryClass}${selectionClass}${disabledClass}" ${clickHandler} ${rightClickHandler} title="${tooltip}\n\nRight-click to sell"><div class="inventory-item-icon">⚗️</div><div class="inventory-item-name">${name}${disabledText}</div><div class="inventory-item-count">x${data.count}</div></div>`;
    }).join('');
}

function usePotionPrompt(name, event) {
    const count = gameState.inventory.potions[name]?.count || 0;
    if (!count) return;
    
    // Check if bulk mode is active
    if (gameState.bulkMode.active) {
        // In bulk mode, toggle selection instead of using the potion
        togglePotionSelection(name);
        return;
    }
    
    // Normal behavior when bulk mode is off
    if (event.shiftKey) usePotion(name, Math.min(10, count));
    else if (event.ctrlKey) usePotion(name, count);
    else usePotion(name, 1);
}

// Sell Potion Functions
window.openSellPotionModal = function(potionName, event) {
    if (event) event.preventDefault();
    
    const potionData = gameState.inventory.potions[potionName];
    if (!potionData) return;
    
    // Calculate sell price based on potion tier/complexity
    const potionPrices = {
        // Base potions
        'Lucky Potion': 10,
        'Speed Potion': 10,
        
        // L tier
        'Lucky Potion L': 25,
        'Speed Potion L': 25,
        'Lucky Potion XL': 50,
        'Speed Potion XL': 50,
        
        // Fortune/Haste series
        'Fortune Potion I': 100,
        'Fortune Potion II': 250,
        'Fortune Potion III': 500,
        'Haste Potion I': 100,
        'Haste Potion II': 250,
        'Haste Potion III': 500,
        
        // Mixed/Combo
        'Mixed Potion': 40,
        'Gladiator Potion': 150,
        'Jewelry Potion': 300,
        'Zombie Potion': 350,
        'Rage Potion': 200,
        'Diver Potion': 250,
        
        // Rainbow/Chaos
        'Rainbow Potion': 400,
        'Chaos Potion': 600,
        
        // Forbidden series
        'Forbidden Potion I': 500,
        'Forbidden Potion II': 2000,
        'Forbidden Potion III': 8000,
        
        // Godly series
        'Godly Potion (Zeus)': 5000,
        'Godly Potion (Poseidon)': 5000,
        'Godly Potion (Hades)': 5000,
        
        // One-roll potions
        'Potion of Bound': 10000,
        'Heavenly Potion': 30000,
        'Godlike Potion': 100000,
        'Oblivion Potion': 150000,
        
        // Special potions
        'Warp Potion': 50000,
        'Transcendent Potion': 500000,
        'Phoenix Potion': 800,
        'Mirror Potion': 1000,
        'Quantum Potion': 1200,
        'Breakthrough Catalyst': 300,
        'Time Warp Potion': 2000,
        
        // Unique potions
        'Potion of Clarity': 5000,
        'Potion of Hindsight': 8000,
        'Pump Kings Blood': 25000,
        'All-or-Nothing Brew': 3000,
        'Gambler\'s Elixir': 4000,
        'Aura Magnet Potion': 1500,
        'Curse Breaker Potion': 2500,
        'Potion of Sacrifice': 3500,
        'Potion of the Hour': 5000,
        'Potion of Momentum': 600,
        'Potion of Adaptation': 1000,
        'Potion of Exploration': 1200,
        'Nightowl\'s Brew': 800,
        'Potion of Consistency': 1500,
        'Potion of Variety': 1500,
        'Potion of Patience': 1000,
        'Potion of Extremes': 2000,
        'Potion of Dupe': 3000,
        'Potion of Bound': 10000,
        'Potion of Focus (Legendary)': 800,
        'Potion of Focus (Mythic)': 2000,
        'Lucky Block Potion': 1500,
        'Potion of the Beginner': 200,
        'Potion of Mastery': 3000,
        'Voidheart': 200000
    };
    
    const sellPrice = potionPrices[potionName] || 50;
    
    const modal = document.createElement('div');
    modal.id = 'sellPotionModal';
    modal.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); 
                    padding: 30px; 
                    border-radius: 15px; 
                    border: 2px solid #fbbf24;
                    max-width: 400px;
                    box-shadow: 0 0 50px rgba(251, 191, 36, 0.3);">
            <h3 style="color: #fbbf24; margin-bottom: 20px; text-align: center; font-size: 24px;">
                💰 Sell Potion
            </h3>
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 18px; color: white; margin-bottom: 10px;">
                    ${potionName}
                </div>
                <div style="color: #fbbf24; font-size: 20px; font-weight: bold;">
                    ${sellPrice.toLocaleString()} coins per potion
                </div>
                <div style="color: #94a3b8; font-size: 14px; margin-top: 5px;">
                    You have: ${potionData.count}
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                <label style="color: white; display: block; margin-bottom: 10px;">Amount to sell:</label>
                <input type="number" id="sellPotionAmount" 
                       value="1" 
                       min="1" 
                       max="${potionData.count}"
                       style="width: 100%; 
                              padding: 10px; 
                              border: 2px solid #fbbf24; 
                              border-radius: 8px; 
                              background: #0f172a;
                              color: white;
                              font-size: 16px;
                              text-align: center;">
            </div>
            <div style="text-align: center; margin-bottom: 20px; padding: 15px; background: rgba(251, 191, 36, 0.1); border-radius: 8px;">
                <div style="color: #94a3b8; font-size: 14px;">Total:</div>
                <div id="sellPotionTotal" style="color: #fbbf24; font-size: 24px; font-weight: bold;">
                    ${sellPrice.toLocaleString()} 💰
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="closeSellPotionModal()" 
                        style="flex: 1;
                               padding: 12px;
                               background: #dc2626;
                               color: white;
                               border: none;
                               border-radius: 8px;
                               cursor: pointer;
                               font-size: 16px;
                               font-weight: bold;">
                    Cancel
                </button>
                <button onclick="confirmSellPotion('${potionName}', ${sellPrice})" 
                        style="flex: 1;
                               padding: 12px;
                               background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                               color: #000;
                               border: none;
                               border-radius: 8px;
                               cursor: pointer;
                               font-size: 16px;
                               font-weight: bold;">
                    Sell
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Update total when amount changes
    const amountInput = document.getElementById('sellPotionAmount');
    const totalDisplay = document.getElementById('sellPotionTotal');
    amountInput.addEventListener('input', () => {
        const amount = parseInt(amountInput.value) || 1;
        const total = amount * sellPrice;
        totalDisplay.textContent = total.toLocaleString() + ' 💰';
    });
};

window.closeSellPotionModal = function() {
    const modal = document.getElementById('sellPotionModal');
    if (modal) modal.remove();
};

window.confirmSellPotion = function(potionName, pricePerPotion) {
    const amount = parseInt(document.getElementById('sellPotionAmount').value) || 1;
    const potionData = gameState.inventory.potions[potionName];
    
    if (!potionData || amount < 1) {
        closeSellPotionModal();
        return;
    }
    
    // Clamp to available count
    const sellCount = Math.min(amount, potionData.count);
    const totalMoney = pricePerPotion * sellCount;
    
    // Update inventory
    potionData.count -= sellCount;
    
    if (potionData.count <= 0) {
        delete gameState.inventory.potions[potionName];
    }
    
    // Anti-cheat: Mark this as a legitimate transaction
    if (window.anomalyDetector) {
        window.anomalyDetector.markLegitimateTransaction();
    }
    
    // Give money
    gameState.currency.money = (gameState.currency.money || 0) + totalMoney;
    
    // Track currency change
    if (typeof trackCurrencyChange === 'function') {
        trackCurrencyChange('money', totalMoney, true);
    }
    
    // Save and update UI
    saveGameState();
    updatePotionsInventory();
    updateUI();
    
    // Show notification
    showNotification(`💰 Sold ${sellCount}x ${potionName} for ${totalMoney.toLocaleString()} coins!`, 'success');
    
    closeSellPotionModal();
};

function updateItemsInventory() {
    const container = document.getElementById('itemsInventory');
    const items = gameState.inventory.items;
    
    // Filter out Random Rune Chest from display
    const filteredItems = Object.entries(items).filter(([name]) => name !== 'Random Rune Chest');
    
    if (filteredItems.length === 0) { container.innerHTML = '<div class="inv-empty-message">No items</div>'; return; }
    container.innerHTML = filteredItems.map(([name, data]) => {
        // Check if this is a usable item
        const isStrangeController = name === 'Strange Controller';
        const isBiomeRandomizer = name === 'Biome Randomizer';
        const isUsable = isStrangeController || isBiomeRandomizer;
        
        let clickHandler = '';
        let tooltip = '';
        let cursorStyle = isUsable ? 'cursor: pointer;' : '';
        let extraStyle = '';
        
        if (isStrangeController) {
            const cooldownEnd = gameState.itemCooldowns?.['Strange Controller'] || 0;
            const isOnCooldown = Date.now() < cooldownEnd;
            const remainingTime = isOnCooldown ? Math.ceil((cooldownEnd - Date.now()) / 1000 / 60) : 0;
            
            clickHandler = isOnCooldown ? '' : `onclick="useStrangeController()"`;
            tooltip = isOnCooldown ? 
                `title="On cooldown: ${remainingTime} minute(s) remaining"` : 
                'title="Click to change biome based on rarity (15 min cooldown)"';
            cursorStyle = isOnCooldown ? 'cursor: not-allowed; opacity: 0.5;' : 'cursor: pointer;';
        } else if (isBiomeRandomizer) {
            const cooldownEnd = gameState.itemCooldowns?.['Biome Randomizer'] || 0;
            const isOnCooldown = Date.now() < cooldownEnd;
            const remainingTime = isOnCooldown ? Math.ceil((cooldownEnd - Date.now()) / 1000 / 60) : 0;
            
            clickHandler = isOnCooldown ? '' : `onclick="useBiomeRandomizer()"`;
            tooltip = isOnCooldown ? 
                `title="On cooldown: ${remainingTime} minute(s) remaining"` : 
                'title="Click to change to a completely random biome (30 min cooldown)"';
            cursorStyle = isOnCooldown ? 'cursor: not-allowed; opacity: 0.5;' : 'cursor: pointer;';
        }
        
        // Add rainbow styling for Rainbow Syrup
        const isRainbow = name === 'Rainbow Syrup';
        const rainbowStyle = isRainbow ? 'background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold;' : '';
        
        return `<div class="inventory-item" ${clickHandler} ${tooltip} style="${cursorStyle} ${extraStyle}">
            <div class="inventory-item-icon">${data.icon || '❓'}</div>
            <div class="inventory-item-name" style="${rainbowStyle}">${name}</div>
            <div class="inventory-item-count">x${data.count}</div>
        </div>`;
    }).join('');
}

function updateRunesInventory() {
    const container = document.getElementById('runesInventory');
    if (!container) {
        console.warn('Runes inventory container not found!');
        return;
    }
    
    // Ensure runes object exists
    if (!gameState.inventory.runes) {
        gameState.inventory.runes = {};
    }
    
    const runes = gameState.inventory.runes;
    // Removed console.log - was causing FPS drops during auto-roll
    // console.log('Updating runes inventory. Current runes:', runes);
    
    if (Object.keys(runes).length === 0) {
        container.innerHTML = '<div class="empty-inventory">No runes available. Complete achievements or find Random Rune Chests!</div>';
        return;
    }
    
    container.innerHTML = Object.entries(runes).map(([name, data]) => {
        const runeData = typeof RUNES_DATA !== 'undefined' ? RUNES_DATA.find(r => r.name === name) : null;
        const icon = runeData ? runeData.icon : '🔮';
        const color = runeData ? runeData.color : '#888';
        const isHalloween = runeData ? runeData.isHalloween : false;
        const isSpecial = runeData ? runeData.isSpecial : false;
        const tooltip = 'Click: Use 1 | Shift+Click: Use 10 | Ctrl+Click: Use All';
        
        // Special styling for Halloween and special runes
        let borderStyle = `border-color: ${color};`;
        let extraStyle = '';
        
        if (isHalloween) {
            borderStyle = `border: 3px solid ${color}; box-shadow: 0 0 15px ${color}, inset 0 0 10px rgba(255,140,0,0.2);`;
            extraStyle = `animation: pulse 2s ease-in-out infinite;`;
        } else if (isSpecial) {
            borderStyle = `border: 3px solid ${color}; box-shadow: 0 0 20px ${color}, inset 0 0 15px rgba(236,72,153,0.3);`;
            extraStyle = `animation: rainbow-border 3s linear infinite;`;
        }
        
        return `<div class="inventory-item rune-item" onclick="useRunePrompt('${name}', event)" title="${tooltip}" style="${borderStyle} ${extraStyle}">
            <div class="inventory-item-icon" style="font-size: 32px;">${icon}</div>
            <div class="inventory-item-name" style="color: ${color};">${name}</div>
            <div class="inventory-item-count">x${data.count}</div>
        </div>`;
    }).join('');
}

function updateGearsInventory() {
    const container = document.getElementById('gearsInventory');
    const gears = gameState.inventory.gears;
    if (Object.keys(gears).length === 0) { 
        container.innerHTML = '<div class="empty-state">No gears crafted</div>'; 
        return; 
    }
    
    container.innerHTML = Object.entries(gears).map(([name, data]) => {
        const gearInfo = gearData[name];
        const description = gearInfo ? gearInfo.description : '';
        const hand = gearInfo && gearInfo.hand ? gearInfo.hand : 'right';
        const effects = getGearEffectsText(gearInfo);
        const handIcon = hand === 'right' ? '🤚' : hand === 'left' ? '🖐️' : '💍';
        
        return `
            <div class="gear-card">
                <div class="gear-card-header">
                    <div class="gear-card-icon">${handIcon}</div>
                    <div class="gear-card-info">
                        <div class="gear-card-name">${name}</div>
                        <div class="gear-card-tier">Tier ${data.tier}</div>
                    </div>
                    <div class="gear-card-count">x${data.count}</div>
                </div>
                <div class="gear-card-effects">${effects || 'No special effects'}</div>
                <div class="gear-card-description">${description}</div>
                <button class="gear-equip-btn" onclick="equipGear('${name}', '${hand}')">
                    ⚔️ Equip to ${hand === 'right' ? 'Right Hand' : hand === 'left' ? 'Left Hand' : 'Accessory'}
                </button>
            </div>
        `;
    }).join('');
}

function updateAurasInventory() {
    const container = document.getElementById('aurasInventory');
    const auras = gameState.inventory.auras;
    if (Object.keys(auras).length === 0) { container.innerHTML = '<div class="inv-empty-message" style="grid-column: 1 / -1;">No auras rolled</div>'; return; }
    
    // Sort by BASE rarity from AURAS array (highest to lowest)
    const sortedAuras = Object.entries(auras).sort((a, b) => {
        const auraA = AURAS.find(aura => aura.name === a[0]);
        const auraB = AURAS.find(aura => aura.name === b[0]);
        const rarityA = auraA ? auraA.rarity : a[1].rarity;
        const rarityB = auraB ? auraB.rarity : b[1].rarity;
        return rarityB - rarityA; // Descending order (highest rarity first)
    });
    
    container.innerHTML = sortedAuras.map(([name, data]) => {
        const auraFont = getAuraFont(name);
        const auraColor = getAuraColor(name);
        
        // Get the base rarity from AURAS array, not the stored effective rarity
        const baseAura = AURAS.find(a => a.name === name);
        const displayRarity = baseAura ? baseAura.rarity : data.rarity;
        
        // Create compact aura item with tooltip for breakthrough info
        const breakthroughIndicator = data.lastWasBreakthrough ? ' ⚡' : '';
        
        return `<div class="aura-item" title="${data.lastWasBreakthrough ? 'Breakthrough obtained!' : ''}">
            <div class="aura-item-name" style="font-family: ${auraFont}; color: ${auraColor};">${name}${breakthroughIndicator}</div>
            <div class="aura-item-rarity">1 in ${displayRarity.toLocaleString()} • x${data.count}</div>
            <button class="aura-delete-btn" onclick="deleteAuraPrompt('${name.replace(/'/g, "\\'")}')">🗑️</button>
        </div>`;
    }).join('');
}

// Delete aura functionality
function deleteAuraPrompt(auraName) {
    const auraData = gameState.inventory.auras[auraName];
    if (!auraData) return;
    
    const baseAura = AURAS.find(a => a.name === auraName);
    const tier = auraData.tier || (baseAura ? baseAura.tier : 'unknown');
    const auraColor = getAuraColor(auraName);
    
    // Create modal
    const modalHTML = `
        <div class="modal-overlay" id="deleteAuraModal" onclick="closeDeleteAuraModal()">
            <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 400px;">
                <div class="modal-header">
                    <h2>🗑️ Delete Aura</h2>
                    <button class="close-modal-btn" onclick="closeDeleteAuraModal()">✕</button>
                </div>
                <div class="modal-body">
                    <p style="text-align: center; margin-bottom: 20px;">
                        <span style="color: ${auraColor}; font-weight: bold; font-size: 1.2em;">${auraName}</span><br>
                        <span style="color: #888;">Tier: ${tier.toUpperCase()}</span><br>
                        <span style="color: #888;">Owned: ${auraData.count}x</span>
                    </p>
                    
                    <div style="margin-bottom: 20px;">
                        <label for="deleteAmount" style="display: block; margin-bottom: 8px;">Delete how many?</label>
                        <input type="number" id="deleteAmount" min="1" max="${auraData.count}" value="1" 
                               style="width: 100%; padding: 8px; border: 1px solid #444; background: rgba(0,0,0,0.3); color: white; border-radius: 4px;">
                        <div style="margin-top: 8px; display: flex; gap: 5px;">
                            <button onclick="document.getElementById('deleteAmount').value = 1" 
                                    style="flex: 1; padding: 4px; background: rgba(100,100,100,0.3); border: 1px solid #555; color: white; cursor: pointer; border-radius: 4px;">1</button>
                            <button onclick="document.getElementById('deleteAmount').value = 10" 
                                    style="flex: 1; padding: 4px; background: rgba(100,100,100,0.3); border: 1px solid #555; color: white; cursor: pointer; border-radius: 4px;">10</button>
                            <button onclick="document.getElementById('deleteAmount').value = 100" 
                                    style="flex: 1; padding: 4px; background: rgba(100,100,100,0.3); border: 1px solid #555; color: white; cursor: pointer; border-radius: 4px;">100</button>
                            <button onclick="document.getElementById('deleteAmount').value = ${auraData.count}" 
                                    style="flex: 1; padding: 4px; background: rgba(100,100,100,0.3); border: 1px solid #555; color: white; cursor: pointer; border-radius: 4px;">All</button>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button onclick="closeDeleteAuraModal()" 
                                style="flex: 1; padding: 10px; background: rgba(100,100,100,0.5); border: 1px solid #666; color: white; cursor: pointer; border-radius: 4px;">
                            Cancel
                        </button>
                        <button onclick="confirmDeleteAura('${auraName.replace(/'/g, "\\'")}')" 
                                style="flex: 1; padding: 10px; background: rgba(200,50,50,0.7); border: 1px solid #f00; color: white; cursor: pointer; border-radius: 4px; font-weight: bold;">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add to DOM
    const existingModal = document.getElementById('deleteAuraModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Focus on input
    setTimeout(() => {
        const input = document.getElementById('deleteAmount');
        if (input) input.focus();
    }, 100);
}

function closeDeleteAuraModal() {
    const modal = document.getElementById('deleteAuraModal');
    if (modal) modal.remove();
}

function confirmDeleteAura(auraName) {
    const amount = parseInt(document.getElementById('deleteAmount').value) || 1;
    const auraData = gameState.inventory.auras[auraName];
    
    if (!auraData || amount < 1) {
        closeDeleteAuraModal();
        return;
    }
    
    // Clamp to available count
    const deleteCount = Math.min(amount, auraData.count);
    
    // Get aura info for tracking
    const baseAura = AURAS.find(a => a.name === auraName);
    const tier = auraData.tier || (baseAura ? baseAura.tier : 'unknown');
    
    // Track deletion for achievements
    trackDeletion({ name: auraName, tier: tier }, deleteCount);
    
    // Calculate money reward based on tier
    const tierMoneyValues = {
        'Common': 5,
        'Uncommon': 15,
        'Rare': 50,
        'Epic': 150,
        'Legendary': 500,
        'Mythic': 1500,
        'Exotic': 5000,
        'Divine': 15000,
        'Celestial': 50000,
        'Transcendent': 200000,
        'Cosmic': 1000000
    };
    
    const moneyPerAura = tierMoneyValues[tier] || 1;
    const totalMoney = moneyPerAura * deleteCount;
    
    // Anti-cheat: Mark this as a legitimate transaction
    if (window.anomalyDetector) {
        window.anomalyDetector.markLegitimateTransaction();
    }
    
    // Give money
    gameState.currency.money = (gameState.currency.money || 0) + totalMoney;
    
    // Track currency change
    if (typeof trackCurrencyChange === 'function') {
        trackCurrencyChange('money', totalMoney, true);
    }
    
    // Update inventory
    auraData.count -= deleteCount;
    
    if (auraData.count <= 0) {
        delete gameState.inventory.auras[auraName];
    }
    
    // Save and update UI
    saveGameState();
    updateAurasInventory();
    updateUI();
    
    // Show notification with money earned
    showNotification(`🗑️ Deleted ${deleteCount}x ${auraName} | +${totalMoney.toLocaleString()} 💰`, 'success');
    
    closeDeleteAuraModal();
}

function renderRecentAchievements() {
    const unlocked = gameState.achievements.unlocked || {};
    
    // Get all unlocked achievements with timestamps and sort by most recent
    const recentAchievements = Object.entries(unlocked)
        .filter(([id, data]) => data.unlockedAt) // Only achievements with timestamps
        .sort((a, b) => b[1].unlockedAt - a[1].unlockedAt) // Sort by most recent first
        .slice(0, 10); // Get last 10
    
    if (recentAchievements.length === 0) {
        return ''; // Don't show section if no achievements
    }
    
    const formatTimeAgo = (timestamp) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };
    
    const achievementsList = recentAchievements.map(([id, data]) => {
        const achievement = ACHIEVEMENTS[id];
        if (!achievement) return '';
        
        const categoryInfo = {
            'ROLLS': '🎲', 'RARITY': '💎', 'PLAYTIME': '⏰', 'BREAKTHROUGHS': '⚡',
            'BIOMES': '🌍', 'AURAS': '✨', 'POTIONS': '🧪', 'RUNES': '📿',
            'CRAFTING': '⚒️', 'GEAR': '🛡️', 'SPEED': '⚡', 'STREAKS': '🔥',
            'COLLECTION': '📚', 'CHALLENGES': '💪', 'DAILY': '📅', 'ELEMENTAL': '🔮',
            'COMBINATION': '🎭', 'BIOME_SPECIALIST': '🗺️', 'ROLLING': '🎰', 'LUCK': '🍀',
            'MUTATION': '🧬', 'HALLOWEEN': '🎃', 'ULTIMATE': '👑', 'SPECIFIC': '🎯',
            'INSANE': '🔥', 'MEME': '😂', 'GODLIKE': '⚡', 'ROLLING_SPEC': '🎲', 'META': '🏆'
        };
        
        const icon = categoryInfo[achievement.category] || '🏆';
        const timeAgo = formatTimeAgo(data.unlockedAt);
        
        // Build rewards display
        let rewardsHtml = '';
        if (achievement.reward) {
            const rewards = [];
            
            if (achievement.reward.money) {
                rewards.push(`💰 ${achievement.reward.money.toLocaleString()}`);
            }
            
            if (achievement.reward.currency) {
                for (const [currencyType, amount] of Object.entries(achievement.reward.currency)) {
                    if (currencyType === 'halloweenMedals') {
                        rewards.push(`🎃 ${amount} Halloween Medals`);
                    } else {
                        rewards.push(`💎 ${amount} ${currencyType}`);
                    }
                }
            }
            
            if (achievement.reward.items) {
                for (const [itemName, count] of Object.entries(achievement.reward.items)) {
                    if (itemName === 'Void Coin' || itemName === 'Void Coins') {
                        rewards.push(`🌀 ${count}x Void Coin`);
                    } else if (itemName === 'Random Rune Chest') {
                        rewards.push(`📦 ${count}x Rune Chest`);
                    } else {
                        rewards.push(`📦 ${count}x ${itemName}`);
                    }
                }
            }
            
            if (achievement.reward.potions) {
                const potionEntries = Object.entries(achievement.reward.potions);
                if (potionEntries.length === 1) {
                    const [potionName, count] = potionEntries[0];
                    rewards.push(`🧪 ${count}x ${potionName}`);
                } else {
                    const potionCount = Object.values(achievement.reward.potions).reduce((a, b) => a + b, 0);
                    const potionList = potionEntries.map(([name, count]) => `${count}x ${name}`).join(', ');
                    rewards.push(`🧪 ${potionCount}x Potions (${potionList})`);
                }
            }
            
            if (achievement.reward.buff) {
                rewards.push(`⚡ ${achievement.reward.buff}`);
            }
            
            if (rewards.length > 0) {
                rewardsHtml = `<div style="font-size: 10px; color: #10b981; margin-top: 3px;">${rewards.join(' • ')}</div>`;
            }
        }
        
        return `
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: rgba(251, 191, 36, 0.1); border-left: 3px solid #fbbf24; border-radius: 6px; margin-bottom: 6px;">
                <span style="font-size: 20px;">${icon}</span>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 600; color: #fbbf24; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${achievement.name}</div>
                    <div style="font-size: 11px; color: #888;">${achievement.description}</div>
                    ${rewardsHtml}
                </div>
                <div style="font-size: 11px; color: #6b7280; white-space: nowrap;">${timeAgo}</div>
            </div>
        `;
    }).join('');
    
    return `
        <div style="margin-bottom: 20px;">
            <h4 style="color: #fbbf24; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <span>⭐</span> Recent Achievements
            </h4>
            <div style="max-height: 300px; overflow-y: auto; padding-right: 10px;">
                ${achievementsList}
            </div>
        </div>
    `;
}

function updateAchievementsInventory() {
    const container = document.getElementById('achievements-tab');
    if (!container) return;
    
    const unlocked = gameState.achievements.unlocked || {};
    const unlockedCount = Object.keys(unlocked).length;
    const totalCount = Object.keys(ACHIEVEMENTS).length;
    
    let html = `
        <div style="margin-bottom: 20px; text-align: center;">
            <h3 style="color: #fbbf24;">🏆 Achievements: ${unlockedCount}/${totalCount}</h3>
            <div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                <div><strong>Total Rolls:</strong> ${gameState.totalRolls.toLocaleString()}</div>
                <div><strong>Highest Rarity:</strong> 1 in ${gameState.achievements.stats.highestRarity.toLocaleString()}</div>
                <div><strong>Breakthroughs:</strong> ${gameState.achievements.stats.breakthroughCount.toLocaleString()}</div>
                <div><strong>Playtime:</strong> ${Math.floor(gameState.achievements.stats.playtimeMinutes / 60)}h ${Math.floor(gameState.achievements.stats.playtimeMinutes % 60)}m</div>
                <div><strong>Potions Used:</strong> ${gameState.achievements.stats.potionsUsed.toLocaleString()}</div>
            </div>
        </div>
        
        ${renderRecentAchievements()}
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 20px;">
            ${renderAchievementCategoryButtons()}
        </div>
        
        <div id="achievement-content" style="max-height: 600px; overflow-y: auto; padding-right: 10px;">
            ${renderAchievementCategory('ROLLS')}
        </div>
    `;
    
    container.innerHTML = html;
}

function renderAchievementCategoryButtons() {
    const categoryOrder = ['ROLLS', 'RARITY', 'PLAYTIME', 'BREAKTHROUGHS', 'BIOMES', 'AURAS', 'POTIONS', 'RUNES', 'CRAFTING', 'GEAR', 'SPEED', 'STREAKS', 'COLLECTION', 'CHALLENGES', 'DAILY', 'ELEMENTAL', 'COMBINATION', 'BIOME_SPECIALIST', 'ROLLING', 'LUCK', 'MUTATION', 'HALLOWEEN', 'ULTIMATE', 'SPECIFIC', 'INSANE', 'MEME', 'GODLIKE', 'ROLLING_SPEC', 'META'];
    
    const categoryInfo = {
        'ROLLS': { icon: '🎲', name: 'Roll Milestones' },
        'RARITY': { icon: '💎', name: 'Rarity Hunter' },
        'PLAYTIME': { icon: '⏰', name: 'Time Traveler' },
        'BREAKTHROUGHS': { icon: '⚡', name: 'Breakthrough' },
        'BIOMES': { icon: '🌍', name: 'Biome Explorer' },
        'AURAS': { icon: '✨', name: 'Aura Collection' },
        'POTIONS': { icon: '🧪', name: 'Potion Master' },
        'RUNES': { icon: '📿', name: 'Rune Master' },
        'CRAFTING': { icon: '⚒️', name: 'Crafting' },
        'GEAR': { icon: '🛡️', name: 'Gear Master' },
        'SPEED': { icon: '⚡', name: 'Speed Runner' },
        'STREAKS': { icon: '🔥', name: 'Lucky Streaks' },
        'COLLECTION': { icon: '📚', name: 'Collection' },
        'CHALLENGES': { icon: '🏆', name: 'Challenges' },
        'DAILY': { icon: '📅', name: 'Daily/Session' },
        'ELEMENTAL': { icon: '🌊', name: 'Elemental' },
        'COMBINATION': { icon: '🔗', name: 'Combos' },
        'BIOME_SPECIALIST': { icon: '🗺️', name: 'Biome Specialist' },
        'ROLLING': { icon: '🎰', name: 'Rolling Master' },
        'LUCK': { icon: '🍀', name: 'Luck Specialist' },
        'MUTATION': { icon: '🧬', name: 'Mutations' },
        'HALLOWEEN': { icon: '🎃', name: 'Halloween' },
        'ULTIMATE': { icon: '👑', name: 'Ultimate' },
        'SPECIFIC': { icon: '🎯', name: 'Specific' },
        'INSANE': { icon: '🔥', name: 'Insane' },
        'MEME': { icon: '🤣', name: 'Meme & Fun' },
        'GODLIKE': { icon: '⚡', name: 'Godlike' },
        'ROLLING_SPEC': { icon: '🎲', name: 'Rolling Specialist' },
        'META': { icon: '🎖️', name: 'Achievement Hunter' }
    };
    
    let html = '';
    const unlocked = gameState.achievements.unlocked || {};
    
    for (const category of categoryOrder) {
        const achievements = Object.entries(ACHIEVEMENTS).filter(([id, ach]) => ach.category === category);
        if (achievements.length === 0) continue;
        
        const unlockedInCategory = achievements.filter(([id]) => unlocked[id]).length;
        const totalInCategory = achievements.length;
        const info = categoryInfo[category] || { icon: '📋', name: category };
        const isActive = 'ROLLS' === category;
        
        html += `
            <div onclick="selectAchievementCategory('${category}')" 
                 style="background: ${isActive ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))' : 'rgba(0, 0, 0, 0.4)'}; 
                        border: 2px solid ${isActive ? '#667eea' : 'rgba(255, 255, 255, 0.15)'}; 
                        border-radius: 12px; 
                        padding: 15px; 
                        cursor: pointer; 
                        transition: all 0.3s ease;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 8px;
                        ${isActive ? 'box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);' : ''}"
                 onmouseover="this.style.background='rgba(102, 126, 234, 0.2)'; this.style.borderColor='#667eea'; this.style.transform='translateY(-2px)';"
                 onmouseout="this.style.background='${isActive ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))' : 'rgba(0, 0, 0, 0.4)'}'; this.style.borderColor='${isActive ? '#667eea' : 'rgba(255, 255, 255, 0.15)'}'; this.style.transform='translateY(0)';">
                <div style="font-size: 2em;">${info.icon}</div>
                <div style="font-weight: bold; font-size: 0.9em; text-align: center;">${info.name}</div>
                <div style="font-size: 0.85em; color: #aaa;">${unlockedInCategory}/${totalInCategory}</div>
                <div style="font-size: 0.8em; color: #fbbf24; font-weight: bold;">${Math.floor((unlockedInCategory / totalInCategory) * 100)}%</div>
            </div>
        `;
    }
    
    return html;
}

function renderAchievementCategory(category) {
    const unlocked = gameState.achievements.unlocked || {};
    const achievements = Object.entries(ACHIEVEMENTS).filter(([id, ach]) => ach.category === category);
    
    if (achievements.length === 0) {
        return '<div style="text-align: center; padding: 40px; color: #888;">No achievements in this category</div>';
    }
    
    let html = '';
    
    for (const [id, achievement] of achievements) {
        const isUnlocked = !!unlocked[id];
        const progress = getAchievementProgress(id, achievement);
        const progressPercent = Math.min(100, (progress / achievement.requirement) * 100);
        const rewardsText = formatAchievementRewards(achievement.reward);
        
        html += `<div style="background: ${isUnlocked ? 'rgba(251, 191, 36, 0.2)' : 'rgba(0,0,0,0.3)'}; border: 2px solid ${isUnlocked ? '#fbbf24' : '#444'}; border-radius: 8px; padding: 12px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-size: 32px;">${isUnlocked ? '🏆' : '🔒'}</div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: ${isUnlocked ? '#fbbf24' : '#888'};">${achievement.name}</div>
                    <div style="font-size: 13px; color: #aaa;">${achievement.description}</div>
                    ${rewardsText ? `<div style="margin-top: 5px; font-size: 12px; color: #fbbf24;">🎁 Rewards: ${rewardsText}</div>` : ''}
                    ${!isUnlocked ? `<div style="margin-top: 5px; font-size: 12px; color: #667eea;">Progress: ${formatProgress(progress, achievement)}</div>` : ''}
                    ${!isUnlocked && progressPercent > 0 ? `<div style="background: #333; height: 6px; border-radius: 3px; margin-top: 5px; overflow: hidden;"><div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${progressPercent}%; transition: width 0.3s;"></div></div>` : ''}
                </div>
            </div>
        </div>`;
    }
    
    return html;
}

function selectAchievementCategory(category) {
    const content = document.getElementById('achievement-content');
    if (content) {
        content.innerHTML = renderAchievementCategory(category);
    }
}

// Make functions globally accessible
window.selectAchievementCategory = selectAchievementCategory;
window.deleteAuraPrompt = deleteAuraPrompt;
window.closeDeleteAuraModal = closeDeleteAuraModal;
window.confirmDeleteAura = confirmDeleteAura;

function getAchievementProgress(id, achievement) {
    switch (achievement.type) {
        case 'rolls':
            return gameState.totalRolls;
        case 'rarity':
            return gameState.achievements.stats.highestRarity;
        case 'playtime':
            return gameState.achievements.stats.playtimeMinutes;
        case 'breakthroughs':
            return gameState.achievements.stats.breakthroughCount;
        case 'potions_used':
            return gameState.achievements.stats.potionsUsed;
        case 'specific_aura':
            return gameState.inventory.auras[achievement.requirement] ? 1 : 0;
        case 'biome_seen':
            if (!gameState.achievements.stats.biomesSeen) {
                gameState.achievements.stats.biomesSeen = [];
            }
            return gameState.achievements.stats.biomesSeen.includes(achievement.requirement) ? 1 : 0;
        case 'unique_auras':
            return Object.keys(gameState.inventory.auras).length;
        case 'achievement_count':
            return Object.keys(gameState.achievements.unlocked).length;
        default:
            return 0;
    }
}

function formatAchievementRewards(reward) {
    if (!reward) return '';
    
    let rewards = [];
    
    // Format money reward
    if (reward.money) {
        rewards.push(`💰 ${reward.money.toLocaleString()} coins`);
    }
    
    // Format potion rewards
    if (reward.potions) {
        for (const [potionName, count] of Object.entries(reward.potions)) {
            rewards.push(`🧪 ${count}x ${potionName}`);
        }
    }
    
    // Format item rewards
    if (reward.items) {
        for (const [itemName, count] of Object.entries(reward.items)) {
            rewards.push(`📦 ${count}x ${itemName}`);
        }
    }
    
    // Format buff rewards
    if (reward.buff) {
        rewards.push(`⚡ ${reward.buff}`);
    }
    
    return rewards.join(', ');
}

function formatProgress(progress, achievement) {
    switch (achievement.type) {
        case 'rolls':
        case 'breakthroughs':
        case 'potions_used':
        case 'achievement_count':
        case 'unique_auras':
            return `${progress.toLocaleString()} / ${achievement.requirement.toLocaleString()}`;
        case 'rarity':
            return progress > 0 ? `1 in ${progress.toLocaleString()} / 1 in ${achievement.requirement.toLocaleString()}` : `0 / 1 in ${achievement.requirement.toLocaleString()}`;
        case 'playtime':
            const hours = Math.floor(progress / 60);
            const minutes = Math.floor(progress % 60);
            const reqHours = Math.floor(achievement.requirement / 60);
            const reqMinutes = Math.floor(achievement.requirement % 60);
            return `${hours}h ${minutes}m / ${reqHours}h ${reqMinutes}m`;
        case 'specific_aura':
            return progress ? 'Obtained!' : 'Not obtained yet';
        case 'biome_seen':
            return progress ? `${achievement.requirement} seen!` : `${achievement.requirement} not seen yet`;
        default:
            return '';
    }
}

function usePotion(name, amount = 1) {
    if (!gameState.inventory.potions[name] || gameState.inventory.potions[name].count <= 0) return;
    const recipe = typeof POTION_RECIPES !== 'undefined' ? POTION_RECIPES.find(r => r.name === name) : null;
    if (!recipe) return;
    
    // Check if Potion of the Beginner is being used with 100+ rolls
    if (recipe.beginnerMode && gameState.totalRolls >= 100) {
        showNotification(`🌱 Potion of the Beginner only works with less than 100 total rolls! (You have ${gameState.totalRolls})`, 'error');
        return;
    }
    
    // Check if night/day potions are being used at the wrong time
    if (recipe.nightMode && gameState.timeOfDay !== 'night') {
        showNotification(`🌙 ${name} can only be used during nighttime!`, 'error');
        return;
    }
    if (recipe.dayMode && gameState.timeOfDay !== 'day') {
        showNotification(`☀️ ${name} can only be used during daytime!`, 'error');
        return;
    }

    amount = Math.max(1, Math.min(amount, gameState.inventory.potions[name].count));
    
    let shouldConsumePotion = true;

    // Check if this exact potion is already active
    const existingEffect = gameState.activeEffects.find(e => e.name === name);
    
    if (existingEffect && recipe.duration && !recipe.oneRoll) {
        // Extend duration of existing effect instead of stacking buffs
        const timeToAdd = recipe.duration * amount * 1000;
        existingEffect.endTime = (existingEffect.endTime || Date.now()) + timeToAdd;
        
        // Consume potions BEFORE returning
        if (shouldConsumePotion) {
            gameState.inventory.potions[name].count -= amount;
            if (gameState.inventory.potions[name].count <= 0) {
                delete gameState.inventory.potions[name];
            }
        }
        
        // Track potion usage for achievements
        for (let i = 0; i < amount; i++) {
            gameState.achievements.stats.potionsUsed = (gameState.achievements.stats.potionsUsed || 0) + 1;
        }
        
        showNotification(`⏰ Extended ${name} by ${(recipe.duration * amount / 60).toFixed(1)} min`, 'success');
        recalculateStats();
        updateActiveEffects();
        updateInventoryDisplay();
        saveGameState();
        return;
    }
    
    // Check if trying to use multiple removeCooldown potions
    if (recipe.removeCooldown) {
        const hasActiveCooldownRemoval = gameState.activeEffects.some(e => e.removeCooldown);
        if (hasActiveCooldownRemoval) {
            showNotification('⚠️ You already have a cooldown removal potion active!', 'warning');
            return;
        }
    }
    
    // Add new potion effect (only add ONE, not multiple)
    const baseEndTime = Date.now();
    const totalDuration = recipe.duration * amount * 1000; // Total time from all potions used
    
    gameState.activeEffects.push({
        name: name,
        luckBoost: recipe.luckBoost,
        speedBoost: recipe.speedBoost,
        oneRoll: recipe.oneRoll,
        rollCount: recipe.rollCount ? recipe.rollCount * amount : null, // Multiply roll count by amount
        rollsLeft: recipe.rollCount ? recipe.rollCount * amount : null,
        endTime: (recipe.duration && !recipe.oneRoll) ? baseEndTime + totalDuration : null,
        // Existing special effect properties
        guaranteeRarity: recipe.guaranteeRarity,
        chaosMode: recipe.chaosMode,
        mirrorChance: recipe.mirrorChance,
        mirrorCount: recipe.mirrorCount,
        cooldownReduction: recipe.cooldownReduction,
        phoenixMode: recipe.phoenixMode,
        bonusSpawnChance: recipe.bonusSpawnChance,
        legendaryOnly: recipe.legendaryOnly,
        quantumChance: recipe.quantumChance,
        maxQuantumChain: recipe.maxQuantumChain,
        curseImmunity: recipe.curseImmunity,
        jackpotMode: recipe.jackpotMode,
        dupeChance: recipe.dupeChance,
        // NEW POTION MODES
        clarityMode: recipe.clarityMode,
        hindsightMode: recipe.hindsightMode,
        patienceMode: recipe.patienceMode,
        momentumMode: recipe.momentumMode,
        momentumStack: 0,
        momentumLastRoll: 0,
        focusTier: recipe.focusTier,
        focusBoost: recipe.focusBoost,
        gamblerMode: recipe.gamblerMode,
        gamblerApplied: false,
        extremesMode: recipe.extremesMode,
        allOrNothingMode: recipe.allOrNothingMode,
        sacrificeMode: recipe.sacrificeMode,
        hourMode: recipe.hourMode,
        adaptationMode: recipe.adaptationMode,
        adaptationBiome: gameState.currentBiome,
        explorationMode: recipe.explorationMode,
        explorationTriggered: false,
        nightMode: recipe.nightMode,
        dayMode: recipe.dayMode,
        consistencyMode: recipe.consistencyMode,
        consistencyLastTier: null,
        consistencyBonus: false,
        varietyMode: recipe.varietyMode,
        varietyRolls: [],
        breakthroughMode: recipe.breakthroughMode,
        conservationMode: recipe.conservationMode,
        conservationCount: recipe.conservationCount || 0,
        insightMode: recipe.insightMode,
        insightCount: recipe.insightCount || 0,
        collectorMode: recipe.collectorMode,
        beginnerMode: recipe.beginnerMode,
        masteryMode: recipe.masteryMode,
        voidheartMode: recipe.voidheartMode,
        removeCooldown: recipe.removeCooldown
    });

    if (shouldConsumePotion) {
        gameState.inventory.potions[name].count -= amount;
        if (gameState.inventory.potions[name].count <= 0) {
            delete gameState.inventory.potions[name];
        }
    }

    // Track potion usage for achievements
    for (let i = 0; i < amount; i++) {
        trackPotionUse();
        
        // Track for leaderboards
        if (typeof leaderboardStats !== 'undefined') {
            leaderboardStats.trackPotionUse(name);
        }
    }

    recalculateStats();
    updateInventoryDisplay();
    updateActiveEffects();
    saveGameState();
    
    // Update autoroll delay if removeCooldown potion was activated
    if (recipe.removeCooldown && gameState.autoRoll && gameState.autoRoll.active && autoRollWorker) {
        console.log('🚀 Updating autoroll delay - cooldown removed!');
        autoRollWorker.postMessage({
            type: 'updateDelay',
            delay: 0
        });
    }
    
    // Log for user feedback
    console.log(`Used ${amount}x ${name}. ${recipe.oneRoll ? 'One-roll potions will be consumed one per roll.' : ''}`);
}

// =================================================================
// Bulk Mode Functions
// =================================================================

window.toggleBulkMode = function() {
    const checkbox = document.getElementById('bulkModeToggle');
    const useSelectedBtn = document.getElementById('useSelectedPotionsBtn');
    const selectedCountSpan = document.getElementById('selectedPotionsCount');
    const bulkHint = document.querySelector('.bulk-mode-hint');
    
    gameState.bulkMode.active = checkbox.checked;
    
    if (gameState.bulkMode.active) {
        useSelectedBtn.style.display = 'inline-block';
        if (bulkHint) bulkHint.style.display = 'none';
        updateSelectedPotionsCount();
        showNotification('🎯 Bulk Mode ON - Click potions to select them', 'info');
    } else {
        useSelectedBtn.style.display = 'none';
        if (bulkHint) bulkHint.style.display = 'block';
        selectedCountSpan.textContent = '';
        // Clear selected potions when bulk mode is turned off
        gameState.bulkMode.selectedPotions = [];
        updatePotionsInventory(); // Refresh display to remove selection highlights
    }
    
    saveGameState();
}

window.updateSelectedPotionsCount = function() {
    const selectedCountSpan = document.getElementById('selectedPotionsCount');
    const selectedPotions = gameState.bulkMode.selectedPotions;
    const count = selectedPotions.length;
    
    if (count > 0) {
        // Calculate total potion count
        let totalPotions = 0;
        selectedPotions.forEach(name => {
            const potionData = gameState.inventory.potions[name];
            if (potionData) {
                totalPotions += potionData.count;
            }
        });
        selectedCountSpan.textContent = `(${count} type${count > 1 ? 's' : ''}, ${totalPotions} total)`;
    } else {
        selectedCountSpan.textContent = '';
    }
}

window.togglePotionSelection = function(potionName) {
    if (!gameState.bulkMode.active) return;
    
    const index = gameState.bulkMode.selectedPotions.indexOf(potionName);
    
    if (index === -1) {
        // Add to selection
        gameState.bulkMode.selectedPotions.push(potionName);
    } else {
        // Remove from selection
        gameState.bulkMode.selectedPotions.splice(index, 1);
    }
    
    updateSelectedPotionsCount();
    updatePotionsInventory(); // Refresh display to update selection highlights
    saveGameState();
}

window.useSelectedPotions = function() {
    if (gameState.bulkMode.selectedPotions.length === 0) {
        showNotification('No potions selected!', 'warning');
        return;
    }
    
    let totalUsed = 0;
    let potionsSummary = [];
    const selectedPotions = [...gameState.bulkMode.selectedPotions]; // Create copy to avoid modification during iteration
    
    for (const potionName of selectedPotions) {
        const potionData = gameState.inventory.potions[potionName];
        if (potionData && potionData.count > 0) {
            const countToUse = potionData.count; // Use ALL copies of this potion
            usePotion(potionName, countToUse);
            totalUsed += countToUse;
            potionsSummary.push(`${countToUse}x ${potionName}`);
        }
    }
    
    // Clear selection after use
    gameState.bulkMode.selectedPotions = [];
    updateSelectedPotionsCount();
    updatePotionsInventory(); // Refresh display
    
    if (totalUsed > 0) {
        const summary = potionsSummary.join(', ');
        showNotification(`✅ Used ${totalUsed} potion${totalUsed > 1 ? 's' : ''}: ${summary}`, 'success');
    }
    
    saveGameState();
}

// =================================================================
// Runes System
// =================================================================

function useRune(name, amount = 1) {
    if (!gameState.inventory.runes[name] || gameState.inventory.runes[name].count <= 0) return;
    const runeData = typeof RUNES_DATA !== 'undefined' ? RUNES_DATA.find(r => r.name === name) : null;
    if (!runeData) return;

    // Check if any rune is already active
    const existingRune = gameState.activeEffects.find(e => e.type === 'rune');
    
    if (existingRune) {
        // Check if it's the same rune - if so, extend the timer
        if (existingRune.name === name) {
            amount = Math.max(1, Math.min(amount, gameState.inventory.runes[name].count));
            const additionalTime = runeData.duration * 1000 * amount;
            existingRune.endTime += additionalTime;
            
            gameState.inventory.runes[name].count -= amount;
            if (gameState.inventory.runes[name].count <= 0) {
                delete gameState.inventory.runes[name];
            }
            
            // Track rune usage
            const stats = gameState.achievements.stats;
            stats.runesUsed = (stats.runesUsed || 0) + amount;
            stats.totalRunesUsedLifetime = (stats.totalRunesUsedLifetime || 0) + amount;
            
            // Track specific rune types
            if (name.includes('Eclipse')) {
                stats.runeEclipseUsedCount = (stats.runeEclipseUsedCount || 0) + amount;
            }
            if (name.includes('Everything')) {
                stats.runeEverythingUsedCount = (stats.runeEverythingUsedCount || 0) + amount;
            }
            
            // Track Halloween runes
            if (['Graveyard', 'Blood Rain', 'Pumpkin Moon'].some(type => name.includes(type))) {
                stats.halloweenRunesUsedCount = (stats.halloweenRunesUsedCount || 0) + amount;
            }
            
            // Track rune stack max
            const activeRunes = gameState.activeEffects.filter(e => e.type === 'rune').length;
            stats.runeStackMaxCount = Math.max(stats.runeStackMaxCount || 0, activeRunes);
            
            checkAchievements();
            
            updateInventoryDisplay();
            updateActiveEffects();
            saveGameState();
            
            const timeAdded = (runeData.duration * amount);
            console.log(`Extended ${name} timer by ${timeAdded}s (x${amount})`);
            return;
        } else {
            // Different rune is active - show warning
            console.log(`Cannot use ${name}: ${existingRune.name} is already active. Wait for it to expire first.`);
            showNotification(`⚠️ ${existingRune.name} is already active!`, 'warning');
            return;
        }
    }

    // No rune active, add new one (only use 1 at a time)
    amount = 1; // Force only 1 rune to be used at a time

    gameState.activeEffects.push({
        name: name,
        type: 'rune',
        biome: runeData.biome,
        biomes: runeData.biomes,
        endTime: Date.now() + (runeData.duration * 1000)
    });

    gameState.inventory.runes[name].count -= amount;
    if (gameState.inventory.runes[name].count <= 0) {
        delete gameState.inventory.runes[name];
    }

    // Track rune usage
    const stats = gameState.achievements.stats;
    stats.runesUsed = (stats.runesUsed || 0) + amount;
    stats.totalRunesUsedLifetime = (stats.totalRunesUsedLifetime || 0) + amount;
    
    // Track specific rune types
    if (name.includes('Eclipse')) {
        stats.runeEclipseUsedCount = (stats.runeEclipseUsedCount || 0) + amount;
    }
    if (name.includes('Everything')) {
        stats.runeEverythingUsedCount = (stats.runeEverythingUsedCount || 0) + amount;
    }
    
    // Track Halloween runes
    if (['Graveyard', 'Blood Rain', 'Pumpkin Moon'].some(type => name.includes(type))) {
        stats.halloweenRunesUsedCount = (stats.halloweenRunesUsedCount || 0) + amount;
    }
    
    // Track rune stack max and single rune hoard
    const activeRunes = gameState.activeEffects.filter(e => e.type === 'rune').length;
    stats.runeStackMaxCount = Math.max(stats.runeStackMaxCount || 0, activeRunes);
    
    // Track single rune hoard (most of one type owned)
    for (const runeName in gameState.inventory.runes) {
        const runeCount = gameState.inventory.runes[runeName].count;
        stats.singleRuneHoardMax = Math.max(stats.singleRuneHoardMax || 0, runeCount);
    }
    
    // Check all runes 5k achievement
    const allRuneTypes = ['Empyrean', 'Starfall', 'Windy', 'Wintery', 'Graveyard', 'Bloodstorm'];
    const allRunesOver5k = allRuneTypes.every(type => {
        const fullName = `Rune of ${type}`;
        return gameState.inventory.runes[fullName] && gameState.inventory.runes[fullName].count >= 5000;
    });
    if (allRunesOver5k) {
        stats.allRunes5kDone = true;
    }
    
    checkAchievements();

    updateInventoryDisplay();
    updateActiveEffects();
    saveGameState();
    
    console.log(`Used ${name}. Biome auras can now be rolled at native rarity for ${runeData.duration / 60} minutes!`);
}

window.useRunePrompt = function(name, event) {
    const count = gameState.inventory.runes[name]?.count || 0;
    if (!count) return;
    if (event.shiftKey) useRune(name, Math.min(10, count));
    else if (event.ctrlKey) useRune(name, count);
    else useRune(name, 1);
}

// Check if player has an active rune that allows rolling a specific biome's auras at native rarity
function getActiveRuneBiomes() {
    const activeBiomes = new Set();
    
    gameState.activeEffects.forEach(effect => {
        if (effect.type === 'rune') {
            if (effect.biome) {
                activeBiomes.add(effect.biome);
            } else if (effect.biomes) {
                effect.biomes.forEach(b => activeBiomes.add(b));
            }
        }
    });
    
    return Array.from(activeBiomes);
}

// Check if an aura should be rolled at native rarity due to active runes
function shouldUseNativeRarityForAura(auraName) {
    const activeRuneBiomes = getActiveRuneBiomes();
    if (activeRuneBiomes.length === 0) return false;
    
    // Check if this aura belongs to any active rune biome
    for (const biomeName of activeRuneBiomes) {
        const biomeAuras = typeof BIOME_AURAS !== 'undefined' ? BIOME_AURAS[biomeName] : null;
        if (biomeAuras && biomeAuras.includes(auraName)) {
            return true;
        }
    }
    
    return false;
}

// Use Strange Controller to change biome based on rarity
window.useStrangeController = function() {
    if (!gameState.inventory.items['Strange Controller'] || gameState.inventory.items['Strange Controller'].count <= 0) {
        showNotification('❌ No Strange Controller available!', 'error');
        return;
    }
    
    // Check cooldown
    const cooldownEnd = gameState.itemCooldowns?.['Strange Controller'] || 0;
    if (Date.now() < cooldownEnd) {
        const remainingMinutes = Math.ceil((cooldownEnd - Date.now()) / 1000 / 60);
        showNotification(`⏰ Strange Controller on cooldown: ${remainingMinutes} minute(s) remaining`, 'warning');
        return;
    }
    
    // Get all non-GLITCHED biomes
    const validBiomes = typeof BIOMES !== 'undefined' ? 
        BIOMES.filter(b => b.name !== 'GLITCHED' && b.name !== 'DREAMSPACE' && b.name !== 'NORMAL') : [];
    
    if (validBiomes.length === 0) {
        showNotification('❌ No valid biomes available!', 'error');
        return;
    }
    
    // Weight biomes by their native rarity (lower rarity = higher weight)
    const weightedBiomes = [];
    validBiomes.forEach(biome => {
        const weight = Math.max(1, Math.floor(1000000 / (biome.nativeRarity || 10))); // Invert rarity for weight
        for (let i = 0; i < weight; i++) {
            weightedBiomes.push(biome.name);
        }
    });
    
    // Select random biome based on weight
    const selectedBiome = weightedBiomes[Math.floor(Math.random() * weightedBiomes.length)];
    
    // Set cooldown (15 minutes) - item is NOT consumed
    if (!gameState.itemCooldowns) gameState.itemCooldowns = {};
    gameState.itemCooldowns['Strange Controller'] = Date.now() + 900000; // 15 minutes
    
    // Change biome
    if (typeof setBiome === 'function') {
        setBiome(selectedBiome);
        showNotification(`🎮 Strange Controller activated! Biome changed to: ${selectedBiome}`, 'success');
    } else {
        showNotification('❌ Biome system not available!', 'error');
    }
    
    saveGameState();
    updateItemsInventory();
};

// Use Biome Randomizer to change to random biome
window.useBiomeRandomizer = function() {
    if (!gameState.inventory.items['Biome Randomizer'] || gameState.inventory.items['Biome Randomizer'].count <= 0) {
        showNotification('❌ No Biome Randomizer available!', 'error');
        return;
    }
    
    // Check cooldown
    const cooldownEnd = gameState.itemCooldowns?.['Biome Randomizer'] || 0;
    if (Date.now() < cooldownEnd) {
        const remainingMinutes = Math.ceil((cooldownEnd - Date.now()) / 1000 / 60);
        showNotification(`⏰ Biome Randomizer on cooldown: ${remainingMinutes} minute(s) remaining`, 'warning');
        return;
    }
    
    // Get all biomes (including rare ones, but exclude GLITCHED and DREAMSPACE)
    const validBiomes = typeof BIOMES !== 'undefined' ? 
        BIOMES.filter(b => b.name !== 'GLITCHED' && b.name !== 'DREAMSPACE' && b.name !== 'NORMAL') : [];
    
    if (validBiomes.length === 0) {
        showNotification('❌ No valid biomes available!', 'error');
        return;
    }
    
    // Select completely random biome (equal probability)
    const randomBiome = validBiomes[Math.floor(Math.random() * validBiomes.length)];
    
    // Set cooldown (30 minutes) - item is NOT consumed
    if (!gameState.itemCooldowns) gameState.itemCooldowns = {};
    gameState.itemCooldowns['Biome Randomizer'] = Date.now() + 1800000; // 30 minutes
    
    // Change biome
    if (typeof setBiome === 'function') {
        setBiome(randomBiome.name);
        showNotification(`🎲 Biome Randomizer activated! Biome changed to: ${randomBiome.name}`, 'success');
    } else {
        showNotification('❌ Biome system not available!', 'error');
    }
    
    saveGameState();
    updateItemsInventory();
};

// Open Random Rune Chest to get a random rune
window.openRandomRuneChest = function(event) {
    console.log('Opening Random Rune Chest...');
    const chestName = 'Random Rune Chest';
    const count = gameState.inventory.items[chestName]?.count || 0;
    console.log(`You have ${count} chests`);
    if (count <= 0) {
        console.log('No chests available!');
        return;
    }
    
    let amount = 1;
    if (event.shiftKey) amount = Math.min(10, count);
    else if (event.ctrlKey) amount = count;
    console.log(`Opening ${amount} chest(s)...`);
    
    // Get available chest runes with weighted rarity
    const chestRunes = typeof RUNE_SOURCES !== 'undefined' ? RUNE_SOURCES.chestRunes : [
        "Rune of Wind", "Rune of Frost", "Rune of Rainstorm", "Rune of Dust",
        "Rune of Hell", "Rune of Galaxy", "Rune of Corruption", "Rune of Nothing"
    ];
    
    // Create weighted pool (basic runes more common, special runes rare)
    const weightedPool = [];
    for (const rune of chestRunes) {
        if (rune === "Rune of 404" || rune === "Rune of Dreams") {
            // Extremely rare - 0.1% chance each (1 in 1000)
            // Don't add to pool - will be rolled separately with low chance
            continue;
        } else if (rune === "Rune of Everything") {
            // Ultra rare - 0.5% chance
            weightedPool.push(rune);
        } else if (rune === "Rune of Eclipse") {
            // Rare - 5% chance
            for (let i = 0; i < 10; i++) weightedPool.push(rune);
        } else if (rune.includes("Pumpkin Moon") || rune.includes("Graveyard") || rune.includes("Blood Rain")) {
            // Halloween runes - slightly rarer
            for (let i = 0; i < 15; i++) weightedPool.push(rune);
        } else {
            // Common - split among basic runes
            for (let i = 0; i < 20; i++) weightedPool.push(rune);
        }
    }
    
    const receivedRunes = [];
    
    // Ensure runes object exists
    if (!gameState.inventory.runes) {
        gameState.inventory.runes = {};
    }
    
    for (let i = 0; i < amount; i++) {
        let randomRune;
        
        // Roll for extremely rare runes first (0.1% chance each = 1 in 1000)
        const extremelyRareRoll = Math.random();
        if (extremelyRareRoll < 0.001) {
            // 0.1% chance for Rune of 404
            randomRune = "Rune of 404";
        } else if (extremelyRareRoll < 0.002) {
            // 0.1% chance for Rune of Dreams
            randomRune = "Rune of Dreams";
        } else {
            // Pick a random rune from weighted pool
            randomRune = weightedPool[Math.floor(Math.random() * weightedPool.length)];
        }
        
        // Add to inventory
        if (!gameState.inventory.runes[randomRune]) {
            gameState.inventory.runes[randomRune] = { count: 0 };
        }
        gameState.inventory.runes[randomRune].count++;
        
        // Track rune discovery in codex
        if (typeof discoverCodexEntry === 'function') {
            discoverCodexEntry('runes', randomRune);
        }
        
        receivedRunes.push(randomRune);
    }
    
    console.log('All received runes:', receivedRunes);
    console.log('Current runes inventory:', gameState.inventory.runes);
    
    // Consume the chests
    gameState.inventory.items[chestName].count -= amount;
    if (gameState.inventory.items[chestName].count <= 0) {
        delete gameState.inventory.items[chestName];
    }
    
    // Track achievements
    gameState.achievements.stats.chestsOpened = (gameState.achievements.stats.chestsOpened || 0) + amount;
    checkAchievements();
    
    // Show notification
    const notification = document.getElementById('itemSpawnNotification');
    if (notification) {
        const uniqueRunes = [...new Set(receivedRunes)];
        const runeText = uniqueRunes.map(rune => {
            const runeData = typeof RUNES_DATA !== 'undefined' ? RUNES_DATA.find(r => r.name === rune) : null;
            const icon = runeData ? runeData.icon : '🔮';
            const runeCount = receivedRunes.filter(r => r === rune).length;
            return `${icon} ${rune} x${runeCount}`;
        }).join(', ');
        
        notification.style.background = 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)';
        notification.textContent = `🎁 Opened ${amount}x Random Rune Chest! Received: ${runeText}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
            notification.style.background = 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)';
        }, 5000);
    }
    
    updateInventoryDisplay();
    saveGameState();
    
    console.log(`Opened ${amount}x Random Rune Chest! Received: ${receivedRunes.join(', ')}`);
}

// =================================================================
// Cutscene Settings Functions
// =================================================================

// Get all auras for cutscene toggles
function getAllAuraNames() {
    if (typeof AURAS !== 'undefined') {
        return AURAS.map(aura => aura.name).sort();
    }
    return [];
}

window.toggleCutsceneDropdown = function() {
    const content = document.getElementById('cutsceneDropdownContent');
    const arrow = document.getElementById('cutsceneDropdownArrow');
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        arrow.textContent = '▲';
    } else {
        content.style.display = 'none';
        arrow.textContent = '▼';
    }
}

window.toggleAllCutscenes = function() {
    const checkbox = document.getElementById('cutsceneToggle');
    gameState.settings.cutscenes.enabled = checkbox.checked;
    saveGameState();
    console.log('Master cutscene toggle ' + (checkbox.checked ? 'enabled' : 'disabled'));
}

window.enableAllIndividualCutscenes = function() {
    const allAuras = getAllAuraNames();
    allAuras.forEach(auraName => {
        gameState.settings.cutscenes.individualToggles[auraName] = true;
    });
    saveGameState();
    populateIndividualCutsceneToggles();
    console.log('All individual cutscenes enabled');
}

window.disableAllIndividualCutscenes = function() {
    const allAuras = getAllAuraNames();
    allAuras.forEach(auraName => {
        gameState.settings.cutscenes.individualToggles[auraName] = false;
    });
    saveGameState();
    populateIndividualCutsceneToggles();
    console.log('All individual cutscenes disabled');
}

window.toggleIndividualCutscene = function(auraName) {
    const checkbox = document.getElementById(`cutscene_${auraName.replace(/[^a-zA-Z0-9]/g, '_')}`);
    gameState.settings.cutscenes.individualToggles[auraName] = checkbox.checked;
    updateToggleIcon(auraName);
    saveGameState();
    console.log(`Cutscene for ${auraName}: ${checkbox.checked ? 'enabled' : 'disabled'}`);
}

function updateToggleIcon(auraName) {
    const icon = document.getElementById(`icon_${auraName.replace(/[^a-zA-Z0-9]/g, '_')}`);
    const checkbox = document.getElementById(`cutscene_${auraName.replace(/[^a-zA-Z0-9]/g, '_')}`);
    
    if (icon && checkbox) {
        if (checkbox.checked) {
            icon.textContent = '✓';
            icon.style.color = '#22c55e';
        } else {
            icon.textContent = '✗';
            icon.style.color = '#ef4444';
        }
    }
}

function populateIndividualCutsceneToggles(searchTerm = '') {
    const container = document.getElementById('individualCutsceneToggles');
    if (!container) return;
    
    container.innerHTML = '';
    
    const allAuras = getAllAuraNames();
    const filteredAuras = searchTerm 
        ? allAuras.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
        : allAuras;
    
    if (filteredAuras.length === 0) {
        container.innerHTML = '<div style="padding: 10px; text-align: center; color: #999;">No auras found</div>';
        return;
    }
    
    filteredAuras.forEach(auraName => {
        const isEnabled = gameState.settings.cutscenes.individualToggles[auraName] !== false;
        const sanitizedName = auraName.replace(/[^a-zA-Z0-9]/g, '_');
        
        const toggleDiv = document.createElement('div');
        toggleDiv.style.cssText = 'display: flex; align-items: center; padding: 5px; background: rgba(255,255,255,0.05); border-radius: 4px; cursor: pointer; user-select: none;';
        toggleDiv.className = 'cutscene-toggle-row';
        toggleDiv.onclick = function() {
            const checkbox = document.getElementById(`cutscene_${sanitizedName}`);
            checkbox.checked = !checkbox.checked;
            toggleIndividualCutscene(auraName);
        };
        
        toggleDiv.innerHTML = `
            <input type="checkbox" id="cutscene_${sanitizedName}" ${isEnabled ? 'checked' : ''} 
                   style="margin-right: 8px; cursor: pointer; pointer-events: none;">
            <span id="icon_${sanitizedName}" style="font-weight: bold; margin-right: 8px; min-width: 16px; font-size: 16px;">${isEnabled ? '✓' : '✗'}</span>
            <span style="flex: 1; font-size: 12px;">${auraName}</span>
        `;
        
        // Update icon color
        const icon = toggleDiv.querySelector(`#icon_${sanitizedName}`);
        icon.style.color = isEnabled ? '#22c55e' : '#ef4444';
        
        container.appendChild(toggleDiv);
    });
}

window.searchCutscenes = function() {
    const searchInput = document.getElementById('cutsceneSearchInput');
    if (searchInput) {
        populateIndividualCutsceneToggles(searchInput.value);
    }
}

function updateCutsceneSettingsUI() {
    const cutsceneToggle = document.getElementById('cutsceneToggle');
    
    if (cutsceneToggle) {
        cutsceneToggle.checked = gameState.settings.cutscenes.enabled;
    }
    
    // Don't populate here, it will be populated when debug menu is created
}

// Make populateIndividualCutsceneToggles globally accessible for debug menu
window.populateIndividualCutsceneToggles = populateIndividualCutsceneToggles;

// =================================================================
// Background Execution Anti-Throttle System
// =================================================================
// This prevents the browser from throttling timers when the tab is hidden
// Uses multiple techniques: Web Audio API + requestAnimationFrame on hidden canvas

let audioContext = null;
let audioContextNode = null;
let antiThrottleCanvas = null;
let antiThrottleRAF = null;
let antiThrottleStarted = false;

function initAntiThrottle() {
    // Create multiple anti-throttle mechanisms
    
    // 1. Tiny hidden video playing in a loop (browsers don't throttle video)
    const video = document.createElement('video');
    video.style.position = 'fixed';
    video.style.top = '-10px';
    video.style.left = '-10px';
    video.style.width = '1px';
    video.style.height = '1px';
    video.style.opacity = '0.001';
    video.style.pointerEvents = 'none';
    video.style.zIndex = '-9999';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    
    // Create a tiny video data URL (1 frame, 1x1 pixel, black)
    const videoDataURL = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMQAAAAhmcmVlAAAA7W1kYXQAAAKuBgX//6rcRem95tlIt5Ys2CDZI+7veDI2NCAtIGNvcmUgMTQ4IHIyNzQ4IDk3ZWFlZjIgLSBILjI2NC9NUEVHLTQgQVZDIGNvZGVjIC0gQ29weWxlZnQgMjAwMy0yMDE2IC0gaHR0cDovL3d3dy52aWRlb2xhbi5vcmcveDI2NC5odG1sIC0gb3B0aW9uczogY2FiYWM9MSByZWY9MyBkZWJsb2NrPTE6MDowIGFuYWx5c2U9MHgzOjB4MTEzIG1lPWhleCBzdWJtZT03IHBzeT0xIHBzeV9yZD0xLjAwOjAuMDAgbWl4ZWRfcmVmPTEgbWVfcmFuZ2U9MTYgY2hyb21hX21lPTEgdHJlbGxpcz0xIDh4OGRjdD0xIGNxbT0wIGRlYWR6b25lPTIxLDExIGZhc3RfcHNraXA9MSBjaHJvbWFfcXBfb2Zmc2V0PS0yIHRocmVhZHM9MSBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MiBrZXlpbnQ9MjUwIGtleWludF9taW49MjUgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD00MCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIzLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IGlwX3JhdGlvPTEuNDAgYXE9MToxLjAwAIAAAAAwZYiEACD/2lu4PtiAGCZiIJmO35BneLS4/AKawbwF3gS81VgCN/Hrv/64b/8f//AAAAAXQZokbEL/AAAAAwAAAwAAAwAAAwAAAwAAAwAAAyBliKJAA//8AAAADWQZ5CREP/wAAAAcBnmF0Q/8AAAAGAZ5jakP/AAAASUGaa0moQWiZTAh///6qVQAAAAMAAAMAAAMAAAMAAAMAwYcUfNNTtYABHMQBgAEcxAGAARzEAYABHMQBgAEcxAGAARzEAYABHMQBgABNI8AAAAA6QZqISeEKUmUwIf8AAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAABbQZqqSeEOiZTAh/wAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAME65S';
    video.src = videoDataURL;
    document.body.appendChild(video);
    
    // Try to play the video
    video.play().catch(() => {
        console.log('Video anti-throttle failed (autoplay blocked)');
    });
    
    // 2. Create a tiny hidden canvas for continuous animation
    antiThrottleCanvas = document.createElement('canvas');
    antiThrottleCanvas.width = 1;
    antiThrottleCanvas.height = 1;
    antiThrottleCanvas.style.position = 'fixed';
    antiThrottleCanvas.style.top = '-10px';
    antiThrottleCanvas.style.left = '-10px';
    antiThrottleCanvas.style.width = '1px';
    antiThrottleCanvas.style.height = '1px';
    antiThrottleCanvas.style.opacity = '0.01';
    antiThrottleCanvas.style.pointerEvents = 'none';
    antiThrottleCanvas.style.zIndex = '-9999';
    document.body.appendChild(antiThrottleCanvas);
    
    const ctx = antiThrottleCanvas.getContext('2d');
    let frameCount = 0;
    let lastFrameTime = Date.now();
    let lastRollCheckTime = Date.now();
    
    // Continuous animation loop that prevents throttling
    function animate() {
        frameCount++;
        const now = Date.now();
        const delta = now - lastFrameTime;
        
        // Draw a single pixel (minimal work)
        ctx.fillStyle = frameCount % 2 ? '#000' : '#FFF';
        ctx.fillRect(0, 0, 1, 1);
        
        // Emergency roll checker - if web worker fails and we're in background
        if (gameState.autoRoll && gameState.autoRoll.active && !gameState.isRolling && !cutsceneState.active) {
            const timeSinceLastCheck = now - lastRollCheckTime;
            // If more than 2 seconds since last check, force a roll check
            if (timeSinceLastCheck > 2000) {
                lastRollCheckTime = now;
                // Only log throttling detection, worker will handle the roll
                if (document.hidden && timeSinceLastCheck > 3000) {
                    console.log(`Background running: ${(timeSinceLastCheck / 1000).toFixed(1)}s since last check`);
                }
            }
        }
        
        lastFrameTime = now;
        antiThrottleRAF = requestAnimationFrame(animate);
    }
    
    antiThrottleRAF = requestAnimationFrame(animate);
    console.log('Background execution prevention initialized (multi-layer protection)');
}

// Start audio context on user interaction to bypass autoplay policy
window.startAntiThrottle = function() {
    if (antiThrottleStarted) return;
    antiThrottleStarted = true;
    
    try {
        // Create an AudioContext (browsers don't throttle audio processing)
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            console.log('AudioContext not supported');
            return;
        }
        
        audioContext = new AudioContextClass();
        
        // Create a silent oscillator to keep the audio context active
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Set gain to 0 (silent)
        gainNode.gain.value = 0;
        
        // Connect oscillator -> gain -> destination (speakers)
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Start the oscillator
        oscillator.start(0);
        
        // Store reference
        audioContextNode = { oscillator, gainNode };
        
        console.log('Audio context started - background execution protection active');
        
        // Resume audio context if it gets suspended
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && audioContext && audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    console.log('Audio context resumed');
                });
            }
        });
        
    } catch (error) {
        console.error('Failed to start audio context:', error);
    }
};

// Initialize canvas animation immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAntiThrottle);
} else {
    initAntiThrottle();
}

// Additional: Use Page Visibility API to catch up on missed updates
let lastVisibleTime = Date.now();
let hiddenStartTime = null;

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Tab became visible again
        const hiddenDuration = Date.now() - lastVisibleTime;
        console.log(`Tab was hidden for ${(hiddenDuration / 1000).toFixed(1)} seconds`);
        
        // Resume audio context if suspended
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        // Update playtime immediately to catch up
        if (typeof updatePlaytime === 'function') {
            updatePlaytime();
        }
        
        // Recalculate stats in case effects expired
        if (typeof recalculateStats === 'function') {
            recalculateStats();
        }
        
        hiddenStartTime = null;
    } else {
        // Tab became hidden
        lastVisibleTime = Date.now();
        hiddenStartTime = Date.now();
        console.log('Tab hidden - anti-throttle active');
    }
});

console.log('Background execution prevention system ready');
console.log('TIP: Auto-roll will start audio protection automatically');

// =================================================================
// Modern UI Enhancement Functions
// =================================================================

// Toast Notification System
function showToast(message, type = 'info', duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️',
        rare: '✨'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, duration);
    
    // Click to dismiss
    toast.onclick = () => {
        toast.style.animation = 'toastSlideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    };
}

// Aura Showcase Modal
window.showAuraModal = function(auraName) {
    const modal = document.getElementById('auraModal');
    const aura = gameState.inventory.auras[auraName];
    if (!aura) return;
    
    const baseAura = AURAS.find(a => a.name === auraName);
    const rarity = baseAura ? baseAura.rarity : aura.rarity;
    
    document.getElementById('modalAuraName').textContent = auraName;
    document.getElementById('modalAuraName').className = `aura-modal-name rarity-${aura.tier}`;
    document.getElementById('modalAuraRarity').textContent = `1 in ${rarity.toLocaleString()}`;
    document.getElementById('modalAuraTier').textContent = `Tier: ${aura.tier.toUpperCase()}`;
    document.getElementById('modalAuraCount').textContent = `Owned: ${aura.count}x`;
    
    modal.classList.add('active');
};

window.closeAuraModal = function() {
    const modal = document.getElementById('auraModal');
    modal.classList.remove('active');
};

// Update aura inventory to be clickable
const originalUpdateAurasInventory = updateAurasInventory;
updateAurasInventory = function() {
    const container = document.getElementById('aurasInventory');
    const auras = gameState.inventory.auras;
    if (Object.keys(auras).length === 0) { 
        container.innerHTML = '<div class="inv-empty-message" style="grid-column: 1 / -1;">No auras rolled</div>'; 
        return; 
    }
    
    // Sort by BASE rarity from AURAS array (highest to lowest)
    const sortedAuras = Object.entries(auras).sort((a, b) => {
        const auraA = AURAS.find(aura => aura.name === a[0]);
        const auraB = AURAS.find(aura => aura.name === b[0]);
        const rarityA = auraA ? auraA.rarity : a[1].rarity;
        const rarityB = auraB ? auraB.rarity : b[1].rarity;
        return rarityB - rarityA;
    });
    
    container.innerHTML = sortedAuras.map(([name, data]) => {
        const badge = data.lastWasBreakthrough ? `<span class="breakthrough-badge">Breakthrough</span>` : '';
        const auraFont = getAuraFont(name);
        const auraColor = getAuraColor(name);
        const baseAura = AURAS.find(a => a.name === name);
        const displayRarity = baseAura ? baseAura.rarity : data.rarity;
        
        return `<div class="aura-item" onclick="showAuraModal('${name.replace(/'/g, "\\'")}')">
            <div>
                <div class="aura-item-name rarity-${data.tier}" style="font-family: ${auraFont}; color: ${auraColor};">
                    ${name}
                </div>
                ${badge}
                <div class="aura-item-rarity">1 in ${displayRarity.toLocaleString()} - x${data.count}</div>
            </div>
        </div>`;
    }).join('');
};

// Quick Action Bar
window.useQuickSlot = function(slot) {
    showToast(`Quick slot ${slot} activated!`, 'info');
};

// Enhanced showNotification to use toast system
const originalShowNotification = showNotification;
showNotification = function(message, type = 'info') {
    // FIX: Check if general notifications are enabled before showing any toast.
    if (gameState.settings?.notifications?.general === false) {
        return; // Exit immediately if notifications are off
    }
    
    // This call to the original function was causing the duplication and has been removed.
    /*
    if (typeof originalShowNotification === 'function') {
        originalShowNotification(message);
    }
    */
    
    // Determine toast type based on message content for better feedback
    let toastType = type;
    if (message.includes('✅') || message.includes('Purchased') || message.includes('Unlocked')) {
        toastType = 'success';
    } else if (message.includes('❌') || message.includes('Cannot') || message.includes('Not enough')) {
        toastType = 'error';
    } else if (message.includes('⚠️')) {
        toastType = 'warning';
    } else if (message.includes('✨') || message.includes('Rare') || message.includes('Mythic') || message.includes('Divine')) {
        toastType = 'rare';
    } else if (message.includes('💊') || message.includes('Found')) {
        // Use the default 'info' type for item drops
        toastType = 'info';
    }
    
    showToast(message, toastType);
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Quick slots 1-3
    if (e.key >= '1' && e.key <= '3' && !e.ctrlKey && !e.altKey) {
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        useQuickSlot(parseInt(e.key));
    }
    
    // ESC to close modal
    if (e.key === 'Escape') {
        closeAuraModal();
        const merchantBeam = document.getElementById('merchantBeam');
        if (merchantBeam) merchantBeam.remove();
        
        // Close merchant shop if open
        const merchantShop = document.getElementById('achievementsContainer');
        if (merchantShop && merchantShop.classList.contains('show')) {
            if (typeof dismissMerchant === 'function') {
                dismissMerchant();
            }
        }
    }
});

// Click outside modal to close
document.addEventListener('click', (e) => {
    const modal = document.getElementById('auraModal');
    if (modal && e.target === modal) {
        closeAuraModal();
    }
});

// Initialize bulk mode controls
window.initializeBulkModeControls = function() {
    const bulkModeToggle = document.getElementById('bulkModeToggle');
    const useSelectedBtn = document.getElementById('useSelectedPotionsBtn');
    
    if (bulkModeToggle) {
        bulkModeToggle.addEventListener('change', function() {
            toggleBulkMode();
        });
        console.log('Bulk mode toggle initialized');
    } else {
        console.warn('Bulk mode toggle element not found');
    }
    
    if (useSelectedBtn) {
        useSelectedBtn.addEventListener('click', function() {
            useSelectedPotions();
        });
        console.log('Use selected button initialized');
    } else {
        console.warn('Use selected button element not found');
    }
};

window.addEventListener('DOMContentLoaded', initGame);

// Settings toggle functions
window.toggleAchievementNotifications = function() {
    const checkbox = document.getElementById('achievementNotificationsToggle');
    if (checkbox && gameState.settings?.notifications) {
        gameState.settings.notifications.achievements = checkbox.checked;
        saveGameState();
        showToast(`Achievement notifications ${checkbox.checked ? 'enabled' : 'disabled'}`, 'info');
    }
}

window.toggleGeneralNotifications = function() {
    const checkbox = document.getElementById('generalNotificationsToggle');
    if (checkbox && gameState.settings?.notifications) {
        gameState.settings.notifications.general = checkbox.checked;
        saveGameState();
        showToast(`General notifications ${checkbox.checked ? 'enabled' : 'disabled'}`, 'info');
    }
}

window.toggleMasterCutscenes = function() {
    const checkbox = document.getElementById('masterCutsceneToggle');
    if (checkbox && gameState.settings?.cutscenes) {
        gameState.settings.cutscenes.enabled = checkbox.checked;
        saveGameState();
        showToast(`Cutscenes ${checkbox.checked ? 'enabled' : 'disabled'}`, 'info');
    }
}

// Music control functions
window.toggleMusicEnabled = function() {
    const checkbox = document.getElementById('musicEnabledToggle');
    if (checkbox && gameState.settings?.music) {
        gameState.settings.music.enabled = checkbox.checked;
        saveGameState();
        
        // Apply to current biome music
        if (typeof currentBiomeMusic !== 'undefined' && currentBiomeMusic) {
            if (!checkbox.checked) {
                currentBiomeMusic.pause();
            } else {
                currentBiomeMusic.play().catch(e => console.log('Music autoplay prevented'));
            }
        }
        
        showToast(`Music ${checkbox.checked ? 'enabled' : 'disabled'}`, 'info');
    }
}

window.updateMusicVolume = function(value) {
    const volumePercent = parseInt(value);
    const volumeDecimal = volumePercent / 100;
    
    // Update UI display
    const valueDisplay = document.getElementById('musicVolumeValue');
    if (valueDisplay) {
        valueDisplay.textContent = `${volumePercent}%`;
    }
    
    // Update gameState
    if (gameState.settings?.music) {
        gameState.settings.music.volume = volumeDecimal;
        saveGameState();
    }
    
    // Apply to current biome music
    if (typeof currentBiomeMusic !== 'undefined' && currentBiomeMusic) {
        currentBiomeMusic.volume = volumeDecimal;
    }
}

// Function to initialize settings UI based on gameState
window.initializeSettingsUI = function() {
    // Music settings
    const musicToggle = document.getElementById('musicEnabledToggle');
    if (musicToggle && gameState.settings?.music) {
        musicToggle.checked = gameState.settings.music.enabled;
    }
    
    const volumeSlider = document.getElementById('musicVolumeSlider');
    const volumeDisplay = document.getElementById('musicVolumeValue');
    if (volumeSlider && gameState.settings?.music) {
        const volumePercent = Math.round(gameState.settings.music.volume * 100);
        volumeSlider.value = volumePercent;
        if (volumeDisplay) {
            volumeDisplay.textContent = `${volumePercent}%`;
        }
    }
    
    // Achievement notifications toggle
    const achievementToggle = document.getElementById('achievementNotificationsToggle');
    if (achievementToggle && gameState.settings?.notifications) {
        achievementToggle.checked = gameState.settings.notifications.achievements;
    }
    
    // General notifications toggle
    const generalToggle = document.getElementById('generalNotificationsToggle');
    if (generalToggle && gameState.settings?.notifications) {
        generalToggle.checked = gameState.settings.notifications.general;
    }
    
    // Master cutscene toggle
    const masterToggle = document.getElementById('masterCutsceneToggle');
    if (masterToggle && gameState.settings?.cutscenes) {
        masterToggle.checked = gameState.settings.cutscenes.enabled;
    }
}

// Global cleanup function to fix stuck overlays
window.forceCleanupOverlays = function() {
    // Remove active class from all cutscenes
    document.querySelectorAll('.ultra-rare-cutscene, .cutscene-overlay').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
        el.style.pointerEvents = 'none';
    });
    
    // Hide all modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
        modal.style.display = 'none';
    });
    
    // Reset cutscene state
    if (typeof cutsceneState !== 'undefined') {
        cutsceneState.active = false;
    }
    
    // Resume normal page interaction
    document.body.style.overflow = '';
    
    console.log('✅ Forced cleanup of all overlays');
}

// Add emergency cleanup on ESC key (double-tap ESC within 500ms)
let lastEscTime = 0;
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEscTime < 500) {
            forceCleanupOverlays();
            console.log('🛟 Emergency overlay cleanup triggered (double ESC)');
        }
        lastEscTime = now;
    }
});