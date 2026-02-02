/**
 * DIARY WIZARD MANAGER
 * Handles navigation between Food and Sleep modes.
 * Mirrors logic from Observation Wizard.
 */
const DiaryWizard = {
    state: { mode: null },

    init: () => {
        DiaryWizard.state.mode = null;
        
        // 1. Reset Inputs
        if(typeof FoodLog !== 'undefined') FoodLog.reset();
        if(typeof SleepLog !== 'undefined') SleepLog.reset();

        // 2. Show Start Screen
        DiaryWizard.showStep('diaryStep1');
        
        // 3. Reset Header (Hide Back Button, Set Title)
        const backBtn = document.getElementById('diaryBackBtn');
        const title = document.getElementById('diaryTitle');
        if(backBtn) backBtn.classList.add('hidden');
        if(title) title.innerText = TXT.COMPONENTS.MODALS.DIARY.HEADER;
    },

    // Navigation Actions
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
        // Since Diary is only 1 level deep, Back always goes to Init (Step 1)
        DiaryWizard.init(); 
    },

    showStep: (activeId) => {
        const steps = ['diaryStep1', 'diaryStepFood', 'diaryStepSleep'];
        steps.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.classList.add('hidden');
        });
        
        const activeEl = document.getElementById(activeId);
        if(activeEl) activeEl.classList.remove('hidden');
    },

    updateHeader: (txt) => {
        const backBtn = document.getElementById('diaryBackBtn');
        const title = document.getElementById('diaryTitle');
        
        // Show Back Button when navigating deeper
        if(backBtn) backBtn.classList.remove('hidden');
        if(title) title.innerText = txt;
    }
};
