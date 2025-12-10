const ActivityView = {
    open: (id) => {
        const act = STATE.feed.find(x => x.id === id);
        if(!act) return;
        STATE.reviewActivityId = id;
        const ai = act.data.activityJson || {};
        
        document.getElementById('detailTitle').innerText = ai.creativeName || "Activity";
        document.getElementById('detailRec').innerText = ai.recommendedLine || "";
        document.getElementById('detailDesc').innerText = ai.activityDescription || "";
        
        const c = document.getElementById('detailAccordions');
        let h = "";
        
        const section = (icon, title, inner) => `<div class="border border-slate-200 rounded-xl bg-white overflow-hidden"><button onclick="this.nextElementSibling.classList.toggle('accordion-open');this.querySelector('i.fa-chevron-down').classList.toggle('rotate-180')" class="w-full text-left p-4 flex justify-between items-center hover:bg-slate-50"><div class="flex items-center gap-3"><div class="w-6 h-6 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center text-xs"><i class="${icon}"></i></div><span class="font-bold text-sm text-slate-700">${title}</span></div><i class="fa-solid fa-chevron-down text-slate-300 transition-transform"></i></button><div class="accordion-content bg-slate-50 px-4 text-sm text-slate-600"><div class="py-4 border-t border-slate-100 space-y-2">${inner}</div></div></div>`;

        if(ai.objectivesList) h += section("fa-solid fa-bullseye", "Objectives", `<ul class="space-y-2">${ai.objectivesList.map(o=>`<li class="flex gap-2"><i class="fa-solid fa-check text-indigo-400"></i><span>${o}</span></li>`).join('')}</ul>`);
        if(ai.supplies) h += section("fa-solid fa-box", "Supplies", `<ul class="space-y-2">${ai.supplies.map(s=>`<li class="flex gap-2"><i class="fa-solid fa-box text-emerald-500"></i><span>${s}</span></li>`).join('')}</ul>`);
        if(ai.activityGuide) h += section("fa-solid fa-list-ol", "Guide", `<div class="space-y-3">${ai.activityGuide.map((s,i)=>`<div class="flex gap-3"><span class="w-5 h-5 rounded-full bg-slate-200 text-xs font-bold flex items-center justify-center shrink-0">${i+1}</span><p>${s}</p></div>`).join('')}</div>`);
        
        c.innerHTML = h;
        Modals.open('activityDetail');
    },
    
    startReport: () => {
        Modals.close();
        // Trigger the Review Logic (which is in FeedView context or ActivityView context)
        // We reuse the logic we built in the previous iteration
        ActivityView.openReviewModal();
    },

    openReviewModal: () => {
        const id = STATE.reviewActivityId;
        const act = STATE.feed.find(x => x.id === id);
        const ai = act.data.activityJson || {};
        
        document.getElementById('reviewTitle').innerText = ai.creativeName || "Report";
        const container = document.getElementById('reviewObjectives');
        container.innerHTML = "";
        
        (act.data.milestoneIds || []).forEach(mid => {
            const m = STATE.library.find(x => x.id === mid) || {desc: mid};
            container.innerHTML += `<div class="mb-4"><p class="text-xs font-bold text-slate-500 mb-2">${m.desc}</p><div class="grid grid-cols-5 gap-1">${[0,1,2,3,4].map(n=>`<button onclick="ActivityView.rate(this,'${mid}',${n})" class="rate-btn p-2 rounded border border-slate-200 text-xs font-bold text-slate-400">${n}</button>`).join('')}</div></div>`;
        });
        Modals.open('review');
    },

    rate: (btn, id, score) => {
        btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        btn.dataset.id = id; btn.dataset.score = score;
    },

    submitReport: async () => {
        const ratings = [];
        document.querySelectorAll('.rate-btn.selected').forEach(b => ratings.push({id:b.dataset.id, score:parseInt(b.dataset.score)}));
        const btn = document.querySelector('#reviewModal button');
        btn.innerText = "Submitting...";
        await API.submitReport(STATE.child.childId, STATE.reviewActivityId, ratings, document.getElementById('reviewNote').value);
        btn.innerText = "Complete";
        Modals.close(); 
        // Reload Feed
        FeedView.render();
    }
};