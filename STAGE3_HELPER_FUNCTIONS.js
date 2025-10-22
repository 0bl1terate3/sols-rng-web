// ============================================================================
// STAGE 3: HELPER FUNCTIONS FOR CHECKING COMPLEX ACHIEVEMENT CONDITIONS
// ============================================================================
// Add these functions before checkAchievements() function

// Helper: Check if player has completed hourly rolls requirement
function checkHourlyRolls(stats, hours) {
    if (!stats.hourlyRollTracker) return false;
    const now = Date.now();
    const hourAgo = now - (hours * 3600000);
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
    if (gameState.inventory.auras[aura.name] === 66) {
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
    } else if (type === 'voidCoins') {
        stats.voidCoinBalancePeak = Math.max(stats.voidCoinBalancePeak || 0, gameState.currency.voidCoins);
        stats.voidCoinsLifetimeTotal = (stats.voidCoinsLifetimeTotal || 0) + (isGain ? amount : 0);
        stats.voidCoinsEarnedTotal = (stats.voidCoinsEarnedTotal || 0) + (isGain ? amount : 0);
        stats.voidCoinsSpentTotal = (stats.voidCoinsSpentTotal || 0) + (isGain ? 0 : amount);
        
        if (stats.voidCoinsLifetimeTotal >= 100000) {
            stats.voidCoin100kDone = true;
        }
    } else if (type === 'darkPoints') {
        stats.darkPointsEarnedTotal = (stats.darkPointsEarnedTotal || 0) + (isGain ? amount : 0);
    } else if (type === 'halloweenMedals') {
        stats.halloweenMedalBalancePeak = Math.max(stats.halloweenMedalBalancePeak || 0, gameState.currency.halloweenMedals);
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
