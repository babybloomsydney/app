const FeedView = {
    render: async () => {
        const c = document.getElementById('feedContainer');
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
            const isDone = item.status === "COMPLETED"; // Used for logic if needed, but not display
            const ai = item.data.activityJson || {};
            const title = ai.creativeName || item.title || "Generating...";
            const desc = ai.activityDescription || "Waiting for AI...";
            const rec = ai.recommendedLine || "";
            const isPending = item.data.activityJson === "PENDING_AI_RESPONSE";

            if(isPending) return `<div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4 opacity-70"><div class="flex items-center gap-2 text-indigo-500 font-bold text-xs mb-2"><i class="fa-solid fa-circle-notch fa-spin"></i> GENERATING...</div><h3 class="font-bold text-slate-800">Planning Activity...</h3></div>`;

            return `
            <div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4 group relative overflow-hidden">
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
            // Find parent activity name
            const parentId = item.refs ? item.refs[0] : null;
            let parentTitle = "Unknown Activity";
            if(parentId) {
                const parentAct = STATE.feed.find(x => x.id === parentId);
                if(parentAct) {
                    const pai = parentAct.data.activityJson || {};
                    parentTitle = pai.creativeName || parentAct.title;
                }
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
                    <p class="text-sm text-slate-600 leading-relaxed">${item.data.feedback || "No notes recorded."}</p>
                </div>

                ${parentId ? `<button onclick="ActivityView.open('${parentId}')" class="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">View Original Activity <i class="fa-solid fa-arrow-right"></i></button>` : ''}
            </div>`;
        }

        // --- 3. OBSERVATION CARD (Detailed) ---
        if (item.type === "OBSERVATION") {
            const domainCode = item.data.domain; // e.g. "PD"
            const domainName = CONFIG.DOMAINS[domainCode] || domainCode;
            const mId = item.data.milestoneId;
            const mDesc = mId ? Utils.getMilestoneDesc(mId) : null;
            const scoreLabel = item.data.score !== null ? Utils.getScoreLabel(item.data.score) : null;

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
                    <p class="text-xs text-purple-600 font-bold uppercase mb-1">${domainName}</p>
                    ${mDesc ? `<p class="text-sm font-bold text-slate-800 mb-2">${mDesc}</p>` : ''}
                    <p class="text-sm text-slate-600 leading-relaxed">${item.data.note || ""}</p>
                </div>

                ${scoreLabel ? `
                <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                    <i class="fa-solid fa-chart-simple text-xs"></i>
                    <span class="text-xs font-bold uppercase">Achieved: ${scoreLabel}</span>
                </div>` : ''}
            </div>`;
        }
        
        // --- 4. PROGRESS CARD (Detailed List) ---
        if (item.type === "PROGRESS") {
            const updates = item.data.updates || [];
            
            // Build the list of changes
            let updatesHtml = "";
            updates.forEach(u => {
                const desc = Utils.getMilestoneDesc(u.id);
                const domainCode = Utils.getMilestoneDomain(u.id); // Need helper
                const scoreLabel = Utils.getScoreLabel(u.score);
                
                updatesHtml += `
                <div class="py-2 border-b border-slate-100 last:border-0">
                    <div class="flex justify-between items-start">
                        <div class="pr-2">
                            <span class="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-1 rounded">${domainCode}</span>
                            <p class="text-xs font-bold text-slate-700 mt-1">${desc}</p>
                        </div>
                        <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded shrink-0">${scoreLabel}</span>
                    </div>
                </div>`;
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
                
                <div class="bg-white rounded-xl border border-slate-100 px-3">
                    ${updatesHtml}
                </div>
            </div>`;
        }

        return "";
    }
};
