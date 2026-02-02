/**
 * DIARY WIZARD MANAGER
 * Handles navigation between Food and Sleep modes.
 */
const DiaryWizard = {
    state: { mode: null },

    init: () => {
        DiaryWizard.state.mode = null;
        
        // 1. Reset Inputs
        if(typeof FoodLog !== 'undefined' && FoodLog.reset) FoodLog.reset();
        if(typeof SleepLog !== 'undefined' && SleepLog.reset) SleepLog.reset();

        // 2. FORCE Navigation Reset
        DiaryWizard.toggleVisibility('diaryStep1', true);
        DiaryWizard.toggleVisibility('diaryStepFood', false);
        DiaryWizard.toggleVisibility('diaryStepSleep', false);
        
        // 3. Reset Header (Hide Back Button)
        const backBtn = document.getElementById('diaryBackBtn');
        const title = document.getElementById('diaryTitle');
        
        if(backBtn) backBtn.classList.add('hidden');
        if(title && typeof TXT !== 'undefined') title.innerText = TXT.COMPONENTS.MODALS.DIARY.HEADER;
    },

    goFood: () => { 
        DiaryWizard.state.mode = 'Food'; 
        DiaryWizard.toggleVisibility('diaryStep1', false);
        DiaryWizard.toggleVisibility('diaryStepFood', true);
        
        // Explicitly show back button
        DiaryWizard.updateHeader(TXT.COMPONENTS.MODALS.DIARY.HEADER_FOOD); 
        
        if(typeof FoodLog !== 'undefined') FoodLog.init();
    },
    
    goSleep: () => { 
        DiaryWizard.state.mode = 'Sleep'; 
        DiaryWizard.toggleVisibility('diaryStep1', false);
        DiaryWizard.toggleVisibility('diaryStepSleep', true);
        
        // Explicitly show back button
        DiaryWizard.updateHeader(TXT.COMPONENTS.MODALS.DIARY.HEADER_SLEEP); 
        
        if(typeof SleepLog !== 'undefined') SleepLog.init();
    },

    back: () => {
        DiaryWizard.init(); 
    },

    toggleVisibility: (id, show) => {
        const el = document.getElementById(id);
        if (!el) return console.warn(`DiaryWizard Error: Element '${id}' not found.`);
        if (show) el.classList.remove('hidden');
        else el.classList.add('hidden');
    },

    updateHeader: (txt) => {
        const backBtn = document.getElementById('diaryBackBtn');
        const title = document.getElementById('diaryTitle');
        
        if(backBtn) {
            backBtn.classList.remove('hidden');
            // Force flex display if it was hidden
            backBtn.style.display = 'flex'; 
        } else {
            console.error("DiaryWizard: Back Button NOT FOUND");
        }
        
        if(title) title.innerText = txt;
    }
};
