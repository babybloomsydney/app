/**
 * VIEW: ACTIVITY DETAIL
 */

const ActivityView = {
    open: (activityId) => {
        const act = STATE.feed.find(x => x.id === activityId);
        if(!act) return;
        const ai = act.data.activityJson || {};
        STATE.reviewActivityId = activityId; 

        document.getElementById('detailTitle').innerText = ai.creativeName || "Activity Detail";
        document.getElementById('detailRec').innerText = ai.recommendedLine || "";
        document.getElementById('detailDesc').innerText = ai.activityDescription || "";

        const c = document.getElementById('detailAccordions');
        let h = "";
        
        const sect = (icon, title, content) => `<div class="border border-slate-200 rounded-xl bg-white overflow-hidden group"><button onclick="this.nextElementSibling.classList.toggle('accordion-open');this.querySelector('.fa-chevron-down').classList.toggle('rotate-180')" class="w-full text-left p-4 flex justify-between items-center bg-white hover:bg-slate-50 transition"><div class="flex items-center gap-3"><div class="w-6 h-6 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center text-xs"><i class="${icon}"></i></div><span class="font-bold text-sm text-slate-700">${title}</span></div><i class="fa-solid fa-chevron-down text-slate-300 transition-transform duration-300"></i></button><div class="accordion-content bg-slate-50 px-4 text-sm text-slate-600"><div class="py-4 border-t border-slate-100 leading-relaxed space-y-2">${content}</div></div></div>`;

        if (ai.objectivesList) h += sect("fa-solid fa-bullseye", "Objectives", `<ul class="space-y-2">${ai.objectivesList.map(o=>`<li class="flex gap-2"><i class="fa-solid fa-check text-indigo-400 mt-1"></i><span>${o}</span></li>`).join('')}</ul>`);
        
        // NEW: Intention Section
        if (ai.intention) h += sect("fa-solid fa-heart", "Intention", `<p class="leading-relaxed text-slate-600 italic">"${ai.intention}"</p>`);
        
        if (ai.supplies) h += sect("fa-solid fa-basket-shopping", "You Will Need", `<ul class="space-y-2">${ai.supplies.map(s=>`<li class="flex gap-2"><i class="fa-solid fa-box text-emerald-500 mt-1"></i><span>${s}</span></li>`).join('')}</ul>${ai.suppliesDisclaimer?`<div class="mt-3 p-3 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold flex gap-2"><i class="fa-solid fa-triangle-exclamation mt-0.5"></i><p>${ai.suppliesDisclaimer}</p></div>`:''}`);
        
        if (ai.activityGuide) h += sect("fa-solid fa-shoe-prints", "Step-by-Step", `<div class="space-y-4">${ai.activityGuide.map((s,i)=>`<div class="flex gap-3"><span class="w-6 h-6 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">${i+1}</span><p>${s}</p></div>`).join('')}</div>`);
        
        if (ai.encouragementTips) h += sect("fa-solid fa-comments", "Encouragement", `<ul class="space-y-2">${ai.encouragementTips.map(t=>`<li class="bg-indigo-50 p-3 rounded-lg text-indigo-900 text-xs border border-indigo-100"><i class="fa-solid fa-lightbulb mr-2 text-indigo-500"></i> ${t}</li>`).join('')}</ul>`);
        
        // NEW: Full Observations Loop
        if (ai.keyObservations && ai.keyObservations.length > 0) {
            let obsHtml = ai.keyObservations.map(o => `
            <div class="mb-6 last:mb-0 border-b border-slate-200 pb-4 last:border-0">
                <p class="text-xs font-bold text-slate-400 uppercase mb-1">${o.domain || "Observation"}</p>
                <p class="font-bold text-slate-800 mb-3">${o.objective || ""}</p>
                <div class="space-y-2 text-xs">
                    <div class="p-2 bg-slate-50 rounded border border-slate-100"><strong class="text-slate-900 block mb-1">Introduced:</strong> ${o.levels?.introduced||"N/A"}</div>
                    <div class="p-2 bg-indigo-50 rounded border border-indigo-100"><strong class="text-indigo-800 block mb-1">Assisted:</strong> ${o.levels?.assisted||"N/A"}</div>
                    <div class="p-2 bg-blue-50 rounded border border-blue-100"><strong class="text-blue-800 block mb-1">Guided:</strong> ${o.levels?.guided||"N/A"}</div>
                    <div class="p-2 bg-emerald-50 rounded border border-emerald-100"><strong class="text-emerald-900 block mb-1">Independent:</strong> ${o.levels?.independent||"N/A"}</div>
                </div>
            </div>`).join("");
            h += sect("fa-solid fa-magnifying-glass", "What to Look For", `<div>${obsHtml}</div>`);
        }

        c.innerHTML = h;
        Modals.open('activityDetail');
    },
    
    startReport: () => { Modals.close(); ActivityView.openReviewModal(); },
    
    openReviewModal: () => {
        const id = STATE.reviewActivityId;
        const act = STATE.feed.find(x => x.id === id);
        const ai = act.data.activityJson || {};
        
        document.getElementById('reviewTitle').innerText = ai.creativeName || "Activity Report";
        const container = document.getElementById('reviewObjectives');
        container.innerHTML = "";
        
        const levels = [
            {l:"Introduced",s:1}, {l:"Assisted",s:2}, {l:"Guided",s:3}, {l:"Independent",s:4}
        ];

        (act.data.milestoneIds || []).forEach(mid => {
            const m = STATE.library.find(x => x.id === mid) || {desc: mid, domain: "Skill"};
            // NEW: Text Buttons
            const buttons = levels.map(lvl => `
                <button onclick="ActivityView.rate(this, '${mid}', ${lvl.s})" 
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
        btn.dataset.id = id; btn.dataset.score = score;
    },

    submitReport: async () => {
        const ratings = [];
        document.querySelectorAll('.rate-btn.selected').forEach(b => {
            ratings.push({id: b.dataset.id, score: parseInt(b.dataset.score)});
        });
        
        if (ratings.length === 0) return alert("Please select a mastery level for at least one skill.");

        const btn = document.querySelector('#reviewModal button');
        const oldText = btn.innerText;
        btn.innerText = "Submitting...";
        btn.disabled = true;
        
        await API.submitReport(STATE.child.childId, STATE.reviewActivityId, ratings, document.getElementById('reviewNote').value);
        
        btn.innerText = oldText;
        btn.disabled = false;
        Modals.close(); 
        
        if (typeof FeedView !== 'undefined') FeedView.render();
        if (typeof ProgressView !== 'undefined') ProgressView.render();
    }
};
