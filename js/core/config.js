const CONFIG = {
    // *** 2.5 V12 TEST ***
    API_URL: "https://script.google.com/macros/s/AKfycbzfiM_ZIleR1WxbZhmnjs4FEzLPdNEyfT-FQV99UdOuhGtFUeJySnkD-dnSALgbEBTS/exec",
    DOMAINS: { "CL":"Communication", "PSE":"Social", "PD":"Physical", "LIT":"Literacy", "NUM":"Numeracy", "UW":"World", "EAD":"Art" }
};
const STATE = { user: { id: localStorage.getItem('bb_uid'), role: localStorage.getItem('bb_role') }, child: null, library: [], feed: [], selectedObjectives: [], reviewActivityId: null, logRating: null };
