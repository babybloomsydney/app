/**
 * FEED CARD: DIARY
 * Renders Food and Sleep logs.
 */
const FeedCard_Diary = {
    render: (item) => {
        const date = Utils.formatDate(item.timestamp);
        const subtype = item.data.subtype || "Entry";
        const context = item.context || "DIARY";
        const details = item.data.details || "";
        const time = item.data.time || item.data.start || "";
       
        let iconClass = "fa-solid fa-note-sticky";
        let colorClass = "bg-slate-100 text-slate-600";
        let title = "Diary Entry";
        // Style based on Context/Subtype
        if (context === "FOOD") {
            colorClass = "bg-orange-100 text-orange-600";
            if (subtype === "Bottle") iconClass = "fa-solid fa-bottle-water";
            else iconClass = "fa-solid fa-utensils";
            title = `${subtype}`;
        } else if (context === "SLEEP") {
            colorClass = "bg-indigo-100 text-indigo-600";
            iconClass = "fa-solid fa-moon";
            title = "Sleep";
        }
        // Specific Content Rendering
        let contentHtml = "";
       
        if (context === "SLEEP") {
            const start = item.data.start || "?";
            const end = item.data.end || "?";
            const duration = item.data.duration || "";
            contentHtml = `
            <div class="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div class="text-center">
                    <p class="text-[10px] uppercase font-bold text-slate-400">Asleep</p>
                    <p class="text-lg font-bold text-slate-700">${start}</p>
                </div>
                <div class="h-0.5 w-8 bg-slate-200"></div>
                <div class="text-center">
                    <p class="text-[10px] uppercase font-bold text-slate-400">Awake</p>
                    <p class="text-lg font-bold text-slate-700">${end}</p>
                </div>
            </div>
            ${duration ? `<div class="mt-2 text-center text-xs font-bold text-indigo-500">Total: ${duration}</div>` : ''}
            ${item.data.notes ? `<div class="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600">${item.data.notes}</div>` : ''}
            ;
        } else {
            // Food
            contentHtml = `
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                <p class="font-bold text-slate-700 text-sm">${details}</p>
                <span class="text-xs font-mono text-slate-400">${time}</span>
            </div>`;
        }
        return `
        <div class="feed-item bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4 animate-fade-in">
            <div class="flex justify-between items-center mb-3">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full ${colorClass} flex items-center justify-center text-xs">
                        <i class="${iconClass}"></i>
                    </div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">${title}</span>
                </div>
                <span class="text-[10px] text-gray-400">${date}</span>
            </div>
            ${contentHtml}
        </div>`;
    }
};
