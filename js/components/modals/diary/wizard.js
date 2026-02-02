const DiaryWizard = {
    // Entry Point (Called by FAB)
    init: () => {
        // 1. Reset Inputs (Calls sub-component resets)
        if(typeof FoodLog !== 'undefined') FoodLog.reset();
        if(typeof SleepLog !== 'undefined') SleepLog.reset();

        // 2. Navigation Reset (Critical Fix)
        // Ensure Step 1 is visible, others are hidden
        DiaryWizard.toggle('diaryStep1', true);
        DiaryWizard.toggle('diaryStepFood', false);
        DiaryWizard.toggle('diaryStepSleep', false);
        
        // 3. Header Reset
        const backBtn = document.getElementById('diaryBackBtn');
        const title = document.getElementById('diaryTitle');
        if(backBtn) backBtn.classList.add('hidden'); // Hide Back on Home
        if(title) title.innerText = "New Diary Entry";
    },

    // Navigate to Food
    goFood: () => { 
        DiaryWizard.toggle('diaryStep1', false);
        DiaryWizard.toggle('diaryStepFood', true);
        
        // Show Back Button & Update Title
        DiaryWizard.updateHeader("Food Log");
        
        // Init Sub-component
        if(typeof FoodLog !== 'undefined') FoodLog.init();
    },
    
    // Navigate to Sleep
    goSleep: () => { 
        DiaryWizard.toggle('diaryStep1', false);
        DiaryWizard.toggle('diaryStepSleep', true);
        
        // Show Back Button & Update Title
        DiaryWizard.updateHeader("Sleep Log");
        
        // Init Sub-component
        if(typeof SleepLog !== 'undefined') SleepLog.init();
    },

    // Back Button Handler
    back: () => {
        DiaryWizard.init(); // Reset to main menu
    },

    // Helper to toggle visibility by ID
    toggle: (id, show) => {
        const el = document.getElementById(id);
        if(!el) return console.error(`Element ID '${id}' not found!`);
        
        if (show) el.classList.remove('hidden');
        else el.classList.add('hidden');
    },

    // Helper to update header state
    updateHeader: (txt) => {
        const backBtn = document.getElementById('diaryBackBtn');
        const title = document.getElementById('diaryTitle');
        
        if(backBtn) backBtn.classList.remove('hidden'); // SHOW Back Btn
        if(title) title.innerText = txt;
    }
};
