/**
 * API SERVICE
 * Handles network requests.
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
    // --- READERS (Unchanged) ---
    fetchChildren: async () => sendRequest({ action: "getUserChildren", userId: STATE.user.id, userType: STATE.user.role }),
    fetchLibrary: async () => STATE.library.length > 0 ? { status: "success", data: STATE.library } : sendRequest({ action: "getMilestoneLibrary" }),
    fetchFeed: async (childId) => sendRequest({ action: "getFeed", childId }),
    fetchStats: async (childId) => sendRequest({ action: "getDashboardData", childId }),
    fetchProgress: async (childId) => sendRequest({ action: "getChildProgress", childId }),
    fetchHistory: async (childId) => sendRequest({ action: "getChildHistory", childId }),

    // --- WRITERS (Updated) ---
    generatePlan: async (childId, objectives) => {
        return await sendRequest({
            action: "generateActivity",
            childId, objectives, authorId: STATE.user.id
        });
    },

    submitReport: async (childId, activityId, ratings, note, imageUrl) => {
        return await sendRequest({
            action: "submitActivityReport",
            childId, activityId, ratings, feedback: note, 
            authorId: STATE.user.id,
            imageUrl: imageUrl, 
            refs: [activityId]
        });
    },

    logObservation: async (childId, domain, milestoneId, score, note, imageUrl) => {
        return await sendRequest({
            action: "logAdHocObservation",
            childId, domain, milestoneId, score, note, 
            imageUrl: imageUrl, 
            authorId: STATE.user.id
        });
    },
   
    logBulkUpdate: async (childId, updates, note, imageUrl) => {
        return await sendRequest({
            action: "logBulkProgress",
            childId, updates, note: note, 
            imageUrl: imageUrl, 
            authorId: STATE.user.id
        });
    }
};
