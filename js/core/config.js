const CONFIG = {
    // *** PASTE YOUR NEW GAS URL HERE ***
    API_URL: "https://script.google.com/macros/s/AKfycbw0H8S3seDEU70qEujjXex0aDs82mswr2GPr2_pXa1oEVD8WDPqbsvM-pGr69Xink6H/exec",
    DOMAINS: { "CL":"Communication", "PSE":"Social", "PD":"Physical", "LIT":"Literacy", "NUM":"Numeracy", "UW":"World", "EAD":"Art" }
};
const STATE = { user: { id: localStorage.getItem('bb_uid'), role: localStorage.getItem('bb_role') }, child: null, library: [], feed: [], selectedObjectives: [], reviewActivityId: null, logRating: null };
