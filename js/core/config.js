const CONFIG = {
    // *** 2.5.1.3 ***
    API_URL: "https://script.google.com/macros/s/AKfycbxqntwEMtWFwjsfoSYkbrPJh_JefF2215OB6cvGAIygx-fuNF08r2x4G2uE12iLMluH/exec",
    DOMAINS: { "CL":"Communication", "PSE":"Social", "PD":"Physical", "LIT":"Literacy", "NUM":"Numeracy", "UW":"World", "EAD":"Art" }
};
const STATE = { user: { id: localStorage.getItem('bb_uid'), role: localStorage.getItem('bb_role') }, child: null, library: [], feed: [], selectedObjectives: [], reviewActivityId: null, logRating: null };
