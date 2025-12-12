/**
 * REVIEW MODAL
 * Handles the Activity Reporting logic.
 * Dependency: js/core/labels.js (TXT)
 */

const ReviewModal = {
    state: {
        activityId: null,
        ratings: []
    },

    open: (activityId) => {
        const T = TXT.COMPONENTS.MODALS.REVIEW;
        
        // 1. Resolve and Store ID immediately
        // Priority: Passed Argument -> Global State -> Error
        const targetId = activityId || STATE.reviewActivityId;
        
        if (!targetId) {
            console.error("CRITICAL: ReviewModal opened without an Activity ID");
            return alert("System Error: Cannot identify the activity. Please refresh and try again.");
        }

        ReviewModal.state.activityId = targetId;
        // Also ensure global state is synced just in case
        STATE.reviewActivityId = targetId; 

        // 2. Find Data
        const act = STATE.feed.find(x => x.id === targetId);
        const ai = act?.data?.activityJson || {};
        
        // 3. Render Header
        document.getElementById('reviewTitle').innerText = ai.creativeName || T.HEADER;
        
        // 4. Render Objectives
        const container = document.getElementById('reviewObjectives');
        container.innerHTML = "";
        
        const levels = [
            { l: TXT.CORE.SCORES[1], s: 1 },
            { l: TXT.CORE.SCORES[2], s: 2 },
            { l: TXT.CORE.SCORES[3], s: 3 },
            { l: TXT.CORE.SCORES[4], s: 4 }
        ];

        (act.data.milestoneIds || []).forEach(mid => {
            const m = STATE.library.find(x => x.id === mid) || {desc: mid, domain: TXT.CORE.UNKNOWN_SKILL};
            
            const buttons = levels.map(lvl => `
                <button onclick="ReviewModal.rate(this, '${mid}', ${lvl.s})" 
                        class="rate-btn w-full py-3 px-1 rounded border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition uppercase tracking-wide">
                    ${lvl.l}
                </button>
            `).join('');

            container.innerHTML += `
            <div class="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div class="mb-3">
                    <span class="text-[10px] bg-white px-2 py-1 rounded border border-slate-200 text-slate-400 font-bold mb-1 inline-block">${m.domain}</span>
                    <p class="text-sm font-bold text-slate-700 leading-tight">${m.desc}</p>
                </div>
                <div class="grid grid-cols-2 gap-2">${buttons}</div>
            </div>`;
        });
        
        // 5. Reset Note
        const noteInput = document.getElementById('reviewNote');
        noteInput.value = "";
        noteInput.placeholder = T.PLACEHOLDER_NOTES;

        Modals.open('review');
    },

    rate: (btn, id, score) => {
        const grid = btn.parentElement;
        grid.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        btn.dataset.id = id; 
        btn.dataset.score = score;
    },

    submit: async () => {
        const T = TXT.COMPONENTS.MODALS.REVIEW;
        
        // CRITICAL CHECK: Get ID from Local State OR Global State
        const finalActivityId = ReviewModal.state.activityId || STATE.reviewActivityId;

        if (!finalActivityId) {
             return alert("Error: Activity ID missing. Please close and try again.");
        }

        // Collect Ratings
        const ratings = [];
        document.querySelectorAll('#reviewObjectives .rate-btn.selected').forEach(b => {
            ratings.push({id: b.dataset.id, score: parseInt(b.dataset.score)});
        });
        
        if (ratings.length === 0) return alert(T.ERROR_NO_SELECTION);

        // UI Feedback
        const btn = document.getElementById('reviewSubmitBtn') || document.querySelector('#reviewModal button.submit-btn'); 
        if(btn) {
            btn.innerText = T.BTN_SUBMITTING; 
            btn.disabled = true;
        }
        
        // API Call
        await API.submitReport(
            STATE.child.childId, 
            finalActivityId,  // <--- GUARANTEED ID
            ratings, 
            document.getElementById('reviewNote').value
        );
        
        // Reset & Close
        if(btn) {
            btn.innerText = T.BTN_SUBMIT; 
            btn.disabled = false;
        }
        
        Modals.close(); 
        
        // Refresh UI
        if (typeof FeedView !== 'undefined') FeedView.render();
        if (typeof ProgressView !== 'undefined') ProgressView.render();
    }
};
