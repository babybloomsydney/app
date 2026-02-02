/**
 * DIARY: SLEEP
 * Handles sleep entry submission and time population.
 * Emulates ObsGeneral for submit (with spinner) and adds reset/init.
 */
const SleepLog = {
    init: () => {
        // Emulate ObsGeneral: Minimal init
        SleepLog.reset();
    },
    
    calcDuration: () => {
        const start = document.getElementById('sleepStart').value;
        const end = document.getElementById('sleepEnd').value;
        const durationEl = document.getElementById('sleepDuration');
        
        if (!start || !end) {
            durationEl.innerText = '--';
            return '';
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
        
        const durationStr = `${diffHours}h ${diffMins}m`;
        durationEl.innerText = durationStr;
        return durationStr;  // Return for persistence in submit
    },
    
    submit: async () => {
        // Emulate ObsGeneral.submit exactly
        const start = document.getElementById('sleepStart').value;
        const end = document.getElementById('sleepEnd').value;
        const notes = document.getElementById('sleepNotes').value;  // New notes field
        
        if (!start || !end) return alert("Please select start and end times.");
        
        const btn = document.getElementById('btnSubmitSleep');
        const oldText = btn.innerText;
        
        // UI Feedback (emulating spinner)
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Uploading...`;
        btn.disabled = true;
        
        // Calc duration for persistence (Issue #1)
        const duration = SleepLog.calcDuration();
        
        // Image upload (emulating; add if needed)
        let imageUrl = null;
        // const fileInput = document.getElementById('diaryImageSleep');
        // if (fileInput && fileInput.files.length > 0) {
        //     imageUrl = await Cloudinary.uploadImage(fileInput, STATE.child.childId);
        // }
        
        // API call (add duration/notes)
        const entryData = { start, end, duration };
        if (notes.trim()) entryData.notes = notes;  // Optional: Only add if non-empty
        await API.logDiaryEntry(STATE.child.childId, "Sleep", entryData); // Add imageUrl if implemented
        
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
        document.getElementById('sleepStart').value = "";
        document.getElementById('sleepEnd').value = "";
        document.getElementById('sleepDuration').innerText = '--';
        document.getElementById('sleepNotes').value = "";  // New notes reset
    }
};
