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
        btn.innerHTML = `<i class="fa-solid fa-check mr-2"></i> ${TXT.COMPONENTS.MODALS.OBSERVATION.SUCCESS_MSG}`;
        btn.classList.add('btn-success');
        btn.disabled = true;
        await API.logObservation(STATE.child.childId, "General", null, null, note);
        setTimeout(() => {
            btn.innerText = oldText;
            btn.classList.remove('btn-success');
            btn.disabled = false;
            Modals.close();
            if (typeof FeedView !== 'undefined') FeedView.render();
        }, 800);
    }
};
