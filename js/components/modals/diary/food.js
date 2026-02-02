/**
 * DIARY: FOOD LOG
 * Handles Meal, Snack, and Bottle entries.
 */
const FoodLog = {
    init: () => {
        // Set default time to now
        const now = new Date();
        const timeStr = now.toTimeString().substring(0, 5);
        document.getElementById('foodTime').value = timeStr;
    },

    reset: () => {
        document.getElementById('foodType').value = "";
        document.getElementById('foodDetails').value = "";
        document.getElementById('foodQuantity').value = "";
        document.getElementById('foodInputArea').classList.add('hidden');
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
            // Show Quantity, Hide Text Details
            detailContainer.classList.add('hidden');
            qtyContainer.classList.remove('hidden');
        } else {
            // Show Text Details, Hide Quantity
            detailContainer.classList.remove('hidden');
            qtyContainer.classList.add('hidden');
        }
    },

    submit: async () => {
        const type = document.getElementById('foodType').value;
        const time = document.getElementById('foodTime').value;
        let details = "";
        let quantity = "";

        if (type === "Bottle") {
            quantity = document.getElementById('foodQuantity').value;
            if (!quantity) return alert("Please select a quantity.");
            details = `${quantity}`;
        } else {
            details = document.getElementById('foodDetails').value;
            if (!details.trim()) return alert("Please enter what they ate.");
        }

        const btn = document.getElementById('btnSubmitFood');
        const oldText = btn.innerText;
        
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Saving...`;
        btn.disabled = true;

        // Prepare Data
        const entryData = {
            subtype: type,
            details: details,
            time: time
        };

        await API.logDiary(STATE.child.childId, "Food", entryData);
        
        setTimeout(() => {
            btn.innerText = oldText;
            btn.disabled = false;
            Modals.close();
            if (typeof FeedView !== 'undefined') FeedView.render();
        }, 800);
    }
};