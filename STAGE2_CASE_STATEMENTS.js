// ============================================================================
// STAGE 2: ALL CASE STATEMENTS FOR 221 MISSING ACHIEVEMENT TYPES
// ============================================================================
// Add these case statements to the switch in checkAchievements()
// (before the closing of the switch statement)

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
    const biomeName = achievement.requirement;
    unlocked = (stats.biomeVisitCounts[biomeName] || 0) >= achievement.count;
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
