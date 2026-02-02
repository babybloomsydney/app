/**
 * DIARY: SLEEP LOG
 * Handles Nap tracking and duration calculation.
 */
const SleepLog = {
    init: () => {
        // Force population of dropdowns
        SleepLog.renderTimeOptions('sleepStart');
        SleepLog.renderTimeOptions('sleepEnd');
        const dur = document.getElementById('sleepDuration');
        if(dur) dur.innerText = "--";
    },

    reset: () => {
        const start = document.getElementById('sleepStart');
        const end = document.getElementById('sleepEnd');
        if(start) start.value = "";
        if(end) end.value = "";
        const dur = document.getElementById('sleepDuration');
        if(dur) dur.innerText = "--";
    },

    renderTimeOptions: (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        
        // Only populate if empty (length <= 1 means just the default "Select" option)
        if (el.options.length > 1) return; 

        // Build string first for performance
        let html = '<option value="">Select Time</option>';
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 5) { // 5 minute intervals
                const hh = h.toString().padStart(2, '0');
                const mm = m.toString().padStart(2, '0');
                const time = `${hh}:${mm}`;
                html += `<option value="${time}">${time}</option>`;
            }
        }
        el.innerHTML = html;
    },

    calcDuration: () => {
        const start = document.getElementById('sleepStart').value;
        const end = document.getElementById('sleepEnd').value;
        const display = document.getElementById('sleepDuration');

        if (start && end) {
            const d1 = new Date(`2000-01-01T${start}`);
            const d2 = new Date(`2000-01-01T${end}`);
            
            // Handle overnight (if end time is smaller than start time, assume next day)
            if (d2 < d1) d2.setDate(d2.getDate() + 1);

            const diffMs = d2 - d1;
            const diffMins = Math.round(diffMs / 60000);
            
            const hours = Math.floor(diffMins / 60);
            const mins = diffMins % 60;
            
            display.innerText = `${hours}h ${mins}m`;
        } else {
            display.innerText = "--";
        }
    },

    submit: async () => {
        const start = document.getElementById('sleepStart').value;
        const end = document.getElementById('sleepEnd').value;
        const duration = document.getElementById('sleepDuration').innerText;

        if (!start || !end) return alert("Please select start and end times.");

        const btn = document.getElementById('btnSubmitSleep');
        const oldText = btn.innerText;
        
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Saving...`;
        btn.disabled = true;

        const entryData = {
            subtype: "Nap",
            start: start,
            end: end,
            duration: duration
        };

        await API.logDiary(STATE.child.childId, "Sleep", entryData);
        
        setTimeout(() => {
            btn.innerText = oldText;
            btn.disabled = false;
            
            // Critical: Reset Wizard to main menu so it doesn't stick
            if(typeof DiaryWizard !== 'undefined') DiaryWizard.init();
            
            Modals.close();
            if (typeof FeedView !== 'undefined') FeedView.render();
        }, 800);
    }
};
