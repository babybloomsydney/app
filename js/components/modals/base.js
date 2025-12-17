/**
 * MODAL MANAGER (Defensive Version)
 * Restored to match your original logic, plus safety stubs for main.js compatibility.
 */

const Modals = {
    // --- 1. Your Original Core Logic ---

    open: (name) => {
        // Hide all existing modals first
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        
        // Find the modal by ID (e.g. "planModal")
        const target = document.getElementById(name + 'Modal');
        if (target) {
            target.classList.remove('hidden');
            
            // Trigger specific wizard inits if they exist
            if (name === 'plan' && typeof PlanWizard !== 'undefined') {
                PlanWizard.init();
            }
            if (name === 'log' && typeof LogWizard !== 'undefined') {
                LogWizard.init();
            }
        } else {
            console.warn(`Modal ID '${name}Modal' not found.`);
        }
    },
    
    close: () => {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    },

    // --- 2. Safety Stubs (To stop main.js from crashing) ---
    // These functions might be called by main.js during startup.
    
    initLog: () => {
        // If LogWizard exists, initialize it. If not, do nothing.
        if (typeof LogWizard !== 'undefined' && LogWizard.init) {
            LogWizard.init();
        }
    },

    renderAccordion: (items) => {
        // Return empty string to satisfy any render calls
        return "";
    }
};
