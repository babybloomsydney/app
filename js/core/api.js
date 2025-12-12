/**
 * API SERVICE
 * Handles network requests. No UI logic.
 */
async function sendRequest(payload) {
    try {
        const response = await fetch(CONFIG.API_URL, {
            redirect: "follow",
            method: 'POST',
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
        });
        const json = await response.json();
        return json;
    } catch (e) {
        console.error("Network Error:", e);
        return { status: "error", message: "Connection failed. Please check internet." };
    }
}
const API = {
    // --- READERS ---
    fetchChildren: async () => {
        return await sendRequest({
            action: "getUserChildren",
            userId: STATE.user.id,
            userType: STATE.user.role
        });
    },
    fetchLibrary: async () => {
        // Check cache first
        if (STATE.library.length > 0) return { status: "success", data: STATE.library };
        // Fallback to server if static file failed or empty
        return await sendRequest({ action: "getMilestoneLibrary" });
    },
    fetchFeed: async (childId) => {
        return await sendRequest({ action: "getFeed", childId });
    },
    fetchStats: async (childId) => {
        return await sendRequest({ action: "getDashboardData", childId });
    },
   
    // NEW: Needed for Assessment View
    fetchProgress: async (childId) => {
        return await sendRequest({ action: "getChildProgress", childId });
    },
    // --- WRITERS ---
    generatePlan: async (childId, objectives) => {
        return await sendRequest({
            action: "generateActivity",
            childId,
            objectives,
            authorId: STATE.user.id
        });
    },
    submitReport: async (childId, activityId, ratings, note) => {
        return await sendRequest({
            action: "submitActivityReport",
            childId,
            activityId,
            ratings,
            feedback: note,
            authorId: STATE.user.id,
            refs: [activityId]  // ← ADD THIS LINE TO FIX refs NULL
        });
    },
    logObservation: async (childId, domain, milestoneId, score, note) => {
        return await sendRequest({
            action: "logAdHocObservation",
            childId,
            domain,
            milestoneId,
            score,
            note,
            authorId: STATE.user.id
        });
    },
   
    // NEW: Needed for Progress Wizard
    logBulkUpdate: async (childId, updates, note) => {
        return await sendRequest({
            action: "logBulkProgress",
            childId,
            updates,
            note: note,
            authorId: STATE.user.id
        });
    }
};
