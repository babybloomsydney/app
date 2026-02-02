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

        // NEW: Diary Button Label
        const diarySpan = document.querySelector('button[onclick*="openDiary"] span');
        if (diarySpan) diarySpan.innerText = TXT.COMPONENTS.FAB.DIARY;
    },

    toggle: () => {
        document.getElementById('fabMenu').classList.toggle('hidden');
        document.getElementById('fabBtn').classList.toggle('fab-active');
        const i = document.getElementById('fabIcon');
        // Toggle icon class between plus and times
        if (i.classList.contains('fa-plus')) {
             i.classList.remove('fa-plus');
             i.classList.add('fa-times');
        } else {
             i.classList.remove('fa-times');
             i.classList.add('fa-plus');
        }
    },

    openPlan: () => { 
        FAB.toggle(); 
        Modals.open('plan'); 
    },

    openLog: () => { 
        FAB.toggle(); 
        Modals.open('log'); 
    },

    // NEW: Open Diary
    openDiary: () => {
        FAB.toggle();
        Modals.open('diary');
    }
};

// Auto-run init to set labels
document.addEventListener("DOMContentLoaded", () => {
    FAB.init();
});
