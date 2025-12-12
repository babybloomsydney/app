/**
 * UTILITIES
 * Data formatting, Grouping, and Math.
 */

const Utils = {
    // Group Library by Domain -> Age Bracket (For Accordion)
    groupLibrary: (library) => {
        const grouped = {};
        library.forEach(m => {
            // Robust Grouping: Use Config Value if key matches, else use raw domain string
            // This handles cases where m.domain is "CL" OR "Communication & Language"
            let key = m.domain;
            
            // Try to normalize to the Short Code if possible, based on ID
            if(m.id) {
                const prefix = m.id.split('-')[0];
                if(CONFIG.DOMAINS[prefix]) key = prefix;
            }

            if (!grouped[key]) grouped[key] = {};
            if (!grouped[key][m.age]) grouped[key][m.age] = [];
            grouped[key][m.age].push(m);
        });
        return grouped;
    },

    // Filter library based on domain code (For Log Modal)
    filterLibraryByDomain: (domainCode) => {
        return STATE.library.filter(m => {
            // Match against Code (CL) or Full Name (Communication...) or ID Prefix
            const prefix = m.id.split('-')[0];
            return m.domain === domainCode || prefix === domainCode || CONFIG.DOMAINS[prefix] === domainCode;
        });
    },

    // Convert ISO Date to Readable format
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

    // FIXED: Robust Domain Name Lookup
    // This fixes the "undefined" issue in the Feed
    getMilestoneDomain: (id) => {
        if (!id) return "General";
        
        // 1. Priority: Look up via ID Prefix (e.g. "CL" from "CL-03-A")
        // This is the safest method as IDs are standardized.
        const prefix = id.split('-')[0];
        if (CONFIG.DOMAINS[prefix]) {
            return CONFIG.DOMAINS[prefix];
        }

        // 2. Fallback: Look up via Library Object
        const m = STATE.library.find(x => x.id === id);
        if (m) {
            // If the domain is a Key (CL), return Value.
            if (CONFIG.DOMAINS[m.domain]) return CONFIG.DOMAINS[m.domain];
            // If the domain is already a Full Name, return it.
            return m.domain;
        }

        return prefix || "Unknown";
    },

    // Convert Score Number (1-4) to Text Label
    getScoreLabel: (n) => {
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
