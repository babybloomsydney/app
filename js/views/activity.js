/**
 * VIEW: ACTIVITY DETAIL
 * Handles the "Recipe Book" view for a specific activity.
 */

const ActivityView = {
    
    open: (activityId) => {
        const act = STATE.feed.find(x => x.id === activityId);
        if(!act) return;
        
        const ai = act.data.activityJson || {};
        STATE.reviewActivityId = activityId; 

        // 1. Populate Header
        document.getElementById('detailTitle').innerText = ai.creativeName || "Activity Detail";
        document.getElementById('detailRec').innerText = ai.recommendedLine || "";
        document.getElementById('detailDesc').innerText = ai.activityDescription || "";

        // 2. Build Accordions
        const container = document.getElementById('detailAccordions');
        let html = "";

        // Helper: Generates a section with inline CSS toggling (No extra JS function needed)
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

        // -- Generate Sections --
        if (ai.objectivesList) {
            html += section("fa-solid fa-bullseye", "Objectives", 
                `<ul class="space-y-2">${ai.objectivesList.map(o => `<li class="flex gap-2"><i class="fa-solid fa-check text-indigo-400 mt-1"></i><span>${o}</span></li>`).join('')}</ul>`);
        }

        if (ai.supplies) {
            const disclaimer = ai.suppliesDisclaimer ? `<div class="mt-3 p-3 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold flex gap-2"><i class="fa-solid fa-triangle-exclamation mt-0.5"></i><p>${ai.suppliesDisclaimer}</p></div>` : "";
            html += section("fa-solid fa-basket-shopping", "You Will Need", 
                `<ul class="space-y-2">${ai.supplies.map(s => `<li class="flex gap-2"><i class="fa-solid fa-box text-emerald-500 mt-1"></i><span>${s}</span></li>`).join('')}</ul>${disclaimer}`);
        }

        if (ai.activityGuide) {
            html += section("fa-solid fa-shoe-prints", "Step-by-Step", 
                `<div class="space-y-4">${ai.activityGuide.map((s, i) => `<div class="flex gap-3"><span class="w-6 h-6 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">${i+1}</span><p>${s}</p></div>`).join('')}</div>`);
        }

        if (ai.encouragementTips) {
            html += section("fa-solid fa-comments", "Encouragement", 
                `<ul class="space-y-2">${ai.encouragementTips.map(t => `<li class="bg-indigo-50 p-3 rounded-lg text-indigo-900 text-xs border border-indigo-100"><i class="fa-solid fa-lightbulb mr-2 text-indigo-500"></i> ${t}</li>`).join('')}</ul>`);
        }

        if (ai.keyObservations && ai.keyObservations.length > 0) {
            const obsHtml = ai.keyObservations.map(o => `
                <div class="mb-4 last:mb-0 border-b border-slate-200 pb-4 last:border-0">
                    <p class="text-xs font-bold text-slate-400 uppercase mb-1">${o.domain || "Observation"}</p>
                    <p class="font-bold text-slate-800 mb-2">${o.objective || ""}</p>
                    <div class="grid gap-2 text-xs">
                        <div class="p-2 bg-white rounded border border-slate-200"><strong class="text-slate-900 block mb-1">New:</strong> ${o.levels?.introduced || "N/A"}</div>
                        <div class="p-2 bg-emerald-50 rounded border border-emerald-100"><strong class="text-emerald-800 block mb-1">Mastered:</strong> ${o.levels?.independent || "N/A"}</div>
                    </div>
                </div>`).join("");
            html += section("fa-solid fa-magnifying-glass", "What to Look For", obsHtml);
        }

        container.innerHTML = html;
        Modals.open('activityDetail');
    },

    // Bridge: Closes detail, opens review drawer
    startReport: () => {
        Modals.close();
        ActivityView.openReviewModal();
    },

    // Populates and opens the Review Drawer
    openReviewModal: () => {
        const id = STATE.reviewActivityId;
        const act = STATE.feed.find(x => x.id === id);
        const ai = act.data.activityJson || {};
        
        document.getElementById('reviewTitle').innerText = ai.creativeName || "Activity Report";
        
        const container = document.getElementById('reviewObjectives');
        container.innerHTML = "";
        
        // Match IDs to Library for nice descriptions
        (act.data.milestoneIds || []).forEach(mid => {
            const m = STATE.library.find(x => x.id === mid) || {desc: mid, domain: "Skill"};
            container.innerHTML += `
            <div class="mb-6">
                <div class="flex items-start gap-2 mb-2">
                    <span class="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">${m.domain}</span>
                    <p class="text-xs font-bold text-slate-700 leading-tight">${m.desc}</p>
                </div>
                <div class="grid grid-cols-5 gap-1">
                    ${[0,1,2,3,4].map(n => 
                        `<button onclick="ActivityView.rate(this, '${mid}', ${n})" class="rate-btn p-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-400 hover:bg-slate-50 transition">${n}</button>`
                    ).join('')}
                </div>
                <div class="flex justify-between px-1 mt-1 text-[10px] text-slate-300 font-bold uppercase"><span>New</span><span>Indep.</span></div>
            </div>`;
        });
        
        // Clear previous note
        document.getElementById('reviewNote').value = "";
        Modals.open('review');
    },

    rate: (btn, id, score) => {
        // Toggle visual selection
        btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        // Store data attributes on the button itself for retrieval
        btn.dataset.id = id; 
        btn.dataset.score = score;
    },

    submitReport: async () => {
        const ratings = [];
        // Scrape selected buttons
        document.querySelectorAll('.rate-btn.selected').forEach(b => {
            ratings.push({id: b.dataset.id, score: parseInt(b.dataset.score)});
        });
        
        const btn = document.querySelector('#reviewModal button');
        const originalText = btn.innerText;
        btn.innerText = "Submitting...";
        btn.disabled = true;
        
        await API.submitReport(STATE.child.childId, STATE.reviewActivityId, ratings, document.getElementById('reviewNote').value);
        
        btn.innerText = originalText;
        btn.disabled = false;
        Modals.close(); 
        
        // Refresh Feed to show the new Report card
        if (typeof FeedView !== 'undefined') FeedView.render();
    }
};
