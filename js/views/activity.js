/**
 * VIEW: ACTIVITY DETAIL
 * Handles the "Recipe Book" view for a specific activity and the Report/Review logic.
 */
const ActivityView = {
   
    // --- 1. ACTIVITY DETAIL (The Recipe) ---
    open: (activityId) => {
        const act = STATE.feed.find(x => x.id === activityId);
        if(!act) return;
       
        const ai = act.data.activityJson || {};
        STATE.reviewActivityId = activityId;
        // 1. Populate Header
        document.getElementById('detailTitle').innerText = ai.creativeName || TXT.VIEWS.ACTIVITY_DETAIL.DEFAULT_TITLE;
        document.getElementById('detailRec').innerText = ai.recommendedLine || "";
        document.getElementById('detailDesc').innerText = ai.activityDescription || "";
        // 2. Build Accordions
        const container = document.getElementById('detailAccordions');
        let html = "";
        // Helper: Generates a section with inline CSS toggling
        const section = (icon, title, content) => `
            <div class="border border-slate-200 rounded-xl bg-white overflow-hidden group">
                <button onclick="this.nextElementSibling.classList.toggle('accordion-open'); this.querySelector('.fa-chevron-down').classList.toggle('rotate-180')"
                        class="w-full text-left p-4 flex justify-between items-center bg-white hover:bg-slate-50 transition">
                    <div class="flex items-center gap-3">
                        <div class="w-6 h-6 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center text-xs"><i class="${icon}"></i></div>
                        <span class="font-bold text-sm text-slate-700">${title}</span>
                    </div>
                    <i class="fa-solid fa-chevron-down text-slate-300 transition-transform duration-300"></i>
                </button>
                <div class="accordion-content bg-slate-50 px-4 text-sm text-slate-600">
                    <div class="py-4 border-t border-slate-100 leading-relaxed space-y-2">
                        ${content}
                    </div>
                </div>
            </div>`;
        // -- Objectives --
        if (ai.objectivesList) {
            html += section("fa-solid fa-bullseye", TXT.VIEWS.ACTIVITY_DETAIL.SECTION_OBJECTIVES,
                `<ul class="space-y-2">${ai.objectivesList.map(o => `<li class="flex gap-2"><i class="fa-solid fa-check text-indigo-400 mt-1"></i><span>${o}</span></li>`).join('')}</ul>`);
        }
        // -- Intention --
        if (ai.intention) {
            html += section("fa-solid fa-heart", TXT.VIEWS.ACTIVITY_DETAIL.SECTION_INTENTION,
                `<p class="leading-relaxed text-slate-600 italic">"${ai.intention}"</p>`);
        }
        // -- Supplies --
        if (ai.supplies) {
            const disclaimer = ai.suppliesDisclaimer ? `<div class="mt-3 p-3 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold flex gap-2"><i class="fa-solid fa-triangle-exclamation mt-0.5"></i><p>${ai.suppliesDisclaimer}</p></div>` : "";
            html += section("fa-solid fa-basket-shopping", TXT.VIEWS.ACTIVITY_DETAIL.SECTION_SUPPLIES,
                `<ul class="space-y-2">${ai.supplies.map(s => `<li class="flex gap-2"><i class="fa-solid fa-box text-emerald-500 mt-1"></i><span>${s}</span></li>`).join('')}</ul>${disclaimer}`);
        }
        // -- Guide --
        if (ai.activityGuide) {
            html += section("fa-solid fa-shoe-prints", TXT.VIEWS.ACTIVITY_DETAIL.SECTION_GUIDE,
                `<div class="space-y-4">${ai.activityGuide.map((s, i) => `<div class="flex gap-3"><span class="w-6 h-6 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">${i+1}</span><p>${s}</p></div>`).join('')}</div>`);
        }
        // -- Tips --
        if (ai.encouragementTips) {
            html += section("fa-solid fa-comments", TXT.VIEWS.ACTIVITY_DETAIL.SECTION_TIPS,
                `<ul class="space-y-2">${ai.encouragementTips.map(t => `<li class="bg-indigo-50 p-3 rounded-lg text-indigo-900 text-xs border border-indigo-100"><i class="fa-solid fa-lightbulb mr-2 text-indigo-500"></i> ${t}</li>`).join('')}</ul>`);
        }
        // -- Key Observations --
        if (ai.keyObservations && ai.keyObservations.length > 0) {
            const obsHtml = ai.keyObservations.map(o => `
                <div class="mb-6 last:mb-0 border-b border-slate-200 pb-4 last:border-0">
                    <p class="text-xs font-bold text-slate-400 uppercase mb-1">${o.domain || TXT.VIEWS.ACTIVITY_DETAIL.UNKNOWN_DOMAIN}</p>
                    <p class="font-bold text-slate-800 mb-3">${o.objective || ""}</p>
                   
                    <div class="space-y-2">
                        <div class="p-2 bg-slate-50 rounded border border-slate-100">
                            <span class="text-[10px] font-bold text-slate-500 uppercase block mb-1">${TXT.CORE.SCORES[1]}</span>
                            <p class="text-xs text-slate-700">${o.levels?.introduced || "N/A"}</p>
                        </div>
                        <div class="p-2 bg-indigo-50 rounded border border-indigo-100">
                            <span class="text-[10px] font-bold text-indigo-500 uppercase block mb-1">${TXT.CORE.SCORES[2]}</span>
                            <p class="text-xs text-indigo-800">${o.levels?.assisted || "N/A"}</p>
                        </div>
                        <div class="p-2 bg-blue-50 rounded border border-blue-100">
                            <span class="text-[10px] font-bold text-blue-500 uppercase block mb-1">${TXT.CORE.SCORES[3]}</span>
                            <p class="text-xs text-blue-800">${o.levels?.guided || "N/A"}</p>
                        </div>
                        <div class="p-2 bg-emerald-50 rounded border border-emerald-100">
                            <span class="text-[10px] font-bold text-emerald-600 uppercase block mb-1">${TXT.CORE.SCORES[4]}</span>
                            <p class="text-xs text-emerald-900">${o.levels?.independent || "N/A"}</p>
                        </div>
                    </div>
                </div>`).join("");
            html += section("fa-solid fa-magnifying-glass", TXT.VIEWS.ACTIVITY_DETAIL.SECTION_OBSERVATIONS, `<div>${obsHtml}</div>`);
        }
        container.innerHTML = html;
        Modals.open('activityDetail');
    },
    // Bridge: Closes detail, opens review drawer
    startReport: () => {
        Modals.close();
        ActivityView.openReviewModal();
    },
    // --- 2. REPORT DRAWER (The Assessment) ---
    openReviewModal: () => {
        const id = STATE.reviewActivityId;
        const act = STATE.feed.find(x => x.id === id);
        const ai = act.data.activityJson || {};
       
        document.getElementById('reviewTitle').innerText = ai.creativeName || TXT.COMPONENTS.MODALS.REVIEW.HEADER;
       
        const container = document.getElementById('reviewObjectives');
        container.innerHTML = "";
       
        // Define levels for buttons (Text Label, Score Value)
        const levels = [
            { label: TXT.CORE.SCORES[1], score: 1 },
            { label: TXT.CORE.SCORES[2], score: 2 },
            { label: TXT.CORE.SCORES[3], score: 3 },
            { label: TXT.CORE.SCORES[4], score: 4 }
        ];
        // Match IDs to Library for nice descriptions
        (act.data.milestoneIds || []).forEach(mid => {
            const m = STATE.library.find(x => x.id === mid) || {desc: mid, domain: TXT.CORE.UNKNOWN_SKILL};
           
            // Build Buttons HTML
            const buttonsHtml = levels.map(lvl => `
                <button onclick="ActivityView.rate(this, '${mid}', ${lvl.score})"
                        class="rate-btn w-full py-3 px-1 rounded border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition uppercase tracking-wide">
                    ${lvl.label}
                </button>
            `).join('');
            container.innerHTML += `
            <div class="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div class="mb-3">
                    <span class="text-[10px] bg-white px-2 py-1 rounded border border-slate-200 text-slate-400 font-bold mb-1 inline-block">${m.domain}</span>
                    <p class="text-sm font-bold text-slate-700 leading-tight">${m.desc}</p>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    ${buttonsHtml}
                </div>
            </div>`;
        });
       
        // Clear previous note
        document.getElementById('reviewNote').value = "";
        document.getElementById('reviewNote').placeholder = TXT.COMPONENTS.MODALS.REVIEW.PLACEHOLDER_NOTES;
        Modals.open('review');
    },
    rate: (btn, id, score) => {
        const grid = btn.parentElement;
        grid.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
       
        btn.dataset.id = id;
        btn.dataset.score = score;
    },
    submitReport: async () => {
        const ratings = [];
        document.querySelectorAll('.rate-btn.selected').forEach(b => {
            ratings.push({id: b.dataset.id, score: parseInt(b.dataset.score)});
        });
       
        if (ratings.length === 0) return alert(TXT.COMPONENTS.MODALS.REVIEW.ERROR_NO_SELECTION);
        const btn = document.querySelector('#reviewModal button');
        const originalText = btn.innerText;
        btn.innerText = TXT.COMPONENTS.MODALS.REVIEW.BTN_SUBMITTING;
        btn.disabled = true;
       
        await API.submitReport(STATE.child.childId, STATE.reviewActivityId, ratings, document.getElementById('reviewNote').value);
       
        btn.innerText = originalText;
        btn.disabled = false;
        Modals.close();
       
        if (typeof FeedView !== 'undefined') FeedView.render();
        if (typeof ProgressView !== 'undefined') ProgressView.render();
    }
};
