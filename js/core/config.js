const CONFIG = {
    // *** PASTE YOUR NEW GAS URL HERE ***
    API_URL: "https://script.google.com/macros/s/AKfycby4F1fmLvB16R46Jfp5AHhzApBmg43DPL404n99d8UmsLb-PDJ_eXAdO2J6y24Nrdh9/exec",
    DOMAINS: { "CL":"Communication", "PSE":"Social", "PD":"Physical", "LIT":"Literacy", "NUM":"Numeracy", "UW":"World", "EAD":"Art" }
};
const STATE = { user: { id: localStorage.getItem('bb_uid'), role: localStorage.getItem('bb_role') }, child: null, library: [], feed: [], selectedObjectives: [], reviewActivityId: null, logRating: null };
