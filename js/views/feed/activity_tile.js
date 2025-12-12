const FeedCard_Activity = {
    render: (item) => {
        const date = Utils.formatDate(item.timestamp);
        const ai = item.data.activityJson || {};
       
        const title = ai.creativeName || item.title || TXT.VIEWS.FEED.ACTIVITY.TITLE_PENDING;
        const desc = ai.activityDescription || TXT.VIEWS.FEED.ACTIVITY.TITLE_PENDING;
        const rec = ai.recommendedLine || "";
       
        const isPending = item.data.activityJson === "PENDING_AI_RESPONSE";
        if(isPending) {
            return `
            <div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4 opacity-70">
                <div class="flex items-center gap-2 text-indigo-500 font-bold text-xs mb-2">
                    <i class="fa-solid fa-circle-notch fa-spin"></i> ${TXT.VIEWS.FEED.ACTIVITY.BADGE_PENDING}
                </div>
                <h3 class="font-bold text-slate-800">${TXT.VIEWS.FEED.ACTIVITY.TITLE_PENDING}</h3>
            </div>`;
        }
        return `
        <div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4 relative overflow-hidden group">
            <div class="flex justify-between items-center mb-2">
                <span class="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">${TXT.VIEWS.FEED.ACTIVITY.BADGE_PLAN}</span>
                <span class="text-[10px] text-gray-400">${date}</span>
            </div>
            <h3 class="font-bold text-slate-800 text-lg leading-tight mb-1">${title}</h3>
            <p class="text-xs text-indigo-600 font-bold mb-3">${rec}</p>
            <p class="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">${desc}</p>
            <button onclick="ActivityView.open('${item.id}')" class="w-full py-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-100 transition">
                ${TXT.VIEWS.FEED.ACTIVITY.BTN_VIEW}
            </button>
        </div>`;
    }
};
