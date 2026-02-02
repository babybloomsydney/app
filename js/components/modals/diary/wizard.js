/**
 * DIARY WIZARD MANAGER
 * Handles navigation between Food and Sleep modes.
 * Emulates LogWizard structure for consistent navigation and visibility handling.
 */
const DiaryWizard = {
    state: { mode: null },

    init: () => {
        DiaryWizard.state.mode = null;
        
        // 1. Inject Text Labels (if needed; adapt from observation for consistency)
        DiaryWizard.initLabels();
        
        // 2. Reset Inputs (emulate observation reset)
        ['foodDetails'].forEach(id => { // Add food/sleep note IDs if they exist
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
        if (typeof FoodLog !== 'undefined') FoodLog.reset();
        if (typeof SleepLog !== 'undefined') SleepLog.reset();
        
        // 3. Initialize sub-components (emulate observation)
        if (typeof FoodLog !== 'undefined') FoodLog.init();
        if (typeof SleepLog !== 'undefined') SleepLog.init();
        
        // 4. Show Start Screen (emulate showStep)
        DiaryWizard.showStep('diaryStep1');
        
        // Reset Header (emulate observation)
        const backBtn = document.getElementById('diaryBackBtn');
        const title = document.getElementById('diaryTitle');
        if (backBtn) backBtn.classList.add('hidden');
        if (title && typeof TXT !== 'undefined') title.innerText = TXT.COMPONENTS.MODALS.DIARY.HEADER || 'New Diary Entry'; // Fallback
    },
    
    // --- TEXT BINDING --- (Added to emulate observation's initLabels)
    initLabels: () => {
        const T = TXT.COMPONENTS.MODALS.DIARY || {}; // Assume TXT has diary section; add if missing
        
        const setTxt = (id, txt) => {
            const el = document.getElementById(id);
            if (el) el.innerText = txt;
        };
        
        // Example: Set titles for buttons if they have IDs like btnFoodTitle
        setTxt('btnFoodTitle', T.BTN_FOOD_TITLE || 'Food');
        setTxt('btnFoodDesc', T.BTN_FOOD_DESC || 'Meals, snacks, or bottles.');
        
        setTxt('btnSleepTitle', T.BTN_SLEEP_TITLE || 'Sleep');
        setTxt('btnSleepDesc', T.BTN_SLEEP_DESC || 'Nap times and duration.');
    },
    
    // Navigation Actions (emulate goGeneral, etc.)
    goFood: () => { 
        DiaryWizard.state.mode = 'Food'; 
        DiaryWizard.showStep('diaryStepFood'); 
        DiaryWizard.updateHeader(TXT.COMPONENTS.MODALS.DIARY.HEADER_FOOD || 'Food Entry'); 
    },
    
    goSleep: () => { 
        DiaryWizard.state.mode = 'Sleep'; 
        DiaryWizard.showStep('diaryStepSleep'); 
        DiaryWizard.updateHeader(TXT.COMPONENTS.MODALS.DIARY.HEADER_SLEEP || 'Sleep Entry'); 
    },
    
    back: () => {
        const curr = Array.from(document.querySelectorAll('[id^="diaryStep"]:not(.hidden)')).pop().id;
        // Emulate observation's back logic (simple reset for now; extend if more steps)
        DiaryWizard.init(); // Reset to start
    },
    
    showStep: (activeId) => {
        // Emulate observation's showStep exactly
        const steps = ['diaryStep1', 'diaryStepFood', 'diaryStepSleep'];
        steps.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
        
        const activeEl = document.getElementById(activeId);
        if (activeEl) activeEl.classList.remove('hidden');
    },
    
    updateHeader: (txt) => {
        // Emulate observation's updateHeader
        const backBtn = document.getElementById('diaryBackBtn');
        const title = document.getElementById('diaryTitle');
        if (backBtn) backBtn.classList.remove('hidden');
        if (title) title.innerText = txt;
    }
};
