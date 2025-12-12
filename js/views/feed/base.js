/**
 * FEED VIEW CONTROLLER
 * Aggregates all specific card renderers.
 */

const FeedView = {
    render: async () => {
        const c = document.getElementById('feedContainer');
        if(!c) return;

        // Loader
        if(c.innerHTML === "") c.innerHTML = '<div class="text-center py-10 text-gray-400"><i class="fa-solid fa-circle-notch fa-spin text-2xl"></i></div>';
        
        const res = await API.fetchFeed(STATE.child.childId);
        c.innerHTML = "";
        
        if (res.status === "success") {
            STATE.feed = res.data;
            if (STATE.feed.length === 0) {
                c.innerHTML = '<div class="text-center py-10 text-gray-400">No history yet.</div>';
                return;
            }
            
            // Loop and Delegate
            STATE.feed.forEach(item => {
                if (!item.type) return;

                if (item.type === "ACTIVITY") c.innerHTML += FeedCard_Activity.render(item);
                else if (item.type === "REPORT") c.innerHTML += FeedCard_Report.render(item);
                else if (item.type === "OBSERVATION") c.innerHTML += FeedCard_Observation.render(item);
                else if (item.type === "PROGRESS") c.innerHTML += FeedCard_Progress.render(item);
                else if (item.type === "INSIGHT") c.innerHTML += FeedCard_Insight.render(item);
            });
        } else {
            c.innerHTML = '<div class="text-center py-10 text-red-400">Failed to load feed.</div>';
        }
    }
};