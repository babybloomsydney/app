/**
 * DIARY: FOOD
 * Handles food entry submission.
 * Emulates observation sub-components (e.g., ObsFocused) for init/reset/submit.
 * Assumes this file exists; if not, create it with this content.
 */
const FoodLog = {
    init: () => {
        // Emulate observation init: Reset fields
        FoodLog.reset();
        
        // Show/hide based on type (existing logic)
        FoodLog.onTypeChange();
    },
    
    onTypeChange: () => {
        const type = document.getElementById('foodType').value;
        const inputArea = document.getElementById('foodInputArea');
        const qtyContainer = document.getElementById('foodQtyContainer');
        
        if (type) {
            if (inputArea) inputArea.classList.remove('hidden');
            if (qtyContainer) qtyContainer.classList.toggle('hidden', type !== 'Bottle');
        } else {
            if (inputArea) inputArea.classList.add('hidden');
        }
    },
    
    submit: async () => {
        // Emulate observation submit
        const type = document.getElementById('foodType').value;
        const details = document.getElementById('foodDetails').value;
        const quantity = document.getElementById('foodQuantity')?.value || '';
        const time = document.getElementById('foodTime').value;
        
        if (!type || !time) return alert("Please select type and time.");
        
        const btn = document.getElementById('btnSubmitFood');
        const oldText = btn.innerText;
        btn.innerHTML = `<i class="fa-solid fa-check mr-2"></i> Added!`;
        btn.classList.add('btn-success');
        btn.disabled = true;
        
        // API call (as per user: assume works)
        await API.logDiaryEntry(STATE.child.childId, "Food", { type, details, quantity, time });
        
        setTimeout(() => {
            btn.innerText = oldText;
            btn.classList.remove('btn-success');
            btn.disabled = false;
            Modals.close();
            if (typeof FeedView !== 'undefined') FeedView.render();
        }, 800);
    },
    
    reset: () => {
        // Emulate observation reset
        const typeSelect = document.getElementById('foodType');
        const detailsTextarea = document.getElementById('foodDetails');
        const qtySelect = document.getElementById('foodQuantity');
        const timeInput = document.getElementById('foodTime');
        const inputArea = document.getElementById('foodInputArea');
        
        if (typeSelect) typeSelect.value = "";
        if (detailsTextarea) detailsTextarea.value = "";
        if (qtySelect) qtySelect.value = "";
        if (timeInput) timeInput.value = "";
        if (inputArea) inputArea.classList.add('hidden');
    }
};
