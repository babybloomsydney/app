/**
 * OBSERVATION: GENERAL
 * GENERAL
 */
const ObsGeneral = {
    submit: async () => {
        const note = document.getElementById('logNoteGeneral').value;
        if(!note.trim()) return alert("Please write an observation.");
        
        const btn = document.getElementById('btnSubmitGeneral');
        const oldText = btn.innerText;
        
        // UI Feedback
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Uploading...`;
        btn.disabled = true;

        // --- NEW: HANDLE IMAGE UPLOAD ---
        let imageUrl = null;
        // CORRECTED ID: Matches the specific input in index.html
        const fileInput = document.getElementById('logImageGeneral');
        
        if (fileInput && fileInput.files.length > 0) {
            imageUrl = await Cloudinary.uploadImage(fileInput, STATE.child.childId);
        }

        btn.innerHTML = `<i class="fa-solid fa-check mr-2"></i> ${TXT.COMPONENTS.MODALS.OBSERVATION.SUCCESS_MSG}`;
        btn.classList.add('btn-success');

        await API.logObservation(STATE.child.childId, "General", null, null, note, imageUrl);
        
        setTimeout(() => {
            btn.innerText = oldText;
            btn.classList.remove('btn-success');
            btn.disabled = false;
            
            // Clear input for next time
            if (fileInput) fileInput.value = ""; 
            
            Modals.close();
            if (typeof FeedView !== 'undefined') FeedView.render();
        }, 800);
    }
};
