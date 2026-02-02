/**
 * DIARY: SLEEP
 * Handles sleep entry submission and time population.
 * Emulates observation sub-components (e.g., ObsGeneral) for init/reset/submit.
 */
const SleepLog = {
    init: () => {
        // Emulate observation init: Reset and populate if needed
        SleepLog.reset();
        
        const startSelect = document.getElementById('sleepStart');
        const endSelect = document.getElementById('sleepEnd');
        
        if (startSelect && startSelect.innerHTML === "") {
            SleepLog.populateTimes(startSelect);
        }
        if (endSelect && endSelect.innerHTML === "") {
            SleepLog.populateTimes(endSelect);
        }
    },
    
    populateTimes: (select) => {
        select.innerHTML = '<option value="">Select Time</option>'; // Default
        for (let hour = 0; hour < 24; hour++) {
            for (let min = 0; min < 60; min += 15) {
                const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                select.innerHTML += `<option value="${timeStr}">${timeStr}</option>`;
            }
        }
    },
    
    calcDuration: () => {
        const start = document.getElementById('sleepStart').value;
        const end = document.getElementById('sleepEnd').value;
        const durationEl = document.getElementById('sleepDuration');
        
        if (!start || !end) {
            durationEl.innerText = '--';
            return;
        }
        
        const startDate = new Date(`2000-01-01T${start}:00`);
        const endDate = new Date(`2000-01-01T${end}:00`);
        
        // Handle overnight (end < start)
        if (endDate < startDate) {
            endDate.setDate(endDate.getDate() + 1);
        }
        
        const diffMs = endDate - startDate;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        durationEl.innerText = `${diffHours}h ${diffMins}m`;
    },
    
    submit: async () => {
        // Emulate observation submit (e.g., ObsGeneral.submit)
        const start = document.getElementById('sleepStart').value;
        const end = document.getElementById('sleepEnd').value;
        
        if (!start || !end) return alert("Please select start and end times.");
        
        const btn = document.getElementById('btnSubmitSleep');
        const oldText = btn.innerText;
        btn.innerHTML = `<i class="fa-solid fa-check mr-2"></i> Added!`;
        btn.classList.add('btn-success');
        btn.disabled = true;
        
        // API call (as per user: assume works; no change needed)
        await API.logDiaryEntry(STATE.child.childId, "Sleep", { start, end });
        
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
        const startSelect = document.getElementById('sleepStart');
        const endSelect = document.getElementById('sleepEnd');
        const durationEl = document.getElementById('sleepDuration');
        
        if (startSelect) startSelect.value = "";
        if (endSelect) endSelect.value = "";
        if (durationEl) durationEl.innerText = '--';
    }
};
