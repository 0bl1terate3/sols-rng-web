// Enhanced Achievements - 100 Total with Rewards and Better Structure
// Categories: ROLLS, RARITY, PLAYTIME, BREAKTHROUGHS, BIOMES, AURAS, POTIONS, ITEMS, RUNES, CRAFTING, SPECIAL, META

const ACHIEVEMENTS_DATA = {
    // =================== ROLLING MILESTONES (15 achievements) ===================
    'first_roll': { name: 'I just started Sol\'s RNG', description: 'Roll once.', requirement: 1, type: 'rolls', category: 'ROLLS', reward: {  } },
    'ten_rolls': { name: 'Getting started', description: 'Roll 10 times.', requirement: 10, type: 'rolls', category: 'ROLLS', reward: {  } },
    'fifty_rolls': { name: 'Half century', description: 'Roll 50 times.', requirement: 50, type: 'rolls', category: 'ROLLS', reward: {  } },
    'hundred_rolls': { name: 'A little bit of rolls', description: 'Roll 100 times.', requirement: 100, type: 'rolls', category: 'ROLLS', reward: {  } },
    'five_hundred_rolls': { name: 'Rolling strong', description: 'Roll 500 times.', requirement: 500, type: 'rolls', category: 'ROLLS', reward: {  } },
    'thousand_rolls': { name: 'I\'m addicted to Sol\'s RNG', description: 'Roll 1,000 times.', requirement: 1000, type: 'rolls', category: 'ROLLS', reward: {  } },
    'five_thousand_rolls': { name: 'Can\'t stop rolling', description: 'Roll 5,000 times.', requirement: 5000, type: 'rolls', category: 'ROLLS', reward: {   } },
    'ten_thousand_rolls': { name: 'Would You Leave? / Nah I\'d Roll', description: 'Roll 10,000 times.', requirement: 10000, type: 'rolls', category: 'ROLLS', reward: {  } },
    'fifty_thousand_rolls': { name: 'Rolling master', description: 'Roll 50,000 times.', requirement: 50000, type: 'rolls', category: 'ROLLS', reward: {   } },
    'hundred_thousand_rolls': { name: 'There\'s no way to stop it!', description: 'Roll 100,000 times.', requirement: 100000, type: 'rolls', category: 'ROLLS', reward: {  } },
    'five_hundred_thousand_rolls': { name: 'Half million milestone', description: 'Roll 500,000 times.', requirement: 500000, type: 'rolls', category: 'ROLLS', reward: {  } },
    'million_rolls': { name: 'Roll, Eat, Sleep, Repeat', description: 'Roll 1,000,000 times.', requirement: 1000000, type: 'rolls', category: 'ROLLS', reward: {  } },
    'five_million_rolls': { name: 'I give my life...', description: 'Roll 5,000,000 times.', requirement: 5000000, type: 'rolls', category: 'ROLLS', reward: {  } },
    'ten_million_rolls': { name: '[10,000,000]', description: 'Roll 10,000,000 times.', requirement: 10000000, type: 'rolls', category: 'ROLLS', reward: {  } },
    'fifty_million_rolls': { name: '[50,000,000]', description: 'Roll 50,000,000 times.', requirement: 50000000, type: 'rolls', category: 'ROLLS', reward: {  } },

    // =================== RARITY HUNTER (12 achievements) ===================
    'first_uncommon': { name: 'Uncommon start', description: 'Obtain an Uncommon tier aura.', requirement: 4, type: 'rarity', category: 'RARITY', reward: {  } },
    'first_rare': { name: 'Getting rare', description: 'Obtain a Rare tier aura.', requirement: 16, type: 'rarity', category: 'RARITY', reward: {  } },
    'first_epic': { name: 'Epic discovery', description: 'Obtain an Epic tier aura.', requirement: 256, type: 'rarity', category: 'RARITY', reward: {  } },
    'first_legendary': { name: 'Legendary moment', description: 'Obtain a Legendary tier aura.', requirement: 1000, type: 'rarity', category: 'RARITY', reward: {  } },
    'first_mythic': { name: 'Into the myths', description: 'Obtain a Mythic tier aura.', requirement: 8192, type: 'rarity', category: 'RARITY', reward: {  } },
    'first_exotic': { name: 'Exotic treasure', description: 'Obtain an Exotic tier aura.', requirement: 40000, type: 'rarity', category: 'RARITY', reward: {  } },
    'first_99k': { name: 'My first 99,999+ finding', description: 'Obtain an aura with 1/99k+ rarity.', requirement: 99999, type: 'rarity', category: 'RARITY', reward: {   } },
    'first_divine': { name: 'Divine intervention', description: 'Obtain a Divine tier aura.', requirement: 125000, type: 'rarity', category: 'RARITY', reward: {  } },
    'first_celestial': { name: 'Celestial being', description: 'Obtain a Celestial tier aura.', requirement: 1000000, type: 'rarity', category: 'RARITY', reward: {  } },
    'first_1m': { name: 'My first 1M+ finding', description: 'Obtain an aura with 1/1M+ rarity.', requirement: 1000000, type: 'rarity', category: 'RARITY', reward: {  } },
    'first_10m': { name: 'My first 10M+ finding', description: 'Obtain an aura with 1/10M+ rarity.', requirement: 10000000, type: 'rarity', category: 'RARITY', reward: {  } },
    'first_100m': { name: 'My first 100M+ finding', description: 'Obtain an aura with 1/100M+ rarity.', requirement: 100000000, type: 'rarity', category: 'RARITY', reward: {  } },
    'first_1b': { name: 'My first 1B+ finding', description: 'Obtain an aura with 1/1B+ rarity.', requirement: 1000000000, type: 'rarity', category: 'RARITY', reward: {  } },

    // =================== TIME TRAVELER (10 achievements) ===================
    'thirty_minutes': { name: 'Take a break', description: 'Play for 30 minutes.', requirement: 30, type: 'playtime', category: 'PLAYTIME', reward: {  } },
    'one_hour': { name: 'I can\'t stop playing this', description: 'Play for 1 hour.', requirement: 60, type: 'playtime', category: 'PLAYTIME', reward: {  } },
    'five_hours': { name: 'Long session', description: 'Play for 5 hours.', requirement: 300, type: 'playtime', category: 'PLAYTIME', reward: {  } },
    'ten_hours': { name: 'Dedicated player', description: 'Play for 10 hours.', requirement: 600, type: 'playtime', category: 'PLAYTIME', reward: {  } },
    'fifty_hours': { name: 'Half century hours', description: 'Play for 50 hours.', requirement: 3000, type: 'playtime', category: 'PLAYTIME', reward: {  } },
    'hundred_hours': { name: 'Waste of time', description: 'Play for 100 hours.', requirement: 6000, type: 'playtime', category: 'PLAYTIME', reward: {  } },
    'thousand_hours': { name: 'Touch the grass', description: 'Play for 1,000 hours.', requirement: 60000, type: 'playtime', category: 'PLAYTIME', reward: {  } },
    'two_thousand_hours': { name: 'Eternal time...', description: 'Play for 2,000 hours.', requirement: 120000, type: 'playtime', category: 'PLAYTIME', reward: {  } },
    'five_thousand_hours': { name: 'My eternal journey', description: 'Play for 5,000 hours.', requirement: 300000, type: 'playtime', category: 'PLAYTIME', reward: {  } },
    'ten_thousand_hours': { name: 'The Lost', description: 'Play for 10,000 hours.', requirement: 600000, type: 'playtime', category: 'PLAYTIME', reward: {  } },

    // =================== BREAKTHROUGH MASTER (10 achievements) ===================
    'first_breakthrough': { name: 'Breakthrough', description: 'Roll a Breakthrough once.', requirement: 1, type: 'breakthroughs', category: 'BREAKTHROUGHS', reward: {   } },
    'five_breakthroughs': { name: 'Break the limit', description: 'Roll 5 Breakthroughs.', requirement: 5, type: 'breakthroughs', category: 'BREAKTHROUGHS', reward: {   } },
    'fifty_breakthroughs': { name: 'Breakthrough specialist', description: 'Roll 50 Breakthroughs.', requirement: 50, type: 'breakthroughs', category: 'BREAKTHROUGHS', reward: {   } },
    'hundred_breakthroughs': { name: 'Break the Space', description: 'Roll 100 Breakthroughs.', requirement: 100, type: 'breakthroughs', category: 'BREAKTHROUGHS', reward: {   } },
    'five_hundred_breakthroughs': { name: 'Breaking reality', description: 'Roll 500 Breakthroughs.', requirement: 500, type: 'breakthroughs', category: 'BREAKTHROUGHS', reward: {   } },
    'thousand_breakthroughs': { name: 'Break the Galaxy', description: 'Roll 1,000 Breakthroughs.', requirement: 1000, type: 'breakthroughs', category: 'BREAKTHROUGHS', reward: {   } },
    'five_thousand_breakthroughs': { name: 'Shattering dimensions', description: 'Roll 5,000 Breakthroughs.', requirement: 5000, type: 'breakthroughs', category: 'BREAKTHROUGHS', reward: {   } },
    'ten_thousand_breakthroughs': { name: 'Break the Reality', description: 'Roll 10,000 Breakthroughs.', requirement: 10000, type: 'breakthroughs', category: 'BREAKTHROUGHS', reward: {   } },
    'hundred_thousand_breakthroughs': { name: 'Dimensional shifter', description: 'Roll 100,000 Breakthroughs.', requirement: 100000, type: 'breakthroughs', category: 'BREAKTHROUGHS', reward: {   } },
    'million_breakthroughs': { name: 'Biome itself', description: 'Roll 1,000,000 Breakthroughs.', requirement: 1000000, type: 'breakthroughs', category: 'BREAKTHROUGHS', reward: {  } },

    // =================== BIOME EXPLORER (20 achievements) ===================
    'windy_explorer': { name: 'Windy Explorer', description: 'Experience the WINDY biome.', requirement: 'WINDY', type: 'biome_seen', category: 'BIOMES', reward: {  } },
    'snowy_explorer': { name: 'Snowy Explorer', description: 'Experience the SNOWY biome.', requirement: 'SNOWY', type: 'biome_seen', category: 'BIOMES', reward: {  } },
    'rainy_explorer': { name: 'Rainy Explorer', description: 'Experience the RAINY biome.', requirement: 'RAINY', type: 'biome_seen', category: 'BIOMES', reward: {  } },
    'sandstorm_explorer': { name: 'Sandstorm Explorer', description: 'Experience the SANDSTORM biome.', requirement: 'SANDSTORM', type: 'biome_seen', category: 'BIOMES', reward: {  } },
    'jungle_explorer': { name: 'Jungle Explorer', description: 'Experience the JUNGLE biome.', requirement: 'JUNGLE', type: 'biome_seen', category: 'BIOMES', reward: {  } },
    'tornado_explorer': { name: 'Tornado Explorer', description: 'Experience the TORNADO biome.', requirement: 'TORNADO', type: 'biome_seen', category: 'BIOMES', reward: {   } },
    'dunes_explorer': { name: 'Dunes Explorer', description: 'Experience the DUNES biome.', requirement: 'DUNES', type: 'biome_seen', category: 'BIOMES', reward: {   } },
    'starfall_explorer': { name: 'Starfall Explorer', description: 'Experience the STARFALL biome.', requirement: 'STARFALL', type: 'biome_seen', category: 'BIOMES', reward: {   } },
    'volcano_explorer': { name: 'Volcano Explorer', description: 'Experience the VOLCANO biome.', requirement: 'VOLCANO', type: 'biome_seen', category: 'BIOMES', reward: {   } },
    'hell_explorer': { name: 'Hell Explorer', description: 'Experience the HELL biome.', requirement: 'HELL', type: 'biome_seen', category: 'BIOMES', reward: {   } },
    'charged_explorer': { name: 'Charged Explorer', description: 'Experience the CHARGED biome.', requirement: 'CHARGED', type: 'biome_seen', category: 'BIOMES', reward: {   } },
    'corruption_explorer': { name: 'Corruption Explorer', description: 'Experience the CORRUPTION biome.', requirement: 'CORRUPTION', type: 'biome_seen', category: 'BIOMES', reward: {   } },
    'void_explorer': { name: 'VOID Explorer', description: 'Experience the VOID biome.', requirement: 'VOID', type: 'biome_seen', category: 'BIOMES', reward: {  } },
    'null_explorer': { name: 'NULL Explorer', description: 'Experience the NULL biome.', requirement: 'NULL', type: 'biome_seen', category: 'BIOMES', reward: {  } },
    'glitched_explorer': { name: 'GLITCHED Explorer', description: 'Experience the GLITCHED biome.', requirement: 'GLITCHED', type: 'biome_seen', category: 'BIOMES', reward: {  } },
    'dreamspace_explorer': { name: 'DREAMSPACE Explorer', description: 'Experience the DREAMSPACE biome.', requirement: 'DREAMSPACE', type: 'biome_seen', category: 'BIOMES', reward: {  } },
    'sky_explorer': { name: 'Sky Explorer', description: 'Experience the SKY biome.', requirement: 'SKY', type: 'biome_seen', category: 'BIOMES', reward: {   } },
    'hallow_explorer': { name: 'Hallow Explorer', description: 'Experience the HALLOW biome.', requirement: 'HALLOW', type: 'biome_seen', category: 'BIOMES', reward: {   } },
    'ancient_explorer': { name: 'Ancient Explorer', description: 'Experience the ANCIENT biome.', requirement: 'ANCIENT', type: 'biome_seen', category: 'BIOMES', reward: {  } },
    'bioluminescent_explorer': { name: 'Bioluminescent Explorer', description: 'Experience the BIOLUMINESCENT biome.', requirement: 'BIOLUMINESCENT', type: 'biome_seen', category: 'BIOMES', reward: {  } },

    // =================== AURA COLLECTOR (20 achievements) ===================
    'glitch_obtained': { name: '-Flaws in the World-', description: 'Obtain GLITCH', requirement: 'Glitch', type: 'specific_aura', category: 'AURAS', reward: {  } },
    'oppression_obtained': { name: '-One who stands before God-', description: 'Obtain [OPPRESSION]', requirement: 'Oppression', type: 'specific_aura', category: 'AURAS', reward: {  } },
    'oblivion_obtained': { name: '-The Unknown-', description: 'Obtain OBLIVION', requirement: 'Oblivion', type: 'specific_aura', category: 'AURAS', reward: {  } },
    'arcane_obtained': { name: 'Arcane Knowledge', description: 'Obtain Arcane', requirement: 'Arcane', type: 'specific_aura', category: 'AURAS', reward: {  } },
    'galaxy_obtained': { name: 'Cosmic Explorer', description: 'Obtain Galaxy', requirement: 'Galaxy', type: 'specific_aura', category: 'AURAS', reward: {  } },
    'hades_obtained': { name: 'Underworld King', description: 'Obtain Hades', requirement: 'Hades', type: 'specific_aura', category: 'AURAS', reward: {  } },
    'overture_obtained': { name: 'The Beginning', description: 'Obtain Overture', requirement: 'Overture', type: 'specific_aura', category: 'AURAS', reward: {  } },
    'archangel_obtained': { name: 'Heaven\'s Warrior', description: 'Obtain Archangel', requirement: 'Archangel', type: 'specific_aura', category: 'AURAS', reward: {  } },
    'abyssal_hunter_obtained': { name: 'Deep Sea Hunter', description: 'Obtain Abyssal Hunter', requirement: 'Abyssal Hunter', type: 'specific_aura', category: 'AURAS', reward: {  } },
    'sovereign_obtained': { name: 'Royal Authority', description: 'Obtain Sovereign', requirement: 'Sovereign', type: 'specific_aura', category: 'AURAS', reward: {  } },
    'equinox_obtained': { name: 'Perfect Balance', description: 'Obtain 『E Q U I N O X』', requirement: '『E Q U I N O X』', type: 'specific_aura', category: 'AURAS', reward: {  } },
    'abomination_obtained': { name: 'The Abominable', description: 'Obtain Abomination', requirement: 'Abomination', type: 'specific_aura', category: 'AURAS', reward: {  } },
    'ten_auras': { name: 'Aura Starter', description: 'Collect 10 different auras', requirement: 10, type: 'unique_auras', category: 'AURAS', reward: {  } },
    'twenty_auras': { name: 'Aura Gatherer', description: 'Collect 20 different auras', requirement: 20, type: 'unique_auras', category: 'AURAS', reward: {  } },
    'thirty_auras': { name: 'Aura Collector', description: 'Collect 30 different auras', requirement: 30, type: 'unique_auras', category: 'AURAS', reward: {   } },
    'fifty_auras': { name: 'Aura Enthusiast', description: 'Collect 50 different auras', requirement: 50, type: 'unique_auras', category: 'AURAS', reward: {   } },
    'seventy_five_auras': { name: 'Aura Expert', description: 'Collect 75 different auras', requirement: 75, type: 'unique_auras', category: 'AURAS', reward: {  } },
    'hundred_auras': { name: 'Master Collector', description: 'Collect 100 different auras', requirement: 100, type: 'unique_auras', category: 'AURAS', reward: {  } },
    'hundred_fifty_auras': { name: 'Ultimate Collector', description: 'Collect 150 different auras', requirement: 150, type: 'unique_auras', category: 'AURAS', reward: {  } },
    'two_hundred_auras': { name: 'Complete Collection', description: 'Collect 200 different auras', requirement: 200, type: 'unique_auras', category: 'AURAS', reward: {  } },

    // =================== POTION MASTER (8 achievements) ===================
    'hundred_potions': { name: 'Potion Apprentice', description: 'Use 100 potions', requirement: 100, type: 'potions_used', category: 'POTIONS', reward: {  } },
    'thousand_potions': { name: 'Potion Enthusiast', description: 'Use 1,000 potions', requirement: 1000, type: 'potions_used', category: 'POTIONS', reward: {  } },
    'five_thousand_potions': { name: 'Potion Lover', description: 'Use 5,000 potions', requirement: 5000, type: 'potions_used', category: 'POTIONS', reward: {  } },
    'ten_thousand_potions': { name: 'Potion Expert', description: 'Use 10,000 potions', requirement: 10000, type: 'potions_used', category: 'POTIONS', reward: {  } },
    'twenty_five_thousand_potions': { name: 'Potion Connoisseur', description: 'Use 25,000 potions', requirement: 25000, type: 'potions_used', category: 'POTIONS', reward: {   } },
    'fifty_thousand_potions': { name: 'The Sommelier', description: 'Use 50,000 potions', requirement: 50000, type: 'potions_used', category: 'POTIONS', reward: {  } },
    'hundred_thousand_potions': { name: 'Potion Legend', description: 'Use 100,000 potions', requirement: 100000, type: 'potions_used', category: 'POTIONS', reward: {   } },
    'million_potions': { name: 'Alchemist Supreme', description: 'Use 1,000,000 potions', requirement: 1000000, type: 'potions_used', category: 'POTIONS', reward: {   } },

    // =================== META ACHIEVEMENTS (9 achievements) ===================
    'ten_achievements': { name: 'Achievement Slayer', description: 'Complete 10 achievements', requirement: 10, type: 'achievement_count', category: 'META', reward: {  } },
    'twenty_achievements': { name: 'Achievement Master', description: 'Complete 20 achievements', requirement: 20, type: 'achievement_count', category: 'META', reward: {  } },
    'thirty_achievements': { name: 'Achievement Champion', description: 'Complete 30 achievements', requirement: 30, type: 'achievement_count', category: 'META', reward: {  } },
    'fifty_achievements': { name: 'Achievement Legend', description: 'Complete 50 achievements', requirement: 50, type: 'achievement_count', category: 'META', reward: {  } },
    'seventy_five_achievements': { name: 'Achievement God', description: 'Complete 75 achievements', requirement: 75, type: 'achievement_count', category: 'META', reward: {  } },
    'ninety_achievements': { name: 'Achievement Titan', description: 'Complete 90 achievements', requirement: 90, type: 'achievement_count', category: 'META', reward: {  } },
    'hundred_achievements': { name: 'Century Club', description: 'Complete 100 achievements', requirement: 100, type: 'achievement_count', category: 'META', reward: {  } },
    'hundred_fifty_achievements': { name: 'Achievement Emperor', description: 'Complete 150 achievements', requirement: 150, type: 'achievement_count', category: 'META', reward: {  } },
    'all_achievements': { name: 'Perfect Achiever', description: 'Complete ALL 525 achievements!', requirement: 525, type: 'achievement_count', category: 'META', reward: {  } },

    // =================== RUNE MASTER (10 achievements) ===================
    'first_rune': { name: 'Rune Novice', description: 'Use a rune for the first time', requirement: 1, type: 'runes_used', category: 'RUNES', reward: {  } },
    'ten_runes': { name: 'Rune Explorer', description: 'Use 10 runes', requirement: 10, type: 'runes_used', category: 'RUNES', reward: {   } },
    'fifty_runes': { name: 'Rune Enthusiast', description: 'Use 50 runes', requirement: 50, type: 'runes_used', category: 'RUNES', reward: {   } },
    'hundred_runes': { name: 'Rune Master', description: 'Use 100 runes', requirement: 100, type: 'runes_used', category: 'RUNES', reward: {   } },
    'five_hundred_runes': { name: 'Runic Scholar', description: 'Use 500 runes', requirement: 500, type: 'runes_used', category: 'RUNES', reward: {  } },
    'thousand_runes': { name: 'Runic Sage', description: 'Use 1,000 runes', requirement: 1000, type: 'runes_used', category: 'RUNES', reward: {  } },
    'five_thousand_runes': { name: 'Runic Legend', description: 'Use 5,000 runes', requirement: 5000, type: 'runes_used', category: 'RUNES', reward: {  } },
    'ten_thousand_runes': { name: 'Runic Deity', description: 'Use 10,000 runes', requirement: 10000, type: 'runes_used', category: 'RUNES', reward: {  } },
    'open_first_chest': { name: 'Treasure Hunter', description: 'Open a Random Rune Chest', requirement: 1, type: 'chests_opened', category: 'RUNES', reward: {  } },
    'open_hundred_chests': { name: 'Chest Collector', description: 'Open 100 Random Rune Chests', requirement: 100, type: 'chests_opened', category: 'RUNES', reward: {  } },

    // =================== CRAFTING MASTER (15 achievements) ===================
    'first_craft': { name: 'First Steps', description: 'Craft your first item', requirement: 1, type: 'crafts_made', category: 'CRAFTING', reward: {  } },
    'ten_crafts': { name: 'Apprentice Crafter', description: 'Craft 10 items', requirement: 10, type: 'crafts_made', category: 'CRAFTING', reward: {  } },
    'fifty_crafts': { name: 'Skilled Crafter', description: 'Craft 50 items', requirement: 50, type: 'crafts_made', category: 'CRAFTING', reward: {  } },
    'hundred_crafts': { name: 'Expert Crafter', description: 'Craft 100 items', requirement: 100, type: 'crafts_made', category: 'CRAFTING', reward: {  } },
    'five_hundred_crafts': { name: 'Master Crafter', description: 'Craft 500 items', requirement: 500, type: 'crafts_made', category: 'CRAFTING', reward: {  } },
    'thousand_crafts': { name: 'Legendary Crafter', description: 'Craft 1,000 items', requirement: 1000, type: 'crafts_made', category: 'CRAFTING', reward: {  } },
    'craft_first_gear': { name: 'Gear Maker', description: 'Craft your first gear', requirement: 1, type: 'gears_crafted', category: 'CRAFTING', reward: {  } },
    'craft_ten_gears': { name: 'Gear Smith', description: 'Craft 10 gears', requirement: 10, type: 'gears_crafted', category: 'CRAFTING', reward: {  } },
    'craft_fifty_gears': { name: 'Master Smith', description: 'Craft 50 gears', requirement: 50, type: 'gears_crafted', category: 'CRAFTING', reward: {  } },
    'craft_hundred_gears': { name: 'Forge Master', description: 'Craft 100 gears', requirement: 100, type: 'gears_crafted', category: 'CRAFTING', reward: {  } },
    'craft_t5_gear': { name: 'Advanced Engineering', description: 'Craft a Tier 5 gear', requirement: 5, type: 'gear_tier_crafted', category: 'CRAFTING', reward: {  } },
    'craft_t8_gear': { name: 'Ultimate Creation', description: 'Craft a Tier 8 gear', requirement: 8, type: 'gear_tier_crafted', category: 'CRAFTING', reward: {  } },
    'craft_t10_gear': { name: 'God-Tier Smith', description: 'Craft a Tier 10 gear', requirement: 10, type: 'gear_tier_crafted', category: 'CRAFTING', reward: {  } },
    'craft_hundred_potions': { name: 'Potion Brewer', description: 'Craft 100 potions', requirement: 100, type: 'potions_crafted', category: 'CRAFTING', reward: {  } },
    'craft_thousand_potions': { name: 'Master Alchemist', description: 'Craft 1,000 potions', requirement: 1000, type: 'potions_crafted', category: 'CRAFTING', reward: {  } },

    // =================== SPEED RUNNER (10 achievements) ===================
    'hundred_rolls_one_hour': { name: 'Speed Demon', description: 'Roll 100 times in one session', requirement: 100, type: 'session_rolls', category: 'SPEED', reward: {  } },
    'thousand_rolls_one_day': { name: 'Marathon Runner', description: 'Roll 1,000 times in one day', requirement: 1000, type: 'daily_rolls', category: 'SPEED', reward: {  } },
    'use_auto_roll': { name: 'Automation', description: 'Enable auto-roll for the first time', requirement: 1, type: 'auto_roll_used', category: 'SPEED', reward: {  } },
    'ten_thousand_auto_rolls': { name: 'Auto Pilot', description: 'Complete 10,000 auto rolls', requirement: 10000, type: 'auto_rolls_completed', category: 'SPEED', reward: {  } },
    'hundred_thousand_auto_rolls': { name: 'Full Automation', description: 'Complete 100,000 auto rolls', requirement: 100000, type: 'auto_rolls_completed', category: 'SPEED', reward: {  } },
    'fast_roll_streak': { name: 'Lightning Reflexes', description: 'Complete 50 rolls with 150%+ speed', requirement: 50, type: 'quick_roll_streak', category: 'SPEED', reward: {  } },
    'roll_with_max_speed': { name: 'Supersonic', description: 'Roll with 200%+ roll speed', requirement: 200, type: 'max_speed_achieved', category: 'SPEED', reward: {  } },
    'roll_with_500_speed': { name: 'Beyond Light Speed', description: 'Roll with 500%+ roll speed', requirement: 500, type: 'max_speed_achieved', category: 'SPEED', reward: {  } },
    'no_pause_session': { name: 'Non-Stop Action', description: 'Play actively for 3 hours', requirement: 180, type: 'continuous_minutes', category: 'SPEED', reward: {  } },
    'rapid_fire': { name: 'Rapid Fire', description: 'Complete 10 rolls in under 10 seconds', requirement: 10, type: 'rapid_rolls', category: 'SPEED', reward: {  } },

    // =================== LUCKY STREAKS (10 achievements) ===================
    'lucky_streak_5': { name: 'Lucky Streak', description: 'Roll 5 rare+ auras in a row', requirement: 5, type: 'rare_streak', category: 'STREAKS', reward: {  } },
    'lucky_streak_10': { name: 'Incredibly Lucky', description: 'Roll 10 rare+ auras in a row', requirement: 10, type: 'rare_streak', category: 'STREAKS', reward: {  } },
    'epic_streak_5': { name: 'Epic Streak', description: 'Roll 5 epic+ auras in a row', requirement: 5, type: 'epic_streak', category: 'STREAKS', reward: {  } },
    'legendary_streak_3': { name: 'Legendary Luck', description: 'Roll 3 legendary+ auras in a row', requirement: 3, type: 'legendary_streak', category: 'STREAKS', reward: {  } },
    'no_common_100': { name: 'Above Average', description: 'Roll 100 times without getting a common aura', requirement: 100, type: 'no_common_streak', category: 'STREAKS', reward: {  } },
    'breakthrough_streak_10': { name: 'Breaking Limits', description: 'Roll 10 breakthroughs in a row', requirement: 10, type: 'breakthrough_streak', category: 'STREAKS', reward: {  } },
    'same_aura_10': { name: 'Déjà Vu', description: 'Roll the same aura 10 times', requirement: 10, type: 'same_aura_count', category: 'STREAKS', reward: {  } },
    'same_aura_100': { name: 'Groundhog Day', description: 'Roll the same aura 100 times', requirement: 100, type: 'same_aura_count', category: 'STREAKS', reward: {  } },
    'tier_climb': { name: 'Climbing the Ladder', description: 'Roll increasingly rare tiers 5 times in a row', requirement: 5, type: 'tier_climb_streak', category: 'STREAKS', reward: {  } },
    'lucky_day': { name: 'Lucky Day', description: 'Roll 3 mythic+ auras in one day', requirement: 3, type: 'daily_mythic_count', category: 'STREAKS', reward: {  } },

    // =================== COLLECTION SPECIALIST (15 achievements) ===================
    'collect_all_commons': { name: 'Common Knowledge', description: 'Collect all common tier auras', requirement: 'all_common', type: 'tier_collection', category: 'COLLECTION', reward: {  } },
    'collect_all_uncommons': { name: 'Uncommon Collector', description: 'Collect all uncommon tier auras', requirement: 'all_uncommon', type: 'tier_collection', category: 'COLLECTION', reward: {  } },
    'collect_all_rares': { name: 'Rare Collector', description: 'Collect all rare tier auras', requirement: 'all_rare', type: 'tier_collection', category: 'COLLECTION', reward: {  } },
    'collect_all_epics': { name: 'Epic Collector', description: 'Collect all epic tier auras', requirement: 'all_epic', type: 'tier_collection', category: 'COLLECTION', reward: {  } },
    'collect_all_legendaries': { name: 'Legendary Collector', description: 'Collect all legendary tier auras', requirement: 'all_legendary', type: 'tier_collection', category: 'COLLECTION', reward: {  } },
    'collect_all_mythics': { name: 'Mythic Collector', description: 'Collect all mythic tier auras', requirement: 'all_mythic', type: 'tier_collection', category: 'COLLECTION', reward: {  } },
    'collect_all_exotics': { name: 'Exotic Collector', description: 'Collect all exotic tier auras', requirement: 'all_exotic', type: 'tier_collection', category: 'COLLECTION', reward: {  } },
    'collect_all_divines': { name: 'Divine Collector', description: 'Collect all divine tier auras', requirement: 'all_divine', type: 'tier_collection', category: 'COLLECTION', reward: {  } },
    'collect_all_mutations': { name: 'Mutation Master', description: 'Collect 50 mutation auras', requirement: 50, type: 'mutations_collected', category: 'COLLECTION', reward: {  } },
    'collect_all_star_auras': { name: 'Star Collector', description: 'Collect ★, ★★, and ★★★', requirement: 3, type: 'star_collection', category: 'COLLECTION', reward: {  } },
    'hoarder_1000': { name: 'Hoarder', description: 'Have 1,000+ of any single aura', requirement: 1000, type: 'aura_hoard_count', category: 'COLLECTION', reward: {  } },
    'hoarder_10000': { name: 'Mega Hoarder', description: 'Have 10,000+ of any single aura', requirement: 10000, type: 'aura_hoard_count', category: 'COLLECTION', reward: {  } },
    'diversity': { name: 'Diverse Portfolio', description: 'Have at least 1 of every tier in inventory', requirement: 1, type: 'tier_diversity', category: 'COLLECTION', reward: {  } },
    'complete_collection': { name: 'Master Collector Supreme', description: 'Collect ALL auras in the game', requirement: 'all_auras', type: 'complete_collection', category: 'COLLECTION', reward: {  } },
    'biome_specialist': { name: 'Biome Specialist', description: 'Collect all auras from one biome', requirement: 1, type: 'biome_complete', category: 'COLLECTION', reward: {  } },

    // =================== GEAR MASTER (10 achievements) ===================
    'equip_first_gear': { name: 'Armed and Ready', description: 'Equip your first gear', requirement: 1, type: 'gear_equipped', category: 'GEAR', reward: {  } },
    'equip_both_slots': { name: 'Fully Equipped', description: 'Equip gears in both slots', requirement: 2, type: 'both_slots_equipped', category: 'GEAR', reward: {  } },
    'equip_t5_gear': { name: 'High Tier Equipment', description: 'Equip a Tier 5+ gear', requirement: 5, type: 'tier_equipped', category: 'GEAR', reward: {  } },
    'equip_t10_gear': { name: 'God-Tier Equipment', description: 'Equip a Tier 10 gear', requirement: 10, type: 'tier_equipped', category: 'GEAR', reward: {  } },
    'roll_with_500_luck': { name: 'Luck Overload', description: 'Roll with 500+ luck', requirement: 500, type: 'max_luck_achieved', category: 'GEAR', reward: {  } },
    'roll_with_1000_luck': { name: 'Maximum Luck', description: 'Roll with 1,000+ luck', requirement: 1000, type: 'max_luck_achieved', category: 'GEAR', reward: {  } },
    'own_10_gears': { name: 'Gear Collector', description: 'Own 10 different gears', requirement: 10, type: 'unique_gears_owned', category: 'GEAR', reward: {  } },
    'own_25_gears': { name: 'Arsenal', description: 'Own 25 different gears', requirement: 25, type: 'unique_gears_owned', category: 'GEAR', reward: {  } },
    'own_all_t1_gears': { name: 'T1 Complete', description: 'Own all Tier 1 gears', requirement: 'all_t1', type: 'tier_set_complete', category: 'GEAR', reward: {  } },
    'gear_swap_master': { name: 'Gear Swapper', description: 'Change equipped gear 100 times', requirement: 100, type: 'gear_swaps', category: 'GEAR', reward: {  } },

    // =================== SPECIAL CHALLENGES (15 achievements) ===================
    'no_potions_challenge': { name: 'Pure Skill', description: 'Roll 1,000 times without using any potions', requirement: 1000, type: 'no_potion_rolls', category: 'CHALLENGES', reward: {  } },
    'no_gear_challenge': { name: 'Naked Run', description: 'Roll 500 times with no gear equipped', requirement: 500, type: 'no_gear_rolls', category: 'CHALLENGES', reward: {  } },
    'only_manual_rolls': { name: 'The Manual Way', description: 'Roll 10,000 times without auto-roll', requirement: 10000, type: 'manual_only_rolls', category: 'CHALLENGES', reward: {  } },
    'mythic_without_luck': { name: 'Raw Luck', description: 'Roll a mythic+ with base 100% luck', requirement: 1, type: 'mythic_base_luck', category: 'CHALLENGES', reward: {  } },
    'transcendent_without_luck': { name: 'Miracle Worker', description: 'Roll a transcendent+ with base 100% luck', requirement: 1, type: 'transcendent_base_luck', category: 'CHALLENGES', reward: {  } },
    'biome_marathon': { name: 'Biome Marathon', description: 'Experience 5 different biomes in one day', requirement: 5, type: 'daily_biomes', category: 'CHALLENGES', reward: {   } },
    'rune_marathon': { name: 'Rune Marathon', description: 'Use 5 different runes in one day', requirement: 5, type: 'daily_runes', category: 'CHALLENGES', reward: {   } },
    'daily_warrior': { name: 'Daily Warrior', description: 'Complete 7 consecutive daily login days', requirement: 7, type: 'daily_login_streak', category: 'DAILY', reward: {  } },
    'weekly_champion': { name: 'Weekly Champion', description: 'Complete 30 consecutive daily login days', requirement: 30, type: 'daily_login_streak', category: 'DAILY', reward: {  } },
    'session_master': { name: 'Session Master', description: 'Play 10 different sessions in one day', requirement: 10, type: 'daily_sessions', category: 'DAILY', reward: {  } },
    'early_bird': { name: 'Early Bird', description: 'Log in during the first hour after daily reset', requirement: 1, type: 'early_login', category: 'DAILY', reward: {  } },
    'night_owl': { name: 'Night Owl', description: 'Roll 100 times between midnight and 4am', requirement: 100, type: 'night_rolls', category: 'DAILY', reward: {  } },

    // =================== ELEMENTAL MASTER (15 achievements) ===================
    'fire_elemental': { name: 'Fire Elemental', description: 'Obtain Ruby, Ash, and Hellfire', requirement: 3, type: 'element_collection', category: 'ELEMENTAL', reward: {  } },
    'water_elemental': { name: 'Water Elemental', description: 'Obtain Aquamarine, Glacier, and Abyssal Hunter', requirement: 3, type: 'element_collection', category: 'ELEMENTAL', reward: {  } },
    'earth_elemental': { name: 'Earth Elemental', description: 'Obtain Topaz, Emerald, and Jade', requirement: 3, type: 'element_collection', category: 'ELEMENTAL', reward: {  } },
    'air_elemental': { name: 'Air Elemental', description: 'Obtain Wind, Lightning, and Tempest', requirement: 3, type: 'element_collection', category: 'ELEMENTAL', reward: {  } },
    'star_elemental': { name: 'Star Elemental', description: 'Obtain ★, ★★, and ★★★', requirement: 3, type: 'element_collection', category: 'ELEMENTAL', reward: {  } },
    'cosmic_elemental': { name: 'Cosmic Elemental', description: 'Obtain Galaxy, Cosmos, and Quasar', requirement: 3, type: 'element_collection', category: 'ELEMENTAL', reward: {  } },
    'shadow_elemental': { name: 'Shadow Elemental', description: 'Obtain Spectre, Terror, and Nightmare', requirement: 3, type: 'element_collection', category: 'ELEMENTAL', reward: {  } },
    'light_elemental': { name: 'Light Elemental', description: 'Obtain Solar, Starlight, and Luminosity', requirement: 3, type: 'element_collection', category: 'ELEMENTAL', reward: {  } },
    'chaos_elemental': { name: 'Chaos Elemental', description: 'Obtain Glitch, ERROR, and Segfault', requirement: 3, type: 'element_collection', category: 'ELEMENTAL', reward: {  } },
    'nature_elemental': { name: 'Nature Elemental', description: 'Obtain Natural, Flora, and Overgrowth', requirement: 3, type: 'element_collection', category: 'ELEMENTAL', reward: {  } },
    'metal_elemental': { name: 'Metal Elemental', description: 'Obtain Copper, Gilded, and Midas', requirement: 3, type: 'element_collection', category: 'ELEMENTAL', reward: {  } },
    'crystal_elemental': { name: 'Crystal Elemental', description: 'Obtain Crystallized, Quartz, and Diamond', requirement: 3, type: 'element_collection', category: 'ELEMENTAL', reward: {  } },
    'time_elemental': { name: 'Time Elemental', description: 'Obtain Eclipse, Equinox, and Zenith', requirement: 3, type: 'element_collection', category: 'ELEMENTAL', reward: {  } },
    'void_elemental': { name: 'Void Elemental', description: 'Obtain NULL, Oblivion, and Void', requirement: 3, type: 'element_collection', category: 'ELEMENTAL', reward: {  } },
    'elemental_master': { name: 'Elemental Master', description: 'Complete all elemental collections', requirement: 'all_elements', type: 'element_master', category: 'ELEMENTAL', reward: {  } },

    // =================== COMBINATION SPECIALIST (20 achievements) ===================
    'ruby_sapphire_combo': { name: 'Fire & Ice', description: 'Obtain Ruby and Sapphire in the same session', requirement: 2, type: 'session_combo', category: 'COMBINATIONS', reward: {  } },
    'solar_lunar_combo': { name: 'Celestial Balance', description: 'Obtain Solar and Lunar in the same session', requirement: 2, type: 'session_combo', category: 'COMBINATIONS', reward: {  } },
    'galaxy_universe_combo': { name: 'Cosmic Duo', description: 'Obtain Galaxy and Universe in the same session', requirement: 2, type: 'session_combo', category: 'COMBINATIONS', reward: {  } },
    'glitch_error_combo': { name: 'System Malfunction', description: 'Obtain Glitch and ERROR in the same session', requirement: 2, type: 'session_combo', category: 'COMBINATIONS', reward: {  } },
    'three_star_combo': { name: 'Constellation', description: 'Obtain ★, ★★, and ★★★ in the same session', requirement: 3, type: 'session_combo', category: 'COMBINATIONS', reward: {  } },
    'elemental_storm': { name: 'Elemental Storm', description: 'Obtain 4 different elemental auras in one session', requirement: 4, type: 'session_combo', category: 'COMBINATIONS', reward: {  } },
    'rare_trifecta': { name: 'Rare Trifecta', description: 'Obtain 3 rare auras with 1/1k+ rarity in one session', requirement: 3, type: 'rare_session_combo', category: 'COMBINATIONS', reward: {  } },
    'epic_quartet': { name: 'Epic Quartet', description: 'Obtain 4 epic auras in one session', requirement: 4, type: 'session_combo', category: 'COMBINATIONS', reward: {  } },
    'legendary_triple': { name: 'Legendary Triple', description: 'Obtain 3 legendary auras in one session', requirement: 3, type: 'session_combo', category: 'COMBINATIONS', reward: {  } },
    'mythic_double': { name: 'Mythic Double', description: 'Obtain 2 mythic auras in one session', requirement: 2, type: 'session_combo', category: 'COMBINATIONS', reward: {  } },
    'exotic_pair': { name: 'Exotic Pair', description: 'Obtain 2 exotic auras in one session', requirement: 2, type: 'session_combo', category: 'COMBINATIONS', reward: {  } },
    'divine_duo': { name: 'Divine Duo', description: 'Obtain 2 divine auras in one session', requirement: 2, type: 'session_combo', category: 'COMBINATIONS', reward: {  } },
    'celestial_combo': { name: 'Celestial Combination', description: 'Obtain 2 celestial auras in one session', requirement: 2, type: 'session_combo', category: 'COMBINATIONS', reward: {  } },
    'transcendent_twins': { name: 'Transcendent Twins', description: 'Obtain 2 transcendent auras in one session', requirement: 2, type: 'session_combo', category: 'COMBINATIONS', reward: {  } },
    'opposite_attract': { name: 'Opposite Attraction', description: 'Obtain Solar and Lunar in consecutive rolls', requirement: 2, type: 'consecutive_combo', category: 'COMBINATIONS', reward: {  } },
    'rarity_escalation': { name: 'Rarity Escalation', description: 'Obtain increasingly rare auras 5 times in a row', requirement: 5, type: 'escalation_combo', category: 'COMBINATIONS', reward: {  } },
    'perfect_session': { name: 'Perfect Session', description: 'Obtain 10+ rare auras in one session without any commons', requirement: 10, type: 'perfect_session', category: 'COMBINATIONS', reward: {  } },
    'aura_synergy': { name: 'Aura Synergy', description: 'Obtain 5 auras that share a common theme in one session', requirement: 5, type: 'theme_combo', category: 'COMBINATIONS', reward: {  } },
    'combination_master': { name: 'Combination Master', description: 'Complete 15 different combination achievements', requirement: 15, type: 'combo_master', category: 'COMBINATIONS', reward: {  } },

    // =================== BIOME SPECIALIST (15 achievements) ===================
    'weather_master': { name: 'Weather Master', description: 'Experience Windy, Rainy, and Snowy biomes in one day', requirement: 3, type: 'weather_biomes', category: 'BIOME_SPEC', reward: {  } },
    'extreme_weather': { name: 'Extreme Weather', description: 'Experience Sandstorm and Hurricane in one day', requirement: 2, type: 'extreme_biomes', category: 'BIOME_SPEC', reward: {  } },
    'celestial_events': { name: 'Celestial Events', description: 'Experience Starfall and Eclipse in one day', requirement: 2, type: 'celestial_biomes', category: 'BIOME_SPEC', reward: {  } },
    'dangerous_territory': { name: 'Dangerous Territory', description: 'Experience Hell and Corruption in one day', requirement: 2, type: 'danger_biomes', category: 'BIOME_SPEC', reward: {  } },
    'glitched_reality': { name: 'Glitched Reality', description: 'Experience NULL and GLITCHED in one day', requirement: 2, type: 'glitch_biomes', category: 'BIOME_SPEC', reward: {  } },
    'biome_mastery': { name: 'Biome Mastery', description: 'Experience 8 different biomes in one week', requirement: 8, type: 'weekly_biomes', category: 'BIOME_SPEC', reward: {  } },
    'biome_lord': { name: 'Biome Lord', description: 'Experience all 20 main biomes', requirement: 20, type: 'all_biomes', category: 'BIOME_SPEC', reward: {  } },
    'sandstorm_specialist': { name: 'Sandstorm Specialist', description: 'Experience Sandstorm biome 10 times', requirement: 10, type: 'biome_visits', category: 'BIOME_SPEC', reward: {  } },
    'starfall_expert': { name: 'Starfall Expert', description: 'Experience Starfall biome 15 times', requirement: 15, type: 'biome_visits', category: 'BIOME_SPEC', reward: {  } },
    'hell_raiser': { name: 'Hell Raiser', description: 'Experience Hell biome 20 times', requirement: 20, type: 'biome_visits', category: 'BIOME_SPEC', reward: {  } },
    'corruption_survivor': { name: 'Corruption Survivor', description: 'Experience Corruption biome 25 times', requirement: 25, type: 'biome_visits', category: 'BIOME_SPEC', reward: {  } },
    'null_voyager': { name: 'NULL Voyager', description: 'Experience NULL biome 5 times', requirement: 5, type: 'biome_visits', category: 'BIOME_SPEC', reward: {  } },
    'glitched_veteran': { name: 'Glitched Veteran', description: 'Experience GLITCHED biome 3 times', requirement: 3, type: 'biome_visits', category: 'BIOME_SPEC', reward: {  } },
    'dreamspace_explorer_adv': { name: 'Dreamspace Explorer', description: 'Experience DREAMSPACE biome', requirement: 'DREAMSPACE', type: 'biome_seen', category: 'BIOME_SPEC', reward: {  } },
    'biome_champion': { name: 'Biome Champion', description: 'Complete all biome specialist achievements', requirement: 'all_biome_spec', type: 'biome_champion', category: 'BIOME_SPEC', reward: {  } },

    // =================== ROLLING MASTER (15 achievements) ===================
    'speed_demon': { name: 'Speed Demon', description: 'Complete 500 rolls in under 5 minutes', requirement: 500, type: 'speed_rolling', category: 'ROLLING', reward: {  } },
    'marathon_roller': { name: 'Marathon Roller', description: 'Complete 5,000 rolls in one session', requirement: 5000, type: 'marathon_rolling', category: 'ROLLING', reward: {  } },
    'perfect_timing': { name: 'Perfect Timing', description: 'Roll during the midnight minute (12:00-12:01)', requirement: 1, type: 'perfect_timing', category: 'ROLLING', reward: {  } },
    'lucky_number': { name: 'Lucky Number 7', description: 'Roll 7 epic+ auras in a row', requirement: 7, type: 'lucky_streak', category: 'ROLLING', reward: {  } },
    'unlucky_number': { name: 'Unlucky Number 13', description: 'Roll exactly 13 commons in a row', requirement: 13, type: 'unlucky_streak', category: 'ROLLING', reward: {  } },
    'rolling_thunder': { name: 'Rolling Thunder', description: 'Complete 1,000 rolls with auto-roll active', requirement: 1000, type: 'auto_marathon', category: 'ROLLING', reward: {  } },
    'manual_master': { name: 'Manual Master', description: 'Complete 100 manual rolls without using auto-roll', requirement: 100, type: 'manual_only', category: 'ROLLING', reward: {  } },
    'midnight_roller': { name: 'Midnight Roller', description: 'Complete 50 rolls during midnight hour (12-1 AM)', requirement: 50, type: 'midnight_rolls', category: 'ROLLING', reward: {  } },
    'breakthrough_specialist': { name: 'Breakthrough Specialist', description: 'Get 10 breakthroughs in one session', requirement: 10, type: 'session_breakthroughs', category: 'ROLLING', reward: {  } },
    'rarity_surge': { name: 'Rarity Surge', description: 'Get 5 auras with 1/10k+ rarity in one session', requirement: 5, type: 'rarity_surge', category: 'ROLLING', reward: {  } },
    'rolling_combo': { name: 'Rolling Combo', description: 'Get 50 rolls without any common auras', requirement: 50, type: 'no_common_combo', category: 'ROLLING', reward: {  } },
    'golden_hour': { name: 'Golden Hour', description: 'Complete 100 rolls during sunset hours (6-8 PM)', requirement: 100, type: 'golden_hour', category: 'ROLLING', reward: {  } },
    'dawn_patrol': { name: 'Dawn Patrol', description: 'Complete 100 rolls during sunrise hours (6-8 AM)', requirement: 100, type: 'dawn_patrol', category: 'ROLLING', reward: {  } },
    'rolling_addict': { name: 'Rolling Addict', description: 'Complete 10,000 rolls in one day', requirement: 10000, type: 'daily_roll_addict', category: 'ROLLING', reward: {  } },
    'rolling_supreme': { name: 'Rolling Supreme', description: 'Complete all rolling master achievements', requirement: 'all_rolling', type: 'rolling_supreme', category: 'ROLLING', reward: {  } },

    // =================== LUCK SPECIALIST (10 achievements) ===================
    'luck_of_the_draw': { name: 'Luck of the Draw', description: 'Get 3 rare+ auras in your first 10 rolls', requirement: 3, type: 'early_luck', category: 'LUCK', reward: {  } },
    'consistent_luck': { name: 'Consistent Luck', description: 'Get at least 1 rare+ aura every 10 rolls for 100 rolls', requirement: 10, type: 'consistent_luck', category: 'LUCK', reward: {  } },
    'luck_spike': { name: 'Luck Spike', description: 'Get 3 epic+ auras within 20 rolls', requirement: 3, type: 'luck_spike', category: 'LUCK', reward: {  } },
    'fortune_smile': { name: 'Fortune Smiles', description: 'Get 5 legendary+ auras within 100 rolls', requirement: 5, type: 'fortune_smile', category: 'LUCK', reward: {  } },
    'blessed_by_rng': { name: 'Blessed by RNG', description: 'Get 10 mythic+ auras within 500 rolls', requirement: 10, type: 'blessed_rng', category: 'LUCK', reward: {  } },
    'luck_mastery': { name: 'Luck Mastery', description: 'Get 50 rare+ auras within 1,000 rolls', requirement: 50, type: 'luck_mastery', category: 'LUCK', reward: {  } },
    'against_odds': { name: 'Against the Odds', description: 'Get a 1/1M+ aura with less than 200% luck', requirement: 1000000, type: 'against_odds', category: 'LUCK', reward: {  } },
    'luck_chain': { name: 'Luck Chain', description: 'Get 10 rare+ auras in a row', requirement: 10, type: 'luck_chain', category: 'LUCK', reward: {  } },
    'fortune_favored': { name: 'Fortune Favored', description: 'Get 25 epic+ auras within 2,000 rolls', requirement: 25, type: 'fortune_favored', category: 'LUCK', reward: {  } },
    'luck_supreme': { name: 'Luck Supreme', description: 'Complete all luck specialist achievements', requirement: 'all_luck', type: 'luck_supreme', category: 'LUCK', reward: {  } },

    // =================== MUTATION MASTER (10 achievements) ===================
    'first_mutation': { name: 'First Mutation', description: 'Obtain your first mutated aura', requirement: 1, type: 'mutation_obtained', category: 'MUTATIONS', reward: {  } },
    'mutation_collector': { name: 'Mutation Collector', description: 'Obtain 10 different mutated auras', requirement: 10, type: 'unique_mutations', category: 'MUTATIONS', reward: {  } },
    'mutation_enthusiast': { name: 'Mutation Enthusiast', description: 'Obtain 25 different mutated auras', requirement: 25, type: 'unique_mutations', category: 'MUTATIONS', reward: {  } },
    'mutation_expert': { name: 'Mutation Expert', description: 'Obtain 50 different mutated auras', requirement: 50, type: 'unique_mutations', category: 'MUTATIONS', reward: {  } },
    'mutation_master': { name: 'Mutation Master', description: 'Obtain 100 different mutated auras', requirement: 100, type: 'unique_mutations', category: 'MUTATIONS', reward: {  } },
    'rare_mutation': { name: 'Rare Mutation', description: 'Obtain a mutated aura with 1/100k+ rarity', requirement: 100000, type: 'rare_mutation', category: 'MUTATIONS', reward: {  } },
    'epic_mutation': { name: 'Epic Mutation', description: 'Obtain a mutated aura with 1/1M+ rarity', requirement: 1000000, type: 'rare_mutation', category: 'MUTATIONS', reward: {  } },
    'legendary_mutation': { name: 'Legendary Mutation', description: 'Obtain a mutated aura with 1/10M+ rarity', requirement: 10000000, type: 'rare_mutation', category: 'MUTATIONS', reward: {  } },
    'mutation_chain': { name: 'Mutation Chain', description: 'Get 5 mutated auras in a row', requirement: 5, type: 'mutation_streak', category: 'MUTATIONS', reward: {  } },
    'mutation_supreme': { name: 'Mutation Supreme', description: 'Complete all mutation master achievements', requirement: 'all_mutations', type: 'mutation_supreme', category: 'MUTATIONS', reward: {  } },

    // =================== HALLOWEEN SPECIAL (20 achievements) 🎃 ===================
    'first_pumpkin_moon': { name: '🎃 Trick or Treat!', description: 'Experience the PUMPKIN MOON biome for the first time', requirement: 'PUMPKIN_MOON', type: 'biome_seen', category: 'HALLOWEEN', reward: {  } },
    'first_graveyard': { name: '👻 Graveyard Shift', description: 'Experience the GRAVEYARD biome for the first time', requirement: 'GRAVEYARD', type: 'biome_seen', category: 'HALLOWEEN', reward: {  } },
    'first_blood_rain': { name: '🩸 Crimson Sky', description: 'Experience the BLOOD RAIN biome for the first time', requirement: 'BLOOD_RAIN', type: 'biome_seen', category: 'HALLOWEEN', reward: {  } },
    'all_halloween_biomes': { name: '🎃 Halloween Master', description: 'Experience all 3 Halloween biomes', requirement: 3, type: 'halloween_biomes_seen', category: 'HALLOWEEN', reward: {  } },
    'pumpkin_collector': { name: '🎃 Pumpkin Picker', description: 'Obtain any Pumpkin aura (Pumpkin, Pumpkin: Spice, or Pumpkin: Lantern)', requirement: 1, type: 'pumpkin_aura_obtained', category: 'HALLOWEEN', reward: {  } },
    'headless_hunter': { name: '💀 Headless Horseman Hunter', description: 'Obtain Headless :Horseman', requirement: 'Headless :Horseman', type: 'specific_aura', category: 'HALLOWEEN', reward: {  } },
    'phantasma_obtained': { name: '👻 Phantom Zone', description: 'Obtain PHANTASMA', requirement: 'PHANTASMA', type: 'specific_aura', category: 'HALLOWEEN', reward: {  } },
    'arachnophobia_obtained': { name: '🕷️ Spider Slayer', description: 'Obtain < A R A C H N O P H O B I A >', requirement: '< A R A C H N O P H O B I A >', type: 'specific_aura', category: 'HALLOWEEN', reward: {  } },
    'apocalypse_obtained': { name: '☠️ End Times', description: 'Obtain APOCALYPSE', requirement: 'APOCALYPSE', type: 'specific_aura', category: 'HALLOWEEN', reward: {  } },
    'erebus_obtained': { name: '🌑 Shadow of Erebus', description: 'Obtain Erebus', requirement: 'Erebus', type: 'specific_aura', category: 'HALLOWEEN', reward: {  } },
    'meet_bounty_jack': { name: '🎃 Bounty Hunter', description: 'Meet Bounty Hunter Jack for the first time', requirement: 1, type: 'met_bounty_jack', category: 'HALLOWEEN', reward: {  } },
    'buy_from_jack': { name: '🎃 Jack\'s Customer', description: 'Purchase 10 items from Bounty Hunter Jack', requirement: 10, type: 'jack_purchases', category: 'HALLOWEEN', reward: {  } },
    'big_spender_jack': { name: '🎃 Jack\'s VIP', description: 'Purchase 100 items from Bounty Hunter Jack', requirement: 100, type: 'jack_purchases', category: 'HALLOWEEN', reward: {  } },
    'halloween_medal_hoarder': { name: '🏅 Medal Collector', description: 'Collect 10,000 Halloween Bounty Medals', requirement: 10000, type: 'halloween_medals_earned', category: 'HALLOWEEN', reward: {  } },
    'halloween_medal_tycoon': { name: '🏅 Medal Tycoon', description: 'Collect 100,000 Halloween Bounty Medals', requirement: 100000, type: 'halloween_medals_earned', category: 'HALLOWEEN', reward: {  } },
    'halloween_marathon': { name: '🎃 All Hallows\' Marathon', description: 'Experience 5 Halloween biomes in one day', requirement: 5, type: 'daily_halloween_biomes', category: 'HALLOWEEN', reward: {  } },
    'spooky_collector': { name: '👻 Spooky Collector', description: 'Collect 10 different Halloween-exclusive auras', requirement: 10, type: 'halloween_auras_collected', category: 'HALLOWEEN', reward: {  } },
    'complete_halloween_collection': { name: '🎃 Halloween Completionist', description: 'Collect ALL Halloween-exclusive auras', requirement: 'all_halloween', type: 'halloween_complete', category: 'HALLOWEEN', reward: {  } },
    'thaneborne_obtained': { name: '💀 The Cosmic Reaper', description: 'Obtain THANEBORNE (Requires 25,000 Halloween Medals from Jack)', requirement: 'THANEBORNE', type: 'specific_aura', category: 'HALLOWEEN', reward: {  } },
    'halloween_supreme': { name: '🎃 Halloween Legend', description: 'Complete all Halloween achievements', requirement: 'all_halloween_achievements', type: 'halloween_supreme', category: 'HALLOWEEN', reward: {   } },

    // =================== ULTIMATE CHALLENGES (5 achievements) ===================
    'ultimate_collector': { name: 'Ultimate Collector', description: 'Collect 250 unique auras', requirement: 250, type: 'ultimate_collection', category: 'ULTIMATE', reward: {  } },
    'ultimate_roller': { name: 'Ultimate Roller', description: 'Complete 100,000,000 rolls', requirement: 100000000, type: 'ultimate_rolls', category: 'ULTIMATE', reward: {  } },
    'ultimate_luck': { name: 'Ultimate Luck', description: 'Obtain a 1/100B+ aura', requirement: 100000000000, type: 'ultimate_rarity', category: 'ULTIMATE', reward: {  } },
    'ultimate_breakthrough': { name: 'Ultimate Breakthrough', description: 'Complete 10,000,000 breakthroughs', requirement: 10000000, type: 'ultimate_breakthroughs', category: 'ULTIMATE', reward: {  } },
    'ultimate_master': { name: 'Ultimate Master', description: 'Complete all other achievements', requirement: 'all_achievements', type: 'ultimate_master', category: 'ULTIMATE', reward: {  } },

    // =================== SUPER SPECIFIC ACHIEVEMENTS (100 achievements) 🎯 ===================
    // Potion-Based Achievements
    'voidheart_user': { name: '💜 Voidheart Seeker', description: 'Use a Voidheart potion', requirement: 'Voidheart', type: 'specific_potion_used', category: 'SPECIFIC', reward: {  } },
    'oblivion_addict': { name: '🌑 Oblivion Addict', description: 'Use 100 Oblivion Potions', requirement: 100, type: 'oblivion_used', category: 'SPECIFIC', reward: {  } },
    'pump_king_blood': { name: '🎃 Pumpkin King\'s Blessing', description: 'Use Pump Kings Blood potion', requirement: 'Pump Kings Blood', type: 'specific_potion_used', category: 'SPECIFIC', reward: {  } },
    'potion_hoarder': { name: '🧪 Potion Hoarder', description: 'Have 1,000+ of a single potion type', requirement: 1000, type: 'potion_hoard', category: 'SPECIFIC', reward: {  } },
    'clarity_master': { name: '🔮 Clarity Master', description: 'Use Potion of Clarity 50 times', requirement: 50, type: 'clarity_used', category: 'SPECIFIC', reward: {  } },
    'hindsight_expert': { name: '⏪ Hindsight Expert', description: 'Successfully reroll with Potion of Hindsight 25 times', requirement: 25, type: 'hindsight_rerolls', category: 'SPECIFIC', reward: {  } },
    'phoenix_rises': { name: '🔥 Phoenix Rises', description: 'Trigger Phoenix Mode revival 10 times', requirement: 10, type: 'phoenix_revivals', category: 'SPECIFIC', reward: {  } },
    'jackpot_winner': { name: '💰 Jackpot Winner', description: 'Trigger Jackpot Mode 5 times', requirement: 5, type: 'jackpot_triggered', category: 'SPECIFIC', reward: {  } },
    'quantum_cascade': { name: '⚛️ Quantum Cascade', description: 'Get a 5+ chain with Quantum Leap potion', requirement: 5, type: 'quantum_chain', category: 'SPECIFIC', reward: {  } },
    'efficiency_expert': { name: '⚡ Efficiency Expert', description: 'Save 100 materials using Potion of Efficiency', requirement: 100, type: 'materials_saved', category: 'SPECIFIC', reward: {  } },

    // Biome-Specific Achievements
    'null_survivor': { name: '⚫ NULL Survivor', description: 'Roll 100 times during NULL biome', requirement: 100, type: 'null_rolls', category: 'SPECIFIC', reward: {  } },
    'glitch_hunter': { name: '✨ Glitch Hunter', description: 'Obtain 10 auras during GLITCHED biome', requirement: 10, type: 'glitch_auras', category: 'SPECIFIC', reward: {  } },
    'dreamspace_visitor': { name: '🌸 Dreamspace Visitor', description: 'Roll during DREAMSPACE biome', requirement: 1, type: 'dreamspace_roll', category: 'SPECIFIC', reward: {  } },
    'hell_dweller': { name: '🔥 Hell Dweller', description: 'Roll 500 times in HELL biome', requirement: 500, type: 'hell_rolls', category: 'SPECIFIC', reward: {  } },
    'corruption_touched': { name: '💜 Corruption Touched', description: 'Roll 300 times in CORRUPTION biome', requirement: 300, type: 'corruption_rolls', category: 'SPECIFIC', reward: {  } },
    'starfall_watcher': { name: '⭐ Starfall Watcher', description: 'Witness 50 Starfall biomes', requirement: 50, type: 'starfall_visits', category: 'SPECIFIC', reward: {  } },
    'pumpkin_moon_veteran': { name: '🎃 Pumpkin Moon Veteran', description: 'Experience 25 Pumpkin Moon biomes', requirement: 25, type: 'pumpkin_moon_visits', category: 'SPECIFIC', reward: {  } },
    'graveyard_keeper': { name: '👻 Graveyard Keeper', description: 'Experience 30 Graveyard biomes', requirement: 30, type: 'graveyard_visits', category: 'SPECIFIC', reward: {  } },
    'blood_rain_cultist': { name: '🩸 Blood Rain Cultist', description: 'Experience 15 Blood Rain biomes', requirement: 15, type: 'blood_rain_visits', category: 'SPECIFIC', reward: {  } },
    'biome_speedrun': { name: '⚡ Biome Speedrunner', description: 'Experience 3 different biomes in under 30 minutes', requirement: 3, type: 'biome_speedrun', category: 'SPECIFIC', reward: {  } },

    // Gear-Specific Achievements
    'gemstone_master': { name: '💎 Gemstone Master', description: 'Trigger Gemstone Gauntlet effect 100 times', requirement: 100, type: 'gemstone_triggers', category: 'SPECIFIC', reward: {  } },
    'crimson_heart_user': { name: '❤️ Crimson Heart User', description: 'Use Crimson Heart in Crimson biome 50 times', requirement: 50, type: 'crimson_heart_bonus', category: 'SPECIFIC', reward: {  } },
    'orion_belt_wearer': { name: '🌟 Orion Belt Wearer', description: 'Equip Orion Belt for 10 hours total', requirement: 600, type: 'orion_equipped_minutes', category: 'SPECIFIC', reward: {  } },
    'perfect_loadout': { name: '⚙️ Perfect Loadout', description: 'Equip 2 Tier 10 gears simultaneously', requirement: 2, type: 'tier10_both_slots', category: 'SPECIFIC', reward: {  } },
    'gear_collector_supreme': { name: '🎯 Gear Collector Supreme', description: 'Own every single gear in the game', requirement: 'all_gears', type: 'gear_collection_complete', category: 'SPECIFIC', reward: {  } },

    // Merchant Achievements
    'mari_regular': { name: '🤍 Mari\'s Regular', description: 'Purchase 100 items from Mari', requirement: 100, type: 'mari_purchases', category: 'SPECIFIC', reward: {  } },
    'jester_patron': { name: '🃏 Jester\'s Patron', description: 'Purchase 50 items from Jester', requirement: 50, type: 'jester_purchases', category: 'SPECIFIC', reward: {  } },
    'merchant_millionaire': { name: '💸 Merchant Millionaire', description: 'Spend 1,000,000 money at merchants', requirement: 1000000, type: 'money_spent_merchants', category: 'SPECIFIC', reward: {  } },
    'void_coin_collector': { name: '🪙 Void Coin Collector', description: 'Collect 1,000 Void Coins (lifetime)', requirement: 1000, type: 'void_coins_earned', category: 'SPECIFIC', reward: {  } },
    'dark_point_master': { name: '🌑 Dark Point Master', description: 'Collect 10,000 Dark Points (lifetime)', requirement: 10000, type: 'dark_points_earned', category: 'SPECIFIC', reward: {  } },

    // Rune-Specific Achievements
    'rune_everything_user': { name: '✨ Everything User', description: 'Use Rune of Everything 25 times', requirement: 25, type: 'rune_everything_used', category: 'SPECIFIC', reward: {  } },
    'rune_eclipse_master': { name: '🌘 Eclipse Master', description: 'Use Rune of Eclipse 50 times', requirement: 50, type: 'rune_eclipse_used', category: 'SPECIFIC', reward: {  } },
    'halloween_rune_collector': { name: '🎃 Halloween Rune Collector', description: 'Use all 3 Halloween runes', requirement: 3, type: 'halloween_runes_used', category: 'SPECIFIC', reward: {  } },
    'rune_stacker': { name: '📚 Rune Stacker', description: 'Have 3 different rune effects active at once', requirement: 3, type: 'rune_stack', category: 'SPECIFIC', reward: {  } },
    'chest_opener_pro': { name: '📦 Chest Opener Pro', description: 'Open 500 Random Rune Chests', requirement: 500, type: 'chests_opened', category: 'SPECIFIC', reward: {  } },

    // Aura-Specific Achievements
    'common_hater': { name: '🚫 Common Hater', description: 'Delete 10,000 common auras', requirement: 10000, type: 'commons_deleted', category: 'SPECIFIC', reward: {  } },
    'eden_obtainer': { name: '🌸 Eden Obtainer', description: 'Obtain Eden aura', requirement: 'Eden', type: 'specific_aura', category: 'SPECIFIC', reward: {  } },
    'star_trio': { name: '⭐ Star Trio', description: 'Have ★, ★★, and ★★★ all at once', requirement: 3, type: 'star_collection_simultaneous', category: 'SPECIFIC', reward: {  } },
    'godly_trinity': { name: '⚡ Godly Trinity', description: 'Obtain Zeus, Hades, and Poseidon', requirement: 3, type: 'godly_trio', category: 'SPECIFIC', reward: {  } },
    'eclipse_combo': { name: '🌗 Eclipse Combo', description: 'Obtain Solar and Lunar in the same hour', requirement: 2, type: 'solar_lunar_hour', category: 'SPECIFIC', reward: {  } },
    'error_collector': { name: '⚠️ Error Collector', description: 'Obtain ERROR, Glitch, and Segfault', requirement: 3, type: 'error_trio', category: 'SPECIFIC', reward: {  } },
    'dual_nature': { name: '☯️ Dual Nature', description: 'Obtain 5 auras and their mutations', requirement: 5, type: 'mutation_pairs', category: 'SPECIFIC', reward: {  } },
    'transcendent_collector': { name: '🌌 Transcendent Collector', description: 'Own 50 different transcendent auras', requirement: 50, type: 'transcendent_count', category: 'SPECIFIC', reward: {  } },
    'cosmic_seeker': { name: '💫 Cosmic Seeker', description: 'Obtain any cosmic tier aura', requirement: 1, type: 'cosmic_obtained', category: 'SPECIFIC', reward: {  } },

    // Crafting Achievements
    'potion_master_crafter': { name: '🧪 Potion Master Crafter', description: 'Craft 50 different potion types', requirement: 50, type: 'unique_potions_crafted', category: 'SPECIFIC', reward: {  } },
    'gear_master_smith': { name: '⚒️ Gear Master Smith', description: 'Craft 30 different gear types', requirement: 30, type: 'unique_gears_crafted', category: 'SPECIFIC', reward: {  } },
    'rainbow_syrup_user': { name: '🌈 Rainbow Syrup User', description: 'Use 1,000 Rainbow Syrups in crafting', requirement: 1000, type: 'syrup_used', category: 'SPECIFIC', reward: {  } },
    'darklight_master': { name: '✨ Darklight Master', description: 'Craft using all 3 Darklight items (Shard, Orb, Core)', requirement: 3, type: 'darklight_crafts', category: 'SPECIFIC', reward: {  } },
    'crafting_marathon': { name: '🏃 Crafting Marathon', description: 'Craft 100 items in one day', requirement: 100, type: 'daily_crafts', category: 'SPECIFIC', reward: {  } },

    // Currency Achievements
    'millionaire': { name: '💰 Millionaire', description: 'Have 1,000,000 money at once', requirement: 1000000, type: 'money_balance', category: 'SPECIFIC', reward: {  } },
    'billionaire': { name: '💎 Billionaire', description: 'Have 1,000,000,000 money at once', requirement: 1000000000, type: 'money_balance', category: 'SPECIFIC', reward: {  } },
    'void_coin_whale': { name: '🐋 Void Coin Whale', description: 'Have 500 Void Coins at once', requirement: 500, type: 'void_coin_balance', category: 'SPECIFIC', reward: {  } },
    'halloween_medal_whale': { name: '🎃 Medal Whale', description: 'Have 50,000 Halloween Medals at once', requirement: 50000, type: 'halloween_medal_balance', category: 'SPECIFIC', reward: {  } },

    // Luck-Based Achievements
    'max_luck_1000x': { name: '🍀 1000x Luck', description: 'Roll with 100,000%+ luck (1000x)', requirement: 100000, type: 'max_luck_achieved', category: 'SPECIFIC', reward: {  } },
    'max_luck_10000x': { name: '🍀 10000x Luck', description: 'Roll with 1,000,000%+ luck (10000x)', requirement: 1000000, type: 'max_luck_achieved', category: 'SPECIFIC', reward: {  } },
    'no_luck_legend': { name: '🎲 No Luck Legend', description: 'Roll a mythic+ with exactly 100% luck (no buffs)', requirement: 'mythic_100_luck', type: 'no_buff_mythic', category: 'SPECIFIC', reward: {  } },
    'breakthrough_god': { name: '💥 Breakthrough God', description: 'Get 100 breakthroughs in one day', requirement: 100, type: 'daily_breakthroughs', category: 'SPECIFIC', reward: {  } },
    'patience_test': { name: '⏳ Patience Test', description: 'Roll 50,000 times in a single session without closing the game', requirement: 50000, type: 'single_session_50k', category: 'SPECIFIC', reward: {  } },

    // Speed-Based Achievements
    'supersonic_roller': { name: '⚡ Supersonic Roller', description: 'Roll with 1000%+ roll speed', requirement: 1000, type: 'max_speed_achieved', category: 'SPECIFIC', reward: {  } },
    'speed_demon_pro': { name: '🏎️ Speed Demon Pro', description: 'Complete 1,000 rolls in under 3 minutes', requirement: 1000, type: 'speed_rolling_pro', category: 'SPECIFIC', reward: {  } },
    'auto_roll_master': { name: '🤖 Auto Roll Master', description: 'Complete 1,000,000 auto rolls', requirement: 1000000, type: 'auto_rolls_completed', category: 'SPECIFIC', reward: {  } },

    // Streak Achievements
    'godlike_streak': { name: '⚡ Godlike Streak', description: 'Roll 5 divine+ auras in a row', requirement: 5, type: 'divine_streak', category: 'SPECIFIC', reward: {  } },
    'transcendent_streak': { name: '🌌 Transcendent Streak', description: 'Roll 3 transcendent+ auras in a row', requirement: 3, type: 'transcendent_streak', category: 'SPECIFIC', reward: {  } },
    'no_legendary_100': { name: '📉 No Legendary 100', description: 'Roll 100 times without getting legendary+', requirement: 100, type: 'no_legendary_streak', category: 'SPECIFIC', reward: {  } },
    'perfect_50': { name: '💯 Perfect 50', description: 'Roll 50 rare+ auras in a row', requirement: 50, type: 'rare_streak', category: 'SPECIFIC', reward: {  } },

    // Time-Based Achievements
    'midnight_grinder': { name: '🌙 Midnight Grinder', description: 'Roll 1,000 times between midnight and 4am', requirement: 1000, type: 'night_rolls', category: 'SPECIFIC', reward: {  } },
    'weekend_warrior': { name: '📅 Weekend Warrior', description: 'Roll 10,000 times on a weekend', requirement: 10000, type: 'weekend_rolls', category: 'SPECIFIC', reward: {  } },
    'hourly_dedication': { name: '⏰ Hourly Dedication', description: 'Roll at least once every hour for 24 hours', requirement: 24, type: 'hourly_rolls', category: 'SPECIFIC', reward: {  } },
    'week_long_grind': { name: '📆 Week Long Grind', description: 'Play for 7 consecutive days without missing a day', requirement: 7, type: 'daily_login_streak', category: 'SPECIFIC', reward: {  } },

    // Inventory Management
    'hoarder_supreme': { name: '📦 Hoarder Supreme', description: 'Have 100,000+ of a single aura', requirement: 100000, type: 'aura_hoard_count', category: 'SPECIFIC', reward: {  } },
    'inventory_organizer': { name: '🗂️ Inventory Organizer', description: 'Have 100+ different auras in inventory', requirement: 100, type: 'unique_auras', category: 'SPECIFIC', reward: {  } },
    'potion_stockpile': { name: '🧪 Potion Stockpile', description: 'Have 50+ different potion types in inventory', requirement: 50, type: 'unique_potions', category: 'SPECIFIC', reward: {  } },
    'rune_vault': { name: '🔮 Rune Vault', description: 'Have 500+ total runes in inventory', requirement: 500, type: 'total_runes', category: 'SPECIFIC', reward: {  } },

    // Special Combos
    'trinity_of_power': { name: '⚡ Trinity of Power', description: 'Have Oblivion Potion, Rune of Everything, and Tier 10 gear active simultaneously', requirement: 'trinity_active', type: 'power_trinity', category: 'SPECIFIC', reward: {  } },
    'halloween_perfectionist': { name: '🎃 Halloween Perfectionist', description: 'Get all 3 Halloween biomes in one day during October', requirement: 'halloween_triple', type: 'halloween_biome_triple', category: 'SPECIFIC', reward: {  } },
    'elemental_chaos': { name: '🌀 Elemental Chaos', description: 'Obtain Fire, Water, Earth, Air, and Lightning auras in one session', requirement: 5, type: 'elemental_session', category: 'SPECIFIC', reward: {  } },
    'corruption_hellfire': { name: '👿 Corruption Hellfire', description: 'Experience Corruption and Hell biomes back-to-back', requirement: 'corruption_hell_combo', type: 'biome_combo_specific', category: 'SPECIFIC', reward: {  } },

    // Unique Challenge Achievements
    'one_roll_legend': { name: '🎯 One Roll Legend', description: 'Use 100 one-roll potions', requirement: 100, type: 'one_roll_potions_used', category: 'SPECIFIC', reward: {  } },
    'never_give_up': { name: '💪 Never Give Up', description: 'Continue rolling for 12 hours straight', requirement: 720, type: 'continuous_rolling_minutes', category: 'SPECIFIC', reward: {  } },
    'rng_blessed': { name: '🙏 RNG Blessed', description: 'Roll 10 exotic+ auras in one day', requirement: 10, type: 'daily_exotic_auras', category: 'SPECIFIC', reward: {  } },
    'mutation_fanatic': { name: '🧬 Mutation Fanatic', description: 'Obtain 200 different mutations', requirement: 200, type: 'unique_mutations', category: 'SPECIFIC', reward: {  } },
    'biome_traveler': { name: '🗺️ Biome Traveler', description: 'Experience every biome at least 10 times each', requirement: 'all_biomes_10x', type: 'biome_completionist', category: 'SPECIFIC', reward: {  } },
    'null_master': { name: '⚫ NULL Master', description: 'Spend 1 hour total in NULL biome', requirement: 60, type: 'null_time_minutes', category: 'SPECIFIC', reward: {  } },
    'early_bird_special': { name: '🌅 Early Bird Special', description: 'Roll at 6 AM local time for 30 consecutive days', requirement: 30, type: 'early_morning_streak', category: 'SPECIFIC', reward: {  } },
    'ascension': { name: '🌟 Ascension', description: 'Complete all specific achievements', requirement: 'all_specific', type: 'specific_master', category: 'SPECIFIC', reward: {  } },

    // =================== INSANE CHALLENGES (25 achievements) 🔥 ===================
    'delete_legendary': { name: '🗑️ Legendary Sacrifice', description: 'Delete a legendary+ aura', requirement: 1, type: 'delete_legendary', category: 'INSANE', reward: {  } },
    'delete_mythic': { name: '💀 Mythic Madness', description: 'Delete a mythic+ aura', requirement: 1, type: 'delete_mythic', category: 'INSANE', reward: {  } },
    'roll_naked': { name: '🧍 Birthday Suit Roller', description: 'Roll 10,000 times with no gear, potions, or runes active', requirement: 10000, type: 'naked_rolls', category: 'INSANE', reward: {  } },
    'divine_patience': { name: '🙏 Divine Patience', description: 'Roll a divine+ aura with base 100% luck (no buffs)', requirement: 1, type: 'divine_base_luck', category: 'INSANE', reward: {  } },
    'zero_money_grind': { name: '💸 Broke Grinder', description: 'Spend all your money to reach exactly $0', requirement: 1, type: 'zero_money', category: 'INSANE', reward: {  } },
    'trash_collector': { name: '🗑️ Trash Collector', description: 'Delete 100,000 total auras', requirement: 100000, type: 'total_deletes', category: 'INSANE', reward: {  } },
    'slow_and_steady': { name: '🐌 Slow and Steady', description: 'Roll 1,000 times with 0% roll speed (no speed buffs)', requirement: 1000, type: 'slow_rolls', category: 'INSANE', reward: {  } },
    'rune_hoarder_insane': { name: '📿 Rune Hoarder', description: 'Have 10,000+ of a single rune type', requirement: 10000, type: 'single_rune_hoard', category: 'INSANE', reward: {  } },
    'potion_overdose': { name: '🧪 Potion Overdose', description: 'Have 10 different potion effects active simultaneously', requirement: 10, type: 'potion_overdose', category: 'INSANE', reward: {  } },
    'lucky_unlucky': { name: '🎰 Lucky Unlucky', description: 'Roll a divine+ immediately after rolling 500 commons in a row', requirement: 500, type: 'lucky_after_unlucky', category: 'INSANE', reward: {  } },
    'biome_addict': { name: '🌍 Biome Addict', description: 'Experience 50 different biome changes in one day', requirement: 50, type: 'daily_biome_changes', category: 'INSANE', reward: {  } },
    'no_commons_1k': { name: '🚫 No Commons Allowed', description: 'Roll 1,000 times without a single common aura', requirement: 1000, type: 'no_commons_1k', category: 'INSANE', reward: {  } },
    'speed_demon_insane': { name: '⚡ Ludicrous Speed', description: 'Roll with 5,000%+ roll speed', requirement: 5000, type: 'insane_speed', category: 'INSANE', reward: {  } },
    'breakthrough_chain': { name: '💥 Breakthrough Chain', description: 'Get 25 breakthroughs in a row', requirement: 25, type: 'breakthrough_chain', category: 'INSANE', reward: {  } },
    'mutation_only': { name: '🧬 Mutation Only', description: 'Roll 100 mutations in a row', requirement: 100, type: 'mutation_chain_insane', category: 'INSANE', reward: {  } },
    'inventory_full': { name: '📦 Inventory Explosion', description: 'Have 500+ different unique auras in inventory', requirement: 500, type: 'inventory_explosion', category: 'INSANE', reward: {  } },
    'crafting_maniac': { name: '⚒️ Crafting Maniac', description: 'Craft 10,000 items in one day', requirement: 10000, type: 'daily_crafting_insane', category: 'INSANE', reward: {  } },
    'lucky_million': { name: '🍀 Million% Luck', description: 'Roll with 10,000,000%+ luck (100,000x)', requirement: 10000000, type: 'million_luck', category: 'INSANE', reward: {  } },
    'one_aura_army': { name: '👑 One Aura Army', description: 'Have 1,000,000+ of a single aura', requirement: 1000000, type: 'one_aura_million', category: 'INSANE', reward: {  } },
    'roll_marathon_24h': { name: '⏰ 24 Hour Marathon', description: 'Roll 100,000 times in a single 24-hour period', requirement: 100000, type: 'daily_100k_rolls', category: 'INSANE', reward: {  } },
    'cosmic_collector': { name: '💫 Cosmic Collector', description: 'Own 10 different cosmic tier auras', requirement: 10, type: 'cosmic_collection', category: 'INSANE', reward: {  } },
    'transcendent_hoarder': { name: '🌌 Transcendent Hoarder', description: 'Own 100 different transcendent tier auras', requirement: 100, type: 'transcendent_collection', category: 'INSANE', reward: {  } },
    'merchant_whale': { name: '💎 Merchant Whale', description: 'Spend 100,000,000 money at merchants total', requirement: 100000000, type: 'merchant_spending_insane', category: 'INSANE', reward: {  } },
    'void_coin_tycoon': { name: '🪙 Void Coin Tycoon', description: 'Collect 10,000 Void Coins (lifetime)', requirement: 10000, type: 'void_coins_lifetime', category: 'INSANE', reward: {  } },
    'insane_master': { name: '🔥 Master of Insanity', description: 'Complete all insane challenge achievements', requirement: 'all_insane', type: 'insane_master', category: 'INSANE', reward: {  } },

    // =================== MEME & FUN ACHIEVEMENTS (30 achievements) 🤣 ===================
    'touch_grass': { name: '🌿 Touch Grass', description: 'Close the game voluntarily after playing for 10+ hours straight', requirement: 600, type: 'voluntary_break', category: 'MEME', reward: {   } },
    'number_69': { name: '😏 Nice', description: 'Have exactly 69 of any item', requirement: 69, type: 'exact_69', category: 'MEME', reward: {  } },
    'number_420': { name: '🌿 Blaze It', description: 'Have exactly 420 of any item', requirement: 420, type: 'exact_420', category: 'MEME', reward: {  } },
    'order_66': { name: '⚔️ Execute Order 66', description: 'Delete exactly 66 auras in one session', requirement: 66, type: 'delete_66', category: 'MEME', reward: {  } },
    'stonks': { name: '📈 Stonks', description: 'Gain 1,000,000 money in under 1 hour', requirement: 1000000, type: 'money_gain_fast', category: 'MEME', reward: {  } },
    'not_stonks': { name: '📉 Not Stonks', description: 'Lose 1,000,000 money in under 1 hour', requirement: 1000000, type: 'money_loss_fast', category: 'MEME', reward: {  } },
    'big_brain': { name: '🧠 Big Brain', description: 'Use 5 different buff items simultaneously', requirement: 5, type: 'big_brain_stacks', category: 'MEME', reward: {  } },
    'smol_brain': { name: '🤯 Smol Brain', description: 'Accidentally delete an exotic+ aura', requirement: 1, type: 'accidental_exotic_delete', category: 'MEME', reward: {   } },
    'pain': { name: '😭 Pain', description: 'Roll 1,000 commons after getting a divine+ aura', requirement: 1000, type: 'pain_after_glory', category: 'MEME', reward: {  } },
    'suffering': { name: '😫 Suffering', description: 'Get the same common aura 100 times in a row', requirement: 100, type: 'same_common_100', category: 'MEME', reward: {  } },
    'lucky_number_777': { name: '🎰 Jackpot 777', description: 'Have exactly 777 Void Coins', requirement: 777, type: 'exact_777_coins', category: 'MEME', reward: {  } },
    'unlucky_number_666': { name: '👿 Devil\'s Number', description: 'Roll exactly 666 times in one session', requirement: 666, type: 'session_666', category: 'MEME', reward: {  } },
    'number_1337': { name: '🕹️ Leet Gamer', description: 'Have exactly 1337 of any potion', requirement: 1337, type: 'exact_1337_potion', category: 'MEME', reward: {  } },
    'over_9000': { name: '💥 Over 9000!', description: 'Have over 9,000 of a single aura', requirement: 9001, type: 'over_9000_aura', category: 'MEME', reward: {  } },
    'shiny_hunter': { name: '✨ Shiny Hunter', description: 'Obtain the same rare+ aura 50 times trying to get its mutation', requirement: 50, type: 'mutation_hunting', category: 'MEME', reward: {  } },
    'gacha_addict': { name: '🎲 Gacha Addict', description: 'Roll 50,000 times in one week', requirement: 50000, type: 'weekly_50k', category: 'MEME', reward: {  } },
    'nap_time': { name: '😴 Nap Time', description: 'Leave auto-roll on overnight for 8+ hours', requirement: 480, type: 'overnight_autoroll', category: 'MEME', reward: {  } },
    'ctrl_z': { name: '↩️ Ctrl+Z', description: 'Use Potion of Hindsight 100 times (instant regret)', requirement: 100, type: 'regret_master', category: 'MEME', reward: {  } },
    'commitment_issues': { name: '🤷 Commitment Issues', description: 'Change equipped gear 500 times', requirement: 500, type: 'gear_swap_addict', category: 'MEME', reward: {  } },
    'hoarder_diagnosed': { name: '📦 Diagnosed Hoarder', description: 'Never delete a single aura for 10,000 rolls', requirement: 10000, type: 'no_delete_10k', category: 'MEME', reward: {  } },
    'minimalist_chad': { name: '🧏 Minimalist Chad', description: 'Have only 1 type of aura in inventory (delete everything else)', requirement: 1, type: 'only_one_type', category: 'MEME', reward: {  } },
    'rng_carried': { name: '🍀 RNG Carried', description: 'Get 3 mythic+ auras in your first 100 rolls', requirement: 3, type: 'early_mythic_trio', category: 'MEME', reward: {  } },
    'skill_issue': { name: '🤦 Skill Issue', description: 'Roll 5,000 times without getting a single legendary+', requirement: 5000, type: 'no_legendary_5k', category: 'MEME', reward: {  } },
    'beginners_luck': { name: '🎯 Beginner\'s Luck', description: 'Get a mythic+ aura in your first 100 rolls', requirement: 100, type: 'early_mythic', category: 'MEME', reward: {  } },
    'gamba_addiction': { name: '🎰 Gamba Addiction', description: 'Open 1,000 Random Rune Chests in one day', requirement: 1000, type: 'daily_chest_opening', category: 'MEME', reward: {  } },
    'potion_seller': { name: '🧪 Potion Seller', description: 'Craft 1,000 potions without using a single one', requirement: 1000, type: 'craft_no_use', category: 'MEME', reward: {  } },
    'whale_spotted': { name: '🐋 Whale Spotted', description: 'Spend 10,000 Void Coins at merchants', requirement: 10000, type: 'void_coin_spending', category: 'MEME', reward: {  } },
    'f2p_btw': { name: '🆓 F2P BTW', description: 'Never use a Void Coin for 100,000 rolls', requirement: 100000, type: 'f2p_grind', category: 'MEME', reward: {  } },
    'reverse_psychology': { name: '🤔 Reverse Psychology', description: 'Get a 1/1M+ aura while actively trying to get commons', requirement: 1000000, type: 'reverse_luck', category: 'MEME', reward: {  } },
    'meme_master': { name: '🤣 Meme Master', description: 'Complete all meme achievements', requirement: 'all_meme', type: 'meme_master', category: 'MEME', reward: {  } },

    // =================== GODLIKE ACHIEVEMENTS (20 achievements) ⚡ ===================
    'insane_luck_100m': { name: '⚡ 100 Million% Luck', description: 'Roll with 100,000,000%+ luck (1,000,000x)', requirement: 100000000, type: 'insane_luck_100m', category: 'GODLIKE', reward: {  } },
    'hundred_billion_rarity': { name: '🎲 Hundred Billion Rarity', description: 'Roll a 1/100 Billion+ aura', requirement: 100000000000, type: 'hundred_billion_rarity', category: 'GODLIKE', reward: {  } },
    'billion_rolls': { name: '🔄 Billion Rolls', description: 'Complete 1,000,000,000 total rolls', requirement: 1000000000, type: 'billion_rolls', category: 'GODLIKE', reward: {  } },
    'perfect_inventory': { name: '📚 Perfect Inventory', description: 'Have exactly 1 of every single aura in the game', requirement: 'perfect_collection', type: 'one_each_aura', category: 'GODLIKE', reward: {  } },
    'all_mutations_master': { name: '🧬 All Mutations', description: 'Obtain every possible mutation in the game', requirement: 'all_mutations_collected', type: 'mutation_complete', category: 'GODLIKE', reward: {  } },
    'max_gear': { name: '⚙️ Maximum Gear', description: 'Have all Tier 10 gears', requirement: 'all_tier10', type: 'tier10_complete', category: 'GODLIKE', reward: {  } },
    'potion_library': { name: '🧪 Potion Library', description: 'Have 10,000+ of every single potion type', requirement: 10000, type: 'all_potions_10k', category: 'GODLIKE', reward: {  } },
    'rune_encyclopedia': { name: '📖 Rune Encyclopedia', description: 'Have 5,000+ of every single rune type', requirement: 5000, type: 'all_runes_5k', category: 'GODLIKE', reward: {  } },
    'never_unlucky': { name: '✨ Never Unlucky', description: 'Roll 50,000 times without a single common aura', requirement: 50000, type: 'no_commons_50k', category: 'GODLIKE', reward: {  } },
    'divine_streak_25': { name: '🔱 Divine Streak 25', description: 'Roll 25 divine+ auras in a row', requirement: 25, type: 'divine_streak_25', category: 'GODLIKE', reward: {  } },
    'transcendent_streak_10': { name: '🌌 Transcendent Streak 10', description: 'Roll 10 transcendent+ auras in a row', requirement: 10, type: 'transcendent_streak_10', category: 'GODLIKE', reward: {  } },
    'million_breakthroughs': { name: '💥 Million Breakthroughs', description: 'Complete 100,000,000 breakthroughs', requirement: 100000000, type: 'million_breakthroughs', category: 'GODLIKE', reward: {  } },
    'speed_of_light': { name: '⚡ Speed of Light', description: 'Roll with 100,000%+ roll speed', requirement: 100000, type: 'light_speed', category: 'GODLIKE', reward: {  } },
    'all_biomes_1000x': { name: '🌎 Biome God', description: 'Experience every biome 1,000 times each', requirement: 1000, type: 'all_biomes_1000', category: 'GODLIKE', reward: {  } },
    'crafting_god': { name: '⚒️ Crafting God', description: 'Craft 1,000,000 total items', requirement: 1000000, type: 'million_crafts', category: 'GODLIKE', reward: {  } },
    'merchant_emperor': { name: '👑 Merchant Emperor', description: 'Spend 1,000,000,000 money at merchants', requirement: 1000000000, type: 'merchant_billion', category: 'GODLIKE', reward: {  } },
    'void_coin_god': { name: '🪙 Void Coin God', description: 'Collect 100,000 Void Coins (lifetime)', requirement: 100000, type: 'void_coin_100k', category: 'GODLIKE', reward: {  } },
    'perfect_year': { name: '📅 Perfect Year', description: 'Play for 365 consecutive days without missing a single day', requirement: 365, type: 'year_streak', category: 'GODLIKE', reward: {  } },
    'all_halloween_10k': { name: '🎃 Halloween God', description: 'Collect 10,000 of every Halloween aura', requirement: 10000, type: 'halloween_god', category: 'GODLIKE', reward: {  } },
    'godlike_master': { name: '⚡ Transcend Reality', description: 'Complete all godlike achievements', requirement: 'all_godlike', type: 'godlike_master', category: 'GODLIKE', reward: {  } },

    // =================== ROLLING SPECIALIST - 100 ACHIEVEMENTS 🎲 ===================
    // Milestone Roll Numbers
    'roll_number_69': { name: '😏 Roll #69', description: 'Complete exactly roll number 69', requirement: 69, type: 'exact_roll_number', category: 'ROLLING_SPEC', reward: {  } },
    'roll_number_420': { name: '🌿 Roll #420', description: 'Complete exactly roll number 420', requirement: 420, type: 'exact_roll_number', category: 'ROLLING_SPEC', reward: {  } },
    'roll_number_666': { name: '👿 Roll #666', description: 'Complete exactly roll number 666', requirement: 666, type: 'exact_roll_number', category: 'ROLLING_SPEC', reward: {  } },
    'roll_number_777': { name: '🎰 Roll #777', description: 'Complete exactly roll number 777', requirement: 777, type: 'exact_roll_number', category: 'ROLLING_SPEC', reward: {  } },
    'roll_number_1337': { name: '🕹️ Roll #1337', description: 'Complete exactly roll number 1337', requirement: 1337, type: 'exact_roll_number', category: 'ROLLING_SPEC', reward: {  } },
    'roll_number_9999': { name: '🔢 Roll #9999', description: 'Complete exactly roll number 9999', requirement: 9999, type: 'exact_roll_number', category: 'ROLLING_SPEC', reward: {  } },
    'roll_number_12345': { name: '🔢 Sequential Roll', description: 'Complete exactly roll number 12345', requirement: 12345, type: 'exact_roll_number', category: 'ROLLING_SPEC', reward: {  } },
    'roll_number_42069': { name: '🤪 The Meme Roll', description: 'Complete exactly roll number 42069', requirement: 42069, type: 'exact_roll_number', category: 'ROLLING_SPEC', reward: {  } },
    'roll_number_100k': { name: '💯 Hundred K', description: 'Complete exactly roll number 100000', requirement: 100000, type: 'exact_roll_number', category: 'ROLLING_SPEC', reward: {  } },
    'roll_number_123456': { name: '🔢 Perfect Sequence', description: 'Complete exactly roll number 123456', requirement: 123456, type: 'exact_roll_number', category: 'ROLLING_SPEC', reward: {  } },

    // Perfect Timing Rolls
    'roll_at_1am': { name: '🌙 1 AM Roller', description: 'Roll exactly at 1:00 AM', requirement: 1, type: 'roll_at_1am', category: 'ROLLING_SPEC', reward: {  } },
    'roll_at_3am': { name: '👻 3 AM Challenge', description: 'Roll exactly at 3:00 AM (witching hour)', requirement: 1, type: 'roll_at_3am', category: 'ROLLING_SPEC', reward: {  } },
    'roll_on_birthday': { name: '🎂 Birthday Roll', description: 'Roll on your account creation anniversary', requirement: 1, type: 'birthday_roll', category: 'ROLLING_SPEC', reward: {  } },
    'new_year_roll': { name: '🎆 New Year Roll', description: 'Roll at exactly midnight on New Year', requirement: 1, type: 'new_year_roll', category: 'ROLLING_SPEC', reward: {  } },
    'halloween_midnight': { name: '🎃 Halloween Midnight', description: 'Roll at midnight on Halloween', requirement: 1, type: 'halloween_midnight_roll', category: 'ROLLING_SPEC', reward: {  } },

    // Roll Patterns
    'alternating_tier_10': { name: '🔄 Alternating Tiers', description: 'Roll alternating tier levels 10 times (common-rare-common-rare)', requirement: 10, type: 'alternating_tiers', category: 'ROLLING_SPEC', reward: {  } },
    'ascending_tier_5': { name: '📈 Ascending Tiers', description: 'Roll 5 auras with each tier higher than the last', requirement: 5, type: 'ascending_tiers', category: 'ROLLING_SPEC', reward: {  } },
    'descending_tier_5': { name: '📉 Descending Tiers', description: 'Roll 5 auras with each tier lower than the last', requirement: 5, type: 'descending_tiers', category: 'ROLLING_SPEC', reward: {  } },
    'all_different_tiers_9': { name: '🌈 Tier Rainbow', description: 'Roll 9 different tier levels in a row (no repeats)', requirement: 9, type: 'tier_rainbow', category: 'ROLLING_SPEC', reward: {  } },
    'palindrome_tiers': { name: '🔁 Palindrome Tiers', description: 'Roll tiers in palindrome pattern (e.g., 1-2-3-2-1)', requirement: 5, type: 'palindrome_tiers', category: 'ROLLING_SPEC', reward: {  } },

    // Speed-Based Rolling
    'supersonic_100': { name: '⚡ Supersonic Century', description: 'Roll 100 times with 500%+ speed active', requirement: 100, type: 'speed_500_rolls', category: 'ROLLING_SPEC', reward: {  } },
    'turtle_mode': { name: '🐢 Turtle Mode', description: 'Roll 100 times with less than 50% speed', requirement: 100, type: 'slow_rolls_50', category: 'ROLLING_SPEC', reward: {  } },
    'speed_variance': { name: '🎢 Speed Demon Variance', description: 'Roll with 1000%+ speed then 0% speed within 10 rolls', requirement: 1, type: 'speed_variance', category: 'ROLLING_SPEC', reward: {  } },
    'instant_100': { name: '⚡ Instant 100', description: 'Roll 100 times in under 60 seconds', requirement: 100, type: 'instant_100_rolls', category: 'ROLLING_SPEC', reward: {  } },

    // Combo Rolling
    'triple_same_tier': { name: '3️⃣ Triple Tier', description: 'Roll 3 auras of the exact same tier in a row', requirement: 3, type: 'triple_same_tier', category: 'ROLLING_SPEC', reward: {  } },
    'five_same_tier': { name: '5️⃣ Quintuple Tier', description: 'Roll 5 auras of the exact same tier in a row', requirement: 5, type: 'five_same_tier', category: 'ROLLING_SPEC', reward: {  } },
    'ten_same_tier': { name: '🔟 Tier Dedication', description: 'Roll 10 auras of the exact same tier in a row', requirement: 10, type: 'ten_same_tier', category: 'ROLLING_SPEC', reward: {  } },

    // Breakthrough Specific
    'breakthrough_only_10': { name: '💥 Breakthrough Only', description: 'Roll 10 breakthrough auras in a row', requirement: 10, type: 'breakthrough_only', category: 'ROLLING_SPEC', reward: {  } },
    'no_breakthrough_1000': { name: '🚫 No Breakthroughs Allowed', description: 'Roll 1,000 times without a single breakthrough', requirement: 1000, type: 'no_breakthrough_1000', category: 'ROLLING_SPEC', reward: {  } },
    'breakthrough_sandwich': { name: '🥪 Breakthrough Sandwich', description: 'Roll breakthrough-normal-breakthrough pattern', requirement: 1, type: 'breakthrough_sandwich', category: 'ROLLING_SPEC', reward: {  } },

    // Pity Counter Achievements
    'pity_rare_500': { name: '😢 Rare Pity', description: 'Go 500 rolls without a rare+ aura', requirement: 500, type: 'pity_rare', category: 'ROLLING_SPEC', reward: {  } },
    'pity_epic_1000': { name: '😭 Epic Pity', description: 'Go 1,000 rolls without an epic+ aura', requirement: 1000, type: 'pity_epic', category: 'ROLLING_SPEC', reward: {  } },
    'pity_legendary_5000': { name: '💔 Legendary Pity', description: 'Go 5,000 rolls without a legendary+ aura', requirement: 5000, type: 'pity_legendary', category: 'ROLLING_SPEC', reward: {  } },
    'no_pity_lucky': { name: '🍀 Never Unlucky', description: 'Never go more than 50 rolls without a rare+', requirement: 10000, type: 'no_pity_10k', category: 'ROLLING_SPEC', reward: {  } },

    // Session-Based
    'session_1_roll': { name: '👆 One and Done', description: 'Roll exactly 1 time in a session then leave', requirement: 1, type: 'one_roll_session', category: 'ROLLING_SPEC', reward: {  } },
    'session_perfect_100': { name: '💯 Perfect Session', description: 'Roll exactly 100 times in one session (no more, no less)', requirement: 100, type: 'exact_100_session', category: 'ROLLING_SPEC', reward: {  } },
    'marathon_session_50k': { name: '🏃 Ultra Marathon', description: 'Roll 50,000 times in a single session', requirement: 50000, type: 'ultra_marathon_session', category: 'ROLLING_SPEC', reward: {  } },
    'micro_sessions': { name: '⏱️ Micro Sessions', description: 'Complete 100 sessions with less than 10 rolls each', requirement: 100, type: 'micro_sessions', category: 'ROLLING_SPEC', reward: {  } },

    // Daily Rolling
    'daily_100_streak': { name: '📅 Daily Century Streak', description: 'Roll 100+ times every day for 30 days', requirement: 30, type: 'daily_100_streak', category: 'ROLLING_SPEC', reward: {  } },
    'daily_1k_week': { name: '📆 Weekly Grind', description: 'Roll 1,000+ times every day for 7 days straight', requirement: 7, type: 'daily_1k_week', category: 'ROLLING_SPEC', reward: {  } },
    'perfect_month': { name: '📅 Perfect Month', description: 'Roll at least once every single day for 30 days', requirement: 30, type: 'daily_perfect_month', category: 'ROLLING_SPEC', reward: {  } },

    // Biome Rolling
    'null_biome_1000': { name: '⚫ NULL Grinder', description: 'Roll 1,000 times during NULL biome', requirement: 1000, type: 'null_biome_rolls', category: 'ROLLING_SPEC', reward: {  } },
    'glitch_biome_500': { name: '✨ Glitch Grinder', description: 'Roll 500 times during GLITCHED biome', requirement: 500, type: 'glitch_biome_rolls', category: 'ROLLING_SPEC', reward: {  } },
    'dreamspace_100': { name: '🌸 Dreamspace Grinder', description: 'Roll 100 times during DREAMSPACE biome', requirement: 100, type: 'dreamspace_rolls', category: 'ROLLING_SPEC', reward: {  } },
    'biome_hopper': { name: '🌍 Biome Hopper', description: 'Roll in 5 different biomes within 1 hour', requirement: 5, type: 'biome_hopper_hour', category: 'ROLLING_SPEC', reward: {  } },
    'single_biome_10k': { name: '🏔️ Biome Dedication', description: 'Roll 10,000 times without the biome changing', requirement: 10000, type: 'single_biome_10k', category: 'ROLLING_SPEC', reward: {  } },

    // Mutation Rolling
    'mutation_streak_20': { name: '🧬 Mutation Streak', description: 'Roll 20 mutated auras in a row', requirement: 20, type: 'mutation_streak', category: 'ROLLING_SPEC', reward: {  } },
    'no_mutations_5000': { name: '🚫 Pure Genes', description: 'Roll 5,000 times without a single mutation', requirement: 5000, type: 'no_mutations_5000', category: 'ROLLING_SPEC', reward: {  } },
    'mutation_only_100': { name: '🧬 Mutations Only', description: 'Roll 100 mutations in a row', requirement: 100, type: 'mutation_only_100', category: 'ROLLING_SPEC', reward: {  } },

    // Weekend/Time-Based
    'weekend_50k': { name: '🎮 Weekend Warrior Pro', description: 'Roll 50,000 times on a single weekend', requirement: 50000, type: 'weekend_50k', category: 'ROLLING_SPEC', reward: {  } },
    'weekday_grind': { name: '💼 Weekday Grinder', description: 'Roll 10,000 times on a Monday', requirement: 10000, type: 'monday_10k', category: 'ROLLING_SPEC', reward: {  } },
    'friday_night': { name: '🎉 Friday Night Fever', description: 'Roll 5,000 times on a Friday evening (6-10PM)', requirement: 5000, type: 'friday_night', category: 'ROLLING_SPEC', reward: {  } },

    // Auto-Roll vs Manual
    'manual_only_50k': { name: '👆 Manual Master Pro', description: 'Roll 50,000 times manually (no auto-roll)', requirement: 50000, type: 'manual_50k', category: 'ROLLING_SPEC', reward: {  } },
    'auto_only_100k': { name: '🤖 Full Automation Pro', description: 'Roll 100,000 times with only auto-roll', requirement: 100000, type: 'auto_100k', category: 'ROLLING_SPEC', reward: {  } },
    'manual_auto_switch': { name: '🔄 Mode Switcher', description: 'Switch between manual and auto-roll 100 times', requirement: 100, type: 'mode_switches', category: 'ROLLING_SPEC', reward: {  } },

    // Luck-Based Rolling
    'max_luck_1000_rolls': { name: '🍀 Always Lucky', description: 'Roll 1,000 times with 1000%+ luck active', requirement: 1000, type: 'luck_1000_rolls', category: 'ROLLING_SPEC', reward: {  } },
    'base_luck_10k': { name: '💯 Base Luck Grinder', description: 'Roll 10,000 times with exactly 100% luck (no buffs)', requirement: 10000, type: 'base_luck_10k', category: 'ROLLING_SPEC', reward: {  } },
    'luck_roller_coaster': { name: '🎢 Luck Roller Coaster', description: 'Roll with 10000%+ luck then 100% luck within 10 rolls', requirement: 1, type: 'luck_coaster', category: 'ROLLING_SPEC', reward: {  } },

    // Aura Name Patterns
    'all_same_letter': { name: '🔤 Alphabetical', description: 'Roll 5 auras starting with the same letter in a row', requirement: 5, type: 'same_letter_5', category: 'ROLLING_SPEC', reward: {  } },
    'alphabetical_order': { name: '🔤 A to Z', description: 'Roll 5 auras in alphabetical order', requirement: 5, type: 'alphabetical_5', category: 'ROLLING_SPEC', reward: {  } },

    // Special Combos
    'triple_digit_luck': { name: '🔢 Triple Digits', description: 'Roll a rare+ aura with exactly 100% luck', requirement: 1, type: 'triple_digit_luck', category: 'ROLLING_SPEC', reward: {  } },
    'quadruple_digit_luck': { name: '🔢 Quad Digits', description: 'Roll a legendary+ with exactly 1000% luck', requirement: 1, type: 'quad_digit_luck', category: 'ROLLING_SPEC', reward: {  } },

    // Roll Intervals
    'hourly_roller': { name: '⏰ Hourly Roller', description: 'Roll at least once every hour for 48 hours', requirement: 48, type: 'hourly_48', category: 'ROLLING_SPEC', reward: {  } },
    'every_15_min': { name: '⏱️ Quarter Hour', description: 'Roll every 15 minutes for 12 hours', requirement: 48, type: 'every_15_min', category: 'ROLLING_SPEC', reward: {  } },

    // Potion Rolling
    'oblivion_only_1000': { name: '🌑 Oblivion Only', description: 'Roll 1,000 times with only Oblivion Potion active', requirement: 1000, type: 'oblivion_only_1000', category: 'ROLLING_SPEC', reward: {  } },
    'voidheart_100': { name: '💜 Voidheart Hundred', description: 'Use Voidheart potion 100 times', requirement: 100, type: 'voidheart_100_uses', category: 'ROLLING_SPEC', reward: {  } },
    'no_potions_50k': { name: '🚫 Pure Natural 50K', description: 'Roll 50,000 times without using a single potion', requirement: 50000, type: 'no_potions_50k', category: 'ROLLING_SPEC', reward: {  } },

    // Gear Rolling
    'no_gear_20k': { name: '🧍 Naked 20K', description: 'Roll 20,000 times with no gear equipped', requirement: 20000, type: 'no_gear_20k', category: 'ROLLING_SPEC', reward: {  } },
    'tier10_only_10k': { name: '⚙️ Tier 10 Only', description: 'Roll 10,000 times with only Tier 10 gears equipped', requirement: 10000, type: 'tier10_only_10k', category: 'ROLLING_SPEC', reward: {  } },

    // Rune Rolling
    'rune_stack_5': { name: '📿 Rune Stacker Pro', description: 'Roll with 5 different rune effects active', requirement: 5, type: 'rune_stack_5', category: 'ROLLING_SPEC', reward: {  } },
    'no_runes_10k': { name: '🚫 No Runes', description: 'Roll 10,000 times without using a single rune', requirement: 10000, type: 'no_runes_10k', category: 'ROLLING_SPEC', reward: {  } },

    // Crazy Specific
    'same_aura_1000': { name: '🔁 Thousand Times', description: 'Roll the exact same aura 1,000 times (lifetime)', requirement: 1000, type: 'same_aura_1000', category: 'ROLLING_SPEC', reward: {  } },
    'different_every_roll': { name: '🌈 Variety King', description: 'Roll 50 different auras in a row (no duplicates)', requirement: 50, type: 'different_50', category: 'ROLLING_SPEC', reward: {  } },
    'unlucky_then_lucky': { name: '🍀 From Zero to Hero', description: 'Roll a divine+ right after 100 commons in a row', requirement: 100, type: 'unlucky_to_lucky', category: 'ROLLING_SPEC', reward: {  } },

    // Money-Based Rolling
    'broke_roller': { name: '💸 Broke Roller', description: 'Roll 1,000 times with $0 money', requirement: 1000, type: 'broke_rolls_1000', category: 'ROLLING_SPEC', reward: {  } },
    'millionaire_roller': { name: '💰 Millionaire Roller', description: 'Roll 10,000 times while having 1M+ money', requirement: 10000, type: 'millionaire_rolls', category: 'ROLLING_SPEC', reward: {  } },

    // Final Master Achievement
    'rolling_specialist_master': { name: '🎲 Rolling Specialist Master', description: 'Complete all Rolling Specialist achievements', requirement: 'all_rolling_spec', type: 'rolling_spec_master', category: 'ROLLING_SPEC', reward: {  } },

    // =================== GRIND MASTER ACHIEVEMENTS (30 achievements) 💪 ===================
    // Long-term Dedication
    'monthly_grinder': { name: '📅 Monthly Grinder', description: 'Roll at least 1,000 times every day for 30 consecutive days', requirement: 30, type: 'monthly_1k_streak', category: 'GRIND', reward: {  } },
    'quarterly_dedication': { name: '📆 Quarterly Dedication', description: 'Play for 90 consecutive days without missing a single day', requirement: 90, type: 'quarterly_streak', category: 'GRIND', reward: {  } },
    'biannual_warrior': { name: '🗓️ Biannual Warrior', description: 'Play for 180 consecutive days without missing a single day', requirement: 180, type: 'biannual_streak', category: 'GRIND', reward: {  } },
    'decade_roller': { name: '🔟 Decade Roller', description: 'Roll at least once every day for 10 consecutive days', requirement: 10, type: 'decade_daily', category: 'GRIND', reward: {  } },
    
    // Specific Time Windows
    'morning_routine': { name: '☀️ Morning Routine', description: 'Roll between 6-9 AM for 50 consecutive days', requirement: 50, type: 'morning_streak', category: 'GRIND', reward: {  } },
    'lunch_break_roller': { name: '🍱 Lunch Break Roller', description: 'Roll between 12-2 PM for 40 consecutive days', requirement: 40, type: 'lunch_streak', category: 'GRIND', reward: {  } },
    'evening_grinder': { name: '🌆 Evening Grinder', description: 'Roll between 6-9 PM for 60 consecutive days', requirement: 60, type: 'evening_streak', category: 'GRIND', reward: {  } },
    'late_night_legend': { name: '🌙 Late Night Legend', description: 'Roll between 10 PM-2 AM for 45 consecutive days', requirement: 45, type: 'late_night_streak', category: 'GRIND', reward: {  } },
    
    // Cumulative Grinds
    'aura_accumulator': { name: '📊 Aura Accumulator', description: 'Collect a total of 1,000,000 auras (lifetime)', requirement: 1000000, type: 'total_auras_collected', category: 'GRIND', reward: {  } },
    'potion_consumer': { name: '🧪 Potion Consumer', description: 'Use 50,000 potions (lifetime)', requirement: 50000, type: 'lifetime_potions_used', category: 'GRIND', reward: {  } },
    'rune_master_grind': { name: '📿 Rune Master Grind', description: 'Use 25,000 runes (lifetime)', requirement: 25000, type: 'lifetime_runes_used', category: 'GRIND', reward: {  } },
    'crafting_veteran': { name: '⚒️ Crafting Veteran', description: 'Craft 50,000 items (lifetime)', requirement: 50000, type: 'lifetime_crafts', category: 'GRIND', reward: {  } },
    
    // Session-Based Grinds
    'ultra_session': { name: '⏱️ Ultra Session', description: 'Play for 6 hours in a single session', requirement: 360, type: 'ultra_session_minutes', category: 'GRIND', reward: {  } },
    'mega_session': { name: '⏰ Mega Session', description: 'Play for 10 hours in a single session', requirement: 600, type: 'mega_session_minutes', category: 'GRIND', reward: {  } },
    'legendary_session': { name: '🏆 Legendary Session', description: 'Play for 16 hours in a single session', requirement: 960, type: 'legendary_session_minutes', category: 'GRIND', reward: {  } },
    
    // Biome Dedication
    'biome_specialist_hell': { name: '🔥 Hell Specialist', description: 'Roll 10,000 times in HELL biome (lifetime)', requirement: 10000, type: 'hell_biome_rolls_lifetime', category: 'GRIND', reward: {  } },
    'biome_specialist_void': { name: '⚫ Void Specialist', description: 'Roll 5,000 times in VOID biome (lifetime)', requirement: 5000, type: 'void_biome_rolls_lifetime', category: 'GRIND', reward: {  } },
    'biome_specialist_null': { name: '🌑 NULL Specialist', description: 'Roll 2,500 times in NULL biome (lifetime)', requirement: 2500, type: 'null_biome_rolls_lifetime', category: 'GRIND', reward: {  } },
    'biome_specialist_glitch': { name: '✨ Glitch Specialist', description: 'Roll 1,500 times in GLITCHED biome (lifetime)', requirement: 1500, type: 'glitch_biome_rolls_lifetime', category: 'GRIND', reward: {  } },
    'biome_specialist_dreamspace': { name: '🌸 Dreamspace Specialist', description: 'Roll 750 times in DREAMSPACE biome (lifetime)', requirement: 750, type: 'dreamspace_biome_rolls_lifetime', category: 'GRIND', reward: {  } },
    
    // Tier-Specific Grinds
    'common_destroyer': { name: '🗑️ Common Destroyer', description: 'Delete 500,000 common auras (lifetime)', requirement: 500000, type: 'commons_deleted_lifetime', category: 'GRIND', reward: {  } },
    'rare_collector_pro': { name: '💎 Rare Collector Pro', description: 'Collect 100,000 rare+ auras (lifetime)', requirement: 100000, type: 'rare_plus_collected', category: 'GRIND', reward: {  } },
    'epic_enthusiast': { name: '🌟 Epic Enthusiast', description: 'Collect 25,000 epic+ auras (lifetime)', requirement: 25000, type: 'epic_plus_collected', category: 'GRIND', reward: {  } },
    'legendary_hunter': { name: '👑 Legendary Hunter', description: 'Collect 5,000 legendary+ auras (lifetime)', requirement: 5000, type: 'legendary_plus_collected', category: 'GRIND', reward: {  } },
    'mythic_seeker': { name: '⚡ Mythic Seeker', description: 'Collect 1,000 mythic+ auras (lifetime)', requirement: 1000, type: 'mythic_plus_collected', category: 'GRIND', reward: {  } },
    
    // Money Grinds
    'money_maker': { name: '💰 Money Maker', description: 'Earn 100,000,000 money (lifetime)', requirement: 100000000, type: 'lifetime_money_earned', category: 'GRIND', reward: {  } },
    'big_spender': { name: '💸 Big Spender', description: 'Spend 50,000,000 money (lifetime)', requirement: 50000000, type: 'lifetime_money_spent', category: 'GRIND', reward: {  } },
    
    // Breakthrough Grinds
    'breakthrough_veteran': { name: '💥 Breakthrough Veteran', description: 'Get 50,000 breakthroughs (lifetime)', requirement: 50000, type: 'lifetime_breakthroughs', category: 'GRIND', reward: {  } },
    'breakthrough_legend': { name: '💫 Breakthrough Legend', description: 'Get 250,000 breakthroughs (lifetime)', requirement: 250000, type: 'lifetime_breakthroughs_250k', category: 'GRIND', reward: {  } },
    
    // Final Grind Master
    'grind_master': { name: '💪 Grind Master', description: 'Complete all Grind Master achievements', requirement: 'all_grind', type: 'grind_master', category: 'GRIND', reward: {  } }
};


// Total Achievements Breakdown:
// - Roll Milestones: 15
// - Rarity Hunter: 12
// - Time Traveler: 10
// - Breakthrough Master: 10
// - Biome Explorer: 11
// - Aura Collection: 20
// - Potion Master: 8
// - Meta (Achievement Hunter): 9
// - Rune Master: 10
// - Crafting Master: 15
// - Speed Runner: 10
// - Lucky Streaks: 10
// - Collection Specialist: 15
// - Gear Master: 10
// - Special Challenges: 16
// - Daily/Session: 5
// - Elemental Master: 15
// - Combination Specialist: 20
// - Biome Specialist: 15
// - Rolling Master: 15
// - Luck Specialist: 10
// - Mutation Master: 10
// - Halloween Special: 20 🎃
// - Ultimate Challenges: 5
// - Super Specific Achievements: 100 🎯
// - Insane Challenges: 25 🔥
// - Meme & Fun: 30 🤣
// - Godlike: 20 ⚡
// - Grind Master: 30 💪
// GRAND TOTAL: 525 ACHIEVEMENTS! 🎉🔥⚡💪
