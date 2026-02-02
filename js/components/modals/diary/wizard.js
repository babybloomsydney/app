/**
 * DIARY WIZARD MANAGER
 * Handles navigation between Food and Sleep modes.
 * Fixes: Ensures navigation resets properly on close/back.
 */
const DiaryWizard = {
    state: { mode: null },

    init: () => {
        DiaryWizard.state.mode = null;
        
        // 1. Reset Sub-component Inputs (Safety Checked)
        if(typeof FoodLog !== 'undefined' && FoodLog.reset) FoodLog.reset();
        if(typeof SleepLog !== 'undefined' && SleepLog.reset) SleepLog.reset();

        // 2. FORCE NAVIGATION RESET
        // Explicitly hide sub-steps and show the main menu
        const steps = ['diaryStepFood', 'diaryStepSleep'];
        steps.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
        
        const startScreen = document.getElementById('diaryStep1');
        if (startScreen) startScreen.classList.remove('hidden');
        
        // 3. Reset Header (Hide Back Button)
        const backBtn = document.getElementById('diaryBackBtn');
        const title = document.getElementById('diaryTitle');
        
        if(backBtn) backBtn.classList.add('hidden');
        if(title && typeof TXT !== 'undefined') title.innerText = TXT.COMPONENTS.MODALS.DIARY.HEADER;
    },

    // --- NAVIGATION ACTIONS ---
    
    goFood: () => { 
        DiaryWizard.state.mode = 'Food'; 
        DiaryWizard.showStep('diaryStepFood'); 
        DiaryWizard.updateHeader(TXT.COMPONENTS.MODALS.DIARY.HEADER_FOOD); 
        if(typeof FoodLog !== 'undefined') FoodLog.init();
    },
    
    goSleep: () => { 
        DiaryWizard.state.mode = 'Sleep'; 
        DiaryWizard.showStep('diaryStepSleep'); 
        DiaryWizard.updateHeader(TXT.COMPONENTS.MODALS.DIARY.HEADER_SLEEP); 
        if(typeof SleepLog !== 'undefined') SleepLog.init();
    },

    back: () => {
        // Always return to the start screen
        DiaryWizard.init(); 
    },

    // --- HELPERS ---

    showStep: (activeId) => {
        // Hide all steps first
        const steps = ['diaryStep1', 'diaryStepFood', 'diaryStepSleep'];
        steps.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.classList.add('hidden');
        });
        
        // Show the active one
        const activeEl = document.getElementById(activeId);
        if(activeEl) activeEl.classList.remove('hidden');
    },

    updateHeader: (txt) => {
        const backBtn = document.getElementById('diaryBackBtn');
        const title = document.getElementById('diaryTitle');
        
        // Show Back Button since we are deep in a menu
        if(backBtn) backBtn.classList.remove('hidden');
        if(title) title.innerText = txt;
    }
};
