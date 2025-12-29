const CONFIG = {
    // *** 2.3.2 ***
    API_URL: "https://script.google.com/macros/s/AKfycbyMr4jkVPQBFOEK_IBVI83MCwRVZqqnYbv-CoSQTD_k9eeMItDstQaU0WBYIvvzbXV3/exec",
    DOMAINS: { "CL":"Communication", "PSE":"Social", "PD":"Physical", "LIT":"Literacy", "NUM":"Numeracy", "UW":"World", "EAD":"Art" }
};
const STATE = { user: { id: localStorage.getItem('bb_uid'), role: localStorage.getItem('bb_role') }, child: null, library: [], feed: [], selectedObjectives: [], reviewActivityId: null, logRating: null };
