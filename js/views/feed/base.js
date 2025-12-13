/**
 * FEED VIEW CONTROLLER
 * Aggregates all specific card renderers.
 * Features: Client-side filtering (Instant) & Context Logic.
 * Dependency: js/core/labels.js (TXT)
 */

const FeedView = {
    currentFilter: 'All',

    // Main Entry Point
    // forceRefresh = true: Calls Google API (Slow)
    // forceRefresh = false: Uses local STATE.feed (Instant)
    render: async (forceRefresh = true) => {
        const c = document.getElementById('feedContainer');
        if (!c) return;

        // 1. Fetch Data (Only if forced or empty)
        if (forceRefresh || !STATE.feed || STATE.feed.length === 0) {
            c.innerHTML = `<div class="text-center py-10 text-gray-400"><i class="fa-solid fa-circle-notch fa-spin text-2xl"></i><p class="text-xs mt-2">${TXT.VIEWS.FEED.LOADING}</p></div>`;
            
            const res = await API.fetchFeed(STATE.child.childId);
            
            if (res.status === "success") {
                STATE.feed = res.data;
            } else {
                c.innerHTML = `<div class="text-center py-10 text-red-400">${TXT.CORE.ERROR_NETWORK}</div>`;
                return;
            }
        }

        // 2. Apply Filters (Client-Side)
        const filteredData = FeedView.applyFilterLogic(STATE.feed);
        
        // 3. Update UI
        FeedView.updateFilterUI();
        c.innerHTML = "";

        if (filteredData.length === 0) {
            c.innerHTML = `<div class="text-center py-10 text-gray-400">${TXT.VIEWS.FEED.EMPTY}</div>`;
            return;
        }

        // 4. Render Tiles
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
    },

    // Logic to decide what shows up in each tab
    applyFilterLogic: (data) => {
        const mode = FeedView.currentFilter;
        
        return data.filter(item => {
            // Tab: ALL (The curated story)
            if (mode === 'All') {
                // 1. Always show major events
                if (item.type === 'ACTIVITY' || item.type === 'REPORT' || item.type === 'INSIGHT') return true;
                
                // 2. Filter Observations
                // Show if ADHOC (or missing context). HIDE if part of Activity or Assessment.
                if (item.type === 'OBSERVATION') {
                    if (item.context === 'ACTIVITY') return false;   // Hidden (Shown in Report)
                    if (item.context === 'ASSESSMENT') return false; // Hidden (Shown in Progress Card)
                    return true; // Show Adhoc & Legacy
                }
                
                // 3. Filter Progress
                // Show if ASSESSMENT (or missing context). HIDE if part of Activity.
                if (item.type === 'PROGRESS') {
                    if (item.context === 'ACTIVITY') return false; // Hidden (Shown in Report)
                    return true; // Show Manual Assessments & Legacy
                }
                
                return false; // Hide anything else
            }

            // Tab: OBS (Diary View) -> Show ALL observations regardless of context
            if (mode === 'Obs') return item.type === 'OBSERVATION';

            // Tab: GROWTH (Data View) -> Show ALL progress updates
            if (mode === 'Growth') return item.type === 'PROGRESS';

            // Tab: INSIGHTS
            if (mode === 'Insight') return item.type === 'INSIGHT';
            
            return false; // Fallback: hide if filter unknown
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
            // Check if this button matches current filter
            // Robust match from onclick attribute string
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
