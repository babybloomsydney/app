/**
 * DIARY WIZARD MANAGER
 * Handles navigation between Food and Sleep modes.
 * Fully emulates LogWizard for consistent back button and navigation behavior.
 */
const DiaryWizard = {
    state: { mode: null },

    init: () => {
        DiaryWizard.state.mode = null;
        
        // 1. Inject Text Labels (emulating LogWizard.initLabels)
        DiaryWizard.initLabels();
        
        // 2. Reset Inputs (emulating LogWizard reset)
        ['foodDetails', 'foodTime'].forEach(id => { // Food fields
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
        // Call sub-component resets (emulating sub-init calls)
        if (typeof FoodLog !== 'undefined') FoodLog.reset();
        if (typeof SleepLog !== 'undefined') SleepLog.reset();
        
        // 3. Initialize sub-components (emulating LogWizard)
        if (typeof FoodLog !== 'undefined') FoodLog.init();
        if (typeof SleepLog !== 'undefined') SleepLog.init();

        // 4. Show Start Screen (emulating LogWizard.showStep)
        DiaryWizard.showStep('diaryStep1');
        
        // Reset Header (emulating LogWizard)
        const backBtn = document.getElementById('diaryBackBtn');
        const title = document.getElementById('diaryTitle');
        if (backBtn) backBtn.classList.add('hidden');
        if (title) title.innerText = TXT?.COMPONENTS?.MODALS?.DIARY?.HEADER || 'New Diary Entry'; // Safe fallback
    },
    
    // --- TEXT BINDING --- (Emulating LogWizard.initLabels with fallbacks)
    initLabels: () => {
        const T = TXT?.COMPONENTS?.MODALS?.DIARY || {}; // Safe access
        
        const setTxt = (id, txt, fallback) => {
            const el = document.getElementById(id);
            if (el) el.innerText = txt || fallback;
        };
        
        // If you have title/desc elements in HTML buttons, set them here
        // Example: Assuming buttons have spans with IDs like 'btnFoodTitle'
        setTxt('btnFoodTitle', T.BTN_FOOD_TITLE, 'Food');
        setTxt('btnFoodDesc', T.BTN_FOOD_DESC, 'Meals, snacks, or bottles.');
        
        setTxt('btnSleepTitle', T.BTN_SLEEP_TITLE, 'Sleep');
        setTxt('btnSleepDesc', T.BTN_SLEEP_DESC, 'Nap times and duration.');
    },
    
    // Navigation Actions (emulating LogWizard.goGeneral etc.)
    goFood: () => { 
        DiaryWizard.state.mode = 'Food'; 
        DiaryWizard.showStep('diaryStepFood'); 
        DiaryWizard.updateHeader(TXT?.COMPONENTS?.MODALS?.DIARY?.HEADER_FOOD || 'Food Entry'); 
    },
    
    goSleep: () => { 
        DiaryWizard.state.mode = 'Sleep'; 
        DiaryWizard.showStep('diaryStepSleep'); 
        DiaryWizard.updateHeader(TXT?.COMPONENTS?.MODALS?.DIARY?.HEADER_SLEEP || 'Sleep Entry'); 
    },
    
    back: () => {
        // Emulating LogWizard.back: Reset to init for simple menu return
        const curr = Array.from(document.querySelectorAll('[id^="diaryStep"]:not(.hidden)')).pop().id;
        DiaryWizard.init(); // Reset to start (emulates simple back)
    },
    
    showStep: (activeId) => {
        // Exactly emulating LogWizard.showStep
        const steps = ['diaryStep1', 'diaryStepFood', 'diaryStepSleep'];
        steps.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
        
        const activeEl = document.getElementById(activeId);
        if (activeEl) activeEl.classList.remove('hidden');
    },
    
    updateHeader: (txt) => {
        // Exactly emulating LogWizard.updateHeader
        const backBtn = document.getElementById('diaryBackBtn');
        const title = document.getElementById('diaryTitle');
        if (backBtn) backBtn.classList.remove('hidden');
        if (title) title.innerText = txt;
    }
};
