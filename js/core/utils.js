/**
 * UTILITIES
 * Data formatting, Grouping, and Math.
 */

const Utils = {
    // Group Library by Domain -> Age Bracket (For Accordion)
    groupLibrary: (library) => {
        const grouped = {};
        library.forEach(m => {
            if (!grouped[m.domain]) grouped[m.domain] = {};
            if (!grouped[m.domain][m.age]) grouped[m.domain][m.age] = [];
            grouped[m.domain][m.age].push(m);
        });
        return grouped;
    },

    // Filter library based on domain code (For Log Modal)
    filterLibraryByDomain: (domainCode) => {
        return STATE.library.filter(m => m.domain === domainCode);
    },

    // Convert ISO Date to Readable format (e.g. "Oct 12")
    formatDate: (isoString) => {
        if (!isoString) return "";
        const d = new Date(isoString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },

    // Find a milestone description by ID
    getMilestoneDesc: (id) => {
        const m = STATE.library.find(x => x.id === id);
        return m ? m.desc : id;
    },

    // NEW: Find a milestone's Domain Name by ID (For Progress Cards)
    getMilestoneDomain: (id) => {
        const m = STATE.library.find(x => x.id === id);
        return m ? CONFIG.DOMAINS[m.domain] : m.domain;
    },

    // NEW: Convert Score Number (1-4) to Text Label (For Feed & Report)
    getScoreLabel: (n) => {
        // 0=Unattempted, 1=Introduced, 2=Assisted, 3=Guided, 4=Independent
        const labels = ["Unattempted", "Introduced", "Assisted", "Guided", "Independent"];
        return labels[n] || "Unknown";
    },

    // Prepare Radar Chart Data
    prepChartData: (stats) => {
        const labels = Object.keys(CONFIG.DOMAINS).map(k => k); // Short codes for chart
        const data = Object.keys(CONFIG.DOMAINS).map(k => stats[k]?.percent || 0);
        return { labels, data };
    }
};
