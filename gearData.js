
const gearData = {
    // T1 Gears
    'Luck Glove': { tier: 1, effects: { luck: 25 }, hand: 'right', recipe: { 'Gear Basing': 1, 'Divinus': 2, 'Crystallized': 1, 'Rare': 3 }, description: 'A simple glove that slightly increases your luck.' },
    'Desire Glove': { tier: 1, effects: { luck: 40 }, hand: 'right', recipe: { 'Gear Basing': 1, 'Rage': 1, 'Ruby': 1, 'Diaboli': 1, 'Bleeding': 1 }, description: 'A glove that provides a good boost to your luck.' },
    'Lunar Device': { tier: 1, effects: { rollSpeed: 15 }, hand: 'right', recipe: { 'Gear Basing': 1, 'Rare': 1, 'Divinus': 1, 'Lunar': 1 }, description: 'A device that harnesses the power of the moon to increase your roll speed.' },
    'Gemstone Gauntlet': { tier: 1, effects: { special: 'randomGemBoost', duration: 10, maxLuck: 30, maxRollSpeed: 30 }, hand: 'left', recipe: { 'Gear Basing': 1, 'Topaz': 1, 'Ruby': 1, 'Emerald': 1, 'Sapphire': 1, 'Aquamarine': 1, 'Quartz': 1 }, description: 'A gauntlet that can be empowered with various gems to provide random boosts.' },
    'Frozen Gauntlet': { tier: 1, effects: { luck: 150, rollSpeed: -25 }, hand: 'right', recipe: { 'Gear Basing': 1, 'Glacier': 1, 'Permafrost': 1 }, description: 'A gauntlet made of ice that significantly increases your luck but slows down your rolls.' },
    'Solar Device': { tier: 1, effects: { luck: 50 }, hand: 'right', recipe: { 'Gear Basing': 1, 'Solar': 1, 'Divinus': 1, 'Rare': 1 }, description: 'A device that harnesses the power of the sun to increase your luck.' },
    'Obsidian Grip': { tier: 1, effects: { luck: 35, rollSpeed: 5 }, hand: 'right', recipe: { 'Gear Basing': 1, 'Ink': 2, 'Crystallized': 2, 'Rare': 2 }, description: 'A grip that provides a moderate boost to both luck and roll speed.' },
    'Time Bender': { tier: 1, effects: { special: 'rollCooldownReduction', reduction: 0.5 }, hand: 'left', recipe: { 'Gear Basing': 1, 'Rare': 4, 'Uncommon': 5, 'Common': 10 }, description: 'A device that allows you to bend time, reducing the cooldown of your rolls.' },
    // T2 Gears
    'Dark Matter Device': { tier: 2, effects: { special: 'bonusRollPointChance', chance: 0.001, points: 1 }, hand: 'left', recipe: { 'Gear Basing': 1, 'Ink': 1, 'Glock': 1, 'Ash': 1 }, description: 'A device that has a small chance to grant you an extra roll point.' },
    'Aqua Device': { tier: 2, effects: { rollSpeed: 10, special: 'rainyBiomeBonus', rainyBonus: 90 }, hand: 'right', recipe: { 'Gear Basing': 1, 'Aquamarine': 1, 'Aquatic': 1, 'Nautilus': 1 }, description: 'A device that increases your roll speed and provides a significant bonus in rainy biomes.' },
    'Shining Star': { tier: 2, effects: { luck: 50, special: 'starfallBiomeBonus', starfallBonus: 200 }, hand: 'right', recipe: { 'Gear Basing': 1, 'Star Rider': 1, 'Starlight': 1 }, description: 'A device that increases your luck and provides a significant bonus in the starfall biome.' },
    'Eclipse Device': { tier: 2, effects: { luck: 50, rollSpeed: 15 }, hand: 'right', recipe: { 'Eclipse': 1, 'Solar Device': 1, 'Lunar Device': 1 }, description: 'A device that combines the power of the sun and moon to increase both luck and roll speed.' },
    'Prismatic Ring': { tier: 2, effects: { special: 'auraTierUpChance', chance: 0.05 }, hand: 'left', recipe: { 'Gear Basing': 2, 'Topaz': 3, 'Emerald': 3, 'Sapphire': 3, 'Ruby': 2 }, description: 'A ring that has a chance to upgrade the tier of the aura you roll.' },
    'Storm Catcher': { tier: 2, effects: { luck: 65, special: 'windyBiomeBonus', windyBonus: 80 }, hand: 'right', recipe: { 'Gear Basing': 1, 'Wind': 8, 'Uncommon': 15, 'Rare': 20 }, description: 'A device that increases your luck and provides a bonus in windy biomes.' },
    'Molten Gauntlet': { tier: 2, effects: { luck: 80, rollSpeed: -10 }, hand: 'right', recipe: { 'Gear Basing': 1, 'Rage': 5, 'Ruby': 3, 'Diaboli': 2 }, description: 'A gauntlet forged in a volcano that provides a large luck boost at the cost of roll speed.' },
    // T3 Gears
    'Jackpot Gauntlet': { tier: 3, effects: { luck: 77, rollSpeed: 7, special: 'jackpotBonus', bonus: 77 }, hand: 'left', recipe: { 'Gear Basing': 7, 'Jackpot': 77, 'Gilded': 77, 'Rare': 777 }, description: 'A gauntlet that greatly increases your luck and roll speed, with a special jackpot bonus.' },
    'Exo Gauntlet': { tier: 3, effects: { luck: 100, rollSpeed: 20 }, hand: 'right', recipe: { 'Gear Basing': 3, 'Gilded': 3, 'Precious': 2, 'Magnetic': 2, 'Sidereum': 1, 'Undead': 1, 'Exotic': 1 }, description: 'A powerful gauntlet that provides a significant boost to both luck and roll speed.' },
    'Windstorm Device': { tier: 3, effects: { luck: 115, rollSpeed: 25 }, hand: 'right', recipe: { 'Gear Basing': 5, 'Wind': 25, 'Stormal': 1, 'Aquatic': 1, 'Sidereum': 4, 'Precious': 12 }, description: 'A device that provides a large boost to both luck and roll speed.' },
    'Flesh Device': { tier: 3, effects: { special: 'permanentBonusRoll', bonusRollMultiplier: 1.3 }, hand: 'left', recipe: { 'Astral': 1, 'Hazard': 30, 'Corrosive': 15, 'Undead': 10, 'Crystallized': 6000, 'Ink': 190, 'Bleeding': 30 }, description: 'A grotesque device that permanently increases your bonus roll multiplier.' },
    'Phantom Glove': { tier: 3, effects: { special: 'ghostRollChance', chance: 0.1, bonusRolls: 2 }, hand: 'left', recipe: { 'Gear Basing': 3, 'Undead': 8, 'Lost Soul': 2, 'Ink': 50, 'Ash': 10 }, description: 'A glove that has a chance to grant you two extra rolls.' },
    'Crimson Striker': { tier: 3, effects: { luck: 125, rollSpeed: 18 }, hand: 'right', recipe: { 'Gear Basing': 4, 'Ruby': 12, 'Bleeding': 8, 'Rage': 60, 'Diaboli': 15 }, description: 'A powerful gauntlet that provides a large boost to both luck and roll speed.' },
    'Fortune Weaver': { tier: 3, effects: { luck: 90, special: 'jackpotMiniBonus', bonus: 30 }, hand: 'right', recipe: { 'Gear Basing': 5, 'Jackpot': 20, 'Precious': 5, 'Gilded': 15, 'Ruby': 10 }, description: 'A gauntlet that provides a good luck boost and a mini jackpot bonus.' },
    'Kismet Regulator': { tier: 3, effects: { special: 'preventNothing', effect: 'prevents rolling Nothing aura' }, hand: 'left', recipe: { 'Gear Basing': 3, 'Divinus': 5, 'Jackpot': 8, 'Gilded': 12, 'Precious': 3, '★': 15 }, description: 'A device that regulates fate itself, preventing the worst possible outcome - rolling Nothing.' },
    // T4 Gear
    'Subzero Device': { tier: 4, effects: { luck: 150, rollSpeed: 30 }, hand: 'right', recipe: { 'Gear Basing': 5, 'Permafrost': 2, 'Crystallized': 600, 'Aquatic': 2, 'Glacier': 60, 'Sidereum': 10, 'Magnetic': 20, 'Precious': 40 }, description: 'A device that provides a very large boost to both luck and roll speed.' },
    'Void Catalyst': { tier: 4, effects: { special: 'negativeAuraReroll', maxRerolls: 3 }, hand: 'left', recipe: { 'Gear Basing': 4, 'Diaboli: Void': 2, 'Ink': 80, 'Undead': 18, 'Corrosive': 22, 'Hazard': 45 }, description: 'A device that allows you to reroll negative auras.' },
    'Thunder Fist': { tier: 4, effects: { luck: 175, rollSpeed: 22 }, hand: 'right', recipe: { 'Gear Basing': 6, 'Lightning': 5, 'Watt': 12, 'Magnetic': 25, 'Star Rider': 15, 'Powered': 8 }, description: 'A gauntlet that provides a very large boost to both luck and roll speed.' },
    'Midas Touch': { tier: 4, effects: { luck: 180, special: 'gildedBonus', bonus: 100, trigger: 'on rolling a Gilded aura' }, hand: 'right', recipe: { 'Gilded: Midas': 1, 'Precious': 20, 'Gilded': 40, 'Jackpot': 10 }, description: 'Everything this glove touches seems to turn to gold, especially fortune itself.' },
    // T5 Gears
    'Galactic Device': { tier: 5, effects: { luck: 250, rollSpeed: 30 }, hand: 'right', recipe: { 'Galaxy': 1, 'Sapphire': 100, 'Solar': 15, 'Magnetic': 62, 'Comet': 3, 'Gear Basing': 25, 'Diaboli': 80, 'Eclipse Device': 1, 'Lunar': 15 }, description: 'A device that provides a massive boost to both luck and roll speed.' },
    'Volcanic Device': { tier: 5, effects: { luck: 290, rollSpeed: 35 }, hand: 'right', recipe: { 'Hades': 1, 'Rage: Heated': 10, 'Diaboli': 140, 'Rage': 1000, 'Bleeding': 55, 'Gear Basing': 6, 'Solar Device': 1, 'Windstorm Device': 1 }, description: 'A device that provides a massive boost to both luck and roll speed.' },
    'Soul Harvester': { tier: 5, effects: { special: 'auraStreakBonus', streakThreshold: 5, luckBonus: 100 }, hand: 'left', recipe: { 'Gear Basing': 8, 'Lost Soul': 35, 'Undead': 45, 'Spectre': 3, 'Ash': 120, 'Bleeding': 70 }, description: 'A device that rewards you with a luck bonus for getting aura streaks.' },
    'Stellar Forge': { tier: 5, effects: { luck: 270, rollSpeed: 32 }, hand: 'right', recipe: { 'Gear Basing': 10, 'Starlight': 25, 'Star Rider': 40, 'Sidereum': 90, 'Solar': 60, 'Lunar': 60, 'Comet': 8 }, description: 'A device that provides a massive boost to both luck and roll speed.' },
    // T6 Gears
    'Exoflex Device': { tier: 6, effects: { luck: 340, rollSpeed: 35 }, hand: 'right', recipe: { 'Arcane': 3, 'Jade': 5, 'Exotic': 50, 'Undead': 37, 'Sidereum': 350, 'Starlight': 80, 'Aquamarine': 1000, 'Forbidden': 2000, 'Rare': 30000, 'Exo Gauntlet': 1 }, description: 'A top-tier gauntlet that provides a huge boost to both luck and roll speed.' },
    'Hologrammer': { tier: 6, effects: { luck: 395, rollSpeed: 35, special: 'duplicationChance', chance: 0.15 }, hand: 'right', recipe: { 'Virtual': 2, 'Magnetic: Reverse Polarity': 2, 'Twilight': 3, 'Kyawthuite': 2, 'Comet': 30, 'Starlight': 80, 'Rage: Heated': 145, 'Player': 600, 'Magnetic': 830, 'Diaboli': 1645, 'Forbidden': 4000 }, description: 'A device that has a chance to duplicate the aura you roll.' },
    'Entropy Manipulator': { tier: 6, effects: { special: 'rarityFloorIncrease', minTier: 'rare' }, hand: 'left', recipe: { 'Gear Basing': 12, 'Arcane': 5, 'Bounded': 8, 'Undefined': 15, 'Virtual': 22, 'Exotic': 180, 'Twilight': 35 }, description: 'A device that increases the minimum rarity of the auras you can roll.' },
    'Cosmic Decimator': { tier: 6, effects: { luck: 380, rollSpeed: 40 }, hand: 'right', recipe: { 'Gear Basing': 15, 'Cosmos': 3, 'Astral': 5, 'Galaxy': 2, 'Starscourge': 1, 'Star Rider': 110, 'Sidereum': 450, 'Starlight': 95 }, description: 'A top-tier device that provides a huge boost to both luck and roll speed.' },
    // T7 Gear
    'Ragnaröker': { tier: 7, effects: { luck: 455, rollSpeed: 40, special: 'biomeBonus', biomes: ['WINDY', 'RAINY', 'HELL'], luckBonus: 45, rollSpeedBonus: 5 }, hand: 'right', recipe: { 'Zeus': 3, 'Hades': 3, 'Poseidon': 3, 'Star Rider': 75, 'Solar': 175, 'Lunar': 175, 'Rage: Heated': 230, 'Lost Soul': 350, 'Sidereum': 800, 'Ash': 1450, 'Diaboli': 3200, 'Rage': 23000 }, description: 'A mythical device that provides a massive boost to both luck and roll speed, with bonuses in certain biomes.' },
    'Chronosphere': { tier: 7, effects: { special: 'timeWarpBonus', effect: 'every 15 rolls double speed for 5 rolls' }, hand: 'left', recipe: { 'Gear Basing': 18, 'Origin': 12, 'Twilight': 20, 'Velocity': 4, 'Virtual': 55, 'Hyper-Volt': 8, 'Bounded': 85 }, description: 'A device that can warp time, doubling your roll speed for a short period.' },
    'Oblivion Shard': { tier: 7, effects: { luck: 480, rollSpeed: 38 }, hand: 'right', recipe: { 'Gear Basing': 20, 'Nihility': 2, 'Arcane: Dark': 4, 'Diaboli: Void': 15, 'Ink': 2800, 'Undead': 450, 'Terror': 6 }, description: 'A shard of pure oblivion that provides a massive boost to both luck and roll speed.' },
    // T8 Gears
    'Gravitational Device': { tier: 8, effects: { special: 'bonusRollMultiplier', multiplier: '2 -> 6' }, hand: 'left', recipe: { 'Gravitational': 1, 'Bounded': 3, 'Exotic': 5, 'Magnetic': 75, 'Diaboli': 152, 'Gear Basing': 15, 'Sidereum': 31, 'Nautilus': 5, 'Precious': 152 }, description: 'A device that multiplies your bonus rolls.' },
    'Starshaper': { tier: 8, effects: { luck: 700, rollSpeed: 50 }, hand: 'right', recipe: { 'Galactic Device': 1, 'Gravitational Device': 1, 'Solar Device': 15, 'Lunar Device': 15, 'Starscourge': 2, 'Hyper-Volt': 3, 'Galaxy': 3, 'Gravitational': 6, 'Comet': 90, 'Star Rider': 200, 'Solar': 1500, 'Lunar': 1500, 'Sidereum': 2700, 'Magnetic': 5600 }, description: 'An ultimate device that provides an enormous boost to both luck and roll speed.' },
    'Darkshader': { tier: 8, effects: { special: 'bonusRollCountdown', countdown: '10 -> 5', special2: 'luckMultiplier', multiplier: 2.5, trigger: 'every 20th roll', duration: 10 }, hand: 'left', recipe: { 'Arcane: Dark': 1, 'Twilight': 5, 'Undefined': 20, 'Leak': 1150, 'Lunar': 2700, 'Hazard': 2250, 'Bleeding': 3500, 'Diaboli': 14800, 'Ink': 22000, 'Forbidden': 37000 }, description: 'A device that can both reduce your bonus roll countdown and multiply your luck.' },
    'Reality Breaker': { tier: 8, effects: { special: 'rarityMultiplierBoost', multiplier: 1.25 }, hand: 'left', recipe: { 'Gear Basing': 25, 'Matrix': 4, 'Virtual': 80, 'Undefined': 90, 'Unbound': 35, 'Origin': 42, 'Exotic': 650, 'Arcane': 110 }, description: 'A device that multiplies the rarity of the auras you roll.' },
    'Apocalypse Bringer': { tier: 8, effects: { luck: 720, rollSpeed: 48 }, hand: 'right', recipe: { 'Gear Basing': 28, 'Hades': 12, 'Zeus': 10, 'Poseidon': 8, 'Anubis': 5, 'Terror': 18, 'Kyawthuite': 25, 'Arcane': 180, 'Exotic': 750 }, description: 'An ultimate device that provides an enormous boost to both luck and roll speed.' },
    // T9 Gear
    'Neuralyzer': { tier: 9, effects: { luck: 850, rollSpeed: 70 }, hand: 'right', recipe: { 'Hologrammer': 1, 'Chromatic': 2, 'Origin': 7, 'Virtual': 18, 'Twilight': 10, 'Unbound': 20, 'Exotic': 400, 'Starlight': 260, 'Flushed': 2000, 'Lost Soul': 2500 }, description: 'A futuristic device that provides an immense boost to both luck and roll speed.' },
    'Paradox Engine': { tier: 9, effects: { special: 'reverseTimeOnBad', threshold: 'epic', rewindRolls: 3 }, hand: 'left', recipe: { 'Gear Basing': 35, 'Bounded: Paradox': 2, 'Twilight': 45, 'Origin': 38, 'Velocity': 12, 'Ethereal': 8, 'Undefined': 250, 'Unbound': 120 }, description: 'A device that can reverse time, rewinding your rolls if you get a bad aura.' },
    'Cosmic Convergence': { tier: 9, effects: { luck: 900, rollSpeed: 75 }, hand: 'right', recipe: { 'Gear Basing': 40, 'Runic': 8, 'Matrix': 12, 'Chromatic': 6, 'Galaxy': 18, 'Arcane': 280, 'Exotic': 850, 'Hyper-Volt': 55 }, description: 'A gauntlet where cosmic forces converge, providing a colossal boost to both luck and roll speed.' },
    // Special Tier
    'Pole Light Core Device': { tier: 'Special', effects: { luck: 500, special: 'skipStacks', trigger: 'every 30th roll', stacks: 5 }, hand: 'left', recipe: { 'Sirius': 3, 'Blizzard': 3, 'Hyper-Volt': 4, 'Origin': 5, 'Magnetic: Reverse Polarity': 25, 'Jade': 100, 'Permafrost': 300, 'Solar': 5000, 'Sidereum': 7250, 'Magnetic': 9000 }, description: 'A special device that can skip roll stacks.' },
    'Luck Amplifier Core': { tier: 'Special', effects: { special: 'exponentialLuckGrowth', baseGrowth: 1.02, capMultiplier: 3 }, hand: 'left', recipe: { 'Gear Basing': 50, 'Jackpot': 450, 'Precious': 380, 'Gilded': 520, 'Kyawthuite': 88, 'Arcane': 425, 'Celestial': 22, 'Jade': 125 }, description: 'A special device that provides exponential luck growth.' },
    'Divine Retribution': { tier: 'Special', effects: { luck: 650, rollSpeed: 55, special: 'divineBiomeBonus', biomes: ['STARFALL', 'GLITCH'], bonus: 300 }, hand: 'right', recipe: { 'Gear Basing': 45, 'Anubis': 18, 'Celestial': 35, 'Arcane': 380, 'Zeus': 28, 'Helios': 12, 'Jade': 140, 'Aether': 95 }, description: 'A special device that provides a massive luck and roll speed boost, with bonuses in certain biomes.' },
    // T10 Gear
    'Genesis Drive': { tier: 10, effects: { luck: 1200, rollSpeed: 100 }, hand: 'right', recipe: { 'Neuralyzer': 1, 'Chromatic: Genesis': 1, 'Matrix': 2, 'Chromatic': 2, 'Hyper-Volt': 10, 'Origin': 10, 'Virtual': 30, 'Bounded': 200, 'Aether': 200, 'Exotic': 400, 'Watt': 2400, 'Powered': 4000 }, description: 'A god-tier device that provides an unbelievable boost to both luck and roll speed.' },
    'Probability Collapse': { tier: 10, effects: { special: 'guaranteedHighTier', cooldown: 100, minTier: 'divine' }, hand: 'left', recipe: { 'Gear Basing': 75, 'Paradox Engine': 1, 'Reality Breaker': 1, 'Bounded: Paradox': 8, 'Matrix': 35, 'Runic': 48, 'Ethereal': 25, 'Origin': 120 }, description: 'A device that can guarantee a high-tier aura roll.' },
    'Omni-Catalyst': { tier: 10, effects: { luck: 1350, rollSpeed: 110 }, hand: 'right', recipe: { 'Genesis Drive': 1, 'Cosmic Convergence': 1, 'Chromatic: Genesis': 2, 'Runic': 65, 'Matrix': 55, 'Hyper-Volt': 85, 'Galaxy': 45, 'Arcane': 850 }, description: 'The ultimate device, providing the highest boost to both luck and roll speed.' },
    // New T1-T2 Gears with Coffee/Cozy Themes
    'Barista Glove': { tier: 1, effects: { luck: 30, rollSpeed: 5 }, hand: 'right', recipe: { 'Gear Basing': 1, 'Espresso': 2, 'Latte': 2, 'Cappuccino': 1 }, description: 'A glove worn by expert baristas, providing a small boost to luck and roll speed.' },
    'Autumn Wrap': { tier: 1, effects: { luck: 45 }, hand: 'left', recipe: { 'Gear Basing': 1, 'Autumn': 1, 'Maple': 2, 'Cinnamon': 2 }, description: 'A cozy wrap that increases your luck with the warmth of autumn.' },
    'Neon Bracelet': { tier: 2, effects: { rollSpeed: 25 }, hand: 'left', recipe: { 'Gear Basing': 1, 'Neon': 3, 'Plasma': 2 }, description: 'A glowing bracelet that significantly increases your roll speed.' },
    'Cafe Charm': { tier: 2, effects: { luck: 70, special: 'coffeeCombo', bonus: 40 }, hand: 'right', recipe: { 'Gear Basing': 2, 'Espresso': 5, 'Mocha': 3, 'Vanilla': 4, 'Latte': 6 }, description: 'A charm that provides a luck boost and bonus when rolling coffee-themed auras.' },
    // New T3 Gears
    'Crimson Claw': { tier: 3, effects: { luck: 140, rollSpeed: 15 }, hand: 'right', recipe: { 'Gear Basing': 4, 'Crimson': 8, 'Vertebrae': 5, 'Hemogoblin': 3, 'Vicious': 2 }, description: 'A claw infused with crimson energy, providing a large boost to luck and roll speed.' },
    'Cozy Hearth': { tier: 3, effects: { luck: 110, special: 'warmthBonus', duration: 15, luckBonus: 50 }, hand: 'left', recipe: { 'Gear Basing': 3, 'Cozy': 4, 'Autumn': 6, 'Bookshelf': 3, 'Maple': 8 }, description: 'A device that radiates warmth, providing periodic luck bonuses.' },
    'Obsidian Fist': { tier: 3, effects: { luck: 130, rollSpeed: 20 }, hand: 'right', recipe: { 'Gear Basing': 4, 'Obsidian': 6, 'Titanium': 4, 'Neon': 8 }, description: 'A fist made of obsidian and titanium, providing a strong boost to both stats.' },
    // New T4-T5 Gears
    'Plasma Core': { tier: 4, effects: { luck: 190, rollSpeed: 35 }, hand: 'right', recipe: { 'Gear Basing': 6, 'Plasma': 15, 'Neon': 25, 'Vortex': 8, 'Titanium': 30 }, description: 'A core of pure plasma energy, providing a very large boost to both luck and roll speed.' },
    'Crimson Heart': { tier: 4, effects: { luck: 200, special: 'crimsonBiomeBonus', crimsonBonus: 150 }, hand: 'right', recipe: { 'Gear Basing': 5, 'Crimson': 20, 'Hemogoblin': 12, 'Vertebrae': 18, 'Vicious': 10, 'Brain': 1 }, description: 'A device powered by the Crimson biome, providing a massive bonus in that biome.' },
    'Marionette Strings': { tier: 5, effects: { special: 'puppeteerControl', effect: 'manipulate roll outcomes', chance: 0.08 }, hand: 'left', recipe: { 'Gear Basing': 8, 'Marionette': 3, 'Clockwork': 5, 'Carnival': 4 }, description: 'Mystical strings that give you a chance to manipulate roll outcomes.' },
    'Kaleidoscope Lens': { tier: 5, effects: { luck: 280, special: 'patternBonus', multiplier: 1.15 }, hand: 'right', recipe: { 'Gear Basing': 10, 'Kaleidoscope': 6, 'Mirage': 8, 'Prism': 12 }, description: 'A lens that bends reality, providing a luck boost and multiplier.' },
    // New T6-T7 Gears
    'Orion Belt': { tier: 6, effects: { luck: 420, rollSpeed: 42 }, hand: 'right', recipe: { 'Gear Basing': 15, 'Orion': 1, 'Galaxy': 5, 'Starscourge': 3, 'Cosmos': 8 }, description: 'The legendary belt of Orion, providing an enormous boost to both luck and roll speed.' },
    'Clockwork Automaton': { tier: 7, effects: { special: 'mechanicalPrecision', effect: 'guaranteed rare+ every 25 rolls' }, hand: 'left', recipe: { 'Gear Basing': 20, 'Clockwork': 25, 'Titanium': 180, 'Plasma': 140, 'Vortex': 90 }, description: 'A mechanical marvel that guarantees rare or better auras periodically.' },
    'Carnival Master': { tier: 7, effects: { luck: 500, rollSpeed: 45, special: 'festivalBonus', bonus: 100 }, hand: 'right', recipe: { 'Gear Basing': 22, 'Carnival': 18, 'Marionette': 12, 'Kaleidoscope': 10, 'Mirage': 15 }, description: 'The master of the carnival, providing massive boosts and special bonuses.' },
    
    // === 50 NEW UNIQUE GEAR ITEMS ===
    // Low Tier (T1-T2)
    'Rusted Knuckles': { tier: 1, effects: { luck: 20, rollSpeed: -5 }, hand: 'right', recipe: { 'Gear Basing': 1, 'Common': 15, 'Uncommon': 5 }, description: '+20% Luck, -5% Roll Speed. A crude but effective glove. Trades speed for raw luck.' },
    'Soothing Handwraps': { tier: 1, effects: { special: 'calmingPresence', effect: 'Slightly reduces the chance of rolling Nothing' }, hand: 'left', recipe: { 'Gear Basing': 1, 'Cozy': 1, 'Autumn': 1, 'Plain': 10 }, description: 'Special: Reduces the chance of rolling "Nothing" aura. Comfortable wraps that calm chaotic luck.' },
    'Apprentice\'s Focus': { tier: 1, effects: { rollSpeed: 20 }, hand: 'left', recipe: { 'Gear Basing': 1, 'Bookshelf': 1, 'Simple': 8 }, description: '+20% Roll Speed. A simple enchanted lens that dramatically increases your rolling speed.' },
    'Gilded Signet': { tier: 2, effects: { luck: 60 }, hand: 'right', recipe: { 'Gear Basing': 1, 'Gilded': 2, 'Precious': 1, 'Rare': 10 }, description: '+60% Luck. A heavy, gold-plated ring that radiates pure fortune.' },
    'Rootbinder Gauntlets': { tier: 2, effects: { luck: 55, special: 'naturalAttunement', bonus: 25, trigger: 'on rolling a Flora aura' }, hand: 'right', recipe: { 'Gear Basing': 2, 'Flora': 1, 'Natural': 5, 'Uncommon': 12 }, description: '+55% Luck. Special: When you roll any Flora aura, gain +25% luck for 8 seconds.' },
    'Tidal Bracer': { tier: 2, effects: { rollSpeed: 18, luck: 10 }, hand: 'left', recipe: { 'Gear Basing': 1, 'Aquatic': 1, 'Sand Bucket': 1, 'Good': 5 }, description: '+10% Luck, +18% Roll Speed. A balanced bracer with rhythmic energy.' },
    
    // Mid Tier (T3-T4)
    'Isotope Injectors': { tier: 3, effects: { luck: -20, rollSpeed: 50 }, hand: 'right', recipe: { 'Gear Basing': 3, 'Atomic': 1, 'Hazard': 5, 'Corrosive': 2 }, description: '-20% Luck, +50% Roll Speed. Dangerous trade-off: massive speed boost but reduced luck.' },
    'Gale Weavers': { tier: 3, effects: { rollSpeed: 35, special: 'tailwind', effect: 'Every 10th roll is 50% faster' }, hand: 'left', recipe: { 'Gear Basing': 3, 'Wind': 15, 'Stormal': 1 }, description: '+35% Roll Speed. Special: Every 10th roll gets an additional +50% speed boost (Tailwind).' },
    'Gambler\'s Folly': { tier: 4, effects: { special: 'doubleOrNothing', chance: 0.25, effect: 'On rolling a Rare tier aura, chance to duplicate it or get Nothing instead' }, hand: 'left', recipe: { 'Jackpot Gauntlet': 1, 'Diaboli': 10, 'Flushed': 5 }, description: 'Special: 25% chance when rolling Rare tier to either duplicate it OR get Nothing instead. High risk, high reward!' },
    'Probability Sieve': { tier: 4, effects: { special: 'filterMundane', chance: 0.1, effect: 'Chance to upgrade a Common or Uncommon roll to a Rare' }, hand: 'left', recipe: { 'Gear Basing': 5, 'Virtual': 1, 'Powered': 4, 'Quartz': 2 }, description: 'Special: 10% chance to upgrade any Common or Uncommon roll to Rare tier.' },
    'Hematic Gauntlet': { tier: 4, effects: { luck: 220, rollSpeed: 10 }, hand: 'right', recipe: { 'Gear Basing': 6, 'Bleeding': 20, 'Crimson': 15, 'Hemogoblin': 8, 'Rage': 80 }, description: '+220% Luck, +10% Roll Speed. A blood-forged gauntlet with massive luck power.' },
    
    // High Tier (T5-T6)
    'The Geode Prism': { tier: 5, effects: { special: 'gemstoneResonance', effect: 'Gain +10 luck for 20 seconds for each gem-type aura rolled (stacks 5 times)' }, hand: 'left', recipe: { 'Gemstone Gauntlet': 1, 'Crystallized: Geode': 2, 'Jade': 1, 'Kyawthuite': 1 }, description: 'Special: Each gem-type aura rolled gives +10% luck for 20 seconds (stacks up to 5 times = +50% luck).' },
    'Starlight Catchers': { tier: 5, effects: { luck: 260, rollSpeed: 38 }, hand: 'right', recipe: { 'Shining Star': 1, 'Starlight': 30, 'Star Rider': 25, 'Comet': 5 }, description: '+260% Luck, +38% Roll Speed. Woven from solidified starlight for stellar power.' },
    'Rift Walkers': { tier: 5, effects: { rollSpeed: 45, special: 'phaseShift', chance: 0.05, effect: 'Chance to make your next roll instant' }, hand: 'left', recipe: { 'Gear Basing': 10, 'Bounded': 2, 'Virtual': 3, 'Exotic': 25 }, description: '+45% Roll Speed. Special: 5% chance to make your next roll INSTANT (phase shift through time).' },
    'Fiend\'s Pact': { tier: 6, effects: { luck: 410, rollSpeed: -20 }, hand: 'right', recipe: { 'Gear Basing': 12, 'Diaboli: Void': 5, 'Hades': 1, 'Bleeding': 50, 'Lost Soul': 20 }, description: '+410% Luck, -20% Roll Speed. Demonic contract: massive luck at the cost of speed.' },
    'Aetheric Weave': { tier: 6, effects: { luck: 350, rollSpeed: 40, special: 'etherealBoost', multiplier: 1.1, trigger: 'on rolling a Celestial or higher aura' }, hand: 'right', recipe: { 'Gear Basing': 15, 'Aether': 5, 'Celestial': 2, 'Starlight': 50, 'Arcane': 1 }, description: '+350% Luck, +40% Roll Speed. Special: Rolling Celestial+ aura grants 1.1x luck multiplier for 15 seconds.' },
    'The Overclocker': { tier: 6, effects: { rollSpeed: 60, special: 'cooldown', effect: 'Every 50 rolls, this device overheats, disabling its effect for 10 seconds' }, hand: 'left', recipe: { 'Gear Basing': 11, 'Powered: Overclocked': 1, 'Magnetic: Reverse Polarity': 1, 'Watt': 30 }, description: '+60% Roll Speed. Warning: Overheats every 50 rolls, disabling effect for 10 seconds.' },
    
    // Very High Tier (T7-T8)
    'Anubis\' Scales': { tier: 7, effects: { special: 'finalJudgment', effect: 'Your 100th roll is guaranteed to be Mythic tier or higher' }, hand: 'left', recipe: { 'Gear Basing': 18, 'Anubis': 10, 'Lost Soul': 100, 'Spectre': 5, 'Divinus': 50 }, description: 'Special: Your 100th roll is GUARANTEED to be Mythic tier or higher. Divine judgment!' },
    'Quasar Wraps': { tier: 8, effects: { luck: 680, rollSpeed: 52 }, hand: 'right', recipe: { 'Galactic Device': 1, 'Galaxy': 10, 'Starscourge': 3, 'Sidereum': 200 }, description: '+680% Luck, +52% Roll Speed. Harnesses galactic nucleus energy for cosmic power.' },
    'Singularity Stabilizer': { tier: 8, effects: { luck: 500, special: 'gravityWell', effect: 'Prevents your luck from being reduced by any gear or effect' }, hand: 'left', recipe: { 'Gravitational Device': 1, 'Cosmos': 5, 'Bounded': 10, 'Nihility': 5 }, description: '+500% Luck. Special: Your luck CANNOT be reduced by any gear or effect. Immovable fortune!' },
    'The Oracle\'s Sight': { tier: 7, effects: { special: 'precognition', effect: 'Reveals the tier of the next aura before you roll' }, hand: 'left', recipe: { 'Gear Basing': 22, 'Twilight': 15, 'Origin': 10, 'Undefined': 30 }, description: 'Special: See the future! Reveals the tier of your next aura BEFORE you roll it.' },
    'Draconic Claws': { tier: 8, effects: { luck: 710, rollSpeed: 50 }, hand: 'right', recipe: { 'Jade': 20, 'Kyawthuite': 20, 'Arcane': 150, 'Gilded': 1000, 'Exotic': 500 }, description: '+710% Luck, +50% Roll Speed. Dragon-scale gauntlets with legendary hoard-like fortune.' },
    'The Conductor\'s Baton': { tier: 7, effects: { luck: 200, rollSpeed: 20, special: 'crescendo', effect: 'Luck and Roll Speed increase by 2% for every consecutive roll without stopping (resets after 5 seconds of inactivity)' }, hand: 'right', recipe: { 'Jazz': 20, 'Carnival': 10, 'Marionette': 5 }, description: '+200% Luck, +20% Roll Speed. Special: Gain +2% luck & speed per consecutive roll (max +50%, resets after 5s pause).' },
    
    // Endgame Tier (T9-T10)
    'Epoch Anchor': { tier: 9, effects: { special: 'temporalCharge', effect: 'For every 60 seconds you don\'t roll, your next roll has +1000 luck' }, hand: 'left', recipe: { 'Chronosphere': 1, 'Origin': 5, 'Twilight': 30, 'Flow': 10 }, description: 'Special: For every 60 seconds you DON\'T roll, your next roll gains +1000% luck! Patience rewarded.' },
    'Pantheon\'s Will': { tier: 10, effects: { luck: 1300, rollSpeed: 105, special: 'divineDomain', luckBonus: 100, trigger: 'in Starfall, Windy, or Rainy biomes' }, hand: 'right', recipe: { 'Ragnaröker': 1, 'Zeus': 5, 'Poseidon': 5, 'Hades': 5, 'Anubis': 5 }, description: '+1300% Luck, +105% Roll Speed. Special: +100% luck bonus in Starfall/Windy/Rainy biomes. Divine authority!' },
    'The Lexicon of Chance': { tier: 9, effects: { special: 'nomenclativePower', effect: 'Auras with a colon in their name are 1.1x rarer and grant +50 luck when rolled' }, hand: 'left', recipe: { 'Gear Basing': 40, 'Bookshelf': 50, 'Undefined': 5, 'Origin': 25 }, description: 'Special: Auras with colons (e.g. "Solar: Eclipse") grant +50% luck when rolled. True name power!' },
    'Chaos Theory Engine': { tier: 10, effects: { luck: 1000, rollSpeed: 80, special: 'butterflyEffect', effect: 'Every roll slightly increases the chance of rolling a Transcendent or Cosmic aura (resets when one is rolled)' }, hand: 'left', recipe: { 'Entropy Manipulator': 1, 'Bounded': 20, 'Virtual': 50, 'Glitch': 10 }, description: '+1000% Luck, +80% Roll Speed. Special: Each roll increases Transcendent/Cosmic chance (resets when you get one). Butterfly effect!' },
    'World Forger\'s Gauntlet': { tier: 10, effects: { luck: 1500, rollSpeed: 120 }, hand: 'right', recipe: { 'Starshaper': 1, 'Gravitational Device': 1, 'Origin': 10, 'Cosmos': 10 }, description: '+1500% Luck, +120% Roll Speed. The ULTIMATE gauntlet. You forge reality itself!' },
    'Azathoth\'s Fidget': { tier: 10, effects: { special: 'blindIdiotGod', effect: 'Randomly sets your luck between -1000 and +3000 and your roll speed between 10 and 200 every 10 rolls' }, hand: 'left', recipe: { 'Nihility': 10, 'Diaboli: Void': 50, 'Undefined': 100, 'Terror': 20 }, description: 'Special: Every 10 rolls, RANDOMLY sets luck (-1000% to +3000%) and speed (10% to 200%). PURE CHAOS!' },
    
    // Special Tier Gear
    'The Cartographer\'s Glove': { tier: 'Special', effects: { luck: 300, special: 'unchartedRealms', effect: 'Biome-specific auras are twice as likely to appear' }, hand: 'left', recipe: { 'Gear Basing': 30, 'Flora': 50, 'Wind': 100, 'Aquatic': 50 }, description: '+300% Luck. Special: Biome-specific auras are 2x more likely to appear. Master navigator!' },
    'The Alchemist\'s Hand': { tier: 'Special', effects: { special: 'transmutation', cooldown: 500, effect: 'Allows you to convert 10 Rare auras in your inventory into 1 random Epic aura' }, hand: 'left', recipe: { 'Gear Basing': 25, 'Emerald': 50, 'Ruby': 50, 'Sapphire': 50, 'Topaz': 50, 'Atomic': 5 }, description: 'Special: Convert 10 Rare auras into 1 random Epic aura (500 roll cooldown). Transmutation!' },
    'The Fool\'s Charm': { tier: 'Special', effects: { luck: 777, special: 'beginnersLuck', effect: 'The first roll after equipping this device is guaranteed to be Legendary or higher' }, hand: 'left', recipe: { 'Jackpot': 777, 'Flushed': 77, 'Gilded': 777, 'Gear Basing': 100, 'Quartz': 77, 'Honey': 77, 'Undead': 77 }, description: '+777% Luck. Special: First roll after equipping is GUARANTEED Legendary+. Beginner\'s luck!' },
    'The Collector\'s Index': { tier: 'Special', effects: { luck: 100, special: 'cataloguer', effect: 'Grants a permanent +1 Luck for every unique aura you have ever rolled (up to +500)' }, hand: 'left', recipe: { 'Gear Basing': 40, 'Bookshelf': 100, 'Virtual': 20, 'Exotic': 100 }, description: '+100% Luck. Special: PERMANENT +1% luck for each unique aura rolled (max +500%). Collector\'s reward!' },
    'The Reaper\'s Toll': { tier: 'Special', effects: { luck: 666, rollSpeed: 44, special: 'soulTax', effect: 'Rolling a Lost Soul aura makes your next 5 rolls 20% faster' }, hand: 'right', recipe: { 'Soul Harvester': 1, 'Hades': 4, 'Lost Soul': 50, 'Spectre': 10, 'Undead': 444 }, description: '+666% Luck, +44% Roll Speed. Special: Rolling Lost Soul aura makes next 5 rolls +20% faster. Soul harvest!' },
    
    // Forge Master Set (Fire/Crafting)
    'Smoldering Mitts': { tier: 2, effects: { luck: 40, rollSpeed: 5 }, hand: 'right', recipe: { 'Gear Basing': 2, 'Rage': 5, 'Ash': 2 }, description: '+40% Luck, +5% Roll Speed. Forge Master Set (1/3). Smoldering with residual heat.' },
    'Volcanic Anvil': { tier: 5, effects: { special: 'tempering', effect: 'Every 50 rolls, your right-hand gear gets +10% luck for 1 minute' }, hand: 'accessory', recipe: { 'Molten Gauntlet': 1, 'Obsidian': 10, 'Rage: Heated': 10 }, description: 'Forge Master Set (2/3). Special: Every 50 rolls, right-hand gear gets +10% luck for 1 minute. Tempering!' },
    'Inferno Heart Forge': { tier: 8, effects: { luck: 700, rollSpeed: 45, special: 'solarFlare', trigger: 'on rolling a Solar aura', bonus: 200 }, hand: 'left', recipe: { 'Volcanic Device': 1, 'Hades': 5, 'Solar': 100 }, description: '+700% Luck, +45% Roll Speed. Forge Master Set (3/3). Special: Rolling Solar aura grants +200% luck for 10s!' },
    
    // Chronomancer Set (Time)
    'Temporal Accelerant': { tier: 3, effects: { rollSpeed: 40 }, hand: 'right', recipe: { 'Time Bender': 1, 'Powered': 2 }, description: '+40% Roll Speed. Chronomancer Set (1/3). Accelerates your perception of time.' },
    'Event Horizon Bracer': { tier: 6, effects: { special: 'timeDilation', effect: 'Slows the decay of all temporary luck/speed buffs by 25%' }, hand: 'accessory', recipe: { 'Gravitational': 1, 'Twilight': 3, 'Bounded': 5 }, description: 'Chronomancer Set (2/3). Special: All temporary buffs last 25% longer. Time dilation!' },
    'Causality Inverter': { tier: 9, effects: { special: 'saveState', cooldown: 1000, effect: 'Activate to save your current luck. Activate again within 30 rolls to revert to that luck value' }, hand: 'left', recipe: { 'Chronosphere': 1, 'Origin': 5, 'Glitch': 5 }, description: 'Chronomancer Set (3/3). Special: Save luck state, revert within 30 rolls (1000 roll cooldown). Undo fate!' },
    
    // Dream Weaver Set (Illusion/Mind)
    'Mirage Cuffs': { tier: 5, effects: { special: 'deception', chance: 0.1, effect: 'The rarity text of the next aura is scrambled, but the roll has +100 luck' }, hand: 'right', recipe: { 'Mirage': 10, 'Kaleidoscope': 5 }, description: 'Dream Weaver Set (1/3). Special: 10% chance for scrambled rarity text but +100% luck. Deception!' },
    'Somnambulist\'s Touch': { tier: 7, effects: { luck: 450, special: 'lucidDreaming', bonus: 150, trigger: 'if you roll 3 Mythic+ auras within 10 rolls' }, hand: 'accessory', recipe: { 'Twilight': 20, 'Mirage': 15, 'Kaleidoscope': 10 }, description: '+450% Luck. Dream Weaver Set (2/3). Special: Roll 3 Mythic+ within 10 rolls = +150% luck bonus!' },
    'Phantasmagoria Engine': { tier: 9, effects: { luck: 300, special: 'sharedNightmare', effect: 'Every 75 rolls, your next roll is duplicated for free, but both have a 10% chance to be Terror instead' }, hand: 'left', recipe: { 'Terror': 10, 'Marionette': 5, 'Undead': 100 }, description: '+300% Luck. Dream Weaver Set (3/3). Special: Every 75 rolls, duplicate next roll (10% chance both become Terror)!' },
    
    // Digital Overlord Set (Tech/Data)
    'Firewall Gauntlet': { tier: 4, effects: { special: 'antiVirus', effect: 'Prevents negative effects from other gear' }, hand: 'right', recipe: { 'Virtual': 2, 'Powered': 5, 'Magnetic': 10 }, description: 'Digital Overlord Set (1/3). Special: BLOCKS all negative effects from other gear. Protection!' },
    'Data Miner\'s Glove': { tier: 6, effects: { luck: 320, special: 'dataSpike', effect: 'Every 25th roll has a 1.25x rarity multiplier' }, hand: 'accessory', recipe: { 'Virtual': 10, 'Powered': 20, 'Player': 50 }, description: '+320% Luck. Digital Overlord Set (2/3). Special: Every 25th roll has 1.25x rarity multiplier. Data spike!' },
    'System Rootkit': { tier: 8, effects: { rollSpeed: 50, special: 'adminAccess', effect: 'All chance-based effects from your gear are 5% more likely to occur' }, hand: 'left', recipe: { 'Virtual': 50, 'Undefined': 10, 'Glitch': 5 }, description: '+50% Roll Speed. Digital Overlord Set (3/3). Special: All chance-based gear effects +5% more likely. Admin access!' },
    
    // Celestial Voyager Set (Cosmic/Exploration)
    'Comet Trail Vambrace': { tier: 3, effects: { luck: 80, rollSpeed: 25 }, hand: 'right', recipe: { 'Gear Basing': 3, 'Comet': 1, 'Starlight': 2 }, description: '+80% Luck, +25% Roll Speed. Celestial Voyager Set (1/3). Leaves a trail of stardust.' },
    'Deep Space Navigator': { tier: 7, effects: { special: 'starChart', effect: 'Guarantees the Starfall biome bonus is always active, regardless of biome' }, hand: 'accessory', recipe: { 'Starshaper': 1, 'Galaxy': 3, 'Sidereum': 100 }, description: 'Celestial Voyager Set (2/3). Special: Starfall biome bonus ALWAYS active in ANY biome. Star chart!' },
    'Supernova Catalyst': { tier: 10, effects: { luck: 1400, rollSpeed: 115, special: 'starDeath', effect: 'Upon rolling a Cosmic aura, your next 3 rolls have double luck and speed' }, hand: 'left', recipe: { 'Starshaper': 1, 'Starscourge': 5, 'Cosmos': 10, 'Galaxy': 15 }, description: '+1400% Luck, +115% Roll Speed. Celestial Voyager Set (3/3). Special: Rolling Cosmic = next 3 rolls have 2x luck & speed!' },
    
    // Void Reaper Set (T7-T8) - Death/Soul Theme
    'Soul Shackles': { tier: 7, effects: { luck: 600, rollSpeed: 35, special: 'soulChain', effect: 'Each consecutive Mythic+ roll increases luck by 5% (stacks 10 times)' }, hand: 'right', recipe: { 'Gear Basing': 18, 'Lost Soul': 50, 'Spectre': 10, 'Undead': 100 }, description: '+600% Luck, +35% Roll Speed. Void Reaper Set (1/3). Special: Mythic+ streak = +5% luck per roll (max +50%).' },
    'Death\'s Hourglass': { tier: 8, effects: { special: 'temporalHarvest', effect: 'Every 100 rolls, gain a stack. Consume all stacks to guarantee next roll is Divine+' }, hand: 'accessory', recipe: { 'Chronosphere': 1, 'Lost Soul': 100, 'Hades': 3, 'Anubis': 5 }, description: 'Void Reaper Set (2/3). Special: Collect stacks every 100 rolls, consume for guaranteed Divine+ roll.' },
    'Reaper\'s Scythe': { tier: 8, effects: { luck: 750, rollSpeed: 50, special: 'finalCut', effect: 'Rolling Transcendent+ aura grants +300% luck for 20 seconds' }, hand: 'left', recipe: { 'Soul Harvester': 1, 'Hades': 10, 'Anubis': 10, 'Lost Soul': 200 }, description: '+750% Luck, +50% Roll Speed. Void Reaper Set (3/3). Special: Transcendent+ roll = +300% luck for 20s!' },
    
    // Arcane Ascendant Set (T8-T9) - Magic/Mystic Theme
    'Spellweaver Gauntlets': { tier: 8, effects: { luck: 700, rollSpeed: 45, special: 'manaFlow', effect: 'Every 5th roll costs no time (instant roll)' }, hand: 'right', recipe: { 'Gear Basing': 20, 'Arcane': 50, 'Aether': 20, 'Warlock': 10 }, description: '+700% Luck, +45% Roll Speed. Arcane Ascendant Set (1/3). Special: Every 5th roll is INSTANT.' },
    'Mystic Talisman': { tier: 9, effects: { special: 'arcaneSurge', effect: 'Divine+ auras have 15% increased chance to appear' }, hand: 'accessory', recipe: { 'Arcane': 100, 'Celestial': 30, 'Aether: Quintessence': 5, 'Kyawthuite': 10 }, description: 'Arcane Ascendant Set (2/3). Special: Divine+ auras 15% more likely. Arcane power!' },
    'Infinity Codex': { tier: 9, effects: { luck: 900, rollSpeed: 60, special: 'infiniteKnowledge', effect: 'Reveals rarity tier of next 3 rolls' }, hand: 'left', recipe: { 'Arcane': 150, 'Origin': 10, 'Undefined': 20, 'Matrix': 5 }, description: '+900% Luck, +60% Roll Speed. Arcane Ascendant Set (3/3). Special: See next 3 roll tiers in advance!' },
    
    // Primordial Titan Set (T9-T10) - Ancient/Colossal Theme
    'Atlas Gauntlets': { tier: 9, effects: { luck: 1000, rollSpeed: 70, special: 'titanStrength', effect: 'Luck cannot be reduced below 500%' }, hand: 'right', recipe: { 'Atlas': 5, 'Gargantua': 3, 'Gravitational': 50, 'Cosmos': 20 }, description: '+1000% Luck, +70% Roll Speed. Primordial Titan Set (1/3). Special: Luck floor of 500%!' },
    'World Anchor': { tier: 10, effects: { special: 'immovableForce', effect: 'Set bonuses from other equipped sets are doubled' }, hand: 'accessory', recipe: { 'Atlas': 10, 'Gravitational Device': 1, 'Singularity Stabilizer': 1, 'Origin': 20 }, description: 'Primordial Titan Set (2/3). Special: DOUBLES all other set bonuses. Synergy!' },
    'Colossus Fist': { tier: 10, effects: { luck: 1200, rollSpeed: 90, special: 'titanicImpact', effect: 'Every 50th roll is guaranteed Celestial+' }, hand: 'left', recipe: { 'Gargantua': 10, 'Atlas': 10, 'Cosmos': 30, 'Starscourge': 10 }, description: '+1200% Luck, +90% Roll Speed. Primordial Titan Set (3/3). Special: 50th roll = guaranteed Celestial+!' },
    
    // Quantum Paradox Set (T10) - Reality-Breaking Theme
    'Schrödinger\'s Gloves': { tier: 10, effects: { luck: 1100, rollSpeed: 85, special: 'superposition', effect: 'Each roll has 10% chance to roll TWO auras simultaneously' }, hand: 'right', recipe: { 'Gear Basing': 40, 'Undefined': 50, 'Glitch': 20, 'Matrix: Reality': 3 }, description: '+1100% Luck, +85% Roll Speed. Quantum Paradox Set (1/3). Special: 10% chance to roll TWO auras at once!' },
    'Probability Manipulator': { tier: 10, effects: { special: 'quantumFlux', effect: 'Reroll any aura once per 200 rolls (keeps better result)' }, hand: 'accessory', recipe: { 'Undefined': 100, 'Matrix': 10, 'Glitch': 30, 'Virtual: Worldwide': 2 }, description: 'Quantum Paradox Set (2/3). Special: Reroll once per 200 rolls, keep the better aura!' },
    'Entropy Reverser': { tier: 10, effects: { luck: 1300, rollSpeed: 100, special: 'reverseTime', effect: 'If you roll Nothing, automatically reroll for free' }, hand: 'left', recipe: { 'Entropy Manipulator': 1, 'Chronosphere': 3, 'Glitch': 50, 'Fatal Error': 5 }, description: '+1300% Luck, +100% Roll Speed. Quantum Paradox Set (3/3). Special: Nothing rolls auto-reroll for FREE!' },
    
    // Cosmic Overlord Set (T10) - Ultimate Endgame
    'Universe Shaper': { tier: 10, effects: { luck: 1500, rollSpeed: 110, special: 'cosmicAuthority', effect: 'All aura rarities are treated as 10% more common' }, hand: 'right', recipe: { 'World Forger\'s Gauntlet': 1, 'Cosmos': 50, 'Galaxy': 30, 'Abomination': 1 }, description: '+1500% Luck, +110% Roll Speed. Cosmic Overlord Set (1/3). Special: All auras 10% more common!' },
    'Reality Crown': { tier: 10, effects: { special: 'omnipotence', effect: 'Gain +1% luck permanently for every 1000 rolls (no cap)' }, hand: 'accessory', recipe: { 'Orion': 1, 'Mastermind': 1, 'Abomination': 2, 'Cosmos': 100 }, description: 'Cosmic Overlord Set (2/3). Special: PERMANENT +1% luck per 1000 rolls (UNCAPPED)!' },
    'Infinity Gauntlet': { tier: 10, effects: { luck: 2000, rollSpeed: 150, special: 'snapOfFate', effect: 'Every 500th roll is guaranteed Cosmic tier' }, hand: 'left', recipe: { 'World Forger\'s Gauntlet': 1, 'Orion': 2, 'Abomination': 3, 'Mastermind': 2 }, description: '+2000% Luck, +150% Roll Speed. Cosmic Overlord Set (3/3). Special: 500th roll = GUARANTEED COSMIC!' }
};

const ITEM_RECIPES = {
    'Gear Basing': {
        recipe: {
            'Common': 1,
            'Uncommon': 1,
            'Good': 1,
            'Rare': 1
        },
        description: 'A core component for crafting powerful gears.'
    },
    'Strange Controller': {
        recipe: {
            'Wind': 1,           // WINDY biome
            'Glacier': 1,        // SNOWY biome
            'Blizzard': 1,       // BLIZZARD biome
            'Sailor': 1,         // RAINY biome
            'Lightning': 1,      // MONSOON biome
            'Sand Bucket': 1,    // SANDSTORM biome
            'Natural': 1,        // JUNGLE biome
            'Flora': 1,          // VERDANT biome
            'Ruby': 1,           // CRIMSON biome
            'Diaboli': 1,        // HELL biome
            'Starlight': 1,      // STARFALL biome
            'Comet': 1,          // METEOR_SHOWER biome
            'Hazard': 1,         // CORRUPTION biome
            'Undefined': 1,      // NULL biome
            'Pumpkin': 1,        // PUMPKIN_MOON biome
            'Lost Soul': 1,      // GRAVEYARD biome
            'Bleeding': 1        // BLOOD_RAIN biome
        },
        description: 'Changes biome based on native rarity. 15 minute cooldown. Cannot trigger GLITCHED.',
        usable: true,
        cooldown: 900000 // 15 minutes in milliseconds
    },
    'Biome Randomizer': {
        recipe: {
            'Stormal': 2,        // WINDY biome (1/750)
            'Permafrost': 2,     // SNOWY biome (1/1,500)
            'Blizzard': 2,       // BLIZZARD biome (1/2,500)
            'Poseidon': 2,       // RAINY biome (1/1,200)
            'Hurricane': 2,      // MONSOON biome (1/2,000)
            'Gilded': 2,         // SANDSTORM biome (1/2,000)
            'Emerald': 2,        // JUNGLE biome (1/1,000)
            'Jade': 2,           // VERDANT biome (1/3,000)
            'Rage': 2,           // CRIMSON biome (1/500)
            'Undead': 2,         // HELL biome (1/2,500)
            'Star Rider': 2,     // STARFALL biome (1/2,000)
            'Astral': 2,         // METEOR_SHOWER biome (1/5,000)
            'Corrosive': 2,      // CORRUPTION biome (1/2,000)
            'Shiftlock': 2,      // NULL biome (1/3,500)
            'Pumpkin': 2,        // PUMPKIN_MOON biome (1/500)
            'Raven': 2,          // GRAVEYARD biome (1/1,500)
            'Crimson': 2         // BLOOD_RAIN biome (1/2,500)
        },
        description: 'Changes to a completely random biome. 30 minute cooldown.',
        usable: true,
        cooldown: 1800000 // 30 minutes in milliseconds
    },
    'Random Rune Chest': {
        recipe: {
            'Rare': 3,           // Rare tier aura (1/16)
            'Crystallized': 2,   // Rare tier (1/64)
            'Glacier': 1,        // Epic tier (1/256)
            'Rainbow Syrup': 2   // Crafting material
        },
        description: 'A mysterious chest that contains a random rune. Open it to discover what\'s inside!'
    }
};
