/**
 * FEED VIEW CONTROLLER
 * Aggregates all specific card renderers.
 */

const FeedView = {
    currentFilter: 'All',

    render: async () => {
        const c = document.getElementById('feedContainer');
        if(!c) return;

        // Loader
        if(c.innerHTML === "") c.innerHTML = '<div class="text-center py-10 text-gray-400"><i class="fa-solid fa-circle-notch fa-spin text-2xl"></i><p class="text-xs mt-2">Loading timeline...</p></div>';
        
        const res = await API.fetchFeed(STATE.child.childId);
        c.innerHTML = "";
        
        if (res.status === "success") {
            STATE.feed = res.data;
            if (STATE.feed.length === 0) {
                c.innerHTML = '<div class="text-center py-10 text-gray-400">No history yet. Start by planning an activity!</div>';
                return;
            }
            
            // Filter Logic
            const filteredFeed = STATE.feed.filter(item => {
                if (FeedView.currentFilter === 'All') {
                    // Hide child logs (context check)
                    return !item.context || item.type === "REPORT" || item.context === "ADHOC"; 
                }
                if (FeedView.currentFilter === 'Obs') return item.type === "OBSERVATION";
                if (FeedView.currentFilter === 'Growth') return item.type === "PROGRESS";
                if (FeedView.currentFilter === 'Insights') return item.type === "INSIGHT";
                return true;
            });

            if(filteredFeed.length === 0) {
                c.innerHTML = '<div class="text-center py-10 text-gray-400">No items found for this filter.</div>';
                return;
            }

            // Loop and Delegate
            let feedHtml = "";
            filteredFeed.forEach(item => {
                try {
                    if (item.type === "ACTIVITY" && typeof FeedCard_Activity !== 'undefined') feedHtml += FeedCard_Activity.render(item);
                    else if (item.type === "REPORT" && typeof FeedCard_Report !== 'undefined') feedHtml += FeedCard_Report.render(item);
                    else if (item.type === "OBSERVATION" && typeof FeedCard_Observation !== 'undefined') feedHtml += FeedCard_Observation.render(item);
                    else if (item.type === "PROGRESS" && typeof FeedCard_Progress !== 'undefined') feedHtml += FeedCard_Progress.render(item);
                    else if (item.type === "INSIGHT" && typeof FeedCard_Insight !== 'undefined') feedHtml += FeedCard_Insight.render(item);
                } catch(e) {
                    console.error("Card Render Error:", e);
                }
            });
            c.innerHTML = feedHtml;
        } else {
            c.innerHTML = '<div class="text-center py-10 text-red-400">Failed to load feed.</div>';
        }
    },

    filter: (type) => {
        FeedView.currentFilter = type;
        
        // Update UI Pills
        document.querySelectorAll('.filter-pill').forEach(btn => {
            if(btn.innerText.includes(type)) {
                btn.className = "filter-pill active bg-slate-800 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md transition whitespace-nowrap ring-1 ring-slate-800";
            } else {
                btn.className = "filter-pill bg-white text-slate-500 border border-slate-200 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition whitespace-nowrap";
            }
        });

        FeedView.render();
    }
};
