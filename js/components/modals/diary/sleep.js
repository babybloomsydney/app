/**
 * DIARY: SLEEP
 * Handles sleep entry submission and time population.
 * Emulates ObsGeneral for submit (with spinner) and adds reset/init.
 */
const SleepLog = {
    init: () => {
        // Emulate ObsGeneral: Minimal init, populate if needed
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
        // Emulate ObsGeneral.submit exactly (spinner, success, image if added later)
        const start = document.getElementById('sleepStart').value;
        const end = document.getElementById('sleepEnd').value;
        
        if (!start || !end) return alert("Please select start and end times.");
        
        const btn = document.getElementById('btnSubmitSleep');
        const oldText = btn.innerText;
        
        // UI Feedback (emulating spinner)
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Uploading...`;
        btn.disabled = true;
        
        // Image upload (emulating ObsGeneral; add input in HTML if needed)
        let imageUrl = null;
        // const fileInput = document.getElementById('diaryImageSleep'); // Add to HTML if wanted
        // if (fileInput && fileInput.files.length > 0) {
        //     imageUrl = await Cloudinary.uploadImage(fileInput, STATE.child.childId);
        // }
        
        // API call (unchanged)
        await API.logDiaryEntry(STATE.child.childId, "Sleep", { start, end }); // Add imageUrl if implemented
        
        btn.innerHTML = `<i class="fa-solid fa-check mr-2"></i> ${TXT?.COMPONENTS?.MODALS?.OBSERVATION?.SUCCESS_MSG || 'Added!'}`;
        btn.classList.add('btn-success');
        
        setTimeout(() => {
            btn.innerText = oldText;
            btn.classList.remove('btn-success');
            btn.disabled = false;
            
            // Clear input for next time (emulating file clear)
            // if (fileInput) fileInput.value = "";
            
            Modals.close();
            if (typeof FeedView !== 'undefined') FeedView.render();
        }, 800);
    },
    
    reset: () => {
        // Emulate implicit reset in ObsGeneral
        document.getElementById('sleepStart').value = "";
        document.getElementById('sleepEnd').value = "";
        document.getElementById('sleepDuration').innerText = '--';
    }
};
