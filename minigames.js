
// =================================================================
// MINI GAMES SYSTEM - Main Logic
// =================================================================
// Quick skill-based games for bonus rewards
// Styles in minigames-styles.css

// Initialize minigames in gameState
if (!window.gameState.minigames) {
    window.gameState.minigames = {
        unlocked: false,
        plays: 0,
        wins: 0,
        highScores: {},
        dailyPlays: 0,
        lastPlayDate: new Date().toDateString(),
        lastSpinTime: 0,
        rewards: {}
    };
} else if (!window.gameState.minigames.hasOwnProperty('lastSpinTime')) {
    // Add lastSpinTime to existing saves
    window.gameState.minigames.lastSpinTime = 0;
}

// Unlock at 10,000 rolls
function checkMinigameUnlock() {
    if (!window.gameState.minigames.unlocked && window.gameState.totalRolls >= 10000) {
        window.gameState.minigames.unlocked = true;
        showNotification('🎮 Mini-games unlocked!', 'legendary');
        saveGameState();
    }
}

// Daily play reset
function checkDailyReset() {
    const today = new Date().toDateString();
    if (window.gameState.minigames.lastPlayDate !== today) {
        window.gameState.minigames.dailyPlays = 0;
        window.gameState.minigames.lastPlayDate = today;
        saveGameState();
    }
}

// TIMING GAME
let timingGame = { active: false, startTime: 0, targetTime: 0, tolerance: 100, attempts: 0 };

window.startTimingGame = function() {
    if (!window.gameState.minigames.unlocked) {
        showNotification('🔒 Unlock at 10,000 rolls!', 'error');
        return;
    }
    checkDailyReset();

    const modal = document.getElementById('minigameModal');
    const content = document.getElementById('minigameContent');

    timingGame = { active: true, startTime: Date.now(), targetTime: 2000 + Math.random() * 3000, tolerance: 100, attempts: 0 };

    content.innerHTML = `
        <div class="minigame-timing">
            <h2>⏱️ Perfect Timing</h2>
            <div class="minigame-instructions">Click STOP when the bar is in the green zone!</div>
            <div class="timing-bar-container">
                <div class="timing-bar" id="timingBar"></div>
                <div class="timing-target" id="timingTarget"></div>
            </div>
            <div class="timing-timer" id="timingTimer">0.00s</div>
            <button onclick="stopTimingGame()" class="minigame-action-btn" id="stopBtn">STOP!</button>
            <button onclick="closeMinigame()" class="minigame-close-btn">Cancel</button>
        </div>
    `;

    modal.style.display = 'flex';

    const bar = document.getElementById('timingBar');
    const timer = document.getElementById('timingTimer');
    const target = document.getElementById('timingTarget');
    const targetPos = 60 + Math.random() * 30;
    target.style.left = `${targetPos}%`;

    const animateBar = () => {
        if (!timingGame.active) return;
        const elapsed = Date.now() - timingGame.startTime;
        const progress = Math.min((elapsed / 5000) * 100, 100);
        bar.style.width = `${progress}%`;
        timer.textContent = `${(elapsed / 1000).toFixed(2)}s`;
        if (progress < 100) {
            requestAnimationFrame(animateBar);
        } else {
            endTimingGame(false, 'Too slow!');
        }
    };
    requestAnimationFrame(animateBar);
};

window.stopTimingGame = function() {
    if (!timingGame.active) return;
    const elapsed = Date.now() - timingGame.startTime;
    const progress = (elapsed / 5000) * 100;
    const target = document.getElementById('timingTarget');
    const targetPos = parseFloat(target.style.left);
    const difference = Math.abs(progress - targetPos);
    const success = difference <= 3;
    endTimingGame(success, success ? 'Perfect!' : `Off by ${difference.toFixed(1)}%`);
};

function endTimingGame(success, message) {
    timingGame.active = false;
    const content = document.getElementById('minigameContent');
    let rewards = {};
    if (success) {
        window.gameState.minigames.wins++;
        rewards = { money: 500, voidCoins: 10, halloweenMedals: 2 };
        awardRewards(rewards);
    }
    window.gameState.minigames.plays++;
    window.gameState.minigames.dailyPlays++;
    content.innerHTML = `
        <div class="minigame-result ${success ? 'success' : 'failure'}">
            <div class="minigame-result-icon">${success ? '✓' : '✗'}</div>
            <h2>${message}</h2>
            ${success ? `<div class="minigame-rewards"><h3>Rewards:</h3><div class="reward-list">
                <div>💰 ${rewards.money} Money</div><div>🌀 ${rewards.voidCoins} Void Coins</div>
                <div>🎃 ${rewards.halloweenMedals} Halloween Medals</div></div></div>` :
                `<div class="minigame-fail-msg">Try again!</div>`}
            <button onclick="closeMinigame()" class="minigame-action-btn">Close</button>
        </div>
    `;
    saveGameState();
}

// MEMORY GAME
let memoryGame = { active: false, cards: [], flipped: [], matched: 0, attempts: 0, startTime: 0 };

window.startMemoryGame = function() {
    if (!window.gameState.minigames.unlocked) {
        showNotification('🔒 Unlock at 10,000 rolls!', 'error');
        return;
    }
    checkDailyReset();
    const modal = document.getElementById('minigameModal');
    const content = document.getElementById('minigameContent');
    const auraIcons = ['✨', '🌟', '💫', '⭐', '🌠', '💎', '🔮', '👑'];
    const pairs = [...auraIcons, ...auraIcons].sort(() => Math.random() - 0.5);
    memoryGame = { active: true, cards: pairs, flipped: [], matched: 0, attempts: 0, startTime: Date.now() };
    content.innerHTML = `
        <div class="minigame-memory">
            <h2>🧠 Memory Match</h2>
            <div class="minigame-instructions">Match all pairs! Fewer attempts = better rewards.</div>
            <div class="memory-stats"><span>Attempts: <span id="memoryAttempts">0</span></span>
            <span>Matched: <span id="memoryMatched">0/8</span></span></div>
            <div class="memory-grid" id="memoryGrid"></div>
            <button onclick="closeMinigame()" class="minigame-close-btn">Cancel</button>
        </div>
    `;
    modal.style.display = 'flex';
    renderMemoryGrid();
};

function renderMemoryGrid() {
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    memoryGame.cards.forEach((icon, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.innerHTML = `<div class="memory-card-inner"><div class="memory-card-front">?</div><div class="memory-card-back">${icon}</div></div>`;
        card.onclick = () => flipCard(index);
        grid.appendChild(card);
    });
}

function flipCard(index) {
    if (!memoryGame.active || memoryGame.flipped.includes(index) || memoryGame.flipped.length >= 2) return;
    const card = document.querySelector(`[data-index="${index}"]`);
    card.classList.add('flipped');
    memoryGame.flipped.push(index);
    if (memoryGame.flipped.length === 2) {
        memoryGame.attempts++;
        document.getElementById('memoryAttempts').textContent = memoryGame.attempts;
        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [index1, index2] = memoryGame.flipped;
    const card1 = memoryGame.cards[index1];
    const card2 = memoryGame.cards[index2];
    if (card1 === card2) {
        memoryGame.matched++;
        document.getElementById('memoryMatched').textContent = `${memoryGame.matched}/8`;
        const cards = document.querySelectorAll('.memory-card.flipped');
        cards.forEach(card => card.classList.add('matched'));
        memoryGame.flipped = [];
        if (memoryGame.matched === 8) endMemoryGame();
    } else {
        const cards = document.querySelectorAll('.memory-card.flipped:not(.matched)');
        cards.forEach(card => card.classList.remove('flipped'));
        memoryGame.flipped = [];
    }
}

function endMemoryGame() {
    memoryGame.active = false;
    const timeElapsed = Math.floor((Date.now() - memoryGame.startTime) / 1000);
    let medalBonus = memoryGame.attempts <= 10 ? 10 : (memoryGame.attempts <= 15 ? 7 : 5);
    const rewards = { money: 300, voidCoins: 5, halloweenMedals: medalBonus, potions: { 'Lucky Potion': 5, 'Speed Potion': 5 } };
    awardRewards(rewards);
    window.gameState.minigames.wins++;
    window.gameState.minigames.plays++;
    window.gameState.minigames.dailyPlays++;
    const content = document.getElementById('minigameContent');
    content.innerHTML = `
        <div class="minigame-result success">
            <div class="minigame-result-icon">🎉</div><h2>All Matched!</h2>
            <div class="minigame-stats-final"><div>Attempts: ${memoryGame.attempts}</div><div>Time: ${timeElapsed}s</div>
            ${memoryGame.attempts <= 10 ? '<div class="bonus-text">✨ Perfect Score Bonus!</div>' : ''}</div>
            <div class="minigame-rewards"><h3>Rewards:</h3><div class="reward-list">
            <div>💰 ${rewards.money} Money</div><div>🌀 ${rewards.voidCoins} Void Coins</div>
            <div>🎃 ${rewards.halloweenMedals} Halloween Medals</div>
            <div>⚗️ ${rewards.potions['Lucky Potion']} Lucky Potions</div>
            <div>⚗️ ${rewards.potions['Speed Potion']} Speed Potions</div></div></div>
            <button onclick="closeMinigame()" class="minigame-action-btn">Close</button>
        </div>
    `;
    saveGameState();
}

// SPIN WHEEL
let spinWheel = {
    active: false,
    spinning: false,
    get lastSpin() {
        return window.gameState?.minigames?.lastSpinTime || 0;
    },
    set lastSpin(value) {
        if (window.gameState && window.gameState.minigames) {
            window.gameState.minigames.lastSpinTime = value;
            saveGameState();
        }
    },
    cooldown: 3600000 // 1 hour
};

window.startSpinWheel = function() {
    if (!window.gameState.minigames.unlocked) {
        showNotification('🔒 Unlock at 10,000 rolls!', 'error');
        return;
    }
    const now = Date.now();
    if (now - spinWheel.lastSpin < spinWheel.cooldown) {
        const timeLeft = Math.ceil((spinWheel.cooldown - (now - spinWheel.lastSpin)) / 60000);
        showNotification(`⏰ Spin available in ${timeLeft} minutes`, 'error');
        return;
    }
    const modal = document.getElementById('minigameModal');
    const content = document.getElementById('minigameContent');
    spinWheel.active = true;
    const prizes = [
        { label: '💰 500', value: { money: 500 }, color: '#10b981' },
        { label: '🎃 5', value: { halloweenMedals: 5 }, color: '#f59e0b' },
        { label: '🌀 20', value: { voidCoins: 20 }, color: '#3b82f6' },
        { label: '⚗️ Potion', value: { potions: { 'Fortune Potion II': 1 } }, color: '#a855f7' },
        { label: '💰 1000', value: { money: 1000 }, color: '#10b981' },
        { label: '🎃 10', value: { halloweenMedals: 10 }, color: '#f59e0b' },
        { label: '🌀 50', value: { voidCoins: 50 }, color: '#3b82f6' },
        { label: '✨ JACKPOT', value: { money: 5000, voidCoins: 100, halloweenMedals: 25 }, color: '#ef4444' }
    ];
    content.innerHTML = `
        <div class="minigame-wheel">
            <h2>🎡 Lucky Spin</h2><div class="minigame-instructions">Spin once per hour for random rewards!</div>
            <div class="wheel-container"><div class="wheel-pointer">▼</div>
            <canvas id="wheelCanvas" width="400" height="400"></canvas></div>
            <button onclick="spinTheWheel()" class="minigame-action-btn" id="spinBtn">SPIN!</button>
            <button onclick="closeMinigame()" class="minigame-close-btn">Close</button>
        </div>
    `;
    modal.style.display = 'flex';
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    drawWheel(ctx, prizes, 0);
    spinWheel.prizes = prizes;
};

function drawWheel(ctx, prizes, rotation) {
    const centerX = 200, centerY = 200, radius = 180;
    const sliceAngle = (Math.PI * 2) / prizes.length;
    ctx.clearRect(0, 0, 400, 400);
    prizes.forEach((prize, index) => {
        const startAngle = rotation + index * sliceAngle;
        const endAngle = startAngle + sliceAngle;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = prize.color;
        ctx.fill();
        ctx.strokeStyle = '#1a1f2e';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Inter';
        ctx.fillText(prize.label, radius * 0.65, 5);
        ctx.restore();
    });
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1f2e';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.stroke();
}

window.spinTheWheel = function() {
    if (spinWheel.spinning) return;
    spinWheel.spinning = true;
    document.getElementById('spinBtn').disabled = true;
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const targetPrizeIndex = Math.floor(Math.random() * spinWheel.prizes.length);
    const sliceAngle = (Math.PI * 2) / spinWheel.prizes.length;

    const baseSpins = Math.PI * 2 * 5;
    const pointerAngle = (Math.PI * 3) / 2;
    const targetSliceCenter = targetPrizeIndex * sliceAngle + (sliceAngle / 2);
    const targetRotation = baseSpins + pointerAngle - targetSliceCenter;

    let currentRotation = 0;
    const duration = 4000, startTime = Date.now();
    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentRotation = targetRotation * easeOut;
        drawWheel(ctx, spinWheel.prizes, currentRotation);
        if (progress < 1) requestAnimationFrame(animate);
        else endSpin(targetPrizeIndex);
    };
    animate();
};

function endSpin(prizeIndex) {
    const prize = spinWheel.prizes[prizeIndex];
    awardRewards(prize.value);
    spinWheel.lastSpin = Date.now();
    spinWheel.spinning = false;
    window.gameState.minigames.plays++;
    window.gameState.minigames.wins++;
    const content = document.getElementById('minigameContent');
    content.innerHTML = `
        <div class="minigame-result success">
            <div class="minigame-result-icon">🎉</div><h2>You Won!</h2>
            <div class="prize-display">${prize.label}</div>
            <div class="minigame-rewards"><h3>Rewards:</h3><div class="reward-list">
            ${Object.entries(prize.value).map(([key, val]) => {
                if (key === 'money') return `<div>💰 ${val} Money</div>`;
                if (key === 'voidCoins') return `<div>🌀 ${val} Void Coins</div>`;
                if (key === 'halloweenMedals') return `<div>🎃 ${val} Halloween Medals</div>`;
                if (key === 'potions') return Object.entries(val).map(([p, a]) => `<div>⚗️ ${a}x ${p}</div>`).join('');
                return '';
            }).join('')}</div></div>
            <button onclick="closeMinigame()" class="minigame-action-btn">Close</button>
        </div>
    `;
    saveGameState();
}

// REACTION GAME
let reactionGame = { active: false, startTime: 0, timeoutId: null };

window.startReactionGame = function() {
    if (!window.gameState.minigames.unlocked) {
        showNotification('🔒 Unlock at 10,000 rolls!', 'error');
        return;
    }
    checkDailyReset();
    const modal = document.getElementById('minigameModal');
    const content = document.getElementById('minigameContent');
    reactionGame = { active: true, startTime: 0, timeoutId: null };
    content.innerHTML = `
        <div class="minigame-reaction" id="reactionScreen">
            <h2>⚡ Reaction Test</h2>
            <div class="minigame-instructions">Click the screen as soon as it turns green!</div>
            <div id="reactionResult"></div>
            <button onclick="closeMinigame()" class="minigame-close-btn">Cancel</button>
        </div>
    `;
    modal.style.display = 'flex';

    const screen = document.getElementById('reactionScreen');
    screen.style.backgroundColor = '#ef4444'; // Red
    screen.onclick = () => {
        if (reactionGame.startTime === 0 && reactionGame.active) {
            clearTimeout(reactionGame.timeoutId);
            endReactionGame(false, 'Too soon!');
        }
    };

    reactionGame.timeoutId = setTimeout(() => {
        if (!reactionGame.active) return;
        screen.style.backgroundColor = '#10b981'; // Green
        reactionGame.startTime = Date.now();
        screen.onclick = () => clickReactionTarget();
    }, 2000 + Math.random() * 3000);
};

function clickReactionTarget() {
    if (reactionGame.startTime === 0 || !reactionGame.active) return;
    const reactionTime = Date.now() - reactionGame.startTime;
    endReactionGame(true, `Your reaction time: ${reactionTime}ms`);
}

function endReactionGame(success, message) {
    if (!reactionGame.active) return;
    clearTimeout(reactionGame.timeoutId);
    reactionGame.active = false;
    const content = document.getElementById('minigameContent');
    let rewards = {};
    if (success) {
        const reactionTime = parseInt(message.split(' ')[3]);
        let money = 0;
        let voidCoins = 0;
        if (reactionTime < 150) {
            money = 1000;
            voidCoins = 20;
        } else if (reactionTime < 250) {
            money = 500;
            voidCoins = 10;
        } else if (reactionTime < 400) {
            money = 250;
            voidCoins = 5;
        }
        if (money > 0) {
            rewards = { money, voidCoins };
            awardRewards(rewards);
            window.gameState.minigames.wins++;
        }
    }
    window.gameState.minigames.plays++;
    window.gameState.minigames.dailyPlays++;
    content.innerHTML = `
        <div class="minigame-result ${success ? 'success' : 'failure'}">
            <div class="minigame-result-icon">${success ? '✓' : '✗'}</div>
            <h2>${message}</h2>
            ${success && rewards.money ? `<div class="minigame-rewards"><h3>Rewards:</h3><div class="reward-list">
                <div>💰 ${rewards.money} Money</div><div>🌀 ${rewards.voidCoins} Void Coins</div></div></div>` :
                `<div class="minigame-fail-msg">Try again!</div>`}
            <button onclick="closeMinigame()" class="minigame-action-btn">Close</button>
        </div>
    `;
    saveGameState();
}

// SEQUENCE MEMORY GAME
let sequenceGame = { active: false, sequence: [], playerSequence: [], level: 0 };

window.startSequenceGame = function() {
    if (!window.gameState.minigames.unlocked) {
        showNotification('🔒 Unlock at 10,000 rolls!', 'error');
        return;
    }
    checkDailyReset();
    const modal = document.getElementById('minigameModal');
    const content = document.getElementById('minigameContent');
    sequenceGame = { active: true, sequence: [], playerSequence: [], level: 1 };
    content.innerHTML = `
        <div class="minigame-sequence">
            <h2>🎨 Sequence Memory</h2>
            <div class="minigame-instructions">Watch the sequence and repeat it.</div>
            <div id="sequenceLevel">Level: 1</div>
            <div class="sequence-grid" id="sequenceGrid"></div>
            <button onclick="closeMinigame()" class="minigame-close-btn">Cancel</button>
        </div>
    `;
    modal.style.display = 'flex';
    createSequenceGrid();
    setTimeout(nextSequence, 1000);
};

function createSequenceGrid() {
    const grid = document.getElementById('sequenceGrid');
    grid.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const button = document.createElement('button');
        button.className = 'sequence-btn';
        button.dataset.index = i;
        button.onclick = () => sequencePlayerInput(i);
        grid.appendChild(button);
    }
}

function nextSequence() {
    if (!sequenceGame.active) return;
    sequenceGame.playerSequence = [];
    const nextVal = Math.floor(Math.random() * 4);
    sequenceGame.sequence.push(nextVal);
    document.getElementById('sequenceLevel').textContent = `Level: ${sequenceGame.level}`;
    playSequence();
}

function playSequence() {
    if (!sequenceGame.active) return;
    const grid = document.getElementById('sequenceGrid');
    grid.classList.add('disabled');
    let i = 0;
    const intervalId = setInterval(() => {
        if (i >= sequenceGame.sequence.length) {
            clearInterval(intervalId);
            if (grid) grid.classList.remove('disabled');
            return;
        }
        const btn = document.querySelector(`[data-index="${sequenceGame.sequence[i]}"]`);
        if (btn) {
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 400);
        }
        i++;
    }, 600);
}

function sequencePlayerInput(index) {
    if (document.getElementById('sequenceGrid').classList.contains('disabled')) return;
    sequenceGame.playerSequence.push(index);
    const btn = document.querySelector(`[data-index="${index}"]`);
    btn.classList.add('active');
    setTimeout(() => btn.classList.remove('active'), 200);

    // Check for incorrect input immediately
    const currentMoveIndex = sequenceGame.playerSequence.length - 1;
    if (sequenceGame.sequence[currentMoveIndex] !== sequenceGame.playerSequence[currentMoveIndex]) {
        endSequenceGame(false, `Wrong sequence! You reached level ${sequenceGame.level}.`);
        return;
    }

    if (sequenceGame.playerSequence.length === sequenceGame.sequence.length) {
        checkSequence();
    }
}

function checkSequence() {
    if (sequenceGame.level === 10) {
        endSequenceGame(true, 'You completed all 10 levels!');
        return;
    }
    sequenceGame.level++;
    setTimeout(nextSequence, 1000);
}

// **FIXED** This function was broken in the original code.
function endSequenceGame(success, message) {
    if (!sequenceGame.active) return;
    sequenceGame.active = false;
    const content = document.getElementById('minigameContent');
    let rewards = {};
    if (success) {
        rewards = { money: 2000, voidCoins: 50, potions: { 'Lucky Potion II': 1 } };
        awardRewards(rewards);
        window.gameState.minigames.wins++;
    } else {
        const level = sequenceGame.level;
        if (level > 5) {
            rewards = { money: level * 50, voidCoins: level * 2 };
            awardRewards(rewards);
            window.gameState.minigames.wins++; // Win for reaching a decent level
        }
    }
    window.gameState.minigames.plays++;
    window.gameState.minigames.dailyPlays++;
    content.innerHTML = `
        <div class="minigame-result ${success || Object.keys(rewards).length > 0 ? 'success' : 'failure'}">
            <div class="minigame-result-icon">${success || Object.keys(rewards).length > 0 ? '🎉' : '✗'}</div>
            <h2>${message}</h2>
            ${Object.keys(rewards).length > 0 ? `<div class="minigame-rewards"><h3>Rewards:</h3><div class="reward-list">
                ${rewards.money ? `<div>💰 ${rewards.money} Money</div>` : ''}
                ${rewards.voidCoins ? `<div>🌀 ${rewards.voidCoins} Void Coins</div>` : ''}
                ${rewards.potions ? `<div>⚗️ 1x Lucky Potion II</div>` : ''}
                </div></div>` : '<div class="minigame-fail-msg">Better luck next time!</div>'}
            <button onclick="closeMinigame()" class="minigame-action-btn">Close</button>
        </div>
    `;
    saveGameState();
}

// WHACK-A-MOLE GAME
let whackAMole = { active: false, score: 0, timerId: null, moleTimeoutId: null };

window.startWhackAMole = function() {
    if (!window.gameState.minigames.unlocked) {
        showNotification('🔒 Unlock at 10,000 rolls!', 'error');
        return;
    }
    checkDailyReset();
    const modal = document.getElementById('minigameModal');
    const content = document.getElementById('minigameContent');
    whackAMole = { active: true, score: 0, timerId: null, moleTimeoutId: null };
    content.innerHTML = `
        <div class="minigame-whack">
            <h2>🔨 Whack-a-Mole</h2>
            <div class="minigame-instructions">Click the moles before they disappear!</div>
            <div class="whack-stats"><span>Score: <span id="whackScore">0</span></span><span>Time Left: <span id="whackTime">20</span>s</span></div>
            <div class="whack-grid" id="whackGrid"></div>
            <button onclick="closeMinigame()" class="minigame-close-btn">Cancel</button>
        </div>
    `;
    modal.style.display = 'flex';
    createWhackGrid();
    let timeLeft = 20;
    whackAMole.timerId = setInterval(() => {
        timeLeft--;
        const timeEl = document.getElementById('whackTime');
        if (timeEl) timeEl.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
            endWhackAMole(`Time's up! Your score: ${whackAMole.score}`);
        }
    }, 1000);
    spawnMole();
};

function createWhackGrid() {
    const grid = document.getElementById('whackGrid');
    grid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const hole = document.createElement('div');
        hole.className = 'whack-hole';
        const mole = document.createElement('div');
        mole.className = 'whack-mole';
        mole.onclick = () => whackMole(mole);
        hole.appendChild(mole);
        grid.appendChild(hole);
    }
}

function spawnMole() {
    if (!whackAMole.active) return;
    const moles = document.querySelectorAll('.whack-mole');
    if (moles.length === 0) return;
    const mole = moles[Math.floor(Math.random() * moles.length)];
    mole.classList.add('up');
    whackAMole.moleTimeoutId = setTimeout(() => {
        mole.classList.remove('up');
        spawnMole();
    }, 700 + Math.random() * 800);
}

function whackMole(mole) {
    if (!mole.classList.contains('up') || !whackAMole.active) return;
    whackAMole.score++;
    document.getElementById('whackScore').textContent = whackAMole.score;
    mole.classList.remove('up');
    clearTimeout(whackAMole.moleTimeoutId);
    spawnMole();
}

function endWhackAMole(message) {
    if (!whackAMole.active) return;
    clearInterval(whackAMole.timerId);
    clearTimeout(whackAMole.moleTimeoutId);
    whackAMole.active = false;
    const content = document.getElementById('minigameContent');
    let rewards = {};
    if (whackAMole.score > 0) {
        rewards = { money: whackAMole.score * 20, voidCoins: Math.floor(whackAMole.score / 2) };
        awardRewards(rewards);
        window.gameState.minigames.wins++;
    }
    window.gameState.minigames.plays++;
    window.gameState.minigames.dailyPlays++;
    content.innerHTML = `
        <div class="minigame-result ${whackAMole.score > 0 ? 'success' : 'failure'}">
            <div class="minigame-result-icon">${whackAMole.score > 0 ? '🎉' : '✗'}</div>
            <h2>${message}</h2>
            ${whackAMole.score > 0 ? `<div class="minigame-rewards"><h3>Rewards:</h3><div class="reward-list">
                <div>💰 ${rewards.money} Money</div><div>🌀 ${rewards.voidCoins} Void Coins</div></div></div>` : '<div class="minigame-fail-msg">Better luck next time!</div>'}
            <button onclick="closeMinigame()" class="minigame-action-btn">Close</button>
        </div>
    `;
    saveGameState();
}

// **NEW** ASTEROID CLICKER GAME
let asteroidGame = { active: false, score: 0, timerId: null, spawnInterval: null };

window.startAsteroidClicker = function() {
    if (!window.gameState.minigames.unlocked) {
        showNotification('🔒 Unlock at 10,000 rolls!', 'error');
        return;
    }
    checkDailyReset();
    const modal = document.getElementById('minigameModal');
    const content = document.getElementById('minigameContent');
    asteroidGame = { active: true, score: 0, timerId: null, spawnInterval: null };
    content.innerHTML = `
        <div class="minigame-asteroid">
            <h2>☄️ Asteroid Clicker</h2>
            <div class="minigame-instructions">Click as many asteroids as you can in 20 seconds!</div>
            <div class="asteroid-stats">
                <span>Score: <span id="asteroidScore">0</span></span>
                <span>Time Left: <span id="asteroidTime">20</span>s</span>
            </div>
            <div class="asteroid-field" id="asteroidField"></div>
            <button onclick="closeMinigame()" class="minigame-close-btn">Cancel</button>
        </div>
    `;
    modal.style.display = 'flex';

    let timeLeft = 20;
    asteroidGame.timerId = setInterval(() => {
        timeLeft--;
        const timeEl = document.getElementById('asteroidTime');
        if (timeEl) timeEl.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
            endAsteroidClicker(`Time's up! Your score: ${asteroidGame.score}`);
        }
    }, 1000);

    asteroidGame.spawnInterval = setInterval(spawnAsteroid, 600);
    spawnAsteroid(); // Spawn one immediately
};

function spawnAsteroid() {
    if (!asteroidGame.active) return;
    const field = document.getElementById('asteroidField');
    if (!field) return;

    const asteroid = document.createElement('div');
    asteroid.className = 'asteroid';
    asteroid.textContent = '☄️';
    asteroid.style.left = `${Math.random() * 90}%`;
    asteroid.style.top = `${Math.random() * 90}%`;
    asteroid.style.fontSize = `${1.5 + Math.random() * 1.5}rem`;

    asteroid.onclick = () => {
        if (!asteroidGame.active) return;
        asteroidGame.score++;
        document.getElementById('asteroidScore').textContent = asteroidGame.score;
        asteroid.remove();
    };

    field.appendChild(asteroid);

    setTimeout(() => {
        if (asteroid) asteroid.remove();
    }, 2000 + Math.random() * 1000); // Asteroid disappears after some time
}

function endAsteroidClicker(message) {
    if (!asteroidGame.active) return;
    clearInterval(asteroidGame.timerId);
    clearInterval(asteroidGame.spawnInterval);
    asteroidGame.active = false;
    const content = document.getElementById('minigameContent');
    let rewards = {};
    if (asteroidGame.score > 0) {
        rewards = { money: asteroidGame.score * 15, voidCoins: Math.floor(asteroidGame.score / 3) };
        awardRewards(rewards);
        window.gameState.minigames.wins++;
    }
    window.gameState.minigames.plays++;
    window.gameState.minigames.dailyPlays++;
    content.innerHTML = `
        <div class="minigame-result ${asteroidGame.score > 0 ? 'success' : 'failure'}">
            <div class="minigame-result-icon">${asteroidGame.score > 0 ? '🎉' : '✗'}</div>
            <h2>${message}</h2>
            ${asteroidGame.score > 0 ? `<div class="minigame-rewards"><h3>Rewards:</h3><div class="reward-list">
                <div>💰 ${rewards.money} Money</div><div>🌀 ${rewards.voidCoins} Void Coins</div></div></div>` : '<div class="minigame-fail-msg">Better luck next time!</div>'}
            <button onclick="closeMinigame()" class="minigame-action-btn">Close</button>
        </div>
    `;
    saveGameState();
}

// =================================================================
// SHARED MINIGAME FUNCTIONS
// =================================================================

// **FIXED** This function was broken in the original code.
function awardRewards(rewards) {
    if (rewards.money) window.gameState.currency.money += rewards.money;
    if (rewards.voidCoins) window.gameState.currency.voidCoins += rewards.voidCoins;
    if (rewards.halloweenMedals) window.gameState.currency.halloweenMedals += rewards.halloweenMedals;
    if (rewards.potions) {
        for (const [potion, amount] of Object.entries(rewards.potions)) {
            if (!window.gameState.inventory.potions[potion]) {
                window.gameState.inventory.potions[potion] = { count: 0 };
            }
            window.gameState.inventory.potions[potion].count += amount;
        }
    }
    updateUI(); // Assumes this function exists elsewhere to update the main game UI
}

window.closeMinigame = function() {
    document.getElementById('minigameModal').style.display = 'none';
    // Deactivate all games and clear their timers/intervals to prevent background processing
    if (timingGame.active) timingGame.active = false;
    if (memoryGame.active) memoryGame.active = false;
    if (spinWheel.active) spinWheel.active = false;
    if (reactionGame.active) {
        clearTimeout(reactionGame.timeoutId);
        reactionGame.active = false;
    }
    if (sequenceGame.active) sequenceGame.active = false;
    if (whackAMole.active) {
        clearInterval(whackAMole.timerId);
        clearTimeout(whackAMole.moleTimeoutId);
        whackAMole.active = false;
    }
    if (asteroidGame.active) {
        clearInterval(asteroidGame.timerId);
        clearInterval(asteroidGame.spawnInterval);
        asteroidGame.active = false;
    }
};

function createMinigameMenu() {
    const container = document.getElementById('minigameMenuContainer');
    if (!container) return;
    const unlocked = window.gameState.minigames.unlocked;
    container.innerHTML = `
        <div class="minigame-menu">
            <h2 class="minigame-menu-title">🎮 Mini Games</h2>
            ${!unlocked ? `
                <div class="minigame-locked">🔒 Unlock at 10,000 rolls
                <div class="minigame-progress-text">${window.gameState.totalRolls.toLocaleString()} / 10,000</div></div>
            ` : `
                <div class="minigame-stats">
                    <div class="minigame-stat"><span class="minigame-stat-label">Plays Today:</span>
                    <span class="minigame-stat-value">${window.gameState.minigames.dailyPlays}</span></div>
                    <div class="minigame-stat"><span class="minigame-stat-label">Win Rate:</span>
                    <span class="minigame-stat-value">${window.gameState.minigames.plays > 0 ? Math.round((window.gameState.minigames.wins / window.gameState.minigames.plays) * 100) : 0}%</span></div>
                </div>
                <div class="minigame-grid">
                    <div class="minigame-card"><div class="minigame-card-icon">⏱️</div><h3>Perfect Timing</h3>
                    <p>Stop the bar at the perfect moment!</p><button onclick="startTimingGame()" class="minigame-play-btn">PLAY</button></div>
                    <div class="minigame-card"><div class="minigame-card-icon">🧠</div><h3>Memory Match</h3>
                    <p>Match all pairs to win rewards!</p><button onclick="startMemoryGame()" class="minigame-play-btn">PLAY</button></div>
                    <div class="minigame-card"><div class="minigame-card-icon">🎡</div><h3>Lucky Spin</h3>
                    <p>Spin the wheel! (1hr cooldown)</p><button onclick="startSpinWheel()" class="minigame-play-btn" id="spinWheelBtn">PLAY</button></div>
                    <div class="minigame-card"><div class="minigame-card-icon">⚡</div><h3>Reaction Test</h3>
                    <p>Click when the screen changes!</p><button onclick="startReactionGame()" class="minigame-play-btn">PLAY</button></div>
                    <div class="minigame-card"><div class="minigame-card-icon">🎨</div><h3>Sequence Memory</h3>
                    <p>Repeat the sequence of colors.</p><button onclick="startSequenceGame()" class="minigame-play-btn">PLAY</button></div>
                    <div class="minigame-card"><div class="minigame-card-icon">🔨</div><h3>Whack-a-Mole</h3>
                    <p>Click the moles before they disappear.</p><button onclick="startWhackAMole()" class="minigame-play-btn">PLAY</button></div>
                    <div class="minigame-card"><div class="minigame-card-icon">☄️</div><h3>Asteroid Clicker</h3>
                    <p>Click as many asteroids as you can.</p><button onclick="startAsteroidClicker()" class="minigame-play-btn">PLAY</button></div>
                </div>
            `}
        </div>
    `;
    updateSpinButton();
}

function updateSpinButton() {
    const btn = document.getElementById('spinWheelBtn');
    if (!btn) return;
    const now = Date.now();
    const timeSinceLastSpin = now - spinWheel.lastSpin;
    if (timeSinceLastSpin < spinWheel.cooldown) {
        const timeLeftMs = spinWheel.cooldown - timeSinceLastSpin;
        const timeLeftMin = Math.ceil(timeLeftMs / 60000);
        btn.disabled = true;
        btn.textContent = `${timeLeftMin}min`;
        // Optional: Add a timer to update the button text
        setTimeout(updateSpinButton, 60000); // Check again in a minute
    } else {
        btn.disabled = false;
        btn.textContent = 'PLAY';
    }
}

// Hook into game load
if (typeof window.addEventListener === 'function') {
    window.addEventListener('DOMContentLoaded', () => {
        checkMinigameUnlock();
        // createMinigameMenu(); // You might call this when the minigame tab is opened
    });
}

console.log('✅ Mini Games System loaded');
