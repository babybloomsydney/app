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
            <div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4 relative overflow-hidden group">
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
            // A. Find Parent Activity Title
            const parentId = item.refs ? item.refs[0] : null;
            let parentTitle = "Unknown Activity";
            if(parentId) {
                const p = STATE.feed.find(x => x.id === parentId);
                if(p) {
                    parentTitle = (p.data.activityJson?.creativeName) || p.title;
                }
            }
            
            // B. Find Associated Progress (Child of this Report)
            const progressItem = STATE.feed.find(x => x.type === "PROGRESS" && x.refs && x.refs.includes(item.id));
            let progressHtml = "";
            
            if (progressItem && progressItem.data.updates) {
                progressHtml = `<div class="mt-3 pt-3 border-t border-slate-100">
                    <p class="text-[10px] font-bold text-emerald-600 uppercase mb-2">Progress Update</p>
                    <div class="space-y-2">`;
                
                progressItem.data.updates.forEach(u => {
                    const dom = Utils.getMilestoneDomain(u.id);
                    progressHtml += `
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2 truncate w-3/4">
                            <span class="text-[10px] bg-slate-100 text-slate-500 px-1 rounded font-bold">${dom}</span>
                            <span class="text-xs text-slate-600 truncate">${Utils.getMilestoneDesc(u.id)}</span>
                        </div>
                        <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded shrink-0">${Utils.getScoreLabel(u.score)}</span>
                    </div>`;
                });
                progressHtml += `</div></div>`;
            }

            // C. Render
            return `
            <div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4">
                <div class="flex justify-between items-center mb-1">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs"><i class="fa-solid fa-clipboard-check"></i></div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Activity Completed</span>
                    </div>
                    <span class="text-[10px] text-gray-400">${date}</span>
                </div>
                
                <h3 class="font-bold text-slate-800 text-lg mb-2 leading-tight">${parentTitle}</h3>

                ${item.data.feedback ? `<p class="text-sm text-slate-600 leading-relaxed mb-3">${item.data.feedback}</p>` : ''}

                ${progressHtml}

                ${parentId ? `<button onclick="ActivityView.open('${parentId}')" class="mt-4 text-xs font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1 transition">View Activity Details <i class="fa-solid fa-chevron-right text-[10px]"></i></button>` : ''}
            </div>`;
        }

        // --- 3. OBSERVATION CARD ---
        if (item.type === "OBSERVATION") {
            const rawDomain = item.data.domain || "General";
            let displayDomains = rawDomain;
            
            // Format Tags
            if (rawDomain !== "General" && rawDomain.includes(",")) {
                displayDomains = rawDomain.split(',').map(d => {
                    const code = d.trim();
                    const name = CONFIG.DOMAINS[code] || code;
                    return `<span class="bg-purple-50 text-purple-700 px-2 py-0.5 rounded mr-1">${name}</span>`;
                }).join("");
            } else if (rawDomain !== "General") {
                const name = CONFIG.DOMAINS[rawDomain] || rawDomain;
                displayDomains = `<span class="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">${name}</span>`;
            } else {
                displayDomains = `<span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">General</span>`;
            }
            
            const mDesc = item.data.milestoneId ? Utils.getMilestoneDesc(item.data.milestoneId) : null;
            const score = item.data.score !== null && item.data.score !== undefined ? Utils.getScoreLabel(item.data.score) : null;

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
                    <div class="text-[10px] font-bold uppercase mb-2 flex flex-wrap gap-1">${displayDomains}</div>
                    ${mDesc ? `<p class="text-sm font-bold text-slate-800 mb-2">${mDesc}</p>` : ''}
                    <p class="text-sm text-slate-600 leading-relaxed">${item.data.note}</p>
                </div>
                ${score ? `<div class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100"><i class="fa-solid fa-chart-simple text-xs"></i><span class="text-xs font-bold uppercase">Achieved: ${score}</span></div>` : ''}
            </div>`;
        }
        
        // --- 4. PROGRESS CARD (Standalone - Growth) ---
        if (item.type === "PROGRESS") {
            // Hide duplicates linked to Reports
            if(item.refs && item.refs.length > 0) return ""; 
            
            // Note Display
            const noteHtml = item.data.note ? `<div class="mb-3 pb-3 border-b border-slate-100"><p class="text-sm text-slate-600 italic">${item.data.note}</p></div>` : "";

            let list = "";
            (item.data.updates||[]).forEach(u => {
                const dom = Utils.getMilestoneDomain(u.id);
                // Added Domain Badge to list item
                list += `
                <div class="py-2 border-b border-slate-100 last:border-0">
                    <div class="flex justify-between items-start">
                        <div class="flex items-start gap-2 pr-2 overflow-hidden">
                            <span class="text-[10px] bg-slate-100 text-slate-500 px-1 rounded font-bold whitespace-nowrap mt-0.5">${dom}</span>
                            <p class="text-xs font-bold text-slate-700 leading-snug truncate">${Utils.getMilestoneDesc(u.id)}</p>
                        </div>
                        <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded shrink-0">${Utils.getScoreLabel(u.score)}</span>
                    </div>
                </div>`;
            });
            
            return `
            <div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs"><i class="fa-solid fa-arrow-trend-up"></i></div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Growth</span>
                    </div>
                    <span class="text-[10px] text-gray-400">${date}</span>
                </div>
                ${noteHtml}
                <div class="bg-white rounded-xl border border-slate-100 px-3">${list}</div>
            </div>`;
        }
        return "";
    }
};
