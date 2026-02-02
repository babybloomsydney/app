/**
 * DIARY: FOOD
 * Handles food entry submission.
 * Emulates ObsGeneral for submit (with spinner) and adds reset/init.
 */
const FoodLog = {
    init: () => {
        // Emulate ObsGeneral: Minimal init
        FoodLog.onTypeChange(); // Ensure visibility
    },
    
    onTypeChange: () => {
        const type = document.getElementById('foodType').value;
        const inputArea = document.getElementById('foodInputArea');
        const qtyContainer = document.getElementById('foodQtyContainer');
        const detailContainer = document.getElementById('foodDetailContainer');  // Issue #2: Toggle details
        
        if (type) {
            if (inputArea) inputArea.classList.remove('hidden');
            if (qtyContainer) qtyContainer.classList.toggle('hidden', type !== 'Bottle');
            if (detailContainer) detailContainer.classList.toggle('hidden', type === 'Bottle');  // Hide for Bottle
        } else {
            if (inputArea) inputArea.classList.add('hidden');
        }
    },
    
    submit: async () => {
        // Emulate ObsGeneral.submit exactly
        const type = document.getElementById('foodType').value;
        const details = document.getElementById('foodDetails').value;
        const quantity = document.getElementById('foodQuantity')?.value || '';
        const time = document.getElementById('foodTime').value;
        
        if (!type || !time) return alert("Please select type and time.");
        
        const btn = document.getElementById('btnSubmitFood');
        const oldText = btn.innerText;
        
        // UI Feedback (emulating spinner)
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Uploading...`;
        btn.disabled = true;
        
        // Image upload (emulating; add if needed)
        let imageUrl = null;
        // const fileInput = document.getElementById('diaryImageFood');
        // if (fileInput && fileInput.files.length > 0) {
        //     imageUrl = await Cloudinary.uploadImage(fileInput, STATE.child.childId);
        // }
        
        // API call (map to subtype/details to match examples)
        const entryData = {
            subtype: type,  // Map to match examples/tile
            details: (type === 'Bottle') ? quantity : details,  // Conditional for Bottle
            time
        };
        await API.logDiaryEntry(STATE.child.childId, "Food", entryData); // Add imageUrl if implemented
        
        btn.innerHTML = `<i class="fa-solid fa-check mr-2"></i> ${TXT?.COMPONENTS?.MODALS?.OBSERVATION?.SUCCESS_MSG || 'Added!'}`;
        btn.classList.add('btn-success');
        
        setTimeout(() => {
            btn.innerText = oldText;
            btn.classList.remove('btn-success');
            btn.disabled = false;
            
            // Clear input
            // if (fileInput) fileInput.value = "";
            
            Modals.close();
            if (typeof FeedView !== 'undefined') FeedView.render();
        }, 800);
    },
    
    reset: () => {
        // Emulate implicit reset
        document.getElementById('foodType').value = "";
        document.getElementById('foodDetails').value = "";
        const qty = document.getElementById('foodQuantity');
        if (qty) qty.value = "";
        document.getElementById('foodTime').value = "";
        document.getElementById('foodInputArea').classList.add('hidden');
    }
};
