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
        
        // 1. Store ID
        ReviewModal.state.activityId = activityId;
        console.log("ReviewModal Opened for:", activityId); 

        const act = STATE.feed.find(x => x.id === activityId);
        const ai = act?.data?.activityJson || {};
        
        // 2. Set Header
        document.getElementById('reviewTitle').innerText = ai.creativeName || T.HEADER;
        
        // 3. Build Objectives List
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
        
        // 4. Reset Note Input
        const noteInput = document.getElementById('reviewNote');
        noteInput.value = "";
        noteInput.placeholder = T.PLACEHOLDER_NOTES;

        Modals.open('review');
    },

    rate: (btn, id, score) => {
        const grid = btn.parentElement;
        grid.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        // Store on button for scraping later
        btn.dataset.id = id; 
        btn.dataset.score = score;
    },

    submit: async () => {
        const T = TXT.COMPONENTS.MODALS.REVIEW;
        
        // Safety Check
        if (!ReviewModal.state.activityId) {
             return alert("Error: Activity ID missing. Please close and try again.");
        }

        const ratings = [];
        document.querySelectorAll('#reviewObjectives .rate-btn.selected').forEach(b => {
            ratings.push({id: b.dataset.id, score: parseInt(b.dataset.score)});
        });
        
        if (ratings.length === 0) return alert(T.ERROR_NO_SELECTION);

        // Robust Button Selector (Try ID first, fallback to querySelector)
        const btn = document.getElementById('reviewSubmitBtn') || document.querySelector('#reviewModal button:last-of-type');
        const oldText = btn ? btn.innerText : "Submit"; 
        
        if(btn) {
            btn.innerText = T.BTN_SUBMITTING; 
            btn.disabled = true;
        }
        
        // Call API
        await API.submitReport(
            STATE.child.childId, 
            ReviewModal.state.activityId, 
            ratings, 
            document.getElementById('reviewNote').value
        );
        
        if(btn) {
            btn.innerText = T.BTN_SUBMIT; 
            btn.disabled = false;
        }
        
        Modals.close(); 
        
        if (typeof FeedView !== 'undefined') FeedView.render();
        if (typeof ProgressView !== 'undefined') ProgressView.render();
    }
};
