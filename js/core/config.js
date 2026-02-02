const CONFIG = {
    // *** 2.5.1.2 ***
    API_URL: "https://script.google.com/macros/s/AKfycbyvj7KS3RBDIuIgkMNgGUcQ3Wq_39Jzy-TaUUG79SsraxUtP6ccLO0DEwlG2JK4dBA-/exec",
    DOMAINS: { "CL":"Communication", "PSE":"Social", "PD":"Physical", "LIT":"Literacy", "NUM":"Numeracy", "UW":"World", "EAD":"Art" }
};
const STATE = { user: { id: localStorage.getItem('bb_uid'), role: localStorage.getItem('bb_role') }, child: null, library: [], feed: [], selectedObjectives: [], reviewActivityId: null, logRating: null };
