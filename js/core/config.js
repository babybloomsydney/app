const CONFIG = {
    // *** 2.4.1 ***
    API_URL: "https://script.google.com/macros/s/AKfycbz0qAgvGeBMOyfNfKe7elc23GvE-D5bs4b7wHjBVhe4BU7_nwpLtFrVyJd335_aIfLE/exec",
    DOMAINS: { "CL":"Communication", "PSE":"Social", "PD":"Physical", "LIT":"Literacy", "NUM":"Numeracy", "UW":"World", "EAD":"Art" }
};
const STATE = { user: { id: localStorage.getItem('bb_uid'), role: localStorage.getItem('bb_role') }, child: null, library: [], feed: [], selectedObjectives: [], reviewActivityId: null, logRating: null };
