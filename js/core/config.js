const CONFIG = {
    // *** 2.3.1 ***
    API_URL: "https://script.google.com/macros/s/AKfycbxmD4dkr7M2wQDi2DqJ7X1RvLGk4EYt-GYvJY3KR1WqKsnM6yMMwPIlcffwhAC0QmA/exec",
    DOMAINS: { "CL":"Communication", "PSE":"Social", "PD":"Physical", "LIT":"Literacy", "NUM":"Numeracy", "UW":"World", "EAD":"Art" }
};
const STATE = { user: { id: localStorage.getItem('bb_uid'), role: localStorage.getItem('bb_role') }, child: null, library: [], feed: [], selectedObjectives: [], reviewActivityId: null, logRating: null };
