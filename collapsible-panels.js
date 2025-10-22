// Collapsible Panels System
// Makes all panels, sections, and equipment collapsible/expandable

// Store collapse states in localStorage
const COLLAPSE_STORAGE_KEY = 'solsrng_collapse_states';

// Get saved collapse states
function getCollapseStates() {
    const saved = localStorage.getItem(COLLAPSE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
}

// Save collapse state
function saveCollapseState(panelId, isCollapsed) {
    const states = getCollapseStates();
    states[panelId] = isCollapsed;
    localStorage.setItem(COLLAPSE_STORAGE_KEY, JSON.stringify(states));
}

// Toggle collapse for a panel
function togglePanelCollapse(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    
    const content = panel.querySelector('.collapsible-content');
    const toggleBtn = panel.querySelector('.collapse-toggle');
    
    if (!content || !toggleBtn) return;
    
    const isCollapsed = content.classList.contains('collapsed');
    
    if (isCollapsed) {
        content.classList.remove('collapsed');
        toggleBtn.textContent = '▼';
        toggleBtn.setAttribute('aria-label', 'Collapse');
        saveCollapseState(panelId, false);
    } else {
        content.classList.add('collapsed');
        toggleBtn.textContent = '▶';
        toggleBtn.setAttribute('aria-label', 'Expand');
        saveCollapseState(panelId, true);
    }
}

// Make a panel collapsible
function makeCollapsible(panel, title) {
    if (!panel) return;
    
    // Check if already made collapsible
    if (panel.querySelector('.collapse-toggle')) return;
    
    // Generate unique ID if not present
    if (!panel.id) {
        panel.id = 'collapsible-' + Math.random().toString(36).substr(2, 9);
    }
    
    const panelId = panel.id;
    
    // Find the title element (h2, h3, or create one) - only direct children
    let titleElement = panel.querySelector(':scope > h2, :scope > h3');
    
    // If no title found, try to extract from panel classes or create a generic one
    if (!titleElement) {
        titleElement = document.createElement('h3');
        
        if (title) {
            titleElement.textContent = title;
        } else {
            // Try to get title from panel class name
            const panelClasses = panel.className.split(' ');
            const panelClass = panelClasses.find(c => c.includes('-panel'));
            if (panelClass) {
                const name = panelClass.replace('-panel', '').replace(/-/g, ' ');
                titleElement.textContent = name.charAt(0).toUpperCase() + name.slice(1);
            } else {
                titleElement.textContent = 'Panel';
            }
        }
        
        panel.insertBefore(titleElement, panel.firstChild);
    }
    
    // Create collapse button
    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'collapse-toggle';
    collapseBtn.textContent = '▼';
    collapseBtn.setAttribute('aria-label', 'Collapse');
    collapseBtn.setAttribute('type', 'button');
    collapseBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        togglePanelCollapse(panelId);
    };
    
    // Create header container
    const headerContainer = document.createElement('div');
    headerContainer.className = 'collapsible-header';
    
    // Replace title with header container containing title and button
    titleElement.parentNode.insertBefore(headerContainer, titleElement);
    headerContainer.appendChild(titleElement);
    headerContainer.appendChild(collapseBtn);
    
    // Create content wrapper for ALL remaining content
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'collapsible-content';
    contentWrapper.setAttribute('data-panel-id', panelId);
    
    // Move ALL children (except header) into content wrapper
    // This includes tabs, buttons, divs, EVERYTHING
    while (panel.lastChild !== headerContainer) {
        if (panel.lastChild) {
            contentWrapper.appendChild(panel.lastChild);
        } else {
            break;
        }
    }
    
    // Reverse the order since we appended from the end
    const contentChildren = Array.from(contentWrapper.children).reverse();
    contentWrapper.innerHTML = '';
    contentChildren.forEach(child => contentWrapper.appendChild(child));
    
    // Add content wrapper to panel
    panel.appendChild(contentWrapper);
    
    // Restore saved state
    const savedStates = getCollapseStates();
    if (savedStates[panelId]) {
        contentWrapper.classList.add('collapsed');
        collapseBtn.textContent = '▶';
        collapseBtn.setAttribute('aria-label', 'Expand');
    }
}

// Initialize collapsible panels
function initCollapsiblePanels() {
    // Prevent multiple initializations
    if (document.body.hasAttribute('data-collapsible-initialized')) {
        return;
    }
    document.body.setAttribute('data-collapsible-initialized', 'true');
    
    // Make all main panels collapsible
    document.querySelectorAll('.panel').forEach(panel => {
        makeCollapsible(panel);
    });
    
    // Make equipment slots collapsible (only if not already done)
    const equipmentSlots = document.querySelector('.equipment-slots');
    if (equipmentSlots && !equipmentSlots.querySelector('.collapse-toggle')) {
        equipmentSlots.id = 'equipment-panel';
        makeCollapsible(equipmentSlots);
    }
    
    // Make active effects collapsible
    const activeEffects = document.getElementById('activeEffects');
    if (activeEffects && !activeEffects.querySelector('.collapse-toggle')) {
        makeCollapsible(activeEffects);
    }
    
    // Make quest tracker collapsible
    const questTracker = document.getElementById('questTracker');
    if (questTracker && !questTracker.querySelector('.collapse-toggle')) {
        makeCollapsible(questTracker);
    }
}

// Add keyboard shortcut (Ctrl+Shift+C to collapse all, Ctrl+Shift+E to expand all)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey) {
        if (e.key === 'C' || e.key === 'c') {
            // Collapse all
            e.preventDefault();
            document.querySelectorAll('.collapsible-content').forEach(content => {
                if (!content.classList.contains('collapsed')) {
                    const panel = content.closest('[id]');
                    if (panel) togglePanelCollapse(panel.id);
                }
            });
        } else if (e.key === 'E' || e.key === 'e') {
            // Expand all
            e.preventDefault();
            document.querySelectorAll('.collapsible-content').forEach(content => {
                if (content.classList.contains('collapsed')) {
                    const panel = content.closest('[id]');
                    if (panel) togglePanelCollapse(panel.id);
                }
            });
        }
    }
});

// Expose function globally for dynamic content
window.refreshCollapsiblePanels = function() {
    // Remove the initialization flag to allow re-initialization
    document.body.removeAttribute('data-collapsible-initialized');
    initCollapsiblePanels();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCollapsiblePanels);
} else {
    // Wait a bit for other scripts to load
    setTimeout(initCollapsiblePanels, 500);
}

// Re-check for new panels after QoL systems load (they add Roll History and Statistics panels)
setTimeout(() => {
    document.body.removeAttribute('data-collapsible-initialized');
    initCollapsiblePanels();
}, 3000);

// Final check after everything is loaded
setTimeout(() => {
    document.body.removeAttribute('data-collapsible-initialized');
    initCollapsiblePanels();
}, 5000);

// Watch for dynamically added content and re-wrap if needed
const observer = new MutationObserver((mutations) => {
    let needsRefresh = false;
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            // Check if added nodes are inside a collapsible panel
            if (node.nodeType === 1 && node.closest('.panel')) {
                const panel = node.closest('.panel');
                const contentWrapper = panel.querySelector('.collapsible-content');
                // If node was added outside the content wrapper, we need to fix it
                if (contentWrapper && !contentWrapper.contains(node) && !node.classList.contains('collapsible-header')) {
                    contentWrapper.appendChild(node);
                }
            }
        });
    });
});

// Start observing the document
observer.observe(document.body, {
    childList: true,
    subtree: true
});
