/**
 * FEED VIEW CONTROLLER
 * Aggregates all specific card renderers.
 * Features: Client-side filtering (Instant), Context Logic & Smart Polling.
 * Dependency: js/core/labels.js (TXT)
 */

const FeedView = {
    currentFilter: 'All',
    pollTimer: null, // NEW: Tracks the active timer

    // Main Entry Point
    // forceRefresh: Calls API to get fresh data
    // silent: If true, hides the loading spinner (used for background updates)
    render: async (forceRefresh = true, silent = false) => {
        
        // 1. Clear previous timer to prevent duplicates
        if (FeedView.pollTimer) {
            clearTimeout(FeedView.pollTimer);
            FeedView.pollTimer = null;
        }

        const c = document.getElementById('feedContainer');
        if (!c) return;

        // 2. Fetch Data (Only if forced or empty)
        if (forceRefresh || !STATE.feed || STATE.feed.length === 0) {
            // Only show spinner if this isn't a "silent" background poll
            if (!silent) {
                c.innerHTML = `<div class="text-center py-10 text-gray-400"><i class="fa-solid fa-circle-notch fa-spin text-2xl"></i><p class="text-xs mt-2">${TXT.VIEWS.FEED.LOADING}</p></div>`;
            }
            
            const res = await API.fetchFeed(STATE.child.childId);
            
            if (res.status === "success") {
                STATE.feed = res.data;
            } else {
                if (!silent) c.innerHTML = `<div class="text-center py-10 text-red-400">${TXT.CORE.ERROR_NETWORK}</div>`;
                return;
            }
        }

        // 3. Apply Filters (Client-Side)
        const filteredData = FeedView.applyFilterLogic(STATE.feed);
        
        // 4. Update UI
        FeedView.updateFilterUI();
        
        // Don't wipe content if silent refresh and no data change (optional optimization), 
        // but here we rebuild to be safe.
        c.innerHTML = "";

        if (filteredData.length === 0) {
            c.innerHTML = `<div class="text-center py-10 text-gray-400">${TXT.VIEWS.FEED.EMPTY}</div>`;
            // Even if empty, we might need to poll if there are pending items hidden by filter
        }

        // 5. Render Tiles
        let html = "";
        filteredData.forEach(item => {
            try {
                if (item.type === "ACTIVITY" && typeof FeedCard_Activity !== 'undefined') html += FeedCard_Activity.render(item);
                else if (item.type === "REPORT" && typeof FeedCard_Report !== 'undefined') html += FeedCard_Report.render(item);
                else if (item.type === "OBSERVATION" && typeof FeedCard_Observation !== 'undefined') html += FeedCard_Observation.render(item);
                else if (item.type === "PROGRESS" && typeof FeedCard_Progress !== 'undefined') html += FeedCard_Progress.render(item);
                else if (item.type === "INSIGHT" && typeof FeedCard_Insight !== 'undefined') html += FeedCard_Insight.render(item);
            } catch (e) {
                console.error("Render Error:", e);
            }
        });
        
        c.innerHTML = html;

        // 6. SMART POLLING (NEW)
        // Check if ANY item in the feed (even hidden ones) is still 'PENDING'
        const hasPendingItems = STATE.feed.some(item => item.status === 'PENDING');
        
        if (hasPendingItems) {
            console.log("Feed has pending items... scheduling refresh in 10s.");
            FeedView.pollTimer = setTimeout(() => {
                // Recursive call: force refresh, but do it silently
                FeedView.render(true, true); 
            }, 10000); // 10 Seconds
        }
    },

    // Logic to decide what shows up in each tab
    applyFilterLogic: (data) => {
        const mode = FeedView.currentFilter;
        
        return data.filter(item => {

            // Tab: ALL (The curated story)
            if (mode === 'All') {
                if (item.type === 'ACTIVITY' || item.type === 'REPORT' || item.type === 'INSIGHT') return true;
                
                // Hide child logs
                if (item.type === 'OBSERVATION') {
                    if (item.context === 'ACTIVITY') return false;   
                    if (item.context === 'ASSESSMENT') return false; 
                    return true; 
                }
                
                // Keep 'All' clean: Hide PROGRESS logs if they are just side-effects of Activities
                if (item.type === 'PROGRESS') {
                    if (item.context === 'ACTIVITY') return false;
                    return true;
                }

                return false;
            }

            // Tab: ACTIVITIES (New)
            if (mode === 'Activities') {
                return item.type === 'ACTIVITY' || item.type === 'REPORT';
            }

            // Tab: OBS
            if (mode === 'Obs') return item.type === 'OBSERVATION';

            // Tab: GROWTH (Updated: show all PROGRESS items regardless of context)
            if (mode === 'Growth') {
                return item.type === 'PROGRESS';
            }

            // Tab: INSIGHTS
            if (mode === 'Insight') return item.type === 'INSIGHT';
            
            return false;
        });
    },

    // User Click Handler (Instant)
    filter: (type) => {
        FeedView.currentFilter = type;
        FeedView.render(false); // False = Do not call API, just re-sort
    },

    // Visual updates for the pills
    updateFilterUI: () => {
        document.querySelectorAll('.filter-pill').forEach(btn => {
            const match = btn.getAttribute('onclick').match(/'([^']+)'/);
            const type = match ? match[1] : "";

            if (type === FeedView.currentFilter) {
                btn.className = "filter-pill active bg-slate-800 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md transition whitespace-nowrap ring-1 ring-slate-800";
            } else {
                btn.className = "filter-pill bg-white text-slate-500 border border-slate-200 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition whitespace-nowrap hover:bg-slate-50";
            }
        });
    }
};
