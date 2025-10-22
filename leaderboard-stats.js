// =================================================================
// Comprehensive Leaderboard Statistics Tracking System
// =================================================================
// Tracks 60+ different leaderboard categories

class LeaderboardStats {
    constructor() {
        this.stats = this.initializeStats();
        this.loadStats();
        this.setupTracking();
    }

    initializeStats() {
        return {
            // ===== RECORDS TRACKING =====
            records: {
                highestRollCount: { value: 0, timestamp: null, context: '' },
                rarestAuraFound: { value: 0, name: '', timestamp: null },
                mostMoneyAtOnce: { value: 0, timestamp: null },
                mostVoidCoinsAtOnce: { value: 0, timestamp: null },
                longestStreak: { value: 0, timestamp: null },
                mostAurasInDay: { value: 0, timestamp: null },
                fastestTo1M: { value: null, timestamp: null },
                fastestTo10M: { value: null, timestamp: null },
                fastestTo100M: { value: null, timestamp: null },
                highestLuckMultiplier: { value: 0, timestamp: null },
                mostBreakthroughsInHour: { value: 0, timestamp: null }
            },
            
            // ===== CORE STATS =====
            totalRolls: 0,
            totalAurasCollected: 0,
            rarestAuraRarity: 0,
            rarestAuraName: '',
            totalMoneyEarned: 0,
            totalVoidCoinsEarned: 0,
            achievementPoints: 0,
            
            // ===== ROLLING & LUCK =====
            maxLuckMultiplier: 0,
            maxSpeedMultiplier: 0,
            totalBreakthroughs: 0,
            longestRollStreak: 0,
            currentRollStreak: 0,
            rollStreakStartTime: null,
            mostRollsIn24Hours: 0,
            rollsLast24Hours: [],
            autoRollsCompleted: 0,
            fastestTo1kRolls: null,
            fastestTo10kRolls: null,
            fastestTo100kRolls: null,
            
            // ===== AURA COLLECTION =====
            totalDuplicates: 0,
            uniqueAurasOwned: 0,
            auraCollectionPercentage: 0,
            totalRaritySum: 0,
            mostAurasInSession: 0,
            currentSessionAuras: 0,
            sessionStartTime: null,
            nativeAurasObtained: {},
            
            // ===== ECONOMY & WEALTH =====
            currentMoney: 0,
            currentVoidCoins: 0,
            mostExpensivePurchase: 0,
            mostExpensivePurchaseItem: '',
            totalItemsCrafted: 0,
            totalPotionsUsed: 0,
            totalMerchantSpending: 0,
            
            // ===== CRAFTING & POTIONS =====
            mostPowerfulPotionCrafted: '',
            mostPowerfulPotionRarity: 0,
            uniquePotionTypesCrafted: 0,
            potionTypesCrafted: [],
            longestPotionChain: 0,
            totalPotionDuration: 0,
            potionEfficiencySaved: 0,
            
            // ===== BIOME EXPLORATION =====
            uniqueBiomesExperienced: 0,
            biomesVisited: [],
            totalBiomeTime: 0,
            rarestBiomeWitnessed: '',
            rarestBiomeRarity: 0,
            biomeRollCounts: {},
            biomeVisitCounts: {},
            
            // ===== ACHIEVEMENTS =====
            totalAchievementsCompleted: 0,
            achievementCompletionPercentage: 0,
            fastestToAchievements: {},
            dailyQuestsCompleted: 0,
            comboAchievementsUnlocked: 0,
            
            // ===== GEAR & EQUIPMENT =====
            highestGearScore: 0,
            uniqueGearPiecesOwned: 0,
            totalGearCrafted: 0,
            firstMythicGearDate: null,
            
            // ===== TIME-BASED =====
            dailyTopRolls: 0,
            weeklyTopRolls: 0,
            monthlyTopRolls: 0,
            longestSessionTime: 0,
            currentSessionTime: 0,
            consecutiveDaysPlayed: 0,
            lastPlayDate: null,
            totalPlayTime: 0,
            
            // ===== SPECIALIZED =====
            luckiestRoll: 0,
            luckiestRollDetails: '',
            peakRollsPerMinute: 0,
            longestBreakthroughStreak: 0,
            currentBreakthroughStreak: 0,
            highestPityReached: 0,
            nightRolls: 0,
            dayRolls: 0,
            
            // ===== COMPETITIVE SEASONS =====
            seasonPoints: 0,
            seasonRank: 0,
            seasonStartDate: null,
            
            // ===== LIVE/ACTIVE STATS =====
            currentLuckMultiplier: 0,
            currentSpeedMultiplier: 0,
            currentActiveEffects: 0,
            isCurrentlyRolling: false,
            
            // ===== TIMESTAMPS =====
            firstRollDate: null,
            lastRollDate: null,
            statsLastUpdated: Date.now()
        };
    }

    loadStats() {
        try {
            const saved = localStorage.getItem('leaderboardStats');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.stats = { ...this.stats, ...parsed };
            }
        } catch (e) {
            console.error('Error loading leaderboard stats:', e);
        }
    }

    saveStats() {
        // Update calculated stats before saving
        this.updateCalculatedStats();
        
        try {
            this.stats.statsLastUpdated = Date.now();
            localStorage.setItem('leaderboardStats', JSON.stringify(this.stats));
        } catch (e) {
            console.error('Error saving leaderboard stats:', e);
        }
    }

    // Update stats that are calculated from gameState
    updateCalculatedStats() {
        if (typeof gameState === 'undefined') return;
        
        // Update unique auras, collection percentage, and duplicates
        if (gameState.auras && typeof AURAS !== 'undefined') {
            this.stats.uniqueAurasOwned = Object.keys(gameState.auras).length;
            this.stats.auraCollectionPercentage = (this.stats.uniqueAurasOwned / AURAS.length) * 100;
            
            // Calculate total duplicates from current inventory
            let totalDuplicates = 0;
            for (const auraName in gameState.auras) {
                const count = gameState.auras[auraName];
                if (count > 1) {
                    totalDuplicates += (count - 1); // Each extra copy is a duplicate
                }
            }
            this.stats.totalDuplicates = totalDuplicates;
        }
        
        // Update current currency values
        if (gameState.currency) {
            this.stats.currentMoney = gameState.currency.money || 0;
            this.stats.currentVoidCoins = gameState.currency.voidCoins || 0;
        }
        
        // Update achievement stats
        if (gameState.achievements) {
            // Achievements are stored in gameState.achievements.unlocked (not completed)
            this.stats.totalAchievementsCompleted = Object.keys(gameState.achievements.unlocked || {}).length;
            this.stats.achievementPoints = this.stats.totalAchievementsCompleted * 100;
            
            // Calculate completion percentage
            if (typeof ACHIEVEMENTS !== 'undefined') {
                const totalAchievements = Object.keys(ACHIEVEMENTS).length || 1;
                this.stats.achievementCompletionPercentage = (this.stats.totalAchievementsCompleted / totalAchievements) * 100;
            }
            
            // Daily quests and pity from achievement stats
            if (gameState.achievements.stats) {
                this.stats.dailyQuestsCompleted = gameState.achievements.stats.dailyQuestsCompleted || 0;
                
                // Pity tracking - highest rolls without a rare aura
                this.stats.highestPityReached = Math.max(
                    this.stats.highestPityReached || 0,
                    gameState.achievements.stats.maxRollsWithoutRare || 0,
                    gameState.achievements.stats.rollsSinceRare || 0
                );
                
                // Crafting stats
                const craftsMade = gameState.achievements.stats.craftsMade || 0;
                this.stats.totalItemsCrafted = Math.max(this.stats.totalItemsCrafted || 0, craftsMade);
                
                // Merchant spending
                const merchantSpending = gameState.achievements.stats.merchantSpendingTotal || 0;
                this.stats.totalMerchantSpending = Math.max(this.stats.totalMerchantSpending || 0, merchantSpending);
            }
        }
        
        // Update gear score - calculate from equipped gear
        if (gameState.equipped && typeof gearData !== 'undefined') {
            let totalGearScore = 0;
            
            // Check right and left equipped slots
            for (const slot in gameState.equipped) {
                const gearName = gameState.equipped[slot];
                if (gearName && gearData[gearName]) {
                    const gear = gearData[gearName];
                    // Estimate score based on tier (you can adjust this)
                    const tierScore = {
                        1: 100,
                        2: 250,
                        3: 500,
                        4: 1000,
                        5: 2500
                    };
                    totalGearScore += tierScore[gear.tier] || 0;
                }
            }
            
            this.stats.highestGearScore = Math.max(this.stats.highestGearScore || 0, totalGearScore);
        }
        
        // Update session time
        if (this.stats.sessionStartTime) {
            this.stats.currentSessionTime = Date.now() - this.stats.sessionStartTime;
            this.stats.longestSessionTime = Math.max(this.stats.longestSessionTime, this.stats.currentSessionTime);
        }
    }

    // Force refresh all stats from gameState (fixes N/A values)
    forceRefreshStats() {
        console.log('🔄 Force refreshing all stats from gameState...');
        
        if (typeof gameState === 'undefined') {
            console.warn('⚠️ gameState not available');
            return;
        }
        
        // Update all calculated stats
        this.updateCalculatedStats();
        
        // Update total playtime estimate
        if (this.stats.firstRollDate) {
            this.stats.totalPlayTime = Date.now() - this.stats.firstRollDate;
        }
        
        // Force save and upload
        this.saveStats();
        this.submitToLeaderboards();
        
        console.log('✅ Stats refreshed and uploaded to leaderboard');
        console.log('📊 Current stats:', {
            uniqueAuras: this.stats.uniqueAurasOwned,
            totalDuplicates: this.stats.totalDuplicates,
            collectionPercent: (this.stats.auraCollectionPercentage || 0).toFixed(2) + '%',
            totalMoney: this.stats.totalMoneyEarned,
            currentMoney: this.stats.currentMoney,
            voidCoins: this.stats.currentVoidCoins,
            achievements: this.stats.totalAchievementsCompleted,
            achievementPoints: this.stats.achievementPoints,
            achievementPercent: (this.stats.achievementCompletionPercentage || 0).toFixed(2) + '%',
            dailyQuests: this.stats.dailyQuestsCompleted,
            highestPity: this.stats.highestPityReached,
            gearScore: this.stats.highestGearScore,
            itemsCrafted: this.stats.totalItemsCrafted,
            merchantSpending: this.stats.totalMerchantSpending,
            biggestPurchase: this.stats.mostExpensivePurchase
        });
    }

    setupTracking() {
        // Track session start
        if (!this.stats.sessionStartTime) {
            this.stats.sessionStartTime = Date.now();
            this.stats.currentSessionAuras = 0;
        }
        
        // Track first roll date
        if (!this.stats.firstRollDate) {
            this.stats.firstRollDate = Date.now();
        }
        
        // Track consecutive days
        this.updateConsecutiveDays();
    }

    // ===================================================================
    // TRACKING FUNCTIONS
    // ===================================================================

    trackRoll(aura) {
        this.stats.totalRolls++;
        this.stats.lastRollDate = Date.now();
        
        // Track 24-hour rolls
        const now = Date.now();
        this.stats.rollsLast24Hours.push(now);
        this.stats.rollsLast24Hours = this.stats.rollsLast24Hours.filter(time => now - time < 86400000);
        this.stats.mostRollsIn24Hours = Math.max(this.stats.mostRollsIn24Hours, this.stats.rollsLast24Hours.length);
        
        // Track day/night
        if (typeof biomeState !== 'undefined' && biomeState.isDay) {
            this.stats.dayRolls++;
        } else {
            this.stats.nightRolls++;
        }
        
        // Track streak
        this.stats.currentRollStreak++;
        this.stats.longestRollStreak = Math.max(this.stats.longestRollStreak, this.stats.currentRollStreak);
        
        // Track speed milestones
        this.checkSpeedMilestones();
        
        // Check for roll milestones and send webhook
        this.checkRollMilestones();
        
        // Check for records (every 100 rolls to avoid spam)
        if (this.stats.totalRolls % 100 === 0) {
            this.checkCommonRecords();
        }
        
        this.saveStats();
    }

    trackAura(aura) {
        this.stats.totalAurasCollected++;
        this.stats.currentSessionAuras++;
        
        // Track rarest aura
        const auraRarity = aura.rarity || aura.baseRarity;
        if (auraRarity > this.stats.rarestAuraRarity) {
            this.stats.rarestAuraRarity = auraRarity;
            this.stats.rarestAuraName = aura.name;
            
            // Check rarest aura record
            this.checkAndUpdateRecord('rarestAuraFound', auraRarity, {
                name: aura.name
            });
        }
        
        // Track duplicates vs unique
        if (typeof gameState !== 'undefined' && gameState.auras) {
            const auraCount = gameState.auras[aura.name] || 0;
            if (auraCount > 1) {
                this.stats.totalDuplicates++;
            }
            
            this.stats.uniqueAurasOwned = Object.keys(gameState.auras).length;
            
            // Calculate collection percentage
            if (typeof AURAS !== 'undefined') {
                this.stats.auraCollectionPercentage = (this.stats.uniqueAurasOwned / AURAS.length) * 100;
            }
        }
        
        // Track session record
        this.stats.mostAurasInSession = Math.max(this.stats.mostAurasInSession, this.stats.currentSessionAuras);
        
        // Track total rarity sum
        this.stats.totalRaritySum += auraRarity;
        
        this.saveStats();
    }

    trackBreakthrough() {
        this.stats.totalBreakthroughs++;
        this.stats.totalBreakthroughsToday++;
        
        // Check for breakthrough milestone
        this.checkBreakthroughMilestone();
        
        this.saveStats();
    }

    trackMoney(newAmount, isGain = null) {
        const oldAmount = this.stats.currentMoney;
        
        // If not specified, determine if it's a gain
        if (isGain === null) {
            isGain = newAmount > oldAmount;
        }
        
        // Track total earned (only on gains)
        if (isGain && newAmount > oldAmount) {
            this.stats.totalMoneyEarned += (newAmount - oldAmount);
        }
        
        this.stats.currentMoney = newAmount;
        
        // Check money record
        this.checkAndUpdateRecord('mostMoneyAtOnce', newAmount);
        
        this.saveStats();
    }

    trackVoidCoins(newAmount, isGain = null) {
        const oldAmount = this.stats.currentVoidCoins;
        
        // If not specified, determine if it's a gain
        if (isGain === null) {
            isGain = newAmount > oldAmount;
        }
        
        // Track total earned (only on gains)
        if (isGain && newAmount > oldAmount) {
            this.stats.totalVoidCoinsEarned += (newAmount - oldAmount);
        }
        
        this.stats.currentVoidCoins = newAmount;
        
        // Check void coins record
        this.checkAndUpdateRecord('mostVoidCoinsAtOnce', newAmount);
        
        this.saveStats();
    }

    trackLuckMultiplier(multiplier) {
        this.stats.maxLuckMultiplier = Math.max(this.stats.maxLuckMultiplier, multiplier);
        
        // Check luck multiplier record
        if (multiplier > 1) {
            this.checkAndUpdateRecord('highestLuckMultiplier', multiplier);
        }
        
        this.saveStats();
    }

    resetBreakthroughStreak() {
        this.stats.currentBreakthroughStreak = 0;
        this.saveStats();
    }

    trackLuckSpeed(luck, speed) {
        this.stats.maxLuckMultiplier = Math.max(this.stats.maxLuckMultiplier, luck);
        this.stats.maxSpeedMultiplier = Math.max(this.stats.maxSpeedMultiplier, speed);
        this.stats.currentLuckMultiplier = luck;
        this.stats.currentSpeedMultiplier = speed;
        this.saveStats();
    }

    trackBiome(biomeName) {
        if (!this.stats.biomesVisited.includes(biomeName)) {
            this.stats.biomesVisited.push(biomeName);
            this.stats.uniqueBiomesExperienced = this.stats.biomesVisited.length;
        }
        
        // Track visit count
        this.stats.biomeVisitCounts[biomeName] = (this.stats.biomeVisitCounts[biomeName] || 0) + 1;
        
        // Track rarest biome
        if (typeof BIOMES !== 'undefined') {
            const biome = BIOMES.find(b => b.name === biomeName);
            if (biome && biome.rarity > this.stats.rarestBiomeRarity) {
                this.stats.rarestBiomeRarity = biome.rarity;
                this.stats.rarestBiomeWitnessed = biomeName;
            }
        }
        
        this.saveStats();
    }

    trackBiomeRoll(biomeName) {
        this.stats.biomeRollCounts[biomeName] = (this.stats.biomeRollCounts[biomeName] || 0) + 1;
        this.saveStats();
    }

    trackPotionUse(potionName) {
        this.stats.totalPotionsUsed++;
        
        if (!this.stats.potionTypesCrafted.includes(potionName)) {
            this.stats.potionTypesCrafted.push(potionName);
            this.stats.uniquePotionTypesCrafted = this.stats.potionTypesCrafted.length;
        }
        
        // Track active effects count
        if (typeof gameState !== 'undefined' && gameState.activeEffects) {
            const activeCount = gameState.activeEffects.length;
            this.stats.longestPotionChain = Math.max(this.stats.longestPotionChain, activeCount);
            this.stats.currentActiveEffects = activeCount;
        }
        
        this.saveStats();
    }

    trackPotionCraft(potionName, potionRarity = 0) {
        this.stats.totalItemsCrafted++;
        
        if (potionRarity > this.stats.mostPowerfulPotionRarity) {
            this.stats.mostPowerfulPotionRarity = potionRarity;
            this.stats.mostPowerfulPotionCrafted = potionName;
        }
        
        this.saveStats();
    }

    trackMoney(amount, spent = false) {
        if (!spent) {
            this.stats.totalMoneyEarned += amount;
        } else {
            this.stats.totalMerchantSpending += amount;
        }
        
        if (typeof gameState !== 'undefined') {
            this.stats.currentMoney = gameState.money || 0;
        }
        
        this.saveStats();
    }

    trackVoidCoins(amount) {
        this.stats.totalVoidCoinsEarned += amount;
        
        if (typeof gameState !== 'undefined' && gameState.inventory) {
            this.stats.currentVoidCoins = gameState.inventory['Void Coin'] || 0;
        }
        
        this.saveStats();
    }

    trackPurchase(itemName, cost) {
        if (cost > this.stats.mostExpensivePurchase) {
            this.stats.mostExpensivePurchase = cost;
            this.stats.mostExpensivePurchaseItem = itemName;
        }
        this.saveStats();
    }

    trackAchievement(achievementName, achievementDescription) {
        if (typeof gameState !== 'undefined' && gameState.achievements) {
            this.stats.totalAchievementsCompleted = Object.keys(gameState.achievements.completed || {}).length;
            this.stats.achievementPoints = this.stats.totalAchievementsCompleted * 100; // Simple points system
        }
        
        // Send webhook for achievement unlock
        if (achievementName) {
            this.sendStatWebhook('achievement', {
                name: achievementName,
                description: achievementDescription || ''
            });
        }
        
        // Check for achievement milestones
        this.checkAchievementMilestone();
        
        this.saveStats();
    }

    trackGear(gearScore) {
        this.stats.highestGearScore = Math.max(this.stats.highestGearScore, gearScore);
        
        if (typeof gameState !== 'undefined' && gameState.equipment) {
            const uniqueGear = new Set();
            Object.values(gameState.equipment).forEach(item => {
                if (item) uniqueGear.add(item);
            });
            this.stats.uniqueGearPiecesOwned = uniqueGear.size;
        }
        
        this.saveStats();
    }

    trackAutoRoll() {
        this.stats.autoRollsCompleted++;
        this.saveStats();
    }

    checkSpeedMilestones() {
        const rolls = this.stats.totalRolls;
        const now = Date.now();
        const startTime = this.stats.firstRollDate;
        
        if (!startTime) return;
        
        const timeElapsed = (now - startTime) / 1000; // seconds
        
        if (rolls >= 1000 && !this.stats.fastestTo1kRolls) {
            this.stats.fastestTo1kRolls = timeElapsed;
        }
        if (rolls >= 10000 && !this.stats.fastestTo10kRolls) {
            this.stats.fastestTo10kRolls = timeElapsed;
        }
        if (rolls >= 100000 && !this.stats.fastestTo100kRolls) {
            this.stats.fastestTo100kRolls = timeElapsed;
        }
    }

    updateConsecutiveDays() {
        const today = new Date().toDateString();
        const lastPlay = this.stats.lastPlayDate ? new Date(this.stats.lastPlayDate).toDateString() : null;
        
        if (lastPlay !== today) {
            if (lastPlay) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toDateString();
                
                if (lastPlay === yesterdayStr) {
                    this.stats.consecutiveDaysPlayed++;
                } else {
                    this.stats.consecutiveDaysPlayed = 1;
                }
            } else {
                this.stats.consecutiveDaysPlayed = 1;
            }
            
            this.stats.lastPlayDate = Date.now();
            this.saveStats();
        }
    }

    updatePlayTime(deltaSeconds) {
        this.stats.totalPlayTime += deltaSeconds;
        this.stats.currentSessionTime += deltaSeconds;
        this.stats.longestSessionTime = Math.max(this.stats.longestSessionTime, this.stats.currentSessionTime);
        this.saveStats();
    }

    resetSession() {
        this.stats.currentSessionAuras = 0;
        this.stats.currentSessionTime = 0;
        this.stats.sessionStartTime = Date.now();
        this.saveStats();
    }

    // ===================================================================
    // MILESTONE CHECKING & WEBHOOK NOTIFICATIONS
    // ===================================================================

    checkRollMilestones() {
        const rolls = this.stats.totalRolls;
        const milestones = [1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000];
        
        if (milestones.includes(rolls)) {
            this.sendStatWebhook('milestone', {
                type: 'Total Rolls',
                value: rolls.toLocaleString(),
                emoji: '🎲'
            });
        }
    }

    checkBreakthroughMilestone() {
        const breakthroughs = this.stats.totalBreakthroughs;
        const milestones = [100, 500, 1000, 5000, 10000, 50000, 100000];
        
        if (milestones.includes(breakthroughs)) {
            this.sendStatWebhook('milestone', {
                type: 'Total Breakthroughs',
                value: breakthroughs.toLocaleString(),
                emoji: '💥'
            });
        }
    }

    checkAchievementMilestone() {
        const achievements = this.stats.totalAchievementsCompleted;
        const milestones = [10, 25, 50, 100, 150, 200, 250];
        
        if (milestones.includes(achievements)) {
            this.sendStatWebhook('milestone', {
                type: 'Achievements Completed',
                value: achievements.toLocaleString(),
                emoji: '🏆'
            });
        }
    }

    async sendStatWebhook(eventType, data) {
        // Get webhook from global Firestore configuration
        if (typeof gameState === 'undefined') {
            return;
        }

        // Determine which category to fetch based on event type
        let category;
        if (eventType === 'milestone') {
            category = 'milestones';
        } else if (eventType === 'record') {
            category = 'records';
        } else if (eventType === 'achievement') {
            category = 'achievements';
        }

        if (!category) return;

        // Fetch global webhook from Firestore
        const webhook = await window.getWebhookForCategory(category);
        if (!webhook) return;

        // Get player name (try localStorage first, then leaderboard)
        let playerName = localStorage.getItem('playerLeaderboardName');
        if (!playerName && window.globalLeaderboard) {
            playerName = window.globalLeaderboard.playerName;
        }
        if (!playerName && window.globalLeaderboard && typeof window.globalLeaderboard.getPlayerName === 'function') {
            playerName = window.globalLeaderboard.getPlayerName();
        }
        if (!playerName) {
            playerName = 'Player';
        }

        let embed;

        if (eventType === 'milestone') {
            embed = {
                title: `${data.emoji} Milestone Reached!`,
                description: `**${playerName}** has reached **${data.value}** ${data.type}!`,
                color: 0x00d9ff,
                timestamp: new Date().toISOString(),
                footer: { text: 'Sol\'s RNG Stats Tracker' }
            };
        } else if (eventType === 'record') {
            embed = {
                title: `📈 New Record!`,
                description: `**${playerName}** set a new record: **${data.value}** ${data.type}!`,
                color: 0xffd700,
                timestamp: new Date().toISOString(),
                footer: { text: 'Sol\'s RNG Stats Tracker' }
            };
        } else if (eventType === 'achievement') {
            embed = {
                title: `🏆 Achievement Unlocked!`,
                description: `**${playerName}** unlocked: **${data.name}**\n${data.description}`,
                color: 0x10b981,
                timestamp: new Date().toISOString(),
                footer: { text: 'Sol\'s RNG Stats Tracker' }
            };
        }

        if (!embed) return;

        try {
            await fetch(webhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });
        } catch (error) {
            console.error('Stats webhook error:', error);
        }
    }

    // ===================================================================
    // LEADERBOARD SUBMISSION
    // ===================================================================

    async submitToLeaderboards() {
        // ✅ LEADERBOARD ENABLED - Using local backend
        
        if (!window.globalLeaderboard || !window.globalLeaderboard.firebaseInitialized) {
            console.log('Leaderboard not initialized, skipping submission');
            return;
        }

        try {
            const playerId = window.globalLeaderboard.playerId;
            const playerName = window.globalLeaderboard.getPlayerName();
            const db = window.globalLeaderboard.db;

            // Submit to comprehensive stats collection
            await db.collection('playerStats').doc(playerId).set({
                playerName: playerName,
                playerId: playerId,
                ...this.stats,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            console.log('✅ Stats submitted to leaderboards');
        } catch (error) {
            console.error('❌ Error submitting stats:', error);
        }
    }

    // ===================================================================
    // GET SPECIFIC STATS
    // ===================================================================

    getStats() {
        return { ...this.stats };
    }

    getStat(statName) {
        return this.stats[statName];
    }

    // ===================================================================
    // FORMAT HELPERS
    // ===================================================================

    formatTime(seconds) {
        if (!seconds) return 'N/A';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
        if (minutes > 0) return `${minutes}m ${secs}s`;
        return `${secs}s`;
    }

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
        return num.toString();
    }

    // ===================================================================
    // RECORDS TRACKING & NOTIFICATIONS
    // ===================================================================

    // Check and update record with webhook notification
    async checkAndUpdateRecord(recordName, newValue, context = {}) {
        const record = this.stats.records[recordName];
        
        if (!record) {
            console.warn(`Unknown record type: ${recordName}`);
            return false;
        }

        // Determine if this is a new record
        let isNewRecord = false;
        let oldValue = record.value;

        if (recordName.includes('fastest') || recordName.includes('Fastest')) {
            // For time-based records, lower is better (null = no record yet)
            if (record.value === null || newValue < record.value) {
                isNewRecord = true;
            }
        } else {
            // For most records, higher is better
            if (newValue > record.value) {
                isNewRecord = true;
            }
        }

        if (isNewRecord) {
            // Update the record
            record.value = newValue;
            record.timestamp = Date.now();
            
            // Add context (like aura name, etc.)
            if (context.name) record.name = context.name;
            if (context.context) record.context = context.context;

            // Save stats
            this.saveStats();

            // Send webhook notification
            await this.sendRecordWebhook(recordName, newValue, oldValue, context);

            console.log(`🏆 NEW RECORD! ${recordName}: ${newValue}`);
            return true;
        }

        return false;
    }

    // Send webhook for record breaking
    async sendRecordWebhook(recordName, newValue, oldValue, context = {}) {
        try {
            // Get webhook from global Firestore configuration
            if (typeof window.getWebhookForCategory !== 'function') {
                return;
            }

            const webhook = await window.getWebhookForCategory('records');
            if (!webhook) return;

            // Get player name
            let playerName = localStorage.getItem('playerLeaderboardName');
            if (!playerName && window.globalLeaderboard) {
                playerName = window.globalLeaderboard.playerName;
            }
            if (!playerName) {
                playerName = 'Player';
            }

            // Format the record name for display
            const recordDisplayName = this.formatRecordName(recordName);
            const formattedValue = this.formatRecordValue(recordName, newValue);
            const improvement = oldValue > 0 ? ` (previous: ${this.formatRecordValue(recordName, oldValue)})` : '';

            // Build description
            let description = `**${playerName}** set a new record:\n**${recordDisplayName}**: ${formattedValue}${improvement}`;
            
            if (context.name) {
                description += `\n\n📊 **Context**: ${context.name}`;
            }

            const embed = {
                title: `📈 New Personal Record!`,
                description: description,
                color: 0xffd700, // Gold
                timestamp: new Date().toISOString(),
                footer: { text: 'Sol\'s RNG Records Tracker' }
            };

            await fetch(webhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });

            console.log('📈 Record webhook sent:', recordName);
        } catch (error) {
            console.error('Error sending record webhook:', error);
        }
    }

    // Format record name for display
    formatRecordName(recordName) {
        const names = {
            highestRollCount: 'Highest Roll Count',
            rarestAuraFound: 'Rarest Aura Found',
            mostMoneyAtOnce: 'Most Money at Once',
            mostVoidCoinsAtOnce: 'Most Void Coins at Once',
            longestStreak: 'Longest Roll Streak',
            mostAurasInDay: 'Most Auras in One Day',
            fastestTo1M: 'Fastest to 1M Rolls',
            fastestTo10M: 'Fastest to 10M Rolls',
            fastestTo100M: 'Fastest to 100M Rolls',
            highestLuckMultiplier: 'Highest Luck Multiplier',
            mostBreakthroughsInHour: 'Most Breakthroughs in 1 Hour'
        };
        
        return names[recordName] || recordName;
    }

    // Format record value for display
    formatRecordValue(recordName, value) {
        if (recordName.includes('fastest') || recordName.includes('Fastest')) {
            return this.formatTime(value);
        }
        
        if (recordName === 'rarestAuraFound') {
            return `1 in ${value.toLocaleString()}`;
        }
        
        if (recordName.includes('Money') || recordName.includes('Coins')) {
            return `$${value.toLocaleString()}`;
        }
        
        if (recordName.includes('Multiplier')) {
            return `${value.toFixed(2)}x`;
        }
        
        return value.toLocaleString();
    }

    // Auto-check records on stat updates
    async checkCommonRecords() {
        // Check roll count record
        if (this.stats.totalRolls > 0) {
            await this.checkAndUpdateRecord('highestRollCount', this.stats.totalRolls);
        }

        // Check rarest aura record
        if (this.stats.rarestAuraRarity > 0) {
            await this.checkAndUpdateRecord('rarestAuraFound', this.stats.rarestAuraRarity, {
                name: this.stats.rarestAuraName
            });
        }

        // Check money records
        if (typeof gameState !== 'undefined') {
            if (gameState.money > 0) {
                await this.checkAndUpdateRecord('mostMoneyAtOnce', gameState.money);
            }
            
            if (gameState.voidCoins > 0) {
                await this.checkAndUpdateRecord('mostVoidCoinsAtOnce', gameState.voidCoins);
            }

            // Check luck multiplier
            const luckMult = gameState.luckMultiplier || 1;
            if (luckMult > 1) {
                await this.checkAndUpdateRecord('highestLuckMultiplier', luckMult);
            }
        }

        // Check streak record
        if (this.stats.longestRollStreak > 0) {
            await this.checkAndUpdateRecord('longestStreak', this.stats.longestRollStreak);
        }
    }
}

// Initialize global stats tracker
window.leaderboardStats = new LeaderboardStats();

// Auto-refresh stats 5 seconds after page load (to populate N/A values)
setTimeout(() => {
    if (window.leaderboardStats && typeof gameState !== 'undefined') {
        console.log('🔄 Auto-refreshing stats on page load...');
        window.leaderboardStats.forceRefreshStats();
    }
}, 5000);

// Auto-save every 30 seconds
setInterval(() => {
    if (window.leaderboardStats) {
        window.leaderboardStats.saveStats();
    }
}, 30000);

// Submit to leaderboards every 5 minutes (if Firebase is available)
setInterval(() => {
    if (window.leaderboardStats && window.globalLeaderboard?.firebaseInitialized) {
        window.leaderboardStats.submitToLeaderboards();
    }
}, 300000);

// Make forceRefreshStats globally accessible for manual testing
window.refreshLeaderboardStats = () => {
    if (window.leaderboardStats) {
        window.leaderboardStats.forceRefreshStats();
    } else {
        console.error('❌ Leaderboard stats not initialized');
    }
};

console.log('📊 Comprehensive leaderboard stats tracking initialized');
console.log('💡 Tip: Run refreshLeaderboardStats() to manually update stats');
