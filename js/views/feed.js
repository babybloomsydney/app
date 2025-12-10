const FeedView = {
    render: async () => {
        const c = document.getElementById('feedContainer');
        c.innerHTML = '<div class="text-center py-10 text-gray-400"><i class="fa-solid fa-circle-notch fa-spin"></i></div>';
        const res = await API.fetchFeed(STATE.child.childId);
        c.innerHTML = "";
        if(res.status==="success") {
            STATE.feed = res.data;
            if(STATE.feed.length===0) c.innerHTML='<div class="text-center py-10 text-gray-400">No history yet.</div>';
            STATE.feed.forEach(i => c.innerHTML += FeedView.card(i));
        }
    },
    card: (item) => {
        const d = Utils.formatDate(item.timestamp);
        if(item.type==="ACTIVITY") {
            const done = item.status==="COMPLETED";
            const ai = item.data.activityJson||{};
            return `<div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4"><div class="flex justify-between mb-2"><span class="text-[10px] font-bold px-2 py-1 rounded-full ${done?'bg-slate-100 text-slate-500':'bg-indigo-50 text-indigo-600'}">${done?'COMPLETED':'READY'}</span><span class="text-[10px] text-gray-400">${d}</span></div><h3 class="font-bold text-lg mb-2">${ai.creativeName||item.title}</h3><p class="text-sm text-slate-500 mb-4 line-clamp-2">${ai.activityDescription||"Waiting..."}</p>${!done?`<button onclick="FeedView.openReview('${item.id}')" class="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md">Start & Complete</button>`:''}</div>`;
        }
        if(item.type==="REPORT") return `<div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4 flex gap-4"><div class="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><i class="fa-solid fa-clipboard-check"></i></div><div><p class="text-[10px] font-bold text-gray-400 uppercase">Report</p><p class="text-sm text-slate-700 italic">"${item.data.feedback}"</p></div></div>`;
        if(item.type==="OBSERVATION") return `<div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4 flex gap-4"><div class="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0"><i class="fa-solid fa-eye"></i></div><div><p class="text-[10px] font-bold text-gray-400 uppercase">Observation</p><p class="text-sm text-slate-700">"${item.data.note}"</p></div></div>`;
        if(item.type==="PROGRESS") return `<div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4 flex gap-4"><div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0"><i class="fa-solid fa-chart-line"></i></div><div><p class="text-[10px] font-bold text-gray-400 uppercase">Growth</p><p class="text-sm text-slate-700">Skills Updated.</p></div></div>`;
        return "";
    },
    openReview: (id) => {
        STATE.reviewActivityId=id; const act=STATE.feed.find(x=>x.id===id);
        document.getElementById('reviewTitle').innerText=(act.data.activityJson?.creativeName)||"Review";
        document.getElementById('reviewDesc').innerText=(act.data.activityJson?.activityDescription)||"";
        const c=document.getElementById('reviewObjectives'); c.innerHTML="";
        (act.data.milestoneIds||[]).forEach(mid=>{
            c.innerHTML+=`<div class="mb-4"><p class="text-xs font-bold text-slate-500 mb-2">${Utils.getMilestoneDesc(mid)}</p><div class="grid grid-cols-5 gap-1">${[0,1,2,3,4].map(n=>`<button onclick="FeedView.selectRate(this,'${mid}',${n})" class="rate-btn p-2 rounded border border-slate-200 text-xs">${n}</button>`).join('')}</div></div>`;
        });
        Modals.open('review');
    },
    selectRate: (btn,id,s) => {
        btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('selected'));
        btn.classList.add('selected'); btn.dataset.id=id; btn.dataset.score=s;
    }
};
