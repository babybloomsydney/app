const FeedView = {
    render: async () => {
        const c = document.getElementById('feedContainer');
        c.innerHTML = '<div class="text-center py-10 text-gray-400"><i class="fa-solid fa-circle-notch fa-spin text-2xl"></i></div>';
        const res = await API.fetchFeed(STATE.child.childId);
        c.innerHTML = "";
        
        if (res.status === "success") {
            STATE.feed = res.data;
            if (STATE.feed.length === 0) c.innerHTML = '<div class="text-center py-10 text-gray-400">No history yet.</div>';
            STATE.feed.forEach(item => c.innerHTML += FeedView.card(item));
        }
    },
    
    card: (item) => {
        const d = Utils.formatDate(item.timestamp);
        
        if (item.type === "ACTIVITY") {
            const ai = item.data.activityJson || {};
            const title = ai.creativeName || item.title || "Generating...";
            const desc = ai.activityDescription || "Waiting for AI...";
            const isPending = item.data.activityJson === "PENDING_AI_RESPONSE";
            
            // If still pending, show loading state
            if(isPending) return `<div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4 opacity-70"><div class="flex items-center gap-2 text-indigo-500 font-bold text-xs mb-2"><i class="fa-solid fa-circle-notch fa-spin"></i> GENERATING...</div><h3 class="font-bold text-slate-800">Planning Activity...</h3></div>`;

            // If ready, use ActivityView to open details
            return `<div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4"><div class="flex justify-between mb-2"><span class="text-[10px] font-bold px-2 py-1 rounded-full bg-indigo-50 text-indigo-600">ACTIVITY RESOURCE</span><span class="text-[10px] text-gray-400">${d}</span></div><h3 class="font-bold text-lg mb-1">${title}</h3><p class="text-sm text-slate-500 mb-4 line-clamp-2">${desc}</p><button onclick="ActivityView.open('${item.id}')" class="w-full py-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-100">View Activity</button></div>`;
        }
        
        // Simple Cards
        if (item.type === "REPORT") return `<div class="feed-item bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4 flex gap-4"><div class="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><i class="fa-solid fa-clipboard-check"></i></div><div><p class="text-[10px] font-bold text-gray-400 uppercase">Report</p><p class="text-sm text-slate-700 italic">"${item.data.feedback}"</p></div></div>`;
        if (item.type === "OBSERVATION") return `<div class="feed-item bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4 flex gap-4"><div class="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0"><i class="fa-solid fa-eye"></i></div><div><p class="text-[10px] font-bold text-gray-400 uppercase">Observation</p><p class="text-sm text-slate-700 font-bold">${item.data.domain}</p><p class="text-sm text-slate-500">"${item.data.note}"</p></div></div>`;
        if (item.type === "PROGRESS") return `<div class="feed-item bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4 flex gap-4"><div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0"><i class="fa-solid fa-chart-line"></i></div><div><p class="text-[10px] font-bold text-gray-400 uppercase">Growth</p><p class="text-sm text-slate-700">Skills Updated.</p></div></div>`;
        return "";
    }
};
