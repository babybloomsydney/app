const FeedView = {
    render: async () => {
        const c = document.getElementById('feedContainer');
        // Only show loader if empty
        if(c.innerHTML === "") c.innerHTML = '<div class="text-center py-10 text-gray-400"><i class="fa-solid fa-circle-notch fa-spin text-2xl"></i></div>';
        
        const res = await API.fetchFeed(STATE.child.childId);
        c.innerHTML = "";
        
        if (res.status === "success") {
            STATE.feed = res.data;
            if (STATE.feed.length === 0) c.innerHTML = '<div class="text-center py-10 text-gray-400">No history yet.</div>';
            STATE.feed.forEach(item => c.innerHTML += FeedView.card(item));
        }
    },
    
    card: (item) => {
        const date = Utils.formatDate(item.timestamp);
        
        // --- 1. ACTIVITY CARD (Resource) ---
        if (item.type === "ACTIVITY") {
            const ai = item.data.activityJson || {};
            const title = ai.creativeName || item.title || "Generating...";
            const desc = ai.activityDescription || "Waiting for AI...";
            const rec = ai.recommendedLine || "";
            const isPending = item.data.activityJson === "PENDING_AI_RESPONSE";

            if(isPending) return `<div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4 opacity-70"><div class="flex items-center gap-2 text-indigo-500 font-bold text-xs mb-2"><i class="fa-solid fa-circle-notch fa-spin"></i> GENERATING...</div><h3 class="font-bold text-slate-800">Planning Activity...</h3></div>`;

            return `
            <div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4 relative overflow-hidden">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">Activity Plan</span>
                    <span class="text-[10px] text-gray-400">${date}</span>
                </div>
                <h3 class="font-bold text-slate-800 text-lg leading-tight mb-1">${title}</h3>
                <p class="text-xs text-indigo-600 font-bold mb-3">${rec}</p>
                <p class="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">${desc}</p>
                <button onclick="ActivityView.open('${item.id}')" class="w-full py-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-100 transition">View Activity</button>
            </div>`;
        }
        
        // --- 2. REPORT CARD (Linked) ---
        if (item.type === "REPORT") {
            const parentId = item.refs ? item.refs[0] : null;
            let parentTitle = "Unknown Activity";
            if(parentId) {
                const p = STATE.feed.find(x => x.id === parentId);
                if(p) parentTitle = (p.data.activityJson?.creativeName) || p.title;
            }
            return `
            <div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs"><i class="fa-solid fa-clipboard-check"></i></div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Activity Completed</span>
                    </div>
                    <span class="text-[10px] text-gray-400">${date}</span>
                </div>
                <div class="mb-4">
                    <p class="text-xs text-slate-400 font-bold uppercase mb-1">Referencing</p>
                    <p class="text-sm font-bold text-slate-800">${parentTitle}</p>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                    <p class="text-sm text-slate-600 leading-relaxed">${item.data.feedback || "No notes."}</p>
                </div>
                ${parentId?`<button onclick="ActivityView.open('${parentId}')" class="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">View Original Activity <i class="fa-solid fa-arrow-right"></i></button>`:''}
            </div>`;
        }

        // --- 3. OBSERVATION CARD ---
        if (item.type === "OBSERVATION") {
            const dName = CONFIG.DOMAINS[item.data.domain] || item.data.domain;
            const mDesc = item.data.milestoneId ? Utils.getMilestoneDesc(item.data.milestoneId) : null;
            const score = item.data.score !== null ? Utils.getScoreLabel(item.data.score) : null;
            return `
            <div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs"><i class="fa-solid fa-eye"></i></div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Observation</span>
                    </div>
                    <span class="text-[10px] text-gray-400">${date}</span>
                </div>
                <div class="mb-3">
                    <p class="text-xs text-purple-600 font-bold uppercase mb-1">${dName}</p>
                    ${mDesc?`<p class="text-sm font-bold text-slate-800 mb-2">${mDesc}</p>`:''}
                    <p class="text-sm text-slate-600 leading-relaxed">${item.data.note}</p>
                </div>
                ${score?`<div class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100"><i class="fa-solid fa-chart-simple text-xs"></i><span class="text-xs font-bold uppercase">Achieved: ${score}</span></div>`:''}
            </div>`;
        }
        
        // --- 4. PROGRESS CARD ---
        if (item.type === "PROGRESS") {
            let list = "";
            (item.data.updates||[]).forEach(u => {
                list += `<div class="py-2 border-b border-slate-100 last:border-0"><div class="flex justify-between items-start"><div class="pr-2"><p class="text-xs font-bold text-slate-700 mt-1">${Utils.getMilestoneDesc(u.id)}</p></div><span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded shrink-0">${Utils.getScoreLabel(u.score)}</span></div></div>`;
            });
            return `
            <div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-trend-up"></i></div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Growth Update</span>
                    </div>
                    <span class="text-[10px] text-gray-400">${date}</span>
                </div>
                <div class="bg-white rounded-xl border border-slate-100 px-3">${list}</div>
            </div>`;
        }
        return "";
    }
};
