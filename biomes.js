// Biome System

const BIOMES = [
    {
        name: "NORMAL",
        rarity: 1,
        duration: 0, // Permanent (default state)
        multiplier: 1,
        color: "#4ade80",
        canOverride: true
    },
    {
        name: "WINDY",
        rarity: 500,
        duration: 660, // 11 minutes
        multiplier: 3,
        color: "#a5f3fc",
        type: "weather",
        canOverride: true
    },
    {
        name: "SNOWY",
        rarity: 750,
        duration: 660, // 11 minutes
        multiplier: 3,
        color: "#e0f2fe",
        type: "weather",
        canOverride: true
    },
    {
        name: "BLIZZARD",
        rarity: 3500, // Rarer than Snowy
        duration: 900, // 15 minutes - longer than Snowy
        multiplier: 6, // Higher than Snowy's 3
        color: "#bfdbfe", // Deeper blue-white
        type: "weather",
        canOverride: true
    },
    {
        name: "RAINY",
        rarity: 750,
        duration: 660, // 11 minutes
        multiplier: 4,
        color: "#7dd3fc",
        type: "weather",
        canOverride: true
    },
    {
        name: "MONSOON",
        rarity: 2500,
        duration: 480, // 8 minutes
        multiplier: 6,
        color: "#1e40af",
        type: "weather",
        canOverride: true
    },
    {
        name: "SANDSTORM",
        rarity: 3000,
        duration: 660, // 11 minutes
        multiplier: 4,
        color: "#fbbf24",
        type: "biome",
        canOverride: true
    },
    {
        name: "JUNGLE",
        rarity: 4000,
        duration: 660, // 11 minutes
        multiplier: 4,
        color: "#22c55e",
        type: "biome",
        canOverride: true
    },
    {
        name: "AMAZON",
        rarity: 2500, // Rarer than Jungle
        duration: 900, // 15 minutes - longer than Jungle
        multiplier: 6, // Higher than Jungle's 4
        color: "#059669", // Deeper green
        type: "biome",
        canOverride: true
    },
    {
        name: "CRIMSON",
        rarity: 5500,
        duration: 660, // 11 minutes
        multiplier: 5,
        color: "#dc143c",
        type: "biome",
        canOverride: true
    },
    {
        name: "STARFALL",
        rarity: 7500,
        duration: 600, // 10 minutes
        multiplier: 5,
        color: "#fcd34d",
        type: "biome",
        canOverride: true
    },
    {
        name: "METEOR_SHOWER",
        rarity: 5000, // Rarer than Starfall
        duration: 750, // 12.5 minutes - longer than Starfall
        multiplier: 7, // Higher than Starfall's 5
        color: "#f59e0b", // Deeper gold/orange
        type: "biome",
        canOverride: true
    },
    {
        name: "HELL",
        rarity: 6666,
        duration: 660, // 11 minutes
        multiplier: 6,
        color: "#ef4444",
        type: "biome",
        canOverride: true
    },
    {
        name: "TORNADO",
        rarity: 4000, // Rarer than WINDY
        duration: 540, // 9 minutes
        multiplier: 7, // Higher than WINDY's 3
        color: "#94a3b8", // Gray swirl
        type: "weather",
        canOverride: true
    },
    {
        name: "DUNES",
        rarity: 3500, // Alternative desert biome
        duration: 720, // 12 minutes
        multiplier: 4,
        color: "#f59e0b", // Sandy orange
        type: "biome",
        canOverride: true
    },
    {
        name: "VOLCANO",
        rarity: 7000, // Rare fire biome
        duration: 660, // 11 minutes
        multiplier: 6,
        color: "#ff4500", // Lava orange-red
        type: "biome",
        canOverride: true
    },
    {
        name: "VOID",
        rarity: 10000, // Very rare dark biome
        duration: 480, // 8 minutes
        multiplier: 8,
        color: "#1e1b4b", // Deep dark purple
        type: "biome",
        canOverride: true
    },
    {
        name: "SKY",
        rarity: 2000, // Moderate rarity sky biome
        duration: 720, // 12 minutes
        multiplier: 5,
        color: "#87CEEB", // Sky blue
        type: "weather",
        canOverride: true
    },
    {
        name: "CHARGED",
        rarity: 5500, // Electric storm biome
        duration: 600, // 10 minutes
        multiplier: 6,
        color: "#fbbf24", // Electric yellow
        type: "weather",
        canOverride: true
    },
    {
        name: "BIOLUMINESCENT",
        rarity: 10000, // Glowing bio-light biome
        duration: 600, // 10 minutes
        multiplier: 6,
        color: "#00FFFF", // Cyan bioluminescence
        type: "biome",
        canOverride: true
    },
    {
        name: "ANCIENT",
        rarity: 9000, // Ancient ruins biome
        duration: 660, // 11 minutes
        multiplier: 6,
        color: "#C2B280", // Sandstone/ancient gold
        type: "biome",
        canOverride: true
    },
    {
        name: "HALLOW",
        rarity: 8000, // Holy counterpart to Corruption
        duration: 660, // 11 minutes
        multiplier: 6,
        color: "#FF69B4", // Hot pink (Terraria Hallow theme)
        type: "biome",
        canOverride: true
    },
    {
        name: "CORRUPTION",
        rarity: 9000,
        duration: 660, // 11 minutes
        multiplier: 5,
        color: "#a855f7",
        type: "biome",
        canOverride: true
    },
    {
        name: "NULL",
        rarity: 13333,
        duration: 99, // 1 minute 39 seconds
        multiplier: 1000,
        color: "#000000",
        type: "biome",
        canOverride: true
    },
    {
        name: "GLITCHED",
        rarity: 30000,
        duration: 164, // 2 minutes 44 seconds
        multiplier: 1, // No breakthrough
        color: "#22d3ee",
        type: "biome",
        noBreakthrough: true,
        canOverride: false,
        cannotBeOverridden: true
    },
    {
        name: "DREAMSPACE",
        rarity: 5000000,
        duration: 128, // 2 minutes 8 seconds
        multiplier: 1, // No breakthrough, combines all multipliers
        color: "#ec4899",
        type: "biome",
        noBreakthrough: true,
        combinesAll: true,
        canOverride: false,
        cannotBeOverridden: true
    },
    {
        name: "PUMPKIN_MOON",
        rarity: 15000,
        duration: 720, // 12 minutes
        multiplier: 7,
        color: "#ff8c00",
        type: "halloween",
        canOverride: true
    },
    {
        name: "GRAVEYARD",
        rarity: 12000,
        duration: 660, // 11 minutes
        multiplier: 6,
        color: "#6b7280",
        type: "halloween",
        canOverride: true
    },
    {
        name: "BLOOD RAIN",
        rarity: 50000, // Really rare
        duration: 600, // 10 minutes
        multiplier: 8,
        color: "#8b0000",
        type: "halloween",
        canOverride: true
    }
];

// Time system
const TIME_CYCLE = {
    dayDuration: 300, // 5 minutes
    nightDuration: 300, // 5 minutes
    daytimeMultiplier: 10, // 10x breakthrough during day
    nighttimeMultiplier: 10 // 10x breakthrough during night
};

// Biome-exclusive auras with their native biomes
const BIOME_AURAS = {
    "NORMAL": [], // Default biome with no exclusive auras
    "WINDY": ["Wind", "Stormal", "Hurricane", "Flow", "Aviator", "Maelstrom"],
    "SNOWY": ["Glacier", "Permafrost", "Blizzard", "Santa-Frost", "Winter Fantasy", "Chillsear"],
    "BLIZZARD": ["Blizzard", "Blizzard: Whiteout", "Permafrost: Rime", "Glacier: Winterheart", "Santa-Frost: Blitzen", "Winter Fantasy: Snowfall", "Chillsear: Frostburn", "Abominable", "Abominable: Yeti"],
    "RAINY": ["Poseidon", "Sailor", "Sailor: Flying Dutchman", "Abyssal Hunter"],
    "MONSOON": ["Poseidon", "Sailor", "Sailor: Flying Dutchman", "Abyssal Hunter", "Maelstrom", "Aquatic", "Nautilus", "Lightning", "Hurricane", "Stormal", "Stormal: Eyewall", "Hurricane: Cyclone", "Hyper-Volt: Ever Storm", "Maelstrom: Vortex"],
    "SANDSTORM": ["Sand Bucket", "Gilded", "Jackpot", "Jackpot - Loser", "Anubis", "Atlas"],
    "JUNGLE": ["Natural", "Natural - Weed", "Flora", "Emerald", "Jade", "Flora: Evergreen", "Flora: Photosynthesis"],
    "VERDANT": ["Natural", "Natural: Overgrowth", "Natural - Weed", "Flora", "Flora: Evergreen", "Flora: Photosynthesis", "Emerald", "Emerald: Verdant", "Jade", "Jade: Dragon", "Moonflower: Bloom", "Watermelon", "Celestial", "Origin", "Terror", "Warlock"],
    "CRIMSON": ["Ruby", "Rage", "Rage: Heated", "Rage: Berserker", "Rage: Brawler", "Flushed", "Flushed: Lobotomy", "Ruby: Incandescent", "Bleeding", "Bleeding: Ichor", "Bloodlust", "Bloodlust: Sanguine", "Terror", "Terror: Phobia", "Nightmare Sky", "Nightmare Sky: Abyss", "Crimson", "Crimson: Flesh", "Crimson: Ichor", "Vertebrae", "Vertebrae: Spine", "Hemogoblin", "Hemogoblin: Crimson Heart", "Brain", "Crimtane", "Crimtane: Ore", "Vicious", "Vicious: Tendril"],
    "HELL": ["Diaboli", "Bleeding", "Undead", "Diaboli: Void", "Undead: Devil", "Hades", "Bloodlust"],
    "TORNADO": ["Wind", "Wind: Tempest", "Stormal", "Stormal: Eyewall", "Hurricane", "Hurricane: Cyclone", "Maelstrom", "Maelstrom: Vortex", "✿ Flow ✿", "✿ Flow ✿: Stasis", "★ AVIATOR ★", "Aviator: Fleet", "Vortex", "Vortex: Spiral", "Velocity", "Express"],
    "DUNES": ["Sand Bucket", "Sand Bucket: Castle", "Gilded", "Gilded: Midas", "Jackpot", "Jackpot: Favor", "Jackpot - Loser", "Anubis", "Anubis: Scales", "Atlas", "Atlas: A.T.L.A.S", "Atlas : Yuletide", "Mirage", "Mirage: Oasis", "Carriage: Golden"],
    "VOLCANO": ["Solar", "Solar: Solstice", "Solar: Corona", "Ash", "Ash: Phoenix", "Ash - Charcoal", "Diaboli", "Rage", "Rage: Heated", "Rage: Berserker", "Obsidian", "Obsidian: Volcanic", "Cryptfire: Inferno", "Eclipse", "Eclipse: Total", "Helios", "Helios: Radiance"],
    "VOID": ["Nihility", "Nihility: Void", "Undefined", "Undefined: Defined", "Lost Soul", "Lost Soul: Vengeful", "Lost Soul: Tormented", "Ink", "Ink: Rorschach", "Ink Leak", "Ink Leak: Flood", "Terror", "Terror: Phobia", "Terror: Nightmare", "Diaboli: Void", "Exotic: Void", "Nyctophobia: Darkness", "Arcane: Dark", "Arcane : Reversal", "Gravitational - Event Horizon"],
    "CHARGED": ["Lightning", "Lightning: Kugelblitz", "Hyper-Volt", "Hyper-Volt: Ever Storm", "Plasma", "Plasma: Ionized", "Powered", "Powered: Overclocked", "Magnetic", "Magnetic: Reverse Polarity", "Magnetic: Lodestar", "Stormal", "Stormal: Eyewall", "Watt", "Watt: Superconductor", "Zeus", "Zeus: Olympian"],
    "SKY": ["Wind", "Wind: Tempest", "★ AVIATOR ★", "Aviator: Fleet", "Starlight", "Starlight: Alpenglow", "Star Rider", "Star Rider: Nebula", "Starfish Rider: Celestial", "Celestial", "Celestial: Divine", "《Celestial: Memoria Aeternum》", "✿ Flow ✿", "✿ Flow ✿: Stasis", "Twilight", "Twilight: Iridescent Memory", "Twilight: Withering Grace", "Nightmare Sky", "Nightmare Sky: Abyss", "Nightmare Sky: Eclipse", "THE GLOCK OF THE SKY", "THE GLOCK OF THE SKY: Divine Arms"],
    "STARFALL": ["Starlight", "Star Rider", "Starfish Rider", "Comet", "Comet - Halley", "Astral", "Galaxy", "Stargazer", "Starscourge", "Sirius", "Sirius - Nebula", "Starscourge: Radiant", "Astral: Zodiac", "Astral: Legendarium", "Gargantua"],
    "METEOR_SHOWER": ["★", "★★", "★★★", "Starlight", "Star Rider", "Sidereum: Constellation", "Comet: Impactor", "Comet - Halley", "Starlight: Alpenglow", "Astral", "Astral: Zodiac", "Astral: Legendarium", "Galaxy", "Galaxy: Quasar", "Cosmos: Singularity", "Gravitational: Wormhole", "Gravitational - Event Horizon", "Celestial", "Celestial: Divine", "Stargazer", "Stargazer: Constellation", "Starscourge", "Starscourge: Radiant", "Sirius: Binary Star", "Sirius - Nebula", "Helios: Radiance"],
    "BIOLUMINESCENT": ["Luminosity", "Luminosity: Brilliant", "Starlight", "Starlight: Alpenglow", "Prism", "Prism: Spectrum", "Twilight", "Twilight: Iridescent Memory", "Twilight: Withering Grace", "Moonflower: Bloom", "Flora: Photosynthesis", "Kaleidoscope", "Kaleidoscope: Fractal", "Crystallized", "Crystallized: Geode", "Aquatic", "Nautilus", "Manta: Aetherwing", "Flow", "Flow: Stasis"],
    "ANCIENT": ["Ruins: Withered", "Apostolos", "Apostolos: Veil", "Origin", "Origin: Genesis", "Retrospective", "Retrospective: Nostalgia", "Bounded: Paradox", "Atlas", "Atlas: A.T.L.A.S", "Anubis", "Anubis: Scales", "Sentinel", "Aegis", "Prologue", "Prologue: Beginning", "Harvester", "Carriage", "Carriage: Golden", "Dullahan", "Dullahan: Headless"],
    "HALLOW": ["Divinus", "Divinus: Angel", "Crystallized", "Crystallized: Geode", "Prism", "Prism: Spectrum", "Celestial", "Celestial: Divine", "Starfish Rider: Celestial", "《Celestial: Memoria Aeternum》", "Archangel", "Archangel: Overheaven", "Archangel: Seraphim", "Sovereign", "Sovereign: Divine", "Starlight", "Starlight: Alpenglow", "Lightning", "Lightning: Kugelblitz", "Twilight: Iridescent Memory", "Good: Virtuous", "Origin"],
    "CORRUPTION": ["Hazard", "Corrosive", "Hazard: Rays", "Impeached"],
    "NULL": ["Undefined", "Shiftlock", "Nihility", "Undefined: Defined"],
    "GLITCHED": ["Fault", "Glitch", "Oppression", "Forbidden: ERROR", "Fatal Error", "Fatal Error: Exception", "Glitch: Segfault", "Undefined", "Undefined: Defined"], // These can ONLY be rolled in Glitch biome
    "DREAMSPACE": ["Dreammetric", "Dreamscape - Nightmare", "★", "★★", "★★★", "★: Supernova", "★★: Binary", "★★★: Trinary"], // These can ONLY be rolled in Dreamspace biome
    "PUMPKIN_MOON": ["PUMP : TRICKSTER", "Headless :Horseman", "PHANTASMA", "< A R A C H N O P H O B I A >", "Pumpkin", "Pumpkin: Spice", "Pumpkin: Lantern", "Autumn", "Autumn: Harvest", "Autumn: Spooky", "Gingerbread", "Gingerbread: Haunted"], // Halloween pumpkin moon auras
    "GRAVEYARD": ["Headless", "APOCALYPSE", "〔BANSHEE〕", "RAVAGE", "Lost Soul", "Lost Soul: Vengeful", "Lost Soul: Tormented", "Undead", "Undead: Devil", "Undead: Lich", "Raven", "Raven: Nevermore", "Raven: Omen", "Dullahan", "Dullahan: Headless", "Dullahan: Reaper", "Spectre", "Spectre: Poltergeist", "Spectre: Wraith", "Terror", "Terror: Phobia", "Terror: Nightmare", "Nightmare Sky", "Nightmare Sky: Abyss", "Nightmare Sky: Eclipse"], // Halloween graveyard auras
    "BLOOD_RAIN": ["Erebus", "Accursed", "MALEDICTION", "LAMENTHYR", "Bloodlust", "Bloodlust: Sanguine", "Bloodlust: Carnage", "Bleeding", "Bleeding: Ichor", "Bleeding: Hemophilia", "Crimson", "Crimson: Ichor", "Crimson: Corruption", "Vampiric", "Vampiric: Bloodmoon", "Rage", "Rage: Heated", "Rage: Bloodrage", "Ruby", "Ruby: Incandescent", "Ruby: Bloodstone", "Diaboli", "Diaboli: Void", "Diaboli: Hellspawn"] // Halloween blood rain auras
};

// Game state for biomes
const biomeState = {
    currentBiome: "NORMAL",
    biomeEndTime: null,
    isDay: true,
    timeEndTime: Date.now() + (TIME_CYCLE.dayDuration * 1000)
};

// Music state
let biomeMusicEnabled = true;

// Load music preference from localStorage
try {
    const savedMusicPref = localStorage.getItem('biomeMusicEnabled');
    if (savedMusicPref !== null) {
        biomeMusicEnabled = savedMusicPref === 'true';
    }
} catch (e) {
    console.log('Could not load music preference:', e);
}

// Biome music configuration
const BIOME_MUSIC = {
    SANDSTORM: {
        file: 'sandstorm.mp3',
        volume: 0.3,
        loop: true
    },
    GRAVEYARD: {
        file: 'graveyard.mp3',
        volume: 0.3,
        loop: true
    },
    MONSOON: {
        file: 'monsoon.mp3',
        volume: 0.3,
        loop: true
    },
    RAINY: {
        file: 'rainy.mp3',
        volume: 0.3,
        loop: true
    },
    CRIMSON: {
        file: 'crimson.mp3',
        volume: 0.3,
        loop: true
    },
    CORRUPTION: {
        file: 'corruption.mp3',
        volume: 0.3,
        loop: true
    },
    NORMAL_DAY: {
        file: 'daytime.mp3',
        volume: 0.25,
        loop: true
    },
    NORMAL_NIGHT: {
        file: 'night.mp3',
        volume: 0.25,
        loop: true
    },
    SNOWY: {
        file: 'snowy.mp3',
        volume: 0.3,
        loop: true
    },
    JUNGLE: {
        file: 'jungle.mp3',
        volume: 0.3,
        loop: true
    },
    PUMPKIN_MOON: {
        file: 'pumpkinmoon.mp3',
        volume: 0.3,
        loop: true
    },
    WINDY: {
        file: 'windy.mp3',
        volume: 0.3,
        loop: true
    },
    DREAMSPACE: {
        file: 'dreamspace.mp3',
        volume: 0.3,
        loop: true
    },
    BLOOD_RAIN: {
        file: 'bloodrain.mp3',
        volume: 0.3,
        loop: true
    },
    BLIZZARD: {
        file: 'blizzard.mp3',
        volume: 0.3,
        loop: true
    },
    GLITCHED: {
        file: 'glitched.mp3',
        volume: 0.3,
        loop: true
    },
    STARFALL: {
        file: 'starfall.mp3',
        volume: 0.3,
        loop: true
    },
    AMAZON: {
        file: 'amazon.mp3',
        volume: 0.3,
        loop: true
    },
    METEOR_SHOWER: {
        file: 'meteorshower.mp3',
        volume: 0.3,
        loop: true
    },
    HELL: {
        file: 'hell.mp3',
        volume: 0.3,
        loop: true
    },
    NULL: {
        file: 'null.mp3',
        volume: 0.3,
        loop: true
    },
    TORNADO: {
        file: 'tornado.mp3',
        volume: 0.3,
        loop: true
    },
    DUNES: {
        file: 'dunes.mp3',
        volume: 0.3,
        loop: true
    },
    VOLCANO: {
        file: 'volcano.mp3',
        volume: 0.3,
        loop: true
    },
    VOID: {
        file: 'void.mp3',
        volume: 0.3,
        loop: true
    },
    CHARGED: {
        file: 'charged.mp3',
        volume: 0.3,
        loop: true
    },
    SKY: {
        file: 'sky.mp3',
        volume: 0.3,
        loop: true
    },
    BIOLUMINESCENT: {
        file: 'bioluminescent.mp3',
        volume: 0.3,
        loop: true
    },
    ANCIENT: {
        file: 'ancient.mp3',
        volume: 0.3,
        loop: true
    },
    HALLOW: {
        file: 'hallow.mp3',
        volume: 0.3,
        loop: true
    }
    // Add more biome music here as needed
};

// Current playing biome music (using native HTML5 Audio)
let currentBiomeMusic = null;
let isFadingOut = false;

// Play biome music using native HTML5 Audio
function playBiomeMusic(biomeName) {
    console.log(`🎵 playBiomeMusic called for: ${biomeName}`);
    
    // Check if music is enabled
    if (!biomeMusicEnabled) {
        console.log('🎵 Biome music is disabled');
        // Stop any currently playing music
        if (currentBiomeMusic) {
            fadeOutAndStop(currentBiomeMusic);
        }
        return;
    }
    
    // Stop any currently playing music first (always)
    if (currentBiomeMusic) {
        console.log('🎵 Stopping previous biome music');
        fadeOutAndStop(currentBiomeMusic);
    }
    
    // Normalize biome name (replace spaces with underscores for lookup)
    let musicKey = biomeName.replace(/ /g, '_');
    
    // Special handling for NORMAL biome - use day/night music
    if (biomeName === 'NORMAL') {
        musicKey = biomeState.isDay ? 'NORMAL_DAY' : 'NORMAL_NIGHT';
        console.log(`🎵 NORMAL biome - using ${biomeState.isDay ? 'DAY' : 'NIGHT'} music`);
    }
    
    // Get music config for this biome
    const musicConfig = BIOME_MUSIC[musicKey];
    if (!musicConfig) {
        console.log(`ℹ️ No music configured for biome: ${biomeName} - music stopped`);
        return;
    }
    
    console.log(`🎵 Found music config:`, musicConfig);
    
    // Check if music is enabled in settings
    if (typeof gameState !== 'undefined' && gameState.settings?.music?.enabled === false) {
        console.log('🔇 Music is disabled in settings');
        return;
    }
    
    // Get volume from settings (default to 30% if not set)
    const targetVolume = (typeof gameState !== 'undefined' && gameState.settings?.music?.volume) 
        ? gameState.settings.music.volume 
        : (musicConfig.volume || 0.3);
    
    try {
        // Create new Audio element
        console.log(`🎵 Creating Audio element for ${musicConfig.file}`);
        currentBiomeMusic = new Audio(musicConfig.file);
        currentBiomeMusic.id = 'biomeMusic'; // Set ID for particle sync
        currentBiomeMusic.loop = musicConfig.loop;
        currentBiomeMusic.volume = 0; // Start at 0 for fade in
        
        // Add to DOM so particle system can find it
        currentBiomeMusic.style.display = 'none';
        document.body.appendChild(currentBiomeMusic);
        
        // Add event listeners
        currentBiomeMusic.addEventListener('canplaythrough', () => {
            console.log(`✅ Loaded biome music: ${biomeName} (${musicConfig.file})`);
        }, { once: true });
        
        currentBiomeMusic.addEventListener('error', (e) => {
            console.error(`❌ Failed to load biome music: ${musicConfig.file}`, e);
        });
        
        currentBiomeMusic.addEventListener('playing', () => {
            console.log(`▶️ Now playing: ${biomeName}`);
            
            // Notify particle system to connect to audio
            if (typeof connectBiomeAudio === 'function') {
                setTimeout(() => {
                    connectBiomeAudio();
                }, 100); // Small delay to ensure audio is ready
            }
        }, { once: true });
        
        // Play the audio
        const playPromise = currentBiomeMusic.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log(`🎵 Successfully started playback for ${biomeName}`);
                    // Fade in
                    fadeIn(currentBiomeMusic, targetVolume, 2000);
                })
                .catch(error => {
                    console.error(`❌ Failed to play biome music:`, error);
                    // If autoplay was blocked, try again on next user interaction
                    if (error.name === 'NotAllowedError') {
                        console.log('⚠️ Autoplay blocked - will try again on next user click');
                        const retryPlay = () => {
                            currentBiomeMusic.play()
                                .then(() => {
                                    console.log('✅ Music started after user interaction');
                                    fadeIn(currentBiomeMusic, targetVolume, 2000);
                                })
                                .catch(e => console.error('Still failed:', e));
                            document.removeEventListener('click', retryPlay);
                        };
                        document.addEventListener('click', retryPlay, { once: true });
                    }
                });
        }
    } catch (error) {
        console.error('❌ Error creating biome music:', error);
    }
}

// Fade in audio
function fadeIn(audio, targetVolume, duration) {
    const steps = 50;
    const stepTime = duration / steps;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;
    
    const fadeInterval = setInterval(() => {
        currentStep++;
        audio.volume = Math.min(volumeStep * currentStep, targetVolume);
        
        if (currentStep >= steps) {
            clearInterval(fadeInterval);
            audio.volume = targetVolume;
        }
    }, stepTime);
}

// Fade out and stop audio
function fadeOutAndStop(audio) {
    if (!audio || isFadingOut) return;
    
    isFadingOut = true;
    const startVolume = audio.volume;
    const steps = 30;
    const stepTime = 1000 / steps;
    const volumeStep = startVolume / steps;
    let currentStep = 0;
    
    const fadeInterval = setInterval(() => {
        currentStep++;
        audio.volume = Math.max(startVolume - (volumeStep * currentStep), 0);
        
        if (currentStep >= steps || audio.volume <= 0) {
            clearInterval(fadeInterval);
            audio.pause();
            audio.currentTime = 0;
            audio.src = '';
            // Remove from DOM
            if (audio.parentElement) {
                audio.parentElement.removeChild(audio);
            }
            isFadingOut = false;
            if (currentBiomeMusic === audio) {
                currentBiomeMusic = null;
            }
        }
    }, stepTime);
}

// Stop biome music
function stopBiomeMusic() {
    if (currentBiomeMusic) {
        console.log('🎵 Stopping biome music');
        fadeOutAndStop(currentBiomeMusic);
    }
}

// Pause biome music (for cutscenes)
let pausedMusicVolume = 0;
function pauseBiomeMusic() {
    if (currentBiomeMusic && !currentBiomeMusic.paused) {
        console.log('🎵 Pausing biome music for cutscene');
        pausedMusicVolume = currentBiomeMusic.volume;
        
        // Fade out quickly
        const startVolume = currentBiomeMusic.volume;
        const steps = 20;
        const stepTime = 500 / steps;
        let currentStep = 0;
        
        const fadeInterval = setInterval(() => {
            currentStep++;
            currentBiomeMusic.volume = Math.max(startVolume - ((startVolume / steps) * currentStep), 0);
            
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                currentBiomeMusic.pause();
            }
        }, stepTime);
    }
}

// Resume biome music (after cutscenes)
function resumeBiomeMusic() {
    if (currentBiomeMusic && currentBiomeMusic.paused) {
        console.log('🎵 Resuming biome music after cutscene');
        currentBiomeMusic.play();
        
        // Fade in
        currentBiomeMusic.volume = 0;
        const targetVolume = pausedMusicVolume || 0.3;
        const steps = 30;
        const stepTime = 1500 / steps;
        let currentStep = 0;
        
        const fadeInterval = setInterval(() => {
            currentStep++;
            currentBiomeMusic.volume = Math.min((targetVolume / steps) * currentStep, targetVolume);
            
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                currentBiomeMusic.volume = targetVolume;
            }
        }, stepTime);
    }
}

// Initialize biome system
function initBiomeSystem() {
    console.log('Initializing biome system...');
    loadBiomeState(); // Load saved state first
    startBiomeRoller();
    startTimeSystem();
    updateBiomeDisplay();
    
    // Play music for current biome on page load
    playBiomeMusic(biomeState.currentBiome);
}

// Start biome roller (rolls every second)
function startBiomeRoller() {
    setInterval(() => {
        // Check if admin has locked the biome
        if (biomeState.lockedByAdmin && biomeState.adminLockEndTime) {
            if (Date.now() < biomeState.adminLockEndTime) {
                return; // Don't change biome while admin locked
            } else {
                // Lock expired
                biomeState.lockedByAdmin = false;
                delete biomeState.adminLockEndTime;
            }
        }
        
        // Check if current biome has ended
        if (biomeState.biomeEndTime && Date.now() >= biomeState.biomeEndTime) {
            setBiome("NORMAL");
        }
        
        // Get current biome data
        const currentBiome = BIOMES.find(b => b.name === biomeState.currentBiome);
        
        // Check if current biome can be overridden
        const canBeOverridden = !currentBiome || !currentBiome.cannotBeOverridden;
        
        // Don't roll for new biome if current one cannot be overridden
        if (!canBeOverridden) {
            return;
        }
        
        // Roll for biome
        for (let biome of BIOMES) {
            if (biome.name === "NORMAL") continue;
            if (biome.name === biomeState.currentBiome) continue;
            
            const chance = 1 / biome.rarity;
            if (Math.random() < chance) {
                // Check if this biome can override the current one
                if (biome.canOverride || biomeState.currentBiome === "NORMAL") {
                    setBiome(biome.name);
                    break;
                }
            }
        }
    }, 1000);
}

// Set active biome
function setBiome(biomeName) {
    const biome = BIOMES.find(b => b.name === biomeName);
    if (!biome) return;
    
    biomeState.currentBiome = biomeName;
    
    if (biome.duration > 0) {
        biomeState.biomeEndTime = Date.now() + (biome.duration * 1000);
    } else {
        biomeState.biomeEndTime = null;
    }
    
    // Save to localStorage
    saveBiomeState();
    
    // Track biome for achievements
    if (typeof trackBiomeSeen === 'function') {
        trackBiomeSeen(biomeName);
    }
    
    // Track biome visits for new achievements
    if (typeof trackBiomeVisit === 'function') {
        trackBiomeVisit(biomeName);
    }
    
    // Sync to gameState for gameLogic access
    if (typeof gameState !== 'undefined') {
        gameState.currentBiome = biomeName;
    }
    
    // Send biome change notification (desktop/Discord)
    if (biomeName !== 'NORMAL' && typeof sendBiomeChangeNotification === 'function') {
        sendBiomeChangeNotification(biomeName);
    }
    
    // Track for leaderboards
    if (typeof leaderboardStats !== 'undefined') {
        leaderboardStats.trackBiome(biomeName);
    }
    
    // Track biome discovery in codex
    if (typeof discoverCodexEntry === 'function') {
        discoverCodexEntry('biomes', biomeName);
    }
    
    // Check daily quest progress
    if (typeof checkDailyQuestProgress === 'function') {
        checkDailyQuestProgress();
    }
    
    updateBiomeDisplay();
    applyBiomeVisuals(biome);
    
    // Play biome music (including day/night music for NORMAL)
    playBiomeMusic(biomeName);
    
    // Show notification
    if (biomeName !== "NORMAL") {
        showBiomeNotification(biome);
    }
    
    console.log(`Biome changed to: ${biomeName}`);
}

// Time system (day/night cycle)
function startTimeSystem() {
    setInterval(() => {
        if (Date.now() >= biomeState.timeEndTime) {
            // Switch between day and night
            biomeState.isDay = !biomeState.isDay;
            const duration = biomeState.isDay ? TIME_CYCLE.dayDuration : TIME_CYCLE.nightDuration;
            biomeState.timeEndTime = Date.now() + (duration * 1000);
            
            // Save time state
            saveBiomeState();
            
            updateBiomeDisplay();
            applyTimeTint();
            console.log(`Time changed to: ${biomeState.isDay ? 'DAY' : 'NIGHT'}`);
            
            // Update music for day/night transition in NORMAL biome
            if (biomeState.currentBiome === 'NORMAL') {
                playBiomeMusic('NORMAL');
            }
            
            // Handle Halloween biome spawning (night only)
            if (!biomeState.isDay) {
                checkHalloweenBiomeSpawn();
            }
            
            // Handle Bounty Hunter Jack spawning (night only)
            if (typeof handleBountyJackSpawn === 'function') {
                handleBountyJackSpawn();
            }
        }
    }, 1000);
}

// Check for Halloween biome spawning when night begins
function checkHalloweenBiomeSpawn() {
    // Don't spawn if a biome is locked by rune or if it's a special biome
    if (biomeState.lockedByRune) return;
    
    const currentBiome = BIOMES.find(b => b.name === biomeState.currentBiome);
    if (currentBiome && currentBiome.cannotBeOverridden) return;
    
    // Roll for each Halloween biome with specific night-time chances
    const halloweenChances = [
        { name: 'PUMPKIN_MOON', chance: 1/5, priority: 2 },    // 20% chance (1 in 5)
        { name: 'GRAVEYARD', chance: 1/5, priority: 2 },       // 20% chance (1 in 5)
        { name: 'BLOOD_RAIN', chance: 1/20, priority: 1 }      // 5% chance (1 in 20)
    ];
    
    // Sort by priority (Blood Rain checked first since it's rarest)
    halloweenChances.sort((a, b) => a.priority - b.priority);
    
    for (const biomeCheck of halloweenChances) {
        if (Math.random() < biomeCheck.chance) {
            const biome = BIOMES.find(b => b.name === biomeCheck.name);
            if (biome) {
                setBiome(biome.name);
                console.log(`🎃 ${biome.name} spawned at nightfall! (${Math.round(biomeCheck.chance * 100)}% chance)`);
                return; // Only spawn one Halloween biome per night
            }
        }
    }
    
    console.log('🌙 No Halloween biome spawned this night');
}

// Get current breakthrough multiplier
function getBreakthroughMultiplier() {
    const biome = BIOMES.find(b => b.name === biomeState.currentBiome);
    if (!biome) return 1;
    
    let multiplier = biome.multiplier;
    
    // Add time multiplier
    const timeMultiplier = biomeState.isDay ? TIME_CYCLE.daytimeMultiplier : TIME_CYCLE.nighttimeMultiplier;
    
    // DREAMSPACE combines all multipliers
    if (biome.combinesAll) {
        multiplier = BIOMES.reduce((sum, b) => sum + (b.multiplier || 1), 0);
    }
    
    return multiplier * timeMultiplier;
}

// Check if aura gets biome boost
function getAuraBiomeMultiplier(auraName) {
    // Check if player has an active rune for this aura (native rarity override)
    if (typeof shouldUseNativeRarityForAura === 'function' && shouldUseNativeRarityForAura(auraName)) {
        // Rune is active - no breakthrough penalty, roll at native (1x) rarity
        return 1;
    }
    
    // Check if this aura is exclusive to the current biome
    const biomeAuras = BIOME_AURAS[biomeState.currentBiome];
    if (biomeAuras && biomeAuras.includes(auraName)) {
        const biome = BIOMES.find(b => b.name === biomeState.currentBiome);
        return biome ? biome.multiplier : 1;
    }
    
    // Check if this aura is exclusive to another biome (breakthrough penalty)
    for (let [biomeName, auras] of Object.entries(BIOME_AURAS)) {
        if (auras.includes(auraName) && biomeName !== biomeState.currentBiome) {
            const biome = BIOMES.find(b => b.name === biomeName);
            if (biome && !biome.noBreakthrough) {
                // Breakthrough - aura is harder to get outside its biome
                return 1 / biome.multiplier;
            }
        }
    }
    
    return 1;
}

// Update biome display
function updateBiomeDisplay() {
    const biomeDisplay = document.getElementById('biomeDisplay');
    const timeDisplay = document.getElementById('timeDisplay');
    
    if (!biomeDisplay || !timeDisplay) return;
    
    const biome = BIOMES.find(b => b.name === biomeState.currentBiome);
    
    // Update biome
    if (biome) {
        let timeText = '';
        if (biomeState.biomeEndTime) {
            const remaining = Math.max(0, biomeState.biomeEndTime - Date.now());
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            timeText = ` - ${minutes}m ${seconds}s`;
        }
        
        biomeDisplay.innerHTML = `
            <div style="color: ${biome.color}; font-weight: bold;">
                ${biome.name}${timeText}
            </div>
            <div style="font-size: 0.9em; opacity: 0.8;">
                ${biome.multiplier}x Multiplier
            </div>
        `;
    }
    
    // Update time
    const timeRemaining = Math.max(0, biomeState.timeEndTime - Date.now());
    const timeMinutes = Math.floor(timeRemaining / 60000);
    const timeSeconds = Math.floor((timeRemaining % 60000) / 1000);
    const timeMultiplier = biomeState.isDay ? TIME_CYCLE.daytimeMultiplier : TIME_CYCLE.nighttimeMultiplier;
    
    timeDisplay.innerHTML = `
        <div style="font-weight: bold;">
            ${biomeState.isDay ? '☀️ DAYTIME' : '🌙 NIGHTTIME'}
        </div>
        <div style="font-size: 0.9em; opacity: 0.8;">
            ${timeMinutes}m ${timeSeconds}s - ${timeMultiplier}x BT
        </div>
    `;
}

// Show biome notification
function showBiomeNotification(biome) {
    const notification = document.getElementById('itemSpawnNotification');
    notification.style.background = `linear-gradient(135deg, ${biome.color} 0%, ${biome.color}dd 100%)`;
    notification.textContent = `🌍 ${biome.name} biome has spawned!`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        notification.style.background = 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)';
    }, 5000);
}

// Apply visual effects for biome with anime.js
function applyBiomeVisuals(biome) {
    const body = document.body;
    
    // Remove all biome classes
    body.className = body.className.replace(/biome-[\w-]+/g, '').trim();
    
    // Add biome class (replace spaces with hyphens for valid CSS class)
    const biomeCssClass = `biome-${biome.name.toLowerCase().replace(/ /g, '-')}`;
    body.classList.add(biomeCssClass);
    
    // Update UI colors
    updateUIColors(biome);
    
    // Apply biome-specific visual effects
    applyBiomeStaticEffects(biome.name);
}

// Apply cool static effects for each biome
function applyBiomeStaticEffects(biomeName) {
    const body = document.body;
    
    // Remove existing biome effects overlay
    let effectsOverlay = document.getElementById('biomeEffectsOverlay');
    if (!effectsOverlay) {
        effectsOverlay = document.createElement('div');
        effectsOverlay.id = 'biomeEffectsOverlay';
        effectsOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        document.body.prepend(effectsOverlay);
    }
    
    // Clear previous effects
    effectsOverlay.innerHTML = '';
    body.style.filter = '';
    
    // Apply biome-specific effects
    const effects = {
        WINDY: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 200%;
                height: 100%;
                background: linear-gradient(90deg, transparent 0%, rgba(165, 243, 252, 0.1) 50%, transparent 100%);
                animation: windSweep 3s ease-in-out infinite;
            "></div>`;
            body.style.filter = 'brightness(1.1)';
        },
        SNOWY: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: 
                    radial-gradient(2px 2px at 20% 30%, white, transparent),
                    radial-gradient(2px 2px at 60% 70%, white, transparent),
                    radial-gradient(1px 1px at 50% 50%, white, transparent),
                    radial-gradient(1px 1px at 80% 10%, white, transparent),
                    radial-gradient(2px 2px at 90% 60%, white, transparent),
                    radial-gradient(1px 1px at 33% 80%, white, transparent);
                background-size: 200% 200%;
                animation: snowfall 20s linear infinite;
                opacity: 0.6;
            "></div>`;
            body.style.filter = 'brightness(1.15) contrast(1.1)';
        },
        BLIZZARD: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: 
                    linear-gradient(45deg, transparent 30%, rgba(191, 219, 254, 0.3) 50%, transparent 70%),
                    radial-gradient(circle, rgba(191, 219, 254, 0.1) 0%, transparent 50%);
                animation: blizzardWind 2s ease-in-out infinite;
            "></div>`;
            body.style.filter = 'brightness(1.2) blur(0.5px)';
        },
        RAINY: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: linear-gradient(transparent 50%, rgba(125, 211, 252, 0.1) 50%);
                background-size: 2px 10px;
                animation: rainfall 0.3s linear infinite;
            "></div>`;
            body.style.filter = 'brightness(0.9) saturate(1.2)';
        },
        MONSOON: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: linear-gradient(transparent 50%, rgba(30, 64, 175, 0.15) 50%);
                background-size: 1px 15px;
                animation: heavyRain 0.2s linear infinite;
            "></div>`;
            body.style.filter = 'brightness(0.75) contrast(1.3)';
        },
        SANDSTORM: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: linear-gradient(120deg, transparent, rgba(251, 191, 36, 0.2), transparent);
                animation: sandWaves 4s ease-in-out infinite;
            "></div>`;
            body.style.filter = 'sepia(0.3) brightness(1.1)';
        },
        HELL: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at 50% 100%, rgba(239, 68, 68, 0.3) 0%, transparent 70%);
                animation: hellPulse 2s ease-in-out infinite;
            "></div>`;
            body.style.filter = 'brightness(0.9) saturate(1.4) hue-rotate(-10deg)';
        },
        STARFALL: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: 
                    radial-gradient(1px 1px at 10% 20%, rgba(252, 211, 77, 0.9), transparent),
                    radial-gradient(1px 1px at 50% 50%, rgba(252, 211, 77, 0.9), transparent),
                    radial-gradient(2px 2px at 80% 30%, rgba(252, 211, 77, 0.9), transparent);
                animation: starTwinkle 3s ease-in-out infinite;
            "></div>`;
            body.style.filter = 'brightness(1.2) contrast(1.1)';
        },
        GLITCHED: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(34, 211, 238, 0.03) 2px,
                    rgba(34, 211, 238, 0.03) 4px
                );
                animation: glitchShift 0.1s infinite;
            "></div>`;
            body.style.filter = 'saturate(1.3)';
        },
        VOID: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.5) 100%);
                animation: voidPulse 4s ease-in-out infinite;
            "></div>`;
            body.style.filter = 'brightness(0.7) contrast(1.5)';
        },
        CORRUPTION: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: radial-gradient(ellipse at 30% 50%, rgba(168, 85, 247, 0.2), transparent),
                             radial-gradient(ellipse at 70% 50%, rgba(147, 51, 234, 0.2), transparent);
                animation: corruptionPulse 3s ease-in-out infinite alternate;
            "></div>`;
            body.style.filter = 'saturate(1.3) hue-rotate(5deg)';
        },
        PUMPKIN_MOON: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.3) 0%, transparent 20%);
            "></div>`;
            body.style.filter = 'brightness(1.1) saturate(1.2) hue-rotate(-5deg)';
        },
        GRAVEYARD: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
            "></div>`;
            body.style.filter = 'brightness(0.85) grayscale(0.2)';
        },
        VOLCANO: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: radial-gradient(ellipse at 50% 100%, rgba(255, 69, 0, 0.3), transparent);
                animation: volcanoGlow 2.5s ease-in-out infinite;
            "></div>`;
            body.style.filter = 'brightness(1.1) saturate(1.4) hue-rotate(-15deg)';
        },
        BIOLUMINESCENT: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: 
                    radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.2) 0%, transparent 10%),
                    radial-gradient(circle at 80% 60%, rgba(127, 255, 212, 0.2) 0%, transparent 10%),
                    radial-gradient(circle at 50% 40%, rgba(0, 206, 209, 0.2) 0%, transparent 10%);
                animation: biolumGlow 4s ease-in-out infinite;
            "></div>`;
            body.style.filter = 'brightness(1.2) saturate(1.5)';
        },
        BLOOD_RAIN: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: linear-gradient(transparent 50%, rgba(139, 0, 0, 0.15) 50%);
                background-size: 2px 12px;
                animation: bloodFall 0.25s linear infinite;
            "></div>`;
            body.style.filter = 'brightness(0.8) saturate(1.4) hue-rotate(-10deg)';
        },
        CHARGED: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, transparent 0%, rgba(251, 191, 36, 0.1) 50%, transparent 100%);
                animation: lightning 4s ease-in-out infinite;
            "></div>`;
            body.style.filter = 'brightness(1.15) saturate(1.3)';
        },
        HALLOW: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: 
                    radial-gradient(circle at 30% 30%, rgba(255, 105, 180, 0.2) 0%, transparent 15%),
                    radial-gradient(circle at 70% 60%, rgba(0, 206, 209, 0.2) 0%, transparent 15%),
                    radial-gradient(circle at 50% 80%, rgba(255, 105, 180, 0.15) 0%, transparent 20%);
                animation: hallowGlow 3s ease-in-out infinite alternate;
            "></div>`;
            body.style.filter = 'brightness(1.15) saturate(1.4) contrast(1.1)';
        },
        JUNGLE: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: linear-gradient(180deg, rgba(34, 197, 94, 0.1) 0%, transparent 50%);
            "></div>`;
            body.style.filter = 'brightness(1.05) saturate(1.3) hue-rotate(5deg)';
        },
        AMAZON: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: 
                    radial-gradient(ellipse at 20% 40%, rgba(5, 150, 105, 0.15) 0%, transparent 30%),
                    radial-gradient(ellipse at 80% 70%, rgba(4, 120, 87, 0.15) 0%, transparent 30%);
                animation: jungleMist 5s ease-in-out infinite alternate;
            "></div>`;
            body.style.filter = 'brightness(0.95) saturate(1.4) contrast(1.1)';
        },
        CRIMSON: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: radial-gradient(ellipse at 50% 50%, rgba(220, 20, 60, 0.2) 0%, transparent 60%);
                animation: crimsonPulse 2.5s ease-in-out infinite;
            "></div>`;
            body.style.filter = 'brightness(0.95) saturate(1.5) hue-rotate(-5deg)';
        },
        METEOR_SHOWER: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: 
                    linear-gradient(135deg, transparent 0%, rgba(245, 158, 11, 0.3) 45%, transparent 50%),
                    linear-gradient(120deg, transparent 70%, rgba(234, 88, 12, 0.3) 90%, transparent 95%);
                animation: meteorStreak 4s ease-in-out infinite;
            "></div>`;
            body.style.filter = 'brightness(1.1) saturate(1.3) contrast(1.1)';
        },
        TORNADO: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.2), transparent);
                animation: tornadoSpin 2s linear infinite;
            "></div>`;
            body.style.filter = 'brightness(0.9) saturate(0.8) blur(0.3px)';
        },
        DUNES: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 20px,
                    rgba(245, 158, 11, 0.05) 20px,
                    rgba(245, 158, 11, 0.05) 40px
                );
                animation: duneShift 8s ease-in-out infinite;
            "></div>`;
            body.style.filter = 'sepia(0.2) brightness(1.1)';
        },
        SKY: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: 
                    radial-gradient(circle at 60% 30%, rgba(135, 206, 235, 0.15) 0%, transparent 40%),
                    linear-gradient(180deg, rgba(79, 195, 247, 0.1) 0%, transparent 60%);
            "></div>`;
            body.style.filter = 'brightness(1.15) saturate(1.2)';
        },
        ANCIENT: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: 
                    repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 100px,
                        rgba(194, 178, 128, 0.03) 100px,
                        rgba(194, 178, 128, 0.03) 101px
                    );
            "></div>`;
            body.style.filter = 'sepia(0.4) brightness(1.05) contrast(1.1)';
        },
        NULL: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at 50% 50%, transparent 20%, rgba(0, 0, 0, 0.8) 100%);
                animation: nullVoid 3s ease-in-out infinite alternate;
            "></div>`;
            body.style.filter = 'brightness(0.5) contrast(1.3) grayscale(0.8)';
        },
        DREAMSPACE: () => {
            effectsOverlay.innerHTML = `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: 
                    radial-gradient(ellipse at 40% 40%, rgba(236, 72, 153, 0.15) 0%, transparent 40%),
                    radial-gradient(ellipse at 60% 60%, rgba(168, 85, 247, 0.15) 0%, transparent 40%);
                animation: dreamFloat 6s ease-in-out infinite alternate;
            "></div>`;
            body.style.filter = 'brightness(1.1) saturate(1.4) blur(0.3px)';
        }
    };
    
    // Apply effect if it exists, otherwise use default
    if (effects[biomeName]) {
        effects[biomeName]();
    }
    
    // Add animations if they don't exist
    if (!document.getElementById('biomeAnimations')) {
        const style = document.createElement('style');
        style.id = 'biomeAnimations';
        style.textContent = `
            @keyframes windSweep { 0%, 100% { transform: translateX(-50%); } 50% { transform: translateX(0%); } }
            @keyframes snowfall { 0% { background-position: 0% 0%; } 100% { background-position: 10% 100%; } }
            @keyframes blizzardWind { 0%, 100% { transform: translateX(-5px); } 50% { transform: translateX(5px); } }
            @keyframes rainfall { 0% { background-position: 0 0; } 100% { background-position: 0 100%; } }
            @keyframes heavyRain { 0% { background-position: 0 0; } 100% { background-position: 0 100%; } }
            @keyframes sandWaves { 0%, 100% { transform: translateX(-20px); opacity: 0.5; } 50% { transform: translateX(20px); opacity: 0.8; } }
            @keyframes hellPulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
            @keyframes starTwinkle { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
            @keyframes glitchShift { 0% { transform: translateX(0); } 25% { transform: translateX(-2px); } 50% { transform: translateX(2px); } 75% { transform: translateX(-1px); } 100% { transform: translateX(0); } }
            @keyframes voidPulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
            @keyframes corruptionPulse { 0% { opacity: 0.6; } 100% { opacity: 1; } }
            @keyframes volcanoGlow { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
            @keyframes biolumGlow { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
            @keyframes bloodFall { 0% { background-position: 0 0; } 100% { background-position: 0 100%; } }
            @keyframes lightning { 0%, 90%, 100% { opacity: 0.3; } 95% { opacity: 1; } }
            @keyframes hallowGlow { 0% { opacity: 0.7; transform: scale(1); } 100% { opacity: 1; transform: scale(1.05); } }
            @keyframes jungleMist { 0% { opacity: 0.7; } 100% { opacity: 1; } }
            @keyframes crimsonPulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
            @keyframes meteorStreak { 0% { transform: translate(-100%, -100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translate(100%, 100%); opacity: 0; } }
            @keyframes tornadoSpin { 0% { transform: translateX(-50%) rotate(0deg); } 100% { transform: translateX(50%) rotate(360deg); } }
            @keyframes duneShift { 0%, 100% { transform: translateX(-10px); } 50% { transform: translateX(10px); } }
            @keyframes nullVoid { 0% { opacity: 0.8; } 100% { opacity: 1; } }
            @keyframes dreamFloat { 0% { opacity: 0.6; transform: translateY(0px); } 100% { opacity: 1; transform: translateY(-10px); } }
        `;
        document.head.appendChild(style);
    }
}

// Biome color schemes for UI
const BIOME_UI_COLORS = {
    NORMAL: {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#4ade80',
        glow: 'rgba(102, 126, 234, 0.3)',
        headerGradient: 'linear-gradient(135deg, rgba(30, 30, 50, 0.9) 0%, rgba(20, 20, 40, 0.8) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(30, 30, 50, 0.9) 0%, rgba(20, 20, 40, 0.85) 100%)'
    },
    WINDY: {
        primary: '#a5f3fc',
        secondary: '#67e8f9',
        accent: '#06b6d4',
        glow: 'rgba(165, 243, 252, 0.4)',
        headerGradient: 'linear-gradient(135deg, rgba(20, 40, 50, 0.9) 0%, rgba(10, 30, 45, 0.8) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(25, 50, 65, 0.9) 0%, rgba(15, 40, 55, 0.85) 100%)'
    },
    SNOWY: {
        primary: '#e0f2fe',
        secondary: '#bae6fd',
        accent: '#7dd3fc',
        glow: 'rgba(224, 242, 254, 0.4)',
        headerGradient: 'linear-gradient(135deg, rgba(30, 40, 55, 0.9) 0%, rgba(25, 35, 50, 0.8) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(35, 50, 70, 0.9) 0%, rgba(25, 40, 60, 0.85) 100%)'
    },
    BLIZZARD: {
        primary: '#bfdbfe',
        secondary: '#93c5fd',
        accent: '#60a5fa',
        glow: 'rgba(191, 219, 254, 0.5)',
        headerGradient: 'linear-gradient(135deg, rgba(25, 35, 65, 0.95) 0%, rgba(20, 30, 55, 0.9) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(30, 45, 80, 0.95) 0%, rgba(25, 40, 70, 0.9) 100%)'
    },
    RAINY: {
        primary: '#7dd3fc',
        secondary: '#0ea5e9',
        accent: '#0284c7',
        glow: 'rgba(125, 211, 252, 0.4)',
        headerGradient: 'linear-gradient(135deg, rgba(15, 30, 50, 0.9) 0%, rgba(10, 25, 45, 0.8) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(20, 40, 65, 0.9) 0%, rgba(15, 35, 60, 0.85) 100%)'
    },
    MONSOON: {
        primary: '#1e40af',
        secondary: '#1e3a8a',
        accent: '#1d4ed8',
        glow: 'rgba(30, 64, 175, 0.6)',
        headerGradient: 'linear-gradient(135deg, rgba(10, 25, 60, 0.95) 0%, rgba(5, 20, 50, 0.9) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(15, 35, 70, 0.95) 0%, rgba(10, 30, 65, 0.9) 100%)'
    },
    SANDSTORM: {
        primary: '#fbbf24',
        secondary: '#f59e0b',
        accent: '#d97706',
        glow: 'rgba(251, 191, 36, 0.4)',
        headerGradient: 'linear-gradient(135deg, rgba(50, 40, 20, 0.9) 0%, rgba(40, 30, 15, 0.8) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(60, 50, 30, 0.9) 0%, rgba(50, 40, 25, 0.85) 100%)'
    },
    JUNGLE: {
        primary: '#22c55e',
        secondary: '#16a34a',
        accent: '#15803d',
        glow: 'rgba(34, 197, 94, 0.4)',
        headerGradient: 'linear-gradient(135deg, rgba(20, 50, 30, 0.9) 0%, rgba(15, 40, 25, 0.8) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(25, 60, 35, 0.9) 0%, rgba(20, 50, 30, 0.85) 100%)'
    },
    AMAZON: {
        primary: '#059669',
        secondary: '#047857',
        accent: '#065f46',
        glow: 'rgba(5, 150, 105, 0.5)',
        headerGradient: 'linear-gradient(135deg, rgba(15, 60, 35, 0.95) 0%, rgba(10, 50, 30, 0.9) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(20, 70, 40, 0.95) 0%, rgba(15, 60, 35, 0.9) 100%)'
    },
    CRIMSON: {
        primary: '#dc143c',
        secondary: '#b91c1c',
        accent: '#7f1d1d',
        glow: 'rgba(220, 20, 60, 0.5)',
        headerGradient: 'linear-gradient(135deg, rgba(60, 15, 20, 0.9) 0%, rgba(50, 10, 15, 0.8) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(70, 20, 25, 0.9) 0%, rgba(60, 15, 20, 0.85) 100%)'
    },
    STARFALL: {
        primary: '#fcd34d',
        secondary: '#fbbf24',
        accent: '#f59e0b',
        glow: 'rgba(252, 211, 77, 0.5)',
        headerGradient: 'linear-gradient(135deg, rgba(30, 25, 50, 0.9) 0%, rgba(25, 20, 45, 0.8) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(35, 30, 60, 0.9) 0%, rgba(30, 25, 55, 0.85) 100%)'
    },
    METEOR_SHOWER: {
        primary: '#f59e0b',
        secondary: '#d97706',
        accent: '#ea580c',
        glow: 'rgba(245, 158, 11, 0.6)',
        headerGradient: 'linear-gradient(135deg, rgba(40, 30, 20, 0.95) 0%, rgba(35, 25, 15, 0.9) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(50, 40, 30, 0.95) 0%, rgba(45, 35, 25, 0.9) 100%)'
    },
    HELL: {
        primary: '#ef4444',
        secondary: '#dc2626',
        accent: '#991b1b',
        glow: 'rgba(239, 68, 68, 0.5)',
        headerGradient: 'linear-gradient(135deg, rgba(50, 20, 20, 0.9) 0%, rgba(40, 15, 15, 0.8) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(60, 25, 25, 0.9) 0%, rgba(50, 20, 20, 0.85) 100%)'
    },
    TORNADO: {
        primary: '#94a3b8',
        secondary: '#64748b',
        accent: '#475569',
        glow: 'rgba(148, 163, 184, 0.5)',
        headerGradient: 'linear-gradient(135deg, rgba(30, 35, 40, 0.95) 0%, rgba(25, 30, 35, 0.9) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(40, 45, 50, 0.95) 0%, rgba(35, 40, 45, 0.9) 100%)'
    },
    DUNES: {
        primary: '#f59e0b',
        secondary: '#d97706',
        accent: '#b45309',
        glow: 'rgba(245, 158, 11, 0.4)',
        headerGradient: 'linear-gradient(135deg, rgba(50, 40, 20, 0.9) 0%, rgba(45, 35, 15, 0.85) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(60, 50, 30, 0.9) 0%, rgba(55, 45, 25, 0.85) 100%)'
    },
    VOLCANO: {
        primary: '#ff4500',
        secondary: '#ff6347',
        accent: '#dc2626',
        glow: 'rgba(255, 69, 0, 0.6)',
        headerGradient: 'linear-gradient(135deg, rgba(60, 20, 10, 0.95) 0%, rgba(50, 15, 5, 0.9) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(70, 30, 15, 0.95) 0%, rgba(60, 25, 10, 0.9) 100%)'
    },
    VOID: {
        primary: '#1e1b4b',
        secondary: '#312e81',
        accent: '#4c1d95',
        glow: 'rgba(30, 27, 75, 0.7)',
        headerGradient: 'linear-gradient(135deg, rgba(10, 10, 25, 0.95) 0%, rgba(5, 5, 20, 0.95) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(10, 10, 30, 0.95) 100%)'
    },
    SKY: {
        primary: '#87CEEB',
        secondary: '#4FC3F7',
        accent: '#29B6F6',
        glow: 'rgba(135, 206, 235, 0.5)',
        headerGradient: 'linear-gradient(135deg, rgba(20, 35, 60, 0.9) 0%, rgba(30, 50, 80, 0.85) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(25, 45, 75, 0.9) 0%, rgba(35, 60, 95, 0.85) 100%)'
    },
    CHARGED: {
        primary: '#fbbf24',
        secondary: '#eab308',
        accent: '#facc15',
        glow: 'rgba(251, 191, 36, 0.6)',
        headerGradient: 'linear-gradient(135deg, rgba(40, 35, 15, 0.95) 0%, rgba(35, 30, 10, 0.9) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(50, 45, 20, 0.95) 0%, rgba(45, 40, 15, 0.9) 100%)'
    },
    BIOLUMINESCENT: {
        primary: '#00FFFF',
        secondary: '#00CED1',
        accent: '#7FFFD4',
        glow: 'rgba(0, 255, 255, 0.7)',
        headerGradient: 'linear-gradient(135deg, rgba(0, 30, 40, 0.95) 0%, rgba(0, 40, 50, 0.9) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(0, 40, 55, 0.95) 0%, rgba(0, 50, 65, 0.9) 100%)'
    },
    ANCIENT: {
        primary: '#C2B280',
        secondary: '#8B7355',
        accent: '#D4AF37',
        glow: 'rgba(194, 178, 128, 0.5)',
        headerGradient: 'linear-gradient(135deg, rgba(50, 45, 35, 0.9) 0%, rgba(40, 35, 25, 0.85) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(60, 55, 45, 0.9) 0%, rgba(50, 45, 35, 0.85) 100%)'
    },
    HALLOW: {
        primary: '#FF69B4',
        secondary: '#FF1493',
        accent: '#00CED1',
        glow: 'rgba(255, 105, 180, 0.6)',
        headerGradient: 'linear-gradient(135deg, rgba(60, 30, 50, 0.9) 0%, rgba(50, 40, 60, 0.85) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(70, 35, 60, 0.9) 0%, rgba(60, 45, 70, 0.85) 100%)'
    },
    CORRUPTION: {
        primary: '#a855f7',
        secondary: '#9333ea',
        accent: '#7e22ce',
        glow: 'rgba(168, 85, 247, 0.5)',
        headerGradient: 'linear-gradient(135deg, rgba(40, 20, 50, 0.9) 0%, rgba(35, 15, 45, 0.8) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(50, 25, 65, 0.9) 0%, rgba(45, 20, 60, 0.85) 100%)'
    },
    NULL: {
        primary: '#1f1f1f',
        secondary: '#0a0a0a',
        accent: '#404040',
        glow: 'rgba(0, 0, 0, 0.8)',
        headerGradient: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(5, 5, 5, 0.9) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.9) 100%)'
    },
    GLITCHED: {
        primary: '#22d3ee',
        secondary: '#06b6d4',
        accent: '#0891b2',
        glow: 'rgba(34, 211, 238, 0.5)',
        headerGradient: 'linear-gradient(135deg, rgba(10, 30, 35, 0.9) 0%, rgba(5, 25, 30, 0.8) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(15, 40, 45, 0.9) 0%, rgba(10, 35, 40, 0.85) 100%)'
    },
    DREAMSPACE: {
        primary: '#ec4899',
        secondary: '#db2777',
        accent: '#a855f7',
        glow: 'rgba(236, 72, 153, 0.5)',
        headerGradient: 'linear-gradient(135deg, rgba(50, 20, 45, 0.9) 0%, rgba(40, 15, 35, 0.8) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(60, 25, 50, 0.9) 0%, rgba(50, 20, 45, 0.85) 100%)'
    },
    PUMPKIN_MOON: {
        primary: '#ff8c00',
        secondary: '#ff6600',
        accent: '#ff4500',
        glow: 'rgba(255, 140, 0, 0.6)',
        headerGradient: 'linear-gradient(135deg, rgba(60, 35, 10, 0.9) 0%, rgba(50, 25, 5, 0.8) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(70, 40, 15, 0.9) 0%, rgba(60, 30, 10, 0.85) 100%)'
    },
    GRAVEYARD: {
        primary: '#6b7280',
        secondary: '#4b5563',
        accent: '#9ca3af',
        glow: 'rgba(107, 114, 128, 0.5)',
        headerGradient: 'linear-gradient(135deg, rgba(30, 30, 35, 0.9) 0%, rgba(20, 20, 25, 0.8) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(35, 35, 40, 0.9) 0%, rgba(25, 25, 30, 0.85) 100%)'
    },
    BLOOD_RAIN: {
        primary: '#8b0000',
        secondary: '#a00000',
        accent: '#dc143c',
        glow: 'rgba(139, 0, 0, 0.7)',
        headerGradient: 'linear-gradient(135deg, rgba(50, 10, 10, 0.95) 0%, rgba(40, 5, 5, 0.9) 100%)',
        panelGradient: 'linear-gradient(135deg, rgba(60, 15, 15, 0.95) 0%, rgba(50, 10, 10, 0.9) 100%)'
    }
};

// Update UI colors based on biome
function updateUIColors(biome) {
    // Normalize biome name (replace spaces with underscores for lookup)
    const biomeName = biome.name.replace(/ /g, '_');
    const colors = BIOME_UI_COLORS[biomeName] || BIOME_UI_COLORS.NORMAL;
    const root = document.documentElement;
    
    // Set CSS custom properties for colors
    root.style.setProperty('--biome-primary', colors.primary);
    root.style.setProperty('--biome-secondary', colors.secondary);
    root.style.setProperty('--biome-accent', colors.accent);
    root.style.setProperty('--biome-glow', colors.glow);
    root.style.setProperty('--biome-header-gradient', colors.headerGradient);
    root.style.setProperty('--biome-panel-gradient', colors.panelGradient);
    
    // Animate UI elements to new colors
    const header = document.querySelector('header');
    const cards = document.querySelectorAll('.card');
    const cardHeaders = document.querySelectorAll('.card-header');
    const panels = document.querySelectorAll('.panel, .roll-history-panel, .statistics-panel, .sidebar-section, .roll-history-container, .stats-container, .roll-result, .container, #rollHistoryContainer, #statisticsContainer, .roll-history-header, .statistics-grid, .stat-item, [id="rollHistoryContainer"], [id="statisticsContainer"]');
    const tabNavs = document.querySelectorAll('.tab-nav, .sub-tabs');
    const tabContents = document.querySelectorAll('.tab-content');
    const modals = document.querySelectorAll('.modal-content');
    const buttons = document.querySelectorAll('.roll-button, .quick-roll-button');
    const body = document.body;
    
    if (header) {
        anime({
            targets: header,
            background: colors.headerGradient,
            duration: 1500,
            easing: 'easeInOutQuad'
        });
    }
    
    // Update all cards with biome gradient
    cards.forEach(card => {
        anime({
            targets: card,
            background: colors.panelGradient,
            duration: 1500,
            easing: 'easeInOutQuad',
            complete: () => {
                // Ensure the background persists after animation
                card.style.background = colors.panelGradient;
            }
        });
    });
    
    // Update card headers with slightly darker gradient
    cardHeaders.forEach(cardHeader => {
        anime({
            targets: cardHeader,
            background: colors.headerGradient,
            duration: 1500,
            easing: 'easeInOutQuad',
            complete: () => {
                cardHeader.style.background = colors.headerGradient;
            }
        });
    });
    
    // Update all panels with biome gradient
    panels.forEach(panel => {
        anime({
            targets: panel,
            background: colors.panelGradient,
            duration: 1500,
            easing: 'easeInOutQuad',
            complete: () => {
                // Ensure the background persists after animation
                panel.style.background = colors.panelGradient;
            }
        });
    });
    
    // Delayed update for dynamically created panels (Roll History & Statistics)
    setTimeout(() => {
        const dynamicPanels = document.querySelectorAll('#rollHistoryContainer, #statisticsContainer');
        dynamicPanels.forEach(panel => {
            if (panel) {
                anime({
                    targets: panel,
                    background: colors.panelGradient,
                    duration: 1500,
                    easing: 'easeInOutQuad',
                    complete: () => {
                        panel.style.background = colors.panelGradient;
                    }
                });
            }
        });
    }, 100);
    
    // Update tab navigation with biome gradient
    tabNavs.forEach(tabNav => {
        anime({
            targets: tabNav,
            background: colors.panelGradient,
            duration: 1500,
            easing: 'easeInOutQuad',
            complete: () => {
                tabNav.style.background = colors.panelGradient;
            }
        });
    });
    
    // Update tab content areas with biome gradient
    tabContents.forEach(tabContent => {
        anime({
            targets: tabContent,
            background: colors.panelGradient,
            duration: 1500,
            easing: 'easeInOutQuad',
            complete: () => {
                tabContent.style.background = colors.panelGradient;
            }
        });
    });
    
    // Update modals with biome gradient
    modals.forEach(modal => {
        anime({
            targets: modal,
            background: colors.panelGradient,
            duration: 1500,
            easing: 'easeInOutQuad',
            complete: () => {
                modal.style.background = colors.panelGradient;
            }
        });
    });
    
    // Update CSS variables for biome colors (used by UI elements)
    if (body) {
        // Set CSS variables for the biome colors
        root.style.setProperty('--biome-bg-primary', colors.primary);
        root.style.setProperty('--biome-bg-secondary', colors.secondary);
        
        // Update the main CSS variables that body uses for gradient
        root.style.setProperty('--bg-primary', colors.primary);
        root.style.setProperty('--bg-secondary', colors.secondary);
        
        // 🎨 DISABLED: Body background removed to allow 3D biome effects to show through
        // The 3D particle effects from biome-effects.js will provide the background instead
        // Keep body transparent so effects are visible
        body.style.background = 'transparent';
        body.style.backgroundColor = '#0a0f1a'; // Dark fallback only
    }
}

// Apply anime.js effects for biome transitions
function applyBiomeAnimeEffects(biome) {
    const biomeName = biome.name;
    
    // Stop any previous looping animations
    anime.remove('.panel');
    anime.remove('.container');
    
    // Screen flash effect
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${biome.color};
        opacity: 0;
        pointer-events: none;
        z-index: 9998;
    `;
    document.body.appendChild(flash);
    
    anime({
        targets: flash,
        opacity: [0, 0.5, 0],
        duration: 800,
        easing: 'easeInOutQuad',
        complete: () => flash.remove()
    });
    
    // Panel entrance animation
    const panels = document.querySelectorAll('.panel');
    anime({
        targets: panels,
        scale: [0.95, 1],
        opacity: [0.7, 1],
        duration: 600,
        delay: anime.stagger(100),
        easing: 'easeOutElastic(1, .8)'
    });
    
    // Biome-specific effects
    switch(biomeName) {
        case 'WINDY':
            createWindEffect();
            break;
        case 'SNOWY':
            createSnowEffect();
            break;
        case 'BLIZZARD':
            createBlizzardEffect();
            break;
        case 'RAINY':
            createRainEffect();
            break;
        case 'MONSOON':
            createMonsoonEffect();
            break;
        case 'SANDSTORM':
            createSandEffect();
            break;
        case 'JUNGLE':
            createJungleEffect();
            break;
        case 'AMAZON':
            createAmazonEffect();
            break;
        case 'CRIMSON':
            createCrimsonEffect();
            break;
        case 'STARFALL':
            createStarfallEffect();
            break;
        case 'METEOR_SHOWER':
            createMeteorShowerEffect();
            break;
        case 'HELL':
            createHellEffect();
            break;
        case 'CORRUPTION':
            createCorruptionEffect();
            break;
        case 'NULL':
            createNullEffect();
            break;
        case 'GLITCHED':
            createGlitchEffect();
            break;
        case 'DREAMSPACE':
            createDreamspaceEffect();
            break;
        case 'PUMPKIN_MOON':
            createPumpkinMoonEffect();
            break;
        case 'GRAVEYARD':
            createGraveyardEffect();
            break;
        case 'BLOOD_RAIN':
            createBloodRainEffect();
            break;
    }
}

// Biome-specific particle effects
function createWindEffect() {
    createParticleEffect('💨', 20, 'wind-particle');
}

function createSnowEffect() {
    createParticleEffect('❄️', 30, 'snow-particle');
}

function createBlizzardEffect() {
    // Enhanced snow effect with more intense particles and wind
    createParticleEffect('❄️', 60, 'blizzard-particle');
    createParticleEffect('🌨️', 25, 'blizzard-cloud');
    createParticleEffect('💨', 20, 'blizzard-wind');
    
    // Add intense pulsing deep green glow effect
    anime({
        targets: '.panel',
        boxShadow: [
            '0 0 25px rgba(191, 219, 254, 0.4)',
            '0 0 50px rgba(191, 219, 254, 0.8)',
            '0 0 25px rgba(191, 219, 254, 0.4)'
        ],
        duration: 1200,
        easing: 'easeInOutQuad',
        loop: 5
    });
    
    // Intense screen shake for blizzard power
    anime({
        targets: '.container',
        translateX: [0, -10, 10, -10, 10, -8, 8, -8, 8, 0],
        translateY: [0, -8, 8, -8, 8, -6, 6, -6, 6, 0],
        duration: 1000,
        easing: 'easeInOutQuad'
    });
    
    // Horizontal snow drift animation - particles blowing sideways
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const snowflake = document.createElement('div');
            snowflake.className = 'biome-particle blizzard-drift';
            snowflake.textContent = '❄️';
            snowflake.style.cssText = `
                position: fixed;
                left: -100px;
                top: ${Math.random() * 100}%;
                font-size: 20px;
                opacity: 0.9;
                pointer-events: none;
                z-index: 1;
                transform: rotate(${Math.random() * 360}deg);
            `;
            document.body.appendChild(snowflake);
            
            anime({
                targets: snowflake,
                translateX: window.innerWidth + 200,
                translateY: () => anime.random(-50, 50),
                rotate: () => anime.random(360, 1080),
                opacity: [0.9, 0],
                duration: () => anime.random(2000, 4000),
                easing: 'easeInQuad',
                complete: () => snowflake.remove()
            });
        }, i * 150);
    }
}

function createRainEffect() {
    createParticleEffect('💧', 40, 'rain-particle');
}

function createMonsoonEffect() {
    // Heavy rain with storm elements
    createParticleEffect('💧', 80, 'rain-particle');
    createParticleEffect('⚡', 15, 'lightning-particle');
    createParticleEffect('🌊', 20, 'wave-particle');
    
    // Add intense screen shake for monsoon power
    anime({
        targets: '.container',
        translateX: [0, -8, 8, -8, 8, 0],
        translateY: [0, -8, 8, -8, 8, 0],
        duration: 800,
        easing: 'easeInOutQuad'
    });
}

function createSandEffect() {
    createParticleEffect('🟨', 25, 'sand-particle');
}

function createJungleEffect() {
    createParticleEffect('🌿', 30, 'jungle-particle');
}

function createVerdantEffect() {
    // Enhanced jungle effect with more particles and variety
    createParticleEffect('🌿', 40, 'verdant-particle');
    createParticleEffect('🍃', 25, 'verdant-leaf');
    createParticleEffect('🌱', 20, 'verdant-sprout');
    
    // Add pulsing green glow effect
    anime({
        targets: '.panel',
        boxShadow: [
            '0 0 20px rgba(5, 150, 105, 0.3)',
            '0 0 40px rgba(5, 150, 105, 0.6)',
            '0 0 20px rgba(5, 150, 105, 0.3)'
        ],
        duration: 2000,
        easing: 'easeInOutQuad',
        loop: 3
    });
    
    // Gentle floating animation for panels
    const panels = document.querySelectorAll('.panel');
    panels.forEach((panel, index) => {
        anime({
            targets: panel,
            translateY: [-5, 5],
            duration: 4000,
            delay: index * 300,
            direction: 'alternate',
            easing: 'easeInOutSine',
            loop: 2
        });
    });
}

function createAmazonEffect() {
    // Enhanced jungle effect with Amazon-specific particles
    createParticleEffect('🌿', 50, 'amazon-particle');
    createParticleEffect('🍃', 35, 'amazon-leaf');
    createParticleEffect('🌱', 25, 'amazon-sprout');
    createParticleEffect('🌺', 15, 'amazon-flower');
    createParticleEffect('🦋', 10, 'amazon-butterfly');
    
    // Add intense pulsing deep green glow effect
    anime({
        targets: '.panel',
        boxShadow: [
            '0 0 25px rgba(5, 150, 105, 0.4)',
            '0 0 50px rgba(5, 150, 105, 0.8)',
            '0 0 25px rgba(5, 150, 105, 0.4)'
        ],
        duration: 1800,
        easing: 'easeInOutQuad',
        loop: 4
    });
    
    // Gentle floating animation for panels with more movement
    const panels = document.querySelectorAll('.panel');
    panels.forEach((panel, index) => {
        anime({
            targets: panel,
            translateY: [-8, 8],
            duration: 5000,
            delay: index * 250,
            direction: 'alternate',
            easing: 'easeInOutSine',
            loop: 3
        });
    });
    
    // Special Amazon butterfly animation
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const butterfly = document.createElement('div');
            butterfly.className = 'biome-particle amazon-butterfly';
            butterfly.textContent = '🦋';
            butterfly.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                font-size: 22px;
                opacity: 0.7;
                pointer-events: none;
                z-index: 1;
            `;
            document.body.appendChild(butterfly);
            
            // Butterfly flight pattern - more erratic and natural
            anime({
                targets: butterfly,
                translateX: () => anime.random(-300, 300),
                translateY: () => anime.random(-200, 200),
                rotate: () => anime.random(-180, 180),
                opacity: [0.7, 0],
                duration: () => anime.random(4000, 7000),
                easing: 'easeInOutSine',
                complete: () => butterfly.remove()
            });
        }, i * 400);
    }
}

function createCrimsonEffect() {
    createParticleEffect('🩸', 25, 'crimson-particle');
    
    // Add pulsing red glow effect
    anime({
        targets: '.panel',
        boxShadow: [
            '0 0 20px rgba(220, 20, 60, 0.3)',
            '0 0 40px rgba(220, 20, 60, 0.6)',
            '0 0 20px rgba(220, 20, 60, 0.3)'
        ],
        duration: 2000,
        easing: 'easeInOutQuad',
        loop: 3
    });
}

function createStarfallEffect() {
    createParticleEffect('⭐', 15, 'star-particle');
}

function createMeteorShowerEffect() {
    // Enhanced starfall with meteors and cosmic effects
    createParticleEffect('⭐', 30, 'star-particle');
    createParticleEffect('☄️', 20, 'meteor-particle');
    createParticleEffect('🌟', 15, 'sparkle-particle');
    createParticleEffect('💫', 10, 'cosmic-particle');
    
    // Add intense pulsing golden glow effect
    anime({
        targets: '.panel',
        boxShadow: [
            '0 0 30px rgba(245, 158, 11, 0.4)',
            '0 0 60px rgba(245, 158, 11, 0.8)',
            '0 0 30px rgba(245, 158, 11, 0.4)'
        ],
        duration: 1500,
        easing: 'easeInOutQuad',
        loop: 4
    });
    
    // Meteor streak animation - particles falling diagonally
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const meteor = document.createElement('div');
            meteor.className = 'biome-particle meteor-streak';
            meteor.textContent = '☄️';
            meteor.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                top: -50px;
                font-size: 25px;
                opacity: 0.8;
                pointer-events: none;
                z-index: 1;
                transform: rotate(45deg);
            `;
            document.body.appendChild(meteor);
            
            anime({
                targets: meteor,
                translateY: window.innerHeight + 100,
                translateX: 200,
                opacity: [0.8, 0],
                duration: 2000,
                easing: 'easeInQuad',
                complete: () => meteor.remove()
            });
        }, i * 200);
    }
}

function createHellEffect() {
    createParticleEffect('🔥', 20, 'hell-particle');
    
    // Add screen shake
    anime({
        targets: '.container',
        translateX: [0, -5, 5, -5, 5, 0],
        translateY: [0, -5, 5, -5, 5, 0],
        duration: 500,
        easing: 'easeInOutQuad'
    });
}

function createCorruptionEffect() {
    createParticleEffect('💜', 15, 'corruption-particle');
    
    // Pulsing effect on panels
    anime({
        targets: '.panel',
        scale: [1, 1.02, 1],
        duration: 1000,
        easing: 'easeInOutQuad',
        loop: 3
    });
}

function createNullEffect() {
    // Glitch all text momentarily
    const allText = document.querySelectorAll('h1, h2, h3, .aura-name, .panel');
    anime({
        targets: allText,
        translateX: () => anime.random(-10, 10),
        translateY: () => anime.random(-5, 5),
        opacity: [1, 0.3, 1],
        duration: 200,
        easing: 'easeInOutQuad',
        loop: 3
    });
}

function createGlitchEffect() {
    // Rapid color shifts
    const panels = document.querySelectorAll('.panel, header');
    anime({
        targets: panels,
        filter: [
            'hue-rotate(0deg)',
            'hue-rotate(90deg)',
            'hue-rotate(180deg)',
            'hue-rotate(270deg)',
            'hue-rotate(360deg)'
        ],
        duration: 300,
        easing: 'linear',
        loop: 3
    });
}

function createDreamspaceEffect() {
    createParticleEffect('✨', 25, 'dream-particle');
    
    // Floating animation on all panels (will be cleared when biome changes)
    const panels = document.querySelectorAll('.panel');
    panels.forEach((panel, index) => {
        anime({
            targets: panel,
            translateY: [-10, 10],
            duration: 3000,
            delay: index * 200,
            direction: 'alternate',
            easing: 'easeInOutSine',
            loop: true
        });
    });
}

// Generic particle creator
function createParticleEffect(emoji, count, className) {
    // Remove existing particles
    document.querySelectorAll('.biome-particle').forEach(p => p.remove());
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = `biome-particle ${className}`;
        particle.textContent = emoji;
        particle.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            font-size: ${Math.random() * 20 + 15}px;
            opacity: ${Math.random() * 0.5 + 0.3};
            pointer-events: none;
            z-index: 1;
        `;
        document.body.appendChild(particle);
        
        // Animate particle
        anime({
            targets: particle,
            translateX: () => anime.random(-200, 200),
            translateY: () => anime.random(-200, 200),
            rotate: () => anime.random(-360, 360),
            opacity: [particle.style.opacity, 0],
            duration: () => anime.random(3000, 6000),
            easing: 'easeOutQuad',
            complete: () => particle.remove()
        });
    }
}

// Apply time-specific tint
function applyTimeTint() {
    const body = document.body;
    
    // Remove existing time classes
    body.classList.remove('time-day', 'time-night');
    
    // Add current time class
    if (biomeState.isDay) {
        body.classList.add('time-day');
        // Remove night overlay if it exists
        const nightOverlay = document.getElementById('nightOverlay');
        if (nightOverlay) nightOverlay.remove();
    } else {
        body.classList.add('time-night');
        // Add dark overlay for nighttime
        let nightOverlay = document.getElementById('nightOverlay');
        if (!nightOverlay) {
            nightOverlay = document.createElement('div');
            nightOverlay.id = 'nightOverlay';
            nightOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 20, 0.4);
                pointer-events: none;
                z-index: 1;
                transition: opacity 1s ease;
            `;
            document.body.appendChild(nightOverlay);
        }
    }
}

// Save biome state to localStorage
function saveBiomeState() {
    const state = {
        currentBiome: biomeState.currentBiome,
        biomeEndTime: biomeState.biomeEndTime,
        isDay: biomeState.isDay,
        timeEndTime: biomeState.timeEndTime
    };
    localStorage.setItem('biomeState', JSON.stringify(state));
}

// Load biome state from localStorage
function loadBiomeState() {
    const saved = localStorage.getItem('biomeState');
    if (!saved) return;
    
    try {
        const state = JSON.parse(saved);
        const now = Date.now();
        
        // Check if saved biome has expired
        if (state.biomeEndTime && now >= state.biomeEndTime) {
            // Biome expired, reset to NORMAL
            biomeState.currentBiome = "NORMAL";
            biomeState.biomeEndTime = null;
        } else {
            // Restore biome state
            biomeState.currentBiome = state.currentBiome;
            biomeState.biomeEndTime = state.biomeEndTime;
        }
        
        // Check if time cycle has progressed
        if (state.timeEndTime && now >= state.timeEndTime) {
            // Calculate how many cycles have passed
            let timePassed = now - state.timeEndTime;
            let currentIsDay = state.isDay;
            
            // Simulate cycles that happened while away
            while (timePassed > 0) {
                const cycleDuration = currentIsDay ? TIME_CYCLE.nightDuration : TIME_CYCLE.dayDuration;
                const cycleDurationMs = cycleDuration * 1000;
                
                if (timePassed >= cycleDurationMs) {
                    currentIsDay = !currentIsDay;
                    timePassed -= cycleDurationMs;
                } else {
                    break;
                }
            }
            
            biomeState.isDay = currentIsDay;
            const currentCycleDuration = biomeState.isDay ? TIME_CYCLE.dayDuration : TIME_CYCLE.nightDuration;
            biomeState.timeEndTime = now + ((currentCycleDuration * 1000) - timePassed);
        } else {
            // Restore time state
            biomeState.isDay = state.isDay;
            biomeState.timeEndTime = state.timeEndTime;
        }
        
        // Apply visuals for loaded biome
        const biome = BIOMES.find(b => b.name === biomeState.currentBiome);
        if (biome) {
            applyBiomeVisuals(biome);
            
            // Apply audio visualizer (delayed to ensure audio element exists)
            if (typeof updateVisualizerForBiome === 'function') {
                setTimeout(() => {
                    updateVisualizerForBiome(biomeState.currentBiome);
                }, 200); // Slightly longer delay for page load
            }
        }
        
        console.log('Loaded biome state:', biomeState);
    } catch (e) {
        console.error('Failed to load biome state:', e);
    }
}

// Halloween Biome Effects
function createPumpkinMoonEffect() {
    // Pumpkins, bats, and spooky particles
    createParticleEffect('🎃', 35, 'pumpkin-particle');
    createParticleEffect('🦇', 25, 'bat-particle');
    createParticleEffect('🍂', 20, 'leaf-particle');
    
    // Orange pulsing glow
    anime({
        targets: '.panel',
        boxShadow: [
            '0 0 20px rgba(255, 140, 0, 0.4)',
            '0 0 40px rgba(255, 140, 0, 0.7)',
            '0 0 20px rgba(255, 140, 0, 0.4)'
        ],
        duration: 2000,
        easing: 'easeInOutQuad',
        loop: 3
    });
}

function createGraveyardEffect() {
    // Ghosts, tombstones, and fog
    createParticleEffect('👻', 30, 'ghost-particle');
    createParticleEffect('💀', 15, 'skull-particle');
    createParticleEffect('🌫️', 25, 'fog-particle');
    
    // Gray eerie glow
    anime({
        targets: '.panel',
        boxShadow: [
            '0 0 20px rgba(107, 114, 128, 0.3)',
            '0 0 40px rgba(107, 114, 128, 0.6)',
            '0 0 20px rgba(107, 114, 128, 0.3)'
        ],
        duration: 2500,
        easing: 'easeInOutQuad',
        loop: 3
    });
    
    // Floating animation
    const panels = document.querySelectorAll('.panel');
    panels.forEach((panel, index) => {
        anime({
            targets: panel,
            translateY: [-8, 8],
            duration: 6000,
            delay: index * 400,
            direction: 'alternate',
            easing: 'easeInOutSine',
            loop: 2
        });
    });
}

function createBloodRainEffect() {
    // Blood drops and red particles
    createParticleEffect('💧', 50, 'blood-particle');
    createParticleEffect('🩸', 30, 'blood-drop');
    
    // Intense red glow
    anime({
        targets: '.panel',
        boxShadow: [
            '0 0 25px rgba(139, 0, 0, 0.5)',
            '0 0 50px rgba(139, 0, 0, 0.9)',
            '0 0 25px rgba(139, 0, 0, 0.5)'
        ],
        duration: 1500,
        easing: 'easeInOutQuad',
        loop: 4
    });
    
    // Screen shake for ominous effect
    anime({
        targets: '.container',
        translateX: [0, -6, 6, -6, 6, 0],
        translateY: [0, -6, 6, -6, 6, 0],
        duration: 1000,
        easing: 'easeInOutQuad'
    });
}

// Update biome display every second
setInterval(updateBiomeDisplay, 1000);

// Toggle biome music on/off
function toggleBiomeMusic() {
    biomeMusicEnabled = !biomeMusicEnabled;
    
    // Save preference to localStorage
    try {
        localStorage.setItem('biomeMusicEnabled', biomeMusicEnabled);
    } catch (e) {
        console.log('Could not save music preference:', e);
    }
    
    if (biomeMusicEnabled) {
        console.log('🎵 Biome music ENABLED');
        // Start playing current biome music
        playBiomeMusic(biomeState.currentBiome);
    } else {
        console.log('🎵 Biome music DISABLED');
        // Stop any playing music
        stopBiomeMusic();
    }
    
    return biomeMusicEnabled;
}

// Get current music state
function isBiomeMusicEnabled() {
    return biomeMusicEnabled;
}

// Make functions globally accessible for cutscene integration
window.pauseBiomeMusic = pauseBiomeMusic;
window.resumeBiomeMusic = resumeBiomeMusic;
window.toggleBiomeMusic = toggleBiomeMusic;
window.isBiomeMusicEnabled = isBiomeMusicEnabled;
