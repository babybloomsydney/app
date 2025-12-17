const CONFIG = {
    // *** 2.2.3 ***
    API_URL: "https://script.google.com/macros/s/AKfycbxZCURdbhB4DgCukvSg_scs8ftDmYzgOc1axA-dEWiIsVmqkjWwAKlBbYYOXRKt7zk-/exec",
    DOMAINS: { "CL":"Communication", "PSE":"Social", "PD":"Physical", "LIT":"Literacy", "NUM":"Numeracy", "UW":"World", "EAD":"Art" }
};
const STATE = { user: { id: localStorage.getItem('bb_uid'), role: localStorage.getItem('bb_role') }, child: null, library: [], feed: [], selectedObjectives: [], reviewActivityId: null, logRating: null };
