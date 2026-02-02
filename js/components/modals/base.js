/**
 * MODAL MANAGER (Base)
 * Handles opening/closing overlays and initializing specific wizards.
 */

const Modals = {
    // Generic Open
    open: (name) => {
        // 1. Hide all open modals
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        
        // 2. Show the target
        const target = document.getElementById(name + 'Modal');
        if (target) {
            target.classList.remove('hidden');
            
            // 3. Initialize specific logic if needed
            if (name === 'plan' && typeof PlanWizard !== 'undefined') {
                PlanWizard.init();
            }
            if (name === 'log' && typeof LogWizard !== 'undefined') {
                LogWizard.init();
            }
            // NEW: Initialize Diary Wizard (Critical for resetting state)
            if (name === 'diary' && typeof DiaryWizard !== 'undefined') {
                DiaryWizard.init();
            }
            
        } else {
            console.error(`Modal '${name}Modal' not found in HTML.`);
        }
    },
    
    // Generic Close
    close: () => {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    },

    // Safety stubs
    initLog: () => { if (typeof LogWizard !== 'undefined') LogWizard.init(); },
    renderAccordion: () => { return ""; }
};
