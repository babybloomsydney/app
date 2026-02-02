const FoodLog = {
    init: () => {
        const now = new Date();
        const timeStr = now.toTimeString().substring(0, 5);
        const timeEl = document.getElementById('foodTime');
        if(timeEl) timeEl.value = timeStr;
    },

    reset: () => {
        const typeEl = document.getElementById('foodType');
        const detailsEl = document.getElementById('foodDetails');
        const qtyEl = document.getElementById('foodQuantity');
        const inputArea = document.getElementById('foodInputArea');

        if(typeEl) typeEl.value = "";
        if(detailsEl) detailsEl.value = "";
        if(qtyEl) qtyEl.value = "";
        if(inputArea) inputArea.classList.add('hidden');
    },

    onTypeChange: () => {
        const type = document.getElementById('foodType').value;
        const inputArea = document.getElementById('foodInputArea');
        const detailContainer = document.getElementById('foodDetailContainer');
        const qtyContainer = document.getElementById('foodQtyContainer');

        if (!type) {
            inputArea.classList.add('hidden');
            return;
        }

        inputArea.classList.remove('hidden');

        if (type === "Bottle") {
            if(detailContainer) detailContainer.classList.add('hidden');
            if(qtyContainer) qtyContainer.classList.remove('hidden');
        } else {
            if(detailContainer) detailContainer.classList.remove('hidden');
            if(qtyContainer) qtyContainer.classList.add('hidden');
        }
    },

    submit: async () => {
        const type = document.getElementById('foodType').value;
        const time = document.getElementById('foodTime').value;
        let details = "";

        if (type === "Bottle") {
            const quantity = document.getElementById('foodQuantity').value;
            if (!quantity) return alert("Please select a quantity.");
            details = quantity;
        } else {
            details = document.getElementById('foodDetails').value;
            if (!details.trim()) return alert("Please enter details.");
        }

        const btn = document.getElementById('btnSubmitFood');
        const oldText = btn ? btn.innerText : "Save";
        if(btn) { btn.innerText = "Saving..."; btn.disabled = true; }

        const entryData = { subtype: type, details: details, time: time };

        await API.logDiary(STATE.child.childId, "Food", entryData);
        
        setTimeout(() => {
            if(btn) { btn.innerText = oldText; btn.disabled = false; }
            DiaryWizard.init(); // Reset wizard
            Modals.close();
            if (typeof FeedView !== 'undefined') FeedView.render();
        }, 800);
    }
};
