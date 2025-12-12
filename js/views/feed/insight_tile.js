const FeedCard_Insight = {
    render: (item) => {
        const date = Utils.formatDate(item.timestamp);
        const text = item.data.text || "No insight available.";
        return `<div class="feed-item bg-amber-50 p-5 rounded-2xl shadow-sm border border-amber-100 mb-4"><div class="flex justify-between items-center mb-3"><div class="flex items-center gap-2"><div class="w-6 h-6 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-xs"><i class="fa-solid fa-lightbulb"></i></div><span class="text-[10px] font-bold text-amber-600 uppercase tracking-wide">${TXT.VIEWS.FEED.INSIGHT.BADGE}</span></div><span class="text-[10px] text-amber-400">${date}</span></div><div class="mb-1"><p class="text-sm text-slate-700 leading-relaxed font-medium">"${text}"</p></div></div>`;
    }
};
