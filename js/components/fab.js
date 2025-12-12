/**
 * FAB COMPONENT
 * Floating Action Button Logic.
 * Dependency: js/core/labels.js (TXT)
 */

const FAB = {
    // Initialize Labels from Dictionary
    init: () => {
        // Find buttons by their onclick attribute (robust enough for this MVP)
        const planSpan = document.querySelector('button[onclick*="openPlan"] span');
        if (planSpan) planSpan.innerText = TXT.COMPONENTS.FAB.PLAN;

        const logSpan = document.querySelector('button[onclick*="openLog"] span');
        if (logSpan) logSpan.innerText = TXT.COMPONENTS.FAB.OBSERVATION;
    },

    toggle: () => {
        document.getElementById('fabMenu').classList.toggle('hidden');
        document.getElementById('fabBtn').classList.toggle('fab-active');
        const i = document.getElementById('fabIcon');
        i.className = i.className.includes('plus') ? "fa-solid fa-times" : "fa-solid fa-plus";
    },

    openPlan: () => { 
        FAB.toggle(); 
        Modals.open('plan'); 
    },

    openLog: () => { 
        FAB.toggle(); 
        Modals.open('log'); 
    }
};

// Auto-run init to set labels
document.addEventListener("DOMContentLoaded", () => {
    FAB.init();
});
