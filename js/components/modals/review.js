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
        ReviewModal.state.ratings = [];

        const act = STATE.feed.find(x => x.id === activityId);
        const ai = act?.data?.activityJson || {};

        document.getElementById('reviewTitle').innerText = 
            ai.creativeName || TXT.COMPONENTS.MODALS.REVIEW.HEADER;

        const container = document.getElementById('reviewObjectives');
        container.innerHTML = "";

        const levels = [
            { l: TXT.CORE.SCORES[1], s: 1 },
            { l: TXT.CORE.SCORES[2], s: 2 },
            { l: TXT.CORE.SCORES[3], s: 3 },
            { l: TXT.CORE.SCORES[4], s: 4 }
        ];

        (act.data.milestoneIds || []).forEach(mid => {
            const m = STATE.library.find(x => x.id === mid) || { desc: mid, domain: TXT.CORE.UNKNOWN_SKILL };
            const desc = Utils.getMilestoneDesc(mid); // Safe text

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
                    <p class="text-sm font-bold text-slate-700 leading-tight">${desc}</p>
                </div>
                <div class="grid grid-cols-2 gap-2">${buttons}</div>
            </div>`;
        });

        const noteEl = document.getElementById('reviewNote');
        noteEl.value = "";
        noteEl.placeholder = TXT.COMPONENTS.MODALS.REVIEW.PLACEHOLDER_NOTES;

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
        const ratings = [];
        document.querySelectorAll('#reviewObjectives .rate-btn.selected').forEach(b => {
            ratings.push({
                id: b.dataset.id,
                score: parseInt(b.dataset.score)
            });
        });

        if (ratings.length === 0) {
            return alert(TXT.COMPONENTS.MODALS.REVIEW.ERROR_NO_SELECTION);
        }

        const btn = document.querySelector('#reviewModal .submit-btn');
        const oldText = btn.innerText;

        btn.innerText = TXT.COMPONENTS.MODALS.REVIEW.BTN_SUBMITTING;
        btn.disabled = true;

        // THIS IS YOUR ORIGINAL WORKING CALL — DO NOT ADD 5TH PARAM
        await API.submitReport(
            STATE.child.childId,
            ReviewModal.state.activityId,
            ratings,
            document.getElementById('reviewNote').value
        );

        btn.innerText = oldText;
        btn.disabled = false;
        Modals.close();

        if (typeof FeedView !== 'undefined') FeedView.render();
        if (typeof ProgressView !== 'undefined') ProgressView.render();
    }
};
