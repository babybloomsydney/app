const CONFIG = {
    // *** 2.5.1.5 ***
    API_URL: "https://script.google.com/macros/s/AKfycbziPv3KDlu19qJZCV-tvBoE4mV7DcdIp2CfVmH-G63nVPphvpIXQVD6hmzqKP0roa4a/exec",
    DOMAINS: { "CL":"Communication", "PSE":"Social", "PD":"Physical", "LIT":"Literacy", "NUM":"Numeracy", "UW":"World", "EAD":"Art" }
};
const STATE = { user: { id: localStorage.getItem('bb_uid'), role: localStorage.getItem('bb_role') }, child: null, library: [], feed: [], selectedObjectives: [], reviewActivityId: null, logRating: null };
