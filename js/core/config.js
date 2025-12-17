const CONFIG = {
    // *** 2.2.2 ***
    API_URL: "https://script.google.com/macros/s/AKfycbxmHGPsmzZtde1Cz31i_cfBf75ml2Bd7Vqw34luXBzvZvst5f3FkLx5czycf3zOAdA/exec",
    DOMAINS: { "CL":"Communication", "PSE":"Social", "PD":"Physical", "LIT":"Literacy", "NUM":"Numeracy", "UW":"World", "EAD":"Art" }
};
const STATE = { user: { id: localStorage.getItem('bb_uid'), role: localStorage.getItem('bb_role') }, child: null, library: [], feed: [], selectedObjectives: [], reviewActivityId: null, logRating: null };