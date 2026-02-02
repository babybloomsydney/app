const CONFIG = {
    // *** 2.5.1 ***
    API_URL: "https://script.google.com/macros/s/AKfycbwufnWnYy4M-PtkjIxRmwbvkFz_RJ31dC1tnrQoRXT4H_wSDjR-dRqy0RD8bXrkG_7U/exec",
    DOMAINS: { "CL":"Communication", "PSE":"Social", "PD":"Physical", "LIT":"Literacy", "NUM":"Numeracy", "UW":"World", "EAD":"Art" }
};
const STATE = { user: { id: localStorage.getItem('bb_uid'), role: localStorage.getItem('bb_role') }, child: null, library: [], feed: [], selectedObjectives: [], reviewActivityId: null, logRating: null };
