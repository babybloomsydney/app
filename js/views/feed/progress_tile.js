/**
 * FEED CARD: PROGRESS
 * Renders a "Skills Update" card.
 */

const FeedCard_Progress = {
    render: (item) => {
        // --- THE FIX ---
        // I have removed the line: if(item.refs && item.refs.length > 0) return "";
        // This ensures the card renders even if it is linked to an Activity.

        const date = Utils.formatDate(item.timestamp);
        
        // Handle optional note
        const noteHtml = item.data.note 
            ? `<div class="mb-3 pb-3 border-b border-slate-100"><p class="text-sm text-slate-600 italic">${item.data.note}</p></div>` 
            : "";
        
        // Build list of skills
        let list = "";
        (item.data.updates || []).forEach(u => {
            const dom = Utils.getMilestoneDomain(u.id);
            const desc = Utils.getMilestoneDesc(u.id);
            const scoreLabel = TXT.CORE.SCORES[u.score];
            
            list += `
            <div class="py-2 border-b border-slate-100 last:border-0">
                <div class="flex justify-between items-start">
                    <div class="flex items-start gap-2 pr-2 overflow-hidden">
                        <span class="text-[10px] bg-slate-100 text-slate-500 px-1 rounded font-bold whitespace-nowrap mt-0.5">${dom}</span>
                        <p class="text-xs font-bold text-slate-700 leading-snug truncate">${desc}</p>
                    </div>
                    <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded shrink-0">${scoreLabel}</span>
                </div>
            </div>`;
        });
        
        return `
        <div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4 animate-fade-in">
            <div class="flex justify-between items-center mb-3">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">
                        <i class="fa-solid fa-arrow-trend-up"></i>
                    </div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">${TXT.VIEWS.FEED.PROGRESS.BADGE}</span>
                </div>
                <span class="text-[10px] text-gray-400">${date}</span>
            </div>
            ${noteHtml}
            <div class="bg-white rounded-xl border border-slate-100 px-3">
                ${list}
            </div>
        </div>`;
    }
};
