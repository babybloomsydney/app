/**
 * UTILITIES
 * Data formatting, Grouping, and Math.
 * Dependency: js/core/labels.js (TXT)
 */

const Utils = {
    // Group Library by Domain -> Age Bracket (For Accordion)
    groupLibrary: (library) => {
        const grouped = {};
        library.forEach(m => {
            let key = m.domain;
            
            // Normalize key using ID prefix if available (e.g. CL-03 -> CL)
            if(m.id && m.id.includes('-')) {
                const prefix = m.id.split('-')[0].trim();
                // Only use prefix if it maps to a real domain name in Config
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
            const prefix = m.id.split('-')[0].trim();
            // Check direct match or prefix match
            return m.domain === domainCode || prefix === domainCode;
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
        return m ? m.desc : (id || TXT.CORE.UNKNOWN_SKILL);
    },

    // FIXED: Robust Domain Name Lookup
    // Prevents "undefined" by safely checking prefix, config, and library object
    getMilestoneDomain: (id) => {
        if (!id) return TXT.CORE.UNKNOWN_DOMAIN; // "General"
        
        // 1. Priority: Look up via ID Prefix (e.g. "CL" from "CL-03-A")
        const parts = id.split('-');
        const prefix = parts[0].trim(); 
        
        if (CONFIG.DOMAINS && CONFIG.DOMAINS[prefix]) {
            return CONFIG.DOMAINS[prefix];
        }

        // 2. Fallback: Look up via Library Object
        const m = STATE.library.find(x => x.id === id);
        if (m) {
            // If m.domain is a short code (CL), lookup in Config.
            if (CONFIG.DOMAINS && CONFIG.DOMAINS[m.domain]) return CONFIG.DOMAINS[m.domain];
            // Otherwise return the full string stored in library (e.g. "Physical Development")
            return m.domain;
        }

        // 3. Last Resort
        return prefix || "Unknown";
    },

    // Convert Score Number (1-4) to Text Label using TXT reference
    getScoreLabel: (n) => {
        // TXT.CORE.SCORES = {0: "Unattempted", 1: "Introduced", ...}
        const idx = parseInt(n);
        if (isNaN(idx)) return "";
        return TXT.CORE.SCORES[idx] || "";
    },

    // Prepare Radar Chart Data
    prepChartData: (stats) => {
        const labels = Object.keys(CONFIG.DOMAINS).map(k => k); // Short codes for chart
        const data = Object.keys(CONFIG.DOMAINS).map(k => stats[k]?.percent || 0);
        return { labels, data };
    }
};
