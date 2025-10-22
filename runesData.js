// =================================================================
// Runes System Data
// =================================================================

// Runes allow players to roll auras from specific biomes at native rarity
// regardless of the current biome, similar to Universe Potion before its removal
// All runes last 10 minutes (600 seconds)

const RUNES_DATA = [
    {
        name: "Rune of Wind",
        effect: "Roll WINDY biome auras at native rarity for 10 minutes",
        biome: "WINDY",
        duration: 600,
        icon: "🌪️",
        color: "#a5f3fc"
    },
    {
        name: "Rune of Frost",
        effect: "Roll SNOWY biome auras at native rarity for 10 minutes",
        biome: "SNOWY",
        duration: 600,
        icon: "❄️",
        color: "#e0f2fe"
    },
    {
        name: "Rune of Rainstorm",
        effect: "Roll RAINY biome auras at native rarity for 10 minutes",
        biome: "RAINY",
        duration: 600,
        icon: "🌧️",
        color: "#7dd3fc"
    },
    {
        name: "Rune of Dust",
        effect: "Roll SANDSTORM biome auras at native rarity for 10 minutes",
        biome: "SANDSTORM",
        duration: 600,
        icon: "🏜️",
        color: "#fbbf24"
    },
    {
        name: "Rune of Hell",
        effect: "Roll HELL biome auras at native rarity for 10 minutes",
        biome: "HELL",
        duration: 600,
        icon: "🔥",
        color: "#ef4444"
    },
    {
        name: "Rune of Galaxy",
        effect: "Roll STARFALL biome auras at native rarity for 10 minutes",
        biome: "STARFALL",
        duration: 600,
        icon: "⭐",
        color: "#fcd34d"
    },
    {
        name: "Rune of Corruption",
        effect: "Roll CORRUPTION biome auras at native rarity for 10 minutes",
        biome: "CORRUPTION",
        duration: 600,
        icon: "💜",
        color: "#a855f7"
    },
    {
        name: "Rune of Nothing",
        effect: "Roll NULL biome auras at native rarity for 10 minutes",
        biome: "NULL",
        duration: 600,
        icon: "⚫",
        color: "#1f1f1f"
    },
    {
        name: "Rune of Eclipse",
        effect: "Roll both WINDY and HELL biome auras at native rarity for 10 minutes",
        biomes: ["WINDY", "HELL"],
        duration: 600,
        icon: "🌘",
        color: "#7c3aed"
    },
    {
        name: "Rune of Pumpkin Moon",
        effect: "Roll PUMPKIN MOON biome auras at native rarity for 10 minutes",
        biome: "PUMPKIN_MOON",
        duration: 600,
        icon: "🎃",
        color: "#ff8c00",
        isHalloween: true
    },
    {
        name: "Rune of Graveyard",
        effect: "Roll GRAVEYARD biome auras at native rarity for 10 minutes",
        biome: "GRAVEYARD",
        duration: 600,
        icon: "👻",
        color: "#6b7280",
        isHalloween: true
    },
    {
        name: "Rune of Blood Rain",
        effect: "Roll BLOOD RAIN biome auras at native rarity for 10 minutes",
        biome: "BLOOD_RAIN",
        duration: 600,
        icon: "🩸",
        color: "#8b0000",
        isHalloween: true
    },
    {
        name: "Rune of 404",
        effect: "Roll GLITCHED biome auras at native rarity for 10 minutes",
        biome: "GLITCHED",
        duration: 600,
        icon: "⚠️",
        color: "#ff00ff",
        isSpecial: true,
        isExtremelyRare: true
    },
    {
        name: "Rune of Dreams",
        effect: "Roll DREAMSPACE biome auras at native rarity for 10 minutes",
        biome: "DREAMSPACE",
        duration: 600,
        icon: "💭",
        color: "#9d4edd",
        isSpecial: true,
        isExtremelyRare: true
    },
    {
        name: "Rune of Everything",
        effect: "Roll ALL biome auras at native rarity (except GLITCHED and DREAMSPACE) for 10 minutes",
        biomes: ["NORMAL", "WINDY", "SNOWY", "RAINY", "SANDSTORM", "STARFALL", "HELL", "CORRUPTION", "NULL", "PUMPKIN_MOON", "GRAVEYARD", "BLOOD_RAIN"],
        duration: 600,
        icon: "✨",
        color: "#ec4899",
        isSpecial: true
    }
];

// Define how runes can be obtained (from achievements, chests, or Jester shop)
const RUNE_SOURCES = {
    // Can be obtained from Random Rune Chest - ALL RUNES
    chestRunes: [
        "Rune of Wind",
        "Rune of Frost",
        "Rune of Rainstorm",
        "Rune of Dust",
        "Rune of Hell",
        "Rune of Galaxy",
        "Rune of Corruption",
        "Rune of Nothing",
        "Rune of Eclipse",        // Rare
        "Rune of Pumpkin Moon",   // Halloween
        "Rune of Graveyard",      // Halloween
        "Rune of Blood Rain",     // Halloween
        "Rune of 404",            // Extremely Rare
        "Rune of Dreams",         // Extremely Rare
        "Rune of Everything"      // Ultra Rare
    ],
    
    // Can be purchased from Jester
    jesterRunes: [
        "Rune of Wind",
        "Rune of Frost",
        "Rune of Rainstorm",
        "Rune of Dust",
        "Rune of Hell",
        "Rune of Galaxy"
    ]
};
