/**
 * FEED VIEW CONTROLLER
 * Aggregates all specific card renderers.
 */
const FeedView = {
    render: async () => {
        const c = document.getElementById('feedContainer');
        if (!c) return;
        // 1. Show Loader
        c.innerHTML = `<div class="text-center py-10 text-gray-400"><i class="fa-solid fa-circle-notch fa-spin text-2xl"></i><p class="text-xs mt-2">${TXT.VIEWS.FEED.LOADING}</p></div>`;
       
        try {
            // 2. Fetch Data
            const res = await API.fetchFeed(STATE.child.childId);
           
            // 3. Clear Loader
            c.innerHTML = "";
           
            if (res.status === "success") {
                STATE.feed = res.data;
                console.log("Feed Data Loaded:", STATE.feed); // DEBUG: Check console to see your data
               
                if (STATE.feed.length === 0) {
                    c.innerHTML = `<div class="text-center py-10 text-gray-400">${TXT.VIEWS.FEED.EMPTY}</div>`;
                    return;
                }
               
                // 4. Build HTML (Buffered)
                let feedHtml = "";
               
                STATE.feed.forEach(item => {
                    // Safety: Ensure type exists
                    if (!item.type) return;
                    try {
                        let cardHtml = "";
                       
                        // Delegate to specific renderers
                        if (item.type === "ACTIVITY" && typeof FeedCard_Activity !== 'undefined') {
                            cardHtml = FeedCard_Activity.render(item);
                        }
                        else if (item.type === "REPORT" && typeof FeedCard_Report !== 'undefined') {
                            cardHtml = FeedCard_Report.render(item);
                        }
                        else if (item.type === "OBSERVATION" && typeof FeedCard_Observation !== 'undefined') {
                            cardHtml = FeedCard_Observation.render(item);
                        }
                        else if (item.type === "PROGRESS" && typeof FeedCard_Progress !== 'undefined') {
                            cardHtml = FeedCard_Progress.render(item);
                        }
                        else if (item.type === "INSIGHT" && typeof FeedCard_Insight !== 'undefined') {
                            cardHtml = FeedCard_Insight.render(item);
                        }
                       
                        feedHtml += cardHtml;
                    } catch (err) {
                        console.error(`Error rendering card [${item.id}]:`, err);
                        // We skip the broken card but continue the loop!
                    }
                });
                // 5. Inject Content
                c.innerHTML = feedHtml;
            } else {
                c.innerHTML = `<div class="text-center py-10 text-red-400">${TXT.CORE.ERROR_NETWORK}<br><span class="text-xs">${res.message}</span></div>`;
            }
        } catch (e) {
            console.error("FeedView Fatal Error:", e);
            c.innerHTML = `<div class="text-center py-10 text-red-400">${TXT.CORE.ERROR_NETWORK}</div>`;
        }
    }
};
