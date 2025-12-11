/**
 * LOG WIZARD MANAGER
 * Handles navigation between General, Focused, and Progress modes.
 */
const LogWizard = {
    state: { mode: null },

    init: () => {
        LogWizard.state.mode = null;
        
        // Reset Inputs
        ['logNoteGeneral', 'logNoteFocused', 'logNoteProgress'].forEach(id => document.getElementById(id).value = "");
        
        // Initialize sub-components
        ObsFocused.init();
        ObsProgress.init();

        // Show Start Screen
        LogWizard.showStep('logStep1');
        document.getElementById('logBackBtn').classList.add('hidden');
        document.getElementById('logTitle').innerText = "New Observation";
    },

    // Navigation Actions
    goGeneral: () => { 
        LogWizard.state.mode = 'General'; 
        LogWizard.showStep('logStepGeneral'); 
        LogWizard.updateHeader("General Entry"); 
    },
    
    goFocused: () => { 
        LogWizard.state.mode = 'Focused'; 
        LogWizard.showStep('logStepFocused'); 
        LogWizard.updateHeader("Focused Entry"); 
    },
    
    goProgress: () => { 
        LogWizard.state.mode = 'Progress'; 
        LogWizard.showStep('logStepProgress'); 
        LogWizard.updateHeader("Update Progress"); 
    },
    
    goToProgressNote: () => { 
        ObsProgress.renderSummary(); 
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

    showStep: (id) => {
        ['logStep1', 'logStepGeneral', 'logStepFocused', 'logStepProgress', 'logStepProgressNote'].forEach(s => document.getElementById(s).classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
    },

    updateHeader: (txt) => {
        document.getElementById('logBackBtn').classList.remove('hidden');
        document.getElementById('logTitle').innerText = txt;
    }
};