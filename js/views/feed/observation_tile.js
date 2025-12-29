const FeedCard_Observation = {
    render: (item) => {
        const date = Utils.formatDate(item.timestamp);
        const rawDomain = item.data.domain || "General";
        let displayDomains = rawDomain;
       
        // Existing Domain Badge Logic
        if (rawDomain !== "General" && rawDomain.includes(",")) {
            displayDomains = rawDomain.split(',').map(d => `<span class="bg-purple-50 text-purple-700 px-2 py-0.5 rounded mr-1">${CONFIG.DOMAINS[d.trim()] || d.trim()}</span>`).join("");
        } else if (rawDomain !== "General") {
            displayDomains = `<span class="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">${CONFIG.DOMAINS[rawDomain] || rawDomain}</span>`;
        } else {
            displayDomains = `<span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">${TXT.COMPONENTS.MODALS.OBSERVATION.GENERAL.BADGE}</span>`;
        }

        const mDesc = item.data.milestoneId ? Utils.getMilestoneDesc(item.data.milestoneId) : null;
        const score = item.data.score !== null ? TXT.CORE.SCORES[item.data.score] : null;

        // --- NEW: Image Logic ---
        const imageHtml = item.data.imageUrl 
            ? `<div class="mb-3 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                 <img src="${item.data.imageUrl}" class="w-full h-auto object-cover" loading="lazy" alt="Observation" />
               </div>` 
            : "";

        return `
        <div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4">
            <div class="flex justify-between items-center mb-3">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
                        <i class="fa-solid fa-eye"></i>
                    </div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">${TXT.VIEWS.FEED.OBSERVATION.BADGE}</span>
                </div>
                <span class="text-[10px] text-gray-400">${date}</span>
            </div>
            
            ${imageHtml} <!-- Image injected here -->

            <div class="mb-3">
                <div class="text-[10px] font-bold uppercase mb-2 flex flex-wrap gap-1">${displayDomains}</div>
                ${mDesc ? `<p class="text-sm font-bold text-slate-800 mb-2">${mDesc}</p>` : ''}
                <p class="text-sm text-slate-600 leading-relaxed">${item.data.note}</p>
            </div>
            
            ${score ? `<div class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100"><i class="fa-solid fa-chart-simple text-xs"></i><span class="text-xs font-bold uppercase">${TXT.VIEWS.FEED.OBSERVATION.BADGE_ACHIEVED}: ${score}</span></div>` : ''}
        </div>`;
    }
};
