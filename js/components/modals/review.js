/**
 * REVIEW MODAL
 * Handles the Activity Reporting logic.
 */

const ReviewModal = {
    state: {
        activityId: null,
        ratings: []
    },

    open: (activityId) => {
        ReviewModal.state.activityId = activityId;
        const act = STATE.feed.find(x => x.id === activityId);
        const ai = act?.data?.activityJson || {};
        
        document.getElementById('reviewTitle').innerText = ai.creativeName || "Activity Report";
        const container = document.getElementById('reviewObjectives');
        container.innerHTML = "";
        
        const levels = [
            {l:"Introduced",s:1}, {l:"Assisted",s:2}, {l:"Guided",s:3}, {l:"Independent",s:4}
        ];

        (act.data.milestoneIds || []).forEach(mid => {
            const m = STATE.library.find(x => x.id === mid) || {desc: mid, domain: "Skill"};
            
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
        
        document.getElementById('reviewNote').value = "";
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
        const ratings = [];
        document.querySelectorAll('#reviewObjectives .rate-btn.selected').forEach(b => {
            ratings.push({id: b.dataset.id, score: parseInt(b.dataset.score)});
        });
        
        if (ratings.length === 0) return alert("Please select a mastery level for at least one skill.");

        const btn = document.querySelector('#reviewModal button.submit-btn'); // Added class in HTML
        const oldText = btn.innerText;
        btn.innerText = "Submitting..."; btn.disabled = true;
        
        await API.submitReport(STATE.child.childId, ReviewModal.state.activityId, ratings, document.getElementById('reviewNote').value);
        
        btn.innerText = oldText; btn.disabled = false;
        Modals.close(); 
        
        if (typeof FeedView !== 'undefined') FeedView.render();
        if (typeof ProgressView !== 'undefined') ProgressView.render();
    }
};