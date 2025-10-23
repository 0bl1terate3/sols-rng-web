// Crafting System

let craftingMode = 'single'; // 'single', 'multi', 'insta'
let multiCraftAmount = 1;
let selectedCategory = 'all'; // 'all', 'potions', 'gauntlets', 'items'
let favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]'); // Quality of Life: Favorite recipes
let currentRecipeType = 'potion'; // Track current recipe type for modal refreshes

// Auto-craft system
let autoCraftEnabled = false;
const AUTO_CRAFT_UNLOCK_ROLLS = 5000;
let autoCraftInterval = null;

// Auto-potion system
let autoPotionEnabled = false;
const AUTO_POTION_UNLOCK_ROLLS = 3000;
let autoPotionInterval = null;

// Filter recipes based on search term
function filterRecipes(searchTerm) {
    updateRecipesList(searchTerm);
}

function getGearEffectDescription(gearInfo) {
    if (!gearInfo.effects) return 'No effects';
    
    const effects = [];
    if (gearInfo.effects.luck) effects.push(`+${gearInfo.effects.luck} Luck`);
    if (gearInfo.effects.rollSpeed) effects.push(`${gearInfo.effects.rollSpeed > 0 ? '+' : ''}${gearInfo.effects.rollSpeed}% Roll Speed`);
    if (gearInfo.effects.special) {
        effects.push(`Special: ${gearInfo.effects.special}`);
    }
    
    return effects.join(', ') || 'Passive effects';
}

// Track if recipes list has been built
let recipesListBuilt = false;

// Build the recipes list structure once
function buildRecipesList(searchTerm = '') {
    const container = document.getElementById('recipesList');
    
    // Preserve existing search term if not explicitly provided
    if (searchTerm === '') {
        const existingSearch = document.getElementById('recipeSearch');
        if (existingSearch) {
            searchTerm = existingSearch.value;
        }
    }
    
    // Add category filter controls if they don't exist
    if (!document.getElementById('craftingFilters')) {
        const filterHTML = `
            <div id="craftingFilters" style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                <span style="color: #aaa; font-weight: bold;">Filter:</span>
                <button onclick="setCraftingCategory('all')" class="filter-btn ${selectedCategory === 'all' ? 'active' : ''}">All</button>
                <button onclick="setCraftingCategory('potions')" class="filter-btn ${selectedCategory === 'potions' ? 'active' : ''}">⚗️ Potions</button>
                <button onclick="setCraftingCategory('gauntlets')" class="filter-btn ${selectedCategory === 'gauntlets' ? 'active' : ''}">⚙️ Gauntlets</button>
                <button onclick="setCraftingCategory('items')" class="filter-btn ${selectedCategory === 'items' ? 'active' : ''}">📦 Items</button>
                
                <div style="margin-left: auto; display: flex; align-items: center; gap: 10px;">
                    <span style="color: #aaa; font-weight: bold;">Search:</span>
                    <input type="text" id="recipeSearch" placeholder="Search recipes..." value="${searchTerm}" 
                           oninput="filterRecipes(this.value)" 
                           style="padding: 5px 10px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; width: 150px;">
                    <button onclick="document.getElementById('recipeSearch').value=''; filterRecipes('');" 
                            style="padding: 5px 10px; background: #555; color: white; border: none; border-radius: 4px; cursor: pointer;">Clear</button>
                </div>
            </div>
        `;
        
        // Insert before the recipes list
        const parent = container.parentNode;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = filterHTML;
        parent.insertBefore(tempDiv.firstElementChild, container);
    } else {
        // Update the search input value if filters already exist (prevents reset during auto-roll)
        const existingSearch = document.getElementById('recipeSearch');
        if (existingSearch && searchTerm !== existingSearch.value) {
            existingSearch.value = searchTerm;
        }
    }
    
    // Get item recipes (like Gear Basing)
    const itemRecipes = [];
    if (typeof ITEM_RECIPES !== 'undefined') {
        for (const [itemName, itemInfo] of Object.entries(ITEM_RECIPES)) {
            if (itemName.toLowerCase().includes(searchTerm.toLowerCase()) && 
                (selectedCategory === 'all' || selectedCategory === 'items')) {
                itemRecipes.push({
                    name: itemName,
                    ingredients: itemInfo.recipe,
                    effect: itemInfo.description || 'Crafting material',
                    type: 'item'
                });
            }
        }
    }
    
    // Get potion recipes
    const potionRecipes = POTION_RECIPES.filter(recipe => 
        !recipe.isBase && recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === 'all' || selectedCategory === 'potions')
    );
    
    // Get gear recipes from gearData (gauntlets)
    const gearRecipes = [];
    if (typeof gearData !== 'undefined') {
        for (const [gearName, gearInfo] of Object.entries(gearData)) {
            if (gearInfo.recipe && gearName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (selectedCategory === 'all' || selectedCategory === 'gauntlets')) {
                gearRecipes.push({
                    name: gearName,
                    ingredients: gearInfo.recipe,
                    effect: getGearEffectDescription(gearInfo),
                    description: gearInfo.description,
                    type: 'gear',
                    tier: gearInfo.tier,
                    hand: gearInfo.hand
                });
            }
        }
    }
    
    const allRecipes = [...itemRecipes, ...potionRecipes.map(r => ({...r, type: 'potion'})), ...gearRecipes];
    
    if (allRecipes.length === 0) {
        container.innerHTML = '<div style="text-align: center; opacity: 0.6; padding: 20px;">No recipes found</div>';
        return;
    }
    
    // Quality of Life: Sort recipes - favorites first, then craftable, then by tier, then alphabetical
    allRecipes.sort((a, b) => {
        const aIsFav = isFavorite(a.name, a.type);
        const bIsFav = isFavorite(b.name, b.type);
        const aCanCraft = checkCanCraft(a);
        const bCanCraft = checkCanCraft(b);

        if (aIsFav && !bIsFav) return -1;
        if (!aIsFav && bIsFav) return 1;

        if (aCanCraft && !bCanCraft) return -1;
        if (!aCanCraft && bCanCraft) return 1;

        if (a.tier && b.tier) {
            if (a.tier < b.tier) return -1;
            if (a.tier > b.tier) return 1;
        }

        return a.name.localeCompare(b.name);
    });
    
    // Group recipes by category for better organization
    let html = '';
    
    if (selectedCategory === 'all') {
        // Show categorized view
        const categories = {
            potions: allRecipes.filter(r => r.type === 'potion'),
            gauntlets: allRecipes.filter(r => r.type === 'gear'),
            items: allRecipes.filter(r => r.type === 'item')
        };
        
        if (categories.potions.length > 0) {
            html += '<div class="crafting-category"><h3>⚗️ Potions</h3>';
            html += categories.potions.map(recipe => createRecipeCard(recipe)).join('');
            html += '</div>';
        }
        
        if (categories.gauntlets.length > 0) {
            html += '<div class="crafting-category"><h3>⚙️ Gauntlets</h3>';
            html += categories.gauntlets.map(recipe => createRecipeCard(recipe)).join('');
            html += '</div>';
        }
        
        if (categories.items.length > 0) {
            html += '<div class="crafting-category"><h3>📦 Items</h3>';
            html += categories.items.map(recipe => createRecipeCard(recipe)).join('');
            html += '</div>';
        }
    } else {
        // Show single category
        html += allRecipes.map(recipe => createRecipeCard(recipe)).join('');
    }
    
    container.innerHTML = html;
    recipesListBuilt = true;
    
    // After building, update the counts
    updateRecipeCounts();
}

// Efficient function to update only the counts and button states
function updateRecipeCounts() {
    if (!recipesListBuilt) {
        // If not built yet, do a full build
        buildRecipesList();
        return;
    }
    
    // Get all recipe items
    const recipeItems = document.querySelectorAll('.recipe-item[data-recipe-type]');
    
    recipeItems.forEach(recipeItem => {
        const recipeId = recipeItem.id.replace('recipe-', '');
        
        // Get all ingredient spans for this recipe
        const ingredientSpans = recipeItem.querySelectorAll('.recipe-ingredients span[data-recipe-id]');
        let canCraft = true;
        
        ingredientSpans.forEach(span => {
            const itemId = span.getAttribute('data-item-id');
            const itemName = span.textContent.split('(')[0].trim();
            const requiredMatch = span.textContent.match(/\/(\d+)\)/);
            const required = requiredMatch ? parseInt(requiredMatch[1]) : 0;
            
            const available = getItemCount(itemName);
            const hasEnough = available >= required;
            
            if (!hasEnough) canCraft = false;
            
            // Update the class
            span.className = hasEnough ? 'ingredient-available' : 'ingredient-missing';
            span.setAttribute('data-recipe-id', recipeId);
            span.setAttribute('data-item-id', itemId);
            
            // Update the count display
            const countDisplay = span.querySelector('.count-display');
            if (countDisplay) {
                countDisplay.textContent = available;
            }
        });
        
        // Update craftable class
        if (canCraft) {
            recipeItem.classList.add('craftable');
        } else {
            recipeItem.classList.remove('craftable');
        }
        
        // Update quick craft button visibility
        const quickCraftBtn = recipeItem.querySelector('.quick-craft-btn');
        if (quickCraftBtn) {
            quickCraftBtn.style.display = canCraft ? 'inline-block' : 'none';
        }
    });
}

// Wrapper function that decides whether to build or update
function updateRecipesList(searchTerm = '') {
    // Always rebuild when explicitly called with a search term or if not built yet
    if (!recipesListBuilt || arguments.length > 0) {
        recipesListBuilt = false;
        buildRecipesList(searchTerm);
    } else {
        // Just update counts for performance (only when called without arguments)
        updateRecipeCounts();
    }
}

function createRecipeCard(recipe) {
    const canCraft = checkCanCraft(recipe);
    const craftableClass = canCraft ? 'craftable' : '';
    const icon = recipe.type === 'gear' ? '⚙️' : recipe.type === 'item' ? '📦' : '⚗️';
    const isFav = isFavorite(recipe.name, recipe.type);
    const recipeId = recipe.name.replace(/[^a-zA-Z0-9]/g, '-');
    
    const ingredientsHTML = Object.entries(recipe.ingredients).map(([item, amount]) => {
        const available = getItemCount(item);
        const hasEnough = available >= amount;
        const className = hasEnough ? 'ingredient-available' : 'ingredient-missing';
        const itemId = item.replace(/[^a-zA-Z0-9]/g, '-');
        return `<span class="${className}" data-recipe-id="${recipeId}" data-item-id="${itemId}">${item} (<span class="count-display">${available}</span>/${amount})</span>`;
    }).join(', ');

    const handInfo = recipe.type === 'gear' && recipe.hand ? `<span class="hand-info">(${recipe.hand})</span>` : '';
    
    // Add rainbow styling for Hwachae
    const isRainbowPotion = recipe.name === 'Hwachae';
    const rainbowStyle = isRainbowPotion ? 'background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold;' : '';
    
    // Add red styling for Santa Potion
    const isSantaPotion = recipe.name === 'Santa Potion';
    const santaStyle = isSantaPotion ? 'color: #ef4444; font-weight: bold; text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);' : '';
    
    // Add blue/white gradient for ??? potion
    const isMysteryPotion = recipe.name === '???';
    const mysteryStyle = isMysteryPotion ? 'background: linear-gradient(90deg, #3b82f6, #93c5fd, #ffffff, #93c5fd, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold; text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);' : '';
    
    // Add yellow gradient for Transcendent Potion
    const isTranscendentPotion = recipe.name === 'Transcendent Potion';
    const transcendentStyle = isTranscendentPotion ? 'background: linear-gradient(90deg, #fbbf24, #fde047, #fff9c4, #fde047, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold; text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);' : '';
    
    // Add red styling for Raid Potion
    const isRaidPotion = recipe.name === 'Raid Potion';
    const raidStyle = isRaidPotion ? 'color: #dc2626; font-weight: bold; text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);' : '';
    
    // Add dark purple/black gradient for Voidheart
    const isVoidheartPotion = recipe.name === 'Voidheart';
    const voidheartStyle = isVoidheartPotion ? 'background: linear-gradient(90deg, #000000, #1a0033, #4c1d95, #1a0033, #000000); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold; text-shadow: 0 0 20px rgba(76, 29, 149, 0.7);' : '';
    
    // Add gold/yellow gradient for Potion of Bound
    const isBoundPotion = recipe.name === 'Potion of Bound';
    const boundStyle = isBoundPotion ? 'background: linear-gradient(90deg, #fbbf24, #fde047, #fef3c7, #fde047, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold; text-shadow: 0 0 20px rgba(251, 191, 36, 0.6);' : '';
    
    // Add celestial blue/white gradient for Heavenly Potion
    const isHeavenlyPotion = recipe.name === 'Heavenly Potion';
    const heavenlyStyle = isHeavenlyPotion ? 'background: linear-gradient(90deg, #60a5fa, #bfdbfe, #ffffff, #bfdbfe, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold; text-shadow: 0 0 20px rgba(96, 165, 250, 0.7);' : '';
    
    // Add divine gold/purple gradient for Godlike Potion
    const isGodlikePotion = recipe.name === 'Godlike Potion';
    const godlikeStyle = isGodlikePotion ? 'background: linear-gradient(90deg, #fbbf24, #c084fc, #ffffff, #c084fc, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold; text-shadow: 0 0 25px rgba(251, 191, 36, 0.8);' : '';
    
    // Add dark void gradient for Oblivion Potion
    const isOblivionPotion = recipe.name === 'Oblivion Potion';
    const oblivionStyle = isOblivionPotion ? 'background: linear-gradient(90deg, #1e1b4b, #4c1d95, #7c3aed, #4c1d95, #1e1b4b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold; text-shadow: 0 0 20px rgba(124, 58, 237, 0.8);' : '';
    
    // Add purple/blue space gradient for Warp Potion
    const isWarpPotion = recipe.name === 'Warp Potion';
    const warpStyle = isWarpPotion ? 'background: linear-gradient(90deg, #8b5cf6, #6366f1, #3b82f6, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold; text-shadow: 0 0 20px rgba(139, 92, 246, 0.7);' : '';
    
    // Add orange/red blood gradient for Pump Kings Blood
    const isPumpKingsBlood = recipe.name === 'Pump Kings Blood';
    const pumpStyle = isPumpKingsBlood ? 'background: linear-gradient(90deg, #ff6b00, #ff8800, #ffaa00, #ff8800, #ff6b00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold; text-shadow: 0 0 20px rgba(255, 107, 0, 0.7);' : '';
    
    // Add cyan/magenta quantum gradient for Quantum Potion
    const isQuantumPotion = recipe.name === 'Quantum Potion';
    const quantumStyle = isQuantumPotion ? 'background: linear-gradient(90deg, #06b6d4, #a855f7, #ec4899, #a855f7, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold; text-shadow: 0 0 20px rgba(168, 85, 247, 0.7);' : '';
    
    // Add gold/green jackpot gradient for Jackpot Potion
    const isJackpotPotion = recipe.name === 'Jackpot Potion';
    const jackpotStyle = isJackpotPotion ? 'background: linear-gradient(90deg, #fbbf24, #84cc16, #22c55e, #84cc16, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold; text-shadow: 0 0 20px rgba(251, 191, 36, 0.7);' : '';
    
    const specialStyle = rainbowStyle || santaStyle || mysteryStyle || transcendentStyle || raidStyle || voidheartStyle || boundStyle || heavenlyStyle || godlikeStyle || oblivionStyle || warpStyle || pumpStyle || quantumStyle || jackpotStyle;
    
    return `
        <div class="recipe-item ${craftableClass}" id="recipe-${recipeId}" data-recipe-type="${recipe.type}" style="position: relative;">
            <div style="position: absolute; top: 5px; right: 5px; display: flex; gap: 5px;">
                <button onclick="event.stopPropagation(); toggleFavorite('${recipe.name}', '${recipe.type}')" 
                        style="background: ${isFav ? '#ffd700' : '#333'}; color: ${isFav ? '#000' : '#fff'}; 
                               border: 1px solid #555; border-radius: 4px; padding: 2px 6px; cursor: pointer; font-size: 12px;"
                        title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
                    ⭐
                </button>
                <button class="quick-craft-btn" onclick="event.stopPropagation(); quickCraft('${recipe.name}', '${recipe.type}')" 
                           style="background: #4CAF50; color: white; border: none; border-radius: 4px; 
                                  padding: 2px 6px; cursor: pointer; font-size: 12px; display: ${canCraft ? 'inline-block' : 'none'};"
                           title="Quick craft">
                    ⚡
                </button>
            </div>
            <div class="recipe-name" onclick="openCraftingModal('${recipe.name}', '${recipe.type}')" style="${specialStyle}">${icon} ${recipe.name} ${handInfo} ${recipe.tier ? `[T${recipe.tier}]` : ''}</div>
            <div class="recipe-ingredients" onclick="openCraftingModal('${recipe.name}', '${recipe.type}')">${ingredientsHTML}</div>
            <div class="recipe-effect" onclick="openCraftingModal('${recipe.name}', '${recipe.type}')">${recipe.effect}</div>
            <div class="recipe-description" onclick="openCraftingModal('${recipe.name}', '${recipe.type}')">${recipe.description || ''}</div>
        </div>
    `;
}

function checkCanCraft(recipe) {
    for (let [item, amount] of Object.entries(recipe.ingredients)) {
        if (getItemCount(item) < amount) {
            return false;
        }
    }
    return true;
}

function getItemCount(itemName) {
    // Safety check for gameState
    if (typeof gameState === 'undefined' || !gameState || !gameState.inventory) {
        return 0;
    }
    
    // Check items
    if (gameState.inventory.items[itemName]) {
        return gameState.inventory.items[itemName].count;
    }
    
    // Check auras
    if (gameState.inventory.auras[itemName]) {
        return gameState.inventory.auras[itemName].count;
    }
    
    // Check potions
    if (gameState.inventory.potions[itemName]) {
        return gameState.inventory.potions[itemName].count;
    }
    
    // Check gears
    if (gameState.inventory.gears && gameState.inventory.gears[itemName]) {
        return gameState.inventory.gears[itemName].count;
    }
    
    return 0;
}

function openCraftingModal(recipeName, recipeType = 'potion') {
    let recipe;
    let craftFunction;
    let itemType;
    
    // Store the current recipe type for modal refreshes
    currentRecipeType = recipeType;
    
    // Quality of Life: Auto-focus on modal for keyboard shortcuts
    setTimeout(() => {
        const modal = document.getElementById('craftingModal');
        if (modal) modal.focus();
    }, 100);
    
    if (recipeType === 'item') {
        // Handle item recipes (like Gear Basing)
        if (typeof ITEM_RECIPES === 'undefined' || !ITEM_RECIPES[recipeName]) return;
        recipe = {
            name: recipeName,
            ingredients: ITEM_RECIPES[recipeName].recipe,
            effect: ITEM_RECIPES[recipeName].description || 'Crafting material',
            type: 'item'
        };
        craftFunction = () => craftItem(recipeName);
        itemType = 'Item';
    } else if (recipeType === 'gear') {
        // Handle gear recipes
        if (typeof gearData === 'undefined' || !gearData[recipeName]) return;
        recipe = {
            name: recipeName,
            ingredients: gearData[recipeName].recipe,
            effect: getGearEffectDescription(gearData[recipeName]),
            description: gearData[recipeName].description,
            type: 'gear'
        };
        craftFunction = () => craftGear(recipeName);
        itemType = 'Gear';
    } else {
        // Handle potion recipes
        recipe = POTION_RECIPES.find(r => r.name === recipeName);
        if (!recipe) return;
        craftFunction = () => craftPotion(recipeName);
        itemType = 'Potion';
    }
    
    const modal = document.getElementById('craftingModal');
    
    // Check if Potion of the Beginner is disabled (100+ rolls)
    const isBeginnerDisabled = recipe.beginnerMode && gameState.totalRolls >= 100;
    const canCraft = isBeginnerDisabled ? false : checkCanCraft(recipe);
    
    // Add disabled styling to modal if beginner potion is disabled
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        if (isBeginnerDisabled) {
            modalContent.style.filter = 'brightness(0.3)';
            modalContent.style.opacity = '0.6';
        } else {
            modalContent.style.filter = 'brightness(1)';
            modalContent.style.opacity = '1';
        }
    }
    
    // Add special styling for Hwachae, Santa Potion, ??? potion, Transcendent Potion, Raid Potion, and Voidheart
    const isRainbowPotion = recipe.name === 'Hwachae';
    const isSantaPotion = recipe.name === 'Santa Potion';
    const isMysteryPotion = recipe.name === '???';
    const isTranscendentPotion = recipe.name === 'Transcendent Potion';
    const isRaidPotion = recipe.name === 'Raid Potion';
    const isVoidheartPotion = recipe.name === 'Voidheart';
    
    if (isRainbowPotion) {
        document.getElementById('modalPotionName').innerHTML = `
            <span style="background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3); 
                         -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; 
                         animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold;">
                ${recipe.name}
            </span>
        `;
    } else if (isSantaPotion) {
        document.getElementById('modalPotionName').innerHTML = `
            <span style="color: #ef4444; font-weight: bold; text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);">
                🎅 ${recipe.name}
            </span>
        `;
    } else if (isMysteryPotion) {
        document.getElementById('modalPotionName').innerHTML = `
            <span style="background: linear-gradient(90deg, #3b82f6, #93c5fd, #ffffff, #93c5fd, #3b82f6); 
                         -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; 
                         animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold; 
                         text-shadow: 0 0 20px rgba(59, 130, 246, 0.5); font-size: 1.5em;">
                ❓ ${recipe.name} ❓
            </span>
        `;
    } else if (isTranscendentPotion) {
        document.getElementById('modalPotionName').innerHTML = `
            <span style="background: linear-gradient(90deg, #fbbf24, #fde047, #fff9c4, #fde047, #fbbf24); 
                         -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; 
                         animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold; 
                         text-shadow: 0 0 20px rgba(251, 191, 36, 0.5); font-size: 1.3em;">
                ⚡ ${recipe.name} ⚡
            </span>
        `;
    } else if (isRaidPotion) {
        document.getElementById('modalPotionName').innerHTML = `
            <span style="color: #dc2626; font-weight: bold; text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);">
                ⚔️ ${recipe.name}
            </span>
        `;
    } else if (isVoidheartPotion) {
        document.getElementById('modalPotionName').innerHTML = `
            <span style="background: linear-gradient(90deg, #000000, #1a0033, #4c1d95, #1a0033, #000000); 
                         -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; 
                         animation: rainbow-shift 3s linear infinite; background-size: 200% 100%; font-weight: bold; 
                         text-shadow: 0 0 20px rgba(76, 29, 149, 0.7); font-size: 1.4em;">
                🌌 ${recipe.name} 💜
            </span>
        `;
    } else {
        document.getElementById('modalPotionName').textContent = recipe.name;
    }
    
    // Add DISABLED banner if beginner potion is disabled
    if (isBeginnerDisabled) {
        document.getElementById('modalPotionName').innerHTML = `
            ${recipe.name}
            <div style="
                background: #ef4444;
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                margin-top: 10px;
                font-weight: bold;
                font-size: 1.2em;
                text-align: center;
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.6);
                animation: pulse 2s infinite;
            ">
                ⚠️ DISABLED ⚠️
            </div>
            <div style="
                color: #fca5a5;
                margin-top: 10px;
                font-size: 0.9em;
                text-align: center;
            ">
                Only works with less than 100 total rolls<br>
                (You have ${gameState.totalRolls.toLocaleString()} rolls)
            </div>
        `;
    }
    
    const ingredientsHTML = Object.entries(recipe.ingredients).map(([item, amount]) => {
        const available = getItemCount(item);
        const hasEnough = available >= amount;
        const className = hasEnough ? 'ingredient-available' : 'ingredient-missing';
        return `<div class="${className}">• ${item}: ${available}/${amount}</div>`;
    }).join('');
    
    document.getElementById('modalRecipe').innerHTML = `
        <h3>Required Ingredients:</h3>
        ${ingredientsHTML}
    `;
    
    document.getElementById('modalEffect').innerHTML = `
        <h3>Effect:</h3>
        <div>${recipe.effect}</div>
        <div class="recipe-description">${recipe.description || ''}</div>
    `;
    
    // Calculate max craftable amount
    const maxCraftable = calculateMaxCraftable(recipe);
    
    // Add crafting mode controls
    const modeControlsHTML = `
        <div class="crafting-controls" style="margin: 15px 0; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px;">
            <h4>Crafting Mode:</h4>
            <div style="display: flex; gap: 10px; margin: 10px 0; flex-wrap: wrap;">
                <button onclick="setCraftingMode('single')" class="mode-btn ${craftingMode === 'single' ? 'active' : ''}">Single</button>
                <button onclick="setCraftingMode('multi')" class="mode-btn ${craftingMode === 'multi' ? 'active' : ''}">Multi</button>
                <button onclick="setCraftingMode('max')" class="mode-btn ${craftingMode === 'max' ? 'active' : ''}">Max (${maxCraftable})</button>
                <button onclick="setCraftingMode('insta')" class="mode-btn ${craftingMode === 'insta' ? 'active' : ''}">Insta</button>
            </div>
            ${craftingMode === 'multi' ? `
                <div style="margin-top: 10px;">
                    <label>Amount: </label>
                    <input type="number" id="multiCraftAmount" value="${multiCraftAmount}" min="1" max="${maxCraftable}" style="width: 60px; padding: 5px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">
                    <button onclick="updateMultiCraftAmount()" style="margin-left: 10px; padding: 5px 10px;">Set</button>
                    <button onclick="setMultiCraftToMax(${maxCraftable})" style="margin-left: 5px; padding: 5px 10px;">Max</button>
                </div>
            ` : ''}
            ${maxCraftable > 1 ? `<div style="margin-top: 8px; color: #aaa; font-size: 0.9em;">💡 You can craft up to ${maxCraftable} with current materials</div>` : ''}
        </div>
    `;
    
    document.getElementById('modalEffect').innerHTML += modeControlsHTML;
    
    const craftButton = document.getElementById('craftButton');
    craftButton.disabled = !canCraft;
    
    if (craftingMode === 'insta') {
        craftButton.textContent = `Insta-Craft ${itemType}`;
        craftButton.onclick = () => instaCraft(recipeName, recipeType);
    } else if (craftingMode === 'max') {
        craftButton.textContent = `Craft ${maxCraftable}x ${itemType} (MAX)`;
        craftButton.onclick = () => multiCraft(recipeName, recipeType, maxCraftable);
    } else if (craftingMode === 'multi') {
        craftButton.textContent = `Craft ${multiCraftAmount}x ${itemType}`;
        craftButton.onclick = () => multiCraft(recipeName, recipeType, multiCraftAmount);
    } else {
        craftButton.textContent = `Craft ${itemType}`;
        craftButton.onclick = craftFunction;
    }
    
    modal.classList.add('show');
    
    // Scroll modal into view at user's current position
    setTimeout(() => {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 50);
    
    // Quality of Life: Add keyboard shortcuts
    modal.onkeydown = (e) => {
        if (e.key === 'Escape') {
            modal.classList.remove('show');
        } else if (e.key === 'Enter' && !craftButton.disabled) {
            craftButton.click();
        } else if (e.key === '1') {
            setCraftingMode('single');
        } else if (e.key === '2') {
            setCraftingMode('multi');
        } else if (e.key === '3') {
            setCraftingMode('insta');
        }
    };
}

// Crafting mode functions
function setCraftingMode(mode) {
    craftingMode = mode;
    // Reopen the modal to refresh the UI
    const modal = document.getElementById('craftingModal');
    if (modal.classList.contains('show')) {
        const recipeName = document.getElementById('modalPotionName').textContent;
        // Use the stored recipe type instead of trying to guess it
        openCraftingModal(recipeName, currentRecipeType);
    }
}

function updateMultiCraftAmount() {
    const amountInput = document.getElementById('multiCraftAmount');
    if (amountInput) {
        multiCraftAmount = Math.max(1, Math.min(999, parseInt(amountInput.value) || 1));
        amountInput.value = multiCraftAmount;
        // Refresh modal to update button text
        const modal = document.getElementById('craftingModal');
        if (modal.classList.contains('show')) {
            const recipeName = modal.dataset.recipeName;
            // Use the stored recipe type instead of hardcoding 'potion'
            openCraftingModal(recipeName, currentRecipeType);
        }
    }
}

// Calculate maximum craftable amount
function calculateMaxCraftable(recipe) {
    if (!recipe || !recipe.ingredients) return 0;
    
    let maxAmount = Infinity;
    
    for (const [ingredient, required] of Object.entries(recipe.ingredients)) {
        const available = getItemCount(ingredient);
        const possibleCrafts = Math.floor(available / required);
        maxAmount = Math.min(maxAmount, possibleCrafts);
    }
    
    return maxAmount === Infinity ? 0 : maxAmount;
}

// Set multi-craft amount to max
function setMultiCraftToMax(maxAmount) {
    multiCraftAmount = maxAmount;
    const amountInput = document.getElementById('multiCraftAmount');
    if (amountInput) {
        amountInput.value = maxAmount;
    }
    updateMultiCraftAmount();
}

// Category filtering function
function setCraftingCategory(category) {
    selectedCategory = category;
    recipesListBuilt = false; // Force rebuild when category changes
    updateRecipesList();
    
    // Update active button styling
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find and activate the correct button
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(category) || 
            (category === 'all' && btn.textContent === 'All')) {
            btn.classList.add('active');
        }
    });
}

// Quality of Life: Favorite recipes functions
function toggleFavorite(recipeName, recipeType) {
    const recipeKey = `${recipeType}:${recipeName}`;
    const index = favoriteRecipes.indexOf(recipeKey);
    
    if (index === -1) {
        favoriteRecipes.push(recipeKey);
    } else {
        favoriteRecipes.splice(index, 1);
    }
    
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
    recipesListBuilt = false; // Force rebuild to update favorites
    updateRecipesList();
}

function isFavorite(recipeName, recipeType) {
    const recipeKey = `${recipeType}:${recipeName}`;
    return favoriteRecipes.includes(recipeKey);
}

// Quality of Life: Quick craft function
function quickCraft(recipeName, recipeType) {
    // Set crafting mode to single for quick craft
    const originalMode = craftingMode;
    craftingMode = 'single';
    
    // Determine which craft function to use
    let craftFunction;
    if (recipeType === 'potion') {
        craftFunction = () => craftPotion(recipeName);
    } else if (recipeType === 'gear') {
        craftFunction = () => craftGear(recipeName);
    } else if (recipeType === 'item') {
        craftFunction = () => craftItem(recipeName);
    }
    
    // Check if we can craft
    let recipe;
    if (recipeType === 'potion') {
        recipe = POTION_RECIPES.find(r => r.name === recipeName);
    } else if (recipeType === 'gear') {
        if (typeof gearData !== 'undefined' && gearData[recipeName]) {
            recipe = { ingredients: gearData[recipeName].recipe };
        }
    } else if (recipeType === 'item') {
        if (typeof ITEM_RECIPES !== 'undefined' && ITEM_RECIPES[recipeName]) {
            recipe = { ingredients: ITEM_RECIPES[recipeName].recipe };
        }
    }
    
    if (recipe && checkCanCraft(recipe)) {
        craftFunction();
    } else {
        showNotification('❌ Cannot craft - insufficient materials!');
    }
    
    // Restore original mode
    craftingMode = originalMode;
}

// Multi-crafting function
function multiCraft(recipeName, recipeType, amount) {
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < amount; i++) {
        // Check if we can still craft
        let recipe;
        if (recipeType === 'potion') {
            recipe = POTION_RECIPES.find(r => r.name === recipeName);
        } else if (recipeType === 'gear') {
            if (typeof gearData !== 'undefined' && gearData[recipeName]) {
                recipe = {
                    name: recipeName,
                    ingredients: gearData[recipeName].recipe
                };
            }
        } else if (recipeType === 'item') {
            if (typeof ITEM_RECIPES !== 'undefined' && ITEM_RECIPES[recipeName]) {
                recipe = {
                    name: recipeName,
                    ingredients: ITEM_RECIPES[recipeName].recipe
                };
            }
        }
        
        if (!recipe || !checkCanCraft(recipe)) {
            failCount++;
            continue;
        }
        
        // Craft the item
        if (recipeType === 'potion') {
            craftPotion(recipeName);
        } else if (recipeType === 'gear') {
            craftGear(recipeName);
        } else if (recipeType === 'item') {
            craftItem(recipeName);
        }
        successCount++;
    }
    
    // Show summary notification
    const notification = document.getElementById('itemSpawnNotification');
    if (failCount > 0) {
        notification.textContent = `⚗️ Crafted ${successCount}x ${recipeName}! (${failCount} failed - insufficient materials)`;
    } else {
        notification.textContent = `⚗️ Successfully crafted ${successCount}x ${recipeName}!`;
    }
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 4000);
}

// Insta-craft function (instant crafting without animation)
function instaCraft(recipeName, recipeType) {
    let recipe;
    let craftFunction;
    
    if (recipeType === 'potion') {
        recipe = POTION_RECIPES.find(r => r.name === recipeName);
        craftFunction = () => craftPotion(recipeName);
    } else if (recipeType === 'gear') {
        if (typeof gearData !== 'undefined' && gearData[recipeName]) {
            recipe = { ingredients: gearData[recipeName].recipe };
            craftFunction = () => craftGear(recipeName);
        }
    } else if (recipeType === 'item') {
        if (typeof ITEM_RECIPES !== 'undefined' && ITEM_RECIPES[recipeName]) {
            recipe = { ingredients: ITEM_RECIPES[recipeName].recipe };
            craftFunction = () => craftItem(recipeName);
        }
    }
    
    if (!recipe || !checkCanCraft(recipe)) return;
    
    // Disable button temporarily
    const craftButton = document.getElementById('craftButton');
    craftButton.disabled = true;
    craftButton.textContent = 'Crafting...';
    
    // Instant craft with minimal delay
    setTimeout(() => {
        craftFunction();
        // Close modal immediately
        document.getElementById('craftingModal').classList.remove('show');
    }, 100);
}

function craftPotion(recipeName) {
    const recipe = POTION_RECIPES.find(r => r.name === recipeName);
    if (!recipe || !checkCanCraft(recipe)) return;
    
    // Safety check for gameState
    if (typeof gameState === 'undefined' || !gameState || !gameState.inventory) {
        return;
    }
    
    // Check for Potion of Dupe effect
    let dupeBonus = 0;
    if (gameState.activePotions) {
        const dupePotion = gameState.activePotions.find(p => p.name === 'Potion of Dupe');
        if (dupePotion && Math.random() < dupePotion.dupeChance) {
            dupeBonus = 1;
        }
    }
    
    // Consume ingredients
    for (let [item, amount] of Object.entries(recipe.ingredients)) {
        consumeItem(item, amount);
    }
    
    // Add potion to inventory
    if (!gameState.inventory.potions[recipeName]) {
        gameState.inventory.potions[recipeName] = { count: 0 };
    }
    gameState.inventory.potions[recipeName].count += 1 + dupeBonus;
    
    // Track potion discovery in codex
    if (typeof discoverCodexEntry === 'function') {
        discoverCodexEntry('potions', recipeName);
    }
    
    // Track achievements
    if (typeof gameState.achievements !== 'undefined' && gameState.achievements.stats) {
        const stats = gameState.achievements.stats;
        stats.potionsCrafted = (stats.potionsCrafted || 0) + (1 + dupeBonus);
        stats.craftsMade = (stats.craftsMade || 0) + (1 + dupeBonus);
        
        // Track daily crafts
        stats.dailyCraftCountToday = (stats.dailyCraftCountToday || 0) + (1 + dupeBonus);
        
        // Track unique potions crafted
        if (!stats.uniquePotionsCraftedList) stats.uniquePotionsCraftedList = [];
        if (!stats.uniquePotionsCraftedList.includes(recipeName)) {
            stats.uniquePotionsCraftedList.push(recipeName);
            stats.uniquePotionsCraftedCount = stats.uniquePotionsCraftedList.length;
        }
    }
    
    // Track leaderboard stats
    if (window.leaderboardStats) {
        window.leaderboardStats.stats.totalItemsCrafted += (1 + dupeBonus);
        window.leaderboardStats.stats.totalPotionsUsed++; // Will be decremented when actually used
        window.leaderboardStats.saveStats();
        
        // Track specific potion types
        if (recipeName.includes('Darklight')) {
            stats.darklightCraftsCount = (stats.darklightCraftsCount || 0) + (1 + dupeBonus);
        }
        
        // Check craft milestones
        if (stats.craftsMade >= 1000000) {
            stats.millionCraftsDone = true;
        }
        
        if (typeof checkAchievements === 'function') {
            checkAchievements();
        }
    }
    
    // Update UI
    updateInventoryDisplay();
    updateRecipesList();
    saveGameState();
    
    // Close modal
    document.getElementById('craftingModal').classList.remove('show');
    
    // Show notification
    const notification = document.getElementById('itemSpawnNotification');
    if (dupeBonus > 0) {
        notification.textContent = `⚗️ Crafted ${recipeName}! Duplicated! ✨`;
        notification.classList.add('dupe-success');
    } else {
        notification.textContent = `⚗️ Crafted ${recipeName}!`;
    }
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
        if (dupeBonus > 0) {
            notification.classList.remove('dupe-success');
        }
    }, 3000);
}

function craftGear(gearName) {
    if (typeof gearData === 'undefined' || !gearData[gearName]) return;
    
    const recipe = {
        name: gearName,
        ingredients: gearData[gearName].recipe
    };
    
    if (!checkCanCraft(recipe)) return;
    
    // Safety check for gameState
    if (typeof gameState === 'undefined' || !gameState || !gameState.inventory) {
        return;
    }
    
    // Check for Potion of Dupe effect
    let dupeBonus = 0;
    if (gameState.activePotions) {
        const dupePotion = gameState.activePotions.find(p => p.name === 'Potion of Dupe');
        if (dupePotion && Math.random() < dupePotion.dupeChance) {
            dupeBonus = 1;
        }
    }
    
    // Consume ingredients
    for (let [item, amount] of Object.entries(recipe.ingredients)) {
        consumeItem(item, amount);
    }
    
    // Add gear to inventory
    if (!gameState.inventory.gears) {
        gameState.inventory.gears = {};
    }
    if (!gameState.inventory.gears[gearName]) {
        gameState.inventory.gears[gearName] = { count: 0, tier: gearData[gearName].tier };
    }
    gameState.inventory.gears[gearName].count += 1 + dupeBonus;
    
    // Track gear discovery in codex
    if (typeof discoverCodexEntry === 'function') {
        discoverCodexEntry('gears', gearName);
    }
    
    // Track achievements
    if (typeof gameState.achievements !== 'undefined' && gameState.achievements.stats) {
        gameState.achievements.stats.gearsCrafted = (gameState.achievements.stats.gearsCrafted || 0) + (1 + dupeBonus);
        gameState.achievements.stats.craftsMade = (gameState.achievements.stats.craftsMade || 0) + (1 + dupeBonus);
        
        // Track highest gear tier crafted
        const gearTier = gearData[gearName].tier || 1;
        if (gearTier > (gameState.achievements.stats.highestGearTierCrafted || 0)) {
            gameState.achievements.stats.highestGearTierCrafted = gearTier;
        }
        
        if (typeof checkAchievements === 'function') {
            checkAchievements();
        }
    }
    
    // Track leaderboard stats
    if (window.leaderboardStats) {
        window.leaderboardStats.stats.totalItemsCrafted += (1 + dupeBonus);
        window.leaderboardStats.stats.totalGearCrafted += (1 + dupeBonus);
        window.leaderboardStats.saveStats();
    }
    
    // Update UI
    updateInventoryDisplay();
    updateRecipesList();
    saveGameState();
    
    // Close modal
    document.getElementById('craftingModal').classList.remove('show');
    
    // Show notification
    const notification = document.getElementById('itemSpawnNotification');
    if (dupeBonus > 0) {
        notification.textContent = `⚙️ Crafted ${gearName}! Duplicated! ✨`;
        notification.classList.add('dupe-success');
    } else {
        notification.textContent = `⚙️ Crafted ${gearName}!`;
    }
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
        if (dupeBonus > 0) {
            notification.classList.remove('dupe-success');
        }
    }, 3000);
}

function craftItem(itemName) {
    if (typeof ITEM_RECIPES === 'undefined' || !ITEM_RECIPES[itemName]) return;
    
    const recipe = {
        name: itemName,
        ingredients: ITEM_RECIPES[itemName].recipe
    };
    
    if (!checkCanCraft(recipe)) return;
    
    // Safety check for gameState
    if (typeof gameState === 'undefined' || !gameState || !gameState.inventory) {
        return;
    }
    
    // Check for Potion of Dupe effect
    let dupeBonus = 0;
    if (gameState.activePotions) {
        const dupePotion = gameState.activePotions.find(p => p.name === 'Potion of Dupe');
        if (dupePotion && Math.random() < dupePotion.dupeChance) {
            dupeBonus = 1;
        }
    }
    
    // Consume ingredients
    for (let [item, amount] of Object.entries(recipe.ingredients)) {
        consumeItem(item, amount);
    }
    
    // Add item to inventory
    if (!gameState.inventory.items) {
        gameState.inventory.items = {};
    }
    if (!gameState.inventory.items[itemName]) {
        gameState.inventory.items[itemName] = { count: 0, icon: '📦' };
    }
    gameState.inventory.items[itemName].count += 1 + dupeBonus;
    
    // Track leaderboard stats
    if (window.leaderboardStats) {
        window.leaderboardStats.stats.totalItemsCrafted += (1 + dupeBonus);
        window.leaderboardStats.saveStats();
    }
    
    // Track achievements
    if (typeof gameState.achievements !== 'undefined' && gameState.achievements.stats) {
        gameState.achievements.stats.itemsCrafted = (gameState.achievements.stats.itemsCrafted || 0) + (1 + dupeBonus);
        gameState.achievements.stats.craftsMade = (gameState.achievements.stats.craftsMade || 0) + (1 + dupeBonus);
    }
    
    // Update UI
    updateInventoryDisplay();
    updateRecipesList();
    saveGameState();
    
    // Close modal
    document.getElementById('craftingModal').classList.remove('show');
    
    // Show notification
    const notification = document.getElementById('itemSpawnNotification');
    if (dupeBonus > 0) {
        notification.textContent = `📦 Crafted ${itemName}! Duplicated! ✨`;
        notification.classList.add('dupe-success');
    } else {
        notification.textContent = `📦 Crafted ${itemName}!`;
    }
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
        if (dupeBonus > 0) {
            notification.classList.remove('dupe-success');
        }
    }, 3000);
}

function consumeItem(itemName, amount) {
    // Safety check for gameState
    if (typeof gameState === 'undefined' || !gameState || !gameState.inventory) {
        return;
    }
    
    // Check for Potion of Efficiency - chance to save materials
    if (gameState.specialEffects && gameState.specialEffects.efficiencyActive && gameState.specialEffects.materialSaveChance) {
        if (Math.random() < gameState.specialEffects.materialSaveChance) {
            if (typeof showNotification === 'function') {
                showNotification(`⚡ Efficiency: ${itemName} saved!`, 'success');
            }
            
            // Track achievement progress
            if (typeof incrementAchievementProgress === 'function') {
                incrementAchievementProgress('materials_saved', 1);
            }
            
            return; // Don't consume the material
        }
    }
    
    // Check items
    if (gameState.inventory.items[itemName]) {
        gameState.inventory.items[itemName].count -= amount;
        if (gameState.inventory.items[itemName].count <= 0) {
            delete gameState.inventory.items[itemName];
        }
        return;
    }
    
    // Check auras
    if (gameState.inventory.auras[itemName]) {
        gameState.inventory.auras[itemName].count -= amount;
        if (gameState.inventory.auras[itemName].count <= 0) {
            delete gameState.inventory.auras[itemName];
        }
        return;
    }
    
    // Check potions
    if (gameState.inventory.potions[itemName]) {
        gameState.inventory.potions[itemName].count -= amount;
        if (gameState.inventory.potions[itemName].count <= 0) {
            delete gameState.inventory.potions[itemName];
        }
        return;
    }
    
    // Check gears
    if (gameState.inventory.gears && gameState.inventory.gears[itemName]) {
        gameState.inventory.gears[itemName].count -= amount;
        if (gameState.inventory.gears[itemName].count <= 0) {
            delete gameState.inventory.gears[itemName];
        }
        return;
    }
}

// Add some starter items for testing
function addStarterItems() {
    // Safety check for gameState
    if (typeof gameState === 'undefined' || !gameState || !gameState.inventory) {
        return;
    }
    
    // Add potions
    const starterPotions = [
        { name: "Lucky Potion", count: 100 },
        { name: "Speed Potion", count: 100 }
    ];
    
    for (let potion of starterPotions) {
        if (!gameState.inventory.potions[potion.name]) {
            gameState.inventory.potions[potion.name] = { count: 0 };
        }
        gameState.inventory.potions[potion.name].count += potion.count;
    }
    
    // Add items
    const starterItems = [
        { name: "Darklight Shard", count: 5, icon: "💎" }
    ];
    
    for (let item of starterItems) {
        if (!gameState.inventory.items[item.name]) {
            gameState.inventory.items[item.name] = { count: 0, icon: item.icon };
        }
        gameState.inventory.items[item.name].count += item.count;
    }
    
    updateInventoryDisplay();
    updateRecipesList();
    saveGameState();
}

// Add button to get starter items (for testing)
window.addEventListener('DOMContentLoaded', () => {
    // Wait for gameState to be available
    const checkGameState = () => {
        if (typeof gameState !== 'undefined' && gameState && gameState.inventory) {
            // Check if this is first time playing
            if (gameState.totalRolls === 0 && Object.keys(gameState.inventory.items).length === 0) {
                setTimeout(() => {
                    if (confirm('Welcome to Sol\'s RNG! Would you like some starter items to begin crafting?')) {
                        addStarterItems();
                    }
                }, 1000);
            }
        } else {
            // gameState not ready yet, check again in 100ms
            setTimeout(checkGameState, 100);
        }
    };
    
    checkGameState();
    
    // Setup modal close button
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('craftingModal').classList.remove('show');
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('craftingModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
    
    // Initialize auto-craft system
    initAutoCraftSystem();
    
    // Initialize auto-potion system
    initAutoPotionSystem();
});

// Auto-craft system functions
function initAutoCraftSystem() {
    // Load saved state
    if (gameState.autoCraft === undefined) {
        gameState.autoCraft = {
            enabled: false,
            unlocked: false
        };
    }
    autoCraftEnabled = gameState.autoCraft.enabled || false;
    
    // Check if unlocked
    checkAutoCraftUnlock();
    
    // Start auto-craft interval if enabled
    if (autoCraftEnabled && gameState.autoCraft.unlocked) {
        startAutoCraftInterval();
    }
}

function startAutoCraftInterval() {
    if (autoCraftInterval) return; // Already running
    
    // Run auto-craft every 5 seconds
    autoCraftInterval = setInterval(() => {
        if (autoCraftEnabled && gameState.autoCraft.unlocked) {
            autoCraftAndEquip();
        }
    }, 5000);
    
    console.log('🔧 Auto-craft interval started');
}

function stopAutoCraftInterval() {
    if (autoCraftInterval) {
        clearInterval(autoCraftInterval);
        autoCraftInterval = null;
        console.log('⏸️ Auto-craft interval stopped');
    }
}

function checkAutoCraftUnlock() {
    if (!gameState.autoCraft.unlocked && gameState.totalRolls >= AUTO_CRAFT_UNLOCK_ROLLS) {
        gameState.autoCraft.unlocked = true;
        showNotification(`🎉 AUTO-CRAFT UNLOCKED! You can now auto-craft and equip the best gear!`);
        saveGameState();
    }
}

function getBestCraftableGear() {
    if (!gearData) {
        console.log('🔧 Auto-craft: gearData not loaded');
        return null;
    }
    
    let bestGear = null;
    let bestScore = -1;
    let checkedCount = 0;
    let craftableCount = 0;
    
    for (const [gearName, gearInfo] of Object.entries(gearData)) {
        if (!gearInfo.recipe) continue;
        checkedCount++;
        
        // Check if we can craft it
        const recipe = { name: gearName, ingredients: gearInfo.recipe };
        if (!checkCanCraft(recipe)) continue;
        craftableCount++;
        
        // Calculate gear score - TIER is the most important factor!
        // Tier bonus (heavily weighted so highest tier always wins)
        const tierValues = {
            1: 100, 2: 1000, 3: 10000, 4: 50000, 5: 100000,
            6: 200000, 7: 400000, 8: 800000, 9: 1600000, 10: 3200000,
            'Special': 2000000
        };
        let score = tierValues[gearInfo.tier] || 0;
        
        // Add stats as minor tie-breakers (same tier = compare stats)
        if (gearInfo.effects) {
            score += (gearInfo.effects.luck || 0) * 1.5; // Luck weighted higher
            score += (gearInfo.effects.rollSpeed || 0) * 1.0;
            if (gearInfo.effects.special) score += 500; // Special effects are valuable
        }
        
        // Check if better than current equipped
        const slot = gearInfo.hand;
        const currentGear = gameState.equipped[slot];
        if (currentGear && gearData[currentGear]) {
            const currentInfo = gearData[currentGear];
            let currentScore = tierValues[currentInfo.tier] || 0;
            if (currentInfo.effects) {
                currentScore += (currentInfo.effects.luck || 0) * 1.5;
                currentScore += (currentInfo.effects.rollSpeed || 0) * 1.0;
                if (currentInfo.effects.special) currentScore += 500;
            }
            
            // Only craft if better than current
            if (score <= currentScore) continue;
        }
        
        if (score > bestScore) {
            bestScore = score;
            bestGear = { name: gearName, info: gearInfo, score: score };
        }
    }
    
    console.log(`🔧 Auto-craft scan: Checked ${checkedCount} gears, ${craftableCount} craftable, best: ${bestGear ? `${bestGear.name} (Tier ${bestGear.info.tier}, score: ${bestGear.score})` : 'none'}`);
    return bestGear;
}

function autoCraftAndEquip() {
    if (!autoCraftEnabled || !gameState.autoCraft.unlocked) return;
    
    const bestGear = getBestCraftableGear();
    if (!bestGear) {
        console.log('🔧 Auto-craft: No better craftable gear available');
        return;
    }
    
    console.log(`🔧 Auto-craft: Crafting ${bestGear.name} (Tier ${bestGear.info.tier}, score: ${bestGear.score})`);
    
    // Craft the gear
    const recipe = {
        name: bestGear.name,
        ingredients: bestGear.info.recipe
    };
    
    // Consume ingredients
    for (let [item, amount] of Object.entries(recipe.ingredients)) {
        consumeItem(item, amount);
    }
    
    // Add gear to inventory
    if (!gameState.inventory.gears) {
        gameState.inventory.gears = {};
    }
    if (!gameState.inventory.gears[bestGear.name]) {
        gameState.inventory.gears[bestGear.name] = { count: 0, tier: bestGear.info.tier };
    }
    gameState.inventory.gears[bestGear.name].count += 1;
    
    // Auto-equip
    const slot = bestGear.info.hand;
    if (gameState.equipped[slot]) {
        // Unequip current gear
        const oldGear = gameState.equipped[slot];
        if (!gameState.inventory.gears[oldGear]) {
            gameState.inventory.gears[oldGear] = { count: 0 };
        }
        gameState.inventory.gears[oldGear].count++;
    }
    
    gameState.equipped[slot] = bestGear.name;
    gameState.inventory.gears[bestGear.name].count--;
    
    // Track in codex
    if (typeof discoverCodexEntry === 'function') {
        discoverCodexEntry('gears', bestGear.name);
    }
    
    // Update UI
    if (typeof updateEquipmentDisplay === 'function') updateEquipmentDisplay();
    if (typeof recalculateStats === 'function') recalculateStats();
    updateInventoryDisplay();
    saveGameState();
    
    showNotification(`🔧 AUTO-CRAFT: Crafted and equipped ${bestGear.name}!`);
}

function toggleAutoCraft() {
    if (!gameState.autoCraft.unlocked) {
        showNotification(`❌ Auto-craft unlocks at ${AUTO_CRAFT_UNLOCK_ROLLS.toLocaleString()} rolls! (Current: ${gameState.totalRolls.toLocaleString()})`);
        return;
    }
    
    autoCraftEnabled = !autoCraftEnabled;
    gameState.autoCraft.enabled = autoCraftEnabled;
    saveGameState();
    
    // Start or stop the interval
    if (autoCraftEnabled) {
        startAutoCraftInterval();
        // Try to craft immediately when enabled
        autoCraftAndEquip();
    } else {
        stopAutoCraftInterval();
    }
    
    showNotification(autoCraftEnabled ? '✅ Auto-craft ENABLED!' : '⏸️ Auto-craft DISABLED');
    updateAutoCraftButton();
}

function updateAutoCraftButton() {
    const button = document.getElementById('autoCraftToggle');
    if (!button) return;
    
    if (!gameState.autoCraft.unlocked) {
        button.textContent = `🔒 Auto-Craft (${gameState.totalRolls.toLocaleString()}/${AUTO_CRAFT_UNLOCK_ROLLS.toLocaleString()} rolls)`;
        button.style.background = '#555';
        button.style.cursor = 'not-allowed';
    } else {
        button.textContent = autoCraftEnabled ? '⚙️ Auto-Craft: ON' : '⚙️ Auto-Craft: OFF';
        button.style.background = autoCraftEnabled ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
        button.style.cursor = 'pointer';
    }
}

// Make functions global
window.toggleAutoCraft = toggleAutoCraft;
window.autoCraftAndEquip = autoCraftAndEquip;
window.checkAutoCraftUnlock = checkAutoCraftUnlock;
window.updateAutoCraftButton = updateAutoCraftButton;

// ========================================
// AUTO-POTION SYSTEM
// ========================================

function initAutoPotionSystem() {
    // Load saved state
    if (gameState.autoPotion === undefined) {
        gameState.autoPotion = {
            enabled: false,
            unlocked: false
        };
    }
    autoPotionEnabled = gameState.autoPotion.enabled || false;
    
    // Check if unlocked
    checkAutoPotionUnlock();
    
    // Start auto-potion interval if enabled
    if (autoPotionEnabled && gameState.autoPotion.unlocked) {
        startAutoPotionInterval();
    }
}

function startAutoPotionInterval() {
    if (autoPotionInterval) return; // Already running
    
    // Run auto-potion every 10 seconds (less frequent than gear to avoid spam)
    autoPotionInterval = setInterval(() => {
        if (autoPotionEnabled && gameState.autoPotion.unlocked) {
            autoCraftAndUsePotion();
        }
    }, 10000);
    
    console.log('🧪 Auto-potion interval started');
}

function stopAutoPotionInterval() {
    if (autoPotionInterval) {
        clearInterval(autoPotionInterval);
        autoPotionInterval = null;
        console.log('⏸️ Auto-potion interval stopped');
    }
}

function checkAutoPotionUnlock() {
    if (!gameState.autoPotion.unlocked && gameState.totalRolls >= AUTO_POTION_UNLOCK_ROLLS) {
        gameState.autoPotion.unlocked = true;
        showNotification(`🎉 AUTO-POTION UNLOCKED! Automatically craft and use the best potions!`);
        saveGameState();
    }
}

function getBestCraftablePotion() {
    if (!POTION_RECIPES) return null;
    
    let bestPotion = null;
    let bestScore = -1;
    
    console.log(`🧪 Auto-potion: Searching for best craftable potion...`);
    
    // Get currently active effects to avoid wasting potions
    const activeEffects = gameState.activeEffects || [];
    const activePotionNames = new Set(activeEffects.map(e => e.name));
    
    // Check current time and biome for conditional potions
    const currentTime = gameState.timeOfDay || 'day';
    const currentBiome = gameState.currentBiome || 'grass';
    const totalRolls = gameState.totalRolls || 0;
    
    // COMPREHENSIVE POTION SCORING SYSTEM
    // Score each potion based on multiple factors
    const potionScores = {
        // ====== TIER S: ULTRA POWERFUL (Score: 1000+) ======
        'Forbidden Potion III': 1500,  // +1350% luck, +75% speed, 3 hours
        'Forbidden Potion II': 1400,   // +325% luck, +25% speed, 1 hour
        'Godly Potion (Hades)': 1300,  // +300% luck, 4 hours
        'Godly Potion (Zeus)': 1250,   // +200% luck, +30% speed, 4 hours
        'Godly Potion (Poseidon)': 1200, // +75% speed, 4 hours
        
        // ====== TIER A: EXCELLENT (Score: 700-999) ======
        'Zombie Potion': 950,          // +150% luck, 10 min
        'Jewelry Potion': 900,         // +120% luck, 10 min
        'Raid Potion': 850,            // +100% luck, 30 min
        'Gladiator Potion': 825,       // +100% luck, 10 min
        'Hwachae': 800,                // +100% luck, +25% speed, 1 hour
        'Santa Potion': 775,           // +100% luck, +25% speed, 10 min
        'Fortune Potion III': 750,     // +100% luck, 5 min
        'Fortune Potion II': 725,      // +75% luck, 5 min
        'Fortune Potion I': 700,       // +50% luck, 5 min
        
        // ====== TIER B: GREAT (Score: 400-699) ======
        'Forbidden Potion I': 680,     // +70% luck, +10% speed, 30 min
        'Nightowl\'s Brew': 650,       // +150% luck (night only)
        'Sunseeker\'s Tonic': 650,     // +150% luck (day only)
        'Diver Potion': 625,           // +40% speed, 10 min
        'Rage Potion': 600,            // +35% speed, 10 min
        'Haste Potion III': 575,       // +30% speed, 5 min
        'Haste Potion II': 550,        // +25% speed, 5 min
        'Haste Potion I': 525,         // +20% speed, 5 min
        'Rainbow Potion': 500,         // +50% luck, +25% speed, guarantees Epic+
        'Lucky Potion XL': 475,        // +45% luck, 3 min
        'Speed Potion XL': 450,        // +18% speed, 3 min
        'Potion of Deliberation': 425, // +50% luck, -50% speed, 1 min
        'Mixed Potion': 400,           // +25% luck, +10% speed, 3 min
        
        // ====== TIER C: GOOD UTILITY (Score: 200-399) ======
        'Quantum Potion': 380,         // 1% chain roll chance, 20 min
        'Aura Magnet Potion': 370,     // +200% luck for Legendary+, 15 min
        'Mirror Potion': 360,          // 50% dupe chance, 3 rolls
        'Potion of Dupe': 350,         // 50% craft dupe, 10 min
        'Phoenix Potion': 340,         // Safety net for bad rolls
        'Lucky Block Potion': 330,     // 5% bonus spawn, 10 min
        'Potion of Adaptation': 320,   // +100% luck in biome, 3 min
        'Potion of Focus (Mythic)': 310, // +200% luck for Mythic
        'Potion of Focus (Legendary)': 300, // +200% luck for Legendary
        'Time Warp Potion': 290,       // 75% cooldown reduction
        'Potion of Momentum': 280,     // Stacking luck bonus
        'Potion of Collector': 270,    // +5% per unique aura
        'Potion of Mastery': 260,      // +1% per 1000 rolls
        'Potion of the Hour': 250,     // +10% per minute played
        'Potion of Patience': 240,     // 2x luck after 30s wait
        'Potion of Exploration': 230,  // +200% on biome change
        'Potion of Haste': 220,        // +50% speed, -25% luck
        'Breakthrough Catalyst': 210,  // 2x breakthrough chance
        'Chaos Potion': 200,           // Random effects
        
        // ====== TIER D: SITUATIONAL (Score: 100-199) ======
        'Potion of Variety': 190,      // +300% after 5 different auras
        'Potion of Consistency': 180,  // +50% luck on tier repeat
        'Potion of Extremes': 170,     // Removes commons, -50% luck
        'Gambler\'s Elixir': 160,      // 50/50 double or halve
        'All-or-Nothing Brew': 150,    // Guaranteed Epic+ but risky
        'Potion of Sacrifice': 140,    // Consume 5 auras
        'Potion of Efficiency': 130,   // 20% save materials
        'Alchemist\'s Insight': 120,   // Preview next 5 rolls
        'Potion of Clarity': 110,      // See next rarity value
        'Potion of Hindsight': 100,    // Reroll last aura
        
        // ====== TIER E: BASIC (Score: 50-99) ======
        'Lucky Potion L': 90,          // +35% luck, 2 min
        'Speed Potion L': 80,          // +15% speed, 2 min
        'Lucky Potion': 70,            // +25% luck, 1 min
        'Speed Potion': 60,            // +10% speed, 1 min
        
        // ====== TIER F: BEGINNER ONLY (Score: 50) ======
        'Potion of the Beginner': 50,  // Only <100 rolls
        
        // BLACKLIST: Never auto-craft (too expensive or end-game)
        'Potion of Bound': -1,
        'Heavenly Potion': -1,
        'Godlike Potion': -1,
        'Oblivion Potion': -1,
        'Pump Kings Blood': -1,
        'Voidheart': -1,
        'Transcendent Potion': -1,
        'Warp Potion': -1,
        '???': -1,
        'Curse Breaker Potion': -1,
        'Jackpot Potion': -1
    };
    
    // Evaluate all craftable potions
    for (const recipe of POTION_RECIPES) {
        // Skip base potions
        if (recipe.isBase) continue;
        
        // Skip blacklisted potions
        if (potionScores[recipe.name] === -1) continue;
        
        // Check if we can craft it
        if (!checkCanCraft(recipe)) continue;
        
        // Get base score
        let score = potionScores[recipe.name] || 50;
        
        // === PENALTY: Already active ===
        if (activePotionNames.has(recipe.name)) {
            // If it's a duration potion, allow extension but lower priority
            if (recipe.duration && !recipe.oneRoll) {
                score *= 0.3; // 70% penalty for extension
            } else {
                score = 0; // Don't use one-time potions that are active
                continue;
            }
        }
        
        // === PENALTY: Time-conditional potions ===
        if (recipe.nightMode && currentTime !== 'night') {
            score = 0; // Can't use
            continue;
        }
        if (recipe.dayMode && currentTime !== 'day') {
            score = 0; // Can't use
            continue;
        }
        
        // === PENALTY: Beginner potion ===
        if (recipe.beginnerMode && totalRolls >= 100) {
            score = 0; // Can't use
            continue;
        }
        
        // === BONUS: Similar effect not active ===
        // Bonus for luck potions when no luck buff active
        const hasLuckBuff = activeEffects.some(e => e.luckBoost && e.luckBoost > 0);
        const hasSpeedBuff = activeEffects.some(e => e.speedBoost && e.speedBoost > 0);
        
        if (recipe.luckBoost > 0 && !hasLuckBuff) {
            score *= 1.3; // 30% bonus
        }
        if (recipe.speedBoost > 0 && !hasSpeedBuff) {
            score *= 1.2; // 20% bonus
        }
        
        // === BONUS: Special effects ===
        if (recipe.removeCooldown) {
            const hasRemovalActive = activeEffects.some(e => e.removeCooldown);
            if (!hasRemovalActive) {
                score *= 1.5; // Cooldown removal is valuable
            } else {
                score = 0; // Already have one
                continue;
            }
        }
        
        // === BONUS: Time-appropriate potions ===
        if ((recipe.nightMode && currentTime === 'night') || 
            (recipe.dayMode && currentTime === 'day')) {
            score *= 1.4; // Use time-specific potions when appropriate
        }
        
        // === BONUS: Utility potions with no active version ===
        if (recipe.dupeChance || recipe.mirrorChance || recipe.quantumChance || 
            recipe.bonusSpawnChance || recipe.breakthroughMode) {
            const hasUtilityActive = activeEffects.some(e => 
                e.dupeChance || e.mirrorChance || e.quantumChance || 
                e.bonusSpawnChance || e.breakthroughMode
            );
            if (!hasUtilityActive) {
                score *= 1.25; // Utility potions are valuable
            }
        }
        
        // Track best potion
        if (score > bestScore) {
            bestScore = score;
            bestPotion = recipe;
        }
    }
    
    if (bestPotion) {
        console.log(`✅ Auto-potion: Best craftable is ${bestPotion.name} (score: ${bestScore.toFixed(1)})`);
        
        // Log why this potion was chosen
        if (bestScore > 1000) {
            console.log(`   → Ultra powerful potion selected!`);
        } else if (!activePotionNames.has(bestPotion.name)) {
            console.log(`   → Fresh effect, not currently active`);
        }
    } else {
        console.log('🧪 Auto-potion: No suitable potion to craft');
    }
    
    return bestPotion;
}

function autoCraftAndUsePotion() {
    if (!autoPotionEnabled || !gameState.autoPotion.unlocked) return;
    
    // Try to craft and use up to 3 potions per cycle (more aggressive!)
    let craftedCount = 0;
    const maxPotionsPerCycle = 3;
    
    for (let i = 0; i < maxPotionsPerCycle; i++) {
        const bestPotion = getBestCraftablePotion();
        if (!bestPotion) {
            if (craftedCount === 0) {
                console.log('🧪 Auto-potion: No suitable potion to craft (low resources)');
            }
            break;
        }
        
        console.log(`🧪 Auto-potion: Crafting ${bestPotion.name} (${i+1}/${maxPotionsPerCycle})`);
        
        // Craft the potion
        const recipe = bestPotion;
        
        // Consume ingredients
        for (let [item, amount] of Object.entries(recipe.ingredients)) {
            consumeItem(item, amount);
        }
        
        // Add potion to inventory
        if (!gameState.inventory.potions) {
            gameState.inventory.potions = {};
        }
        if (!gameState.inventory.potions[recipe.name]) {
            gameState.inventory.potions[recipe.name] = { count: 0 };
        }
        gameState.inventory.potions[recipe.name].count++;
        
        // Track in codex
        if (typeof discoverCodexEntry === 'function') {
            discoverCodexEntry('potions', recipe.name);
        }
        
        // Use the potion immediately
        if (typeof usePotion === 'function') {
            usePotion(recipe.name);
        }
        
        craftedCount++;
    }
    
    if (craftedCount > 0) {
        showNotification(`🧪 AUTO-POTION: Crafted and used ${craftedCount} potion${craftedCount > 1 ? 's' : ''}!`);
    }
    
    // Update UI
    updateInventoryDisplay();
    if (typeof recalculateStats === 'function') recalculateStats();
    saveGameState();
}

function toggleAutoPotion() {
    if (!gameState.autoPotion.unlocked) {
        showNotification(`❌ Auto-potion unlocks at ${AUTO_POTION_UNLOCK_ROLLS.toLocaleString()} rolls! (Current: ${gameState.totalRolls.toLocaleString()})`);
        return;
    }
    
    autoPotionEnabled = !autoPotionEnabled;
    gameState.autoPotion.enabled = autoPotionEnabled;
    saveGameState();
    
    // Start or stop the interval
    if (autoPotionEnabled) {
        startAutoPotionInterval();
        // Try to craft immediately when enabled
        autoCraftAndUsePotion();
    } else {
        stopAutoPotionInterval();
    }
    
    showNotification(autoPotionEnabled ? '✅ Auto-potion ENABLED!' : '⏸️ Auto-potion DISABLED');
    updateAutoPotionButton();
}

function updateAutoPotionButton() {
    const button = document.getElementById('autoPotionToggle');
    if (!button) return;
    
    if (!gameState.autoPotion.unlocked) {
        button.textContent = `🔒 Auto-Potion (${gameState.totalRolls.toLocaleString()}/${AUTO_POTION_UNLOCK_ROLLS.toLocaleString()} rolls)`;
        button.style.background = '#555';
        button.style.cursor = 'not-allowed';
    } else {
        button.textContent = autoPotionEnabled ? '🧪 Auto-Potion: ON' : '🧪 Auto-Potion: OFF';
        button.style.background = autoPotionEnabled ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
        button.style.cursor = 'pointer';
    }
}

// Make functions global
window.toggleAutoPotion = toggleAutoPotion;
window.autoCraftAndUsePotion = autoCraftAndUsePotion;
window.checkAutoPotionUnlock = checkAutoPotionUnlock;
window.updateAutoPotionButton = updateAutoPotionButton;
