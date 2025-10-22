// =================================================================
// Corrected Potion Recipes
// =================================================================

const POTION_RECIPES = [
    {
        name: "Lucky Potion",
        effect: "+25% Luck for 1 minute",
        luckBoost: 0.25,
        duration: 60,
        isBase: true
    },
    {
        name: "Speed Potion",
        effect: "+10% Roll Speed for 1 minute",
        speedBoost: 0.1,
        duration: 60,
        isBase: true
    },
    {
        name: "Lucky Potion L",
        ingredients: { "Lucky Potion": 3 },
        effect: "+35% Luck for 2 minutes",
        luckBoost: 0.35,
        duration: 120
    },
    {
        name: "Lucky Potion XL",
        ingredients: { "Lucky Potion": 6 },
        effect: "+45% Luck for 3 minutes",
        luckBoost: 0.45,
        duration: 180
    },
    {
        name: "Speed Potion L",
        ingredients: { "Speed Potion": 3 },
        effect: "+15% Roll Speed for 2 minutes",
        speedBoost: 0.15,
        duration: 120
    },
    {
        name: "Speed Potion XL",
        ingredients: { "Speed Potion": 6 },
        effect: "+18% Roll Speed for 3 minutes",
        speedBoost: 0.18,
        duration: 180
    },
    {
        name: "Fortune Potion I",
        ingredients: { "Lucky Potion": 10 },
        effect: "+50% Luck for 5 minutes",
        luckBoost: 0.5,
        duration: 300
    },
    {
        name: "Fortune Potion II",
        ingredients: { "Lucky Potion": 25 },
        effect: "+75% Luck for 5 minutes",
        luckBoost: 0.75,
        duration: 300
    },
    {
        name: "Fortune Potion III",
        ingredients: { "Lucky Potion": 50 },
        effect: "+100% Luck for 5 minutes",
        luckBoost: 1.0,
        duration: 300
    },
    {
        name: "Haste Potion I",
        ingredients: { "Speed Potion": 10 },
        effect: "+20% Roll Speed for 5 minutes",
        speedBoost: 0.2,
        duration: 300
    },
    {
        name: "Haste Potion II",
        ingredients: { "Speed Potion": 25 },
        effect: "+25% Roll Speed for 5 minutes",
        speedBoost: 0.25,
        duration: 300
    },
    {
        name: "Haste Potion III",
        ingredients: { "Speed Potion": 50 },
        effect: "+30% Roll Speed for 5 minutes",
        speedBoost: 0.3,
        duration: 300
    },
    {
        name: "Potion of Bound",
        // All ingredients exist
        ingredients: { "Bounded": 1, "Permafrost": 3, "Lost Soul": 20, "Lucky Potion": 100 },
        effect: "Sets luck to 5,000,000% for the next roll.",
        luckBoost: 50000,
        oneRoll: true
    },
    {
        name: "Heavenly Potion",
        // All ingredients exist
        ingredients: { "Lucky Potion": 250, "Celestial": 2, "Exotic": 1, "Powered": 2, "Quartz": 5 },
        effect: "Sets luck to 15,000,000% for the next roll.",
        luckBoost: 150000,
        oneRoll: true
    },
    {
        name: "Rage Potion",
        // All ingredients exist
        ingredients: { "Speed Potion": 10, "Diaboli": 1, "Rage": 5 },
        effect: "+35% Roll Speed for 10 minutes",
        speedBoost: 0.35,
        duration: 600
    },
    {
        name: "Diver Potion",
        // All ingredients exist
        ingredients: { "Speed Potion": 20, "Nautilus": 1 },
        effect: "+40% Roll Speed for 10 minutes",
        speedBoost: 0.4,
        duration: 600
    },
    {
        name: "Jewelry Potion",
        // All ingredients exist
        ingredients: { "Lucky Potion": 20, "Aquamarine": 1, "Sapphire": 1, "Gilded": 1, "Emerald": 1, "Ruby": 1, "Topaz": 1 },
        effect: "+120% Luck for 10 minutes",
        luckBoost: 1.2,
        duration: 600
    },
    {
        name: "Zombie Potion",
        // All ingredients exist
        ingredients: { "Lucky Potion": 10, "Undead": 1, "Bleeding": 1 },
        effect: "+150% Luck for 10 minutes",
        luckBoost: 1.5,
        duration: 600
    },
    {
        name: "Godly Potion (Zeus)",
        // All ingredients exist
        ingredients: { "Lucky Potion": 25, "Speed Potion": 25, "Zeus": 1, "Stormal": 1, "Wind": 15 },
        effect: "+200% Luck and +30% Roll Speed for 4 hours",
        luckBoost: 2.0,
        speedBoost: 0.3,
        duration: 14400
    },
    {
        name: "Godly Potion (Poseidon)",
        // All ingredients exist
        ingredients: { "Speed Potion": 50, "Poseidon": 1, "Nautilus": 1, "Aquatic": 1 },
        effect: "-50% Luck and +75% Roll Speed for 4 hours",
        luckBoost: -0.5,
        speedBoost: 0.75,
        duration: 14400
    },
    {
        name: "Godly Potion (Hades)",
        // All ingredients exist
        ingredients: { "Lucky Potion": 50, "Hades": 1, "Diaboli": 6, "Bleeding": 6 },
        effect: "+300% Luck and -30% Roll Speed for 4 hours",
        luckBoost: 3.0,
        speedBoost: -0.3,
        duration: 14400
    },
    {
        name: "Godlike Potion",
        ingredients: { "Godly Potion (Zeus)": 1, "Godly Potion (Hades)": 1, "Godly Potion (Poseidon)": 1, "Lucky Potion": 600 },
        effect: "Sets luck to 40,000,000% for the next roll.",
        luckBoost: 400000,
        oneRoll: true,
        duration: 5
    },
    {
        name: "Mixed Potion",
        ingredients: { "Lucky Potion": 5, "Speed Potion": 5 },
        effect: "+25% Luck & +10% Roll Speed for 3 minutes",
        luckBoost: 0.25,
        speedBoost: 0.1,
        duration: 180
    },
    {
        name: "Oblivion Potion",
        // Ultra-rare potion requiring very high tier auras
        ingredients: { "Nihility": 1, "Hades": 2, "Twilight": 3, "Ethereal": 1, "Lucky Potion": 500 },
        effect: "Sets luck to 60,000,000% for the next roll.",
        luckBoost: 600000,
        oneRoll: true,
        negatesBuffs: true,
        duration: 5
    },
    {
        name: "Warp Potion",
        // All ingredients exist
        ingredients: { "Arcane": 1, "Comet": 5, "Powered": 100, "Lunar": 200, "Speed Potion": 1000 },
        effect: "+1000% Roll Speed for 2000 rolls - REMOVES AUTOROLL COOLDOWN",
        speedBoost: 10.0,
        rollCount: 2000,
        removeCooldown: true
    },
    {
        name: "Gladiator Potion",
        ingredients: { "Lucky Potion": 30, "Speed Potion": 15 },
        effect: "+100% Luck for 10 minutes",
        luckBoost: 1.0,
        duration: 600
    },
    {
        name: "Forbidden Potion I",
        ingredients: { "Lucky Potion": 2, "Speed Potion": 1, "Darklight Shard": 1 },
        effect: "+70% Luck & +10% Roll Speed for 30 minutes",
        luckBoost: 0.7,
        speedBoost: 0.1,
        duration: 1800
    },
    {
        name: "Forbidden Potion II",
        ingredients: { "Lucky Potion": 20, "Speed Potion": 10, "Darklight Orb": 1 },
        effect: "+325% Luck & +25% Roll Speed for 1 hour",
        luckBoost: 3.25,
        speedBoost: 0.25,
        duration: 3600
    },
    {
        name: "Forbidden Potion III",
        ingredients: { "Lucky Potion": 100, "Speed Potion": 65, "Darklight Core": 1 },
        effect: "+1350% Luck & +75% Roll Speed for 3 hours",
        luckBoost: 13.5,
        speedBoost: 0.75,
        duration: 10800
    },
    {
        name: "Rainbow Potion",
        // Fixed: 'Prismatic' -> 'Star', 'Crystal' -> 'Crystallized'
        ingredients: { "Lucky Potion": 15, "Speed Potion": 15, "Star": 1, "Crystallized": 3 },
        effect: "+50% Luck & +25% Speed, guarantees next aura is Epic+",
        luckBoost: 0.5,
        speedBoost: 0.25,
        duration: 300,
        guaranteeRarity: "epic"
    },
    {
        name: "Chaos Potion",
        // Fixed: 'Chaotic' -> 'Glitch', 'Corrupted' -> 'Corrosive'
        ingredients: { "Lucky Potion": 30, "Speed Potion": 30, "Glitch": 1, "Corrosive": 2 },
        effect: "Random luck/speed changes every 30 seconds for 5 minutes",
        chaosMode: true,
        duration: 300
    },
    {
        name: "Mirror Potion",
        // Fixed: 'Reflective' -> 'Crystallized', 'Glass' -> 'Glacier'
        ingredients: { "Lucky Potion": 40, "Crystallized": 1, "Glacier": 5 },
        effect: "Next 3 auras have 50% chance to duplicate",
        mirrorChance: 0.5,
        mirrorCount: 3,
        oneRoll: false,
        duration: 600
    },
    {
        name: "Time Warp Potion",
        // Fixed: 'Temporal' -> 'Cosmos', 'Ancient' -> 'Lost Soul'
        ingredients: { "Speed Potion": 100, "Cosmos": 1, "Lost Soul": 2 },
        effect: "Roll cooldown reduced by 75% for 10 minutes",
        cooldownReduction: 0.75,
        duration: 600
    },

    {
        name: "Phoenix Potion",
        // Fixed: 'Immortal' -> 'Ash', 'Fire' -> 'Solar', 'Rebirth' -> 'Divinus'
        ingredients: { "Lucky Potion": 75, "Ash": 1, "Solar": 2, "Divinus": 1 },
        effect: "If you roll 10 commons in a row, next roll is guaranteed rare+",
        phoenixMode: true,
        duration: 900
    },
    {
        name: "Lucky Block Potion",
        // Fixed: 'Block' -> 'Topaz', 'Mystery' -> 'Jackpot'
        ingredients: { "Lucky Potion": 25, "Topaz": 10, "Jackpot": 1 },
        effect: "Each roll has 5% chance to spawn bonus potions/items",
        bonusSpawnChance: 0.05,
        duration: 600
    },
    {
        name: "Aura Magnet Potion",
        // Fixed: 'Metal' -> 'Copper'
        ingredients: { "Lucky Potion": 60, "Magnetic": 1, "Copper": 8 },
        effect: "+200% Luck for Legendary+ auras only for 15 minutes",
        legendaryOnly: true,
        luckBoost: 2.0,
        duration: 900
    },
    {
        name: "Quantum Potion",
        // Fixed: 'Quantum' -> 'Matrix', 'Void' -> 'Nihility'
        ingredients: { "Lucky Potion": 100, "Speed Potion": 100, "Matrix": 1, "Nihility": 1 },
        effect: "Each roll has 1% chance to instantly roll again (max 10 chain)",
        quantumChance: 0.01,
        maxQuantumChain: 10,
        duration: 1200
    },
    {
        name: "Curse Breaker Potion",
        // Fixed: 'Holy' -> 'Divinus', 'Purified' -> 'Quartz'
        ingredients: { "Lucky Potion": 200, "Divinus": 2, "Quartz": 5 },
        effect: "Removes all negative luck effects and prevents them for 30 minutes",
        curseImmunity: true,
        duration: 1800
    },
    {
        name: "Jackpot Potion",
        // Fixed: 'Golden' -> 'Gilded', 'Treasure' -> 'Jackpot', 'Wealth' -> 'Precious'
        ingredients: { "Lucky Potion": 300, "Gilded": 3, "Jackpot": 1, "Precious": 3 },
        effect: "Next transcendent+ aura gives massive bonus rewards based on rarity",
        jackpotMode: true,
        oneRoll: false,
        duration: 3600
    },
    {
        name: "Potion of Dupe",
        ingredients: { "Lucky Potion": 75, "Crystallized": 5, "Jackpot": 1, "Gilded": 2 },
        effect: "50% chance to duplicate crafting recipe rolls for 10 minutes",
        dupeChance: 0.5,
        duration: 600
    },
    {
        name: "Pump Kings Blood",
        ingredients: { "Pump": 10, "Vital": 1, "Lucky Potion": 700, "Powered": 5, "Terror": 1 },
        effect: "Sets luck to 700,000x for the next roll",
        luckBoost: 700000,
        oneRoll: true,
        duration: 5
    },
    
    // =================================================================
    // UTILITY POTIONS
    // =================================================================
    {
        name: "Potion of Clarity",
        ingredients: { "Lucky Potion": 50, "Virtual": 2, "Glitch": 1 },
        effect: "Shows you the exact rarity value of your next roll before it happens",
        clarityMode: true,
        oneRoll: true
    },
    {
        name: "Potion of Hindsight",
        ingredients: { "Lucky Potion": 100, "Origin": 1, "Flow": 3 },
        effect: "Lets you 'reroll' your last aura once (keeps the better one)",
        hindsightMode: true,
        oneRoll: true
    },
    {
        name: "Potion of Patience",
        ingredients: { "Lucky Potion": 75, "Twilight": 5, "Cozy": 3 },
        effect: "Doubles luck for 30 seconds, but you can't roll during that time (stacks for next roll)",
        patienceMode: true,
        luckBoost: 1.0,
        duration: 30
    },
    {
        name: "Potion of Momentum",
        ingredients: { "Speed Potion": 50, "Powered": 3, "Watt": 2 },
        effect: "Each consecutive roll within 5 seconds gives +5% luck (stacks up to 10 times)",
        momentumMode: true,
        duration: 300
    },
    {
        name: "Potion of Focus (Legendary)",
        ingredients: { "Lucky Potion": 80, "Bookshelf": 5, "Atomic": 2 },
        effect: "+200% luck for Legendary tier only for 3 minutes",
        focusTier: "legendary",
        focusBoost: 2.0,
        duration: 180
    },
    {
        name: "Potion of Focus (Mythic)",
        ingredients: { "Lucky Potion": 120, "Bookshelf": 10, "Quartz": 3 },
        effect: "+200% luck for Mythic tier only for 3 minutes",
        focusTier: "mythic",
        focusBoost: 2.0,
        duration: 180
    },
    
    // =================================================================
    // RISK/REWARD POTIONS
    // =================================================================
    {
        name: "Gambler's Elixir",
        ingredients: { "Lucky Potion": 60, "Jackpot": 5, "Flushed": 3 },
        effect: "50% chance to double your luck, 50% chance to halve it for 1 minute",
        gamblerMode: true,
        duration: 60
    },
    {
        name: "Potion of Extremes",
        ingredients: { "Lucky Potion": 100, "Exotic": 50, "Undefined": 1 },
        effect: "Removes all Common/Uncommon/Good from the pool, but reduces luck by 50%",
        extremesMode: true,
        luckBoost: -0.5,
        duration: 120
    },
    {
        name: "All-or-Nothing Brew",
        ingredients: { "Lucky Potion": 150, "Jackpot": 10, "Terror": 2 },
        effect: "Next roll is guaranteed Epic+, but if you get below Legendary, lose 100% luck for 30 seconds",
        allOrNothingMode: true,
        oneRoll: true
    },
    {
        name: "Potion of Sacrifice",
        ingredients: { "Lucky Potion": 80, "Lost Soul": 10, "Spectre": 5 },
        effect: "Consume 5 auras from inventory to gain +100% luck for 2 minutes",
        sacrificeMode: true,
        luckBoost: 1.0,
        duration: 120
    },
    
    // =================================================================
    // TIME-BASED POTIONS
    // =================================================================
    {
        name: "Potion of Haste",
        ingredients: { "Speed Potion": 40, "Powered": 2, "Lightning": 1 },
        effect: "+50% roll speed but -25% luck for 1 minute",
        speedBoost: 0.5,
        luckBoost: -0.25,
        duration: 60
    },
    {
        name: "Potion of Deliberation",
        ingredients: { "Lucky Potion": 40, "Twilight": 3, "Cozy": 2 },
        effect: "-50% roll speed but +50% luck for 1 minute",
        speedBoost: -0.5,
        luckBoost: 0.5,
        duration: 60
    },
    {
        name: "Potion of the Hour",
        ingredients: { "Lucky Potion": 100, "Flow": 5, "Origin": 2 },
        effect: "Gain +10% luck for every minute you've been playing this session (max +100%)",
        hourMode: true,
        duration: 300
    },
    
    // =================================================================
    // BIOME/CONDITION POTIONS
    // =================================================================
    {
        name: "Potion of Adaptation",
        ingredients: { "Lucky Potion": 70, "Flora": 10, "Wind": 10, "Aquatic": 5 },
        effect: "+100% luck in your current biome for 3 minutes",
        adaptationMode: true,
        luckBoost: 1.0,
        duration: 180
    },
    {
        name: "Potion of Exploration",
        ingredients: { "Lucky Potion": 90, "Wind": 15, "Starlight": 2 },
        effect: "Next biome change gives +200% luck for 30 seconds",
        explorationMode: true,
        oneRoll: false,
        duration: 1800
    },
    {
        name: "Nightowl's Brew",
        ingredients: { "Lucky Potion": 60, "Lunar": 5, "Twilight": 10 },
        effect: "+150% luck during nighttime only",
        nightMode: true,
        luckBoost: 1.5,
        duration: 300
    },
    {
        name: "Sunseeker's Tonic",
        ingredients: { "Lucky Potion": 60, "Solar": 5, "Starlight": 2 },
        effect: "+150% luck during daytime only",
        dayMode: true,
        luckBoost: 1.5,
        duration: 300
    },
    
    // =================================================================
    // STREAK/COMBO POTIONS
    // =================================================================
    {
        name: "Potion of Consistency",
        ingredients: { "Lucky Potion": 50, "Crystallized": 3, "Prism": 2 },
        effect: "Rolling the same rarity tier twice in a row gives +50% luck for next roll",
        consistencyMode: true,
        duration: 300
    },
    {
        name: "Potion of Variety",
        ingredients: { "Lucky Potion": 80, "Exotic": 20, "Virtual": 3 },
        effect: "Rolling 5 different auras in a row gives +300% luck for next roll",
        varietyMode: true,
        duration: 300
    },
    {
        name: "Breakthrough Catalyst",
        ingredients: { "Lucky Potion": 120, "Breakthrough": 5, "Origin": 2 },
        effect: "Doubles the chance of getting breakthrough variants for 1 minute",
        breakthroughMode: true,
        duration: 60
    },
    
    // =================================================================
    // RESOURCE MANAGEMENT POTIONS
    // =================================================================
    {
        name: "Potion of Efficiency",
        ingredients: { "Lucky Potion": 50, "Crystallized": 3, "Precious": 2 },
        effect: "20% chance to not consume materials when crafting potions for 15 minutes",
        efficiencyMode: true,
        duration: 900000, // 15 minutes
        materialSaveChance: 0.2
    },
    {
        name: "Alchemist's Insight",
        ingredients: { "Lucky Potion": 70, "Atomic": 3, "Virtual": 2 },
        effect: "Shows you what materials you'll get from your next 5 rolls",
        insightMode: true,
        insightCount: 5
    },
    
    // =================================================================
    // SOCIAL/META POTIONS
    // =================================================================
    {
        name: "Potion of the Collector",
        ingredients: { "Lucky Potion": 100, "Bookshelf": 10, "Exotic": 30 },
        effect: "+5% luck for every unique aura you own (capped at +200%)",
        collectorMode: true,
        duration: 300
    },
    {
        name: "Potion of the Beginner",
        ingredients: { "Lucky Potion": 10, "Common": 10, "Divinus": 5 },
        effect: "+500% luck but only works if you have less than 100 total rolls",
        beginnerMode: true,
        luckBoost: 5.0,
        duration: 180
    },
    {
        name: "Potion of Mastery",
        ingredients: { "Lucky Potion": 200, "Origin": 3, "Cosmos": 1 },
        effect: "+1% luck for every 1000 rolls you've done (capped at +300%)",
        masteryMode: true,
        duration: 300
    },
    
    // =================================================================
    // SPECIAL CRAFTED POTIONS
    // =================================================================
    {
        name: "Hwachae",
        ingredients: { "Rainbow Syrup": 1, "Permafrost": 1, "Watermelon": 2, "Lucky Potion": 100 },
        effect: "+100% luck and +25% roll speed for 1 hour",
        luckBoost: 1.0,
        speedBoost: 0.25,
        duration: 3600
    },
    {
        name: "Santa Potion",
        ingredients: { "Lucky Potion": 50, "Gingerbread": 5, "Crystallized": 10, "Rare": 25 },
        effect: "+100% luck and +25% roll speed for 10 minutes",
        luckBoost: 1.0,
        speedBoost: 0.25,
        duration: 600
    },
    {
        name: "???",
        ingredients: { 
            "Lucky Potion": 500, 
            "Heavenly Potion": 10,
            "Rainbow Syrup": 5, 
            "Origin": 10, 
            "Gargantua": 1,
            "Undefined": 3,
            "Exotic": 100
        },
        effect: "x2 Final Luck for 1 Week",
        luckBoost: 1.0,
        duration: 604800
    },
    {
        name: "Transcendent Potion",
        ingredients: { 
            "Speed Potion": 250,
            "Starlight": 100,
            "Powered": 50,
            "Lightning": 25,
            "Watt": 30
        },
        effect: "+1000% Roll Speed for 20000 Rolls - REMOVES AUTOROLL COOLDOWN",
        speedBoost: 10.0,
        rollCount: 20000,
        removeCooldown: true
    },
    {
        name: "Raid Potion",
        ingredients: { 
            "Lucky Potion": 75,
            "Rage": 15,
            "Diaboli": 10,
            "Bleeding": 20,
            "Undead": 25
        },
        effect: "+100% Luck for 30 minutes",
        luckBoost: 1.0,
        duration: 1800
    },
    {
        name: "Voidheart",
        ingredients: { 
            "Raven": 5,
            "Anima": 3,
            "Undefined": 10,
            "Nihility": 15,
            "Nothing": 50
        },
        effect: "Sets luck to 30,000,000% (300,000x) for the next roll - Unlocks Eden Aura (1/1000)",
        luckBoost: 300000.0,
        oneRoll: true,
        duration: 5,
        voidheartMode: true
    }
];