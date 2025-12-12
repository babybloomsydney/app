/**
 * LOG WIZARD MANAGER
 * Handles navigation between General, Focused, and Progress modes.
 * Dependency: js/core/labels.js (TXT)
 */
const LogWizard = {
    state: { mode: null },

    init: () => {
        LogWizard.state.mode = null;
        
        // 1. Inject Text Labels (Step 1 & Headers)
        LogWizard.initLabels();

        // 2. Reset Inputs
        ['logNoteGeneral', 'logNoteFocused', 'logNoteProgress'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.value = "";
        });
        
        // 3. Initialize sub-components
        if(typeof ObsFocused !== 'undefined') ObsFocused.init();
        if(typeof ObsProgress !== 'undefined') ObsProgress.init();

        // 4. Show Start Screen
        LogWizard.showStep('logStep1');
        
        // Reset Header
        const backBtn = document.getElementById('logBackBtn');
        const title = document.getElementById('logTitle');
        if(backBtn) backBtn.classList.add('hidden');
        if(title) title.innerText = TXT.COMPONENTS.MODALS.OBSERVATION.WIZARD.HEADER_NEW;
    },

    // --- TEXT BINDING ---
    initLabels: () => {
        const T = TXT.COMPONENTS.MODALS.OBSERVATION.WIZARD;
        
        const setTxt = (id, txt) => {
            const el = document.getElementById(id);
            if(el) el.innerText = txt;
        };

        setTxt('btnGeneralTitle', T.BTN_GENERAL_TITLE);
        setTxt('btnGeneralDesc', T.BTN_GENERAL_DESC);
        
        setTxt('btnFocusedTitle', T.BTN_FOCUSED_TITLE);
        setTxt('btnFocusedDesc', T.BTN_FOCUSED_DESC);
        
        setTxt('btnProgressTitle', T.BTN_PROGRESS_TITLE);
        setTxt('btnProgressDesc', T.BTN_PROGRESS_DESC);
    },

    // Navigation Actions
    goGeneral: () => { 
        LogWizard.state.mode = 'General'; 
        LogWizard.showStep('logStepGeneral'); 
        LogWizard.updateHeader(TXT.COMPONENTS.MODALS.OBSERVATION.WIZARD.HEADER_GENERAL); 
    },
    
    goFocused: () => { 
        LogWizard.state.mode = 'Focused'; 
        LogWizard.showStep('logStepFocused'); 
        LogWizard.updateHeader(TXT.COMPONENTS.MODALS.OBSERVATION.WIZARD.HEADER_FOCUSED); 
    },
    
    goProgress: () => { 
        LogWizard.state.mode = 'Progress'; 
        LogWizard.showStep('logStepProgress'); 
        LogWizard.updateHeader(TXT.COMPONENTS.MODALS.OBSERVATION.WIZARD.HEADER_PROGRESS); 
    },
    
    goToProgressNote: () => { 
        if(typeof ObsProgress !== 'undefined') ObsProgress.renderSummary(); 
        LogWizard.showStep('logStepProgressNote'); 
    },

    back: () => {
        const curr = Array.from(document.querySelectorAll('[id^="logStep"]:not(.hidden)')).pop().id;
        if(curr === "logStepProgressNote") {
            LogWizard.goProgress();
        } else {
            LogWizard.init(); // Reset to start
        }
    },

    showStep: (activeId) => {
        const steps = ['logStep1', 'logStepGeneral', 'logStepFocused', 'logStepProgress', 'logStepProgressNote'];
        steps.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.classList.add('hidden');
        });
        
        const activeEl = document.getElementById(activeId);
        if(activeEl) activeEl.classList.remove('hidden');
    },

    updateHeader: (txt) => {
        const backBtn = document.getElementById('logBackBtn');
        const title = document.getElementById('logTitle');
        if(backBtn) backBtn.classList.remove('hidden');
        if(title) title.innerText = txt;
    }
};
