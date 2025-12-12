const FeedCard_Report = {
    render: (item) => {
        const date = Utils.formatDate(item.timestamp);
        const parentId = item.refs ? item.refs[0] : null;
        let parentTitle = TXT.COMPONENTS.MODALS.REVIEW.HEADER;
        if(parentId && STATE.feed) {
            const p = STATE.feed.find(x => x.id === parentId);
            if(p) parentTitle = (p.data.activityJson?.creativeName) || p.title || TXT.COMPONENTS.MODALS.REVIEW.HEADER;
        }
        const progressItem = STATE.feed.find(x => x.type === "PROGRESS" && x.refs && x.refs.includes(item.id));
        let progressHtml = "";
       
        if (progressItem && progressItem.data.updates) {
            progressHtml = `<div class="mt-3 pt-3 border-t border-slate-100"><p class="text-[10px] font-bold text-emerald-600 uppercase mb-2">${TXT.VIEWS.FEED.REPORT.LABEL_PROGRESS}</p><div class="space-y-2">`;
            progressItem.data.updates.forEach(u => {
                const dom = Utils.getMilestoneDomain(u.id);
                progressHtml += `<div class="flex justify-between items-center"><div class="flex items-center gap-2 truncate w-3/4"><span class="text-[10px] bg-slate-100 text-slate-500 px-1 rounded font-bold">${dom}</span><span class="text-xs text-slate-600 truncate">${Utils.getMilestoneDesc(u.id)}</span></div><span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded shrink-0">${TXT.CORE.SCORES[u.score]}</span></div>`;
            });
            progressHtml += `</div></div>`;
        }
        return `<div class="feed-item bg-white p-5 rounded-2xl shadow-sm shadow-sm border border-slate-100 mb-4"><div class="flex justify-between items-center mb-1"><div class="flex items-center gap-2"><div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs"><i class="fa-solid fa-clipboard-check"></i></div><span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">${TXT.VIEWS.FEED.REPORT.BADGE}</span></div><span class="text-[10px] text-gray-400">${date}</span></div><h3 class="font-bold text-slate-800 text-lg mb-2 leading-tight">${parentTitle}</h3>${item.data.feedback ? `<p class="text-sm text-slate-600 leading-relaxed mb-3">${item.data.feedback}</p>` : ''}${progressHtml}${parentId ? `<button onclick="ActivityView.open('${parentId}')" class="mt-4 text-xs font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1 transition">${TXT.VIEWS.FEED.REPORT.BTN_LINK} <i class="fa-solid fa-chevron-right text-[10px]"></i></button>` : ''}</div>`;
    }
};
