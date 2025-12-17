const CONFIG = {
    // *** 2.2.1 ***
    API_URL: "https://script.google.com/macros/s/AKfycbz-TBEBEurXzGlEbIHM1cbb23bTZJ1QyF9lNNt9mB6xISNSyckmoS_zUoZZsXJYQKbV/exec",
    DOMAINS: { "CL":"Communication", "PSE":"Social", "PD":"Physical", "LIT":"Literacy", "NUM":"Numeracy", "UW":"World", "EAD":"Art" }
};
const STATE = { user: { id: localStorage.getItem('bb_uid'), role: localStorage.getItem('bb_role') }, child: null, library: [], feed: [], selectedObjectives: [], reviewActivityId: null, logRating: null };
